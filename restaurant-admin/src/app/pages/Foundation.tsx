import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Foundation() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Design Foundation</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Core tokens powering the Restaurant Order Management System. Built for high information density, rapid operational tasks, and enterprise scale.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Color System</h2>
          <p className="text-sm text-muted-foreground mb-4">Functional palettes inspired by modern SaaS interfaces like Stripe and Linear.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ColorSwatch name="Background" variable="bg-background" hex="#f8fafc" border />
          <ColorSwatch name="Foreground" variable="bg-foreground" hex="#0f172a" text="text-white" />
          <ColorSwatch name="Card" variable="bg-card" hex="#ffffff" border />
          <ColorSwatch name="Muted" variable="bg-muted" hex="#f1f5f9" border />
          <ColorSwatch name="Primary" variable="bg-primary" hex="#0f172a" text="text-white" />
          <ColorSwatch name="Secondary" variable="bg-secondary" hex="#f1f5f9" border />
          <ColorSwatch name="Border" variable="bg-border" hex="#e2e8f0" border />
          <ColorSwatch name="Destructive" variable="bg-destructive" hex="#ef4444" text="text-white" />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Order Status Colors</h2>
          <p className="text-sm text-muted-foreground mb-4">Semantic colors assigned to specific operational states in the restaurant workflow.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <StatusColorCard status="Pending" color="Amber" bgClass="bg-status-pending-bg" borderClass="border-status-pending" textClass="text-status-pending-fg" />
          <StatusColorCard status="Confirmed" color="Blue" bgClass="bg-status-confirmed-bg" borderClass="border-status-confirmed" textClass="text-status-confirmed-fg" />
          <StatusColorCard status="Preparing" color="Purple" bgClass="bg-status-preparing-bg" borderClass="border-status-preparing" textClass="text-status-preparing-fg" />
          <StatusColorCard status="Out For Delivery" color="Orange" bgClass="bg-status-delivery-bg" borderClass="border-status-delivery" textClass="text-status-delivery-fg" />
          <StatusColorCard status="Delivered" color="Green" bgClass="bg-status-delivered-bg" borderClass="border-status-delivered" textClass="text-status-delivered-fg" />
          <StatusColorCard status="Cancelled" color="Red" bgClass="bg-status-cancelled-bg" borderClass="border-status-cancelled" textClass="text-status-cancelled-fg" />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Typography & Spacing</h2>
          <p className="text-sm text-muted-foreground mb-4">System font stack tailored for data-heavy dashboard interfaces.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end gap-4 border-b pb-4">
                <span className="text-3xl font-semibold w-24">30px</span>
                <div>
                  <h1 className="text-3xl leading-none">Heading 1</h1>
                  <span className="text-xs text-muted-foreground">Semibold, Tracking Tight</span>
                </div>
              </div>
              <div className="flex items-end gap-4 border-b pb-4">
                <span className="text-2xl font-semibold w-24">24px</span>
                <div>
                  <h2 className="text-2xl leading-none">Heading 2</h2>
                  <span className="text-xs text-muted-foreground">Semibold, Tracking Tight</span>
                </div>
              </div>
              <div className="flex items-end gap-4 border-b pb-4">
                <span className="text-xl font-semibold w-24">20px</span>
                <div>
                  <h3 className="text-xl leading-none">Heading 3</h3>
                  <span className="text-xs text-muted-foreground">Semibold, Tracking Tight</span>
                </div>
              </div>
              <div className="flex items-end gap-4 border-b pb-4">
                <span className="text-sm text-muted-foreground w-24">14px (Base)</span>
                <div>
                  <p className="text-sm leading-relaxed">Body text for tables, cards, and forms.</p>
                  <span className="text-xs text-muted-foreground">Normal, Leading Relaxed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Elevation & Radii</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-md border border-border bg-card flex flex-col justify-center items-center">
                  <span className="text-sm font-medium">No Shadow</span>
                  <span className="text-xs text-muted-foreground">Base Level</span>
                </div>
                <div className="h-24 rounded-md border border-border bg-card shadow-sm flex flex-col justify-center items-center">
                  <span className="text-sm font-medium">Shadow SM</span>
                  <span className="text-xs text-muted-foreground">Cards, Buttons</span>
                </div>
                <div className="h-24 rounded-md border border-border bg-card shadow-md flex flex-col justify-center items-center">
                  <span className="text-sm font-medium">Shadow MD</span>
                  <span className="text-xs text-muted-foreground">Dropdowns</span>
                </div>
                <div className="h-24 rounded-md border border-border bg-card shadow-lg flex flex-col justify-center items-center">
                  <span className="text-sm font-medium">Shadow LG</span>
                  <span className="text-xs text-muted-foreground">Modals</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Standard Border Radius</p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs">SM</div>
                  <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs">MD (8px)</div>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs">LG</div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">Full</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ name, variable, hex, border, text }: { name: string, variable: string, hex: string, border?: boolean, text?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-24 w-full rounded-md ${variable} ${border ? 'border border-border' : ''} ${text || ''} flex items-end p-3`}>
        <span className="text-xs font-mono opacity-80">{variable.replace('bg-', '')}</span>
      </div>
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground font-mono uppercase">{hex}</div>
      </div>
    </div>
  )
}

function StatusColorCard({ status, color, bgClass, borderClass, textClass }: { status: string, color: string, bgClass: string, borderClass: string, textClass: string }) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-16 w-full ${bgClass} border-b border-border flex items-center justify-center`}>
        <Badge className={`${bgClass} ${textClass} hover:${bgClass} border-transparent px-3 py-1 text-sm`}>{status}</Badge>
      </div>
      <div className="p-4">
        <div className="text-sm font-medium">{status}</div>
        <div className="text-xs text-muted-foreground mt-1">Palette: {color}</div>
      </div>
    </Card>
  )
}