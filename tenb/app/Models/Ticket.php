<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;
    protected $table = 'tickets';

    protected $fillable = [
        'nama_lengkap', 
        'jabatan', 
        'kategori', 
        'sub_kategori', 
        'email', 
        'nomor_induk_pegawai',
        'jenis_tiket', 
        'deskripsi', 
        'unggah_file',
        'status',
        'prioritas',
        'assigned_to',
        'kode_tiket',
        'token_tiket'
    ];

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

// Relasi ke model User untuk assigned staff
    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function proofOfWorks()
    {
        return $this->hasMany(ProofOfWork::class);
    }
}