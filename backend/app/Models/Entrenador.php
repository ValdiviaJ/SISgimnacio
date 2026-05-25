<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrenador extends Model
{
    use HasFactory;

    protected $table = 'entrenadores';

    protected $fillable = [
        'user_id',
        'especialidad', // e.g., 'Musculación', 'Crossfit', 'Cardio'
        'horario',      // e.g., 'Turno Mañana', 'Turno Tarde'
    ];

    /**
     * Get the user that owns the trainer profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the clients assigned to this trainer.
     */
    public function clientes()
    {
        return $this->hasMany(Cliente::class);
    }

    /**
     * Get the routines created by this trainer.
     */
    public function rutinas()
    {
        return $this->hasMany(Rutina::class);
    }
}
