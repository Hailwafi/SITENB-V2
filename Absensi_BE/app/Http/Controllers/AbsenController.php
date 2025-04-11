<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Absen;
use Carbon\Carbon;

class AbsenController extends Controller
{
    // private $allowedLatitude = -6.6059344; // Koordinat SMKN 1 Ciomas
    // private $allowedLongitude = 106.7758339;
    // private $radius = 0.005; // Radius dalam KM (5 meter)

    public function absen(Request $request)
        {
            $request->validate([
                'user_id'   => 'required|exists:users,id',
                'status'    => 'required|in:masuk,keluar',
                // 'latitude' => 'required|numeric',
                // 'longitude' => 'required|numeric'
            ]);

            // Cek apakah lokasi user valid
                // if (!$this->isWithinAllowedRadius($request->latitude, $request->longitude)) 
                //     {
                //         return response()->json([
                //             'message' => 'Anda berada di luar area absen yang diizinkan!',
                //             'status' => 'failed'
                //         ], 403);
                //     }

            // Cek apakah user sudah absen masuk hari ini
                $existingAbsen = Absen::where('user_id', $request->user_id)
                    ->whereDate('waktu_absen', Carbon::today())
                    ->where('status', $request->status)
                    ->first();

                if ($existingAbsen) 
                    {
                        return response()->json([
                            'message' => 'Anda sudah absen ' . $request->status . ' hari ini!',
                            'data'    => $existingAbsen
                        ], 400);
                    }

            // Simpan data absen jika valid
                $absen = Absen::create([
                    'user_id'           => $request->user_id,
                    'status'            => $request->status,
                    'waktu_absen'       => Carbon::now()->timezone('Asia/Jakarta'),
                    // 'latitude'          => $request->latitude,
                    // 'longitude'         => $request->longitude,
                    // 'is_valid_location' => true
                ]);

                return response()->json([
                    'message' => 'Absen ' . $request->status . ' berhasil!',
                    'data' => $absen
                ], 201);
        }

    // Fungsi untuk mengecek apakah user berada dalam radius yang diizinkan
        // private function isWithinAllowedRadius($lat, $lon)
        //     {
        //         $earthRadius = 6371; // Radius bumi dalam KM

        //         $dLat = deg2rad($lat - $this->allowedLatitude);
        //         $dLon = deg2rad($lon - $this->allowedLongitude);

        //         $a = sin($dLat / 2) * sin($dLat / 2) +
        //             cos(deg2rad($this->allowedLatitude)) * cos(deg2rad($lat)) *
        //             sin($dLon / 2) * sin($dLon / 2);

        //         $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        //         $distance = $earthRadius * $c; // Hasil dalam KM

        //         return $distance <= $this->radius; // True jika dalam radius
        //     }
}

