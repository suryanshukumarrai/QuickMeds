import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatInr, getMedicineImage } from '../utils/medicineUi';

function MedicineCard({ medicine, onAddToCart, quantity = 0, onIncrease, onDecrease }) {
  const normalize = (value) => (value || '').trim();

  const buildFallbackOptions = () => {
    const text = `${medicine?.name || ''} ${medicine?.categoryName || ''}`.toLowerCase();
    if (text.includes('paracetamol') || text.includes('dolo') || text.includes('crocin') || text.includes('calpol')) {
      return ['500 mg', '650 mg'];
    }
    if (text.includes('antibiotic') || text.includes('azith') || text.includes('augmentin') || text.includes('taxim') || text.includes('cifran')) {
      return ['250 mg', '500 mg'];
    }
    if (text.includes('syrup') || text.includes('suspension') || text.includes('drops')) {
      return ['60 ml', '100 ml', '200 ml'];
    }
    if (text.includes('injection') || text.includes('vial')) {
      return ['2 ml', '5 ml', '10 ml'];
    }
    return ['As prescribed'];
  };

  const dosageOptions = useMemo(() => {
    const rawDosage = normalize(medicine?.dosage);
    if (!rawDosage || rawDosage.toLowerCase() === 'na') {
      return buildFallbackOptions();
    }

    const splitRegex = /\s*[,/|]\s*/;
    const parsed = rawDosage
      .split(splitRegex)
      .map((part) => part.trim())
      .filter(Boolean);

    return parsed.length > 1 ? parsed : [rawDosage];
  }, [medicine?.dosage, medicine?.name, medicine?.categoryName]);

  const [selectedDosage, setSelectedDosage] = useState(dosageOptions[0]);

  useEffect(() => {
    setSelectedDosage(dosageOptions[0]);
  }, [dosageOptions]);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-transform transition-shadow duration-300 ease-out hover:scale-[1.05] hover:-translate-y-2 overflow-hidden fade-in">
      <img
        src={getMedicineImage(medicine)}
        alt={medicine.name}
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{medicine.categoryName}</p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight">{medicine.name}</h3>
          {dosageOptions.length === 1 ? (
            <span className="shrink-0 border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-50">
              {dosageOptions[0]}
            </span>
          ) : (
            <select
              value={selectedDosage}
              onChange={(e) => setSelectedDosage(e.target.value)}
              className="shrink-0 border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-700 bg-white"
              aria-label={`${medicine.name} dosage`}
            >
              {dosageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{medicine.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-extrabold text-brand-900">{formatInr(medicine.price)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${medicine.requiresPrescription ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {medicine.requiresPrescription ? 'Rx Needed' : 'OTC'}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Selected dosage: {selectedDosage}</p>
        <div className="mt-4 flex gap-2">
          <Link to={`/medicines/${medicine.id}`} className="flex-1 text-center px-3 py-2 rounded-lg border border-brand-300 text-brand-700 hover:bg-brand-50">
            Details
          </Link>
          {quantity > 0 ? (
            <div className="flex-1 flex items-center justify-between rounded-lg bg-brand-700 text-white px-2 py-1">
              <button
                onClick={() => onDecrease?.(medicine)}
                className="w-8 h-8 rounded-md bg-brand-900/40 hover:bg-brand-900/60"
                aria-label={`Decrease ${medicine.name} quantity`}
              >
                -
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={() => onIncrease?.(medicine)}
                className="w-8 h-8 rounded-md bg-brand-900/40 hover:bg-brand-900/60"
                aria-label={`Increase ${medicine.name} quantity`}
              >
                +
              </button>
            </div>
          ) : (
            <button onClick={() => onAddToCart(medicine)} className="flex-1 px-3 py-2 rounded-lg bg-brand-700 text-white hover:bg-brand-900">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;
