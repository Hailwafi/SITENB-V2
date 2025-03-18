<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket; // Model untuk Tiket Pegawai
use App\Models\Publik; // Model untuk Tiket Publik
use Illuminate\Support\Facades\Auth;

class StaffTicketController extends Controller
{
    public function index()
    {
        // Mendapatkan ID staf yang sedang login
        $staffId = Auth::id();

        // Mendapatkan tiket pegawai yang ditugaskan ke staf yang sedang login
        $tiketPegawai = Ticket::where('assigned_to', $staffId)
            ->select('id', 'nama_lengkap', 'email', 'jabatan', 'kategori', 'jenis_tiket', 'prioritas', 'status')
            ->get();

        // Mendapatkan tiket publik yang ditugaskan ke staf yang sedang login
        $tiketPublik = Publik::where('assigned_to', $staffId)
            ->select('id', 'nama_lengkap', 'email', 'kategori', 'jenis_tiket', 'prioritas', 'status')
            ->get();

        // Gabungkan tiket pegawai dan tiket publik dalam satu response
        $allTickets = [
            'tiket_pegawai' => $tiketPegawai,
            'tiket_publik' => $tiketPublik
        ];

        // Response dengan format success true
        return response()->json([
            'success' => true,
            'message' => 'Tiket yang ditugaskan kepada staf berhasil masuk',
            'data' => $allTickets
        ], 200);
    }
}
