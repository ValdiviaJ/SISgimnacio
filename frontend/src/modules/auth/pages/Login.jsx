import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/Button';
import { Mail, Lock, AlertCircle, Info } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Mail size={18} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-4 py-3 bg-darkBg border border-darkBorder rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon focus:ring-1 focus:ring-accentNeon transition-all text-sm"
              placeholder="ejemplo@fitflow.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-300">
              Contraseña
            </label>
            <button
              type="button"
              className="text-xs text-accentNeon hover:underline focus:outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Lock size={18} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-4 py-3 bg-darkBg border border-darkBorder rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon focus:ring-1 focus:ring-accentNeon transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button type="submit" variant="glow" className="w-full py-3" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Ingresar al Panel'}
        </Button>
      </form>

      {/* Developer Credentials Helper */}
      <div className="p-4 bg-darkCard border border-darkBorder rounded-2xl text-xs text-gray-400 space-y-2">
        <p className="font-bold flex items-center gap-1.5 text-accentNeon">
          <Info size={14} /> Cuentas de desarrollo preparadas:
        </p>
        <ul className="space-y-1 pl-4 list-disc">
          <li><strong>Admin</strong>: <code>admin@fitflow.com</code></li>
          <li><strong>Recepción</strong>: <code>recepcion@fitflow.com</code></li>
          <li><strong>Entrenador</strong>: <code>coach@fitflow.com</code></li>
          <li><strong>Cliente</strong>: <code>cliente@fitflow.com</code></li>
        </ul>
        <p className="text-[10px] text-gray-500 mt-1 italic">Cualquier contraseña funciona en desarrollo.</p>
      </div>
    </div>
  );
};

export default Login;
