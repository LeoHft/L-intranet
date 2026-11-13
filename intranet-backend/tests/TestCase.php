<?php

namespace Tests;

use App\Support\AuthCookie;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /**
     * En-tête propre aux tests pour désigner le token d'une requête : il est converti en cookie
     * d'authentification, la seule façon dont l'API accepte un token.
     */
    public const TOKEN_HEADER = 'X-Test-Auth-Token';

    /** Les tests vident la base : ils ne doivent jamais s'exécuter sur une vraie base de données. */
    public function createApplication()
    {
        $app = parent::createApplication();

        if (config('database.default') !== 'sqlite') {
            throw new RuntimeException('Les tests doivent utiliser SQLite : vérifiez phpunit.xml.');
        }

        return $app;
    }

    /** Envoie chaque requête comme le frontend : token en cookie, en-tête anti-CSRF. */
    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        $tokenKey = 'HTTP_'.strtoupper(str_replace('-', '_', self::TOKEN_HEADER));

        if (isset($server[$tokenKey])) {
            $cookies[AuthCookie::NAME] = $server[$tokenKey];
            unset($server[$tokenKey]);
        }

        $server += ['HTTP_X_REQUESTED_WITH' => 'XMLHttpRequest'];

        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }
}
