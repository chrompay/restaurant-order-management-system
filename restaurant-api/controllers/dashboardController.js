const {
  getRevenueTotal,
  getOrderCount,
  getDistinctCustomerCount,
  getRevenueSeriesByHour,
  getOrderVolumeByHour,
  getAvgDeliveryMinutesByHour,
  getTopFoods,
  getOrderStatusCounts,
  getKitchenQueueStats
} = require("../utils/analyticsAggregations");
const sendResponse = require("../utils/responseHandler");

// UTC-day boundaries, `daysAgo` days back from now. Kept simple (no
// per-viewer timezone handling) — see spec.md for the known limitation.
function getUtcDayRange(daysAgo = 0) {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - daysAgo
  ));

  const end = daysAgo === 0
    ? now
    : new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

  return { start, end };
}

function percentDelta(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const getKpis = async (req, res, next) => {
  try {

    const today = getUtcDayRange(0);
    const yesterday = getUtcDayRange(1);

    const [
      revenueToday,
      revenueYesterday,
      ordersToday,
      ordersYesterday,
      customersToday,
      customersYesterday,
      statusCounts,
      kitchenQueue
    ] = await Promise.all([
      getRevenueTotal(today),
      getRevenueTotal(yesterday),
      getOrderCount(today),
      getOrderCount(yesterday),
      getDistinctCustomerCount(today),
      getDistinctCustomerCount(yesterday),
      getOrderStatusCounts(),
      getKitchenQueueStats()
    ]);

    sendResponse(res, {
      message: "Dashboard KPIs retrieved successfully",
      data: {
        revenueToday,
        revenueDeltaPct: percentDelta(revenueToday, revenueYesterday),
        ordersToday,
        ordersDeltaPct: percentDelta(ordersToday, ordersYesterday),
        pendingOrders: statusCounts.Pending || 0,
        kitchenQueueCount: kitchenQueue.count,
        kitchenAvgWaitMinutes: kitchenQueue.avgWaitMinutes,
        customersToday,
        customersDeltaPct: percentDelta(customersToday, customersYesterday)
      }
    });

  } catch (error) {
    next(error);
  }
};

const getRevenueSeries = async (req, res, next) => {
  try {

    const { start, end } = getUtcDayRange(0);
    const series = await getRevenueSeriesByHour({ start, end });

    sendResponse(res, {
      message: "Revenue series retrieved successfully",
      data: series
    });

  } catch (error) {
    next(error);
  }
};

const getPeakHours = async (req, res, next) => {
  try {

    const { start, end } = getUtcDayRange(0);
    const series = await getOrderVolumeByHour({ start, end });

    sendResponse(res, {
      message: "Peak hours retrieved successfully",
      data: series
    });

  } catch (error) {
    next(error);
  }
};

const getPrepTimeSeries = async (req, res, next) => {
  try {

    const { start, end } = getUtcDayRange(0);
    const series = await getAvgDeliveryMinutesByHour({ start, end });

    sendResponse(res, {
      message: "Prep time series retrieved successfully",
      data: series
    });

  } catch (error) {
    next(error);
  }
};

const getTopFoodsToday = async (req, res, next) => {
  try {

    const { start, end } = getUtcDayRange(0);
    const foods = await getTopFoods({ start, end, limit: 5 });

    sendResponse(res, {
      message: "Top foods retrieved successfully",
      data: foods
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKpis,
  getRevenueSeries,
  getPeakHours,
  getPrepTimeSeries,
  getTopFoodsToday
};
