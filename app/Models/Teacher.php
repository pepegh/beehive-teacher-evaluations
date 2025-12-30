<?php

namespace App\Models;

use App\Enums\Department;
use App\Enums\Level;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'subject',
        'department',
        'level',
        'hire_date',
        'status',
    ];

    protected $casts = [
        'department' => Department::class,
        'level' => Level::class,
        'status' => Status::class,
        'hire_date' => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        $parts = array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
        ]);

        return implode(' ', $parts);
    }

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }
}
