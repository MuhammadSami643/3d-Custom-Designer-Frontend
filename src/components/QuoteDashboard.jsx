import React, { useEffect, useState } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { ArrowLeft, Trash2, Calendar, FileCheck, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';
import QuoteSummaryModal from './QuoteSummaryModal';

export default function QuoteDashboard() {
  const store = useCustomizerStore();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    store.fetchUserDesigns();
    fetchQuotes();
  }, [store.token]);

  const fetchQuotes = async () => {
    setQuotesLoading(true);
    try {
      const API_URL = 'http://localhost:3000/api';
      const headers = store.token ? { Authorization: `Bearer ${store.token}` } : {};
      const res = await fetch(`${API_URL}/orders`, { headers });
      
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      } else {
        // Fallback to local storage mock quotes if server is offline or fails
        const mockQuotes = JSON.parse(localStorage.getItem('mock_quotes')) || [];
        setQuotes(mockQuotes);
      }
    } catch (err) {
      console.warn('API Quote Fetch failed. Loading mock local quotes.');
      const mockQuotes = JSON.parse(localStorage.getItem('mock_quotes')) || [];
      setQuotes(mockQuotes);
    } finally {
      setQuotesLoading(false);
    }
  };

  const handleDeleteDesign = (id) => {
    if (window.confirm('Are you sure you want to delete this design configuration?')) {
      store.deleteDesign(id);
    }
  };

  const handleLoadDesign = (design) => {
    store.loadDesign(design);
  };

  return (
    <div className="flex-grow p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center border-b border-brand-border/40 pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#F3F4F6]">Dashboard & History</h2>
          <p className="text-xs text-brand-text/50">Manage your saved 3D blueprints and submitted team quotes.</p>
        </div>
        <button
          onClick={() => store.setView('customizer')}
          className="glass-btn-secondary py-2 text-xs flex items-center gap-1.5 uppercase font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Studio
        </button>
      </div>

      {/* Cloud Synchronization Warning */}
      {!store.token && (
        <div className="glass-panel p-4 rounded-xl flex items-start gap-3 bg-amber-500/10 border-amber-500/30 text-amber-200">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide">Offline Local Mode</h4>
            <p className="text-[11px] text-amber-200/70 mt-1">
              You are currently viewing design files saved directly inside your browser cache. 
              <button onClick={() => store.setView('login')} className="underline font-semibold ml-1 hover:text-white">
                Log In or Register
              </button> to back up your roster blueprints to the cloud!
            </p>
          </div>
        </div>
      )}

      {/* Grid: Designs & Quotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Saved Configurations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/20 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Saved 3D Blueprints ({store.designs.length})</h3>
          </div>

          {store.designsLoading ? (
            <div className="text-center py-10 text-xs text-brand-text/40">Loading saved designs...</div>
          ) : store.designs.length === 0 ? (
            <div className="glass-panel p-8 rounded-xl text-center text-xs text-brand-text/40">
              No saved configurations found. Go to the Customizer Studio and save your designs!
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
              {store.designs.map((design) => (
                <div key={design._id || design.id} className="glass-panel p-4 rounded-xl flex justify-between items-center hover:border-brand-primary/30 transition-all">
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-sm font-semibold truncate text-[#F3F4F6] uppercase">{design.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-text/50 uppercase">
                      <Cpu className="w-3 h-3 text-brand-primary" />
                      <span>{design.productType}</span>
                      <span>•</span>
                      <span>Colors: {Object.keys(design.colors).length} zones</span>
                      {design.isLocal && <span className="bg-brand-border px-1.5 py-0.5 rounded text-[8px] font-bold">Local</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleLoadDesign(design)}
                      className="glass-btn-primary px-3 py-1.5 text-[10px] uppercase font-bold"
                    >
                      LOAD
                    </button>
                    <button
                      onClick={() => handleDeleteDesign(design._id || design.id)}
                      className="p-1.5 border border-red-900/40 hover:bg-red-600/10 text-red-400 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submitted Quotes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/20 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Historical Quotes ({quotes.length})</h3>
          </div>

          {quotesLoading ? (
            <div className="text-center py-10 text-xs text-brand-text/40">Loading historical quotes...</div>
          ) : quotes.length === 0 ? (
            <div className="glass-panel p-8 rounded-xl text-center text-xs text-brand-text/40">
              No historical quotes submitted yet. Submit a roster inside the Customizer checkout!
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
              {quotes.map((quote) => {
                const qQty = quote.roster.reduce((a, r) => a + (parseInt(r.quantity) || 0), 0);
                // Extract price mockup totals if needed
                const totalCost = quote.roster.reduce((a, r) => a + (r.quantity * 59.99), 15); // mock total representation
                return (
                  <div key={quote._id} className="glass-panel p-4 rounded-xl flex justify-between items-center hover:border-brand-primary/30 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-brand-primary font-mono">#{quote._id.slice(-6).toUpperCase()}</h4>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                          {quote.status || 'Received'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-text/90 uppercase">{quote.contactDetails?.teamName || 'Independent Team'}</p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-brand-text/50 uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{qQty} units</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const basePrice = quote.designDetails.productType === 'jersey' ? 59.99 : 24.99;
                        const logoFee = quote.designDetails.logoUrl ? 10.00 : 0.00;
                        const textFee = quote.designDetails.customText ? 5.00 : 0.00;
                        const itemUnitPrice = basePrice + logoFee + textFee;
                        const totalQuantity = qQty;
                        const setupFee = totalQuantity > 0 ? 15.00 : 0.00;
                        const grandTotal = (itemUnitPrice * totalQuantity) + setupFee;
                        
                        setSelectedQuote({
                          quote,
                          pricing: { itemUnitPrice, totalQuantity, setupFee, grandTotal }
                        });
                      }}
                      className="glass-btn-secondary px-3 py-1.5 text-[10px] uppercase font-bold flex items-center gap-1"
                    >
                      INVOICE
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Quote summary overlay dialog */}
      {selectedQuote && (
        <QuoteSummaryModal
          response={selectedQuote.quote}
          pricing={selectedQuote.pricing}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
}
