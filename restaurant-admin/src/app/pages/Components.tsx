import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Bell, ChevronDown, Check, User, Filter, Calendar as CalendarIcon, Loader2, Plus, MoreHorizontal, Settings } from "lucide-react";

export default function Components() {
  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Component Library</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Enterprise-grade UI components for the Restaurant OS. Designed for speed, accessibility, and high data density.
        </p>
      </div>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="actions">Actions & Forms</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="overlays">Overlays & Feedback</TabsTrigger>
          <TabsTrigger value="complex">Complex Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-10">
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Buttons</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
              <Button disabled>Disabled</Button>
              <Button><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading</Button>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Inputs & Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Input</label>
                <Input placeholder="Enter table number..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Input</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search orders..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Menu (Mock)</label>
                <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span>Select category</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-medium">Checkbox (Mock)</label>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-sm border border-primary bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Switch (Mock)</label>
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-5 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-background rounded-full absolute right-0.5 top-0.5" />
                  </div>
                  <label className="text-sm leading-none">
                    Available for delivery
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Picker (Mock)</label>
                <div className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  <span>Pick a date</span>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="data" className="space-y-10">
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Status Badges & Pills</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="pending">Pending</Badge>
              <Badge variant="confirmed">Confirmed</Badge>
              <Badge variant="preparing">Preparing</Badge>
              <Badge variant="delivery">Out For Delivery</Badge>
              <Badge variant="delivered">Delivered</Badge>
              <Badge variant="cancelled">Cancelled</Badge>
              <Badge variant="outline">Draft</Badge>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Data Table</h3>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-001</TableCell>
                    <TableCell>Sarah Jenkins</TableCell>
                    <TableCell><Badge variant="pending">Pending</Badge></TableCell>
                    <TableCell>12:04 PM</TableCell>
                    <TableCell className="text-right">$45.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-002</TableCell>
                    <TableCell>Michael Chen</TableCell>
                    <TableCell><Badge variant="preparing">Preparing</Badge></TableCell>
                    <TableCell>11:45 AM</TableCell>
                    <TableCell className="text-right">$124.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-003</TableCell>
                    <TableCell>Emma Stone</TableCell>
                    <TableCell><Badge variant="delivery">Out for Delivery</Badge></TableCell>
                    <TableCell>11:20 AM</TableCell>
                    <TableCell className="text-right">$32.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-004</TableCell>
                    <TableCell>Alex Rivera</TableCell>
                    <TableCell><Badge variant="delivered">Delivered</Badge></TableCell>
                    <TableCell>10:15 AM</TableCell>
                    <TableCell className="text-right">$89.90</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="overlays" className="space-y-10">
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Cards & Modals (Mock)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Refund Order</CardTitle>
                  <CardDescription>Are you sure you want to refund order #ORD-002? This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Confirm Refund</Button>
                </CardFooter>
              </Card>
              
              <div className="relative">
                <Card className="absolute z-10 w-64 top-0 left-0 shadow-lg border-border">
                  <div className="p-1">
                    <div className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-pointer">
                      <User className="mr-2 w-4 h-4" /> Profile
                    </div>
                    <div className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-pointer">
                      <Settings className="mr-2 w-4 h-4" /> Settings
                    </div>
                    <div className="h-px bg-border my-1" />
                    <div className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-pointer text-destructive">
                      Log out
                    </div>
                  </div>
                </Card>
                <div className="h-48 border border-dashed border-border rounded-md flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                  Dropdown / Popover Context
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Toast Notifications (Mock)</h3>
            <div className="flex flex-col gap-4 max-w-sm">
              <div className="rounded-md border bg-card p-4 shadow-lg flex items-start gap-4">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-status-delivered" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Order Delivered</h4>
                  <p className="text-sm text-muted-foreground mt-1">Order #ORD-004 has been successfully delivered.</p>
                </div>
              </div>
              <div className="rounded-md border bg-card p-4 shadow-lg flex items-start gap-4">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Network Error</h4>
                  <p className="text-sm text-muted-foreground mt-1">Could not connect to printer.</p>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="complex" className="space-y-10">
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">KPI Metric Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <span className="text-muted-foreground text-xs font-medium">Today</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,231.89</div>
                  <p className="text-xs text-status-delivered flex items-center mt-1">
                    <Plus className="w-3 h-3 mr-1" /> 20.1% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <span className="text-muted-foreground text-xs font-medium">Now</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    12 preparing, 8 pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                  <span className="text-muted-foreground text-xs font-medium">Today</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14m 32s</div>
                  <p className="text-xs text-status-delivered flex items-center mt-1">
                    -2m 10s from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Empty States</h3>
            <Card className="flex flex-col items-center justify-center py-16 border-dashed">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center mb-4">
                There are currently no active orders matching your filter criteria. Try adjusting your filters.
              </p>
              <Button variant="outline">Clear Filters</Button>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}