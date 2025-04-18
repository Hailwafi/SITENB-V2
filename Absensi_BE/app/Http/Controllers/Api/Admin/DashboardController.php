<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostView;
use App\Models\User;
use App\Models\Absen; 
use App\Models\PengajuanTidakHadir;
use App\Models\IzinSakit;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // Ambil username admin yang sedang login
            $adminName = Auth::user()->username;

        // Hitung jumlah users, categories, dan posts
            $users = User::count();

            $categories = Category::count();

            $posts = Post::count();

        // Ambil data jumlah view post dalam 30 hari terakhir
            $post_views = PostView::select([
                DB::raw('count(id) as count'),
                DB::raw('DATE(created_at) as day')
            ])
            ->groupBy('day')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->get();

        if (count($post_views)) 
            {
                foreach ($post_views as $result) 
                    {
                        $count[] = (int) $result->count;
                        $day[] = $result->day;
                    }
            } else {
                $count[] = "";
                $day[] = "";
            }

        // Ambil data user yang sudah absen dari tabel absens
            $absenUsers = Absen::select('user_id', 'created_at')
                ->with('user:id,username') 
                ->get()
                ->map(function ($absen) 
                    {
                        return [
                            'username' => $absen->user->username ?? 'Unknown',
                            'status'   => 'Absen',
                            'date'     => $absen->created_at->format('Y-m-d')
                        ];
                    });

        // Ambil data user yang izin/sakit dari tabel izin_sakits
            $izinSakitUsers = IzinSakit::select('user_id', 'created_at')
                ->with('user:id,username')
                ->get()
                ->map(function ($izinSakit) 
                    {
                        return [
                            'username' => $izinSakit->user->username ?? 'Unknown',
                            'status'   => 'Izin/Sakit',
                            'date'     => $izinSakit->created_at->format('Y-m-d')
                        ];
                    });

        // Gabungkan data absen & izin/sakit
            $usersData = $absenUsers->merge($izinSakitUsers);

        // Filter berdasarkan request (opsional)
            if ($request->has('filter')) 
            {
                if ($request->filter === 'absen') 
                {
                    $usersData = $usersData->where('status', 'Absen');
                } elseif ($request->filter === 'izin_sakit') 
                {
                    $usersData = $usersData->where('status', 'Izin/Sakit');
                }
            }

        // Pagination
            $perPage = 10;
            $page = $request->get('page', 1);
            $usersData = $usersData->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'success'       => true,
            'message'       => 'Dashboard User',
            'admin_name'    => $adminName,
            'users'         => $users,
            'categories'    => $categories,
            'posts'         => $posts,
            'posts_views'   => [
                'count' => $count,
                'day'   => $day
            ],
            'data_user'     => $usersData,
        ]);
    }

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

        foreach ($users as $user) 
        {
            // Ambil semua pengajuan (izin & cuti tanpa batas waktu, lembur hanya untuk hari ini)
                $pengajuans = $user->pengajuanTidakHadir()
                    ->whereIn('jenis_pengajuan', ['cuti', 'izin', 'lembur'])
                    ->where('status', '!=', 'ditolak')
                    ->get();

            foreach ($pengajuans as $pengajuan) 
            {
                // Tampilkan izin dan cuti apa pun tanggalnya
                    if (in_array($pengajuan->jenis_pengajuan, ['izin', 'cuti'])) 
                        {
                            $data[] = [
                                'id'            => $statistikId++,
                                'nama'          => $user->username,
                                'jabatan'       => $user->role,
                                'absen_masuk'   => null,
                                'status_masuk'  => $pengajuan->jenis_pengajuan,
                                'absen_keluar'  => null,
                                'status_keluar' => $pengajuan->jenis_pengajuan,
                            ];

                            if ($pengajuan->jenis_pengajuan === 'izin') $totalIzin++;
                            if ($pengajuan->jenis_pengajuan === 'cuti') $totalCuti++;
                        }

                // Lembur hanya ditampilkan jika hari ini
                    if ($pengajuan->jenis_pengajuan === 'lembur' && $pengajuan->tanggal_pengajuan == $today) 
                            {
                                $data[] = [
                                    'nama'          => $user->username,
                                    'jabatan'       => $user->role,
                                    'absen_masuk'   => null,
                                    'status_masuk'  => null,
                                    'absen_keluar'  => null,
                                    'status_keluar' => 'lembur',
                                ];

                                $totalLembur++;
                            }
            }

            // Ambil absen hari ini SAJA
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
                $jamMasuk = $absenMasuk ? Carbon::parse($absenMasuk->waktu_absen) : null;
                $jamKeluar = $absenKeluar ? Carbon::parse($absenKeluar->waktu_absen) : null;

                $statusMasuk = null;

                if ($jamMasuk) 
                    {
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

        return response()->json([
            'data'             => $data,
            'pagination'       => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ],
            'statistik'       => [
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
                                'nama' => $user->username,
                                'jabatan' => $user->role,
                                'absen_masuk' => null,
                                'status_masuk' => null,
                                'absen_keluar' => null,
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
                        'catatan'       => $pengajuan->catatan ?? '-',
                        'dokumen'       => $pengajuan->dokumen ?('storage/' . $pengajuan->dokumen) : null,
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

        // Format lokasi jika ada latitude dan longitude
        $lokasiMasuk = null;
        if ($absenMasuk && $absenMasuk->latitude && $absenMasuk->longitude) 
            {
                $lokasiMasuk = [
                    'latitude' => $absenMasuk->latitude,
                    'longitude' => $absenMasuk->longitude,
                    'is_valid_location' => $absenMasuk->is_valid_location
                ];
            }

        $lokasiKeluar = null;
        if ($absenKeluar && $absenKeluar->latitude && $absenKeluar->longitude) 
            {
                $lokasiKeluar = [
                    'latitude' => $absenKeluar->latitude,
                    'longitude' => $absenKeluar->longitude,
                    'is_valid_location' => $absenKeluar->is_valid_location
                ];
            }

        return response()->json([
            'detail'              => [
                'nama'            => $stat['nama'],
                'jabatan'         => $stat['jabatan'],
                'absen_masuk'     => $stat['absen_masuk'],
                'status_masuk'    => $stat['status_masuk'],
                'absen_keluar'    => $stat['absen_keluar'],
                'status_keluar'   => $stat['status_keluar'],
                'foto_absen'      => [
                    'masuk'       => $absenMasuk ? asset('storage/' . $absenMasuk->foto_path) : null,
                    'keluar'      => $absenKeluar ? asset('storage/' . $absenKeluar->foto_path) : null,
                ],
                'koordinat_absen' => [
                    'masuk'       => $lokasiMasuk,
                    'keluar'      => $lokasiKeluar,
                ],
            ]
        ]);
    }

    public function getPengajuan(Request $request)
    {
        // Validasi parameter request
            $request->validate([
                'jenis_pengajuan' => 'nullable|in:semua,cuti,izin',
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
                ->whereIn('jenis_pengajuan', ['cuti', 'izin']);

        // Terapkan filter jenis_pengajuan
            if ($request->has('jenis_pengajuan') && $request->jenis_pengajuan !== 'semua') 
            {
                $query->where('jenis_pengajuan', $request->jenis_pengajuan);
            }

        // Terapkan filter pencarian
            if ($request->has('search') && !empty($request->search)) 
                {
                    $searchTerm = '%' . $request->search . '%';
                    $query->where(function($q) use ($searchTerm) 
                        {
                            $q->where('pengajuan_tidakhadir.nama', 'like', $searchTerm)
                            ->orWhere('pengajuan_tidakhadir.jabatan', 'like', $searchTerm);
                        });
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

        // Format response sesuai kebutuhan
            $response = [
                'nama'              => $pengajuan->nama,
                'jabatan'           => $pengajuan->jabatan,
                'jenis_pengajuan'   => $pengajuan->jenis_pengajuan,
                'tanggal_pembuatan' => $pengajuan->tanggal_pembuatan,
                'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan,
                'catatan'           => $pengajuan->catatan,
                'dokumen'           => $pengajuan->dokumen,
                // 'dokumen_url' => $dokumenUrl // URL yang bisa langsung diklik
            ];

        // Tambahkan jenis_cuti hanya jika pengajuan adalah cuti
            if ($pengajuan->jenis_pengajuan === 'cuti') 
                {
                    $response['jenis_cuti'] = $pengajuan->jenis_cuti;
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
}