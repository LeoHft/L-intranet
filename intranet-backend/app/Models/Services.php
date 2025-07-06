<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Services extends Model
{
    protected $fillable = [
        'name',
        'description',
        'internal_url',
        'external_url',
        'image_url',
        'status_id',
    ];


    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Categories::class,
            'categories_services',
            'service_id',
            'category_id'
        );
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function users(): BelongsToMany 
    {
        return $this->belongsToMany(
            User::class, // Modèle associé
            'services_access', // Nom de la table pivot
            'service_id', // Clé étrangère du modèle actuel dans la table pivot
            'user_id' // Clé étrangère du modèle associé dans la table pivot
        );
    }

}
