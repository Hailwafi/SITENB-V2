<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Ticket;

class TicketAssignedNotification extends Notification
{
    private $ticket;
    private $type;

    /**
     * Constructor to initialize ticket and type.
     *
     * @param $ticket object (Can be instance of either Ticket or Publik)
     * @param $type string (Type of the ticket, either 'pegawai' or 'publik')
     */
    public function __construct($ticket, $type)
    {
        $this->ticket = $ticket;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        // URL yang berbeda untuk tiket pegawai dan publik
        $url = $this->type === 'pegawai' 
            ? url('/tickets/'.$this->ticket->id) 
            : url('/public-tickets/'.$this->ticket->id);

        return (new MailMessage)
                    ->line('Anda telah ditugaskan untuk menangani tiket ' . $this->type . '.')
                    ->action('Lihat Tiket', $url)
                    ->line('Terima kasih telah bekerja sama dengan kami!');
    }

    public function toArray($notifiable)
    {
        return [
            'ticket_id' => $this->ticket->id,
            'message'   => 'Anda telah ditugaskan untuk menangani tiket ' . $this->type . '.',
        ];
    }
}
