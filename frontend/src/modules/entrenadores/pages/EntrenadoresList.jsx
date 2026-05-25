import React, { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import TrainerModal from '../components/TrainerModal';
import TrainerClientsModal from '../components/TrainerClientsModal';
import { Plus, Award, Calendar, Users, Mail, Loader2 } from 'lucide-react';

const EntrenadoresList = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const fetchTrainers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/entrenadores');
      if (response.data && response.data.success) {
        setTrainers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setErrorMsg('No se pudo cargar la lista de entrenadores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenTrainerModal = (trainer = null) => {
    setSelectedTrainer(trainer);
    setIsTrainerModalOpen(true);
  };

  const handleOpenClients = (trainer) => {
    setSelectedTrainer(trainer);
    setIsClientsModalOpen(true);
  };

  const handleDeleteTrainer = async (trainer) => {
    if (!window.confirm(`¿Está seguro que desea eliminar al instructor "${trainer.user?.name || 'este entrenador'}"?`)) {
      return;
    }

    try {
      await api.delete(`/entrenadores/${trainer.id}`);
      fetchTrainers(); // Refresh list
    } catch (err) {
      console.error('Error deleting trainer:', err);
      alert(err.response?.data?.message || 'Error al eliminar el entrenador.');
    }
  };

  const handleSaveTrainer = () => {
    fetchTrainers(); // Refresh list after create or edit
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-200">Staff de Instructores</h2>
        {isAdmin && (
          <Button variant="glow" onClick={() => handleOpenTrainerModal(null)}>
            <Plus size={16} /> Agregar Entrenador
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
          <p className="text-sm">Cargando instructores...</p>
        </div>
      ) : trainers.length === 0 ? (
        <Card className="text-center py-16 text-gray-500">
          <Award size={48} className="mx-auto text-gray-600 mb-3" />
          <p className="text-base font-semibold text-gray-400">No hay entrenadores registrados</p>
          <p className="text-sm text-gray-600 mt-1">
            {isAdmin ? 'Haz clic en "Agregar Entrenador" para crear el primero.' : 'El administrador aún no ha registrado entrenadores.'}
          </p>
        </Card>
      ) : (
        /* Grid of trainers */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="hoverGlow flex flex-col justify-between">
              <div>
                {/* Profile Card Header */}
                <div className="flex items-center gap-4 border-b border-darkBorder pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accentNeon to-accentBlue text-darkBg flex items-center justify-center font-black text-lg">
                    {trainer.user?.name ? trainer.user.name.charAt(0) : 'E'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-100">{trainer.user?.name || 'Instructor'}</h3>
                    <span className="text-xs text-accentNeon font-medium">{trainer.especialidad || 'General'}</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="mt-6 space-y-3.5 text-sm text-gray-400">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-gray-500" />
                    <span>{trainer.horario || 'Sin horario asignado'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-gray-500" />
                    <span>{trainer.clientes_count ?? 0} Clientes asignados</span>
                  </div>
                  {trainer.user?.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail size={16} className="text-gray-500" />
                      <span className="truncate max-w-[200px]" title={trainer.user.email}>
                        {trainer.user.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <Button 
                  onClick={() => handleOpenClients(trainer)}
                  variant="secondary" 
                  className={`${isAdmin ? 'w-1/3' : 'w-full'} py-2 text-xs font-semibold`}
                >
                  Clientes
                </Button>
                {isAdmin && (
                  <>
                    <Button 
                      onClick={() => handleOpenTrainerModal(trainer)}
                      variant="outline" 
                      className="w-1/3 py-2 text-xs font-semibold"
                    >
                      Editar
                    </Button>
                    <Button 
                      onClick={() => handleDeleteTrainer(trainer)}
                      variant="secondary" 
                      className="w-1/3 py-2 text-xs font-semibold border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/10"
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <TrainerModal 
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        onSave={handleSaveTrainer}
        trainer={selectedTrainer}
      />

      <TrainerClientsModal 
        isOpen={isClientsModalOpen}
        onClose={() => setIsClientsModalOpen(false)}
        trainerId={selectedTrainer?.id}
        trainerName={selectedTrainer?.user?.name || ''}
      />
    </div>
  );
};

export default EntrenadoresList;
