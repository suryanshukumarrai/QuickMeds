import { useEffect, useState } from 'react';
import api from '../api/client';
import PackageCard from '../components/PackageCard';

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        setPackages(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-bold text-brand-700">QuickMeds Bundles</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Health Packages</h1>
        <p className="mt-2 text-slate-600">Curated wellness kits with built-in savings and trusted essentials.</p>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading packages...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}

      {!loading && packages.length === 0 && (
        <p className="text-slate-600">No health packages available right now.</p>
      )}
    </main>
  );
}

export default PackagesPage;
