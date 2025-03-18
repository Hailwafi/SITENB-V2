<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Http\Resources\TicketResource;
use Illuminate\Support\Facades\Validator;
use App\Mail\TicketCode;
use Illuminate\Support\Facades\Mail;
use App\Notifications\TicketAssignedNotification;
use App\Notifications\NewTicketNotification;
use Illuminate\Support\Facades\Notification;

class TicketController extends Controller
{
    // public function index()
    // {
    //     //get ticket
    //     $tickets = Ticket::when(request()->search, function($tickets)
    //     {
    //     $tickets = $tickets->where('name', 'like', '%'. request()->search . '%');
    //     })->latest()->paginate(5);

    //     //append query string to pagination links
    //     $tickets->appends(['search' => request()->search]);

    //     //return with Api Resource
    //     return new TicketResource(true, 'List data Ticket Pegawai', $tickets);
    // }

//     public function index()
//     {
//         //get ticket
//         $tickets = Ticket::when(request()->search, function($tickets)
//         {
//         $tickets = $tickets->where('name', 'like', '%'. request()->search . '%');
//         })->latest()->paginate();

//         //append query string to pagination links
//         $tickets->appends(['search' => request()->search]);

//         //return with Api Resource
//         return new TicketResource(true, 'List data Ticket Pegawai', $tickets);
//  }


public function index()
    {
        // Get ticket pegawai dengan pagination 10 per halaman
            $tickets = Ticket::when(request()->search, function($tickets)
            {
                $tickets->where('name', 'like', '%' . request()->search . '%');
            })->latest()->paginate(2); // Set pagination ke 10 per halaman

        // Append query string ke pagination links
            $tickets->appends(['search' => request()->search]);

        return new TicketResource(true, 'List data Ticket Pegawai', $tickets);
}

    public function store(Request $request)
    {
        // Validasi request
        $validator = Validator::make($request->all(), [
            'nama_lengkap'        => 'required|string|max:25',
            'jabatan'             => 'required|string|max:15',
            'kategori'            => 'required|string',
            'sub_kategori'        => 'required|string',
            'email'               => ['required', 'email', function ($attribute, $value, $fail)
                                        {
                                            if (!str_ends_with($value, '@bnpt.go.id'))
                                            {
                                                $fail('Email harus menggunakan domain @bnpt.go.id.');
                                            }
                                        }],
            'nomor_induk_pegawai' => 'required|string:18',
            'jenis_tiket'         => 'required|string|in:permohonan,kendala',
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
        $ticket = Ticket::create([
            'nama_lengkap'        => $request->nama_lengkap,
            'jabatan'             => $request->jabatan,
            'kategori'            => $request->kategori,
            'sub_kategori'        => $request->sub_kategori,
            'email'               => $request->email,
            'nomor_induk_pegawai' => $request->nomor_induk_pegawai,
            'jenis_tiket'         => $request->jenis_tiket,
            'deskripsi'           => $request->deskripsi,
            'unggah_file'         => $unggah_file_path,
            'status'                =>'open',
            'kode_tiket'          => $kode_tiket,
            'token_tiket'         => $token_tiket,
        ]);

        if ($ticket)
        {
            // Dapatkan user admin dan kepala subbag
            $adminAndkepala_subbagUsers = User::whereIn('role', ['admin', 'kepala_subbag'])->get();

            // Kirim notifikasi ke admin dan kepala subbag
            // Notification::send($adminAndkepala_subbagUsers, new NewTicketNotification($ticket));

            // // Kirim email kode tiket ke pengguna
            // Mail::to($ticket->email)->send(new TicketCode($ticket));

// Kirim email kode tiket ke pengguna
dispatch(function () use ($ticket)
{
    Mail::to($ticket->email)->send(new TicketCode($ticket, true));
})->afterResponse();

            return new TicketResource(true, 'Berhasil membuat Ticket Pegawai',
            [
                'ticket'          => $ticket,
                'unggah_file_url' => $unggah_file_url,
            ]);}

        return new TicketResource(false, 'Gagal membuat Pegawai!', null);
    }

    public function show(Ticket $ticket)
    {
        return new TicketResource(true, 'Detail Tiket Pegawai', $ticket);
    }

    public function update(Request $request, $id)
    {
        // Validasi request
        $validator = Validator::make($request->all(), [
            'nama_lengkap'        => 'required|string|max:25',
            'jabatan'             => 'required|string|max:15',
            'kategori'            => 'required|string',
            'sub_kategori'        => 'required|string',
            'email'               => ['required', 'email', function ($attribute, $value, $fail)
                                        {
                                            if (!str_ends_with($value, '@bnpt.go.id'))
                                            {
                                                $fail('Email harus menggunakan domain @bnpt.go.id.');
                                            }
                                        }],
            'nomor_induk_pegawai' => 'required|string:18',
            'jenis_tiket'         => 'required|string|in:permohonan,kendala',
            'deskripsi'           => 'required|string|max:255',
            'unggah_file'         => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        $ticket = Ticket::find($id);

        // Jika ada file yang diunggah
        if ($request->hasFile('unggah_file'))
        {
            $unggah_file = $request->file('unggah_file');
            $unggah_file->storeAs('public/ticket', $unggah_file->hashName());

            Storage::delete('public/ticket/'.basename($ticket->unggah_file));

            $ticket->update([
                'nama_lengkap'              => $request->nama_lengkap,
                'jabatan'                   => $request->jabatan,
                'kategori'                  => $request->kategori,
                'sub_kategori'              => $request->sub_kategori,
                'email'                     => $request->email,
                'nomor_induk_pegawai'       => $request->nomor_induk_pegawai,
                'jenis_tiket'               => $request->jenis_tiket,
                'deskripsi'                 => $request->deskripsi,
                'unggah_file'               => $unggah_file->hashName(),
            ]);

        } else {
            $ticket->update([
                'nama_lengkap'              => $request->nama_lengkap,
                'jabatan'                   => $request->jabatan,
                'kategori'                  => $request->kategori,
                'sub_kategori'              => $request->sub_kategori,
                'email'                     => $request->email,
                'nomor_induk_pegawai'       => $request->nomor_induk_pegawai,
                'jenis_tiket'               => $request->jenis_tiket,
                'deskripsi'                 => $request->deskripsi,
            ]);
        }

        // Kembalikan response sukses
        return new TicketResource(true, 'Ticket berhasil di Update', $ticket);
    }

    public function destroy(Ticket $ticket)
    {
        {
            if($ticket->delete())
            {
                //return success with Api Resource
                return new TicketResource(true, 'Ticket Pegawai berhasil dihapus', null);
            }

                //return failed with Api Resource
                return new TicketResource(false, 'Ticket Pegawai gagal dihapus', null);
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

        // Cari tiket pegawai berdasarkan ID
        $ticket = Ticket::findOrFail($id);

        // Perbarui status tiket
        $ticket->status = $request->status;
        $ticket->save();

        return new TicketResource(true, 'Status Tiket Pegawai berhasil diubah.', $ticket);
    }

    public function assignTicket(Request $request, $id)
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
        $ticket = Ticket::findOrFail($id);

        // Update tiket dengan staf yang ditugaskan dan prioritas
        $ticket->assigned_to = $request->assigned_to;
        $ticket->prioritas = $request->prioritas; // Menambahkan prioritas tiket

        // Ubah status tiket menjadi 'proses'
        $ticket->status = 'proses'; // Mengubah status menjadi 'proses' saat ditugaskan ke staf
        $ticket->save();

        // Cari staf yang ditugaskan
        $staf = User::findOrFail($request->assigned_to);

        // Kirim notifikasi ke staf yang ditugaskan
        $staf->notify(new TicketAssignedNotification($ticket, 'pegawai'));  // 'pegawai' untuk tipe tiket pegawai

        return response()->json([
            'message'     => 'Tiket berhasil ditugaskan kepada Staff dengan prioritas ' . $request->prioritas . '.',
            'assigned_to' => $staf->username, // Menyertakan nama staf yang ditugaskan
            'prioritas'   => $ticket->prioritas, // Menyertakan prioritas tiket
        ], 200);
    }

    public function getNewPegawaiTickets(Request $request)
    {
        // Ambil semua tiket pegawai dan tambahkan URL unggah file jika ada
            $tickets = Ticket::all()->map(function ($ticket)
            {
                // Cek apakah tiket memiliki file yang diunggah
                    $fileUrl = $ticket->unggah_file ? Storage::url($ticket->unggah_file) : null;

                return [
                    'nama_lengkap'    => $ticket->nama_lengkap,
                    'email'           => $ticket->email,
                    'jabatan'         => $ticket->jabatan,
                    'kategori'        => $ticket->kategori,
                    'jenis_tiket'     => $ticket->jenis_tiket,
                    'status'          => $ticket->status,
                    'unggah_file_url' => $fileUrl, // Tambahkan URL unggah file
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Semua tiket pegawai BNPT berhasil ditemukan.',
                'data'    => $tickets
            ]);
    }

//     public function downloadFile($ticketId)
// {
//     $ticket = Ticket::find($ticketId);

//     if (!$ticket || !$ticket->unggah_file)
//     {
//         return response()->json([
//             'success' => false,
//             'message' => 'File tidak ditemukan.',
//         ], 404);
//     }

//     $filePath = $ticket->unggah_file;

//     if (!Storage::disk('public')->exists($filePath))
//     {
//         return response()->json([
//             'success' => false,
//             'message' => 'File tidak ditemukan di penyimpanan.',
//         ], 404);
//     }

//     $fileContent = Storage::disk('public')->get($filePath);
//     $mimeType = Storage::disk('public')->mimeType($filePath);

//     return response($fileContent, 200)->header('Content-Type', $mimeType);
// }

// public function viewOrDownloadFile(Request $request, $ticketId)
//     {
//         $ticket = Ticket::find($ticketId);

//         if (!$ticket || !$ticket->unggah_file)
//         {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'File tidak ditemukan.',
//             ], 404);
//         }

//         $filePath = $ticket->unggah_file;

//         if (!Storage::disk('public')->exists($filePath))
//         {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'File tidak ditemukan di penyimpanan.',
//             ], 404);
//         }

//         $fileContent = Storage::disk('public')->get($filePath);
//         $mimeType = Storage::disk('public')->mimeType($filePath);
//         $fileName = basename($filePath);

//         // Cek parameter download dari query string
//             if ($request->query('download') === 'true')
//             {
//                 return response($fileContent, 200)
//                     ->header('Content-Type', $mimeType)
//                     ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
//             }

//         // Default: tampilkan di tab baru
//             return response($fileContent, 200)
//                 ->header('Content-Type', $mimeType)
//                 ->header('Content-Disposition', 'inline');
// }

public function viewOrDownloadFile(Request $request, $ticketId)
    {
        $ticket = Ticket::find($ticketId);

        if (!$ticket || !$ticket->unggah_file)
        {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan.',
            ], 404);
        }

        $filePath = $ticket->unggah_file;

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
        $query = Ticket::select('nama_lengkap', 'email', 'jabatan', 'kategori', 'jenis_tiket', 'prioritas', 'status');

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
        $tickets = $query->get();

        // Cek apakah tiket ditemukan
        if ($tickets->isEmpty())
        {
            return response()->json(['success' => false, 'message' => 'Tiket pegawai tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tickets
        ], 200);
    }
}
