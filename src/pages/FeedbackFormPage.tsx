import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MessageSquareIcon,
  CircleCheckBigIcon,
  RotateCcwIcon,
  SendIcon,
  LockIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { useAppContext } from '../context/AppContext';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
const PAGE_SIZE = 8;
const IP_OPTIONS = ['Indigenous People (IP)', 'Non-IP'];
const GENDER_OPTIONS = ['Male', 'Female'];
const DESIGNATION_OPTIONS = [
'Project Beneficiary',
'Barangay Health Worker',
'Barangay Officials / Staff',
'Member of any Indigenous Group',
'Provincial Staff',
'Regional Staff',
'National Staff',
'Municipal Staff',
'Other Participating Agencies',
'Others'];

const FEEDBACK_TYPES = [
'Complaint',
'Recommendation',
'Inquiry',
'Compliment / Positive Feedback',
'General Feedback'];

interface PffRecord {
  id: number;
  grievanceId: string;
  dateOfFiling: string;
  anonymous: boolean;
  firstName: string;
  middleInitial: string;
  surname: string;
  contactNumber: string;
  ipStatus: string;
  gender: string;
  email: string;
  designation: string;
  address: string;
  feedbackType: string;
  dateOfIncident: string;
  timeOfIncident: string;
  locationOfIncident: string;
  specificDetails: string;
  outcomeExpected: boolean;
  outcomeExpectedDetails: string;
  recommendationDetails: string;
}
const EMPTY_FORM = {
  dateOfFiling: '',
  anonymous: false,
  firstName: '',
  middleInitial: '',
  surname: '',
  contactNumber: '',
  ipStatus: '',
  gender: '',
  email: '',
  designation: '',
  address: '',
  feedbackType: '',
  dateOfIncident: '',
  timeOfIncident: '',
  locationOfIncident: '',
  specificDetails: '',
  outcomeExpected: false,
  outcomeExpectedDetails: '',
  recommendationDetails: ''
};
function genGrievanceId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `PFF-${year}-${rand}`;
}
function loadRecords(): PffRecord[] {
  return storageGet<PffRecord[]>(KEYS.PFF, SEED);
}
function saveRecords(records: PffRecord[]): void {
  storageSet(KEYS.PFF, records);
}
const SEED: PffRecord[] = [
{
  id: 1,
  grievanceId: 'PFF-2026-204815',
  dateOfFiling: '2026-04-02',
  anonymous: false,
  firstName: 'Maria',
  middleInitial: 'L',
  surname: 'Santos',
  contactNumber: '+63 917 555 1234',
  ipStatus: 'Non-IP',
  gender: 'Female',
  email: 'maria.santos@example.com',
  designation: 'Barangay Health Worker',
  address: 'Brgy. 5, Laoag City, Ilocos Norte',
  feedbackType: 'Recommendation',
  dateOfIncident: '',
  timeOfIncident: '',
  locationOfIncident: '',
  specificDetails:
  'Suggest scheduling weighing sessions earlier in the morning to improve attendance among working parents.',
  outcomeExpected: true,
  outcomeExpectedDetails:
  'Adjust the monthly weighing schedule to 7:00–9:00 AM.',
  recommendationDetails:
  'Earlier sessions would greatly help working caregivers participate.'
},
{
  id: 2,
  grievanceId: 'PFF-2026-118702',
  dateOfFiling: '2026-05-18',
  anonymous: true,
  firstName: '',
  middleInitial: '',
  surname: '',
  contactNumber: '',
  ipStatus: 'Non-IP',
  gender: 'Male',
  email: '',
  designation: 'Project Beneficiary',
  address: 'Brgy. 12, Batac City, Ilocos Norte',
  feedbackType: 'Complaint',
  dateOfIncident: '2026-05-15',
  timeOfIncident: '10:30',
  locationOfIncident: 'RHU, Batac City',
  specificDetails:
  'Long waiting times at the health center during distribution of micronutrient supplements.',
  outcomeExpected: true,
  outcomeExpectedDetails:
  'Add a dedicated queue/window for supplement distribution.',
  recommendationDetails: ''
}];

/* ---------------- Reusable ---------------- */
function RequiredMark() {
  return <span className="text-red-500 ml-0.5">*</span>;
}
function InlineError({ msg }: {msg?: string;}) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-600">{msg}</p>;
}
function Helper({ text }: {text: string;}) {
  return <p className="mt-1.5 text-xs text-gray-500">{text}</p>;
}
interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  headerBg: string;
  children: React.ReactNode;
}
function SectionCard({
  title,
  subtitle,
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
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle &&
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          }
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>);

}
const INPUT_CLS =
'w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300';
interface FieldProps {
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
}: FieldProps) {
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
export function FeedbackFormPage() {
  const { selectedBarangay } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [records, setRecords] = useState<PffRecord[]>([]);
  const [grievanceId, setGrievanceId] = useState<string>(() => genGrievanceId());
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<PffRecord | null>(null);
  useEffect(() => {
    setRecords(loadRecords());
  }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 5000);
    return () => clearTimeout(t);
  }, [notification]);
  const update = useCallback(
    (key: keyof typeof EMPTY_FORM, val: string | boolean) => {
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
    if (!form.dateOfFiling) e.dateOfFiling = 'Date of filing is required.';
    if (!form.feedbackType) e.feedbackType = 'Feedback type is required.';
    if (!form.specificDetails.trim())
    e.specificDetails = 'Specific details are required.';
    if (!form.anonymous) {
      if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      {
        e.email = 'Enter a valid email address.';
      }
      if (
      form.contactNumber.trim() &&
      !/^[+0-9()\-\s]{7,20}$/.test(form.contactNumber.trim()))
      {
        e.contactNumber = 'Enter a valid phone number.';
      }
    }
    return e;
  };
  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setGrievanceId(genGrievanceId());
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
  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      scrollToError(e);
      return;
    }
    const rec: PffRecord = {
      id: Date.now(),
      grievanceId,
      ...form,
      // wipe personal fields if anonymous
      firstName: form.anonymous ? '' : form.firstName,
      middleInitial: form.anonymous ? '' : form.middleInitial,
      surname: form.anonymous ? '' : form.surname,
      contactNumber: form.anonymous ? '' : form.contactNumber,
      email: form.anonymous ? '' : form.email,
      outcomeExpectedDetails: form.outcomeExpected ?
      form.outcomeExpectedDetails :
      ''
    };
    const next = [rec, ...records];
    setRecords(next);
    saveRecords(next);
    setNotification(
      `Your feedback has been submitted successfully. Your grievance ID is ${grievanceId}.`
    );
    handleReset();
  };
  /* ---------------- List view ---------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
      r.grievanceId.toLowerCase().includes(q) ||
      r.feedbackType.toLowerCase().includes(q) ||
      r.dateOfFiling.toLowerCase().includes(q) ||
      !r.anonymous &&
      `${r.firstName} ${r.surname}`.toLowerCase().includes(q)
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
    title: 'I. Complainant / Sender Information',
    fields: [
    {
      label: 'Grievance ID',
      value: viewing.grievanceId
    },
    {
      label: 'Date of Filing',
      value: viewing.dateOfFiling
    },
    {
      label: 'Anonymous',
      value: viewing.anonymous ? 'Yes' : 'No'
    },
    ...(viewing.anonymous ?
    [] :
    [
    {
      label: 'Name',
      value: [
      viewing.firstName,
      viewing.middleInitial,
      viewing.surname].

      filter(Boolean).
      join(' ')
    },
    {
      label: 'Contact Number',
      value: viewing.contactNumber
    },
    {
      label: 'Email Address',
      value: viewing.email
    }]),

    {
      label: 'IP / Non-IP',
      value: viewing.ipStatus
    },
    {
      label: 'Gender',
      value: viewing.gender
    },
    {
      label: 'Designation',
      value: viewing.designation
    },
    {
      label: 'Address',
      value: viewing.address
    }]

  },
  {
    title: 'II. Feedback Details',
    fields: [
    {
      label: 'Feedback Type',
      value: viewing.feedbackType
    },
    {
      label: 'Date of Incident',
      value: viewing.dateOfIncident
    },
    {
      label: 'Time of Incident',
      value: viewing.timeOfIncident
    },
    {
      label: 'Location of Incident',
      value: viewing.locationOfIncident
    },
    {
      label: 'Specific Details',
      value: viewing.specificDetails
    },
    {
      label: 'Outcome Expected',
      value: viewing.outcomeExpected ? 'Yes' : 'No'
    },
    ...(viewing.outcomeExpected ?
    [
    {
      label: 'Outcome Expected Details',
      value: viewing.outcomeExpectedDetails
    }] :

    []),
    {
      label: 'Recommendation / Compliment Details',
      value: viewing.recommendationDetails
    }]

  }] :

  [];
  const showPersonal = !form.anonymous;
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
              <span>ESMF</span>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-900">
                PMNP Feedback Form
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              PMNP Feedback Form
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              National, Regional, Municipality, Barangay · General population
            </p>
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
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
            
              <CircleCheckBigIcon className="w-5 h-5 text-green-600 mr-3 shrink-0 mt-0.5" />
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
            label: 'Feedback Form'
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
              layoutId="pff-tab"
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
            {/* Section I */}
            <SectionCard
            title="I. Complainant / Sender Information"
            icon={<UserIcon className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
            headerBg="bg-blue-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                label="Grievance ID"
                helper="Auto-generated to track each grievance.">
                
                  <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 flex items-center justify-between font-mono">
                    <span>{grievanceId}</span>
                    <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </Field>

                <Field
                id="field-dateOfFiling"
                label="Date of Filing"
                required
                error={errors.dateOfFiling}>
                
                  <input
                  type="date"
                  value={form.dateOfFiling}
                  onChange={(e) => update('dateOfFiling', e.target.value)}
                  className={`${INPUT_CLS} ${errors.dateOfFiling ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                {/* Anonymous */}
                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(e) => update('anonymous', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#F68E22] focus:ring-orange-300" />
                  
                    <span className="text-sm font-medium text-gray-700">
                      Submit anonymously
                    </span>
                  </label>
                  <Helper text="If checked, your name and contact details will be hidden and not stored." />
                </div>

                <AnimatePresence initial={false}>
                  {showPersonal &&
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
                  className="overflow-hidden md:col-span-2">
                  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <Field label="First Name">
                          <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                        update('firstName', e.target.value)
                        }
                        placeholder="First name"
                        className={`${INPUT_CLS} border-gray-200`} />
                      
                        </Field>
                        <Field label="Middle Initial">
                          <input
                        type="text"
                        value={form.middleInitial}
                        onChange={(e) =>
                        update('middleInitial', e.target.value)
                        }
                        placeholder="M.I."
                        className={`${INPUT_CLS} border-gray-200`} />
                      
                        </Field>
                        <Field label="Surname">
                          <input
                        type="text"
                        value={form.surname}
                        onChange={(e) => update('surname', e.target.value)}
                        placeholder="Surname"
                        className={`${INPUT_CLS} border-gray-200`} />
                      
                        </Field>
                        <Field
                      id="field-contactNumber"
                      label="Contact Number"
                      error={errors.contactNumber}>
                      
                          <input
                        type="tel"
                        value={form.contactNumber}
                        onChange={(e) =>
                        update('contactNumber', e.target.value)
                        }
                        placeholder="+63 9XX XXX XXXX"
                        className={`${INPUT_CLS} ${errors.contactNumber ? 'border-red-300' : 'border-gray-200'}`} />
                      
                        </Field>
                        <Field
                      id="field-email"
                      label="Email Address"
                      error={errors.email}
                      className="md:col-span-2">
                      
                          <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="name@example.com"
                        className={`${INPUT_CLS} ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                      
                        </Field>
                      </div>
                    </motion.div>
                }
                </AnimatePresence>

                <Field label="IP / Non-IP">
                  <select
                  value={form.ipStatus}
                  onChange={(e) => update('ipStatus', e.target.value)}
                  className={`${INPUT_CLS} border-gray-200`}>
                  
                    <option value="">Select</option>
                    {IP_OPTIONS.map((o) =>
                  <option key={o} value={o}>
                        {o}
                      </option>
                  )}
                  </select>
                </Field>

                <Field label="Gender">
                  <select
                  value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}
                  className={`${INPUT_CLS} border-gray-200`}>
                  
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map((o) =>
                  <option key={o} value={o}>
                        {o}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                label="Designation of Complainant / Sender"
                className="md:col-span-2">
                
                  <select
                  value={form.designation}
                  onChange={(e) => update('designation', e.target.value)}
                  className={`${INPUT_CLS} border-gray-200`}>
                  
                    <option value="">Select designation</option>
                    {DESIGNATION_OPTIONS.map((o) =>
                  <option key={o} value={o}>
                        {o}
                      </option>
                  )}
                  </select>
                </Field>

                <Field
                label="Address (Barangay, Municipality, Province)"
                className="md:col-span-2">
                
                  <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Brgy., Municipality, Province"
                  className={`${INPUT_CLS} border-gray-200`} />
                
                </Field>
              </div>
            </SectionCard>

            {/* Section II */}
            <SectionCard
            title="II. Feedback Details"
            subtitle="For comments, feedback, incidents, complaints, and recommendations to the Philippine Multisectoral Nutrition Project."
            icon={<MessageSquareIcon className="w-5 h-5 text-orange-600" />}
            iconBg="bg-orange-100"
            headerBg="bg-orange-50/60">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Field
                id="field-feedbackType"
                label="Feedback Type"
                required
                error={errors.feedbackType}
                className="md:col-span-2">
                
                  <select
                  value={form.feedbackType}
                  onChange={(e) => update('feedbackType', e.target.value)}
                  className={`${INPUT_CLS} ${errors.feedbackType ? 'border-red-300' : 'border-gray-200'}`}>
                  
                    <option value="">Select feedback type</option>
                    {FEEDBACK_TYPES.map((o) =>
                  <option key={o} value={o}>
                        {o}
                      </option>
                  )}
                  </select>
                </Field>

                <Field label="Date of Incident" helper="If relevant.">
                  <input
                  type="date"
                  value={form.dateOfIncident}
                  onChange={(e) => update('dateOfIncident', e.target.value)}
                  className={`${INPUT_CLS} border-gray-200`} />
                
                </Field>

                <Field label="Time of Incident" helper="If relevant.">
                  <input
                  type="time"
                  value={form.timeOfIncident}
                  onChange={(e) => update('timeOfIncident', e.target.value)}
                  className={`${INPUT_CLS} border-gray-200`} />
                
                </Field>

                <Field
                label="Location of Incident"
                helper="If relevant, e.g. House #, Street, Barangay, Municipality, Region."
                className="md:col-span-2">
                
                  <input
                  type="text"
                  value={form.locationOfIncident}
                  onChange={(e) =>
                  update('locationOfIncident', e.target.value)
                  }
                  placeholder="Location of incident"
                  className={`${INPUT_CLS} border-gray-200`} />
                
                </Field>

                <Field
                id="field-specificDetails"
                label="Specific Details of the Concern / Issue / Report"
                required
                error={errors.specificDetails}
                className="md:col-span-2">
                
                  <textarea
                  rows={5}
                  value={form.specificDetails}
                  onChange={(e) => update('specificDetails', e.target.value)}
                  placeholder="Provide a detailed description of your concern, issue, or report."
                  className={`${INPUT_CLS} resize-none ${errors.specificDetails ? 'border-red-300' : 'border-gray-200'}`} />
                
                </Field>

                {/* Outcome expected */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is there an outcome you would like in the resolution of the
                    concern(s) that you have filed?
                  </label>
                  <div className="flex gap-3">
                    {[
                  {
                    label: 'Yes',
                    val: true
                  },
                  {
                    label: 'No',
                    val: false
                  }].
                  map((o) =>
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => update('outcomeExpected', o.val)}
                    className={`px-5 py-2 rounded-xl text-sm font-medium border transition-colors ${form.outcomeExpected === o.val ? 'bg-[#F68E22] text-white border-[#F68E22]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                    
                        {o.label}
                      </button>
                  )}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {form.outcomeExpected &&
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
                  className="overflow-hidden md:col-span-2">
                  
                      <Field label="If yes, please provide details">
                        <textarea
                      rows={3}
                      value={form.outcomeExpectedDetails}
                      onChange={(e) =>
                      update('outcomeExpectedDetails', e.target.value)
                      }
                      placeholder="Describe the outcome you expect."
                      className={`${INPUT_CLS} resize-none border-gray-200`} />
                    
                      </Field>
                    </motion.div>
                }
                </AnimatePresence>

                <Field
                label="Recommendation / Compliment / Positive Feedback — please provide details"
                className="md:col-span-2">
                
                  <textarea
                  rows={3}
                  value={form.recommendationDetails}
                  onChange={(e) =>
                  update('recommendationDetails', e.target.value)
                  }
                  placeholder="Share any recommendation, compliment, or positive feedback."
                  className={`${INPUT_CLS} resize-none border-gray-200`} />
                
                </Field>
              </div>
            </SectionCard>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium">
              
                <RotateCcwIcon className="w-4 h-4 mr-1.5" />
                Clear Form
              </button>
              <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#F68E22] hover:bg-[#e07d10] text-white text-sm font-medium transition-colors shadow-sm">
              
                <SendIcon className="w-4 h-4 mr-2" /> Submit Feedback
              </button>
            </div>
          </div>
        }

        {/* List tab */}
        {activeTab === 'list' &&
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Feedback Records
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
                      Grievance ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Filed
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        {r.grievanceId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.dateOfFiling}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.anonymous ?
                    <span className="italic text-gray-400">
                            Anonymous
                          </span> :

                    [r.firstName, r.surname].filter(Boolean).join(' ') ||
                    '—'
                    }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {r.feedbackType}
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
              {pageRecords.map((r) =>
            <div key={r.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {r.grievanceId}
                    </p>
                    <span className="text-xs text-gray-500">
                      {r.dateOfFiling}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{r.feedbackType}</p>
                  <p className="text-xs text-gray-500">
                    {r.anonymous ?
                'Anonymous' :
                [r.firstName, r.surname].filter(Boolean).join(' ') ||
                '—'}
                  </p>
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
        title="PMNP Feedback Record"
        subtitle={viewing ? viewing.grievanceId : ''}
        sections={viewSections} />
      
    </div>);

}