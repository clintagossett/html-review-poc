import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Schema for Artifact Review
// Extending authTables to add email index for password authentication
const schema = defineSchema({
  ...authTables,
  // Override users table to add username field and indexes for password authentication
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    image: v.optional(v.string()),
    // Add username field for user-friendly display
    username: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),
});

export default schema;
