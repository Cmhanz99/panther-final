<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'price',
        'details',
        'image'
    ];
}
