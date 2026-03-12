# Sasa Orasanin CV Website

Static, Markdown-first CV website built with Astro and Tailwind, ready for GitHub Pages and automated PDF export.

## What this repository does

- Renders a professional single-page CV website from Markdown files.
- Keeps content editing simple for mobile and GitHub web editing.
- Supports automatic PDF generation from the rendered page using Playwright.
- Includes GitHub Actions for both Pages deployment and PDF generation.
- Supports light and dark website themes while keeping print/PDF output light and recruiter-safe.
- Uses a wider two-column desktop layout and collapsible secondary sections for better on-screen scanning.

## Tech stack

- Astro
- Tailwind CSS
- Astro content collections (Markdown loaders)
- Playwright (PDF export)
- GitHub Actions

## Project structure

```text
.
├── content/
│   ├── site.md
│   ├── about-me.md
│   ├── education.md
│   ├── contact.md
│   ├── versions/
│   │   ├── full.md
│   │   ├── dot-net.md
│   │   ├── php.md
│   │   └── laravel.md
│   ├── work-experiences/
│   ├── products/
│   ├── ecosystems/
│   ├── professional-work/
│   ├── open-source/
│   └── skills/
├── public/
│   └── cv/
│       └── Sasa-Orasanin-CV.pdf
├── scripts/
│   └── generate-pdf.mjs
├── src/
│   ├── content.config.ts
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── .github/workflows/
		├── deploy-pages.yml
		└── generate-pdf.yml
```

## Local development

1. Install dependencies:

```bash
npm ci
```

2. Start dev server:

```bash
npm run dev
```

3. Open the local URL shown by Astro (default `http://localhost:4321`).

## Editing CV content

All source content lives in `content/`.

- Single sections: `content/site.md`, `content/about-me.md`, `content/education.md`, `content/contact.md`
- Repeatable items: one Markdown file per item inside:
	- `content/work-experiences/`
	- `content/products/`
	- `content/ecosystems/`
	- `content/professional-work/`
	- `content/skills/`

### Portfolio grouping model

- `Products & Ventures`: `content/products/`
- `Open Source Ecosystems`: `content/ecosystems/`
- `Professional Work`: `content/professional-work/`

The website presentation follows these groups directly for stronger signal and clearer recruiter-facing storytelling.

### Ordering

Use frontmatter field `order` (lower number = earlier in list).

### Dates

Use `YYYY-MM` format where possible (`start` and `end` in work entries).

### Open source selection

Ecosystem entries in `content/ecosystems/` are intentionally concise and high-signal.

- Focus on ecosystem scope, representative links, and scale.
- Avoid listing dozens of individual package cards on the main page.

### Version-aware filtering and ordering

You can define CV variants in `content/versions/*.md`.

- `full` shows everything.
- `dot-net`, `php`, `laravel` are available as generated pages.

Generated routes:

- `/`
- `/dot-net/`
- `/php/`
- `/laravel/`

For repeatable entries (work experiences, products, ecosystems), frontmatter supports:

- `displayOn`: list of versions where an item should appear.
- `priority`: per-version priority map (lower number appears earlier).
- `collapsed`: controls default collapsed state when version collapse mode is `mixed`.
- `stars`: optional numeric badge shown on cards/summaries.

Example:

```md
displayOn:
	- dot-net
	- php
priority:
	dot-net: 1
collapsed: false
stars: 120
```

Version files can also define default collapse mode:

```md
collapse:
	workExperiences: mixed # all | none | mixed
	products: all
```

Skill items support both simple strings and rich object format:

```md
items:
	- name: C# / ASP.NET
		order: 1
		displayOn:
			- full
			- dot-net
```

## Build and preview

Build static output:

```bash
npm run build
```

Preview build locally:

```bash
npm run preview
```

## PDF generation

PDF is generated from the rendered website page (not from a separate manual template).

### Local PDF generation

1. Build site:

```bash
npm run build
```

2. In one terminal, serve built files:

```bash
npm run serve:dist
```

3. In another terminal, generate PDF:

```bash
npm run generate:pdf
```

This writes output to:

- `public/cv/Sasa-Orasanin-CV.pdf`

You can override defaults with environment variables:

- `CV_URL`
- `CV_PDF_OUTPUT`

If port `4321` is already in use locally, start a temporary static server on another port and set `CV_URL` accordingly.

## GitHub Actions

### Deploy to GitHub Pages

Workflow: `.github/workflows/deploy-pages.yml`

- Triggered on push to `main` (and manual dispatch).
- Builds Astro site and deploys `dist/` to Pages.

### Generate PDF

Workflow: `.github/workflows/generate-pdf.yml`

- Triggered on pushes that touch CV/content/app files and manual dispatch.
- Builds site, serves `dist/`, generates PDF with Playwright, uploads PDF artifact.

## Enabling GitHub Pages

1. Push repository to GitHub.
2. In repository settings, open Pages.
3. Set source to GitHub Actions.
4. Run or wait for `Deploy Astro site to GitHub Pages` workflow.

## Notes for future CV variants

A future variant system is prepared via `content/versions/`.

Current variant:

- `full`

You can later add variant files and filter section/entry rendering by tags or variant fields.
