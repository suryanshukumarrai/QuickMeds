import { useEffect, useState } from 'react';
import api from '../api/client';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const cartRes = await api.get('/cart');
    setCart(cartRes.data);
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
                <p className="text-sm text-slate-500">${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="w-20 border border-slate-300 rounded px-2 py-1"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                />
                <button onClick={() => remove(item.id)} className="px-3 py-1 rounded bg-red-50 text-red-600">Remove</button>
              </div>
            </div>
          ))}
          <p className="text-xl font-bold">Total: ${cart.total}</p>

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
