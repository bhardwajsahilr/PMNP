import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  FileTextIcon,
  CheckSquareIcon,
  StampIcon,
  ClipboardCheckIcon,
  UsersIcon,
  AwardIcon,
  UploadIcon,
  XIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  FileIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type RecordStatus = 'Draft' | 'Submitted' | 'For Checking' | 'Approved';
interface LnapRecord {
  id: number;
  reportingDate: string;
  reportingQuarter: string;
  bnapStatus: string;
  bnapStatusDoc: string | null;
  sixPointCriteria: string;
  sixPointDoc: string | null;
  sbResolution: string;
  sbResolutionDoc: string | null;
  aipInclusion: string;
  aipInclusionDoc: string | null;
  bncReorg: string;
  bncReorgDoc: string | null;
  sixPlusThree: number;
  sixPlusThreeDoc: string | null;
  status: RecordStatus;
}
const STATUS_OPTIONS = ['No BNAP', 'Under Development', 'Approved BNAP'];
const YES_NO_CHECK = ['Yes', 'No', 'For checking'];
const PAGE_SIZE = 8;
const SEED: LnapRecord[] = [
{
  id: 1,
  reportingDate: '2026-03-15',
  reportingQuarter: 'Q1',
  bnapStatus: 'Approved BNAP',
  bnapStatusDoc: 'BNAP-Approved-Q1-2026.pdf',
  sixPointCriteria: 'Yes',
  sixPointDoc: 'SixPoint-Criteria.pdf',
  sbResolution: 'Yes',
  sbResolutionDoc: 'SB-Resolution-2026.pdf',
  aipInclusion: 'Yes',
  aipInclusionDoc: 'AIP-Inclusion.pdf',
  bncReorg: 'Yes',
  bncReorgDoc: 'BNC-Reorg-Resolution.pdf',
  sixPlusThree: 1,
  sixPlusThreeDoc: 'SixPlusThree-Compliance.pdf',
  status: 'Approved'
},
{
  id: 2,
  reportingDate: '2026-05-08',
  reportingQuarter: 'Q2',
  bnapStatus: 'Under Development',
  bnapStatusDoc: null,
  sixPointCriteria: 'For checking',
  sixPointDoc: null,
  sbResolution: 'No',
  sbResolutionDoc: null,
  aipInclusion: 'For checking',
  aipInclusionDoc: null,
  bncReorg: 'Yes',
  bncReorgDoc: 'BNC-Reorg-Draft.pdf',
  sixPlusThree: 0,
  sixPlusThreeDoc: null,
  status: 'For Checking'
},
{
  id: 3,
  reportingDate: '2026-01-20',
  reportingQuarter: 'Q1',
  bnapStatus: 'No BNAP',
  bnapStatusDoc: null,
  sixPointCriteria: 'No',
  sixPointDoc: null,
  sbResolution: 'No',
  sbResolutionDoc: null,
  aipInclusion: 'No',
  aipInclusionDoc: null,
  bncReorg: 'No',
  bncReorgDoc: null,
  sixPlusThree: 0,
  sixPlusThreeDoc: null,
  status: 'Draft'
}];

const ALLOWED_EXT = /\.(pdf|doc|docx|jpg|jpeg|png)$/i;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
function computeQuarter(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const m = d.getMonth() + 1;
  if (m <= 3) return 'Q1';
  if (m <= 6) return 'Q2';
  if (m <= 9) return 'Q3';
  return 'Q4';
}
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function loadRecords(): LnapRecord[] {
  return storageGet<LnapRecord[]>(KEYS.LNAP, SEED);
}
function saveRecords(records: LnapRecord[]): void {
  storageSet(KEYS.LNAP, records);
}
/* ---------------- Status chips ---------------- */
function StatusPill({ status }: {status: RecordStatus;}) {
  const map: Record<RecordStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700 border border-gray-200',
    Submitted: 'bg-blue-50 text-blue-700 border border-blue-200',
    'For Checking': 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    Approved: 'bg-green-50 text-green-700 border border-green-200'
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      
      {status}
    </span>);

}
function BnapStatusBadge({ value }: {value: string;}) {
  if (!value) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  const cls =
  value === 'Approved BNAP' ?
  'bg-green-50 text-green-700 border border-green-200' :
  value === 'Under Development' ?
  'bg-yellow-50 text-yellow-800 border border-yellow-200' :
  'bg-red-50 text-red-700 border border-red-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      
      {value}
    </span>);

}
function YesNoBadge({ value }: {value: string;}) {
  if (!value) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  const cls =
  value === 'Yes' ?
  'bg-green-50 text-green-700 border border-green-200' :
  value === 'For checking' ?
  'bg-yellow-50 text-yellow-800 border border-yellow-200' :
  'bg-red-50 text-red-700 border border-red-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      
      {value}
    </span>);

}
function SixPlusThreeBadge({
  value,
  size = 'sm'



}: {value: number;size?: 'sm' | 'lg';}) {
  const cls =
  value === 1 ?
  'bg-green-100 text-green-800 border-green-200' :
  'bg-gray-100 text-gray-600 border-gray-200';
  if (size === 'lg') {
    return (
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-2xl border text-2xl font-bold ${cls}`}>
        
        {value}
      </div>);

  }
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border text-sm font-bold ${cls}`}>
      
      {value}
    </span>);

}
/* ---------------- File upload control ---------------- */
interface FileUploadProps {
  label: string;
  value: string | null;
  onChange: (filename: string | null) => void;
  error?: string;
}
function FileUpload({ label, value, onChange, error }: FileUploadProps) {
  const [localError, setLocalError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_EXT.test(file.name)) {
      setLocalError(
        'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG.'
      );
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setLocalError('File size exceeds 10 MB.');
      return;
    }
    onChange(file.name);
    if (inputRef.current) inputRef.current.value = '';
  };
  const displayError = error || localError;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {value ?
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileIcon className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm text-gray-800 truncate">{value}</span>
          </div>
          <button
          type="button"
          onClick={() => onChange(null)}
          className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Remove file">
          
            <XIcon className="w-4 h-4" />
          </button>
        </div> :

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-1 py-4 px-3 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
        
          <UploadIcon className="w-5 h-5" />
          <span className="text-sm">Click to upload document</span>
          <span className="text-xs text-gray-400">
            PDF, DOC, DOCX, JPG, PNG · Max 10 MB
          </span>
        </button>
      }
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleSelect}
        className="hidden" />
      
      {displayError &&
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertTriangleIcon className="w-3.5 h-3.5" /> {displayError}
        </p>
      }
    </div>);

}
/* ---------------- Reusable bits ---------------- */
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  headerBg: string;
  children: React.ReactNode;
}
function SectionCard({
  title,
  icon,
  iconBg,
  headerBg,
  children
}: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div
        className={`${headerBg} px-6 py-4 border-b border-gray-100 flex items-center rounded-t-2xl`}>
        
        <div className={`${iconBg} p-2 rounded-lg mr-3`}>{icon}</div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>);

}
function RequiredMark() {
  return <span className="text-red-500 ml-0.5">*</span>;
}
function InlineError({ msg }: {msg?: string;}) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <AlertTriangleIcon className="w-3.5 h-3.5" /> {msg}
    </p>);

}
/* ---------------- Page ---------------- */
const EMPTY_FORM = {
  reportingDate: '',
  bnapStatus: '',
  bnapStatusDoc: null as string | null,
  sixPointCriteria: '',
  sixPointDoc: null as string | null,
  sbResolution: '',
  sbResolutionDoc: null as string | null,
  aipInclusion: '',
  aipInclusionDoc: null as string | null,
  bncReorg: '',
  bncReorgDoc: null as string | null,
  sixPlusThreeDoc: null as string | null
};
export function LnapPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<LnapRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formStatus, setFormStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');
  const [summaryOpen, setSummaryOpen] = useState(true);
  // list view state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<LnapRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  const reportingQuarter = useMemo(
    () => computeQuarter(form.reportingDate),
    [form.reportingDate]
  );
  const sixPlusThree = useMemo(() => {
    const all =
    form.sixPointCriteria === 'Yes' &&
    form.sbResolution === 'Yes' &&
    form.aipInclusion === 'Yes' &&
    form.bncReorg === 'Yes';
    return all ? 1 : 0;
  }, [
  form.sixPointCriteria,
  form.sbResolution,
  form.aipInclusion,
  form.bncReorg]
  );
  // Clear conditional docs when their parent flips away from "Yes" / 6+3 != 1
  useEffect(() => {
    if (form.sixPointCriteria !== 'Yes' && form.sixPointDoc) {
      setForm((f) => ({
        ...f,
        sixPointDoc: null
      }));
    }
  }, [form.sixPointCriteria, form.sixPointDoc]);
  useEffect(() => {
    if (form.sbResolution !== 'Yes' && form.sbResolutionDoc) {
      setForm((f) => ({
        ...f,
        sbResolutionDoc: null
      }));
    }
  }, [form.sbResolution, form.sbResolutionDoc]);
  useEffect(() => {
    if (form.aipInclusion !== 'Yes' && form.aipInclusionDoc) {
      setForm((f) => ({
        ...f,
        aipInclusionDoc: null
      }));
    }
  }, [form.aipInclusion, form.aipInclusionDoc]);
  useEffect(() => {
    if (form.bncReorg !== 'Yes' && form.bncReorgDoc) {
      setForm((f) => ({
        ...f,
        bncReorgDoc: null
      }));
    }
  }, [form.bncReorg, form.bncReorgDoc]);
  useEffect(() => {
    if (sixPlusThree !== 1 && form.sixPlusThreeDoc) {
      setForm((f) => ({
        ...f,
        sixPlusThreeDoc: null
      }));
    }
  }, [sixPlusThree, form.sixPlusThreeDoc]);
  const update = useCallback(
    <K extends keyof typeof EMPTY_FORM,>(
    key: K,
    val: (typeof EMPTY_FORM)[K]) =>
    {
      setForm((f) => ({
        ...f,
        [key]: val
      }));
      setErrors((e) => {
        if (!e[key as string]) return e;
        const next = {
          ...e
        };
        delete next[key as string];
        return next;
      });
    },
    []
  );
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.reportingDate) {
      e.reportingDate = 'Reporting date is required.';
    } else if (form.reportingDate > todayISO()) {
      e.reportingDate = 'Reporting date cannot be in the future.';
    }
    if (!form.bnapStatus) e.bnapStatus = 'BNAP status is required.';
    if (!form.sixPointCriteria) e.sixPointCriteria = 'This field is required.';
    if (!form.sbResolution) e.sbResolution = 'This field is required.';
    if (!form.aipInclusion) e.aipInclusion = 'This field is required.';
    if (!form.bncReorg) e.bncReorg = 'This field is required.';
    return e;
  };
  const buildRecord = (status: RecordStatus): LnapRecord => ({
    id: Date.now(),
    reportingDate: form.reportingDate,
    reportingQuarter,
    bnapStatus: form.bnapStatus,
    bnapStatusDoc: form.bnapStatusDoc,
    sixPointCriteria: form.sixPointCriteria,
    sixPointDoc: form.sixPointCriteria === 'Yes' ? form.sixPointDoc : null,
    sbResolution: form.sbResolution,
    sbResolutionDoc: form.sbResolution === 'Yes' ? form.sbResolutionDoc : null,
    aipInclusion: form.aipInclusion,
    aipInclusionDoc: form.aipInclusion === 'Yes' ? form.aipInclusionDoc : null,
    bncReorg: form.bncReorg,
    bncReorgDoc: form.bncReorg === 'Yes' ? form.bncReorgDoc : null,
    sixPlusThree,
    sixPlusThreeDoc: sixPlusThree === 1 ? form.sixPlusThreeDoc : null,
    status
  });
  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormStatus('Draft');
    setNotification('');
  };
  const handleSaveDraft = () => {
    // Drafts skip required-field validation, but still enforce the future-date rule.
    const e: Record<string, string> = {};
    if (form.reportingDate && form.reportingDate > todayISO()) {
      e.reportingDate = 'Reporting date cannot be in the future.';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const rec = buildRecord('Draft');
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('BNAP Status Form draft saved successfully.');
    handleReset();
  };
  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(e)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el)
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    const rec = buildRecord('Submitted');
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('BNAP Status Form submitted successfully.');
    handleReset();
  };
  /* ---------------- Summary panel ---------------- */
  const SummaryContent = () =>
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Live Summary
      </h4>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Reporting Quarter</span>
          {reportingQuarter ?
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {reportingQuarter}
            </span> :

        <span className="text-gray-400 text-xs">—</span>
        }
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">BNAP Status</span>
          <BnapStatusBadge value={form.bnapStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">6-Point Criteria</span>
          <YesNoBadge value={form.sixPointCriteria} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">SB Resolution</span>
          <YesNoBadge value={form.sbResolution} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">AIP Inclusion</span>
          <YesNoBadge value={form.aipInclusion} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">BNC Reorganization</span>
          <YesNoBadge value={form.bncReorg} />
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-sm font-semibold text-gray-900">
              6+3 Criteria
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              {sixPlusThree === 1 ? 'All gates met' : 'Not all gates met'}
            </span>
          </div>
          <SixPlusThreeBadge value={sixPlusThree} size="lg" />
        </div>
      </div>
    </div>;

  /* ---------------- List view derived ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.reportingDate.toLowerCase().includes(q) ||
      r.reportingQuarter.toLowerCase().includes(q) ||
      r.bnapStatus.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }, [records, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRecords = filtered.slice(
    (pageSafe - 1) * PAGE_SIZE,
    pageSafe * PAGE_SIZE
  );
  useEffect(() => {
    setPage(1);
  }, [search]);
  /* ---------------- View modal sections ---------------- */
  const viewSections: SectionDef[] = viewing ?
  [
  {
    title: 'Reporting Period',
    fields: [
    {
      label: 'Reporting Date',
      value: viewing.reportingDate
    },
    {
      label: 'Reporting Quarter',
      value: viewing.reportingQuarter
    }]

  },
  {
    title: 'BNAP Status',
    fields: [
    {
      label: 'Status',
      value: viewing.bnapStatus
    },
    {
      label: 'Supporting Document',
      value: viewing.bnapStatusDoc || ''
    }]

  },
  {
    title: '6-Point Criteria',
    fields: [
    {
      label: 'Follows 6-point criteria?',
      value: viewing.sixPointCriteria
    },
    {
      label: 'Document',
      value: viewing.sixPointDoc || ''
    }]

  },
  {
    title: 'SB Resolution on BNAP Approval',
    fields: [
    {
      label: 'SB Resolution',
      value: viewing.sbResolution
    },
    {
      label: 'Document',
      value: viewing.sbResolutionDoc || ''
    }]

  },
  {
    title: 'Inclusion of BNAP PPAs in AIP',
    fields: [
    {
      label: 'AIP Inclusion',
      value: viewing.aipInclusion
    },
    {
      label: 'Document',
      value: viewing.aipInclusionDoc || ''
    }]

  },
  {
    title: 'BNC Reorganization',
    fields: [
    {
      label: 'Resolution / Ordinance',
      value: viewing.bncReorg
    },
    {
      label: 'Document',
      value: viewing.bncReorgDoc || ''
    }]

  },
  {
    title: '6+3 Criteria',
    fields: [
    {
      label: 'Score',
      value: String(viewing.sixPlusThree)
    },
    {
      label: 'Scanned Document',
      value: viewing.sixPlusThreeDoc || ''
    }]

  },
  {
    title: 'Record Status',
    fields: [
    {
      label: 'Status',
      value: viewing.status
    }]

  }] :

  [];
  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>PMNP</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span>LNAP</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">
                BNAP Status Form
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              BNAP Status Form
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Local Nutrition Action Plan Module – Barangay Nutrition Action
              Plan Status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Form status:</span>
            <StatusPill status={formStatus} />
          </div>
        </div>

        {/* Inline banner */}
        <AnimatePresence>
          {notification &&
          <motion.div
            initial={{
              opacity: 0,
              y: -10
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
            }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            
              <CircleCheckBigIcon className="w-5 h-5 text-green-600 mr-3 shrink-0" />
              <span className="text-sm text-green-800 font-medium">
                {notification}
              </span>
            </motion.div>
          }
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200/60 p-1 rounded-xl w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'BNAP Status Form'
          },
          {
            key: 'list' as Tab,
            label: 'Records'
          }].
          map((t) =>
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === t.key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === t.key &&
            <motion.div
              layoutId="lnap-tab"
              className="absolute inset-0 bg-white shadow-sm rounded-lg"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />

            }
              <span className="relative">{t.label}</span>
            </button>
          )}
        </div>

        {/* Form tab */}
        {activeTab === 'form' &&
        <div className="space-y-6">
            {/* Form column */}
            <div className="space-y-6">
              {/* 1. Reporting Period */}
              <SectionCard
              title="Reporting Period"
              icon={<CalendarIcon className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-100"
              headerBg="bg-blue-50/60">
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div id="field-reportingDate">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      BNAP Status Reporting Date
                      <RequiredMark />
                    </label>
                    <input
                    type="date"
                    value={form.reportingDate}
                    max={todayISO()}
                    onChange={(e) => update('reportingDate', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.reportingDate ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    <InlineError msg={errors.reportingDate} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Reporting Quarter
                      <RequiredMark />
                    </label>
                    <div className="h-[42px] flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl">
                      {reportingQuarter ?
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reportingQuarter}
                        </span> :

                    <span className="text-gray-400 text-sm">
                          Select a date
                        </span>
                    }
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 2. BNAP Status */}
              <SectionCard
              title="BNAP Status"
              icon={<FileTextIcon className="w-5 h-5 text-orange-600" />}
              iconBg="bg-orange-100"
              headerBg="bg-orange-50/60">
              
                <div className="space-y-5">
                  <div id="field-bnapStatus">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      BNAP Status
                      <RequiredMark />
                    </label>
                    <select
                    value={form.bnapStatus}
                    onChange={(e) => update('bnapStatus', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.bnapStatus ? 'border-red-300' : 'border-gray-200'}`}>
                    
                      <option value="">Select status</option>
                      {STATUS_OPTIONS.map((opt) =>
                    <option key={opt} value={opt}>
                          {opt}
                        </option>
                    )}
                    </select>
                    <InlineError msg={errors.bnapStatus} />
                  </div>
                  <FileUpload
                  label="BNAP Status – Document (optional)"
                  value={form.bnapStatusDoc}
                  onChange={(v) => update('bnapStatusDoc', v)} />
                
                </div>
              </SectionCard>

              {/* 3. 6-Point Criteria */}
              <SectionCard
              title="6-Point Criteria"
              icon={<CheckSquareIcon className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-100"
              headerBg="bg-green-50/60">
              
                <div id="field-sixPointCriteria">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Follows the 6-point criteria?
                    <RequiredMark />
                  </label>
                  <select
                  value={form.sixPointCriteria}
                  onChange={(e) => update('sixPointCriteria', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.sixPointCriteria ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select an option</option>
                    {YES_NO_CHECK.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                  <InlineError msg={errors.sixPointCriteria} />
                </div>
                <AnimatePresence initial={false}>
                  {form.sixPointCriteria === 'Yes' &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="overflow-hidden">
                  
                      <div className="pt-5">
                        <FileUpload
                      label="6-Point Criteria – Document"
                      value={form.sixPointDoc}
                      onChange={(v) => update('sixPointDoc', v)} />
                    
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </SectionCard>

              {/* 4. SB Resolution */}
              <SectionCard
              title="SB Resolution on BNAP Approval"
              icon={<StampIcon className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-100"
              headerBg="bg-purple-50/60">
              
                <div id="field-sbResolution">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    SB Resolution on BNAP Approval
                    <RequiredMark />
                  </label>
                  <select
                  value={form.sbResolution}
                  onChange={(e) => update('sbResolution', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.sbResolution ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select an option</option>
                    {YES_NO_CHECK.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                  <InlineError msg={errors.sbResolution} />
                </div>
                <AnimatePresence initial={false}>
                  {form.sbResolution === 'Yes' &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="overflow-hidden">
                  
                      <div className="pt-5">
                        <FileUpload
                      label="SB Resolution on BNAP Approval – Document"
                      value={form.sbResolutionDoc}
                      onChange={(v) => update('sbResolutionDoc', v)} />
                    
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </SectionCard>

              {/* 5. AIP Inclusion */}
              <SectionCard
              title="Inclusion of BNAP PPAs in AIP"
              icon={<ClipboardCheckIcon className="w-5 h-5 text-teal-600" />}
              iconBg="bg-teal-100"
              headerBg="bg-teal-50/60">
              
                <div id="field-aipInclusion">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Inclusion of BNAP PPAs in AIP
                    <RequiredMark />
                  </label>
                  <select
                  value={form.aipInclusion}
                  onChange={(e) => update('aipInclusion', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.aipInclusion ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select an option</option>
                    {YES_NO_CHECK.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                  <InlineError msg={errors.aipInclusion} />
                </div>
                <AnimatePresence initial={false}>
                  {form.aipInclusion === 'Yes' &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="overflow-hidden">
                  
                      <div className="pt-5">
                        <FileUpload
                      label="Inclusion of BNAP PPAs in AIP – Document"
                      value={form.aipInclusionDoc}
                      onChange={(v) => update('aipInclusionDoc', v)} />
                    
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </SectionCard>

              {/* 6. BNC Reorganization */}
              <SectionCard
              title="BNC Reorganization / Organization"
              icon={<UsersIcon className="w-5 h-5 text-indigo-600" />}
              iconBg="bg-indigo-100"
              headerBg="bg-indigo-50/60">
              
                <div id="field-bncReorg">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Resolution or Ordinance on BNC Reorganization / Organization
                    <RequiredMark />
                  </label>
                  <select
                  value={form.bncReorg}
                  onChange={(e) => update('bncReorg', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.bncReorg ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select an option</option>
                    {YES_NO_CHECK.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                  <InlineError msg={errors.bncReorg} />
                </div>
                <AnimatePresence initial={false}>
                  {form.bncReorg === 'Yes' &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="overflow-hidden">
                  
                      <div className="pt-5">
                        <FileUpload
                      label="Resolution on BNC Reorganization – Document"
                      value={form.bncReorgDoc}
                      onChange={(v) => update('bncReorgDoc', v)} />
                    
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </SectionCard>

              {/* 7. 6+3 Criteria Result */}
              <SectionCard
              title="6+3 Criteria Result"
              icon={<AwardIcon className="w-5 h-5 text-yellow-600" />}
              iconBg="bg-yellow-100"
              headerBg="bg-yellow-50/60">
              
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-gray-700">
                    6+3 Criteria Score
                  </p>
                  <SixPlusThreeBadge value={sixPlusThree} size="lg" />
                </div>
                <AnimatePresence initial={false}>
                  {sixPlusThree === 1 &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="overflow-hidden">
                  
                      <div className="pt-5 mt-5 border-t border-gray-100">
                        <FileUpload
                      label="Scanned Document with 6+3 Criteria"
                      value={form.sixPlusThreeDoc}
                      onChange={(v) => update('sixPlusThreeDoc', v)} />
                    
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </SectionCard>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium">
                
                  <RotateCcwIcon className="w-4 h-4 mr-1.5" />
                  Reset form
                </button>
                <div className="flex gap-3">
                  <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  
                    <SaveIcon className="w-4 h-4 mr-2" /> Save Draft
                  </button>
                  <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#F68E22] hover:bg-[#e07d10] text-white text-sm font-medium transition-colors shadow-sm">
                  
                    <SendIcon className="w-4 h-4 mr-2" /> Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        {/* List tab */}
        {activeTab === 'list' &&
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                BNAP Records
              </h3>
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporting Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quarter
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BNAP Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      6+3 Score
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageRecords.map((r) =>
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/60 transition-colors">
                  
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.reportingDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.reportingQuarter}
                      </td>
                      <td className="px-6 py-4">
                        <BnapStatusBadge value={r.bnapStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <SixPlusThreeBadge value={r.sixPlusThree} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                      type="button"
                      onClick={() => setViewing(r)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      aria-label="View record">
                      
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                )}
                  {pageRecords.length === 0 &&
                <tr>
                      <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500">
                    
                        No records found.
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {pageRecords.map((r) =>
            <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {r.reportingDate}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Quarter {r.reportingQuarter}
                      </p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <BnapStatusBadge value={r.bnapStatus} />
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      6+3: <SixPlusThreeBadge value={r.sixPlusThree} />
                    </span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                  type="button"
                  onClick={() => setViewing(r)}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                  
                      <EyeIcon className="w-4 h-4 mr-1.5" /> View
                    </button>
                  </div>
                </div>
            )}
              {pageRecords.length === 0 &&
            <div className="p-8 text-center text-sm text-gray-500">
                  No records found.
                </div>
            }
            </div>

            {/* Pagination */}
            {filtered.length > PAGE_SIZE &&
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Page {pageSafe} of {totalPages} · {filtered.length} record
                  {filtered.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                  <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page">
                
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page">
                
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
          }
          </div>
        }
      </div>

      <ViewModal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        title="BNAP Status Record"
        subtitle={viewing ? `Reporting date: ${viewing.reportingDate}` : ''}
        sections={viewSections} />
      
    </div>);

}