<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Services\ClienteService;
use Illuminate\Http\Request;

class ClienteController extends BaseController
{
    protected $clienteService;

    public function __construct(ClienteService $clienteService)
    {
        $this->clienteService = $clienteService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clientes = $this->clienteService->getAllClientes();
        return $this->sendResponse($clientes, 'Clientes recuperados con éxito.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClienteRequest $request)
    {
        $cliente = $this->clienteService->createCliente($request->validated());
        return $this->sendResponse($cliente, 'Socio registrado con éxito.', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cliente = $this->clienteService->getClienteById($id);
        
        if (!$cliente) {
            return $this->sendError('Cliente no encontrado.');
        }

        return $this->sendResponse($cliente, 'Detalle del cliente obtenido.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClienteRequest $request, $id)
    {
        $cliente = $this->clienteService->updateCliente($id, $request->validated());
        return $this->sendResponse($cliente, 'Socio actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->clienteService->deleteCliente($id);
        return $this->sendResponse([], 'Socio eliminado con éxito.');
    }

    /**
     * Update client status (active, suspended, expired).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['estado' => 'required|in:activo,suspendido,vencido']);
        $cliente = $this->clienteService->updateStatus($id, $request->estado);
        return $this->sendResponse($cliente, 'Estado del cliente actualizado.');
    }
}
