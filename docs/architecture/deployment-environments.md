# Deployment Environments & SDLC

**Status:** Active
**Last Updated:** 2024-12-24

## Overview

This project uses a 4-tier environment strategy to ensure quality and stability before production deployment.

```
Local Dev → Hosted Dev (Integration) → Staging (Validation) → Production
```

## Architectural Decisions

### Backend: Hosted Convex

**Decision:** Use Convex's hosted cloud service for all environments (not self-hosted Docker).

**Rationale:**
- **Automatic scaling** — Convex handles load balancing, no single-machine limits
- **Managed infrastructure** — No ops burden for backups, monitoring, upgrades
- **Official support** — Full support plan available (self-hosted has no support)
- **Cost-effective** — Cheaper than running and maintaining own infrastructure
- **Local deployments available** — Can still run locally for development via `npx convex dev` with local deployment option

**When self-hosted would be considered:**
- ❌ Data sovereignty requirements (none for this project)
- ❌ Must run in private VPC (not required)
- ❌ Need 100+ ephemeral backends for testing (not our use case)

**See also:** [Convex Self-Hosting Docs](https://docs.convex.dev/self-hosting) explicitly recommends hosted for most projects.

---

### Frontend: Vercel

**Decision:** Use Vercel for frontend hosting across all environments.

**Rationale:**
- **Official Convex integration** — First-class support with [integration guide](https://docs.convex.dev/production/hosting/vercel)
- **Preview deployments** — Automatic preview deploys per PR with separate Convex backends
- **Next.js optimized** — Best-in-class for React/Next.js with SSR, App Router, Server Components
- **Git-based workflow** — Auto-deploy on push to branches
- **Edge network** — Fast global CDN
- **Developer experience** — Simple setup, great tooling

**Platform comparison:**

| Platform | Convex Support | Free Tier | Commercial Use | Best For |
|----------|----------------|-----------|----------------|----------|
| **Vercel** | Official guide | 100GB bandwidth, 6K build min/mo | ❌ Requires Pro ($20/mo) | Next.js, SSR, modern React |
| **Netlify** | Official guide | 100GB bandwidth, 300 build min/mo | ✅ Allowed | JAMstack, static sites |
| **Cloudflare Pages** | Custom setup | Unlimited bandwidth, 500 builds/mo | ✅ Allowed | Static sites, edge performance |

**Cost consideration:**
- This is a commercial SaaS product → Must use Vercel Pro ($20/user/month)
- Alternative: Could use Netlify free tier during MVP (allows commercial use) then upgrade
- Cloudflare Pages has best free tier but requires custom Convex setup

**Recommendation:** Start with Vercel Pro ($20/mo) for best DX and Next.js support.

**See also:**
- [Vercel + Convex Guide](https://docs.convex.dev/production/hosting/vercel)
- [Netlify + Convex Guide](https://docs.convex.dev/production/hosting/netlify)

---

## Infrastructure Compatibility Matrix

This matrix ensures all components are compatible across environments.

| Component | Local Dev | Hosted Dev | Staging | Production |
|-----------|-----------|------------|---------|------------|
| **Frontend Hosting** | Local dev server (`npm run dev`) | Vercel (auto-deploy from `dev` branch) | Vercel (deploy from `staging` branch) | Vercel (deploy from `main` branch) |
| **Frontend Domain** | `localhost:5173` | `dev.yourdomain.com` (or Vercel preview URL) | `staging.yourdomain.com` | `app.yourdomain.com` |
| **Convex Backend** | Hosted cloud (local deployment mode) | Hosted cloud (`dev` project) | Hosted cloud (`staging` project) | Hosted cloud (`prod` project) |
| **Convex URL** | Auto-generated (e.g., `local-animal-123.convex.cloud`) | Auto-generated (e.g., `happy-horse-456.convex.cloud`) | Auto-generated (e.g., `wise-fox-789.convex.cloud`) | Auto-generated (e.g., `brave-lion-012.convex.cloud`) |
| **Database** | Convex managed (isolated dev data) | Convex managed (shared dev data) | Convex managed (staging data) | Convex managed (production data) |
| **HTML Storage** | Convex DB (simple) + R2 (complex) | Convex DB (simple) + R2 (complex) | Convex DB (simple) + R2 (complex) | Convex DB (simple) + R2 (complex) |
| **R2 Bucket** | `html-review-dev` | `html-review-dev` | `html-review-staging` | `html-review-prod` |
| **R2 Public URL** | Dev custom domain or R2 URL | Dev custom domain or R2 URL | Staging custom domain or R2 URL | Production custom domain |
| **Mail Send** | Mailpit SMTP (localhost:1025) | Resend test mode | Resend live (restricted) | Resend live (all users) |
| **Mail Receive** | Not configured (not needed for MVP) | Not configured | Not configured | Not configured* |
| **Email Domain** | N/A (Mailpit captures all) | `dev.yourdomain.com` (test mode, no delivery) | `staging.yourdomain.com` | `yourdomain.com` |
| **Resend API Key** | N/A (no Resend) | Test key | Staging key | Production key |
| **Auth Provider** | Convex Auth | Convex Auth | Convex Auth | Convex Auth |
| **OAuth Apps** | Dev credentials | Dev credentials | Staging credentials | Production credentials |
| **OAuth Redirects** | `http://localhost:5173/auth/callback` | `https://dev.yourdomain.com/auth/callback` | `https://staging.yourdomain.com/auth/callback` | `https://app.yourdomain.com/auth/callback` |

**\*Note on Mail Receive:** Inbound email handling (e.g., reply-to-comment via email) is not required for MVP. If needed in future, consider:
- Resend supports inbound email via webhooks
- Configure per environment with different webhook endpoints
- See [Resend Inbound Email Docs](https://resend.com/docs/dashboard/emails/inbound-emails)

### Configuration Commands

#### Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Link project to Vercel (one time)
vercel link

# Set up Vercel projects for each environment
# 1. Create Vercel project
# 2. Link to GitHub repo
# 3. Configure branch deployment:
#    - dev branch → dev.yourdomain.com
#    - staging branch → staging.yourdomain.com
#    - main branch → app.yourdomain.com

# Set Convex environment variables in Vercel dashboard:
# Project Settings > Environment Variables
# NEXT_PUBLIC_CONVEX_URL = <convex deployment url per environment>
```

#### Cloudflare R2 Setup

```bash
# 1. Create R2 buckets (one-time setup)
# - Go to Cloudflare Dashboard > R2
# - Create buckets: html-review-dev, html-review-staging, html-review-prod
# - Generate API tokens with read/write permissions

# 2. Configure R2 public access (optional, for direct URLs)
# - Enable public access on buckets
# - Set up custom domains (e.g., artifacts-dev.yourdomain.com)

# 3. Get credentials
# R2_ACCOUNT_ID=your-account-id
# R2_ACCESS_KEY_ID=your-access-key
# R2_SECRET_ACCESS_KEY=your-secret-key
```

#### Convex Setup

```bash
# Local Dev (uses local deployment mode)
npx convex dev
# No RESEND_API_KEY needed (uses Mailpit)
# Set R2 credentials
npx convex env set R2_ACCOUNT_ID=xxx
npx convex env set R2_ACCESS_KEY_ID=xxx
npx convex env set R2_SECRET_ACCESS_KEY=xxx
npx convex env set R2_BUCKET=html-review-dev
npx convex env set R2_PUBLIC_URL=https://artifacts-dev.yourdomain.com # optional

# Hosted Dev
npx convex deploy --project dev
npx convex env set RESEND_API_KEY=re_test_xxx --project dev
npx convex env set RESEND_TEST_MODE=true --project dev
npx convex env set R2_ACCOUNT_ID=xxx --project dev
npx convex env set R2_ACCESS_KEY_ID=xxx --project dev
npx convex env set R2_SECRET_ACCESS_KEY=xxx --project dev
npx convex env set R2_BUCKET=html-review-dev --project dev

# Staging
npx convex deploy --project staging
npx convex env set RESEND_API_KEY=re_staging_xxx --project staging
npx convex env set RESEND_TEST_MODE=false --project staging
npx convex env set RESEND_ALLOWED_RECIPIENTS=test@example.com,qa@example.com --project staging
npx convex env set R2_ACCOUNT_ID=xxx --project staging
npx convex env set R2_ACCESS_KEY_ID=xxx --project staging
npx convex env set R2_SECRET_ACCESS_KEY=xxx --project staging
npx convex env set R2_BUCKET=html-review-staging --project staging

# Production
npx convex deploy --project prod
npx convex env set RESEND_API_KEY=re_prod_xxx --project prod
npx convex env set RESEND_TEST_MODE=false --project prod
npx convex env set R2_ACCOUNT_ID=xxx --project prod
npx convex env set R2_ACCESS_KEY_ID=xxx --project prod
npx convex env set R2_SECRET_ACCESS_KEY=xxx --project prod
npx convex env set R2_BUCKET=html-review-prod --project prod
```

#### Vercel + Convex Integration

Vercel automatically deploys frontend + Convex backend together:

1. **Connect Vercel to Convex:**
   - Install Convex integration from Vercel Marketplace
   - Grant access to Convex projects (dev, staging, prod)

2. **Automatic deployment flow:**
   - Push to branch → Vercel builds frontend → `npx convex deploy` runs → Frontend env vars updated

3. **Preview deployments:**
   - Each PR gets a Vercel preview URL + separate Convex preview backend
   - Isolated testing without affecting dev/staging/prod

---

## Environment Details

### 1. Local Development

**Purpose:** Individual developer testing and feature development

| Aspect | Configuration |
|--------|--------------|
| **Frontend** | Local dev server (`npm run dev` via Vite or Next.js) |
| **Frontend URL** | `http://localhost:5173` (Vite) or `http://localhost:3000` (Next.js) |
| **Convex** | Hosted cloud (local deployment mode via `npx convex dev`) |
| **Convex URL** | Auto-generated `*.convex.cloud` (e.g., `local-animal-123.convex.cloud`) |
| **Database** | Convex managed (isolated per developer) |
| **Auth** | Convex Auth with dev OAuth apps |
| **Mail Send** | Mailpit (Docker: `localhost:1025` SMTP, `localhost:8025` web UI) |
| **Mail Receive** | Not configured |
| **Data** | Seed data, can be reset freely |

**Testing:**
- Unit tests run locally with Vitest
- Manual feature testing
- Quick iteration cycle

**Who uses it:** Individual developers

---

### 2. Hosted Dev (Integration)

**Purpose:** Integration testing with real backend, shared team environment

| Aspect | Configuration |
|--------|--------------|
| **Frontend** | Vercel (auto-deploy from `dev` branch) |
| **Frontend URL** | `dev.yourdomain.com` (custom domain) or Vercel preview URL |
| **Convex** | Hosted cloud (`dev` project) |
| **Convex URL** | Auto-generated `*.convex.cloud` (e.g., `happy-horse-456.convex.cloud`) |
| **Database** | Convex managed (shared across team) |
| **Auth** | Convex Auth with dev OAuth apps |
| **Mail Send** | Resend test mode (emails logged, not delivered) |
| **Mail Receive** | Not configured |
| **Data** | Test data, refreshed periodically |

**Testing:**
- Automated CI/CD tests
- Integration tests across services
- PR preview deployments
- Team manual testing

**Promotion criteria:**
- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ Code review approved
- ✅ Feature functionally complete

**Who uses it:** Development team, automated CI/CD

---

### 3. Staging (Validation)

**Purpose:** Pre-production validation, mirrors production as closely as possible

| Aspect | Configuration |
|--------|--------------|
| **Frontend** | Vercel (deploy from `staging` branch) |
| **Frontend URL** | `staging.yourdomain.com` (custom domain) |
| **Convex** | Hosted cloud (`staging` project) |
| **Convex URL** | Auto-generated `*.convex.cloud` (e.g., `wise-fox-789.convex.cloud`) |
| **Database** | Convex managed (production-like data) |
| **Auth** | Convex Auth with staging OAuth apps |
| **Mail Send** | Resend live (restricted to verified test recipients) |
| **Mail Receive** | Not configured |
| **Data** | Production-like dataset (anonymized if needed) |

**Testing:**
- End-to-end testing
- Performance testing
- UAT (User Acceptance Testing)
- Security testing
- Load testing
- Manual QA

**Promotion criteria:**
- ✅ All integration tests pass
- ✅ E2E tests pass
- ✅ Performance benchmarks met
- ✅ Security scan clean
- ✅ Product/stakeholder approval
- ✅ Deployment runbook tested

**Who uses it:** QA team, product managers, stakeholders

---

### 4. Production

**Purpose:** Live customer-facing environment

| Aspect | Configuration |
|--------|--------------|
| **Frontend** | Vercel (deploy from `main` branch) |
| **Frontend URL** | `app.yourdomain.com` (custom domain) |
| **Convex** | Hosted cloud (`prod` project) |
| **Convex URL** | Auto-generated `*.convex.cloud` (e.g., `brave-lion-012.convex.cloud`) |
| **Database** | Convex managed (production data with automated backups) |
| **Auth** | Convex Auth with production OAuth apps |
| **Mail Send** | Resend live (verified domain, all users) |
| **Mail Receive** | Not configured (may add for reply-to-comment feature) |
| **Data** | Real customer data |
| **Monitoring** | Full observability (errors, performance, usage) |

**Deployment:**
- Automated via CI/CD with manual approval gate
- Blue-green or rolling deployment
- Database migrations run first
- Rollback plan ready

**Promotion criteria:**
- ✅ Staging validation complete
- ✅ Deployment checklist complete
- ✅ Rollback plan documented
- ✅ On-call engineer identified
- ✅ Stakeholder approval

**Who uses it:** Customers, support team monitors

---

## Environment Configuration

### Convex Deployments

**All environments use Convex's hosted cloud service** (not self-hosted Docker). Each environment uses a separate project/deployment:

```bash
# Local Dev (hosted cloud with local deployment mode)
# Runs on your machine but backend is Convex-managed
npx convex dev
# Benefits: faster sync, no quota limits, isolated per developer

# Hosted Dev
npx convex deploy --project dev

# Staging
npx convex deploy --project staging

# Production
npx convex deploy --project prod
```

**Key points:**
- All deployments run on Convex's infrastructure (even "local" mode)
- Local mode runs a subprocess on your machine but data lives in Convex cloud
- Each environment gets an auto-generated `*.convex.cloud` URL
- Convex handles: scaling, backups, monitoring, load balancing

**Environment variables** managed per deployment:
```bash
# Local: No Resend key needed (uses Mailpit)
# Convex backend config points to localhost:1025 for SMTP

# Hosted Dev
npx convex env set RESEND_API_KEY=re_test_xxx --project dev
npx convex env set RESEND_TEST_MODE=true --project dev

# Staging
npx convex env set RESEND_API_KEY=re_staging_xxx --project staging
npx convex env set RESEND_TEST_MODE=false --project staging
npx convex env set RESEND_ALLOWED_RECIPIENTS=test@example.com,qa@example.com --project staging

# Production
npx convex env set RESEND_API_KEY=re_prod_xxx --project prod
npx convex env set RESEND_TEST_MODE=false --project prod
```

### Authentication Configuration

**Provider:** Convex Auth (email-based user identification for migration flexibility)

| Environment | OAuth Apps | OAuth Redirect URLs | Auth Method |
|-------------|------------|---------------------|-------------|
| **Local** | Dev credentials (Google, GitHub) | `http://localhost:5173/auth/callback` | Magic links (Mailpit) + OAuth |
| **Hosted Dev** | Dev credentials (Google, GitHub) | `https://dev.yourdomain.com/auth/callback` | Magic links (Resend test) + OAuth |
| **Staging** | Staging credentials (Google, GitHub) | `https://staging.yourdomain.com/auth/callback` | Magic links (Resend live) + OAuth |
| **Production** | Production credentials (Google, GitHub) | `https://app.yourdomain.com/auth/callback` | Magic links (Resend live) + OAuth |

**OAuth Apps Setup:**
- Create separate OAuth applications for dev, staging, and production in:
  - Google Cloud Console (for Google OAuth)
  - GitHub Developer Settings (for GitHub OAuth)
- Each OAuth app must have the corresponding redirect URL registered
- Store OAuth client IDs and secrets in Convex environment variables per project

### Email Configuration (Send & Receive)

#### Mail Send (Outbound)

| Environment | Provider | API Key | Mode | Delivery | Purpose |
|-------------|----------|---------|------|----------|---------|
| **Local** | Mailpit (Docker) | N/A | Capture | No delivery (localhost:8025 UI) | Magic links, dev testing |
| **Hosted Dev** | Resend | Test key | Test mode | No delivery (logs only) | CI/CD testing, integration tests |
| **Staging** | Resend | Staging key | Live | Restricted (verified test emails) | QA, pre-prod validation |
| **Production** | Resend | Production key | Live | All users | Customer magic links, notifications |

**Mailpit Setup (Local):**
```bash
docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit
# SMTP: localhost:1025
# Web UI: http://localhost:8025
```

**Resend Domain Configuration:**
- Local: Not used (Mailpit)
- Dev: `dev.yourdomain.com` (test mode, no SPF/DKIM needed)
- Staging: `staging.yourdomain.com` (verify domain, add SPF/DKIM)
- Production: `yourdomain.com` (verify domain, add SPF/DKIM)

#### Mail Receive (Inbound)

| Environment | Status | Notes |
|-------------|--------|-------|
| **All** | Not configured for MVP | Future: Reply-to-comment via email using Resend inbound webhooks |

**Future consideration:** If reply-to-comment via email is added:
- Resend supports inbound email via webhooks
- Configure different webhook endpoints per environment
- Example: `reply+{commentId}@yourdomain.com` → Convex HTTP action

---

## Compatibility Verification

Before deploying to any environment, verify these compatibility checks:

### ✅ Convex + Email Integration

| Check | Local | Hosted Dev | Staging | Production |
|-------|-------|------------|---------|------------|
| Convex backend can send email | ✅ Via Mailpit | ✅ Via Resend test | ✅ Via Resend live | ✅ Via Resend live |
| Magic links work | ✅ Captured in Mailpit | ✅ Logged (not sent) | ✅ Sent to test emails | ✅ Sent to all users |
| OAuth redirects match | ✅ localhost | ✅ dev.yourdomain.com | ✅ staging.yourdomain.com | ✅ app.yourdomain.com |
| Email domain verified | N/A | N/A (test mode) | ✅ Required | ✅ Required |

### ✅ Auth + Domain Integration

| Check | Requirement |
|-------|-------------|
| OAuth redirect URLs registered | ✅ Must match frontend domain per environment |
| Convex Auth configuration | ✅ Same auth.ts code works across all environments |
| Email-based user linking | ✅ Works identically in all environments |
| Migration path preserved | ✅ Email identifier consistent across environments |

### ✅ Data Isolation

| Environment | Convex Project | Database | Email Recipients |
|-------------|----------------|----------|------------------|
| Local | Separate per developer | Isolated | Mailpit (local only) |
| Hosted Dev | Shared `dev` | Shared team data | Test mode (no delivery) |
| Staging | Shared `staging` | Staging data | Restricted list |
| Production | Shared `prod` | Production data | All users |

---

## Promotion Process

### Dev → Staging

**Trigger:** Feature complete and tested in dev

**Process:**
1. Create release branch: `release/vX.Y.Z`
2. Run full test suite
3. Deploy to staging: `npx convex deploy --project staging`
4. Run E2E tests against staging
5. Notify QA team for testing

**Rollback:** Redeploy previous staging version

---

### Staging → Production

**Trigger:** Staging validation complete

**Process:**
1. **Pre-deployment checklist:**
   - [ ] All tests passing
   - [ ] Performance benchmarks met
   - [ ] Security scan complete
   - [ ] Stakeholder approval obtained
   - [ ] Database migrations prepared
   - [ ] Rollback plan documented
   - [ ] On-call engineer assigned

2. **Deployment:**
   - Tag release: `git tag vX.Y.Z`
   - Run database migrations (if any)
   - Deploy: `npx convex deploy --project prod`
   - Verify deployment health
   - Monitor error rates for 30 minutes

3. **Post-deployment:**
   - Smoke tests
   - Monitor dashboards
   - Update status page if needed
   - Team notification

**Rollback:**
- Quick: Redeploy previous production version
- Database changes: Requires rollback script (test in staging first)

---

## CI/CD Pipeline

### Pull Request → Hosted Dev

```yaml
on: pull_request
steps:
  - Run unit tests (Vitest)
  - Run linters
  - Build application
  - Deploy to preview environment (Convex preview deployment)
  - Run integration tests
```

### Merge to main → Hosted Dev

```yaml
on: push (main branch)
steps:
  - Run full test suite
  - Deploy to hosted dev: npx convex deploy --project dev
  - Run smoke tests
  - Notify team
```

### Manual Trigger → Staging

```yaml
on: workflow_dispatch
steps:
  - Create release branch
  - Run full test suite
  - Deploy to staging: npx convex deploy --project staging
  - Run E2E tests
  - Notify QA team
```

### Manual Approval → Production

```yaml
on: workflow_dispatch (manual approval required)
steps:
  - Pre-deployment checklist verification
  - Database migrations (if any)
  - Deploy to production: npx convex deploy --project prod
  - Smoke tests
  - Monitor error rates
  - Notify team
```

---

## Data Management

### Local Dev
- Seed scripts to create test data
- Can be reset/wiped freely
- No real customer data

### Hosted Dev
- Test data refreshed periodically (weekly/monthly)
- Shared across team
- No real customer data

### Staging
- Production-like dataset
- Anonymized customer data (if using production data)
- OR synthetic data that mirrors production patterns
- Refreshed from production periodically

### Production
- Real customer data
- Regular backups (Convex handles this)
- No direct data access (use read-only queries via Convex dashboard)

---

## Monitoring & Observability

### Development Environments
- Basic error logging
- Console logs sufficient

### Staging
- Error tracking (same as production)
- Performance monitoring
- Synthetic monitoring

### Production
- **Error tracking:** Sentry or similar
- **Performance monitoring:** Web vitals, API latency
- **Uptime monitoring:** Ping service
- **User analytics:** Plausible or similar
- **Convex dashboard:** Query performance, function errors

---

## Security Considerations

### Secrets Management

**Never commit:**
- API keys
- OAuth client secrets
- Database credentials

**Use:**
- `npx convex env set` for backend secrets
- Environment variables for frontend (via `.env.local`)
- Different secrets per environment

### Access Control

| Environment | Access |
|-------------|--------|
| Local | Individual developer only |
| Hosted Dev | All developers |
| Staging | Developers + QA + Product |
| Production | Limited production access, audit logs |

---

## Cost Optimization

| Environment | Resources | Monthly Cost Estimate |
|-------------|-----------|----------------------|
| **Local** | Developer machine + Mailpit + R2 | Free (R2 free tier) |
| **Hosted Dev** | Vercel Pro + Convex + Resend + R2 | ~$20 (Vercel Pro) + Convex free tier + Resend free tier + R2 $0 |
| **Staging** | Vercel Pro + Convex + Resend + R2 | Shared with production Vercel plan + R2 $0 |
| **Production** | Vercel Pro + Convex + Resend + R2 | ~$20 (Vercel Pro) + Convex (usage-based) + Resend (may need paid) + R2 $0-1 |

### Pricing Breakdown

**Vercel:**
- **Cost:** $20/user/month (Pro plan, required for commercial use)
- **Includes:** Unlimited deployments, preview deployments, 100GB bandwidth
- **Note:** Single Pro plan can cover multiple environments (dev/staging/prod) via branch deployments

**Convex:**
- **Free tier:** Covers local dev + likely covers hosted dev/staging
- **Production:** Usage-based pricing as you scale
- **Cost:** Typically $0-50/month for MVP/early growth

**Resend:**
- **Free tier:** 3,000 emails/month
- **Covers:** Dev (test mode) + Staging (limited recipients) + light production usage
- **Paid tier:** $20/month for 50K emails if needed

**Cloudflare R2:**
- **Free tier:** 10GB storage, 1M Class A ops, 10M Class B ops per month
- **Paid tier:** $0.015/GB storage, zero egress fees
- **Cost:** Essentially free for MVP (<$1/month even at scale)
- **Why R2:** 35% cheaper storage + zero egress vs Vercel Blob ($0.05/GB egress)

### Total MVP Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Vercel Pro | $20 |
| Convex (MVP usage) | $0-25 |
| Resend (free tier) | $0 |
| R2 (HTML storage) | $0-1 |
| **Total** | **~$20-46/month** |

**As you scale:**
- Convex: Increases with database size, function calls, bandwidth
- Resend: May need $20/month paid tier (50K emails)
- R2: Stays minimal (~$1-5/month even with 10K projects)
- Vercel: $20/month stays flat (bandwidth overages rare)

**Cost comparison (1,000 HTML projects, 10GB storage, 100GB views/month):**
- **With R2:** $0.15 storage + $0 egress = $0.15/month
- **With Vercel Blob:** $0.23 storage + $5 egress = $5.23/month
- **R2 saves $60/year** even at moderate scale

---

## References

### Frontend Hosting
- [Vercel Docs](https://vercel.com/docs)
- [Vercel + Convex Integration](https://docs.convex.dev/production/hosting/vercel)
- [Vercel Pricing](https://vercel.com/pricing)
- [Netlify + Convex Integration](https://docs.convex.dev/production/hosting/netlify) (alternative)

### Backend (Convex)
- [Convex Deployments](https://docs.convex.dev/production/hosting)
- [Convex Local Deployments](https://docs.convex.dev/cli/local-deployments) (how local mode works)
- [Convex Self-Hosting Docs](https://docs.convex.dev/self-hosting) (why we chose hosted over self-hosted)
- [Convex Environment Variables](https://docs.convex.dev/production/environment-variables)

### Email & Testing
- [Resend Docs](https://resend.com/docs)
- [Resend Inbound Email](https://resend.com/docs/dashboard/emails/inbound-emails) (future reference)
- [Mailpit](https://mailpit.axllent.org/) (local email testing)

### File Storage (R2)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Convex R2 Component](https://github.com/get-convex/r2)
- [R2 vs Vercel Blob Comparison](https://www.wmtips.com/technologies/compare/cloudflare-r2-vs-vercel-blob/)

### Project Architecture
- [ADR 0001: Authentication Provider](./decisions/0001-authentication-provider.md) (auth + email + testing strategy)
- [ADR 0002: HTML Artifact Storage](./decisions/0002-html-artifact-storage.md) (hybrid storage strategy with R2)
