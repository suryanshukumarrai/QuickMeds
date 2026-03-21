import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { formatInr, getMedicineImage } from '../utils/medicineUi';

function ProductDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const syncCurrentCartItem = (cartData, medicineId) => {
    const found = (cartData?.items || []).find((item) => item.medicineId === medicineId);
    setCartItem(found ? { itemId: found.id, quantity: found.quantity } : null);
  };

  useEffect(() => {
    api.get(`/medicines/${id}`).then((res) => setMedicine(res.data));
  }, [id]);

  useEffect(() => {
    if (!medicine || !isAuthenticated) {
      setCartItem(null);
      return;
    }
    api.get('/cart').then((res) => syncCurrentCartItem(res.data, medicine.id));
  }, [medicine, isAuthenticated]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const { data } = await api.post('/cart/items', { medicineId: medicine.id, quantity: 1 });
    syncCurrentCartItem(data, medicine.id);
    setMessage('Added to cart.');
  };

  const increaseQty = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!cartItem) {
      await addToCart();
      return;
    }
    const { data } = await api.put(`/cart/items/${cartItem.itemId}`, { quantity: cartItem.quantity + 1 });
    syncCurrentCartItem(data, medicine.id);
  };

  const decreaseQty = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      const { data } = await api.delete(`/cart/items/${cartItem.itemId}`);
      syncCurrentCartItem(data, medicine.id);
      setMessage('Removed from cart.');
      return;
    }
    const { data } = await api.put(`/cart/items/${cartItem.itemId}`, { quantity: cartItem.quantity - 1 });
    syncCurrentCartItem(data, medicine.id);
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
        {cartItem ? (
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-brand-700 text-white px-3 py-2">
            <button onClick={decreaseQty} className="w-9 h-9 rounded-lg bg-brand-900/40 hover:bg-brand-900/60">-</button>
            <span className="font-semibold min-w-6 text-center">{cartItem.quantity}</span>
            <button onClick={increaseQty} className="w-9 h-9 rounded-lg bg-brand-900/40 hover:bg-brand-900/60">+</button>
          </div>
        ) : (
          <button onClick={addToCart} className="mt-6 px-5 py-3 bg-brand-700 text-white rounded-xl font-semibold">Add to Cart</button>
        )}
        {message && <p className="mt-4 text-emerald-700">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetailPage;
