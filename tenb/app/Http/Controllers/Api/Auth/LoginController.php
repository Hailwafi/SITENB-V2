<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use NoCaptcha\Facades\NoCaptcha;

class LoginController extends Controller
{
    public function index(Request $request)
    {
        // Validasi data, sesuaikan apakah ingin login menggunakan email atau username
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Tambahkan validasi reCAPTCHA jika diaktifkan di .env
        if (config('app.recaptcha_enabled'))
        {
            $validator->after(function ($validator) use ($request)
            {
                $recaptchaResponse = $request->input('g-recaptcha-response');

                if (!$recaptchaResponse || !NoCaptcha::verifyResponse($recaptchaResponse))
                {
                    $validator->errors()->add('g-recaptcha-response', 'ReCAPTCHA validation failed.');
                }
            });
        }

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Cek apakah login menggunakan email atau username
        $credentials = $request->only( 'username', 'password');

        if (!$token = auth()->guard('api')->attempt($credentials))
        {
            return response()->json([
                'success' => false,
                'message' => 'Username atau Password salah',
            ], 400);
        }

        $user = auth()->guard('api')->user();

        // Ambil role pengguna
        $role = $user->getRoleNames()->first();

        // Perbarui token JWT dengan role yang terbaru
        $customClaims = ['role' => $role];
        $token = auth()->guard('api')->claims($customClaims)->refresh(); // Menggunakan fromUser dengan custom claims

        return response()->json([
            'success'     => true,
            'user'        => $user->only(['username']),
            'role'        => $role,
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'token'       => $token,
        ], 200);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ], 200);
    }
}
