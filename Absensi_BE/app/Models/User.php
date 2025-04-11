<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile()
{
    return $this->hasOne(Profile::class, 'user_id');
}


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
}
