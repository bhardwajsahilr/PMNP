import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  Children,
  createElement } from
'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  FileIcon,
  UploadIcon,
  CheckCircleIcon,
  XIcon,
  SaveIcon,
  ClipboardCheckIcon,
  MapPinIcon,
  MessageSquareIcon,
  BriefcaseIcon,
  ChevronDownIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const ACTIVITY_OPTIONS = [
'Workshops and Trainings',
'Monitoring Visits and Site Inspections',
'Conferences & National Technical Sessions',
'Awarding & Recognitions'];

const WORKSHOPS_TYPES = [
'Nutrition Governance and Specialized Health Workshop',
'Technical Rollouts (Hands-on Training)',
'Administrative Workshops'];

const MONITORING_TYPES = [
'Environmental & Social Safeguards (ESMF)',
'Logistics Inspections',
'Programmatic Monitoring',
'Financial Monitoring'];

const CONFERENCE_TYPES = ['Evidence Generation Conference', 'Audit and Summits'];
const DESIGNATION_OPTIONS = [
'Undersecretary',
'Assistant Secretary',
'Regional Director',
'Assistant Regional Director',
'Director',
'Medical Officer',
'Project Coordinator',
'Project Officer',
'Executive Assistant',
'Senior Project Assistant',
'Project Assistant',
'Project Aide',
'Nutrition Officer',
'Project Associate',
'Health Program Researcher',
'Health Education Project Officer',
'Regional Nutrition Program Coordinator',
'Minister',
'Project Development Officer',
'National Program Manager',
'Regional Coordinator',
'Statistician',
'Nurse',
'Unit Head'];

const AGENCY_OPTIONS = [
'Philippine Multisectoral Nutrition Project',
'National Project Management Office (NPMO)',
'DOH-Bureau of International Health Cooperation (BIHC)',
'DOH-Bureau of Local Health Systems Development (BLHSD)',
'DOH-Epidemiology Bureau (EB)',
'DOH-Disease Prevention and Control Bureau (DPCB)',
'DOH-Health Promotion Bureau (HPB)',
'DOH-Knowledge Management and Information Technology Service (KMITS)',
'Department of Social Welfare and Development (DSWD)',
'Department of the Interior and Local Government (DILG)',
'Department of Information and Communications Technology (DICT)',
'DSWD - Office of the Undersecretary for Conditional Cash Transfer Group (OUS-CCTG)',
'DSWD - Information and Communications Technology Management Service',
'DSWD Kapit-Bisig Laban sa Kahirapan-Comprehensive and Integrated Delivery of Social Services (Kalahi-CIDSS)',
'National Nutrition Council (NNC)',
'Department of Science and Technology - Food and Nutrition Research Institute (DOST-FNRI)',
'Department of Agriculture (DA)',
'Bangsamoro Transition Authority (BTA)',
'Commission on Higher Education (CHED)',
'Technical Education And Skills Development Authority (TESDA)',
'Department of Budget and Management (DBM)',
'Department of Finance (DOF)',
'National Commission on Indigenous Peoples (NCIP)',
'Department of Economy, Planning, and Development (DEPDev)',
'Social Development Staff (SDS)',
'NEDA-Monitoring and Evaluation Staff (MES)',
'Philippine Health Insurance Corporation (PHIC)',
'Philippine Statistics Authority (PSA)',
'World Bank (WB)',
"United Nations Children's Fund (UNICEF)",
'United Nations Office for Project Services (UNOPS)'];

const REGION_OPTIONS = [
'National Capital Region (NCR)',
'Cordillera Administrative Region (CAR)',
'Ilocos Region (Region I)',
'Cagayan Valley (Region II)',
'Central Luzon (Region III)',
'CALABARZON (Region IV-A)',
'Mimaropa (Region IV-B)',
'Bicol Region (Region V)',
'Western Visayas (Region VI)',
'Central Visayas (Region VII)',
'Eastern Visayas (Region VIII)',
'Zamboanga Peninsula (Region IX)',
'Northern Mindanao (Region X)',
'Davao Region (Region XI)',
'SOCCSKSARGEN (Region XII)',
'Caraga (Region XIII)',
'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
'Negros Island Region (NIR)'];

interface Meeting {
  id: number;
  startDate: string;
  endDate: string;
  officeCode: string;
  time: string;
  activity: string;
  activitySubType: string;
  venue: string;
  designations: string[];
  agencies: string[];
  regions: string[];
  scannedCopyDoc: string;
  highlights: string;
  remarks: string;
  isDraft: boolean;
}
const SEED: Meeting[] = [
{
  id: 1,
  startDate: '2026-04-01',
  endDate: '2026-04-02',
  officeCode: 'NPMO-2026-001',
  time: '09:00 AM - 12:00 PM',
  activity: 'Workshops and Trainings',
  activitySubType: 'Technical Rollouts (Hands-on Training)',
  venue: 'DOH Central Office, Manila',
  designations: ['Project Coordinator', 'Nutrition Officer'],
  agencies: [
  'National Project Management Office (NPMO)',
  'National Nutrition Council (NNC)'],

  regions: ['National Capital Region (NCR)', 'Central Luzon (Region III)'],
  scannedCopyDoc: 'Approved-Workshop-Apr2026.pdf',
  highlights:
  'Discussed rollout plan for Q2 technical training across regions. Agreed on a phased approach beginning with NCR and Region III.',
  remarks: '',
  isDraft: false
},
{
  id: 2,
  startDate: '2026-03-20',
  endDate: '2026-03-20',
  officeCode: 'NPMO-2026-002',
  time: '02:00 PM - 04:00 PM',
  activity: 'Monitoring Visits and Site Inspections',
  activitySubType: 'Programmatic Monitoring',
  venue: 'Municipal Health Office, Calamba',
  designations: ['Regional Director', 'Medical Officer'],
  agencies: ['DOH-Bureau of Local Health Systems Development (BLHSD)'],
  regions: ['CALABARZON (Region IV-A)'],
  scannedCopyDoc: '',
  highlights:
  'Reviewed nutrition program implementation progress in target municipalities.',
  remarks: 'Follow-up visit scheduled for May.',
  isDraft: false
},
{
  id: 3,
  startDate: '2026-03-10',
  endDate: '2026-03-12',
  officeCode: 'NPMO-2026-003',
  time: '09:00 AM - 05:00 PM',
  activity: 'Conferences & National Technical Sessions',
  activitySubType: 'Evidence Generation Conference',
  venue: 'Philippine International Convention Center',
  designations: ['National Program Manager', 'Health Program Researcher'],
  agencies: ['World Bank (WB)', "United Nations Children's Fund (UNICEF)"],
  regions: ['National Capital Region (NCR)'],
  scannedCopyDoc: 'Conference-Proceedings-Mar2026.pdf',
  highlights:
  'Presented findings from the 2025 nutrition baseline survey. Key partners aligned on data dissemination strategy.',
  remarks: '',
  isDraft: true
}];

function loadRecords(): Meeting[] {
  return storageGet<Meeting[]>(KEYS.MEETINGS, SEED);
}
function saveRecords(records: Meeting[]) {
  storageSet(KEYS.MEETINGS, records);
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
function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  error







}: {label: string;options: string[];selected: string[];onChange: (val: string[]) => void;placeholder?: string;error?: string;}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const filtered = options.filter(
    (o) =>
    o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o)
  );
  const toggle = (val: string) => {
    if (selected.includes(val)) onChange(selected.filter((s) => s !== val));else
    onChange([...selected, val]);
  };
  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <div
        onClick={() => setOpen(true)}
        className={`min-h-[42px] px-3 py-2 rounded-lg border text-sm cursor-pointer flex flex-wrap gap-1.5 items-center bg-white ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} ${open ? 'ring-2 ring-secondary/30 border-secondary' : ''}`}>
        
        {selected.length === 0 &&
        <span className="text-gray-400 text-sm">
            {placeholder || 'Select...'}
          </span>
        }
        {selected.map((s) =>
        <span
          key={s}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium max-w-[220px]">
          
            <span className="truncate">{s}</span>
            <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(s);
            }}
            className="hover:text-primary/70 flex-shrink-0">
            
              <XIcon size={12} />
            </button>
          </span>
        )}
        <ChevronDownIcon
          size={14}
          className="ml-auto text-gray-400 flex-shrink-0" />
        
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{
            opacity: 0,
            y: -4
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -4
          }}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          
            <div className="p-2 border-b border-gray-100">
              <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2.5 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-secondary/30"
              autoFocus />
            
            </div>
            <div className="overflow-y-auto max-h-44">
              {filtered.length === 0 ?
            <div className="px-3 py-2 text-xs text-gray-400">
                  No options found
                </div> :

            filtered.map((o) =>
            <button
              key={o}
              onClick={() => {
                toggle(o);
                setSearch('');
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 text-gray-700 transition-colors">
              
                    {o}
                  </button>
            )
            }
            </div>
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
    input.accept = '.pdf,.jpg,.jpeg,.png';
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
export function AdministrationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<Meeting[]>(loadRecords);
  const handleAdd = useCallback(
    (record: Omit<Meeting, 'id'>) => {
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
  const filteredRecords = records.filter(
    (r) =>
    r.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.officeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.startDate.includes(searchQuery)
  );
  const existingOfficeCodes = useMemo(
    () => records.map((r) => r.officeCode),
    [records]
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">PMNP Meetings</h1>
          <p className="text-sm text-gray-500">
            Record meetings, workshops, monitoring visits, and conferences
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Meeting',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'Meeting Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="admin-tab"
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
          
            <MeetingForm
            onSubmit={handleAdd}
            existingOfficeCodes={existingOfficeCodes} />
          
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
          
            <MeetingList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function MeetingForm({
  onSubmit,
  existingOfficeCodes



}: {onSubmit: (r: Omit<Meeting, 'id'>) => void;existingOfficeCodes: string[];}) {
  const [form, setForm] = useState({
    startDate: getTodayString(),
    endDate: getTodayString(),
    officeCode: '',
    time: '',
    activity: '',
    activitySubType: '',
    venue: '',
    designations: [] as string[],
    agencies: [] as string[],
    regions: [] as string[],
    scannedCopyDoc: '',
    highlights: '',
    remarks: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateField = (field: string, value: string | string[]) => {
    setForm((f) => {
      const next = {
        ...f,
        [field]: value
      };
      if (field === 'activity') {
        next.activitySubType = '';
      }
      return next;
    });
    setErrors((e) => ({
      ...e,
      [field]: ''
    }));
  };
  const getSubTypeOptions = (): string[] => {
    if (form.activity === 'Workshops and Trainings') return WORKSHOPS_TYPES;
    if (form.activity === 'Monitoring Visits and Site Inspections')
    return MONITORING_TYPES;
    if (form.activity === 'Conferences & National Technical Sessions')
    return CONFERENCE_TYPES;
    return [];
  };
  const getSubTypeLabel = (): string => {
    if (form.activity === 'Workshops and Trainings')
    return 'Types of Workshops and Trainings';
    if (form.activity === 'Monitoring Visits and Site Inspections')
    return 'Types of Monitoring Visits and Site Inspections';
    if (form.activity === 'Conferences & National Technical Sessions')
    return 'Types of Conferences & National Technical Sessions';
    return '';
  };
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.startDate) errs.startDate = 'Meeting start date is required.';
    if (!form.endDate) errs.endDate = 'Meeting end date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
    errs.endDate =
    'Meeting end date cannot be earlier than meeting start date.';
    if (!form.officeCode.trim()) errs.officeCode = 'Office code is required.';else
    if (existingOfficeCodes.includes(form.officeCode.trim()))
    errs.officeCode = 'Office code must be unique.';
    if (!form.activity) errs.activity = 'Please select an activity.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const resetForm = () => {
    setForm({
      startDate: getTodayString(),
      endDate: getTodayString(),
      officeCode: '',
      time: '',
      activity: '',
      activitySubType: '',
      venue: '',
      designations: [],
      agencies: [],
      regions: [],
      scannedCopyDoc: '',
      highlights: '',
      remarks: ''
    });
  };
  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validate()) return;
    if (isDraft && !form.officeCode.trim()) {
      setErrors({
        officeCode: 'Office code is required.'
      });
      return;
    }
    onSubmit({
      ...form,
      isDraft
    });
    resetForm();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };
  const subTypeOptions = getSubTypeOptions();
  const subTypeLabel = getSubTypeLabel();
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
          Meeting record saved successfully!
        </motion.div>
      }

      {/* 1. Meeting Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Meeting Information
            </h3>
            <p className="text-xs text-gray-400">
              Dates, office code, and time
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Meeting Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${errors.startDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
            
            {errors.startDate &&
            <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Meeting End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${errors.endDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
            
            {errors.endDate &&
            <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Office Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.officeCode}
              onChange={(e) => updateField('officeCode', e.target.value)}
              placeholder="e.g. NPMO-2026-001"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${errors.officeCode ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
            
            {errors.officeCode ?
            <p className="text-xs text-red-500 mt-1">{errors.officeCode}</p> :

            <p className="text-xs text-gray-400 mt-1">
                Unique office code for each uploaded file
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Time
            </label>
            <input
              type="text"
              value={form.time}
              onChange={(e) => updateField('time', e.target.value)}
              placeholder="Example: 09:00 AM - 12:00 PM"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
            
          </div>
        </div>
      </div>

      {/* 2. Activity Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <BriefcaseIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Activity Details
            </h3>
            <p className="text-xs text-gray-400">
              Activity type and classification
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Activity <span className="text-red-500">*</span>
            </label>
            <select
              value={form.activity}
              onChange={(e) => updateField('activity', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white ${errors.activity ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}>
              
              <option value="">Select activity</option>
              {ACTIVITY_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.activity &&
            <p className="text-xs text-red-500 mt-1">{errors.activity}</p>
            }
          </div>
          <AnimatePresence mode="wait">
            {subTypeOptions.length > 0 &&
            <motion.div
              key={form.activity}
              initial={{
                opacity: 0,
                x: 10
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -10
              }}>
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {subTypeLabel}
                </label>
                <select
                value={form.activitySubType}
                onChange={(e) =>
                updateField('activitySubType', e.target.value)
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
                
                  <option value="">Select type</option>
                  {subTypeOptions.map((o) =>
                <option key={o} value={o}>
                      {o}
                    </option>
                )}
                </select>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Venue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <MapPinIcon size={18} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Venue</h3>
            <p className="text-xs text-gray-400">
              Location of the meeting or activity
            </p>
          </div>
        </div>
        <div className="border-t border-green-100 mx-5 sm:mx-6" />
        <div className="p-5 sm:p-6 pt-4">
          <div className="max-w-lg">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Venue
            </label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => updateField('venue', e.target.value)}
              placeholder="Enter meeting/activity venue"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
            
          </div>
        </div>
      </div>

      {/* 4. Participant Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <UsersIcon size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Participant Details
            </h3>
            <p className="text-xs text-gray-400">
              Designations, agencies, and regions of participants
            </p>
          </div>
        </div>
        <div className="border-t border-purple-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <MultiSelect
            label="Participants Designation"
            options={DESIGNATION_OPTIONS}
            selected={form.designations}
            onChange={(v) => updateField('designations', v)}
            placeholder="Select participant designations..." />
          
          <MultiSelect
            label="Participants Agency"
            options={AGENCY_OPTIONS}
            selected={form.agencies}
            onChange={(v) => updateField('agencies', v)}
            placeholder="Search and select agencies..." />
          
          <MultiSelect
            label="Participants Region"
            options={REGION_OPTIONS}
            selected={form.regions}
            onChange={(v) => updateField('regions', v)}
            placeholder="Search and select regions..." />
          
        </div>
      </div>

      {/* 5. Supporting Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
            <ClipboardCheckIcon size={18} className="text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Supporting Documents
            </h3>
            <p className="text-xs text-gray-400">
              Upload approved scanned copies
            </p>
          </div>
        </div>
        <div className="border-t border-teal-100 mx-5 sm:mx-6" />
        <div className="p-5 sm:p-6 pt-4">
          <FileUploadField
            label="Approved Scanned Copy"
            fileName={form.scannedCopyDoc}
            onSelect={(name) => updateField('scannedCopyDoc', name)}
            onClear={() => updateField('scannedCopyDoc', '')}
            helperText="Upload the approved scanned copy of the meeting or activity document (PDF, JPG, JPEG, PNG)" />
          
        </div>
      </div>

      {/* 6. Highlights, Agreements, and Remarks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <MessageSquareIcon size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Highlights, Agreements, and Remarks
            </h3>
            <p className="text-xs text-gray-400">
              Key discussions, decisions, and additional notes
            </p>
          </div>
        </div>
        <div className="border-t border-amber-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Highlights and Agreements
            </label>
            <textarea
              rows={5}
              placeholder="Enter highlights, agreements, key decisions, and action points."
              value={form.highlights}
              onChange={(e) => updateField('highlights', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Enter any additional remarks or comments."
              value={form.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
        </div>
      </div>

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
          
          Submit
        </motion.button>
      </div>
    </div>);

}
function MeetingList({
  records,
  searchQuery,
  onSearch




}: {records: Meeting[];searchQuery: string;onSearch: (q: string) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<Meeting | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: Meeting): SectionDef[] {
    return [
    {
      title: 'Meeting Information',
      fields: [
      {
        label: 'Start Date',
        value: r.startDate
      },
      {
        label: 'End Date',
        value: r.endDate
      },
      {
        label: 'Office Code',
        value: r.officeCode
      },
      {
        label: 'Time',
        value: r.time || '—'
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
      title: 'Activity Details',
      fields: [
      {
        label: 'Activity',
        value: r.activity
      },
      ...(r.activitySubType ?
      [
      {
        label: 'Activity Sub-Type',
        value: r.activitySubType
      }] :

      []),
      {
        label: 'Venue',
        value: r.venue || '—'
      }]

    },
    {
      title: 'Participant Details',
      fields: [
      {
        label: 'Designations',
        value: r.designations.join(', ') || '—'
      },
      {
        label: 'Agencies',
        value: r.agencies.join(', ') || '—'
      },
      {
        label: 'Regions',
        value: r.regions.join(', ') || '—'
      }]

    },
    {
      title: 'Supporting Documents',
      fields: [
      {
        label: 'Approved Scanned Copy',
        value: r.scannedCopyDoc || '—'
      }]

    },
    {
      title: 'Highlights & Remarks',
      fields: [
      {
        label: 'Highlights and Agreements',
        value: r.highlights || '—'
      },
      {
        label: 'Remarks',
        value: r.remarks || '—'
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title={viewRecord?.activity || 'Meeting Details'}
        subtitle={
        viewRecord ? `${viewRecord.startDate} — ${viewRecord.officeCode}` : ''
        }
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
            placeholder="Search meetings..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Office Code
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Activity
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Venue
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
                  {r.startDate}
                </td>
                <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">
                  {r.officeCode}
                </td>
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors max-w-[220px] truncate">
                  {r.activity}
                </td>
                <td className="px-4 py-3.5 text-gray-600 max-w-[180px] truncate">
                  {r.venue}
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
                
                  No meeting records found
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
                {r.activity}
              </span>
              <span className="text-xs text-gray-400">{r.startDate}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-mono">
                {r.officeCode}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 truncate max-w-[150px]">
                {r.venue}
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
            No meeting records found
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