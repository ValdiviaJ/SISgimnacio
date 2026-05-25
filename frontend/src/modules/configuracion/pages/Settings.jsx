import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Save, Building2, Phone, MapPin, DollarSign, Percent, Clock } from 'lucide-react';

const Settings = () => {
  const [gymName, setGymName] = useState('FitFlow Gym');
  const [address, setAddress] = useState('Av. Principal 123, San Isidro');
  const [tel, setTel] = useState('+51 987 654 321');
  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState('18.00');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configuración guardada (Simulación).');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Profile */}
        <Card title="Información del Establecimiento" subtitle="Datos básicos y de contacto del gimnasio">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Nombre Comercial</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Building2 size={16} />
                </span>
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Teléfono de Soporte</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Dirección Física</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Currency & Tax */}
        <Card title="Finanzas y Moneda" subtitle="Configuraciones impositivas y de cobro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Moneda Local</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <DollarSign size={16} />
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 focus:outline-none focus:border-accentNeon text-sm appearance-none"
                >
                  <option value="USD">Dólares Americanos (USD)</option>
                  <option value="PEN">Soles Peruanos (PEN)</option>
                  <option value="EUR">Euros (EUR)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Impuesto Generado (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Percent size={16} />
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Hours schedule config */}
        <Card title="Horarios de Atención" subtitle="Rango de apertura para control de check-in">
          <div className="space-y-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center justify-between p-3 bg-darkBg/50 border border-darkBorder rounded-xl">
              <span className="font-bold text-gray-300">Lunes a Viernes</span>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-gray-500" />
                <span className="text-gray-200">06:00 AM - 10:00 PM</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-darkBg/50 border border-darkBorder rounded-xl">
              <span className="font-bold text-gray-300">Sábado</span>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-gray-500" />
                <span className="text-gray-200">08:00 AM - 06:00 PM</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-darkBg/50 border border-darkBorder rounded-xl">
              <span className="font-bold text-gray-300">Domingo</span>
              <span className="text-red-400 font-semibold">Cerrado</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="glow" className="px-6 py-2.5">
            <Save size={16} /> Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
