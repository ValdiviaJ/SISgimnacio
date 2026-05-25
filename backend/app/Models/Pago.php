<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'monto',
        'metodo_pago', // 'efectivo', 'tarjeta', 'transferencia'
        'fecha_pago',
        'estado',       // 'completado', 'pendiente', 'fallido'
        'referencia',   // código de transacción opcional
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
        'monto' => 'decimal:2',
    ];

    /**
     * Get the cliente who made the payment.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
