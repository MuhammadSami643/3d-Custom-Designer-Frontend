import React, { useState } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { SIZES, PRODUCTS } from '../utils/constants';
import { Plus, Trash2, Calculator, ClipboardList, Loader } from 'lucide-react';
import QuoteSummaryModal from './QuoteSummaryModal';

export default function RosterTable() {
  const store = useCustomizerStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState(null);
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    teamName: '',
    notes: ''
  });

  const activeProductConfig = PRODUCTS[store.activeProduct];

  // Pricing calculations
  const basePrice = activeProductConfig.basePrice;
  const logoFee = store.logoUrl ? 10.00 : 0.00;
  const textFee = store.customText ? 5.00 : 0.00;
  const itemUnitPrice = basePrice + logoFee + textFee;

  const totalQuantity = store.roster.reduce((acc, row) => acc + (parseInt(row.quantity) || 0), 0);
  const subtotal = itemUnitPrice * totalQuantity;
  const setupFee = totalQuantity > 0 ? 15.00 : 0.00; // Flat layout setup fee
  const grandTotal = subtotal + setupFee;

  const handleInputChange = (id, field, value) => {
    store.updateRosterRow(id, field, value);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await store.submitQuote(contactInfo);
      setQuoteResponse(response);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseQuoteModal = () => {
    setQuoteResponse(null);
    setShowCheckoutModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-brand-card/30 border-l border-brand-border/60">
      {/* Roster Header */}
      <div className="p-4 border-b border-brand-border/60 bg-brand-dark/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-brand-primary" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-brand-text">Uniform Roster Sheet</h3>
        </div>
        <button
          onClick={store.addRosterRow}
          className="flex items-center gap-1 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/30 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD ROW
        </button>
      </div>

      {/* Roster Spreadsheet Grid */}
      <div className="flex-grow overflow-auto p-4 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-brand-border/50 text-brand-text/50 uppercase tracking-wider font-bold">
              <th className="pb-2 w-10 text-center">No.</th>
              <th className="pb-2 pl-2">Player Name</th>
              <th className="pb-2 w-16">Number</th>
              <th className="pb-2 w-20">Size</th>
              <th className="pb-2 w-16 text-center">Qty</th>
              <th className="pb-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/30">
            {store.roster.map((row, idx) => (
              <tr key={row.id} className="hover:bg-brand-border/10 transition-colors">
                <td className="py-2.5 text-center text-brand-text/40 font-mono">{idx + 1}</td>
                <td className="py-2.5 pl-2">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                    placeholder="e.g. SMITH"
                    className="w-full bg-brand-dark/30 border border-brand-border/60 hover:border-brand-border rounded px-2.5 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-primary transition-all uppercase"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <input
                    type="text"
                    value={row.number}
                    onChange={(e) => handleInputChange(row.id, 'number', e.target.value)}
                    placeholder="23"
                    className="w-full bg-brand-dark/30 border border-brand-border/60 hover:border-brand-border rounded px-2.5 py-1 text-xs text-brand-text text-center focus:outline-none focus:border-brand-primary transition-all"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <select
                    value={row.size}
                    onChange={(e) => handleInputChange(row.id, 'size', e.target.value)}
                    className="w-full bg-brand-dark/30 border border-brand-border/60 hover:border-brand-border rounded px-2 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-primary cursor-pointer transition-all"
                  >
                    {SIZES.map((sz) => (
                      <option key={sz} value={sz} className="bg-brand-card">{sz}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(row.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-brand-dark/30 border border-brand-border/60 hover:border-brand-border rounded py-1 text-xs text-brand-text text-center focus:outline-none focus:border-brand-primary transition-all"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => store.deleteRosterRow(row.id)}
                    disabled={store.roster.length === 1}
                    className="text-brand-text/40 hover:text-red-400 disabled:opacity-30 disabled:hover:text-brand-text/40 p-1 rounded hover:bg-brand-border/20 transition-all"
                    title="Delete Row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing and Quote Submissions */}
      <div className="p-4 border-t border-brand-border/60 bg-brand-dark/20 space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary">
          <Calculator className="w-4 h-4" />
          <span>Quote Calculator</span>
        </div>
        
        <div className="space-y-1.5 text-xs text-brand-text/70">
          <div className="flex justify-between">
            <span>Unit Price ({activeProductConfig.name})</span>
            <span className="font-mono">${basePrice.toFixed(2)}</span>
          </div>
          {logoFee > 0 && (
            <div className="flex justify-between text-brand-accent">
              <span>Logo Sublimation Layer</span>
              <span className="font-mono">+${logoFee.toFixed(2)}</span>
            </div>
          )}
          {textFee > 0 && (
            <div className="flex justify-between text-brand-accent">
              <span>Dynamic Text Overlays</span>
              <span className="font-mono">+${textFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-brand-border/30 pt-1.5 font-semibold text-brand-text">
            <span>Effective Unit Cost</span>
            <span className="font-mono text-white">${itemUnitPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Roster Total Quantity</span>
            <span className="font-mono text-white">{totalQuantity} Units</span>
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-brand-text/60">
            <span>Flat Blueprint Setup Fee</span>
            <span className="font-mono">${setupFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-brand-border/50 pt-3 text-sm font-bold uppercase">
          <span className="tracking-wide text-brand-primary">Estimated Total</span>
          <span className="font-mono text-lg text-white">${grandTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={() => {
            if (totalQuantity === 0) {
              alert('Please specify quantities in your roster before checkout.');
              return;
            }
            setShowCheckoutModal(true);
          }}
          className="w-full glass-btn-primary py-3 text-xs tracking-wider uppercase font-bold shadow"
        >
          SUBMIT ORDER QUOTE
        </button>
      </div>

      {/* Checkout Contact Dialog */}
      {showCheckoutModal && !quoteResponse && (
        <div className="fixed inset-0 bg-brand-dark/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCheckoutSubmit} className="glass-panel w-full max-w-md p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold tracking-wider text-brand-primary uppercase">Quote Contact Details</h3>
            <p className="text-xs text-brand-text/60">
              Submit your active design configuration and team roster. Our team will review your order details and follow up with a final proof invoice.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="John Doe"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="coach@tigers.com"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">Team Name / Organization</label>
                <input
                  type="text"
                  required
                  value={contactInfo.teamName}
                  onChange={(e) => setContactInfo({ ...contactInfo, teamName: e.target.value })}
                  placeholder="e.g. Varsity Tigers"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">Special Instructions / Placement Notes</label>
                <textarea
                  value={contactInfo.notes}
                  onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                  placeholder="Notes on collar styling, specific embroidery threads, or custom sleeve trims..."
                  className="glass-input text-xs h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-brand-border/40">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="glass-btn-secondary px-3 py-1.5 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="glass-btn-primary px-4 py-1.5 text-xs uppercase flex items-center gap-1.5"
              >
                {submitting && <Loader className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quote Submission Invoice Mockup */}
      {quoteResponse && (
        <QuoteSummaryModal
          response={quoteResponse}
          pricing={{ itemUnitPrice, totalQuantity, setupFee, grandTotal }}
          onClose={handleCloseQuoteModal}
        />
      )}
    </div>
  );
}
