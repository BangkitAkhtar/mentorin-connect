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
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable();
            $table->string('university')->default('BINUS University');
            $table->string('major')->nullable();
            $table->text('bio')->nullable();
            $table->json('subjects')->nullable();
            $table->float('rating')->default(0);
            $table->integer('reviewCount')->default(0);
            $table->json('availability')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'university', 'major', 'bio', 'subjects', 'rating', 'reviewCount', 'availability']);
        });
    }
};
