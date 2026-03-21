import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { CART_UPDATED_EVENT, getCartItemCount } from '../utils/cartEvents';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await api.get('/cart');
      setCartCount(getCartItemCount(data));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleCartUpdated = (event) => {
      setCartCount(getCartItemCount(event.detail?.cartData));
    };
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
  }, []);

  const handleLogout = () => {
    logout();
    setCartCount(0);
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold ${
      isActive
        ? 'bg-brand-100 text-brand-900'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-brand-700">
          QuickMeds
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/medicines" className={navClass}>Medicines</NavLink>

          {/* ✅ KEEP THIS */}
          <NavLink to="/packages" className={navClass}>Packages</NavLink>

          <NavLink to="/cart" className={navClass}>
            <span className="inline-flex items-center gap-1">
              Cart
              {cartCount > 0 && (
                <span className="min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-brand-700 text-white text-[11px] leading-none">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/orders" className={navClass}>Orders</NavLink>
          )}

          {isAuthenticated && user?.role === 'ROLE_ADMIN' && (
            <NavLink to="/admin/dashboard" className={navClass}>Admin</NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:block">
                Hi, {user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm rounded-lg bg-brand-700 text-white hover:bg-brand-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm rounded-lg text-brand-800 hover:bg-brand-50">
                Login
              </Link>
              <Link to="/register" className="px-3 py-2 text-sm rounded-lg bg-accent text-white hover:brightness-95">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;