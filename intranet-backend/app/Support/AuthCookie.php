<?php

namespace App\Support;

use Symfony\Component\HttpFoundation\Cookie;

/**
 * Le token JWT ne voyage que dans ce cookie :
 * - httpOnly : le JavaScript de la page ne peut pas le lire, une faille XSS ne permet donc pas de le voler ;
 * - SameSite=Strict : le navigateur ne l'envoie jamais lors d'une requête partie d'un autre site ;
 * - Secure et limité à /api : jamais transmis en clair, ni au reste du site.
 */
final class AuthCookie
{
    public const NAME = 'intranet_token';

    private const PATH = '/api';

    public static function make(string $token): Cookie
    {
        return cookie(self::NAME, $token, (int) config('jwt.ttl'), self::PATH, null, true, true, false, 'strict');
    }

    public static function forget(): Cookie
    {
        return cookie(self::NAME, '', -2628000, self::PATH, null, true, true, false, 'strict');
    }
}
