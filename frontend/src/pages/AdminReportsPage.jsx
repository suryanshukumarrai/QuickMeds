import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';

function AdminReportsPage() {
  const [report, setReport] = useState({
    revenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    topCategoryHint: 'N/A',
  });

  useEffect(() => {
    const load = async () => {
      const [{ data: orders = [] }, { data: medicines = [] }] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/medicines?search='),
      ]);

      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
      const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length;

      const topCategoryHint = medicines.length > 0
        ? medicines.reduce((acc, m) => {
            acc[m.categoryName] = (acc[m.categoryName] || 0) + 1;
            return acc;
          }, {})
        : {};

      const topCategory = Object.entries(topCategoryHint).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      setReport({
        revenue,
        totalOrders: orders.length,
        deliveredOrders,
        cancelledOrders,
        topCategoryHint: topCategory,
      });
    };

    load().catch(() => {
      setReport((prev) => ({ ...prev }));
    });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-1">Snapshot metrics for operations and sales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-sm text-slate-600">Revenue</p>
            <p className="text-2xl font-bold text-slate-900">${report.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-sm text-slate-600">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900">{report.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-sm text-slate-600">Delivered</p>
            <p className="text-2xl font-bold text-slate-900">{report.deliveredOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-sm text-slate-600">Cancelled</p>
            <p className="text-2xl font-bold text-slate-900">{report.cancelledOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Top Stocked Category</h2>
          <p className="text-slate-700">{report.topCategoryHint}</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminReportsPage;
