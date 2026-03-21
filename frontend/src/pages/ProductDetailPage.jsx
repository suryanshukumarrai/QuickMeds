import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { formatInr, getMedicineImage } from '../utils/medicineUi';

function ProductDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/medicines/${id}`).then((res) => setMedicine(res.data));
  }, [id]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await api.post('/cart/items', { medicineId: medicine.id, quantity: 1 });
    setMessage('Added to cart.');
  };

  if (!medicine) return <p className="p-8">Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-2 gap-8">
      <img src={getMedicineImage(medicine)} alt={medicine.name} className="rounded-2xl w-full h-96 object-cover" />
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-700 font-bold">{medicine.categoryName}</p>
        <h1 className="text-3xl font-bold mt-2">{medicine.name}</h1>
        <p className="text-slate-600 mt-4">{medicine.description}</p>
        <p className="text-2xl font-extrabold text-brand-900 mt-6">{formatInr(medicine.price)}</p>
        <p className="mt-2 text-sm text-slate-600">Stock: {medicine.stock}</p>
        <p className="mt-2 text-sm">{medicine.requiresPrescription ? 'Prescription required before order' : 'No prescription required'}</p>
        <button onClick={addToCart} className="mt-6 px-5 py-3 bg-brand-700 text-white rounded-xl font-semibold">Add to Cart</button>
        {message && <p className="mt-4 text-emerald-700">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetailPage;
