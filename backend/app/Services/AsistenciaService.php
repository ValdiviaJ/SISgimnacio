<?php

namespace App\Services;

use App\Repositories\Contracts\AsistenciaRepositoryInterface;
use App\Models\Cliente;
use Carbon\Carbon;

class AsistenciaService extends BaseService
{
    protected AsistenciaRepositoryInterface $asistenciaRepository;

    public function __construct(AsistenciaRepositoryInterface $asistenciaRepository)
    {
        $this->asistenciaRepository = $asistenciaRepository;
    }

    public function getHistorialHoy()
    {
        return $this->asistenciaRepository->getTodayAsistencias();
    }

    public function checkIn(string $identificador, string $metodo)
    {
        $cliente = $this->findClienteByIdentifier($identificador);
        if (!$cliente) {
            return [
                'success' => false,
                'message' => 'Socio no registrado.',
                'status' => 'inexistente'
            ];
        }

        // Validate client status
        if ($cliente->estado === 'suspendido') {
            return [
                'success' => false,
                'message' => 'Acceso denegado. Socio suspendido.',
                'name' => $cliente->user->name,
                'status' => 'suspendido'
            ];
        }

        // Get latest active membership
        $activeMembership = $cliente->memberships()->where('estado', 'activa')->latest()->first();

        if (!$activeMembership) {
            $anyMembership = $cliente->memberships()->latest()->first();
            if ($cliente->estado !== 'vencido') {
                $cliente->update(['estado' => 'vencido']);
            }
            return [
                'success' => false,
                'message' => 'Acceso denegado. Sin membresía activa.',
                'name' => $cliente->user->name,
                'plan' => $anyMembership ? 'Plan ' . $anyMembership->plan->nombre : 'Sin plan',
                'expiry' => $anyMembership ? $anyMembership->fecha_vencimiento->toDateString() : '-',
                'status' => 'vencido'
            ];
        }

        // Check if expired
        if (Carbon::parse($activeMembership->fecha_vencimiento)->isBefore(Carbon::today())) {
            $activeMembership->update(['estado' => 'vencida']);
            $cliente->update(['estado' => 'vencido']);
            return [
                'success' => false,
                'message' => 'Acceso denegado. Membresía vencida.',
                'name' => $cliente->user->name,
                'plan' => $activeMembership->plan->nombre,
                'expiry' => $activeMembership->fecha_vencimiento->toDateString(),
                'status' => 'vencido'
            ];
        }

        // Save check-in
        $asistencia = $this->asistenciaRepository->create([
            'cliente_id' => $cliente->id,
            'check_in' => Carbon::now(),
            'metodo_acceso' => $metodo
        ]);

        return [
            'success' => true,
            'message' => 'Acceso Autorizado. ¡Bienvenido ' . $cliente->user->name . '!',
            'name' => $cliente->user->name,
            'plan' => $activeMembership->plan->nombre,
            'expiry' => $activeMembership->fecha_vencimiento->toDateString(),
            'status' => 'activo'
        ];
    }

    public function checkOut(string $identificador)
    {
        $cliente = $this->findClienteByIdentifier($identificador);
        if (!$cliente) {
            return [
                'success' => false,
                'message' => 'Socio no registrado.'
            ];
        }

        $latestCheckIn = $this->asistenciaRepository->getLatestActiveCheckIn($cliente->id);
        if (!$latestCheckIn) {
            return [
                'success' => false,
                'message' => 'No se encontró un check-in activo hoy para este socio.'
            ];
        }

        $latestCheckIn->update([
            'check_out' => Carbon::now()
        ]);

        return [
            'success' => true,
            'message' => 'Check-out registrado con éxito para ' . $cliente->user->name . '.',
            'name' => $cliente->user->name
        ];
    }

    public function validateQR(string $code)
    {
        $cliente = $this->findClienteByIdentifier($code);
        if (!$cliente) {
            return [
                'valid' => false,
                'message' => 'Código QR no válido. Socio no registrado.'
            ];
        }

        if ($cliente->estado === 'suspendido') {
            return [
                'valid' => false,
                'message' => 'Acceso denegado. Socio suspendido.',
                'name' => $cliente->user->name,
                'status' => 'suspendido'
            ];
        }

        $activeMembership = $cliente->memberships()->where('estado', 'activa')->latest()->first();

        if (!$activeMembership) {
            $anyMembership = $cliente->memberships()->latest()->first();
            if ($cliente->estado !== 'vencido') {
                $cliente->update(['estado' => 'vencido']);
            }
            return [
                'valid' => false,
                'message' => 'Acceso denegado. Sin membresía activa.',
                'name' => $cliente->user->name,
                'status' => 'vencido'
            ];
        }

        if (Carbon::parse($activeMembership->fecha_vencimiento)->isBefore(Carbon::today())) {
            $activeMembership->update(['estado' => 'vencida']);
            $cliente->update(['estado' => 'vencido']);
            return [
                'valid' => false,
                'message' => 'Acceso denegado. Membresía vencida.',
                'name' => $cliente->user->name,
                'status' => 'vencido'
            ];
        }

        return [
            'valid' => true,
            'cliente_id' => $cliente->id,
            'name' => $cliente->user->name,
            'status' => 'activo',
            'plan' => $activeMembership->plan->nombre,
            'expiry' => $activeMembership->fecha_vencimiento->toDateString()
        ];
    }

    protected function findClienteByIdentifier(string $identifier)
    {
        $id = null;
        if (is_numeric($identifier)) {
            $id = (int)$identifier;
        } elseif (preg_match('/^SOCIO-(\d+)$/i', $identifier, $matches)) {
            $id = (int)$matches[1];
        }

        if ($id) {
            return Cliente::with(['user', 'memberships.plan'])->find($id);
        }

        return Cliente::with(['user', 'memberships.plan'])
            ->whereHas('user', function ($query) use ($identifier) {
                $query->where('email', $identifier);
            })->first();
    }
}
