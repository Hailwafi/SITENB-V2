<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PengajuanTidakHadir extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_tidakhadir';

    protected $fillable = [
        'user_id',
        'nama',
        'jabatan',
        'tanggal_pembuatan',
        'tanggal_pengajuan',
        'jenis_pengajuan',
        'jenis_cuti',
        'catatan',
        'dokumen',
        'status',
        'alasan_penolakan',
    ];

    public function user()
        {
            return $this->belongsTo(User::class);
        }

    public function absen()
        {
            return $this->belongsTo(Absen::class);
        }
}