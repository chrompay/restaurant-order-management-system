import { useNavigate, Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  ArrowUpRight, TrendingUp, TrendingDown, Banknote, ShoppingBag, Users, Clock,
  Plus, FileText, Utensils, AlertCircle
} from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart, CartesianGrid, Line, LineChart
} from 'recharts';

import { useDashboardKpis } from '@/features/dashboard/hooks/useDashboardKpis';
import { useRevenueSeries } from '@/features/dashboard/hooks/useRevenueSeries';
import { usePeakHours } from '@/features/dashboard/hooks/usePeakHours';
import { usePrepTimeSeries } from '@/features/dashboard/hooks/usePrepTimeSeries';
import { useTopFoods } from '@/features/dashboard/hooks/useTopFoods';
import { fillHourSeries, formatHourLabel } from '@/features/dashboard/lib/fillHours';
import { useOrders } from '@/features/orders/hooks/useOrders';
import OrderKanban from '@/features/orders/components/OrderKanban';
import { formatOrderId, getCustomerName } from '@/features/orders/lib/orderDisplay';
import { formatCurrency } from '@/lib/currency';
import { exportToCsv } from '@/lib/exportCsv';

function DeltaBadge({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <p className={`text-xs flex items-center mt-1 font-medium ${positive ? 'text-emerald-500' : 'text-destructive'}`}>
      {positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {positive ? '+' : ''}{pct}% <span className="text-muted-foreground ml-1 font-normal">vs yesterday</span>
    </p>
  );
}

function KPICards() {
  const { data, isLoading } = useDashboardKpis();
  const kpis = data?.data;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : formatCurrency(kpis?.revenueToday ?? 0)}</div>
          {!isLoading && kpis && <DeltaBadge pct={kpis.revenueDeltaPct} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : kpis?.ordersToday}</div>
          {!isLoading && kpis && <DeltaBadge pct={kpis.ordersDeltaPct} />}
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{isLoading ? '—' : kpis?.pendingOrders}</div>
          <p className="text-xs text-amber-600/80 mt-1 font-medium">
            Requires immediate action
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kitchen Queue</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : kpis?.kitchenQueueCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? ' ' : `Waiting avg ${kpis?.kitchenAvgWaitMinutes}m so far`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customers Today</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : kpis?.customersToday}</div>
          {!isLoading && kpis && <DeltaBadge pct={kpis.customersDeltaPct} />}
        </CardContent>
      </Card>
    </div>
  );
}

function LiveKanbanBoard() {
  const navigate = useNavigate();
  const { data, isLoading } = useOrders({ limit: 100 });
  const orders = data?.data ?? [];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Live Orders Board</h2>
          <p className="text-sm text-muted-foreground">Real-time order flow and kitchen status</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">Live updates active</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading orders...</div>
      ) : (
        <OrderKanban orders={orders} onSelectOrder={() => navigate('/operations/orders')} />
      )}
    </div>
  );
}

function AnalyticsGrid() {
  const { data: revenueData } = useRevenueSeries();
  const { data: peakHoursData } = usePeakHours();
  const { data: prepTimeData } = usePrepTimeSeries();
  const { data: topFoodsData } = useTopFoods();

  const revenueSeries = fillHourSeries(revenueData?.data ?? [], 'revenue').map((p) => ({
    time: formatHourLabel(p.hour),
    revenue: p.revenue,
  }));

  const peakHoursSeries = fillHourSeries(peakHoursData?.data ?? [], 'volume').map((p) => ({
    hour: formatHourLabel(p.hour),
    volume: p.volume,
  }));

  const prepTimeSeries = fillHourSeries(prepTimeData?.data ?? [], 'avgPrep').map((p) => ({
    time: formatHourLabel(p.hour),
    avgPrep: p.avgPrep,
  }));

  const topFoods = topFoodsData?.data ?? [];
  const maxSales = Math.max(1, ...topFoods.map((f) => f.sales));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Revenue Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue & Order Volume</CardTitle>
          <CardDescription>Today's revenue by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs key="defs">
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1" key="gradient">
                    <stop key="stop1" offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop key="stop2" offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis key="xaxis" dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value}`} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area key="area" type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Foods */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Top Selling Foods</CardTitle>
          <CardDescription>By total order volume today</CardDescription>
        </CardHeader>
        <CardContent>
          {topFoods.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet today.</p>
          ) : (
            <div className="space-y-5">
              {topFoods.map((food) => (
                <div key={food.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{food.name}</span>
                    <span className="text-sm text-muted-foreground">{food.sales} sold</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(food.sales / maxSales) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="ghost" className="w-full mt-6 text-sm" asChild>
            <Link to="/menu/foods">
              View full menu report <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Kitchen Performance */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Kitchen Performance</CardTitle>
          <CardDescription>Avg. minutes from order placed to delivered, per hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepTimeSeries} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis key="xaxis" dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line key="line" type="monotone" dataKey="avgPrep" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Peak Kitchen Hours</CardTitle>
          <CardDescription>Order volume by hour, today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursSeries} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <XAxis key="xaxis" dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  key="tooltip"
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar key="bar" dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecentActivityGrid() {
  const { data: recentData } = useOrders({ limit: 5, sort: '-createdAt' });
  const { data: activityData } = useOrders({ limit: 8, sort: '-updatedAt' });

  const recentOrders = recentData?.data ?? [];
  const activities = activityData?.data ?? [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest activity from the queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{getCustomerName(order)}</p>
                    <p className="text-xs text-muted-foreground">{formatOrderId(order._id)} &bull; {order.status}</p>
                  </div>
                  <div className="font-medium text-sm">{formatCurrency(order.totalAmount)}</div>
                </div>
              ))
            )}
          </div>
          <Button variant="ghost" className="w-full mt-6 text-sm" asChild>
            <Link to="/operations/orders">
              View all orders <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Recent order status changes</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="relative border-l border-border ml-3 space-y-6">
              {activities.map((order) => (
                <div key={order._id} className="relative pl-6">
                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium leading-snug">
                    Order {formatOrderId(order._id)} marked as {order.status}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: recentData } = useOrders({ limit: 100 });

  const handleExport = () => {
    const orders = recentData?.data ?? [];
    exportToCsv(
      `dashboard-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      orders.map((order) => ({
        id: formatOrderId(order._id),
        customer: getCustomerName(order),
        status: order.status,
        total: order.totalAmount.toFixed(2),
        placedAt: order.createdAt,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pb-8">
      {/* Header & Quick Action Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Operational control center for today's service.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="h-9" onClick={() => navigate('/operations/orders')}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        </div>
      </div>

      <KPICards />
      <LiveKanbanBoard />
      <AnalyticsGrid />
      <RecentActivityGrid />
    </div>
  );
}
