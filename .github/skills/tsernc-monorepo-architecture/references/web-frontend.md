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

| Aspect | Vite React | Next.js |
|---|---|---|
| **Routing** | React Router (`router.tsx`) | File-based App Router |
| **Rendering** | Client-side (CSR) | SSR / SSG / ISR (per-page) |
| **API calls** | RTK Query (client-side) | Server Actions / Route Handlers |
| **Metadata** | `index.html` | `layout.tsx` exports |
| **Data fetching** | `useEffect` / RTK Query | `fetch` in Server Components |
| **TypeScript config** | `vite.json` | `next.json` (or custom) |

---

## Next.js SEO Best Practices

When building with Next.js for public-facing websites, follow these practices for SEO optimization.

### 1. Metadata API

Set per-page metadata using the built-in Metadata API in `layout.tsx` or `page.tsx`:

```typescript
// app/layout.tsx — Root metadata (applied to all pages)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | My App",
    default: "My App",
  },
  description: "A description of your app for search engines.",
  openGraph: {
    title: "My App",
    description: "A description of your app.",
    url: "https://example.com",
    siteName: "My App",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My App",
    description: "A description of your app.",
    images: ["/og-image.png"],
  },
};
```

```typescript
// app/blog/[slug]/page.tsx — Per-page metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}
```

### 2. Semantic HTML Structure

```typescript
// app/layout.tsx
<html lang="en">
  <body>
    <header><nav aria-label="Main navigation">...</nav></header>
    <main>{children}</main>
    <footer>...</footer>
  </body>
</html>
```

- Use `<nav>` for navigation, `<main>` for primary content, `<article>` for blog posts
- Heading hierarchy: one `<h1>` per page, sequential `<h2>`–`<h6>` nesting
- Use `aria-label` and `aria-describedby` for accessibility

### 3. Rendering Strategy

| Strategy | When to Use | SEO Impact |
|---|---|---|
| **SSR** (Server-Side Rendering) | Dynamic content, user-specific pages | ✅ Full HTML to crawlers |
| **SSG** (Static Site Generation) | Blogs, marketing pages, docs | ✅ ✅ Fastest, pre-rendered at build |
| **ISR** (Incremental Static Regeneration) | Frequently updated content (news, products) | ✅ ✅ Static with periodic revalidation |
| **CSR** (Client-Side Rendering) | Dashboard, admin panels (behind auth) | ❌ Not indexed |

```typescript
// SSG example — app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ISR example — revalidate every 60 seconds
export const revalidate = 60;
```

### 4. Structured Data (JSON-LD)

Add schema markup to help search engines understand your content:

```typescript
// app/blog/[slug]/page.tsx
function JsonLd({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Common schema types: `Article`, `BreadcrumbList`, `Product`, `FAQPage`, `LocalBusiness`, `Organization`.

### 5. Sitemap & Robots

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com", lastModified: new Date(), priority: 1 },
    { url: "https://example.com/about", priority: 0.8 },
    { url: "https://example.com/blog", priority: 0.9 },
  ];
}
```

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dashboard/" },
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### 6. Core Web Vitals Optimization

| Metric | What to Optimize | Next.js Solutions |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Hero images, fonts | `next/image` with lazy loading, `next/font` with `display: swap` |
| **INP** (Interaction to Next Paint) | JavaScript execution | Server Components, code splitting, `dynamic(() => import())` |
| **CLS** (Cumulative Layout Shift) | Layout stability | Reserve space for images, fonts, ads; use `aspect-ratio` CSS |

```typescript
// Image optimization
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  priority // Use for LCP images
/>;

// Font optimization
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });
```

### 7. SEO Audit Checklist

- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] Canonical URLs set (`rel="canonical"`) to prevent duplicate content
- [ ] Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card tags present
- [ ] JSON-LD structured data added for key content types
- [ ] `sitemap.xml` and `robots.txt` are generated and accessible
- [ ] Heading hierarchy is correct (one `<h1>`, sequential nesting)
- [ ] Images have `alt` text and proper dimensions (no CLS)
- [ ] Page loads fast — LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Mobile responsive — no horizontal scroll, proper viewport meta
- [ ] No broken links (use `next/link` for internal navigation)
- [ ] 404 page returns proper HTTP 404 status
