import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, SearchIcon, ConstructionIcon } from 'lucide-react';
type Tab = 'form' | 'list';
interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  formLabel?: string;
  listLabel?: string;
}
export function PlaceholderPage({
  title,
  subtitle,
  formLabel = 'New Entry',
  listLabel = 'Records'
}: PlaceholderPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: formLabel,
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: listLabel,
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId={`placeholder-tab-${title}`}
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />

            }
              <span className="relative flex items-center gap-1.5">
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.key === 'form' ? 'Form' : 'Records'}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.2
        }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ConstructionIcon size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Under Development
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            This module is currently being developed. Check back soon for
            updates.
          </p>
          <div className="mt-4 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
            Coming Soon
          </div>
        </div>
      </motion.div>
    </div>);

}