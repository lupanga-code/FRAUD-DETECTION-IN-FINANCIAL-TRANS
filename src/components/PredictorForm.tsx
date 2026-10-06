import React, { useState } from 'react';
import { MODEL_CONFIG } from '../data/modelData';
import { PredictionInput } from '../types';
import { ShieldAlert, Zap, Clock, DollarSign, Building2, MapPin, Smartphone } from 'lucide-react';

interface PredictorFormProps {
  onPredict: (input: PredictionInput) => void;
  initialValues?: PredictionInput | null;
}

export const PredictorForm: React.FC<PredictorFormProps> = ({ onPredict, initialValues }) => {
  const [amount, setAmount] = useState<number>(initialValues?.amount ?? 1000.0);
  const [merchant, setMerchant] = useState<string>(initialValues?.merchant ?? 'KahawaCafe');
  const [location, setLocation] = useState<string>(initialValues?.location ?? 'Dar es Salaam');
  const [channel, setChannel] = useState<string>(initialValues?.channel ?? 'Mobile');
  const [hour, setHour] = useState<number>(initialValues?.hour ?? 14);

  // Update when initialValues change from external selection
  React.useEffect(() => {
    if (initialValues) {
      setAmount(initialValues.amount);
      setMerchant(initialValues.merchant);
      setLocation(initialValues.location);
      setChannel(initialValues.channel);
      if (initialValues.hour !== undefined) setHour(initialValues.hour);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({
      amount: Number(amount) || 0,
      merchant,
      location,
      channel,
      hour,
    });
  };

  const loadPreset = (presetAmount: number, presetMerchant: string, presetLocation: string, presetChannel: string, presetHour: number) => {
    setAmount(presetAmount);
    setMerchant(presetMerchant);
    setLocation(presetLocation);
    setChannel(presetChannel);
    setHour(presetHour);
    onPredict({
      amount: presetAmount,
      merchant: presetMerchant,
      location: presetLocation,
      channel: presetChannel,
      hour: presetHour,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Make a Prediction
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Evaluate real-time transaction attributes through the machine learning model.
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset(1200, 'KahawaCafe', 'Dar es Salaam', 'POS', 14)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
          >
            Legit Sample
          </button>
          <button
            type="button"
            onClick={() => loadPreset(8250, 'AirtelMoney', 'Mbeya', 'ATM', 3)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            High Risk Sample
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Transaction Amount (TSh)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="1000.00"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 uppercase font-mono">
                TZS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Average benchmark: ~5,357 TSh</p>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" />
              Payment Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="Mobile">Mobile (App / Mobile Money)</option>
              <option value="POS">POS (Point of Sale)</option>
              <option value="Online">Online / Web</option>
              <option value="ATM">ATM Terminal</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">ATM channels carry highest anomaly correlation</p>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-400" />
              Merchant
            </label>
            <select
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              {MODEL_CONFIG.merchants.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              Transaction Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Zanzibar">Zanzibar</option>
              <option value="Arusha">Arusha</option>
              <option value="Dodoma">Dodoma</option>
              <option value="Mbeya">Mbeya</option>
              <option value="Mwanza">Mwanza</option>
            </select>
          </div>
        </div>

        {/* Time of Day (Hour) */}
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Time of Day: <span className="font-mono text-indigo-400">{hour.toString().padStart(2, '0')}:00</span>
            </label>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${hour < 6 || hour > 22 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
              {hour < 6 || hour > 22 ? 'Off-Hours (Higher Risk)' : 'Standard Business Hours'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>00:00 (Midnight)</span>
            <span>06:00 (Morning)</span>
            <span>12:00 (Noon)</span>
            <span>18:00 (Evening)</span>
            <span>23:00 (Night)</span>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5" />
            Predict Fraud
          </button>
        </div>
      </form>
    </div>
  );
};
