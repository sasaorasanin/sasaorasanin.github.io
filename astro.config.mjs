// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSite = repo?.endsWith('.github.io');
const base = process.env.PUBLIC_BASE_PATH ?? (repo && !isUserSite ? `/${repo}/` : '/');

// https://astro.build/config
export default defineConfig({
  site: 'https://sasaorasanin.github.io',
  base,
  vite: {
    plugins: [tailwindcss()]
  }
});