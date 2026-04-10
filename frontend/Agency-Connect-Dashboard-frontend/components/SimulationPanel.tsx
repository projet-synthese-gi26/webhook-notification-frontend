import React, { useState } from 'react';
import { useAgency } from '../context/AgencyContext';
import { RefreshCw, Radio, Trash2 } from 'lucide-react';

interface Props {
  onDataChanged: () => void;
}

const SimulationPanel: React.FC<Props> = ({ onDataChanged }) => {
  const { service, isMockMode } = useAgency();
  const [loading, setLoading] = useState(false);

  if (!isMockMode || !service.simulateNotification) return null;

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await service.simulateNotification!();
      onDataChanged();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
      if(!window.confirm("Are you sure? This will delete all local notifications and reservations.")) return;
      setLoading(true);
      try {
          if (service.resetSimulation) await service.resetSimulation();
          onDataChanged();
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Radio size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Webhook Simulator</h3>
                    <p className="text-sm text-slate-500">Generates incoming REST payloads</p>
                </div>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={handleReset}
                    disabled={loading}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reset Simulation Data"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex-1 text-sm text-slate-600">
                <p>Clicking the button below mimics a <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">POST /webhook</code> from an external provider.</p>
            </div>
            <button
                onClick={handleSimulate}
                disabled={loading}
                className={`
                    flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all
                    ${loading ? 'bg-amber-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/30'}
                `}
            >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Simulating...' : 'Trigger Incoming Webhook'}
            </button>
        </div>
    </div>
  );
};

export default SimulationPanel;