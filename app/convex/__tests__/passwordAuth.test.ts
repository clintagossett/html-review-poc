import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";

describe("Password Authentication Schema", () => {
  it("should allow creating user with username and email", async () => {
    const t = convexTest(schema);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        username: "testuser",
        email: "testuser@local.app",
        isAnonymous: false,
      });
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(user).not.toBeNull();
    expect(user?.username).toBe("testuser");
    expect(user?.email).toBe("testuser@local.app");
  });

  it("should query user by username using index", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        username: "alice",
        email: "alice@local.app",
        isAnonymous: false,
      });
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", "alice"))
        .unique();
    });

    expect(user).not.toBeNull();
    expect(user?.username).toBe("alice");
  });

  it("should query user by email using index", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        username: "bob",
        email: "bob@local.app",
        isAnonymous: false,
      });
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", "bob@local.app"))
        .unique();
    });

    expect(user).not.toBeNull();
    expect(user?.email).toBe("bob@local.app");
  });
});

describe("User Queries", () => {
  it("should get user by username", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        username: "queryuser",
        email: "queryuser@local.app",
        isAnonymous: false,
      });
    });

    const user = await t.query(api.users.getByUsername, {
      username: "queryuser",
    });

    expect(user).not.toBeNull();
    expect(user?.username).toBe("queryuser");
  });

  it("should return null for non-existent username", async () => {
    const t = convexTest(schema);

    const user = await t.query(api.users.getByUsername, {
      username: "nonexistent",
    });

    expect(user).toBeNull();
  });
});

describe("Password Authentication Provider", () => {
  it("should have Password provider configured", async () => {
    const t = convexTest(schema);

    // Verify auth system is exported correctly
    expect(api.auth.signIn).toBeDefined();
    expect(api.auth.signOut).toBeDefined();
  });

  // Note: Full password registration and sign-in flows are tested in E2E tests
  // because they require JWT_PRIVATE_KEY environment variable and full auth setup.
  // The convex-test library doesn't fully support Convex Auth actions in isolation.
});
