import React, {
  useCallback,
  useMemo,
  useState,
  Children,
  createElement } from
'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PackageIcon,
  ClipboardCheckIcon,
  TruckIcon,
  FileIcon,
  UploadIcon,
  CheckCircleIcon,
  CalculatorIcon,
  MessageSquareIcon,
  XIcon,
  SaveIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const ITEM_OPTIONS = [
'MUAC Tapes for Children',
'MUAC Tapes for Adults',
'Spring-type mechanical scale up to 25kg',
'Weighing trousers up to 25kg',
'Portable baby/child length-height measuring board',
'Weighing Scale for Mothers and Children, 250kg'];

const UNIT_OPTIONS = [
'pcs',
'packs',
'capsules',
'tablets',
'sachets',
'bottles',
'units'];

function getAutoUnit(item: string): string {
  if (item === 'MUAC Tapes for Children' || item === 'MUAC Tapes for Adults')
  return 'packs';
  if (
  item === 'Spring-type mechanical scale up to 25kg' ||
  item === 'Portable baby/child length-height measuring board' ||
  item === 'Weighing Scale for Mothers and Children, 250kg')

  return 'units';
  if (item === 'Weighing trousers up to 25kg') return 'pcs';
  return '';
}
interface AnthroRecord {
  id: number;
  reportDate: string;
  itemDescription: string;
  unitOfMeasure: string;
  openingBalance: number;
  qtyCalibrated: number;
  qtyCalibratedDoc: string;
  qtyDefects: number;
  qtyDefectsDoc: string;
  qtyReceived: number;
  shipmentNumber: string;
  shipmentDoc: string;
  dateReceivedEndUser: string;
  closingBalance: number;
  inventoryReportDoc: string;
  remarks: string;
  isDraft: boolean;
}
const SEED: AnthroRecord[] = [
{
  id: 1,
  reportDate: '2026-03-01',
  itemDescription: 'MUAC Tapes for Children',
  unitOfMeasure: 'packs',
  openingBalance: 50,
  qtyCalibrated: 0,
  qtyCalibratedDoc: '',
  qtyDefects: 2,
  qtyDefectsDoc: '',
  qtyReceived: 20,
  shipmentNumber: '12345',
  shipmentDoc: '',
  dateReceivedEndUser: '2026-03-05',
  closingBalance: 68,
  inventoryReportDoc: '',
  remarks: 'Regular monthly replenishment',
  isDraft: false
},
{
  id: 2,
  reportDate: '2026-03-01',
  itemDescription: 'Spring-type mechanical scale up to 25kg',
  unitOfMeasure: 'units',
  openingBalance: 10,
  qtyCalibrated: 3,
  qtyCalibratedDoc: '',
  qtyDefects: 1,
  qtyDefectsDoc: '',
  qtyReceived: 5,
  shipmentNumber: '12346',
  shipmentDoc: '',
  dateReceivedEndUser: '2026-03-08',
  closingBalance: 11,
  inventoryReportDoc: '',
  remarks: '',
  isDraft: false
},
{
  id: 3,
  reportDate: '2026-02-01',
  itemDescription: 'Weighing trousers up to 25kg',
  unitOfMeasure: 'pcs',
  openingBalance: 30,
  qtyCalibrated: 0,
  qtyCalibratedDoc: '',
  qtyDefects: 0,
  qtyDefectsDoc: '',
  qtyReceived: 0,
  shipmentNumber: '',
  shipmentDoc: '',
  dateReceivedEndUser: '',
  closingBalance: 30,
  inventoryReportDoc: '',
  remarks: 'No movement this month',
  isDraft: false
}];

function loadRecords(): AnthroRecord[] {
  return storageGet<AnthroRecord[]>(KEYS.PROC_ANTHRO, SEED);
}
function saveRecords(records: AnthroRecord[]) {
  storageSet(KEYS.PROC_ANTHRO, records);
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
export function ProcAnthropometryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<AnthroRecord[]>(loadRecords);
  const handleAdd = useCallback(
    (record: Omit<AnthroRecord, 'id'>) => {
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
    r.reportDate.includes(searchQuery) ||
    r.unitOfMeasure.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Anthropometry Supplies & Equipment
          </h1>
          <p className="text-sm text-gray-500">
            Procurement inventory and reporting for anthropometry items
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
              layoutId="anthro-tab"
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
          
            <AnthroForm onSubmit={handleAdd} />
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
          
            <AnthroList
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
      <div className="flex items-center gap-3">
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
function AnthroForm({
  onSubmit


}: {onSubmit: (r: Omit<AnthroRecord, 'id'>) => void;}) {
  const [form, setForm] = useState({
    reportDate: getTodayString(),
    itemDescription: '',
    unitOfMeasure: '',
    openingBalance: 0,
    qtyCalibrated: 0,
    qtyCalibratedDoc: '',
    qtyDefects: 0,
    qtyDefectsDoc: '',
    qtyReceived: 0,
    shipmentNumber: '',
    shipmentDoc: '',
    dateReceivedEndUser: '',
    inventoryReportDoc: '',
    remarks: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasItem = !!form.itemDescription;
  const closingBalance = useMemo(() => {
    return (
      form.openingBalance -
      form.qtyCalibrated -
      form.qtyDefects +
      form.qtyReceived);

  }, [
  form.openingBalance,
  form.qtyCalibrated,
  form.qtyDefects,
  form.qtyReceived]
  );
  const updateField = (field: string, value: string | number) => {
    setForm((f) => {
      const next = {
        ...f,
        [field]: value
      };
      if (field === 'itemDescription') {
        next.unitOfMeasure = getAutoUnit(value as string);
      }
      return next;
    });
    setErrors((e) => ({
      ...e,
      [field]: ''
    }));
  };
  const updateNumber = (field: string, raw: string) => {
    const num = parseInt(raw, 10);
    if (raw === '') {
      updateField(field, 0);
      return;
    }
    if (isNaN(num) || num < 0) {
      setErrors((e) => ({
        ...e,
        [field]: 'Must be a non-negative number'
      }));
      return;
    }
    updateField(field, num);
  };
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.reportDate) errs.reportDate = 'Report date is required';
    if (!form.itemDescription)
    errs.itemDescription = 'Item description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validate()) return;
    if (isDraft && !form.itemDescription) {
      setErrors({
        itemDescription: 'Item description is required even for drafts'
      });
      return;
    }
    onSubmit({
      ...form,
      closingBalance,
      isDraft
    });
    setForm({
      reportDate: getTodayString(),
      itemDescription: '',
      unitOfMeasure: '',
      openingBalance: 0,
      qtyCalibrated: 0,
      qtyCalibratedDoc: '',
      qtyDefects: 0,
      qtyDefectsDoc: '',
      qtyReceived: 0,
      shipmentNumber: '',
      shipmentDoc: '',
      dateReceivedEndUser: '',
      inventoryReportDoc: '',
      remarks: ''
    });
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
              Date of the inventory report
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

      {/* 2. Item Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <PackageIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Item Details
            </h3>
            <p className="text-xs text-gray-400">
              Select the item and unit of measure
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
            {errors.itemDescription &&
            <p className="text-xs text-red-500 mt-1">
                {errors.itemDescription}
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Unit of Measure
            </label>
            <select
              value={form.unitOfMeasure}
              onChange={(e) => updateField('unitOfMeasure', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select unit</option>
              {UNIT_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Auto-selected based on item description
            </p>
          </div>
        </div>
      </div>

      {/* Conditional sections */}
      {hasItem &&
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
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
                  Opening and closing balance
                </p>
              </div>
            </div>
            <div className="border-t border-purple-100 mx-5 sm:mx-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Current Inventory at Beginning of Month
                </label>
                <input
                type="number"
                min="0"
                value={form.openingBalance || ''}
                onChange={(e) =>
                updateNumber('openingBalance', e.target.value)
                }
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-gray-50" />
              
                <p className="text-xs text-gray-400 mt-1">
                  Auto-populated from previous month's closing balance
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Inventory at Hand at Month End
                </label>
                <div
                className={`px-3 py-2.5 rounded-lg border text-sm font-semibold text-center ${closingBalance >= 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                
                  {closingBalance}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Auto-calculated: Opening − Calibrated − Defects + Received
                </p>
              </div>
            </div>
          </div>

          {/* 4. Quantity and Calibration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                <CalculatorIcon size={18} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Quantity and Calibration
                </h3>
                <p className="text-xs text-gray-400">
                  Equipment calibration and defect tracking
                </p>
              </div>
            </div>
            <div className="border-t border-teal-100 mx-5 sm:mx-6" />
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity Calibrated
                  </label>
                  <input
                  type="number"
                  min="0"
                  value={form.qtyCalibrated || ''}
                  onChange={(e) =>
                  updateNumber('qtyCalibrated', e.target.value)
                  }
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                
                  <p className="text-xs text-gray-400 mt-1">
                    Number of equipment calibrated
                  </p>
                  {errors.qtyCalibrated &&
                <p className="text-xs text-red-500 mt-1">
                      {errors.qtyCalibrated}
                    </p>
                }
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity with Defects
                  </label>
                  <input
                  type="number"
                  min="0"
                  value={form.qtyDefects || ''}
                  onChange={(e) => updateNumber('qtyDefects', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                
                  <p className="text-xs text-gray-400 mt-1">
                    Number of equipment with defects
                  </p>
                  {errors.qtyDefects &&
                <p className="text-xs text-red-500 mt-1">
                      {errors.qtyDefects}
                    </p>
                }
                </div>
              </div>
              {form.qtyCalibrated > 0 &&
            <motion.div
              initial={{
                opacity: 0,
                height: 0
              }}
              animate={{
                opacity: 1,
                height: 'auto'
              }}>
              
                  <FileUploadField
                label="Quantity Calibrated Document"
                fileName={form.qtyCalibratedDoc}
                onSelect={(name) => updateField('qtyCalibratedDoc', name)}
                onClear={() => updateField('qtyCalibratedDoc', '')}
                helperText="Upload reference document for calibration" />
              
                </motion.div>
            }
              {form.qtyDefects > 0 &&
            <motion.div
              initial={{
                opacity: 0,
                height: 0
              }}
              animate={{
                opacity: 1,
                height: 'auto'
              }}>
              
                  <FileUploadField
                label="Quantity with Defects Document"
                fileName={form.qtyDefectsDoc}
                onSelect={(name) => updateField('qtyDefectsDoc', name)}
                onClear={() => updateField('qtyDefectsDoc', '')}
                helperText="Upload reference document for defects" />
              
                </motion.div>
            }
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
                  Quantity received and shipment information
                </p>
              </div>
            </div>
            <div className="border-t border-green-100 mx-5 sm:mx-6" />
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div className="max-w-xs">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Quantity Received During the Month
                </label>
                <input
                type="number"
                min="0"
                value={form.qtyReceived || ''}
                onChange={(e) => updateNumber('qtyReceived', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
                <p className="text-xs text-gray-400 mt-1">
                  Number of equipment received
                </p>
              </div>
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
              className="space-y-4">
              
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        PTR / Shipment Number
                      </label>
                      <input
                    type="number"
                    min="0"
                    value={form.shipmentNumber}
                    onChange={(e) =>
                    updateField('shipmentNumber', e.target.value)
                    }
                    placeholder="Enter shipment number"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                  
                      <p className="text-xs text-gray-400 mt-1">
                        PTR / Shipment number of the delivery
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Date Received by End-User
                      </label>
                      <input
                    type="date"
                    value={form.dateReceivedEndUser}
                    onChange={(e) =>
                    updateField('dateReceivedEndUser', e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
                  
                      <p className="text-xs text-gray-400 mt-1">
                        Date when equipment was received by end user
                      </p>
                    </div>
                  </div>
                  {form.shipmentNumber &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}>
                
                      <FileUploadField
                  label="PTR / Shipment Number Document"
                  fileName={form.shipmentDoc}
                  onSelect={(name) => updateField('shipmentDoc', name)}
                  onClear={() => updateField('shipmentDoc', '')}
                  helperText="Upload reference document for the shipment" />
                
                    </motion.div>
              }
                </motion.div>
            }
            </div>
          </div>

          {/* 6. Supporting Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileIcon size={18} className="text-gray-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Supporting Documents
                </h3>
                <p className="text-xs text-gray-400">
                  Manually prepared inventory reports
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 mx-5 sm:mx-6" />
            <div className="p-5 sm:p-6 pt-4">
              <FileUploadField
              label="Manually Prepared Inventory Report"
              fileName={form.inventoryReportDoc}
              onSelect={(name) => updateField('inventoryReportDoc', name)}
              onClear={() => updateField('inventoryReportDoc', '')}
              helperText="Upload or link to manually prepared inventory report" />
            
            </div>
          </div>

          {/* 7. Remarks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <MessageSquareIcon size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Remarks</h3>
                <p className="text-xs text-gray-400">
                  Additional comments or notes
                </p>
              </div>
            </div>
            <div className="border-t border-amber-100 mx-5 sm:mx-6" />
            <div className="p-5 sm:p-6 pt-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Remarks
              </label>
              <textarea
              rows={4}
              placeholder="Enter any remarks or comments regarding the item or shipment..."
              value={form.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
            </div>
          </div>
        </motion.div>
      }

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
function AnthroList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: AnthroRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<AnthroRecord | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: AnthroRecord): SectionDef[] {
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
      title: 'Item Details',
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
      title: 'Inventory',
      fields: [
      {
        label: 'Opening Balance',
        value: String(r.openingBalance)
      },
      {
        label: 'Quantity Calibrated',
        value: String(r.qtyCalibrated)
      },
      {
        label: 'Calibration Document',
        value: r.qtyCalibratedDoc
      },
      {
        label: 'Quantity with Defects',
        value: String(r.qtyDefects)
      },
      {
        label: 'Defects Document',
        value: r.qtyDefectsDoc
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
        label: 'Quantity Received',
        value: String(r.qtyReceived)
      },
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
      title: 'Supporting Documents & Remarks',
      fields: [
      {
        label: 'Inventory Report',
        value: r.inventoryReportDoc
      },
      {
        label: 'Remarks',
        value: r.remarks
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Unit
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
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors max-w-[200px] truncate">
                  {r.itemDescription}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{r.unitOfMeasure}</td>
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
                colSpan={7}
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
              <span className="text-xs text-gray-500">{r.unitOfMeasure}</span>
              <span className="text-xs text-gray-400">•</span>
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