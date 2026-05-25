import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { X, ClipboardList, Plus, Trash2, Dumbbell, AlertCircle } from 'lucide-react';

const RoutineModal = ({ isOpen, onClose, onSave, routine = null }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('principiante');
  const [ejercicios, setEjercicios] = useState([]);

  // Form fields for adding new exercise
  const [exName, setExName] = useState('');
  const [exSeries, setExSeries] = useState('4');
  const [exReps, setExReps] = useState('10');
  const [exDescanso, setExDescanso] = useState('60s');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setValidationErrors({});
      setExName('');
      setExSeries('4');
      setExReps('10');
      setExDescanso('60s');

      if (routine) {
        setNombre(routine.nombre || '');
        setDescripcion(routine.descripcion || '');
        setNivel(routine.nivel || 'principiante');
        setEjercicios(Array.isArray(routine.ejercicios) ? [...routine.ejercicios] : []);
      } else {
        setNombre('');
        setDescripcion('');
        setNivel('principiante');
        setEjercicios([]);
      }
    }
  }, [isOpen, routine]);

  if (!isOpen) return null;

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!exName.trim()) return;

    const newExercise = {
      nombre: exName.trim(),
      series: parseInt(exSeries) || 4,
      reps: exReps.trim(),
      descanso: exDescanso.trim()
    };

    setEjercicios([...ejercicios, newExercise]);
    setExName('');
  };

  const handleRemoveExercise = (index) => {
    setEjercicios(ejercicios.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});

    if (ejercicios.length === 0) {
      setErrorMsg('Debe agregar al menos un ejercicio a la rutina.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre,
        descripcion,
        nivel,
        ejercicios
      };

      let response;
      if (routine) {
        response = await api.put(`/rutinas/${routine.id}`, payload);
      } else {
        response = await api.post('/rutinas', payload);
      }

      if (onSave) {
        onSave(response.data.data);
      }
      onClose();
    } catch (err) {
      console.error('Error saving routine:', err);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMsg(err.response.data.message || 'Error al guardar la rutina.');
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
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder bg-darkCard rounded-t-3xl sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <ClipboardList className="text-accentNeon" size={20} />
            {routine ? 'Editar Plantilla de Rutina' : 'Crear Nueva Plantilla'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Routine Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nombre de la Rutina</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Fuerza 5x5, HIIT Quema Grasa"
              className={`w-full px-4 py-2 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                validationErrors.nombre ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
              }`}
            />
            {validationErrors.nombre && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.nombre[0]}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Descripción / Enfoque</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Rutina de fuerza enfocada en ejercicios básicos multiarticulares."
              rows={2}
              className="w-full px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm resize-none"
            />
          </div>

          {/* Level selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nivel de Dificultad</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
              className="w-full px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          {/* Exercises Section */}
          <div className="border-t border-darkBorder pt-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Dumbbell size={14} className="text-accentNeon" />
              Ejercicios de la Rutina
            </h4>

            {/* Input grid for new exercise */}
            <div className="bg-darkBg/40 border border-darkBorder p-3 rounded-2xl space-y-3 mb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre del Ejercicio (ej: Press Militar)"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Series</label>
                  <input
                    type="number"
                    min="1"
                    value={exSeries}
                    onChange={(e) => setExSeries(e.target.value)}
                    className="w-full px-2.5 py-1 bg-darkBg border border-darkBorder rounded-lg text-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Repeticiones</label>
                  <input
                    type="text"
                    placeholder="Ej: 10 o Fallo"
                    value={exReps}
                    onChange={(e) => setExReps(e.target.value)}
                    className="w-full px-2.5 py-1 bg-darkBg border border-darkBorder rounded-lg text-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Descanso</label>
                  <input
                    type="text"
                    placeholder="Ej: 60s o 2 min"
                    value={exDescanso}
                    onChange={(e) => setExDescanso(e.target.value)}
                    className="w-full px-2.5 py-1 bg-darkBg border border-darkBorder rounded-lg text-gray-200 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button 
                  onClick={handleAddExercise} 
                  variant="outline" 
                  className="py-1 px-4 text-xs"
                  type="button"
                  disabled={!exName.trim()}
                >
                  <Plus size={14} /> Añadir Ejercicio
                </Button>
              </div>
            </div>

            {/* List of added exercises */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-darkBg/20 border border-darkBorder rounded-xl">
              {ejercicios.map((ej, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-gray-300 bg-darkCard/60 border border-darkBorder/40 px-3 py-2 rounded-xl">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-gray-200 truncate">{ej.nombre}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {ej.series} series • {ej.reps} reps • Descanso: {ej.descanso}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveExercise(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {ejercicios.length === 0 && (
                <p className="text-[10px] text-gray-500 text-center py-6">Ningún ejercicio en la lista. Agrega al menos uno arriba.</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-darkBorder sticky bottom-0 bg-darkCard z-10 mt-6">
            <Button variant="secondary" onClick={onClose} disabled={saving} type="button">
              Cancelar
            </Button>
            <Button variant="glow" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : routine ? 'Guardar Cambios' : 'Crear Rutina'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineModal;
