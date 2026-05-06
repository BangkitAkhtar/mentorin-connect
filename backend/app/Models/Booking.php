<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'tutor_id',
        'mahasiswa_id',
        'subject',
        'day',
        'time',
        'topic',
        'status',
        'reviewed',
        'class_id',
    ];

    protected $casts = [
        'reviewed' => 'boolean',
    ];

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function classItem()
    {
        return $this->belongsTo(ClassItem::class, 'class_id');
    }
}
