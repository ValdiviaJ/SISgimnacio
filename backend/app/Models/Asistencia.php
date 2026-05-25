<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'check_in',
        'check_out',
        'metodo_acceso', // 'qr', 'manual', 'rfid'
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
    ];

    /**
     * Get the cliente who checked in.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
