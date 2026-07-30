import { RouterProvider } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}