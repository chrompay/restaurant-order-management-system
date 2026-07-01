import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Loader2, Store, User, Bell, Shield, Users, Palette, Smartphone, Laptop } from 'lucide-react';

const SETTINGS_TABS = [
  { id: 'general', label: 'Restaurant Profile', icon: <Store className="w-4 h-4" /> },
  { id: 'profile', label: 'My Account', icon: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'team', label: 'Roles & Permissions', icon: <Users className="w-4 h-4" /> },
  { id: 'appearance', label: 'System Preferences', icon: <Palette className="w-4 h-4" /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>Update your primary business details visible to customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input id="restaurantName" defaultValue="Gourmet Burger Kitchen" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" type="email" defaultValue="hello@gbk.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 000-1234" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Culinary Blvd, Food District, NY 10001" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set your standard operational hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-[150px]">
                      <Switch defaultChecked={day !== 'Sunday'} />
                      <Label className="font-normal">{day}</Label>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <Select defaultValue="09:00" disabled={day === 'Sunday'}>
                        <SelectTrigger><SelectValue placeholder="Open" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00 AM</SelectItem>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">-</span>
                      <Select defaultValue={day === 'Friday' || day === 'Saturday' ? "23:00" : "22:00"} disabled={day === 'Sunday'}>
                        <SelectTrigger><SelectValue placeholder="Close" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="21:00">09:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Hours
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>My Account</CardTitle>
                <CardDescription>Manage your personal profile and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input id="userEmail" type="email" defaultValue="john@gbk.com" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Order Alerts</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Orders</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications for new incoming orders.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Order Cancellations</Label>
                      <p className="text-sm text-muted-foreground">Get notified when a customer cancels an order.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">System & Marketing</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Daily Summary</Label>
                      <p className="text-sm text-muted-foreground">Receive a daily email with revenue and operational stats.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">Hear about new features and system updates.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPass">Current Password</Label>
                    <Input id="currentPass" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPass">New Password</Label>
                    <Input id="newPass" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPass">Confirm New Password</Label>
                    <Input id="confirmPass" type="password" />
                  </div>
                  <Button variant="outline" className="mt-2">Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Require 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                    </div>
                    <Button variant="secondary">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to the system.</CardDescription>
                </div>
                <Button size="sm">Invite Member</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4 flex items-center justify-between border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback>JD</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">John Doe (You)</p>
                        <p className="text-xs text-muted-foreground mt-1">john@gbk.com</p>
                      </div>
                    </div>
                    <Badge>Owner</Badge>
                  </div>
                  <div className="p-4 flex items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback>SW</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Sarah Williams</p>
                        <p className="text-xs text-muted-foreground mt-1">sarah@gbk.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue="manager">
                        <SelectTrigger className="w-[120px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">Remove</Button>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback>MK</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Mike Kitchen</p>
                        <p className="text-xs text-muted-foreground mt-1">mike@gbk.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue="kitchen">
                        <SelectTrigger className="w-[120px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-primary ring-1 ring-primary">
                      <Laptop className="w-6 h-6" /> System
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center text-black">☼</div> Light
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-950 text-white hover:bg-slate-900 hover:text-white">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">☾</div> Dark
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Localization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="cst">Central Time (CST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your restaurant configuration and system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
            {SETTINGS_TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={`justify-start whitespace-nowrap ${activeTab === tab.id ? 'bg-muted font-medium' : 'text-muted-foreground font-normal'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </Button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}