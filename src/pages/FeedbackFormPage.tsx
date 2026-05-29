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
  MessageSquareIcon,
  CheckCircleIcon,
  LinkIcon,
  PaperclipIcon,
  StarIcon,
  WrenchIcon,
  XIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const FEEDBACK_TYPES = ['Suggestion', 'Compliment', 'Concern', 'Inquiry'];
const DESIGNATION_OPTIONS = [
'Community Member',
'Barangay Official',
'Health Worker',
'NGO Representative',
'Government Staff',
'Others'];

const RATING_OPTIONS = [
{
  value: '1',
  label: '1 - Very Poor'
},
{
  value: '2',
  label: '2 - Poor'
},
{
  value: '3',
  label: '3 - Average'
},
{
  value: '4',
  label: '4 - Good'
},
{
  value: '5',
  label: '5 - Excellent'
}];

const STATUS_OPTIONS = ['Received', 'Under Review', 'Addressed', 'Closed'];
interface PffRecord {
  id: number;
  refNo: string;
  dateFeedback: string;
  province: string;
  municipality: string;
  barangay: string;
  isAnonymous: string;
  respondentName: string;
  contactNumber: string;
  designation: string;
  feedbackType: string;
  subject: string;
  description: string;
  rating: string;
  status: string;
  responseDetails: string;
  dateAddressed: string;
  responsiblePerson: string;
  documentLink: string;
  remarks: string;
}
const SEED_PFF: PffRecord[] = [
{
  id: 1,
  refNo: 'PFF-001',
  dateFeedback: '2026-03-14',
  province: 'Laguna',
  municipality: 'Santa Rosa',
  barangay: 'Balibago',
  isAnonymous: 'No',
  respondentName: 'Elena Cruz',
  contactNumber: '09171234567',
  designation: 'Community Member',
  feedbackType: 'Compliment',
  subject: 'Excellent Feeding Program',
  description:
  'The supplementary feeding program has greatly improved the nutrition status of children in our barangay.',
  rating: '5',
  status: 'Addressed',
  responseDetails:
  'Acknowledged and shared with the team as positive feedback.',
  dateAddressed: '2026-03-16',
  responsiblePerson: 'Maria Santos',
  documentLink: '',
  remarks: ''
},
{
  id: 2,
  refNo: 'PFF-002',
  dateFeedback: '2026-03-10',
  province: 'Batangas',
  municipality: 'Lipa',
  barangay: 'Sabang',
  isAnonymous: 'Yes',
  respondentName: '',
  contactNumber: '',
  designation: 'Health Worker',
  feedbackType: 'Suggestion',
  subject: 'Schedule Adjustment Request',
  description:
  'Suggest moving nutrition sessions to afternoon to accommodate working parents.',
  rating: '3',
  status: 'Under Review',
  responseDetails: '',
  dateAddressed: '',
  responsiblePerson: 'Juan Dela Cruz',
  documentLink: '',
  remarks: 'Forwarded to scheduling committee'
},
{
  id: 3,
  refNo: 'PFF-003',
  dateFeedback: '2026-03-05',
  province: 'Quezon',
  municipality: 'Lucena',
  barangay: 'Ibabang Dupay',
  isAnonymous: 'No',
  respondentName: 'Pedro Ramos',
  contactNumber: '09281234567',
  designation: 'Barangay Official',
  feedbackType: 'Concern',
  subject: 'Insufficient Supplies',
  description:
  'The nutrition supplies delivered last month were insufficient for the number of beneficiaries.',
  rating: '2',
  status: 'Received',
  responseDetails: '',
  dateAddressed: '',
  responsiblePerson: '',
  documentLink: '',
  remarks: ''
},
{
  id: 4,
  refNo: 'PFF-004',
  dateFeedback: '2026-02-28',
  province: 'Laguna',
  municipality: 'Calamba',
  barangay: 'Parian',
  isAnonymous: 'No',
  respondentName: 'Ana Reyes',
  contactNumber: '09351234567',
  designation: 'NGO Representative',
  feedbackType: 'Inquiry',
  subject: 'Partnership Opportunities',
  description:
  'Inquiring about potential partnership for nutrition education programs.',
  rating: '4',
  status: 'Closed',
  responseDetails:
  'Referred to partnership coordinator. Meeting scheduled for April.',
  dateAddressed: '2026-03-02',
  responsiblePerson: 'Dr. Liza Gomez',
  documentLink: '',
  remarks: ''
}];

function loadPff(): PffRecord[] {
  return storageGet<PffRecord[]>(KEYS.PFF, SEED_PFF);
}
function savePff(records: PffRecord[]) {
  storageSet(KEYS.PFF, records);
}
function StatusBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    Received: 'bg-blue-50 text-blue-700',
    'Under Review': 'bg-amber-50 text-amber-700',
    Addressed: 'bg-green-50 text-green-700',
    Closed: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
function FeedbackTypeBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    Suggestion: 'bg-blue-50 text-blue-700',
    Compliment: 'bg-green-50 text-green-700',
    Concern: 'bg-amber-50 text-amber-700',
    Inquiry: 'bg-purple-50 text-purple-700'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
function RatingBadge({ value }: {value: string;}) {
  const num = parseInt(value, 10) || 0;
  let color = 'bg-red-50 text-red-700';
  if (num >= 5) color = 'bg-green-50 text-green-700';else
  if (num >= 4) color = 'bg-blue-50 text-blue-700';else
  if (num >= 3) color = 'bg-amber-50 text-amber-700';else
  if (num >= 2) color = 'bg-orange-50 text-orange-700';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      
      <StarIcon size={11} className="fill-current" />
      {value}/5
    </span>);

}
export function FeedbackFormPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<PffRecord[]>(loadPff);
  const [viewRecord, setViewRecord] = useState<PffRecord | null>(null);
  const handleAdd = useCallback(
    (record: Omit<PffRecord, 'id' | 'refNo'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const newRecord: PffRecord = {
        ...record,
        id: nextId,
        refNo: `PFF-${String(nextId).padStart(3, '0')}`
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      savePff(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      savePff(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.feedbackType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Project Feedback Form
          </h1>
          <p className="text-sm text-gray-500">
            Collect and manage stakeholder feedback
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Feedback',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'PFF Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="pff-tab"
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
          
            <PffForm onSubmit={handleAdd} />
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
          
            <PffList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function PffForm({
  onSubmit


}: {onSubmit: (r: Omit<PffRecord, 'id' | 'refNo'>) => void;}) {
  const [form, setForm] = useState<Record<string, string>>({
    dateFeedback: '',
    province: '',
    municipality: '',
    barangay: '',
    isAnonymous: 'No',
    respondentName: '',
    contactNumber: '',
    designation: '',
    feedbackType: '',
    subject: '',
    description: '',
    rating: '',
    status: '',
    responseDetails: '',
    dateAddressed: '',
    responsiblePerson: '',
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
      if (field === 'isAnonymous' && value === 'Yes') {
        next.respondentName = '';
        next.contactNumber = '';
      }
      if (field === 'status' && value !== 'Addressed' && value !== 'Closed') {
        next.dateAddressed = '';
      }
      return next;
    });
  };
  const handleSubmit = () => {
    if (!form.dateFeedback || !form.feedbackType || !form.description) return;
    onSubmit(form as unknown as Omit<PffRecord, 'id' | 'refNo'>);
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
          Feedback record saved successfully!
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
            label="Date of Feedback"
            type="date"
            value={form.dateFeedback}
            onChange={(v) => update('dateFeedback', v)} />
          
          <FormField
            label="PFF Reference No."
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

      {/* 2. Respondent Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <UserIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Respondent Information
            </h3>
            <p className="text-xs text-gray-400">Identity and role details</p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Designation / Role
              </label>
              <select
                value={form.designation}
                onChange={(e) => update('designation', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
                
                <option value="">Select designation</option>
                {DESIGNATION_OPTIONS.map((d) =>
                <option key={d} value={d}>
                    {d}
                  </option>
                )}
              </select>
            </div>
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
              <FormField
              label="Name of Respondent"
              type="text"
              placeholder="Enter full name"
              value={form.respondentName}
              onChange={(v) => update('respondentName', v)} />
            
              <FormField
              label="Contact Number"
              type="text"
              placeholder="09XX-XXX-XXXX"
              value={form.contactNumber}
              onChange={(v) => update('contactNumber', v)} />
            
            </motion.div>
          }
        </div>
      </div>

      {/* 3. Feedback Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <MessageSquareIcon size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Feedback Details
            </h3>
            <p className="text-xs text-gray-400">
              Type, subject, and description
            </p>
          </div>
        </div>
        <div className="border-t border-purple-100 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Feedback Type
              </label>
              <select
                value={form.feedbackType}
                onChange={(e) => update('feedbackType', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
                
                <option value="">Select feedback type</option>
                {FEEDBACK_TYPES.map((t) =>
                <option key={t} value={t}>
                    {t}
                  </option>
                )}
              </select>
            </div>
            <FormField
              label="Subject"
              type="text"
              placeholder="Enter subject"
              value={form.subject}
              onChange={(v) => update('subject', v)} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Feedback Description
            </label>
            <textarea
              rows={4}
              placeholder="Provide detailed feedback..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Rating
            </label>
            <select
              value={form.rating}
              onChange={(e) => update('rating', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select rating</option>
              {RATING_OPTIONS.map((r) =>
              <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Response & Action */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <WrenchIcon size={18} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Response & Action
            </h3>
            <p className="text-xs text-gray-400">Status and response details</p>
          </div>
        </div>
        <div className="border-t border-green-100 mx-5 sm:mx-6" />
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
            <FormField
              label="Responsible Person"
              type="text"
              placeholder="Enter name"
              value={form.responsiblePerson}
              onChange={(v) => update('responsiblePerson', v)} />
            
          </div>
          {(form.status === 'Addressed' || form.status === 'Closed') &&
          <div className="max-w-xs">
              <FormField
              label="Date Addressed"
              type="date"
              value={form.dateAddressed}
              onChange={(v) => update('dateAddressed', v)} />
            
            </div>
          }
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Response Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe the response or action taken..."
              value={form.responseDetails}
              onChange={(e) => update('responseDetails', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
        </div>
      </div>

      {/* 5. Attachments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <PaperclipIcon size={18} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Attachments</h3>
            <p className="text-xs text-gray-400">
              Supporting documents and notes
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
          
          Submit Feedback
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
function PffList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: PffRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<PffRecord | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: PffRecord): SectionDef[] {
    const ratingLabel = r.rating ?
    {
      '1': 'Very Poor',
      '2': 'Poor',
      '3': 'Average',
      '4': 'Good',
      '5': 'Excellent'
    }[r.rating] || r.rating :
    '';
    return [
    {
      title: 'Basic Information',
      fields: [
      {
        label: 'PFF Reference No.',
        value: r.refNo
      },
      {
        label: 'Date of Feedback',
        value: r.dateFeedback
      },
      {
        label: 'Province',
        value: r.province
      },
      {
        label: 'Municipality / City',
        value: r.municipality
      },
      {
        label: 'Barangay',
        value: r.barangay
      }]

    },
    {
      title: 'Respondent Information',
      fields: [
      {
        label: 'Anonymous',
        value: r.isAnonymous,
        type: 'badge' as const,
        badgeColor:
        r.isAnonymous === 'Yes' ?
        'bg-amber-50 text-amber-700' :
        'bg-green-50 text-green-700'
      },
      ...(r.isAnonymous === 'No' ?
      [
      {
        label: 'Name',
        value: r.respondentName
      },
      {
        label: 'Contact Number',
        value: r.contactNumber
      }] :

      []),
      {
        label: 'Designation / Role',
        value: r.designation
      }]

    },
    {
      title: 'Feedback Details',
      fields: [
      {
        label: 'Feedback Type',
        value: r.feedbackType,
        type: 'badge' as const,
        badgeColor:
        r.feedbackType === 'Compliment' ?
        'bg-green-50 text-green-700' :
        r.feedbackType === 'Concern' ?
        'bg-amber-50 text-amber-700' :
        r.feedbackType === 'Inquiry' ?
        'bg-purple-50 text-purple-700' :
        'bg-blue-50 text-blue-700'
      },
      {
        label: 'Subject',
        value: r.subject
      },
      {
        label: 'Description',
        value: r.description
      },
      {
        label: 'Rating',
        value: r.rating ? `${r.rating}/5 - ${ratingLabel}` : '',
        type: 'badge' as const,
        badgeColor:
        Number(r.rating) >= 4 ?
        'bg-green-50 text-green-700' :
        Number(r.rating) >= 3 ?
        'bg-amber-50 text-amber-700' :
        'bg-red-50 text-red-700'
      }]

    },
    {
      title: 'Response & Action',
      fields: [
      {
        label: 'Status',
        value: r.status,
        type: 'badge' as const,
        badgeColor:
        r.status === 'Addressed' ?
        'bg-green-50 text-green-700' :
        r.status === 'Closed' ?
        'bg-gray-100 text-gray-600' :
        r.status === 'Under Review' ?
        'bg-amber-50 text-amber-700' :
        'bg-blue-50 text-blue-700'
      },
      {
        label: 'Response Details',
        value: r.responseDetails
      },
      {
        label: 'Date Addressed',
        value: r.dateAddressed
      },
      {
        label: 'Responsible Person',
        value: r.responsiblePerson
      }]

    },
    {
      title: 'Attachments',
      fields: [
      {
        label: 'Document Link',
        value: r.documentLink,
        type: 'link' as const
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
        title={viewRecord ? `Feedback ${viewRecord.refNo}` : 'Feedback Details'}
        subtitle={
        viewRecord ?
        `${viewRecord.feedbackType} • ${viewRecord.dateFeedback}` :
        ''
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
            placeholder="Search feedback..."
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
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Feedback Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
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
                <td className="px-4 py-3.5 text-gray-700">{r.dateFeedback}</td>
                <td className="px-4 py-3.5">
                  <FeedbackTypeBadge value={r.feedbackType} />
                </td>
                <td className="px-4 py-3.5">
                  {r.rating && <RatingBadge value={r.rating} />}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.status} />
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
                
                  No feedback records found
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
              <span className="text-xs text-gray-400">{r.dateFeedback}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
              {r.subject}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <FeedbackTypeBadge value={r.feedbackType} />
              {r.rating && <RatingBadge value={r.rating} />}
              <StatusBadge value={r.status} />
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
            No feedback records found
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