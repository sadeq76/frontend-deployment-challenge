# CSS architecture

The stylesheet is split by ownership so that styling changes stay close to the UI they affect without duplicating shared primitives.

| Location                           | Responsibility                                                           |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `main.css`                         | The single CSS entry point and import order.                             |
| `base.css`                         | Fonts, element defaults, and global accessibility defaults.              |
| `themes.css`                       | Semantic design tokens, including color mode values.                     |
| `typography.css`                   | Shared semantic text-scale classes (`title-*`, `body-*`, and `label-*`). |
| `components.css`                   | Shared layout and visual primitives used by two or more Vue components.  |
| `animations.css`                   | Shared keyframes and motion helpers.                                     |
| `<component>.vue` `<style scoped>` | Selectors used only by that component, including page-local components.  |

## Ownership rule

1. Start a selector in the owning Vue component inside `<style scoped>`.
2. Move it to `components.css` only after it is used by at least two Vue components.
3. Keep generic, stable names for shared primitives (for example, `.shell` and `.surface-card`). Use a component-prefixed selector for local styles (for example, `.product-card__image`).
4. Prefer semantic tokens from `themes.css` whenever a matching token exists; migrate legacy literal values as their owning component is touched.
5. Use the grouped classes in `typography.css` for repeated UI text styles. Keep a one-off text treatment in its owning component.
6. Tailwind utility classes remain appropriate for one-off layout composition in templates. They do not make a selector shared.

## Responsive rule

The application is mobile-first. Write a component's narrow-screen layout as the base rule, then add `min-width` media queries or Tailwind breakpoints only when the available space increases. For example, use `px-4 lg:px-12`, rather than a desktop default followed by a mobile override. This matches the primary ecommerce browsing context and keeps the smallest layout easy to reason about.

This rule keeps global CSS small, avoids accidental cross-component coupling, and lets scoped styles evolve with their component.
