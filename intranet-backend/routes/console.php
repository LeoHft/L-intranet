<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Str;

Artisan::command('intranet:reset-password {email}', function (string $email) {
    $user = User::firstWhere('email', $email);

    if (! $user) {
        $this->error("Aucun utilisateur avec l'adresse {$email}.");

        return 1;
    }

    $password = Str::password(20, symbols: false);
    $user->resetPassword($password, mustChange: true);

    $this->info("Mot de passe temporaire de {$email} : {$password}");
    $this->line('Il devra être changé à la prochaine connexion.');

    return 0;
})->purpose("Réinitialise le mot de passe d'un utilisateur (accès administrateur perdu)");

Schedule::call(function () {
    Log::info('HeartBeat executé à : '.now());
})->hourly();
