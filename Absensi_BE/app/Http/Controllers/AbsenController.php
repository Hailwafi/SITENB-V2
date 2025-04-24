<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Absen;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use App\Models\PengajuanTidakHadir;

class AbsenController extends Controller
{
    private $allowedLatitude = -6.6059344;
    private $allowedLongitude = 106.7758339;
    private $radius = 5; // 5km

    public function absen(Request $request)
    {
        $user = $request->user(); // Ambil user dari bearer token

        $request->validate([
            'status'    => 'required|in:masuk,keluar,lembur',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'foto'      => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $now = Carbon::now()->timezone('Asia/Jakarta');
        $today = $now->copy()->startOfDay();
        $currentHour = $now->format('H:i:s');

        // Validasi lokasi
        if (!$this->isWithinAllowedRadius($request->latitude, $request->longitude)) {
            return response()->json([
                'message' => 'Anda berada di luar area absen yang diizinkan!',
                'status'  => 'failed'
            ], 403);
        }

        // Validasi jam absen masuk (07:00-16:00)
        if ($request->status === 'masuk' && ($currentHour < '07:00:00' || $currentHour >= '16:00:00')) {
            return response()->json([
                'message' => 'Absen masuk hanya bisa dilakukan antara pukul 07:00-16:00',
                'status'  => 'failed'
            ], 403);
        }

        // Cek absen hari ini
        $existingAbsen = Absen::where('user_id', $user->id)
            ->whereDate('waktu_absen', $today)
            ->where('status', $request->status)
            ->first();

        if ($existingAbsen) {
            return response()->json([
                'message' => 'Anda sudah absen ' . $request->status . ' hari ini!',
                'status'  => 'failed'
            ], 400);
        }

        // Handle pengambilan foto
            if ($request->hasFile('foto')) 
            {
                // Jika dikirim sebagai file biasa
                    $fotoPath = $request->file('foto')->store('profile_photos', 'public');
            } elseif (preg_match('/^data:image\/(\w+);base64,/', $request->foto)) 
            {
                // Jika dikirim sebagai base64
                    $fotoData = $request->foto;
                    $image = str_replace('data:image/jpeg;base64,', '', $fotoData);
                    $image = str_replace('data:image/png;base64,', '', $image);
                    $image = str_replace(' ', '+', $image);
                    $imageName = 'profile_photos/' . uniqid() . '.jpg';
                    Storage::disk('public')->put($imageName, base64_decode($image));
                    $fotoPath = $imageName;
            } else {
                return response()->json([
                    'message' => 'Format foto tidak dikenali.',
                    'status'  => 'failed'
                ], 400);
            }
            $fotoUrl = Storage::url($fotoPath);

        // Tentukan status dan keterangan
        $status = $request->status;
        $keterangan = null;

        if ($status === 'masuk') {
            $jamBatasTepatWaktu = Carbon::createFromTime(8, 0, 0, 'Asia/Jakarta');
            $jamBatasMasuk = Carbon::createFromTime(16, 0, 0, 'Asia/Jakarta');

            if ($now->greaterThan($jamBatasMasuk)) {
                return response()->json([
                    'message' => 'Absen masuk sudah ditutup, silakan absen masuk besok',
                    'status'  => 'failed'
                ], 403);
            }

            $keterangan = $now->lessThanOrEqualTo($jamBatasTepatWaktu) ? 'Tepat Waktu' : 'Terlambat';
        } elseif ($status === 'keluar') {
            $jamMulaiKeluar = Carbon::createFromTime(16, 0, 0, 'Asia/Jakarta');
            $jamTutupKeluar = Carbon::createFromTime(18, 0, 0, 'Asia/Jakarta');

            if ($now->lessThan($jamMulaiKeluar)) {
                return response()->json([
                    'message' => 'Absen keluar hanya bisa dilakukan mulai pukul 16:00',
                    'status'  => 'failed'
                ], 403);
            }

            if ($now->greaterThan($jamTutupKeluar)) {
                if ($request->has('lembur') && $request->lembur === 'ya') {
                    $status = 'lembur';
                    $keterangan = 'Lembur Setelah Jam Kerja';
                } else {
                    $keterangan = 'Keluar Normal (Lewat Jam)';
                }
            } else {
                $keterangan = 'Keluar Normal';
            }
        }

        // Simpan data absen
        $absen = Absen::create([
            'user_id'           => $user->id,
            'status'            => $status,
            'waktu_absen'       => $now,
            'keterangan'        => $keterangan,
            'latitude'          => $request->latitude,
            'longitude'         => $request->longitude,
            'is_valid_location' => true,
            'foto_path'         => $fotoPath,
        ]);

        return response()->json([
            'message'        => 'Absen ' . $status . ' berhasil!',
            'status'         => 'success true',
            'data'           => [
                'absen'      => $absen,
                'foto_url'   => asset($fotoUrl),
                'keterangan' => $keterangan
            ]
        ], 201);
    }

    private function isWithinAllowedRadius($lat, $lon)
    {
        $earthRadius = 6371; // Radius bumi dalam KM

        $dLat = deg2rad($lat - $this->allowedLatitude);
        $dLon = deg2rad($lon - $this->allowedLongitude);

        $a = sin($dLat/2) * sin($dLat/2) + 
             cos(deg2rad($this->allowedLatitude)) * cos(deg2rad($lat)) * 
             sin($dLon/2) * sin($dLon/2);

        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        return $distance <= $this->radius;
    }
}