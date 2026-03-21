import { formatInr } from '../utils/medicineUi';

function PackageCard({ pkg }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${pkg.imageUrl || 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=900'})` }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-900">{pkg.name}</h3>
          <span className="inline-flex rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-900">
            {pkg.discountPercentage}% OFF
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{pkg.description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-brand-900">{formatInr(pkg.price)}</span>
          <span className="text-sm text-slate-500">bundle price</span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Included medicines</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(pkg.includedMedicines || []).map((medicine) => (
              <span key={medicine.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {medicine.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PackageCard;
