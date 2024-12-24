import { Navigate } from "react-router-dom";
import { NonAuthRoute } from "@/components/auth/NonAuthRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import VerificationManagement from "@/pages/VerificationManagement";

export const routes = [
  // Public Routes
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/about",
    element: (
      <NonAuthRoute>
        <About />
      </NonAuthRoute>
    ),
  },

  // Protected Routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events",
    element: (
      <ProtectedRoute>
        <Events />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/:id",
    element: (
      <ProtectedRoute>
        <EventDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verification-management",
    element: (
      <ProtectedRoute>
        <VerificationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/community",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/resources",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  // Catch all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];