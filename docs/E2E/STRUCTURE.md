# 📁 Folder Structure Strategy

```
nova/
├── packages/
│   ├── bits/
│   │   └── e2e/
│   │       ├── atom.ts                 # Base Atom (Playwright) and finding helpers
│   │       ├── setup.ts                # Playwright fixtures + Helpers
│   │       ├── components/
│   │       │   ├── button/
│   │       │   │   ├── button.atom.ts
│   │       │   │   └── button.spec.ts
│   │       │   └── ...
│   │       └── ...
│   └── charts/
│       └── e2e/
│           └── ...
├── docs/
│   └── E2E/
│       ├── ATOMS.md                    # How to use/write Atoms (framework-agnostic guidance)
│       ├── ASSERTING_VALUE.md
│       ├── EQUIVALENT.md
│       └── ...
└── playwright.config.ts
```

## Key idea

- **Tests should be written against Atoms**, not raw locators.
- Atoms live next to the tests (per package) so they evolve with the components.

See `docs/E2E/ATOMS.md`.
