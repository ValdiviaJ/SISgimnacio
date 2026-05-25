import React from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Download, Calendar, BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, Cell, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const ReportsOverview = () => {
  // Mock data for graphs
  const weeklyAttendance = [
    { day: 'Lun', checkins: 85 },
    { day: 'Mar', checkins: 110 },
    { day: 'Mié', checkins: 95 },
    { day: 'Jue', checkins: 120 },
    { day: 'Vie', checkins: 105 },
    { day: 'Sáb', checkins: 60 },
    { day: 'Dom', checkins: 15 },
  ];

  const membershipDistribution = [
    { name: 'Mensual', value: 450, color: '#00f0ff' },
    { name: 'Trimestral', value: 320, color: '#2563eb' },
    { name: 'Anual', value: 172, color: '#a855f7' },
  ];

  const revenueTrend = [
    { month: 'Ene', base: 3500, extra: 500 },
    { month: 'Feb', base: 4200, extra: 800 },
    { month: 'Mar', base: 4500, extra: 600 },
    { month: 'Abr', base: 4800, extra: 900 },
    { month: 'May', base: 5100, extra: 1100 },
  ];

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-200">Panel de Analíticas</h2>
        <Button variant="glow" className="flex items-center gap-2">
          <Download size={16} /> Exportar Reportes (PDF/CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance chart */}
        <Card title="Asistencias de la Semana" subtitle="Total diario de check-ins registrados">
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2533" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#11141d', borderColor: '#1f2533', borderRadius: '12px' }} />
                <Bar dataKey="checkins" fill="#00f0ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Membership distribution pie */}
        <Card title="Distribución de Planes" subtitle="Membresías activas por tipo de contrato">
          <div className="h-72 w-full mt-4 flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-full w-1/2 min-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {membershipDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#11141d', borderColor: '#1f2533', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend info */}
            <div className="space-y-3.5">
              {membershipDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.value} socios activos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Revenue Trend Area */}
        <Card className="lg:col-span-2" title="Tendencias de Facturación" subtitle="Comparativa mensual de ingresos de base vs membresías extra">
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2533" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#11141d', borderColor: '#1f2533', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="base" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="extra" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsOverview;
