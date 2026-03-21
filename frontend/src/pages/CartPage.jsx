import { useEffect, useState } from 'react';
import api from '../api/client';
import { emitCartUpdated } from '../utils/cartEvents';
import { formatInr } from '../utils/medicineUi';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const cartRes = await api.get('/cart');
    setCart(cartRes.data);
    emitCartUpdated(cartRes.data);
    const prRes = await api.get('/prescriptions');
    setPrescriptions(prRes.data);
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
      await api.post('/orders', { prescriptionId: prescriptionId ? Number(prescriptionId) : null });
      setMessage('Order placed successfully.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Order placement failed');
    }
  };

  if (!cart) return <p className="p-8">Loading cart...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {cart.items.length === 0 ? <p className="mt-4">Cart is empty.</p> : (
        <div className="mt-6 space-y-4">
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
<p className="text-xl font-bold">
  Total: {formatInr(
    cart.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    )
  )}
</p>

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
