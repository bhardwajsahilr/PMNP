import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserIcon,
  FileWarningIcon,
  TagIcon,
  WrenchIcon,
  CheckCircleIcon,
  LinkIcon,
  PaperclipIcon,
  AlertTriangleIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
type Tab = 'form' | 'list';
const NATURE_OPTIONS = [
'Type A - Environmental',
'Type B - Social',
'Type C - Health & Safety',
'Type D - Financial',
'Type E - Others'];

const CATEGORY_MAP: Record<string, string[]> = {
  'Type A - Environmental': [
  'Pollution',
  'Waste Management',
  'Deforestation',
  'Water Contamination'],

  'Type B - Social': [
  'Displacement',
  'Cultural Impact',
  'Community Conflict',
  'Land Rights'],

  'Type C - Health & Safety': [
  'Workplace Safety',
  'Food Safety',
  'Disease Outbreak',
  'Sanitation'],

  'Type D - Financial': [
  'Fund Misuse',
  'Delayed Payment',
  'Budget Discrepancy',
  'Procurement Issue']

};
const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const STATUS_OPTIONS = ['Open', 'Under Investigation', 'Resolved', 'Closed'];
interface GifRecord {
  id: number;
  refNo: string;
  dateReceived: string;
  province: string;
  municipality: string;
  barangay: string;
  isAnonymous: string;
  complainantName: string;
  contactNumber: string;
  address: string;
  natureOfConcern: string;
  othersSpecify: string;
  description: string;
  category: string;
  severity: string;
  actionTaken: string;
  dateOfAction: string;
  responsiblePerson: string;
  status: string;
  resolutionDetails: string;
  dateResolved: string;
  documentLink: string;
  remarks: string;
}
const SEED_GIF: GifRecord[] = [
{
  id: 1,
  refNo: 'GIF-001',
  dateReceived: '2026-03-12',
  province: 'Laguna',
  municipality: 'Santa Rosa',
  barangay: 'Balibago',
  isAnonymous: 'No',
  complainantName: 'Maria Santos',
  contactNumber: '09171234567',
  address: 'Purok 3, Balibago',
  natureOfConcern: 'Type A - Environmental',
  othersSpecify: '',
  description:
  "Improper waste disposal near the feeding center affecting children's health.",
  category: 'Waste Management',
  severity: 'High',
  actionTaken: 'Coordinated with barangay officials for cleanup.',
  dateOfAction: '2026-03-14',
  responsiblePerson: 'Juan Dela Cruz',
  status: 'Resolved',
  resolutionDetails:
  'Waste properly disposed. Warning issued to responsible party.',
  dateResolved: '2026-03-18',
  documentLink: '',
  remarks: ''
},
{
  id: 2,
  refNo: 'GIF-002',
  dateReceived: '2026-03-08',
  province: 'Laguna',
  municipality: 'Calamba',
  barangay: 'Parian',
  isAnonymous: 'Yes',
  complainantName: '',
  contactNumber: '',
  address: '',
  natureOfConcern: 'Type D - Financial',
  othersSpecify: '',
  description: 'Alleged delayed payment of stipends for nutrition workers.',
  category: 'Delayed Payment',
  severity: 'Medium',
  actionTaken: 'Forwarded to finance department for verification.',
  dateOfAction: '2026-03-10',
  responsiblePerson: 'Ana Reyes',
  status: 'Under Investigation',
  resolutionDetails: '',
  dateResolved: '',
  documentLink: '',
  remarks: 'Awaiting finance report'
},
{
  id: 3,
  refNo: 'GIF-003',
  dateReceived: '2026-02-25',
  province: 'Batangas',
  municipality: 'Lipa',
  barangay: 'Sabang',
  isAnonymous: 'No',
  complainantName: 'Pedro Ramos',
  contactNumber: '09281234567',
  address: 'Sitio Malaya, Sabang',
  natureOfConcern: 'Type C - Health & Safety',
  othersSpecify: '',
  description: 'Unsanitary conditions at the supplementary feeding area.',
  category: 'Sanitation',
  severity: 'Critical',
  actionTaken: 'Immediate inspection conducted.',
  dateOfAction: '2026-02-26',
  responsiblePerson: 'Dr. Liza Gomez',
  status: 'Closed',
  resolutionDetails: 'Feeding area sanitized and new protocols established.',
  dateResolved: '2026-03-01',
  documentLink: '',
  remarks: ''
},
{
  id: 4,
  refNo: 'GIF-004',
  dateReceived: '2026-02-15',
  province: 'Quezon',
  municipality: 'Lucena',
  barangay: 'Ibabang Dupay',
  isAnonymous: 'No',
  complainantName: 'Rosa Villanueva',
  contactNumber: '09351234567',
  address: 'Zone 4, Ibabang Dupay',
  natureOfConcern: 'Type E - Others',
  othersSpecify: 'Scheduling conflict',
  description:
  'Nutrition sessions overlap with livelihood training schedule.',
  category: 'Scheduling conflict',
  severity: 'Low',
  actionTaken: '',
  dateOfAction: '',
  responsiblePerson: '',
  status: 'Open',
  resolutionDetails: '',
  dateResolved: '',
  documentLink: '',
  remarks: 'Needs coordination with DSWD'
}];

function loadGif(): GifRecord[] {
  return storageGet<GifRecord[]>(KEYS.GIF, SEED_GIF);
}
function saveGif(records: GifRecord[]) {
  storageSet(KEYS.GIF, records);
}
function StatusBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    Open: 'bg-blue-50 text-blue-700',
    'Under Investigation': 'bg-amber-50 text-amber-700',
    Resolved: 'bg-green-50 text-green-700',
    Closed: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
function SeverityBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    Low: 'bg-green-50 text-green-700',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-orange-50 text-orange-700',
    Critical: 'bg-red-50 text-red-700'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
export function GrievanceIntakePage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<GifRecord[]>(loadGif);
  const handleAdd = useCallback(
    (record: Omit<GifRecord, 'id' | 'refNo'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const newRecord: GifRecord = {
        ...record,
        id: nextId,
        refNo: `GIF-${String(nextId).padStart(3, '0')}`
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      saveGif(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveGif(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.natureOfConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.severity.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Grievance Intake Form
          </h1>
          <p className="text-sm text-gray-500">
            Log and track community grievances and complaints
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Grievance',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'GIF Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="gif-tab"
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
          
            <GifForm onSubmit={handleAdd} />
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
          
            <GifList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function GifForm({
  onSubmit


}: {onSubmit: (r: Omit<GifRecord, 'id' | 'refNo'>) => void;}) {
  const [form, setForm] = useState<Record<string, string>>({
    dateReceived: '',
    province: '',
    municipality: '',
    barangay: '',
    isAnonymous: 'No',
    complainantName: '',
    contactNumber: '',
    address: '',
    natureOfConcern: '',
    othersSpecify: '',
    description: '',
    category: '',
    severity: '',
    actionTaken: '',
    dateOfAction: '',
    responsiblePerson: '',
    status: '',
    resolutionDetails: '',
    dateResolved: '',
    documentLink: '',
    remarks: ''
  });
  const [success, setSuccess] = useState(false);
  const update = (field: string, value: string) => {
    setForm((f) => {
      const next = {
        ...f,
        [field]: value
      };
      if (field === 'natureOfConcern') {
        next.category = '';
        if (value !== 'Type E - Others') next.othersSpecify = '';
      }
      if (field === 'isAnonymous' && value === 'Yes') {
        next.complainantName = '';
        next.contactNumber = '';
        next.address = '';
      }
      if (field === 'status' && value !== 'Resolved' && value !== 'Closed') {
        next.dateResolved = '';
      }
      return next;
    });
  };
  const categories =
  form.natureOfConcern === 'Type E - Others' ?
  form.othersSpecify ?
  [form.othersSpecify] :
  [] :
  CATEGORY_MAP[form.natureOfConcern] || [];
  const handleSubmit = () => {
    if (!form.dateReceived || !form.natureOfConcern || !form.description) return;
    onSubmit(form as unknown as Omit<GifRecord, 'id' | 'refNo'>);
    const resetForm: Record<string, string> = {};
    Object.keys(form).forEach((k) => {
      resetForm[k] = k === 'isAnonymous' ? 'No' : '';
    });
    setForm(resetForm);
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
          Grievance record saved successfully!
        </motion.div>
      }

      {/* 1. Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Basic Information
            </h3>
            <p className="text-xs text-gray-400">Date and location details</p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5 sm:p-6 pt-4">
          <FormField
            label="Date Received"
            type="date"
            value={form.dateReceived}
            onChange={(v) => update('dateReceived', v)} />
          
          <FormField
            label="GIF Reference No."
            type="text"
            placeholder="Auto-generated"
            disabled />
          
          <FormField
            label="Province"
            type="text"
            placeholder="Enter province"
            value={form.province}
            onChange={(v) => update('province', v)} />
          
          <FormField
            label="Municipality / City"
            type="text"
            placeholder="Enter municipality"
            value={form.municipality}
            onChange={(v) => update('municipality', v)} />
          
          <FormField
            label="Barangay"
            type="text"
            placeholder="Enter barangay"
            value={form.barangay}
            onChange={(v) => update('barangay', v)} />
          
        </div>
      </div>

      {/* 2. Complainant Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <UserIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Complainant Information
            </h3>
            <p className="text-xs text-gray-400">
              Identity and contact details
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Is Anonymous?
            </label>
            <select
              value={form.isAnonymous}
              onChange={(e) => update('isAnonymous', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {form.isAnonymous === 'No' &&
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
              <FormField
              label="Name of Complainant"
              type="text"
              placeholder="Enter full name"
              value={form.complainantName}
              onChange={(v) => update('complainantName', v)} />
            
              <FormField
              label="Contact Number"
              type="text"
              placeholder="09XX-XXX-XXXX"
              value={form.contactNumber}
              onChange={(v) => update('contactNumber', v)} />
            
              <FormField
              label="Address"
              type="text"
              placeholder="Enter address"
              value={form.address}
              onChange={(v) => update('address', v)} />
            
            </motion.div>
          }
        </div>
      </div>

      {/* 3. Complaint Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <FileWarningIcon size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Complaint Details
            </h3>
            <p className="text-xs text-gray-400">
              Nature and description of the concern
            </p>
          </div>
        </div>
        <div className="border-t border-purple-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nature of Concern
              </label>
              <select
                value={form.natureOfConcern}
                onChange={(e) => update('natureOfConcern', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
                
                <option value="">Select nature of concern</option>
                {NATURE_OPTIONS.map((o) =>
                <option key={o} value={o}>
                    {o}
                  </option>
                )}
              </select>
            </div>
            {form.natureOfConcern === 'Type E - Others' &&
            <FormField
              label="Please specify"
              type="text"
              placeholder="Specify the concern"
              value={form.othersSpecify}
              onChange={(v) => update('othersSpecify', v)} />

            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Description of Concern
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed description of the concern..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
        </div>
      </div>

      {/* 4. Category & Classification */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
            <TagIcon size={18} className="text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Category & Classification
            </h3>
            <p className="text-xs text-gray-400">
              Categorize and assess severity
            </p>
          </div>
        </div>
        <div className="border-t border-teal-100 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              disabled={
              !form.natureOfConcern ||
              form.natureOfConcern === 'Type E - Others' &&
              !form.othersSpecify
              }
              className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${!form.natureOfConcern ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}>
              
              <option value="">Select category</option>
              {categories.map((c) =>
              <option key={c} value={c}>
                  {c}
                </option>
              )}
            </select>
            {!form.natureOfConcern &&
            <p className="text-xs text-gray-400 mt-1">
                Select Nature of Concern first
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Severity Level
            </label>
            <select
              value={form.severity}
              onChange={(e) => update('severity', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select severity</option>
              {SEVERITY_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Action Taken */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <WrenchIcon size={18} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Action Taken
            </h3>
            <p className="text-xs text-gray-400">
              Response and responsible personnel
            </p>
          </div>
        </div>
        <div className="border-t border-green-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Action Taken
            </label>
            <textarea
              rows={3}
              placeholder="Describe the action taken..."
              value={form.actionTaken}
              onChange={(e) => update('actionTaken', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Date of Action"
              type="date"
              value={form.dateOfAction}
              onChange={(v) => update('dateOfAction', v)} />
            
            <FormField
              label="Responsible Person"
              type="text"
              placeholder="Enter name"
              value={form.responsiblePerson}
              onChange={(v) => update('responsiblePerson', v)} />
            
          </div>
        </div>
      </div>

      {/* 6. Resolution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
            <AlertTriangleIcon size={18} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resolution</h3>
            <p className="text-xs text-gray-400">
              Current status and resolution details
            </p>
          </div>
        </div>
        <div className="border-t border-accent/20 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
                
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((o) =>
                <option key={o} value={o}>
                    {o}
                  </option>
                )}
              </select>
            </div>
            {(form.status === 'Resolved' || form.status === 'Closed') &&
            <FormField
              label="Date Resolved"
              type="date"
              value={form.dateResolved}
              onChange={(v) => update('dateResolved', v)} />

            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Resolution Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe the resolution..."
              value={form.resolutionDetails}
              onChange={(e) => update('resolutionDetails', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
        </div>
      </div>

      {/* 7. Supporting Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <PaperclipIcon size={18} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Supporting Documents
            </h3>
            <p className="text-xs text-gray-400">
              Attach relevant files and notes
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Document Link (Google Drive)
            </label>
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={form.documentLink}
                onChange={(e) => update('documentLink', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Add any remarks or notes..."
              value={form.remarks}
              onChange={(e) => update('remarks', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
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
          
          Submit Grievance
        </motion.button>
      </div>
    </div>);

}
function FormField({
  label,
  type,
  placeholder,
  disabled,
  className,
  value,
  onChange








}: {label: string;type: string;placeholder?: string;disabled?: boolean;className?: string;value?: string;onChange?: (v: string) => void;}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value || ''}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white'}`} />
      
    </div>);

}
function GifList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: GifRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
            placeholder="Search grievances..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ref No.
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Received
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nature of Concern
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Severity
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
              
                <td className="px-4 py-3.5 font-mono text-xs text-gray-500 group-hover:text-gray-700 transition-colors relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-primary rounded-r-full transition-all duration-200" />
                  {r.refNo}
                </td>
                <td className="px-4 py-3.5 text-gray-700">{r.dateReceived}</td>
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors">
                  {r.natureOfConcern.replace(/^Type [A-E] - /, '')}
                </td>
                <td className="px-4 py-3.5">
                  <SeverityBadge value={r.severity} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                    className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary transition-all hover:scale-110"
                    title="View">
                    
                      <EyeIcon size={15} />
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
            {paginated.length === 0 &&
            <tr>
                <td
                colSpan={6}
                className="text-center py-8 text-gray-400 text-sm">
                
                  No grievance records found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-3 space-y-3">
        {paginated.map((r) =>
        <div
          key={r.id}
          className="border border-gray-100 rounded-xl p-4 space-y-2 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-500">{r.refNo}</span>
              <span className="text-xs text-gray-400">{r.dateReceived}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
              {r.natureOfConcern.replace(/^Type [A-E] - /, '')}
            </p>
            <div className="flex items-center gap-2">
              <SeverityBadge value={r.severity} />
              <StatusBadge value={r.status} />
            </div>
            <div className="flex items-center justify-end pt-1">
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-secondary-50 text-secondary transition-colors">
                  <EyeIcon size={14} />
                </button>
                <button
                onClick={() => onDelete(r.id)}
                className="p-1.5 rounded-lg hover:bg-alert-50 text-alert transition-colors">
                
                  <Trash2Icon size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {paginated.length === 0 &&
        <div className="text-center py-8 text-gray-400 text-sm">
            No grievance records found
          </div>
        }
      </div>

      {/* Pagination */}
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