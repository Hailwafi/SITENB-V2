<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketCode extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $isPublic;

    /**
     * Create a new message instance.
     *
     * @param mixed $ticket
     * @param bool $isPublic
     */
    public function __construct($ticket, $isPublic = false)
    {
        $this->ticket = $ticket;
        $this->isPublic = $isPublic;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = $this->isPublic ? 'Kode Tiket Publik Anda' : 'Kode Tiket Pegawai Anda';

        return $this->view('emails.ticket_code')
                    ->subject($subject)
                    ->with([
                        'kode_tiket'   => $this->ticket->kode_tiket,
                        'token_tiket'  => $this->ticket->token_tiket,
                        'nama_lengkap' => $this->ticket->nama_lengkap,
                        'tanggal'      => $this->ticket->created_at->format('d M Y'),
                    ]);
    }
}
