# ToolHub – free online tools (Milestone 1)

## Windows 10/11 (PowerShell)
1. Install Node.js LTS from https://nodejs.org, then reopen PowerShell.
2. `cd toolhub`
3. `npm install`   (this also creates package-lock.json – commit it)
4. `npm run dev`   (open the printed localhost URL)
5. `npm run build` (output in `dist/`)

## Deploy
1. `git init; git add .; git commit -m "Initial commit"`; create an empty GitHub repo and follow its push instructions.
2. Cloudflare Pages → Create project → Connect to Git → pick the repo.
3. Build command `npm run build`, output directory `dist`. Deploy.

## Status
Done: layout, routing, search, categories, dark mode, ad placeholder, 404, per-tool title/description/canonical, 7 text tools, 5 SEO generators (slug, meta tags, robots.txt, sitemap, SERP preview), password and random number generators, 6 calculators (percentage, discount, profit margin, BMI, age, date difference).
Not built yet: image, PDF, SEO, developer, unit converter, time duration and everyday tools; legal pages; sitemap; Open Graph tags; structured data.
Not yet tested: `npm install`/`build` could not be run in my sandbox (no network).
