<?php

namespace App\Http\Controllers\API;

class ReporteController extends BaseController
{
    /**
     * Get overall statistics summary for the admin dashboard.
     */
    public function summary()
    {
        return $this->sendResponse([
            'total_clientes' => 0,
            'clientes_activos' => 0,
            'clientes_vencidos' => 0,
            'membresias_activas' => 0,
            'ingresos_mes_actual' => 0.00,
            'asistencia_hoy' => 0
        ], 'Resumen de métricas del dashboard obtenido.');
    }

    /**
     * Get monthly earnings data structure for charts.
     */
    public function earnings()
    {
        return $this->sendResponse([
            'labels' => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            'datasets' => [
                [
                    'label' => 'Ingresos Mensuales',
                    'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            ]
        ], 'Datos de ingresos obtenidos.');
    }

    /**
     * Get active membership plans distribution.
     */
    public function memberships()
    {
        return $this->sendResponse([
            'mensual' => 0,
            'trimestral' => 0,
            'anual' => 0
        ], 'Distribución de membresías obtenida.');
    }

    /**
     * Get attendance trends.
     */
    public function attendance()
    {
        return $this->sendResponse([
            'labels' => ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            'data' => [0, 0, 0, 0, 0, 0, 0]
        ], 'Historial de asistencia semanal obtenido.');
    }
}
