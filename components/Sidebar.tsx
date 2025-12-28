
import React from 'react';
import { View } from '../types';
import { DashboardIcon, ClientIcon, TechnicianIcon, AnalysisIcon, SettingsIcon, NewAnalysisIcon, AnalysisCostIcon } from './icons/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems: { id: View; label: string; icon: React.ReactElement }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'clients', label: 'Clients', icon: <ClientIcon /> },
    { id: 'technicians', label: 'Technicians', icon: <TechnicianIcon /> },
    { id: 'newAnalysis', label: 'New Analysis', icon: <NewAnalysisIcon /> },
    { id: 'analyses', label: 'Analyses', icon: <AnalysisIcon /> },
    { id: 'analysisCosts', label: 'Analysis Costs', icon: <AnalysisCostIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-blue-800">
        <h1 className="text-2xl font-bold tracking-wider">LabSys</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(item.id);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-secondary'
                    : 'hover:bg-blue-800'
                }`}
              >
                {item.icon}
                <span className="ml-4 text-md font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800 text-center text-sm">
        <p>&copy; 2024 LabSys Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;