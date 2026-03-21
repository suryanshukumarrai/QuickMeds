import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-14 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-slate-500 mt-1">Access your cart and order history.</p>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full px-4 py-2 rounded-lg bg-brand-700 text-white font-semibold">Login</button>
      </form>
      <p className="text-sm mt-4">No account? <Link to="/register" className="text-brand-700 font-semibold">Register</Link></p>
    </div>
  );
}

export default LoginPage;
