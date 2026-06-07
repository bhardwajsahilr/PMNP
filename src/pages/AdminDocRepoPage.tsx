import React, { useCallback, useState, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  FileIcon,
  UploadIcon,
  CheckCircleIcon,
  LinkIcon,
  FolderIcon,
  XIcon } from
'lucide-react';
import { storageGet, storageSet, KEYS } from '../utils/storage';
import { useAppContext } from '../context/AppContext';
import { ViewModal } from '../components/ViewModal';
import type { SectionDef } from '../components/ViewModal';
type Tab = 'form' | 'list';
interface DocRecord {
  id: number;
  uploadDate: string;
  organisationUnit: string;
  fileName: string;
  fileDescription: string;
  documentName: string;
  createdDate: string;
}
const SEED_DOCS: DocRecord[] = [
{
  id: 1,
  uploadDate: '2026-03-15',
  organisationUnit: 'Barangay Parian, Calamba, Laguna',
  fileName: 'Q1 Meeting Minutes',
  fileDescription: 'Minutes of the first quarter BNC meeting',
  documentName: 'Q1_Meeting_Minutes_2026.pdf',
  createdDate: '2026-03-15'
},
{
  id: 2,
  uploadDate: '2026-03-10',
  organisationUnit: 'Barangay Parian, Calamba, Laguna',
  fileName: 'Budget Allocation Report',
  fileDescription: 'Annual budget allocation for nutrition programs',
  documentName: 'Budget_Allocation_2026.xlsx',
  createdDate: '2026-03-10'
},
{
  id: 3,
  uploadDate: '2026-02-28',
  organisationUnit: 'Barangay Parian, Calamba, Laguna',
  fileName: 'Training Attendance Sheet',
  fileDescription: 'Attendance sheet for BNS training conducted in February',
  documentName: 'Training_Attendance_Feb2026.pdf',
  createdDate: '2026-02-28'
}];

function loadDocs(): DocRecord[] {
  return storageGet<DocRecord[]>(KEYS.ADMIN_DOCS, SEED_DOCS);
}
function saveDocs(records: DocRecord[]) {
  storageSet(KEYS.ADMIN_DOCS, records);
}
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function AdminDocRepoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<DocRecord[]>(loadDocs);
  const handleAdd = useCallback(
    (record: Omit<DocRecord, 'id'>) => {
      const nextId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      const newRecord: DocRecord = {
        ...record,
        id: nextId
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      saveDocs(updated);
      setActiveTab('list');
    },
    [records]
  );
  const handleDelete = useCallback(
    (id: number) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveDocs(updated);
    },
    [records]
  );
  const filteredRecords = records.filter(
    (r) =>
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.fileDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.organisationUnit.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Document Repository
          </h1>
          <p className="text-sm text-gray-500">
            Administration document repository
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          {[
          {
            key: 'form' as Tab,
            label: 'New Document',
            icon: PlusIcon
          },
          {
            key: 'list' as Tab,
            label: 'Documents',
            icon: SearchIcon
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {activeTab === tab.key &&
            <motion.div
              layoutId="docrepo-tab"
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
                  {tab.key === 'form' ? 'Upload' : 'Documents'}
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
          
            <DocForm onSubmit={handleAdd} />
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
          
            <DocList
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onDelete={handleDelete} />
          
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function DocForm({
  onSubmit


}: {onSubmit: (r: Omit<DocRecord, 'id'>) => void;}) {
  const { selectedBarangay } = useAppContext();
  const orgUnit = selectedBarangay ?
  `${selectedBarangay.barangay}, ${selectedBarangay.municipality}, ${selectedBarangay.province}` :
  '';
  const [form, setForm] = useState({
    uploadDate: getTodayString(),
    organisationUnit: orgUnit,
    fileName: '',
    fileDescription: '',
    documentName: '',
    createdDate: ''
  });
  const [success, setSuccess] = useState(false);
  const update = (field: string, value: string) =>
  setForm((f) => ({
    ...f,
    [field]: value
  }));
  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        update('documentName', file.name);
      }
    };
    input.click();
  };
  const handleSubmit = () => {
    if (!form.uploadDate || !form.fileName) return;
    onSubmit(form);
    setForm({
      uploadDate: getTodayString(),
      organisationUnit: orgUnit,
      fileName: '',
      fileDescription: '',
      documentName: '',
      createdDate: ''
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
        className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
        
          <CheckCircleIcon size={18} />
          Document saved successfully!
        </motion.div>
      }

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Basic Info</h3>
            <p className="text-xs text-gray-400">
              Upload date and organisation details
            </p>
          </div>
        </div>
        <div className="border-t border-primary/10 mx-5 sm:mx-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Upload Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.uploadDate}
              onChange={(e) => update('uploadDate', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Organisation Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.organisationUnit}
              onChange={(e) => update('organisationUnit', e.target.value)}
              placeholder="Selected organisation"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all bg-gray-50" />
            
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <FolderIcon size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Uploaded Files
            </h3>
            <p className="text-xs text-gray-400">
              File details and document upload
            </p>
          </div>
        </div>
        <div className="border-t border-secondary/10 mx-5 sm:mx-6" />
        <div className="space-y-4 p-5 sm:p-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                File Name
              </label>
              <input
                type="text"
                placeholder="Enter file name"
                value={form.fileName}
                onChange={(e) => update('fileName', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Created Date
              </label>
              <input
                type="date"
                value={form.createdDate}
                onChange={(e) => update('createdDate', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
              
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              File Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter file description..."
              value={form.fileDescription}
              onChange={(e) => update('fileDescription', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Document
            </label>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{
                  scale: 1.01
                }}
                whileTap={{
                  scale: 0.98
                }}
                type="button"
                onClick={handleFileSelect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                
                <UploadIcon size={16} />
                Select File
              </motion.button>
              {form.documentName ?
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                  <FileIcon size={14} />
                  <span className="truncate max-w-[200px]">
                    {form.documentName}
                  </span>
                  <button
                  onClick={() => update('documentName', '')}
                  className="text-green-500 hover:text-green-700 transition-colors">
                  
                    <XIcon size={14} />
                  </button>
                </div> :

              <span className="text-xs text-gray-400">No file selected</span>
              }
            </div>
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
          
          Save and Exit
        </motion.button>
      </div>
    </div>);

}
function DocList({
  records,
  searchQuery,
  onSearch,
  onDelete





}: {records: DocRecord[];searchQuery: string;onSearch: (q: string) => void;onDelete: (id: number) => void;}) {
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<DocRecord | null>(null);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(records.length / perPage));
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  function getViewSections(r: DocRecord): SectionDef[] {
    return [
    {
      title: 'Basic Info',
      fields: [
      {
        label: 'Upload Date',
        value: r.uploadDate
      },
      {
        label: 'Organisation Unit',
        value: r.organisationUnit
      }]

    },
    {
      title: 'File Details',
      fields: [
      {
        label: 'File Name',
        value: r.fileName
      },
      {
        label: 'File Description',
        value: r.fileDescription
      },
      {
        label: 'Document',
        value: r.documentName
      },
      {
        label: 'Created Date',
        value: r.createdDate
      }]

    }];

  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ViewModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title={viewRecord?.fileName || 'Document Details'}
        subtitle={viewRecord ? `Uploaded: ${viewRecord.uploadDate}` : ''}
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
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all" />
          
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-primary-50/40 to-secondary-50/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                File Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Organisation Unit
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created Date
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
              
                <td className="px-4 py-3.5 text-gray-800 font-medium group-hover:text-primary transition-colors relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 bg-primary rounded-r-full transition-all duration-200" />
                  <div className="flex items-center gap-2">
                    <FileIcon size={14} className="text-gray-400" />
                    {r.fileName}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-700">{r.uploadDate}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs max-w-[200px] truncate">
                  {r.organisationUnit}
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  {r.createdDate || '—'}
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
                colSpan={5}
                className="text-center py-8 text-gray-400 text-sm">
                
                  No documents found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-3 space-y-3">
        {paginated.map((r) =>
        <div
          key={r.id}
          className="border border-gray-100 rounded-xl p-4 space-y-2 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden">
          
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-l-xl transition-all duration-200" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon size={14} className="text-gray-400" />
                <span className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
                  {r.fileName}
                </span>
              </div>
              <span className="text-xs text-gray-400">{r.uploadDate}</span>
            </div>
            {r.fileDescription &&
          <p className="text-xs text-gray-500 line-clamp-2">
                {r.fileDescription}
              </p>
          }
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400 truncate max-w-[180px]">
                {r.organisationUnit}
              </span>
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
            No documents found
          </div>
        }
      </div>

      {/* Pagination */}
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