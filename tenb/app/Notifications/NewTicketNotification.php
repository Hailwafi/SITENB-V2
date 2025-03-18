<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewTicketNotification extends Notification
{
    private $ticket;

    public function __construct($ticket)
    {
        $this->ticket = $ticket;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $url = $this->ticket instanceof \App\Models\Publik 
            ? url('/public-tickets/'.$this->ticket->id)
            : url('/tickets/'.$this->ticket->id);

        return (new MailMessage)
                    ->line('Ada tiket baru yang diajukan.')
                    ->action('Lihat Tiket', $url)
                    ->line('Terima kasih telah bekerja sama dengan kami!');
    }

    public function toArray($notifiable)
    {
        return [
            'ticket_id' => $this->ticket->id,
            'message'   => 'Ada tiket baru yang diajukan.',
        ];
    }
}