<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    protected $fillable = [
        'user_id',
        'winner',
        'mode',
        'moves',
        'initial_dimensions',
    ];

    protected $casts = [
        'moves' => 'array',
        'initial_dimensions' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
