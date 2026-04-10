import React, { Children } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  UsersIcon,
  ClipboardListIcon,
  ClockIcon,
  MapPinIcon } from
'lucide-react';
import { motion } from 'framer-motion';
import { storageGet, KEYS } from '../utils/storage';
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    y: 16
  },
  show: {
    opacity: 1,
    y: 0
  }
};
export function DashboardHome() {
  const { selectedBarangay } = useAppContext();
  const meetings = storageGet<
    {
      id: number;
    }[]>(
    KEYS.MEETINGS, []);
  const lnapRecords = storageGet<
    {
      id: number;
      bnapStatus: string;
      sbResolution?: string;
    }[]>(
    KEYS.LNAP, []);
  const totalMeetings = meetings.length;
  const activeLnaps = lnapRecords.filter(
    (r) => r.bnapStatus === 'Approved BNAP'
  ).length;
  const pendingApprovals = lnapRecords.filter(
    (r) => r.bnapStatus === 'Pending' || r.sbResolution === 'Pending'
  ).length;
  const stats = [
  {
    label: 'Total Meetings',
    value: String(totalMeetings),
    icon: ClipboardListIcon,
    color: 'bg-primary/10 text-primary'
  },
  {
    label: 'Active LNAPs',
    value: String(activeLnaps),
    icon: UsersIcon,
    color: 'bg-secondary/10 text-secondary'
  },
  {
    label: 'Pending Approvals',
    value: String(pendingApprovals),
    icon: ClockIcon,
    color: 'bg-accent/20 text-yellow-600'
  },
  {
    label: 'Total LNAP Records',
    value: String(lnapRecords.length),
    icon: MapPinIcon,
    color: 'bg-green-50 text-green-600'
  }];

  // Build recent activity from actual data
  const recentMeetings = storageGet<
    {
      activity: string;
      date: string;
    }[]>(
    KEYS.MEETINGS, []).slice(0, 2);
  const recentLnap = storageGet<
    {
      reportDate: string;
      bnapStatus: string;
    }[]>(
    KEYS.LNAP, []).slice(0, 2);
  const recentActivity = [
  ...recentMeetings.map((m) => ({
    text: `Meeting: ${m.activity}`,
    time: m.date,
    color: 'bg-primary'
  })),
  ...recentLnap.map((r) => ({
    text: `LNAP Status: ${r.bnapStatus}`,
    time: r.reportDate,
    color: 'bg-secondary'
  }))].

  sort((a, b) => b.time.localeCompare(a.time)).
  slice(0, 5);
  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6">
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview for{' '}
          <span className="font-medium text-primary">
            {selectedBarangay?.barangay}
          </span>
          , {selectedBarangay?.municipality}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {stats.map((stat) =>
        <motion.div
          key={stat.label}
          variants={item}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          
            <div className="flex items-center justify-between mb-3">
              <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.3
        }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ?
          recentActivity.map((activity, i) =>
          <div key={i} className="flex items-start gap-3">
                <div
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.color}`} />
            
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
          ) :

          <p className="text-sm text-gray-400 text-center py-4">
              No recent activity yet. Start by adding meetings or LNAP records.
            </p>
          }
        </div>
      </motion.div>
    </div>);

}