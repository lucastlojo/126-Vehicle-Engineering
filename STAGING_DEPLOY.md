# GitHub Pages staging deployment

This Vite/React storefront is deployed from `main` by `.github/workflows/deploy-staging.yml`. GitHub Actions installs dependencies, builds the prerendered site, uploads `dist/`, and deploys it to GitHub Pages. `VITE_BASE_PATH` is set to `/<repository-name>/`, so links and images work at `https://<owner>.github.io/<repository-name>/`. A manual run is available through `workflow_dispatch`.

## Enable and publish

1. Put this project in the intended GitHub repository and push it to `main`. The current local folder must be connected to a Git repository and remote before a push can occur.
2. In the repository, open **Settings → Actions → General**. Allow GitHub Actions to run and permit the workflow actions used here. If your organization restricts Actions, an administrator must allow `actions/*` and `pnpm/action-setup`.
3. Open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. Save.
4. Open the **Actions** tab and run **Deploy staging to GitHub Pages** manually, or push a commit to `main`. The build and deploy jobs must both pass. The deployment URL appears in the `github-pages` environment and the workflow run.
5. For a standard project site, open `https://<owner>.github.io/<repository-name>/` and the product page beneath it. Run the browser checks:

   ```powershell
   pnpm install --frozen-lockfile
   pnpm exec playwright install chromium
   pnpm verify:staging -- https://<owner>.github.io/<repository-name>/
   pnpm verify:interactions -- https://<owner>.github.io/<repository-name>/
   ```

   To check locally, run `pnpm build`, then `pnpm preview`, then `pnpm verify:staging -- http://127.0.0.1:4173/`. The verifier checks all three routes at 320, 390, 719, 721, 879, 881, and 1280 CSS pixels for rendered headings, images and same-origin assets, horizontal overflow, base-path links, navigation and product breakpoints, and the `noindex` meta tag.

## Base path

The workflow's `VITE_BASE_PATH: /${{ github.event.repository.name }}/` is for a normal GitHub **project site**. If using a user/organization site (`<owner>.github.io`) or a custom domain at the root, change it to `/`. For a privately published Enterprise Pages site, use the actual URL path shown by GitHub and set `VITE_BASE_PATH` accordingly. Local builds default to `/`.

## Visibility and indexing

All three HTML pages include `<meta name="robots" content="noindex, nofollow">` for staging. Remove this from any production release. **GitHub Pages is generally public, including when the source repository is private.** A robots tag asks compliant search engines not to index the pages; it does not prevent people or bots from viewing them. GitHub Enterprise Cloud organization project sites can be privately published where Pages access control is available. If access restriction is mandatory and that feature is unavailable, use a host that provides authentication instead of publishing this staging site on Pages.

The frontend is still a demonstration: the cart is local, checkout hands off to the legacy product page, artwork is conceptual, and catalog/fitment data need owner signoff. Do not use this Pages site for real orders.

References: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), and [private Pages access control](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site).
