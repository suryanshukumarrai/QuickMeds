import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import MedicineCard from '../components/MedicineCard';
import { useAuth } from '../contexts/AuthContext';
import { emitCartUpdated } from '../utils/cartEvents';

function ProductListingPage() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [cartItemsByMedicine, setCartItemsByMedicine] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '';
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

  const fetchMedicines = async () => {
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    const { data } = await api.get('/medicines', { params });
    setMedicines(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, [categoryId]);

  useEffect(() => {
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">All Medicines</h1>
      <div className="mt-5 grid md:grid-cols-4 gap-3">
        <input
          className="md:col-span-2 border border-slate-300 rounded-lg px-3 py-2"
          placeholder="Search medicine"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-slate-300 rounded-lg px-3 py-2"
          value={categoryId}
          onChange={(e) => setSearchParams(e.target.value ? { categoryId: e.target.value } : {})}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={fetchMedicines} className="rounded-lg bg-brand-700 text-white font-semibold">Apply</button>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}

export default ProductListingPage;
