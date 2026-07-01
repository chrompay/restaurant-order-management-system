import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Filter, LayoutGrid, List, MoreHorizontal, Plus, Edit, Trash2, Utensils } from 'lucide-react';
import { Label } from '../components/ui/label';

// Mock Data
const MOCK_FOODS = [
  { id: 'F001', name: 'Truffle Burger', category: 'Mains', price: 18.00, cost: 6.50, stock: 45, available: true, image: '🍔' },
  { id: 'F002', name: 'Spicy Chicken Sandwich', category: 'Mains', price: 14.00, cost: 4.80, stock: 32, available: true, image: '🥪' },
  { id: 'F003', name: 'Sweet Potato Fries', category: 'Sides', price: 6.50, cost: 1.50, stock: 120, available: true, image: '🍟' },
  { id: 'F004', name: 'Margherita Pizza', category: 'Mains', price: 22.00, cost: 5.00, stock: 15, available: true, image: '🍕' },
  { id: 'F005', name: 'Vegan Wrap', category: 'Mains', price: 14.50, cost: 4.00, stock: 0, available: false, image: '🌯' },
  { id: 'F006', name: 'Kale Salad', category: 'Sides', price: 14.00, cost: 3.50, stock: 20, available: true, image: '🥗' },
  { id: 'F007', name: 'Iced Matcha Latte', category: 'Beverages', price: 6.00, cost: 1.20, stock: 50, available: true, image: '🍵' },
  { id: 'F008', name: 'Chocolate Lava Cake', category: 'Desserts', price: 9.50, cost: 2.50, stock: 10, available: true, image: '🧁' },
];

export default function Foods() {
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const filteredFoods = MOCK_FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const renderCards = () => (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredFoods.map(food => (
        <Card key={food.id} className="overflow-hidden hover:border-primary/50 transition-colors">
          <div className="h-32 bg-muted flex items-center justify-center text-6xl relative group">
            {food.image}
            {!food.available && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[1px]">
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-base line-clamp-1">{food.name}</h3>
                <p className="text-sm text-muted-foreground">{food.category}</p>
              </div>
              <p className="font-bold">${food.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Switch checked={food.available} />
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(food.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Available</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFoods.map((food) => (
            <TableRow key={food.id}>
              <TableCell>
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xl">{food.image}</div>
              </TableCell>
              <TableCell className="font-medium">{food.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{food.category}</Badge>
              </TableCell>
              <TableCell>${food.price.toFixed(2)}</TableCell>
              <TableCell className="text-muted-foreground">${food.cost.toFixed(2)}</TableCell>
              <TableCell>
                {food.stock > 10 ? (
                  <span>{food.stock}</span>
                ) : food.stock > 0 ? (
                  <span className="text-amber-500 font-medium">{food.stock} (Low)</span>
                ) : (
                  <span className="text-destructive font-medium">Out of stock</span>
                )}
              </TableCell>
              <TableCell>
                <Switch checked={food.available} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Food</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(food.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
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
          <h1 className="text-3xl font-bold tracking-tight">Foods Database</h1>
          <p className="text-muted-foreground mt-1">Manage your menu items, pricing, and availability.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Food
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search foods..." className="pl-8 bg-background" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] bg-background"><Filter className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mains">Mains</SelectItem>
              <SelectItem value="sides">Sides</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
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

      {view === 'table' ? renderTable() : renderCards()}

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Food Item</DialogTitle>
            <DialogDescription>Create a new item for your restaurant menu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Food Name</Label>
              <Input id="name" placeholder="e.g. Double Cheeseburger" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mains">Mains</SelectItem>
                    <SelectItem value="sides">Sides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Sale Price ($)</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Availability</Label>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Available on Menu</Label>
                  <p className="text-sm text-muted-foreground">Customers can order this item</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateOpen(false)}>Save Food</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>Are you sure you want to delete this food item? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setDeleteId(null)}>Delete Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}