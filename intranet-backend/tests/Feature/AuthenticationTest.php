<?php

use App\Models\User;
use App\Support\AuthCookie;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

const STRONG_PASSWORD = 'correct-horse-battery';

function bearer(User $user): array
{
    return [TestCase::TOKEN_HEADER => JWTAuth::fromUser($user)];
}

function sessionCookie($response): ?string
{
    return $response->getCookie(AuthCookie::NAME, false)?->getValue();
}

it('refuse des identifiants invalides avec une erreur 401', function () {
    $user = User::factory()->create();

    $this->postJson('/api/login', ['email' => $user->email, 'password' => 'mauvais'])->assertUnauthorized();
    $this->postJson('/api/login', ['email' => 'inconnu@example.com', 'password' => 'mauvais'])->assertUnauthorized();
});

it('limite les tentatives de connexion', function () {
    $user = User::factory()->create();

    foreach (range(1, 5) as $ignored) {
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'mauvais'])->assertUnauthorized();
    }

    $this->postJson('/api/login', ['email' => $user->email, 'password' => 'mauvais'])->assertTooManyRequests();
});

it('renvoie 401 et non 200 pour un token absent ou invalide', function () {
    $this->getJson('/api/getUserServices')->assertUnauthorized();
    $this->getJson('/api/getUserServices', [TestCase::TOKEN_HEADER => 'invalide'])->assertUnauthorized();
});

it('pose le token dans un cookie httpOnly, Secure et SameSite=Strict, jamais dans la réponse', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);

    $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => STRONG_PASSWORD])->assertOk();

    $cookie = $response->getCookie(AuthCookie::NAME, false);
    expect($cookie)->not->toBeNull()
        ->and($cookie->isHttpOnly())->toBeTrue()
        ->and($cookie->isSecure())->toBeTrue()
        ->and($cookie->getSameSite())->toBe('strict')
        ->and($cookie->getPath())->toBe('/api')
        ->and($cookie->getExpiresTime())->toBeGreaterThan(time())
        ->and($response->getContent())->not->toContain($cookie->getValue());

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', [TestCase::TOKEN_HEADER => $cookie->getValue()])->assertOk();
});

it('ignore un token passé ailleurs que dans le cookie', function () {
    $token = JWTAuth::fromUser(User::factory()->create());

    $this->getJson('/api/getUserServices', ['Authorization' => 'Bearer '.$token])->assertUnauthorized();
    $this->getJson('/api/getUserServices?token='.$token)->assertUnauthorized();
    $this->postJson('/api/addShortcut', ['token' => $token, 'name' => 'x', 'url' => 'https://example.com', 'icon' => 'House'])->assertUnauthorized();
});

it('refuse les requêtes qui modifient des données sans en-tête anti-CSRF', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);
    $headers = bearer($user) + ['X-Requested-With' => ''];

    $this->postJson('/api/addShortcut', ['name' => 'x', 'url' => 'https://example.com', 'icon' => 'House'], $headers)
        ->assertForbidden()
        ->assertExactJson(['message' => 'Requête refusée.']);
    $this->postJson('/api/login', ['email' => $user->email, 'password' => STRONG_PASSWORD], ['X-Requested-With' => ''])->assertForbidden();

    // La lecture reste possible : elle ne modifie rien.
    $this->getJson('/api/getUserServices', $headers)->assertOk();
});

it('révoque le token et efface le cookie à la déconnexion', function () {
    $headers = bearer(User::factory()->create());

    $this->getJson('/api/getUserServices', $headers)->assertOk();
    $this->postJson('/api/logout', [], $headers)->assertOk()->assertCookieExpired(AuthCookie::NAME);

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $headers)->assertUnauthorized();
});

it('efface un cookie expiré ou révoqué', function () {
    $this->postJson('/api/logout', [], [TestCase::TOKEN_HEADER => 'invalide'])->assertOk()->assertCookieExpired(AuthCookie::NAME);
    $this->getJson('/api/getCurrentUserInfo', [TestCase::TOKEN_HEADER => 'invalide'])
        ->assertJsonPath('connected', false)
        ->assertCookieExpired(AuthCookie::NAME);
});

it('bloque tout tant que le mot de passe provisoire n\'est pas changé, même après rechargement', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);
    $user->forceFill(['must_change_password' => true])->save();
    $headers = bearer($user);

    $this->getJson('/api/getCurrentUserInfo', $headers)->assertJsonPath('must_change_password', true);
    $this->getJson('/api/getUserServices', $headers)
        ->assertForbidden()
        ->assertJsonPath('code', 'password_change_required');
});

it('accepte le premier changement en gardant le même e-mail', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);
    $user->forceFill(['must_change_password' => true])->save();
    $oldHeaders = bearer($user);

    $response = $this->putJson('/api/updateCurrentUserFirstLogin', [
        'name' => 'Nouveau nom',
        'email' => $user->email,
        'password' => 'un-autre-mot-de-passe',
        'password_confirmation' => 'un-autre-mot-de-passe',
    ], $oldHeaders)->assertOk();

    $user->refresh();
    expect($user->must_change_password)->toBeFalse()
        ->and($user->name)->toBe('Nouveau nom');

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $oldHeaders)->assertUnauthorized();

    expect($response->json('data'))->toBeNull();

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', [TestCase::TOKEN_HEADER => sessionCookie($response)])->assertOk();
});

it('refuse de garder le mot de passe provisoire', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);
    $user->forceFill(['must_change_password' => true])->save();

    $this->putJson('/api/updateCurrentUserFirstLogin', [
        'name' => $user->name,
        'email' => $user->email,
        'password' => STRONG_PASSWORD,
        'password_confirmation' => STRONG_PASSWORD,
    ], bearer($user))->assertUnprocessable()->assertJsonValidationErrors('password');
});

it('ne permet pas d\'utiliser le formulaire de première connexion pour contourner le mot de passe actuel', function () {
    $user = User::factory()->create();

    $this->putJson('/api/updateCurrentUserFirstLogin', [
        'name' => 'Pirate',
        'email' => $user->email,
        'password' => 'mot-de-passe-du-pirate',
        'password_confirmation' => 'mot-de-passe-du-pirate',
    ], bearer($user))->assertForbidden();
});

it('révoque les anciens tokens lors d\'un changement de mot de passe', function () {
    $user = User::factory()->create(['password' => STRONG_PASSWORD]);
    $oldHeaders = bearer($user);

    $response = $this->putJson('/api/updateCurrentUserPassword', [
        'current_password' => STRONG_PASSWORD,
        'new_password' => 'un-autre-mot-de-passe',
        'new_password_confirmation' => 'un-autre-mot-de-passe',
    ], $oldHeaders)->assertOk();

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $oldHeaders)->assertUnauthorized();

    // La session en cours continue avec le nouveau cookie.
    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', [TestCase::TOKEN_HEADER => sessionCookie($response)])->assertOk();
});

it('exige un mot de passe d\'au moins 12 caractères', function () {
    $this->putJson('/api/updateCurrentUserPassword', [
        'current_password' => 'password',
        'new_password' => 'trop-court',
        'new_password_confirmation' => 'trop-court',
    ], bearer(User::factory()->create()))->assertUnprocessable()->assertJsonValidationErrors('new_password');
});

it('ne laisse pas un utilisateur se promouvoir administrateur via son profil', function () {
    $user = User::factory()->create();

    $this->putJson('/api/updateCurrentUser', [
        'name' => 'Moi',
        'email' => $user->email,
        'is_admin' => true,
    ], bearer($user))->assertOk();

    expect($user->fresh()->is_admin)->toBeFalse();
});

it('réinitialise un mot de passe en ligne de commande', function () {
    $user = User::factory()->create();

    expect(Artisan::call('intranet:reset-password', ['email' => $user->email]))->toBe(0)
        ->and($user->fresh()->must_change_password)->toBeTrue();
});
