import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  FileText, 
  Users, 
  Tags,
  BarChart3
} from 'lucide-react';

function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/medicines', label: 'Medicines', icon: Pill },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: Tags },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-white h-full fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4 space-y-2">
        <div className="mb-6 px-4 py-2">
          <h2 className="text-lg font-bold text-blue-400">Admin Panel</h2>
          <p className="text-sm text-slate-400 mt-1">QuickMeds Management</p>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
