import { formatInr } from '../utils/medicineUi';

function OfferBanner({ offers = [] }) {
  if (!offers.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 fade-in">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-brand-700 font-bold">Seasonal Wellness Offers</p>
          <h2 className="text-2xl font-extrabold text-slate-900">Save More on Everyday Health</h2>
        </div>
        <p className="text-xs text-slate-500">Discounts auto-applied at checkout</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="min-w-[280px] md:min-w-[330px] snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                {offer.discountPercentage}% OFF
              </span>
              {offer.expiringSoon && (
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Ending Soon
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{offer.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{offer.description}</p>
            <p className="mt-3 text-xs text-slate-500">
              Valid till: {new Date(offer.validTill).toLocaleDateString('en-IN')}
            </p>
            {offer.category && (
              <p className="mt-2 text-xs text-brand-700 font-semibold">Applies to: {offer.category}</p>
            )}
          </article>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">1 loyalty point = {formatInr(1)} discount at checkout.</p>
    </section>
  );
}

export default OfferBanner;
