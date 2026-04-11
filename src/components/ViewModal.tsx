import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, LinkIcon } from 'lucide-react';
interface FieldDef {
  label: string;
  value: string | number | undefined;
  type?: 'text' | 'badge' | 'link';
  badgeColor?: string;
}
interface SectionDef {
  title: string;
  icon?: React.ReactNode;
  fields: FieldDef[];
}
interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  sections: SectionDef[];
}
function renderValue(field: FieldDef) {
  const val = field.value;
  if (val === undefined || val === null || val === '') {
    return <span className="text-gray-400 text-sm">—</span>;
  }
  if (
  field.type === 'link' &&
  typeof val === 'string' &&
  val.startsWith('http'))
  {
    return (
      <a
        href={val}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors flex items-center gap-1 break-all">
        
        <LinkIcon size={12} className="shrink-0" />
        {val.length > 50 ? val.slice(0, 50) + '...' : val}
      </a>);

  }
  if (field.type === 'badge' && field.badgeColor) {
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${field.badgeColor}`}>
        
        {String(val)}
      </span>);

  }
  return <span className="text-sm text-gray-900">{String(val)}</span>;
}
export function ViewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  sections
}: ViewModalProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.15
        }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-10 sm:pt-20 px-4"
        onClick={onClose}>
        
          <div className="fixed inset-0 bg-black/40" />
          <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.97
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.97
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30
          }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}>
          
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {subtitle &&
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
              }
              </div>
              <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
              
                <XIcon size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {sections.map((section, si) => {
              const visibleFields = section.fields.filter(
                (f) =>
                f.value !== undefined && f.value !== null && f.value !== ''
              );
              const allFields = section.fields;
              if (allFields.length === 0) return null;
              return (
                <div key={si}>
                    <div className="flex items-center gap-2 mb-3">
                      {section.icon}
                      <h3 className="text-sm font-semibold text-gray-700">
                        {section.title}
                      </h3>
                    </div>
                    <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {allFields.map((field, fi) =>
                      <div
                        key={fi}
                        className={
                        field.type === 'link' ? 'sm:col-span-2' : ''
                        }>
                        
                            <p className="text-xs font-medium text-gray-500 mb-0.5">
                              {field.label}
                            </p>
                            {renderValue(field)}
                          </div>
                      )}
                      </div>
                    </div>
                  </div>);

            })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 flex justify-end shrink-0">
              <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-all">
              
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}
export type { FieldDef, SectionDef };