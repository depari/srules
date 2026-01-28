# Unit Test Fix Implementation Details

**Date**: 2026-01-28
**Task**: Fix failing unit tests and lint errors.

## Learned Patterns & Fixes

### 1. `document.createElement` Mocking in Jest/JSDOM
When mocking `createElement`, ensure it returns a real `Node` (or a proxy to one) if you need to pass it to `appendChild`. Mocking `appendChild` globally can break React's rendering mechanism (Testing Library's `renderHook` or `render`) because React uses `appendChild` to mount the component to the container.

**Correct Approach**:
Mock `createElement` to return a real element, then spy on its methods (`click`, etc.). Spy on `appendChild` locally (inside the test) but let it pass through to the original implementation unless specifically preventing modification.

```typescript
const originalCreateElement = document.createElement.bind(document);
jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
    const el = originalCreateElement(tagName);
    if (tagName === 'a') jest.spyOn(el, 'click').mockImplementation(mockClick);
    return el;
});
```

### 2. React Query Testing
Always wrap components using React Query hooks with `QueryClientProvider` in tests using a `customRender` utility. For hooks testing (`renderHook`), mock the custom hooks (`useQuery` wrappers) instead of `useQuery` itself for better isolation and control.

### 3. Accessibility Testing (`getByLabelText`)
Ensure `label` has `htmlFor` matching the input's `id`.

### 4. Playwright E2E Testing
- **Selectors**: Avoid text/class-based selectors for critical elements. Use `data-testid` where possible.
- **Matchers**: Be flexible with URL matching (trailing slashes, locale prefixes).
  - Bad: `toHaveURL(/\/rules$/)`
  - Good: `toHaveURL(/\/rules\/?$/)`
- **Dynamic Content**: Verify dynamic text changes (e.g., "Favorite" -> "Unfavorite") by checking the component implementation first to get exact strings.

## Status
- All unit tests passed.
- Lint clean.
