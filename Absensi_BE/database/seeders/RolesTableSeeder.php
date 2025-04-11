<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!Role::where('name', 'admin')->where('guard_name', 'api')->exists()) {
            Role::create([
                'name'       => 'admin',
                'guard_name' => 'api'
            ]);
        }

        if (!Role::where('name', 'user')->where('guard_name', 'api')->exists()) {
            Role::create([
                'name'       => 'user',
                'guard_name' => 'api'
            ]);
        }
    }
}
