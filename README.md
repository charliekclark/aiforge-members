# aiforge-members

Member cards for AI Forge, Marquette's AI engineering organization. Each member adds their own card with a pull request.

**Live page:** https://charliekclark.github.io/aiforge-members/

**Want on the page?** Read [CONTRIBUTING.md](CONTRIBUTING.md).

## How it works

- `cards/first-last.json` holds one member's card. `photos/` holds their picture.
- `index.html` reads `cards.json` and draws the cards.
- `cards.json` is generated. After a merge to `main`, a GitHub Action runs `scripts/build.mjs`, which validates every card and rebuilds it. Nobody edits `cards.json` by hand, so merges don't conflict.
- Every pull request runs `node scripts/build.mjs --check`, which catches missing fields, bad LinkedIn links, and missing or oversized photos.

## Maintainer notes

- Turn on GitHub Pages once: **Settings > Pages > Deploy from a branch > `main` / root**.
- Merge pull requests as usual. The page updates about a minute after each merge.
- First-time contributors' checks wait for a maintainer to click **Approve and run**. You can also merge without waiting for them.
- If the Action is ever unavailable, run `node scripts/build.mjs` locally and commit `cards.json`.
