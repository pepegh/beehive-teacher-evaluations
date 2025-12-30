<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Observation extends Model
{
    protected $fillable = [
        'teacher_id',
        'evaluation_tool_id',
        'observer_id',
        'observation_date',
        'scores',
        'notes',
        'average_score',
        'lowest_dimension',
        'lowest_score',
    ];

    protected $casts = [
        'observation_date' => 'date',
        'scores' => 'array',
        'average_score' => 'float',
        'lowest_score' => 'float',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function evaluationTool(): BelongsTo
    {
        return $this->belongsTo(EvaluationTool::class);
    }

    public function observer(): BelongsTo
    {
        return $this->belongsTo(Observer::class);
    }
}
