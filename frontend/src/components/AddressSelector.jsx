function formatAddressLine(address) {
  return `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
}

function AddressSelector({
  addresses = [],
  selectedAddressId,
  onSelect,
  onAddNew,
  onDelete,
  loading = false,
  error = '',
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Delivery Address</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="px-3 py-2 rounded-lg border border-brand-300 text-brand-700 text-sm font-semibold hover:bg-brand-50"
        >
          Add New Address
        </button>
      </div>

      {loading && <p className="text-sm text-slate-600">Loading addresses...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && addresses.length === 0 && (
        <p className="text-sm text-slate-600">No saved addresses found.</p>
      )}

      <div className="space-y-2">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`block rounded-lg border p-3 cursor-pointer transition ${
              Number(selectedAddressId) === Number(address.id)
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="address"
                checked={Number(selectedAddressId) === Number(address.id)}
                onChange={() => onSelect(address.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{address.fullName}</p>
                <p className="text-sm text-slate-600">{address.phone}</p>
                <p className="text-sm text-slate-600 mt-1">{formatAddressLine(address)}</p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onDelete?.(address.id);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

export default AddressSelector;
