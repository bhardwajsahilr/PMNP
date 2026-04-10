import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LocationTree } from '../components/LocationTree';
import { SearchIcon, MapPinIcon, ChevronRightIcon, SunIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface SelectedLocation {
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}
export function BarangaySelectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<SelectedLocation | null>(null);
  const navigate = useNavigate();
  const { setSelectedBarangay } = useAppContext();
  const handleContinue = () => {
    if (selected) {
      setSelectedBarangay(selected);
      navigate('/dashboard');
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <SunIcon size={18} className="text-primary" />
            </div>
            <span className="text-lg font-bold text-gray-800">PMNP Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Select Your Location
          </h1>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1.5 flex-wrap">
            <span>Region</span>
            <ChevronRightIcon size={12} className="text-gray-400" />
            <span>Province</span>
            <ChevronRightIcon size={12} className="text-gray-400" />
            <span>Municipality</span>
            <ChevronRightIcon size={12} className="text-gray-400" />
            <span>Barangay</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <SearchIcon
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search barangay or municipality..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
          </div>

          {/* Tree */}
          <div className="max-h-[400px] overflow-y-auto p-3">
            <LocationTree
              searchQuery={searchQuery}
              selected={selected}
              onSelect={setSelected} />
            
          </div>

          {/* Selected Path + Continue */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            {selected ?
            <motion.div
              initial={{
                opacity: 0,
                y: 5
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-primary-50 rounded-lg">
              
                <MapPinIcon size={16} className="text-primary shrink-0" />
                <div className="flex items-center gap-1 text-xs text-gray-600 flex-wrap">
                  <span className="font-medium text-gray-800">
                    {selected.region}
                  </span>
                  <ChevronRightIcon size={10} className="text-gray-400" />
                  <span>{selected.province}</span>
                  <ChevronRightIcon size={10} className="text-gray-400" />
                  <span>{selected.municipality}</span>
                  <ChevronRightIcon size={10} className="text-gray-400" />
                  <span className="font-semibold text-primary">
                    {selected.barangay}
                  </span>
                </div>
              </motion.div> :

            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 text-gray-400 text-xs">
                <MapPinIcon size={16} />
                <span>No location selected yet</span>
              </div>
            }

            <motion.button
              whileHover={
              selected ?
              {
                scale: 1.01
              } :
              {}
              }
              whileTap={
              selected ?
              {
                scale: 0.98
              } :
              {}
              }
              onClick={handleContinue}
              disabled={!selected}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${selected ? 'bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/25' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              
              Continue to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>);

}