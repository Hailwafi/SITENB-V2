<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ProofOfWork;
use App\Models\Ticket;
use App\Models\Publik;
use App\Http\Resources\ProofOfWorkResource;
use App\Notifications\NewProofOfWorkNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class ProofOfWorkController extends Controller
{
    public function store(Request $request, $ticketId)
    {
        $staff = $request->user();

        // Cek jumlah tiket yang ditugaskan ke staf
        $jumlahTiketPegawai = Ticket::where('assigned_to', $staff->id)->count();
        $jumlahTiketPublik = Publik::where('assigned_to', $staff->id)->count();
        $totalBuktiPengerjaan = ProofOfWork::where('staff_id', $staff->id)->count();
        $totalTugas = max(0, $jumlahTiketPegawai + $jumlahTiketPublik - $totalBuktiPengerjaan);

        // Cek apakah staf memiliki tugas yang tersisa
        if ($totalTugas <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Pengiriman bukti pengerjaan ditolak karena tidak ada tugas yang tersisa.',
            ], 400);
        }

        // Validasi input
        $request->validate([
            'tanggal'          => 'required|date',
            'bukti_pengerjaan' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'status'           => 'required|in:proses,selesai', // Validasi status
        ]);

        // Tentukan tipe tiket berdasarkan tabel tempat ID tiket ditemukan
        $ticket = Ticket::find($ticketId);
        $ticketType = 'TicketPegawai';

        if (!$ticket) {
            $ticket = Publik::find($ticketId);
            $ticketType = 'TicketPublik';
        }

        // Jika tiket tidak ditemukan, kembalikan error
        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak ditemukan atau belum dibuat.'
            ], 404);
        }

        // Simpan file bukti pengerjaan
        $filePath = $request->file('bukti_pengerjaan')->store('proof_of_work', 'public');

        // Buat bukti pengerjaan
        $proofOfWork = ProofOfWork::create([
            'ticket_id'        => $ticketId,
            'staff_name'       => $staff->username,
            'tanggal'          => $request->tanggal,
            'ticket_type'      => $ticketType, // Tipe tiket otomatis
            'bukti_pengerjaan' => $filePath,
            'staff_id'         => $staff->id,
            'status'           => $request->status // Simpan status
        ]);

        // Update status tiket jika bukti pengerjaan selesai
    if ($request->status === 'selesai') {
        $ticket->update(['status' => 'selesai']);
    }

        // Ambil user admin dan kepala subbag
        $admin_kepala_subbag = User::role(['admin', 'kepala_subbag'])->get();

        // Kirim notifikasi ke kepala subbag dan admin
        Notification::send($admin_kepala_subbag, new NewProofOfWorkNotification($proofOfWork));

        // Log untuk debugging (opsional)
        Log::info('Bukti pengerjaan berhasil dikirim', ['proof_of_work' => $proofOfWork]);

        return new ProofOfWorkResource(true, 'Bukti pengerjaan berhasil dikirim', $proofOfWork);
    }
}
