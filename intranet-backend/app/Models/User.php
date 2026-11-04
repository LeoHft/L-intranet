<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
        'token_version',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'must_change_password' => 'boolean',
            'token_version' => 'integer',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /** "tv" permet de révoquer tous les tokens d'un utilisateur lors d'un changement de mot de passe. */
    public function getJWTCustomClaims()
    {
        return ['tv' => (int) $this->token_version];
    }

    /** Change le mot de passe et invalide tous les tokens déjà émis pour cet utilisateur. */
    public function resetPassword(string $password, bool $mustChange = false): void
    {
        $this->forceFill([
            'password' => $password,
            'must_change_password' => $mustChange,
            'token_version' => (int) $this->token_version + 1,
        ])->save();
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Services::class, 'services_access', 'user_id', 'service_id');
    }

    public function shortcuts(): HasMany
    {
        return $this->hasMany(Shortcuts::class, 'user_id');
    }
}
