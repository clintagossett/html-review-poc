/**
 * ProtectedPage Component
 *
 * Wrapper for pages that require authentication.
 * Redirects unauthenticated users to the home page.
 *
 * @example
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedPage>
 *       <Dashboard />
 *     </ProtectedPage>
 *   );
 * }
 */

"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { FullPageSpinner } from "./FullPageSpinner";

interface ProtectedPageProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProtectedPage({
  children,
  loadingComponent,
}: ProtectedPageProps) {
  const { isLoading, isAuthenticated } = useAuthRedirect({
    ifUnauthenticated: "/",
  });

  // Show loading state while checking auth or redirecting
  if (isLoading || !isAuthenticated) {
    return <>{loadingComponent ?? <FullPageSpinner />}</>;
  }

  // User is authenticated - show the page
  return <>{children}</>;
}
