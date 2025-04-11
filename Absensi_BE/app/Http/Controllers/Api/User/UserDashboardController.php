<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\IzinSakit;
use App\Models\Absen;
use Carbon\Carbon;

class UserDashboardController extends Controller
{
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
