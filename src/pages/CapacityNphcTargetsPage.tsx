import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  StethoscopeIcon,
  CalculatorIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  PercentIcon,
  LockIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { useAppContext } from '../context/AppContext';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type NphcStatus = 'Behind target' | 'On Track' | 'Completed' | 'Beyond target';
type RecordStatus = 'Draft' | 'Submitted';
const PAGE_SIZE = 8;
// Auto-populated region figures (from system/region data)
const REGION_PROVINCES = 4;
const REGION_MUNICIPALITIES = 26;
interface NphcRecord {
  id: number;
  numberOfProvinces: number;
  numberOfMunicipalities: number;
  doctors: string;
  nurses: string;
  nutritionistDietitians: string;
  otherProfession: string;
  totalTargetPHCFacilityStaff: number;
  totalTrainedPHCFacilityStaff: string;
  coverage: number | null;
  status: NphcStatus | null;
  recordStatus: RecordStatus;
}
const EMPTY_FORM = {
  doctors: '',
  nurses: '',
  nutritionistDietitians: '',
  otherProfession: '',
  totalTrainedPHCFacilityStaff: ''
};
function loadRecords(): NphcRecord[] {
  return storageGet<NphcRecord[]>(KEYS.CB_NPHC, SEED);
}
function saveRecords(records: NphcRecord[]): void {
  storageSet(KEYS.CB_NPHC, records);
}
function isNonNegNum(v: string): boolean {
  if (v.trim() === '') return false;
  const n = parseFloat(v);
  return !isNaN(n) && n >= 0;
}
function statusFromCoverage(coverage: number | null): NphcStatus | null {
  if (coverage === null) return null;
  if (coverage < 50) return 'Behind target';
  if (coverage < 100) return 'On Track';
  if (coverage === 100) return 'Completed';
  return 'Beyond target';
}
const SEED: NphcRecord[] = [
{
  id: 1,
  numberOfProvinces: REGION_PROVINCES,
  numberOfMunicipalities: REGION_MUNICIPALITIES,
  doctors: '12',
  nurses: '40',
  nutritionistDietitians: '8',
  otherProfession: '5',
  totalTargetPHCFacilityStaff: 65,
  totalTrainedPHCFacilityStaff: '52',
  coverage: 80,
  status: 'On Track',
  recordStatus: 'Submitted'
},
{
  id: 2,
  numberOfProvinces: REGION_PROVINCES,
  numberOfMunicipalities: REGION_MUNICIPALITIES,
  doctors: '10',
  nurses: '30',
  nutritionistDietitians: '6',
  otherProfession: '4',
  totalTargetPHCFacilityStaff: 50,
  totalTrainedPHCFacilityStaff: '50',
  coverage: 100,
  status: 'Completed',
  recordStatus: 'Submitted'
},
{
  id: 3,
  numberOfProvinces: REGION_PROVINCES,
  numberOfMunicipalities: REGION_MUNICIPALITIES,
  doctors: '8',
  nurses: '20',
  nutritionistDietitians: '4',
  otherProfession: '3',
  totalTargetPHCFacilityStaff: 35,
  totalTrainedPHCFacilityStaff: '12',
  coverage: 34.29,
  status: 'Behind target',
  recordStatus: 'Draft'
}];

/* ---------------- Badges ---------------- */
function StatusBadge({ status }: {status: NphcStatus | null;}) {
  if (!status) return <span className="text-gray-400 text-xs">—</span>;
  const map: Record<NphcStatus, string> = {
    'Behind target': 'bg-orange-50 text-orange-700 border-orange-200',
    'On Track': 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    'Beyond target': 'bg-purple-50 text-purple-700 border-purple-200'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      
      {status}
    </span>);

}
function RecordStatusPill({ status }: {status: RecordStatus;}) {
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
const INPUT_CLS =
'w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300';
const READONLY_CLS =
'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 flex items-center justify-between';
/* ---------------- Editable numeric field ---------------- */
interface NumFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: string;
}
function NumField({
  id,
  label,
  value,
  onChange,
  error,
  suffix
}: NumFieldProps) {
  return (
    <div id={`field-${id}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        <RequiredMark />
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={`${INPUT_CLS} ${suffix ? 'pr-9' : ''} ${error ? 'border-red-300' : 'border-gray-200'}`} />
        
        {suffix &&
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            {suffix}
          </span>
        }
      </div>
      <InlineError msg={error} />
    </div>);

}
/* ---------------- Page ---------------- */
export function CapacityNphcTargetsPage() {
  const { selectedBarangay } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<NphcRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');
  // list view state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<NphcRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  /* ---------------- Auto-calcs ---------------- */
  const totalTarget = useMemo(() => {
    const sum =
    (parseFloat(form.doctors) || 0) + (
    parseFloat(form.nurses) || 0) + (
    parseFloat(form.nutritionistDietitians) || 0) + (
    parseFloat(form.otherProfession) || 0);
    return sum;
  }, [
  form.doctors,
  form.nurses,
  form.nutritionistDietitians,
  form.otherProfession]
  );
  const coverage = useMemo<number | null>(() => {
    if (totalTarget <= 0) return null;
    const trained = parseFloat(form.totalTrainedPHCFacilityStaff);
    if (isNaN(trained)) return null;
    return Math.round(trained / totalTarget * 100 * 100) / 100;
  }, [totalTarget, form.totalTrainedPHCFacilityStaff]);
  const status = statusFromCoverage(coverage);
  const trainedExceedsTarget =
  isNonNegNum(form.totalTrainedPHCFacilityStaff) &&
  totalTarget > 0 &&
  parseFloat(form.totalTrainedPHCFacilityStaff) > totalTarget;
  /* ---------------- Handlers ---------------- */
  const update = useCallback((key: keyof typeof EMPTY_FORM, val: string) => {
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
  }, []);
  const validate = (isDraft: boolean): Record<string, string> => {
    const e: Record<string, string> = {};
    const numFields: (keyof typeof EMPTY_FORM)[] = [
    'doctors',
    'nurses',
    'nutritionistDietitians',
    'otherProfession',
    'totalTrainedPHCFacilityStaff'];

    numFields.forEach((key) => {
      const v = form[key];
      if (v.trim() === '') {
        if (!isDraft) e[key] = 'Required.';
      } else if (!isNonNegNum(v)) {
        e[key] = 'Must be a number ≥ 0.';
      }
    });
    if (!isDraft && totalTarget <= 0) {
      e.doctors = e.doctors || 'Enter staff counts to compute the target.';
    }
    return e;
  };
  const buildRecord = (rs: RecordStatus): NphcRecord => ({
    id: Date.now(),
    numberOfProvinces: REGION_PROVINCES,
    numberOfMunicipalities: REGION_MUNICIPALITIES,
    doctors: form.doctors,
    nurses: form.nurses,
    nutritionistDietitians: form.nutritionistDietitians,
    otherProfession: form.otherProfession,
    totalTargetPHCFacilityStaff: totalTarget,
    totalTrainedPHCFacilityStaff: form.totalTrainedPHCFacilityStaff,
    coverage,
    status,
    recordStatus: rs
  });
  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setRecordStatus('Draft');
    setNotification('');
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
  };
  const persist = (rs: RecordStatus, msg: string) => {
    const e = validate(rs === 'Draft');
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec = buildRecord(rs);
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification(msg);
    handleReset();
  };
  /* ---------------- List view derived ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      (r.status || '').toLowerCase().includes(q) ||
      r.recordStatus.toLowerCase().includes(q) ||
      String(r.coverage ?? '').includes(q)
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
  const viewSections: SectionDef[] = viewing ?
  [
  {
    title: 'Coverage Area',
    fields: [
    {
      label: 'Provinces',
      value: String(viewing.numberOfProvinces)
    },
    {
      label: 'Municipalities',
      value: String(viewing.numberOfMunicipalities)
    }]

  },
  {
    title: 'PHC Facility Staff',
    fields: [
    {
      label: 'Doctors',
      value: viewing.doctors
    },
    {
      label: 'Nurses',
      value: viewing.nurses
    },
    {
      label: 'Nutritionist-Dietitians',
      value: viewing.nutritionistDietitians
    },
    {
      label: 'Other Profession',
      value: viewing.otherProfession
    },
    {
      label: 'Total Target PHC Facility Staff',
      value: String(viewing.totalTargetPHCFacilityStaff)
    },
    {
      label: 'Total Trained PHC Facility Staff',
      value: viewing.totalTrainedPHCFacilityStaff
    }]

  },
  {
    title: 'Result',
    fields: [
    {
      label: 'Coverage',
      value: viewing.coverage !== null ? `${viewing.coverage}%` : '—'
    },
    {
      label: 'Status',
      value: viewing.status || '—'
    },
    {
      label: 'Record Status',
      value: viewing.recordStatus
    }]

  }] :

  [];
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
              <span>Capacity Building</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">NPHC Targets</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              NPHC Targets
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Assigned at Region
              {selectedBarangay ? ` (${selectedBarangay.region})` : ''} · User:
              NPMO / RPMO
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Form status:</span>
            <RecordStatusPill status={recordStatus} />
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
            label: 'NPHC Targets Form'
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
              layoutId="nphc-tab"
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
            {/* Coverage Area (auto) */}
            <SectionCard
            title="Coverage Area"
            icon={<MapPinIcon className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
            headerBg="bg-blue-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Provinces
                  </label>
                  <div className={READONLY_CLS}>
                    <span>{REGION_PROVINCES}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Auto-populated from region data.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Municipalities
                  </label>
                  <div className={READONLY_CLS}>
                    <span>{REGION_MUNICIPALITIES}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Auto-populated from region data.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* PHC Facility Staff */}
            <SectionCard
            title="PHC Facility Staff"
            icon={<StethoscopeIcon className="w-5 h-5 text-teal-600" />}
            iconBg="bg-teal-100"
            headerBg="bg-teal-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <NumField
                id="doctors"
                label="Doctors"
                value={form.doctors}
                onChange={(v) => update('doctors', v)}
                error={errors.doctors} />
              
                <NumField
                id="nurses"
                label="Nurses"
                value={form.nurses}
                onChange={(v) => update('nurses', v)}
                error={errors.nurses} />
              
                <NumField
                id="nutritionistDietitians"
                label="Nutritionist-Dietitians"
                value={form.nutritionistDietitians}
                onChange={(v) => update('nutritionistDietitians', v)}
                error={errors.nutritionistDietitians} />
              
                <NumField
                id="otherProfession"
                label="Other Profession"
                value={form.otherProfession}
                onChange={(v) => update('otherProfession', v)}
                error={errors.otherProfession} />
              

                {/* Total Target (auto) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Total Target PHC Facility Staff
                  </label>
                  <div className={READONLY_CLS}>
                    <span className="font-semibold">{totalTarget}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Auto-calculated: Doctors + Nurses + Nutritionist-Dietitians
                    + Other.
                  </p>
                </div>

                {/* Total Trained */}
                <div id="field-totalTrainedPHCFacilityStaff">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Total Trained PHC Facility Staff
                    <RequiredMark />
                  </label>
                  <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  value={form.totalTrainedPHCFacilityStaff}
                  onChange={(e) =>
                  update('totalTrainedPHCFacilityStaff', e.target.value)
                  }
                  placeholder="0"
                  className={`${INPUT_CLS} ${errors.totalTrainedPHCFacilityStaff ? 'border-red-300' : 'border-gray-200'}`} />
                
                  {errors.totalTrainedPHCFacilityStaff ?
                <InlineError msg={errors.totalTrainedPHCFacilityStaff} /> :
                trainedExceedsTarget ?
                <p className="mt-1.5 text-xs text-purple-600 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3.5 h-3.5" /> Trained
                      exceeds target — will register as "Beyond target".
                    </p> :
                null}
                </div>
              </div>
            </SectionCard>

            {/* Result (auto) */}
            <SectionCard
            title="Coverage & Status"
            icon={<CalculatorIcon className="w-5 h-5 text-orange-600" />}
            iconBg="bg-orange-100"
            headerBg="bg-orange-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Coverage
                  </label>
                  <div className={READONLY_CLS}>
                    <span className="font-semibold">
                      {coverage !== null ? `${coverage.toFixed(2)}%` : '—'}
                    </span>
                    <PercentIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  {totalTarget <= 0 ?
                <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3.5 h-3.5" /> Coverage
                      cannot be calculated because total target staff is 0.
                    </p> :

                <p className="mt-1.5 text-xs text-gray-500">
                      Auto-calculated: Trained ÷ Target × 100.
                    </p>
                }
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <StatusBadge status={status} />
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Auto-assigned from coverage percentage.
                  </p>
                </div>
              </div>
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
                onClick={() =>
                persist('Draft', 'NPHC Targets draft saved successfully.')
                }
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                
                  <SaveIcon className="w-4 h-4 mr-2" /> Save Draft
                </button>
                <button
                type="button"
                onClick={() =>
                persist('Submitted', 'NPHC Targets submitted successfully.')
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
                NPHC Target Records
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
                      Target Staff
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trained
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record
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
                        {r.totalTargetPHCFacilityStaff}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.totalTrainedPHCFacilityStaff || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {r.coverage !== null ? `${r.coverage}%` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-6 py-4">
                        <RecordStatusPill status={r.recordStatus} />
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
                        Coverage {r.coverage !== null ? `${r.coverage}%` : '—'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Target {r.totalTargetPHCFacilityStaff} · Trained{' '}
                        {r.totalTrainedPHCFacilityStaff || '—'}
                      </p>
                    </div>
                    <RecordStatusPill status={r.recordStatus} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={r.status} />
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
        title="NPHC Target Record"
        subtitle={
        viewing ?
        `Coverage: ${viewing.coverage !== null ? viewing.coverage + '%' : '—'}` :
        ''
        }
        sections={viewSections} />
      
    </div>);

}