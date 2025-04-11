<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IzinSakit;
use Illuminate\Support\Facades\Auth;

class IzinSakitController extends Controller {

    // Mengambil jumlah izin dan sakit dalam bulan berjalan
    public function getMonthlyCounts() 
        {
            return response()->json([
                'izin'  => IzinSakit::countThisMonth('izin'),
                'sakit' => IzinSakit::countThisMonth('sakit'),
            ]);
        }

    // Menambahkan data izin atau sakit
    public function store(Request $request) 
        {
            $request->validate([
                'jenis'      => 'required|in:izin,sakit',
                'keterangan' => 'required|string',
            ]);
        
            // Cek apakah user sudah izin/sakit hari ini
                $alreadyExists = IzinSakit::where('user_id', Auth::id())
                    ->whereDate('created_at', now()) // Mengecek data pada tanggal hari ini
                    ->exists();
        
            if ($alreadyExists) 
            {
                return response()->json([
                    'message' => 'Anda hanya bisa mengajukan izin/sakit satu kali dalam sehari.'
                ], 400);
            }
        
            $izinSakit = IzinSakit::create([
                'user_id'    => Auth::id(),
                'jenis'      => $request->jenis,
                'keterangan' => $request->keterangan,
            ]);
        
            return response()->json([
                'message'        => 'Data izin/sakit berhasil ditambahkan',
                'data'           => [
                    'user_id'    => $izinSakit->user_id,
                    'jenis'      => $izinSakit->jenis,
                    'keterangan' => $izinSakit->keterangan,
                    'created_at' => $izinSakit->created_at
                ]
            ]);
        }
}
