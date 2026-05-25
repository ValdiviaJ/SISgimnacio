import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, Users, AlertCircle, Loader2 } from 'lucide-react';

const AssignRoutineModal = ({ isOpen, onClose, routineId = null, routineName = '' }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await api.get('/clientes');
        if (response.data && response.data.success) {
          setClientes(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setErrorMsg('No se pudo cargar la lista de socios.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      setClienteId('');
      setErrorMsg('');
      setSuccessMsg('');
      fetchClientes();
    } else {
      setClientes([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId) return;

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post(`/rutinas/${routineId}/assign`, {
        cliente_id: parseInt(clienteId)
      });
      setSuccessMsg('Rutina asignada al socio exitosamente.');
      // Auto close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error assigning routine:', err);
      setErrorMsg(err.response?.data?.message || 'Error al asignar la rutina.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-md">
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-md shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder sticky top-0 bg-darkCard z-10 rounded-t-3xl">
          <div>
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Users className="text-accentNeon" size={20} />
              Asignar Rutina a Socio
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Rutina: {routineName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin text-accentNeon mb-2" size={28} />
              <p className="text-xs">Cargando socios...</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Seleccionar Socio</label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm"
                disabled={saving || successMsg !== ''}
              >
                <option value="">-- Seleccionar socio --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user?.name} ({c.user?.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-darkBorder">
            <Button variant="secondary" onClick={onClose} disabled={saving || successMsg !== ''} type="button">
              Cancelar
            </Button>
            <Button variant="glow" type="submit" disabled={saving || !clienteId || successMsg !== ''}>
              {saving ? 'Asignando...' : 'Asignar Rutina'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoutineModal;
