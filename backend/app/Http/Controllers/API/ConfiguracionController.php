<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\Configuracion;

class ConfiguracionController extends BaseController
{
    /**
     * Display the specified settings.
     */
    public function show()
    {
        $config = Configuracion::first();
        if (!$config) {
            // Create default configuration if none exists
            $config = Configuracion::create([
                'nombre_gimnasio' => 'FitFlow Gym',
                'direccion' => 'Av. Principal 123',
                'telefono' => '+51 987 654 321',
                'moneda' => 'USD',
                'impuesto_porcentaje' => 18.00,
                'horarios' => [
                    'lunes_viernes' => '06:00 - 22:00',
                    'sabado' => '08:00 - 18:00',
                    'domingo' => 'Cerrado'
                ]
            ]);
        }
        return $this->sendResponse($config, 'Configuración general recuperada.');
    }

    /**
     * Update the configurations.
     */
    public function update(Request $request)
    {
        $config = Configuracion::first();
        if (!$config) {
            $config = new Configuracion();
        }

        $config->fill($request->only([
            'nombre_gimnasio',
            'direccion',
            'telefono',
            'moneda',
            'impuesto_porcentaje',
            'horarios'
        ]));
        
        $config->save();

        return $this->sendResponse($config, 'Configuración actualizada con éxito.');
    }
}
