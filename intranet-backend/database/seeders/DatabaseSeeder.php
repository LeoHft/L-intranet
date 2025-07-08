<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'admin',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ]
        );

        DB::table('categories')->insertOrIgnore(
            ['name' => 'Multimédia'],
            [
            'description' => "Tout ce qui est multimédia",
            'created_at' => now(),
            'updated_at' => now(),
            ]
        );

        DB::table('status')->insertOrIgnore([
            'name' => 'UP',
            'description' => 'Le service est accessible',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('services')->insertOrIgnore([
            [
            'name' => 'test service',
            'description' => 'test service description',
            'internal_url' => 'http://localhost:8000',
            'external_url' => 'https://testservice.com',
            'image_url' => 'http://localhost:8088/storage/images/no-image-available.jpg',
            'status_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
            ]
        ]);

        DB::table('services_access')->insertOrIgnore([
            [
                'user_id' => 1,
                'service_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        DB::table('categories_services')->insertOrIgnore([
            [
                'service_id' => 1,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

    }
}
