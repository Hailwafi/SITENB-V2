<?php

namespace App\Http\Controllers;

use App\Models\PengajuanTidakHadir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

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

            $rules = [
                'nama'              => 'required|string',
                'jabatan'           => 'required|string',
                'tanggal_pengajuan' => ['required', 'regex:/^\d{2}-\d{2}-\d{4}\s+s\.d\s+\d{2}-\d{2}-\d{4}$/'],
                'jenis_pengajuan'   => ['required', Rule::in(['cuti', 'izin', 'lembur', 'semua'])],
                'catatan'           => 'nullable|string',
                'dokumen'           => 'nullable|file|mimetypes:application/pdf,image/jpeg,image/png,image/jpg',
            ];

            if ($request->jenis_pengajuan === 'cuti') 
                {
                    $rules['jenis_cuti'] = ['required', Rule::in(['tahunan', 'melahirkan', 'duka', 'lainnya'])];
                } else {
                    $rules['jenis_cuti'] = 'prohibited';
                }

            $request->validate($rules);

            $pengajuan = PengajuanTidakHadir::create([
                'tanggal_pembuatan' => Carbon::now()->format('Y-m-d'),
                'nama'              => $request->nama,
                'jabatan'           => $request->jabatan,
                'tanggal_pengajuan' => $request->tanggal_pengajuan,
                'jenis_pengajuan'   => $request->jenis_pengajuan,
                'jenis_cuti'        => $request->jenis_pengajuan === 'cuti' ? $request->jenis_cuti : null,
                'catatan'           => $request->catatan,
                'dokumen'           => $request->file('dokumen') ? $request->file('dokumen')->store('dokumen', 'public') : null,
                'status'            => 'proses',
            ]);

            return response()->json([
                         'message' => 'Pengajuan anda berhasil dibuat',
                             'data' => [
                                'id' => $pengajuan->id,
                               'nama' => $pengajuan->nama,
                             'jabatan' => $pengajuan->jabatan,
                    'tanggal_pembuatan' => Carbon::parse($pengajuan->tanggal_pembuatan)->format('d-m-Y'),
                   'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan,
                    'jenis_pengajuan' => $pengajuan->jenis_pengajuan,
                        'jenis_cuti' => $pengajuan->jenis_cuti,
                          'catatan' => $pengajuan->catatan,
                     'dokumen_url' => $pengajuan->dokumen ? asset('storage/' . $pengajuan->dokumen) : null,
                         'status' => $pengajuan->status,
                ]
            ]);
            
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
}
