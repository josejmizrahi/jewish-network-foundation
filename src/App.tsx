import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "@/hooks/use-theme";
import { routes } from "@/routes/routes";
import { NavigationProgress } from "@/components/nav/NavigationProgress";
import { PageTransition } from "@/components/nav/PageTransition";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavigationProgress />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;