import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';
import { ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function AdminMedicineForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    requiresPrescription: false,
    imageUrl: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchMedicine();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMedicine = async () => {
    try {
      const res = await api.get(`/medicines/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching medicine:', err);
      setError('Failed to load medicine');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
      };

      if (isEdit) {
        await api.put(`/admin/medicines/${id}`, payload);
      } else {
        await api.post('/admin/medicines', payload);
      }

      navigate('/admin/medicines');
    } catch (err) {
      console.error('Error saving medicine:', err);
      setError(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/medicines')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Medicines
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEdit ? 'Update medicine details' : 'Create a new medicine product'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Aspirin 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medicine description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="requiresPrescription"
                name="requiresPrescription"
                checked={formData.requiresPrescription}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="requiresPrescription" className="text-slate-900 font-medium">
                Requires Prescription
              </label>
              <span className="text-slate-600 text-sm ml-auto">
                Check if this medicine requires a valid prescription
              </span>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/medicines')}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                {isEdit ? 'Update Medicine' : 'Create Medicine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMedicineForm;
