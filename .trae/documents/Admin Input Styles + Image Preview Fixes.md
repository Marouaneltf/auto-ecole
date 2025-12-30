## Objectives
- Standardize all admin inputs with a single reusable style system (text, textarea, number, email, select, file).
- Fix image preview across media library and content editing (upload, select, link) with robust URL resolution, loading and error handling.
- Ensure clean, predictable admin UX without touching front-office except shared fixes.

## Input Style System
1. Create a reusable directive: `AdminInputDirective` (standalone) applied to `input`, `select`, `textarea`.
2. Directive responsibilities:
   - Add unified classes and ARIA attributes.
   - Detect control state (invalid, disabled, touched) via `NgControl` and set `error`/`disabled` classes.
   - Manage strong focus ring with `HostBinding` (focusin/focusout) for consistent visual focus.
3. Shared stylesheet: `admin-input.css` with design tokens:
   - Height: 40px for text/select, padding 10x12; textarea min-height 120px.
   - Neutral border, 8px radius, subtle shadow; clear focus ring (primary color) and high-contrast text.
   - States: `:disabled`, `.error`, `.readonly`.
   - File input styling: button-like appearance with clear selected filename area.
4. Apply styles globally to admin via `AdminLayoutComponent` by providing the directive and stylesheet (no per-component duplication, no inline hacks).
5. Update admin forms to use directive attr (`adminInput`) instead of component-local input classes; keep labels for clarity.
6. Align Angular Material fields: add minimal CSS overrides for `.mat-mdc-form-field` to match spacing and focus ring without introducing libraries.

## Image Preview Fixes
1. Fix template access errors:
   - Change service injections to `public readonly api: ApiService` in `MediaLibraryComponent` and `AdminHomeHeroComponent`, or expose a public `resolve(urlOrItem)` method used by the template.
2. Robust URL resolution:
   - Use `ApiService.resolveMediaUrl(item)` which converts `/uploads/...` to `http://localhost:3000/uploads/...`.
   - Ensure backend static serving is correct (already at `/uploads`).
3. Preview behavior:
   - Media Library: grid thumbnails use resolved URLs; add `(error)` handler to show a fallback state (e.g., placeholder) and avoid broken icons.
   - Home Hero picker: use resolved URLs for selection; immediate preview update on selection; loading indicator during fetch.
   - Any content pages referencing media: update to use `resolveMediaUrl`.
4. Upload flow:
   - After upload success, update list and show immediate preview (no reload); maintain uploading state.

## Routing & UX Safeguards
- Keep admin routing untouched except shared fixes; ensure previews and forms do not cause layout jumps.
- No deep nesting or component mixing; maintain list/edit separation.

## Validation & Testing
- Visual: verify consistent input styling across Services List, Service Edit, Contact Info, Home Hero, Media Library.
- Accessibility: ensure readable contrast, visible focus ring, proper labels.
- Functional: test image previews in media grid, hero picker selection, and after upload; confirm no console errors.
- Regression: confirm front-office unaffected.

## Implementation Steps
1. Add `AdminInputDirective` and `admin-input.css`; provide the directive in `AdminLayoutComponent`.
2. Replace input/select/textarea across admin forms with `adminInput` attribute; remove duplicated per-component input styles.
3. Update `MediaLibraryComponent` and `AdminHomeHeroComponent` to use public resolver in template and add `(error)` handlers.
4. Verify locally in all admin pages; fix any edge cases.

## Notes
- No new libraries introduced; styles and directive are lightweight.
- Front-office untouched except the shared URL resolver already used; changes scoped to admin.

Please confirm this plan. After approval, I will implement the directive, stylesheet, template updates, and preview handling, then verify against the checklist.