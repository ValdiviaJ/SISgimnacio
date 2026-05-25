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
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_gimnasio')->default('FitFlow Gym');
            $table->string('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->string('moneda', 3)->default('USD');
            $table->decimal('impuesto_porcentaje', 5, 2)->default(18.00); // e.g. IGV/IVA
            $table->json('horarios')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};
