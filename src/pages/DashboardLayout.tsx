import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import { MenuIcon, BellIcon, MapPinIcon, ChevronRightIcon } from 'lucide-react';
export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedBarangay, user } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!selectedBarangay) {
      navigate('/select-barangay');
    }
  }, [selectedBarangay, navigate]);
  if (!selectedBarangay) return null;
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors">
            
            <MenuIcon size={22} />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0 flex-1">
            <MapPinIcon size={14} className="text-primary shrink-0" />
            <span className="hidden sm:inline truncate">
              {selectedBarangay.region}
            </span>
            <ChevronRightIcon
              size={10}
              className="text-gray-300 hidden sm:block shrink-0" />
            
            <span className="hidden md:inline truncate">
              {selectedBarangay.province}
            </span>
            <ChevronRightIcon
              size={10}
              className="text-gray-300 hidden md:block shrink-0" />
            
            <span className="hidden md:inline truncate">
              {selectedBarangay.municipality}
            </span>
            <ChevronRightIcon
              size={10}
              className="text-gray-300 hidden md:block shrink-0" />
            
            <span className="font-semibold text-primary truncate">
              {selectedBarangay.barangay}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-alert rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>);

}