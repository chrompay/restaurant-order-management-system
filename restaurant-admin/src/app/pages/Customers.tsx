import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter, Phone, Mail, MapPin, Star, Clock, ShoppingBag, TrendingUp, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useCustomer } from '@/features/customers/hooks/useCustomer';
import { useToggleBlockCustomer } from '@/features/customers/hooks/useToggleBlockCustomer';
import { getCustomerInitials, getTierBadgeVariant } from '@/features/customers/lib/customerDisplay';
import type { CustomerTier } from '@/features/customers/types/customer.types';
import { formatOrderId } from '@/features/orders/lib/orderDisplay';
import { formatCurrency } from '@/lib/currency';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const TIER_OPTIONS: Array<CustomerTier | 'All'> = ['All', 'VIP', 'Regular', 'New'];

export default function Customers() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<CustomerTier | 'All'>('All');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: listData, isLoading: isListLoading } = useCustomers({ search: debouncedSearch || undefined, limit: 50 });
  const customers = (listData?.data ?? []).filter((c) => tierFilter === 'All' || c.tier === tierFilter);

  useEffect(() => {
    if (!selectedId && customers.length > 0) {
      setSelectedId(customers[0]._id);
    }
  }, [customers, selectedId]);

  const { data: detailData, isLoading: isDetailLoading } = useCustomer(selectedId);
  const selectedCustomer = detailData?.data;

  const toggleBlock = useToggleBlockCustomer();

  const activities = (selectedCustomer?.orderHistory ?? []).slice(0, 8).map((order) => ({
    id: order._id,
    text: `Order ${formatOrderId(order._id)} marked as ${order.status}`,
    time: formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true }),
  }));

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TIER_OPTIONS.map((tier) => (
                <DropdownMenuItem key={tier} onClick={() => setTierFilter(tier)}>
                  {tier}{tierFilter === tier ? ' ✓' : ''}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Master Pane */}
        <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col border-r bg-muted/20">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {isListLoading ? (
                <p className="text-sm text-muted-foreground text-center py-8">Loading customers...</p>
              ) : customers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No customers found.</p>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer._id}
                    onClick={() => setSelectedId(customer._id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedId === customer._id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted border border-transparent'}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={selectedId === customer._id ? 'bg-primary text-primary-foreground' : ''}>{getCustomerInitials(customer.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">{customer.fullName}</p>
                        {customer.tier === 'VIP' && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                      {!customer.isActive && <Badge variant="destructive" className="mt-1 text-[10px] py-0">Blocked</Badge>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Detail Pane */}
        <div className="hidden md:flex flex-col flex-1 bg-background overflow-hidden">
          {isDetailLoading || !selectedCustomer ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {isDetailLoading ? 'Loading customer...' : 'Select a customer'}
            </div>
          ) : (
            <>
              <div className="p-6 border-b flex justify-between items-start bg-card">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 text-xl">
                    <AvatarFallback>{getCustomerInitials(selectedCustomer.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{selectedCustomer.fullName}</h2>
                      <Badge variant={getTierBadgeVariant(selectedCustomer.tier)}>{selectedCustomer.tier}</Badge>
                      {!selectedCustomer.isActive && <Badge variant="destructive">Blocked</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {selectedCustomer.email}</span>
                      {selectedCustomer.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {selectedCustomer.phone}</span>}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className={selectedCustomer.isActive ? 'text-destructive' : ''}
                      onClick={() => toggleBlock.mutate(selectedCustomer._id)}
                      disabled={toggleBlock.isPending}
                    >
                      {selectedCustomer.isActive ? 'Block Customer' : 'Unblock Customer'}
                    </DropdownMenuItem>
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
                          <span className="font-semibold text-lg">{formatCurrency(selectedCustomer.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-muted-foreground"><ShoppingBag className="h-4 w-4" /> Total Orders</div>
                          <span className="font-medium">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Customer Since</div>
                          <span className="font-medium">{format(new Date(selectedCustomer.createdAt), 'MMM yyyy')}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg">Favorite Foods</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {selectedCustomer.favoriteFoods.length === 0 ? (
                          <p className="text-sm text-muted-foreground p-4">No orders yet.</p>
                        ) : (
                          <div className="divide-y">
                            {selectedCustomer.favoriteFoods.map((food) => (
                              <div key={food.name} className="p-4 flex justify-between items-center">
                                <span className="text-sm font-medium">{food.name}</span>
                                <Badge variant="secondary">{food.orders} orders</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg">Location</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-sm">{selectedCustomer.address || 'No address on file'}</span>
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
                            {selectedCustomer.orderHistory.length === 0 ? (
                              <p className="text-sm text-muted-foreground p-4">No orders yet.</p>
                            ) : (
                              <div className="divide-y">
                                {selectedCustomer.orderHistory.map((order) => (
                                  <div key={order._id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                    <div>
                                      <p className="font-semibold text-primary">{formatOrderId(order._id)}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(order.createdAt), 'MMM d, h:mm a')} &bull; {order.itemCount} items</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                                      <Badge variant="outline" className="mt-1 font-normal text-[10px] py-0">{order.status}</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="activity">
                        <Card>
                          <CardContent className="p-6">
                            {activities.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No activity yet.</p>
                            ) : (
                              <div className="relative border-l border-border ml-3 space-y-6">
                                {activities.map((activity) => (
                                  <div key={activity.id} className="relative pl-6">
                                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                                    <p className="text-sm font-medium leading-snug">{activity.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
