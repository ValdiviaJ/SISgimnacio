import React from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import { Plus, ArrowDownRight, Wallet, CheckCircle, Clock, XCircle } from 'lucide-react';

const PagosList = () => {
  const pagos = [
    { id: 1, cliente: 'Marcos Deza', monto: '$90.00', metodo: 'Tarjeta de Crédito', fecha: '2026-05-22 19:12', estado: 'completado', ref: 'TX-948123' },
    { id: 2, cliente: 'Sofía Vergara', monto: '$320.00', metodo: 'Transferencia Bancaria', fecha: '2026-05-21 11:30', estado: 'completado', ref: 'TX-520194' },
    { id: 3, cliente: 'Carlos Mendoza', monto: '$35.00', metodo: 'Efectivo', fecha: '2026-05-20 09:45', estado: 'pendiente', ref: 'Ninguno' },
    { id: 4, cliente: 'Lucía Torres', monto: '$35.00', metodo: 'Tarjeta de Débito', fecha: '2026-05-18 14:22', estado: 'fallido', ref: 'TX-009214' },
  ];

  const getEstadoBadge = (estado) => {
    const styles = {
      completado: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      pendiente: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      fallido: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    const icons = {
      completado: <CheckCircle size={12} />,
      pendiente: <Clock size={12} />,
      fallido: <XCircle size={12} />,
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold tracking-wider rounded-xl uppercase flex items-center gap-1.5 w-fit ${styles[estado]}`}>
        {icons[estado]}
        <span>{estado}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-200">Historial de Transacciones</h2>
        <Button variant="glow">
          <Plus size={16} /> Registrar Pago
        </Button>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hoverGlow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Recaudación Total</p>
            <p className="text-2xl font-black text-white mt-1">$12,850.00</p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <ArrowDownRight size={20} />
          </div>
        </Card>

        <Card className="hoverGlow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Por Confirmar</p>
            <p className="text-2xl font-black text-white mt-1">$70.00</p>
          </div>
          <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl">
            <Clock size={20} />
          </div>
        </Card>

        <Card className="hoverGlow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Transacciones Fallidas</p>
            <p className="text-2xl font-black text-white mt-1">12</p>
          </div>
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
            <XCircle size={20} />
          </div>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden" title="Libro Mayor de Ventas" subtitle="Listado de cobros y facturación de membresías">
        <Table headers={['Socio', 'Monto', 'Método de Pago', 'Fecha', 'Estado', 'Referencia']}>
          {pagos.map((pago) => (
            <tr key={pago.id} className="hover:bg-darkCard/20 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-200">
                {pago.cliente}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-accentNeon">
                {pago.monto}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Wallet size={14} className="text-gray-500" />
                  <span>{pago.metodo}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {pago.fecha}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getEstadoBadge(pago.estado)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {pago.ref}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default PagosList;
