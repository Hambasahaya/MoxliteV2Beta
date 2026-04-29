import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./authContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: boolean;
}

/**
 * Protected Route Component
 * Wraps components that require authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredAuth = true,
}) => {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requiredAuth && !isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [loading, isAuthenticated, requiredAuth, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3E9C92] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (requiredAuth && !isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return <>{children}</>;
};

/**
 * Hook to check if user is authenticated for downloads
 */
export const useCanDownload = (): boolean => {
  const { isAuthenticated, loading } = useAuth();
  return !loading && isAuthenticated;
};

export default ProtectedRoute;
