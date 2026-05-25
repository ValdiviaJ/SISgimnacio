<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'planes';

    protected $fillable = [
        'nombre',
        'precio',
        'duracion_dias',
        'features',
        'popular'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'duracion_dias' => 'integer',
        'features' => 'array',
        'popular' => 'boolean'
    ];

    /**
     * Get the memberships associated with this plan.
     */
    public function memberships()
    {
        return $this->hasMany(Membresia::class, 'plan_id');
    }
}
