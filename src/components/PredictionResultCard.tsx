import React from 'react';
import { PredictionResult } from '../types';
import { AlertTriangle, CheckCircle2, ShieldCheck, ShieldAlert, ArrowRight, Gauge } from 'lucide-react';

interface PredictionResultCardProps {
  result: PredictionResult | null;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
          <Gauge className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300">Ready for Assessment</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          Adjust the transaction amount, merchant, location, and channel on the left, then click "Predict Fraud" to run the model.
        </p>
      </div>
    );
  }

  const { isFraud, fraudPercentage, legitPercentage, riskFactors, input } = result;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Streamlit Notification Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
          isFraud
            ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isFraud ? (
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-base font-bold tracking-tight">
            {isFraud ? '⚠️ Fraud detected!' : '✅ Legit transaction.'}
          </div>
          <div className="text-sm font-medium mt-0.5 opacity-90">
            {isFraud ? (
              <span>
                Fraud probability: <strong className="font-mono text-rose-300">{fraudPercentage}%</strong> | Legit: <span className="font-mono">{legitPercentage}%</span>
              </span>
            ) : (
              <span>
                Legit probability: <strong className="font-mono text-emerald-300">{legitPercentage}%</strong> | Fraud: <span className="font-mono">{fraudPercentage}%</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Probability Bar & Gauges */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Legit ({legitPercentage}%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            Fraud ({fraudPercentage}%) <ShieldAlert className="w-4 h-4" />
          </span>
        </div>

        {/* Dual Progress Bar */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5">
          <div
            style={{ width: `${legitPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500"
          />
          <div
            style={{ width: `${fraudPercentage}%` }}
            className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-r-full transition-all duration-500"
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>0.00%</span>
          <span className="font-medium text-slate-400">Decision Threshold: 50.00%</span>
          <span>100.00%</span>
        </div>
      </div>

      {/* Evaluated Transaction Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500">Amount</div>
          <div className="font-bold text-white font-mono mt-0.5">
            TSh {input.amount.toLocaleString()}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500">Merchant</div>
          <div className="font-bold text-white truncate mt-0.5">{input.merchant}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500">Location</div>
          <div className="font-bold text-white truncate mt-0.5">{input.location}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500">Channel</div>
          <div className="font-bold text-white mt-0.5">{input.channel}</div>
        </div>
      </div>

      {/* Risk Analysis Factors */}
      {riskFactors.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            Decision Logic & Factor Breakdown
          </h4>

          <div className="space-y-2">
            {riskFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{factor.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{factor.description}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    factor.impact === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : factor.impact === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {factor.impact === 'safe' ? 'Legit Signal' : `${factor.impact} Risk`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
