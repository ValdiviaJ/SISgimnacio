import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Search } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="glass-panel border-b border-darkBorder px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-100 uppercase tracking-wider">{title || 'Dashboard'}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar mockup */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-darkCard border border-darkBorder rounded-xl pl-10 pr-4 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon focus:ring-1 focus:ring-accentNeon transition-all w-60"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-darkCard hover:bg-darkBorder text-gray-400 hover:text-accentNeon transition-colors border border-darkBorder">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accentNeon shadow-glow"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-darkBorder">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-200">{user?.name || 'Invitado'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Socio'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-darkBorder border border-darkBorder flex items-center justify-center text-accentNeon hover:border-accentNeon cursor-pointer transition-all">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
