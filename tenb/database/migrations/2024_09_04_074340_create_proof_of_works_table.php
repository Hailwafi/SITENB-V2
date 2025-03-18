<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proof_of_works', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id');
            $table->string('staff_name');
            $table->date('tanggal');
            $table->string('ticket_type');
            $table->string('bukti_pengerjaan');
            $table->unsignedBigInteger('staff_id');
            $table->enum('status', ['proses', 'selesai'])->default('proses'); // Tambahkan status
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proof_of_works');
    }
};
