# Routing Patterns Guide

Practical guide for implementing routes in this Next.js App Router application.

## When to Create Pages vs Components

### Create a Page (`app/*/page.tsx`) When:

- ✅ User needs a dedicated URL (can bookmark, share, refresh)
- ✅ Need SEO (meta tags, Open Graph, server rendering)
- ✅ Part of navigation flow (links from elsewhere in app)
- ✅ Email links need to route here (password reset, verification)
- ✅ Analytics need to track page views

**Examples:**
- `/sign-in` - Shareable, SEO needed, email routing
- `/dashboard` - Bookmarkable, navigation destination
- `/documents/[id]` - Deep linkable, sharable URLs

### Create a Component (`components/*.tsx`) When:

- ✅ Reusable UI element (button, form, card)
- ✅ Part of a larger page (sidebar, header, modal)
- ✅ Conditional display based on state (modals, dropdowns, tabs)
- ✅ No dedicated URL needed

**Examples:**
- `<SignInForm />` - Used inside `/sign-in/page.tsx`
- `<CommentSidebar />` - Part of document viewer page
- `<Modal />` - Conditional overlay, not a destination

## File-Based Routing Conventions

### Basic Structure

```
app/src/app/
├── page.tsx                    # Public: / (landing)
├── layout.tsx                  # Root layout (wraps all pages)
│
├── sign-in/
│   └── page.tsx                # Public: /sign-in
│
├── sign-up/
│   └── page.tsx                # Public: /sign-up
│
├── reset-password/
│   └── page.tsx                # Public: /reset-password
│
├── verify-email/
│   └── page.tsx                # Public: /verify-email
│
└── (dashboard)/                # Route Group (URL omitted)
    ├── layout.tsx              # Protected layout
    ├── page.tsx                # Protected: /dashboard (not /dashboard/dashboard)
    ├── documents/
    │   ├── page.tsx            # Protected: /documents
    │   └── [id]/
    │       └── page.tsx        # Protected: /documents/abc123
    └── settings/
        └── page.tsx            # Protected: /settings
```

### Route Groups

**Use parentheses `(group-name)` to:**
- Organize routes without affecting URLs
- Share layouts among related pages
- Separate protected from public routes

**Example:**
```
app/src/app/
├── (public)/                   # Route Group
│   ├── layout.tsx              # Public layout (header/footer)
│   ├── page.tsx                # URL: /
│   ├── sign-in/page.tsx        # URL: /sign-in (not /public/sign-in)
│   └── sign-up/page.tsx        # URL: /sign-up
│
└── (dashboard)/                # Route Group
    ├── layout.tsx              # Protected layout (auth check)
    ├── page.tsx                # URL: /dashboard (not /dashboard/dashboard)
    └── documents/page.tsx      # URL: /documents
```

### Dynamic Routes

**Use brackets `[param]` for dynamic segments:**

```tsx
// app/src/app/documents/[id]/page.tsx
export default function DocumentPage({ params }: { params: { id: string } }) {
  return <div>Document ID: {params.id}</div>;
}

// URL: /documents/abc123
// params.id === "abc123"
```

**Multiple dynamic segments:**
```tsx
// app/src/app/teams/[teamId]/projects/[projectId]/page.tsx
export default function ProjectPage({
  params,
}: {
  params: { teamId: string; projectId: string };
}) {
  return <div>Team: {params.teamId}, Project: {params.projectId}</div>;
}

// URL: /teams/team-1/projects/proj-5
```

## Authentication Redirect Patterns

### Protecting Routes with Middleware

**Recommended approach for this app:**

```tsx
// app/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('convex_auth_token');
  const { pathname } = request.nextUrl;

  // Protected routes require authentication
  const protectedPaths = ['/dashboard', '/documents', '/settings'];
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedRoute && !token) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated users shouldn't access auth pages
  const authPaths = ['/sign-in', '/sign-up'];
  const isAuthRoute = authPaths.includes(pathname);

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Protected Layout Pattern

**Alternative: Layout-based protection (use with middleware):**

```tsx
// app/src/app/(dashboard)/layout.tsx
'use client';

import { useConvexAuth } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect happening
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Post-Authentication Redirects

**Save intended destination, redirect after login:**

```tsx
// app/src/app/sign-in/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn } = useAuthActions();

  const handleSignIn = async (email: string, password: string) => {
    await signIn('password', { email, password });

    // Redirect to saved location or default to dashboard
    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  return <SignInForm onSubmit={handleSignIn} />;
}
```

**Usage:**
```tsx
// Link that preserves current page
<Link href={`/sign-in?redirect=${pathname}`}>Sign In</Link>

// Middleware sets redirect automatically (see middleware example above)
```

## SEO Considerations

### Public vs Private Pages

| Page Type | SEO Needed | Meta Tags | Indexed |
|-----------|-----------|-----------|---------|
| Landing (`/`) | ✅ Yes | Full (title, description, OG, schema) | Yes |
| Sign In | ✅ Yes | Basic (title, description) | Yes |
| Sign Up | ✅ Yes | Basic (title, description) | Yes |
| Dashboard | ❌ No | Just title | No (robots.txt, meta robots) |
| Documents | ❌ No | Just title | No |
| Settings | ❌ No | Just title | No |

### Metadata API Patterns

**Static metadata (most pages):**
```tsx
// app/src/app/sign-in/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Artifact Review',
  description: 'Sign in to review and collaborate on AI-generated artifacts',
  openGraph: {
    title: 'Sign In | Artifact Review',
    description: 'Sign in to review and collaborate on AI-generated artifacts',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignInPage() {
  return <SignInForm />;
}
```

**Dynamic metadata (document pages):**
```tsx
// app/src/app/documents/[id]/page.tsx
import type { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const document = await fetchQuery(api.documents.get, { id: params.id });

  return {
    title: `${document.name} | Artifact Review`,
    description: `Review and collaborate on ${document.name}`,
    robots: {
      index: false, // Private content
      follow: false,
    },
  };
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  return <DocumentViewer documentId={params.id} />;
}
```

**Landing page with full SEO:**
```tsx
// app/src/app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artifact Review | Collaborate on AI-Generated Artifacts',
  description:
    'Upload, share, and collaboratively review AI-generated HTML artifacts from Claude Code, Cursor, and other AI agents. From AI output to stakeholder feedback in one click.',
  keywords: [
    'AI artifacts',
    'HTML review',
    'collaboration',
    'Claude Code',
    'AI agents',
  ],
  openGraph: {
    title: 'Artifact Review | Collaborate on AI-Generated Artifacts',
    description:
      'Upload, share, and collaboratively review AI-generated HTML artifacts.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artifact Review',
    description:
      'Collaborate on AI-generated artifacts. From AI output to stakeholder feedback in one click.',
    images: ['/og-image.png'],
  },
};

export default function LandingPage() {
  return <LandingPageContent />;
}
```

### robots.txt

**Prevent indexing of protected pages:**

```txt
# app/public/robots.txt
User-agent: *
Allow: /
Allow: /sign-in
Allow: /sign-up
Disallow: /dashboard
Disallow: /documents
Disallow: /settings
Disallow: /api/

Sitemap: https://artifactreview.com/sitemap.xml
```

## Navigation Components

### Link Component

**Use `next/link` for all internal navigation:**

```tsx
import Link from 'next/link';

// Basic link
<Link href="/dashboard">Go to Dashboard</Link>

// With styling
<Link
  href="/sign-in"
  className="text-blue-600 hover:underline"
>
  Sign In
</Link>

// Active link styling
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}
    >
      {children}
    </Link>
  );
}
```

### Programmatic Navigation

**Use `useRouter` for navigation after actions:**

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    await createAccount(email, password);

    // Navigate after successful signup
    router.push('/dashboard');

    // Or with query params
    router.push('/dashboard?welcome=true');

    // Or go back
    router.back();

    // Or refresh current page
    router.refresh();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Query Parameters

**Reading query parameters:**

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const success = searchParams.get('success') === 'true';

  return (
    <div>
      {success && <div>Password reset successful!</div>}
      {token && <PasswordResetForm token={token} email={email} />}
    </div>
  );
}
```

**Setting query parameters:**

```tsx
import { useRouter, useSearchParams } from 'next/navigation';

const router = useRouter();
const searchParams = useSearchParams();

const updateFilter = (filter: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set('filter', filter);
  router.push(`?${params.toString()}`);
};

// URL changes from /documents to /documents?filter=recent
```

## Email Routing Examples

### Password Reset Flow

**Email template:**
```html
<a href="https://app.example.com/reset-password?token={{reset_token}}&email={{email}}">
  Reset Your Password
</a>
```

**Page implementation:**
```tsx
// app/src/app/reset-password/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return (
      <div>
        <h1>Invalid Reset Link</h1>
        <p>Please request a new password reset.</p>
        <Link href="/sign-in">Back to Sign In</Link>
      </div>
    );
  }

  const handleReset = async (newPassword: string) => {
    try {
      await signIn('password', { email, password: newPassword, token });
      router.push('/dashboard?reset=success');
    } catch (err) {
      setError('Invalid or expired reset link');
    }
  };

  return <PasswordResetForm email={email} onSubmit={handleReset} error={error} />;
}
```

### Email Verification Flow

**Email template:**
```html
<a href="https://app.example.com/verify-email?token={{verification_token}}&email={{email}}">
  Verify Your Email
</a>
```

**Page implementation:**
```tsx
// app/src/app/verify-email/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verifyEmail = useMutation(api.auth.verifyEmail);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      return;
    }

    verifyEmail({ token, email })
      .then(() => {
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      })
      .catch(() => setStatus('error'));
  }, [searchParams, verifyEmail, router]);

  if (status === 'verifying') {
    return <div>Verifying your email...</div>;
  }

  if (status === 'success') {
    return <div>Email verified! Redirecting to dashboard...</div>;
  }

  return (
    <div>
      <h1>Verification Failed</h1>
      <p>Your verification link is invalid or expired.</p>
      <Link href="/sign-in">Back to Sign In</Link>
    </div>
  );
}
```

## Common Patterns Summary

### Pattern: Redirect After Authentication

```tsx
// Sign in page saves redirect URL
const redirect = searchParams.get('redirect') || '/dashboard';
router.push(redirect);
```

### Pattern: Conditional Page Content

```tsx
// Show different content based on query params
const success = searchParams.get('success') === 'true';
return success ? <SuccessMessage /> : <Form />;
```

### Pattern: Protected Route

```tsx
// Middleware redirects to sign-in with redirect param
// Layout checks auth and shows loading/redirect states
// Page renders normally for authenticated users
```

### Pattern: Public Page with SEO

```tsx
// Export static metadata
// Use semantic HTML
// Include structured data if relevant
// Add to sitemap.xml
```

## Anti-Patterns to Avoid

❌ **Don't use client-side state for routing**
```tsx
// BAD
const [page, setPage] = useState('landing');
return page === 'landing' ? <Landing /> : <Dashboard />;
```

✅ **Use file-based routing**
```tsx
// GOOD
// app/landing/page.tsx
// app/dashboard/page.tsx
```

---

❌ **Don't forget to handle loading states**
```tsx
// BAD
if (!isAuthenticated) {
  router.push('/sign-in');
}
return <Dashboard />; // Flashes before redirect
```

✅ **Handle loading properly**
```tsx
// GOOD
if (isLoading) return <Loading />;
if (!isAuthenticated) {
  router.push('/sign-in');
  return null;
}
return <Dashboard />;
```

---

❌ **Don't use `<a>` tags for internal links**
```tsx
// BAD - causes full page reload
<a href="/dashboard">Dashboard</a>
```

✅ **Use Next.js `<Link>`**
```tsx
// GOOD - client-side navigation
<Link href="/dashboard">Dashboard</Link>
```

---

❌ **Don't hardcode metadata in components**
```tsx
// BAD
export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <SignInForm />
    </>
  );
}
```

✅ **Export metadata from page**
```tsx
// GOOD
export const metadata = {
  title: 'Sign In | Artifact Review',
};

export default function SignInPage() {
  return <SignInForm />;
}
```

## Related Documentation

- [ADR 0008: Next.js App Router for Routing](../architecture/decisions/0008-nextjs-app-router-for-routing.md)
- [ADR 0006: Frontend Stack](../architecture/decisions/0006-frontend-stack.md)
- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
