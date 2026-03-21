import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';
import { DollarSign, Package, Users, AlertCircle, FileCheck, TrendingUp, ShoppingCart } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingPrescriptions: 0,
    lowStockMedicines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersRes = await api.get('/orders');
        const orders = ordersRes.data || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Fetch medicines for low stock
        const medicinesRes = await api.get('/medicines?search=');
        const medicines = medicinesRes.data || [];
        const lowStock = medicines.filter(m => m.stock < 10).length;

        // Fetch prescriptions
        const prescriptionsRes = await api.get('/prescriptions');
        const prescriptions = prescriptionsRes.data || [];
        const pendingPrescriptions = prescriptions.filter(p => !p.validated).length;

        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          totalUsers: 0, // Would need admin endpoint for this
          pendingPrescriptions: pendingPrescriptions,
          lowStockMedicines: lowStock,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, subtext }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('border', 'bg')}`}>
          <Icon size={32} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome to QuickMeds Administration Panel</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={stats.totalOrders}
            color="border-blue-500 bg-blue-50"
            subtext="All time orders"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="border-green-500 bg-green-50"
            subtext="All time revenue"
          />
          <StatCard
            icon={Users}
            title="Registered Users"
            value={stats.totalUsers}
            color="border-purple-500 bg-purple-50"
            subtext="Active users on platform"
          />
          <StatCard
            icon={FileCheck}
            title="Pending Prescriptions"
            value={stats.pendingPrescriptions}
            color="border-yellow-500 bg-yellow-50"
            subtext="Awaiting validation"
          />
          <StatCard
            icon={AlertCircle}
            title="Low Stock Medicines"
            value={stats.lowStockMedicines}
            color="border-red-500 bg-red-50"
            subtext="Stock less than 10"
          />
          <StatCard
            icon={TrendingUp}
            title="Active Features"
            value="7"
            color="border-indigo-500 bg-indigo-50"
            subtext="Management modules"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/medicines"
              className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Package className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-slate-900">Add Medicine</h3>
              <p className="text-sm text-slate-600">Create new medicine product</p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border border-slate-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <ShoppingCart className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-slate-900">View Orders</h3>
              <p className="text-sm text-slate-600">Manage customer orders</p>
            </a>
            <a
              href="/admin/prescriptions"
              className="p-4 border border-slate-200 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <FileCheck className="text-yellow-600 mb-2" size={24} />
              <h3 className="font-semibold text-slate-900">Validate Prescriptions</h3>
              <p className="text-sm text-slate-600">Review prescriptions</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
