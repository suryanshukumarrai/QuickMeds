import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-brand-100 text-brand-900' : 'text-slate-700 hover:bg-slate-100'}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-brand-700">QuickMeds</Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/medicines" className={navClass}>Medicines</NavLink>
          <NavLink to="/cart" className={navClass}>Cart</NavLink>
          {isAuthenticated && <NavLink to="/orders" className={navClass}>Orders</NavLink>}
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:block">Hi, {user?.fullName}</span>
              <button onClick={handleLogout} className="px-3 py-2 text-sm rounded-lg bg-brand-700 text-white hover:bg-brand-900">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm rounded-lg text-brand-800 hover:bg-brand-50">Login</Link>
              <Link to="/register" className="px-3 py-2 text-sm rounded-lg bg-accent text-white hover:brightness-95">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
