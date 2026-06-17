# Web Frontend (`apps/web`)

Two variants: **React + Vite** (default) and **Next.js** (optional, for SSR/SSG/SEO).

---

## Option A: React + Vite (Default)

**Stack:** React 19 + Vite 5 + TypeScript + Tailwind CSS 4 + Redux Toolkit / RTK Query + React Router 7 + Framer Motion

### Directory Structure

```
apps/web/
├── index.html               # Vite HTML entry point
├── package.json
├── tsconfig.json            # Extends @repo/typescript-config/vite.json
├── turbo.json
├── vite.config.ts           # Vite config (React + Tailwind plugins, HMR polling)
├── public/                  # Static assets
└── src/
    ├── main.tsx             # React entry point (creates root, renders <Providers />)
    ├── vite-env.d.ts        # Vite type declarations
    │
    ├── app/                 # App-level configuration & layout
    │   ├── Layout.tsx       # Root layout (Header + Outlet)
    │   ├── providers.tsx    # Redux Provider + RouterProvider
    │   ├── router.tsx       # React Router configuration
    │   └── protectedRoute.tsx # Auth guard (redirects to / if not authenticated)
    │
    ├── pages/               # Route-level page components
    │   ├── index.ts         # Re-export all pages
    │   ├── Home/
    │   │   └── Home.tsx
    │   └── Unauthorised/
    │       └── Unauthorised.tsx
    │
    ├── components/          # Reusable UI components
    │   ├── index.ts         # Re-export all components
    │   ├── layout/          # Layout-specific components
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── Feature/         # Feature-specific components
    │       └── SignInUpModal.tsx
    │
    ├── redux/               # State management
    │   ├── store.ts         # Redux store configuration
    │   └── api/             # RTK Query API slices
    │       ├── baseApi.ts   # Base API config (fetchBaseQuery with auth headers)
    │       └── authApi.ts   # Auth endpoints (injected via injectEndpoints)
    │
    ├── hooks/               # Custom React hooks
    │   └── index.ts
    │
    ├── context/             # React Context providers
    │   └── ...
    │
    ├── helper/              # Helper/utility functions
    │   └── authHelpers.ts   # Auth storage helpers (save/clear/check token)
    │
    ├── config/              # App configuration
    │   └── config.ts        # Reads env vars via import.meta.env
    │
    ├── utils/               # General utilities
    │   ├── index.ts
    │   └── errorHandler.ts
    │
    └── styles/              # Global CSS (Tailwind)
        ├── globals.css      # Tailwind directives (@tailwind base/components/utilities)
        ├── components.css   # Component-level custom styles
        └── utilities.css    # Custom utility classes
```

### State Management Pattern

- **Redux Toolkit** store configured in `store.ts`
- **RTK Query** (`baseApi.ts`) handles all API communication:
  - Base URL from `config.ts` (env var `VITE_API_ENDPOINT_URL`)
  - Auth token injected via `prepareHeaders`
  - Feature APIs extend via `injectEndpoints()`
- **Local state** in components; **auth state** persisted in `localStorage`

### Routing Pattern

Routes defined in `router.tsx` using `createBrowserRouter`:

```typescript
<Route path="/" element={<Layout />}>
  <Route path="" element={<Home />} />
  <Route path="dashboard" element={<ProtectedRoute />} />
</Route>
<Route path="*" element={<Unauthorised />} />
```

- `Layout` wraps all main routes with shared UI (Header, Footer, etc.)
- `ProtectedRoute` checks `isAuthenticated()` from auth helpers

### Styling

- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- CSS modules split into `globals.css`, `components.css`, `utilities.css`
- Dark mode support via Tailwind classes (e.g., `dark:bg-home-background-dark`)

---

## Option B: Next.js (Optional, SSR/SSG)

If a project requires SSR, SSG, or better SEO, use **Next.js** instead of Vite+React.

### Directory Structure

```
apps/web/
├── package.json
├── tsconfig.json                  # Extends @repo/typescript-config/next.json
├── turbo.json
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS (Tailwind)
├── public/
│   └── assets/
└── src/
    ├── app/                       # App Router (Next.js 15)
    │   ├── layout.tsx             # Root layout (providers, metadata)
    │   ├── page.tsx               # Home page
    │   ├── loading.tsx            # Loading UI (Suspense boundary)
    │   ├── error.tsx              # Error boundary
    │   ├── not-found.tsx          # 404 page
    │   │
    │   ├── (auth)/                # Route group (auth pages)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── dashboard/             # Protected route group
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   │
    │   └── api/                   # API routes (if needed)
    │       └── [...route]/
    │           └── route.ts
    │
    ├── components/                # Reusable React components
    │   ├── ui/                    # Atomic UI components (Button, Input, Modal, etc.)
    │   └── layout/                # Layout components (Header, Footer, Sidebar)
    │
    ├── lib/                       # Core utilities & client instances
    │   ├── db.ts                  # Prisma client (if using server-side DB calls)
    │   ├── auth.ts                # NextAuth / Auth.js configuration
    │   └── utils.ts               # Utility functions (cn, etc.)
    │
    ├── hooks/                     # Custom React hooks
    │
    ├── store/                     # State management (Redux / Zustand)
    │   ├── store.ts
    │   └── api/                   # RTK Query (if using Redux)
    │
    ├── styles/                    # Global styles
    │   └── globals.css
    │
    └── types/                     # TypeScript type definitions
```

### Key Differences from Vite React

| Aspect                | Vite React                  | Next.js                         |
| --------------------- | --------------------------- | ------------------------------- |
| **Routing**           | React Router (`router.tsx`) | File-based App Router           |
| **Rendering**         | Client-side (CSR)           | SSR / SSG / ISR (per-page)      |
| **API calls**         | RTK Query (client-side)     | Server Actions / Route Handlers |
| **Metadata**          | `index.html`                | `layout.tsx` exports            |
| **Data fetching**     | `useEffect` / RTK Query     | `fetch` in Server Components    |
| **TypeScript config** | `vite.json`                 | `next.json` (or custom)         |
