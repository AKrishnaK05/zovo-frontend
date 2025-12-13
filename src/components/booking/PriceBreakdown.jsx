const PriceBreakdown = ({ pricing, loading }) => {
  if (loading) {
    return (
      <div className="panel-card p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!pricing) return null;

  const { breakdown } = pricing;

  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Price Breakdown</h3>
      
      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex justify-between text-gray-300">
          <span>Base Service</span>
          <span>${breakdown.basePrice.toFixed(2)}</span>
        </div>

        {/* Sub-services */}
        {breakdown.subServices > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Additional Services</span>
            <span>${breakdown.subServices.toFixed(2)}</span>
          </div>
        )}

        {/* Modifiers */}
        {breakdown.modifiers.map((mod, index) => (
          <div key={index} className="flex justify-between text-gray-400 text-sm">
            <span className="flex items-center">
              {mod.type === 'weekend' && '📅'}
              {mod.type === 'peak_hour' && '⏰'}
              {mod.type === 'surge' && '📈'}
              {mod.type === 'area' && '📍'}
              <span className="ml-1">{mod.name}</span>
            </span>
            <span className={mod.amount > 0 ? 'text-yellow-400' : 'text-green-400'}>
              {mod.amount > 0 ? '+' : ''}${mod.amount.toFixed(2)}
            </span>
          </div>
        ))}

        {/* Travel Fee */}
        {breakdown.travelFee > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Travel Fee</span>
            <span>${breakdown.travelFee.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 my-2"></div>

        {/* Subtotal */}
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${breakdown.subtotal.toFixed(2)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Tax (8%)</span>
          <span>${breakdown.tax.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {breakdown.discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-${breakdown.discount.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 my-2"></div>

        {/* Total */}
        <div className="flex justify-between text-xl font-bold">
          <span className="text-white">Total</span>
          <span className="gradient-text">${breakdown.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Price Guarantee */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center text-green-400 text-sm">
          <span className="mr-2">✓</span>
          <span>Price locked at booking. No hidden charges.</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;