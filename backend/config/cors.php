<?php

$allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

if ($envOrigins = env('ALLOWED_ORIGINS')) {
    $allowedOrigins = array_merge($allowedOrigins, explode(',', $envOrigins));
}

// Permitir dinámicamente cualquier subdominio de onrender.com o vercel.app para evitar problemas de CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    $host = parse_url($origin, PHP_URL_HOST);
    if ($host && (str_ends_with($host, '.onrender.com') || str_ends_with($host, '.vercel.app'))) {
        $allowedOrigins[] = $origin;
    }
}

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_unique($allowedOrigins)),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
