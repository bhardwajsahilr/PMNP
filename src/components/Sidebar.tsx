import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardListIcon,
  FileTextIcon,
  LogOutIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  UsersIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  GraduationCapIcon,
  DollarSignIcon,
  BarChart3Icon,
  AwardIcon,
  ShoppingCartIcon,
  MegaphoneIcon,
  FileIcon,
  FolderIcon,
  TargetIcon,
  MapPinIcon,
  ClipboardIcon,
  WrenchIcon,
  TruckIcon,
  PackageIcon,
  MonitorIcon,
  HeartPulseIcon,
  BoxIcon,
  CheckSquareIcon,
  FileSearchIcon,
  FileCheckIcon,
  ListChecksIcon,
  BookOpenIcon,
  UserPlusIcon,
  LayoutListIcon,
  BriefcaseIcon,
  CoinsIcon,
  ReceiptIcon,
  ActivityIcon,
  LineChartIcon,
  PieChartIcon,
  SpeakerIcon } from
'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
interface SubItem {
  label: string;
  path: string;
  icon: React.ElementType;
}
interface ExpandableModule {
  key: string;
  label: string;
  icon: React.ElementType;
  basePath: string;
  subItems: SubItem[];
}
const EXPANDABLE_MODULES: ExpandableModule[] = [
{
  key: 'administration',
  label: 'Administration',
  icon: ClipboardListIcon,
  basePath: '/dashboard/administration',
  subItems: [
  {
    label: 'PMNP Meetings',
    path: '/dashboard/administration/pmnp-meetings',
    icon: UsersIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/administration/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'capacity-building',
  label: 'Capacity Building',
  icon: GraduationCapIcon,
  basePath: '/dashboard/capacity-building',
  subItems: [
  {
    label: 'NPHC Targets',
    path: '/dashboard/capacity-building/nphc-targets',
    icon: TargetIcon
  },
  {
    label: 'Training Registration',
    path: '/dashboard/capacity-building/training-registration',
    icon: BookOpenIcon
  },
  {
    label: 'Participant Registration',
    path: '/dashboard/capacity-building/participant-registration',
    icon: UserPlusIcon
  },
  {
    label: 'Capacity Mapping',
    path: '/dashboard/capacity-building/capacity-mapping',
    icon: MapPinIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/capacity-building/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'esmf',
  label: 'ESMF',
  icon: ShieldCheckIcon,
  basePath: '/dashboard/esmf',
  subItems: [
  {
    label: 'PMNP Feedback Form',
    path: '/dashboard/esmf/feedback',
    icon: MessageSquareIcon
  },
  {
    label: 'Grievance Intake',
    path: '/dashboard/esmf/grievance',
    icon: AlertTriangleIcon
  },
  {
    label: 'PPAs for ESSC & ESMP',
    path: '/dashboard/esmf/ppas-essc-esmp',
    icon: ClipboardListIcon
  },
  {
    label: 'Installed GRMs',
    path: '/dashboard/esmf/installed-grms',
    icon: ClipboardCheckIcon
  },
  {
    label: 'Approved CPs and CNOs',
    path: '/dashboard/esmf/approved-cps-cnos',
    icon: AwardIcon
  }]

},
{
  key: 'finance',
  label: 'Finance',
  icon: DollarSignIcon,
  basePath: '/dashboard/finance',
  subItems: [
  {
    label: 'LGU - WFP',
    path: '/dashboard/finance/lgu-wfp',
    icon: CoinsIcon
  },
  {
    label: 'LGU - FUR',
    path: '/dashboard/finance/lgu-fur',
    icon: ReceiptIcon
  },
  {
    label: 'RPMO WFP',
    path: '/dashboard/finance/rpmo-wfp',
    icon: CoinsIcon
  },
  {
    label: 'RPMO FUR',
    path: '/dashboard/finance/rpmo-fur',
    icon: ReceiptIcon
  },
  {
    label: 'NPMO WFP',
    path: '/dashboard/finance/npmo-wfp',
    icon: CoinsIcon
  },
  {
    label: 'NPMO FUR',
    path: '/dashboard/finance/npmo-fur',
    icon: ReceiptIcon
  },
  {
    label: 'SORD',
    path: '/dashboard/finance/sord',
    icon: FileTextIcon
  },
  {
    label: 'CSF',
    path: '/dashboard/finance/csf',
    icon: FileTextIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/finance/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'lnap',
  label: 'LNAP',
  icon: FileTextIcon,
  basePath: '/dashboard/lnap',
  subItems: [
  {
    label: 'BNAP Status',
    path: '/dashboard/lnap/status',
    icon: ClipboardCheckIcon
  },
  {
    label: 'BNC Status',
    path: '/dashboard/lnap/bnc-status',
    icon: UsersIcon
  },
  {
    label: 'MNAP Status',
    path: '/dashboard/lnap/mnap-status',
    icon: ClipboardCheckIcon
  },
  {
    label: 'MNC Status',
    path: '/dashboard/lnap/mnc-status',
    icon: UsersIcon
  }]

},
{
  key: 'me',
  label: 'M&E',
  icon: BarChart3Icon,
  basePath: '/dashboard/me',
  subItems: [
  {
    label: 'M&E Results Framework - Targets',
    path: '/dashboard/me/rf-targets',
    icon: TargetIcon
  },
  {
    label: 'Municipality / Barangay Profile',
    path: '/dashboard/me/municipality-profile',
    icon: MapPinIcon
  },
  {
    label: 'HF Checklist',
    path: '/dashboard/me/hf-checklist',
    icon: CheckSquareIcon
  },
  {
    label: 'Result Framework - Baseline',
    path: '/dashboard/me/rf-baseline',
    icon: LineChartIcon
  },
  {
    label: 'Result Framework - FHSIS',
    path: '/dashboard/me/rf-fhsis',
    icon: ActivityIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/me/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'pbg',
  label: 'PBG',
  icon: AwardIcon,
  basePath: '/dashboard/pbg',
  subItems: [
  {
    label: 'External Verification Report',
    path: '/dashboard/pbg/external-verification-report',
    icon: FileCheckIcon
  },
  {
    label: 'Internal Verification Summary',
    path: '/dashboard/pbg/internal-verification-summary',
    icon: FileSearchIcon
  },
  {
    label: 'External Verification Summary',
    path: '/dashboard/pbg/external-verification-summary',
    icon: FileSearchIcon
  },
  {
    label: 'Internal Verification Tool',
    path: '/dashboard/pbg/internal-verification-tool',
    icon: WrenchIcon
  },
  {
    label: 'External Verification Tool',
    path: '/dashboard/pbg/external-verification-tool',
    icon: WrenchIcon
  },
  {
    label: 'Internal Verification Checklist',
    path: '/dashboard/pbg/internal-verification-checklist',
    icon: ListChecksIcon
  },
  {
    label: 'External Verification Checklist',
    path: '/dashboard/pbg/external-verification-checklist',
    icon: ListChecksIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/pbg/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'procurement',
  label: 'Procurement',
  icon: ShoppingCartIcon,
  basePath: '/dashboard/procurement',
  subItems: [
  {
    label: 'Anthropometry Supplies & Equipment',
    path: '/dashboard/procurement/anthropometry',
    icon: PackageIcon
  },
  {
    label: 'Equipment Supply',
    path: '/dashboard/procurement/equipment-supply',
    icon: BoxIcon
  },
  {
    label: 'ICT Equipment',
    path: '/dashboard/procurement/ict-equipment',
    icon: MonitorIcon
  },
  {
    label: 'Nutrition Commodities',
    path: '/dashboard/procurement/nutrition-commodities',
    icon: HeartPulseIcon
  },
  {
    label: 'PHC Small Equipments',
    path: '/dashboard/procurement/phc-small-equipments',
    icon: WrenchIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/procurement/doc-repo',
    icon: FolderIcon
  }]

},
{
  key: 'sbc',
  label: 'SBC',
  icon: MegaphoneIcon,
  basePath: '/dashboard/sbc',
  subItems: [
  {
    label: 'SBC Target Form',
    path: '/dashboard/sbc/targets',
    icon: TargetIcon
  },
  {
    label: 'SBC Baseline',
    path: '/dashboard/sbc/baseline',
    icon: LineChartIcon
  },
  {
    label: 'SBC Result Framework',
    path: '/dashboard/sbc/result-framework',
    icon: PieChartIcon
  },
  {
    label: 'HPG Utilisation',
    path: '/dashboard/sbc/hpg-utilisation',
    icon: ActivityIcon
  },
  {
    label: 'Document Repository',
    path: '/dashboard/sbc/doc-repo',
    icon: FolderIcon
  }]

}];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, setUser, setSelectedBarangay } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      EXPANDABLE_MODULES.forEach((mod) => {
        if (location.pathname.includes(mod.basePath)) {
          initial[mod.key] = true;
        }
      });
      return initial;
    });
  const toggleModule = (key: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleLogout = () => {
    setUser(null);
    setSelectedBarangay(null);
    navigate('/login');
  };
  return (
    <>
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose} />

      }

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Brand */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/pasted-image.png"
                alt="DOH Logo"
                className="w-9 h-9 rounded-xl object-contain" />
              
              <div>
                <h2 className="text-[11px] font-bold text-gray-900 leading-tight">
                  Philippine Multisectoral
                </h2>
                <h2 className="text-[11px] font-bold text-gray-900 leading-tight">
                  Nutrition Project
                </h2>
                <p className="text-[10px] text-gray-400 font-medium">
                  Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors">
              
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </p>

          {/* Expandable Modules (alphabetical) */}
          {EXPANDABLE_MODULES.map((mod) => {
            const isModActive = location.pathname.includes(mod.basePath);
            const isExpanded = expandedModules[mod.key] || false;
            return (
              <div key={mod.key}>
                <button
                  onClick={() => toggleModule(mod.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isModActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  
                  <mod.icon size={18} strokeWidth={isModActive ? 2.5 : 2} />
                  <span>{mod.label}</span>
                  <span className="ml-auto">
                    {isExpanded ?
                    <ChevronDownIcon size={16} /> :

                    <ChevronRightIcon size={16} />
                    }
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded &&
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
                    
                      <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                        {mod.subItems.map((sub) =>
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                        `flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                        }>
                        
                            {({ isActive }) =>
                        <>
                                <sub.icon
                            size={15}
                            strokeWidth={isActive ? 2.5 : 2}
                            className="shrink-0 mt-0.5" />
                          
                                <span className="leading-snug">
                                  {sub.label}
                                </span>
                                {isActive &&
                          <div className="ml-auto mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          }
                              </>
                        }
                          </NavLink>
                      )}
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email || 'user@pmnp.gov.ph'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-alert hover:bg-alert-50 transition-all">
            
            <LogOutIcon size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>);

}