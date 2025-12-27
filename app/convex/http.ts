import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

/**
 * Serve artifact files via HTTP
 * Pattern: /artifact/{shareToken}/v{version}/{filePath}
 *
 * Examples:
 * - /artifact/abc123/v1/index.html - Serve HTML content directly
 * - /artifact/abc123/v2/assets/logo.png - Serve file from ZIP storage
 */
http.route({
  path: "/artifact/{shareToken}/v{version}/{filePath}",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");

    // Parse URL: /artifact/{shareToken}/v{version}/{filePath}
    const shareToken = pathSegments[2];
    const versionStr = pathSegments[3]; // e.g., "v1", "v2"
    const filePath = pathSegments.slice(4).join("/") || "index.html";

    try {
      // 1. Validate version format
      const versionMatch = versionStr.match(/^v(\d+)$/);
      if (!versionMatch) {
        return new Response("Invalid version format. Expected v1, v2, etc.", {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
      const versionNumber = parseInt(versionMatch[1]);

      // 2. Look up artifact by share token
      const artifact = await ctx.runQuery(
        internal.artifacts.getByShareTokenInternal,
        { shareToken }
      );

      if (!artifact) {
        return new Response("Artifact not found", {
          status: 404,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      // 3. Look up specific version
      const version = await ctx.runQuery(
        internal.artifacts.getVersionByNumberInternal,
        {
          artifactId: artifact._id,
          versionNumber,
        }
      );

      if (!version) {
        return new Response(
          `Version ${versionNumber} not found for this artifact`,
          {
            status: 404,
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
      }

      // 4. Handle different file types
      if (version.fileType === "html" && version.htmlContent) {
        // Inline HTML - serve directly
        return new Response(version.htmlContent, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      }

      if (version.fileType === "zip") {
        // ZIP file - look up individual file
        const decodedPath = decodeURIComponent(filePath);
        const file = await ctx.runQuery(internal.artifacts.getFileByPath, {
          versionId: version._id,
          filePath: decodedPath,
        });

        if (!file) {
          return new Response(`File not found: ${decodedPath}`, {
            status: 404,
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }

        // Fetch file from Convex storage
        const fileUrl = await ctx.storage.getUrl(file.storageId);
        if (!fileUrl) {
          return new Response("File not accessible in storage", {
            status: 500,
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }

        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          return new Response("Failed to fetch file from storage", {
            status: 500,
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }

        const fileBuffer = await fileResponse.arrayBuffer();

        return new Response(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": file.mimeType,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      }

      // Unsupported file type
      return new Response(
        `Unsupported file type: ${version.fileType}. Only HTML and ZIP are supported.`,
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    } catch (error) {
      console.error("Error serving artifact file:", error);
      return new Response("Internal server error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }),
});

export default http;
