import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Search, LayoutGrid, List, MoreHorizontal, Plus, Edit, Trash2, Settings2 } from 'lucide-react';

import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory';
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory';
import { resolveCategoryIcon } from '@/features/categories/lib/iconMap';
import CategoryForm from '@/features/categories/components/CategoryForm';
import type { Category } from '@/features/categories/types/category.types';
import type { CategoryFormValues } from '@/features/categories/schemas/category.schema';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function Categories() {
  const [view, setView] = useState<'table' | 'cards'>('cards');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isError } = useCategories({ limit: 100 });
  const categories = (data?.data ?? []).filter((c) =>
    c.categoryName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const openCreateForm = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory._id, values },
        { onSuccess: closeForm }
      );
    } else {
      createCategory.mutate(values, { onSuccess: closeForm });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const renderCards = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => {
        const Icon = resolveCategoryIcon(cat.icon);
        return (
          <Card key={cat._id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditForm(cat)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/menu/foods?menu=${cat._id}`}>
                        <Settings2 className="mr-2 h-4 w-4" /> Manage Items
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(cat)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl">{cat.categoryName}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1 h-10">{cat.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">{cat.itemCount}</span>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Revenue Share</span>
                  <span className="font-semibold">{cat.revenue}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/10 flex justify-between">
              <Badge variant={cat.status === 'Active' ? 'default' : 'secondary'}>{cat.status}</Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/menu/foods?menu=${cat._id}`}>View Items</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  const renderTable = () => (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Rev Share</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => {
            const Icon = resolveCategoryIcon(cat.icon);
            return (
              <TableRow key={cat._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    {cat.categoryName}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[300px] truncate">{cat.description}</TableCell>
                <TableCell>{cat.itemCount}</TableCell>
                <TableCell>{cat.revenue}%</TableCell>
                <TableCell>
                  <Badge variant={cat.status === 'Active' ? 'default' : 'secondary'}>{cat.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(cat)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(cat)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your menu structure and analyze category performance.</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 border rounded-lg shadow-sm">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search categories..." className="pl-8 bg-background" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'cards')} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-[120px] grid-cols-2">
            <TabsTrigger value="cards"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="table"><List className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading categories...</div>
      ) : isError ? (
        <div className="text-center text-destructive py-12">Failed to load categories.</div>
      ) : categories.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No categories found.</div>
      ) : view === 'table' ? renderTable() : renderCards()}

      {/* Create / Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Menu Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update this category.' : 'Create a new category grouping for your menu.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={editingCategory ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={createCategory.isPending || updateCategory.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.categoryName}"? Items within this category will become uncategorized.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCategory.isPending}>
              {deleteCategory.isPending ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
