import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.fullName, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-14 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Register</h1>
      <p className="text-sm text-slate-500 mt-1">Create your QuickMeds account.</p>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full px-4 py-2 rounded-lg bg-accent text-white font-semibold">Create Account</button>
      </form>
      <p className="text-sm mt-4">Already have an account? <Link to="/login" className="text-brand-700 font-semibold">Login</Link></p>
    </div>
  );
}

export default RegisterPage;
