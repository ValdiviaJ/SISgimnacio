import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, CreditCard, CalendarCheck, 
  Dumbbell, ClipboardList, DollarSign, BarChart3, 
  Settings, LogOut, ChevronLeft, ChevronRight, Activity 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'recepcionista', 'entrenador'] },
    { name: 'Clientes', path: '/clientes', icon: Users, roles: ['admin', 'recepcionista', 'entrenador'] },
    { name: 'Membresías', path: '/membresias', icon: CreditCard, roles: ['admin', 'recepcionista'] },
    { name: 'Asistencia', path: '/asistencia', icon: CalendarCheck, roles: ['admin', 'recepcionista', 'cliente'] },
    { name: 'Entrenadores', path: '/entrenadores', icon: Dumbbell, roles: ['admin', 'recepcionista', 'entrenador'] },
    { name: 'Rutinas', path: '/rutinas', icon: ClipboardList, roles: ['admin', 'entrenador', 'cliente'] },
    { name: 'Pagos', path: '/pagos', icon: DollarSign, roles: ['admin', 'recepcionista', 'cliente'] },
    { name: 'Reportes', path: '/reportes', icon: BarChart3, roles: ['admin', 'recepcionista'] },
    { name: 'Configuración', path: '/configuracion', icon: Settings, roles: ['admin'] },
  ];

  // Filter items by user role
  const filteredItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  return (
    <aside 
      className={`glass-panel border-r border-darkBorder flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-darkBorder">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-gradient-to-tr from-accentNeon to-accentBlue rounded-xl text-darkBg shadow-glow">
              <Activity className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-xl tracking-wider text-gradient-neon">
                FitFlow
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Info minimal */}
        {!isCollapsed && user && (
          <div className="p-4 mx-3 my-4 bg-darkCard/50 border border-darkBorder rounded-xl">
            <p className="text-xs text-gray-500 font-medium">Conectado como</p>
            <p className="font-semibold text-sm text-gray-200 truncate">{user.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-accentNeon/10 text-accentNeon">
              {user.role}
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="mt-4 px-3 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-accentNeon/10 to-accentBlue/10 border border-accentNeon/20 text-accentNeon shadow-glow' 
                    : 'text-gray-400 hover:bg-darkCard hover:text-gray-100 border border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-accentNeon' : 'text-gray-400'} />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-darkBorder">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
