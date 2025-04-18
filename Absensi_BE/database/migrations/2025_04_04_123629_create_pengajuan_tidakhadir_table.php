<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengajuan_tidakhadir', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('nama');
            $table->string('jabatan');
            $table->string('tanggal_pembuatan')->nullable();
            $table->string('tanggal_pengajuan');
            $table->enum('jenis_pengajuan', ['cuti', 'izin', 'lembur', 'semua']);
            $table->enum('jenis_cuti', ['tahunan', 'melahirkan', 'duka', 'lainnya'])->nullable();
            $table->text('catatan')->nullable();
            $table->string('dokumen')->nullable();
            $table->enum('status', ['proses', 'izin', 'cuti', 'diterima', 'ditolak', 'melewati_batas_waktu'])->default('proses');
            $table->string('alasan_penolakan')->nullable(); // jika ditolak
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_tidakhadir');
    }
};
