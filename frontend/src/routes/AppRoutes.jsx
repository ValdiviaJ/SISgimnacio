import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Module Pages
import Login from '../modules/auth/pages/Login';
import Overview from '../modules/dashboard/pages/Overview';
import ClientesList from '../modules/clientes/pages/ClientesList';
import MembresiasList from '../modules/membresias/pages/MembresiasList';
import CheckIn from '../modules/asistencia/pages/CheckIn';
import EntrenadoresList from '../modules/entrenadores/pages/EntrenadoresList';
import RutinasList from '../modules/rutinas/pages/RutinasList';
import PagosList from '../modules/pagos/pages/PagosList';
import ReportsOverview from '../modules/reportes/pages/ReportsOverview';
import Settings from '../modules/configuracion/pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<div className="text-center text-sm">Recuperar contraseña (Mock)</div>} />
      </Route>

      {/* Private Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/membresias" element={<MembresiasList />} />
        <Route path="/asistencia" element={<CheckIn />} />
        <Route path="/entrenadores" element={<EntrenadoresList />} />
        <Route path="/rutinas" element={<RutinasList />} />
        <Route path="/pagos" element={<PagosList />} />
        <Route path="/reportes" element={<ReportsOverview />} />
        <Route path="/configuracion" element={<Settings />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
