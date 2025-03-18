<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('publiks', function (Blueprint $table) {
            $table->string('prioritas')->nullable()->change();
            });
    }

    public function down()
    {
        Schema::table('publiks', function (Blueprint $table) {
            $table->dropColumn('prioritas'); // Menghapus kolom jika rollback
        });
    }

};
