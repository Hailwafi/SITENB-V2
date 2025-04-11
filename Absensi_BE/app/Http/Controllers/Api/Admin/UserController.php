<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Spatie\Permission\Models\Role; // ✅ Tambahkan ini!
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{

    public function index()
    {
        // Ambil semua pengguna
            $users = User::with('roles')
                ->when(request()->search, function($query)
                {
                    $query->where('username', 'like', '%' . request()->search . '%')
                        ->orWhere('email', 'like', '%' . request()->search . '%');
                })
                ->whereDoesntHave('roles', function($query)
                {
                    $query->where('name', 'admin');
                })
                ->orderBy('id', 'asc')
                ->paginate(10);

        // Tambahkan query string ke tautan pagination
            $users->appends(['search' => request()->search]);

        return new UserResource(true, 'List Data Users', $users);
 }

    public function store(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'username'  => 'required',
                'password'  => 'required'
            ]);

            if ($validator->fails()) 
            {
                return response()->json($validator->errors(), 422);
            }

            // Buat user baru
                $user = User::create([
                    'username' => $request->username,
                    'password' => bcrypt($request->password),
                    'role'     => 'user' // Simpan role default di database
                ]);

            // Tetapkan role otomatis ke user
                $defaultRole = 'user';
                $userRole    = Role::where('name', $defaultRole)->first();

                if (!$userRole) 
                {
                    return response()->json(['error' => 'Role "user" belum tersedia!'], 500);
                }

            // Assign role ke user
                $user->assignRole($userRole);

            // Tambahkan hanya izin yang diperbolehkan
                $allowedPermissions = [
                    'absens.absen',
                    'izin_sakits.store',
                    'izin_sakits.getMonthlyCounts',
                    'profiles.store',
                    'profiles.show',
                    'profiles.update'
                ];
                $user->givePermissionTo($allowedPermissions);

                return response()->json([
                    'success' => true,
                    'message' => 'User berhasil ditambahkan!',
                    'data'    => $user
                ], 201);
        }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with('roles')->whereId($id)->first();

        if($user)
        {
            //return success with Api Resource
            return new UserResource(true, 'Detail Data User!', $user);
        }

        //return failed with Api Resource
        return new UserResource(false, 'Detail Data User Tidak Ditemukan!', null);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'email'     => 'required|unique:users,email,' . $user->id,
            'username'  => 'required',
            'role'      => 'required',
            'password'  => 'nullable|confirmed' // Password bersifat opsional
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Update data pengguna
        $user->update([
            'email'     => $request->email,
            'username'  => $request->username,
            'role'      => $request->role,
            'password'  => $request->filled('password') ? bcrypt($request->password) : $user->password, // Hanya update password jika terisi
        ]);

        // Sinkronisasi role pengguna
        $user->syncRoles($request->role); // Pastikan hanya satu role yang disinkronkan

        // Mengembalikan respons
        return new UserResource(true, 'Data User Berhasil Diupdate!', $user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        if($user->delete())
        {
            //return success with Api Resource
            return new UserResource(true, 'Data User Berhasil Dihapus', null);
        }

        //return failed with Api Resource
        return new UserResource(false, 'Data User Gagal Dihapus!', null);
    }

    public function getStaffList()
    {
        // Ambil daftar staf yang memiliki role staf
        $staffList = User::select('id', 'username', 'email')
            ->where('role', 'staff') // Asumsikan role staf didefinisikan sebagai 'staf'
            ->get();

        if ($staffList->isEmpty())
        {
            return response()->json(['message' => 'Tidak ada staf yang ditemukan'], 404);
        }

        return response()->json(['staff' => $staffList], 200);
    }

    public function search(Request $request)
    {
        // Ambil query dari input
        $query = $request->input('query');

        // Cari user berdasarkan nama (username) atau email, lalu urutkan berdasarkan created_at (waktu pembuatan akun)
        $users = User::where('username', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%")
                    ->orderBy('created_at', 'asc') // Mengurutkan berdasarkan waktu pembuatan akun
                    ->get();

        // Format respons untuk hanya menampilkan no (list), username, role, dan aksi
        $formattedUsers = $users->map(function ($user, $index)
        {
            return [
                'no'       => $index + 1, // Nomor urut berdasarkan kapan akun dibuat
                'username' => $user->username,
                'role'     => $user->role,
                'aksi'     => '<button>Hapus</button>', // Tombol hapus (simulasi)
            ];
        });

        // Kembalikan hasil pencarian dalam format JSON
        return response()->json($formattedUsers);
    }
}
