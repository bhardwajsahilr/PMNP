import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  FileTextIcon,
  CheckSquareIcon,
  StampIcon,
  BuildingIcon,
  UsersIcon,
  CalculatorIcon,
  CheckCircleIcon,
  XIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
interface LnapRecord {
  id: number;
  reportDate: string;
  bnapStatus: string;
  bnapDocuments: string;
  bnapLink: string;
  sixPoint: string;
  sixPointLink: string;
  sbResolution: string;
  resolutionLink: string;
  aipInclusion: string;
  aipLink: string;
  bncResolution: string;
  bncLink: string;
  sixThreeScore: string;
  sixThreeLink: string;
}
const STATUS_OPTIONS = ['No BNAP', 'Under Development', 'Approved BNAP'];
const SIX_POINT_OPTIONS = ['Yes', 'No', 'For Checking'];
const YES_NO_CHECK = ['Yes', 'No', 'For Checking'];
const BINARY_OPTIONS = ['0', '1'];
const SEED_LNAP: LnapRecord[] = [
{
  id: 1,
  reportDate: '2026-03-15',
  bnapStatus: 'Approved BNAP',
  bnapDocuments: 'DOC-001',
  bnapLink: '',
  sixPoint: 'Yes',
  sixPointLink: '',
  sbResolution: 'Yes',
  resolutionLink: '',
  aipInclusion: 'Yes',
  aipLink: '',
  bncResolution: 'Yes',
  bncLink: '',
  sixThreeScore: '1',
  sixThreeLink: ''
},
{
  id: 2,
  reportDate: '2026-03-01',
  bnapStatus: 'Under Development',
  bnapDocuments: '',
  bnapLink: '',
  sixPoint: 'No',
  sixPointLink: '',
  sbResolution: 'No',
  resolutionLink: '',
  aipInclusion: 'No',
  aipLink: '',
  bncResolution: 'For Checking',
  bncLink: '',
  sixThreeScore: '0',
  sixThreeLink: ''
},
{
  id: 3,
  reportDate: '2026-02-20',
  bnapStatus: 'Approved BNAP',
  bnapDocuments: '',
  bnapLink: '',
  sixPoint: 'Yes',
  sixPointLink: '',
  sbResolution: 'Yes',
  resolutionLink: '',
  aipInclusion: 'Yes',
  aipLink: '',
  bncResolution: 'Yes',
  bncLink: '',
  sixThreeScore: '1',
  sixThreeLink: ''
},
{
  id: 4,
  reportDate: '2026-02-10',
  bnapStatus: 'No BNAP',
  bnapDocuments: '',
  bnapLink: '',
  sixPoint: 'No',
  sixPointLink: '',
  sbResolution: 'No',
  resolutionLink: '',
  aipInclusion: 'No',
  aipLink: '',
  bncResolution: 'No',
  bncLink: '',
  sixThreeScore: '0',
  sixThreeLink: ''
},
{
  id: 5,
  reportDate: '2026-01-25',
  bnapStatus: 'Approved BNAP',
  bnapDocuments: '',
  bnapLink: '',
  sixPoint: 'Yes',
  sixPointLink: '',
  sbResolution: 'Yes',
  resolutionLink: '',
  aipInclusion: 'Yes',
  aipLink: '',
  bncResolution: 'Yes',
  bncLink: '',
  sixThreeScore: '1',
  sixThreeLink: ''
},
{
  id: 6,
  reportDate: '2026-01-15',
  bnapStatus: 'Under Development',
  bnapDocuments: '',
  bnapLink: '',
  sixPoint: 'For Checking',
  sixPointLink: '',
  sbResolution: 'For Checking',
  resolutionLink: '',
  aipInclusion: 'For Checking',
  aipLink: '',
  bncResolution: 'For Checking',
  bncLink: '',
  sixThreeScore: '0',
  sixThreeLink: ''
}];

function loadLnap(): LnapRecord[] {
  return storageGet<LnapRecord[]>(KEYS.LNAP, SEED_LNAP);
}
function saveLnap(records: LnapRecord[]) {
  storageSet(KEYS.LNAP, records);
}
function StatusBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    'Approved BNAP': 'bg-green-50 text-green-700',
    Yes: 'bg-green-50 text-green-700',
    '1': 'bg-green-50 text-green-700',
    'Under Development': 'bg-amber-50 text-amber-700',
    'For Checking': 'bg-blue-50 text-blue-600',
    'No BNAP': 'bg-red-50 text-red-600',
    No: 'bg-red-50 text-red-600',
    '0': 'bg-red-50 text-red-600'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
export function LnapPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<LnapRecord[]>(loadLnap);
  const [viewRecord, setViewRecord] = useState<LnapRecord | null>(null);
  const handleAdd = useCallback(
    (record: Omit<LnapRecord, 'id'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const newRecord: LnapRecord = {
        ...record,
        id: nextId
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      saveLnap(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveLnap(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.bnapStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reportDate.includes(searchQuery)
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">LNAP Status</h1>
          <p className="text-sm text-gray-500">
            Local Nutrition Action Plan status and records
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'LNAP Status Form',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'LNAP Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="lnap-tab"
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
          
            <LnapForm onSubmit={handleAdd} />
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
          
            <LnapList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function SelectField({
  label,
  options,
  placeholder,
  value,
  onChange






}: {label: string;options: string[];placeholder?: string;value?: string;onChange?: (v: string) => void;}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
        
        <option value="">
          {placeholder || `Select ${label.toLowerCase()}`}
        </option>
        {options.map((o) =>
        <option key={o} value={o}>
            {o}
          </option>
        )}
      </select>
    </div>);

}
function UrlField({
  label,
  value,
  onChange




}: {label: string;value?: string;onChange?: (v: string) => void;}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <LinkIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        
        <input
          type="url"
          placeholder="https://..."
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
        
      </div>
    </div>);

}
function LnapForm({
  onSubmit


}: {onSubmit: (r: Omit<LnapRecord, 'id'>) => void;}) {
  const [form, setForm] = useState({
    reportDate: '',
    bnapStatus: '',
    bnapDocuments: '',
    bnapLink: '',
    sixPoint: '',
    sixPointLink: '',
    sbResolution: '',
    resolutionLink: '',
    aipInclusion: '',
    aipLink: '',
    bncResolution: '',
    bncLink: '',
    sixThreeScore: '',
    sixThreeLink: ''
  });
  const [success, setSuccess] = useState(false);
  const update = (field: string, value: string) =>
  setForm((f) => ({
    ...f,
    [field]: value
  }));
  const handleSubmit = () => {
    if (!form.reportDate || !form.bnapStatus) return;
    onSubmit(form);
    setForm({
      reportDate: '',
      bnapStatus: '',
      bnapDocuments: '',
      bnapLink: '',
      sixPoint: '',
      sixPointLink: '',
      sbResolution: '',
      resolutionLink: '',
      aipInclusion: '',
      aipLink: '',
      bncResolution: '',
      bncLink: '',
      sixThreeScore: '',
      sixThreeLink: ''
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
          LNAP record saved successfully!
        </motion.div>
      }

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileTextIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Basic Information
            </h3>
            <p className="text-xs text-gray-400">
              Report date and BNAP status details
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              LNAP Status Report Date
            </label>
            <input
              type="date"
              value={form.reportDate}
              onChange={(e) => update('reportDate', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
            
          </div>
          <SelectField
            label="2025-2026 BNAP Status"
            options={STATUS_OPTIONS}
            value={form.bnapStatus}
            onChange={(v) => update('bnapStatus', v)} />
          
          <UrlField
            label="Link to Scanned BNAP Status Document"
            value={form.bnapLink}
            onChange={(v) => update('bnapLink', v)} />
          
        </div>
      </div>

      {/* 6-Point Criteria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <CheckSquareIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              6-Point Criteria
            </h3>
            <p className="text-xs text-gray-400">
              Compliance status and documentation
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <SelectField
            label="Follows the 6-Point Criteria?"
            options={SIX_POINT_OPTIONS}
            value={form.sixPoint}
            onChange={(v) => update('sixPoint', v)} />
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Link to Scanned Document with 6-Point Criteria
            </label>
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={form.sixPointLink || ''}
                onChange={(e) => update('sixPointLink', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Paste link to the scanned document
            </p>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <StampIcon size={18} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              SB Resolution on BNAP Approval
            </h3>
            <p className="text-xs text-gray-400">
              Sangguniang Barangay resolution status
            </p>
          </div>
        </div>
        <div className="border-t border-green-100 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <SelectField
            label="SB Resolution on BNAP Approval"
            options={YES_NO_CHECK}
            value={form.sbResolution}
            onChange={(v) => update('sbResolution', v)} />
          
          <UrlField
            label="Link to Scanned Approved BNAP with Resolution"
            value={form.resolutionLink}
            onChange={(v) => update('resolutionLink', v)} />
          
        </div>
      </div>

      {/* AIP Inclusion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
            <BuildingIcon size={18} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Inclusion of BNAP PPAs in AIP
            </h3>
            <p className="text-xs text-gray-400">
              Annual Investment Program inclusion
            </p>
          </div>
        </div>
        <div className="border-t border-accent/20 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <SelectField
            label="Inclusion of BNAP PPAs in AIP"
            options={YES_NO_CHECK}
            value={form.aipInclusion}
            onChange={(v) => update('aipInclusion', v)} />
          
          <UrlField
            label="Link to Scanned Approved AIP"
            value={form.aipLink}
            onChange={(v) => update('aipLink', v)} />
          
        </div>
      </div>

      {/* BNC Reorganization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <UsersIcon size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Resolution/Ordinance on BNC Reorganization/Organization
            </h3>
            <p className="text-xs text-gray-400">
              Barangay Nutrition Committee status
            </p>
          </div>
        </div>
        <div className="border-t border-purple-100 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <SelectField
            label="Resolution/Ordinance on BNC Reorganization/Organization"
            options={YES_NO_CHECK}
            value={form.bncResolution}
            onChange={(v) => update('bncResolution', v)} />
          
          <UrlField
            label="Link to Scanned BNC Org Reso/EO"
            value={form.bncLink}
            onChange={(v) => update('bncLink', v)} />
          
        </div>
      </div>

      {/* 6+3 Criteria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
            <CalculatorIcon size={18} className="text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              6+3 Criteria
            </h3>
            <p className="text-xs text-gray-400">Extended criteria scoring</p>
          </div>
        </div>
        <div className="border-t border-teal-100 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <SelectField
            label="6+3 Criteria"
            options={BINARY_OPTIONS}
            placeholder="Select value"
            value={form.sixThreeScore}
            onChange={(v) => update('sixThreeScore', v)} />
          
          <UrlField
            label="Link to Scanned Document with 6+3 Criteria"
            value={form.sixThreeLink}
            onChange={(v) => update('sixThreeLink', v)} />
          
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{
            scale: 1.01
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={handleSubmit}
          className="px-8 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary/20">
          
          Submit LNAP Status
        </motion.button>
      </div>
    </div>);

}
function LnapList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: LnapRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [viewRecord, setViewRecord] = useState<LnapRecord | null>(null);
  function getViewSections(r: LnapRecord): SectionDef[] {
    return [
    {
      title: 'Basic Information',
      fields: [
      {
        label: 'Report Date',
        value: r.reportDate
      },
      {
        label: '2025-2026 BNAP Status',
        value: r.bnapStatus,
        type: 'badge' as const,
        badgeColor:
        r.bnapStatus === 'Approved BNAP' ?
        'bg-green-50 text-green-700' :
        r.bnapStatus === 'Under Development' ?
        'bg-amber-50 text-amber-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'BNAP Documents',
        value: r.bnapDocuments
      },
      {
        label: 'Link to Scanned BNAP Status Document',
        value: r.bnapLink,
        type: 'link' as const
      }]

    },
    {
      title: '6-Point Criteria',
      fields: [
      {
        label: 'Follows the 6-Point Criteria?',
        value: r.sixPoint,
        type: 'badge' as const,
        badgeColor:
        r.sixPoint === 'Yes' ?
        'bg-green-50 text-green-700' :
        r.sixPoint === 'No' ?
        'bg-red-50 text-red-600' :
        'bg-amber-50 text-amber-700'
      },
      {
        label: 'Link to Scanned Document with 6-Point Criteria',
        value: r.sixPointLink,
        type: 'link' as const
      }]

    },
    {
      title: 'SB Resolution on BNAP Approval',
      fields: [
      {
        label: 'SB Resolution on BNAP Approval',
        value: r.sbResolution,
        type: 'badge' as const,
        badgeColor:
        r.sbResolution === 'Yes' ?
        'bg-green-50 text-green-700' :
        r.sbResolution === 'No' ?
        'bg-red-50 text-red-600' :
        'bg-amber-50 text-amber-700'
      },
      {
        label: 'Link to Scanned Approved BNAP with Resolution',
        value: r.resolutionLink,
        type: 'link' as const
      }]

    },
    {
      title: 'AIP Inclusion',
      fields: [
      {
        label: 'Inclusion of BNAP PPAs in AIP',
        value: r.aipInclusion,
        type: 'badge' as const,
        badgeColor:
        r.aipInclusion === 'Yes' ?
        'bg-green-50 text-green-700' :
        r.aipInclusion === 'No' ?
        'bg-red-50 text-red-600' :
        'bg-amber-50 text-amber-700'
      },
      {
        label: 'Link to Scanned Approved AIP',
        value: r.aipLink,
        type: 'link' as const
      }]

    },
    {
      title: 'BNC Reorganization',
      fields: [
      {
        label: 'Resolution/Ordinance on BNC Reorganization',
        value: r.bncResolution,
        type: 'badge' as const,
        badgeColor:
        r.bncResolution === 'Yes' ?
        'bg-green-50 text-green-700' :
        r.bncResolution === 'No' ?
        'bg-red-50 text-red-600' :
        'bg-amber-50 text-amber-700'
      },
      {
        label: 'Link to Scanned BNC Org Reso/EO',
        value: r.bncLink,
        type: 'link' as const
      }]

    },
    {
      title: '6+3 Criteria',
      fields: [
      {
        label: '6+3 Criteria Score',
        value: r.sixThreeScore
      },
      {
        label: 'Link to Scanned Document with 6+3 Criteria',
        value: r.sixThreeLink,
        type: 'link' as const
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="LNAP Status Record"
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
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search LNAP records..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
        <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30">
          <option>All Statuses</option>
          {STATUS_OPTIONS.map((s) =>
          <option key={s}>{s}</option>
          )}
        </select>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-secondary-50/40 to-primary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Report Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                BNAP Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                6-Point Criteria
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                AIP Inclusion
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                BNC Resolution
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) =>
            <tr
              key={r.id}
              className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-secondary-50/20 hover:to-transparent hover:shadow-sm transition-all duration-200 cursor-pointer group">
              
                <td className="px-4 py-3.5 text-gray-700 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-secondary rounded-r-full transition-all duration-200" />
                  {r.reportDate}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.bnapStatus} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.sixPoint} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.aipInclusion} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.bncResolution} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                    onClick={() => setViewRecord(r)}
                    className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary transition-all hover:scale-110"
                    title="View">
                    
                      <EyeIcon size={15} />
                    </button>
                    <button
                    className="p-1.5 rounded-lg hover:bg-primary-100 text-primary transition-all hover:scale-110"
                    title="Edit">
                    
                      <PencilIcon size={15} />
                    </button>
                    <button
                    onClick={() => onDelete(r.id)}
                    className="p-1.5 rounded-lg hover:bg-alert-100 text-alert transition-all hover:scale-110"
                    title="Delete">
                    
                      <Trash2Icon size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-3 space-y-3">
        {records.map((r) =>
        <div
          key={r.id}
          className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-secondary/30 hover:shadow-md hover:shadow-secondary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/0 group-hover:bg-secondary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800 group-hover:text-secondary transition-colors">
                {r.reportDate}
              </span>
              <StatusBadge value={r.bnapStatus} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block">6-Point</span>
                <StatusBadge value={r.sixPoint} />
              </div>
              <div>
                <span className="text-gray-400 block">AIP</span>
                <StatusBadge value={r.aipInclusion} />
              </div>
              <div>
                <span className="text-gray-400 block">BNC</span>
                <StatusBadge value={r.bncResolution} />
              </div>
            </div>
            <div className="flex justify-end gap-1 pt-1 border-t border-gray-50">
              <button
              onClick={() => setViewRecord(r)}
              className="p-1.5 rounded-lg hover:bg-secondary-50 text-secondary transition-colors">
              
                <EyeIcon size={14} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-primary-50 text-primary transition-colors">
                <PencilIcon size={14} />
              </button>
              <button
              onClick={() => onDelete(r.id)}
              className="p-1.5 rounded-lg hover:bg-alert-50 text-alert transition-colors">
              
                <Trash2Icon size={14} />
              </button>
            </div>
          </div>
        )}
        {records.length === 0 &&
        <div className="text-center py-8 text-gray-400 text-sm">
            No LNAP records found
          </div>
        }
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing {records.length} records
        </p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeftIcon size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-medium">
            1
          </button>
          <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>);

}