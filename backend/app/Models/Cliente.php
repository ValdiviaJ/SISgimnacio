<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'entrenador_id',
        'telefono',
        'direccion',
        'fecha_nacimiento',
        'genero',
        'foto_perfil',
        'estado', // 'activo', 'suspendido', 'vencido'
        'observaciones',
    ];

    /**
     * Get the user that owns the cliente profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the trainer assigned to the cliente.
     */
    public function entrenador()
    {
        return $this->belongsTo(Entrenador::class);
    }

    /**
     * Get the memberships history of the cliente.
     */
    public function memberships()
    {
        return $this->hasMany(Membresia::class);
    }

    /**
     * Get the active membership for this cliente.
     */
    public function activeMembership()
    {
        return $this->hasOne(Membresia::class)->where('estado', 'activa')->latest();
    }

    /**
     * Get the checkins history of the cliente.
     */
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    /**
     * Get the payments history of the cliente.
     */
    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    /**
     * Get the assigned routines for the cliente.
     */
    public function rutinas()
    {
        return $this->belongsToMany(Rutina::class, 'cliente_rutina')
                    ->withPivot('asignado_el', 'estado')
                    ->withTimestamps();
    }
}
