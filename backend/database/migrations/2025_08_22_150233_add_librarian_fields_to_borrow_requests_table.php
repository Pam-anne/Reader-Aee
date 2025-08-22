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
        Schema::table('borrow_requests', function (Blueprint $table) {
            // Additional fields for librarian functionality
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('librarian_notes')->nullable();
            $table->text('notes')->nullable(); // For user notes when requesting

            // Indexes for better performance
            $table->index(['user_id', 'status']);
            $table->index(['book_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrow_requests', function (Blueprint $table) {
            // Drop the added columns
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);
            $table->dropColumn([
                'approved_by',
                'rejected_by',
                'approved_at',
                'rejected_at',
                'librarian_notes',
                'notes',
            ]);
            // Drop indexes
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['book_id', 'status']);
            $table->dropIndex('status');
        });
    }
};
