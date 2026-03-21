import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';

const initialForm = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
};

function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = useMemo(() => location.state?.from || '/cart', [location.state]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Phone must be 10 digits.';
    if (!form.street.trim()) next.street = 'Street is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.state.trim()) next.state = 'State is required.';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Pincode must be 6 digits.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');
    try {
      await api.post('/addresses', {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      });
      navigate(returnTo, { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.error || 'Failed to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wider font-bold text-brand-700">Checkout Setup</p>
        <h1 className="text-3xl font-extrabold mt-2">Add Delivery Address</h1>
        <p className="mt-2 text-slate-600">This address will be used for your medicine delivery.</p>

        <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Enter full name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="10-digit mobile"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Pincode</label>
            <input
              value={form.pincode}
              onChange={(e) => onChange('pincode', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="6-digit pincode"
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Street Address</label>
            <input
              value={form.street}
              onChange={(e) => onChange('street', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="House no, street, landmark"
            />
            {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">City</label>
            <input
              value={form.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="City"
            />
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">State</label>
            <input
              value={form.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="State"
            />
            {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
          </div>

          {apiError && <p className="md:col-span-2 text-sm text-red-600">{apiError}</p>}

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-xl bg-brand-700 text-white font-semibold disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => navigate(returnTo)}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddressPage;
