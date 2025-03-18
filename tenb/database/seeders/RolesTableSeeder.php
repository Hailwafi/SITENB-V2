<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesTableSeeder extends Seeder
{
    public function run(): void
    {
        Role::create([
            'name'       => 'admin',
            'guard_name' => 'api'
        ]);

        Role::create([
            'name'       => 'kepala_subbag',
            'guard_name' => 'api'
        ]);

        Role::create([
            'name'       => 'staff',
            'guard_name' => 'api'
        ]);
    }

        
}
