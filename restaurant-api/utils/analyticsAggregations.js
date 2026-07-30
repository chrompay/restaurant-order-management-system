const Order = require("../models/Order");

// Cancelled orders don't count as real revenue
const NOT_CANCELLED = { status: { $ne: "Cancelled" } };

function percentDelta(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 1000) / 10;
}

// UTC-based range presets — see spec.md for the known per-viewer-timezone
// limitation (same simplification as Phase 4's dashboard ranges).
function getRangeBounds(range) {
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "ytd":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "7d":
    default:
      start.setDate(start.getDate() - 7);
      break;
  }

  return { start, end };
}

// The immediately-preceding period of the same duration, for current-vs-prior deltas.
function getPriorRangeBounds({ start, end }) {
  const durationMs = end.getTime() - start.getTime();
  const priorEnd = new Date(start.getTime() - 1);
  const priorStart = new Date(priorEnd.getTime() - durationMs);

  return { start: priorStart, end: priorEnd };
}

// Generic wrapper for scalar-returning helpers (getRevenueTotal, getOrderCount,
// etc) — calls the helper twice (current + prior period) and computes the delta,
// so individual controllers don't duplicate this current-vs-prior pattern.
async function withPriorPeriod(helper, range, extraParams = {}) {
  const currentRange = getRangeBounds(range);
  const priorRange = getPriorRangeBounds(currentRange);

  const [current, prior] = await Promise.all([
    helper({ ...currentRange, ...extraParams }),
    helper({ ...priorRange, ...extraParams })
  ]);

  return { current, prior, deltaPct: percentDelta(current, prior) };
}

const getRevenueTotal = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  return result[0]?.total || 0;
};

const getDiscountTotal = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    { $group: { _id: null, total: { $sum: "$discountAmount" } } }
  ]);

  return result[0]?.total || 0;
};

const getOrderCount = async ({ start, end }) => {
  return Order.countDocuments({ createdAt: { $gte: start, $lte: end } });
};

const getDistinctCustomerCount = async ({ start, end }) => {
  const customerIds = await Order.distinct("customer", {
    createdAt: { $gte: start, $lte: end }
  });

  return customerIds.length;
};

const getRevenueSeriesByHour = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({ hour: r._id, revenue: r.revenue }));
};

const getRevenueSeriesByDay = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({ date: r._id, revenue: r.revenue }));
};

const getOrderVolumeByHour = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        volume: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({ hour: r._id, volume: r.volume }));
};

// Approximates prep+delivery duration as time from order creation to the
// last status update on fully-completed (Delivered) orders — there's no
// per-status-transition history stored, so this is a reasonable proxy, not
// an exact "time spent preparing" figure. Reused by Dashboard (hourly, for
// today) and Analytics (daily and single-average, for arbitrary ranges).
const getAvgDeliveryMinutesByHour = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: "Delivered" } },
    {
      $project: {
        hour: { $hour: "$createdAt" },
        minutes: {
          $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000]
        }
      }
    },
    {
      $group: {
        _id: "$hour",
        avgPrep: { $avg: "$minutes" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({ hour: r._id, avgPrep: Math.round(r.avgPrep) }));
};

const getAvgDeliveryMinutesByDay = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: "Delivered" } },
    {
      $project: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        minutes: {
          $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000]
        }
      }
    },
    {
      $group: {
        _id: "$day",
        avgPrep: { $avg: "$minutes" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({ date: r._id, avgPrep: Math.round(r.avgPrep * 10) / 10 }));
};

const getAvgDeliveryMinutesTotal = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: "Delivered" } },
    {
      $project: {
        minutes: {
          $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000]
        }
      }
    },
    { $group: { _id: null, avgPrep: { $avg: "$minutes" } } }
  ]);

  if (result.length === 0) return 0;

  return Math.round(result[0].avgPrep * 10) / 10;
};

// % of Delivered orders whose prep+delivery time was within targetMinutes.
const getOnTimeStats = async ({ start, end, targetMinutes }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: "Delivered" } },
    {
      $project: {
        minutes: {
          $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000]
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        onTime: {
          $sum: { $cond: [{ $lte: ["$minutes", targetMinutes] }, 1, 0] }
        }
      }
    }
  ]);

  if (result.length === 0 || result[0].total === 0) {
    return { onTimePct: 0, latePct: 0 };
  }

  const onTimePct = Math.round((result[0].onTime / result[0].total) * 1000) / 10;

  return { onTimePct, latePct: Math.round((100 - onTimePct) * 10) / 10 };
};

const getTopFoods = async ({ start, end, limit = 5 }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.foodName",
        sales: { $sum: "$items.quantity" }
      }
    },
    { $sort: { sales: -1 } },
    { $limit: limit }
  ]);

  return result.map(r => ({ name: r._id, sales: r.sales }));
};

const getTopFoodsWithRevenue = async ({ start, end, limit = 5 }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.foodName",
        sales: { $sum: "$items.quantity" },
        revenue: {
          $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] }
        }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit }
  ]);

  return result.map(r => ({ name: r._id, sales: r.sales, revenue: r.revenue }));
};

const getOrderStatusCounts = async ({ start, end } = {}) => {
  const match = start && end ? { createdAt: { $gte: start, $lte: end } } : {};

  const result = await Order.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  return result.reduce((acc, r) => {
    acc[r._id] = r.count;
    return acc;
  }, {});
};

// Revenue by menu category — attributed via each order item's food -> the
// food's *current* menu (order items don't snapshot menu), same caveat as
// Phase 2's per-category revenue on the Categories page.
const getCategoryRevenueBreakdown = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "foods",
        localField: "items.food",
        foreignField: "_id",
        as: "foodDoc"
      }
    },
    { $unwind: "$foodDoc" },
    {
      $lookup: {
        from: "menus",
        localField: "foodDoc.menu",
        foreignField: "_id",
        as: "menuDoc"
      }
    },
    { $unwind: "$menuDoc" },
    {
      $group: {
        _id: "$menuDoc.categoryName",
        value: {
          $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] }
        }
      }
    },
    { $sort: { value: -1 } }
  ]);

  return result.map(r => ({ name: r._id, value: r.value }));
};

// Order volume per kitchen station, from each item's snapshotted station.
const getStationLoad = async ({ start, end }) => {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $unwind: "$items" },
    { $match: { "items.station": { $ne: null } } },
    {
      $group: {
        _id: "$items.station",
        orders: { $sum: "$items.quantity" }
      }
    },
    { $sort: { orders: -1 } }
  ]);

  return result.map(r => ({ station: r._id, orders: r.orders }));
};

function formatMonth(date) {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// New-vs-returning customers per month: a customer counts as "new" in the
// month of their first-ever order, "returning" in any later month they order.
const getCustomerGrowthByMonth = async ({ start, end }) => {
  const [firstOrders, monthlyActivity] = await Promise.all([
    Order.aggregate([
      { $match: NOT_CANCELLED },
      { $group: { _id: "$customer", firstOrderAt: { $min: "$createdAt" } } }
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, ...NOT_CANCELLED } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            customer: "$customer"
          }
        }
      }
    ])
  ]);

  const firstOrderMonthByCustomer = new Map(
    firstOrders.map(f => [String(f._id), formatMonth(f.firstOrderAt)])
  );

  const buckets = {};

  monthlyActivity.forEach(({ _id }) => {
    const { month, customer } = _id;

    if (!buckets[month]) {
      buckets[month] = { new: 0, returning: 0 };
    }

    if (firstOrderMonthByCustomer.get(String(customer)) === month) {
      buckets[month].new += 1;
    } else {
      buckets[month].returning += 1;
    }
  });

  return Object.keys(buckets)
    .sort()
    .map(month => ({ month, ...buckets[month] }));
};

// % of customers active in [start,end] whose first-ever order was before
// this range started (i.e. they're returning, not newly-acquired this range).
const getReturningRatePct = async ({ start, end }) => {
  const [firstOrders, activeCustomers] = await Promise.all([
    Order.aggregate([
      { $match: NOT_CANCELLED },
      { $group: { _id: "$customer", firstOrderAt: { $min: "$createdAt" } } }
    ]),
    Order.distinct("customer", {
      createdAt: { $gte: start, $lte: end },
      ...NOT_CANCELLED
    })
  ]);

  if (activeCustomers.length === 0) return 0;

  const firstOrderMap = new Map(firstOrders.map(f => [String(f._id), f.firstOrderAt]));

  const returning = activeCustomers.filter(id => {
    const firstOrderAt = firstOrderMap.get(String(id));
    return firstOrderAt && firstOrderAt.getTime() < start.getTime();
  });

  return Math.round((returning.length / activeCustomers.length) * 1000) / 10;
};

// % of customers active in the prior period who did not order again in the current period.
const getChurnedCustomerPct = async ({ currentRange, priorRange }) => {
  const [currentCustomers, priorCustomers] = await Promise.all([
    Order.distinct("customer", {
      createdAt: { $gte: currentRange.start, $lte: currentRange.end }
    }),
    Order.distinct("customer", {
      createdAt: { $gte: priorRange.start, $lte: priorRange.end }
    })
  ]);

  if (priorCustomers.length === 0) return 0;

  const currentSet = new Set(currentCustomers.map(String));
  const churned = priorCustomers.filter(id => !currentSet.has(String(id)));

  return Math.round((churned.length / priorCustomers.length) * 1000) / 10;
};

// Avg all-time (lifetime) spend of customers who were active in [start,end].
const getAvgLifetimeValue = async ({ start, end }) => {
  const activeCustomerIds = await Order.distinct("customer", {
    createdAt: { $gte: start, $lte: end }
  });

  if (activeCustomerIds.length === 0) return 0;

  const result = await Order.aggregate([
    { $match: { customer: { $in: activeCustomerIds }, ...NOT_CANCELLED } },
    { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" } } },
    { $group: { _id: null, avgLifetimeValue: { $avg: "$totalSpent" } } }
  ]);

  return Math.round((result[0]?.avgLifetimeValue || 0) * 100) / 100;
};

// Orders currently active in the kitchen (Confirmed/Preparing), plus how
// long (in minutes) they've been waiting so far, computed as of now.
const getKitchenQueueStats = async () => {
  const result = await Order.aggregate([
    { $match: { status: { $in: ["Confirmed", "Preparing"] } } },
    {
      $project: {
        waitMinutes: {
          $divide: [{ $subtract: ["$$NOW", "$createdAt"] }, 60000]
        }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgWaitMinutes: { $avg: "$waitMinutes" }
      }
    }
  ]);

  if (result.length === 0) {
    return { count: 0, avgWaitMinutes: 0 };
  }

  return {
    count: result[0].count,
    avgWaitMinutes: Math.round(result[0].avgWaitMinutes)
  };
};

module.exports = {
  percentDelta,
  getRangeBounds,
  getPriorRangeBounds,
  withPriorPeriod,
  getRevenueTotal,
  getDiscountTotal,
  getOrderCount,
  getDistinctCustomerCount,
  getRevenueSeriesByHour,
  getRevenueSeriesByDay,
  getOrderVolumeByHour,
  getAvgDeliveryMinutesByHour,
  getAvgDeliveryMinutesByDay,
  getAvgDeliveryMinutesTotal,
  getOnTimeStats,
  getTopFoods,
  getTopFoodsWithRevenue,
  getOrderStatusCounts,
  getCategoryRevenueBreakdown,
  getStationLoad,
  getCustomerGrowthByMonth,
  getReturningRatePct,
  getChurnedCustomerPct,
  getAvgLifetimeValue,
  getKitchenQueueStats
};
