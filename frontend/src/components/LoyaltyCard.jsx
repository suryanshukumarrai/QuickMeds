import { formatInr } from '../utils/medicineUi';

function LoyaltyCard({ points = 0 }) {
  return (
    <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5 md:p-6 shadow-sm fade-in">
      <p className="text-xs uppercase tracking-widest text-brand-700 font-bold">Loyalty Wallet</p>
      <h3 className="mt-2 text-2xl font-extrabold text-brand-900">{points} Points</h3>
      <p className="mt-1 text-sm text-brand-800">Redeem up to {formatInr(points)} on your next order.</p>
      <p className="mt-3 text-xs text-brand-700">Earn 1 point for every {formatInr(10)} spent.</p>
    </section>
  );
}

export default LoyaltyCard;
