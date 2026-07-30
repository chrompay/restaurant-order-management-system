const Order = require("../models/Order");
const RestaurantSettings = require("../models/RestaurantSettings");
const sendResponse = require("../utils/responseHandler");
const classifyCustomer = require("../utils/customerTier");
const {
  percentDelta,
  getRangeBounds,
  getPriorRangeBounds,
  withPriorPeriod,
  getRevenueTotal,
  getDiscountTotal,
  getOrderCount,
  getDistinctCustomerCount,
  getRevenueSeriesByDay,
  getRevenueSeriesByHour,
  getOrderVolumeByHour,
  getAvgDeliveryMinutesByDay,
  getAvgDeliveryMinutesTotal,
  getOnTimeStats,
  getTopFoodsWithRevenue,
  getOrderStatusCounts,
  getCategoryRevenueBreakdown,
  getStationLoad,
  getCustomerGrowthByMonth,
  getReturningRatePct,
  getChurnedCustomerPct,
  getAvgLifetimeValue
} = require("../utils/analyticsAggregations");

function generateInsights({ revenueDeltaPct, avgPrepDeltaPct, revenueSeries, topFoods }) {
  const insights = [];

  if (Math.abs(revenueDeltaPct) >= 1) {
    insights.push({
      title: revenueDeltaPct > 0 ? "Revenue Growth" : "Revenue Decline",
      desc: `Revenue is ${revenueDeltaPct > 0 ? "up" : "down"} ${Math.abs(revenueDeltaPct)}% compared to the previous period.`,
      type: revenueDeltaPct > 0 ? "positive" : "negative"
    });
  }

  const bestDay = revenueSeries.reduce(
    (best, point) => (point.revenue > (best?.revenue ?? -1) ? point : best),
    null
  );

  if (bestDay && bestDay.revenue > 0) {
    insights.push({
      title: "Best Day",
      desc: `${bestDay.date} generated the most revenue this period.`,
      type: "positive"
    });
  }

  if (Math.abs(avgPrepDeltaPct) >= 1) {
    insights.push({
      title: avgPrepDeltaPct < 0 ? "Faster Kitchen" : "Slower Kitchen",
      desc: `Average prep+delivery time ${avgPrepDeltaPct < 0 ? "improved" : "increased"} by ${Math.abs(avgPrepDeltaPct)}% vs last period.`,
      type: avgPrepDeltaPct < 0 ? "positive" : "negative"
    });
  }

  const decliner = topFoods.find(food => food.growthPct !== null && food.growthPct < -10);

  if (decliner) {
    insights.push({
      title: "Underperforming Item",
      desc: `${decliner.name} sales dropped ${Math.abs(decliner.growthPct)}% this period.`,
      type: "negative"
    });
  }

  return insights.slice(0, 4);
}

const getOverview = async (req, res, next) => {
  try {

    const range = req.query.range || "7d";
    const currentRange = getRangeBounds(range);
    const priorRange = getPriorRangeBounds(currentRange);

    const [
      revenue,
      orders,
      avgPrepMinutes,
      activeCustomers,
      currentRevenueSeries,
      priorRevenueSeries,
      statusCounts,
      peakHours,
      currentTopFoods,
      priorTopFoodsAll,
      customerGrowth
    ] = await Promise.all([
      withPriorPeriod(getRevenueTotal, range),
      withPriorPeriod(getOrderCount, range),
      withPriorPeriod(getAvgDeliveryMinutesTotal, range),
      withPriorPeriod(getDistinctCustomerCount, range),
      getRevenueSeriesByDay(currentRange),
      getRevenueSeriesByDay(priorRange),
      getOrderStatusCounts(currentRange),
      getOrderVolumeByHour(currentRange),
      getTopFoodsWithRevenue({ ...currentRange, limit: 5 }),
      getTopFoodsWithRevenue({ ...priorRange, limit: 1000 }),
      getCustomerGrowthByMonth(currentRange)
    ]);

    const priorSalesByName = new Map(priorTopFoodsAll.map(food => [food.name, food.sales]));

    const topFoods = currentTopFoods.map(food => {
      const priorSales = priorSalesByName.get(food.name) || 0;
      return {
        ...food,
        growthPct: priorSales === 0 ? null : percentDelta(food.sales, priorSales)
      };
    });

    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const insights = generateInsights({
      revenueDeltaPct: revenue.deltaPct,
      avgPrepDeltaPct: avgPrepMinutes.deltaPct,
      revenueSeries: currentRevenueSeries,
      topFoods
    });

    sendResponse(res, {
      message: "Overview analytics retrieved successfully",
      data: {
        revenue,
        orders,
        avgPrepMinutes,
        activeCustomers,
        revenueSeries: { current: currentRevenueSeries, prior: priorRevenueSeries },
        statusDistribution,
        peakHours,
        topFoods,
        customerGrowth,
        insights
      }
    });

  } catch (error) {
    next(error);
  }
};

const getSales = async (req, res, next) => {
  try {

    const range = req.query.range || "7d";
    const currentRange = getRangeBounds(range);
    const priorRange = getPriorRangeBounds(currentRange);

    const [grossSales, discounts, currentOrderCount, priorOrderCount, categoryBreakdown, hourlySales] = await Promise.all([
      withPriorPeriod(getRevenueTotal, range),
      withPriorPeriod(getDiscountTotal, range),
      getOrderCount(currentRange),
      getOrderCount(priorRange),
      getCategoryRevenueBreakdown(currentRange),
      getRevenueSeriesByHour(currentRange)
    ]);

    const netSalesCurrent = grossSales.current - discounts.current;
    const netSalesPrior = grossSales.prior - discounts.prior;

    const avgTicketCurrent = currentOrderCount > 0 ? grossSales.current / currentOrderCount : 0;
    const avgTicketPrior = priorOrderCount > 0 ? grossSales.prior / priorOrderCount : 0;

    sendResponse(res, {
      message: "Sales analytics retrieved successfully",
      data: {
        grossSales,
        netSales: {
          current: netSalesCurrent,
          prior: netSalesPrior,
          deltaPct: percentDelta(netSalesCurrent, netSalesPrior)
        },
        discounts,
        avgTicketSize: {
          current: avgTicketCurrent,
          prior: avgTicketPrior,
          deltaPct: percentDelta(avgTicketCurrent, avgTicketPrior)
        },
        categoryBreakdown,
        hourlySales
      }
    });

  } catch (error) {
    next(error);
  }
};

const getKitchen = async (req, res, next) => {
  try {

    const range = req.query.range || "7d";
    const currentRange = getRangeBounds(range);
    const priorRange = getPriorRangeBounds(currentRange);

    const restaurantSettings = await RestaurantSettings.getSingleton();
    const targetPrepMinutes = restaurantSettings.targetPrepTimeMinutes;

    const [avgPrepMinutes, currentOnTime, priorOnTime, prepTimeSeries, stationLoad] = await Promise.all([
      withPriorPeriod(getAvgDeliveryMinutesTotal, range),
      getOnTimeStats({ ...currentRange, targetMinutes: targetPrepMinutes }),
      getOnTimeStats({ ...priorRange, targetMinutes: targetPrepMinutes }),
      getAvgDeliveryMinutesByDay(currentRange),
      getStationLoad(currentRange)
    ]);

    sendResponse(res, {
      message: "Kitchen analytics retrieved successfully",
      data: {
        avgPrepMinutes,
        onTimePct: {
          current: currentOnTime.onTimePct,
          prior: priorOnTime.onTimePct,
          deltaPct: percentDelta(currentOnTime.onTimePct, priorOnTime.onTimePct)
        },
        latePct: {
          current: currentOnTime.latePct,
          prior: priorOnTime.latePct,
          deltaPct: percentDelta(currentOnTime.latePct, priorOnTime.latePct)
        },
        targetPrepMinutes,
        prepTimeSeries,
        stationLoad
      }
    });

  } catch (error) {
    next(error);
  }
};

const getCustomerSegments = async ({ start, end }) => {
  const activeCustomerIds = await Order.distinct("customer", {
    createdAt: { $gte: start, $lte: end }
  });

  if (activeCustomerIds.length === 0) return [];

  const stats = await Order.aggregate([
    { $match: { customer: { $in: activeCustomerIds }, status: { $ne: "Cancelled" } } },
    { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
  ]);

  const counts = { VIP: 0, Regular: 0, New: 0 };

  stats.forEach(customerStats => {
    const tier = classifyCustomer(customerStats.totalSpent, customerStats.totalOrders);
    counts[tier] += 1;
  });

  const total = stats.length || 1;

  return Object.entries(counts).map(([tier, count]) => ({
    tier,
    pct: Math.round((count / total) * 1000) / 10
  }));
};

const getCustomers = async (req, res, next) => {
  try {

    const range = req.query.range || "7d";
    const currentRange = getRangeBounds(range);
    const priorRange = getPriorRangeBounds(currentRange);

    const [activeCustomers, returningRate, avgLifetimeValue, churnRatePct, customerGrowth, segments] = await Promise.all([
      withPriorPeriod(getDistinctCustomerCount, range),
      withPriorPeriod(getReturningRatePct, range),
      withPriorPeriod(getAvgLifetimeValue, range),
      getChurnedCustomerPct({ currentRange, priorRange }),
      getCustomerGrowthByMonth(currentRange),
      getCustomerSegments(currentRange)
    ]);

    sendResponse(res, {
      message: "Customer analytics retrieved successfully",
      data: {
        activeCustomers,
        returningRate,
        avgLifetimeValue,
        churnRatePct,
        customerGrowth,
        segments
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getSales,
  getKitchen,
  getCustomers
};
