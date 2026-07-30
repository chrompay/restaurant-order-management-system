// VIP/Regular/New classification — Naira-scale thresholds (see spec.md).
// Shared between userController.js (per-customer tier) and
// analyticsController.js (customer segment breakdown).
function classifyCustomerTier(totalSpent, totalOrders) {
  if (totalSpent >= 100000 || totalOrders >= 20) return "VIP";
  if (totalOrders <= 1) return "New";
  return "Regular";
}

module.exports = classifyCustomerTier;
