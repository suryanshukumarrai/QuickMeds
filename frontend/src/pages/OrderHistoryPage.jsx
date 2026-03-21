import { useEffect, useState } from 'react';
import api from '../api/client';
import { formatInr } from '../utils/medicineUi';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Order History</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p>No orders placed yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm mt-1">Status: <span className="font-semibold">{order.status}</span></p>
            {order.status === 'CANCELLED' && order.cancellationReason && (
              <p className="text-sm mt-1 text-red-700">
                Reason: <span className="font-semibold">{order.cancellationReason}</span>
              </p>
            )}
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
