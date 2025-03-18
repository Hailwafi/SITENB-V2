<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\ProofOfWork;
use Illuminate\Notifications\Messages\MailMessage;

class NewProofOfWorkNotification extends Notification
{
    private $proofOfWork;

    public function __construct(ProofOfWork $proofOfWork)
    {
        $this->proofOfWork = $proofOfWork;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toMail($notifiable)
    {
        // Perbaikan pengecekan tipe tiket
        $ticketType = $this->proofOfWork->ticket_type === 'TicketPegawai' ? 'Tiket Pegawai' : 'Tiket Publik';

        return (new MailMessage)
                    ->line('Bukti pengerjaan baru telah dikirim oleh Staf untuk ' . $ticketType . '.')
                    // Gunakan route jika memungkinkan, atau pastikan URL sudah benar
                    ->action('Lihat Bukti Pengerjaan', url('/proof-of-work/'.$this->proofOfWork->id))
                    ->line('Terima kasih telah bekerja sama dengan kami!');
    }

    public function toArray($notifiable)
    {
        return [
            'proof_of_work_id' => $this->proofOfWork->id,
            'message'          => 'Bukti pengerjaan baru telah dikirim oleh Staf.',
            'ticket_type'      => $this->proofOfWork->ticket_type, // Tambahkan informasi jenis tiket
        ];
    }
}
