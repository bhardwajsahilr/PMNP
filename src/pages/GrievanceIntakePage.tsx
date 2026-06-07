import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  UserIcon,
  FileWarningIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon,
  SaveIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClipboardCheckIcon,
  SendIcon,
  CircleCheckBigIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const MODE_OF_FILING = [
'Mail/Letter',
'Text Message',
'Email',
'Phone',
'Walk-In',
'Suggestion Box',
'Others'];

const INTAKE_LEVELS = ['Central', 'Region', 'Municipality', 'Barangay'];
const GRM_SOURCES = ['DSWD', 'DOH', 'LGU', 'Beneficiary', 'Others'];
const GENDERS = ['Male', 'Female'];
const IP_OPTIONS = ['Indigenous People (IP)', 'Non-IP'];
const DESIGNATIONS = [
'Project Beneficiary',
'Barangay Health Worker',
'Barangay Officials/Staff',
'Member of any Indigenous Group',
'Provincial Staff',
'Regional Staff',
'National Staff',
'Municipal Staff',
'Other Participating Agencies',
'Others'];

const NATURE_TYPES = [
'Type A: Questions or Recommendations',
'Type B: Non-performance of obligation',
'Type C: Compliance with procurement and financial management guidelines',
'Type D: Compliance with DOH Primary Health Care Guidelines',
'Type E: Compliance with labor management procedures'];

const TYPE_A_CATEGORIES = [
'Roles and Responsibilities',
'Physical Implementation',
'Finance Management',
'Procurement',
'Service Packages',
'Recommendations regarding the implementation',
'Other concerns'];

const TYPE_B_CATEGORIES = [
'Significant changes in the implementation process without basis',
'Non-compliance to MOA provisions between the LGU and the Implementing Agencies',
'Sub-standard implementation of projects and/or interventions by the contractors',
'Other concerns specify'];

const TYPE_C_CATEGORIES = [
'Misuse of funds',
'Allegations of corruption',
'Falsification of public documents',
'Preferential treatment to a particular contractor',
'Other concerns'];

const TYPE_D_CATEGORIES = [
'Mishandling of primary care interventions resulting to adverse effects on the health of a beneficiary',
'Other concerns'];

const TYPE_E_CATEGORIES = [
'Irregularities on the contract implementation and compliance by the Contractor',
'Sexual harassment cases',
'Administrative complaints against a Project Staff',
'Non-payment of obligation to sub-contractors',
'Non-inclusion of a stakeholder in convergence activities',
'Non-inclusion of Indigenous People in the service delivery',
'Non-inclusion of Indigenous People in the community consultations',
'Others'];

const RESOLUTION_STATUS = [
'Completed',
'No further complaint',
'On-going',
'Complaint dropped'];

const SATISFACTION_OPTIONS = [
'Very satisfied',
'Satisfied',
'Neutral',
'Not Satisfied'];

interface Grievance {
  id: number;
  // Intake
  dateOfIntake: string;
  modeOfFiling: string;
  modeOfFilingOthers: string;
  intakeLevel: string;
  grmSource: string;
  grmSourceOthers: string;
  // Complainant
  firstName: string;
  middleInitial: string;
  surname: string;
  gender: string;
  contactNumber: string;
  emailAddress: string;
  ipStatus: string;
  designation: string;
  designationOtherAgencies: string;
  designationOthers: string;
  address: string;
  // Concern
  natureOfConcern: string[];
  typeACategories: string[];
  typeAOther: string;
  typeBCategory: string;
  typeBOther: string;
  typeCCategory: string;
  typeCOther: string;
  typeDCategory: string;
  typeDOther: string;
  typeECategory: string;
  typeEOther: string;
  specificDetails: string;
  dateOfIncident: string;
  timeOfIncident: string;
  locationOfIncident: string;
  desiredOutcome: string;
  desiredOutcomeDetails: string;
  // Forwarded
  areaForwardedTo: string;
  dateOfForwarding: string;
  dateOfReply: string;
  // Closure
  issuanceOfReply: string;
  closureDate: string;
  daysForProcessing: number;
  statusOfResolution: string;
  rateOfSatisfaction: string;
  amountExecuted: number;
  nameOfIntakeOffice: string;
  designationClosure: string;
  nameOfComplainant: string;
  // Meta
  isDraft: boolean;
}
const SEED: Grievance[] = [
{
  id: 1,
  dateOfIntake: '2026-03-15',
  modeOfFiling: 'Email',
  modeOfFilingOthers: '',
  intakeLevel: 'Region',
  grmSource: 'Beneficiary',
  grmSourceOthers: '',
  firstName: 'Maria',
  middleInitial: 'L',
  surname: 'Santos',
  gender: 'Female',
  contactNumber: '+63 917 555 1234',
  emailAddress: 'maria.santos@example.com',
  ipStatus: 'Non-IP',
  designation: 'Project Beneficiary',
  designationOtherAgencies: '',
  designationOthers: '',
  address: '123 Rizal Street, Brgy. Parian, Calamba, Laguna',
  natureOfConcern: ['Type A: Questions or Recommendations'],
  typeACategories: ['Service Packages'],
  typeAOther: '',
  typeBCategory: '',
  typeBOther: '',
  typeCCategory: '',
  typeCOther: '',
  typeDCategory: '',
  typeDOther: '',
  typeECategory: '',
  typeEOther: '',
  specificDetails:
  'Inquiry about the next distribution schedule for nutrition commodities in our barangay.',
  dateOfIncident: '',
  timeOfIncident: '',
  locationOfIncident: '',
  desiredOutcome: 'Yes',
  desiredOutcomeDetails: 'Request a clear schedule from the RPMO office.',
  areaForwardedTo: 'RPMO Region IV-A',
  dateOfForwarding: '2026-03-16',
  dateOfReply: '2026-03-18',
  issuanceOfReply: '2026-03-20',
  closureDate: '2026-03-22',
  daysForProcessing: 7,
  statusOfResolution: 'Completed',
  rateOfSatisfaction: 'Satisfied',
  amountExecuted: 0,
  nameOfIntakeOffice: 'MPMO Calamba',
  designationClosure: 'Project Officer',
  nameOfComplainant: 'Maria L Santos',
  isDraft: false
},
{
  id: 2,
  dateOfIntake: '2026-03-10',
  modeOfFiling: 'Walk-In',
  modeOfFilingOthers: '',
  intakeLevel: 'Municipality',
  grmSource: 'LGU',
  grmSourceOthers: '',
  firstName: 'Juan',
  middleInitial: '',
  surname: 'Dela Cruz',
  gender: 'Male',
  contactNumber: '+63 920 555 9876',
  emailAddress: '',
  ipStatus: 'Indigenous People (IP)',
  designation: 'Member of any Indigenous Group',
  designationOtherAgencies: '',
  designationOthers: '',
  address: 'Sitio Banawe, Brgy. Sampaloc, Tanay, Rizal',
  natureOfConcern: ['Type E: Compliance with labor management procedures'],
  typeACategories: [],
  typeAOther: '',
  typeBCategory: '',
  typeBOther: '',
  typeCCategory: '',
  typeCOther: '',
  typeDCategory: '',
  typeDOther: '',
  typeECategory:
  'Non-inclusion of Indigenous People in the community consultations',
  typeEOther: '',
  specificDetails:
  'Indigenous community was not invited to the recent consultation regarding nutrition program rollout.',
  dateOfIncident: '2026-03-05',
  timeOfIncident: '14:00',
  locationOfIncident: 'Municipal Hall, Tanay, Rizal',
  desiredOutcome: 'Yes',
  desiredOutcomeDetails:
  'Inclusion of IP representatives in all future consultations.',
  areaForwardedTo: 'NPMO ESMF Unit',
  dateOfForwarding: '2026-03-11',
  dateOfReply: '',
  issuanceOfReply: '',
  closureDate: '',
  daysForProcessing: 0,
  statusOfResolution: 'On-going',
  rateOfSatisfaction: '',
  amountExecuted: 0,
  nameOfIntakeOffice: 'MPMO Tanay',
  designationClosure: '',
  nameOfComplainant: 'Juan Dela Cruz',
  isDraft: false
},
{
  id: 3,
  dateOfIntake: '2026-02-28',
  modeOfFiling: 'Phone',
  modeOfFilingOthers: '',
  intakeLevel: 'Barangay',
  grmSource: 'DOH',
  grmSourceOthers: '',
  firstName: 'Anna',
  middleInitial: 'M',
  surname: 'Reyes',
  gender: 'Female',
  contactNumber: '',
  emailAddress: '',
  ipStatus: 'Non-IP',
  designation: 'Barangay Health Worker',
  designationOtherAgencies: '',
  designationOthers: '',
  address: '',
  natureOfConcern: [],
  typeACategories: [],
  typeAOther: '',
  typeBCategory: '',
  typeBOther: '',
  typeCCategory: '',
  typeCOther: '',
  typeDCategory: '',
  typeDOther: '',
  typeECategory: '',
  typeEOther: '',
  specificDetails: '',
  dateOfIncident: '',
  timeOfIncident: '',
  locationOfIncident: '',
  desiredOutcome: '',
  desiredOutcomeDetails: '',
  areaForwardedTo: '',
  dateOfForwarding: '',
  dateOfReply: '',
  issuanceOfReply: '',
  closureDate: '',
  daysForProcessing: 0,
  statusOfResolution: '',
  rateOfSatisfaction: '',
  amountExecuted: 0,
  nameOfIntakeOffice: '',
  designationClosure: '',
  nameOfComplainant: 'Anna M Reyes',
  isDraft: true
}];

function loadRecords(): Grievance[] {
  return storageGet<Grievance[]>(KEYS.GRIEVANCES, SEED);
}
function saveRecords(records: Grievance[]) {
  storageSet(KEYS.GRIEVANCES, records);
}
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getOverallStatus(r: {
  isDraft: boolean;
  statusOfResolution: string;
}): string {
  if (r.isDraft) return 'Draft';
  if (
  r.statusOfResolution === 'Completed' ||
  r.statusOfResolution === 'No further complaint' ||
  r.statusOfResolution === 'Complaint dropped')

  return 'Completed';
  if (r.statusOfResolution === 'On-going') return 'On-going';
  return 'Submitted';
}
function StatusBadge({
  value,
  size = 'sm'



}: {value: string;size?: 'sm' | 'md';}) {
  const cfg: Record<string, string> = {
    Draft: 'bg-amber-50 text-amber-700 border border-amber-200',
    Submitted: 'bg-blue-50 text-blue-700 border border-blue-200',
    'On-going': 'bg-secondary-50 text-secondary border border-secondary-200',
    Completed: 'bg-green-50 text-green-700 border border-green-200'
  };
  const sizeCls = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-xs';
  return (
    <span
      className={`inline-block ${sizeCls} rounded-full font-medium ${cfg[value] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
      
      {value}
    </span>);

}
function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  error,
  required








}: {label: string;options: string[];selected: string[];onChange: (val: string[]) => void;placeholder?: string;error?: string;required?: boolean;}) {
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
        {label} {required && <span className="text-red-500">*</span>}
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
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium max-w-[260px]">
          
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
function CardHeader({
  icon: Icon,
  color,
  title,
  subtitle





}: {icon: any;color: string;title: string;subtitle: string;}) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
        <div
          className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 mx-5 sm:mx-6" />
    </>);

}
export function GrievanceIntakePage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<Grievance[]>(loadRecords);
  const [headerStatus, setHeaderStatus] = useState<string>('Draft');
  const handleAdd = useCallback(
    (record: Omit<Grievance, 'id'>) => {
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
    r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.dateOfIntake.includes(searchQuery) ||
    r.modeOfFiling.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col gap-1 mb-1">
        <div className="text-xs text-gray-400">
          PMNP / ESMF / Grievance Intake Form
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Grievance Intake Form
            </h1>
            <p className="text-sm text-gray-500">
              ESMF Module – Grievance Redress Mechanism
            </p>
          </div>
          {activeTab === 'form' &&
          <StatusBadge value={headerStatus} size="md" />
          }
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
            label: 'Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="grievance-tab"
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
          
            <GrievanceForm
            onSubmit={handleAdd}
            onStatusChange={setHeaderStatus} />
          
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
          
            <GrievanceList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
const initialForm = {
  dateOfIntake: getTodayString(),
  modeOfFiling: '',
  modeOfFilingOthers: '',
  intakeLevel: '',
  grmSource: '',
  grmSourceOthers: '',
  firstName: '',
  middleInitial: '',
  surname: '',
  gender: '',
  contactNumber: '',
  emailAddress: '',
  ipStatus: '',
  designation: '',
  designationOtherAgencies: '',
  designationOthers: '',
  address: '',
  natureOfConcern: [] as string[],
  typeACategories: [] as string[],
  typeAOther: '',
  typeBCategory: '',
  typeBOther: '',
  typeCCategory: '',
  typeCOther: '',
  typeDCategory: '',
  typeDOther: '',
  typeECategory: '',
  typeEOther: '',
  specificDetails: '',
  dateOfIncident: '',
  timeOfIncident: '',
  locationOfIncident: '',
  desiredOutcome: '',
  desiredOutcomeDetails: '',
  areaForwardedTo: '',
  dateOfForwarding: '',
  dateOfReply: '',
  issuanceOfReply: '',
  closureDate: '',
  amountExecuted: 0,
  statusOfResolution: '',
  rateOfSatisfaction: '',
  nameOfIntakeOffice: '',
  designationClosure: ''
};
function GrievanceForm({
  onSubmit,
  onStatusChange



}: {onSubmit: (r: Omit<Grievance, 'id'>) => void;onStatusChange: (s: string) => void;}) {
  const [form, setForm] = useState(initialForm);
  const [banner, setBanner] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Auto-populated name of complainant
  const nameOfComplainant = useMemo(() => {
    return [form.firstName, form.middleInitial, form.surname].
    filter(Boolean).
    join(' ').
    trim();
  }, [form.firstName, form.middleInitial, form.surname]);
  // Auto-calculated days for processing
  const daysForProcessing = useMemo(() => {
    if (!form.dateOfIntake || !form.closureDate) return 0;
    const start = new Date(form.dateOfIntake);
    const end = new Date(form.closureDate);
    const diff = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff < 0 ? 0 : diff;
  }, [form.dateOfIntake, form.closureDate]);
  // Header status reflects state
  useEffect(() => {
    if (!form.modeOfFiling && !form.firstName) {
      onStatusChange('Draft');
      return;
    }
    if (form.statusOfResolution === 'On-going') onStatusChange('On-going');else
    if (form.statusOfResolution && form.statusOfResolution !== 'On-going')
    onStatusChange('Completed');else
    onStatusChange('Draft');
  }, [
  form.modeOfFiling,
  form.firstName,
  form.statusOfResolution,
  onStatusChange]
  );
  const updateField = (field: string, value: any) => {
    setForm((f) => ({
      ...f,
      [field]: value
    }));
    setErrors((e) => ({
      ...e,
      [field]: ''
    }));
  };
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const today = getTodayString();
    if (!form.dateOfIntake) errs.dateOfIntake = 'Date of Intake is required.';else
    if (form.dateOfIntake > today)
    errs.dateOfIntake = 'Date of Intake cannot be in the future.';
    if (!form.modeOfFiling) errs.modeOfFiling = 'Mode of Filing is required.';
    if (form.modeOfFiling === 'Others' && !form.modeOfFilingOthers.trim())
    errs.modeOfFilingOthers = 'Please specify the mode of filing.';
    if (!form.intakeLevel) errs.intakeLevel = 'Intake Level is required.';
    if (!form.grmSource) errs.grmSource = 'GRM Source is required.';
    if (form.grmSource === 'Others' && !form.grmSourceOthers.trim())
    errs.grmSourceOthers = 'Please specify the GRM source.';
    if (!form.firstName.trim()) errs.firstName = 'First Name is required.';
    if (!form.surname.trim()) errs.surname = 'Surname is required.';
    if (!form.gender) errs.gender = 'Gender is required.';
    if (
    form.emailAddress &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress))

    errs.emailAddress = 'Please enter a valid email address.';
    if (form.contactNumber && !/^[+\d\s\-()]{7,}$/.test(form.contactNumber))
    errs.contactNumber = 'Please enter a valid phone number.';
    if (!form.ipStatus) errs.ipStatus = 'IP / Non-IP is required.';
    if (!form.designation) errs.designation = 'Designation is required.';
    if (
    form.designation === 'Other Participating Agencies' &&
    !form.designationOtherAgencies.trim())

    errs.designationOtherAgencies = 'Please specify the agency.';
    if (form.designation === 'Others' && !form.designationOthers.trim())
    errs.designationOthers = 'Please specify the designation.';
    if (form.natureOfConcern.length === 0)
    errs.natureOfConcern = 'Please select at least one nature of concern.';
    if (form.natureOfConcern.includes('Type A: Questions or Recommendations')) {
      if (form.typeACategories.length === 0)
      errs.typeACategories = 'Please select Type A category.';
      if (
      form.typeACategories.includes('Other concerns') &&
      !form.typeAOther.trim())

      errs.typeAOther = 'Please specify other concerns.';
    }
    if (
    form.natureOfConcern.includes('Type B: Non-performance of obligation'))
    {
      if (!form.typeBCategory)
      errs.typeBCategory = 'Please select Type B category.';
      if (
      form.typeBCategory === 'Other concerns specify' &&
      !form.typeBOther.trim())

      errs.typeBOther = 'Please specify other concerns.';
    }
    if (
    form.natureOfConcern.includes(
      'Type C: Compliance with procurement and financial management guidelines'
    ))
    {
      if (!form.typeCCategory)
      errs.typeCCategory = 'Please select Type C category.';
      if (form.typeCCategory === 'Other concerns' && !form.typeCOther.trim())
      errs.typeCOther = 'Please specify other concerns.';
    }
    if (
    form.natureOfConcern.includes(
      'Type D: Compliance with DOH Primary Health Care Guidelines'
    ))
    {
      if (!form.typeDCategory)
      errs.typeDCategory = 'Please select Type D category.';
      if (form.typeDCategory === 'Other concerns' && !form.typeDOther.trim())
      errs.typeDOther = 'Please specify other concerns.';
    }
    if (
    form.natureOfConcern.includes(
      'Type E: Compliance with labor management procedures'
    ))
    {
      if (!form.typeECategory)
      errs.typeECategory = 'Please select Type E category.';
      if (form.typeECategory === 'Others' && !form.typeEOther.trim())
      errs.typeEOther = 'Please specify other concerns.';
    }
    if (!form.specificDetails.trim())
    errs.specificDetails = 'Specific details are required.';
    if (form.dateOfIncident && form.dateOfIncident > today)
    errs.dateOfIncident = 'Date of Incident cannot be in the future.';
    if (!form.desiredOutcome) errs.desiredOutcome = 'Please select an option.';
    if (form.desiredOutcome === 'Yes' && !form.desiredOutcomeDetails.trim())
    errs.desiredOutcomeDetails =
    'Please provide details of the desired outcome.';
    if (
    form.dateOfForwarding &&
    form.dateOfReply &&
    form.dateOfReply < form.dateOfForwarding)

    errs.dateOfReply =
    'Date of Reply cannot be earlier than Date of Forwarding.';
    if (form.closureDate) {
      if (form.dateOfIntake && form.closureDate < form.dateOfIntake)
      errs.closureDate = 'Closure Date cannot be earlier than Date of Intake.';
      if (form.issuanceOfReply && form.closureDate < form.issuanceOfReply)
      errs.closureDate =
      'Closure Date cannot be earlier than Issuance of Reply.';
    }
    if (form.amountExecuted < 0)
    errs.amountExecuted = 'Amount cannot be negative.';
    if (!form.statusOfResolution)
    errs.statusOfResolution = 'Status of Resolution is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const showBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(''), 2200);
  };
  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validate()) return;
    if (isDraft && !form.firstName.trim() && !form.surname.trim()) {
      setErrors({
        firstName: 'Please enter at least a name to save draft.'
      });
      return;
    }
    const record: Omit<Grievance, 'id'> = {
      ...form,
      nameOfComplainant,
      daysForProcessing,
      isDraft
    };
    onSubmit(record);
    setForm(initialForm);
    showBanner(
      isDraft ?
      'Draft saved successfully.' :
      'Grievance Intake Form has been submitted successfully.'
    );
  };
  // Helper: input class
  const inputCls = (err?: string, extra = '') =>
  `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all ${err ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} ${extra}`;
  const hasA = form.natureOfConcern.includes(
    'Type A: Questions or Recommendations'
  );
  const hasB = form.natureOfConcern.includes(
    'Type B: Non-performance of obligation'
  );
  const hasC = form.natureOfConcern.includes(
    'Type C: Compliance with procurement and financial management guidelines'
  );
  const hasD = form.natureOfConcern.includes(
    'Type D: Compliance with DOH Primary Health Care Guidelines'
  );
  const hasE = form.natureOfConcern.includes(
    'Type E: Compliance with labor management procedures'
  );
  return (
    <div className="space-y-5">
      <AnimatePresence>
        {banner &&
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
          className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          
            <CheckCircleIcon size={18} />
            {banner}
          </motion.div>
        }
      </AnimatePresence>

      {/* Section 1: Intake Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) => <CalendarIcon {...p} className="text-primary" />}
          color="bg-primary/10"
          title="Intake Information"
          subtitle="Date, mode of filing, and source" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Date of Intake <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              max={getTodayString()}
              value={form.dateOfIntake}
              onChange={(e) => updateField('dateOfIntake', e.target.value)}
              className={inputCls(errors.dateOfIntake)} />
            
            {errors.dateOfIntake &&
            <p className="text-xs text-red-500 mt-1">{errors.dateOfIntake}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Mode of Filing <span className="text-red-500">*</span>
            </label>
            <select
              value={form.modeOfFiling}
              onChange={(e) => updateField('modeOfFiling', e.target.value)}
              className={`${inputCls(errors.modeOfFiling)} bg-white`}>
              
              <option value="">Select mode of filing</option>
              {MODE_OF_FILING.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.modeOfFiling &&
            <p className="text-xs text-red-500 mt-1">{errors.modeOfFiling}</p>
            }
          </div>
          <AnimatePresence>
            {form.modeOfFiling === 'Others' &&
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
              className="sm:col-span-2 overflow-hidden">
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Mode of Filing - Others (Specify){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                value={form.modeOfFilingOthers}
                onChange={(e) =>
                updateField('modeOfFilingOthers', e.target.value)
                }
                placeholder="Specify other mode of filing"
                className={inputCls(errors.modeOfFilingOthers)} />
              
                {errors.modeOfFilingOthers &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.modeOfFilingOthers}
                  </p>
              }
              </motion.div>
            }
          </AnimatePresence>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Intake Level <span className="text-red-500">*</span>
            </label>
            <select
              value={form.intakeLevel}
              onChange={(e) => updateField('intakeLevel', e.target.value)}
              className={`${inputCls(errors.intakeLevel)} bg-white`}>
              
              <option value="">Select intake level</option>
              {INTAKE_LEVELS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.intakeLevel &&
            <p className="text-xs text-red-500 mt-1">{errors.intakeLevel}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              GRM Source <span className="text-red-500">*</span>
            </label>
            <select
              value={form.grmSource}
              onChange={(e) => updateField('grmSource', e.target.value)}
              className={`${inputCls(errors.grmSource)} bg-white`}>
              
              <option value="">Select GRM source</option>
              {GRM_SOURCES.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.grmSource &&
            <p className="text-xs text-red-500 mt-1">{errors.grmSource}</p>
            }
          </div>
          <AnimatePresence>
            {form.grmSource === 'Others' &&
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
              className="sm:col-span-2 overflow-hidden">
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  GRM Source - Others <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                value={form.grmSourceOthers}
                onChange={(e) =>
                updateField('grmSourceOthers', e.target.value)
                }
                placeholder="Specify other GRM source"
                className={inputCls(errors.grmSourceOthers)} />
              
                {errors.grmSourceOthers &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.grmSourceOthers}
                  </p>
              }
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Section 2: Complainant Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) => <UserIcon {...p} className="text-secondary" />}
          color="bg-secondary/10"
          title="Complainant / Sender Information"
          subtitle="Personal information and contact details" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="First name"
              className={inputCls(errors.firstName)} />
            
            {errors.firstName &&
            <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Middle Initial
            </label>
            <input
              type="text"
              value={form.middleInitial}
              onChange={(e) => updateField('middleInitial', e.target.value)}
              placeholder="M.I."
              maxLength={3}
              className={inputCls()} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Surname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.surname}
              onChange={(e) => updateField('surname', e.target.value)}
              placeholder="Surname"
              className={inputCls(errors.surname)} />
            
            {errors.surname &&
            <p className="text-xs text-red-500 mt-1">{errors.surname}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={form.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              className={`${inputCls(errors.gender)} bg-white`}>
              
              <option value="">Select gender</option>
              {GENDERS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.gender &&
            <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <PhoneIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => updateField('contactNumber', e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                className={`${inputCls(errors.contactNumber, 'pl-9')}`} />
              
            </div>
            {errors.contactNumber &&
            <p className="text-xs text-red-500 mt-1">
                {errors.contactNumber}
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <MailIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="email"
                value={form.emailAddress}
                onChange={(e) => updateField('emailAddress', e.target.value)}
                placeholder="name@example.com"
                className={`${inputCls(errors.emailAddress, 'pl-9')}`} />
              
            </div>
            {errors.emailAddress &&
            <p className="text-xs text-red-500 mt-1">{errors.emailAddress}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              IP / Non-IP <span className="text-red-500">*</span>
            </label>
            <select
              value={form.ipStatus}
              onChange={(e) => updateField('ipStatus', e.target.value)}
              className={`${inputCls(errors.ipStatus)} bg-white`}>
              
              <option value="">Select status</option>
              {IP_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.ipStatus &&
            <p className="text-xs text-red-500 mt-1">{errors.ipStatus}</p>
            }
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Designation of Complainant / Sender{' '}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={form.designation}
              onChange={(e) => updateField('designation', e.target.value)}
              className={`${inputCls(errors.designation)} bg-white`}>
              
              <option value="">Select designation</option>
              {DESIGNATIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.designation &&
            <p className="text-xs text-red-500 mt-1">{errors.designation}</p>
            }
          </div>
          <AnimatePresence>
            {form.designation === 'Other Participating Agencies' &&
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
              className="sm:col-span-3 overflow-hidden">
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Other Participating Agencies{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                value={form.designationOtherAgencies}
                onChange={(e) =>
                updateField('designationOtherAgencies', e.target.value)
                }
                placeholder="Specify the agency"
                className={inputCls(errors.designationOtherAgencies)} />
              
                {errors.designationOtherAgencies &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.designationOtherAgencies}
                  </p>
              }
              </motion.div>
            }
            {form.designation === 'Others' &&
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
              className="sm:col-span-3 overflow-hidden">
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Designation - Others <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                value={form.designationOthers}
                onChange={(e) =>
                updateField('designationOthers', e.target.value)
                }
                placeholder="Specify the designation"
                className={inputCls(errors.designationOthers)} />
              
                {errors.designationOthers &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.designationOthers}
                  </p>
              }
              </motion.div>
            }
          </AnimatePresence>
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Address, Barangay, Municipality, Province
            </label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Enter full address"
              className={`${inputCls()} resize-none`} />
            
          </div>
        </div>
      </div>

      {/* Section 3: Details of the Issue / Concern */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) =>
          <FileWarningIcon {...p} className="text-rose-600" />
          }
          color="bg-rose-50"
          title="Details of the Issue / Concern"
          subtitle="Nature, categories, and specifics of the concern" />
        
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <MultiSelect
            label="Nature of Issue / Concern"
            options={NATURE_TYPES}
            selected={form.natureOfConcern}
            onChange={(v) => updateField('natureOfConcern', v)}
            placeholder="Select one or more concern types..."
            error={errors.natureOfConcern}
            required />
          
        </div>
      </div>

      {/* Conditional Type A Card */}
      <AnimatePresence>
        {hasA &&
        <motion.div
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
          className="bg-white rounded-xl shadow-sm border border-gray-100">
          
            <CardHeader
            icon={(p: any) =>
            <FileWarningIcon {...p} className="text-purple-600" />
            }
            color="bg-purple-50"
            title="Type A Concerns"
            subtitle="Questions or Recommendations" />
          
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <MultiSelect
              label="Category of Concerns - Type A"
              options={TYPE_A_CATEGORIES}
              selected={form.typeACategories}
              onChange={(v) => updateField('typeACategories', v)}
              placeholder="Select Type A categories..."
              error={errors.typeACategories}
              required />
            
              <AnimatePresence>
                {form.typeACategories.includes('Other concerns') &&
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
                className="overflow-hidden">
                
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Type A - Other Concerns{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                  type="text"
                  value={form.typeAOther}
                  onChange={(e) =>
                  updateField('typeAOther', e.target.value)
                  }
                  placeholder="Specify other concerns"
                  className={inputCls(errors.typeAOther)} />
                
                    {errors.typeAOther &&
                <p className="text-xs text-red-500 mt-1">
                        {errors.typeAOther}
                      </p>
                }
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Conditional Type B Card */}
      <AnimatePresence>
        {hasB &&
        <motion.div
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
          className="bg-white rounded-xl shadow-sm border border-gray-100">
          
            <CardHeader
            icon={(p: any) =>
            <FileWarningIcon {...p} className="text-orange-600" />
            }
            color="bg-orange-50"
            title="Type B Concerns"
            subtitle="Non-performance of obligation" />
          
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Category of Concerns - Type B{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                value={form.typeBCategory}
                onChange={(e) => updateField('typeBCategory', e.target.value)}
                className={`${inputCls(errors.typeBCategory)} bg-white`}>
                
                  <option value="">Select Type B category</option>
                  {TYPE_B_CATEGORIES.map((o) =>
                <option key={o} value={o}>
                      {o}
                    </option>
                )}
                </select>
                {errors.typeBCategory &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.typeBCategory}
                  </p>
              }
              </div>
              <AnimatePresence>
                {form.typeBCategory === 'Other concerns specify' &&
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
                className="overflow-hidden">
                
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Type B - Other Concerns{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                  type="text"
                  value={form.typeBOther}
                  onChange={(e) =>
                  updateField('typeBOther', e.target.value)
                  }
                  placeholder="Specify other concerns"
                  className={inputCls(errors.typeBOther)} />
                
                    {errors.typeBOther &&
                <p className="text-xs text-red-500 mt-1">
                        {errors.typeBOther}
                      </p>
                }
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Conditional Type C Card */}
      <AnimatePresence>
        {hasC &&
        <motion.div
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
          className="bg-white rounded-xl shadow-sm border border-gray-100">
          
            <CardHeader
            icon={(p: any) =>
            <FileWarningIcon {...p} className="text-red-600" />
            }
            color="bg-red-50"
            title="Type C Concerns"
            subtitle="Procurement and financial management" />
          
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Category of Concerns - Type C{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                value={form.typeCCategory}
                onChange={(e) => updateField('typeCCategory', e.target.value)}
                className={`${inputCls(errors.typeCCategory)} bg-white`}>
                
                  <option value="">Select Type C category</option>
                  {TYPE_C_CATEGORIES.map((o) =>
                <option key={o} value={o}>
                      {o}
                    </option>
                )}
                </select>
                {errors.typeCCategory &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.typeCCategory}
                  </p>
              }
              </div>
              <AnimatePresence>
                {form.typeCCategory === 'Other concerns' &&
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
                className="overflow-hidden">
                
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Type C - Other Concerns{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                  type="text"
                  value={form.typeCOther}
                  onChange={(e) =>
                  updateField('typeCOther', e.target.value)
                  }
                  placeholder="Specify other concerns"
                  className={inputCls(errors.typeCOther)} />
                
                    {errors.typeCOther &&
                <p className="text-xs text-red-500 mt-1">
                        {errors.typeCOther}
                      </p>
                }
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Conditional Type D Card */}
      <AnimatePresence>
        {hasD &&
        <motion.div
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
          className="bg-white rounded-xl shadow-sm border border-gray-100">
          
            <CardHeader
            icon={(p: any) =>
            <FileWarningIcon {...p} className="text-teal-600" />
            }
            color="bg-teal-50"
            title="Type D Concerns"
            subtitle="DOH Primary Health Care Guidelines" />
          
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Category of Concerns - Type D{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                value={form.typeDCategory}
                onChange={(e) => updateField('typeDCategory', e.target.value)}
                className={`${inputCls(errors.typeDCategory)} bg-white`}>
                
                  <option value="">Select Type D category</option>
                  {TYPE_D_CATEGORIES.map((o) =>
                <option key={o} value={o}>
                      {o}
                    </option>
                )}
                </select>
                {errors.typeDCategory &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.typeDCategory}
                  </p>
              }
              </div>
              <AnimatePresence>
                {form.typeDCategory === 'Other concerns' &&
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
                className="overflow-hidden">
                
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Type D - Other Concerns{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                  type="text"
                  value={form.typeDOther}
                  onChange={(e) =>
                  updateField('typeDOther', e.target.value)
                  }
                  placeholder="Specify other concerns"
                  className={inputCls(errors.typeDOther)} />
                
                    {errors.typeDOther &&
                <p className="text-xs text-red-500 mt-1">
                        {errors.typeDOther}
                      </p>
                }
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Conditional Type E Card */}
      <AnimatePresence>
        {hasE &&
        <motion.div
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
          className="bg-white rounded-xl shadow-sm border border-gray-100">
          
            <CardHeader
            icon={(p: any) =>
            <FileWarningIcon {...p} className="text-indigo-600" />
            }
            color="bg-indigo-50"
            title="Type E Concerns"
            subtitle="Labor management procedures" />
          
            <div className="space-y-4 p-5 sm:p-6 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Category of Concerns - Type E{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                value={form.typeECategory}
                onChange={(e) => updateField('typeECategory', e.target.value)}
                className={`${inputCls(errors.typeECategory)} bg-white`}>
                
                  <option value="">Select Type E category</option>
                  {TYPE_E_CATEGORIES.map((o) =>
                <option key={o} value={o}>
                      {o}
                    </option>
                )}
                </select>
                {errors.typeECategory &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.typeECategory}
                  </p>
              }
              </div>
              <AnimatePresence>
                {form.typeECategory === 'Others' &&
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
                className="overflow-hidden">
                
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Type E - Other Concerns{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                  type="text"
                  value={form.typeEOther}
                  onChange={(e) =>
                  updateField('typeEOther', e.target.value)
                  }
                  placeholder="Specify other concerns"
                  className={inputCls(errors.typeEOther)} />
                
                    {errors.typeEOther &&
                <p className="text-xs text-red-500 mt-1">
                        {errors.typeEOther}
                      </p>
                }
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Incident Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) => <MapPinIcon {...p} className="text-green-600" />}
          color="bg-green-50"
          title="Incident Details"
          subtitle="When, where, and what happened" />
        
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Provide Specific Details of the Concern / Issue / Report{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={form.specificDetails}
              onChange={(e) => updateField('specificDetails', e.target.value)}
              placeholder="Describe the issue, concern, incident, or report in detail."
              className={`${inputCls(errors.specificDetails)} resize-none`} />
            
            {errors.specificDetails &&
            <p className="text-xs text-red-500 mt-1">
                {errors.specificDetails}
              </p>
            }
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Date of Incident
              </label>
              <input
                type="date"
                max={getTodayString()}
                value={form.dateOfIncident}
                onChange={(e) => updateField('dateOfIncident', e.target.value)}
                className={inputCls(errors.dateOfIncident)} />
              
              {errors.dateOfIncident &&
              <p className="text-xs text-red-500 mt-1">
                  {errors.dateOfIncident}
                </p>
              }
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Time of Incident
              </label>
              <input
                type="time"
                value={form.timeOfIncident}
                onChange={(e) => updateField('timeOfIncident', e.target.value)}
                className={inputCls()} />
              
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Location of Incident
            </label>
            <textarea
              rows={2}
              value={form.locationOfIncident}
              onChange={(e) =>
              updateField('locationOfIncident', e.target.value)
              }
              placeholder="House number, street, barangay, municipality, region."
              className={`${inputCls()} resize-none`} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Is there an outcome you would like in the resolution of the
              concern that you have filed?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {['Yes', 'No'].map((opt) =>
              <label
                key={opt}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${form.desiredOutcome === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                
                  <input
                  type="radio"
                  name="desiredOutcome"
                  value={opt}
                  checked={form.desiredOutcome === opt}
                  onChange={(e) =>
                  updateField('desiredOutcome', e.target.value)
                  }
                  className="sr-only" />
                
                  <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.desiredOutcome === opt ? 'border-primary' : 'border-gray-300'}`}>
                  
                    {form.desiredOutcome === opt &&
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  }
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              )}
            </div>
            {errors.desiredOutcome &&
            <p className="text-xs text-red-500 mt-1">
                {errors.desiredOutcome}
              </p>
            }
          </div>
          <AnimatePresence>
            {form.desiredOutcome === 'Yes' &&
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
              className="overflow-hidden">
              
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  If yes, please provide details{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                rows={3}
                value={form.desiredOutcomeDetails}
                onChange={(e) =>
                updateField('desiredOutcomeDetails', e.target.value)
                }
                placeholder="Describe the desired outcome..."
                className={`${inputCls(errors.desiredOutcomeDetails)} resize-none`} />
              
                {errors.desiredOutcomeDetails &&
              <p className="text-xs text-red-500 mt-1">
                    {errors.desiredOutcomeDetails}
                  </p>
              }
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Section 4: Forwarded Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) => <SendIcon {...p} className="text-amber-600" />}
          color="bg-amber-50"
          title="Forwarded Details"
          subtitle="Routing of the grievance" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Area Forwarded To
            </label>
            <input
              type="text"
              value={form.areaForwardedTo}
              onChange={(e) => updateField('areaForwardedTo', e.target.value)}
              placeholder="e.g. RPMO Region IV-A"
              className={inputCls()} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Date of Forwarding
            </label>
            <input
              type="date"
              value={form.dateOfForwarding}
              onChange={(e) => updateField('dateOfForwarding', e.target.value)}
              className={inputCls()} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Date of Reply from the Area
            </label>
            <input
              type="date"
              value={form.dateOfReply}
              onChange={(e) => updateField('dateOfReply', e.target.value)}
              className={inputCls(errors.dateOfReply)} />
            
            {errors.dateOfReply &&
            <p className="text-xs text-red-500 mt-1">{errors.dateOfReply}</p>
            }
          </div>
        </div>
      </div>

      {/* Section 5: Case Closure */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          icon={(p: any) =>
          <CircleCheckBigIcon {...p} className="text-indigo-600" />
          }
          color="bg-indigo-50"
          title="Case Closure"
          subtitle="Resolution and closure details" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Issuance of Reply to Complainant
            </label>
            <input
              type="date"
              value={form.issuanceOfReply}
              onChange={(e) => updateField('issuanceOfReply', e.target.value)}
              className={inputCls()} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Closure Date
            </label>
            <input
              type="date"
              value={form.closureDate}
              onChange={(e) => updateField('closureDate', e.target.value)}
              className={inputCls(errors.closureDate)} />
            
            {errors.closureDate &&
            <p className="text-xs text-red-500 mt-1">{errors.closureDate}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Days for Processing
            </label>
            <input
              type="number"
              value={daysForProcessing}
              readOnly
              className={`${inputCls()} bg-gray-50 text-gray-700 cursor-not-allowed`} />
            
            <p className="text-xs text-gray-400 mt-1">
              Auto-calculated: Date of Intake → Closure Date
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Status of Resolution <span className="text-red-500">*</span>
            </label>
            <select
              value={form.statusOfResolution}
              onChange={(e) =>
              updateField('statusOfResolution', e.target.value)
              }
              className={`${inputCls(errors.statusOfResolution)} bg-white`}>
              
              <option value="">Select status</option>
              {RESOLUTION_STATUS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
            {errors.statusOfResolution &&
            <p className="text-xs text-red-500 mt-1">
                {errors.statusOfResolution}
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Rate of Satisfaction
            </label>
            <select
              value={form.rateOfSatisfaction}
              onChange={(e) =>
              updateField('rateOfSatisfaction', e.target.value)
              }
              className={`${inputCls()} bg-white`}>
              
              <option value="">Select rating</option>
              {SATISFACTION_OPTIONS.map((o) =>
              <option key={o} value={o}>
                  {o}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Amount Executed for Case Processing
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₱
              </span>
              <input
                type="number"
                min="0"
                value={form.amountExecuted || ''}
                onChange={(e) =>
                updateField('amountExecuted', parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                className={`${inputCls(errors.amountExecuted, 'pl-7')}`} />
              
            </div>
            {errors.amountExecuted &&
            <p className="text-xs text-red-500 mt-1">
                {errors.amountExecuted}
              </p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Name of Intake Office
            </label>
            <input
              type="text"
              value={form.nameOfIntakeOffice}
              onChange={(e) =>
              updateField('nameOfIntakeOffice', e.target.value)
              }
              placeholder="e.g. MPMO Calamba"
              className={inputCls()} />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Designation
            </label>
            <input
              type="text"
              value={form.designationClosure}
              onChange={(e) =>
              updateField('designationClosure', e.target.value)
              }
              placeholder="Designation of intake officer"
              className={inputCls()} />
            
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Name of Complainant / Sender
            </label>
            <input
              type="text"
              value={nameOfComplainant}
              readOnly
              placeholder="Auto-populated from name fields above"
              className={`${inputCls()} bg-gray-50 text-gray-700 cursor-not-allowed`} />
            
            <p className="text-xs text-gray-400 mt-1">
              Auto-populated from First Name + Middle Initial + Surname (used as
              name in lieu of signature)
            </p>
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
function GrievanceList({
  records,
  searchQuery,
  onSearch




}: {records: Grievance[];searchQuery: string;onSearch: (q: string) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<Grievance | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: Grievance): SectionDef[] {
    const status = getOverallStatus(r);
    const statusColor =
    status === 'Draft' ?
    'bg-amber-50 text-amber-700' :
    status === 'Completed' ?
    'bg-green-50 text-green-700' :
    status === 'On-going' ?
    'bg-secondary-50 text-secondary' :
    'bg-blue-50 text-blue-700';
    return [
    {
      title: 'Intake Information',
      fields: [
      {
        label: 'Date of Intake',
        value: r.dateOfIntake
      },
      {
        label: 'Mode of Filing',
        value:
        r.modeOfFiling + (
        r.modeOfFilingOthers ? ` — ${r.modeOfFilingOthers}` : '')
      },
      {
        label: 'Intake Level',
        value: r.intakeLevel
      },
      {
        label: 'GRM Source',
        value:
        r.grmSource + (
        r.grmSourceOthers ? ` — ${r.grmSourceOthers}` : '')
      },
      {
        label: 'Status',
        value: status,
        type: 'badge' as const,
        badgeColor: statusColor
      }]

    },
    {
      title: 'Complainant / Sender',
      fields: [
      {
        label: 'Name',
        value: r.nameOfComplainant
      },
      {
        label: 'Gender',
        value: r.gender
      },
      {
        label: 'Contact Number',
        value: r.contactNumber || '—'
      },
      {
        label: 'Email Address',
        value: r.emailAddress || '—'
      },
      {
        label: 'IP / Non-IP',
        value: r.ipStatus
      },
      {
        label: 'Designation',
        value:
        r.designation + (
        r.designationOtherAgencies ?
        ` — ${r.designationOtherAgencies}` :
        '') + (
        r.designationOthers ? ` — ${r.designationOthers}` : '')
      },
      {
        label: 'Address',
        value: r.address || '—'
      }]

    },
    {
      title: 'Concern Details',
      fields: [
      {
        label: 'Nature of Concern',
        value: r.natureOfConcern.join(', ') || '—'
      },
      ...(r.typeACategories.length ?
      [
      {
        label: 'Type A Categories',
        value:
        r.typeACategories.join(', ') + (
        r.typeAOther ? ` — ${r.typeAOther}` : '')
      }] :

      []),
      ...(r.typeBCategory ?
      [
      {
        label: 'Type B Category',
        value:
        r.typeBCategory + (
        r.typeBOther ? ` — ${r.typeBOther}` : '')
      }] :

      []),
      ...(r.typeCCategory ?
      [
      {
        label: 'Type C Category',
        value:
        r.typeCCategory + (
        r.typeCOther ? ` — ${r.typeCOther}` : '')
      }] :

      []),
      ...(r.typeDCategory ?
      [
      {
        label: 'Type D Category',
        value:
        r.typeDCategory + (
        r.typeDOther ? ` — ${r.typeDOther}` : '')
      }] :

      []),
      ...(r.typeECategory ?
      [
      {
        label: 'Type E Category',
        value:
        r.typeECategory + (
        r.typeEOther ? ` — ${r.typeEOther}` : '')
      }] :

      []),
      {
        label: 'Specific Details',
        value: r.specificDetails || '—'
      },
      {
        label: 'Date / Time of Incident',
        value: r.dateOfIncident ?
        `${r.dateOfIncident}${r.timeOfIncident ? ' at ' + r.timeOfIncident : ''}` :
        '—'
      },
      {
        label: 'Location of Incident',
        value: r.locationOfIncident || '—'
      },
      {
        label: 'Desired Outcome',
        value:
        r.desiredOutcome + (
        r.desiredOutcomeDetails ? ` — ${r.desiredOutcomeDetails}` : '')
      }]

    },
    {
      title: 'Forwarded Details',
      fields: [
      {
        label: 'Area Forwarded To',
        value: r.areaForwardedTo || '—'
      },
      {
        label: 'Date of Forwarding',
        value: r.dateOfForwarding || '—'
      },
      {
        label: 'Date of Reply',
        value: r.dateOfReply || '—'
      }]

    },
    {
      title: 'Case Closure',
      fields: [
      {
        label: 'Issuance of Reply',
        value: r.issuanceOfReply || '—'
      },
      {
        label: 'Closure Date',
        value: r.closureDate || '—'
      },
      {
        label: 'Days for Processing',
        value: String(r.daysForProcessing)
      },
      {
        label: 'Status of Resolution',
        value: r.statusOfResolution || '—'
      },
      {
        label: 'Rate of Satisfaction',
        value: r.rateOfSatisfaction || '—'
      },
      {
        label: 'Amount Executed',
        value: r.amountExecuted ?
        `₱ ${r.amountExecuted.toLocaleString()}` :
        '—'
      },
      {
        label: 'Name of Intake Office',
        value: r.nameOfIntakeOffice || '—'
      },
      {
        label: 'Designation',
        value: r.designationClosure || '—'
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title={viewRecord ? viewRecord.nameOfComplainant : 'Grievance Details'}
        subtitle={
        viewRecord ?
        `${viewRecord.dateOfIntake} — ${viewRecord.modeOfFiling}` :
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
            placeholder="Search grievances..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date of Intake
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Complainant
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mode
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Level
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
                  {r.dateOfIntake}
                </td>
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors max-w-[200px] truncate">
                  {r.nameOfComplainant}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{r.modeOfFiling}</td>
                <td className="px-4 py-3.5 text-gray-600">{r.intakeLevel}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge value={getOverallStatus(r)} />
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
                
                  No grievance records found
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
                {r.nameOfComplainant}
              </span>
              <span className="text-xs text-gray-400">{r.dateOfIntake}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{r.modeOfFiling}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{r.intakeLevel}</span>
              <StatusBadge value={getOverallStatus(r)} />
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
            No grievance records found
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