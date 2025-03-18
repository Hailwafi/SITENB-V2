<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTicketMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;
    protected $publik_id; // Tambahkan ini jika pesan berasal dari tiket publik

    // Konstruktor untuk menyimpan pesan
    public function __construct($message, $publik_id = null)
    {
        $this->message = $message;
        $this->publik_id = $publik_id; // Menyimpan publik_id jika ada
    }

    // Menentukan saluran notifikasi yang digunakan
    public function via($notifiable)
    {
        return ['database']; // Anda bisa menambahkan 'mail' jika ingin mengirim email
    }

    // Menentukan data yang akan disimpan dalam notifikasi
    public function toArray($notifiable)
    {
        return [
            'ticket_id'  => $this->message->ticket_id ?? null, // Hanya jika ada
            'publik_id'  => $this->publik_id, // Menyimpan publik_id jika ada
            'email'      => $this->message->email, // Menyimpan email pengirim
            'message'    => $this->message->message,
            'created_at' => $this->message->created_at,
        ];
    }

    // Jika Anda ingin menambahkan notifikasi melalui email
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Pesan Baru untuk Tiket #' . ($this->message->ticket_id ?? $this->publik_id))
            ->line('Anda menerima pesan baru untuk tiket berikut:')
            ->line('Pesan: ' . $this->message->message)
            ->action('Lihat Tiket', url('/tickets/' . ($this->message->ticket_id ?? $this->publik_id)))
            ->line('Terima kasih telah menggunakan sistem kami!');
    }
}
