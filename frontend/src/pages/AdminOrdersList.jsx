import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';
import { Eye, Search } from 'lucide-react';

function AdminOrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    PLACED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-yellow-100 text-yellow-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Note: This endpoint returns only current user's orders
      // For admin, we'd need an admin endpoint to fetch all orders
      const res = await api.get('/orders');
      setOrders(res.data || []);
      setFilteredOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // This is a placeholder - you'll need to create this endpoint in the backend
      console.log('Updating order', orderId, 'to status', newStatus);
      // await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      alert('Status update endpoint needs to be created in backend');
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-600 mt-1">View and manage all customer orders</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 px-4 py-2 rounded-lg">
              <Search size={20} className="text-slate-600" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-slate-900"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-600">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Total Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Items</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900 font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-slate-900 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 inline-flex"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Order #{selectedOrder.id}</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-xl font-bold text-slate-900">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColors[selectedOrder.status]
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Order Date</p>
                  <p className="text-slate-900 font-semibold">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Items Count</p>
                  <p className="text-slate-900 font-semibold">{selectedOrder.items?.length || 0}</p>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Order Items</h3>
                  <div className="space-y-2 bg-slate-50 p-4 rounded">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.medicineName} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrdersList;
