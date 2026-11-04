<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /** Les tests vident la base : ils ne doivent jamais s'exécuter sur une vraie base de données. */
    public function createApplication()
    {
        $app = parent::createApplication();

        if (config('database.default') !== 'sqlite') {
            throw new RuntimeException('Les tests doivent utiliser SQLite : vérifiez phpunit.xml.');
        }

        return $app;
    }
}
