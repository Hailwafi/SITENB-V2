<?php

// ForgotPasswordController.php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;

class ForgotPasswordController extends Controller
{
    // Mengirim token reset password ke email
        public function sendResetLinkEmail(Request $request)
            {
                $request->validate(['email' => 'required|email']);

                // Cari user berdasarkan email
                    $user = DB::table('users')->where('email', $request->email)->first();

                if (!$user) 
                {
                    return response()->json(['message' => 'Email tidak ditemukan'], 404);
                }

                // Buat token reset password
                    $token = mt_rand(100000, 999999);

                // Simpan token ke database atau perbarui jika sudah ada
                    DB::table('password_reset_tokens')->updateOrInsert(
                        ['email' => $request->email],
                        [
                            'token' => $token,
                            'created_at' => now(),
                        ]
                    );

                // Kirim email dengan token reset password
                    Mail::raw("Token reset password Anda adalah: $token", function ($message) use ($request) 
                    {
                        $message->to($request->email)
                            ->subject('Reset Password');
                    });

                return response()->json(['message' => 'Token reset password telah dikirim ke email Anda.'], 200);
            }

    // Verifikasi token reset password
        public function verifyResetToken(Request $request)
            {
                $request->validate(['token' => 'required|string']);

                // Ambil data token dari tabel
                    $tokenData = DB::table('password_reset_tokens')->where('token', $request->token)->first();

                // Periksa apakah token valid dan belum kedaluwarsa (60 menit masa berlaku)
                    if (!$tokenData || Carbon::parse($tokenData->created_at)->addMinutes(60)->isPast()) 
                    {
                        return response()->json(['message' => 'Token tidak valid atau sudah kedaluwarsa.'], 404);
                    }

                return response()->json(['message' => 'Token valid. Silakan masukkan password baru.'], 200);
            }
}
