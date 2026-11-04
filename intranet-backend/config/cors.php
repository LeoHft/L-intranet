<?php

// Le frontend et l'API sont servis sur la même origine par nginx : aucun autre site n'a besoin
// d'appeler l'API. Pour en autoriser un, renseigner CORS_ALLOWED_ORIGINS (séparés par des virgules).
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter(explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
