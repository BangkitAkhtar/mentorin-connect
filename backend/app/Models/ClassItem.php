<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassItem extends Model
{
    protected $fillable = [
        'user_id', 'title', 'subject', 'description', 'day', 'startTime', 'endTime', 'capacity', 'enrolled', 'active', 'completed'
    ];

    protected $casts = [
        'enrolled' => 'array',
        'active' => 'boolean',
        'completed' => 'boolean',
    ];

    public function tutor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
