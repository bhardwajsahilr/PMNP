import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  PaperclipIcon,
  CheckCircleIcon,
  LinkIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
type Tab = 'form' | 'list';
interface Meeting {
  id: number;
  date: string;
  officeCode: string;
  time: string;
  activity: string;
  venue: string;
  region: string;
  designation: string;
  remark: string;
}
const SEED_MEETINGS: Meeting[] = [
{
  id: 1,
  date: '2026-03-15',
  officeCode: 'OFC-001',
  time: '09:00',
  activity: 'BNC Quarterly Review',
  venue: 'Municipal Hall',
  region: 'Region IV-A',
  designation: 'Municipal Nutrition Officer',
  remark: ''
},
{
  id: 2,
  date: '2026-03-10',
  officeCode: 'OFC-002',
  time: '14:00',
  activity: 'Nutrition Planning Workshop',
  venue: 'Barangay Hall',
  region: 'Region IV-A',
  designation: 'Barangay Health Worker',
  remark: ''
},
{
  id: 3,
  date: '2026-03-05',
  officeCode: 'OFC-003',
  time: '10:00',
  activity: 'LNAP Orientation Seminar',
  venue: 'Community Center',
  region: 'Region III',
  designation: 'DILG Representative',
  remark: ''
},
{
  id: 4,
  date: '2026-02-28',
  officeCode: 'OFC-004',
  time: '13:00',
  activity: 'Stakeholder Alignment Meeting',
  venue: 'Provincial Capitol',
  region: 'Region IV-A',
  designation: 'LGU Official',
  remark: ''
},
{
  id: 5,
  date: '2026-02-20',
  officeCode: 'OFC-005',
  time: '15:00',
  activity: 'Feeding Program Coordination',
  venue: 'Health Center',
  region: 'Region V',
  designation: 'DOH Representative',
  remark: ''
},
{
  id: 6,
  date: '2026-02-15',
  officeCode: 'OFC-006',
  time: '09:30',
  activity: 'Budget Review Session',
  venue: 'Municipal Hall',
  region: 'Region III',
  designation: 'NGO Partner',
  remark: ''
}];

function loadMeetings(): Meeting[] {
  return storageGet<Meeting[]>(KEYS.MEETINGS, SEED_MEETINGS);
}
function saveMeetings(meetings: Meeting[]) {
  storageSet(KEYS.MEETINGS, meetings);
}
const DESIGNATIONS = [
'Municipal Nutrition Officer',
'Barangay Health Worker',
'DILG Representative',
'DOH Representative',
'LGU Official',
'NGO Partner'];

const REGIONS = [
'Region III - Central Luzon',
'Region IV-A - CALABARZON',
'Region V - Bicol'];

export function AdministrationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>(loadMeetings);
  const handleAddMeeting = useCallback(
    (meeting: Omit<Meeting, 'id' | 'officeCode'>) => {
      const nextId =
      meetings.length > 0 ? Math.max(...meetings.map((m) => m.id)) + 1 : 1;
      const newMeeting: Meeting = {
        ...meeting,
        id: nextId,
        officeCode: `OFC-${String(nextId).padStart(3, '0')}`
      };
      const updated = [newMeeting, ...meetings];
      setMeetings(updated);
      saveMeetings(updated);
      setActiveTab('list');
    },
    [meetings]
  );
  const handleDeleteMeeting = useCallback(
    (id: number) => {
      const updated = meetings.filter((m) => m.id !== id);
      setMeetings(updated);
      saveMeetings(updated);
    },
    [meetings]
  );
  const filteredMeetings = meetings.filter(
    (m) =>
    m.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.region.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500">
            Manage meetings and administrative records
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Meeting',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'Meeting Records',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="admin-tab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />

            }
              <span className="relative flex items-center gap-1.5">
                <tab.icon size={15} />
                {tab.label}
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
          
            <MeetingForm onSubmit={handleAddMeeting} />
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
          
            <MeetingList
            meetings={filteredMeetings}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDeleteMeeting} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function MeetingForm({
  onSubmit


}: {onSubmit: (m: Omit<Meeting, 'id' | 'officeCode'>) => void;}) {
  const [form, setForm] = useState({
    date: '',
    time: '',
    activity: '',
    venue: '',
    designation: '',
    region: '',
    remark: '',
    scanLink: ''
  });
  const [success, setSuccess] = useState(false);
  const update = (field: string, value: string) =>
  setForm((f) => ({
    ...f,
    [field]: value
  }));
  const handleSubmit = () => {
    if (!form.date || !form.activity || !form.venue) return;
    onSubmit(form);
    setForm({
      date: '',
      time: '',
      activity: '',
      venue: '',
      designation: '',
      region: '',
      remark: '',
      scanLink: ''
    });
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
        exit={{
          opacity: 0
        }}
        className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
        
          <CheckCircleIcon size={18} />
          Meeting saved successfully!
        </motion.div>
      }

      {/* Meeting Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Meeting Details
            </h3>
            <p className="text-xs text-gray-400">
              Schedule and location information
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <FormField
            label="Date of Meeting"
            type="date"
            value={form.date}
            onChange={(v) => update('date', v)} />
          
          <FormField
            label="Office Code"
            type="text"
            placeholder="Auto-generated"
            disabled />
          
          <FormField
            label="Time"
            type="time"
            value={form.time}
            onChange={(v) => update('time', v)} />
          
          <FormField
            label="Activity"
            type="text"
            placeholder="Enter activity name"
            value={form.activity}
            onChange={(v) => update('activity', v)} />
          
          <FormField
            label="Venue"
            type="text"
            placeholder="Enter venue"
            className="sm:col-span-2"
            value={form.venue}
            onChange={(v) => update('venue', v)} />
          
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <UsersIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Participants
            </h3>
            <p className="text-xs text-gray-400">
              Attendee designation and region
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Designation
            </label>
            <select
              value={form.designation}
              onChange={(e) => update('designation', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select designation</option>
              {DESIGNATIONS.map((d) =>
              <option key={d} value={d}>
                  {d}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Region
            </label>
            <select
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-white">
              
              <option value="">Select region</option>
              {REGIONS.map((r) =>
              <option key={r} value={r}>
                  {r}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
            <PaperclipIcon size={18} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Attachments</h3>
            <p className="text-xs text-gray-400">
              Upload documents and add remarks
            </p>
          </div>
        </div>
        <div className="border-t border-accent/20 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Approved Scanned Copy (Google Drive Link)
            </label>
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={form.scanLink || ''}
                onChange={(e) => update('scanLink', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Paste the Google Drive link to the uploaded scanned copy
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Remark
            </label>
            <textarea
              rows={3}
              placeholder="Add any remarks or notes..."
              value={form.remark}
              onChange={(e) => update('remark', e.target.value)}
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
          
          Submit Meeting
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
function MeetingList({
  meetings,
  searchQuery,
  onSearch,
  onDelete





}: {meetings: Meeting[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Search & Filters */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search meetings..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
        <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30">
          <option>All Regions</option>
          {REGIONS.map((r) =>
          <option key={r}>{r}</option>
          )}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Office Code
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Activity
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Venue
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Region
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) =>
            <tr
              key={m.id}
              className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent hover:shadow-sm transition-all duration-200 cursor-pointer group">
              
                <td className="px-4 py-3.5 text-gray-700 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-primary rounded-r-full transition-all duration-200" />
                  {m.date}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                  {m.officeCode}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{m.time}</td>
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors">
                  {m.activity}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{m.venue}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-50 text-secondary text-xs font-medium">
                    {m.region}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                    className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary transition-all hover:scale-110"
                    title="View">
                    
                      <EyeIcon size={15} />
                    </button>
                    <button
                    className="p-1.5 rounded-lg hover:bg-primary-100 text-primary transition-all hover:scale-110"
                    title="Edit">
                    
                      <PencilIcon size={15} />
                    </button>
                    <button
                    onClick={() => onDelete(m.id)}
                    className="p-1.5 rounded-lg hover:bg-alert-100 text-alert transition-all hover:scale-110"
                    title="Delete">
                    
                      <Trash2Icon size={15} />
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
        {meetings.map((m) =>
        <div
          key={m.id}
          className="border border-gray-100 rounded-xl p-4 space-y-2 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
                {m.activity}
              </span>
              <span className="text-xs text-gray-400">{m.date}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>{m.time}</span>
              <span>•</span>
              <span>{m.venue}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-50 text-secondary text-xs font-medium">
                {m.region}
              </span>
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-secondary-50 text-secondary transition-colors">
                  <EyeIcon size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-primary-50 text-primary transition-colors">
                  <PencilIcon size={14} />
                </button>
                <button
                onClick={() => onDelete(m.id)}
                className="p-1.5 rounded-lg hover:bg-alert-50 text-alert transition-colors">
                
                  <Trash2Icon size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {meetings.length === 0 &&
        <div className="text-center py-8 text-gray-400 text-sm">
            No meetings found
          </div>
        }
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing {meetings.length} records
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