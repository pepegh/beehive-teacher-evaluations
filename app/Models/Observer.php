<?php

namespace App\Models;

use App\Enums\Department;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Observer extends Model
{
    use HasFactory;
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
