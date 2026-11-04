<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! self::resolveUser()) {
            return response()->json(['message' => 'Session expirée, veuillez vous reconnecter.'], 401);
        }

        return $next($request);
    }

    /**
     * Renvoie l'utilisateur du token courant, ou null si le token est absent, invalide,
     * expiré, révoqué, ou émis avant le dernier changement de mot de passe.
     */
    public static function resolveUser(): ?User
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (! $user instanceof User) {
                return null;
            }

            return (int) JWTAuth::getPayload()->get('tv') === $user->token_version ? $user : null;
        } catch (JWTException) {
            return null;
        }
    }
}
