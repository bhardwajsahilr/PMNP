import React, { useCallback, useMemo, useState, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  StethoscopeIcon,
  ClipboardCheckIcon,
  TruckIcon,
  FileIcon,
  UploadIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  XIcon,
  SaveIcon,
  PackageIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const ITEM_OPTIONS = [
'Cervical Inspection Set, Small',
'Cervical Inspection Set, Medium',
'Cervical Inspection Set, Large',
'Surgical Scissors, straight',
'Surgical Scissors, curved',
'Bandage Scissors',
'Suture removal, scissors',
'Pick up (ovum) forceps',
'Mosquito forceps',
'Tissue forceps with, teeth',
'Tissue forceps without teeth',
'Instrument Table',
'Foot Stool',
'Examination Table',
'Emergency Light',
'Examining Light',
'BP Apparatus',
'Nebulizer',
'Stethoscope',
'Ophthalmoscope',
'Otoscope',
'Wheelchair'];

const UNIT_OPTIONS = [
'pcs',
'packs',
'capsules',
'tablets',
'sachets',
'bottles',
'units'];

const PREVIOUS_CLOSING_BY_ITEM: Record<string, number> = {
  'Cervical Inspection Set, Small': 10,
  'Cervical Inspection Set, Medium': 8,
  'Cervical Inspection Set, Large': 6,
  'Surgical Scissors, straight': 20,
  'Surgical Scissors, curved': 15,
  'Bandage Scissors': 25,
  'Suture removal, scissors': 12,
  'Pick up (ovum) forceps': 10,
  'Mosquito forceps': 18,
  'Tissue forceps with, teeth': 14,
  'Tissue forceps without teeth': 14,
  'Instrument Table': 5,
  'Foot Stool': 8,
  'Examination Table': 4,
  'Emergency Light': 6,
  'Examining Light': 7,
  'BP Apparatus': 12,
  Nebulizer: 10,
  Stethoscope: 20,
  Ophthalmoscope: 5,
  Otoscope: 5,
  Wheelchair: 3
};
interface PhcRecord {
  id: number;
  reportDate: string;
  itemDescription: string;
  unitOfMeasure: string;
  openingBalance: number;
  qtyReceived: number;
  qtyReceivedDoc: string;
  shipmentNumber: string;
  shipmentDoc: string;
  dateReceivedEndUser: string;
  closingBalance: number;
  remarks: string;
  inventoryReportDoc: string;
  isDraft: boolean;
}
const SEED: PhcRecord[] = [
{
  id: 1,
  reportDate: '2026-04-01',
  itemDescription: 'Stethoscope',
  unitOfMeasure: 'pcs',
  openingBalance: 20,
  qtyReceived: 5,
  qtyReceivedDoc: 'Received-Stethoscope-Apr.pdf',
  shipmentNumber: '60001',
  shipmentDoc: 'PTR-Stethoscope-Apr-2026.pdf',
  dateReceivedEndUser: '2026-04-08',
  closingBalance: 25,
  remarks: 'All units in good condition.',
  inventoryReportDoc: '',
  isDraft: false
},
{
  id: 2,
  reportDate: '2026-04-01',
  itemDescription: 'BP Apparatus',
  unitOfMeasure: 'pcs',
  openingBalance: 12,
  qtyReceived: 0,
  qtyReceivedDoc: '',
  shipmentNumber: '',
  shipmentDoc: '',
  dateReceivedEndUser: '',
  closingBalance: 12,
  remarks: '2 units non-functional; awaiting replacement parts.',
  inventoryReportDoc: 'Manual-BP-Apr.pdf',
  isDraft: false
},
{
  id: 3,
  reportDate: '2026-03-01',
  itemDescription: 'Wheelchair',
  unitOfMeasure: 'pcs',
  openingBalance: 3,
  qtyReceived: 2,
  qtyReceivedDoc: '',
  shipmentNumber: '59800',
  shipmentDoc: '',
  dateReceivedEndUser: '2026-03-12',
  closingBalance: 5,
  remarks: '',
  inventoryReportDoc: '',
  isDraft: true
}];

function loadRecords(): PhcRecord[] {
  return storageGet<PhcRecord[]>(KEYS.PROC_PHC_EQUIP, SEED);
}
function saveRecords(records: PhcRecord[]) {
  storageSet(KEYS.PROC_PHC_EQUIP, records);
}
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function StatusBadge({ value }: {value: string;}) {
  const isDraft = value === 'Draft';
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${isDraft ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
      
      {value}
    </span>);

}
export function ProcPhcSmallEquipPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<PhcRecord[]>(loadRecords);
  const handleAdd = useCallback(
    (record: Omit<PhcRecord, 'id'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const updated = [
      {
        ...record,
        id: nextId
      },
      ...records];

      setRecords(updated);
      saveRecords(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveRecords(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reportDate.includes(searchQuery)
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            PHC Small Equipments
          </h1>
          <p className="text-sm text-gray-500">
            Track PHC small equipment inventory, shipments, and non-functional
            equipment
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Report',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="phc-equip-tab"
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
                  {tab.key === 'form' ? 'New' : 'Records'}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'form' ?
        <motion.div
          key="form"
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -10
          }}
          transition={{
            duration: 0.2
          }}>
          
            <PhcForm onSubmit={handleAdd} />
          </motion.div> :

        <motion.div
          key="list"
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -10
          }}
          transition={{
            duration: 0.2
          }}>
          
            <PhcList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function FileUploadField({
  label,
  fileName,
  onSelect,
  onClear,
  helperText






}: {label: string;fileName: string;onSelect: (name: string) => void;onClear: () => void;helperText?: string;}) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onSelect(file.name);
    };
    input.click();
  };
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3 flex-wrap">
        <motion.button
          whileHover={{
            scale: 1.01
          }}
          whileTap={{
            scale: 0.98
          }}
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
          
          <UploadIcon size={16} />
          Select File
        </motion.button>
        {fileName ?
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            <FileIcon size={14} />
            <span className="truncate max-w-[200px]">{fileName}</span>
            <button
            onClick={onClear}
            className="text-green-500 hover:text-green-700 transition-colors">
            
              <XIcon size={14} />
            </button>
          </div> :

        <span className="text-xs text-gray-400">No file selected</span>
        }
      </div>
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>);

}
function PhcForm({
  onSubmit


}: {onSubmit: (r: Omit<PhcRecord, 'id'>) => void;}) {
  const [form, setForm] = useState({
    reportDate: getTodayString(),
    itemDescription: '',
    unitOfMeasure: '',
    openingBalance: 0,
    qtyReceived: 0,
    qtyReceivedDoc: '',
    shipmentNumber: '',
    shipmentDoc: '',
    dateReceivedEndUser: '',
    remarks: '',
    inventoryReportDoc: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasItem = !!form.itemDescription;
  const closingBalance = useMemo(() => {
    return form.openingBalance + form.qtyReceived;
  }, [form.openingBalance, form.qtyReceived]);
  const updateField = (field: string, value: string | number) => {
    setForm((f) => {
      const next = {
        ...f,
        [field]: value
      };
      if (field === 'itemDescription') {
        next.unitOfMeasure = 'pcs';
        next.openingBalance = PREVIOUS_CLOSING_BY_ITEM[value as string] ?? 0;
      }
      return next;
    });
    setErrors((e) => ({
      ...e,
      [field]: ''
    }));
  };
  const updateNumber = (field: string, raw: string) => {
    if (raw === '') {
      updateField(field, 0);
      return;
    }
    const num = parseInt(raw, 10);
    if (isNaN(num) || num < 0) {
      setErrors((e) => ({
        ...e,
        [field]: 'Negative values are not allowed'
      }));
      return;
    }
    updateField(field, num);
  };
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.reportDate) errs.reportDate = 'Report date is required';
    if (!form.itemDescription)
    errs.itemDescription = 'Please select an item description first.';
    if (closingBalance < 0)
    errs.closingBalance = 'Closing balance cannot be negative.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const resetForm = () => {
    setForm({
      reportDate: getTodayString(),
      itemDescription: '',
      unitOfMeasure: '',
      openingBalance: 0,
      qtyReceived: 0,
      qtyReceivedDoc: '',
      shipmentNumber: '',
      shipmentDoc: '',
      dateReceivedEndUser: '',
      remarks: '',
      inventoryReportDoc: ''
    });
  };
  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validate()) return;
    if (isDraft && !form.itemDescription) {
      setErrors({
        itemDescription: 'Please select an item description first.'
      });
      return;
    }
    onSubmit({
      ...form,
      closingBalance,
      isDraft
    });
    resetForm();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };
  return (
    <div className="space-y-5">
      {success &&
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
        
          <CheckCircleIcon size={18} />
          Record saved successfully!
        </motion.div>
      }

      {/* 1. Report Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Report Information
            </h3>
            <p className="text-xs text-gray-400">
              Date when the form was accessed and filled
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="p-5 sm:p-6 pt-4">
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Report Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.reportDate}
              onChange={(e) => updateField('reportDate', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${errors.reportDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
            
            {errors.reportDate &&
            <p className="text-xs text-red-500 mt-1">{errors.reportDate}</p>
            }
          </div>
        </div>
      </div>

      {/* 2. Equipment Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <StethoscopeIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Equipment Details
            </h3>
            <p className="text-xs text-gray-400">
              Select the PHC small equipment to report on
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Item Description <span className="text-red-500">*</span>
            </label>
            <select
              value={form.itemDescription}
              onChange={(e) => updateField('itemDescription', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white ${errors.itemDescription ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}>
              
              <option value="">Select item description</option>
              {ITEM_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.itemDescription ?
            <p className="text-xs text-red-500 mt-1">
                {errors.itemDescription}
              </p> :

            <p className="text-xs text-gray-400 mt-1">
                Selecting an item will reveal the remaining inventory fields
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Unit of Measure
            </label>
            <select
              value={form.unitOfMeasure}
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 cursor-not-allowed">
              
              <option value="">Select unit</option>
              {UNIT_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Auto-selected as "pcs" for all PHC equipment
            </p>
          </div>
        </div>
      </div>

      {/* Conditional sections */}
      <AnimatePresence>
        {hasItem &&
        <motion.div
          key="conditional"
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -10
          }}
          className="space-y-5">
          
            {/* 3. Inventory Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <ClipboardCheckIcon size={18} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Inventory Details
                  </h3>
                  <p className="text-xs text-gray-400">
                    Current NPMO allocation balance
                  </p>
                </div>
              </div>
              <div className="border-t border-purple-100 mx-5 sm:mx-6" />
              <div className="p-5 sm:p-6 pt-4">
                <div className="max-w-xs">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Current Inventory from NPMO Allocation
                  </label>
                  <input
                  type="number"
                  min="0"
                  value={form.openingBalance}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 cursor-not-allowed" />
                
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-populated from previous month's closing balance
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Quantity Received Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <PackageIcon size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Quantity Received Details
                  </h3>
                  <p className="text-xs text-gray-400">
                    Equipment received from NPMO
                  </p>
                </div>
              </div>
              <div className="border-t border-teal-100 mx-5 sm:mx-6" />
              <div className="space-y-4 p-5 sm:p-6 pt-4">
                <div className="max-w-xs">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity Received
                  </label>
                  <input
                  type="number"
                  min="0"
                  value={form.qtyReceived || ''}
                  onChange={(e) =>
                  updateNumber('qtyReceived', e.target.value)
                  }
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                
                  <p className="text-xs text-gray-400 mt-1">
                    Quantity of specific item received from NPMO
                  </p>
                  {errors.qtyReceived &&
                <p className="text-xs text-red-500 mt-1">
                      {errors.qtyReceived}
                    </p>
                }
                </div>

                <AnimatePresence>
                  {form.qtyReceived > 0 &&
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0
                  }}
                  animate={{
                    opacity: 1,
                    height: 'auto'
                  }}
                  exit={{
                    opacity: 0,
                    height: 0
                  }}
                  className="space-y-4 overflow-hidden">
                  
                      <FileUploadField
                    label="Quantity Received Document"
                    fileName={form.qtyReceivedDoc}
                    onSelect={(name) => updateField('qtyReceivedDoc', name)}
                    onClear={() => updateField('qtyReceivedDoc', '')}
                    helperText="Upload a supporting document for the received quantity" />
                  
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            </div>

            {/* 5. Shipment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <TruckIcon size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Shipment Details
                  </h3>
                  <p className="text-xs text-gray-400">
                    Shipment tracking and end-user receipt
                  </p>
                </div>
              </div>
              <div className="border-t border-green-100 mx-5 sm:mx-6" />
              <div className="space-y-4 p-5 sm:p-6 pt-4">
                {form.qtyReceived > 0 ?
              <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          PTR / Shipment Number
                        </label>
                        <input
                      type="number"
                      min="0"
                      value={form.shipmentNumber}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v !== '' && parseInt(v, 10) < 0) {
                          setErrors((er) => ({
                            ...er,
                            shipmentNumber:
                            'Negative values are not allowed'
                          }));
                          return;
                        }
                        updateField('shipmentNumber', v);
                      }}
                      placeholder="Enter shipment number"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                    
                        <p className="text-xs text-gray-400 mt-1">
                          PTR / Shipment number of the delivery
                        </p>
                        {errors.shipmentNumber &&
                    <p className="text-xs text-red-500 mt-1">
                            {errors.shipmentNumber}
                          </p>
                    }
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Date Received by the End-User
                        </label>
                        <input
                      type="date"
                      value={form.dateReceivedEndUser}
                      onChange={(e) =>
                      updateField('dateReceivedEndUser', e.target.value)
                      }
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                    
                        <p className="text-xs text-gray-400 mt-1">
                          Date when equipment was received by the end user
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {form.shipmentNumber &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto'
                    }}
                    exit={{
                      opacity: 0,
                      height: 0
                    }}
                    className="overflow-hidden">
                    
                          <FileUploadField
                      label="PTR / Shipment Number Document"
                      fileName={form.shipmentDoc}
                      onSelect={(name) =>
                      updateField('shipmentDoc', name)
                      }
                      onClear={() => updateField('shipmentDoc', '')}
                      helperText="Upload a supporting shipment document" />
                    
                        </motion.div>
                  }
                    </AnimatePresence>
                  </> :

              <p className="text-xs text-gray-400 italic">
                    Enter quantity received to reveal shipment details.
                  </p>
              }
              </div>
            </div>

            {/* 6. Closing Balance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <ClipboardCheckIcon size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Closing Balance
                  </h3>
                  <p className="text-xs text-gray-400">
                    Inventory at hand at month end
                  </p>
                </div>
              </div>
              <div className="border-t border-indigo-100 mx-5 sm:mx-6" />
              <div className="p-5 sm:p-6 pt-4">
                <div className="max-w-xs">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Closing Balance
                  </label>
                  <div
                  className={`px-3 py-2.5 rounded-lg border text-sm font-semibold text-center ${closingBalance >= 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  
                    {closingBalance}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-calculated: Current Inventory + Quantity Received
                  </p>
                  {closingBalance < 0 &&
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                      <AlertTriangleIcon size={13} />
                      <span>Closing balance cannot be negative.</span>
                    </div>
                }
                </div>
              </div>
            </div>

            {/* 7. Remarks and Manual Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                  <MessageSquareIcon size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Remarks and Manual Report
                  </h3>
                  <p className="text-xs text-gray-400">
                    Non-functional equipment details and inventory report
                  </p>
                </div>
              </div>
              <div className="border-t border-amber-100 mx-5 sm:mx-6" />
              <div className="space-y-4 p-5 sm:p-6 pt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Remarks
                  </label>
                  <textarea
                  rows={4}
                  placeholder="Add details here if the equipment is non-functional or if there are any shipment/item-related comments..."
                  value={form.remarks}
                  onChange={(e) => updateField('remarks', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
                
                  <p className="text-xs text-gray-400 mt-1">
                    Add details here if the equipment is non-functional or if
                    there are any shipment/item-related comments.
                  </p>
                </div>
                <FileUploadField
                label="Manually Prepared Inventory Report"
                fileName={form.inventoryReportDoc}
                onSelect={(name) => updateField('inventoryReportDoc', name)}
                onClear={() => updateField('inventoryReportDoc', '')}
                helperText="Upload or link to a manually prepared inventory report" />
              
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <motion.button
          whileHover={{
            scale: 1.01
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={() => handleSubmit(true)}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-all hover:bg-gray-50">
          
          <SaveIcon size={16} />
          Save Draft
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.01
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={() => handleSubmit(false)}
          className="px-8 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary/20">
          
          Submit Report
        </motion.button>
      </div>
    </div>);

}
function PhcList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: PhcRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<PhcRecord | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: PhcRecord): SectionDef[] {
    return [
    {
      title: 'Report Information',
      fields: [
      {
        label: 'Report Date',
        value: r.reportDate
      },
      {
        label: 'Status',
        value: r.isDraft ? 'Draft' : 'Submitted',
        type: 'badge' as const,
        badgeColor: r.isDraft ?
        'bg-amber-50 text-amber-700' :
        'bg-green-50 text-green-700'
      }]

    },
    {
      title: 'Equipment Details',
      fields: [
      {
        label: 'Item Description',
        value: r.itemDescription
      },
      {
        label: 'Unit of Measure',
        value: r.unitOfMeasure
      }]

    },
    {
      title: 'Inventory & Closing',
      fields: [
      {
        label: 'Current Inventory (NPMO Allocation)',
        value: String(r.openingBalance)
      },
      {
        label: 'Quantity Received',
        value: String(r.qtyReceived)
      },
      {
        label: 'Quantity Received Document',
        value: r.qtyReceivedDoc
      },
      {
        label: 'Closing Balance',
        value: String(r.closingBalance),
        type: 'badge' as const,
        badgeColor:
        r.closingBalance >= 0 ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-700'
      }]

    },
    {
      title: 'Shipment Details',
      fields: [
      {
        label: 'PTR / Shipment Number',
        value: r.shipmentNumber
      },
      {
        label: 'Shipment Document',
        value: r.shipmentDoc
      },
      {
        label: 'Date Received by End-User',
        value: r.dateReceivedEndUser
      }]

    },
    {
      title: 'Remarks & Manual Report',
      fields: [
      {
        label: 'Remarks',
        value: r.remarks
      },
      {
        label: 'Manual Inventory Report',
        value: r.inventoryReportDoc
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title={viewRecord?.itemDescription || 'Record Details'}
        subtitle={viewRecord ? `Report Date: ${viewRecord.reportDate}` : ''}
        sections={viewRecord ? getViewSections(viewRecord) : []} />
      

      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search records..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Report Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Item Description
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Opening
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Closing
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) =>
            <tr
              key={r.id}
              className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent hover:shadow-sm transition-all duration-200 cursor-pointer group">
              
                <td className="px-4 py-3.5 text-gray-700 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-primary rounded-r-full transition-all duration-200" />
                  {r.reportDate}
                </td>
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors max-w-[220px] truncate">
                  {r.itemDescription}
                </td>
                <td className="px-4 py-3.5 text-center text-gray-600">
                  {r.openingBalance}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${r.closingBalance >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  
                    {r.closingBalance}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.isDraft ? 'Draft' : 'Submitted'} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                    onClick={() => setViewRecord(r)}
                    className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary transition-all hover:scale-110"
                    title="View">
                    
                      <EyeIcon size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paginated.length === 0 &&
            <tr>
                <td
                colSpan={6}
                className="text-center py-8 text-gray-400 text-sm">
                
                  No records found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-3 space-y-3">
        {paginated.map((r) =>
        <div
          key={r.id}
          className="border border-gray-100 rounded-xl p-4 space-y-2 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors truncate max-w-[200px]">
                {r.itemDescription}
              </span>
              <span className="text-xs text-gray-400">{r.reportDate}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">
                Open: {r.openingBalance}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span
              className={`text-xs font-medium ${r.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              
                Close: {r.closingBalance}
              </span>
              <StatusBadge value={r.isDraft ? 'Draft' : 'Submitted'} />
            </div>
            <div className="flex items-center justify-end pt-1">
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                onClick={() => setViewRecord(r)}
                className="p-1.5 rounded-lg hover:bg-secondary-50 text-secondary transition-colors">
                
                  <EyeIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {paginated.length === 0 &&
        <div className="text-center py-8 text-gray-400 text-sm">
            No records found
          </div>
        }
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing {paginated.length} of {records.length} records
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40">
            
            <ChevronLeftIcon size={16} />
          </button>
          {Array.from(
            {
              length: totalPages
            },
            (_, i) => i + 1
          ).map((p) =>
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            
              {p}
            </button>
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40">
            
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>);

}