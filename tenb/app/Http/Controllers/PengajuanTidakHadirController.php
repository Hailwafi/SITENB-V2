<?php

namespace App\Http\Controllers;

use App\Models\PengajuanTidakHadir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PengajuanResource;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use App\Models\Absen;

class PengajuanTidakHadirController extends Controller
{
    public function index()
        {
            return response()->json(PengajuanTidakHadir::latest()->paginate(10));
        }


    public function show($id)
        {
            $pengajuan = PengajuanTidakHadir::find($id);
            if (!$pengajuan) 
                {
                    return response()->json(['message' => 'Data anda tersebut tidak ditemukan'], 404);
                }

            return response()->json($pengajuan);
        }

    public function store(Request $request)
        {
            $user = auth()->user(); // Ambil user dari token

            // Validasi awal
            $rules = [
                'nama'              => 'required|string|max:255',
                'jabatan'           => 'required|string|max:255',
                'tanggal_pengajuan' => ['required', 'regex:/^\d{2}-\d{2}-\d{4}\s+s\.d\s+\d{2}-\d{2}-\d{4}$/'],
                'jenis_pengajuan'   => ['required', Rule::in(['cuti', 'izin', 'lembur'])],
                'catatan'           => 'nullable|string|max:500',
                'dokumen'           => 'required|file|mimetypes:application/pdf,image/jpeg,image/png,image/jpg|max:2048',
            ];

            if ($request->jenis_pengajuan === 'cuti') {
                $rules['jenis_cuti'] = ['required', Rule::in(['tahunan', 'melahirkan', 'duka', 'lainnya'])];
            } else {
                $rules['jenis_cuti'] = 'prohibited';
            }

            $request->validate($rules);

            // Ekstrak tanggal
            preg_match('/\d{2}-\d{2}-\d{4}/', $request->tanggal_pengajuan, $startDate);
            preg_match('/\d{2}-\d{2}-\d{4}$/', $request->tanggal_pengajuan, $endDate);

            $startSubmissionDate = Carbon::createFromFormat('d-m-Y', trim($startDate[0]));
            $endSubmissionDate = Carbon::createFromFormat('d-m-Y', trim($endDate[0]));
            $today = Carbon::today();

            // Cek batasan tanggal cuti/izin
            if (in_array($request->jenis_pengajuan, ['cuti', 'izin'])) {
                if ($startSubmissionDate->isToday() || $startSubmissionDate->isYesterday() || $endSubmissionDate->isBefore($today)) {
                    return response()->json([
                        'message' => 'Tanggal pengajuan untuk cuti atau izin tidak dapat dilakukan di hari ini atau hari kemarin.'
                    ], 422);
                }
            }

            // ✅ Cek apakah user sudah membuat pengajuan hari ini
            $existing = PengajuanTidakHadir::where('user_id', $user->id)
                ->whereDate('created_at', $today)
                ->exists();

            if ($existing) {
                return response()->json([
                    'message' => 'Pengajuan hanya dapat dilakukan sekali dalam sehari.',
                ], 422);
            }

            // Simpan dokumen
            $dokumenPath = $request->file('dokumen')->store('gambar', 'public');

            // Jika lembur, update absen keluar hari ini
            if ($request->jenis_pengajuan === 'lembur') {
                Absen::where('user_id', $user->id)
                    ->whereDate('waktu_absen', Carbon::today())
                    ->where('status', 'keluar')
                    ->update(['status' => 'lembur', 'keterangan' => 'Lembur Setelah Jam Kerja']);
            }

            // Simpan pengajuan
            $pengajuan = PengajuanTidakHadir::create([
                'user_id'           => $user->id,
                'tanggal_pembuatan' => Carbon::now()->format('Y-m-d'),
                'nama'              => $request->nama,
                'jabatan'           => $request->jabatan,
                'tanggal_pengajuan' => $request->tanggal_pengajuan,
                'jenis_pengajuan'   => $request->jenis_pengajuan,
                'jenis_cuti'        => $request->jenis_cuti ?? null,
                'catatan'           => $request->catatan,
                'dokumen'           => asset('storage/' . $dokumenPath),
                'status'            => 'proses',
            ]);

            return new PengajuanResource(true, 'Pengajuan berhasil dibuat', $pengajuan);
        }

    public function update(Request $request, $id)
            {
                $pengajuan = PengajuanTidakHadir::findOrFail($id);
            
                $rules = [
                    'nama'              => 'sometimes|required|string',
                    'jabatan'           => 'sometimes|required|string',
                    'tanggal_pengajuan' => 'sometimes|required|date',
                    'jenis_pengajuan'   => ['sometimes', 'required', Rule::in(['cuti', 'izin', 'lembur', 'semua'])],
                    'catatan'           => 'nullable|string',
                    'dokumen'           => 'nullable|file|mimes:pdf,jpg,jpeg,png',
                ];
            
                // Ambil jenis_pengajuan dari request, fallback ke data lama jika tidak dikirim
                    $jenisPengajuan = $request->input('jenis_pengajuan', $pengajuan->jenis_pengajuan);
            
                    if ($jenisPengajuan === 'cuti') 
                        {
                            $rules['jenis_cuti'] = ['required', Rule::in(['tahunan', 'melahirkan', 'duka', 'lainnya'])];
                        } else {
                            $rules['jenis_cuti'] = 'prohibited';
                        }
            
                    $request->validate($rules);
            
                // Update data
                    $pengajuan->update([
                        'nama'              => $request->nama ?? $pengajuan->nama,
                        'jabatan'           => $request->jabatan ?? $pengajuan->jabatan,
                        'tanggal_pengajuan' => $request->tanggal_pengajuan ?? $pengajuan->tanggal_pengajuan,
                        'jenis_pengajuan'   => $request->jenis_pengajuan ?? $pengajuan->jenis_pengajuan,
                        'jenis_cuti'        => $jenisPengajuan === 'cuti' ? $request->jenis_cuti : null,
                        'catatan'           => $request->catatan ?? $pengajuan->catatan,
                        'dokumen'           => $request->file('dokumen') 
                                            ?  $request->file('dokumen')->store('dokumen')
                                            :  $pengajuan->dokumen,
                    ]);
            
                    return response()->json([
                        'message' => 'Pengajuan anda berhasil diperbarui',
                        'data'   => $pengajuan
                    ]);
            }

    public function destroy($id)
        {
            $pengajuan = PengajuanTidakHadir::find($id);
            if (!$pengajuan) 
                {
                    return response()->json(['message' => 'Data anda tidak ditemukan'], 404);
                }

            if ($pengajuan->dokumen && Storage::disk('public')->exists($pengajuan->dokumen)) 
                {
                    Storage::disk('public')->delete($pengajuan->dokumen);
                }

            $pengajuan->delete();

            return response()->json(['message' => 'Pengajuan anda berhasil dihapus']);
        }

        public function verifikasi(Request $request, $id) 
            {
                // Validasi input
                    $request->validate([
                        'status_pengajuan' => [
                            'required', 
                            Rule::in(['cuti', 'izin', 'diterima', 'ditolak'])
                        ],
                        'alasan_penolakan' => 'required_if:status_pengajuan,ditolak|string|nullable',
                    ]);
                
                try {
                    // Temukan pengajuan berdasarkan ID
                        $pengajuan = PengajuanTidakHadir::findOrFail($id);
                    
                    // Cek status pengajuan
                        if ($request->status_pengajuan === 'ditolak') 
                            {
                                // Simpan alasan penolakan
                                    $pengajuan->alasan_penolakan = $request->alasan_penolakan; 
                            
                                // Set status pengajuan ke 'ditolak'
                                    $pengajuan->status = 'ditolak';
                                
                                // Simpan perubahan
                                    $pengajuan->save();
                                
                                // Kembalikan respon
                                    return response()->json([
                                        'message' => 'Pengajuan ditolak dan status diperbarui',
                                        'status'  => 'ditolak',
                                        'data'    => $pengajuan
                                    ], 200);
                            } else {
                    // Update status sesuai dengan jenis pengajuan
                            $pengajuan->status = $request->status_pengajuan; // Atur status sesuai input
                            $pengajuan->alasan_penolakan = null;
                
                        // Simpan perubahan
                            $pengajuan->save();
                
                        // Kembalikan respon
                            return response()->json([
                                'message' => 'Status pengajuan berhasil diperbarui',
                                'data' => $pengajuan
                            ], 200);
                            }
                } catch (\Exception $e) 
                {
                    // Menangani kesalahan dan mengembalikan respon error
                        return response()->json([
                            'message' => 'Terjadi kesalahan',
                            'error' => $e->getMessage()
                        ], 500);
                }
            }

        // public function hapusPengajuanKadaluarsa()
            // {
            //     // Mengambil tanggal hari ini
            //      $today = Carbon::now()->format('Y-m-d');
                
            //     // Menghapus pengajuan yang telah lewat
            //      PengajuanTidakHadir::where('tanggal_pengajuan', '<', $today)->delete();
            // }
}
