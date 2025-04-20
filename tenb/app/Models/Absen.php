<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Absen extends Model
{
    use HasFactory;

    protected $table = 'absens'; 

    protected $fillable = [
        'user_id',
        'status',
        'waktu_absen',
        'keterangan',
        'latitude',
        'longitude',
        'is_valid_location',
        'foto_path',
    ];

    public function user()
        {
            return $this->belongsTo(User::class);
        }

    public function pengajuantidakhadir()
        {
            return $this->belongsTo(PengajuanTidakHadir::class);
        }

    public function getWaktuAbsenAttribute($value)
        {
            return Carbon::parse($value)->timezone('Asia/Jakarta')->toDateTimeString();
        }
}



