<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NumberClickByServiceByUserByDay extends Model
{
    protected $table = 'number_click_by_service_by_user_by_day';

    protected $fillable = [
        'service_id',
        'user_id',
        'internal_url_click',
        'external_url_click',
        'click_date',
    ];

    public $timestamps = false;

    public function service()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
