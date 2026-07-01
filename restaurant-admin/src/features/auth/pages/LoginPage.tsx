import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel */}
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Restaurant Admin
            </h1>

            <p className="mt-3 text-muted-foreground">
              Welcome back. Sign in to manage your restaurant.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col justify-center bg-primary p-16 text-primary-foreground">
        <h2 className="text-5xl font-bold leading-tight">
          Run your restaurant
          <br />
          like a modern business.
        </h2>

        <p className="mt-8 text-lg opacity-90 leading-8">
          Monitor orders, manage menus, track customers,
          analyze performance and oversee your kitchen —
          all from one intelligent dashboard.
        </p>
      </div>
    </div>
  );
}