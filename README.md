# Mini Market

Mini Market is a production-oriented product catalog built with **Nuxt 3**, **Vue 3**, **TypeScript**, and **Tailwind CSS v4** from the supplied Figma storefront. Product data is provided by the Fake Store API through a small Nuxt server layer instead of being consumed directly by browser components.

## Links

- **Git repository:** `<GITHUB_REPOSITORY_URL>`
- **Live demo:** `<DEPLOYMENT_URL>`

A source archive is also provided with the technical-challenge submission.

## Tech stack

- Nuxt 3
- Vue 3 Composition API
- TypeScript
- Tailwind CSS v4
- Nuxt i18n
- Nuxt Image
- Storybook
- Vitest
- pnpm

## Running locally

### Requirements

- Node.js 20+
- pnpm

### Install

```bash
pnpm install
```

Copy `.env.example` to `.env` if you want to override the default runtime values:

```env
NUXT_FAKE_STORE_BASE_URL=https://fakestoreapi.com
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the development server:

```bash
pnpm dev
```

The application is available at `http://localhost:3000` by default.

### Storybook

Run the UI component documentation locally with:

```bash
pnpm storybook
```

Storybook is available at `http://localhost:6006` by default.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:storybook
pnpm build
pnpm storybook:build
```

`test:storybook` runs the Storybook browser project and covers interaction/accessibility scenarios defined by the stories.

## Architecture decisions

### Feature-local components

Components that only belong to one page or feature are kept close to that feature. Reusable application-wide components live under `src/components`, while shared UI primitives live under `src/components/ui`.

This keeps feature code discoverable and avoids turning a single global component directory into a large flat collection.

A simplified structure is:

```text
src/
├── assets/
│   └── style/
├── components/
│   └── ui/
├── composables/
├── layouts/
├── lib/
├── pages/
│   └── product/
│       └── components/
├── services/
└── types/

server/
├── api/
├── routes/
└── utils/
```

### BFF / server layer

The browser does **not** call the Fake Store API directly. Nuxt/Nitro acts as a small **Backend for Frontend (BFF)**:

```text
Vue UI
  ↓
Application service
  ↓
Nuxt /api routes
  ↓
Runtime validation + error mapping
  ↓
Fake Store API
```

This boundary keeps upstream API details out of components and provides a clear place for future concerns such as authentication, caching, logging, response transformation, rate limiting, or replacing the upstream provider.

The server integration intentionally uses Nuxt's built-in `$fetch` rather than maintaining a custom HTTP-client abstraction. The current upstream requirements are simple GET requests, and `$fetch` already provides the required `baseURL`, timeout, error handling, and request configuration. This keeps the dependency and abstraction surface proportional to the actual scope of the project.

### Runtime validation

External API responses are treated as untrusted runtime data.

Responses are fetched as `unknown` and validated before they are returned to the application UI. TypeScript protects compile-time contracts, but it cannot guarantee the shape of data returned by an external service at runtime.

Malformed upstream responses therefore fail at the server boundary instead of propagating invalid data into Vue components.

### Rendering strategy

Product listing and detail routes use one-hour **ISR (Incremental Static Regeneration)** route rules.

This keeps the pages server-rendered and crawlable while reducing repeated rendering and upstream API work. Depending on the final deployment infrastructure, the same application boundaries can also support an edge-oriented deployment strategy later.

### Internationalization

Persian/RTL is the shipped default, but application text is managed through Nuxt i18n instead of being embedded throughout component logic.

Although multiple languages were not required by the challenge, this structure makes future locale additions much simpler and keeps Persian content separated from implementation code.

### CSS and theme architecture

Shared styles are separated by responsibility:

```text
src/assets/style/
├── main.css
├── base.css
├── themes.css
├── typography.css
├── components.css
└── animations.css
```

Theme values are exposed as semantic tokens such as `primary`, `surface`, `surface-muted`, `ink`, `ink-muted`, `line`, and `canvas` instead of scattering hard-coded palette values through components.

This makes dark mode, palette changes, and additional themes easier to evolve without rewriting component styles.

### Responsive design system

The UI is implemented **mobile-first**. Responsive layout behavior is primarily expressed through shared breakpoints and CSS rather than duplicated viewport state in JavaScript.

Where the interaction genuinely changes by device, the component adapts accordingly. For example:

- desktop product filters use a sidebar;
- mobile product filters use an accessible bottom sheet.

### Dependency strategy

Dependencies are added only when their value justifies their runtime, maintenance, and architectural cost.

Examples in this project:

- overflowing filter chips use native horizontal scrolling instead of a slider/carousel dependency;
- a full UI framework is avoided because the required component surface is small and design-specific;
- a headless UI dependency is avoided where the required behavior is straightforward to implement accessibly;
- the Fake Store integration uses Nuxt `$fetch` instead of a custom HTTP-client layer;
- CSS and Vue transitions are used directly for lightweight interaction animations.

The goal is not to avoid dependencies categorically; it is to keep every dependency and abstraction intentional.

### UI kit and Storybook

Reusable UI primitives are kept in `src/components/ui` and form the project's small internal UI kit.

A general-purpose UI framework was intentionally not introduced because the supplied design has a limited custom component set and performance/control are important. Storybook provides isolated component documentation and improves DX without coupling the product UI to a larger design framework.

### Routing and SEO

Routes are structured to be predictable for users and search engines:

- `/` permanently redirects to `/product`;
- `/product` contains the product listing;
- `/product/:id` contains product details;
- `/robots.txt` and `/sitemap.xml` are generated by Nitro.

Filtered product views use query parameters and are intentionally `noindex,follow` while canonicalizing to the base product-list route.

The project also includes page metadata, canonical URLs, sitemap generation, robots rules, and Product structured data where relevant.

### 404 experience and fuzzy route matching

The 404 experience uses fuzzy route matching to detect paths that are close to known application routes.

Instead of always presenting a dead end, the UI can suggest the nearest valid destination. Redirects are reserved for cases where a destination is known confidently; ambiguous paths remain explicit suggestions.

### Accessibility

Accessibility is treated as part of component design rather than a final cleanup pass.

The implementation includes, where relevant:

- semantic HTML and landmarks;
- keyboard navigation;
- focus-visible states;
- focus management and restoration;
- focus trapping for overlays;
- Escape-key handling;
- ARIA relationships and state;
- accessible dialog behavior;
- `prefers-reduced-motion` handling;
- RTL-safe interactive controls.

Storybook's accessibility tooling is also used when reviewing the shared UI primitives.

### Performance

Performance-oriented decisions include:

- mobile-first layouts;
- ISR for product routes;
- Nuxt Image for responsive image delivery;
- minimal client-side JavaScript where CSS is sufficient;
- avoiding unnecessarily large UI/runtime dependencies;
- semantic theme tokens and reusable primitives;
- a server boundary around the external API.

## Routes and filter URLs

- `/` — permanent redirect to `/product`.
- `/product` — product listing. Supported query keys are `q`, repeatable `category` values, and `sort` (`price-asc`, `price-desc`, `rating-desc`, or `title-asc`).
- `/product/:id` — product detail and SEO metadata. Invalid or missing products return a proper 404 state.
- `/robots.txt` — generated crawler rules.
- `/sitemap.xml` — generated sitemap including product routes.

## Testing

Focused unit tests cover core non-visual logic such as:

- route registry behavior;
- page-route handling;
- fuzzy route matching;
- product runtime validation;
- sitemap generation.

Storybook provides isolated UI documentation and browser-level interaction/accessibility checks for shared primitives.

Given more time, useful next steps would include broader component unit tests, end-to-end coverage for product/filter flows, and visual regression testing.

## Git workflow

A simple **Git Flow** workflow is appropriate for the current project size.

For future commits, a Conventional Commit-style convention is recommended:

```text
feat: add new functionality
fix: resolve a defect
refactor: restructure code without changing behavior
test: add or update tests
docs: update documentation
chore: maintenance changes
```

This keeps history easier to review and supports future changelog/release automation.

## Manual QA

At representative mobile, tablet, and desktop widths, verify:

- loading, error, retry, and empty states;
- search/category/sort/clear filters;
- URL synchronization and browser navigation;
- product navigation and missing-product 404 behavior;
- mobile filter bottom-sheet close behavior (button, backdrop, Escape);
- keyboard focus and visible focus states;
- RTL layout;
- metadata/canonical behavior;
- responsive image loading.

In Storybook, keyboard-test the interactive primitives and confirm accessibility checks do not report regressions.

## Deployment

Deploy as a Nuxt application with server rendering enabled so ISR route rules remain active.

Set `NUXT_PUBLIC_SITE_URL` to the production origin and, when needed, override `NUXT_FAKE_STORE_BASE_URL` for the upstream product service.

## Author

**Sadegh Shahmoradi**
Frontend Developer
