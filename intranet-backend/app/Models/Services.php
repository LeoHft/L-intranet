<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Services extends Model
{
    public const DEFAULT_IMAGE = '/storage/images/no-image-available.jpg';

    protected $fillable = [
        'name',
        'description',
        'internal_url',
        'external_url',
        'image_url',
        'status_id',
    ];

    /** Toujours un chemin relatif : l'image reste valide quel que soit le nom d'hôte utilisé. */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (?string $value) => $value ? (parse_url($value, PHP_URL_PATH) ?: $value) : self::DEFAULT_IMAGE);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Categories::class, 'categories_services', 'service_id', 'category_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'services_access', 'service_id', 'user_id');
    }
}
