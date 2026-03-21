import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import MedicineCard from '../components/MedicineCard';
import { useAuth } from '../contexts/AuthContext';

function ProductListingPage() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const handleAddToCart = async (medicine) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await api.post('/cart/items', { medicineId: medicine.id, quantity: 1 });
    navigate('/cart');
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
          <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default ProductListingPage;
