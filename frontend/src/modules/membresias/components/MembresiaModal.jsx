import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, CreditCard, Calendar, DollarSign, User, AlertCircle, Info } from 'lucide-react';

const MembresiaModal = ({ isOpen, onClose, onSave, preselectedClienteId = null }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  
  const [planes, setPlanes] = useState([]);
  const [planId, setPlanId] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [estado, setEstado] = useState('activa');
  
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().substring(0, 10);
    setFechaInicio(today);

    if (isOpen) {
      setErrorMsg('');
      setValidationErrors({});
      
      if (preselectedClienteId) {
        setClienteId(preselectedClienteId.toString());
      } else {
        setClienteId('');
        fetchClientes();
      }

      fetchPlanes();
      setEstado('activa');
    }
  }, [isOpen, preselectedClienteId]);

  const fetchClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data.data || []);
    } catch (err) {
      console.error('Error fetching clients for membership:', err);
      setErrorMsg('No se pudieron cargar los socios.');
    } finally {
      setLoadingClientes(false);
    }
  };

  const fetchPlanes = async () => {
    setLoadingPlanes(true);
    try {
      const response = await api.get('/planes');
      const loadedPlanes = response.data.data || [];
      setPlanes(loadedPlanes);
      
      if (loadedPlanes.length > 0) {
        setPlanId(loadedPlanes[0].id.toString());
        setPrecio(parseFloat(loadedPlanes[0].precio).toFixed(2));
      } else {
        setPlanId('');
        setPrecio('');
      }
    } catch (err) {
      console.error('Error fetching plans for membership modal:', err);
      setErrorMsg('No se pudieron cargar los planes.');
    } finally {
      setLoadingPlanes(false);
    }
  };

  const handlePlanChange = (e) => {
    const selectedPlanId = e.target.value;
    setPlanId(selectedPlanId);
    
    const selectedPlan = planes.find(p => p.id.toString() === selectedPlanId);
    if (selectedPlan) {
      setPrecio(parseFloat(selectedPlan.precio).toFixed(2));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});
    setSaving(true);

    if (!clienteId) {
      setErrorMsg('Por favor seleccione un socio.');
      setSaving(false);
      return;
    }

    if (!planId) {
      setErrorMsg('Por favor seleccione un plan (debe crear planes primero si no hay ninguno).');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        cliente_id: parseInt(clienteId),
        plan_id: parseInt(planId),
        precio: parseFloat(precio),
        fecha_inicio: fechaInicio,
        estado: estado
      };

      const response = await api.post('/membresias', payload);
      
      if (onSave) {
        onSave(response.data.data);
      }
      onClose();
    } catch (err) {
      console.error('Error registering membership:', err);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMsg(err.response.data.message || 'Error al guardar la membresía.');
        }
      } else {
        setErrorMsg('Error de red. No se pudo conectar con el servidor.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-md">
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-md shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder sticky top-0 bg-darkCard z-10">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <CreditCard className="text-accentNeon" size={20} />
            Registrar Membresía
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Client Selector (only if not preselected) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Seleccionar Socio</label>
            {preselectedClienteId ? (
              <div className="px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-400 text-sm flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span>ID Socio: {preselectedClienteId}</span>
              </div>
            ) : (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <User size={16} />
                </span>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  required
                  disabled={loadingClientes}
                  className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 focus:outline-none text-sm appearance-none ${
                    validationErrors.cliente_id ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                  }`}
                >
                  <option value="">-- Seleccione un Socio --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.user?.name} ({c.user?.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {validationErrors.cliente_id && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.cliente_id[0]}</p>
            )}
          </div>

          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Plan de Membresía</label>
            <div className="relative font-sans text-sm">
              <select
                value={planId}
                onChange={handlePlanChange}
                required
                disabled={loadingPlanes || planes.length === 0}
                className={`w-full px-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 focus:outline-none text-sm appearance-none ${
                  validationErrors.plan_id ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                }`}
              >
                {planes.length === 0 ? (
                  <option value="">No hay planes creados, regístralos primero</option>
                ) : (
                  planes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (${parseFloat(p.precio).toFixed(2)} - {p.duracion_dias} Días)
                    </option>
                  ))
                )}
              </select>
            </div>
            {validationErrors.plan_id && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.plan_id[0]}</p>
            )}
          </div>

          {/* Plan Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Precio ($)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <DollarSign size={16} />
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm ${
                  validationErrors.precio ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                }`}
              />
            </div>
            {validationErrors.precio && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.precio[0]}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Fecha de Inicio</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm"
              />
            </div>
            {validationErrors.fecha_inicio && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.fecha_inicio[0]}</p>
            )}
          </div>

          {/* Expiration date auto-calculation info */}
          <div className="flex items-start gap-2 p-3 bg-darkBg/50 border border-darkBorder rounded-xl text-xs text-gray-400">
            <Info size={14} className="text-accentNeon mt-0.5 flex-shrink-0" />
            <p>
              La fecha de vencimiento se calculará automáticamente sumando la duración en días del plan seleccionado a la fecha de inicio.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-darkBorder">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="glow" type="submit" disabled={saving || planes.length === 0}>
              {saving ? 'Guardando...' : 'Asignar Membresía'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembresiaModal;
