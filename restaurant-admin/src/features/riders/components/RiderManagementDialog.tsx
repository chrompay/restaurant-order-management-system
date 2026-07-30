import { useState } from "react";
import { Car, Bike, Plus, Edit, MapPin } from "lucide-react";

import { useRiders } from "../hooks/useRiders";
import { useCreateRider } from "../hooks/useCreateRider";
import { useUpdateRider } from "../hooks/useUpdateRider";
import { useUpdateRiderLocation } from "../hooks/useUpdateRiderLocation";
import RiderForm from "./RiderForm";
import type { Rider, RiderStatus } from "../types/rider.types";
import type { RiderFormValues } from "../schemas/rider.schema";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { ScrollArea } from "@/app/components/ui/scroll-area";

const STATUSES: RiderStatus[] = ["available", "en_route", "returning", "offline"];

interface RiderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RiderManagementDialog({ open, onOpenChange }: RiderManagementDialogProps) {
  const [editingRider, setEditingRider] = useState<Rider | null | 'new'>(null);
  const [locationDraft, setLocationDraft] = useState<{ id: string; lat: string; lng: string } | null>(null);

  const { data } = useRiders();
  const riders = data?.data ?? [];

  const createRider = useCreateRider();
  const updateRider = useUpdateRider();
  const updateLocation = useUpdateRiderLocation();

  const handleFormSubmit = (values: RiderFormValues) => {
    if (editingRider && editingRider !== 'new') {
      updateRider.mutate({ id: editingRider._id, values }, { onSuccess: () => setEditingRider(null) });
    } else {
      createRider.mutate(values, { onSuccess: () => setEditingRider(null) });
    }
  };

  const handleStatusChange = (rider: Rider, status: RiderStatus) => {
    updateRider.mutate({ id: rider._id, values: { status } });
  };

  const handleSaveLocation = () => {
    if (!locationDraft) return;
    const lat = parseFloat(locationDraft.lat);
    const lng = parseFloat(locationDraft.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    updateLocation.mutate(
      { id: locationDraft.id, values: { lat, lng } },
      { onSuccess: () => setLocationDraft(null) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setEditingRider(null); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Fleet</DialogTitle>
          <DialogDescription>Add riders, update their status, and set their current location.</DialogDescription>
        </DialogHeader>

        {editingRider ? (
          <RiderForm
            rider={editingRider === 'new' ? undefined : editingRider}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingRider(null)}
            isSubmitting={createRider.isPending || updateRider.isPending}
          />
        ) : (
          <>
            <Button size="sm" className="w-fit" onClick={() => setEditingRider('new')}>
              <Plus className="mr-2 h-4 w-4" /> Add Rider
            </Button>

            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 pr-3">
                {riders.map((rider) => (
                  <Card key={rider._id}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {rider.vehicleType === 'bike' ? <Bike className="w-4 h-4 shrink-0 text-muted-foreground" /> : <Car className="w-4 h-4 shrink-0 text-muted-foreground" />}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{rider.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{rider.phone}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingRider(rider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select value={rider.status} onValueChange={(v) => handleStatusChange(rider, v as RiderStatus)}>
                          <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {locationDraft?.id === rider._id ? (
                          <>
                            <Input
                              className="h-8 w-20 text-xs"
                              placeholder="lat"
                              value={locationDraft.lat}
                              onChange={(e) => setLocationDraft({ ...locationDraft, lat: e.target.value })}
                            />
                            <Input
                              className="h-8 w-20 text-xs"
                              placeholder="lng"
                              value={locationDraft.lng}
                              onChange={(e) => setLocationDraft({ ...locationDraft, lng: e.target.value })}
                            />
                            <Button size="sm" className="h-8" onClick={handleSaveLocation} disabled={updateLocation.isPending}>
                              Save
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 shrink-0"
                            onClick={() => setLocationDraft({
                              id: rider._id,
                              lat: rider.location?.lat?.toString() ?? '',
                              lng: rider.location?.lng?.toString() ?? '',
                            })}
                          >
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Location
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {riders.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No riders yet. Add one to get started.</p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
