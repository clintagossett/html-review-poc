"use client";

import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Loading state
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (currentUser === null) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Welcome to Artifact Review</CardTitle>
          <CardDescription>
            {currentUser.email ? `Signed in as ${currentUser.email}` : "Signed in"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span className="text-sm text-muted-foreground font-mono">
                {currentUser._id}
              </span>
            </div>
            {currentUser.email && (
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
            )}
          </div>

          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
