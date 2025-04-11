<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // ← tambahkan ini!

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengajuan_tidakhadir', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jabatan');
            $table->string('tanggal_pembuatan')->nullable();
            $table->string('tanggal_pengajuan');
            $table->enum('jenis_pengajuan', ['cuti', 'izin', 'lembur', 'semua']);
            $table->enum('jenis_cuti', ['tahunan', 'melahirkan', 'duka', 'lainnya'])->nullable();
            $table->text('catatan')->nullable();
            $table->string('dokumen')->nullable(); // Menyimpan path file
            $table->enum('status', ['proses', 'disetujui', 'ditolak'])->default('proses');
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
