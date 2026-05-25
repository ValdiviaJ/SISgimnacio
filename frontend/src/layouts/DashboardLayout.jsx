import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If loading session, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accentNeon"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Map paths to navbar titles
  const getPageTitle = (path) => {
    if (path === '/') return 'Resumen del Gimnasio';
    if (path.startsWith('/clientes')) return 'Gestión de Socios';
    if (path.startsWith('/membresias')) return 'Planes y Membresías';
    if (path.startsWith('/asistencia')) return 'Control de Asistencia';
    if (path.startsWith('/entrenadores')) return 'Staff de Entrenadores';
    if (path.startsWith('/rutinas')) return 'Rutinas y Entrenamientos';
    if (path.startsWith('/pagos')) return 'Historial de Pagos';
    if (path.startsWith('/reportes')) return 'Reportes y Analíticas';
    if (path.startsWith('/configuracion')) return 'Ajustes del Sistema';
    return 'Panel FitFlow';
  };

  return (
    <div className="min-h-screen bg-darkBg flex">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar title={getPageTitle(location.pathname)} />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
