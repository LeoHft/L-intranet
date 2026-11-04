<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Services;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Exécuté à chaque démarrage du conteneur, mais n'agit que sur une base vide :
     * les éléments supprimés par l'administrateur ne doivent jamais réapparaître.
     */
    public function run(): void
    {
        if (User::exists()) {
            return;
        }

        $email = config('intranet.admin_email');
        $configuredPassword = config('intranet.admin_password');
        $password = $configuredPassword ?: Str::password(20, symbols: false);

        $admin = new User(['name' => 'admin', 'email' => $email, 'password' => $password, 'is_admin' => true]);
        $admin->must_change_password = true;
        $admin->save();

        if (! $configuredPassword) {
            $this->command?->warn("Compte administrateur créé : {$email} / {$password}");
        }

        $category = Categories::create(['name' => 'Multimédia', 'description' => 'Tout ce qui est multimédia']);

        $up = Status::create(['name' => 'UP', 'description' => 'Le service est accessible']);
        Status::create(['name' => 'DOWN', 'description' => 'Le service est inaccessible']);

        $service = Services::create([
            'name' => 'Service exemple',
            'description' => "Un service d'exemple, à modifier ou à supprimer depuis l'administration.",
            'internal_url' => 'http://192.168.1.10:8080',
            'external_url' => 'https://example.com',
            'image_url' => Services::DEFAULT_IMAGE,
            'status_id' => $up->id,
        ]);
        $service->categories()->attach($category);
        $service->users()->attach($admin);
    }
}
