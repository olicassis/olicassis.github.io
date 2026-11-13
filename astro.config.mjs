// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://olicassis.github.io',
  // The site is one page. Old addresses send visitors to their section.
  redirects: {
    '/career': '/#experience',
    '/projects': '/#projects',
    '/progress': '/#learning',
  },
});
