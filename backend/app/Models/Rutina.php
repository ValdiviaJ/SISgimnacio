<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rutina extends Model
{
    use HasFactory;

    protected $fillable = [
        'entrenador_id',
        'nombre',
        'descripcion',
        'nivel', // 'principiante', 'intermedio', 'avanzado'
        'ejercicios', // JSON array of exercises e.g., [{"ejercicio": "Sentadillas", "series": 4, "reps": 12, "descanso": "60s"}]
    ];

    protected $casts = [
        'ejercicios' => 'array',
    ];

    /**
     * Get the trainer who created the routine.
     */
    public function entrenador()
    {
        return $this->belongsTo(Entrenador::class);
    }

    /**
     * Get the clientes assigned to this routine.
     */
    public function clientes()
    {
        return $this->belongsToMany(Cliente::class, 'cliente_rutina')
                    ->withPivot('asignado_el', 'estado')
                    ->withTimestamps();
    }
}
