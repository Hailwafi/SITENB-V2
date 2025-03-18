<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Publik;
use App\Models\User;
use App\Mail\TicketCode;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\PublikResource;
use Illuminate\Support\Facades\Validator;
use App\Notifications\TicketAssignedNotification;
use App\Notifications\NewTicketNotification;
use Illuminate\Support\Facades\Notification;

class PublikController extends Controller
{
    // public function index()
    // {
    //     //get ticket publik
    //     $publiks = Publik::when(request()->search, function($publiks)
    //     {
    //     $publiks = $publiks->where('name', 'like', '%'. request()->search . '%');
    //     })->latest()->paginate(5);

    //     //append query string to pagination links
    //     $publiks->appends(['search' => request()->search]);

    //     //return with Api Resource
    //     return new PublikResource(true, 'List data Ticket Publik', $publiks);
    // }

    public function index()
    {
            $publiks = Publik::when(request()->search, function($publiks)
            {
                $publiks->where('name', 'like', '%' . request()->search . '%');
            })->latest()->paginate(10);

        // Append query string ke pagination links
            $publiks->appends(['search' => request()->search]);

        return new PublikResource(true, 'List data Ticket Publik', $publiks);
}

    public function store(Request $request)
    {
        // Validasi request
        $validator = Validator::make($request->all(), [
            'nama_lengkap'        => 'required|string|max:25',
            'kategori'            => 'required|string',
            'sub_kategori'        => 'required|string',
            'email'               => ['required', 'email', function ($attribute, $value, $fail)
                                        {
                                        if (!str_ends_with($value, '@gmail.com'))
                                        {
                                            $fail('Email harus menggunakan domain @gmail.com.');
                                        }
                                        }],
            'jenis_tiket'         => 'required|string|in:kendala',
            'deskripsi'           => 'required|string|max:255',
            'unggah_file'         => 'nullable|file|mimes:jpg,png,pdf|max:5242880',
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Simpan unggah file jika ada
        $unggah_file_path = null;
        $unggah_file_url = null;
        if ($request->hasFile('unggah_file'))
        {
            $unggah_file = $request->file('unggah_file');
            $unggah_file_path = $unggah_file->store('ticket_images', 'public');

        // Dapatkan URL publik dari file yang disimpan
            $unggah_file_url = Storage::url($unggah_file_path);
        }

        // Generate kode tiket unik (contoh: 6 digit angka)
        $kode_tiket = mt_rand(100000, 999999);
        $token_tiket = mt_rand(10000000, 99999999);

        // Buat tiket pegawai
        $publik = Publik::create([
            'nama_lengkap'        => $request->nama_lengkap,
            'kategori'            => $request->kategori,
            'sub_kategori'        => $request->sub_kategori,
            'email'               => $request->email,
            'jenis_tiket'         => $request->jenis_tiket,
            'deskripsi'           => $request->deskripsi,
            'unggah_file'         => $unggah_file_path,
            'status'                =>'open',
            'kode_tiket'          => $kode_tiket,
            'token_tiket'         => $token_tiket,
        ]);

        if ($publik)
        {
            // Dapatkan user admin dan kepala subbag
            $adminAndkepala_subbagUsers = User::whereIn('role', ['admin', 'kepala_subbag'])->get();

            // Kirim notifikasi ke admin dan kepala subbag
            Notification::send($adminAndkepala_subbagUsers, new NewTicketNotification($publik));

            // Kirim email kode tiket ke pengguna
            Mail::to($publik->email)->send(new TicketCode($publik,true));

            return new PublikResource(true, 'Berhasil membuat Ticket Publik',
            [
                'publik'          => $publik,
                'unggah_file_url' => $unggah_file_url,
        ]);}

        return new PublikResource(false, 'Gagal membuat Ticket Publik!', null);
    }

    public function show(Publik $publik)
    {
        return new PublikResource(true, 'Detail Tiket Publik', $publik);
    }

    public function update(Request $request, $id)
    {
        // Validasi request
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:25',
            'kategori'     => 'required|string',
            'sub_kategori' => 'required|string',
            'email'               => ['required', 'email', function ($attribute, $value, $fail)
                                        {
                                        if (!str_ends_with($value, '@gmail.com'))
                                        {
                                            $fail('Email harus menggunakan domain @gmail.com.');
                                        }
                                        }],
            'jenis_tiket'  => 'required|string|in:kendala',
            'deskripsi'    => 'required|string|max:255',
            'unggah_file'  => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        $publik = Publik::find($id);

        // Jika ada file yang diunggah
        if ($request->hasFile('unggah_file'))
        {
            $unggah_file = $request->file('unggah_file');
            $unggah_file->storeAs('public/publik', $unggah_file->hashName());

        Storage::delete('public/publik/'.basename($publik->$publik));

            $publik->update([
                'nama_lengkap'              => $request->nama_lengkap,
                'kategori'                  => $request->kategori,
                'sub_kategori'              => $request->sub_kategori,
                'email'                     => $request->email,
                'jenis_tiket'               => $request->jenis_tiket,
                'deskripsi'                 => $request->deskripsi,
                'unggah_file'               => $unggah_file->hashName(),
            ]);

        } else {
            $publik->update([
                'nama_lengkap'              => $request->nama_lengkap,
                'kategori'                  => $request->kategori,
                'sub_kategori'              => $request->sub_kategori,
                'email'                     => $request->email,
                'jenis_tiket'               => $request->jenis_tiket,
                'deskripsi'                 => $request->deskripsi,
            ]);
        }

        // Kembalikan response sukses
        return new PublikResource(true, 'Berhasil di Update', $publik);
    }


    public function destroy(Publik $publik)
    {
        {
            if($publik->delete())
            {
                //return success with Api Resource
                return new PublikResource(true, 'Ticket Publik berhasil dihapus', null);
            }

                //return failed with Api Resource
                return new PublikResource(false, 'Ticket Publik gagal dihapus!', null);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:proses,selesai,close',
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Cari tiket publik berdasarkan ID
        $publik = Publik::findOrFail($id);

        // Perbarui status tiket publik
        $publik->status = $request->status;
        $publik->save();

        return new PublikResource(true, 'Status Tiket Publik berhasil diubah.', $publik);
    }

    public function assignPublik(Request $request, $id)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'assigned_to' => 'required|exists:users,id', // Pastikan assigned_to valid
            'prioritas'   => 'required|in:rendah,normal,tinggi', // Validasi prioritas
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Cari tiket berdasarkan ID
        $publik = Publik::findOrFail($id);

        // Update tiket dengan staf yang ditugaskan
        $publik->assigned_to = $request->assigned_to;
        $publik->prioritas = $request->prioritas; // Menambahkan prioritas tiket

        // Ubah status tiket menjadi 'proses'
        $publik->status = 'proses'; // Mengubah status menjadi 'proses' saat ditugaskan ke staf
        $publik->save();

        // Cari staf yang ditugaskan
        $staf = User::findOrFail($request->assigned_to);

        // Kirim notifikasi ke staf yang ditugaskan
        $staf->notify(new TicketAssignedNotification($publik, 'pegawai'));  // 'pegawai' untuk tipe tiket pegawai

        return response()->json([
            'message'     => 'Tiket berhasil ditugaskan kepada Staff dengan prioritas ' . $request->prioritas . '.',
            'assigned_to' => $staf->username, // Menyertakan nama staf yang ditugaskan
            'prioritas'   => $publik->prioritas, // Menyertakan prioritas tiket
        ], 200);
    }

    public function getNewPublikPubliks(Request $request)
    {
        // Ambil semua tiket publik dan tambahkan URL unggah file jika ada
            $publikTickets = Publik::all()->map(function ($ticket)
        {
            // Cek apakah tiket memiliki file yang diunggah
                $fileUrl = $ticket->unggah_file ? Storage::url($ticket->unggah_file) : null;

            return [
                'nama_lengkap'    => $ticket->nama_lengkap,
                'email'           => $ticket->email,
                'kategori'        => $ticket->kategori,
                'jenis_tiket'     => $ticket->jenis_tiket,
                'status'          => $ticket->status,
                'unggah_file_url' => $fileUrl, // Tambahkan URL unggah file
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Semua tiket publik berhasil ditemukan.',
            'data'    => $publikTickets
        ]);
    }

    // public function downloadFilePublik($ticketpublikId)
    // {
    //         $publik = Publik::find($ticketpublikId);

    //     // Jika tiket tidak ditemukan atau file tidak ada, kirim respons error
    //         if (!$publik || !$publik->unggah_file)
    //         {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'File tidak ditemukan.',
    //             ], 404);
    //         }

    //         $filePath = $publik->unggah_file;

    //         if (!Storage::disk('public')->exists($filePath))
    //         {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'File tidak ditemukan di penyimpanan.',
    //             ], 404);
    //         }

    //     // Nama file dan tipe MIME untuk header respons
    //         $fileName = basename($filePath);
    //         $mimeType = Storage::disk('public')->mimeType($filePath);

    //     // Kirim respons unduhan file dari disk 'public'
    //         return response()->download(Storage::disk('public')->path($filePath), $fileName, ['Content-Type' => $mimeType]);
    // }


    public function downloadFilePublik(Request $request, $publikId)
    {
        $publik = Publik::find($publikId);

        if (!$publik || !$publik->unggah_file)
        {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan.',
            ], 404);
        }

        $filePath = $publik->unggah_file;

        if (!Storage::disk('public')->exists($filePath))
        {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan di penyimpanan.',
            ], 404);
        }

        $fileContent = Storage::disk('public')->get($filePath);
        $mimeType = Storage::disk('public')->mimeType($filePath);
        $fileName = basename($filePath);

        // Cek parameter download dari query string
            if ($request->query('download') === 'true')
            {
                return response($fileContent, 200)
                    ->header('Content-Type', $mimeType)
                    ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
            }

        // Default: tampilkan di tab baru
            return response($fileContent, 200)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline');
    }

    public function search(Request $request)
    {
        // Ambil inputan nama dan status
        $name = $request->input('name');
        $status = $request->input('status');

        // Validasi input nama atau status, setidaknya salah satu harus diisi
        if (!$name && !$status)
        {
            return response()->json(['message' => 'Nama atau status diperlukan untuk pencarian'], 422);
        }

        // Inisialisasi query untuk mencari tiket pegawai atau publik
        $query = Publik::select('nama_lengkap', 'email', 'kategori', 'jenis_tiket', 'prioritas', 'status', 'prioritas');

        // Jika ada input nama, tambahkan kondisi pencarian berdasarkan nama
        if ($name)
        {
            $query->where('nama_lengkap', 'LIKE', "%{$name}%");
        }

        // Jika ada input status, tambahkan kondisi pencarian berdasarkan status
        if ($status)
        {
            $query->where('status', 'LIKE', "%{$status}%");
        }

        // Dapatkan hasil query
        $publiks = $query->get();

        // Cek apakah tiket ditemukan
        if ($publiks->isEmpty())
        {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $publiks
     ], 200);
 }
}

