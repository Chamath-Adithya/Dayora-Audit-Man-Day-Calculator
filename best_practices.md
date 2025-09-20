### 📘 Project Best Practices

#### 1. Project Purpose  
Dayora Audit Man-Day Calculator is a TypeScript/Next.js (App Router) application that helps estimate and manage audit “man-days.” It includes authenticated pages for calculation input, result visualization, historical tracking, admin configuration, and export features. The app exposes REST-style endpoints via Next.js route handlers and ships with an optional Electron wrapper for desktop distribution. Data is primarily persisted via Prisma (SQLite in development) with some JSON data sources.

#### 2. Project Structure  
- app/
  - page.tsx, layout.tsx, globals.css: Next.js entry and global styles.
  - auth/signin/page.tsx: Sign-in page for NextAuth.
  - calculate/, results/, dashboard/, history/, admin/: Feature pages for core functions.
  - api/: Next.js Route Handlers (REST-like)
    - auth/[...nextauth]/: NextAuth handler.
    - calculations/route.ts and calculations/[id]/route.ts: Create/list and item-level calculations.
    - config/route.ts: Configuration endpoints.
    - export/route.ts, export-history/route.ts: Data export features.
    - stats/route.ts: Aggregations and dashboards.
- components/
  - ui/: Reusable UI primitives (shadcn-style patterns).
  - domain components: forms, providers, sidebar, charts, etc.
- lib/
  - audit-calculator.ts, audit-calculator-fixed.ts: Domain logic and calculation functions.
  - api-client.ts: Client-side wrappers for calling server APIs.
  - config.ts: Configuration loader/manager (uses JSON and/or DB).
  - database.ts, storage.ts, storage-db.ts: Data access and storage abstractions.
  - utils.ts: Common helpers (e.g., className utilities).
- prisma/
  - schema.prisma: Database schema (SQLite in development).
  - dev.db: Local DB file(s).
  - seed.ts: Seeding utilities.
- data/
  - calculations.json, config.json: Bootstrapping and/or default configuration/data.
- electron-app/
  - main.js, package.json: Electron wrapper to package the web app as a desktop app.
- public/: Static assets.
- styles/: Additional global styles.
- types/
  - next-auth.d.ts: NextAuth type augmentation for sessions/users.
- Root configs: middleware.ts, next.config.mjs, tsconfig.json, postcss.config.mjs, vercel.json, .gitignore, .gitconfig, deployment docs, env examples.

Key conventions:
- Domain logic isolated in lib/ and consumed by routes and components.
- API boundaries in app/api/* via Next.js route handlers.
- UI primitives and composition components under components/.
- Prisma schema and seeding isolated under prisma/.
- Optional desktop packaging under electron-app/.

#### 3. Test Strategy  
Current state:
- No explicit automated test framework is present in the repo.
- test_result.md exists but no test setup is visible.

Recommended approach:
- Unit tests: Vitest + React Testing Library
  - Scope: lib/* (pure functions like audit-calculator*), UI components (components/*) with DOM-oriented tests.
  - Naming: colocate tests as filename.test.ts/tsx or use __tests__/ mirrors.
- Integration tests: Supertest (or node-fetch) against Next.js Route Handlers
  - Test request/response contracts for app/api/*.
  - Spin up Next test server or test handlers in isolation with NextRequest/NextResponse mocks.
- E2E tests: Playwright
  - Auth flows (NextAuth), calculations, results, admin config, exports.
  - Use seeded DB (prisma/seed.ts) and test users.
- Mocking guidelines:
  - Prisma: Create a Prisma test client or mock data repository interface; avoid hitting dev.db.
  - NextAuth: Mock session via a helper that stubs getServerSession/useSession.
  - Network: Prefer msw for client-side API calls in component tests.
- Coverage:
  - Target ≥80% for lib and api handlers first; keep E2E smoke coverage on critical flows.

#### 4. Code Style  
- Language and typing:
  - TypeScript-first; avoid `any`. Provide precise types for function params/returns in lib/*. Enable strict TS options and keep types updated in types/ (e.g., next-auth.d.ts).
  - Prefer immutability in domain logic functions; pure functions in lib/audit-calculator*.
- React/Next.js:
  - Use Server Components by default in app/*. Mark interactive components with "use client" at top.
  - Co-locate feature components with feature pages where practical; reuse primitives from components/ui/.
  - Keep forms controlled; lift domain logic out of components into lib/*. Keep components presentational where possible.
- Naming conventions:
  - Files: kebab-case for routes and utils (e.g., audit-calculator.ts), PascalCase for React components. Be consistent repo-wide.
  - Components: PascalCase (e.g., ResultsDisplay, ThemeToggle).
  - Hooks: useSomething naming; place shared hooks under components/ or lib/ as appropriate.
  - API routes: app/api/<feature>/route.ts, with subresource routes (e.g., <feature>/[id]/route.ts).
- Error handling:
  - Validate inputs at API boundaries; return structured JSON errors `{ error: { code, message, details? } }` with appropriate HTTP status codes.
  - Wrap DB calls in try/catch; map exceptions to user-safe messages; never leak stack traces to clients.
  - Log actionable server errors; avoid console.log in production paths.
- Documentation/comments:
  - TSDoc for exported lib functions and complex components.
  - Inline comments only where non-trivial logic exists; prefer readable code.
- Async patterns:
  - Use async/await; avoid floating promises. Handle Promise.all errors properly.
  - Ensure server-side data fetching happens in route handlers or server components; avoid fetching secrets in client code.
- Styling:
  - Tailwind CSS v4 is configured. Follow utility-first styling, keep class lists readable, and extract repeated patterns via components/ui primitives.

#### 5. Common Patterns  
- Domain logic isolation:
  - lib/audit-calculator*.ts contains core calculations. Keep them framework-agnostic and unit-testable.
- API route handlers:
  - Small, composable handlers in app/api/* that:
    - Parse/validate input.
    - Delegate to lib/ for business logic.
    - Commit side effects (DB/storage), respond with typed JSON.
- Data access:
  - Prisma models defined in prisma/schema.prisma. Encapsulate queries in lib/database.ts or a repository layer. Avoid direct DB access in components.
  - storage.ts and storage-db.ts: abstract persistence and environment differences (web/Electron).
- UI patterns:
  - components/ui/* provide primitive building blocks (shadcn-style). Prefer composing these primitives in feature components.
  - Keep chart rendering and dashboard widgets decoupled from data-fetching; pass data via props.
- Configuration:
  - lib/config.ts mediates config from data/config.json and/or DB. Centralize config reads/writes; avoid reading JSON directly in UI.
- Auth:
  - NextAuth route handler at app/api/auth/[...nextauth]. Check session server-side for protected routes/pages; use middleware.ts for coarse route protection and redirects.
- Electron:
  - electron-app/ provides a thin main process. Keep renderer code web-first; avoid Electron-only APIs in shared code paths.

#### 6. Do's and Don'ts  
- ✅ Do
  - Keep domain logic in lib/ and unit-test it thoroughly.
  - Validate all API inputs and return consistent, typed responses.
  - Use server components and route handlers for data access; keep client components UI-focused.
  - Centralize Prisma access and transactions; handle errors and rollbacks cleanly.
  - Reuse components/ui primitives; maintain visual/behavioral consistency.
  - Document complex algorithms (e.g., calculation logic) with TSDoc and examples.
  - Use feature-based folders under app/ for cohesive UX flows (calculate, results, admin, etc.).
  - Keep Electron-specific logic isolated in electron-app/.
- ❌ Don’t
  - Access the database from client components or leak secrets to the browser.
  - Duplicate calculation logic across UI and API; always call shared lib functions.
  - Throw raw errors from route handlers; map them to HTTP responses.
  - Hardcode config in components; use lib/config.ts and environment variables.
  - Couple charts/components to data fetching; prefer prop-driven rendering.

#### 7. Tools & Dependencies  
- Core
  - Next.js (App Router) + React: Routing, SSR/SSG, APIs via route handlers.
  - NextAuth: Authentication/session management.
  - Prisma + SQLite (development): ORM and local DB. Use schema.prisma and seed.ts.
  - TypeScript: Strict typing across UI, APIs, and domain logic.
  - Styling: Tailwind CSS v4 with postcss. Use components/ui for consistent UI primitives.
  - Electron (optional): Desktop packaging in electron-app/.
- Notable extras present (not necessarily used): Vue, Vue Router, Svelte, Remix libraries are listed in dependencies; avoid adding cross-framework code unless there is a concrete plan and build setup.
- Setup
  - Install dependencies: `npm install` (root). If packaging desktop, install inside electron-app/ as required.
  - Environment: Copy and fill env from vercel-env-example.txt (NextAuth secrets/providers, DB URL if not using local SQLite, etc.).
  - Database: `npx prisma generate` && `npx prisma migrate dev` && `npm run db:seed` (or equivalent).
  - Development: `npm run dev` (Next.js) and, if needed, Electron dev/start scripts in electron-app/.
  - Build: `npm run build` && `npm start` (web); package Electron via electron-builder or configured scripts if present.

#### 8. Other Notes  
- Server/client boundaries:
  - Assume server by default in app/*. Add "use client" only where interactivity is required. Never import server-only modules (DB, fs, secrets) into client components.
- API evolution:
  - Maintain backward-compatible JSON shapes; version endpoints if making breaking changes (e.g., app/api/v2/...).
  - Co-locate request/response TypeScript types with handlers or in a shared types module.
- Prisma practices:
  - Keep a single PrismaClient instance per process; handle long-lived instances in server runtime carefully.
  - Prefer explicit select/include to avoid over-fetching; be mindful of N+1 queries.
- Auth and authorization:
  - Enforce authorization in route handlers (e.g., role checks for admin routes).
  - Update types/next-auth.d.ts when augmenting session/user fields.
- Data export/history:
  - Keep exports stateless and reproducible; include metadata (version, timestamp).
  - Store history with consistent schema; index by user where applicable.
- Electron:
  - Treat web app as the source of truth; inject environment/config at boot time.
  - Never block the main process; use IPC channels carefully and sanitize all messages.
- For LLM-generated changes:
  - Prefer editing lib/* for logic and app/api/* for IO; avoid mixing concerns.
  - Add tests alongside any new business logic.
  - Follow existing file naming and route conventions; keep imports relative unless path aliases are defined in tsconfig.
