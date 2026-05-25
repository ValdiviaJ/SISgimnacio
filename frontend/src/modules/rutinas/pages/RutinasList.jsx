import React, { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import RoutineModal from '../components/RoutineModal';
import AssignRoutineModal from '../components/AssignRoutineModal';
import { Plus, Flame, Clock, Dumbbell, Loader2 } from 'lucide-react';

const RutinasList = () => {
  const { user } = useAuth();
  const isCliente = user?.role === 'cliente';
  const canManage = user?.role === 'admin' || user?.role === 'entrenador';

  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const fetchRutinas = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let response;
      if (isCliente) {
        // Fetch routines assigned to this specific client
        const clienteId = user?.cliente?.id;
        if (clienteId) {
          response = await api.get(`/rutinas/cliente/${clienteId}`);
        } else {
          setErrorMsg('No se pudo encontrar el perfil de socio asociado a esta cuenta.');
          setLoading(false);
          return;
        }
      } else {
        // Fetch all routine templates
        response = await api.get('/rutinas');
      }

      if (response && response.data && response.data.success) {
        setRutinas(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching routines:', err);
      setErrorMsg('No se pudieron cargar las rutinas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRutinas();
    }
  }, [user]);

  const handleOpenRoutineModal = (routine = null) => {
    setSelectedRoutine(routine);
    setIsRoutineModalOpen(true);
  };

  const handleOpenAssignModal = (routine) => {
    setSelectedRoutine(routine);
    setIsAssignModalOpen(true);
  };

  const handleDeleteRoutine = async (routine) => {
    if (!window.confirm(`¿Está seguro de eliminar la plantilla de rutina "${routine.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/rutinas/${routine.id}`);
      fetchRutinas();
    } catch (err) {
      console.error('Error deleting routine:', err);
      alert(err.response?.data?.message || 'Error al eliminar la rutina.');
    }
  };

  const handleSaveRoutine = () => {
    fetchRutinas();
  };

  const getNivelBadge = (nivel) => {
    const styles = {
      principiante: 'bg-green-500/10 text-green-400 border border-green-500/20',
      intermedio: 'bg-accentNeon/10 text-accentNeon border border-accentNeon/20',
      avanzado: 'bg-red-500/10 text-red-400 border border-red-500/20'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[nivel] || styles.principiante}`}>
        {nivel}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-200">
          {isCliente ? 'Mis Rutinas de Entrenamiento' : 'Plantillas de Rutina'}
        </h2>
        {canManage && (
          <Button variant="glow" onClick={() => handleOpenRoutineModal(null)}>
            <Plus size={16} /> Crear Rutina
          </Button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={48} className="animate-spin text-accentNeon mb-4" />
          <p className="text-sm">Cargando rutinas...</p>
        </div>
      ) : rutinas.length === 0 ? (
        <Card className="text-center py-16 text-gray-500">
          <Flame size={48} className="mx-auto text-gray-600 mb-3 animate-pulse" />
          <p className="text-base font-semibold text-gray-400">
            {isCliente ? 'No tienes rutinas asignadas' : 'No hay plantillas de rutina registradas'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {isCliente 
              ? 'Pídele a tu instructor o al administrador que te asigne un plan de entrenamiento.' 
              : 'Haz clic en "Crear Rutina" para dar de alta la primera plantilla.'}
          </p>
        </Card>
      ) : (
        /* Grid of routines */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rutinas.map((rutina) => (
            <Card key={rutina.id} className="hoverGlow flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header card */}
                <div className="flex justify-between items-start">
                  <span className="p-2.5 bg-darkBorder rounded-xl text-accentNeon shadow-glow">
                    <Flame size={20} />
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    {getNivelBadge(rutina.nivel)}
                    {isCliente && rutina.pivot?.estado && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase">
                        {rutina.pivot.estado}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title / Description */}
                <div>
                  <h3 className="text-lg font-bold text-gray-200">{rutina.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-1">{rutina.descripcion || 'Sin descripción'}</p>
                </div>

                {/* Exercises preview */}
                <div className="bg-darkBg/40 border border-darkBorder/50 rounded-xl p-3.5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2">
                    <Dumbbell size={12} className="text-accentNeon" />
                    Ejercicios ({Array.isArray(rutina.ejercicios) ? rutina.ejercicios.length : 0})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {Array.isArray(rutina.ejercicios) && rutina.ejercicios.map((ej, index) => (
                      <div key={index} className="flex justify-between text-xs text-gray-400 border-b border-darkBorder/30 pb-1.5 last:border-0 last:pb-0">
                        <div className="font-semibold text-gray-300 truncate max-w-[140px]" title={ej.nombre}>
                          {ej.nombre}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1">
                          <span>{ej.series}x{ej.reps}</span>
                          <span className="mx-0.5 opacity-30">|</span>
                          <span className="text-[10px]">{ej.descanso}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-600 pt-2">
                  <span>Creado por: {rutina.entrenador?.user?.name || 'Staff FitFlow'}</span>
                  {isCliente && rutina.pivot?.asignado_el && (
                    <span>Asignada el: {rutina.pivot.asignado_el}</span>
                  )}
                </div>
              </div>

              {canManage && (
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleOpenAssignModal(rutina)}
                      variant="secondary" 
                      className="w-1/2 py-2 text-xs font-semibold"
                    >
                      Asignar Socio
                    </Button>
                    <Button 
                      onClick={() => handleOpenRoutineModal(rutina)}
                      variant="outline" 
                      className="w-1/2 py-2 text-xs font-semibold"
                    >
                      Editar
                    </Button>
                  </div>
                  <Button 
                    onClick={() => handleDeleteRoutine(rutina)}
                    variant="secondary" 
                    className="w-full py-1.5 text-xs font-semibold border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/10"
                  >
                    Eliminar Plantilla
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <RoutineModal 
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        onSave={handleSaveRoutine}
        routine={selectedRoutine}
      />

      <AssignRoutineModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        routineId={selectedRoutine?.id}
        routineName={selectedRoutine?.nombre || ''}
      />
    </div>
  );
};

export default RutinasList;
