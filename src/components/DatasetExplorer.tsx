import React, { useState, useMemo } from 'react';
import { SAMPLE_TRANSACTIONS } from '../data/transactions';
import { Transaction, PredictionInput } from '../types';
import { Database, Search, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DatasetExplorerProps {
  onSelectTransaction: (input: PredictionInput) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ onSelectTransaction }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'fraud' | 'legit'>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((txn) => {
      const isFraud = String(txn.FraudLabel) === '1';
      if (filterType === 'fraud' && !isFraud) return false;
      if (filterType === 'legit' && isFraud) return false;

      if (channelFilter !== 'all' && txn.Channel !== channelFilter) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchId = txn.TransactionID.toLowerCase().includes(query);
        const matchCust = txn.CustomerID.toLowerCase().includes(query);
        const matchMerch = txn.Merchant.toLowerCase().includes(query);
        const matchLoc = txn.Location.toLowerCase().includes(query);
        if (!matchId && !matchCust && !matchMerch && !matchLoc) return false;
      }

      return true;
    });
  }, [search, filterType, channelFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLoad = (txn: Transaction) => {
    const amt = typeof txn.Amount === 'number' ? txn.Amount : parseFloat(txn.Amount) || 1000;
    let hour = 12;
    if (txn.Timestamp && txn.Timestamp.includes(' ') && txn.Timestamp.includes(':')) {
      const parts = txn.Timestamp.split(' ')[1].split(':');
      hour = parseInt(parts[0], 10);
    }
    onSelectTransaction({
      amount: amt,
      merchant: txn.Merchant,
      location: txn.Location.replace(/-/g, ' '),
      channel: txn.Channel === 'MobileApp' ? 'Mobile' : txn.Channel === 'Web' ? 'Online' : txn.Channel,
      hour,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Dataset Explorer (synthetic_dataset.csv)
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Browse financial records. Click &quot;Test in Predictor&quot; to test model reaction.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Total Loaded: {SAMPLE_TRANSACTIONS.length}
          </span>
          <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Fraud: {SAMPLE_TRANSACTIONS.filter((t) => String(t.FraudLabel) === '1').length}
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Legit: {SAMPLE_TRANSACTIONS.filter((t) => String(t.FraudLabel) === '0').length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, customer, merchant, location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => {
              setFilterType('all');
              setCurrentPage(1);
            }}
            className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({SAMPLE_TRANSACTIONS.length})
          </button>
          <button
            onClick={() => {
              setFilterType('fraud');
              setCurrentPage(1);
            }}
            className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'fraud' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Fraud Only
          </button>
          <button
            onClick={() => {
              setFilterType('legit');
              setCurrentPage(1);
            }}
            className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'legit' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Legit Only
          </button>
        </div>

        {/* Channel filter */}
        <select
          value={channelFilter}
          onChange={(e) => {
            setChannelFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Channels</option>
          <option value="ATM">ATM Terminal</option>
          <option value="MobileApp">Mobile App</option>
          <option value="POS">Point of Sale (POS)</option>
          <option value="Web">Web / Online</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5">ID / Customer</th>
              <th className="py-3 px-3.5">Amount</th>
              <th className="py-3 px-3.5">Merchant</th>
              <th className="py-3 px-3.5">Location</th>
              <th className="py-3 px-3.5">Channel</th>
              <th className="py-3 px-3.5">Ground Truth</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              currentTransactions.map((txn) => {
                const isFraud = String(txn.FraudLabel) === '1';
                const formattedAmt =
                  typeof txn.Amount === 'number'
                    ? txn.Amount.toLocaleString()
                    : parseFloat(txn.Amount).toLocaleString();

                return (
                  <tr key={txn.TransactionID} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-mono text-white text-[11px] truncate max-w-[130px]">
                        {txn.TransactionID}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{txn.CustomerID}</div>
                    </td>
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-200">
                      TSh {formattedAmt}
                    </td>
                    <td className="py-3 px-3.5 text-slate-300 font-medium">{txn.Merchant}</td>
                    <td className="py-3 px-3.5 text-slate-400">{txn.Location}</td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {txn.Channel}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isFraud
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isFraud ? (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Fraud (1)
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Genuine (0)
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => handleLoad(txn)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 transition-colors cursor-pointer"
                        title="Load into prediction model"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        Test
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
          {filteredTransactions.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-white cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="font-mono text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-white cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
