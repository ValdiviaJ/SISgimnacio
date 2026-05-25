<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\Pago;

class PagoController extends BaseController
{
    /**
     * Display a listing of payments.
     */
    public function index()
    {
        $pagos = Pago::with('cliente.user')->get();
        return $this->sendResponse($pagos, 'Pagos recuperados con éxito.');
    }

    /**
     * Store a newly created payment in database.
     */
    public function store(Request $request)
    {
        return $this->sendResponse([], 'Pago registrado con éxito.');
    }

    /**
     * Display the specified payment detail.
     */
    public function show($id)
    {
        $pago = Pago::with('cliente.user')->find($id);
        if (!$pago) {
            return $this->sendError('Pago no encontrado.');
        }
        return $this->sendResponse($pago, 'Detalle del pago obtenido.');
    }

    /**
     * Update the specified payment in storage.
     */
    public function update(Request $request, $id)
    {
        return $this->sendResponse([], 'Pago actualizado con éxito.');
    }

    /**
     * Remove the specified payment from storage.
     */
    public function destroy($id)
    {
        return $this->sendResponse([], 'Pago eliminado con éxito.');
    }

    /**
     * Fetch payment history of specific client.
     */
    public function clientePagos($clienteId)
    {
        return $this->sendResponse([], 'Historial de pagos del cliente obtenido.');
    }
}
