import React from 'react';
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  ClipboardListIcon,
  GraduationCapIcon } from
'lucide-react';
interface LinkCard {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  iconBg: string;
}
const LINKS: LinkCard[] = [
{
  title: 'Registration',
  description:
  'Open the Capacity Building registration portal to enroll participants.',
  url: 'https://moodle.codeincloud.in/',
  icon: <ClipboardListIcon className="w-5 h-5 text-orange-600" />,
  iconBg: 'bg-orange-100'
},
{
  title: 'Moodle Instance Link',
  description: 'Access the PMNP Moodle learning management instance.',
  url: 'https://moodle-212157-0.cloudclusters.net',
  icon: <GraduationCapIcon className="w-5 h-5 text-blue-600" />,
  iconBg: 'bg-blue-100'
}];

export function CapacityTrainingRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>PMNP</span>
            <ChevronRightIcon className="w-4 h-4 mx-1" />
            <span>Capacity Building</span>
            <ChevronRightIcon className="w-4 h-4 mx-1" />
            <span className="font-medium text-gray-900">
              Training Registration
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Training Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access the registration portal and the PMNP Moodle learning
            platform.
          </p>
        </div>

        {/* Link cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {LINKS.map((l) =>
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:border-orange-200 hover:shadow-md transition-all">
            
              <div className="flex items-center justify-between">
                <div className={`${l.iconBg} p-2.5 rounded-xl`}>{l.icon}</div>
                <ExternalLinkIcon className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {l.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{l.description}</p>
              </div>
              <span className="text-xs text-gray-400 truncate" title={l.url}>
                {l.url}
              </span>
              <span className="mt-auto inline-flex items-center text-sm font-medium text-[#F68E22] group-hover:text-[#e07d10] transition-colors">
                Open link
                <ExternalLinkIcon className="w-3.5 h-3.5 ml-1.5" />
              </span>
            </a>
          )}
        </div>

        <p className="text-xs text-gray-400">
          These links open in a new tab and are hosted on external platforms.
        </p>
      </div>
    </div>);

}