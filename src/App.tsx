import React, { useState } from 'react';
import { PredictorForm } from './components/PredictorForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { DatasetExplorer } from './components/DatasetExplorer';
import { ModelPerformance } from './components/ModelPerformance';
import { predictFraud } from './services/fraudEngine';
import { PredictionInput, PredictionResult } from './types';
import { ShieldCheck, BarChart2, Database, Activity } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'predictor' | 'dataset' | 'metrics'>('predictor');
  const [currentInput, setCurrentInput] = useState<PredictionInput | null>({
    amount: 1000.0,
    merchant: 'KahawaCafe',
    location: 'Dar es Salaam',
    channel: 'Mobile',
    hour: 14,
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(() => {
    return predictFraud({
      amount: 1000.0,
      merchant: 'KahawaCafe',
      location: 'Dar es Salaam',
      channel: 'Mobile',
      hour: 14,
    });
  });

  const handlePredict = (input: PredictionInput) => {
    setCurrentInput(input);
    const result = predictFraud(input);
    setPredictionResult(result);
  };

  const handleSelectFromDataset = (input: PredictionInput) => {
    setCurrentInput(input);
    const result = predictFraud(input);
    setPredictionResult(result);
    setActiveTab('predictor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation / Brand */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
              🚨
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Fraud Detection App <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">v1.0 ML</span>
              </h1>
              <p className="text-xs text-slate-400">
                Fast lightweight version — shows fraud probability in percentage.
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'predictor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Predictor
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dataset'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Dataset Explorer
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Model & Metrics
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'predictor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <PredictorForm onPredict={handlePredict} initialValues={currentInput} />
            </div>
            <div className="lg:col-span-5">
              <PredictionResultCard result={predictionResult} />
            </div>
          </div>
        )}

        {activeTab === 'dataset' && (
          <DatasetExplorer onSelectTransaction={handleSelectFromDataset} />
        )}

        {activeTab === 'metrics' && <ModelPerformance />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fraud Detection System • Machine Learning in Financial Transactions</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Node.js 22 Environment • Tanzanian Financial Corridors Benchmark
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
