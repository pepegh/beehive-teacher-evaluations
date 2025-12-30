<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationTool extends Model
{
    protected $fillable = [
        'name',
        'description',
        'dimensions',
    ];

    protected $casts = [
        'dimensions' => 'array',
    ];

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }
}
