<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('izin_sakits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Tambahkan user_id
            $table->enum('jenis', ['izin', 'sakit']);
            $table->text('keterangan');
            $table->timestamps();
        });
    }
    

    public function down() {
        Schema::dropIfExists('izin_sakits');
    }
};
