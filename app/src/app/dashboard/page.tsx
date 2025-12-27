"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardHeader } from "@/components/artifacts/DashboardHeader";
import { ArtifactList } from "@/components/artifacts/ArtifactList";
import { EmptyState } from "@/components/artifacts/EmptyState";
import { NewArtifactDialog } from "@/components/artifacts/NewArtifactDialog";
import { useArtifactUpload } from "@/hooks/useArtifactUpload";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import type { Id } from "../../../convex/_generated/dataModel";

/**
 * Dashboard Page - Main dashboard view
 */
export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const artifacts = useQuery(api.artifacts.list);
  const [isNewArtifactOpen, setIsNewArtifactOpen] = useState(false);
  const { uploadFile } = useArtifactUpload();

  const handleUploadClick = () => {
    setIsNewArtifactOpen(true);
  };

  const handleNewArtifact = () => {
    setIsNewArtifactOpen(true);
  };

  const handleArtifactClick = (id: Id<"artifacts">) => {
    // Navigate to artifact viewer
    const artifact = artifacts?.find((a) => a._id === id);
    if (artifact) {
      router.push(`/a/${artifact.shareToken}`);
    }
  };

  const handleCreateArtifact = async (data: {
    file: File;
    title: string;
    description?: string;
  }) => {
    const result = await uploadFile(data);
    // Navigate to the newly created artifact
    router.push(`/a/${result.shareToken}`);
  };

  return (
    <ProtectedPage>
      {/* Loading state while data is fetching */}
      {(currentUser === undefined || artifacts === undefined) && (
        <div className="flex h-screen items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}

      {/* Dashboard content */}
      {currentUser !== undefined && artifacts !== undefined && (
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader
            onUploadClick={handleUploadClick}
            onInviteClick={() => console.log("Invite clicked")}
            userEmail={currentUser.email}
            userName={currentUser.name}
          />

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {artifacts.length === 0 ? (
              <EmptyState onCreateFirst={handleNewArtifact} />
            ) : (
              <ArtifactList
                artifacts={artifacts}
                versionsMap={{}}
                onArtifactClick={handleArtifactClick}
                onNewArtifact={handleNewArtifact}
              />
            )}
          </main>

          <NewArtifactDialog
            open={isNewArtifactOpen}
            onOpenChange={setIsNewArtifactOpen}
            onCreateArtifact={handleCreateArtifact}
          />
        </div>
      )}
    </ProtectedPage>
  );
}
