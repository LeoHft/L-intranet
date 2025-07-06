<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriesServices extends Model
{
    protected $table = 'categories_services'; // Nom de la table
    protected $primaryKey = 'id'; // Clé primaire

    protected $fillable = [
        'category_id',
        'service_id',
    ];
}
