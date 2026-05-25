import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, Award, DollarSign, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';

const PlanModal = ({ isOpen, onClose, onSave, plan = null }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracionDias, setDuracionDias] = useState('30');
  const [popular, setPopular] = useState(false);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setValidationErrors({});
      setNewFeature('');
      
      if (plan) {
        setNombre(plan.nombre || '');
        setPrecio(plan.precio ? parseFloat(plan.precio).toFixed(2) : '');
        setDuracionDias(plan.duracion_dias ? plan.duracion_dias.toString() : '30');
        setPopular(!!plan.popular);
        setFeatures(Array.isArray(plan.features) ? [...plan.features] : []);
      } else {
        setNombre('');
        setPrecio('');
        setDuracionDias('30');
        setPopular(false);
        setFeatures(['Acceso libre']);
      }
    }
  }, [isOpen, plan]);

  if (!isOpen) return null;

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});
    setSaving(true);

    if (features.length === 0) {
      setErrorMsg('Por favor agregue al menos una característica al plan.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        nombre,
        precio: parseFloat(precio),
        duracion_dias: parseInt(duracionDias),
        features,
        popular: !!popular
      };

      let response;
      if (plan) {
        // Edit mode
        response = await api.put(`/planes/${plan.id}`, payload);
      } else {
        // Create mode
        response = await api.post('/planes', payload);
      }

      if (onSave) {
        onSave(response.data.data);
      }
      onClose();
    } catch (err) {
      console.error('Error saving plan:', err);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMsg(err.response.data.message || 'Error al guardar el plan.');
        }
      } else {
        setErrorMsg('Error de red. No se pudo conectar con el servidor.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-md">
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-md shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder sticky top-0 bg-darkCard z-10">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Award className="text-accentNeon" size={20} />
            {plan ? 'Editar Plan de Membresía' : 'Crear Nuevo Plan'}
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

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nombre del Plan</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Plan Trimestral, Plan VIP"
              className={`w-full px-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                validationErrors.nombre ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
              }`}
            />
            {validationErrors.nombre && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.nombre[0]}</p>
            )}
          </div>

          {/* Price */}
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

          {/* Duration in Days */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Duración (Días)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Calendar size={16} />
              </span>
              <select
                value={duracionDias}
                onChange={(e) => setDuracionDias(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
              >
                <option value="7">7 Días (Semanal)</option>
                <option value="15">15 Días (Quincenal)</option>
                <option value="30">30 Días (Mensual)</option>
                <option value="90">90 Días (Trimestral)</option>
                <option value="180">180 Días (Semestral)</option>
                <option value="365">365 Días (Anual)</option>
              </select>
            </div>
            {validationErrors.duracion_dias && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.duracion_dias[0]}</p>
            )}
          </div>

          {/* Popular toggle */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="popular"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="w-4 h-4 accent-accentNeon bg-darkBg border-darkBorder rounded focus:ring-accentNeon focus:ring-opacity-50"
            />
            <label htmlFor="popular" className="text-xs font-semibold text-gray-300 uppercase cursor-pointer selection:bg-transparent">
              Marcar como "Popular" (Efecto visual destacado)
            </label>
          </div>

          {/* Plan Features */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Características del Plan</label>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ej: Lockers gratis, Acceso 24/7"
                className="w-full px-3 py-1.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-xs"
              />
              <Button variant="outline" onClick={handleAddFeature} className="py-1 px-3.5">
                <Plus size={14} /> Agregar
              </Button>
            </div>

            <ul className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-darkBg/40 border border-darkBorder rounded-xl">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs text-gray-300 bg-darkCard/50 border border-darkBorder/40 px-2 py-1 rounded-lg">
                  <span className="truncate">{feature}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              ))}
              {features.length === 0 && (
                <p className="text-[10px] text-gray-500 text-center py-4">Sin características agregadas</p>
              )}
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-darkBorder">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="glow" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : plan ? 'Guardar Plan' : 'Crear Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
