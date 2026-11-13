<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Protection CSRF, en complément de SameSite=Strict : un formulaire ou un script d'un autre site
 * ne peut pas ajouter cet en-tête, car la politique CORS de l'API ne l'y autorise pas.
 */
class RequireSameOriginRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethodSafe() && $request->header('X-Requested-With') !== 'XMLHttpRequest') {
            return response()->json(['message' => 'Requête refusée.'], 403);
        }

        return $next($request);
    }
}
