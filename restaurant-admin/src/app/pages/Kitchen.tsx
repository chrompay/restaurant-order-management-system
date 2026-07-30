import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ChefHat, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

import { useOrders } from '@/features/orders/hooks/useOrders';
import { useToggleOrderItem } from '@/features/orders/hooks/useToggleOrderItem';
import { useBumpOrder } from '@/features/kitchen/hooks/useBumpOrder';
import { useRecallOrder } from '@/features/kitchen/hooks/useRecallOrder';
import KitchenTicket from '@/features/kitchen/components/KitchenTicket';
import type { Order } from '@/features/orders/types/order.types';

const KITCHEN_STATUSES = ['Confirmed', 'Preparing'];

// Mirrors `FoodStation` (features/foods/types/food.types.ts) — kept as a
// local literal list rather than importing it so this filter still compiles
// even if a food has no station set (`stationFilter === "all"`).
const STATIONS = [
  'Bakery',
  'Beverages',
  'Breakfast',
  'Fryer',
  'Grill',
  'Legumes & Pots',
  'Pepper Soup',
  'Protein Prep',
  'Rice & Grains',
  'Swallow & Soup',
];

export default function Kitchen() {
  const [station, setStation] = useState('all');
  const [now, setNow] = useState(new Date());
  const [lastBumped, setLastBumped] = useState<Order | null>(null);

  // Recompute elapsed ticket time every 30s
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useOrders({ limit: 100 });
  const tickets = (data?.data ?? []).filter((order) => KITCHEN_STATUSES.includes(order.status));

  const toggleItem = useToggleOrderItem();
  const bumpOrder = useBumpOrder();
  const recallOrder = useRecallOrder();

  const handleToggleItem = (orderId: string, itemId: string) => {
    toggleItem.mutate({ orderId, itemId });
  };

  const handleBump = (order: Order) => {
    bumpOrder.mutate(order, {
      onSuccess: (response) => setLastBumped(response.data),
    });
  };

  const handleRecall = () => {
    if (!lastBumped) return;
    recallOrder.mutate(lastBumped, {
      onSuccess: () => setLastBumped(null),
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* KDS Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kitchen Display</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground font-medium">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>&bull;</span>
              <span>{tickets.length} Active Orders</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Select value={station} onValueChange={setStation}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {STATIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              disabled={!lastBumped || recallOrder.isPending}
              onClick={handleRecall}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Recall
            </Button>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="flex gap-4 py-6 overflow-x-auto items-start min-h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-[400px] text-muted-foreground">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[400px] text-muted-foreground border-2 border-dashed rounded-xl">
              <CheckCircle2 className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground">Queue is Clear</h3>
              <p>Great job! Waiting for new orders.</p>
            </div>
          ) : (
            tickets.map((order) => (
              <KitchenTicket
                key={order._id}
                order={order}
                now={now}
                stationFilter={station}
                onToggleItem={handleToggleItem}
                onBump={handleBump}
                isBumping={bumpOrder.isPending}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
