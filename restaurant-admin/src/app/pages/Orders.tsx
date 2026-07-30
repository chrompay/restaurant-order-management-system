import { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Filter, Calendar, LayoutGrid, List, Download } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useCreateOrder } from '@/features/orders/hooks/useCreateOrder';
import { useUpdateOrderStatus } from '@/features/orders/hooks/useUpdateOrderStatus';
import { useDeleteOrder } from '@/features/orders/hooks/useDeleteOrder';
import OrderTable from '@/features/orders/components/OrderTable';
import OrderKanban from '@/features/orders/components/OrderKanban';
import OrderDetailSheet from '@/features/orders/components/OrderDetailSheet';
import CreateOrderDialog from '@/features/orders/components/CreateOrderDialog';
import { printOrderReceipt } from '@/features/orders/lib/printReceipt';
import { formatOrderId, getCustomerName, getItemCount } from '@/features/orders/lib/orderDisplay';
import type { Order, OrderStatus } from '@/features/orders/types/order.types';
import type { CreateOrderFormValues } from '@/features/orders/schemas/order.schema';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { exportToCsv } from '@/lib/exportCsv';

function getDateRange(preset: string): { from?: string; to?: string } {
  const now = new Date();

  if (preset === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { from: start.toISOString(), to: now.toISOString() };
  }

  if (preset === 'yesterday') {
    const start = new Date(now);
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString() };
  }

  if (preset === '7days') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { from: start.toISOString(), to: now.toISOString() };
  }

  return {};
}

export default function Orders() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const { user } = useAuth();

  const debouncedSearch = useDebouncedValue(search, 300);
  // Memoized on dateFilter only — getDateRange('today'/'7days') calls `new
  // Date()` internally, so recomputing it on every render would produce a
  // new `to` timestamp each time, changing the query key and refetching in
  // an infinite loop (and quickly exhausting the API's rate limiter).
  const { from, to } = useMemo(() => getDateRange(dateFilter), [dateFilter]);

  const { data, isLoading, isError } = useOrders({
    page,
    limit: view === 'kanban' ? 100 : 8,
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
    from,
    to,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const createOrder = useCreateOrder();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const handleCreateOrder = (values: CreateOrderFormValues) => {
    createOrder.mutate(
      {
        customerId: values.customerId,
        items: values.items,
      },
      { onSuccess: () => setIsCreateOpen(false) }
    );
  };

  const handleDeleteOrder = () => {
    if (!deleteTarget) return;
    deleteOrder.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateStatus.mutate(
      { orderId, status },
      {
        onSuccess: (response) => {
          setSelectedOrder(response.data);
        },
      }
    );
  };

  const handleExport = () => {
    exportToCsv(
      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
      orders.map((order) => ({
        id: formatOrderId(order._id),
        customer: getCustomerName(order),
        status: order.status,
        items: getItemCount(order),
        total: order.totalAmount.toFixed(2),
        placedAt: order.createdAt,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all restaurant orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button onClick={() => setIsCreateOpen(true)}>Create Order</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or email..."
              className="pl-8 bg-background"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><Filter className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Preparing">Preparing</SelectItem>
              <SelectItem value="Out For Delivery">Out For Delivery</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
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

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading orders...</div>
      ) : isError ? (
        <div className="text-center text-destructive py-12">Failed to load orders.</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No orders found.</div>
      ) : view === 'table' ? (
        <OrderTable
          orders={orders}
          onSelectOrder={setSelectedOrder}
          onPrintOrder={printOrderReceipt}
          onDeleteOrder={user?.role === 'admin' ? setDeleteTarget : undefined}
        />
      ) : (
        <OrderKanban orders={orders} onSelectOrder={setSelectedOrder} />
      )}

      {meta && meta.totalPages > 1 && view === 'table' && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meta.hasPreviousPage) setPage((p) => p - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === meta.page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meta.hasNextPage) setPage((p) => p + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <OrderDetailSheet
        order={selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onPrint={printOrderReceipt}
        isUpdating={updateStatus.isPending}
      />

      <CreateOrderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateOrder}
        isSubmitting={createOrder.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteTarget ? formatOrderId(deleteTarget._id) : 'this order'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteOrder} disabled={deleteOrder.isPending}>
              {deleteOrder.isPending ? 'Deleting...' : 'Delete Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
