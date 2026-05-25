import React, { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { QrCode, Scan, ArrowRight, ShieldCheck, UserX, Clock } from 'lucide-react';

const CheckIn = () => {
  const [code, setCode] = useState('');
  const [registroType, setRegistroType] = useState('check-in'); // 'check-in' or 'check-out'
  const [scanResult, setScanResult] = useState(null);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch today's attendance logs
  const fetchHistorial = async () => {
    try {
      const response = await api.get('/asistencia/historial');
      if (response.data && response.data.success) {
        setRecentCheckIns(response.data.data || []);
      }
    } catch (err) {
      console.error('Error al obtener el historial de asistencia:', err);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const handleRegister = async (identifier, typeOverride) => {
    const type = typeOverride || registroType;
    if (!identifier.trim()) return;

    setLoading(true);
    try {
      if (type === 'check-in') {
        const response = await api.post('/asistencia/check-in', {
          identificador: identifier,
          metodo_acceso: 'manual'
        });
        const data = response.data.data;
        setScanResult({
          success: true,
          name: data.name || 'Marcos Deza',
          plan: data.plan || 'Plan Trimestral',
          expiry: data.expiry || '-',
          status: data.status || 'activo',
          message: response.data.message || 'Acceso Autorizado.',
          type: 'check-in'
        });
      } else {
        const response = await api.post('/asistencia/check-out', {
          identificador: identifier
        });
        const data = response.data.data;
        setScanResult({
          success: true,
          name: data.name || 'Socio',
          plan: 'Salida Registrada',
          expiry: null,
          status: 'check-out',
          message: response.data.message || 'Check-out registrado con éxito.',
          type: 'check-out'
        });
      }
      setCode('');
      fetchHistorial();
    } catch (err) {
      console.error('Error al registrar asistencia:', err);
      const errorData = err.response?.data;
      const errors = errorData?.errors || {};
      
      setScanResult({
        success: false,
        name: errors.name || 'Acceso Denegado',
        plan: errors.plan || 'Sin plan activo',
        expiry: errors.expiry || '-',
        status: errors.status || 'vencido',
        message: errorData?.message || 'Socio no registrado en el sistema.',
        type: type
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async (testCode, type) => {
    await handleRegister(testCode, type);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Panel */}
        <Card className="lg:col-span-1" title="Registro de Entrada" subtitle="Escaneo de QR o ingreso manual de código">
          <div className="space-y-5 mt-4">
            <div className="border border-dashed border-darkBorder rounded-2xl p-6 flex flex-col items-center justify-center bg-darkBg/50 relative overflow-hidden group">
              <QrCode size={64} className="text-gray-500 group-hover:text-accentNeon transition-colors" />
              <p className="text-xs text-gray-500 mt-3 text-center">Cámara Web / Escáner QR listo</p>
              
              {/* Scan Overlay Mockup */}
              <div className="absolute inset-0 bg-accentNeon/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Scan size={32} className="text-accentNeon animate-pulse" />
              </div>
            </div>

            {/* Quick Test Tools */}
            <div className="flex flex-col gap-2 p-3 bg-darkBg/30 border border-darkBorder/60 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Herramientas de Prueba (Seeder)
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleQuickTest('SOCIO-1', 'check-in')} 
                  variant="outline" 
                  className="w-1/2 text-[11px] py-1 px-1.5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                  disabled={loading}
                >
                  Entrada Socio (Activo)
                </Button>
                <Button 
                  onClick={() => handleQuickTest('SOCIO-1', 'check-out')} 
                  variant="outline" 
                  className="w-1/2 text-[11px] py-1 px-1.5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                  disabled={loading}
                >
                  Salida Socio (Activo)
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleQuickTest('SOCIO-999', 'check-in')} 
                  variant="secondary" 
                  className="w-1/2 text-[11px] py-1 px-1.5 border-red-500/20 text-red-400 hover:bg-red-500/10"
                  disabled={loading}
                >
                  Socio Inexistente
                </Button>
                <Button 
                  onClick={() => handleQuickTest('cliente@fitflow.com', 'check-in')} 
                  variant="outline" 
                  className="w-1/2 text-[11px] py-1 px-1.5 border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                  disabled={loading}
                >
                  Entrada por Email
                </Button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-darkBorder"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-600 uppercase font-semibold">O</span>
              <div className="flex-grow border-t border-darkBorder"></div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleRegister(code); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Tipo de Registro</label>
                <div className="grid grid-cols-2 gap-2 bg-darkBg p-1 border border-darkBorder rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRegistroType('check-in')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      registroType === 'check-in'
                        ? 'bg-accentNeon text-darkBg shadow-lg font-black'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Entrada (Check-In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistroType('check-out')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      registroType === 'check-out'
                        ? 'bg-accentNeon text-darkBg shadow-lg font-black'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Salida (Check-Out)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Código de Socio / Email</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={registroType === 'check-in' ? "ej: SOCIO-1 o email" : "ej: SOCIO-1"}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
                    disabled={loading}
                  />
                  <Button type="submit" variant="secondary" className="p-2 border-darkBorder" disabled={loading || !code.trim()}>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Right Clearance Panel */}
        <Card className="lg:col-span-2" title="Resultado del Acceso" subtitle="Estado de membresía del cliente">
          <div className="h-full min-h-[250px] flex items-center justify-center">
            {scanResult ? (
              <div className={`w-full p-6 rounded-2xl border transition-all ${
                !scanResult.success 
                  ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]' 
                  : scanResult.type === 'check-out'
                    ? 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]'
                    : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
              }`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Status Circle icon */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    !scanResult.success 
                      ? 'bg-red-500/20 text-red-400' 
                      : scanResult.type === 'check-out'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {!scanResult.success ? (
                      <UserX size={40} />
                    ) : scanResult.type === 'check-out' ? (
                      <Clock size={40} />
                    ) : (
                      <ShieldCheck size={40} />
                    )}
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h3 className="text-xl font-bold text-gray-100">{scanResult.name}</h3>
                    <p className={`text-sm ${
                      !scanResult.success 
                        ? 'text-red-400/80 font-medium' 
                        : scanResult.type === 'check-out'
                          ? 'text-blue-400/80 font-medium'
                          : 'text-emerald-400/80 font-medium'
                    }`}>
                      {scanResult.message}
                    </p>
                    {scanResult.type === 'check-in' && (
                      <div className="pt-1 text-xs text-gray-500 space-y-0.5">
                        <p>Plan: <span className="text-gray-300 font-medium">{scanResult.plan || 'Sin plan'}</span></p>
                        {scanResult.expiry && scanResult.expiry !== '-' && (
                          <p>
                            Vence el: <span className="font-bold text-gray-300">{scanResult.expiry}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Verification Status */}
                  <div className="text-center sm:text-right">
                    <span className={`px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase inline-block ${
                      !scanResult.success 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                        : scanResult.type === 'check-out'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {!scanResult.success 
                        ? 'Acceso Denegado' 
                        : scanResult.type === 'check-out'
                          ? 'Salida Registrada'
                          : 'Acceso Autorizado'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Scan size={48} className="mx-auto text-gray-600 mb-2 animate-pulse" />
                <p className="text-sm">Esperando escaneo o ingreso de código...</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Log list */}
      <div>
        <h2 className="text-lg font-bold text-gray-200 mb-3">Accesos Recientes (Hoy)</h2>
        <Card className="overflow-hidden">
          <Table headers={['Socio', 'Entrada', 'Salida', 'Método', 'Estado']}>
            {recentCheckIns.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No hay registros de asistencia el día de hoy.
                </td>
              </tr>
            ) : (
              recentCheckIns.map((row) => (
                <tr key={row.id} className="hover:bg-darkCard/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-200">
                    {row.cliente?.user?.name || 'Socio Desconocido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-accentNeon" />
                      <span>{formatTime(row.check_in)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {row.check_out ? (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-500" />
                        <span>{formatTime(row.check_out)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-400/70 italic font-medium">Activo adentro</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                    {row.metodo_acceso === 'qr' ? 'Código QR' : row.metodo_acceso === 'rfid' ? 'RFID' : 'Manual'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.check_out ? (
                      <span className="px-2 py-0.5 rounded bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs">
                        Completado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs animate-pulse">
                        En Gimnasio
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;
