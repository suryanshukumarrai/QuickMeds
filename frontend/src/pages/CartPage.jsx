<div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
  <h2 className="text-lg font-bold">Apply Seasonal Offer</h2>
  <div className="flex flex-col md:flex-row gap-3">
    <select
      className="w-full border border-slate-300 rounded-lg px-3 py-2"
      value={selectedOfferId}
      onChange={(e) => setSelectedOfferId(e.target.value)}
    >
      <option value="">Select an offer</option>
      {offers.map((offer) => (
        <option key={offer.id} value={offer.id}>
          {offer.title} - {offer.discountPercentage}% OFF {offer.expiringSoon ? '(Ending Soon)' : ''}
        </option>
      ))}
    </select>
    <button
      type="button"
      disabled={!selectedOfferId}
      onClick={() => setShowOfferApplied(true)}
      className="px-4 py-2 rounded-lg bg-brand-700 text-white font-semibold disabled:opacity-50"
    >
      Apply Offer
    </button>
  </div>
</div>

<div className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-2">
  <h2 className="text-lg font-bold text-brand-900">Loyalty Points</h2>
  <p className="text-sm text-brand-800">
    Available points: <strong>{loyalty?.points || 0}</strong>
  </p>
  <div className="flex gap-3 items-center">
    <input
      type="number"
      min="0"
      max={loyalty?.points || 0}
      value={pointsToRedeem}
      onChange={(e) => setPointsToRedeem(e.target.value)}
      className="w-44 border border-brand-200 rounded-lg px-3 py-2"
      placeholder="Points to redeem"
    />
    <button
      type="button"
      onClick={() => setPointsToRedeem(loyalty?.points || 0)}
      className="px-3 py-2 rounded-lg border border-brand-300 text-brand-800 font-semibold"
    >
      Use Max
    </button>
  </div>
</div>

<div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
  <p className="flex justify-between text-sm">
    <span>Subtotal</span>
    <span>{formatInr(baseTotal)}</span>
  </p>
  <p className="flex justify-between text-sm text-emerald-700">
    <span>Offer Discount</span>
    <span>- {formatInr(offerDiscount)}</span>
  </p>
  <p className="flex justify-between text-sm text-emerald-700">
    <span>Loyalty Redemption</span>
    <span>- {formatInr(redeemDiscount)}</span>
  </p>
  <p className="flex justify-between text-xl font-extrabold border-t pt-2">
    <span>Final Total</span>
    <span>{formatInr(finalPrice)}</span>
  </p>
</div>