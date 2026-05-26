# Forte Design — Build Tooling

Source-of-truth repo for the remote routines that build Forte Design golf-club demos overnight.

## What's in here

| Path | Purpose |
|---|---|
| `skill/SKILL.md` | The `forte-vertical-golf-course` skill — full build rules, palette presets, hero pattern, outreach scripts. The routine reads this at the start of each run. |
| `reference-build/index.html` | The canonical single-page template (Sherwood Forest in Country House preset). Routine clones from this and adapts per-club. |
| `routine/prompt.md` | The exact prompt fed to each remote-agent routine run. |

## What this repo does NOT contain

- **No source video MP4s** — each routine downloads its own via `yt-dlp` per the skill rules
- **No secrets** — the Netlify token, Forte Control API secret, and any other credentials live as routine env vars, not in the repo
- **No deploy outputs** — each routine builds + deploys in its sandbox and never commits back

## How the overnight pipeline works

1. Routine fires on cron (e.g. 1am UTC)
2. Clones this repo as the working tree
3. Reads `skill/SKILL.md` to absorb the build rules
4. Calls Forte Control API to grab the next `queued` lead
5. Researches the club (web, YouTube, contact page)
6. Extracts a self-hosted MP4 hero from a chosen YouTube source
7. Clones `reference-build/index.html` and adapts for the new club (colours, content, hero source)
8. Deploys to Netlify under `forte-demo-<slug>.netlify.app`
9. PATCHes the dashboard lead → `ready_for_review` with the demo URL + draft outreach email
10. Posts a notification to Forte Control so Lewis sees it at breakfast

If anything fails, the lead is PATCHed back to `queued` so the next run retries.
