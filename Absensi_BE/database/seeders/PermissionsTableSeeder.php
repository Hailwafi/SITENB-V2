<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //permission for users
        Permission::create(['name' => 'users.index', 'guard_name'  => 'api']);
        Permission::create(['name' => 'users.create', 'guard_name' => 'api']);
        Permission::create(['name' => 'users.edit', 'guard_name'   => 'api']);
        Permission::create(['name' => 'users.delete', 'guard_name' => 'api']);


        // permission for posts
        Permission::create(['name' => 'posts.index', 'guard_name'  => 'api']);
        Permission::create(['name' => 'posts.create', 'guard_name' => 'api']);
        Permission::create(['name' => 'posts.edit', 'guard_name'   => 'api']);
        Permission::create(['name' => 'posts.delete', 'guard_name' => 'api']);

        //permission for permissions
        Permission::create(['name' => 'permissions.index', 'guard_name' => 'api']);

        //permission for roles
        Permission::create(['name' => 'roles.index', 'guard_name'  => 'api']);
        Permission::create(['name' => 'roles.create', 'guard_name' => 'api']);
        Permission::create(['name' => 'roles.edit', 'guard_name'   => 'api']);
        Permission::create(['name' => 'roles.delete', 'guard_name' => 'api']);

        //permission for categories
        Permission::create(['name' => 'categories.index', 'guard_name'  => 'api']);
        Permission::create(['name' => 'categories.create', 'guard_name' => 'api']);
        Permission::create(['name' => 'categories.edit', 'guard_name'   => 'api']);
        Permission::create(['name' => 'categories.delete', 'guard_name' => 'api']);
        
        //permission for absens
        Permission::create(['name' => 'absens.absen', 'guard_name'        => 'api']);

        //permission for pengajuan cuti/izin/lembur
        Permission::create(['name' => 'pengajuan_tidakhadir.index', 'guard_name'      => 'api']);
        Permission::create(['name' => 'pengajuan_tidakhadir.show', 'guard_name'       => 'api']);
        Permission::create(['name' => 'pengajuan_tidakhadir.store', 'guard_name'      => 'api']);
        Permission::create(['name' => 'pengajuan_tidakhadir.delete', 'guard_name'     => 'api']);
        Permission::create(['name' => 'pengajuan_tidakhadir.verifikasi', 'guard_name' => 'api']);

        //permission for izin/sakits
        Permission::create(['name' => 'izin_sakits.store', 'guard_name'            => 'api']);
        Permission::create(['name' => 'izin_sakits.getMonthlyCounts', 'guard_name' => 'api']);
        
        //permission for profiles
        Permission::create(['name' => 'profiles.store', 'guard_name'  => 'api']);
        Permission::create(['name' => 'profiles.show', 'guard_name'   => 'api']);
        Permission::create(['name' => 'profiles.update', 'guard_name' => 'api']);            
        
    }
}
