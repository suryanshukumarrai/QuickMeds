import { Link } from 'react-router-dom';

function MedicineCard({ medicine, onAddToCart, quantity = 0, onIncrease, onDecrease }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden fade-in">
      <img
        src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600'}
        alt={medicine.name}
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{medicine.categoryName}</p>
        <h3 className="text-lg font-bold mt-1">{medicine.name}</h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{medicine.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-extrabold text-brand-900">${medicine.price}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${medicine.requiresPrescription ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {medicine.requiresPrescription ? 'Rx Needed' : 'OTC'}
          </span>
        </div>
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
