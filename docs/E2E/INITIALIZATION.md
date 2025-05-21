📁 Folder Structure Strategy
We recommend placing Playwright tests inside each relevant package or under a shared /e2e/ folder at the root (depending on preference). For example:

arduino
Copy
Edit
nova/
├── packages/
│   ├── common/
│   │   └── e2e/
│   │       └── button.spec.ts
├── e2e/
│   └── global-tests/
├── playwright.config.ts


📦 Install Playwright
At the root of your monorepo, run:

bash
Copy
Edit
npm install --save-dev playwright @playwright/test
npx playwright install


🛠 Initialize Playwright
Run:
npx playwright install --with-deps

npx playwright test --init

npx playwright test --ui

