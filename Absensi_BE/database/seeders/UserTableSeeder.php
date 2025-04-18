<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
            $admin = User::create([
                'username' => 'infosys',
                'email'    => 'heheh@bnpt.go.id',
                'role'     => 'admin',
                'password' => bcrypt('12345')
            ]);

            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole) 
            {
                $permissions = Permission::all();
                $adminRole->syncPermissions($permissions);
                $admin->assignRole($adminRole);
            }

        // User
            $user = User::create([
                'username' => 'yovi roinaldo',
                'email'    => null,
                'role'     => 'staff',
                'password' => bcrypt('54321')
            ]);

            $allowedPermissions = [
                'absens.absen',
                'pengajuan_tidakhadir.index',
                'pengajuan_tidakhadir.show',
                'pengajuan_tidakhadir.store',
                'pengajuan_tidakhadir.delete',
                'izin_sakits.store',
                'izin_sakits.getMonthlyCounts',
                'profiles.store',
                'profiles.show',
                'profiles.update'
            ];

            // Ambil izin dari database
                $permissions = Permission::whereIn('name', $allowedPermissions)->get();

                $userRole = Role::where('name', 'user')->first();

                if (!$userRole) 
                {
                    dd('Role "user" belum tersedia! Pastikan sudah menjalankan RolesTableSeeder.');
                }

            // Berikan izin ke role user
                $userRole->syncPermissions($permissions);

            // Assign role ke user
                $user->assignRole($userRole);
    }
}
