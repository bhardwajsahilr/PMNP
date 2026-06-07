import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  CoinsIcon,
  TagsIcon,
  ListChecksIcon,
  WalletIcon,
  UserCogIcon,
  FileSignatureIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  LockIcon,
  PlusIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { useAppContext } from '../context/AppContext';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
type RecordStatus = 'Draft' | 'Submitted';
const PAGE_SIZE = 8;
const TRANCHES = ['Tranche 1', 'Tranche 2', 'Tranche 3'] as const;
const MFO_OPTIONS = [
'Support to Service Delivery Enhancement',
'LGU Operations for the implementation of the First 1,000 Days Strategy'];

const FUND_SOURCES = ['PBG - Tranche 1', 'PBG - Tranche 2', 'PBG - Tranche 3'];
const EXPENSE_CLASS_DEFAULT = 'Maintenance and Other Operating Expenses';
// Tranche chip tint
const TRANCHE_TINT: Record<string, string> = {
  'Tranche 1': 'bg-blue-50 text-blue-700 border-blue-200',
  'Tranche 2': 'bg-teal-50 text-teal-700 border-teal-200',
  'Tranche 3': 'bg-purple-50 text-purple-700 border-purple-200'
};
// Tranche -> Fiscal Year window (auto-filled, read-only)
const TRANCHE_FY: Record<
  string,
  {
    start: string;
    end: string;
  }> =
{
  'Tranche 1': {
    start: '2025-01',
    end: '2025-12'
  },
  'Tranche 2': {
    start: '2026-01',
    end: '2026-12'
  },
  'Tranche 3': {
    start: '2027-01',
    end: '2027-12'
  }
};
// Expense Item -> UACS Code (auto-filled)
const EXPENSE_ITEMS: {
  item: string;
  uacs: string;
}[] = [
{
  item: 'Traveling Expenses',
  uacs: '50201010-00'
},
{
  item: 'Training Expenses',
  uacs: '50202010-00'
},
{
  item: 'Office Supplies Expenses',
  uacs: '50203010-00'
},
{
  item: 'Drugs and Medicines Expenses',
  uacs: '50203070-00'
},
{
  item: 'Medical, Dental and Laboratory Supplies',
  uacs: '50203080-00'
},
{
  item: 'Telephone Expenses',
  uacs: '50205020-00'
},
{
  item: 'Internet Subscription Expenses',
  uacs: '50205030-00'
},
{
  item: 'Professional Services',
  uacs: '50211990-00'
},
{
  item: 'Other Maintenance and Operating Expenses',
  uacs: '50299990-00'
}];

interface WfpRecord {
  id: number;
  tranche: string;
  fiscalYearStartMonth: string;
  fiscalYearEndMonth: string;
  versionNumber: string;
  totalPBGTranche1AwardedPHP: string;
  majorFinalOutputs: string;
  expenseClass: string;
  expenseItem: string;
  uacsCode: string;
  output: string;
  projectProgramsActivities: string;
  timeframeStartMonth: string;
  timeframeEndMonth: string;
  quarterlyTargetQ1: string;
  quarterlyTargetQ2: string;
  quarterlyTargetQ3: string;
  quarterlyTargetQ4: string;
  amountAllocated: string;
  fundSource: string;
  percentageAgainstTotalPBGT1Awarded: number | null;
  personOfficeResponsible: string;
  preparedBy: string;
  preparationDate: string;
  reviewedBy: string;
  reviewDate: string;
  endorsedBy: string;
  endorsedDate: string;
  approvedBy: string;
  approvalDate: string;
  status: RecordStatus;
}
const EMPTY_FORM = {
  tranche: '',
  versionNumber: '',
  totalPBGTranche1AwardedPHP: '',
  majorFinalOutputs: '',
  expenseClass: EXPENSE_CLASS_DEFAULT,
  expenseItem: '',
  output: '',
  projectProgramsActivities: '',
  timeframeStartMonth: '',
  timeframeEndMonth: '',
  quarterlyTargetQ1: '',
  quarterlyTargetQ2: '',
  quarterlyTargetQ3: '',
  quarterlyTargetQ4: '',
  amountAllocated: '',
  fundSource: '',
  personOfficeResponsible: '',
  preparedBy: '',
  preparationDate: '',
  reviewedBy: '',
  reviewDate: '',
  endorsedBy: '',
  endorsedDate: '',
  approvedBy: '',
  approvalDate: ''
};
const SEED: WfpRecord[] = [
{
  id: 1,
  tranche: 'Tranche 1',
  fiscalYearStartMonth: '2025-01',
  fiscalYearEndMonth: '2025-12',
  versionNumber: '1',
  totalPBGTranche1AwardedPHP: '5000000',
  majorFinalOutputs: 'Support to Service Delivery Enhancement',
  expenseClass: EXPENSE_CLASS_DEFAULT,
  expenseItem: 'Training Expenses',
  uacsCode: '50202010-00',
  output: 'Trained barangay nutrition scholars',
  projectProgramsActivities:
  'Conduct of quarterly capacity-building sessions for BNS and BHWs.',
  timeframeStartMonth: '2025-01',
  timeframeEndMonth: '2025-12',
  quarterlyTargetQ1: '10',
  quarterlyTargetQ2: '15',
  quarterlyTargetQ3: '15',
  quarterlyTargetQ4: '10',
  amountAllocated: '750000',
  fundSource: 'PBG - Tranche 1',
  percentageAgainstTotalPBGT1Awarded: 15,
  personOfficeResponsible: 'Municipal Nutrition Office',
  preparedBy: 'Engr. Roberto Lim',
  preparationDate: '2025-01-05',
  reviewedBy: 'Ms. Carmela Tan',
  reviewDate: '2025-01-08',
  endorsedBy: 'Dr. Liza Mateo',
  endorsedDate: '2025-01-10',
  approvedBy: 'Hon. Mayor P. Garcia',
  approvalDate: '2025-01-12',
  status: 'Submitted'
},
{
  id: 2,
  tranche: 'Tranche 2',
  fiscalYearStartMonth: '2026-01',
  fiscalYearEndMonth: '2026-12',
  versionNumber: '1',
  totalPBGTranche1AwardedPHP: '6000000',
  majorFinalOutputs:
  'LGU Operations for the implementation of the First 1,000 Days Strategy',
  expenseClass: EXPENSE_CLASS_DEFAULT,
  expenseItem: 'Drugs and Medicines Expenses',
  uacsCode: '50203070-00',
  output: 'Micronutrient supplements procured',
  projectProgramsActivities:
  'Procurement and distribution of micronutrient supplements.',
  timeframeStartMonth: '2026-02',
  timeframeEndMonth: '2026-11',
  quarterlyTargetQ1: '0',
  quarterlyTargetQ2: '500',
  quarterlyTargetQ3: '500',
  quarterlyTargetQ4: '0',
  amountAllocated: '900000',
  fundSource: 'PBG - Tranche 2',
  percentageAgainstTotalPBGT1Awarded: 15,
  personOfficeResponsible: 'Municipal Health Office',
  preparedBy: 'Engr. Roberto Lim',
  preparationDate: '2026-01-06',
  reviewedBy: 'Ms. Carmela Tan',
  reviewDate: '2026-01-09',
  endorsedBy: 'Dr. Liza Mateo',
  endorsedDate: '2026-01-11',
  approvedBy: 'Hon. Mayor P. Garcia',
  approvalDate: '2026-01-14',
  status: 'Draft'
}];

function loadRecords(): WfpRecord[] {
  return storageGet<WfpRecord[]>(KEYS.LGU_WFP, SEED);
}
function saveRecords(records: WfpRecord[]): void {
  storageSet(KEYS.LGU_WFP, records);
}
function isNonNegNum(v: string): boolean {
  if (v.trim() === '') return false;
  const n = parseFloat(v);
  return !isNaN(n) && n >= 0;
}
function formatPHP(v: string | number): string {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (isNaN(n)) return '—';
  return (
    '₱' +
    n.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));

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
function Helper({ text }: {text: string;}) {
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
const READONLY_CLS =
'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 flex items-center justify-between';
interface FieldShellProps {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
  children: React.ReactNode;
}
function Field({
  id,
  label,
  required,
  error,
  helper,
  className,
  children
}: FieldShellProps) {
  return (
    <div id={id} className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <RequiredMark />}
      </label>
      {children}
      {error ?
      <InlineError msg={error} /> :
      helper ?
      <Helper text={helper} /> :
      null}
    </div>);

}
/* ---------------- Page ---------------- */
export function FinanceLguWfpPage() {
  const { selectedBarangay } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<WfpRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<RecordStatus>('Draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<WfpRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 3500);
    return () => clearTimeout(t);
  }, [notification]);
  // Derived auto fields
  const fy = form.tranche ? TRANCHE_FY[form.tranche] : null;
  const fiscalYearStartMonth = fy?.start || '';
  const fiscalYearEndMonth = fy?.end || '';
  const uacsCode =
  EXPENSE_ITEMS.find((e) => e.item === form.expenseItem)?.uacs || '';
  const percentage = useMemo<number | null>(() => {
    const total = parseFloat(form.totalPBGTranche1AwardedPHP);
    const amt = parseFloat(form.amountAllocated);
    if (isNaN(total) || total <= 0 || isNaN(amt)) return null;
    return Math.round(amt / total * 100 * 100) / 100;
  }, [form.totalPBGTranche1AwardedPHP, form.amountAllocated]);
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
    const req = (key: keyof typeof EMPTY_FORM, label: string) => {
      if ((form[key] as string).trim() === '' && !isDraft)
      e[key] = `${label} is required.`;
    };
    const reqNonNeg = (key: keyof typeof EMPTY_FORM, label: string) => {
      const v = form[key] as string;
      if (v.trim() === '') {
        if (!isDraft) e[key] = `${label} is required.`;
      } else if (!isNonNegNum(v)) {
        e[key] = `${label} must be a number ≥ 0.`;
      }
    };
    req('tranche', 'Tranche');
    // Version >= 1
    if (form.versionNumber.trim() === '') {
      if (!isDraft) e.versionNumber = 'Version Number is required.';
    } else {
      const n = parseFloat(form.versionNumber);
      if (isNaN(n) || n < 1) e.versionNumber = 'Version Number must be ≥ 1.';
    }
    reqNonNeg('totalPBGTranche1AwardedPHP', 'Total PBG Tranche 1 Awarded');
    req('majorFinalOutputs', 'Major Final Outputs');
    req('expenseClass', 'Expense Class');
    req('expenseItem', 'Expense Item');
    req('output', 'Output');
    req('projectProgramsActivities', 'PPAs');
    req('timeframeStartMonth', 'Timeframe Start Month');
    req('timeframeEndMonth', 'Timeframe End Month');
    if (
    form.timeframeStartMonth &&
    form.timeframeEndMonth &&
    form.timeframeEndMonth < form.timeframeStartMonth)
    {
      e.timeframeEndMonth = 'End month must be on or after start month.';
    }
    reqNonNeg('quarterlyTargetQ1', 'Q1');
    reqNonNeg('quarterlyTargetQ2', 'Q2');
    reqNonNeg('quarterlyTargetQ3', 'Q3');
    reqNonNeg('quarterlyTargetQ4', 'Q4');
    reqNonNeg('amountAllocated', 'Amount Allocated');
    req('fundSource', 'Fund Source');
    req('personOfficeResponsible', 'Person/Office Responsible');
    // Approvals
    req('preparedBy', 'Prepared by');
    req('preparationDate', 'Preparation Date');
    req('reviewedBy', 'Reviewed by');
    req('reviewDate', 'Review Date');
    req('endorsedBy', 'Endorsed by');
    req('endorsedDate', 'Endorsed Date');
    req('approvedBy', 'Approved by');
    req('approvalDate', 'Approval Date');
    // Date ordering (only when both present)
    if (
    form.preparationDate &&
    form.reviewDate &&
    form.reviewDate < form.preparationDate)
    {
      e.reviewDate = 'Review Date must be on or after Preparation Date.';
    }
    if (
    form.reviewDate &&
    form.endorsedDate &&
    form.endorsedDate < form.reviewDate)
    {
      e.endorsedDate = 'Endorsed Date must be on or after Review Date.';
    }
    if (
    form.endorsedDate &&
    form.approvalDate &&
    form.approvalDate < form.endorsedDate)
    {
      e.approvalDate = 'Approval Date must be on or after Endorsed Date.';
    }
    return e;
  };
  const buildRecord = (rs: RecordStatus): WfpRecord => ({
    id: Date.now(),
    tranche: form.tranche,
    fiscalYearStartMonth,
    fiscalYearEndMonth,
    versionNumber: form.versionNumber,
    totalPBGTranche1AwardedPHP: form.totalPBGTranche1AwardedPHP,
    majorFinalOutputs: form.majorFinalOutputs,
    expenseClass: form.expenseClass,
    expenseItem: form.expenseItem,
    uacsCode,
    output: form.output,
    projectProgramsActivities: form.projectProgramsActivities,
    timeframeStartMonth: form.timeframeStartMonth,
    timeframeEndMonth: form.timeframeEndMonth,
    quarterlyTargetQ1: form.quarterlyTargetQ1,
    quarterlyTargetQ2: form.quarterlyTargetQ2,
    quarterlyTargetQ3: form.quarterlyTargetQ3,
    quarterlyTargetQ4: form.quarterlyTargetQ4,
    amountAllocated: form.amountAllocated,
    fundSource: form.fundSource,
    percentageAgainstTotalPBGT1Awarded: percentage,
    personOfficeResponsible: form.personOfficeResponsible,
    preparedBy: form.preparedBy,
    preparationDate: form.preparationDate,
    reviewedBy: form.reviewedBy,
    reviewDate: form.reviewDate,
    endorsedBy: form.endorsedBy,
    endorsedDate: form.endorsedDate,
    approvedBy: form.approvedBy,
    approvalDate: form.approvalDate,
    status: rs
  });
  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus('Draft');
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
  // Save the current PPA and start a new one under the SAME tranche / year.
  // Keeps Tranche, Version, Total PBG Awarded and the approval block; clears only
  // the line-item (PPA) fields so the next entry can be filled.
  const handleAddMore = () => {
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
    setForm((f) => ({
      ...f,
      // cleared line-item fields
      majorFinalOutputs: '',
      expenseClass: EXPENSE_CLASS_DEFAULT,
      expenseItem: '',
      output: '',
      projectProgramsActivities: '',
      timeframeStartMonth: '',
      timeframeEndMonth: '',
      quarterlyTargetQ1: '',
      quarterlyTargetQ2: '',
      quarterlyTargetQ3: '',
      quarterlyTargetQ4: '',
      amountAllocated: '',
      fundSource: '',
      personOfficeResponsible: ''
      // tranche, versionNumber, totalPBGTranche1AwardedPHP and all approvals are kept
    }));
    setErrors({});
    setNotification(
      `Entry saved. Continue adding another PPA for ${form.tranche} (${fiscalYearStartMonth} – ${fiscalYearEndMonth}).`
    );
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  /* ---------------- List view ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.tranche.toLowerCase().includes(q) ||
      r.expenseItem.toLowerCase().includes(q) ||
      r.output.toLowerCase().includes(q) ||
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
  const viewSections: SectionDef[] = viewing ?
  [
  {
    title: 'Plan Period & Budget',
    fields: [
    {
      label: 'Tranche',
      value: viewing.tranche
    },
    {
      label: 'FY Start Month',
      value: viewing.fiscalYearStartMonth
    },
    {
      label: 'FY End Month',
      value: viewing.fiscalYearEndMonth
    },
    {
      label: 'Version Number',
      value: viewing.versionNumber
    },
    {
      label: 'Total PBG Tranche 1 Awarded',
      value: formatPHP(viewing.totalPBGTranche1AwardedPHP)
    }]

  },
  {
    title: 'Expense Classification',
    fields: [
    {
      label: 'Major Final Outputs',
      value: viewing.majorFinalOutputs
    },
    {
      label: 'Expense Class',
      value: viewing.expenseClass
    },
    {
      label: 'Expense Item',
      value: viewing.expenseItem
    },
    {
      label: 'UACS Code',
      value: viewing.uacsCode
    }]

  },
  {
    title: 'Activity & Targets',
    fields: [
    {
      label: 'Output',
      value: viewing.output
    },
    {
      label: 'PPAs',
      value: viewing.projectProgramsActivities
    },
    {
      label: 'Timeframe Start',
      value: viewing.timeframeStartMonth
    },
    {
      label: 'Timeframe End',
      value: viewing.timeframeEndMonth
    },
    {
      label: 'Q1',
      value: viewing.quarterlyTargetQ1
    },
    {
      label: 'Q2',
      value: viewing.quarterlyTargetQ2
    },
    {
      label: 'Q3',
      value: viewing.quarterlyTargetQ3
    },
    {
      label: 'Q4',
      value: viewing.quarterlyTargetQ4
    }]

  },
  {
    title: 'Allocation',
    fields: [
    {
      label: 'Amount Allocated',
      value: formatPHP(viewing.amountAllocated)
    },
    {
      label: 'Fund Source',
      value: viewing.fundSource
    },
    {
      label: '% Against Total PBG T1 Awarded',
      value:
      viewing.percentageAgainstTotalPBGT1Awarded !== null ?
      `${viewing.percentageAgainstTotalPBGT1Awarded}%` :
      '—'
    },
    {
      label: 'Person/Office Responsible',
      value: viewing.personOfficeResponsible
    }]

  },
  {
    title: 'Approvals & Signatures',
    fields: [
    {
      label: 'Prepared by',
      value: viewing.preparedBy
    },
    {
      label: 'Preparation Date',
      value: viewing.preparationDate
    },
    {
      label: 'Reviewed by',
      value: viewing.reviewedBy
    },
    {
      label: 'Review Date',
      value: viewing.reviewDate
    },
    {
      label: 'Endorsed by',
      value: viewing.endorsedBy
    },
    {
      label: 'Endorsed Date',
      value: viewing.endorsedDate
    },
    {
      label: 'Approved by',
      value: viewing.approvedBy
    },
    {
      label: 'Approval Date',
      value: viewing.approvalDate
    },
    {
      label: 'Record Status',
      value: viewing.status
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
              <span>Finance</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">LGU WFP</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              LGU WFP
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Assigned at Municipality
              {selectedBarangay ? ` (${selectedBarangay.municipality})` : ''} ·
              User: MPMO
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Form status:</span>
              <StatusPill status={status} />
            </div>
            {form.tranche &&
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${TRANCHE_TINT[form.tranche] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              
                {form.tranche}
                {fiscalYearStartMonth &&
              <span className="opacity-70 font-medium">
                    · FY {fiscalYearStartMonth.slice(0, 4)}
                  </span>
              }
              </span>
            }
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
            label: 'LGU WFP Form'
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
              layoutId="wfp-tab"
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
            {/* Plan Period & Budget */}
            <SectionCard
            title="Plan Period & Budget"
            icon={<CalendarIcon className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
            headerBg="bg-blue-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                id="field-tranche"
                label="Tranche"
                required
                error={errors.tranche}>
                
                  <select
                  value={form.tranche}
                  onChange={(e) => update('tranche', e.target.value)}
                  className={`${INPUT_CLS} ${errors.tranche ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select tranche</option>
                    {TRANCHES.map((t) =>
                  <option key={t} value={t}>
                        {t}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                label="Version Number"
                required
                error={errors.versionNumber}
                id="field-versionNumber">
                
                  <input
                  type="number"
                  min={1}
                  step="1"
                  value={form.versionNumber}
                  onChange={(e) => update('versionNumber', e.target.value)}
                  placeholder="1"
                  className={`${INPUT_CLS} ${errors.versionNumber ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <Field
                label="Fiscal Year (FY) – Start Month"
                helper="Auto-selected from the chosen tranche.">
                
                  <div className={READONLY_CLS}>
                    <span>{fiscalYearStartMonth || '—'}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </Field>

                <Field
                label="Fiscal Year (FY) – End Month"
                helper="Auto-selected from the chosen tranche.">
                
                  <div className={READONLY_CLS}>
                    <span>{fiscalYearEndMonth || '—'}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </Field>

                <Field
                id="field-totalPBGTranche1AwardedPHP"
                label="Total PBG Tranche 1 Awarded (PHP)"
                required
                error={errors.totalPBGTranche1AwardedPHP}
                className="md:col-span-2">
                
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ₱
                    </span>
                    <input
                    type="number"
                    min={0}
                    step="any"
                    value={form.totalPBGTranche1AwardedPHP}
                    onChange={(e) =>
                    update('totalPBGTranche1AwardedPHP', e.target.value)
                    }
                    placeholder="0.00"
                    className={`${INPUT_CLS} pl-8 ${errors.totalPBGTranche1AwardedPHP ? 'border-red-300' : 'border-gray-200'}`} />
                  
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Expense Classification */}
            <SectionCard
            title="Expense Classification"
            icon={<TagsIcon className="w-5 h-5 text-purple-600" />}
            iconBg="bg-purple-100"
            headerBg="bg-purple-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                id="field-majorFinalOutputs"
                label="Major Final Outputs (MFO)"
                required
                error={errors.majorFinalOutputs}
                className="md:col-span-2">
                
                  <select
                  value={form.majorFinalOutputs}
                  onChange={(e) =>
                  update('majorFinalOutputs', e.target.value)
                  }
                  className={`${INPUT_CLS} ${errors.majorFinalOutputs ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select MFO</option>
                    {MFO_OPTIONS.map((o) =>
                  <option key={o} value={o}>
                        {o}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                id="field-expenseClass"
                label="Expense Class"
                required
                error={errors.expenseClass}
                helper="Default: Maintenance and Other Operating Expenses.">
                
                  <input
                  type="text"
                  value={form.expenseClass}
                  onChange={(e) => update('expenseClass', e.target.value)}
                  className={`${INPUT_CLS} ${errors.expenseClass ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <Field
                id="field-expenseItem"
                label="Expense Item"
                required
                error={errors.expenseItem}
                helper="Follows the data dictionary dropdown (column L).">
                
                  <select
                  value={form.expenseItem}
                  onChange={(e) => update('expenseItem', e.target.value)}
                  className={`${INPUT_CLS} ${errors.expenseItem ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select expense item</option>
                    {EXPENSE_ITEMS.map((e) =>
                  <option key={e.item} value={e.item}>
                        {e.item}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                label="UACS Code"
                helper="Auto-filled from the selected Expense Item (column N)."
                className="md:col-span-2">
                
                  <div className={READONLY_CLS}>
                    <span>{uacsCode || '—'}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Activity & Targets */}
            <SectionCard
            title="Activity & Quarterly Targets"
            icon={<ListChecksIcon className="w-5 h-5 text-teal-600" />}
            iconBg="bg-teal-100"
            headerBg="bg-teal-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                id="field-output"
                label="Output"
                required
                error={errors.output}>
                
                  <input
                  type="text"
                  value={form.output}
                  onChange={(e) => update('output', e.target.value)}
                  placeholder="Enter output"
                  className={`${INPUT_CLS} ${errors.output ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <Field
                id="field-projectProgramsActivities"
                label="Projects, Programs, Activities (PPAs)"
                required
                error={errors.projectProgramsActivities}
                className="md:col-span-2">
                
                  <textarea
                  rows={3}
                  value={form.projectProgramsActivities}
                  onChange={(e) =>
                  update('projectProgramsActivities', e.target.value)
                  }
                  placeholder="Enter project, program, or activity details."
                  className={`${INPUT_CLS} resize-none ${errors.projectProgramsActivities ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <Field
                id="field-timeframeStartMonth"
                label="Timeframe Start Month"
                required
                error={errors.timeframeStartMonth}>
                
                  <input
                  type="month"
                  value={form.timeframeStartMonth}
                  onChange={(e) =>
                  update('timeframeStartMonth', e.target.value)
                  }
                  className={`${INPUT_CLS} ${errors.timeframeStartMonth ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <Field
                id="field-timeframeEndMonth"
                label="Timeframe End Month"
                required
                error={errors.timeframeEndMonth}>
                
                  <input
                  type="month"
                  value={form.timeframeEndMonth}
                  onChange={(e) =>
                  update('timeframeEndMonth', e.target.value)
                  }
                  className={`${INPUT_CLS} ${errors.timeframeEndMonth ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                [
                ['quarterlyTargetQ1', 'Q1'],
                ['quarterlyTargetQ2', 'Q2'],
                ['quarterlyTargetQ3', 'Q3'],
                ['quarterlyTargetQ4', 'Q4']] as
                [keyof typeof EMPTY_FORM, string][]).
                map(([key, label]) =>
                <Field
                  key={key}
                  id={`field-${key}`}
                  label={`Target ${label}`}
                  required
                  error={errors[key]}>
                  
                      <input
                    type="number"
                    min={0}
                    step="any"
                    value={form[key] as string}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder="0"
                    className={`${INPUT_CLS} ${errors[key] ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    </Field>
                )}
                </div>
              </div>
            </SectionCard>

            {/* Allocation */}
            <SectionCard
            title="Allocation"
            icon={<WalletIcon className="w-5 h-5 text-orange-600" />}
            iconBg="bg-orange-100"
            headerBg="bg-orange-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                id="field-amountAllocated"
                label="Amount Allocated (PHP)"
                required
                error={errors.amountAllocated}>
                
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ₱
                    </span>
                    <input
                    type="number"
                    min={0}
                    step="any"
                    value={form.amountAllocated}
                    onChange={(e) =>
                    update('amountAllocated', e.target.value)
                    }
                    placeholder="0.00"
                    className={`${INPUT_CLS} pl-8 ${errors.amountAllocated ? 'border-red-300' : 'border-gray-200'}`} />
                  
                  </div>
                </Field>

                <Field
                id="field-fundSource"
                label="Fund Source"
                required
                error={errors.fundSource}>
                
                  <select
                  value={form.fundSource}
                  onChange={(e) => update('fundSource', e.target.value)}
                  className={`${INPUT_CLS} ${errors.fundSource ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select fund source</option>
                    {FUND_SOURCES.map((f) =>
                  <option key={f} value={f}>
                        {f}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                label="% Against Total PBG T1 Awarded for PPA Charged to PBG"
                className="md:col-span-2"
                helper={
                parseFloat(form.totalPBGTranche1AwardedPHP) > 0 ?
                'Auto-calculated: Amount Allocated ÷ Total PBG Awarded × 100.' :
                undefined
                }>
                
                  <div className={READONLY_CLS}>
                    <span className="font-semibold">
                      {percentage !== null ? `${percentage.toFixed(2)}%` : '—'}
                    </span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  {!(parseFloat(form.totalPBGTranche1AwardedPHP) > 0) &&
                <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3.5 h-3.5" /> Percentage
                      cannot be calculated because total PBG awarded amount is
                      0.
                    </p>
                }
                </Field>

                <Field
                id="field-personOfficeResponsible"
                label="Person / Office Responsible"
                required
                error={errors.personOfficeResponsible}
                className="md:col-span-2">
                
                  <input
                  type="text"
                  value={form.personOfficeResponsible}
                  onChange={(e) =>
                  update('personOfficeResponsible', e.target.value)
                  }
                  placeholder="Enter responsible person or office."
                  className={`${INPUT_CLS} ${errors.personOfficeResponsible ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>
              </div>
            </SectionCard>

            {/* Approvals & Signatures */}
            <SectionCard
            title="WFP Approvals and Signatures"
            icon={<FileSignatureIcon className="w-5 h-5 text-indigo-600" />}
            iconBg="bg-indigo-100"
            headerBg="bg-indigo-50/60">
            
              <div className="space-y-5">
                {(
              [
              [
              'preparedBy',
              'preparationDate',
              'Prepared by (Municipal Technical Manager)'],

              [
              'reviewedBy',
              'reviewDate',
              'Reviewed by (Municipal Accounting Officer)'],

              [
              'endorsedBy',
              'endorsedDate',
              'Endorsed by (PMNP Municipal TWG Chair)'],

              [
              'approvedBy',
              'approvalDate',
              'Approved by (Local Chief Executive)']] as

              [
                keyof typeof EMPTY_FORM,
                keyof typeof EMPTY_FORM,
                string][]).

              map(([nameKey, dateKey, label]) =>
              <div
                key={nameKey}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                    <Field
                  id={`field-${nameKey}`}
                  label={label}
                  required
                  error={errors[nameKey]}>
                  
                      <input
                    type="text"
                    value={form[nameKey] as string}
                    onChange={(e) => update(nameKey, e.target.value)}
                    placeholder="Full name"
                    className={`${INPUT_CLS} ${errors[nameKey] ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    </Field>
                    <Field
                  id={`field-${dateKey}`}
                  label="Date"
                  required
                  error={errors[dateKey]}>
                  
                      <input
                    type="date"
                    value={form[dateKey] as string}
                    onChange={(e) => update(dateKey, e.target.value)}
                    className={`${INPUT_CLS} ${errors[dateKey] ? 'border-red-300' : 'border-gray-200'}`} />
                  
                    </Field>
                  </div>
              )}
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
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                type="button"
                onClick={handleAddMore}
                disabled={!form.tranche}
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-[#F68E22] text-[#F68E22] bg-white text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                form.tranche ?
                'Save this entry and add another for the same year' :
                'Select a tranche first'
                }>
                
                  <PlusIcon className="w-4 h-4 mr-2" /> Add More for the Same
                  Year
                </button>
                <button
                type="button"
                onClick={() =>
                persist('Draft', 'LGU WFP draft saved successfully.')
                }
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                
                  <SaveIcon className="w-4 h-4 mr-2" /> Save Draft
                </button>
                <button
                type="button"
                onClick={() =>
                persist('Submitted', 'LGU WFP submitted successfully.')
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
                LGU WFP Records
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
                      Tranche
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense Item
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Allocated
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of PBG
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
                        {r.tranche}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.expenseItem}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatPHP(r.amountAllocated)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.percentageAgainstTotalPBGT1Awarded !== null ?
                    `${r.percentageAgainstTotalPBGT1Awarded}%` :
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
                        {r.tranche}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {r.expenseItem}
                      </p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>{formatPHP(r.amountAllocated)}</span>
                    <span>
                      {r.percentageAgainstTotalPBGT1Awarded !== null ?
                  `${r.percentageAgainstTotalPBGT1Awarded}% of PBG` :
                  '—'}
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
        title="LGU WFP Record"
        subtitle={
        viewing ? `${viewing.tranche} · Version ${viewing.versionNumber}` : ''
        }
        sections={viewSections} />
      
    </div>);

}