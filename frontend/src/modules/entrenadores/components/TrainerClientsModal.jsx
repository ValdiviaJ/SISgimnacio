import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, Users, Mail, Phone, Calendar, Loader2 } from 'lucide-react';

const TrainerClientsModal = ({ isOpen, onClose, trainerId = null, trainerName = '' }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      if (!trainerId) return;
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await api.get(`/entrenadores/${trainerId}`);
        if (response.data && response.data.success) {
          // The response has trainer details including 'clientes' relation
          setClients(response.data.data?.clientes || []);
        }
      } catch (err) {
        console.error('Error fetching trainer clients:', err);
        setErrorMsg('No se pudieron recuperar los clientes de este instructor.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && trainerId) {
      fetchClients();
    } else {
      setClients([]);
    }
  }, [isOpen, trainerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-md">
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder sticky top-0 bg-darkCard z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Users className="text-accentNeon" size={20} />
              Clientes Asignados
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Instructor: {trainerName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 size={36} className="animate-spin text-accentNeon mb-3" />
              <p className="text-sm">Cargando lista de clientes...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-8 text-red-400 text-sm">
              <p>{errorMsg}</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={40} className="mx-auto text-gray-600 mb-2.5" />
              <p className="text-sm font-semibold">Sin Clientes Asignados</p>
              <p className="text-xs text-gray-600 mt-1">Este entrenador no tiene socios vinculados en este momento.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {clients.map((client) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-4 bg-darkBg/40 border border-darkBorder/60 hover:border-darkBorder rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-darkCard border border-darkBorder flex items-center justify-center font-bold text-gray-300 text-sm">
                      {client.user?.name ? client.user.name.charAt(0) : 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200 text-sm">{client.user?.name || 'Socio'}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        {client.user?.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {client.user.email}
                          </span>
                        )}
                        {client.telefono && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {client.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider inline-block border ${
                      client.estado === 'activo'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : client.estado === 'suspendido'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {client.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Close Button */}
          <div className="flex justify-end pt-5 border-t border-darkBorder mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerClientsModal;
