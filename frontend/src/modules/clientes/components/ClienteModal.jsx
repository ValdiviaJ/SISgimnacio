import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { X, Upload, User, Phone, MapPin, Mail, Calendar, Key, AlertCircle } from 'lucide-react';

const ClienteModal = ({ isOpen, onClose, onSave, cliente = null, trainers = [] }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [entrenadorId, setEntrenadorId] = useState('');
  const [estado, setEstado] = useState('activo');
  const [observaciones, setObservaciones] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (cliente) {
      setName(cliente.user?.name || '');
      setEmail(cliente.user?.email || '');
      setPassword('');
      setTelefono(cliente.telefono || '');
      setDireccion(cliente.direccion || '');
      setFechaNacimiento(cliente.fecha_nacimiento || '');
      setGenero(cliente.genero || 'Masculino');
      setEntrenadorId(cliente.entrenador_id || '');
      setEstado(cliente.estado || 'activo');
      setObservaciones(cliente.observaciones || '');
      setFotoPreview(cliente.foto_perfil || '');
      setFotoPerfil(null);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setTelefono('');
      setDireccion('');
      setFechaNacimiento('');
      setGenero('Masculino');
      setEntrenadorId('');
      setEstado('activo');
      setObservaciones('');
      setFotoPreview('');
      setFotoPerfil(null);
    }
    setValidationErrors({});
  }, [cliente, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    formData.append('telefono', telefono);
    formData.append('direccion', direccion);
    formData.append('fecha_nacimiento', fechaNacimiento);
    formData.append('genero', genero);
    formData.append('estado', estado);
    formData.append('observaciones', observaciones);
    if (entrenadorId) formData.append('entrenador_id', entrenadorId);
    if (fotoPerfil) formData.append('foto_perfil', fotoPerfil);

    // If editing, Laravel requires PUT requests. But standard PHP multipart form parser
    // does not recognize PUT files, so we fake it using POST and method spoofing.
    if (cliente) {
      formData.append('_method', 'PUT');
    }

    try {
      await onSave(formData, cliente?.id);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-md">
      <div className="bg-darkCard border border-darkBorder rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-darkBorder sticky top-0 bg-darkCard z-10">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <User className="text-accentNeon" size={20} />
            {cliente ? 'Editar Datos del Socio' : 'Registrar Nuevo Socio'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Upload Box */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-darkBg/50 border border-darkBorder rounded-2xl">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-2 border-darkBorder flex items-center justify-center overflow-hidden bg-darkBg text-accentNeon font-black text-2xl">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0) || <User size={36} />
                )}
              </div>
              <label className="absolute inset-0 bg-darkBg/70 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Upload size={18} className="text-accentNeon" />
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <p className="text-sm font-semibold text-gray-200">Foto de Perfil</p>
              <p className="text-xs text-gray-500">Formatos recomendados: JPG o PNG. Máximo 2MB.</p>
              {validationErrors.foto_perfil && (
                <p className="text-xs text-red-400">{validationErrors.foto_perfil[0]}</p>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nombre Completo</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Marcos Deza"
                  className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                    validationErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.name[0]}</p>
              )}
            </div>

            {/* Email Address */}
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
                  placeholder="marcos@correo.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                    validationErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.email[0]}</p>
              )}
            </div>

            {/* Password (Optional / for creation only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Contraseña {cliente ? '(Opcional)' : ''}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Key size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={cliente ? 'Dejar en blanco para mantener' : 'Contraseña de acceso'}
                  required={!cliente}
                  className={`w-full pl-10 pr-4 py-2.5 bg-darkBg border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none text-sm transition-colors ${
                    validationErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-darkBorder focus:border-accentNeon'
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.password[0]}</p>
              )}
            </div>

            {/* Telephone */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Teléfono</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+51 987 654 321"
                  className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Dirección Física</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle Las Flores 123"
                  className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>

            {/* Birthdate */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Fecha de Nacimiento</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Género</label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Coach Assign */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Entrenador Asignado</label>
              <select
                value={entrenadorId}
                onChange={(e) => setEntrenadorId(e.target.value)}
                className="w-full px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
              >
                <option value="">Ninguno</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.user?.name || `Entrenador ${t.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Estado Inicial</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
              >
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>

            {/* Observations */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Observaciones / Historial Clínico</label>
              <textarea
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Anotaciones importantes sobre lesiones, objetivos o condiciones médicas..."
                className="w-full px-4 py-2.5 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm"
              />
            </div>

          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-darkBorder">
            <Button variant="secondary" onClick={onClose} className="px-5">
              Cancelar
            </Button>
            <Button variant="glow" type="submit" className="px-5">
              {cliente ? 'Guardar Cambios' : 'Registrar Socio'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
