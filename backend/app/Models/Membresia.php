<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membresia extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'plan_id',
        'precio',
        'fecha_inicio',
        'fecha_vencimiento',
        'estado', // 'activa', 'vencida', 'cancelada'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_vencimiento' => 'date',
        'precio' => 'decimal:2',
    ];

    /**
     * Get the cliente that owns the membership.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Get the plan associated with the membership.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }
}
