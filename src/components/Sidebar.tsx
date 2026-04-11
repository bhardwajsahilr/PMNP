import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardListIcon,
  FileTextIcon,
  LogOutIcon,
  SunIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  UsersIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  MessageSquareIcon } from
'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, setUser, setSelectedBarangay } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isLnapActive = location.pathname.includes('/dashboard/lnap');
  const isEsmfActive = location.pathname.includes('/dashboard/esmf');
  const [lnapExpanded, setLnapExpanded] = useState(isLnapActive);
  const [esmfExpanded, setEsmfExpanded] = useState(isEsmfActive);
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

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            
            {({ isActive }) =>
            <>
                <HomeIcon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>Dashboard</span>
                {isActive &&
              <motion.div
                layoutId="nav-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />

              }
              </>
            }
          </NavLink>

          {/* Administration */}
          <NavLink
            to="/dashboard/administration"
            onClick={onClose}
            className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            
            {({ isActive }) =>
            <>
                <ClipboardListIcon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>Administration</span>
                {isActive &&
              <motion.div
                layoutId="nav-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />

              }
              </>
            }
          </NavLink>

          {/* LNAP - Expandable */}
          <div>
            <button
              onClick={() => setLnapExpanded(!lnapExpanded)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isLnapActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              
              <FileTextIcon size={18} strokeWidth={isLnapActive ? 2.5 : 2} />
              <span>LNAP</span>
              <span className="ml-auto">
                {lnapExpanded ?
                <ChevronDownIcon size={16} /> :

                <ChevronRightIcon size={16} />
                }
              </span>
            </button>

            <AnimatePresence>
              {lnapExpanded &&
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
                    <NavLink
                    to="/dashboard/lnap/status"
                    onClick={onClose}
                    className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                    }>
                    
                      {({ isActive }) =>
                    <>
                          <ClipboardCheckIcon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 2} />
                      
                          <span>LNAP Status</span>
                          {isActive &&
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      }
                        </>
                    }
                    </NavLink>

                    <NavLink
                    to="/dashboard/lnap/lnc-status"
                    onClick={onClose}
                    className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                    }>
                    
                      {({ isActive }) =>
                    <>
                          <UsersIcon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 2} />
                      
                          <span>LNC Status</span>
                          {isActive &&
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      }
                        </>
                    }
                    </NavLink>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {/* ESMF - Expandable */}
          <div>
            <button
              onClick={() => setEsmfExpanded(!esmfExpanded)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isEsmfActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              
              <ShieldCheckIcon size={18} strokeWidth={isEsmfActive ? 2.5 : 2} />
              <span>ESMF</span>
              <span className="ml-auto">
                {esmfExpanded ?
                <ChevronDownIcon size={16} /> :

                <ChevronRightIcon size={16} />
                }
              </span>
            </button>

            <AnimatePresence>
              {esmfExpanded &&
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
                    <NavLink
                    to="/dashboard/esmf/grievance"
                    onClick={onClose}
                    className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                    }>
                    
                      {({ isActive }) =>
                    <>
                          <AlertTriangleIcon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 2} />
                      
                          <span>Grievance Intake</span>
                          {isActive &&
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      }
                        </>
                    }
                    </NavLink>

                    <NavLink
                    to="/dashboard/esmf/feedback"
                    onClick={onClose}
                    className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                    }>
                    
                      {({ isActive }) =>
                    <>
                          <MessageSquareIcon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 2} />
                      
                          <span>Feedback Form</span>
                          {isActive &&
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      }
                        </>
                    }
                    </NavLink>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>
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