# Task 00014: Forgot Password and Reset Password Implementation

**GitHub Issue:** #14

---

## Resume (Start Here)

**Last Updated:** 2025-12-26 (Session 1)

### Current Status: 🎯 DECISION MADE - READY TO IMPLEMENT

**Phase:** Approach decided, ready for subtask breakdown and implementation.

### What We Did This Session (Session 1)

1. **Created GitHub issue** - Issue #14 created
2. **Researched best practices** - Reviewed modern auth UX (Stytch, Instagram, Slack approach)
3. **Analyzed current auth** - Found we have both password + magic link auth via Convex Auth + Resend
4. **Decided on approach** - Magic link with instructional email text (no deep linking)

### Decision

**Approach: Magic Link with Instructional Email**

Use standard magic link flow, but the forgot password email includes clear instructions telling users how to change their password in settings after they log in.

**User Flow:**
1. User clicks "Forgot password?" on login page
2. Forgot Password page explains the flow and collects email
3. User receives magic link email with **special instructional text** about resetting password in settings
4. User clicks link → authenticated → lands on dashboard
5. User navigates to Settings → changes password

**Why This Approach:**
- Reuses existing magic link infrastructure completely (no modifications)
- Only requires a different email template/copy for forgot password context
- Simplest implementation
- No deep linking or redirect params needed
- Forgot password page + email clearly guide users

### Next Steps

1. **Create forgot password page** - `/app/forgot-password/page.tsx` with explanatory copy
2. **Create ForgotPasswordForm component** - Email input, triggers magic link with "forgot password" context
3. **Create forgot password email template** - Magic link + instructions on how to reset in settings
4. **Create password change section in settings** - Where user actually changes their password
5. **Create ChangePasswordForm component** - Current password (optional?) + new password with validation
6. **Add backend mutation** - `updatePassword` function in Convex
7. **Test end-to-end flow**
8. **Create validation video**

---

## Objective

Implement a forgot password feature that sends users a magic link email with clear instructions on how to reset their password in account settings after logging in.

---

## Technical Requirements

### Frontend

| Component | Location | Purpose |
|-----------|----------|---------|
| Forgot Password Page | `/app/forgot-password/page.tsx` | Explains flow, contains email form |
| ForgotPasswordForm | `/components/auth/ForgotPasswordForm.tsx` | Email input, sends magic link |
| Settings Page | `/app/settings/page.tsx` or similar | Account settings including password |
| ChangePasswordForm | `/components/auth/ChangePasswordForm.tsx` | New password input with validation |

### Backend

| Function | Purpose |
|----------|---------|
| Forgot password email template | Magic link email with reset instructions |
| `updatePassword` mutation | Update user's password in database |

### Email Template Content

The forgot password magic link email should include:
- Standard magic link button
- Clear instructional text: "After signing in, go to Settings → Password to set a new password"
- Same 10-minute expiry as regular magic links

### Existing Infrastructure to Reuse

- Magic link sending via Resend (`signIn("resend", { email })`)
- 10-minute link expiry
- Convex Auth password provider

---

## Acceptance Criteria

- [ ] User can access forgot password page from login (`/forgot-password`)
- [ ] Forgot password page clearly explains the magic link flow
- [ ] User receives magic link email with instructions on resetting password in settings
- [ ] Magic link authenticates user (standard behavior)
- [ ] Settings page has password change section
- [ ] User can set a new password with proper validation
- [ ] Success feedback after password change
- [ ] Appropriate error handling throughout

---

## Files to Create/Modify

### Create
- `app/src/app/forgot-password/page.tsx`
- `app/src/components/auth/ForgotPasswordForm.tsx`
- `app/src/app/settings/page.tsx` (or integrate password into existing settings)
- `app/src/components/auth/ChangePasswordForm.tsx`
- `app/convex/users.ts` - add `updatePassword` mutation
- Forgot password email template (in `auth.ts` or separate)

### Tests
- `tasks/00014-forgot-password-and-reset-password-implementation/tests/`

---

## Open Questions

- Should changing password require current password, or is being logged in enough?
- Does a settings page already exist, or does it need to be created?
