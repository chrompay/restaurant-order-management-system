import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  Bar, BarChart, Line, LineChart, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Download, Calendar, DollarSign, Users, Clock, ShoppingBag, Lightbulb, 
  CreditCard, ArrowDownRight, Percent, Utensils, UserCheck, UserMinus, Target, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';

// --- MOCK DATA ---
const REVENUE_DATA = [
  { date: 'Mon', revenue: 2400, lastWeek: 2100 }, { date: 'Tue', revenue: 1398, lastWeek: 1800 },
  { date: 'Wed', revenue: 3800, lastWeek: 3200 }, { date: 'Thu', revenue: 3908, lastWeek: 3500 },
  { date: 'Fri', revenue: 4800, lastWeek: 4100 }, { date: 'Sat', revenue: 5800, lastWeek: 5200 },
  { date: 'Sun', revenue: 6300, lastWeek: 5800 },
];

const SALES_BY_CATEGORY = [
  { name: 'Burgers', value: 4500 },
  { name: 'Pizza', value: 3800 },
  { name: 'Salads', value: 1200 },
  { name: 'Drinks', value: 2100 },
  { name: 'Desserts', value: 900 },
];

const KITCHEN_PERFORMANCE = [
  { day: 'Mon', prepTime: 14.2, targetTime: 15 },
  { day: 'Tue', prepTime: 13.8, targetTime: 15 },
  { day: 'Wed', prepTime: 15.4, targetTime: 15 },
  { day: 'Thu', prepTime: 14.9, targetTime: 15 },
  { day: 'Fri', prepTime: 16.2, targetTime: 15 },
  { day: 'Sat', prepTime: 17.5, targetTime: 15 },
  { day: 'Sun', prepTime: 16.8, targetTime: 15 },
];

const STATION_LOAD = [
  { station: 'Grill', orders: 420 },
  { station: 'Fryer', orders: 380 },
  { station: 'Salad', orders: 150 },
  { station: 'Drinks', orders: 290 },
  { station: 'Dessert', orders: 110 },
];

const PEAK_HOURS = [
  { hour: '11am', orders: 45 }, { hour: '12pm', orders: 110 }, { hour: '1pm', orders: 95 },
  { hour: '2pm', orders: 60 }, { hour: '3pm', orders: 40 }, { hour: '4pm', orders: 30 },
  { hour: '5pm', orders: 75 }, { hour: '6pm', orders: 130 }, { hour: '7pm', orders: 155 },
  { hour: '8pm', orders: 140 }, { hour: '9pm', orders: 85 },
];

const STATUS_DISTRIBUTION = [
  { name: 'Delivered', value: 65, color: 'var(--emerald-500)' },
  { name: 'Canceled', value: 5, color: 'var(--destructive)' },
  { name: 'Refunded', value: 2, color: 'var(--amber-500)' },
];

const CUSTOMER_GROWTH = [
  { month: 'Jan', new: 400, returning: 240 }, { month: 'Feb', new: 300, returning: 398 },
  { month: 'Mar', new: 200, returning: 480 }, { month: 'Apr', new: 278, returning: 390 },
  { month: 'May', new: 189, returning: 480 }, { month: 'Jun', new: 239, returning: 380 },
];

const TOP_FOODS = [
  { name: 'Truffle Burger', sales: 456, revenue: 8208, growth: '+12%' },
  { name: 'Margherita Pizza', sales: 389, revenue: 8558, growth: '+8%' },
  { name: 'Spicy Chicken Sandwich', sales: 345, revenue: 4830, growth: '+15%' },
  { name: 'Sweet Potato Fries', sales: 312, revenue: 2028, growth: '+5%' },
  { name: 'Iced Matcha Latte', sales: 289, revenue: 1734, growth: '+22%' },
];

const INSIGHTS = [
  { title: 'Revenue Peak', desc: 'Saturday at 7 PM consistently drives the highest revenue.', type: 'positive' },
  { title: 'Underperforming Item', desc: 'Vegan Wrap sales dropped 15% this week.', type: 'negative' },
  { title: 'Preparation Time', desc: 'Average prep time decreased by 2 mins (14% improvement).', type: 'positive' },
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Detailed performance metrics and operational insights.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
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
          <Button variant="outline" size="sm" className="h-9">
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

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$28,406.00</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" /> +14.5% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" /> +8.2% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4m</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> -2.1m <span className="text-muted-foreground ml-1 font-normal">faster</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">892</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts Row */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Revenue Dashboard */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue vs. Last Period</CardTitle>
                <CardDescription>Daily revenue comparison over the selected time range.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
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
                      <XAxis key="xaxis" dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} />
                      <Area key="area-rev" type="monotone" dataKey="revenue" name="Current" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                      <Area key="area-last" type="monotone" dataKey="lastWeek" name="Previous" stroke="var(--muted-foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorLast)" strokeDasharray="5 5" />
                      <Legend key="legend" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Business Insights */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-amber-500" /> Business Insights</CardTitle>
                <CardDescription>AI-generated operational observations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {INSIGHTS.map((insight, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-1 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${insight.type === 'positive' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground pl-4">{insight.desc}</p>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm mt-2">View All Insights</Button>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Peak Kitchen Hours */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Peak Kitchen Hours</CardTitle>
                <CardDescription>Order volume distributed by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <BarChart data={PEAK_HOURS} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <XAxis key="xaxis" dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip key="tooltip" cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Bar key="bar" dataKey="orders" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.8} >
                        {PEAK_HOURS.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.orders > 100 ? 'var(--primary)' : 'var(--primary)'} opacity={entry.orders > 100 ? 1 : 0.4} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Breakdown of completed vs failed orders</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <PieChart>
                      <Pie
                        key="pie"
                        data={STATUS_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {STATUS_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-2 mt-4">
                  {STATUS_DISTRIBUTION.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span>{stat.name}</span>
                      </div>
                      <span className="font-semibold">{stat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Tables Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Selling Foods */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Foods</CardTitle>
                <CardDescription>Highest revenue generating menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TOP_FOODS.map((food, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-colors">
                      <div>
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.sales} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${food.revenue.toLocaleString()}</p>
                        <p className="text-xs text-emerald-500 font-medium">{food.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New vs Returning customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <LineChart data={CUSTOMER_GROWTH} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
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
              </CardContent>
            </Card>
          </div>

        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32,450.00</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +15.2% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$28,406.00</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +14.5% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discounts & Refunds</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,044.00</div>
                <p className="text-xs text-destructive flex items-center mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2.4% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Ticket Size</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$34.50</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +$2.10 <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
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
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <PieChart>
                      <Pie
                        key="pie-sales-cat"
                        data={SALES_BY_CATEGORY}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {SALES_BY_CATEGORY.map((entry, index) => (
                          <Cell key={`pie-sales-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip key="tooltip-sales-cat" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} formatter={(v: number) => `$${v}`} />
                      <Legend key="legend-sales-cat" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Sales Heatmap</CardTitle>
                <CardDescription>Revenue distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <AreaChart data={PEAK_HOURS} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--emerald-500)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--emerald-500)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid key="grid-sales" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis key="xaxis-sales" dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="yaxis-sales" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip key="tooltip-sales" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Area key="area-sales" type="monotone" dataKey="orders" stroke="var(--emerald-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kitchen Tab */}
        <TabsContent value="kitchen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4m</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> -2.1m <span className="text-muted-foreground ml-1 font-normal">faster than target</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Completion</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +1.8% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late Orders</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">5.8%</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> -1.2% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Target Prep Time</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.0m</div>
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
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <LineChart data={KITCHEN_PERFORMANCE} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid key="grid-kitchen" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis key="xaxis-kitchen" dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="yaxis-kitchen" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip key="tooltip-kitchen" contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Legend key="legend-kitchen" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line key="line-prep" type="monotone" dataKey="prepTime" name="Actual Prep Time" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} />
                      <Line key="line-target" type="monotone" dataKey="targetTime" name="Target Time" stroke="var(--destructive)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Station Load</CardTitle>
                <CardDescription>Order volume distribution across kitchen stations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <BarChart data={STATION_LOAD} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid key="grid-station" strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis key="xaxis-station" type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="yaxis-station" dataKey="station" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip key="tooltip-station" cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Bar key="bar-station" dataKey="orders" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32}>
                        {STATION_LOAD.map((entry, index) => (
                          <Cell key={`bar-station-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,492</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returning Rate</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +4.2% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Churn Rate</CardTitle>
                <UserMinus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2%</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> -0.8% <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$245.80</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +$18.50 <span className="text-muted-foreground ml-1 font-normal">from last period</span>
                </p>
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
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <AreaChart data={CUSTOMER_GROWTH} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customer Demographics</CardTitle>
                <CardDescription>Breakdown by customer segment and frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-2"><Utensils className="w-4 h-4 text-primary" /> Dine-In Regulars</span>
                      <span>45%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-emerald-500" /> Takeout Enthusiasts</span>
                      <span>35%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Occasional Diners</span>
                      <span>15%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-2"><UserMinus className="w-4 h-4 text-destructive" /> At-Risk Customers</span>
                      <span>5%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: '5%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}