import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Search, LayoutGrid, List, MoreHorizontal, Plus, Edit, Trash2, UtensilsCrossed, Settings2, Tag } from 'lucide-react';
import { Label } from '../components/ui/label';

// Mock Data
const MOCK_CATEGORIES = [
  { id: 'C1', name: 'Mains', description: 'Primary dishes including burgers, pizzas, and wraps.', itemCount: 24, revenue: 45, status: 'Active', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { id: 'C2', name: 'Sides', description: 'Fries, salads, and side portions.', itemCount: 12, revenue: 15, status: 'Active', icon: <Tag className="w-5 h-5" /> },
  { id: 'C3', name: 'Beverages', description: 'Hot and cold drinks, shakes.', itemCount: 18, revenue: 25, status: 'Active', icon: <Tag className="w-5 h-5" /> },
  { id: 'C4', name: 'Desserts', description: 'Sweet treats and cakes.', itemCount: 8, revenue: 10, status: 'Active', icon: <Tag className="w-5 h-5" /> },
  { id: 'C5', name: 'Specials', description: 'Limited time offers and seasonal items.', itemCount: 3, revenue: 5, status: 'Draft', icon: <Tag className="w-5 h-5" /> },
];

export default function Categories() {
  const [view, setView] = useState<'table' | 'cards'>('cards');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const filteredCategories = MOCK_CATEGORIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const renderCards = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredCategories.map(cat => (
        <Card key={cat.id} className="flex flex-col hover:border-primary/50 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                {cat.icon}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem><Settings2 className="mr-2 h-4 w-4" /> Manage Items</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(cat.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-xl">{cat.name}</CardTitle>
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
            <Button variant="ghost" size="sm">View Items</Button>
          </CardFooter>
        </Card>
      ))}
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
          {filteredCategories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    {cat.icon}
                  </div>
                  {cat.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[300px] truncate">{cat.description}</TableCell>
              <TableCell>{cat.itemCount}</TableCell>
              <TableCell>{cat.revenue}%</TableCell>
              <TableCell>
                <Badge variant={cat.status === 'Active' ? 'default' : 'secondary'}>{cat.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(cat.id)}><Trash2 className="h-4 w-4" /></Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Menu Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your menu structure and analyze category performance.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
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

      {view === 'table' ? renderTable() : renderCards()}

      {/* Create / Edit Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Menu Category</DialogTitle>
            <DialogDescription>Create a new category grouping for your menu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="e.g. Signature Burgers" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" placeholder="Brief description of category" />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button variant="default" className="flex-1">Active</Button>
                <Button variant="outline" className="flex-1">Draft</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateOpen(false)}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete this category? Items within this category will become uncategorized.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setDeleteId(null)}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}