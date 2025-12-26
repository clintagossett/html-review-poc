# Validation Videos

This directory contains Playwright trace files for validating the magic link authentication implementation.

## Viewing the Trace

### Prerequisites
```bash
cd /Users/clintgossett/Documents/personal/personal\ projects/artifact-review/tasks/00008-magic-link-authentication/tests
npm install  # Installs Playwright
```

### View Trace Interactively
```bash
npx playwright show-trace validation-videos/magic-link-trace.zip
```

This opens an interactive viewer in your browser showing:
- Timeline of all actions with screenshots
- Click highlights on each action
- Network requests and responses
- Console logs
- Full DOM snapshots at each step

## Generating New Traces

### Run E2E Tests (generates trace.zip automatically)
```bash
# Set environment variable
export RESEND_API_KEY=re_test_xxxxxxxxx

# Start app and Convex backend first
# Terminal 1: cd ../../../app && npm run dev
# Terminal 2: cd ../../../app && npx convex dev

# Run tests
npx playwright test

# Copy trace to validation-videos/
cp test-results/*/trace.zip validation-videos/magic-link-trace.zip
```

## Trace Contents

The trace includes:
1. **Basic Flow Tests** - UI interactions and form validation
2. **Resend API Tests** - Full email delivery and magic link verification (if RESEND_API_KEY is set)

## Notes

- Traces are binary files (`.zip` format)
- Must be viewed with Playwright's trace viewer
- Cannot be viewed directly in a browser
- Each trace is self-contained with all screenshots and data
