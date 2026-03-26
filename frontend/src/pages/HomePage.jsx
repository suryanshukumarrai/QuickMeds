import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import MedicineCard from '../components/MedicineCard';
import OfferBanner from '../components/OfferBanner';
import PackageCard from '../components/PackageCard';
import LoyaltyCard from '../components/LoyaltyCard';
import { useAuth } from '../contexts/AuthContext';
import { emitCartUpdated } from '../utils/cartEvents';

function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
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
    Promise.all([
      api.get('/medicines', {
        params: { _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      api.get('/categories'),
      api.get('/offers/active'),
      api.get('/packages'),
    ]).then(([medicineRes, categoryRes, offerRes, packageRes]) => {
      const medicineRows = Array.isArray(medicineRes.data) ? medicineRes.data : [];
      const offerRows = Array.isArray(offerRes.data) ? offerRes.data : [];
      const packageRows = Array.isArray(packageRes.data) ? packageRes.data : [];

      setMedicines(medicineRows.slice(0, 6));
      setCategories(categoryRes.data || []);
      setOffers(offerRows);
      setPackages(packageRows.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoyalty(null);
      return;
    }
    api.get('/loyalty').then((res) => setLoyalty(res.data));
  }, [isAuthenticated]);

  const handleAddToCart = async (medicine) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const { data } = await api.post('/cart/items', {
      medicineId: medicine.id,
      quantity: 1,
    });
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
    const { data } = await api.put(`/cart/items/${existing.itemId}`, {
      quantity: existing.quantity + 1,
    });
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

    const { data } = await api.put(`/cart/items/${existing.itemId}`, {
      quantity: existing.quantity - 1,
    });
    syncCartState(data);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/medicines?categoryId=${categoryId}`);
  };

  return (
    <main>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <div
          className="rounded-3xl overflow-hidden p-8 md:p-12 text-white"
          style={{ background: 'var(--hero-gradient)' }}
        >
          <p className="uppercase tracking-widest text-xs font-bold">
            Trusted e-Pharmacy
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Medicines Delivered Fast, Safe, and Affordable
          </h1>
          <p className="mt-4 max-w-2xl">
            Browse verified medicines, upload prescriptions securely, and place
            orders in minutes with QuickMeds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#featured"
              className="px-5 py-3 bg-white text-brand-700 rounded-xl font-semibold"
            >
              Browse Medicines
            </a>
            <a
              href="#offers"
              className="px-5 py-3 bg-black/20 rounded-xl font-semibold"
            >
              See Offers
            </a>
            <button
              onClick={() => navigate('/packages')}
              className="px-5 py-3 bg-brand-900/60 rounded-xl font-semibold"
            >
              View Health Packages
            </button>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <div id="offers">
        <OfferBanner offers={offers} />
      </div>

      {/* LOYALTY */}
      {isAuthenticated && (
        <section className="mx-auto max-w-6xl px-4 pb-12 mt-10">
          <LoyaltyCard points={loyalty?.points || 0} />
        </section>
      )}

      {/* PACKAGES */}
      <section className="mx-auto max-w-6xl px-4 pb-12 mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Health Packages</h2>
          <button
            onClick={() => navigate('/packages')}
            className="text-sm font-semibold text-brand-700"
          >
            View all
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 pb-12 mt-10">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="px-4 py-2 rounded-full bg-brand-100 text-brand-900 font-semibold hover:bg-brand-500 hover:text-white"
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* MEDICINES */}
      <section
        id="featured"
        className="mx-auto max-w-6xl px-4 pb-20 mt-10"
      >
        <h2 className="text-2xl font-bold mb-4">
          Featured Medicines
        </h2>

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
    </main>
  );
}

export default HomePage;