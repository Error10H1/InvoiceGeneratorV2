import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Settings,
  FileText,
  Briefcase,
  CreditCard,
  Percent,
  ChevronDown,
  LayoutTemplate,
  Package,
  Image as ImageIcon,
  Upload,
  FolderOpen,
  X,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Download,
  Upload as UploadIcon,
  RefreshCw,
  CheckCircle,
  Circle,
  Eye,
  EyeOff,
  FilePlus,
  Copy,
  Building2,
  Globe,
  PenTool,
  Mail,
  StickyNote,
  Tag,
  Type,
  Search,
  List,
  Calendar,
  Palette
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, title, disabled }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 active:scale-95",
    outline: "border border-slate-300 text-slate-600 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2"
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} title={title}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};

// --- Initial Data / Utils ---

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substr(2, 9);
};

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const DEFAULT_MARKUP_PROFILES = [
  { id: 'm1', name: 'Standard Margin', type: 'percent', value: 20 },
  { id: 'm2', name: 'Friends & Family', type: 'percent', value: 0 },
  { id: 'm3', name: 'Rush Job', type: 'percent', value: 50 },
  { id: 'm4', name: 'Fixed Service Fee', type: 'fixed', value: 150 },
];

const DEFAULT_DEPOSIT_PROFILES = [
  { id: 'd1', name: '50% Upfront', type: 'percent', value: 50 },
  { id: 'd2', name: 'Booking Fee ($500)', type: 'fixed', value: 500 },
  { id: 'd3', name: 'No Deposit / Net 30', type: 'percent', value: 0 },
];

const DEFAULT_MATERIALS = [
  { id: 'mat1', name: 'Web Design Consultation (Hour)', price: 150, image: null },
  { id: 'mat2', name: 'Hosting Setup', price: 75, image: null },
];

const DEFAULT_BRANDING_PROFILES = [];

const AVAILABLE_FONTS = [
  { name: 'Inter', family: "'Inter', sans-serif", category: 'Sans Serif' },
  { name: 'Roboto', family: "'Roboto', sans-serif", category: 'Sans Serif' },
  { name: 'Open Sans', family: "'Open Sans', sans-serif", category: 'Sans Serif' },
  { name: 'Lato', family: "'Lato', sans-serif", category: 'Sans Serif' },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Sans Serif' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'Display' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Serif' },
  { name: 'Merriweather', family: "'Merriweather', serif", category: 'Serif' },
  { name: 'Lora', family: "'Lora', serif", category: 'Serif' },
  { name: 'Inconsolata', family: "'Inconsolata', monospace", category: 'Monospace' },
  { name: 'Courier Prime', family: "'Courier Prime', monospace", category: 'Monospace' },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'Handwriting' },
];

const FontSelect = ({ label, value, onChange, onApplyAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFonts = AVAILABLE_FONTS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex justify-between items-end mb-1">
        <label className="text-xs font-semibold uppercase text-slate-400 block">{label}</label>
        {onApplyAll && (
          <button
            onClick={onApplyAll}
            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium hover:underline bg-blue-50 px-2 py-0.5 rounded"
            title="Apply this font to all sections"
          >
            Apply to All
          </button>
        )}
      </div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 bg-white border border-slate-200 rounded text-sm flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        <span style={{ fontFamily: AVAILABLE_FONTS.find(f => f.name === value)?.family }}>
          {value}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded pl-8 p-2 outline-none focus:border-blue-500"
                placeholder="Search fonts..."
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredFonts.map(font => (
              <button
                key={font.name}
                onClick={() => {
                  onChange(font.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2 px-3 text-sm hover:bg-slate-50 flex justify-between items-center ${value === font.name ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                style={{ fontFamily: font.family }}
              >
                <span className="truncate">{font.name}</span>
              </button>
            ))}
            {filteredFonts.length === 0 && (
              <div className="p-3 text-xs text-slate-400 text-center">No fonts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_INVOICE_STATE = {
  number: 'INV-001',
  template: 'invoice', // invoice, receipt, quote, email
  showSignature: false,
  showSignatureDateLine: false, // New Value
  showNotes: true,
  showNotesLabel: true,
  showMaterialsList: false, // New Value
  showDateLine: false, // New Value
  showDueDateLine: false, // New Value
  hideItemsOnMain: false, // New Value
  name: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: { name: 'Your Company', address: '123 Creative Way\nDesign City, ST 12345', extra: '' },
  to: { name: 'Client Name', address: '456 Client Road\nBusiness Town, ST 67890' },
  items: [
    { id: 'init_item', description: 'Initial Consultation', quantity: 1, price: 150, image: null }
  ],
  notes: 'Thank you for your business. Please send payment within 14 days.',
  isPaid: false,
  hideMarkup: false,
};

// --- Main App ---

export default function App() {
  // --- Data Loading Hooks ---
  const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
      try {
        const saved = localStorage.getItem(key);
        if (saved === null || saved === undefined) return defaultValue;
        const parsed = JSON.parse(saved);
        return (parsed === null || parsed === undefined) ? defaultValue : parsed;
      } catch (e) {
        console.error(`Error loading ${key}`, e);
        return defaultValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.error(`Error saving ${key}`, e);
      }
    }, [key, state]);

    return [state, setState];
  };

  const [preferences, setPreferences] = usePersistentState('proInvoice_prefs', {
    selectedMarkupId: 'm1',
    selectedDepositId: 'd1',
    selectedBrandingId: '',
    taxRate: 8.25,
    headingFont: 'Inter',
    bodyFont: 'Inter',
    dataFont: 'Inter'
  });

  // --- Style Injection Hook ---
  useEffect(() => {
    // 1. Tailwind CSS is now handled by the build system (postcss/vite).
    // CDN injection removed to prevent conflicts.

    // 2. Inject Google Fonts Dynamically based on selection
    const fontsToLoad = [
      preferences.headingFont,
      preferences.bodyFont,
      preferences.dataFont
    ].filter(Boolean);

    // Unique fonts only
    const uniqueFonts = [...new Set(fontsToLoad)];

    if (uniqueFonts.length > 0) {
      const fontUrl = `https://fonts.googleapis.com/css2?${uniqueFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`).join('&')}`;

      // Remove old font link if it exists
      const oldLink = document.getElementById('dynamic-font-link');
      if (oldLink) oldLink.remove();

      const link = document.createElement('link');
      link.id = 'dynamic-font-link';
      link.href = fontUrl;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // 3. Inject Base Styles specifically for printing and body
    const styleId = 'injected-base-styles';

    const getFontFamily = (name) => {
      const f = AVAILABLE_FONTS.find(font => font.name === name);
      return f ? f.family : 'inherit';
    };

    const headingFamily = getFontFamily(preferences.headingFont);
    const bodyFamily = getFontFamily(preferences.bodyFont);
    const dataFamily = getFontFamily(preferences.dataFont);

    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
        /* Default App Font */
        body { font-family: 'Inter', sans-serif; }

        /* Scoped Invoice Fonts */
        #invoice-content { 
          font-family: ${bodyFamily}; 
          color: #1e293b; 
        }
        
        #invoice-content h1, 
        #invoice-content h2, 
        #invoice-content h3, 
        #invoice-content h4, 
        #invoice-content h5, 
        #invoice-content h6, 
        #invoice-content .font-heading {
          font-family: ${headingFamily};
        }
        
        #invoice-content table, 
        #invoice-content .font-data, 
        #invoice-content input[type="number"] {
          font-family: ${dataFamily};
        }

        /* Ensure inputs inside invoice inherit or use specific fonts */
        #invoice-content input[type="text"],
        #invoice-content textarea {
          font-family: ${bodyFamily};
        }

        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          /* Ensure full width and auto height in print */
          #invoice-content { 
            width: 100% !important; 
            max-width: none !important; 
            box-shadow: none !important;
            min-height: 0 !important; 
            height: auto !important;
            display: block !important;
            overflow: visible !important;
          }
          #invoice-items-container {
            flex-grow: 0 !important;
          }
        }
        tr, .break-inside-avoid {
          page-break-inside: avoid;
        }
    `;
  }, [preferences.headingFont, preferences.bodyFont, preferences.dataFont]);

  // --- State ---

  const [invoice, setInvoice] = useState(() => {
    try {
      const saved = localStorage.getItem('proInvoice_currentDraft');
      const parsed = (saved && saved !== "undefined") ? JSON.parse(saved) : null;
      if (!parsed) return { ...DEFAULT_INVOICE_STATE, id: generateId() };

      return {
        ...DEFAULT_INVOICE_STATE,
        ...parsed,
        id: parsed.id || generateId(),
        from: { ...DEFAULT_INVOICE_STATE.from, ...(parsed.from || {}) },
        to: { ...DEFAULT_INVOICE_STATE.to, ...(parsed.to || {}) },
        items: Array.isArray(parsed.items) ? parsed.items : DEFAULT_INVOICE_STATE.items,
        template: parsed.template || DEFAULT_INVOICE_STATE.template,
        templateStyle: parsed.templateStyle || 'classic',
        showSignature: parsed.showSignature ?? DEFAULT_INVOICE_STATE.showSignature,
        showNotes: parsed.showNotes ?? DEFAULT_INVOICE_STATE.showNotes,
        showNotesLabel: parsed.showNotesLabel ?? DEFAULT_INVOICE_STATE.showNotesLabel,
        showMaterialsList: parsed.showMaterialsList ?? DEFAULT_INVOICE_STATE.showMaterialsList,
        hideItemsOnMain: parsed.hideItemsOnMain ?? DEFAULT_INVOICE_STATE.hideItemsOnMain
      };
    } catch (e) {
      console.error("State load error", e);
      return { ...DEFAULT_INVOICE_STATE, id: generateId() };
    }
  });

  const [markupProfiles, setMarkupProfiles] = usePersistentState('proInvoice_markups', DEFAULT_MARKUP_PROFILES);
  const [depositProfiles, setDepositProfiles] = usePersistentState('proInvoice_deposits', DEFAULT_DEPOSIT_PROFILES);

  // --- Material Profiles System ---
  const [materialProfiles, setMaterialProfiles] = usePersistentState('proInvoice_material_profiles', [{ id: 'default', name: 'Default List', items: DEFAULT_MATERIALS }]);
  const [activeProfileId, setActiveProfileId] = usePersistentState('proInvoice_active_profile_id', 'default');

  // Migration for legacy savedMaterials (if any exists in local storage but not in profiles)
  // Note: This logic is simplified; in a real app check for legacy key dominance.
  // For now, we assume if materialProfiles is default, we are good. 

  const [brandingProfiles, setBrandingProfiles] = usePersistentState('proInvoice_branding', DEFAULT_BRANDING_PROFILES);
  const [savedInvoices, setSavedInvoices] = usePersistentState('proInvoice_invoices', []);

  // Helper to update individual preferences
  const setPreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // UI State
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Temp State
  const [tempMaterialImage, setTempMaterialImage] = useState(null);
  const [saveName, setSaveName] = useState('');
  // const [fontSearch, setFontSearch] = useState(''); // New state for font search - REMOVED

  const [newBrand, setNewBrand] = useState({
    profileName: '',
    companyName: '',
    address: '',
    extra: '',
    logo: null,
    logoSize: 150,
    orientation: 'top'
  });

  const fileInputRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('proInvoice_currentDraft', JSON.stringify(invoice));
    }, 500);
    return () => clearTimeout(timer);
  }, [invoice]);

  // Emergency Reset Helper
  useEffect(() => {
    window.resetProInvoice = () => {
      if (confirm('Reset all data?')) {
        localStorage.clear();
        window.location.reload();
      }
    };
  }, []);

  // --- Calculations ---

  const totals = useMemo(() => {
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const activeMarkup = markupProfiles.find(p => p.id === preferences.selectedMarkupId);
    let markupAmount = 0;
    if (activeMarkup) {
      markupAmount = activeMarkup.type === 'percent'
        ? subtotal * (activeMarkup.value / 100)
        : activeMarkup.value;
    }

    const subtotalWithMarkup = subtotal + markupAmount;
    const taxAmount = subtotalWithMarkup * (preferences.taxRate / 100);
    const total = subtotalWithMarkup + taxAmount;

    const activeDeposit = depositProfiles.find(p => p.id === preferences.selectedDepositId);
    let depositAmount = 0;
    if (activeDeposit) {
      depositAmount = activeDeposit.type === 'percent'
        ? total * (activeDeposit.value / 100)
        : activeDeposit.value;
    }

    let balanceDue;
    if (invoice.isPaid) {
      balanceDue = 0;
    } else {
      if (depositAmount > total) depositAmount = total;
      balanceDue = total - depositAmount;
    }

    return {
      subtotal,
      markupAmount,
      markupName: activeMarkup?.name,
      subtotalWithMarkup,
      taxAmount,
      total,
      depositAmount,
      depositName: activeDeposit?.name,
      balanceDue
    };
  }, [invoice.items, invoice.isPaid, preferences, markupProfiles, depositProfiles]);

  const activeBranding = useMemo(() => brandingProfiles.find(l => l.id === preferences.selectedBrandingId), [brandingProfiles, preferences.selectedBrandingId]);

  // Filter fonts - REMOVED
  // const filteredFonts = useMemo(() => {
  //   if (!fontSearch) return AVAILABLE_FONTS;
  //   return AVAILABLE_FONTS.filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase()));
  // }, [fontSearch]);

  // --- Handlers ---

  const handleBrandSelect = (id) => {
    setPreference('selectedBrandingId', id);
    const profile = brandingProfiles.find(b => b.id === id);
    if (profile) {
      setInvoice(prev => ({
        ...prev,
        from: {
          name: profile.companyName,
          address: profile.address,
          extra: profile.extra
        }
      }));
    }
  };

  const getDocumentTitle = () => {
    switch (invoice.template) {
      case 'receipt': return 'Receipt';
      case 'quote': return 'Quote';
      case 'email': return 'Summary';
      default: return 'Invoice';
    }
  };

  const handleNewBrandLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBrand(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewBrand = () => {
    if (newBrand.profileName && newBrand.companyName) {
      const brandToSave = {
        id: generateId(),
        ...newBrand
      };
      setBrandingProfiles([...brandingProfiles, brandToSave]);
      setNewBrand({
        profileName: '',
        companyName: '',
        address: '',
        extra: '',
        logo: null,
        logoSize: 150,
        orientation: 'top'
      });
    }
  };

  const handleUpdateBrandProfile = (id, field, value) => {
    setBrandingProfiles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleNewInvoice = () => {
    if (confirm('Start a new invoice? This will clear the current form.')) {
      const currentFrom = activeBranding ? {
        name: activeBranding.companyName,
        address: activeBranding.address,
        extra: activeBranding.extra
      } : DEFAULT_INVOICE_STATE.from;

      setInvoice({
        ...DEFAULT_INVOICE_STATE,
        id: generateId(),
        from: currentFrom,
        number: 'INV-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          { id: generateId(), description: 'Initial Consultation', quantity: 1, price: 150, image: null }
        ]
      });
      setSaveName('');
    }
  };

  const handleAddItem = (item = null) => {
    if (item) {
      const newItem = {
        ...item,
        id: generateId(),
        description: item.name || item.description || '',
        quantity: 1
      };
      setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    } else {
      const newItem = {
        id: generateId(),
        description: '',
        quantity: 1,
        price: 0,
        image: null
      };
      setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
  };

  const handleUpdateItem = (id, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveItem = (id) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleItemImageUpload = (e, itemId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateItem(itemId, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    if (!window.html2pdf && !navigator.onLine) {
      alert("You are currently offline. The 'Download PDF' feature requires an internet connection to load the PDF engine. Please use the 'Print' button and select 'Save as PDF' instead.");
      setIsDownloading(false);
      return;
    }

    const loadPdfLibrary = () => {
      return new Promise((resolve, reject) => {
        if (window.html2pdf) {
          resolve(window.html2pdf);
          return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve(window.html2pdf);
        script.onerror = () => reject(new Error("Failed to load PDF library"));
        document.body.appendChild(script);
      });
    };

    try {
      const html2pdf = await loadPdfLibrary();
      const originalElement = document.getElementById('invoice-content');
      const clone = originalElement.cloneNode(true);

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.appendChild(clone);
      document.body.appendChild(container);

      const inputs = clone.querySelectorAll('textarea, input, select');
      inputs.forEach(input => {
        const textValue = input.value || '';
        const textNode = document.createElement('div');
        textNode.innerText = textValue;

        // Copy computed styles to preserve fonts (Data vs Body)
        const computedStyle = window.getComputedStyle(input);

        textNode.style.whiteSpace = 'pre-wrap';
        textNode.style.fontFamily = computedStyle.fontFamily;
        textNode.style.fontSize = computedStyle.fontSize;
        textNode.style.fontWeight = computedStyle.fontWeight;
        textNode.style.textAlign = computedStyle.textAlign; // Important for numbers
        textNode.style.color = '#334155';

        if (input.parentNode) {
          input.parentNode.replaceChild(textNode, input);
        }
      });

      const buttons = clone.querySelectorAll('button, .no-print');
      buttons.forEach(btn => btn.remove());

      const opt = {
        margin: 0,
        filename: `${invoice.number}_${invoice.to.name.replace(/\s+/g, '_') || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(clone).save();

      document.body.removeChild(container);
      setIsDownloading(false);

    } catch (err) {
      console.error("PDF Error:", err);
      setIsDownloading(false);
      if (confirm("Automatic PDF generation failed (likely due to connection). Use standard Print dialog?")) {
        handlePrint();
      }
    }
  };

  const handleMaterialImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempMaterialImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInvoice = (asNew = false) => {
    const name = saveName.trim() || invoice.name || `Invoice ${invoice.number}`;
    const idToUse = asNew ? generateId() : invoice.id;

    const invoiceToSave = {
      ...invoice,
      id: idToUse,
      name,
      savedAt: new Date().toISOString(),
      config: { ...preferences }
    };

    if (asNew) {
      setSavedInvoices([...savedInvoices, invoiceToSave]);
      setInvoice(invoiceToSave);
    } else {
      const existingIndex = savedInvoices.findIndex(inv => inv.id === invoice.id);
      if (existingIndex >= 0) {
        const newSavedInvoices = [...savedInvoices];
        newSavedInvoices[existingIndex] = invoiceToSave;
        setSavedInvoices(newSavedInvoices);
      } else {
        setSavedInvoices([...savedInvoices, invoiceToSave]);
      }
      setInvoice(prev => ({ ...prev, name }));
    }

    setShowSaveModal(false);
    setSaveName('');
  };

  const handleLoadInvoice = (savedInv) => {
    setInvoice({ ...savedInv });
    if (savedInv.config) {
      setPreferences(savedInv.config);
    }
    setShowLoadModal(false);
  };

  const handleDeleteSavedInvoice = (id) => {
    setSavedInvoices(savedInvoices.filter(inv => inv.id !== id));
  };

  const handleBackupData = () => {
    const backup = {
      version: 2,
      date: new Date().toISOString(),
      data: {
        markupProfiles,
        depositProfiles,
        materialProfiles, // Updated
        brandingProfiles,
        savedInvoices,
        preferences,
        currentDraft: invoice
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProInvoice_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup && backup.data) {
          if (confirm('This will overwrite all current data with the backup. Are you sure?')) {
            const { data } = backup;
            if (data.markupProfiles) setMarkupProfiles(data.markupProfiles);
            if (data.depositProfiles) setDepositProfiles(data.depositProfiles);

            // Restore Profiles directly if valid
            if (data.materialProfiles) {
              setMaterialProfiles(data.materialProfiles);
            }
            // Migrate legacy savedMaterials if present and no profiles
            else if (data.savedMaterials) {
              setMaterialProfiles([{ id: 'default', name: 'Imported List', items: data.savedMaterials }]);
            }

            if (data.brandingProfiles) setBrandingProfiles(data.brandingProfiles);
            if (data.logoProfiles) setBrandingProfiles(data.logoProfiles);
            if (data.savedInvoices) setSavedInvoices(data.savedInvoices);
            if (data.preferences) setPreferences(data.preferences);
            if (data.currentDraft) setInvoice(data.currentDraft);
            alert('Restore successful!');
            setShowConfigModal(false);
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error parsing backup file.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // --- Material Profile Helpers ---

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({ profileId: null, inputValue: '' });

  const handleCreateMaterialProfile = () => {
    const newProfile = {
      id: generateId(),
      name: 'New Profile',
      items: []
    };
    setMaterialProfiles([...materialProfiles, newProfile]);
  };

  const handleRenameMaterialProfile = (profileId, newName) => {
    setMaterialProfiles(prev => prev.map(p => p.id === profileId ? { ...p, name: newName } : p));
  };

  const handleDeleteMaterialProfile = (profileId) => {
    if (materialProfiles.length <= 1) {
      alert("Cannot delete the last profile.");
      return;
    }
    if (deleteConfirmation.profileId === profileId && deleteConfirmation.inputValue === '123') {
      setMaterialProfiles(prev => prev.filter(p => p.id !== profileId));
      setDeleteConfirmation({ profileId: null, inputValue: '' });
    } else {
      setDeleteConfirmation({ profileId, inputValue: '' });
    }
  };

  const handleExportMaterialProfile = (profileId) => {
    const profile = materialProfiles.find(p => p.id === profileId);
    if (!profile) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Materials_${profile.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportMaterialProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        // Case 1: Full Profile (must have name and items)
        if (imported.name && Array.isArray(imported.items)) {
          const newProfile = {
            ...imported,
            id: generateId()
          };
          setMaterialProfiles(prev => [...prev, newProfile]);
          alert(`Imported profile "${newProfile.name}" with ${newProfile.items.length} items!`);
        }
        // Case 2: Simple List (array) - prompt for name
        else if (Array.isArray(imported)) {
          const profileName = prompt("Enter a name for this imported list:", file.name.replace('.json', ''));
          if (!profileName) {
            alert("Import cancelled - profile name is required.");
            return;
          }

          const items = imported.map((row, index) => ({
            id: generateId(),
            name: row.Item || row.name || row.Description || `Item ${index + 1}`,
            price: Number(row.Price || row.price || 0),
            image: null
          }));

          if (items.length > 0) {
            const newProfile = {
              id: generateId(),
              name: profileName,
              items
            };
            setMaterialProfiles(prev => [...prev, newProfile]);
            alert(`Imported ${items.length} items into "${profileName}"!`);
          } else {
            alert("Imported list is empty.");
          }
        } else {
          alert("Invalid file format. JSON must have 'name' field or be a simple array.");
        }
      } catch (err) {
        console.error(err);
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleAddMaterialToProfile = (profileId) => {
    const newMat = { id: generateId(), name: 'New Item', price: 0, image: null };
    setMaterialProfiles(prev => prev.map(p =>
      p.id === profileId ? { ...p, items: [...p.items, newMat] } : p
    ));
  };

  const handleUpdateMaterialInProfile = (profileId, matId, field, value) => {
    setMaterialProfiles(prev => prev.map(p =>
      p.id === profileId ? {
        ...p,
        items: p.items.map(m => m.id === matId ? { ...m, [field]: value } : m)
      } : p
    ));
  };

  const handleDeleteMaterialFromProfile = (profileId, matId) => {
    if (confirm('Delete this item?')) {
      setMaterialProfiles(prev => prev.map(p =>
        p.id === profileId ? {
          ...p,
          items: p.items.filter(m => m.id !== matId)
        } : p
      ));
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 ${isPrintMode ? 'p-0 bg-white' : 'p-4 md:p-8'}`}>

      {!isPrintMode && (
        <header className="w-full mx-auto mb-6 md:mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Error 101's Invoice Generator</h1>
              <p className="text-slate-500 text-xs md:text-sm">Professional Generator</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="flex gap-2 mr-2 border-r border-slate-200 pr-2">
              <Button variant="secondary" icon={FilePlus} onClick={handleNewInvoice} title="Create New Invoice">
                New
              </Button>
              <Button variant="secondary" icon={FolderOpen} onClick={() => setShowLoadModal(true)}>
                Load
              </Button>
              <Button variant="secondary" icon={Save} onClick={() => { setSaveName(invoice.name); setShowSaveModal(true); }}>
                Save
              </Button>
            </div>
            <Button variant="outline" icon={Settings} onClick={() => setShowConfigModal(true)}>
              Settings
            </Button>
            <Button variant="secondary" icon={Package} onClick={() => setShowMaterialModal(true)}>
              Materials
            </Button>
            <Button variant="outline" icon={Download} onClick={handleDownloadPDF} disabled={isDownloading} title="Download PDF File">
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="primary" icon={Printer} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </header>
      )}

      <div className={`w-full mx-auto grid grid-cols-1 ${isPrintMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6 md:gap-8`}>

        {!isPrintMode && (
          <div className="lg:col-span-4 space-y-6">

            {/* --- Document Style Card --- */}
            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <LayoutTemplate size={18} /> Document Style
              </h2>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 mb-2 block">Template Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['invoice', 'receipt', 'quote', 'email'].map(type => (
                    <button
                      key={type}
                      onClick={() => setInvoice(prev => ({ ...prev, template: type }))}
                      className={`px-3 py-2 text-sm rounded-lg border capitalize transition-all ${invoice.template === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {/* Signature Toggle */}
                <button
                  onClick={() => setInvoice(prev => ({ ...prev, showSignature: !prev.showSignature }))}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm border transition-all ${invoice.showSignature ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <PenTool size={16} /> Signature Line
                  </span>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${invoice.showSignature ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${invoice.showSignature ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Signature Date Line Toggle */}
                {invoice.showSignature && (
                  <div className="flex items-center justify-between pl-2">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" /> Manual Date Line
                    </span>
                    <div
                      onClick={() => setInvoice({ ...invoice, showSignatureDateLine: !invoice.showSignatureDateLine })}
                      className={`w-11 h-6 flex items-center rounded-full cursor-pointer p-1 transition-colors ${invoice.showSignatureDateLine ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${invoice.showSignatureDateLine ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </div>
                )}

                {/* Notes Toggle (Whole Section) */}
                <button
                  onClick={() => setInvoice(prev => ({ ...prev, showNotes: !prev.showNotes }))}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm border transition-all ${invoice.showNotes ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <StickyNote size={16} /> Show Notes
                  </span>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${invoice.showNotes ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${invoice.showNotes ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Notes Label Toggle (Just the Text) */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Tag size={16} className="text-blue-600" /> Show "NOTES" Label
                  </span>
                  <div
                    onClick={() => setInvoice({ ...invoice, showNotesLabel: !invoice.showNotesLabel })}
                    className={`w-11 h-6 flex items-center rounded-full cursor-pointer p-1 transition-colors ${invoice.showNotesLabel ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${invoice.showNotesLabel ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <List size={16} className="text-blue-600" /> Show Materials Appendix
                  </span>
                  <div
                    onClick={() => setInvoice({ ...invoice, showMaterialsList: !invoice.showMaterialsList })}
                    className={`w-11 h-6 flex items-center rounded-full cursor-pointer p-1 transition-colors ${invoice.showMaterialsList ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${invoice.showMaterialsList ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <EyeOff size={16} className="text-blue-600" /> Hide Items on Main Page
                  </span>
                  <div
                    onClick={() => setInvoice({ ...invoice, hideItemsOnMain: !invoice.hideItemsOnMain })}
                    className={`w-11 h-6 flex items-center rounded-full cursor-pointer p-1 transition-colors ${invoice.hideItemsOnMain ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${invoice.hideItemsOnMain ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>

              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={18} /> Branding Profile
              </h2>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Active Brand</label>
                <div className="relative">
                  <select
                    value={preferences.selectedBrandingId}
                    onChange={e => handleBrandSelect(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm appearance-none outline-none"
                  >
                    <option value="">Default (No Profile)</option>
                    {brandingProfiles.map(p => (
                      <option key={p.id} value={p.id}>{p.profileName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                </div>

                <Button
                  onClick={() => setShowConfigModal(!showConfigModal)}
                  variant="outline"
                  icon={Plus}
                  className="w-full mt-2 text-xs"
                >
                  {showConfigModal ? 'Cancel' : '+ Create Brand'}
                </Button>

                {/* Brand Creation/Edit Form */}
                {showConfigModal && (
                  <div className="mt-3 p-3 border border-blue-200 bg-blue-50 rounded space-y-3">
                    <input
                      value={newBrand.profileName}
                      onChange={e => setNewBrand({ ...newBrand, profileName: e.target.value })}
                      placeholder="Profile Name (e.g. My Company)"
                      className="w-full p-2 text-sm border rounded"
                    />
                    <input
                      value={newBrand.companyName}
                      onChange={e => setNewBrand({ ...newBrand, companyName: e.target.value })}
                      placeholder="Company Name"
                      className="w-full p-2 text-sm border rounded"
                    />
                    <textarea
                      value={newBrand.address}
                      onChange={e => setNewBrand({ ...newBrand, address: e.target.value })}
                      placeholder="Address"
                      rows={2}
                      className="w-full p-2 text-sm border rounded"
                    />
                    <textarea
                      value={newBrand.extra}
                      onChange={e => setNewBrand({ ...newBrand, extra: e.target.value })}
                      placeholder="Extra info (phone, email, etc.)"
                      rows={2}
                      className="w-full p-2 text-sm border rounded"
                    />
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewBrandLogoUpload}
                        className="text-xs"
                      />
                      {newBrand.logo && <img src={newBrand.logo} alt="Logo Preview" className="mt-2 h-12 object-contain" />}
                    </div>
                    <Button onClick={handleSaveNewBrand} className="w-full">Save Brand</Button>
                  </div>
                )}

                {activeBranding && activeBranding.logo && (
                  <div className="mt-3 p-2 border border-slate-100 bg-slate-50 rounded">
                    <div className="flex justify-center mb-3">
                      <img src={activeBranding.logo} alt="Brand Logo" style={{ width: `${activeBranding.logoSize || 150}px` }} className="h-12 object-contain" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Logo Size</span>
                        <span>{activeBranding.logoSize || 150}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={activeBranding.logoSize || 150}
                          onChange={e => handleUpdateBrandProfile(activeBranding.id, 'logoSize', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <input
                          type="number"
                          min="50"
                          max="400"
                          value={activeBranding.logoSize || 150}
                          onChange={e => handleUpdateBrandProfile(activeBranding.id, 'logoSize', parseInt(e.target.value))}
                          className="w-16 p-1 text-xs border rounded text-center"
                        />
                      </div>
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <span className="text-xs text-slate-500 block mb-1">Text Orientation</span>
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleUpdateBrandProfile(activeBranding.id, 'orientation', 'left')}
                            className={`p-1 rounded ${activeBranding.orientation === 'left' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            title="Text Left"
                          ><ArrowLeft size={16} /></button>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleUpdateBrandProfile(activeBranding.id, 'orientation', 'top')}
                              className={`p-1 rounded ${!activeBranding.orientation || activeBranding.orientation === 'top' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                              title="Text Top"
                            ><ArrowUp size={16} /></button>
                            <button
                              onClick={() => handleUpdateBrandProfile(activeBranding.id, 'orientation', 'bottom')}
                              className={`p-1 rounded ${activeBranding.orientation === 'bottom' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                              title="Text Bottom"
                            ><ArrowDown size={16} /></button>
                          </div>
                          <button
                            onClick={() => handleUpdateBrandProfile(activeBranding.id, 'orientation', 'right')}
                            className={`p-1 rounded ${activeBranding.orientation === 'right' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            title="Text Right"
                          ><ArrowRight size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {brandingProfiles.length === 0 && !showConfigModal && (
                  <p className="text-xs text-slate-400 mt-2 italic">No brand profiles yet. Click "+ Create Brand"</p>
                )}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Palette size={18} /> Template Style
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {['classic', 'modern', 'minimal'].map(style => (
                  <button
                    key={style}
                    onClick={() => setInvoice({ ...invoice, templateStyle: style })}
                    className={`p-3 rounded-lg border-2 transition-all ${invoice.templateStyle === style
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                  >
                    <div className={`text-xs font-bold uppercase ${invoice.templateStyle === style ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                      {style}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Briefcase size={18} /> {getDocumentTitle()} Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Number</label>
                  <input
                    type="text"
                    value={invoice.number}
                    onChange={e => setInvoice({ ...invoice, number: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold uppercase text-slate-400">Date</label>
                    <button
                      onClick={() => setInvoice({ ...invoice, showDateLine: !invoice.showDateLine })}
                      className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${invoice.showDateLine ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
                      title="Toggle Manual Entry Line"
                    >
                      <PenTool size={10} /> {invoice.showDateLine ? 'Manual' : 'Auto'}
                    </button>
                  </div>
                  <input
                    type="date"
                    value={invoice.date}
                    disabled={invoice.showDateLine}
                    onChange={e => setInvoice({ ...invoice, date: e.target.value })}
                    className={`w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none ${invoice.showDateLine ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Hide Due Date for Receipts as it's usually immediate */}
              {invoice.template !== 'receipt' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold uppercase text-slate-400">Due Date</label>
                    <button
                      onClick={() => setInvoice({ ...invoice, showDueDateLine: !invoice.showDueDateLine })}
                      className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${invoice.showDueDateLine ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
                      title="Toggle Manual Entry Line"
                    >
                      <PenTool size={10} /> {invoice.showDueDateLine ? 'Manual' : 'Auto'}
                    </button>
                  </div>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    disabled={invoice.showDueDateLine}
                    onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                    className={`w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none ${invoice.showDueDateLine ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold uppercase text-slate-400 mb-2 block">Payment Status</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setInvoice({ ...invoice, isPaid: false })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${!invoice.isPaid ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Circle size={16} /> Unpaid
                  </button>
                  <button
                    onClick={() => setInvoice({ ...invoice, isPaid: true })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${invoice.isPaid ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <CheckCircle size={16} /> Paid
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <CreditCard size={18} /> Financials
              </h2>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Markup Profile</label>
                <div className="relative">
                  <select
                    value={preferences.selectedMarkupId}
                    onChange={e => setPreference('selectedMarkupId', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm appearance-none outline-none"
                  >
                    {markupProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type === 'percent' ? `${p.value}%` : `$${p.value}`})
                      </option>
                    ))}
                    <option value="">None</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase text-slate-400 block">Markup Visibility</label>
                </div>
                <button
                  onClick={() => setInvoice(prev => ({ ...prev, hideMarkup: !prev.hideMarkup }))}
                  className={`w-full flex items-center justify-between p-2 rounded text-sm border ${invoice.hideMarkup ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-white border-slate-200 text-slate-800'}`}
                >
                  <span className="flex items-center gap-2">
                    {invoice.hideMarkup ? <EyeOff size={16} /> : <Eye size={16} />}
                    {invoice.hideMarkup ? 'Markup Hidden on Invoice' : 'Markup Visible on Invoice'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.hideMarkup ? 'bg-slate-200' : 'bg-green-100 text-green-700'}`}>
                    {invoice.hideMarkup ? 'Merged' : 'Separate'}
                  </span>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Deposit / Retainer</label>
                <div className="relative">
                  <select
                    value={preferences.selectedDepositId}
                    onChange={e => setPreference('selectedDepositId', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm appearance-none outline-none"
                  >
                    {depositProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type === 'percent' ? `${p.value}%` : `$${p.value}`})
                      </option>
                    ))}
                    <option value="">None</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Tax Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={preferences.taxRate}
                    onChange={e => setPreference('taxRate', Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none pl-8"
                  />
                  <Percent className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Package size={18} /> Quick Add Material
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {((materialProfiles[0]?.items || []).slice(0, 3)).map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => handleAddItem(mat)}
                    className="text-left text-sm p-2 hover:bg-blue-50 text-slate-600 rounded flex justify-between group transition-colors"
                  >
                    <span className="truncate pr-2">{mat.name}</span>
                    <span className="font-medium text-slate-900 group-hover:text-blue-600 shrink-0">${mat.price}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="text-xs text-blue-600 font-medium hover:underline mt-2 text-center"
                >
                  View All / Add New Material
                </button>
              </div>
            </Card>

            <div className="text-center text-xs text-slate-400 py-4">
              <p className="font-medium">By Error101 © 2025</p>
              <p>Licensed under CC BY-NC 4.0</p>
            </div>
          </div>
        )}

        <div className={`${isPrintMode ? 'w-full' : 'lg:col-span-8'}`}>
          <div id="invoice-content" className={`template-${invoice.templateStyle || 'classic'} bg-white shadow-xl shadow-slate-200/60 rounded-xl min-h-[auto] md:min-h-[1000px] print:!min-h-0 print:!h-auto flex flex-col print:block print:shadow-none print:rounded-none relative overflow-hidden print:overflow-visible ${invoice.template === 'email' ? 'max-w-2xl mx-auto' : ''}`}>

            {invoice.isPaid && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-20 border-4 md:border-8 border-green-600 text-green-600 rounded-xl p-4 md:p-8 transform -rotate-12 animate-in fade-in zoom-in duration-500">
                <div className="text-6xl md:text-[8rem] font-black tracking-widest leading-none">PAID</div>
                <div className="text-lg md:text-2xl font-bold text-center uppercase tracking-[1em] mt-2">In Full</div>
              </div>
            )}

            <div className={`p-6 md:p-12 print:p-6 border-b border-slate-100 flex flex-col md:flex-row print:flex-row justify-between items-start gap-6 md:gap-0 print:gap-0 ${invoice.template === 'receipt' ? 'bg-slate-50/50' : ''}`}>
              <div className={`w-full md:w-auto print:w-auto flex gap-3 ${['top', 'bottom'].includes(activeBranding?.orientation) ? 'flex-col' : 'flex-row items-start'
                }`}>

                {activeBranding && activeBranding.logo ? (
                  <div className={`shrink-0 ${['left', 'top'].includes(activeBranding?.orientation) ? 'order-last' : ''}`}>
                    <img src={activeBranding.logo} alt="Company Logo" style={{ width: `${activeBranding.logoSize || 150}px` }} className="h-auto object-contain" />
                  </div>
                ) : (
                  <div className="h-4"></div>
                )}

                <div className={['left', 'right'].includes(activeBranding?.orientation) ? 'max-w-[250px]' : ''}>
                  {!isPrintMode ? (
                    <textarea
                      value={invoice.from.name}
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, name: e.target.value } }))}
                      className="text-3xl font-bold text-slate-900 bg-transparent border-none placeholder-slate-300 focus:ring-0 p-0 resize-none font-heading"
                      style={{ width: `${Math.max(5, (invoice.from.name || '').length + 1)}ch` }}
                      placeholder="Your Company Name"
                      rows={1}
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-slate-900 font-heading">{invoice.from.name}</h1>
                  )}

                  {!isPrintMode ? (
                    <div>
                      <textarea
                        value={invoice.from.address}
                        onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, address: e.target.value } }))}
                        className="mt-2 text-slate-500 bg-transparent border-none focus:ring-0 p-0 resize-none text-sm block"
                        style={{ width: `${Math.max(10, (invoice.from.address || '').split('\n').reduce((max, line) => Math.max(max, line.length), 0) + 1)}ch` }}
                        placeholder="Your Address..."
                        rows={3}
                      />
                      <input
                        value={invoice.from.extra || ''}
                        onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, extra: e.target.value } }))}
                        className="mt-1 text-slate-400 bg-transparent border-none focus:ring-0 p-0 text-xs block"
                        style={{ width: `${Math.max(10, (invoice.from.extra || '').length + 1)}ch` }}
                        placeholder="Website, Email, Phone..."
                      />
                    </div>
                  ) : (
                    <div>
                      <pre className="mt-2 text-slate-500 text-sm font-sans whitespace-pre-wrap">{invoice.from.address}</pre>
                      {invoice.from.extra && <p className="mt-1 text-slate-400 text-xs">{invoice.from.extra}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right print:text-right w-full md:w-auto print:w-auto">
                <h2 className="text-5xl font-light text-slate-200 uppercase tracking-widest font-heading">{getDocumentTitle()}</h2>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-slate-400">{invoice.template === 'quote' ? 'Quote #' : invoice.template === 'receipt' ? 'Receipt #' : 'Invoice #'}</span>
                    <span className="font-medium text-slate-700 font-data">{invoice.number}</span>
                  </div>
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-slate-400">Date</span>
                    <span className="font-medium text-slate-700 font-data">
                      {invoice.showDateLine ? (
                        <span className="inline-block w-24 border-b border-slate-300 mb-0.5"></span>
                      ) : (
                        invoice.date
                      )}
                    </span>
                  </div>
                  {invoice.template !== 'receipt' && (
                    <div className="flex justify-between gap-8 text-sm">
                      <span className="text-slate-400">Due Date</span>
                      <span className="font-medium text-slate-700 font-data">
                        {invoice.showDueDateLine ? (
                          <span className="inline-block w-24 border-b border-slate-300 mb-0.5"></span>
                        ) : (
                          invoice.dueDate
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-12 print:p-6 pb-0">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 font-heading">{invoice.template === 'quote' ? 'Prepared For' : 'Bill To'}</h3>
              {!isPrintMode ? (
                <div className="flex flex-col space-y-2">
                  <input
                    value={invoice.to.name}
                    onChange={e => setInvoice(prev => ({ ...prev, to: { ...prev.to, name: e.target.value } }))}
                    className="text-xl font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 w-full max-w-md font-heading"
                    placeholder="Client Name"
                  />
                  <textarea
                    value={invoice.to.address}
                    onChange={e => setInvoice(prev => ({ ...prev, to: { ...prev.to, address: e.target.value } }))}
                    className="text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 w-full max-w-md resize-none text-sm"
                    placeholder="Client Address..."
                    rows={3}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 font-heading">{invoice.to.name}</h3>
                  <pre className="text-slate-600 font-sans text-sm whitespace-pre-wrap mt-1">{invoice.to.address}</pre>
                </div>
              )}
            </div>

            <div id="invoice-items-container" className={`p-6 md:p-12 print:p-6 flex-grow print:!grow-0 overflow-x-auto ${invoice.hideItemsOnMain ? 'print:hidden' : ''}`}>
              <table className="w-full table-fixed min-w-[600px] md:min-w-0 print:min-w-0 print:w-full">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-left">
                    <th className="py-3 text-xs font-bold uppercase text-slate-400 w-[50%]">Description</th>
                    <th className="py-3 text-xs font-bold uppercase text-slate-400 text-right w-[10%]">Qty</th>
                    <th className="py-3 text-xs font-bold uppercase text-slate-400 text-right w-[15%]">Price</th>
                    <th className="py-3 text-xs font-bold uppercase text-slate-400 text-right w-[15%]">Total</th>
                    {!isPrintMode && <th className="w-[10%]"></th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* If hideItemsOnMain is true, hide the itemized list on the main page in print mode.
                      In edit mode, always show items for editing. */}
                  {(!invoice.hideItemsOnMain || !isPrintMode) && invoice.items.map((item) => {
                    const description = item.description || '';
                    return (
                      <tr key={item.id} className="border-b border-slate-50 group hover:bg-slate-50/50 break-inside-avoid page-break-inside-avoid">
                        <td className="py-4 pr-4 align-top">
                          <div className="flex gap-4">
                            {item.image && (
                              <div className="w-16 h-16 shrink-0 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                                <img src={item.image} alt="item" className="w-full h-full object-cover" />
                              </div>
                            )}

                            <div className="flex-1">
                              {!isPrintMode ? (
                                <div className="relative">
                                  <textarea
                                    value={description}
                                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                    className="w-full bg-transparent border-none resize-none p-0 focus:ring-0 min-h-[1.5rem]"
                                    placeholder="Item description"
                                    rows={Math.max(1, Math.ceil(description.length / 50))}
                                  />
                                  <div className="mt-1 flex gap-2">
                                    <label className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ImageIcon size={12} /> {item.image ? 'Change Image' : 'Add Image'}
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleItemImageUpload(e, item.id)}
                                      />
                                    </label>
                                    {item.image && (
                                      <button
                                        onClick={() => handleUpdateItem(item.id, 'image', null)}
                                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="font-medium text-slate-700 whitespace-pre-wrap">{description}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right align-top">
                          {!isPrintMode ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-full text-right bg-transparent border border-slate-200 rounded p-1 font-data"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td className="py-4 text-right align-top">
                          {!isPrintMode ? (
                            <div className="flex justify-end items-center">
                              <span className="text-slate-400 mr-1">$</span>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                className="w-20 text-right bg-transparent border border-slate-200 rounded p-1 font-data"
                              />
                            </div>
                          ) : (
                            CURRENCY_FORMAT.format(item.price)
                          )}
                        </td>
                        <td className="py-4 text-right font-medium text-slate-700 align-top font-data">
                          {CURRENCY_FORMAT.format(item.quantity * item.price)}
                        </td>
                        {!isPrintMode && (
                          <td className="py-4 text-right align-top">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {!isPrintMode && (
                <div className="mt-4 flex gap-3 items-center">
                  <Button onClick={() => handleAddItem()} variant="secondary" icon={Plus} className="text-sm">
                    Add Empty Line
                  </Button>

                  {materialProfiles.flatMap(p => p.items || []).length > 0 && (
                    <div className="relative">
                      <select
                        className="p-2 border border-slate-200 rounded text-sm w-full bg-slate-50 appearance-none outline-none"
                        onChange={(e) => {
                          if (e.target.value) {
                            const allMaterials = materialProfiles.flatMap(p => p.items || []);
                            const mat = allMaterials.find(m => m.id === e.target.value);
                            if (mat) {
                              handleAddItem({
                                description: mat.name,
                                price: mat.price,
                                quantity: 1,
                                image: mat.image
                              });
                              e.target.value = "";
                            }
                          }
                        }}
                        value=""
                      >
                        <option value="">+ Add from Materials...</option>
                        {materialProfiles.map(profile => (
                          <optgroup key={profile.id} label={profile.name}>
                            {(profile.items || []).map(mat => (
                              <option key={mat.id} value={mat.id}>
                                {mat.name} - ${mat.price}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <Package className="absolute right-2 top-2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- UPDATED: Footer Layout (Notes + Totals) --- */}
            <div className="bg-slate-50 p-6 md:p-12 print:p-6 border-t border-slate-100 print:bg-transparent">
              <div className="flex flex-col md:flex-row print:flex-row justify-between items-start gap-12">
                <div className="w-full md:w-1/2 print:w-1/2">

                  {/* Notes Section with Toggle Logic */}
                  {invoice.showNotes && (
                    <>
                      {/* Only show the label if showNotesLabel is true */}
                      {invoice.showNotesLabel && (
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 font-heading">Notes</h3>
                      )}

                      {!isPrintMode ? (
                        <textarea
                          value={invoice.notes}
                          onChange={e => setInvoice({ ...invoice, notes: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded p-3 text-sm text-slate-600 focus:ring-1 focus:ring-blue-500 h-32 resize-none"
                        />
                      ) : (
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
                      )}
                    </>
                  )}

                  {/* Signature Section */}
                  {invoice.showSignature && (
                    <div className="mt-12 print:mt-4 pt-4 w-full max-w-xs break-inside-avoid">
                      <div className="h-12 border-b border-slate-400 border-dashed mb-2 relative">
                        {/* Optional: Add an image of a signature here if needed later */}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Authorized Signature</p>
                        <p className="text-[10px] italic text-slate-300 flex items-end gap-1">
                          Date:
                          {invoice.showSignatureDateLine ? (
                            <span className="inline-block w-24 border-b border-slate-300 print:border-slate-400 mb-0.5"></span>
                          ) : (
                            invoice.date
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-5/12 print:w-5/12 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>{invoice.hideMarkup ? 'Subtotal' : 'Subtotal'}</span>
                    <span className="font-data">{CURRENCY_FORMAT.format(invoice.hideMarkup ? totals.subtotalWithMarkup : totals.subtotal)}</span>
                  </div>

                  {totals.markupAmount > 0 && !invoice.hideMarkup && (
                    <div className="flex justify-between text-green-600">
                      <span>Markup ({totals.markupName})</span>
                      <span className="font-data">+ {CURRENCY_FORMAT.format(totals.markupAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({preferences.taxRate}%)</span>
                    <span className="font-data">{CURRENCY_FORMAT.format(totals.taxAmount)}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-800 text-lg">
                    <span>Total</span>
                    <span className="font-data">{CURRENCY_FORMAT.format(totals.total)}</span>
                  </div>

                  {totals.depositAmount > 0 && !invoice.isPaid && (
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Deposit ({totals.depositName})</span>
                      <span className="font-data">- {CURRENCY_FORMAT.format(totals.depositAmount)}</span>
                    </div>
                  )}

                  {invoice.isPaid && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Amount Paid</span>
                      <span className="font-data">- {CURRENCY_FORMAT.format(totals.total)}</span>
                    </div>
                  )}

                  <div className="border-t-2 border-slate-800 pt-3 flex justify-between font-bold text-slate-900 text-xl">
                    <span>Balance Due</span>
                    <span className="font-data">{CURRENCY_FORMAT.format(totals.balanceDue)}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* --- NEW: Materials List Appendix (Invoice Items) --- */}
            {invoice.showMaterialsList && invoice.items.length > 0 && (
              <div className="hidden print:block break-before-page p-6 md:p-12 print:p-6">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 font-heading">Itemized List</h2>
                  <p className="text-sm text-slate-400">Appendix to {invoice.template === 'quote' ? 'Quote' : 'Invoice'} #{invoice.number}</p>
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 text-xs font-bold uppercase text-slate-500 w-[60%]">Description</th>
                      <th className="py-2 text-xs font-bold uppercase text-slate-500 w-[15%] text-right">Qty</th>
                      <th className="py-2 text-xs font-bold uppercase text-slate-500 w-[15%] text-right">Unit Price</th>
                      <th className="py-2 text-xs font-bold uppercase text-slate-500 w-[10%] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {invoice.items.map(item => (
                      <tr key={item.id} className="border-b border-slate-50">
                        <td className="py-3 font-medium text-slate-700">{item.description}</td>
                        <td className="py-3 text-right text-slate-600 font-data">{item.quantity}</td>
                        <td className="py-3 text-right text-slate-600 font-data">{CURRENCY_FORMAT.format(item.price)}</td>
                        <td className="py-3 text-right text-slate-800 font-data font-medium">{CURRENCY_FORMAT.format(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Save Invoice / Template">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Give your invoice a name to save it as a template or draft. It will be stored in your browser.</p>
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Invoice Name</label>
            <input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="e.g. Website Project Template"
              className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => handleSaveInvoice(true)} variant="outline" icon={Copy}>Save as New</Button>
            <Button onClick={() => handleSaveInvoice(false)} icon={Save}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showLoadModal} onClose={() => setShowLoadModal(false)} title="Saved Invoices">
        <div className="space-y-4">
          {savedInvoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FolderOpen size={48} className="mx-auto mb-2 opacity-50" />
              <p>No saved invoices found.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {savedInvoices.map(inv => (
                <div key={inv.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all">
                  <div>
                    <h4 className="font-bold text-slate-800">{inv.name}</h4>
                    <div className="text-xs text-slate-500 mt-1 flex gap-3">
                      <span>#{inv.number}</span>
                      <span>To: {inv.to.name}</span>
                      <span>Amount: {CURRENCY_FORMAT.format(inv.items.reduce((acc, i) => acc + (i.quantity * i.price), 0))}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-xs py-1 px-3" onClick={() => handleLoadInvoice(inv)}>Load</Button>
                    <button onClick={() => handleDeleteSavedInvoice(inv.id)} className="text-slate-400 hover:text-red-500 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="Material Profiles Manager">
        <div className="space-y-4">

          {/* Add Profile Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center gap-3">
            <Button onClick={handleCreateMaterialProfile} variant="secondary" icon={Plus} className="shrink-0">
              Add Profile
            </Button>
            <div className="text-xs text-slate-600 flex- items-center gap-2">
              <Upload size={14} className="inline" />
              <span>Or </span>
              <label className="text-blue-600 font-medium cursor-pointer hover:underline">
                import from JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportMaterialProfile}
                />
              </label>
            </div>
          </div>

          {/* Scrollable Profile Cards */}
          <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
            {(materialProfiles || []).map(profile => (
              <div key={profile.id} className="border-2 border-slate-200 rounded-lg p-4 bg-white space-y-4">

                {/* Profile Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleRenameMaterialProfile(profile.id, e.target.value)}
                    className="text-lg font-bold text-slate-800 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none bg-transparent transition-all px-1 flex-1"
                    placeholder="Profile Name"
                  />
                  <div className="flex gap-2 shrink-0">
                    <Button
                      onClick={() => handleExportMaterialProfile(profile.id)}
                      variant="outline"
                      icon={Download}
                      className="text-xs"
                      title="Export this profile"
                    >
                      Export
                    </Button>

                    {/* Delete with 123 Confirmation */}
                    {deleteConfirmation.profileId === profile.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="text"
                          value={deleteConfirmation.inputValue}
                          onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, inputValue: e.target.value })}
                          placeholder="Type 123"
                          className="w-20 px-2 py-1 text-xs border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
                          autoFocus
                        />
                        <Button
                          onClick={() => handleDeleteMaterialProfile(profile.id)}
                          variant="danger"
                          className="text-xs"
                        >
                          Confirm
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirmation({ profileId: null, inputValue: '' })}
                          variant="ghost"
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleDeleteMaterialProfile(profile.id)}
                        variant="danger"
                        icon={Trash2}
                        title="Delete profile"
                      />
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 z-10">
                        <tr>
                          <th className="p-2 font-semibold">Item Name</th>
                          <th className="p-2 font-semibold w-24">Price</th>
                          <th className="p-2 font-semibold w-20">Image</th>
                          <th className="p-2 font-semibold w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(profile.items || []).map(mat => (
                          <tr key={mat.id} className="hover:bg-slate-50 group">
                            <td className="p-2">
                              <input
                                value={mat.name}
                                onChange={(e) => handleUpdateMaterialInProfile(profile.id, mat.id, 'name', e.target.value)}
                                className="w-full p-1 border border-transparent hover:border-slate-200 focus:border-blue-400 rounded bg-transparent transition-all"
                                placeholder="Item Name"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={mat.price}
                                onChange={(e) => handleUpdateMaterialInProfile(profile.id, mat.id, 'price', Number(e.target.value))}
                                className="w-full p-1 border border-transparent hover:border-slate-200 focus:border-blue-400 rounded bg-transparent transition-all font-data"
                              />
                            </td>
                            <td className="p-2">
                              <label className="cursor-pointer block">
                                <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:opacity-80">
                                  {mat.image ? (
                                    <img src={mat.image || "/placeholder.svg"} className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon size={14} className="text-slate-400" />
                                  )}
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => handleUpdateMaterialInProfile(profile.id, mat.id, 'image', reader.result);
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => handleDeleteMaterialFromProfile(profile.id, mat.id)}
                                className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {profile.items.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-400 text-sm">
                              No items yet. Click "Add Item" below to start.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Item Button */}
                <Button
                  onClick={() => handleAddMaterialToProfile(profile.id)}
                  icon={Plus}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Add Item to {profile.name}
                </Button>
              </div>
            ))}

            {materialProfiles.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Package size={48} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">No profiles yet</p>
                <p className="text-sm">Click "Add Profile" to create your first materials list</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title="Invoice Configuration">
        <div className="space-y-8">

          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <RefreshCw size={16} /> Backup & Restore Data
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <p className="text-sm text-slate-600">Download all your invoice data, templates, and settings to a file, or restore from a backup.</p>
              <div className="flex gap-3">
                <Button onClick={handleBackupData} variant="secondary" icon={Download} className="text-sm">
                  Export Data
                </Button>
                <div className="relative">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" icon={UploadIcon} className="text-sm">
                    Import Backup
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/json"
                    onChange={handleRestoreData}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Type size={16} /> Typography
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
              <p className="text-sm text-slate-600 mb-2">Customize fonts for different sections of your invoice.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FontSelect
                    label="Headings (Titles & Names)"
                    value={preferences.headingFont}
                    onChange={(val) => setPreference('headingFont', val)}
                    onApplyAll={() => setPreferences(prev => ({ ...prev, bodyFont: prev.headingFont, dataFont: prev.headingFont }))}
                  />
                </div>
                <div>
                  <FontSelect
                    label="Body Text (Notes & Terms)"
                    value={preferences.bodyFont}
                    onChange={(val) => setPreference('bodyFont', val)}
                  />
                </div>
                <div>
                  <FontSelect
                    label="Data & Tables (Numbers)"
                    value={preferences.dataFont}
                    onChange={(val) => setPreference('dataFont', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Building2 size={16} /> Branding Profiles
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
              <div className="space-y-3">
                <input
                  value={newBrand.profileName}
                  onChange={e => setNewBrand(p => ({ ...p, profileName: e.target.value }))}
                  placeholder="Profile Name (e.g. My Freelance Brand)"
                  className="border p-2 rounded text-sm w-full"
                />
                <input
                  value={newBrand.companyName}
                  onChange={e => setNewBrand(p => ({ ...p, companyName: e.target.value }))}
                  placeholder="Company Name (Appears on Invoice)"
                  className="border p-2 rounded text-sm w-full"
                />
                <textarea
                  value={newBrand.address}
                  onChange={e => setNewBrand(p => ({ ...p, address: e.target.value }))}
                  placeholder="Company Address"
                  className="border p-2 rounded text-sm w-full resize-y h-20"
                />
                <input
                  value={newBrand.extra}
                  onChange={e => setNewBrand(p => ({ ...p, extra: e.target.value }))}
                  placeholder="Extra Info (Website, Email, Tax ID...)"
                  className="border p-2 rounded text-sm w-full"
                />

                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer bg-white border border-slate-300 border-dashed rounded flex items-center justify-center p-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                    <Upload size={16} className="mr-2" />
                    <span>{newBrand.logo ? 'Change Logo' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleNewBrandLogoUpload} />
                  </label>
                  {newBrand.logo && (
                    <div className="h-10 w-10 border rounded bg-white flex items-center justify-center">
                      <img src={newBrand.logo} className="max-h-full max-w-full" alt="Preview" />
                    </div>
                  )}
                </div>

                {newBrand.logo && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Logo Size</span>
                      <span>{newBrand.logoSize}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="50"
                        max="400"
                        value={newBrand.logoSize}
                        onChange={e => setNewBrand(p => ({ ...p, logoSize: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <input
                        type="number"
                        min="50"
                        max="400"
                        value={newBrand.logoSize}
                        onChange={e => setNewBrand(p => ({ ...p, logoSize: parseInt(e.target.value) }))}
                        className="w-16 p-1 text-xs border rounded text-center"
                      />
                    </div>
                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <span className="text-xs text-slate-500 block mb-1">Orientation</span>
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => setNewBrand(p => ({ ...p, orientation: 'left' }))}
                          className={`p-1 rounded ${newBrand.orientation === 'left' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                          title="Left"
                        ><ArrowLeft size={16} /></button>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setNewBrand(p => ({ ...p, orientation: 'top' }))}
                            className={`p-1 rounded ${!newBrand.orientation || newBrand.orientation === 'top' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            title="Top"
                          ><ArrowUp size={16} /></button>
                          <button
                            onClick={() => setNewBrand(p => ({ ...p, orientation: 'bottom' }))}
                            className={`p-1 rounded ${newBrand.orientation === 'bottom' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            title="Bottom"
                          ><ArrowDown size={16} /></button>
                        </div>
                        <button
                          onClick={() => setNewBrand(p => ({ ...p, orientation: 'right' }))}
                          className={`p-1 rounded ${newBrand.orientation === 'right' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                          title="Right"
                        ><ArrowRight size={16} /></button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button onClick={handleSaveNewBrand} icon={Plus}>Add Profile</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {brandingProfiles.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100 justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {p.logo ? (
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200 flex-shrink-0">
                        <img src={p.logo} alt={p.profileName} className="max-w-full max-h-full p-1" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200 flex-shrink-0 text-slate-300">
                        <Building2 size={20} />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <span className="text-sm font-medium truncate block">{p.profileName}</span>
                      <span className="text-xs text-slate-500 truncate block">{p.companyName}</span>
                    </div>
                  </div>
                  <button onClick={() => setBrandingProfiles(brandingProfiles.filter(b => b.id !== p.id))} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {brandingProfiles.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-2">No profiles saved yet.</div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <LayoutTemplate size={16} /> Markup Profiles
            </h4>
            <div className="flex gap-2 mb-3">
              <input id="newMarkupName" placeholder="Profile Name (e.g. Rush)" className="flex-1 border p-2 rounded text-sm" />
              <select id="newMarkupType" className="border p-2 rounded text-sm bg-white">
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
              <input id="newMarkupVal" type="number" placeholder="20" className="w-20 border p-2 rounded text-sm" />
              <Button onClick={() => {
                const name = document.getElementById('newMarkupName').value;
                const type = document.getElementById('newMarkupType').value;
                const value = Number(document.getElementById('newMarkupVal').value);
                if (name) {
                  setMarkupProfiles([...markupProfiles, { id: generateId(), name, type, value }]);
                  document.getElementById('newMarkupName').value = '';
                  document.getElementById('newMarkupVal').value = '';
                }
              }} icon={Plus}>Add</Button>
            </div>
            <div className="space-y-2">
              {markupProfiles.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white px-2 py-1 rounded border shadow-sm">
                      {p.type === 'percent' ? `${p.value}%` : `$${p.value}`}
                    </span>
                    <button onClick={() => setMarkupProfiles(markupProfiles.filter(m => m.id !== p.id))} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <CreditCard size={16} /> Deposit Profiles
            </h4>
            <div className="flex gap-2 mb-3">
              <input id="newDepName" placeholder="Profile Name" className="flex-1 border p-2 rounded text-sm" />
              <select id="newDepType" className="border p-2 rounded text-sm bg-white">
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
              <input id="newDepVal" type="number" placeholder="50" className="w-20 border p-2 rounded text-sm" />
              <Button onClick={() => {
                const name = document.getElementById('newDepName').value;
                const type = document.getElementById('newDepType').value;
                const value = Number(document.getElementById('newDepVal').value);
                if (name) {
                  setDepositProfiles([...depositProfiles, { id: generateId(), name, type, value }]);
                  document.getElementById('newDepName').value = '';
                  document.getElementById('newDepVal').value = '';
                }
              }} icon={Plus}>Add</Button>
            </div>
            <div className="space-y-2">
              {depositProfiles.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white px-2 py-1 rounded border shadow-sm">
                      {p.type === 'percent' ? `${p.value}%` : `$${p.value}`}
                    </span>
                    <button onClick={() => setDepositProfiles(depositProfiles.filter(m => m.id !== p.id))} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Modal>

      <style>{`
        /* Removed print override to avoid conflict with injected styles */
      `}</style>
    </div>
  );
}