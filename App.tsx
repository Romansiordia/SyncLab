
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import TechnicianManagement from './components/TechnicianManagement';
import AnalysisManagement from './components/AnalysisManagement';
import AnalysisRequest from './components/AnalysisRequest';
import Settings from './components/Settings';
import Loader from './components/ui/Loader';
import { Analysis, View, AnalysisCost, Client, Technician, AnalysisType } from './types';
import AnalysisCostsManagement from './components/AnalysisCostsManagement';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [analysisCosts, setAnalysisCosts] = useState<AnalysisCost[]>([]);
  const [analysisTypes, setAnalysisTypes] = useState<AnalysisType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const googleScriptUrl = localStorage.getItem('googleScriptUrl');

    if (!googleScriptUrl) {
      setError("Google Sheets URL not configured. Please set it in Settings.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(googleScriptUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.clients && data.technicians && data.analysisCosts && data.analysisResults && data.analysisTypes) {
          setClients(data.clients);
          setTechnicians(data.technicians);
          setAnalysisCosts(data.analysisCosts);
          setAnalysisTypes(data.analysisTypes);
          setAnalyses(data.analysisResults);
      } else {
          throw new Error("Data from Google Sheets is not in the expected format. Please check the script and ensure all sheet names (Clients, Technicians, AnalysisCosts, AnalysisResults, AnalysisTypes) are correct.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const renderView = () => {
    if (loading) {
      return <Loader message="Syncing data with Google Sheets..." />;
    }
    if (error && activeView !== 'settings') {
       return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Data Loading Error</h2>
                <p className="text-gray-700 mb-4">{error}</p>
                <button 
                    onClick={() => setActiveView('settings')} 
                    className="bg-primary text-white hover:bg-secondary font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Go to Settings
                </button>
            </div>
       );
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard analyses={analyses} clients={clients} technicians={technicians} />;
      case 'clients':
        return <ClientManagement clients={clients} reloadData={reloadData} />;
      case 'technicians':
        return <TechnicianManagement technicians={technicians} reloadData={reloadData} />;
      case 'newAnalysis':
        return <AnalysisRequest reloadData={reloadData} setActiveView={setActiveView} analysisCosts={analysisCosts} clients={clients} technicians={technicians} />;
      case 'analyses':
        return <AnalysisManagement analyses={analyses} reloadData={reloadData} setActiveView={setActiveView} clients={clients} technicians={technicians} analysisCosts={analysisCosts} analysisTypes={analysisTypes} />;
      case 'analysisCosts':
        return <AnalysisCostsManagement analysisCosts={analysisCosts} reloadData={reloadData} analysisTypes={analysisTypes} />;
      case 'settings':
        return <Settings reloadData={reloadData} />;
      default:
        return <Dashboard analyses={analyses} clients={clients} technicians={technicians}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;