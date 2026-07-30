import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MapPin, Navigation, Package, Car, Bike, CheckCircle2, Phone, ArrowRight, Printer } from 'lucide-react';

import { useOrders } from '@/features/orders/hooks/useOrders';
import { useUpdateOrderStatus } from '@/features/orders/hooks/useUpdateOrderStatus';
import { useRiders } from '@/features/riders/hooks/useRiders';
import { formatOrderId, getCustomerName } from '@/features/orders/lib/orderDisplay';
import { printOrderReceipt } from '@/features/orders/lib/printReceipt';
import { getElapsedMinutes, formatElapsedTime } from '@/features/kitchen/lib/ticketStatus';
import { RIDER_STATUS_COLORS, RIDER_STATUS_BORDER, formatRiderStatus, getRiderInitials } from '@/features/riders/lib/riderDisplay';
import AssignDriverDialog from '@/features/delivery/components/AssignDriverDialog';
import FleetMap from '@/features/delivery/components/FleetMap';
import RiderManagementDialog from '@/features/riders/components/RiderManagementDialog';
import type { Order } from '@/features/orders/types/order.types';
import type { Rider } from '@/features/riders/types/rider.types';

function riderName(order: Order): string {
  const rider = order.assignedRider;
  return rider && typeof rider === 'object' ? (rider as Rider).name : 'Unknown';
}

function riderPhone(order: Order): string | undefined {
  const rider = order.assignedRider;
  return rider && typeof rider === 'object' ? (rider as Rider).phone : undefined;
}

export default function Delivery() {
  const [activeTab, setActiveTab] = useState('waiting');
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFleetOpen, setIsFleetOpen] = useState(false);

  const { data: ordersData, isLoading } = useOrders({ status: 'Out For Delivery', limit: 100 });
  const { data: ridersData } = useRiders();

  const orders = ordersData?.data ?? [];
  const riders = ridersData?.data ?? [];

  const waitingOrders = orders.filter((o) => !o.assignedRider);
  const enRouteOrders = orders.filter((o) => !!o.assignedRider);

  const updateStatus = useUpdateOrderStatus();

  const activeRiders = riders.filter((r) => r.status !== 'offline').length;

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
            <span className="text-sm font-medium text-muted-foreground">Active Drivers</span>
            <span className="text-xl font-bold text-emerald-500">
              {activeRiders} / {riders.length}
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
              <Button variant="outline" size="sm" onClick={() => setIsMapOpen(true)}>
                <MapPin className="w-4 h-4 mr-2" /> View Map
              </Button>
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <TabsContent value="waiting" className="m-0 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-16">Loading...</div>
                ) : waitingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                    <CheckCircle2 className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold text-foreground">All clear!</h3>
                    <p>No orders waiting for dispatch.</p>
                  </div>
                ) : (
                  waitingOrders.map((order) => {
                    const waitingMinutes = getElapsedMinutes(order.updatedAt, new Date());
                    const address = typeof order.customer === 'object' ? order.customer.address : undefined;
                    return (
                      <Card key={order._id} className={waitingMinutes >= 15 ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-primary'}>
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between sm:justify-start gap-4">
                              <h3 className="font-bold text-lg">{formatOrderId(order._id)}</h3>
                              <Badge variant={waitingMinutes >= 15 ? 'destructive' : 'secondary'}>
                                {formatElapsedTime(waitingMinutes)} waiting
                              </Badge>
                            </div>

                            <div className="space-y-1.5">
                              <p className="font-medium flex items-center gap-2">
                                <span className="w-5 text-muted-foreground flex justify-center">
                                  <Avatar className="w-4 h-4"><AvatarFallback className="text-[10px]">C</AvatarFallback></Avatar>
                                </span>
                                {getCustomerName(order)}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span className="w-5 text-muted-foreground flex justify-center"><MapPin className="w-4 h-4" /></span>
                                {address || 'No address on file'}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span className="w-5 text-muted-foreground flex justify-center"><Package className="w-4 h-4" /></span>
                                {order.items.length} items ready
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-[160px]">
                            <Button className="flex-1 sm:w-full" onClick={() => setAssigningOrder(order)}>
                              Assign Driver
                            </Button>
                            <Button variant="outline" className="flex-1 sm:w-full" onClick={() => printOrderReceipt(order)}>
                              <Printer className="w-4 h-4 mr-2" /> Print Label
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
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
                  enRouteOrders.map((order) => {
                    const phone = riderPhone(order);
                    const address = typeof order.customer === 'object' ? order.customer.address : undefined;
                    return (
                      <Card key={order._id}>
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between sm:justify-start gap-4">
                              <h3 className="font-bold text-lg">{formatOrderId(order._id)}</h3>
                              <Badge variant="outline" className="border-blue-500 text-blue-500">
                                <Navigation className="w-3 h-3 mr-1" />
                                Assigned {formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true })}
                              </Badge>
                            </div>

                            <div className="space-y-1.5">
                              <p className="font-medium flex items-center gap-2 text-sm">
                                <span className="w-5 text-muted-foreground flex justify-center"><MapPin className="w-4 h-4" /></span>
                                {address || 'No address on file'}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span className="w-5 text-muted-foreground flex justify-center"><Car className="w-4 h-4" /></span>
                                Driver: <span className="font-medium text-foreground">{riderName(order)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-[160px]">
                            <Button
                              className="flex-1 sm:w-full"
                              onClick={() => updateStatus.mutate({ orderId: order._id, status: 'Delivered' })}
                              disabled={updateStatus.isPending}
                            >
                              Mark Delivered
                            </Button>
                            <Button variant="secondary" className="flex-1 sm:w-full" disabled={!phone} asChild={!!phone}>
                              {phone ? <a href={`tel:${phone}`}><Phone className="w-4 h-4 mr-2" /> Contact</a> : <span><Phone className="w-4 h-4 mr-2" /> Contact</span>}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
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
              {riders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No riders yet.</p>
              ) : (
                riders.map((rider) => (
                  <Card key={rider._id} className={`shadow-sm border-l-4 ${RIDER_STATUS_BORDER[rider.status]}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="font-medium">{getRiderInitials(rider.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate">{rider.name}</p>
                          {rider.vehicleType === 'bike' ? <Bike className="w-4 h-4 text-muted-foreground" /> : <Car className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 rounded-sm ${RIDER_STATUS_COLORS[rider.status]}`}>
                          {formatRiderStatus(rider.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-card rounded-b-xl shrink-0">
            <Button className="w-full" variant="outline" onClick={() => setIsFleetOpen(true)}>
              Manage Fleet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <AssignDriverDialog order={assigningOrder} riders={riders} onOpenChange={(open) => !open && setAssigningOrder(null)} />
      <RiderManagementDialog open={isFleetOpen} onOpenChange={setIsFleetOpen} />

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Fleet Map</DialogTitle>
          </DialogHeader>
          <FleetMap riders={riders} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
