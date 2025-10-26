<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shortcuts extends Model
{
    protected $table = 'shortcuts';

    protected $fillable = [
        'url',
        'icon',
        'user_id',
    ];
}
