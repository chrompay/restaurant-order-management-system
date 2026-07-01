import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '../components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ScrollArea } from '../components/ui/scroll-area';
import { Search, Filter, Calendar, LayoutGrid, List, MoreHorizontal, Clock, ShoppingBag, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

// Mock Data
const MOCK_ORDERS = [
  { id: '#1049', customer: 'Sarah Jenkins', items: 3, date: 'Today, 10:45 AM', time: '10:45 AM', prepTime: '4m', price: 42.50, status: 'Pending', priority: 'High', phone: '+1 555-0100', address: '123 Tech Blvd' },
  { id: '#1050', customer: 'Mike Chen', items: 1, date: 'Today, 10:48 AM', time: '10:48 AM', prepTime: '1m', price: 18.00, status: 'Pending', priority: 'Normal', phone: '+1 555-0101', address: '456 River Rd' },
  { id: '#1042', customer: 'Emma Watson', items: 4, date: 'Today, 10:35 AM', time: '10:35 AM', prepTime: '14m', price: 65.20, status: 'Confirmed', priority: 'Normal', phone: '+1 555-0102', address: '789 Pine St' },
  { id: '#1041', customer: 'Alex Rodriguez', items: 2, date: 'Today, 10:30 AM', time: '10:30 AM', prepTime: '19m', price: 28.50, status: 'Preparing', priority: 'High', phone: '+1 555-0103', address: '321 Elm St' },
  { id: '#1039', customer: 'David Kim', items: 2, date: 'Today, 10:15 AM', time: '10:15 AM', prepTime: '34m', price: 32.00, status: 'Out For Delivery', priority: 'Normal', phone: '+1 555-0104', address: '654 Oak Ave' },
  { id: '#1035', customer: 'Tom Hardy', items: 3, date: 'Today, 09:45 AM', time: '09:45 AM', prepTime: '64m', price: 54.00, status: 'Delivered', priority: 'Normal', phone: '+1 555-0105', address: '987 Cedar Ln' },
];

const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Confirmed': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Preparing': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Out For Delivery': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
};

const KANBAN_COLUMNS = ['Pending', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered'];

export default function Orders() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = MOCK_ORDERS.filter(o => 
    o.customer.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const renderKanban = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] items-start">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = filteredOrders.filter(o => o.status === col);
        return (
          <div key={col} className="flex flex-col flex-none w-[320px] bg-muted/20 rounded-xl border border-border/50 h-full overflow-hidden">
            <div className="p-3 border-b border-border/50 bg-muted/40 flex justify-between items-center">
              <h3 className="font-semibold text-sm">{col}</h3>
              <Badge variant="secondary" className={`${STATUS_COLORS[col]} border py-0 text-xs`}>{colOrders.length}</Badge>
            </div>
            <ScrollArea className="flex-1 p-3">
              {colOrders.map(order => (
                <Card key={order.id} className="p-3 mb-3 shadow-sm hover:border-primary/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{order.id}</span>
                    {order.priority === 'High' && <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-semibold">High</Badge>}
                  </div>
                  <div className="text-sm font-medium">{order.customer}</div>
                  <div className="text-xs text-muted-foreground mb-3">{order.items} items • ${order.price.toFixed(2)}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1"/>{order.prepTime}</span>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </div>
        )
      })}
    </div>
  );

  const renderTable = () => (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order)}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {order.id}
                  {order.priority === 'High' && <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-semibold">High</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={`${STATUS_COLORS[order.status]} border py-0 text-xs`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.items} items</TableCell>
              <TableCell className="text-right font-medium">${order.price.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all restaurant orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button>Create Order</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders or customers..." className="pl-8 bg-background" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] bg-background"><Filter className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[140px] bg-background"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'kanban')} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-[120px] grid-cols-2">
            <TabsTrigger value="table"><List className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="kanban"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'table' ? renderTable() : renderKanban()}

      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl">{selectedOrder.id}</SheetTitle>
                    <SheetDescription>Placed at {selectedOrder.time}</SheetDescription>
                  </div>
                  <Badge variant="secondary" className={`${STATUS_COLORS[selectedOrder.status]} border`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* Timeline Progress */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><CheckCircle2 className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order Placed</p>
                        <p className="text-xs text-muted-foreground">10:45 AM</p>
                      </div>
                    </div>
                    <div className="w-0.5 h-4 bg-border ml-4"></div>
                    <div className={`flex items-center gap-3 ${selectedOrder.status === 'Pending' ? 'opacity-50' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${selectedOrder.status === 'Pending' ? 'bg-muted border border-border text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Preparing</p>
                        {selectedOrder.status !== 'Pending' && <p className="text-xs text-muted-foreground">Started at 10:50 AM</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Customer Details</h4>
                  <Card>
                    <CardContent className="p-4 grid gap-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedOrder.customer}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedOrder.phone}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{selectedOrder.address}</span></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Snapshot Pricing & Items */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
                  <Card>
                    <CardContent className="p-0 divide-y">
                      {Array.from({length: selectedOrder.items}).map((_, i) => (
                        <div key={i} className="flex justify-between p-4 text-sm">
                          <span className="font-medium">1x Item Name Placeholder</span>
                          <span>${(selectedOrder.price / selectedOrder.items).toFixed(2)}</span>
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-4 bg-muted/10 border-t space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${(selectedOrder.price - 5).toFixed(2)}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>Tax & Fees</span><span>$5.00</span></div>
                      <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t"><span>Total</span><span>${selectedOrder.price.toFixed(2)}</span></div>
                    </div>
                  </Card>
                </div>
              </div>

              <SheetFooter className="mt-8 flex-col sm:flex-col gap-2">
                <Button className="w-full">Update Status</Button>
                <Button variant="outline" className="w-full">Print Receipt</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}