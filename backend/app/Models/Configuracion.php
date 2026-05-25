<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    use HasFactory;

    protected $table = 'configuraciones';

    protected $fillable = [
        'nombre_gimnasio',
        'direccion',
        'telefono',
        'moneda',      // e.g. 'USD', 'PEN', 'EUR'
        'impuesto_porcentaje',
        'horarios',     // e.g. JSON: {"lunes_viernes": "06:00 - 22:00", "sabado": "08:00 - 18:00"}
    ];

    protected $casts = [
        'horarios' => 'array',
        'impuesto_porcentaje' => 'decimal:2',
    ];
}
