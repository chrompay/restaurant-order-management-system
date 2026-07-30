import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  Bar, BarChart, Line, LineChart, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Download, Calendar, Banknote, Users, Clock, ShoppingBag, Lightbulb,
  CreditCard, ArrowDownRight, Utensils, UserCheck, UserMinus, Target, CheckCircle2, AlertCircle, ArrowUpRight, Crown, UserPlus
} from 'lucide-react';

import { useOverviewAnalytics } from '@/features/analytics/hooks/useOverviewAnalytics';
import { useSalesAnalytics } from '@/features/analytics/hooks/useSalesAnalytics';
import { useKitchenAnalytics } from '@/features/analytics/hooks/useKitchenAnalytics';
import { useCustomerAnalytics } from '@/features/analytics/hooks/useCustomerAnalytics';
import { zipRevenueComparison } from '@/features/analytics/lib/seriesHelpers';
import { formatHourLabel } from '@/features/dashboard/lib/fillHours';
import type { AnalyticsRange, DeltaMetric } from '@/features/analytics/types/analytics.types';
import { formatCurrency } from '@/lib/currency';
import { exportToCsv } from '@/lib/exportCsv';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

function DeltaText({ metric, invert = false, suffix = '' }: { metric: DeltaMetric; invert?: boolean; suffix?: string }) {
  const positive = invert ? metric.deltaPct <= 0 : metric.deltaPct >= 0;
  const Icon = metric.deltaPct >= 0 ? TrendingUp : TrendingDown;
  return (
    <p className={`text-xs flex items-center mt-1 font-medium ${positive ? 'text-emerald-500' : 'text-destructive'}`}>
      <Icon className="h-3 w-3 mr-1" /> {metric.deltaPct > 0 ? '+' : ''}{metric.deltaPct}{suffix} <span className="text-muted-foreground ml-1 font-normal">from last period</span>
    </p>
  );
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState<AnalyticsRange>('7d');

  const { data: overviewData, isLoading: overviewLoading } = useOverviewAnalytics(dateRange);
  const { data: salesData, isLoading: salesLoading } = useSalesAnalytics(dateRange);
  const { data: kitchenData, isLoading: kitchenLoading } = useKitchenAnalytics(dateRange);
  const { data: customersData, isLoading: customersLoading } = useCustomerAnalytics(dateRange);

  const overview = overviewData?.data;
  const sales = salesData?.data;
  const kitchen = kitchenData?.data;
  const customers = customersData?.data;

  const handleExport = () => {
    if (!overview) return;
    exportToCsv(`analytics-overview-${dateRange}.csv`, [{
      range: dateRange,
      totalRevenue: overview.revenue.current.toFixed(2),
      totalOrders: overview.orders.current,
      avgPrepMinutes: overview.avgPrepMinutes.current,
      activeCustomers: overview.activeCustomers.current,
    }]);
  };

  const revenueComparison = overview
    ? zipRevenueComparison(overview.revenueSeries.current, overview.revenueSeries.prior, dateRange)
    : [];

  const peakHoursLabeled = (overview?.peakHours ?? []).map((p) => ({ hour: formatHourLabel(p.hour), orders: p.volume }));
  const hourlySalesLabeled = (sales?.hourlySales ?? []).map((p) => ({ hour: formatHourLabel(p.hour), orders: p.revenue }));

  const segmentIcons = {
    VIP: { Icon: Crown, color: 'text-amber-500', bar: 'bg-amber-500' },
    Regular: { Icon: Users, color: 'text-primary', bar: 'bg-primary' },
    New: { Icon: UserPlus, color: 'text-emerald-500', bar: 'bg-emerald-500' },
  } as const;

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Detailed performance metrics and operational insights.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as AnalyticsRange)}>
            <SelectTrigger className="w-[160px] h-9">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport} disabled={!overview}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {overviewLoading || !overview ? (
            <div className="text-center text-muted-foreground py-12">Loading overview...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(overview.revenue.current)}</div>
                    <DeltaText metric={overview.revenue} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview.orders.current.toLocaleString()}</div>
                    <DeltaText metric={overview.orders} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview.avgPrepMinutes.current}m</div>
                    <DeltaText metric={overview.avgPrepMinutes} invert suffix="%" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview.activeCustomers.current.toLocaleString()}</div>
                    <DeltaText metric={overview.activeCustomers} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue vs. Last Period</CardTitle>
                    <CardDescription>Daily revenue comparison over the selected time range.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                        <AreaChart data={revenueComparison} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                          <XAxis key="xaxis" dataKey="label" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}`} />
                          <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} formatter={(v: number) => formatCurrency(v)} />
                          <Area key="area-rev" type="monotone" dataKey="revenue" name="Current" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                          <Area key="area-last" type="monotone" dataKey="lastPeriod" name="Previous" stroke="var(--muted-foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorLast)" strokeDasharray="5 5" />
                          <Legend key="legend" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-amber-500" /> Business Insights</CardTitle>
                    <CardDescription>Automatically generated from this period's data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {overview.insights.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Not enough data yet to generate insights.</p>
                    ) : (
                      overview.insights.map((insight, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-1 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${insight.type === 'positive' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                            <h4 className="font-semibold text-sm">{insight.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground pl-4">{insight.desc}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Peak Kitchen Hours</CardTitle>
                    <CardDescription>Order volume distributed by hour</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                        <BarChart data={peakHoursLabeled} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <XAxis key="xaxis" dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip key="tooltip" cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                          <Bar key="bar" dataKey="orders" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                    <CardDescription>Breakdown of orders by current status</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    {overview.statusDistribution.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8">No orders in this period.</p>
                    ) : (
                      <>
                        <div className="h-[220px] w-full">
                          <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                            <PieChart>
                              <Pie key="pie" data={overview.statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                {overview.statusDistribution.map((entry, index) => (
                                  <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4">
                          {overview.statusDistribution.map((stat, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span>{stat.name}</span>
                              </div>
                              <span className="font-semibold">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Foods</CardTitle>
                    <CardDescription>Highest revenue generating menu items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overview.topFoods.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sales in this period.</p>
                    ) : (
                      <div className="space-y-4">
                        {overview.topFoods.map((food, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-colors">
                            <div>
                              <p className="font-medium text-sm">{food.name}</p>
                              <p className="text-xs text-muted-foreground">{food.sales} units sold</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{formatCurrency(food.revenue)}</p>
                              <p className={`text-xs font-medium ${food.growthPct === null ? 'text-primary' : food.growthPct >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                                {food.growthPct === null ? 'New' : `${food.growthPct > 0 ? '+' : ''}${food.growthPct}%`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>New vs Returning customers over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overview.customerGrowth.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Not enough data yet.</p>
                    ) : (
                      <div className="h-[280px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                          <LineChart data={overview.customerGrowth} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis key="xaxis" dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                            <Legend key="legend" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line key="line-new" type="monotone" dataKey="new" name="New Customers" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line key="line-returning" type="monotone" dataKey="returning" name="Returning" stroke="var(--emerald-500)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          {salesLoading || !sales ? (
            <div className="text-center text-muted-foreground py-12">Loading sales analytics...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gross Sales</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(sales.grossSales.current)}</div>
                    <DeltaText metric={sales.grossSales} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(sales.netSales.current)}</div>
                    <DeltaText metric={sales.netSales} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Discounts & Refunds</CardTitle>
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(sales.discounts.current)}</div>
                    <DeltaText metric={sales.discounts} invert />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Ticket Size</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(sales.avgTicketSize.current)}</div>
                    <DeltaText metric={sales.avgTicketSize} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Revenue breakdown across menu categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sales.categoryBreakdown.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8 text-center">No sales in this period.</p>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                          <PieChart>
                            <Pie key="pie-sales-cat" data={sales.categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                              {sales.categoryBreakdown.map((entry, index) => (
                                <Cell key={`pie-sales-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip key="tooltip-sales-cat" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} formatter={(v: number) => formatCurrency(v)} />
                            <Legend key="legend-sales-cat" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Sales</CardTitle>
                    <CardDescription>Revenue distribution throughout the day, this period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                        <AreaChart data={hourlySalesLabeled} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--emerald-500)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--emerald-500)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid key="grid-sales" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                          <XAxis key="xaxis-sales" dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis key="yaxis-sales" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip key="tooltip-sales" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} formatter={(v: number) => formatCurrency(v)} />
                          <Area key="area-sales" type="monotone" dataKey="orders" stroke="var(--emerald-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Kitchen Tab */}
        <TabsContent value="kitchen" className="space-y-6">
          {kitchenLoading || !kitchen ? (
            <div className="text-center text-muted-foreground py-12">Loading kitchen analytics...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchen.avgPrepMinutes.current}m</div>
                    <DeltaText metric={kitchen.avgPrepMinutes} invert suffix="%" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Completion</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchen.onTimePct.current}%</div>
                    <DeltaText metric={kitchen.onTimePct} suffix="%" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Late Orders</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">{kitchen.latePct.current}%</div>
                    <DeltaText metric={kitchen.latePct} invert suffix="%" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Target Prep Time</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchen.targetPrepMinutes.toFixed(1)}m</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
                      Global benchmark
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Prep Time vs Target</CardTitle>
                    <CardDescription>Daily average preparation time compared to target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {kitchen.prepTimeSeries.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8 text-center">No delivered orders in this period.</p>
                    ) : (
                      <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                          <LineChart data={kitchen.prepTimeSeries.map((p) => ({ ...p, targetTime: kitchen.targetPrepMinutes }))} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid key="grid-kitchen" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis key="xaxis-kitchen" dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis key="yaxis-kitchen" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip key="tooltip-kitchen" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                            <Legend key="legend-kitchen" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line key="line-prep" type="monotone" dataKey="avgPrep" name="Actual Prep Time" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} />
                            <Line key="line-target" type="monotone" dataKey="targetTime" name="Target Time" stroke="var(--destructive)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Station Load</CardTitle>
                    <CardDescription>Order volume distribution across kitchen stations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {kitchen.stationLoad.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8 text-center">No orders in this period.</p>
                    ) : (
                      <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                          <BarChart data={kitchen.stationLoad} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid key="grid-station" strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis key="xaxis-station" type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis key="yaxis-station" dataKey="station" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip key="tooltip-station" cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                            <Bar key="bar-station" dataKey="orders" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32}>
                              {kitchen.stationLoad.map((entry, index) => (
                                <Cell key={`bar-station-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          {customersLoading || !customers ? (
            <div className="text-center text-muted-foreground py-12">Loading customer analytics...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customers.activeCustomers.current.toLocaleString()}</div>
                    <DeltaText metric={customers.activeCustomers} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Returning Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customers.returningRate.current}%</div>
                    <DeltaText metric={customers.returningRate} suffix="%" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Churn Rate</CardTitle>
                    <UserMinus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customers.churnRatePct}%</div>
                    <p className="text-xs text-muted-foreground mt-1">of last period's customers who haven't returned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(customers.avgLifetimeValue.current)}</div>
                    <DeltaText metric={customers.avgLifetimeValue} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth & Retention</CardTitle>
                    <CardDescription>New customer acquisition vs retention over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {customers.customerGrowth.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8 text-center">Not enough data yet.</p>
                    ) : (
                      <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                          <AreaChart data={customers.customerGrowth} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--emerald-500)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--emerald-500)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid key="grid-cust" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis key="xaxis-cust" dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis key="yaxis-cust" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip key="tooltip-cust" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                            <Legend key="legend-cust" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Area key="area-new" type="monotone" dataKey="new" stackId="1" name="New Customers" stroke="var(--primary)" fill="url(#colorNew)" />
                            <Area key="area-returning" type="monotone" dataKey="returning" stackId="1" name="Returning Customers" stroke="var(--emerald-500)" fill="url(#colorReturning)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Segments</CardTitle>
                    <CardDescription>Breakdown of active customers by tier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {customers.segments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No active customers in this period.</p>
                    ) : (
                      <div className="space-y-6 mt-4">
                        {customers.segments.map((segment) => {
                          const { Icon, color, bar } = segmentIcons[segment.tier];
                          return (
                            <div key={segment.tier} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} /> {segment.tier}</span>
                                <span>{segment.pct}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full ${bar}`} style={{ width: `${segment.pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
