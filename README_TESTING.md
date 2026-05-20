E2E testing with Playwright

Setup (local):

1. Install dev deps:

```bash
npm install
npx playwright install
```

2. Run the app (dev or preview):

```bash
npm run dev
# or build + preview for CI-like serving:
npm run build
npm run preview
```

3. Run tests:

```bash
npm run test:e2e
```

CI: A GitHub Actions workflow is included at `.github/workflows/e2e.yml`.
