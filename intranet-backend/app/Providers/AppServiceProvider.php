<?php

namespace App\Providers;

use App\Support\AuthCookie;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Http\Parser\Cookies;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Password::defaults(fn () => Password::min(12));

        // Le token n'est lu que dans le cookie httpOnly. Par défaut, jwt-auth l'accepte aussi dans
        // l'en-tête Authorization, l'URL (?token=) ou le corps de la requête.
        $this->app->make('tymon.jwt.parser')->setChain([(new Cookies(false))->setKey(AuthCookie::NAME)]);

        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(240)->by($request->ip()));

        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(5)->by(mb_strtolower((string) $request->input('email')).'|'.$request->ip()),
            Limit::perMinute(20)->by($request->ip()),
        ]);

        // Vérification d'un mot de passe par une personne déjà connectée.
        RateLimiter::for('sensitive', fn (Request $request) => Limit::perMinute(10)->by((string) ($request->user()?->id ?? $request->ip())));
    }
}
