<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    protected $guard_name = 'api';

    protected $fillable = [
        'email',
        'username',
        'role',
        'password',  // Hapus 'role' dari fillable
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Custom method to get permissions as an array
    public function getPermissionArray() {
        return $this->getAllPermissions()->pluck('name')->toArray(); // Ganti pluck 'role' dengan 'name'
    }

    /** Get JWT identifier */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /** Get JWT custom claims */
    public function getJWTCustomClaims() {
        // Jika Anda ingin menambahkan role ke dalam klaim JWT, tambahkan di sini
        return [
            'role' => $this->getRoleNames(), // Klaim custom untuk JWT
        ];
    }

    // Relasi ke tiket yang ditugaskan kepada pengguna
    public function assignedTickets()
    {
        return $this->hasMany(Ticket::class, 'assigned_to');
    }

    // Jika pengguna juga bisa membuat tiket, aktifkan relasi ini
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id', 'id');
    }

    public function publiks()
    {
        return $this->hasMany(Publik::class, 'user_id', 'id');
    }

    public function absens()
    {
        return $this->hasMany(Absen::class);
    }

    public function pengajuanTidakHadir()
    {
        return $this->hasMany(PengajuanTidakHadir::class);
    }
}
