import React from 'react';
import { CheckCircle, Printer, X } from 'lucide-react';

export default function QuoteSummaryModal({ response, pricing, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const currentPricing = pricing || { itemUnitPrice: 0, totalQuantity: 0, setupFee: 0, grandTotal: 0 };

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:backdrop-blur-none">
      <div className="bg-brand-card border border-brand-border/60 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col print:border-none print:shadow-none print:w-full">
        
        {/* Modal Actions Header */}
        <div className="p-4 bg-brand-dark/30 border-b border-brand-border/40 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2 text-brand-accent">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#F3F4F6]">Order Status</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="glass-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              PRINT
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-brand-border/40 text-brand-text/60 hover:text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simplified Invoice Body */}
        <div className="p-8 text-center space-y-6 print:p-0 print:text-black">
          
          {/* Success Status Headline */}
          <div className="space-y-2 flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce print:hidden" />
            <h1 className="text-xl font-black tracking-wider text-emerald-400 print:text-black uppercase">Your Order is Submitted!</h1>
            <p className="text-xs text-brand-text/60 print:text-black">
              Quote Reference: <span className="font-mono text-brand-primary font-bold">#{response?._id ? response._id.toUpperCase() : 'PENDING'}</span>
            </p>
          </div>

          <hr className="border-brand-border/40 print:border-black" />

          {/* Pricing Summary Grid */}
          <div className="space-y-3 text-sm max-w-xs mx-auto text-left print:text-black">
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest text-center mb-4 print:text-black">Pricing Statement</h3>
            
            <div className="flex justify-between">
              <span className="text-brand-text/60 print:text-black">Effective Unit Price:</span>
              <span className="font-mono font-semibold text-[#F3F4F6] print:text-black">${(currentPricing.itemUnitPrice || 0).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-brand-text/60 print:text-black">Total Quantities:</span>
              <span className="font-mono font-semibold text-[#F3F4F6] print:text-black">{currentPricing.totalQuantity || 0} units</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-brand-text/60 print:text-black">Blueprint Layout Setup:</span>
              <span className="font-mono font-semibold text-[#F3F4F6] print:text-black">${(currentPricing.setupFee || 0).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-t border-brand-border/40 pt-3 text-base font-bold print:border-black">
              <span className="text-brand-primary print:text-black">Grand Total:</span>
              <span className="font-mono text-emerald-400 text-lg print:text-black">${(currentPricing.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Print note footer */}
        <div className="p-4 bg-brand-dark/20 border-t border-brand-border/40 text-center text-[10px] text-brand-text/40 print:hidden">
          Designed By Muhammad Sami
        </div>
      </div>
    </div>
  );
}