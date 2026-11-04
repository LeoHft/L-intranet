<?php

return [
    // Compte administrateur créé au tout premier démarrage (voir DatabaseSeeder).
    'admin_email' => env('ADMIN_EMAIL', 'admin@example.com'),
    'admin_password' => env('ADMIN_PASSWORD'),

    'max_shortcuts_per_user' => 10,
];
