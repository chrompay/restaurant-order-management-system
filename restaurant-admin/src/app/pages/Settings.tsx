import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Loader2, Store, User, Bell, Shield, Users, Palette, Laptop, Plus, Trash2 } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { resolveAssetUrl } from '@/lib/assetUrl';

import { useRestaurantSettings } from '@/features/settings/hooks/useRestaurantSettings';
import { useUpdateRestaurantSettings } from '@/features/settings/hooks/useUpdateRestaurantSettings';
import { useNotificationPreferences } from '@/features/settings/hooks/useNotificationPreferences';
import { useUpdateNotificationPreferences } from '@/features/settings/hooks/useUpdateNotificationPreferences';
import { useTeamMembers } from '@/features/settings/hooks/useTeamMembers';
import { useInviteTeamMember } from '@/features/settings/hooks/useInviteTeamMember';
import { useUpdateUserRole } from '@/features/settings/hooks/useUpdateUserRole';
import { useRemoveTeamMember } from '@/features/settings/hooks/useRemoveTeamMember';
import { useUpdateProfile } from '@/features/settings/hooks/useUpdateProfile';
import { useChangePassword } from '@/features/settings/hooks/useChangePassword';

import {
  restaurantProfileSchema,
  type RestaurantProfileFormValues,
  myAccountSchema,
  type MyAccountFormValues,
  changePasswordSchema,
  type ChangePasswordFormValues,
  inviteTeamMemberSchema,
  type InviteTeamMemberFormValues,
} from '@/features/settings/schemas/settings.schema';
import type { BusinessHour, RestaurantSettings, TeamMember, TeamRole } from '@/features/settings/types/settings.types';

// `general` (restaurant profile) and `team` are gated to admin on the backend
// (`GET/PATCH /api/settings/restaurant`, `/api/users/team*`) — hide them from
// everyone else rather than showing a tab that will just 403.
const SETTINGS_TABS = [
  { id: 'general', label: 'Restaurant Profile', icon: <Store className="w-4 h-4" />, roles: ['admin'] },
  { id: 'profile', label: 'My Account', icon: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'team', label: 'Roles & Permissions', icon: <Users className="w-4 h-4" />, roles: ['admin'] },
  { id: 'appearance', label: 'System Preferences', icon: <Palette className="w-4 h-4" /> },
] as { id: string; label: string; icon: React.ReactElement; roles?: string[] }[];

const TEAM_ROLES: TeamRole[] = ['admin', 'manager', 'kitchen'];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

function formatTimeLabel(value: string) {
  const [hourStr] = value.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, '0')}:00 ${period}`;
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return (parts.slice(0, 2).map((part) => part[0] ?? '').join('') || '?').toUpperCase();
}

export default function Settings() {
  const { user } = useAuth();
  const visibleTabs = SETTINGS_TABS.filter((tab) => !tab.roles || (!!user?.role && tab.roles.includes(user.role)));
  const [activeTab, setActiveTab] = useState(() => visibleTabs[0]?.id ?? 'profile');

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
            {visibleTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
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
          {activeTab === 'general' && <RestaurantProfileTab />}
          {activeTab === 'profile' && <MyAccountTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Restaurant Profile
// ----------------------------------------------------------------------------

function RestaurantProfileTab() {
  const { data, isLoading, isError } = useRestaurantSettings();

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  if (isError || !data) {
    return <div className="text-center text-destructive py-12">Failed to load restaurant settings.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <RestaurantInfoForm settings={data.data} />
      <BusinessHoursCard settings={data.data} />
    </div>
  );
}

function RestaurantInfoForm({ settings }: { settings: RestaurantSettings }) {
  const updateSettings = useUpdateRestaurantSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantProfileFormValues>({
    resolver: zodResolver(restaurantProfileSchema),
    defaultValues: {
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
    },
  });

  const onSubmit = (values: RestaurantProfileFormValues) => {
    updateSettings.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your primary business details visible to customers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input id="restaurantName" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register('phone')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-muted/20">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function BusinessHoursCard({ settings }: { settings: RestaurantSettings }) {
  const updateSettings = useUpdateRestaurantSettings();
  const [hours, setHours] = useState<BusinessHour[]>(settings.businessHours);

  const updateDay = (index: number, patch: Partial<BusinessHour>) => {
    setHours((prev) => prev.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
        <CardDescription>Set your standard operational hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hours.map((day, index) => (
          <div key={day.day} className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-[150px]">
              <Switch checked={day.isOpen} onCheckedChange={(v) => updateDay(index, { isOpen: v })} />
              <Label className="font-normal">{day.day}</Label>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Select
                value={day.openTime}
                onValueChange={(v) => updateDay(index, { openTime: v })}
                disabled={!day.isOpen}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{formatTimeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">-</span>
              <Select
                value={day.closeTime}
                onValueChange={(v) => updateDay(index, { closeTime: v })}
                disabled={!day.isOpen}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{formatTimeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/20">
        <Button onClick={() => updateSettings.mutate({ businessHours: hours })} disabled={updateSettings.isPending}>
          {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Hours
        </Button>
      </CardFooter>
    </Card>
  );
}

// ----------------------------------------------------------------------------
// My Account
// ----------------------------------------------------------------------------

function MyAccountTab() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <MyAccountForm user={user} />
    </div>
  );
}

function MyAccountForm({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const updateProfile = useUpdateProfile();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MyAccountFormValues>({
    resolver: zodResolver(myAccountSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone ?? '',
      address: user.address ?? '',
      avatar: null,
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit = (values: MyAccountFormValues) => {
    updateProfile.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
          <CardDescription>Manage your personal profile and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={previewUrl ?? resolveAssetUrl(user.avatar)} />
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="max-w-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setValue('avatar', file);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(file ? URL.createObjectURL(file) : undefined);
                }}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG or WEBP. Max size of 2MB.</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email Address</Label>
            <Input id="userEmail" type="email" value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-muted/20">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// ----------------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------------

function NotificationsTab() {
  const { data, isLoading, isError } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  if (isLoading) {
    return <Skeleton className="h-80 w-full rounded-lg" />;
  }

  if (isError || !data) {
    return <div className="text-center text-destructive py-12">Failed to load notification preferences.</div>;
  }

  const prefs = data.data;

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
              <Switch
                checked={prefs.newOrders}
                disabled={updatePreferences.isPending}
                onCheckedChange={(v) => updatePreferences.mutate({ newOrders: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base">Order Cancellations</Label>
                <p className="text-sm text-muted-foreground">Get notified when a customer cancels an order.</p>
              </div>
              <Switch
                checked={prefs.cancellations}
                disabled={updatePreferences.isPending}
                onCheckedChange={(v) => updatePreferences.mutate({ cancellations: v })}
              />
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
              <Switch
                checked={prefs.dailySummary}
                disabled={updatePreferences.isPending}
                onCheckedChange={(v) => updatePreferences.mutate({ dailySummary: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base">Product Updates</Label>
                <p className="text-sm text-muted-foreground">Hear about new features and system updates.</p>
              </div>
              <Switch
                checked={prefs.productUpdates}
                disabled={updatePreferences.isPending}
                onCheckedChange={(v) => updatePreferences.mutate({ productUpdates: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Security
// ----------------------------------------------------------------------------

function SecurityTab() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPass">Current Password</Label>
              <Input id="currentPass" type="password" {...register('currentPassword')} />
              {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPass">New Password</Label>
              <Input id="newPass" type="password" {...register('newPassword')} />
              {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPass">Confirm New Password</Label>
              <Input id="confirmPass" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" variant="outline" className="mt-2" disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>

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
}

// ----------------------------------------------------------------------------
// Team
// ----------------------------------------------------------------------------

function TeamTab() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, isError } = useTeamMembers();
  const updateRole = useUpdateUserRole();
  const removeMember = useRemoveTeamMember();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  const members = data?.data ?? [];

  const handleRemove = () => {
    if (!removeTarget) return;
    removeMember.mutate(removeTarget._id, { onSuccess: () => setRemoveTarget(null) });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage who has access to the system.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsInviteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading team members...</p>
          ) : isError ? (
            <p className="text-sm text-destructive text-center py-8">Failed to load team members.</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No team members yet.</p>
          ) : (
            <div className="rounded-md border">
              {members.map((member, index) => {
                const isYou = member._id === currentUser?._id;

                return (
                  <div
                    key={member._id}
                    className={`p-4 flex items-center justify-between ${index !== members.length - 1 ? 'border-b' : ''} ${isYou ? 'bg-muted/20' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {member.avatar && <AvatarImage src={resolveAssetUrl(member.avatar)} />}
                        <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{member.fullName}{isYou ? ' (You)' : ''}</p>
                        <p className="text-xs text-muted-foreground mt-1">{member.email}</p>
                      </div>
                    </div>

                    {isYou ? (
                      <Badge className="capitalize">{member.role}</Badge>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Select
                          value={member.role}
                          onValueChange={(v) => updateRole.mutate({ id: member._id, role: v as TeamRole })}
                        >
                          <SelectTrigger className="w-[120px] h-8 capitalize"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TEAM_ROLES.map((role) => (
                              <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 px-2"
                          onClick={() => setRemoveTarget(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{removeTarget?.fullName}"? This will permanently delete their account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove} disabled={removeMember.isPending}>
              {removeMember.isPending ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InviteMemberDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const inviteMember = useInviteTeamMember();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(inviteTeamMemberSchema),
    defaultValues: { fullName: '', email: '', password: '', role: 'kitchen' },
  });

  const role = watch('role');

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: InviteTeamMemberFormValues) => {
    inviteMember.mutate(values, { onSuccess: close });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Create an account for a new team member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="inviteFullName">Full Name</Label>
              <Input id="inviteFullName" {...register('fullName')} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input id="inviteEmail" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invitePassword">Temporary Password</Label>
              <Input id="invitePassword" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={role} onValueChange={(v) => setValue('role', v as TeamRole)}>
                <SelectTrigger id="inviteRole" className="capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEAM_ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? 'Inviting...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// Appearance (decorative - no backend infra requested for this tab)
// ----------------------------------------------------------------------------

function AppearanceTab() {
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
}
