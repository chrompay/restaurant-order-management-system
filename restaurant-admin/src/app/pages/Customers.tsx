import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter, Phone, Mail, MapPin, Star, Clock, ShoppingBag, TrendingUp, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

// Mock Data
const MOCK_CUSTOMERS = [
  { id: 'CUST-001', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 123-4567', address: '123 Tech Blvd, Suite 400', totalOrders: 42, totalSpent: 1245.50, joined: 'Jan 2023', lastOrder: 'Today', status: 'VIP', initials: 'SJ' },
  { id: 'CUST-002', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 (555) 987-6543', address: '456 River Rd, Apt 2B', totalOrders: 15, totalSpent: 420.00, joined: 'Mar 2023', lastOrder: 'Yesterday', status: 'Regular', initials: 'MC' },
  { id: 'CUST-003', name: 'Emma Watson', email: 'emma.w@example.com', phone: '+1 (555) 555-0102', address: '789 Pine St', totalOrders: 8, totalSpent: 310.20, joined: 'May 2023', lastOrder: 'Last Week', status: 'Regular', initials: 'EW' },
  { id: 'CUST-004', name: 'Alex Rodriguez', email: 'alex.r@example.com', phone: '+1 (555) 555-0103', address: '321 Elm St', totalOrders: 1, totalSpent: 28.50, joined: 'Today', lastOrder: 'Today', status: 'New', initials: 'AR' },
];

const FAVORITE_FOODS = [
  { name: 'Truffle Burger', orders: 15 },
  { name: 'Sweet Potato Fries', orders: 12 },
  { name: 'Iced Matcha Latte', orders: 8 }
];

const ORDER_HISTORY = [
  { id: '#1049', date: 'Today, 10:45 AM', items: 3, total: 42.50, status: 'Delivered' },
  { id: '#982', date: 'May 12, 14:20 PM', items: 2, total: 35.00, status: 'Delivered' },
  { id: '#845', date: 'Apr 28, 19:15 PM', items: 4, total: 68.20, status: 'Delivered' },
];

const ACTIVITIES = [
  { id: 1, type: 'order', text: 'Placed order #1049', time: 'Today, 10:45 AM' },
  { id: 2, type: 'review', text: 'Left a 5-star review', time: 'May 13, 09:00 AM' },
  { id: 3, type: 'support', text: 'Contacted support about delivery issue', time: 'Apr 28, 19:45 PM' },
];

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(MOCK_CUSTOMERS[0].id);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedId) || MOCK_CUSTOMERS[0];

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 pb-4 border-b bg-card">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customer CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer profiles and history</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-8 bg-background" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Master Pane */}
        <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col border-r bg-muted/20">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredCustomers.map(customer => (
                <div 
                  key={customer.id}
                  onClick={() => setSelectedId(customer.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedId === customer.id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted border border-transparent'}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={selectedId === customer.id ? 'bg-primary text-primary-foreground' : ''}>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{customer.name}</p>
                      {customer.status === 'VIP' && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Detail Pane */}
        <div className="hidden md:flex flex-col flex-1 bg-background overflow-hidden">
          <div className="p-6 border-b flex justify-between items-start bg-card">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 text-xl">
                <AvatarFallback>{selectedCustomer.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <Badge variant={selectedCustomer.status === 'VIP' ? 'default' : 'secondary'}>{selectedCustomer.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {selectedCustomer.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {selectedCustomer.phone}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Send Email</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Block Customer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Stats & Favs */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg">Customer Value</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 grid gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /> Total Spent</div>
                      <span className="font-semibold text-lg">${selectedCustomer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground"><ShoppingBag className="h-4 w-4" /> Total Orders</div>
                      <span className="font-medium">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Customer Since</div>
                      <span className="font-medium">{selectedCustomer.joined}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg">Favorite Foods</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {FAVORITE_FOODS.map((food, i) => (
                        <div key={i} className="p-4 flex justify-between items-center">
                          <span className="text-sm font-medium">{food.name}</span>
                          <Badge variant="secondary">{food.orders} orders</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm">{selectedCustomer.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Tabs for History & Timeline */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="history">
                  <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
                    <TabsTrigger value="history">Order History</TabsTrigger>
                    <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {ORDER_HISTORY.map((order, i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                              <div>
                                <p className="font-semibold text-primary cursor-pointer hover:underline">{order.id}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{order.date} • {order.items} items</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${order.total.toFixed(2)}</p>
                                <Badge variant="outline" className="mt-1 font-normal text-[10px] py-0">{order.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <Card>
                      <CardContent className="p-6">
                        <div className="relative border-l border-border ml-3 space-y-6">
                          {ACTIVITIES.map((activity) => (
                            <div key={activity.id} className="relative pl-6">
                              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                              <p className="text-sm font-medium leading-snug">{activity.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}