<?php

use App\Models\NumberClickByServiceByUserByDay;
use App\Models\Services;
use App\Models\Shortcuts;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

function headersFor(User $user): array
{
    return ['Authorization' => 'Bearer '.JWTAuth::fromUser($user)];
}

function admin(): User
{
    return User::factory()->create(['is_admin' => true]);
}

it('réserve les routes d\'administration aux administrateurs avec une erreur 403', function (string $method, string $uri) {
    $this->json($method, $uri, [], headersFor(User::factory()->create()))->assertForbidden();
})->with([
    ['GET', '/api/getUsers'],
    ['GET', '/api/getServices'],
    ['POST', '/api/storeUser'],
    ['POST', '/api/storeService'],
    ['POST', '/api/storeCategory'],
    ['POST', '/api/storeStatus'],
    ['GET', '/api/getStatByUserByServiceByDate'],
]);

it('renvoie 404 sans exposer le nom du modèle', function () {
    $this->deleteJson('/api/deleteService/999', [], headersFor(admin()))
        ->assertNotFound()
        ->assertExactJson(['message' => 'Ressource introuvable.']);
});

it('ne révèle aux utilisateurs ni les autres comptes ni les adresses internes', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $service = Services::create(['name' => 'NAS', 'internal_url' => 'http://192.168.1.2', 'external_url' => 'https://nas.example.com']);
    $service->users()->attach([$user->id, $other->id]);

    $response = $this->getJson('/api/getUserServices', headersFor($user))->assertOk();

    expect($response->json('data.0'))->not->toHaveKeys(['users', 'internal_url', 'pivot'])
        ->and($response->getContent())->not->toContain($other->email);
});

it('donne les adresses internes aux administrateurs', function () {
    $admin = admin();
    $service = Services::create(['name' => 'NAS', 'internal_url' => 'http://192.168.1.2']);
    $service->users()->attach($admin);

    $this->getJson('/api/getUserServices', headersFor($admin))
        ->assertJsonPath('data.0.internal_url', 'http://192.168.1.2');
});

it('attribue les clics à l\'utilisateur du token, jamais à celui envoyé par le client', function () {
    $user = User::factory()->create();
    $victim = User::factory()->create();
    $service = Services::create(['name' => 'NAS']);
    $service->users()->attach($user);

    foreach (range(1, 2) as $ignored) {
        $this->postJson("/api/updateNumberClick/{$service->id}", ['isInternalUrl' => false, 'userId' => $victim->id], headersFor($user))->assertOk();
    }

    $row = NumberClickByServiceByUserByDay::sole();
    expect($row->user_id)->toBe($user->id)
        ->and($row->external_url_click)->toBe(2)
        ->and($row->internal_url_click)->toBe(0);
});

it('refuse de compter un clic sur un service non autorisé', function () {
    $service = Services::create(['name' => 'NAS']);

    $this->postJson("/api/updateNumberClick/{$service->id}", ['isInternalUrl' => false], headersFor(User::factory()->create()))->assertForbidden();
});

it('refuse les URL dangereuses', function (string $url) {
    $this->postJson('/api/addShortcut', ['name' => 'x', 'url' => $url, 'icon' => 'House'], headersFor(User::factory()->create()))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('url');
})->with(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'file:///etc/passwd', 'pas une url']);

it('accepte les adresses de réseau local', function (string $url) {
    $this->postJson('/api/addShortcut', ['name' => 'x', 'url' => $url, 'icon' => 'House'], headersFor(User::factory()->create()))->assertCreated();
})->with(['http://192.168.1.10:8080', 'http://nas:5000', 'https://nas.local/admin', 'https://example.com']);

it('applique la limite de raccourcis côté serveur', function () {
    $user = User::factory()->create();
    foreach (range(1, 10) as $i) {
        $user->shortcuts()->create(['name' => "s$i", 'url' => 'https://example.com', 'icon' => 'House']);
    }

    $this->postJson('/api/addShortcut', ['name' => 'x', 'url' => 'https://example.com', 'icon' => 'House'], headersFor($user))->assertUnprocessable();
});

it('interdit de supprimer le raccourci d\'un autre', function () {
    $shortcut = User::factory()->create()->shortcuts()->create(['name' => 'x', 'url' => 'https://example.com', 'icon' => 'House']);

    $this->deleteJson("/api/deleteShortcut/{$shortcut->id}", [], headersFor(User::factory()->create()))->assertForbidden();
    expect(Shortcuts::count())->toBe(1);
});

it('empêche un administrateur de se supprimer ou de se rétrograder', function () {
    $admin = admin();

    $this->deleteJson("/api/deleteUser/{$admin->id}", [], headersFor($admin))->assertUnprocessable();
    $this->putJson("/api/updateUser/{$admin->id}", ['name' => 'a', 'email' => $admin->email, 'is_admin' => false], headersFor($admin))->assertUnprocessable();

    expect($admin->fresh()->is_admin)->toBeTrue();
});

it('impose le changement du mot de passe défini par un administrateur', function () {
    $headers = headersFor(admin());

    $this->postJson('/api/storeUser', [
        'name' => 'Alice', 'email' => 'alice@example.com', 'is_admin' => false,
        'password' => 'mot-de-passe-provisoire', 'password_confirmation' => 'mot-de-passe-provisoire',
    ], $headers)->assertCreated()->assertJsonMissingPath('data.password');

    $alice = User::firstWhere('email', 'alice@example.com');
    expect($alice->must_change_password)->toBeTrue();

    $alice->forceFill(['must_change_password' => false])->save();
    $aliceHeaders = headersFor($alice);

    $this->putJson("/api/updateUser/{$alice->id}", [
        'name' => 'Alice', 'email' => $alice->email, 'is_admin' => false,
        'password' => 'mot-de-passe-reinitialise', 'password_confirmation' => 'mot-de-passe-reinitialise',
    ], $headers)->assertOk();

    expect($alice->fresh()->must_change_password)->toBeTrue();

    auth()->forgetGuards();
    $this->getJson('/api/getUserServices', $aliceHeaders)->assertUnauthorized();
});

it('gère le cycle de vie des images et le retrait du statut', function () {
    Storage::fake('public');
    $headers = headersFor($admin = admin());
    $payload = ['name' => 'NAS', 'user_id' => [$admin->id]];

    $id = $this->post('/api/storeService', [...$payload, 'image' => UploadedFile::fake()->image('a.png')], $headers + ['Accept' => 'application/json'])
        ->assertCreated()->json('data.id');
    $first = Services::find($id)->image_url;
    expect($first)->toStartWith('/storage/images/');
    Storage::disk('public')->assertExists(substr($first, 9));

    $status = \App\Models\Status::create(['name' => 'UP']);
    Services::find($id)->update(['status_id' => $status->id]);

    $this->post("/api/updateService/{$id}", [...$payload, 'image' => UploadedFile::fake()->image('b.png')], $headers + ['Accept' => 'application/json'])->assertOk();
    $second = Services::find($id);
    expect($second->status_id)->toBeNull();
    Storage::disk('public')->assertMissing(substr($first, 9));

    $this->deleteJson("/api/deleteService/{$id}", [], $headers)->assertOk();
    Storage::disk('public')->assertMissing(substr($second->image_url, 9));
});

it('refuse les fichiers qui ne sont pas des images', function (string $name, string $content) {
    Storage::fake('public');
    $admin = admin();

    // Un vrai fichier : UploadedFile::fake() déduit le type du nom et non du contenu.
    $path = tempnam(sys_get_temp_dir(), 'upload');
    file_put_contents($path, $content);

    $this->post('/api/storeService', [
        'name' => 'NAS', 'user_id' => [$admin->id],
        'image' => new UploadedFile($path, $name, null, null, true),
    ], headersFor($admin) + ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('image');
})->with([
    'php déguisé' => ['shell.jpg', '<?php system($_GET["c"]); ?>'],
    'svg' => ['x.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
    'html' => ['x.png', '<html><script>alert(1)</script></html>'],
]);

it('renvoie toujours les deux colonnes de statistiques', function () {
    $admin = admin();
    $service = Services::create(['name' => 'NAS']);
    NumberClickByServiceByUserByDay::create(['service_id' => $service->id, 'user_id' => $admin->id, 'click_date' => '2026-01-15', 'internal_url_click' => 3, 'external_url_click' => 4]);

    $query = http_build_query(['startDate' => '2026-01-01', 'endDate' => '2026-01-31', 'linkTypes' => ['internal']]);
    $row = $this->getJson("/api/getStatByUserByServiceByDate?{$query}", headersFor($admin))->assertOk()->json('data.0');

    expect((int) $row['internal_url_click'])->toBe(3)
        ->and((int) $row['external_url_click'])->toBe(0);
});

it('n\'autorise aucune origine externe', function () {
    $this->getJson('/api/getCurrentUserInfo', ['Origin' => 'https://evil.example'])
        ->assertOk()
        ->assertHeaderMissing('Access-Control-Allow-Origin');
});

it('ne recrée pas les données d\'exemple supprimées', function () {
    $this->seed(DatabaseSeeder::class);
    expect(User::sole()->must_change_password)->toBeTrue();

    Services::query()->delete();
    $this->seed(DatabaseSeeder::class);

    expect(Services::count())->toBe(0)->and(User::count())->toBe(1);
});

it('garde un chemin relatif pour les images héritées en URL absolue', function () {
    $service = Services::create(['name' => 'NAS', 'image_url' => 'https://10.0.0.1:8088/storage/images/a.png']);

    expect($service->image_url)->toBe('/storage/images/a.png');
});
