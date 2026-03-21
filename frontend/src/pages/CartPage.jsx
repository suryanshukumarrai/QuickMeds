import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { emitCartUpdated } from '../utils/cartEvents';
import { formatInr } from '../utils/medicineUi';
import AddressSelector from '../components/AddressSelector';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showOfferApplied, setShowOfferApplied] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const [cartRes, prRes, offersRes, loyaltyRes, addressRes] = await Promise.all([
      api.get('/cart'),
      api.get('/prescriptions'),
      api.get('/offers/active'),
      api.get('/loyalty'),
      api.get('/addresses'),
    ]);

    setCart(cartRes.data);
    emitCartUpdated(cartRes.data);
    setPrescriptions(prRes.data);
    setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
    setLoyalty(loyaltyRes.data);

    const fetchedAddresses = Array.isArray(addressRes.data) ? addressRes.data : [];
    setAddresses(fetchedAddresses);
    if (fetchedAddresses.length === 0) {
      navigate('/addresses/new', { state: { from: '/cart' }, replace: true });
      return;
    }
    setSelectedAddressId((prev) => {
      if (prev && fetchedAddresses.some((address) => Number(address.id) === Number(prev))) {
        return prev;
      }
      return String(fetchedAddresses[0].id);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const updateQty = async (id, quantity) => {
    await api.put(`/cart/items/${id}`, { quantity });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/cart/items/${id}`);
    load();
  };

  const uploadPrescription = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/prescriptions/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    await load();
  };

  const placeOrder = async () => {
    try {
      setMessage('');
      setAddressError('');
      if (!selectedAddressId) {
        setAddressError('Please select a delivery address before placing order.');
        return;
      }

      const { data } = await api.post('/orders', {
        addressId: Number(selectedAddressId),
        prescriptionId: prescriptionId ? Number(prescriptionId) : null,
        offerId: selectedOfferId ? Number(selectedOfferId) : null,
        pointsToRedeem: Number(pointsToRedeem) || 0,
      });
      setMessage(`Order placed. You earned ${data.loyaltyPointsEarned || 0} points and redeemed ${data.loyaltyPointsUsed || 0}.`);
      setSelectedOfferId('');
      setPointsToRedeem(0);
      setShowOfferApplied(false);
      load();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Order placement failed');
    }
  };

  const deleteAddress = async (id) => {
    try {
      setAddressError('');
      await api.delete(`/addresses/${id}`);
      await load();
    } catch (error) {
      setAddressError(error.response?.data?.error || 'Unable to delete address right now.');
    }
  };

  const getSelectedOffer = () => offers.find((offer) => offer.id === Number(selectedOfferId));

  const calculateOfferDiscount = () => {
    const selectedOffer = getSelectedOffer();
    if (!selectedOffer || !cart?.items?.length) return 0;

    return cart.items.reduce((sum, item) => {
      const applies = !selectedOffer.category || selectedOffer.category === item.categoryName;
      if (!applies) return sum;
      const lineTotal = Number(item.lineTotal || 0);
      return sum + (lineTotal * Number(selectedOffer.discountPercentage || 0)) / 100;
    }, 0);
  };

  const baseTotal = Number(cart?.total || 0);
  const offerDiscount = showOfferApplied ? calculateOfferDiscount() : 0;
  const cappedRedeem = Math.min(Number(pointsToRedeem) || 0, Number(loyalty?.points || 0));
  const redeemDiscount = Math.min(cappedRedeem, Math.max(0, baseTotal - offerDiscount));
  const finalPrice = Math.max(0, baseTotal - offerDiscount - redeemDiscount);

  if (!cart) return <p className="p-8">Loading cart...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {cart.items.length === 0 ? <p className="mt-4">Cart is empty.</p> : (
        <div className="mt-6 space-y-4">
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={(id) => {
              setSelectedAddressId(String(id));
              setAddressError('');
            }}
            onDelete={deleteAddress}
            onAddNew={() => navigate('/addresses/new', { state: { from: '/cart' } })}
            error={addressError}
          />

          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">{item.medicineName}</p>
                <p className="text-sm text-slate-500">{formatInr(item.price)} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Decrease ${item.medicineName} quantity`}
                    title="Decrease quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mx-auto">
                      <path fillRule="evenodd" d="M4.5 12a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                    aria-label={`Increase ${item.medicineName} quantity`}
                    title="Increase quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mx-auto">
                      <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 rounded bg-red-0 text-red-500 hover:bg-red-100"
                  aria-label={`Remove ${item.medicineName} from cart`}
                  title="Remove from cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9 3a1 1 0 00-1 1v1H5a1 1 0 100 2h.293l.849 11.04A2 2 0 008.137 20h7.726a2 2 0 001.995-1.96L18.707 7H19a1 1 0 100-2h-3V4a1 1 0 00-1-1H9zm2 2V5h2V5h-2zm-1.71 4.29a1 1 0 011.42 0L12 10.59l1.29-1.3a1 1 0 111.42 1.42L13.41 12l1.3 1.29a1 1 0 01-1.42 1.42L12 13.41l-1.29 1.3a1 1 0 01-1.42-1.42l1.3-1.29-1.3-1.29a1 1 0 010-1.42z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

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
            <p className="text-sm text-brand-800">Available points: <strong>{loyalty?.points || 0}</strong></p>
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
            <p className="flex items-center justify-between text-sm"><span>Subtotal</span><span>{formatInr(baseTotal)}</span></p>
            <p className="flex items-center justify-between text-sm text-emerald-700"><span>Offer Discount</span><span>- {formatInr(offerDiscount)}</span></p>
            <p className="flex items-center justify-between text-sm text-emerald-700"><span>Loyalty Redemption</span><span>- {formatInr(redeemDiscount)}</span></p>
            <p className="flex items-center justify-between text-xl font-extrabold pt-2 border-t border-slate-200"><span>Final Total</span><span>{formatInr(finalPrice)}</span></p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h2 className="text-lg font-bold">Prescription Upload</h2>
            <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && uploadPrescription(e.target.files[0])} />
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={prescriptionId} onChange={(e) => setPrescriptionId(e.target.value)}>
              <option value="">No prescription selected</option>
              {prescriptions.map((p) => (
                <option key={p.id} value={p.id}>{p.fileName} ({p.validated ? 'Validated' : 'Pending'})</option>
              ))}
            </select>
          </div>

          <button onClick={placeOrder} className="px-5 py-3 rounded-xl bg-brand-700 text-white font-semibold">Place Order</button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default CartPage;
