<?php

namespace App\Models;

use App\Enums\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Observer extends Model
{
    protected $fillable = [
        'name',
        'department',
    ];

    protected $casts = [
        'department' => Department::class,
    ];

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }
}
