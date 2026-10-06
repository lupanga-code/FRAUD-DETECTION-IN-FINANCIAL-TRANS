import React from 'react';
import { MODEL_CONFIG } from '../data/modelData';
import { BarChart3, CheckSquare, Layers, BrainCircuit } from 'lucide-react';

export const ModelPerformance: React.FC = () => {
  const { metrics, weights } = MODEL_CONFIG;

  const topFeatures = [
    { name: 'Channel: ATM Withdrawal', weight: weights.Channel_ATM || 0, impact: 'High Fraud Probability' },
    { name: 'Merchant: Kahawa Cafe', weight: weights.Merchant_KahawaCafe || 0, impact: 'Legit Indicator' },
    { name: 'Channel: Point of Sale (POS)', weight: weights.Channel_POS || 0, impact: 'Legit Indicator' },
    { name: 'Merchant: Tigo Pesa', weight: weights.Merchant_TigoPesa || 0, impact: 'Legit Indicator' },
    { name: 'Channel: Mobile App', weight: weights.Channel_MobileApp || 0, impact: 'Legit Indicator' },
    { name: 'Merchant: Airtel Money', weight: weights.Merchant_AirtelMoney || 0, impact: 'Fraud Risk Indicator' },
    { name: 'Merchant: Vodacom M-Pesa', weight: weights['Merchant_Vodacom_M-Pesa'] || 0, impact: 'Fraud Risk Indicator' },
    { name: 'Normalized Transaction Amount', weight: weights.Amount_norm || 0, impact: 'Volume Risk Indicator' },
    { name: 'Location: Arusha', weight: weights.Location_Arusha || 0, impact: 'Regional Risk Indicator' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-teal-400" />
            Model Performance & Pipeline Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Random Forest Classifier with SMOTE oversampling trained on synthetic transaction data.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            Precision: {metrics.precision}%
          </span>
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            F1-Score: {metrics.f1}%
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Precision (Fraud)</div>
          <div className="text-2xl font-bold text-teal-400 font-mono mt-1">{metrics.precision}%</div>
          <div className="text-[11px] text-slate-500 mt-1">91% of flagged alerts are true fraud</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">F1-Score</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">{metrics.f1}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Harmonic mean of precision & recall</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Recall (Sensitivity)</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{metrics.recall}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Identifies 54%+ fraud cases cleanly</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Balanced Accuracy</div>
          <div className="text-2xl font-bold text-slate-200 font-mono mt-1">{metrics.accuracy}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Trained on SMOTE resampled set</div>
        </div>
      </div>

      {/* Confusion Matrix & SMOTE Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Confusion Matrix */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Confusion Matrix (Evaluated on 1,000 Transactions)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              <div className="text-[11px] text-emerald-400 font-medium">True Negatives (TN)</div>
              <div className="text-xl font-bold font-mono text-emerald-300 mt-1">{metrics.tn}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Correctly Classified Genuine</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30">
              <div className="text-[11px] text-amber-400 font-medium">False Positives (FP)</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">{metrics.fp}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Genuine Flagged as Fraud</div>
            </div>
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30">
              <div className="text-[11px] text-rose-400 font-medium">False Negatives (FN)</div>
              <div className="text-xl font-bold font-mono text-rose-300 mt-1">{metrics.fn}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Fraud Escaped Detection</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30">
              <div className="text-[11px] text-purple-400 font-medium">True Positives (TP)</div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-1">{metrics.tp}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Correctly Intercepted Fraud</div>
            </div>
          </div>
        </div>

        {/* SMOTE Resampling Pipeline */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            Class Distribution & SMOTE Balancing
          </h3>
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Original Dataset (Imbalanced)</span>
                <span className="font-mono text-slate-400">84.8% Fraud / 15.2% Legit</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '15.2%' }} className="bg-emerald-500" title="Genuine: 152" />
                <div style={{ width: '84.8%' }} className="bg-rose-500" title="Fraud: 848" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>After SMOTE Oversampling</span>
                <span className="font-mono text-slate-400">50% Fraud / 50% Legit Balanced</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '50%' }} className="bg-emerald-500" title="Genuine Resampled" />
                <div style={{ width: '50%' }} className="bg-rose-500" title="Fraud Resampled" />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Synthetic Minority Over-sampling Technique (SMOTE) generates synthetic training samples
              for underrepresented genuine transactions, preventing the classifier from defaulting to majority-class bias.
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance / Coefficient ranking */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          Feature Weights & Anomaly Correlation
        </h3>
        <div className="space-y-2">
          {topFeatures.map((f, i) => {
            const isPositive = f.weight > 0;
            const barWidth = Math.min(100, Math.round(Math.abs(f.weight) * 100));

            return (
              <div key={i} className="flex items-center justify-between text-xs gap-3">
                <div className="w-48 truncate text-slate-300 font-medium">{f.name}</div>
                <div className="flex-1 max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className={`h-full ${isPositive ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <div className="font-mono text-right w-16 text-[11px] font-semibold text-slate-300">
                  {isPositive ? `+${f.weight.toFixed(3)}` : f.weight.toFixed(3)}
                </div>
                <div className="w-36 text-right text-[10px] text-slate-400 hidden sm:block">
                  {f.impact}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
