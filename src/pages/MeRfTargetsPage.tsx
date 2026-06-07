import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  Children } from
'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  TargetIcon,
  ActivityIcon,
  DropletsIcon,
  UsersIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon } from
'lucide-react';
import { storageGet, storageSet, storageRemove, KEYS } from '../utils/storage';
import { useAppContext } from '../context/AppContext';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type RecordStatus = 'Draft' | 'Submitted';
const PAGE_SIZE = 8;
const HIGH_VALUE_WARN = 100000;
interface TargetField {
  key: string;
  label: string;
}
interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  headerBg: string;
  fields: TargetField[];
}
const SECTIONS: Section[] = [
{
  id: 'pdo',
  title: 'PDO Indicator Targets',
  description: 'Project Development Objective indicator targets.',
  icon: <TargetIcon className="w-5 h-5 text-blue-600" />,
  iconBg: 'bg-blue-100',
  headerBg: 'bg-blue-50/60',
  fields: [
  {
    key: 'targetPDI1',
    label:
    'Pregnant women who received complete iron-folic supplements or multiple micronutrient supplementation'
  },
  {
    key: 'targetPDI2',
    label:
    'Pregnant women in project area receiving prescribed antenatal care services from the first trimester'
  },
  {
    key: 'targetPDI3',
    label:
    'Households in participating barangays with convergence of nutrition-specific and nutrition-sensitive interventions'
  },
  {
    key: 'targetPDI4',
    label:
    'Children 6–23 months in project areas who meet age-appropriate minimum adequate diet (MAD)'
  },
  {
    key: 'targetPDI5',
    label: 'Households with access to improved toilets'
  }]

},
{
  id: 'ir',
  title: 'Intermediate Result Indicator Targets',
  description: 'Intermediate result indicators (1.01–1.16).',
  icon: <ActivityIcon className="w-5 h-5 text-orange-600" />,
  iconBg: 'bg-orange-100',
  headerBg: 'bg-orange-50/60',
  fields: [
  {
    key: 'target101',
    label: 'PHC facility staff trained on Child Growth Monitoring, IYCF'
  },
  {
    key: 'target102',
    label:
    'PHC facility staff trained on Nutrition in Emergencies in each barangay'
  },
  {
    key: 'target103',
    label:
    'RHUs and Birthing Homes with an agreed package of equipment and supplies for First 1,000 Days PHC services (DOH standards)'
  },
  {
    key: 'target104',
    label:
    'MLGUs with a full complement of health care workers at PHC level (DOH staffing norms)'
  },
  {
    key: 'target105',
    label:
    'PHC facilities scoring at least 65% on the Quality Checklist in participating LGUs'
  },
  {
    key: 'target106',
    label:
    'Infants 0–5 months who are exclusively breastfed and received an age-appropriate diet'
  },
  {
    key: 'target107',
    label:
    'IP infants 0–5.9 months who are exclusively breastfed and received an age-appropriate diet'
  },
  {
    key: 'target108',
    label:
    '6–59 month-old children who received Vitamin A in the past six months'
  },
  {
    key: 'target109',
    label: '6–11 month-old children who received Vitamin A'
  },
  {
    key: 'target110',
    label: '12–59 month-old children who received Vitamin A'
  },
  {
    key: 'target111',
    label:
    '6–59 month-old IP children who received Vitamin A in the past six months'
  },
  {
    key: 'target112',
    label:
    'Participating LGUs with approved MNAP budgets and expenditures per plans'
  },
  {
    key: 'target113',
    label:
    'Participating LGUs with approved BNAP budgets and expenditures per plans'
  },
  {
    key: 'target114',
    label: 'LGUs with at least one mass media nutrition campaign'
  },
  {
    key: 'target115',
    label:
    'Parents/caregivers of children under 5 who participated in at least 4 barangay-level SBCC/FDS sessions'
  },
  {
    key: 'target116',
    label:
    'IP parents/caregivers of children under 5 who participated in at least 4 barangay-level SBCC/FDS sessions'
  }]

},
{
  id: 'wash',
  title: 'Community Nutrition and WASH Targets',
  description: 'Community nutrition-sensitive sub-projects and WASH access.',
  icon: <DropletsIcon className="w-5 h-5 text-teal-600" />,
  iconBg: 'bg-teal-100',
  headerBg: 'bg-teal-50/60',
  fields: [
  {
    key: 'targetC21',
    label:
    'Community Nutrition-sensitive sub-projects completed per plan, budget, and schedule'
  },
  {
    key: 'targetC21a',
    label:
    'Households with access to a functional Level II Water Supply System'
  },
  {
    key: 'targetC21aAlt',
    label: 'Households with access to WASH Sub-Projects'
  },
  {
    key: 'targetC21b',
    label: 'Households with access to ECCD facility'
  }]

},
{
  id: 'beneficiary',
  title: 'Project Beneficiary Targets',
  description: 'Beneficiaries of project interventions and sub-projects.',
  icon: <UsersIcon className="w-5 h-5 text-purple-600" />,
  iconBg: 'bg-purple-100',
  headerBg: 'bg-purple-50/60',
  fields: [
  {
    key: 'targetC22',
    label: 'Beneficiaries of project interventions'
  },
  {
    key: 'targetC22a',
    label:
    'Women of reproductive age, incl. pregnant and lactating women, who were beneficiaries'
  },
  {
    key: 'targetC22b',
    label:
    'Children under 5 who were beneficiaries of project interventions'
  },
  {
    key: 'targetC22c',
    label:
    'Women and children who are 4Ps beneficiaries accessing project interventions'
  },
  {
    key: 'targetC22cAlt',
    label:
    'Women of reproductive age, incl. pregnant and lactating, who are 4Ps beneficiaries accessing interventions'
  },
  {
    key: 'targetC22cAlt2',
    label:
    'Children under 5 who are 4Ps beneficiaries receiving interventions'
  },
  {
    key: 'targetC22d',
    label: 'IP households benefiting from project interventions'
  },
  {
    key: 'targetC22ei',
    label:
    'IP women of reproductive age, incl. pregnant and lactating, who are 4Ps beneficiaries accessing interventions'
  },
  {
    key: 'targetC22eii',
    label:
    'IP children under 5 who are 4Ps beneficiaries receiving interventions'
  },
  {
    key: 'targetC23',
    label: 'Beneficiaries of Sub-Projects'
  }]

},
{
  id: 'governance',
  title: 'Governance, Grievance, and Community Monitoring Targets',
  description:
  'Grievance redress, nutrition committees, and service coverage.',
  icon: <ShieldCheckIcon className="w-5 h-5 text-indigo-600" />,
  iconBg: 'bg-indigo-100',
  headerBg: 'bg-indigo-50/60',
  fields: [
  {
    key: 'target31',
    label:
    'Registered grievances satisfactorily resolved per the Grievance Redress System'
  },
  {
    key: 'target32',
    label:
    'Barangays with updated nutrition information on HHs with pregnant/lactating women and children under 5'
  },
  {
    key: 'target33',
    label:
    'Project areas with functional nutrition committee (NC) at municipal level'
  },
  {
    key: 'target34',
    label:
    'Project areas with functional nutrition committee (NC) at barangay level'
  },
  {
    key: 'target35',
    label:
    'People receiving quality health, nutrition, and population services'
  }]

}];

const ALL_FIELDS: TargetField[] = SECTIONS.flatMap((s) => s.fields);
const TOTAL_TARGETS = ALL_FIELDS.length;
const TOTAL_REQUIRED = TOTAL_TARGETS + 1; // + reporting date
type Targets = Record<string, string>;
interface MeRecord {
  id: number;
  reportingDate: string;
  targets: Targets;
  status: RecordStatus;
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
base: number)
: MeRecord {
  const targets = emptyTargets();
  ALL_FIELDS.forEach((f, i) => {
    targets[f.key] = String(base + i % 7 * 3);
  });
  return {
    id,
    reportingDate: date,
    targets,
    status
  };
}
const SEED: MeRecord[] = [
seedRecord(1, '2026-03-31', 'Submitted', 80),
seedRecord(2, '2026-06-30', 'Draft', 60)];

function loadRecords(): MeRecord[] {
  return storageGet<MeRecord[]>(KEYS.ME_RF_TARGETS, SEED);
}
function saveRecords(records: MeRecord[]): void {
  storageSet(KEYS.ME_RF_TARGETS, records);
}
function isWholeNonNeg(v: string): boolean {
  if (v.trim() === '') return false;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0;
}
/* ---------------- Badges ---------------- */
function StatusPill({ status }: {status: RecordStatus;}) {
  const map: Record<RecordStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700 border-gray-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200'
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
const INPUT_CLS =
'w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300';
/* ---------------- Page ---------------- */
export function MeRfTargetsPage() {
  const { selectedBarangay } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<MeRecord[]>([]);
  const [reportingDate, setReportingDate] = useState('');
  const [targets, setTargets] = useState<Targets>(() => emptyTargets());
  const [status, setStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const m: Record<string, boolean> = {
        reporting: true
      };
      SECTIONS.forEach((s) => {
        m[s.id] = true;
      });
      return m;
    }
  );
  const hydrated = useRef(false);
  // list state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<MeRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
    // hydrate autosaved draft
    const draft = storageGet<{
      reportingDate: string;
      targets: Targets;
    } | null>(KEYS.ME_RF_DRAFT, null);
    if (draft) {
      setReportingDate(draft.reportingDate || '');
      setTargets({
        ...emptyTargets(),
        ...draft.targets
      });
    }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  // autosave draft locally
  useEffect(() => {
    if (!hydrated.current) return;
    storageSet(KEYS.ME_RF_DRAFT, {
      reportingDate,
      targets
    });
  }, [reportingDate, targets]);
  /* ---------------- Derived ---------------- */
  const completedCount = useMemo(
    () => ALL_FIELDS.filter((f) => (targets[f.key] ?? '') !== '').length,
    [targets]
  );
  const completedRequired = completedCount + (reportingDate ? 1 : 0);
  const completionPct = Math.round(completedRequired / TOTAL_REQUIRED * 100);
  function sectionCompletion(sec: Section) {
    const filled = sec.fields.filter(
      (f) => (targets[f.key] ?? '') !== ''
    ).length;
    return {
      filled,
      total: sec.fields.length
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
    setReportingDate(val);
    setErrors((e) => {
      if (!e.reportingDate) return e;
      const next = {
        ...e
      };
      delete next.reportingDate;
      return next;
    });
  };
  const validate = (isDraft: boolean): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!reportingDate && !isDraft)
    e.reportingDate = 'Reporting date is required.';
    ALL_FIELDS.forEach((f) => {
      const v = targets[f.key] ?? '';
      if (v.trim() === '') {
        if (!isDraft) e[f.key] = 'Required.';
        return;
      }
      const n = Number(v);
      if (isNaN(n) || n < 0) {
        e[f.key] = 'Must be a whole number ≥ 0.';
      } else if (!Number.isInteger(n)) {
        e[f.key] = 'Whole numbers only.';
      }
    });
    return e;
  };
  const handleReset = () => {
    setReportingDate('');
    setTargets(emptyTargets());
    setErrors({});
    setStatus('Draft');
    setNotification('');
    storageRemove(KEYS.ME_RF_DRAFT);
  };
  const scrollToError = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const el = document.getElementById(`field-${firstKey}`);
    if (el)
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    const sec = SECTIONS.find((s) => s.fields.some((f) => f.key === firstKey));
    if (sec)
    setOpenSections((o) => ({
      ...o,
      [sec.id]: true
    }));
    if (firstKey === 'reportingDate')
    setOpenSections((o) => ({
      ...o,
      reporting: true
    }));
  };
  const persist = (rs: RecordStatus, msg: string) => {
    const e = validate(rs === 'Draft');
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec: MeRecord = {
      id: Date.now(),
      reportingDate,
      targets: {
        ...targets
      },
      status: rs
    };
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification(msg);
    handleReset();
  };
  /* ---------------- List view ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.reportingDate.toLowerCase().includes(q) ||
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
  /* ---------------- View modal ---------------- */
  const viewSections: SectionDef[] = useMemo(() => {
    if (!viewing) return [];
    const sections: SectionDef[] = [
    {
      title: 'Reporting Information',
      fields: [
      {
        label: 'Reporting Date',
        value: viewing.reportingDate
      },
      {
        label: 'Status',
        value: viewing.status
      }]

    }];

    SECTIONS.forEach((sec) => {
      sections.push({
        title: sec.title,
        fields: sec.fields.map((f) => ({
          label: f.label,
          value: viewing.targets[f.key] ?? ''
        }))
      });
    });
    return sections;
  }, [viewing]);
  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>PMNP</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span>M&amp;E</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">
                Results Framework - Targets
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              M&amp;E Results Framework - Targets
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Assigned at Municipality, Barangay
              {selectedBarangay ? ` (${selectedBarangay.barangay})` : ''} ·
              User: NPMO, RPMO, MPMO
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Form status:</span>
            <StatusPill status={status} />
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
            label: 'Targets Form'
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
              layoutId="me-tab"
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
            {/* Sticky progress header */}
            <div className="sticky top-20 z-20 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 px-5 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Completion ({completedRequired}/{TOTAL_REQUIRED} required)
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
                  duration: 0.3
                }} />
              
              </div>
              <p className="mt-2 text-[11px] text-gray-400">
                Your entries auto-save locally as you type.
              </p>
            </div>

            {/* Reporting Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <button
              type="button"
              onClick={() =>
              setOpenSections((o) => ({
                ...o,
                reporting: !o.reporting
              }))
              }
              className={`bg-gray-50/80 w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl ${!openSections.reporting ? 'rounded-b-2xl border-b-0' : ''}`}>
              
                <div className="flex items-center text-left">
                  <div className="bg-gray-200 p-2 rounded-lg mr-3">
                    <CalendarIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Reporting Information
                    </h3>
                    <p className="text-xs text-gray-500">
                      Reporting period for this target set.
                    </p>
                  </div>
                </div>
                <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 transition-transform ${openSections.reporting ? 'rotate-180' : ''}`} />
              
              </button>
              <AnimatePresence initial={false}>
                {openSections.reporting &&
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
                
                    <div className="p-6">
                      <div id="field-reportingDate" className="max-w-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Reporting Date
                          <RequiredMark />
                        </label>
                        <input
                      type="date"
                      value={reportingDate}
                      max={todayISO()}
                      onChange={(e) => updateDate(e.target.value)}
                      className={`${INPUT_CLS} ${errors.reportingDate ? 'border-red-300' : 'border-gray-200'}`} />
                    
                        <InlineError msg={errors.reportingDate} />
                      </div>
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </div>

            {/* Target sections */}
            {SECTIONS.map((sec) => {
            const comp = sectionCompletion(sec);
            const isOpen = openSections[sec.id];
            const hasError = sec.fields.some((f) => errors[f.key]);
            return (
              <div
                key={sec.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100">
                
                  <button
                  type="button"
                  onClick={() =>
                  setOpenSections((o) => ({
                    ...o,
                    [sec.id]: !o[sec.id]
                  }))
                  }
                  className={`${sec.headerBg} w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl ${!isOpen ? 'rounded-b-2xl border-b-0' : ''}`}>
                  
                    <div className="flex items-center text-left">
                      <div className={`${sec.iconBg} p-2 rounded-lg mr-3`}>
                        {sec.icon}
                      </div>
                      <div className="pr-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {sec.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {sec.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {hasError ?
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangleIcon className="w-3 h-3" /> Errors
                        </span> :

                    <CompletionBadge
                      completed={comp.filled}
                      total={comp.total} />

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
                          {sec.fields.map((f) => {
                        const val = targets[f.key] ?? '';
                        const num = Number(val);
                        const warnHigh =
                        val !== '' &&
                        !errors[f.key] &&
                        !isNaN(num) &&
                        num > HIGH_VALUE_WARN;
                        return (
                          <div
                            key={f.key}
                            id={`field-${f.key}`}
                            className="flex flex-col">
                            
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 leading-snug">
                                  {f.label}
                                  <RequiredMark />
                                </label>
                                <input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              step={1}
                              value={val}
                              onChange={(e) =>
                              updateTarget(f.key, e.target.value)
                              }
                              placeholder="0"
                              className={`${INPUT_CLS} ${errors[f.key] ? 'border-red-300' : val !== '' ? 'border-green-300' : 'border-gray-200'}`} />
                            
                                {errors[f.key] ?
                            <InlineError msg={errors[f.key]} /> :
                            warnHigh ?
                            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                                    <AlertTriangleIcon className="w-3.5 h-3.5" />{' '}
                                    Unusually high value — please confirm.
                                  </p> :
                            null}
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
                Reset / Clear
              </button>
              <div className="flex gap-3">
                <button
                type="button"
                onClick={() =>
                persist(
                  'Draft',
                  'M&E Results Framework targets draft saved successfully.'
                )
                }
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                
                  <SaveIcon className="w-4 h-4 mr-2" /> Save Draft
                </button>
                <button
                type="button"
                onClick={() =>
                persist(
                  'Submitted',
                  'M&E Results Framework targets submitted successfully.'
                )
                }
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#F68E22] hover:bg-[#e07d10] text-white text-sm font-medium transition-colors shadow-sm">
                
                  <SendIcon className="w-4 h-4 mr-2" /> Submit
                </button>
              </div>
            </div>
          </div>
        }

        {/* List tab */}
        {activeTab === 'list' &&
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Results Framework Target Records
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
                      Completed
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
                    (f) => (r.targets[f.key] ?? '') !== ''
                  ).length;
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/60 transition-colors">
                      
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {r.reportingDate}
                        </td>
                        <td className="px-6 py-4">
                          <CompletionBadge
                          completed={filled}
                          total={TOTAL_TARGETS} />
                        
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
                    colSpan={4}
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
              const filled = ALL_FIELDS.filter(
                (f) => (r.targets[f.key] ?? '') !== ''
              ).length;
              return (
                <div key={r.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {r.reportingDate}
                      </p>
                      <StatusPill status={r.status} />
                    </div>
                    <CompletionBadge completed={filled} total={TOTAL_TARGETS} />
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
        title="Results Framework Target Record"
        subtitle={viewing ? `Reporting date: ${viewing.reportingDate}` : ''}
        sections={viewSections} />
      
    </div>);

}