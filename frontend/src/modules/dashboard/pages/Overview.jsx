import React from 'react';
import Card from '../../../components/Card';
import { Users, CreditCard, DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  // Skeleton charts payload
  const salesData = [
    { name: 'Ene', ingresos: 4000 },
    { name: 'Feb', ingresos: 3000 },
    { name: 'Mar', ingresos: 5000 },
    { name: 'Abr', ingresos: 4500 },
    { name: 'May', ingresos: 6000 },
    { name: 'Jun', ingresos: 5500 },
  ];

  const stats = [
    { title: 'Clientes Totales', value: '1,284', icon: Users, change: '+12% este mes', trend: true },
    { title: 'Membresías Activas', value: '942', icon: CreditCard, change: '+4% este mes', trend: true },
    { title: 'Ingresos Mensuales', value: '$8,450.00', icon: DollarSign, change: '+8.2% vs mes anterior', trend: true },
    { title: 'Asistencias Hoy', value: '142', icon: Calendar, change: 'Promedio diario: 120', trend: false },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hoverGlow">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-400">{stat.title}</span>
                <div className="p-3 bg-darkBorder rounded-2xl text-accentNeon shadow-glow">
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  {stat.trend ? (
                    <span className="text-accentNeon font-bold flex items-center gap-0.5">
                      <TrendingUp size={12} /> {stat.change}
                    </span>
                  ) : (
                    <span className="text-gray-500">{stat.change}</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Chart */}
        <Card className="lg:col-span-2" title="Métricas de Ingresos" subtitle="Historial de facturación de los últimos 6 meses">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2533" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11141d', borderColor: '#1f2533', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Warning Widget */}
        <Card title="Alertas de Control" subtitle="Acciones requeridas inmediatas">
          <div className="space-y-4 mt-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <AlertTriangle className="shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-sm font-bold">12 Membresías por Vencer</p>
                <p className="text-xs text-gray-400 mt-1">Socios con vencimiento en los próximos 3 días.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-sm font-bold">5 Pagos Pendientes</p>
                <p className="text-xs text-gray-400 mt-1">Transacciones iniciadas sin confirmación de depósito.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-darkCard/50 border border-darkBorder flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-200">Capacidad del Local</p>
                <p className="text-xs text-gray-500 mt-0.5">Aforo actual en tiempo real</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-accentNeon">62%</span>
                <div className="w-24 bg-darkBorder h-2 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-accentNeon h-full w-[62%]"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
