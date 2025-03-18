<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProofOfWork;
use App\Models\User;

class StaffController extends Controller
{
        public function getStaffTasks($staffId)
    {
        // Ambil data staff berdasarkan ID
            $staff = User::where('id', $staffId)->where('role', 'staff')->first();

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staf tidak ditemukan atau bukan role staf.',
                ], 404);
            }

        // Ambil semua bukti pengerjaan terkait staff
            $tasks = ProofOfWork::where('staff_id', $staffId)
                ->get()
                ->map(function ($task)
                {
                    $baseUrl = url('/');

                    if ($task->ticket_type === 'TicketPegawai')
                    {
                        return [
                            'tanggal'          => $task->tanggal,
                            'bukti_pengerjaan' => $task->bukti_pengerjaan ? asset('storage/proof_of_work/' . basename($task->bukti_pengerjaan)) : null,
                            'kategori'         => $task->ticket->kategori ?? 'N/A',
                            'jenis_tiket'      => $task->ticket->jenis_tiket ?? 'N/A',
                            'status'           => $task->ticket->status ?? 'N/A',
                        ];
                    } elseif ($task->ticket_type === 'TicketPublik')
                    {
                        return [
                            'tanggal'          => $task->tanggal,
                            'bukti_pengerjaan' => $task->bukti_pengerjaan ? asset('storage/proof_of_work/' . basename($task->bukti_pengerjaan)) : null,
                            'kategori'         => $task->publik->kategori ?? 'N/A',
                            'jenis_tiket'      => $task->publik->jenis_tiket ?? 'N/A',
                            'status'           => $task->publik->status ?? 'N/A',
                        ];
                    }

                return null;
                });

        // Total tugas
            $totalTugas = $tasks->count();

            return response()->json([
                'success'    => true,
                'judul'      => 'Detail Staff ' . $staff->username,
                'total_tugas'=> $totalTugas,
                'data'       => $tasks->filter(),
]);
}
}
