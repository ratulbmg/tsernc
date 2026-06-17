# Testing Strategy

## Test Folder Structure

```
tests/                              # Root-level cross-app tests
├── integration/                    # Integration tests (API + DB)
│   ├── auth.test.ts
│   └── user.test.ts
├── e2e/                            # End-to-end tests (Playwright / Cypress)
│   ├── auth.spec.ts
│   └── home.spec.ts
└── fixtures/                       # Test fixtures & seed data
    ├── users.ts
    └── db.ts

apps/
├── api/
│   └── src/
│       └── __tests__/              # Unit tests (co-located with source)
│           ├── service/
│           │   └── authService.test.ts
│           ├── controller/
│           │   └── authController.test.ts
│           ├── middleware/
│           │   └── authMiddleware.test.ts
│           └── utils/
│               ├── apiResponse.test.ts
│               └── apiError.test.ts
│
└── web/
    └── src/
        └── __tests__/              # Component & hook tests
            ├── components/
            │   └── Button.test.tsx
            ├── pages/
            │   └── Home.test.tsx
            └── hooks/
                └── useAuth.test.ts

packages/
├── db/
│   └── __tests__/
│       └── prisma.test.ts
└── ui/
    └── __tests__/
        └── Button.test.tsx
```

## Testing Stack (Recommended)

| Layer                     | Framework                | Notes                                         |
| ------------------------- | ------------------------ | --------------------------------------------- |
| **Unit tests**            | Vitest                   | Fast, TypeScript-native, compatible with Vite |
| **React component tests** | Vitest + Testing Library | For UI components                             |
| **API integration tests** | Vitest + Supertest       | Test Express routes with Prisma test DB       |
| **E2E tests**             | Playwright               | Cross-browser, visual regression, API mocking |
| **DB tests**              | Vitest + Prisma          | Use test database or in-memory SQLite         |

## Test Configuration

**Vitest config** (at root `vitest.config.ts` or per-app):

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Use "jsdom" for React components
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["apps/*/src/**", "packages/*/src/**"],
    },
  },
});
```

## Testing Best Practices

1. **Co-locate unit tests** with source files (`__tests__/` next to implementation)
2. **Name test files** with `.test.ts` or `.spec.ts` suffix
3. **Use factories/fixtures** for test data (avoid hardcoding)
4. **Run DB-dependent tests** against a dedicated test database
5. **Mock external services** (JWT verification, third-party APIs)
6. **Test error paths** (validation errors, auth failures, not-found cases)
