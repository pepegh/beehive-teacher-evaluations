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
        Schema::create('observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluation_tool_id')->constrained()->onDelete('cascade');
            $table->foreignId('observer_id')->nullable()->constrained()->onDelete('set null');
            $table->date('observation_date');
            $table->json('scores');
            $table->decimal('average_score', 5, 2)->nullable();
            $table->string('lowest_dimension')->nullable();
            $table->decimal('lowest_score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observations');
    }
};
