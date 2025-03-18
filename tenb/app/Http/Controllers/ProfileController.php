<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

    public function getProfile()
        {
            $user = Auth::user();
            $profile_picture_url = $user->profile_picture ? Storage::url($user->profile_picture) : 'No Profile Picture';

            return response()->json([
                'status' => 'success true',
                'data'  => [
                    'username'            => $user->username,
                    'email'               => $user->email,
                    'role'                => $user->role,
                    'profile_picture_url' => $profile_picture_url,
                ]
            ]);
        }

// Mengganti foto profil pengguna
    public function changeProfilePicture(Request $request)
        {
                $request->validate([
                    'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:500000',
                ]);

                $user = Auth::user();

            // Hapus gambar lama jika ada
                if ($user->profile_picture)
                {
                    Storage::disk('public')->delete($user->profile_picture);
                }

            // Simpan gambar baru
                $path = $request->file('profile_picture')->store('profile_pictures', 'public');
                $user->profile_picture = $path;
                $user->save();

                $profile_picture_url = Storage::url($path);

            return response()->json([
                'status'              => 'success true',
                'message'             => 'Profile berhasil diubah',
                'profile_picture_url' => $profile_picture_url,
            ]);
        }

public function deleteProfilePictureById($userId)
        {
            $user = User::find($userId);

            if (!$user)
            {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'User tidak ditemukan.',
                ], 404);
            }

            if ($user->profile_picture)
            {
                Storage::disk('public')->delete($user->profile_picture);
                $user->profile_picture = null;
                $user->save();

                return response()->json([
                    'status'  => 'success true',
                    'message' => 'Foto profil berhasil dihapus untuk user dengan ID ' . $userId,
                ]);
            }

            return response()->json([
                'status'  => 'error',
                'message' => 'User tidak memiliki foto profil.',
            ], 404);
        }

}
