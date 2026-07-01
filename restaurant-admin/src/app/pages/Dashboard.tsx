import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Link } from 'react-router';
import {
  ArrowUpRight, TrendingUp, DollarSign, ShoppingBag, Users, Clock,
  MoreHorizontal, PauseCircle, Plus, FileText, Activity, Utensils, AlertCircle
} from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart, CartesianGrid, Line, LineChart
} from 'recharts';

// --- MOCK DATA ---
const REVENUE_DATA = [
  { time: '08:00', revenue: 120 }, { time: '10:00', revenue: 450 },
  { time: '12:00', revenue: 1200 }, { time: '14:00', revenue: 850 },
  { time: '16:00', revenue: 500 }, { time: '18:00', revenue: 1600 },
  { time: '20:00', revenue: 2100 }, { time: '22:00', revenue: 900 },
];

const PEAK_HOURS_DATA = [
  { hour: '11am', volume: 45 }, { hour: '12pm', volume: 110 },
  { hour: '1pm', volume: 95 }, { hour: '2pm', volume: 60 },
  { hour: '3pm', volume: 40 }, { hour: '4pm', volume: 30 },
  { hour: '5pm', volume: 75 }, { hour: '6pm', volume: 130 },
];

const PERFORMANCE_DATA = [
  { time: '11am', avgPrep: 12 }, { time: '12pm', avgPrep: 18 },
  { time: '1pm', avgPrep: 15 }, { time: '2pm', avgPrep: 13 },
  { time: '3pm', avgPrep: 10 }, { time: '4pm', avgPrep: 10 },
  { time: '5pm', avgPrep: 14 }, { time: '6pm', avgPrep: 22 },
];

const TOP_FOODS = [
  { name: 'Truffle Burger', sales: 145, max: 150 },
  { name: 'Spicy Chicken Sandwich', sales: 112, max: 150 },
  { name: 'Sweet Potato Fries', sales: 98, max: 150 },
  { name: 'Margherita Pizza', sales: 85, max: 150 },
  { name: 'Vegan Wrap', sales: 64, max: 150 },
];

const KANBAN_ORDERS = [
  { id: '#1049', customer: 'Sarah Jenkins', items: 3, time: '10:45 AM', prepTime: '4m', price: 42.50, status: 'Pending', priority: 'High' },
  { id: '#1050', customer: 'Mike Chen', items: 1, time: '10:48 AM', prepTime: '1m', price: 18.00, status: 'Pending', priority: 'Normal' },
  { id: '#1051', customer: 'Liam Neeson', items: 2, time: '10:50 AM', prepTime: '0m', price: 24.50, status: 'Pending', priority: 'Normal' },
  { id: '#1042', customer: 'Emma Watson', items: 4, time: '10:35 AM', prepTime: '14m', price: 65.20, status: 'Confirmed', priority: 'Normal' },
  { id: '#1043', customer: 'Noah Smith', items: 1, time: '10:38 AM', prepTime: '11m', price: 12.00, status: 'Confirmed', priority: 'Normal' },
  { id: '#1041', customer: 'Alex Rodriguez', items: 2, time: '10:30 AM', prepTime: '19m', price: 28.50, status: 'Preparing', priority: 'High' },
  { id: '#1040', customer: 'Jessica Taylor', items: 5, time: '10:25 AM', prepTime: '24m', price: 85.00, status: 'Preparing', priority: 'Normal' },
  { id: '#1039', customer: 'David Kim', items: 2, time: '10:15 AM', prepTime: '34m', price: 32.00, status: 'Out For Delivery', priority: 'Normal' },
  { id: '#1038', customer: 'Rachel Green', items: 1, time: '10:10 AM', prepTime: '39m', price: 15.50, status: 'Out For Delivery', priority: 'Normal' },
  { id: '#1035', customer: 'Tom Hardy', items: 3, time: '09:45 AM', prepTime: '64m', price: 54.00, status: 'Delivered', priority: 'Normal' },
  { id: '#1034', customer: 'Zendaya', items: 2, time: '09:40 AM', prepTime: '69m', price: 41.00, status: 'Delivered', priority: 'Normal' },
];

const ACTIVITIES = [
  { id: 1, time: 'Just now', desc: 'Order #1049 marked as Pending', type: 'new' },
  { id: 2, time: '2m ago', desc: 'New online order #1050 received', type: 'new' },
  { id: 3, time: '5m ago', desc: 'Inventory alert: Truffle Oil running low', type: 'alert' },
  { id: 4, time: '12m ago', desc: 'Driver Mike returned to store', type: 'driver' },
  { id: 5, time: '15m ago', desc: 'Order #1035 delivered successfully', type: 'success' },
];

const KANBAN_COLUMNS = [
  { id: 'Pending', label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  { id: 'Confirmed', label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  { id: 'Preparing', label: 'Preparing', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  { id: 'Out For Delivery', label: 'Out For Delivery', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
  { id: 'Delivered', label: 'Delivered', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' }
];

// --- SUBCOMPONENTS ---

const KPICards = () => (
  <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$4,523.89</div>
        <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
          <TrendingUp className="h-3 w-3 mr-1" /> +20.1% <span className="text-muted-foreground ml-1 font-normal">vs yesterday</span>
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">142</div>
        <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
          <TrendingUp className="h-3 w-3 mr-1" /> +12% <span className="text-muted-foreground ml-1 font-normal">vs yesterday</span>
        </p>
      </CardContent>
    </Card>

    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
        <AlertCircle className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-amber-600">12</div>
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
        <div className="text-2xl font-bold">28</div>
        <p className="text-xs text-muted-foreground mt-1">
          Avg 14m preparation time
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Customers Today</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">124</div>
        <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
          <TrendingUp className="h-3 w-3 mr-1" /> +14% <span className="text-muted-foreground ml-1 font-normal">new customers</span>
        </p>
      </CardContent>
    </Card>
  </div>
);

const KanbanCard = ({ order }: { order: any }) => (
  <Card className="p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group mb-3">
    <div className="flex justify-between items-start mb-2">
      <span className="font-semibold text-sm">{order.id}</span>
      {order.priority === 'High' && (
        <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-semibold uppercase tracking-wider">
          High
        </Badge>
      )}
    </div>
    <div className="text-sm font-medium mb-0.5">{order.customer}</div>
    <div className="text-xs text-muted-foreground mb-3">{order.items} items • ${order.price.toFixed(2)}</div>
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center text-xs font-medium text-muted-foreground">
        <Clock className="w-3.5 h-3.5 mr-1" /> {order.prepTime}
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-3.5 h-3.5" />
      </Button>
    </div>
  </Card>
);

const LiveKanbanBoard = () => (
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
    
    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
      {KANBAN_COLUMNS.map((col) => {
        const columnOrders = KANBAN_ORDERS.filter(o => o.status === col.id);
        return (
          <div key={col.id} className="flex flex-col flex-none w-[320px] bg-muted/20 rounded-xl border border-border/50 h-[600px] overflow-hidden">
            <div className="p-3 border-b border-border/50 bg-muted/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color.split(' ')[0]}`} />
                <h3 className="font-semibold text-sm">{col.label}</h3>
              </div>
              <Badge variant="secondary" className={`${col.color} border py-0 text-xs`}>
                {columnOrders.length}
              </Badge>
            </div>
            <ScrollArea className="flex-1 p-3">
              {columnOrders.map(order => (
                <KanbanCard key={order.id} order={order} />
              ))}
              {columnOrders.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 pt-10">
                  <p className="text-sm">No orders</p>
                </div>
              )}
            </ScrollArea>
          </div>
        );
      })}
    </div>
  </div>
);

const AnalyticsGrid = () => (
  <div className="grid gap-6 md:grid-cols-3">
    {/* Revenue Chart */}
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue & Order Volume</CardTitle>
        <CardDescription>Daily revenue trends compared to typical volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs key="defs">
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1" key="gradient">
                  <stop key="stop1" offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop key="stop2" offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis key="xaxis" dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis key="yaxis" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                key="tooltip"
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                itemStyle={{ color: 'var(--foreground)' }}
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
        <div className="space-y-5">
          {TOP_FOODS.map((food, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{food.name}</span>
                <span className="text-sm text-muted-foreground">{food.sales} orders</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(food.sales / food.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-6 text-sm">
          View full menu report <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>

    {/* Kitchen Performance */}
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Kitchen Performance</CardTitle>
        <CardDescription>Average preparation time per hour (minutes)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PERFORMANCE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
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
        <CardDescription>Historical order volume by hour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PEAK_HOURS_DATA} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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

const RecentActivityGrid = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest activity from the queue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {KANBAN_ORDERS.slice(0, 5).map((order, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.time} • {order.status}</p>
              </div>
              <div className="font-medium text-sm">${order.price.toFixed(2)}</div>
            </div>
          ))}
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
        <CardDescription>System and operational logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-border ml-3 space-y-6">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
              <p className="text-sm font-medium leading-snug">{activity.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-6 text-sm">
          View full logs
        </Button>
      </CardContent>
    </Card>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-auto pb-8">
      {/* Header & Quick Action Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Operational control center for today's service.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <PauseCircle className="mr-2 h-4 w-4 text-amber-500" /> Pause Online
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileText className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="h-9">
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