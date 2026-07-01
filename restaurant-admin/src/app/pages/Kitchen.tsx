import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Clock, ChefHat, RotateCcw, Filter, UtensilsCrossed, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

// Mock Data
const INITIAL_TICKETS = [
  {
    id: '#1052',
    type: 'Dine-In',
    destination: 'Table 12',
    server: 'Alex R.',
    timePlaced: new Date(Date.now() - 24 * 60000).toISOString(), // 24 mins ago
    elapsed: 24,
    status: 'late',
    items: [
      { id: 'i1', qty: 1, name: 'Truffle Burger', notes: ['Medium Rare', 'NO Onions'], completed: false },
      { id: 'i2', qty: 1, name: 'Sweet Potato Fries', notes: ['Extra crispy'], completed: false },
    ]
  },
  {
    id: '#1053',
    type: 'Takeout',
    destination: 'Pickup',
    server: 'Online',
    timePlaced: new Date(Date.now() - 14 * 60000).toISOString(), // 14 mins ago
    elapsed: 14,
    status: 'warning',
    items: [
      { id: 'i3', qty: 2, name: 'Margherita Pizza', notes: [], completed: false },
      { id: 'i4', qty: 1, name: 'Kale Salad', notes: ['Dressing on side'], completed: false },
    ]
  },
  {
    id: '#1054',
    type: 'Delivery',
    destination: 'UberEats',
    server: 'Tablet',
    timePlaced: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
    elapsed: 8,
    status: 'normal',
    items: [
      { id: 'i5', qty: 1, name: 'Spicy Chicken Sandwich', notes: [], completed: false },
      { id: 'i6', qty: 1, name: 'Iced Matcha Latte', notes: ['Oat milk'], completed: false },
    ]
  },
  {
    id: '#1055',
    type: 'Dine-In',
    destination: 'Table 4',
    server: 'Sarah J.',
    timePlaced: new Date(Date.now() - 4 * 60000).toISOString(), // 4 mins ago
    elapsed: 4,
    status: 'normal',
    items: [
      { id: 'i7', qty: 3, name: 'Truffle Burger', notes: ['Medium'], completed: false },
      { id: 'i8', qty: 3, name: 'Sweet Potato Fries', notes: [], completed: false },
    ]
  },
  {
    id: '#1056',
    type: 'Dine-In',
    destination: 'Table 8',
    server: 'Sarah J.',
    timePlaced: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
    elapsed: 2,
    status: 'normal',
    items: [
      { id: 'i9', qty: 1, name: 'Chocolate Lava Cake', notes: ['Add vanilla ice cream'], completed: false },
    ]
  }
];

export default function Kitchen() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [station, setStation] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleItemComplete = (ticketId: string, itemId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          items: ticket.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return ticket;
    }));
  };

  const bumpTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'late': return 'border-t-destructive bg-destructive/5';
      case 'warning': return 'border-t-amber-500 bg-amber-500/5';
      default: return 'border-t-primary bg-card';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'late': return 'text-destructive';
      case 'warning': return 'text-amber-500';
      default: return 'text-primary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'Dine-In': return 'default';
      case 'Takeout': return 'secondary';
      case 'Delivery': return 'outline';
      default: return 'outline';
    }
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
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>•</span>
              <span>{tickets.length} Active Orders</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Tabs value={station} onValueChange={setStation} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="grill">Grill</TabsTrigger>
              <TabsTrigger value="fryer">Fryer</TabsTrigger>
              <TabsTrigger value="expo">Expo</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" /> Recall
            </Button>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="flex gap-4 py-6 overflow-x-auto items-start min-h-full">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[400px] text-muted-foreground border-2 border-dashed rounded-xl">
              <CheckCircle2 className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground">Queue is Clear</h3>
              <p>Great job! Waiting for new orders.</p>
            </div>
          ) : (
            tickets.map((ticket) => {
              const allItemsCompleted = ticket.items.every(i => i.completed);
              
              return (
                <Card 
                  key={ticket.id} 
                  className={`flex-none w-[320px] flex flex-col h-[calc(100vh-200px)] max-h-[700px] overflow-hidden border-t-4 shadow-md transition-colors ${getStatusColor(ticket.status)}`}
                >
                  {/* Ticket Header */}
                  <CardHeader className="p-3 border-b bg-card shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-2xl tracking-tight">{ticket.id}</span>
                        <Badge variant={getTypeBadgeVariant(ticket.type)} className="ml-2 align-middle">
                          {ticket.type}
                        </Badge>
                      </div>
                      <div className={`flex items-center gap-1.5 font-mono text-xl font-bold ${getStatusTextColor(ticket.status)}`}>
                        {ticket.status === 'late' && <AlertCircle className="h-5 w-5 animate-pulse" />}
                        {ticket.elapsed}:00
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <UtensilsCrossed className="h-3.5 w-3.5" /> {ticket.destination}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ChefHat className="h-3.5 w-3.5" /> {ticket.server}
                      </span>
                    </div>
                  </CardHeader>

                  {/* Ticket Items */}
                  <CardContent className="p-0 flex-1 overflow-y-auto bg-card">
                    <ul className="divide-y divide-border/50">
                      {ticket.items.map(item => (
                        <li 
                          key={item.id} 
                          className={`p-3 flex gap-3 cursor-pointer transition-colors hover:bg-muted/50 ${item.completed ? 'opacity-50 bg-muted/30' : ''}`}
                          onClick={() => toggleItemComplete(ticket.id, item.id)}
                        >
                          <div className={`flex items-center justify-center h-8 w-8 rounded font-bold text-lg shrink-0 ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {item.qty}
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold text-base leading-tight ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.name}
                            </p>
                            {item.notes.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {item.notes.map((note, i) => (
                                  <p key={i} className={`text-sm font-medium ${note.toUpperCase().includes('NO') ? 'text-destructive' : 'text-amber-500'}`}>
                                    {note.toUpperCase().includes('NO') ? '- ' : '+ '} {note}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* Ticket Footer */}
                  <CardFooter className="p-3 border-t bg-card shrink-0">
                    <Button 
                      className="w-full text-base font-semibold h-14 transition-all" 
                      variant={allItemsCompleted ? "default" : "secondary"}
                      onClick={() => bumpTicket(ticket.id)}
                    >
                      {allItemsCompleted ? (
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Order Ready (Bump)</span>
                      ) : (
                        "Bump Order"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}