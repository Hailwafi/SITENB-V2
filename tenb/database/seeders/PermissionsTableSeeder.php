<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
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

        //permission for tickets
        Permission::create(['name' => 'tickets.index', 'guard_name'                     => 'api']);
        Permission::create(['name' => 'tickets.create', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'tickets.update', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'tickets.delete', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'tickets.update-status', 'guard_name'             => 'api']);
        Permission::create(['name' => 'tickets.assign-ticket', 'guard_name'             => 'api']);
        Permission::create(['name' => 'tickets.get-new-pegawai-tickets', 'guard_name'   => 'api']);
        Permission::create(['name' => 'tickets.search', 'guard_name'                    => 'api']);

        //permission for publiks
        Permission::create(['name' => 'publiks.index', 'guard_name'                     => 'api']);
        Permission::create(['name' => 'publiks.create', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'publiks.update', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'publiks.delete', 'guard_name'                    => 'api']);
        Permission::create(['name' => 'publiks.update-status', 'guard_name'             => 'api']);
        Permission::create(['name' => 'publiks.assign-publik', 'guard_name'             => 'api']);
        Permission::create(['name' => 'publiks.get-new-publik-publiks', 'guard_name'    => 'api']);
        Permission::create(['name' => 'publiks.search', 'guard_name'                    => 'api']);


        //permission for proof of works
        Permission::create(['name' => 'proof_of_works.create', 'guard_name' => 'api']);
    }
}