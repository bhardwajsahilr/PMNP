import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  UsersIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  PercentIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type RecordStatus = 'Draft' | 'Submitted';
const TPV_COUNT = 10;
const PAGE_SIZE = 8;
interface TpvMember {
  name: string;
  designation: string;
}
interface EvrRecord {
  id: number;
  eventDate: string;
  reportedInternalVerificationLPRating: string;
  externalVerificationResultC1: string;
  externalVerificationResultC2: string;
  percentageVariance: string;
  explanationOfVariance: string;
  furtherActionsRecommended: string;
  declaredLevelOfPerformance: string;
  tpvMembers: TpvMember[];
  status: RecordStatus;
}
function emptyTpv(): TpvMember[] {
  return Array.from(
    {
      length: TPV_COUNT
    },
    () => ({
      name: '',
      designation: ''
    })
  );
}
const EMPTY_FORM = {
  eventDate: '',
  reportedInternalVerificationLPRating: '',
  externalVerificationResultC2: '',
  percentageVariance: '',
  explanationOfVariance: '',
  furtherActionsRecommended: '',
  declaredLevelOfPerformance: '',
  tpvMembers: emptyTpv()
};
const SEED: EvrRecord[] = [
{
  id: 1,
  eventDate: '2026-02-10',
  reportedInternalVerificationLPRating: '85',
  externalVerificationResultC1: '85',
  externalVerificationResultC2: '78',
  percentageVariance: '8.2',
  explanationOfVariance:
  'Minor documentation gaps in finance management records reconciled during the exit conference.',
  furtherActionsRecommended:
  'Submit updated FMG supporting documents within 15 working days.',
  declaredLevelOfPerformance: '85',
  tpvMembers: [
  {
    name: 'Maria Santos',
    designation: 'Regional Verification Lead'
  },
  {
    name: 'Juan Dela Cruz',
    designation: 'Finance Management Specialist'
  },
  {
    name: 'Ana Reyes',
    designation: 'Nutrition Program Officer'
  },
  ...Array.from(
    {
      length: 7
    },
    () => ({
      name: '',
      designation: ''
    })
  )],

  status: 'Submitted'
},
{
  id: 2,
  eventDate: '2026-04-22',
  reportedInternalVerificationLPRating: '72',
  externalVerificationResultC1: '72',
  externalVerificationResultC2: '70',
  percentageVariance: '2.8',
  explanationOfVariance: '',
  furtherActionsRecommended: '',
  declaredLevelOfPerformance: '72',
  tpvMembers: emptyTpv(),
  status: 'Draft'
}];

function loadRecords(): EvrRecord[] {
  return storageGet<EvrRecord[]>(KEYS.PBG_EVR, SEED);
}
function saveRecords(records: EvrRecord[]): void {
  storageSet(KEYS.PBG_EVR, records);
}
function isNum(v: string): boolean {
  return v.trim() !== '' && !isNaN(parseFloat(v));
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
function HelperText({ text }: {text: string;}) {
  return <p className="mt-1.5 text-xs text-gray-500">{text}</p>;
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
/* ---------------- Page ---------------- */
export function PbgExternalVerificationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<EvrRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');
  // list view state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<EvrRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  // C1 auto-populates from Reported Internal Verification LP Rating
  const c1 = form.reportedInternalVerificationLPRating;
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
  const updateTpv = useCallback(
    (idx: number, field: keyof TpvMember, val: string) => {
      setForm((f) => {
        const tpv = f.tpvMembers.map((m, i) =>
        i === idx ?
        {
          ...m,
          [field]: val
        } :
        m
        );
        return {
          ...f,
          tpvMembers: tpv
        };
      });
      setErrors((e) => {
        const key = `tpv-${idx}`;
        if (!e[key]) return e;
        const next = {
          ...e
        };
        delete next[key];
        return next;
      });
    },
    []
  );
  const validate = (isDraft: boolean): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.eventDate) {
      if (!isDraft) e.eventDate = 'Event date is required.';
    }
    const reqNum = (key: keyof typeof EMPTY_FORM, label: string) => {
      const v = form[key] as string;
      if (v.trim() === '') {
        if (!isDraft) e[key] = `${label} is required.`;
      } else if (!isNum(v)) {
        e[key] = `${label} must be numeric.`;
      }
    };
    reqNum(
      'reportedInternalVerificationLPRating',
      'Reported Internal Verification LP Rating'
    );
    reqNum('externalVerificationResultC2', 'External Verification Result (C2)');
    reqNum('percentageVariance', 'Percentage Variance');
    reqNum('declaredLevelOfPerformance', 'Declared Level of Performance');
    // Declared LoP must equal C1
    if (isNum(form.declaredLevelOfPerformance) && isNum(c1)) {
      if (parseFloat(form.declaredLevelOfPerformance) !== parseFloat(c1)) {
        e.declaredLevelOfPerformance =
        'Must equal External Verification Result (C1): ' + c1 + '.';
      }
    }
    // TPV pairing: if one of name/designation filled, the other is required
    form.tpvMembers.forEach((m, i) => {
      const hasName = m.name.trim() !== '';
      const hasDes = m.designation.trim() !== '';
      if (hasName !== hasDes) {
        e[`tpv-${i}`] = hasName ?
        'Designation is required when a name is entered.' :
        'Name is required when a designation is entered.';
      }
    });
    return e;
  };
  const buildRecord = (recStatus: RecordStatus): EvrRecord => ({
    id: Date.now(),
    eventDate: form.eventDate,
    reportedInternalVerificationLPRating:
    form.reportedInternalVerificationLPRating,
    externalVerificationResultC1: c1,
    externalVerificationResultC2: form.externalVerificationResultC2,
    percentageVariance: form.percentageVariance,
    explanationOfVariance: form.explanationOfVariance,
    furtherActionsRecommended: form.furtherActionsRecommended,
    declaredLevelOfPerformance: form.declaredLevelOfPerformance,
    tpvMembers: form.tpvMembers.map((m) => ({
      ...m
    })),
    status: recStatus
  });
  const handleReset = () => {
    setForm({
      ...EMPTY_FORM,
      tpvMembers: emptyTpv()
    });
    setErrors({});
    setStatus('Draft');
    setNotification('');
  };
  const scrollToError = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const id = firstKey.startsWith('tpv-') ?
    `field-${firstKey}` :
    `field-${firstKey}`;
    const el = document.getElementById(id);
    if (el)
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };
  const handleSaveDraft = () => {
    const e = validate(true);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec = buildRecord('Draft');
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('External Verification Report draft saved successfully.');
    handleReset();
  };
  const handleSubmit = () => {
    const e = validate(false);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec = buildRecord('Submitted');
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification('External Verification Report submitted successfully.');
    handleReset();
  };
  /* ---------------- List view derived ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.eventDate.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.declaredLevelOfPerformance.toLowerCase().includes(q)
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
    const tpvFilled = viewing.tpvMembers.filter((m) => m.name.trim() !== '');
    const sections: SectionDef[] = [
    {
      title: 'External Verification Report',
      fields: [
      {
        label: 'Date of Regional Exit Conference',
        value: viewing.eventDate
      },
      {
        label: 'Reported Internal Verification LP Rating',
        value: viewing.reportedInternalVerificationLPRating
      },
      {
        label: 'External Verification Result (C1) PBG, T2 LP Rating',
        value: viewing.externalVerificationResultC1
      },
      {
        label: 'External Verification Result (C2) FMG',
        value: viewing.externalVerificationResultC2
      },
      {
        label: 'Percentage Variance',
        value: viewing.percentageVariance ?
        `${viewing.percentageVariance}%` :
        ''
      },
      {
        label: 'Declared Level of Performance',
        value: viewing.declaredLevelOfPerformance ?
        `${viewing.declaredLevelOfPerformance}%` :
        ''
      },
      {
        label: 'Explanation of Variance',
        value: viewing.explanationOfVariance
      },
      {
        label: 'Further Actions Recommended',
        value: viewing.furtherActionsRecommended
      },
      {
        label: 'Status',
        value: viewing.status
      }]

    },
    {
      title: 'Third Party Verification (TPV) Members',
      fields:
      tpvFilled.length > 0 ?
      tpvFilled.map((m, i) => ({
        label: `Member ${i + 1} — ${m.name}`,
        value: m.designation
      })) :
      [
      {
        label: 'Members',
        value: 'None recorded'
      }]

    }];

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
              <span>PBG</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">
                External Verification Report
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              External Verification Report
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              PBG External Verification — Tranche 2
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
            label: 'Verification Form'
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
              layoutId="evr-tab"
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
            {/* Section 1 */}
            <SectionCard
            title="External Verification Report"
            icon={<ClipboardCheckIcon className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
            headerBg="bg-blue-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Event Date */}
                <div id="field-eventDate" className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Regional Exit Conference for External Verification
                    <RequiredMark />
                  </label>
                  <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => update('eventDate', e.target.value)}
                  className={`${INPUT_CLS} ${errors.eventDate ? 'border-red-300' : 'border-gray-200'} md:max-w-sm`} />
                
                  <InlineError msg={errors.eventDate} />
                </div>

                {/* Reported Internal Verification LP Rating */}
                <div
                id="field-reportedInternalVerificationLPRating"
                className="md:col-span-2">
                
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reported Internal Verification LP Rating
                    <RequiredMark />
                  </label>
                  <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={form.reportedInternalVerificationLPRating}
                  onChange={(e) =>
                  update(
                    'reportedInternalVerificationLPRating',
                    e.target.value
                  )
                  }
                  placeholder="0"
                  className={`${INPUT_CLS} ${errors.reportedInternalVerificationLPRating ? 'border-red-300' : 'border-gray-200'} md:max-w-sm`} />
                
                  {errors.reportedInternalVerificationLPRating ?
                <InlineError
                  msg={errors.reportedInternalVerificationLPRating} /> :


                <HelperText text="Level of Performance, based on ATTACHMENT 3: PBG Tranche 2 Verification Tool for LGU MOBAT, submitted to the DOH NPMO on or before 30 September 2025." />
                }
                </div>

                {/* C1 (auto) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    External Verification Result — (C1) PBG, T2 LP Rating
                  </label>
                  <div
                  className={`${INPUT_CLS} border-gray-200 bg-gray-50 flex items-center justify-between text-gray-700`}>
                  
                    <span>{c1 !== '' ? c1 : '—'}</span>
                    <span className="text-xs text-gray-400">Auto</span>
                  </div>
                  <HelperText text="Auto-populated from the Reported Internal Verification LP Rating." />
                </div>

                {/* C2 FMG */}
                <div id="field-externalVerificationResultC2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    External Verification Result — (C2) FMG
                    <RequiredMark />
                  </label>
                  <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={form.externalVerificationResultC2}
                  onChange={(e) =>
                  update('externalVerificationResultC2', e.target.value)
                  }
                  placeholder="0"
                  className={`${INPUT_CLS} ${errors.externalVerificationResultC2 ? 'border-red-300' : 'border-gray-200'}`} />
                
                  {errors.externalVerificationResultC2 ?
                <InlineError msg={errors.externalVerificationResultC2} /> :

                <HelperText text="Level of Performance, based on ATTACHMENT 4: Finance Management Assessment Checklist." />
                }
                </div>

                {/* Percentage Variance */}
                <div id="field-percentageVariance">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Percentage Variance
                    <RequiredMark />
                  </label>
                  <div className="relative">
                    <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={form.percentageVariance}
                    onChange={(e) =>
                    update('percentageVariance', e.target.value)
                    }
                    placeholder="0"
                    className={`${INPUT_CLS} pr-9 ${errors.percentageVariance ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    <PercentIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <InlineError msg={errors.percentageVariance} />
                </div>

                {/* Declared LoP */}
                <div id="field-declaredLevelOfPerformance">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Declared Level of Performance
                    <RequiredMark />
                  </label>
                  <div className="relative">
                    <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={form.declaredLevelOfPerformance}
                    onChange={(e) =>
                    update('declaredLevelOfPerformance', e.target.value)
                    }
                    placeholder="0"
                    className={`${INPUT_CLS} pr-9 ${errors.declaredLevelOfPerformance ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    <PercentIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.declaredLevelOfPerformance ?
                <InlineError msg={errors.declaredLevelOfPerformance} /> :

                <HelperText text="Must equal External Verification Result (C1)." />
                }
                </div>

                {/* Explanation of Variance */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Explanation of Variance
                  </label>
                  <textarea
                  rows={3}
                  value={form.explanationOfVariance}
                  onChange={(e) =>
                  update('explanationOfVariance', e.target.value)
                  }
                  placeholder="Enter explanation of variance, if any."
                  className={`${INPUT_CLS} border-gray-200 resize-none`} />
                
                </div>

                {/* Further Actions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Further Actions Recommended
                  </label>
                  <textarea
                  rows={3}
                  value={form.furtherActionsRecommended}
                  onChange={(e) =>
                  update('furtherActionsRecommended', e.target.value)
                  }
                  placeholder="Enter recommended further actions."
                  className={`${INPUT_CLS} border-gray-200 resize-none`} />
                
                </div>
              </div>
            </SectionCard>

            {/* Section 2: TPV Members */}
            <SectionCard
            title="Third Party Verification (TPV) Members"
            icon={<UsersIcon className="w-5 h-5 text-purple-600" />}
            iconBg="bg-purple-100"
            headerBg="bg-purple-50/60">
            
              <p className="text-sm text-gray-500 mb-4">
                Record up to {TPV_COUNT} members. If a name is entered, a
                designation is required for that row.
              </p>

              {/* Table header (desktop) */}
              <div className="hidden md:grid md:grid-cols-[2rem_1fr_1fr] gap-3 px-1 pb-2 mb-1 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  #
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Designation
                </span>
              </div>

              <div className="space-y-3">
                {form.tpvMembers.map((m, i) => {
                const err = errors[`tpv-${i}`];
                return (
                  <div key={i} id={`field-tpv-${i}`}>
                      <div className="grid grid-cols-1 md:grid-cols-[2rem_1fr_1fr] gap-3 md:items-center">
                        <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-xs font-semibold text-gray-500">
                          {i + 1}
                        </div>
                        <div>
                          <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">
                            Member {i + 1} — Name
                          </label>
                          <input
                          type="text"
                          value={m.name}
                          onChange={(e) =>
                          updateTpv(i, 'name', e.target.value)
                          }
                          placeholder="Full name"
                          className={`${INPUT_CLS} ${err ? 'border-red-300' : 'border-gray-200'}`} />
                        
                        </div>
                        <div>
                          <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">
                            Designation
                          </label>
                          <input
                          type="text"
                          value={m.designation}
                          onChange={(e) =>
                          updateTpv(i, 'designation', e.target.value)
                          }
                          placeholder="Designation"
                          className={`${INPUT_CLS} ${err ? 'border-red-300' : 'border-gray-200'}`} />
                        
                        </div>
                      </div>
                      {err &&
                    <div className="md:pl-[2.75rem]">
                          <InlineError msg={err} />
                        </div>
                    }
                    </div>);

              })}
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
        }

        {/* List tab */}
        {activeTab === 'list' &&
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                External Verification Records
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
                      Exit Conference Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported LP
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      C1 Rating
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Declared LoP
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
                        {r.eventDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.reportedInternalVerificationLPRating || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.externalVerificationResultC1 || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {r.declaredLevelOfPerformance ?
                    `${r.declaredLevelOfPerformance}%` :
                    '—'}
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
                        {r.eventDate}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Declared LoP{' '}
                        {r.declaredLevelOfPerformance ?
                    `${r.declaredLevelOfPerformance}%` :
                    '—'}
                      </p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>
                      Reported LP:{' '}
                      {r.reportedInternalVerificationLPRating || '—'}
                    </span>
                    <span>C1: {r.externalVerificationResultC1 || '—'}</span>
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
        title="External Verification Report"
        subtitle={viewing ? `Exit conference: ${viewing.eventDate}` : ''}
        sections={viewSections} />
      
    </div>);

}