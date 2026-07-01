import { createBrowserRouter } from "react-router";
import AppLayout from "./layouts/AppLayout";

import Foundation from "./pages/Foundation";
import Components from "./pages/Components";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Foods from "./pages/Foods";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Kitchen from "./pages/Kitchen";
import Delivery from "./pages/Delivery";

import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  // ===========================
  // Public Routes
  // ===========================
  {
    path: "/login",
    Component: LoginPage,
  },

  // ===========================
  // Protected Routes
  // ===========================
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: AppLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "dashboard", Component: Dashboard },

          // Operations
          { path: "operations/orders", Component: Orders },
          { path: "operations/kitchen", Component: Kitchen },
          { path: "operations/delivery", Component: Delivery },

          // Menu Management
          { path: "menu/foods", Component: Foods },
          { path: "menu/categories", Component: Categories },

          // Other
          { path: "customers", Component: Customers },
          { path: "analytics", Component: Analytics },
          { path: "settings", Component: Settings },

          // Design System
          { path: "foundation", Component: Foundation },
          { path: "components", Component: Components },
          { path: "system/foundation", Component: Foundation },
          { path: "system/components", Component: Components },
        ],
      },
    ],
  },

  // Legacy direct routes
  {
    path: "/components",
    Component: Components,
  },
  {
    path: "/components/*",
    Component: Components,
  },
  {
    path: "/foundation",
    Component: Foundation,
  },
  {
    path: "/foundation/*",
    Component: Foundation,
  },

  // 404
  {
    path: "*",
    Component: () => (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <h2 className="text-2xl font-semibold">
          Page Not Found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The requested route could not be found.
        </p>

        <a
          href="/"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Go Home
        </a>
      </div>
    ),
  },
]);