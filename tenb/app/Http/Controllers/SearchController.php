<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\Publik;
use Illuminate\Support\Facades\Storage;

class SearchController extends Controller
{
    public function searchTicket(Request $request)
    {
        // Ambil input kode tiket dan token tiket
            $kode_tiket = $request->input('kode_tiket');
            $token_tiket = $request->input('token_tiket');

        // Cek apakah kode_tiket dan token_tiket milik pegawai atau publik
            $ticketPegawai = Ticket::where('kode_tiket', $kode_tiket)
                                ->where('token_tiket', $token_tiket)
                                ->first();

            $ticketPublik = Publik::where('kode_tiket', $kode_tiket)
                                ->where('token_tiket', $token_tiket)
                                ->first();

        if ($ticketPegawai)
        {
            // Ambil data tiket pegawai tanpa unggah_file dan unggah_file_url
                $ticketPegawaiData = $ticketPegawai->only([
                    'id', 'nama_lengkap', 'jabatan', 'kategori', 'sub_kategori', 'email', 'nomor_induk_pegawai', 'jenis_tiket',
                    'deskripsi', 'status', 'prioritas', 'assigned_to', 'kode_tiket',
                    'token_tiket', 'created_at', 'updated_at'
                ]);

                return response()->json([
                    'status'   => 'success true',
                    'data'     => $ticketPegawaiData,
                    'type'     => 'pegawai',
                ]);

        } elseif ($ticketPublik)
        {
            // Ambil data tiket publik tanpa unggah_file dan unggah_file_url
                $ticketPublikData = $ticketPublik->only([
                    'id', 'nama_lengkap', 'kategori', 'sub_kategori', 'email', 'jenis_tiket',
                    'deskripsi', 'status', 'prioritas', 'assigned_to', 'kode_tiket',
                    'token_tiket', 'created_at', 'updated_at'
                ]);

                return response()->json([
                    'status'   => 'success true',
                    'data'     => $ticketPublikData,
                    'type'     => 'publik',
                ]);

        } else
        {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tiket tidak ditemukan',
            ], 404);
        }
    }
}
