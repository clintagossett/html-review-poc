import { test, expect } from '@playwright/test';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Skip these tests if RESEND_API_KEY is not configured
test.describe('Magic Link with Resend API', () => {
  test.skip(!resendApiKey, 'RESEND_API_KEY environment variable is required');

  test('should send magic link email via Resend', async ({ page }) => {
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);
    const testEmail = `magic-${Date.now()}@tolauante.resend.app`;

    // 1. Request magic link
    await page.goto('/login');
    await page.click('button:has-text("Sign in with Email Link")');
    await page.fill('input[type="email"]', testEmail);
    await page.click('button:has-text("Send Magic Link")');

    // 2. Verify success message
    await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 10000 });

    // 3. Check Resend API for the email (with retry)
    let ourEmail = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!ourEmail && attempts < maxAttempts) {
      await page.waitForTimeout(2000); // Wait between attempts

      const { data: emails } = await resend.emails.list();
      ourEmail = emails?.find((msg: any) => msg.to?.[0] === testEmail);
      attempts++;
    }

    expect(ourEmail).toBeDefined();
    expect(ourEmail?.subject).toContain('Sign in');
  });

  test('should complete magic link flow end-to-end with Resend', async ({ page }) => {
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);
    const testEmail = `e2e-${Date.now()}@tolauante.resend.app`;

    // 1. Request magic link
    await page.goto('/login');
    await page.click('button:has-text("Sign in with Email Link")');
    await page.fill('input[type="email"]', testEmail);
    await page.click('button:has-text("Send Magic Link")');
    await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 10000 });

    // 2. Get the magic link from Resend API
    let ourEmail = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!ourEmail && attempts < maxAttempts) {
      await page.waitForTimeout(2000);
      const { data: emails } = await resend.emails.list();
      ourEmail = emails?.find((msg: any) => msg.to?.[0] === testEmail);
      attempts++;
    }

    expect(ourEmail).toBeDefined();

    // 3. Get full email content and extract magic link
    const { data: fullEmail } = await resend.emails.get(ourEmail!.id);
    expect(fullEmail).toBeDefined();

    const htmlContent = fullEmail?.html || '';
    const linkMatch = htmlContent.match(/href="([^"]*callback[^"]*)"/);
    expect(linkMatch).toBeDefined();

    const magicLink = linkMatch![1];

    // 4. Click the magic link
    await page.goto(magicLink);

    // 5. Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });

    // 6. Should be authenticated (check for sign out button or user email)
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible({ timeout: 5000 });
  });
});
