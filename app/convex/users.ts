import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createLogger, Topics } from "./lib/logger";

const log = createLogger("users");

// Get current user information
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      username: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    log.debug(Topics.Auth, "getCurrentUser called");

    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      log.debug(Topics.Auth, "No authenticated user");
      return null;
    }

    log.debug(Topics.Auth, "User ID retrieved", { userId: userId.toString() });

    const user = await ctx.db.get(userId);

    if (!user) {
      log.warn(Topics.Auth, "User ID exists but user record not found", {
        userId: userId.toString(),
        recovery: "Check if user was deleted or auth is out of sync",
      });
      return null;
    }

    log.info(Topics.Auth, "User retrieved successfully", {
      userId: user._id.toString(),
      isAnonymous: user.isAnonymous,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      isAnonymous: user.isAnonymous,
    };
  },
});

// Get user by email (for password authentication)
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    log.debug(Topics.User, "getByEmail called", { email: args.email });

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      log.debug(Topics.User, "Email not found", { email: args.email });
      return null;
    }

    log.info(Topics.User, "User found by email", {
      userId: user._id.toString(),
      email: args.email,
    });

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAnonymous: user.isAnonymous,
    };
  },
});

// Get user by username
export const getByUsername = query({
  args: {
    username: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      username: v.optional(v.string()),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    log.debug(Topics.User, "getByUsername called", { username: args.username });

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) {
      log.debug(Topics.User, "Username not found", { username: args.username });
      return null;
    }

    log.info(Topics.User, "User found by username", {
      userId: user._id.toString(),
      username: args.username,
    });

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAnonymous: user.isAnonymous,
    };
  },
});
