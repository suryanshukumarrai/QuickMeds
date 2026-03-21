import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/client';
import { CheckCircle, XCircle } from 'lucide-react';

function AdminPrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [validationFilter, setValidationFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [validatingId, setValidatingId] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/prescriptions');
      setPrescriptions(res.data || []);
      filterPrescriptions(res.data || [], 'PENDING');
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = (presc, filter) => {
    let filtered = presc;
    if (filter === 'PENDING') {
      filtered = presc.filter((p) => p.validated === false);
    } else if (filter === 'VALIDATED') {
      filtered = presc.filter((p) => p.validated === true);
    }
    setFilteredPrescriptions(filtered);
  };

  const handleFilterChange = (e) => {
    setValidationFilter(e.target.value);
    filterPrescriptions(prescriptions, e.target.value);
  };

  const validatePrescription = async (prescriptionId, isValid) => {
    try {
      setValidatingId(prescriptionId);
      await api.put(`/admin/prescriptions/${prescriptionId}/validate`, {
        validated: isValid,
      });

      // Update local state
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === prescriptionId ? { ...p, validated: isValid } : p
        )
      );
      filterPrescriptions(
        prescriptions.map((p) =>
          p.id === prescriptionId ? { ...p, validated: isValid } : p
        ),
        validationFilter
      );
      setSelectedPrescription(null);
    } catch (err) {
      console.error('Error validating prescription:', err);
      setError('Failed to validate prescription');
    } finally {
      setValidatingId(null);
    }
  };

  const downloadPrescription = async (prescriptionId, fileName) => {
    try {
      const response = await api.get(`/admin/prescriptions/${prescriptionId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `prescription-${prescriptionId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download prescription file');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prescriptions Management</h1>
          <p className="text-slate-600 mt-1">Review and validate user prescriptions</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <select
              value={validationFilter}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Pending Validation</option>
              <option value="VALIDATED">Validated</option>
              <option value="ALL">All Prescriptions</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading prescriptions...</div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              No {validationFilter.toLowerCase()} prescriptions found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          Prescription #{prescription.id}
                        </h3>
                        {prescription.validated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
                            <CheckCircle size={14} />
                            Validated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-semibold">
                            <XCircle size={14} />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        User: {prescription.userFullName || 'Unknown'} ({prescription.userEmail || 'N/A'})
                      </p>
                      <p className="text-sm text-slate-600">
                        File: {prescription.fileName || 'N/A'}
                      </p>
                      <p className="text-sm text-slate-600">
                        Uploaded: {new Date(prescription.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => downloadPrescription(prescription.id, prescription.fileName)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-semibold"
                      >
                        Download
                      </button>
                      {!prescription.validated && (
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Validation Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Review Prescription #{selectedPrescription.id}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">User</p>
                <p className="text-slate-900 font-semibold">
                  {selectedPrescription.userFullName || 'Unknown'} ({selectedPrescription.userEmail || 'N/A'})
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">File Name</p>
                <p className="text-slate-900 font-semibold">
                  {selectedPrescription.fileName || 'N/A'}
                </p>
                <button
                  onClick={() => downloadPrescription(selectedPrescription.id, selectedPrescription.fileName)}
                  className="mt-2 px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 text-sm"
                >
                  Download File
                </button>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Upload Date</p>
                <p className="text-slate-900 font-semibold">
                  {new Date(selectedPrescription.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Review the prescription file before approving.
                  Validate only if the prescription is valid and not expired.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  Is this prescription valid?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => validatePrescription(selectedPrescription.id, true)}
                    disabled={validatingId === selectedPrescription.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                  >
                    {validatingId === selectedPrescription.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => validatePrescription(selectedPrescription.id, false)}
                    disabled={validatingId === selectedPrescription.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
                  >
                    {validatingId === selectedPrescription.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPrescription(null)}
                disabled={validatingId === selectedPrescription.id}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPrescriptionsList;
