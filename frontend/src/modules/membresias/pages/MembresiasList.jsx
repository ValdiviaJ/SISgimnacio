import React, { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import MembresiaModal from '../components/MembresiaModal';
import PlanModal from '../components/PlanModal';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Check, RefreshCw, CalendarRange, Info } from 'lucide-react';

const MembresiasList = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [membresias, setMembresias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMembresiaModalOpen, setIsMembresiaModalOpen] = useState(false);

  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlanes = async () => {
    setLoadingPlanes(true);
    try {
      const response = await api.get('/planes');
      setPlanes(response.data.data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoadingPlanes(false);
    }
  };

  const fetchMembresias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/membresias');
      setMembresias(response.data.data || []);
    } catch (err) {
      console.error('Error fetching memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembresias();
    fetchPlanes();
  }, []);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleRenovar = async (id) => {
    if (window.confirm('¿Está seguro de renovar esta membresía? Se calculará la nueva fecha a partir del vencimiento actual o del día de hoy.')) {
      try {
        await api.post(`/membresias/${id}/renovar`);
        alert('Membresía renovada con éxito.');
        fetchMembresias();
      } catch (err) {
        console.error('Error renewing membership:', err);
        alert('Hubo un error al renovar la membresía.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      activa: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      vencida: 'bg-red-500/10 text-red-400 border border-red-500/20',
      cancelada: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-xl uppercase border ${styles[status] || styles.vencida}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Plans Config Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200">Planes Disponibles</h2>
          {isAdmin && (
            <Button variant="glow" onClick={handleCreatePlan}>
              <Plus size={16} /> Crear Plan
            </Button>
          )}
        </div>

        {loadingPlanes ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accentNeon"></div>
            <p className="text-sm">Cargando planes de membresía...</p>
          </div>
        ) : planes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planes.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden flex flex-col justify-between ${
                  plan.popular ? 'border-accentNeon shadow-glow' : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-extrabold bg-accentNeon text-darkBg uppercase tracking-widest rounded-lg">
                    Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-200">{plan.nombre}</h3>
                  <p className="text-3xl font-black text-white mt-4">
                    ${parseFloat(plan.precio).toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal"> / {plan.duracion_dias} Días</span>
                  </p>
                  
                  <ul className="mt-6 space-y-3">
                    {Array.isArray(plan.features) && plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check size={14} className="text-accentNeon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {isAdmin && (
                  <div className="mt-8">
                    <Button 
                      variant={plan.popular ? 'glow' : 'secondary'} 
                      className="w-full" 
                      onClick={() => handleEditPlan(plan)}
                    >
                      Editar Plan
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 border border-dashed border-darkBorder rounded-3xl">
            <Info size={40} className="mx-auto text-gray-600 mb-2" />
            <p className="text-sm font-semibold">No se encontraron planes creados</p>
            <p className="text-xs text-gray-600 mt-1">Crea tu primer plan pulsando el botón superior.</p>
          </div>
        )}
      </div>

      {/* Active Memberships Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-200">Registro de Membresías Socios</h2>
          <Button variant="glow" onClick={() => setIsMembresiaModalOpen(true)}>
            <Plus size={16} /> Registrar Membresía
          </Button>
        </div>
        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accentNeon"></div>
              <p className="text-sm">Cargando registros de membresías...</p>
            </div>
          ) : membresias.length > 0 ? (
            <Table headers={['Socio', 'Plan Contratado', 'Fecha Inicio', 'Fecha Vencimiento', 'Estado', 'Acciones']}>
              {membresias.map((membresia) => (
                <tr key={membresia.id} className="hover:bg-darkCard/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-200">
                    <div>
                      <div className="text-sm font-bold text-gray-200">{membresia.cliente?.user?.name}</div>
                      <div className="text-xs text-gray-500">{membresia.cliente?.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accentNeon font-medium uppercase">
                    {membresia.plan?.nombre || 'Plan Invalido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarRange size={14} />
                      <span>{membresia.fecha_inicio ? membresia.fecha_inicio.substring(0, 10) : '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarRange size={14} />
                      <span>{membresia.fecha_vencimiento ? membresia.fecha_vencimiento.substring(0, 10) : '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(membresia.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1.5 py-1 px-3"
                      onClick={() => handleRenovar(membresia.id)}
                    >
                      <RefreshCw size={12} /> Renovar
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Info size={40} className="mx-auto text-gray-600 mb-2" />
              <p className="text-sm font-semibold">No se encontraron membresías registradas</p>
              <p className="text-xs text-gray-600 mt-1">Registra membresías desde el perfil de un socio o el botón superior.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Register Membership Modal */}
      <MembresiaModal
        isOpen={isMembresiaModalOpen}
        onClose={() => setIsMembresiaModalOpen(false)}
        onSave={fetchMembresias}
      />

      {/* Plan Modal (Create/Edit) */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={fetchPlanes}
        plan={selectedPlan}
      />
    </div>
  );
};

export default MembresiasList;
