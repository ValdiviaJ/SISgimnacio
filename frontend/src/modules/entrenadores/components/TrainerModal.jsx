import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, Award, Mail, Key, Calendar, Plus, AlertCircle } from 'lucide-react';

const TrainerModal = ({ isOpen, onClose, onSave, trainer = null }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [horario, setHorario] = useState('Turno Mañana');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setValidationErrors({});
      setPassword('');

      if (trainer) {
        setName(trainer.user?.name || '');
        setEmail(trainer.user?.email || '');
        setEspecialidad(trainer.especialidad || '');
        setHorario(trainer.horario || 'Turno Mañana');
      } else {
        setName('');
        setEmail('');
        setEspecialidad('');
        setHorario('Turno Mañana');
      }
    }
  }, [isOpen, trainer]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});
    setSaving(true);

    try {
      const payload = {
        name,
        email,
        especialidad,
        horario,
      };

      if (password) {
        payload.password = password;
      }

      let response;
      if (trainer) {
        // Edit mode
        response = await api.put(`/entrenadores/${trainer.id}`, payload);
      } else {
        // Create mode
        if (!password) {
          setErrorMsg('La contraseña es requerida para un nuevo entrenador.');
          setSaving(false);
          return;
        }
        response = await api.post('/entrenadores', payload);
      }

      if (onSave) {
        onSave(response.data.data);
      }
      onClose();
    } catch (err) {
      console.error('Error saving trainer:', err);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMsg(err.response.data.message || 'Error al guardar el entrenador.');
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
            {trainer ? 'Editar Instructor' : 'Agregar Nuevo Instructor'}
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
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Lucas Rossi"
              className={`w-full px-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                validationErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
              }`}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm ${
                  validationErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
              Contraseña {trainer && <span className="text-[10px] text-gray-500 lowercase">(Dejar en blanco para no cambiar)</span>}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Key size={16} />
              </span>
              <input
                type="password"
                required={!trainer}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={trainer ? "••••••••" : "Mínimo 6 caracteres"}
                className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm ${
                  validationErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                }`}
              />
            </div>
            {validationErrors.password && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.password[0]}</p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Especialidad</label>
            <input
              type="text"
              required
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              placeholder="Ej: Musculación & Powerlifting"
              className={`w-full px-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                validationErrors.especialidad ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
              }`}
            />
            {validationErrors.especialidad && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.especialidad[0]}</p>
            )}
          </div>

          {/* Horario */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Horario / Turno</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Calendar size={16} />
              </span>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
              >
                <option value="Turno Mañana">Turno Mañana (06:00 - 14:00)</option>
                <option value="Turno Tarde">Turno Tarde (14:00 - 22:00)</option>
                <option value="Turno Noche">Turno Noche (18:00 - 23:00)</option>
                <option value="Horario Flexible">Horario Flexible</option>
              </select>
            </div>
            {validationErrors.horario && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.horario[0]}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-darkBorder">
            <Button variant="secondary" onClick={onClose} disabled={saving} type="button">
              Cancelar
            </Button>
            <Button variant="glow" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : trainer ? 'Guardar Cambios' : 'Agregar Entrenador'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerModal;
