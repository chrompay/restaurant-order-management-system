import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { MapPin, Navigation, Clock, Package, Car, Bike, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react';

// --- MOCK DATA ---
const FLEET = [
  { id: 'd1', name: 'Mike Thomas', status: 'available', vehicle: 'car', orders: 0, avatar: 'MT' },
  { id: 'd2', name: 'Sarah Kline', status: 'en_route', vehicle: 'bike', orders: 2, avatar: 'SK' },
  { id: 'd3', name: 'David Lee', status: 'returning', vehicle: 'bike', orders: 0, avatar: 'DL' },
  { id: 'd4', name: 'Emma Wilson', status: 'offline', vehicle: 'car', orders: 0, avatar: 'EW' },
];

const WAITING_ORDERS = [
  {
    id: '#1058',
    customer: 'Alice Johnson',
    address: '123 Park Ave, Apt 4B',
    distance: '1.2 mi',
    timeWaiting: 8, // mins
    items: 3,
    priority: 'high',
  },
  {
    id: '#1062',
    customer: 'Bob Smith',
    address: '456 Broadway St, Floor 12',
    distance: '0.8 mi',
    timeWaiting: 3,
    items: 1,
    priority: 'normal',
  },
  {
    id: '#1063',
    customer: 'Charlie Davis',
    address: '789 5th Ave',
    distance: '2.5 mi',
    timeWaiting: 1,
    items: 4,
    priority: 'normal',
  }
];

const EN_ROUTE_ORDERS = [
  {
    id: '#1045',
    customer: 'Diana Prince',
    address: '321 Lex Ave',
    driver: 'Sarah Kline',
    eta: 12, // mins left
    status: 'on_time',
  },
  {
    id: '#1049',
    customer: 'Evan Wright',
    address: '654 Madison Ave',
    driver: 'Sarah Kline',
    eta: 2, // mins left
    status: 'delayed',
  }
];

export default function Delivery() {
  const [activeTab, setActiveTab] = useState('waiting');
  const [waitingOrders, setWaitingOrders] = useState(WAITING_ORDERS);
  const [enRouteOrders, setEnRouteOrders] = useState(EN_ROUTE_ORDERS);

  const assignOrder = (orderId: string) => {
    const orderToMove = waitingOrders.find(o => o.id === orderId);
    if (!orderToMove) return;

    // Remove from waiting
    setWaitingOrders(prev => prev.filter(o => o.id !== orderId));
    
    // Add to en route (mocking assignment to Mike Thomas)
    setEnRouteOrders(prev => [
      ...prev,
      {
        id: orderToMove.id,
        customer: orderToMove.customer,
        address: orderToMove.address,
        driver: 'Mike Thomas',
        eta: 15,
        status: 'on_time',
      }
    ]);
  };

  const getDriverStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'en_route': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'returning': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDriverStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pb-8 gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Dispatch</h1>
          <p className="text-muted-foreground mt-1">Manage outbound orders and fleet tracking.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-muted-foreground">Avg Delivery Time</span>
            <span className="text-xl font-bold">24 min</span>
          </div>
          <div className="h-10 w-px bg-border mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-muted-foreground">Active Drivers</span>
            <span className="text-xl font-bold text-emerald-500">
              {FLEET.filter(d => d.status !== 'offline').length} / {FLEET.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        {/* Main Queue Area */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="waiting" className="flex gap-2">
                  Waiting for Driver
                  <Badge variant="secondary" className="rounded-full px-1.5 py-0.5 text-xs">
                    {waitingOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="en_route" className="flex gap-2">
                  En Route
                  <Badge variant="secondary" className="rounded-full px-1.5 py-0.5 text-xs">
                    {enRouteOrders.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" /> View Map
              </Button>
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <TabsContent value="waiting" className="m-0 space-y-4">
                {waitingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                    <CheckCircle2 className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold text-foreground">All clear!</h3>
                    <p>No orders waiting for dispatch.</p>
                  </div>
                ) : (
                  waitingOrders.map(order => (
                    <Card key={order.id} className={`border-l-4 ${order.priority === 'high' ? 'border-l-destructive' : 'border-l-primary'}`}>
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between sm:justify-start gap-4">
                            <h3 className="font-bold text-lg">{order.id}</h3>
                            <Badge variant={order.priority === 'high' ? 'destructive' : 'secondary'}>
                              {order.timeWaiting}m waiting
                            </Badge>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="font-medium flex items-center gap-2">
                              <span className="w-5 text-muted-foreground flex justify-center"><Avatar className="w-4 h-4"><AvatarImage src="" /><AvatarFallback className="text-[10px]">C</AvatarFallback></Avatar></span>
                              {order.customer}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                              <span className="w-5 text-muted-foreground flex justify-center"><MapPin className="w-4 h-4" /></span>
                              {order.address} <span className="text-xs ml-2 px-1.5 py-0.5 bg-muted rounded">{order.distance}</span>
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                              <span className="w-5 text-muted-foreground flex justify-center"><Package className="w-4 h-4" /></span>
                              {order.items} items ready
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-[160px]">
                          <Button className="flex-1 sm:w-full" onClick={() => assignOrder(order.id)}>
                            Assign Driver
                          </Button>
                          <Button variant="outline" className="flex-1 sm:w-full">
                            Print Label
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="en_route" className="m-0 space-y-4">
                {enRouteOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                    <Navigation className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold text-foreground">No active deliveries</h3>
                    <p>All orders have been delivered.</p>
                  </div>
                ) : (
                  enRouteOrders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between sm:justify-start gap-4">
                            <h3 className="font-bold text-lg">{order.id}</h3>
                            <Badge variant="outline" className={order.status === 'delayed' ? 'border-amber-500 text-amber-500' : 'border-blue-500 text-blue-500'}>
                              {order.status === 'delayed' ? <AlertCircle className="w-3 h-3 mr-1" /> : <Navigation className="w-3 h-3 mr-1" />}
                              ETA: {order.eta}m
                            </Badge>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="font-medium flex items-center gap-2 text-sm">
                              <span className="w-5 text-muted-foreground flex justify-center"><MapPin className="w-4 h-4" /></span>
                              {order.address}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                              <span className="w-5 text-muted-foreground flex justify-center"><Car className="w-4 h-4" /></span>
                              Driver: <span className="font-medium text-foreground">{order.driver}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-[160px]">
                          <Button variant="outline" className="flex-1 sm:w-full">
                            Track
                          </Button>
                          <Button variant="secondary" className="flex-1 sm:w-full">
                            <Phone className="w-4 h-4 mr-2" /> Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Sidebar: Driver Fleet */}
        <div className="flex flex-col h-full min-h-0 bg-muted/20 rounded-xl border">
          <div className="p-4 border-b bg-card rounded-t-xl shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              Fleet Status
            </h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {FLEET.map(driver => (
                <Card key={driver.id} className={`shadow-sm border-l-4 ${driver.status === 'available' ? 'border-l-emerald-500' : driver.status === 'en_route' ? 'border-l-blue-500' : driver.status === 'returning' ? 'border-l-amber-500' : 'border-l-muted-foreground'}`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="font-medium">{driver.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate">{driver.name}</p>
                        {driver.vehicle === 'bike' ? <Bike className="w-4 h-4 text-muted-foreground" /> : <Car className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 rounded-sm ${getDriverStatusColor(driver.status)}`}>
                          {getDriverStatusLabel(driver.status)}
                        </Badge>
                        {driver.orders > 0 && (
                          <span className="text-xs font-medium text-muted-foreground">{driver.orders} orders</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-card rounded-b-xl shrink-0">
            <Button className="w-full" variant="outline">
              Manage Fleet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}