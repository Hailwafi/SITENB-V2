<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
        {
            // Validasi input
                $request->validate([
                'email'    => 'required|email|exists:users,email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Temukan pengguna berdasarkan email
                $user = DB::table('users')->where('email', $request->email)->first();

                if (!$user)
                {
                    return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
                }

            // Ubah password pengguna
                DB::table('users')->where('email', $request->email)->update([
                    'password' => Hash::make($request->password)
                ]);

            return response()->json(['message' => 'Password berhasil diubah.']);
    }
}
