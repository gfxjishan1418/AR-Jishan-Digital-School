import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { Invoice } from '../../types';
import { INITIAL_AI_DEFAULTERS } from '../../data/initialMockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PrintableReceipt } from '../../components/common/PrintableReceipt';
import { 
  CreditCard, Search, Download, DollarSign, AlertCircle, 
  CheckCircle2, Printer, Plus, Sparkles, Send 
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();
  const [invoices, setInvoices] = useState<Invoice[]>(() => StorageService.getInvoices());
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Payment Form
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'bKash' | 'Nagad' | 'Cash' | 'Bank Transfer'>('bKash');
  const [trxId, setTrxId] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = 
      inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.className.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalBilled = invoices.reduce((acc, curr) => acc + (curr.amount - curr.discount), 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = invoices.reduce((acc, curr) => acc + curr.balance, 0);

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balance);
    setTrxId(`BK-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setIsPayModalOpen(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const updated = StorageService.recordPayment(selectedInvoice.id, Number(payAmount), payMethod, trxId);
    setInvoices(updated);
    setIsPayModalOpen(false);

    // Open receipt immediately
    const freshlyPaid = updated.find(i => i.id === selectedInvoice.id);
    if (freshlyPaid) {
      setSelectedInvoice(freshlyPaid);
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.feeManagement} — Accounts & Invoicing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated tuition fee collection, bKash/Nagad verification, receipts & defaulter tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            Currency: {school.currency} ({school.currencySymbol})
          </Badge>
        </div>
      </div>

      {/* Summary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-brand-600">
          <p className="text-xs font-semibold text-slate-500">Total Invoiced (Current Term)</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {school.currencySymbol} {totalBilled.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Includes tuition, lab & exam charges</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-slate-500">Total Collected</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {school.currencySymbol} {totalCollected.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% Realized
          </p>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <p className="text-xs font-semibold text-slate-500">Outstanding Balance</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {school.currencySymbol} {totalPending.toLocaleString()}
          </h3>
          <p className="text-[11px] text-rose-500 font-bold mt-0.5">Requires automated SMS follow-up</p>
        </Card>
      </div>

      {/* AI Defaulter Risk Alerts Card */}
      <Card className="p-4 bg-gradient-to-r from-rose-50/50 via-white to-amber-50/50 dark:from-slate-900 dark:to-slate-900 border-rose-200 dark:border-rose-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
            <h4 className="font-bold text-xs text-rose-900 dark:text-rose-300 uppercase tracking-wider">
              {t.ai.feeDefaulterAlerts} (Predictive Intelligence)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">4 students flagged for proactive counseling</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {INITIAL_AI_DEFAULTERS.map((def) => (
            <div key={def.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{def.studentName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                  {def.riskScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{def.className} • Roll {def.rollNo}</p>
              <p className="text-xs font-bold text-rose-600 mt-1">Due: {school.currencySymbol} {def.dueAmount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, invoice #, class..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Invoice Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Payable</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNo}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{inv.studentName}</p>
                    <p className="text-[10px] text-slate-500">{inv.className}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {inv.month}
                  </td>

                  <td className="py-3 px-4 text-right font-semibold">
                    {school.currencySymbol} {(inv.amount - inv.discount).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    {school.currencySymbol} {inv.paidAmount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-rose-600">
                    {school.currencySymbol} {inv.balance.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <Badge 
                      variant={inv.status === 'Paid' ? 'emerald' : inv.status === 'Partial' ? 'blue' : inv.status === 'Pending' ? 'amber' : 'rose'}
                    >
                      {inv.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.balance > 0 && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenPayment(inv)}
                        >
                          Collect Fee
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsReceiptModalOpen(true);
                        }}
                        icon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Receipt
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Collect Fee / Record Payment Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Record Fee Collection — ${selectedInvoice.studentName}`}
          maxWidth="md"
        >
          <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p><span className="text-slate-500">Invoice:</span> <strong>{selectedInvoice.invoiceNo}</strong> ({selectedInvoice.month})</p>
              <p className="mt-1"><span className="text-slate-500">Outstanding Balance:</span> <strong className="text-rose-600">{school.currencySymbol} {selectedInvoice.balance.toLocaleString()}</strong></p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {(['bKash', 'Nagad', 'Cash', 'Bank Transfer'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayMethod(method)}
                    className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                      payMethod === method
                        ? 'border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount to Collect ({school.currencySymbol})</label>
              <input
                type="number"
                required
                max={selectedInvoice.balance}
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-base text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Transaction ID / Reference Number</label>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                placeholder="e.g. BK-9948271"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm & Issue Receipt
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Receipt Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="AR Jishan Digital School & College — Official Payment Receipt"
          maxWidth="2xl"
        >
          <PrintableReceipt invoice={selectedInvoice} school={school} />
        </Modal>
      )}

    </div>
  );
};
