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
        Schema::create('publiks', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->enum('kategori', ['layanan_aduan_keamanan_siber']);
            $table->string('sub_kategori');
            $table->string('email');
            $table->enum('jenis_tiket', ['kendala']);
            $table->text('deskripsi');
            $table->string('unggah_file')->nullable();
            $table->enum('status', ['open', 'proses', 'selesai', 'close'])->default('open');
            $table->string('prioritas')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable(); // Staf yang ditugaskan
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->string('kode_tiket')->unique();
            $table->string('token_tiket')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publiks');
    }
};
