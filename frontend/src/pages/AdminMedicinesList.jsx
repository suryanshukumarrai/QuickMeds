import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminMedicinesList() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get('/medicines?search=');
      setMedicines(res.data || []);
      setFilteredMedicines(res.data || []);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(term) ||
        med.description.toLowerCase().includes(term)
    );
    setFilteredMedicines(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/medicines/${id}`);
      setMedicines(medicines.filter((m) => m.id !== id));
      setFilteredMedicines(filteredMedicines.filter((m) => m.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setError('Failed to delete medicine');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Medicines Management</h1>
            <p className="text-slate-600 mt-1">Manage medicines inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/medicines/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <Plus size={20} />
            Add Medicine
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6 bg-slate-100 px-4 py-2 rounded-lg">
            <Search size={20} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 bg-transparent outline-none text-slate-900"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading medicines...</div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12 text-slate-600">No medicines found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Category</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Prescription</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900 font-medium">{medicine.name}</td>
                      <td className="px-4 py-3 text-slate-900">${medicine.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            medicine.stock < 10
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {medicine.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{medicine.categoryName || 'N/A'}</td>
                      <td className="px-4 py-3 text-center">
                        {medicine.requiresPrescription ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/admin/medicines/${medicine.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800 mr-3 inline-flex"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(medicine.id)}
                          className="text-red-600 hover:text-red-800 inline-flex"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this medicine? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminMedicinesList;
