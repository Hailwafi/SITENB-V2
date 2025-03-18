<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index()
    // {
    //     // Ambil semua pengguna
    //         $users = User::with('roles') // Memuat relasi roles
    //             ->when(request()->search, function($query)
    //             {
    //                 $query->where('username', 'like', '%' . request()->search . '%')
    //                     ->orWhere('email', 'like', '%' . request()->search . '%'); // Pencarian berdasarkan username atau email
    //             })
    //             ->whereDoesntHave('roles', function($query) {
    //                 $query->where('name', 'admin'); // Tambahkan kondisi where untuk mengecualikan role 'admin'
    //             })
    //             ->orderBy('id', 'asc') // Mengurutkan berdasarkan ID secara ascending
    //             ->paginate(); // Menggunakan pagination

    //     // Tambahkan query string ke tautan pagination
    //         $users->appends(['search' => request()->search]);

    //     // Kembalikan dengan Api Resource
    //         return new UserResource(true, 'List Data Users', $users);
    // }

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

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'     => 'required|email|unique:users,email|regex:/@bnpt\.go\.id$/',            'username'  => 'required|string|unique:users,username',
            'role'      => 'required|string', // Pastikan role adalah string
            'password'  => 'required|string|confirmed|min:6', // Tambahkan validasi untuk keamanan
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 422);
        }

        // Buat pengguna baru
        $user = User::create([
            'email'     => $request->email,
            'username'  => $request->username,
            'password'  => bcrypt($request->password), // Enkripsi password
        ]);

        // Tetapkan role untuk pengguna
        $user->assignRole($request->role); // Gunakan $request->role

        // Setelah menyimpan role, simpan juga role ke database jika perlu
        $user->role = $request->role; // Simpan role di field role jika diperlukan
        $user->save();

        // Kembalikan respons sukses
        return new UserResource(true, 'Data User Berhasil Disimpan!', $user);
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
