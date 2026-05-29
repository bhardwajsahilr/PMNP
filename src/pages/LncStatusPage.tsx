import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  UsersIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  BookOpenIcon,
  FileTextIcon,
  ScaleIcon,
  TargetIcon,
  DollarSignIcon,
  HeartPulseIcon,
  ActivityIcon,
  BarChart3Icon,
  XIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
interface LncRecord {
  id: number;
  reportDate: string;
  bnsTraining: string;
  bnsTrainingLink: string;
  lncMeetings: string;
  meetingsLink: string;
  minutesDocumented: string;
  minutesLink: string;
  optPlus: string;
  optPlusLink: string;
  nutritionReport: string;
  reportLink: string;
  napLdp: string;
  napLdpLink: string;
  napAip: string;
  aipLink: string;
  fundsAllocated: string;
  fundsLink: string;
  targetGroups: string;
  targetGroupLink: string;
  monitoringVisits: string;
  monitoringLink: string;
  totalScore: number;
  functionalityStatus: string;
  remarks: string;
}
const BINARY = ['0', '1'];
const FUNCTIONALITY_OPTIONS = [
'Fully Functional',
'Substantially Functional',
'Partially Functional',
'Non-functional'];

const CRITERIA_FIELDS = [
{
  num: 1,
  label: 'BNS completed training',
  field: 'bnsTraining',
  linkField: 'bnsTrainingLink',
  linkLabel: 'BNS training document link',
  icon: BookOpenIcon,
  color: 'bg-primary/10 text-primary',
  borderColor: 'border-primary/10'
},
{
  num: 2,
  label: 'LNC meetings held quarterly',
  field: 'lncMeetings',
  linkField: 'meetingsLink',
  linkLabel: 'Meetings document link',
  icon: UsersIcon,
  color: 'bg-secondary/10 text-secondary',
  borderColor: 'border-secondary/10'
},
{
  num: 3,
  label: 'Minutes of meetings documented',
  field: 'minutesDocumented',
  linkField: 'minutesLink',
  linkLabel: 'Minutes document link',
  icon: FileTextIcon,
  color: 'bg-green-50 text-green-600',
  borderColor: 'border-green-100'
},
{
  num: 4,
  label: 'OPT Plus & school weighing updated',
  field: 'optPlus',
  linkField: 'optPlusLink',
  linkLabel: 'OPT Plus document link',
  icon: ScaleIcon,
  color: 'bg-accent/20 text-yellow-600',
  borderColor: 'border-accent/20'
},
{
  num: 5,
  label: 'Nutrition situation report prepared',
  field: 'nutritionReport',
  linkField: 'reportLink',
  linkLabel: 'Report document link',
  icon: BarChart3Icon,
  color: 'bg-purple-50 text-purple-600',
  borderColor: 'border-purple-100'
},
{
  num: 6,
  label: 'NAP integrated into LDP with budget',
  field: 'napLdp',
  linkField: 'napLdpLink',
  linkLabel: 'NAP LDP document link',
  icon: ClipboardCheckIcon,
  color: 'bg-teal-50 text-teal-600',
  borderColor: 'border-teal-100'
},
{
  num: 7,
  label: 'NAP integrated in AIP',
  field: 'napAip',
  linkField: 'aipLink',
  linkLabel: 'AIP document link',
  icon: DollarSignIcon,
  color: 'bg-blue-50 text-blue-600',
  borderColor: 'border-blue-100'
},
{
  num: 8,
  label: 'Funds allocated & expended',
  field: 'fundsAllocated',
  linkField: 'fundsLink',
  linkLabel: 'Funds document link',
  icon: DollarSignIcon,
  color: 'bg-emerald-50 text-emerald-600',
  borderColor: 'border-emerald-100'
},
{
  num: 9,
  label: 'Target groups received interventions',
  field: 'targetGroups',
  linkField: 'targetGroupLink',
  linkLabel: 'Target group document link',
  icon: TargetIcon,
  color: 'bg-rose-50 text-rose-600',
  borderColor: 'border-rose-100'
},
{
  num: 10,
  label: 'Monitoring visits conducted',
  field: 'monitoringVisits',
  linkField: 'monitoringLink',
  linkLabel: 'Monitoring document link',
  icon: ActivityIcon,
  color: 'bg-indigo-50 text-indigo-600',
  borderColor: 'border-indigo-100'
}];

const SEED_LNC: LncRecord[] = [
{
  id: 1,
  reportDate: '2026-03-15',
  bnsTraining: '1',
  bnsTrainingLink: '',
  lncMeetings: '1',
  meetingsLink: '',
  minutesDocumented: '1',
  minutesLink: '',
  optPlus: '1',
  optPlusLink: '',
  nutritionReport: '1',
  reportLink: '',
  napLdp: '1',
  napLdpLink: '',
  napAip: '1',
  aipLink: '',
  fundsAllocated: '1',
  fundsLink: '',
  targetGroups: '1',
  targetGroupLink: '',
  monitoringVisits: '1',
  monitoringLink: '',
  totalScore: 10,
  functionalityStatus: 'Fully Functional',
  remarks: ''
},
{
  id: 2,
  reportDate: '2026-03-01',
  bnsTraining: '1',
  bnsTrainingLink: '',
  lncMeetings: '1',
  meetingsLink: '',
  minutesDocumented: '0',
  minutesLink: '',
  optPlus: '1',
  optPlusLink: '',
  nutritionReport: '0',
  reportLink: '',
  napLdp: '1',
  napLdpLink: '',
  napAip: '1',
  aipLink: '',
  fundsAllocated: '0',
  fundsLink: '',
  targetGroups: '1',
  targetGroupLink: '',
  monitoringVisits: '1',
  monitoringLink: '',
  totalScore: 7,
  functionalityStatus: 'Substantially Functional',
  remarks: ''
},
{
  id: 3,
  reportDate: '2026-02-15',
  bnsTraining: '1',
  bnsTrainingLink: '',
  lncMeetings: '0',
  meetingsLink: '',
  minutesDocumented: '0',
  minutesLink: '',
  optPlus: '1',
  optPlusLink: '',
  nutritionReport: '0',
  reportLink: '',
  napLdp: '0',
  napLdpLink: '',
  napAip: '1',
  aipLink: '',
  fundsAllocated: '0',
  fundsLink: '',
  targetGroups: '1',
  targetGroupLink: '',
  monitoringVisits: '0',
  monitoringLink: '',
  totalScore: 4,
  functionalityStatus: 'Partially Functional',
  remarks: 'Needs improvement in documentation'
},
{
  id: 4,
  reportDate: '2026-01-20',
  bnsTraining: '0',
  bnsTrainingLink: '',
  lncMeetings: '0',
  meetingsLink: '',
  minutesDocumented: '0',
  minutesLink: '',
  optPlus: '0',
  optPlusLink: '',
  nutritionReport: '0',
  reportLink: '',
  napLdp: '0',
  napLdpLink: '',
  napAip: '0',
  aipLink: '',
  fundsAllocated: '0',
  fundsLink: '',
  targetGroups: '0',
  targetGroupLink: '',
  monitoringVisits: '0',
  monitoringLink: '',
  totalScore: 0,
  functionalityStatus: 'Non-functional',
  remarks: 'Newly organized LNC'
}];

function loadLnc(): LncRecord[] {
  return storageGet<LncRecord[]>(KEYS.LNC, SEED_LNC);
}
function saveLnc(records: LncRecord[]) {
  storageSet(KEYS.LNC, records);
}
function StatusBadge({ value }: {value: string;}) {
  const colorMap: Record<string, string> = {
    'Fully Functional': 'bg-green-50 text-green-700',
    'Substantially Functional': 'bg-blue-50 text-blue-700',
    'Partially Functional': 'bg-amber-50 text-amber-700',
    'Non-functional': 'bg-red-50 text-red-600'
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-600'}`}>
      
      {value}
    </span>);

}
function ScoreBadge({ score }: {score: number;}) {
  let color = 'bg-red-50 text-red-700';
  if (score >= 8) color = 'bg-green-50 text-green-700';else
  if (score >= 5) color = 'bg-blue-50 text-blue-700';else
  if (score >= 3) color = 'bg-amber-50 text-amber-700';
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${color}`}>
      
      {score}
    </span>);

}
export function LncStatusPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<LncRecord[]>(loadLnc);
  const handleAdd = useCallback(
    (record: Omit<LncRecord, 'id'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const newRecord: LncRecord = {
        ...record,
        id: nextId
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      saveLnc(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveLnc(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.functionalityStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reportDate.includes(searchQuery)
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">LNC Status</h1>
          <p className="text-sm text-gray-500">
            Local Nutrition Committee functionality assessment
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'LNC Status Form',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'LNC Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="lnc-tab"
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
          
            <LncForm onSubmit={handleAdd} />
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
          
            <LncList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function LncForm({
  onSubmit


}: {onSubmit: (r: Omit<LncRecord, 'id'>) => void;}) {
  const [form, setForm] = useState<Record<string, string>>({
    reportDate: '',
    bnsTraining: '',
    bnsTrainingLink: '',
    lncMeetings: '',
    meetingsLink: '',
    minutesDocumented: '',
    minutesLink: '',
    optPlus: '',
    optPlusLink: '',
    nutritionReport: '',
    reportLink: '',
    napLdp: '',
    napLdpLink: '',
    napAip: '',
    aipLink: '',
    fundsAllocated: '',
    fundsLink: '',
    targetGroups: '',
    targetGroupLink: '',
    monitoringVisits: '',
    monitoringLink: '',
    functionalityStatus: '',
    remarks: ''
  });
  const [success, setSuccess] = useState(false);
  const update = (field: string, value: string) =>
  setForm((f) => ({
    ...f,
    [field]: value
  }));
  const totalScore = useMemo(() => {
    return CRITERIA_FIELDS.reduce(
      (sum, c) => sum + (parseInt(form[c.field] || '0', 10) || 0),
      0
    );
  }, [form]);
  const handleSubmit = () => {
    if (!form.reportDate) return;
    onSubmit({
      ...form,
      totalScore
    } as unknown as Omit<LncRecord, 'id'>);
    const resetForm: Record<string, string> = {};
    Object.keys(form).forEach((k) => {
      resetForm[k] = '';
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
          LNC record saved successfully!
        </motion.div>
      }

      {/* Report Date */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <HeartPulseIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              LNC Status Report
            </h3>
            <p className="text-xs text-gray-400">
              Assessment date and criteria
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="p-5 sm:p-6 pt-4">
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              LNC Status Report Date
            </label>
            <input
              type="date"
              value={form.reportDate}
              onChange={(e) => update('reportDate', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
            
          </div>
        </div>
      </div>

      {/* 10 Criteria */}
      {CRITERIA_FIELDS.map((criteria) =>
      <div
        key={criteria.num}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
          <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
            <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${criteria.color}`}>
            
              <criteria.icon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                ({criteria.num}) {criteria.label}
              </h3>
            </div>
          </div>
          <div className={`border-t ${criteria.borderColor} mx-5 sm:mx-6`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {criteria.label}
              </label>
              <select
              value={form[criteria.field] || ''}
              onChange={(e) => update(criteria.field, e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
                <option value="">Select value</option>
                {BINARY.map((o) =>
              <option key={o} value={o}>
                    {o}
                  </option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {criteria.linkLabel}
              </label>
              <div className="relative">
                <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
                <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={form[criteria.linkField] || ''}
                onChange={(e) => update(criteria.linkField, e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <BarChart3Icon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
            <p className="text-xs text-gray-400">
              Total score and functionality status
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Total Score (auto-calculated)
            </label>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2.5 rounded-lg border text-lg font-bold text-center min-w-[60px] ${totalScore >= 8 ? 'bg-green-50 border-green-200 text-green-700' : totalScore >= 5 ? 'bg-blue-50 border-blue-200 text-blue-700' : totalScore >= 3 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                
                {totalScore}/10
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Functionality Status
            </label>
            <select
              value={form.functionalityStatus || ''}
              onChange={(e) => update('functionalityStatus', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select status</option>
              {FUNCTIONALITY_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Add remarks..."
              value={form.remarks || ''}
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
          
          Submit LNC Status
        </motion.button>
      </div>
    </div>);

}
function LncList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: LncRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [viewRecord, setViewRecord] = useState<LncRecord | null>(null);
  function getViewSections(r: LncRecord): SectionDef[] {
    return [
    {
      title: 'Report Information',
      fields: [
      {
        label: 'Report Date',
        value: r.reportDate
      },
      {
        label: 'Total Score',
        value: `${r.totalScore}/10`,
        type: 'badge' as const,
        badgeColor:
        r.totalScore >= 8 ?
        'bg-green-50 text-green-700' :
        r.totalScore >= 5 ?
        'bg-blue-50 text-blue-700' :
        r.totalScore >= 3 ?
        'bg-amber-50 text-amber-700' :
        'bg-red-50 text-red-700'
      },
      {
        label: 'Functionality Status',
        value: r.functionalityStatus,
        type: 'badge' as const,
        badgeColor:
        r.functionalityStatus === 'Fully Functional' ?
        'bg-green-50 text-green-700' :
        r.functionalityStatus === 'Substantially Functional' ?
        'bg-blue-50 text-blue-700' :
        r.functionalityStatus === 'Partially Functional' ?
        'bg-amber-50 text-amber-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Remarks',
        value: r.remarks
      }]

    },
    {
      title: 'Criteria Assessment',
      fields: [
      {
        label: '(1) BNS completed training',
        value: r.bnsTraining === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.bnsTraining === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'BNS Training Link',
        value: r.bnsTrainingLink,
        type: 'link' as const
      },
      {
        label: '(2) LNC meetings held quarterly',
        value: r.lncMeetings === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.lncMeetings === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Meetings Link',
        value: r.meetingsLink,
        type: 'link' as const
      },
      {
        label: '(3) Minutes documented',
        value: r.minutesDocumented === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.minutesDocumented === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Minutes Link',
        value: r.minutesLink,
        type: 'link' as const
      },
      {
        label: '(4) OPT Plus updated',
        value: r.optPlus === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.optPlus === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'OPT Plus Link',
        value: r.optPlusLink,
        type: 'link' as const
      },
      {
        label: '(5) Nutrition report prepared',
        value: r.nutritionReport === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.nutritionReport === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Report Link',
        value: r.reportLink,
        type: 'link' as const
      },
      {
        label: '(6) NAP in LDP with budget',
        value: r.napLdp === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.napLdp === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'NAP LDP Link',
        value: r.napLdpLink,
        type: 'link' as const
      },
      {
        label: '(7) NAP in AIP',
        value: r.napAip === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.napAip === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'AIP Link',
        value: r.aipLink,
        type: 'link' as const
      },
      {
        label: '(8) Funds allocated & expended',
        value: r.fundsAllocated === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.fundsAllocated === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Funds Link',
        value: r.fundsLink,
        type: 'link' as const
      },
      {
        label: '(9) Target groups received interventions',
        value: r.targetGroups === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.targetGroups === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Target Group Link',
        value: r.targetGroupLink,
        type: 'link' as const
      },
      {
        label: '(10) Monitoring visits conducted',
        value: r.monitoringVisits === '1' ? 'Yes' : 'No',
        type: 'badge' as const,
        badgeColor:
        r.monitoringVisits === '1' ?
        'bg-green-50 text-green-700' :
        'bg-red-50 text-red-600'
      },
      {
        label: 'Monitoring Link',
        value: r.monitoringLink,
        type: 'link' as const
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="LNC Status Record"
        subtitle={
        viewRecord ?
        `Report Date: ${viewRecord.reportDate} • Score: ${viewRecord.totalScore}/10` :
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
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search LNC records..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
        <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30">
          <option>All Statuses</option>
          {FUNCTIONALITY_OPTIONS.map((s) =>
          <option key={s}>{s}</option>
          )}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-secondary-50/40 to-primary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Report Date
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Score
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Functionality Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Remarks
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
                <td className="px-4 py-3.5 text-center">
                  <ScoreBadge score={r.totalScore} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={r.functionalityStatus} />
                </td>
                <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[200px] truncate">
                  {r.remarks || '—'}
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
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-3 space-y-3">
        {records.map((r) =>
        <div
          key={r.id}
          className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-secondary/30 hover:shadow-md hover:shadow-secondary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/0 group-hover:bg-secondary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                {r.reportDate}
              </span>
              <ScoreBadge score={r.totalScore} />
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge value={r.functionalityStatus} />
            </div>
            {r.remarks && <p className="text-xs text-gray-500">{r.remarks}</p>}
            <div className="flex justify-end gap-1 pt-1 border-t border-gray-50">
              <button
              onClick={() => setViewRecord(r)}
              className="p-1.5 rounded-lg hover:bg-secondary-50 text-secondary transition-colors">
              
                <EyeIcon size={14} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-primary-50 text-primary transition-colors">
                <PencilIcon size={14} />
              </button>
            </div>
          </div>
        )}
        {records.length === 0 &&
        <div className="text-center py-8 text-gray-400 text-sm">
            No LNC records found
          </div>
        }
      </div>

      {/* Pagination */}
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