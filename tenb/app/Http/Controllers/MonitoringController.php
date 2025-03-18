<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use App\Models\Publik;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function pantauPekerjaan()
    {
        // Ambil semua staf dengan ID yang dimulai dari 3
            $staffs = User::where('role', 'staff')->where('id', '>=', 3)->get();

            $formattedStaffs = $staffs->map(function ($staff)
            {
                // Hitung total tugas tiket pegawai yang ditugaskan ke staf ini
                    $totalTugasPegawai = Ticket::where('assigned_to', $staff->id)->count();

                // Hitung total tugas tiket publik yang ditugaskan ke staf ini
                    $totalTugasPublik = Publik::where('assigned_to', $staff->id)->count();

                // Total tugas adalah jumlah dari tiket pegawai dan tiket publik
                    $totalTugas = $totalTugasPegawai + $totalTugasPublik;

                return [
                    'nama'       => $staff->username,
                    'total_tugas'=> $totalTugas, // Total tugas yang ditugaskan
                    'staff_id'   => $staff->id
                ];
            });

        return response()->json($formattedStaffs);
    }
}
