import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import MedicineCard from '../components/MedicineCard';
import { useAuth } from '../contexts/AuthContext';
import { emitCartUpdated } from '../utils/cartEvents';

function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItemsByMedicine, setCartItemsByMedicine] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const syncCartState = (cartData) => {
    const next = {};
    (cartData?.items || []).forEach((item) => {
      next[item.medicineId] = { itemId: item.id, quantity: item.quantity };
    });
    setCartItemsByMedicine(next);
    emitCartUpdated(cartData);
  };

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItemsByMedicine({});
      return;
    }
    const { data } = await api.get('/cart');
    syncCartState(data);
  };

  useEffect(() => {
    api.get('/medicines').then((res) => setMedicines(res.data.slice(0, 6)));
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const handleAddToCart = async (medicine) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const { data } = await api.post('/cart/items', { medicineId: medicine.id, quantity: 1 });
    syncCartState(data);
  };

  const handleIncreaseQty = async (medicine) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const existing = cartItemsByMedicine[medicine.id];
    if (!existing) {
      await handleAddToCart(medicine);
      return;
    }
    const { data } = await api.put(`/cart/items/${existing.itemId}`, { quantity: existing.quantity + 1 });
    syncCartState(data);
  };

  const handleDecreaseQty = async (medicine) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const existing = cartItemsByMedicine[medicine.id];
    if (!existing) return;
    if (existing.quantity <= 1) {
      const { data } = await api.delete(`/cart/items/${existing.itemId}`);
      syncCartState(data);
      return;
    }
    const { data } = await api.put(`/cart/items/${existing.itemId}`, { quantity: existing.quantity - 1 });
    syncCartState(data);
  };

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <div className="rounded-3xl overflow-hidden p-8 md:p-12 text-white" style={{ background: 'var(--hero-gradient)' }}>
          <p className="uppercase tracking-widest text-xs font-bold">Trusted e-Pharmacy</p>
          <h1 className="hero-title text-4xl md:text-5xl font-bold leading-tight mt-3">Medicines Delivered Fast, Safe, and Affordable</h1>
          <p className="mt-4 text-brand-50 max-w-2xl">Browse verified medicines, upload prescriptions securely, and place orders in minutes with QuickMeds.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#featured" className="px-5 py-3 bg-white text-brand-700 rounded-xl font-semibold">Browse Medicines</a>
            <a href="#offers" className="px-5 py-3 bg-black/20 rounded-xl font-semibold">See Offers</a>
          </div>
        </div>
      </section>

      <section id="offers" className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold mb-4">Offers & Discounts</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['10% off on first order', 'Free delivery above $25', 'Up to 20% on vitamins'].map((offer) => (
            <div key={offer} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Limited time</p>
              <p className="text-lg font-bold text-brand-900 mt-2">{offer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Medicines</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onAddToCart={handleAddToCart}
              quantity={cartItemsByMedicine[medicine.id]?.quantity || 0}
              onIncrease={handleIncreaseQty}
              onDecrease={handleDecreaseQty}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/medicines?categoryId=${category.id}`)}
              className="px-4 py-2 rounded-full bg-brand-100 text-brand-900 font-semibold hover:bg-brand-500 hover:text-white"
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
