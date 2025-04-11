<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function store(Request $request)
        {
            try 
            {
                $user = Auth::user();
                if (!$user) 
                {
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                Log::info('Request data:', $request->all());

                $request->validate([
                    'phone'   => 'nullable|string',
                    'photo'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                // Upload foto jika ada
                    $path = $request->hasFile('photo') 
                        ? $request->file('photo')->store('profile_photos', 'public') 
                        : null;

                    if ($user->role === 'admin') 
                    {
                        // Admin hanya boleh mengubah phone dan foto
                            $profile = Profile::updateOrCreate(
                            ['user_id' => $user->id],
                            [
                                'phone'   => $request->phone ?? null,
                                'photo'   => $path,
                                'email'   => $user->email, 
                                'jabatan' => $user->profile->jabatan ?? null, // Tetap tampilkan jabatan jika ada
                            ]
                        );
                } else {
                    // Validasi tambahan untuk user
                        $request->validate([
                            'email'   => 'nullable|email|unique:users,email,' . $user->id,
                            'jabatan' => 'nullable|string',
                        ]);

                    // Simpan email di tabel users jika diisi
                        if ($request->filled('email')) 
                        {
                            $user->update(['email' => $request->email]);
                        }

                        $profile = Profile::updateOrCreate(
                            ['user_id' => $user->id],
                            [
                                'jabatan' => $request->jabatan ?? $user->profile->jabatan ?? null,
                                'phone'   => $request->phone ?? null,
                                'photo'   => $path,
                                'email'   => $user->email,
                            ]
                        );
                }

                return response()->json([
                    'message'  => 'Profile berhasil dibuat!',
                    'email'    => $profile->email,
                    'jabatan'  => $profile->jabatan,
                    'phone'    => $profile->phone,
                    'photo'    => $profile->photo ? asset('storage/' . $profile->photo) : null,
                ]);

            } catch (\Exception $e) 
            {
                Log::error('Error saat menyimpan profil: ' . $e->getMessage());
                return response()->json(['error' => 'Terjadi kesalahan pada server'], 500);
            }
        }

    public function show()
        {
            $user = Auth::user();
            $profile = $user->profile ?? new Profile();

            return response()->json([
                'username' => $user->username,
                'email'    => $profile->email ?? $user->email,
                'jabatan'  => $profile->jabatan ?? '',
                'phone'    => $profile->phone ?? '',
                'photo'    => $profile->photo ? asset('storage/' . $profile->photo) : null,
            ]);
        }

    public function update(Request $request)
        {
            try 
            {
                $user = Auth::user();
                if (!$user) 
                {
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $validator = Validator::make($request->all(), [
                    'phone'   => 'nullable|string',
                    'photo'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                    'email'   => 'nullable|email|unique:users,email,' . $user->id,
                    'jabatan' => 'nullable|string',
                ]);

                if ($validator->fails()) 
                {
                    return response()->json(['errors' => $validator->errors()], 422);
                }

                // Update email di tabel users jika ada input baru
                    if ($request->filled('email')) 
                    {
                        $user->update(['email' => $request->email]);
                    }

                    $profile = Profile::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'phone'   => $request->has('phone') ? $request->phone : Profile::where('user_id', $user->id)->value('phone'),
                            'jabatan' => $request->has('jabatan') ? $request->jabatan : Profile::where('user_id', $user->id)->value('jabatan'),
                            'email'   => $user->email, 
                        ]
                    );

                // Update foto jika ada file baru
                    if ($request->hasFile('photo')) 
                    {
                        if ($profile->photo && Storage::disk('public')->exists($profile->photo)) 
                        {
                            Storage::disk('public')->delete($profile->photo);
                        }
                        $newPhotoPath = $request->file('photo')->store('profile_photos', 'public');
                        $profile->update(['photo' => $newPhotoPath]);
                    }

                return response()->json([
                    'message' => 'Profile berhasil diperbarui!',
                    'email'   => $profile->email,
                    'jabatan' => $profile->jabatan,
                    'phone'   => $profile->phone,
                    'photo'   => $profile->photo ? asset('storage/' . $profile->photo) : null,
                ]);

            } catch (\Exception $e) 
            {
                Log::error('Error saat mengupdate profil: ' . $e->getMessage());
                return response()->json(['error' => 'Terjadi kesalahan pada server'], 500);
            }
        }
}
