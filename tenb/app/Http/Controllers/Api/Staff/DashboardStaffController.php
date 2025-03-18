<?php

namespace App\Http\Controllers\Api\Staff;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Ticket;
use App\Models\Publik;
use App\Models\ProofOfWork;

class DashboardStaffController extends Controller
{
    public function getStaffDashboard()
    {
        $staff = Auth::user();

        // Total tiket pegawai dan tiket publik yang ditugaskan ke staf ini
            $jumlahTiketPegawai = Ticket::where('assigned_to', $staff->id)->count();
            $jumlahTiketPublik = Publik::where('assigned_to', $staff->id)->count();

        // Total tiket keseluruhan (pegawai + publik)
            $totalTiket = $jumlahTiketPegawai + $jumlahTiketPublik;

        // Total bukti pengerjaan yang sudah dikirim oleh staf ini
            $totalBuktiPengerjaan = ProofOfWork::where('staff_id', $staff->id)->count();

        // Menghitung total tugas yang ditugaskan (tiket yang belum memiliki bukti pengerjaan)
            $totalTugas = max(0, $totalTiket - $totalBuktiPengerjaan);

            return response()->json([
                'success'                   => true,
                'judul'                     => 'Dashboard Staff ' . $staff->username,
                'total_tiket'               => $totalTiket,
                'jumlah_tiket_pegawai_bnpt' => $jumlahTiketPegawai,
                'jumlah_tiket_publik'       => $jumlahTiketPublik,
                'total_tugas'               => $totalTugas,
                'tiket_selesai'             => $totalBuktiPengerjaan,
            ]);
    }
}
