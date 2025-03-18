<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserTableSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'email'         => 'hehe@bnpt.go.id',
            'username'      => 'infosys',
            'role'          => 'admin',
            'password'      => Hash::make(env('ADMIN_PASSWORD', '3321')),
        ]);

        $role = Role::find(1);
        $permissions = Permission::all();
        $role->syncPermissions($permissions);
        $user = User::find(1);
        $user->assignRole($role->name);

        // Kepala Subbag
        User::create([
            'email'         => 'haha@bnpt.go.id',
            'username'      => 'gemilang_parhadiyan',
            'role'          => 'kepala subbag',
            'password'      => Hash::make(env('KEPALA_SUBBAG_PASSWORD', 'psikolog5tu')),
        ]);

        $role = Role::find(2);
        $permissions = Permission::whereIn('name', [
            'posts.index',
            'posts.create',
            'posts.edit',
            'posts.delete',
            'permissions.index',
            'roles.index',
            'roles.create',
            'roles.edit',
            'roles.delete',
            'categories.index',
            'categories.create',
            'categories.edit',
            'categories.delete',
            'tickets.index',
            'tickets.create',
            'tickets.update',
            'tickets.delete',
            'tickets.update-status',
            'tickets.assign-ticket',
            'tickets.get-new-pegawai-tickets',
            'tickets.search',
            'publiks.index',
            'publiks.create',
            'publiks.update',
            'publiks.delete',
            'publiks.update-status',
            'publiks.assign-publik',
            'publiks.get-new-publik-publiks',
            'publiks.search',
            // tambahkan permission lainnya
        ])->get();
        $role->syncPermissions($permissions);
        $user = User::find(2);
        $user->assignRole($role->name);

        // Staff
        $staffData = [
            [
                'email'    => 'alamak@bnpt.go.id',
                'username' => 'yovi_roinaldo',
                'role'     => 'staff',
                'password' => Hash::make(env('STAFF_PASSWORD', 'datacenter')),
            ],
            [
                'email'    => 'kaka@bnpt.go.id',
                'username' => 'dini_hariyani',
                'role'     => 'staff',
                'password' => Hash::make(env('STAFF_PASSWORD_2', 'biwara')),
            ],
            [
                'email'    => 'cihuy@bnpt.go.id',
                'username' => 'stepanus_andy',
                'role'     => 'staff',
                'password' => Hash::make(env('STAFF_PASSWORD_3', 'siber')),
            ],
            [
                'email'    => 'ciee@bnpt.go.id',
                'username' => 'andre_rizki',
                'role'     => 'staff',
                'password' => Hash::make(env('STAFF_PASSWORD_4', 'biologi')),
            ],
            [
                'email'    => 'pahlawankesiangan@bnpt.go.id',
                'username' => 'rizky_pahlawan',
                'role'     => 'staff',
                'password' => Hash::make(env('STAFF_PASSWORD_5', 'pildunasik')),
            ],
        ];

        $role = Role::findByName('staff', 'api');
        $permissions = Permission::whereIn('name', [
            'tickets.update-status',
            'tickets.search',
            'publiks.update-status',
            'publiks.search',
            'proof_of_works.create',
        ])->get();
        $role->syncPermissions($permissions);

        foreach ($staffData as $staff)
        {
            $user = User::create($staff);
            $user->assignRole($role->name);
        }
    }
}
