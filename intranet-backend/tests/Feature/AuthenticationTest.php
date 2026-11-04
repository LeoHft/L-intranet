<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Tymon\JWTAuth\Facades\JWTAuth;

const STRONG_PASSWORD = 'correct-horse-battery';

function bearer(User $user): array
{
    return ['Authorization' => 'Bearer '.JWTAuth::fromUser($user)];
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
    $this->getJson('/api/getUserServices', ['Authorization' => 'Bearer invalide'])->assertUnauthorized();
});

it('révoque le token à la déconnexion', function () {
    $headers = bearer(User::factory()->create());

    $this->getJson('/api/getUserServices', $headers)->assertOk();
    $this->postJson('/api/logout', [], $headers)->assertOk();

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $headers)->assertUnauthorized();
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

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', ['Authorization' => 'Bearer '.$response->json('data')])->assertOk();
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

    $this->putJson('/api/updateCurrentUserPassword', [
        'current_password' => STRONG_PASSWORD,
        'new_password' => 'un-autre-mot-de-passe',
        'new_password_confirmation' => 'un-autre-mot-de-passe',
    ], $oldHeaders)->assertOk();

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $oldHeaders)->assertUnauthorized();
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
