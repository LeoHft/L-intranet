<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicesAccess extends Model
{
    protected $table = 'services_access';

    protected $fillable = [
        'service_id',
        'user_id',
    ];

    public function service()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
