<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_logs', function (Blueprint $table) {
            $table->id();
            $table->enum('action', [
                'borrowed',
                'returned',
                'request_rejected',
                'overdue',
                'lost',
                'damaged'
            ]);
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('librarian_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('borrow_request_id')->nullable()->constrained()->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamp('action_date');
            $table->timestamps();

            // Indexes for better performance
            $table->index(['book_id', 'action_date']);
            $table->index(['user_id', 'action_date']);
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_logs');
    }
};
