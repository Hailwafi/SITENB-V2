<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProofOfWork extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'staff_name',
        'ticket_type',
        'nama_lengkap',
        'bukti_pengerjaan',
        'tanggal',
        'staff_id',
        'status'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function publik()
    {
        return $this->belongsTo(Publik::class, 'ticket_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id'); // Pastikan relasi staff_id benar
    }
}
