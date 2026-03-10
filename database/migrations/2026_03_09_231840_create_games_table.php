<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('winner')->nullable();
            $blueprint->string('mode');
            $blueprint->json('moves'); // Move sequence: [{r, c, p}, ...]
            $blueprint->json('initial_dimensions');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
