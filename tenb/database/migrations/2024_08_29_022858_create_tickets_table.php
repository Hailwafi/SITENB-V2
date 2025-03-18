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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('jabatan');
            $table->enum('kategori', ['layanan_pengolahan_data', 'layanan_jaringan_internet', 'layanan_aplikasi', 'layanan_aduan_keamanan_siber']);
            $table->string('sub_kategori');
            $table->string('email');
            $table->string('nomor_induk_pegawai');
            $table->enum('jenis_tiket', ['permohonan', 'kendala']);
            $table->text('deskripsi');
            $table->string('unggah_file')->nullable();
            $table->enum('status', ['open', 'proses', 'selesai', 'close'])->default('open');
            $table->string('prioritas')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
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
        Schema::dropIfExists('tickets');
    }
};
