# Ledger — 2026-11-04-mvp-foundation
Pre-flight: public and admin share a single publication projection and transactional repository.
Ruling: deliver an explicitly labelled local demo with synthetic test-only content enabled only by a manual demo import. National administrative source import remains pending; no fictitious businesses are presented as real.
Ruling: store optional media as approved external HTTPS links initially; local image upload/recoding deferred and not exposed. No paid hosting or production publication.
Task 1: demo persistence complete — PostgreSQL 17/PostGIS 3.5 running; idempotent migration, territory hierarchy, publication guard, public projection and transactional audit verified.
Task 2: demo public workflow complete — responsive home, explorer, filters, detail, empty/error distinction; local Natural Earth map via MapLibre. Ruling: use local generalised public-domain cartography instead of an uncontracted external tile service; not administrative or navigation-grade data. No real markers until authorized coordinates exist.
Task 3: demo editorial workflow complete — login, create/edit/publish/withdraw and audit; encrypted hashes and opaque expiring sessions. Media upload and multiple roles deferred, not exposed.
Task 4: operations prepared — setup, backup/restore, docs and tests. No production publication or paid services.
Final review: independent reviewer found private-coordinate data loss, fractional pagination and global login blocking. Fixed with regression tests: authenticated projection, integer pagination and account-specific attempts reset on success.
Browser diagnostics: explicit MapLibre module-worker URL required by current bundler; copied from locked package at build. Redirects now use configured APP_ORIGIN, not internal bind hostname. Explicit select labels and awaited form confirmation tested in browser.
Deferred minors/production work: format/refactor dense initial UI files, full WCAG audit, CSP, distributed client rate limits, legal contact, territorial source import, media licensing pipeline, price editing, source-specific verification, roles, creators, advertising, offline PWA and production SEO. Demo stays noindex.
Final verification: npm test 16/16; npm run typecheck and production build pass. Playwright 6/6 pass on desktop/mobile, including map idle and admin publish/withdraw/logout. Mobile width 390 has no horizontal overflow. Backup restored four initial demo records and PostGIS in isolated temporary database; DB restart retained records.
Final browser fix: key editorial form by place ID so client navigation resets uncontrolled select values. E2E waits for editing state and server confirmation before proceeding.
Formatting: source, tests and scripts formatted with Prettier.
Environment draft save: unconfirmed; platform returned draft_not_editable. Proposed install_script/start_skill retained in docs/environment-config.proposed.json. No environment publication performed.
