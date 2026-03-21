import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { emitCartUpdated } from '../utils/cartEvents';
import { formatInr } from '../utils/medicineUi';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  const handleReorder = async (order) => {
    try {
      setMessage('');
      setReorderingOrderId(order.id);
      for (const item of order.items) {
        await api.post('/cart/items', { medicineId: item.medicineId, quantity: item.quantity });
      }
      const { data } = await api.get('/cart');
      emitCartUpdated(data);
      navigate('/cart');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to reorder this medicine right now.');
    } finally {
      setReorderingOrderId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Order History</h1>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p>No orders placed yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Order #{order.id}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => handleReorder(order)}
                  disabled={reorderingOrderId === order.id}
                  className="px-3 py-1 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reorderingOrderId === order.id ? 'Reordering...' : 'Reorder'}
                </button>
              </div>
            </div>
            <p className="text-sm mt-1">Status: <span className="font-semibold">{order.status}</span></p>
            <p className="text-sm">Total: <span className="font-semibold">{formatInr(order.totalAmount)}</span></p>
            <ul className="mt-3 text-sm text-slate-700 list-disc list-inside">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.medicineId}`}>{item.medicineName} x {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
