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

    public function getAttendanceData(Request $request)
    {
        // Ambil data absen
            $absens = DB::table('absens')
                ->join('users', 'absens.user_id', '=', 'users.id')
                ->leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
                ->select(
                    'users.id',
                    'users.username as name',
                    'profiles.jabatan as position',
                    'absens.waktu_absen as date', // Gunakan waktu_absen sebagai date
                    DB::raw("'Masuk' as status")
                );

        // Ambil data izin/sakit
            $izinSakits = DB::table('izin_sakits')
                ->join('users', 'izin_sakits.user_id', '=', 'users.id')
                ->leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
                ->select(
                    'users.id',
                    'users.username as name',
                    'profiles.jabatan as position',
                    'izin_sakits.created_at as date', // Gunakan created_at sebagai date
                    DB::raw("'Izin/Sakit' as status")
                );

        // Gabungkan data absen & izin/sakit
            $data = $absens->union($izinSakits);

        // Buat subquery agar alias dapat digunakan dalam WHERE
            $query = DB::table(DB::raw("({$data->toSql()}) as sub"))
                ->mergeBindings($data);

        // Filter berdasarkan nama jika ada search_name
            if ($request->has('search_name')) 
            {
                $query->where('sub.name', 'like', "%{$request->search_name}%");
            }

        // Filter berdasarkan jabatan (position)
        if ($request->has('search_position')) 
            {
                $query->where('sub.position', 'like', "%{$request->search_position}%");
            }

        // Filter berdasarkan rentang tanggal jika ada
            if ($request->has('start_date') && $request->has('end_date')) 
            {
                $start_date = Carbon::parse($request->start_date)->startOfDay();
                $end_date = Carbon::parse($request->end_date)->endOfDay();
                $query->whereBetween('sub.date', [$start_date, $end_date]);
            }

        // Ambil data dengan pagination
            $attendanceData = $query->orderBy('sub.date', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'List of attendance data',
            'data'    => $attendanceData
        ]);
    }
}