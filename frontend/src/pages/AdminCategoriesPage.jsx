import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';

const initialForm = { name: '', description: '' };

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/categories');
      setCategories(data || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      setForm(initialForm);
      setEditId(null);
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const onEdit = (category) => {
    setEditId(category.id);
    setForm({ name: category.name || '', description: category.description || '' });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-1">Create, update, and remove medicine categories</p>
        </div>

        {error && <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">{error}</div>}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">{editId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Category name"
              className="px-4 py-2 border border-slate-300 rounded-lg"
            />
            <input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="px-4 py-2 border border-slate-300 rounded-lg"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" type="submit">
                {editId ? 'Update' : 'Create'}
              </button>
              {editId && (
                <button
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-slate-600 text-center py-8">Loading categories...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
                      <td className="px-4 py-3 text-slate-700">{category.description || 'N/A'}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-blue-600 hover:text-blue-800 mr-4" onClick={() => onEdit(category)}>Edit</button>
                        <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(category.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && <div className="py-8 text-center text-slate-600">No categories found.</div>}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategoriesPage;
