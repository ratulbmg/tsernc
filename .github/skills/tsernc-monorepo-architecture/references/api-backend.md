# API Backend (`apps/api`)

**Stack:** Express 4.x + TypeScript + Prisma ORM + Zod validation + Winston logging + JWT auth + Swagger

## Directory Structure

```
apps/api/
├── nodemon.json             # Nodemon config (hot-reload via tsx)
├── package.json
├── tsconfig.json            # Extends @repo/typescript-config/base.json
├── turbo.json
├── logs/                    # Log output directory (gitignored)
└── src/
    ├── index.ts             # Entry point — starts Express server
    ├── app.ts               # Express app setup (middleware, routes, error handling)
    │
    ├── config/              # Configuration files
    │   ├── logger.config.ts # Winston logger setup
    │   └── swagger.config.ts# Swagger/OpenAPI configuration
    │
    ├── controller/          # Request handlers (thin layer)
    │   ├── index.ts         # Re-export all controllers
    │   └── authController.ts
    │
    ├── service/             # Business logic layer
    │   ├── index.ts         # Re-export all services
    │   └── authService.ts
    │
    ├── repository/          # Data access layer (Prisma)
    │   ├── baseRepository.ts    # Generic CRUD base class
    │   ├── repositoryWrapper.ts # Singleton wrapper exposing all repositories
    │   └── userRepository.ts
    │
    ├── middleware/           # Express middleware
    │   ├── authMiddleware.ts # JWT authentication
    │   ├── corsMiddleware.ts # CORS configuration
    │   ├── errorMiddleware.ts# Global error handler
    │   └── loggerMiddleware.ts# Request/response logging
    │
    ├── model/               # TypeScript type definitions / DTOs
    │   └── userModel.ts
    │
    ├── routes/              # Route definitions
    │   ├── index.ts         # Route aggregator
    │   └── authRoute.ts
    │
    ├── validation/          # Zod schemas for request validation
    │   ├── index.ts         # Re-export all schemas
    │   └── authValidation.ts
    │
    ├── types/               # TypeScript ambient type declarations
    │   └── express.d.ts     # Extends Express.Request with custom fields
    │
    ├── utils/               # Utility classes & helpers
    │   ├── apiError.ts      # Custom error class
    │   ├── apiResponse.ts   # Standardized API response wrapper
    │   └── asyncHandler.ts  # Async error wrapper for Express routes
    │
    └── lib/                 # Core library modules (DB client, JWT helpers)
        ├── db.ts            # Prisma client singleton
        └── jwt.ts           # JWT sign/verify helpers
```

## Architecture Layers (Data Flow)

```
Route → Validation (Zod) → Controller → Service → Repository → Prisma → PostgreSQL
                                                              ↕
                                                           Model (types)
```

- **Validation** — Zod schemas parse and validate incoming request data
- **Controller** — Thin handler; extracts params, calls service, sends response via `ApiResponse`
- **Service** — Business logic, orchestrates repositories, throws `apiError` on failures
- **Repository** — Data access via `BaseRepository<T>` generic CRUD; extend for custom queries
- **Middleware** — Auth, CORS, logging, error handling (global error handler catches `apiError`, `ZodError`, and generic errors)

## API Response Envelope

All responses use `ApiResponse` class:

```typescript
class ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean; // true if statusCode < 400
}
```

## Error Handling

Custom `apiError` class with `statusCode` and optional `errors` payload.
Global `errorHandler` middleware catches:

- `apiError` — custom application errors
- `ZodError` — validation failures (returns 400)
- Generic `Error` — unexpected errors (returns 500)

## Nodemon Dev Server

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "exec": "npx tsx src/index.ts"
}
```
