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
                'id' => 1,
                'name' => 'admin',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ]
        );

        DB::table('categories')->insertOrIgnore([
            'id' => 1,
            'name' => 'Multimédia',
            'description' => "Tout ce qui est multimédia",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('status')->insertOrIgnore([
            'id' => 1,
            'name' => 'UP',
            'description' => 'Le service est accessible',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('services')->insertOrIgnore([
            [
            'id' => 1,
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

        // On vérifie si la relation service-user existe déjà
        $serviceAccessExists = DB::table('services_access')
            ->where('user_id', 1)
            ->where('service_id', 1)
            ->exists();

        if (!$serviceAccessExists) {
            DB::table('services_access')->insert([
                'user_id' => 1,
                'service_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // On vérifie si la relation service-catégorie existe déjà
        $categoryServiceExists = DB::table('categories_services')
            ->where('service_id', 1)
            ->where('category_id', 1)
            ->exists();

        if (!$categoryServiceExists) {
            DB::table('categories_services')->insert([
                'service_id' => 1,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

    }
}
