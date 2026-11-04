<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\EnsurePasswordChanged;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->throttleApi();
        $middleware->alias([
            'jwt' => JwtMiddleware::class,
            'admin' => AdminMiddleware::class,
            'password.changed' => EnsurePasswordChanged::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*'));

        // Conserve les vrais codes HTTP (403, 404, 429...) et évite d'exposer les noms de modèles.
        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $message = match ($e->getStatusCode()) {
                403 => $e->getMessage() ?: 'Accès non autorisé.',
                404 => 'Ressource introuvable.',
                405 => 'Méthode non autorisée.',
                429 => 'Trop de tentatives. Réessayez dans quelques instants.',
                default => null,
            };

            return $message
                ? response()->json(['message' => $message], $e->getStatusCode(), $e->getHeaders())
                : null;
        });
    })->create();
