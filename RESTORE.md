# How to roll the site back

The portfolio as it stood before the Manifest landing work is saved in two
places, both pointing at the same commit:

| | |
|---|---|
| **Commit** | `6c0fe21` — "Drop 'Monetization AI' byline from resume header" |
| **Tag** | `original-2026-08-17` |
| **Branch** | `original-portfolio` |
| **Date** | 2026-08-17 |

That commit is exactly what was deployed at the time — the `LandingV3` home
page, the three case studies with no manifest skin, and the production gate in
`middleware.ts` with its original shape geometry.

## Roll production back

Vercel deploys whatever is on `main`. So putting the old code back on `main` and
pushing is the whole operation.

```bash
cd "/Users/shane/Documents/2026 portfolio/05.21 - V1 (most UPDATED)/portfolio-site"

# 1. Save whatever you have in progress, so nothing is lost
git stash -u

# 2. Point main back at the original and publish it
git checkout main
git revert --no-commit 6c0fe21..HEAD
git commit -m "Roll back to the pre-Manifest portfolio"
git push origin main
```

`git revert` is deliberate here: it adds a new commit that undoes the changes,
so the history stays intact and you can roll *forward* again just as easily.

**If you would rather erase the new work from `main` entirely** — only do this if
you are certain, it rewrites published history:

```bash
git reset --hard original-2026-08-17
git push --force origin main
```

## Just look at the old version without changing anything

```bash
git checkout original-portfolio     # or: git checkout original-2026-08-17
npm run dev                         # → localhost:3001
git checkout main                   # back to current
```

## Roll back one file

```bash
git checkout original-2026-08-17 -- path/to/file.tsx
```

Useful for the gate specifically:

```bash
git checkout original-2026-08-17 -- middleware.ts
```

## Recover a deleted file

`Landing.tsx` (the old `/v1` home page) and `WhatsApp 2.tsx` were deleted. They
still exist in the tag:

```bash
git checkout original-2026-08-17 -- "client/src/pages/Landing.tsx"
```

## What is NOT covered by this

Two things live outside git and cannot be restored from it:

1. **The Vercel environment variable `PORTFOLIO_PASSWORD`.** Set in the Vercel
   dashboard, not in the repo. Rolling back code does not change it. It falls
   back to `openSesame` if unset.
2. **Anything never committed.** Check `git status` before assuming a file is
   safe. Notably `client/src/components/GateBackground.tsx` — the React source of
   truth for the gate's shape design — was untracked until this work shipped, and
   existed only on one machine.

## The gate exists twice — keep both in sync

`CLAUDE.md` says this and it is worth repeating here, because it is the easiest
thing to get wrong when rolling back:

- `client/src/components/GateBackground.tsx` — React, the design source of truth,
  what `/gate` and `/flow` render locally
- `middleware.ts` — a hand-written vanilla-JS port of the same thing, and the
  **only** one that runs on the live site

Changing one does not change the other. If a rollback restores `middleware.ts`
but not `GateBackground.tsx`, the live gate and the local preview will disagree
and neither will be wrong — they are just two copies.
