import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Filter, LayoutGrid, List, Plus } from 'lucide-react';

import { useFoods } from '@/features/foods/hooks/useFoods';
import { useCreateFood } from '@/features/foods/hooks/useCreateFood';
import { useUpdateFood } from '@/features/foods/hooks/useUpdateFood';
import { useDeleteFood } from '@/features/foods/hooks/useDeleteFood';
import { useUpdateFoodAvailability } from '@/features/foods/hooks/useUpdateFoodAvailability';
import { useCategories } from '@/features/categories/hooks/useCategories';
import FoodTable from '@/features/foods/components/FoodTable';
import FoodCard from '@/features/foods/components/FoodCard';
import FoodForm from '@/features/foods/components/FoodForm';
import type { Food } from '@/features/foods/types/food.types';
import type { FoodFormValues } from '@/features/foods/schemas/food.schema';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSearchParams } from 'react-router';

export default function Foods() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('menu') ?? 'all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategoryFilter(searchParams.get('menu') ?? 'all');
    setPage(1);
  }, [searchParams]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Food | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isError } = useFoods({
    page,
    limit: 8,
    name: debouncedSearch || undefined,
    menu: categoryFilter === 'all' ? undefined : categoryFilter,
  });

  const foods = data?.data ?? [];
  const meta = data?.meta;

  const createFood = useCreateFood();
  const updateFood = useUpdateFood();
  const deleteFood = useDeleteFood();
  const updateAvailability = useUpdateFoodAvailability();

  const openCreateForm = () => {
    setEditingFood(null);
    setIsFormOpen(true);
  };

  const openEditForm = (food: Food) => {
    setEditingFood(food);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingFood(null);
  };

  const handleSubmit = (values: FoodFormValues) => {
    if (editingFood) {
      updateFood.mutate(
        { id: editingFood._id, values },
        { onSuccess: closeForm }
      );
    } else {
      createFood.mutate(values, { onSuccess: closeForm });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFood.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleToggleAvailability = (food: Food, value: boolean) => {
    updateAvailability.mutate({ id: food._id, availability: value });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Foods Database</h1>
          <p className="text-muted-foreground mt-1">Manage your menu items, pricing, and availability.</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> Add Food
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              className="pl-8 bg-background"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'cards')} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-[120px] grid-cols-2">
            <TabsTrigger value="table"><List className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="cards"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading foods...</div>
      ) : isError ? (
        <div className="text-center text-destructive py-12">Failed to load foods.</div>
      ) : foods.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No foods found.</div>
      ) : view === 'table' ? (
        <FoodTable
          foods={foods}
          onEdit={openEditForm}
          onDelete={setDeleteTarget}
          onToggleAvailability={handleToggleAvailability}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onEdit={openEditForm}
              onDelete={setDeleteTarget}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
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

      {/* Create / Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
            <DialogDescription>
              {editingFood ? 'Update this menu item.' : 'Create a new item for your restaurant menu.'}
            </DialogDescription>
          </DialogHeader>
          <FoodForm
            food={editingFood ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={createFood.isPending || updateFood.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteFood.isPending}>
              {deleteFood.isPending ? 'Deleting...' : 'Delete Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
