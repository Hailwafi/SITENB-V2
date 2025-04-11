<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class IzinSakit extends Model 
{
    use HasFactory;

    protected $table = 'izin_sakits';

    protected $fillable = [
        'user_id',
        'jenis', 
        'keterangan'
    ];

    public function user() 
        {
            return $this->belongsTo(User::class);
        }

    // Fungsi untuk menghitung jumlah izin/sakit dalam bulan ini
        public static function countThisMonth($jenis)
            {
                return self::where('jenis', $jenis)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();
            }
}
