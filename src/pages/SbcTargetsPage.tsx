import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  HomeIcon,
  MegaphoneIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  PercentIcon,
  TargetIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type RecordStatus = 'Draft' | 'Submitted' | 'For Review' | 'Approved';
interface TargetField {
  key: string;
  label: string;
  meta: string;
  helper?: string;
}
interface Subsection {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  headerBg: string;
  fields: TargetField[];
}
const SUBSECTIONS: Subsection[] = [
{
  id: 'household',
  title: 'Household Knowledge, Confidence, and Behavior Targets',
  icon: <HomeIcon className="w-5 h-5 text-blue-600" />,
  iconBg: 'bg-blue-100',
  headerBg: 'bg-blue-50/60',
  fields: [
  {
    key: 't_io11',
    meta: 'SBC_RF_Targets #2 IO1.1',
    label:
    'Target % of households in participating barangays with increased knowledge related to nutrition behaviors and services from baseline'
  },
  {
    key: 't_io12',
    meta: 'SBC_RF_Targets #3 IO1.2',
    label:
    'Target % of households in participating barangays with increased confidence in applying knowledge related to nutrition behaviors and services from baseline'
  },
  {
    key: 't_io13',
    meta: 'SBC_RF_Targets #4 IO1.3',
    label:
    'Target % of households in participating barangays with increased behavior change related to nutrition behaviors and services from baseline'
  },
  {
    key: 't_mo2',
    meta: 'SBC_RF_Targets #9 MO2',
    label:
    'Target % of households in participating barangays with increased service satisfaction related to nutrition behaviors and services from baseline'
  }]

},
{
  id: 'sbc-sessions',
  title: 'SBC Session and Campaign Targets',
  icon: <MegaphoneIcon className="w-5 h-5 text-orange-600" />,
  iconBg: 'bg-orange-100',
  headerBg: 'bg-orange-50/60',
  fields: [
  {
    key: 't_o1a1',
    meta: 'SBC_RF_Targets #5 O1A.1',
    label:
    'Target % of municipal local government units (LGUs) with at least one mass media nutrition campaign'
  },
  {
    key: 't_o1a2',
    meta: 'SBC_RF_Targets #6 O1A.2',
    label:
    'Target % of households with parent/caregiver of children under 5 who attended at least one SBC session on nutrition in the last 3 months'
  },
  {
    key: 't_o1a3',
    meta: 'SBC_RF_Targets #7 O1A.3',
    label:
    'Target % of IP households with parent/caregiver of children under 5 who attended at least one SBC session on nutrition in the last 3 months'
  },
  {
    key: 't_o1b',
    meta: 'SBC_RF_Targets #8 O1B',
    label:
    'Target % of municipalities with local partners actively participating in nutrition action for adoption of recommended behaviours or abandonment of harmful behaviours'
  }]

},
{
  id: 'lnap-policy',
  title: 'LNAP, Participation, and Policy Targets',
  icon: <ClipboardListIcon className="w-5 h-5 text-purple-600" />,
  iconBg: 'bg-purple-100',
  headerBg: 'bg-purple-50/60',
  fields: [
  {
    key: 't_io2a1',
    meta: 'SBC_RF_Targets #10 IO2A.1',
    label:
    'Target % of municipalities with functioning mechanisms for community participation in local decision making processes'
  },
  {
    key: 't_io2a2',
    meta: 'SBC_RF_Targets #11 IO2A.2',
    label:
    'Target % of municipalities with evidence-based multi-sectoral LNAPs that have SBC components and approved budget for 2026'
  },
  {
    key: 't_io2a3',
    meta: 'SBC_RF_Targets #12 IO2A.3',
    label:
    'Target % of municipalities with evidence-based multi-sectoral LNAPs that have SBC components and allocated and expended budget for 2026'
  },
  {
    key: 't_io2b',
    meta: 'SBC_RF_Targets #14 IO2B',
    label:
    'Target % of municipalities in which SBC/Nutrition Standard Operating Procedures (SOPs) have been adopted/adapted into local policies'
  },
  {
    key: 't_oa1',
    meta: 'SBC_RF_Targets #15 OA.1',
    label: 'Target % of municipalities with approved SBC plans'
  }]

},
{
  id: 'capacity',
  title: 'Capacity Building, Feedback, and PMNP Information System Targets',
  icon: <TrendingUpIcon className="w-5 h-5 text-green-600" />,
  iconBg: 'bg-green-100',
  headerBg: 'bg-green-50/60',
  fields: [
  {
    key: 't_o2a2',
    meta: 'SBC_RF_Targets #16 O2A.2',
    label:
    'Target % of municipalities trained on SBC planning and implementation'
  },
  {
    key: 't_o2b1',
    meta: 'SBC_RF_Targets #17 O2B.1',
    label:
    'Target % of municipalities with at least 50% of Healthcare Workers (HCWs) trained on the PMNP Information System'
  },
  {
    key: 't_o2b2',
    meta: 'SBC_RF_Targets #18 O2B.2',
    label:
    'Target % of municipalities with feedback on SBC and nutrition services and interventions documented through established feedback mechanisms'
  },
  {
    key: 't_o2b3',
    meta: 'SBC_RF_Targets #19 O2B.3',
    label:
    'Target % of municipalities with Project Implementation Reviews that utilized data from the PMNP Information System'
  }]

}];

const ALL_FIELDS: TargetField[] = SUBSECTIONS.flatMap((s) => s.fields);
const TOTAL_TARGETS = ALL_FIELDS.length; // 17
const PAGE_SIZE = 8;
type Targets = Record<string, string>;
interface SbcRecord {
  id: number;
  reportDate: string;
  status: RecordStatus;
  targets: Targets;
}
function emptyTargets(): Targets {
  const t: Targets = {};
  ALL_FIELDS.forEach((f) => {
    t[f.key] = '';
  });
  return t;
}
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function seedRecord(
id: number,
date: string,
status: RecordStatus,
values: Partial<Record<string, number>>)
: SbcRecord {
  const targets = emptyTargets();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== undefined) targets[k] = String(v);
  });
  return {
    id,
    reportDate: date,
    status,
    targets
  };
}
const SEED: SbcRecord[] = [
seedRecord(1, '2026-03-15', 'Approved', {
  t_mo1: 85,
  t_io11: 75,
  t_io12: 70,
  t_io13: 65,
  t_o1a1: 90,
  t_o1a2: 80,
  t_o1a3: 60,
  t_o1b: 70,
  t_mo2: 78,
  t_io2a1: 95,
  t_io2a2: 100,
  t_io2a3: 90,
  t_io2a4: 95,
  t_io2b: 80,
  t_oa1: 100,
  t_o2a2: 95,
  t_o2b1: 60,
  t_o2b2: 75,
  t_o2b3: 85
}),
seedRecord(2, '2026-06-30', 'Submitted', {
  t_mo1: 70,
  t_io11: 55,
  t_io12: 50,
  t_io13: 45,
  t_o1a1: 80,
  t_o1a2: 65,
  t_o1a3: 40,
  t_o1b: 60,
  t_mo2: 62,
  t_io2a1: 85,
  t_io2a2: 90,
  t_io2a3: 70,
  t_io2a4: 80,
  t_io2b: 65,
  t_oa1: 90,
  t_o2a2: 75,
  t_o2b1: 45,
  t_o2b2: 60,
  t_o2b3: 70
})];

function loadRecords(): SbcRecord[] {
  return storageGet<SbcRecord[]>(KEYS.SBC_TARGETS, SEED);
}
function saveRecords(records: SbcRecord[]): void {
  storageSet(KEYS.SBC_TARGETS, records);
}
/* ---------------- Badges ---------------- */
function StatusPill({ status }: {status: RecordStatus;}) {
  const map: Record<RecordStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700 border-gray-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    'For Review': 'bg-yellow-50 text-yellow-800 border-yellow-200',
    Approved: 'bg-green-50 text-green-700 border-green-200'
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
      
      {status}
    </span>);

}
function CompletionBadge({
  completed,
  total



}: {completed: number;total: number;}) {
  const isFull = completed === total;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isFull ? 'bg-green-50 text-green-700 border-green-200' : completed === 0 ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}>
      
      {completed}/{total}
    </span>);

}
/* ---------------- Reusable ---------------- */
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
interface PercentInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hasValue: boolean;
}
function PercentInput({
  id,
  value,
  onChange,
  error,
  hasValue
}: PercentInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        max={100}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className={`w-full pl-4 pr-9 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${error ? 'border-red-300' : hasValue ? 'border-green-300' : 'border-gray-200'}`} />
      
      <PercentIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>);

}
/* ---------------- Page ---------------- */
export function SbcTargetsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<SbcRecord[]>([]);
  const [reportDate, setReportDate] = useState<string>('');
  const [targets, setTargets] = useState<Targets>(() => emptyTargets());
  const [formStatus, setFormStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const map: Record<string, boolean> = {};
      SUBSECTIONS.forEach((s) => {
        map[s.id] = true;
      });
      return map;
    }
  );
  // list view state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<SbcRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  /* ---------------- Derived ---------------- */
  const completedCount = useMemo(
    () =>
    ALL_FIELDS.filter(
      (f) => targets[f.key] !== '' && targets[f.key] !== undefined
    ).length,
    [targets]
  );
  const missingCount = TOTAL_TARGETS - completedCount;
  const numericValues = useMemo(() => {
    return ALL_FIELDS.map((f) => parseFloat(targets[f.key])).filter(
      (n) => !isNaN(n)
    );
  }, [targets]);
  const avgPct = numericValues.length ?
  numericValues.reduce((a, b) => a + b, 0) / numericValues.length :
  null;
  const maxPct = numericValues.length ? Math.max(...numericValues) : null;
  const minPct = numericValues.length ? Math.min(...numericValues) : null;
  const completionPct = Math.round(completedCount / TOTAL_TARGETS * 100);
  function subsectionCompletion(sub: Subsection) {
    const filled = sub.fields.filter((f) => targets[f.key] !== '').length;
    return {
      filled,
      total: sub.fields.length
    };
  }
  /* ---------------- Handlers ---------------- */
  const updateTarget = useCallback((key: string, val: string) => {
    setTargets((t) => ({
      ...t,
      [key]: val
    }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = {
        ...e
      };
      delete next[key];
      return next;
    });
  }, []);
  const updateDate = (val: string) => {
    setReportDate(val);
    setErrors((e) => {
      if (!e.reportDate) return e;
      const next = {
        ...e
      };
      delete next.reportDate;
      return next;
    });
  };
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!reportDate) {
      e.reportDate = 'Report date is required.';
    } else if (reportDate > todayISO()) {
      e.reportDate = 'Report date cannot be in the future.';
    }
    ALL_FIELDS.forEach((f) => {
      const v = targets[f.key];
      if (v === '' || v === undefined) {
        e[f.key] = 'Required.';
        return;
      }
      const n = parseFloat(v);
      if (isNaN(n)) {
        e[f.key] = 'Must be a number.';
      } else if (n < 0 || n > 100) {
        e[f.key] = 'Must be between 0 and 100.';
      }
    });
    return e;
  };
  const validateLoose = (): Record<string, string> => {
    // Draft: skip required but enforce range + date
    const e: Record<string, string> = {};
    if (reportDate && reportDate > todayISO()) {
      e.reportDate = 'Report date cannot be in the future.';
    }
    ALL_FIELDS.forEach((f) => {
      const v = targets[f.key];
      if (v === '' || v === undefined) return;
      const n = parseFloat(v);
      if (isNaN(n)) {
        e[f.key] = 'Must be a number.';
      } else if (n < 0 || n > 100) {
        e[f.key] = 'Must be between 0 and 100.';
      }
    });
    return e;
  };
  const handleReset = () => {
    setReportDate('');
    setTargets(emptyTargets());
    setErrors({});
    setFormStatus('Draft');
    setNotification('');
  };
  const scrollToError = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const id =
    firstKey === 'reportDate' ? 'field-reportDate' : `field-${firstKey}`;
    const el = document.getElementById(id);
    if (el)
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    // expand the subsection containing this field
    const sub = SUBSECTIONS.find((s) =>
    s.fields.some((f) => f.key === firstKey)
    );
    if (sub)
    setOpenSections((o) => ({
      ...o,
      [sub.id]: true
    }));
  };
  const handleSaveDraft = () => {
    const e = validateLoose();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec: SbcRecord = {
      id: Date.now(),
      reportDate,
      status: 'Draft',
      targets: {
        ...targets
      }
    };
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('SBC Target Form draft saved successfully.');
    handleReset();
  };
  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec: SbcRecord = {
      id: Date.now(),
      reportDate,
      status: 'Submitted',
      targets: {
        ...targets
      }
    };
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('SBC Target Form submitted successfully.');
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
          <span className="text-sm text-gray-600">Report Date</span>
          {reportDate ?
        <span className="text-sm font-medium text-gray-900">
              {reportDate}
            </span> :

        <span className="text-gray-400 text-xs">—</span>
        }
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total indicators</span>
          <span className="text-sm font-medium text-gray-900">
            {TOTAL_TARGETS}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Completed</span>
          <CompletionBadge completed={completedCount} total={TOTAL_TARGETS} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Missing required</span>
          <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${missingCount === 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          
            {missingCount}
          </span>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Completion progress
          </span>
          <span className="text-xs font-semibold text-gray-700">
            {completionPct}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
          className="h-full bg-[#F68E22]"
          initial={{
            width: 0
          }}
          animate={{
            width: `${completionPct}%`
          }}
          transition={{
            duration: 0.4
          }} />
        
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Average target</span>
          <span className="text-sm font-semibold text-gray-900">
            {avgPct !== null ? `${avgPct.toFixed(1)}%` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Highest target</span>
          <span className="text-sm font-semibold text-green-700">
            {maxPct !== null ? `${maxPct.toFixed(1)}%` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lowest target</span>
          <span className="text-sm font-semibold text-red-700">
            {minPct !== null ? `${minPct.toFixed(1)}%` : '—'}
          </span>
        </div>
      </div>
    </div>;

  /* ---------------- List view derived ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.reportDate.toLowerCase().includes(q) ||
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
  const viewSections: SectionDef[] = useMemo(() => {
    if (!viewing) return [];
    const sections: SectionDef[] = [
    {
      title: 'Report Information',
      fields: [
      {
        label: 'Report Date',
        value: viewing.reportDate
      },
      {
        label: 'Status',
        value: viewing.status
      }]

    }];

    SUBSECTIONS.forEach((sub) => {
      sections.push({
        title: sub.title,
        fields: sub.fields.map((f) => ({
          label: f.label,
          value: viewing.targets[f.key] ? `${viewing.targets[f.key]}%` : ''
        }))
      });
    });
    return sections;
  }, [viewing]);
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
              <span>SBC</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">SBC Target Form</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              SBC Target Form
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              SBC Results Framework - Targets
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
            label: 'SBC Target Form'
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
              layoutId="sbc-tab"
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
              {/* Report Date card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-blue-50/60 px-6 py-4 border-b border-gray-100 flex items-center rounded-t-2xl">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Report Information
                  </h3>
                </div>
                <div className="p-6">
                  <div id="field-reportDate" className="max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Report Date
                      <RequiredMark />
                    </label>
                    <input
                    type="date"
                    value={reportDate}
                    max={todayISO()}
                    onChange={(e) => updateDate(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.reportDate ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    <InlineError msg={errors.reportDate} />
                  </div>
                </div>
              </div>

              {/* Subsections */}
              {SUBSECTIONS.map((sub) => {
              const completion = subsectionCompletion(sub);
              const isOpen = openSections[sub.id];
              const hasError = sub.fields.some((f) => errors[f.key]);
              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  
                    <button
                    type="button"
                    onClick={() =>
                    setOpenSections((o) => ({
                      ...o,
                      [sub.id]: !o[sub.id]
                    }))
                    }
                    className={`${sub.headerBg} w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl ${!isOpen ? 'rounded-b-2xl border-b-0' : ''}`}>
                    
                      <div className="flex items-center text-left">
                        <div className={`${sub.iconBg} p-2 rounded-lg mr-3`}>
                          {sub.icon}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 pr-3">
                          {sub.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {hasError ?
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <AlertTriangleIcon className="w-3 h-3" /> Errors
                          </span> :

                      <CompletionBadge
                        completed={completion.filled}
                        total={completion.total} />

                      }
                        <ChevronDownIcon
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen &&
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
                      
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {sub.fields.map((f) => {
                          const val = targets[f.key] ?? '';
                          const hasValue = val !== '';
                          return (
                            <div
                              key={f.key}
                              id={`field-${f.key}`}
                              className="flex flex-col">
                              
                                  <label className="block text-sm font-medium text-gray-700 mb-1.5 leading-snug">
                                    {f.label}
                                    <RequiredMark />
                                  </label>
                                  <PercentInput
                                id={`input-${f.key}`}
                                value={val}
                                onChange={(v) => updateTarget(f.key, v)}
                                error={errors[f.key]}
                                hasValue={hasValue} />
                              
                                  {f.helper && !errors[f.key] &&
                              <p className="mt-1.5 text-xs text-gray-500 italic">
                                      {f.helper}
                                    </p>
                              }
                                  <InlineError msg={errors[f.key]} />
                                </div>);

                        })}
                          </div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>);

            })}

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
                SBC Target Records
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
                      Report Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Target
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
                  {pageRecords.map((r) => {
                  const filled = ALL_FIELDS.filter(
                    (f) => r.targets[f.key]
                  ).length;
                  const nums = ALL_FIELDS.map((f) =>
                  parseFloat(r.targets[f.key])
                  ).filter((n) => !isNaN(n));
                  const avg = nums.length ?
                  (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(
                    1
                  ) :
                  '—';
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/60 transition-colors">
                      
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {r.reportDate}
                        </td>
                        <td className="px-6 py-4">
                          <CompletionBadge
                          completed={filled}
                          total={TOTAL_TARGETS} />
                        
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {avg !== '—' ? `${avg}%` : '—'}
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
                      </tr>);

                })}
                  {pageRecords.length === 0 &&
                <tr>
                      <td
                    colSpan={5}
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
              {pageRecords.map((r) => {
              const filled = ALL_FIELDS.filter((f) => r.targets[f.key]).length;
              const nums = ALL_FIELDS.map((f) =>
              parseFloat(r.targets[f.key])
              ).filter((n) => !isNaN(n));
              const avg = nums.length ?
              (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) :
              '—';
              return (
                <div key={r.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {r.reportDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Avg {avg !== '—' ? `${avg}%` : '—'}
                        </p>
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CompletionBadge
                      completed={filled}
                      total={TOTAL_TARGETS} />
                    
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                      type="button"
                      onClick={() => setViewing(r)}
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                      
                        <EyeIcon className="w-4 h-4 mr-1.5" /> View
                      </button>
                    </div>
                  </div>);

            })}
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
        title="SBC Target Record"
        subtitle={viewing ? `Report date: ${viewing.reportDate}` : ''}
        sections={viewSections} />
      
    </div>);

}