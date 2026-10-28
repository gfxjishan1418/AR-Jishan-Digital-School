import React from 'react';
import { Invoice, School } from '../../types';
import { Button } from '../ui/Button';
import { Printer, CheckCircle2 } from 'lucide-react';

interface PrintableReceiptProps {
  invoice: Invoice;
  school: School;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ invoice, school }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <Button onClick={handlePrint} variant="primary" icon={<Printer className="w-4 h-4" />}>
          Print Official Receipt
        </Button>
      </div>

      <div className="print-area bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-sm max-w-2xl mx-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-brand-700 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img src={school.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border border-brand-200" />
            <div>
              <h2 className="text-xl font-bold text-brand-900 uppercase tracking-tight">{school.name}</h2>
              <p className="text-xs text-slate-600">{school.address}</p>
              <p className="text-xs text-slate-500 font-medium">EIIN: {school.eiinNumber} • Board: {school.board}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
              Payment Voucher
            </span>
            <p className="text-xs font-semibold text-slate-800">No: {invoice.invoiceNo}</p>
            <p className="text-xs text-slate-500">Date: {invoice.paidDate || new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>

        {/* Student details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
          <div>
            <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-900">{invoice.studentName}</strong></p>
            <p className="mt-1"><span className="text-slate-500">Class:</span> <strong className="text-slate-900">{invoice.className}</strong></p>
            <p className="mt-1"><span className="text-slate-500">Student ID:</span> <strong>{invoice.studentId}</strong></p>
          </div>
          <div>
            <p><span className="text-slate-500">Fee Month:</span> <strong className="text-slate-900">{invoice.month}</strong></p>
            <p className="mt-1"><span className="text-slate-500">Payment Channel:</span> <strong className="text-brand-700">{invoice.paymentMethod || 'bKash / Cash'}</strong></p>
            <p className="mt-1"><span className="text-slate-500">Transaction ID:</span> <span className="font-mono">{invoice.transactionId || 'TXN-DIRECT'}</span></p>
          </div>
        </div>

        {/* Invoice breakdown table */}
        <table className="w-full text-xs text-left mb-6 border border-slate-200">
          <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">SL</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-right">Amount ({school.currencySymbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2 px-3">01</td>
              <td className="py-2 px-3 font-medium">Monthly Academic Tuition Fee ({invoice.month})</td>
              <td className="py-2 px-3 text-right">{invoice.amount.toLocaleString()}</td>
            </tr>
            {invoice.discount > 0 && (
              <tr>
                <td className="py-2 px-3">02</td>
                <td className="py-2 px-3 text-emerald-600 font-medium">Special Waiver / Merit Scholarship</td>
                <td className="py-2 px-3 text-right text-emerald-600">-{invoice.discount.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
            <tr>
              <td colSpan={2} className="py-2 px-3 text-right">Total Payable:</td>
              <td className="py-2 px-3 text-right">{school.currencySymbol} {(invoice.amount - invoice.discount).toLocaleString()}</td>
            </tr>
            <tr className="text-emerald-700">
              <td colSpan={2} className="py-2 px-3 text-right">Paid Amount:</td>
              <td className="py-2 px-3 text-right">{school.currencySymbol} {invoice.paidAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-2 px-3 text-right">Balance Due:</td>
              <td className="py-2 px-3 text-right text-rose-600">{school.currencySymbol} {invoice.balance.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        {/* Status verification banner */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 mb-8">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Payment verified digitally. Computer generated receipt does not require physical stamp.</span>
        </div>

        {/* Signatures */}
        <div className="flex justify-between pt-8 text-xs text-slate-500 border-t border-dashed border-slate-300">
          <div className="text-center">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p>Student / Depositor</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p>Accounts Officer</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p>Principal / Authorized Sign</p>
          </div>
        </div>
      </div>
    </div>
  );
};
