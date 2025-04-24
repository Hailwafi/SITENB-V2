<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\IzinSakit;
use App\Models\Absen;
use App\Models\PengajuanTidakHadir;
use Carbon\Carbon;
class UserDashboardController extends Controller
{
    public function statistikAbsensi(Request $request)
    {
        $statistikId = 1;
        $search = $request->input('search');
        $perPage = 10;

        $query = User::where('role', '!=', 'admin');

        if ($search) 
            {
                $query->where('username', 'like', '%' . $search . '%');
            }

        $users = $query->paginate($perPage);
        $today = now()->toDateString();
        $data = [];

        // Hitung statistik manual
            $totalTepatWaktu = 0;
            $totalTerlambat = 0;
            $totalIzin = 0;
            $totalCuti = 0;
            $totalLembur = 0;

            // Hitung statistik manual
            $totalTepatWaktu = 0;
            $totalTerlambat = 0;
            $totalIzin = 0;
            $totalCuti = 0;
            $totalLembur = 0;

        foreach ($users as $user) 
        {
            // Pengajuan tidak hadir (izin, cuti, lembur)
                $pengajuans = $user->pengajuanTidakHadir()
                    ->whereIn('jenis_pengajuan', ['cuti', 'izin', 'lembur'])
                    ->where('status', '!=', 'ditolak')
                    ->get();

            foreach ($pengajuans as $pengajuan) 
            {
                // Kalau lembur, hanya status_keluar saja yang lembur, status_masuk tetap null
                    $statusMasuk = in_array($pengajuan->jenis_pengajuan, ['izin', 'cuti']) ? $pengajuan->jenis_pengajuan : null;
                    $statusKeluar = $pengajuan->jenis_pengajuan;

                $data[] = [
                    'id'            => $statistikId++,
                    'nama'          => $user->username,
                    'jabatan'       => $user->role,
                    'absen_masuk'   => null,
                    'status_masuk'  => $statusMasuk,
                    'absen_keluar'  => null,
                    'status_keluar' => $statusKeluar,
                ];

                // Statistik
                    if ($pengajuan->jenis_pengajuan === 'izin') $totalIzin++;
                    if ($pengajuan->jenis_pengajuan === 'cuti') $totalCuti++;
                    if ($pengajuan->jenis_pengajuan === 'lembur') $totalLembur++;
            }

            // Ambil absen hari ini
                $absenMasuk = $user->absens()
                    ->whereDate('waktu_absen', $today)
                    ->whereIn('status', ['masuk', 'terlambat'])
                    ->orderBy('waktu_absen', 'asc')
                    ->first();

                $absenKeluar = $user->absens()
                    ->whereDate('waktu_absen', $today)
                    ->whereIn('status', ['keluar', 'lembur'])
                    ->orderBy('waktu_absen', 'desc')
                    ->first();

            // Hanya buat entri jika ada salah satu absen
                if ($absenMasuk || $absenKeluar) 
                {
                    $jamMasuk = $absenMasuk ? Carbon::parse($absenMasuk->waktu_absen) : null;
                    $jamKeluar = $absenKeluar ? Carbon::parse($absenKeluar->waktu_absen) : null;

                    $statusMasuk = null;

                    // Cek status masuk
                        if ($jamMasuk) {
                            if ($jamMasuk->gt(Carbon::createFromTime(8, 0, 0))) 
                                {
                                    $statusMasuk = 'terlambat';
                                    $totalTerlambat++;
                                } else {
                                    $statusMasuk = 'masuk';
                                    $totalTepatWaktu++;
                                }
                        }

                    $data[] = [
                        'id'            => $statistikId++,
                        'nama'          => $user->username,
                        'jabatan'       => $user->role,
                        'absen_masuk'   => $jamMasuk ? $jamMasuk->format('H:i:s') : null,
                        'status_masuk'  => $statusMasuk,
                        'absen_keluar'  => $jamKeluar ? $jamKeluar->format('H:i:s') : null,
                        'status_keluar' => $absenKeluar ? $absenKeluar->status : null,
                    ];
                }
        }

        $totalKaryawan = $users->total();

        return response()->json([
            'data'                => $data,
            'pagination'          => [
                'current_page'    => $users->currentPage(),
                'last_page'       => $users->lastPage(),
                'total'           => $users->total(),
                'total_statistik' => $totalKaryawan,
            ],
            'persentase'           => [
        'tepat_waktu'             => $totalTepatWaktu . '%',
        'terlambat'               => $totalTerlambat . '%', 
        'izin'                    => $totalIzin . '%',
        'cuti'                    => $totalCuti . '%',
        'lembur'                  => $totalLembur . '%',
                                ],

                                'statistik_2'       => [
                'tepat_waktu' => $totalTepatWaktu,
                'terlambat'   => $totalTerlambat,
                'izin'        => $totalIzin,
                'cuti'        => $totalCuti,
                'lembur'      => $totalLembur,
            ],
        ]);
    }

    public function detail($id)
    {
        $today = now()->toDateString();
        
        // Find the user's attendance data based on the ID
            $stat = null;
            $statistikId = 1;
        
        // Get all non-admin users
            $users = User::where('role', '!=', 'admin')->get();
        
        foreach ($users as $user) 
        {
            // Check for leave/permission submissions
                $pengajuans = $user->pengajuanTidakHadir()
                    ->whereIn('jenis_pengajuan', ['cuti', 'izin', 'lembur'])
                    ->where('status', '!=', 'ditolak')
                    ->get();

            foreach ($pengajuans as $pengajuan) 
            {
                if (in_array($pengajuan->jenis_pengajuan, ['izin', 'cuti'])) 
                    {
                        if ($statistikId == $id) 
                            {
                                $stat = [
                                    'id'            => $statistikId,
                                    'nama'          => $user->username,
                                    'jabatan'       => $user->role,
                                    'absen_masuk'   => null,
                                    'status_masuk'  => $pengajuan->jenis_pengajuan,
                                    'absen_keluar'  => null,
                                    'status_keluar' => $pengajuan->jenis_pengajuan,
                                ];
                                break 2;
                            }
                            $statistikId++;
                    }

                if ($pengajuan->jenis_pengajuan === 'lembur' && $pengajuan->tanggal_pengajuan == $today) 
                    {
                        if ($statistikId == $id) 
                            {
                                $stat = [
                                    'nama'          => $user->username,
                                    'jabatan'       => $user->role,
                                    'absen_masuk'   => null,
                                    'status_masuk'  => null,
                                    'absen_keluar'  => null,
                                    'status_keluar' => 'lembur',
                                ];
                                break 2;
                            }
                            $statistikId++;
                    }
            }

            // Check for today's attendance
                $absenMasuk = $user->absens()
                    ->whereDate('waktu_absen', $today)
                    ->whereIn('status', ['masuk', 'terlambat'])
                    ->orderBy('waktu_absen', 'asc')
                    ->first();

                $absenKeluar = $user->absens()
                    ->whereDate('waktu_absen', $today)
                    ->whereIn('status', ['keluar', 'lembur'])
                    ->orderBy('waktu_absen', 'desc')
                    ->first();

            if ($absenMasuk || $absenKeluar) 
            {
                if ($statistikId == $id) 
                    {
                        $jamMasuk = $absenMasuk ? Carbon::parse($absenMasuk->waktu_absen) : null;
                        $jamKeluar = $absenKeluar ? Carbon::parse($absenKeluar->waktu_absen) : null;

                        $statusMasuk = null;
                        if ($jamMasuk) 
                            {
                                $statusMasuk = $jamMasuk->gt(Carbon::createFromTime(8, 0, 0)) ? 'terlambat' : 'masuk';
                            }

                        $stat = [
                            'id'            => $statistikId,
                            'nama'          => $user->username,
                            'jabatan'       => $user->role,
                            'absen_masuk'   => $jamMasuk ? $jamMasuk->format('H:i:s') : null,
                            'status_masuk'  => $statusMasuk,
                            'absen_keluar'  => $jamKeluar ? $jamKeluar->format('H:i:s') : null,
                            'status_keluar' => $absenKeluar ? $absenKeluar->status : null,
                        ];
                        break;
                    }
                    $statistikId++;
            }
        }

        if (!$stat) 
            {
                return response()->json([
                    'message' => 'Data tidak ditemukan'
                ], 404);
            }

        // Cek apakah statusnya izin atau cuti
        if (in_array($stat['status_masuk'], ['izin', 'cuti']) || in_array($stat['status_keluar'], ['izin', 'cuti'])) 
            {
                $user = User::where('username', $stat['nama'])->first();

                $pengajuan = $user->pengajuanTidakHadir()
                    ->where('status', '!=', 'ditolak')
                    ->where('jenis_pengajuan', $stat['status_masuk'] ?? $stat['status_keluar'])
                    ->latest()
                    ->first();

                return response()->json([
                    'detail'            => [
                        'nama'          => $stat['nama'],
                        'jabatan'       => $stat['jabatan'],
                        'absen_masuk'   => null,
                        'status_masuk'  => $stat['status_masuk'],
                        'absen_keluar'  => null,
                        'status_keluar' => $stat['status_keluar'],
                        'dokumen'       => $pengajuan->dokumen ?('storage/kontol' . $pengajuan->dokumen) : null,
                    ]
                ]);
            }

        // Jika bukan izin/cuti (absen biasa), ambil data absens
            $user = User::where('username', $stat['nama'])->first();

            $absenMasuk = $user->absens()
                ->whereDate('waktu_absen', $today)
                ->whereIn('status', ['masuk', 'terlambat'])
                ->orderBy('waktu_absen', 'asc')
                ->first();

            $absenKeluar = $user->absens()
                ->whereDate('waktu_absen', $today)
                ->whereIn('status', ['keluar', 'lembur'])
                ->orderBy('waktu_absen', 'desc')
                ->first();

        // Prepare response data
        $responseData = [
            'nama'          => $stat['nama'],
            'jabatan'       => $stat['jabatan'],
            'absen_masuk'   => $stat['absen_masuk'],
            'status_masuk'  => $stat['status_masuk'],
            'absen_keluar'  => $stat['absen_keluar'],
            'status_keluar' => $stat['status_keluar'],
            'foto_absen'    => [
                'masuk'     => $absenMasuk ? asset('storage/' . $absenMasuk->foto_path) : null,
                'keluar'    => $absenKeluar ? asset('storage/' . $absenKeluar->foto_path) : null,
            ],
            'dokumen'       => null // Default null, akan diisi jika ada lembur
        ];

        // Jika status keluar lembur, ambil dokumen lembur terbaru
            if ($stat['status_keluar'] === 'lembur') 
                {
                    $pengajuanLembur = $user->pengajuanTidakHadir()
                        ->where('jenis_pengajuan', 'lembur')
                        ->latest()
                        ->first();

                    if ($pengajuanLembur && $pengajuanLembur->dokumen) 
                        {
                            $responseData['dokumen'] =('storage/' . $pengajuanLembur->dokumen);
                        }
                }

            return response()->json([
                'detail' => $responseData
            ]);
    }

    public function getPengajuan(Request $request)
    {
            // Validasi parameter request
                $request->validate([
                    'jenis_pengajuan' => 'nullable|in:semua,cuti,izin,lembur',
                    'search'          => 'nullable|string',
                    'page'            => 'nullable|integer|min:1',
                ]);
        
            // Pertama, update status untuk pengajuan yang sudah lewat batas waktu
                $allPengajuan = DB::table('pengajuan_tidakhadir')
                    ->whereIn('status', ['diterima', 'ditolak'])
                    ->get();
        
            foreach ($allPengajuan as $pengajuan) 
            {
                // Ekstrak tanggal dari format 'dd-mm-yyyy' atau 'dd-mm-yyyy s.d dd-mm-yyyy'
                    $tanggalArray = explode(' s.d ', $pengajuan->tanggal_pengajuan);
                    $tanggalTerakhir = end($tanggalArray);
                
                // Konversi format tanggal dari 'dd-mm-yyyy' ke 'yyyy-mm-dd'
                    $tanggalParts = explode('-', $tanggalTerakhir);
                    if (count($tanggalParts) === 3) 
                        {
                            $tanggalMysql = $tanggalParts[2].'-'.$tanggalParts[1].'-'.$tanggalParts[0];
                            
                            // Bandingkan dengan tanggal sekarang
                                if (strtotime($tanggalMysql) < strtotime(now()->format('Y-m-d'))) 
                                    {
                                        DB::table('pengajuan_tidakhadir')
                                            ->where('id', $pengajuan->id)
                                            ->update(['status' => 'melewati_batas_waktu']);
                                    }
                        }
            }
        
            // Query dasar
                $query = DB::table('pengajuan_tidakhadir')
                    ->select(
                        'pengajuan_tidakhadir.id',
                        'pengajuan_tidakhadir.nama',
                        'pengajuan_tidakhadir.jabatan',
                        'pengajuan_tidakhadir.jenis_pengajuan',
                        'pengajuan_tidakhadir.tanggal_pembuatan',
                        'pengajuan_tidakhadir.tanggal_pengajuan',
                        'pengajuan_tidakhadir.status',
                    )
                    ->whereIn('jenis_pengajuan', ['cuti', 'izin', 'lembur']);
        
            // Terapkan filter jenis_pengajuan
                if ($request->has('jenis_pengajuan') && $request->jenis_pengajuan !== 'semua') 
                    {
                        $query->where('jenis_pengajuan', $request->jenis_pengajuan);
                    }
        
            // Urutkan berdasarkan status (proses di atas) dan kemudian berdasarkan tanggal terbaru
                $query->orderByRaw("CASE 
                        WHEN status = 'proses' THEN 0 
                        WHEN status = 'melewati_batas_waktu' THEN 1
                        ELSE 2 
                    END")
                    ->orderBy('pengajuan_tidakhadir.created_at', 'desc');
        
            // Paginasi hasil
                $perPage = 10;
                $pengajuan = $query->paginate($perPage);
        
            return response()->json([
                'success'          => true,
                'message'          => 'Data pengajuan User berhasil diambil',
                'data'             => $pengajuan->items(),
                'pagination'       => [
                    'current_page' => $pengajuan->currentPage(),
                    'per_page'     => $perPage,
                    'total'        => $pengajuan->total(),
                    'last_page'    => $pengajuan->lastPage(),
                ],
            ]);
    }

    public function showDetail($id)
    {
            // Ambil data pengajuan berdasarkan ID
                $pengajuan = DB::table('pengajuan_tidakhadir')
                    ->where('id', $id)
                    ->first();
        
            // Jika pengajuan tidak ditemukan
            if (!$pengajuan) 
                {
                    return response()->json([
                        'success' => false,
                        'message' => 'Pengajuan tidak ditemukan'
                    ], 404);
                }
        
                // Format URL dokumen yang bisa langsung diakses
                // $dokumenUrl = null;
                // if ($pengajuan->dokumen) {
                //     $dokumenUrl = url('storage/' . $pengajuan->dokumen);
                // }
        
            // Format response dasar
                $response = [
                    'nama'              => $pengajuan->nama,
                    'jabatan'           => $pengajuan->jabatan,
                    'jenis_pengajuan'   => $pengajuan->jenis_pengajuan,
                    'tanggal_pembuatan' => $pengajuan->tanggal_pembuatan,
                    'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan,
                    'catatan'           => $pengajuan->catatan,
                    'dokumen'           => $pengajuan->dokumen,
                    // 'dokumen_url'    => $dokumenUrl
                ];
        
            // Tambahkan jenis_cuti hanya jika pengajuan adalah cuti
                if ($pengajuan->jenis_pengajuan === 'cuti') 
                    {
                        $response['jenis_cuti'] = $pengajuan->jenis_cuti;
                    }
        
            // Tampilkan status hanya jika masih 'proses'
                if ($pengajuan->status === 'proses') 
                    {
                        $response['status'] = $pengajuan->status;
                    }

             // Tampilkan alasan_penolakan jika status 'ditolak'
                if ($pengajuan->status === 'ditolak') 
                    {
                        $response['alasan_penolakan'] = $pengajuan->alasan_penolakan;
                    }
        
                return response()->json([
                    'success' => true,
                    'message' => 'Detail pengajuan berhasil diambil',
                    'data' => $response
                ]);
    }
    
    public function index()
    {
            $user = Auth::user();

            // Hitung jumlah izin dan sakit bulan ini
                $currentMonth = Carbon::now()->month;
                $currentYear = Carbon::now()->year;

                $izinCount = IzinSakit::where('user_id', $user->id)
                    ->whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->where('jenis', 'izin')
                    ->count();

                $sakitCount = IzinSakit::where('user_id', $user->id)
                    ->whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->where('jenis', 'sakit')
                    ->count();

            // Ambil lokasi absen terakhir
                $lastAbsen = Absen::where('user_id', $user->id)
                    ->latest('created_at')
                    ->first();

                return response()->json([
                    'status' => 'success true',
                    'data'   => [
                        'username'        => $user->username,
                        'izin'             => $izinCount,
                        'sakit'            => $sakitCount,
                        'lokasi_absen'     => $lastAbsen ?
                        [
                            // 'latitude'  => $lastAbsen->latitude,
                            // 'longitude' => $lastAbsen->longitude,
                            'address'      => $lastAbsen->address,
                            'time'         => $lastAbsen->created_at->toDateTimeString()
                        ] : null
                    ]
                ]);
    }    
}
