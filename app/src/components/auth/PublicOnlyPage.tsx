/**
 * PublicOnlyPage Component
 *
 * Wrapper for pages that should only be accessible to unauthenticated users.
 * Redirects authenticated users to the dashboard.
 *
 * @example
 * export default function LoginPage() {
 *   return (
 *     <PublicOnlyPage>
 *       <LoginForm />
 *     </PublicOnlyPage>
 *   );
 * }
 */

"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { FullPageSpinner } from "./FullPageSpinner";

interface PublicOnlyPageProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function PublicOnlyPage({
  children,
  loadingComponent,
}: PublicOnlyPageProps) {
  const { isLoading, isAuthenticated } = useAuthRedirect({
    ifAuthenticated: "/dashboard",
  });

  // Show loading state while checking auth
  if (isLoading) {
    return <>{loadingComponent ?? <FullPageSpinner />}</>;
  }

  // Show loading state while redirecting authenticated users
  if (isAuthenticated) {
    return <>{loadingComponent ?? <FullPageSpinner />}</>;
  }

  // User is not authenticated - show the page
  return <>{children}</>;
}
