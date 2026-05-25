import React, { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import ClienteModal from '../components/ClienteModal';
import MembresiaModal from '../../membresias/components/MembresiaModal';
import api from '../../../services/api';
import { Plus, Search, Edit2, Trash2, ShieldCheck, UserX, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isMembresiaModalOpen, setIsMembresiaModalOpen] = useState(false);
  const [membresiaClienteId, setMembresiaClienteId] = useState(null);

  // Load clients and trainers
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data.data);
      
      // Load trainers list for dropdown selection
      const trainersRes = await api.get('/entrenadores');
      setTrainers(trainersRes.data.data);
    } catch (err) {
      console.error('Error fetching clients data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleSaveCliente = async (formData, id = null) => {
    if (id) {
      // Editing (Method Spoofing handled inside FormData)
      await api.post(`/clientes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      // Creating
      await api.post('/clientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    setIsModalOpen(false);
    fetchData(); // Reload table
  };

  const handleOpenMembresiaModal = (clienteId) => {
    setMembresiaClienteId(clienteId);
    setIsMembresiaModalOpen(true);
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este socio? Se borrará también su cuenta de acceso.')) {
      try {
        await api.delete(`/clientes/${id}`);
        fetchData();
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatusMap = {
      activo: 'suspendido',
      suspendido: 'vencido',
      vencido: 'activo'
    };
    const nextStatus = nextStatusMap[currentStatus];
    
    try {
      await api.patch(`/clientes/${id}/status`, { estado: nextStatus });
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Live filter results
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch = 
      cliente.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.telefono && cliente.telefono.includes(searchTerm));

    const matchesStatus = 
      statusFilter === 'todos' || 
      cliente.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, id) => {
    const styles = {
      activo: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
      vencido: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
      suspendido: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20',
    };
    return (
      <button 
        onClick={() => handleUpdateStatus(id, status)}
        title="Haz clic para rotar el estado del socio"
        className={`px-2.5 py-1 text-xs font-semibold tracking-wider rounded-xl uppercase transition-colors flex items-center gap-1 cursor-pointer ${styles[status]}`}
      >
        <span>{status}</span>
        <RefreshCw size={10} className="opacity-60" />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar socio por nombre, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-darkCard border border-darkBorder rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentNeon text-sm"
            />
          </div>

          {/* Status selector filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-darkCard border border-darkBorder rounded-xl text-gray-300 focus:outline-none focus:border-accentNeon text-sm"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activo">Activos</option>
            <option value="suspendido">Suspendidos</option>
            <option value="vencido">Vencidos</option>
          </select>
        </div>

        {/* Create button */}
        <Button variant="glow" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Nuevo Socio
        </Button>
      </div>

      {/* Main Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accentNeon"></div>
            <p className="text-sm">Cargando registros de socios...</p>
          </div>
        ) : filteredClientes.length > 0 ? (
          <Table headers={['Socio', 'Contacto', 'Dirección', 'Entrenador', 'Estado', 'Acciones']}>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-darkCard/25 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3.5">
                    {cliente.foto_perfil ? (
                      <img 
                        src={cliente.foto_perfil} 
                        alt={cliente.user?.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-darkBorder" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-darkBorder flex items-center justify-center font-bold text-accentNeon border border-darkBorder">
                        {cliente.user?.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-200">{cliente.user?.name}</div>
                      <div className="text-xs text-gray-500">{cliente.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {cliente.telefono || 'Sin teléfono'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 truncate max-w-xs" title={cliente.direccion}>
                  {cliente.direccion || 'Sin dirección'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {cliente.entrenador?.user?.name || (
                    <span className="text-gray-600">Ninguno</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(cliente.estado, cliente.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenMembresiaModal(cliente.id)}
                      title="Asignar Membresía"
                      className="p-2 rounded-lg bg-darkCard border border-darkBorder text-gray-400 hover:text-accentNeon hover:border-accentNeon transition-all"
                    >
                      <CreditCard size={14} />
                    </button>
                    <button 
                      onClick={() => handleOpenEditModal(cliente)}
                      title="Editar Socio"
                      className="p-2 rounded-lg bg-darkCard border border-darkBorder text-gray-400 hover:text-accentNeon hover:border-accentNeon transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCliente(cliente.id)}
                      title="Eliminar Socio"
                      className="p-2 rounded-lg bg-darkCard border border-darkBorder text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <UserX size={40} className="mx-auto text-gray-600 mb-2" />
            <p className="text-sm font-semibold">No se encontraron socios</p>
            <p className="text-xs text-gray-600 mt-1">Prueba cambiando los filtros de búsqueda.</p>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      <ClienteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCliente}
        cliente={selectedCliente}
        trainers={trainers}
      />

      {/* Membresia Modal */}
      <MembresiaModal
        isOpen={isMembresiaModalOpen}
        onClose={() => setIsMembresiaModalOpen(false)}
        onSave={fetchData}
        preselectedClienteId={membresiaClienteId}
      />
    </div>
  );
};

export default ClientesList;
