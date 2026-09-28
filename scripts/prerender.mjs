import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const pages = [
  { page: 'home', file: 'dist/index.html' },
  { page: 'about', file: 'dist/about/index.html' },
  { page: 'product', file: 'dist/products/ram-1500-etorque-mgu-rebuild-kit/index.html' },
];

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

try {
  const { renderPage } = await vite.ssrLoadModule('/src/entry-server.jsx');

  for (const { page, file } of pages) {
    const filePath = resolve(file);
    const html = await readFile(filePath, 'utf8');
    if (!html.includes('<!--app-html-->')) throw new Error(`Missing prerender marker: ${file}`);
    await writeFile(filePath, html.replace('<!--app-html-->', renderPage(page)), 'utf8');
  }
} finally {
  await vite.close();
}
