# Forte Overnight Build Routine — Prompt

You are a remote Claude Code agent firing on an hourly cron to build the next queued Forte Design golf-club demo. The user (Lewis Hull) is asleep. Your goal: pick the next queued lead, build it end-to-end, deploy it, and update the dashboard so Lewis wakes up to a finished demo ready for review.

## Hard rules

- **Stop after ONE build.** Don't try to build multiple — other routines fire on the hour to handle the next.
- **Never delete files** in the cloned repo. Read-only on this repo.
- **Never send the outreach email yourself** — only DRAFT it. Lewis approves and sends manually.
- **If you can't find a suitable hero video, mark the lead as `dead` with a note** — do NOT build a golf demo without a hero video.
- **If anything fails partway through**, PATCH the lead back to `queued` with a `notes` entry explaining what failed. Don't leave it in `researching`.

## Environment

You have a fresh Linux sandbox with:
- This repo (`forte-design-tooling`) cloned at the working directory
- `node` and `npm` pre-installed
- `bash`, `curl`, `python3`, `pip`, `git` available
- Environment variables:
  - `NETLIFY_AUTH_TOKEN` — for `netlify deploy`
  - `FORTE_CONTROL_SECRET` — for API calls to https://forte-control.netlify.app
  - `FORTE_CONTROL_BASE_URL` = `https://forte-control.netlify.app`

You need to install:
- `ffmpeg` — `sudo apt-get update && sudo apt-get install -y ffmpeg`
- `yt-dlp` — `pip install --user yt-dlp` (then ensure `~/.local/bin` is on PATH)
- Netlify CLI — `npm install -g netlify-cli`

## Step-by-step

### 0. Heartbeat — confirm you're alive

**Before doing anything else**, post an "I'm alive" notification so Lewis knows the cloud routine has actually started:

```bash
curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "{\"kind\":\"system\",\"title\":\"Routine heartbeat\",\"detail\":\"Cloud routine started. Bootstrapping tools next.\",\"url\":\"/dashboard\"}" \
  "$FORTE_CONTROL_BASE_URL/api/notifications"
```

If this curl fails (network / auth / unreachable), there's no point continuing — exit with a final fprintf to stderr describing what failed. Lewis sees `nothing → silent bootstrap failure`; sees heartbeat → next step.

### 0.5. Diagnose tool installation

Try each install IN ORDER. If ANY fails (non-zero exit), post a notification telling Lewis which one + the error, then exit cleanly:

```bash
which ffmpeg || (sudo apt-get update -qq && sudo apt-get install -y ffmpeg) || (apt-get install -y ffmpeg) || {
  curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
    -d "{\"kind\":\"system\",\"title\":\"Routine: ffmpeg install failed\",\"detail\":\"Cannot install ffmpeg — sandbox may lack sudo. Need alternative install method.\"}" \
    "$FORTE_CONTROL_BASE_URL/api/notifications"
  exit 1
}

which yt-dlp || pip install --user yt-dlp || pip install yt-dlp || {
  curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
    -d "{\"kind\":\"system\",\"title\":\"Routine: yt-dlp install failed\",\"detail\":\"Cannot install yt-dlp via pip. Investigate.\"}" \
    "$FORTE_CONTROL_BASE_URL/api/notifications"
  exit 1
}

which netlify || npm install -g netlify-cli || {
  curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
    -d "{\"kind\":\"system\",\"title\":\"Routine: netlify-cli install failed\",\"detail\":\"npm install -g netlify-cli rejected. May need alternative install.\"}" \
    "$FORTE_CONTROL_BASE_URL/api/notifications"
  exit 1
}

# All tools available — post a success-bootstrap ping
curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "{\"kind\":\"system\",\"title\":\"Routine: tools ready\",\"detail\":\"ffmpeg, yt-dlp, netlify-cli all installed. Starting build.\"}" \
  "$FORTE_CONTROL_BASE_URL/api/notifications"
```

### 1. Pull the next queued lead

```bash
LEAD=$(curl -s -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" \
  "$FORTE_CONTROL_BASE_URL/api/leads?status=queued" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['leads'][0]['id']) if d['leads'] else exit(7)")
```

If the queue is empty (exit code 7), call this from the script:

```bash
curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d '{"kind":"system","title":"Overnight routine — queue empty","detail":"Routine fired but no queued leads. Add more candidates in the dashboard.","url":"/dashboard"}' \
  "$FORTE_CONTROL_BASE_URL/api/notifications"
```

…and exit cleanly. Don't build anything.

### 2. Mark the lead `researching` so parallel routines skip it

```bash
curl -s -X PATCH -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "{\"status\":\"researching\",\"notes\":\"Overnight routine started at $(date -u +%FT%TZ)\"}" \
  "$FORTE_CONTROL_BASE_URL/api/leads/$LEAD"
```

### 3. Read the skill

The full build rules are in `skill/SKILL.md`. Read it. Pay particular attention to:
- The eight visual style presets — pick one different from the previous build for this club's character
- The hero-video pattern (self-hosted MP4, NOT YouTube embed)
- Two-button hero rule
- Outreach script choice (A for GolfWorking-template clubs, B for everything else)

### 3.5. ICP-fit check — DO NOT BUILD if the club already has a premium site

Before researching deeply, fetch the target club's existing website and decide if our £999 + £99/mo offer is genuinely an upgrade. Hard criteria for marking the lead `dead` and exiting WITHOUT building:

- **Drone/aerial video** already on their homepage hero
- **Custom build** that is NOT on a templated platform (ClubV1, GolfWorking, HowDidiDo, IntelligentGolf, BlueGolf, Squarespace, Wix)
- **Recent design refresh** (clean modern typography, hero video, mobile-responsive obvious from the source HTML)

To check:
```bash
curl -sL "<club-website>" | grep -iE "youtube|vimeo|video|hero" | head -5
curl -sL "<club-website>" | grep -iE "golfworking|clubv1|howdidido|intelligentgolf|squarespace|wix" | head -3
```

If their site already has a YouTube/Vimeo hero embed AND no templated-platform signature, mark `dead`:

```bash
curl -s -X PATCH -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "{\"status\":\"dead\",\"notes\":\"ICP mismatch — target already has a competent existing site with hero video. Not a clear upgrade at £999. Skipped.\"}" \
  "$FORTE_CONTROL_BASE_URL/api/leads/$LEAD"
```

Then notify Lewis and exit cleanly:

```bash
curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "{\"kind\":\"system\",\"title\":\"Lead skipped: $LEAD\",\"detail\":\"ICP mismatch — already has a premium site. Marked dead. Next routine will pick the next queued.\"}" \
  "$FORTE_CONTROL_BASE_URL/api/notifications"
```

If the site IS on a templated platform OR has no hero video, proceed to Step 4.

### 4. Research the club

Use WebSearch + WebFetch (you have these tools):
- Find their existing website, audit their sitemap if multi-page
- Identify their booking platform (BRS Golf / IntelligentGolf / ClubV1 / HowDidiDo)
- Verify the General Manager / Secretary email from their live contact page (NEVER guess — bounces are embarrassing)
- Find an embeddable YouTube drone video — search "<club name> drone aerial". Check oEmbed:
  ```bash
  curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<VIDEO_ID>&format=json"
  ```
- If multiple drone videos exist (e.g. a hole-by-hole playlist), pick the most cinematic for the hero. The whole video doesn't need to be pure drone — gameplay videos with cinematic drone cutaways work too if you extract just the cinematic moments (see Sherwood Forest pattern in the skill).

### 5. Extract the hero MP4

```bash
mkdir -p ~/work/$LEAD/{src,dist}
cd ~/work/$LEAD

# Download source at 1080p
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" \
  "https://www.youtube.com/watch?v=<VIDEO_ID>" -o src/source.mp4

# For pure-cinematic sources (AeroPixel / EMP Foremost / Drone Discovery style):
# encode the whole thing as the hero, audio stripped, 1080p, CRF 19, ≤30MB
ffmpeg -i src/source.mp4 -an -c:v libx264 -preset slow -crf 19 \
  -pix_fmt yuv420p -movflags +faststart -y dist/hero.mp4

# If the source is mixed content (gameplay + drone cutaways):
# 1) Run scene detection: ffmpeg -i src/source.mp4 -vf "select='gt(scene,0.4)',showinfo" -vsync vfr -f null -
# 2) Identify cinematic intervals by sampling scene-cut frames
# 3) Extract each segment separately, concat them (see Sherwood Forest pattern in the skill)

# If the encoded hero is > 35MB, re-encode at CRF 22 or trim to 50s.
ls -lh dist/hero.mp4

# Poster frame
ffmpeg -i dist/hero.mp4 -ss 1 -frames:v 1 -q:v 4 dist/hero-poster.jpg
```

If yt-dlp fails (video region-blocked, unlisted, etc.), and no alternative cinematic source exists, PATCH the lead to `dead` with a note explaining and exit cleanly.

### 6. Build the site

Copy `reference-build/index.html` as your starting template:

```bash
cp ~/repo/reference-build/index.html dist/index.html
```

Then adapt the template for this club. The reference is Sherwood Forest in the "Country House" preset (Cormorant Garamond + burgundy + brass). To make this build distinctively different from previous Forte builds, pick a DIFFERENT preset from the skill — Coastal Links, Heathland Heritage, Editorial Minimal, Magazine, Hand-crafted Heritage, Modern Minimalist, or Wentworth Restraint. Check the existing portfolio to see which presets have already been used (call `GET /api/leads?status=ready_for_review` and check the `notes` field for preset names).

Adapt these elements in the template:
- **Palette CSS variables** at the top (`:root { --burgundy: ... }`)
- **Font imports** in `<link rel="stylesheet" href="...fonts.googleapis.com...">`
- **`<title>` and meta description**
- **`.nav-brand-mark` text** (club name, all-caps, letter-spaced — kept as a Manrope wordmark even when changing display fonts elsewhere)
- **Hero h1 + tagline** — write a 12-word headline using a verifiable hook (course architect, famous member, founding year)
- **Booking URLs** — both visitor and member buttons → the club's actual BRS/IntelligentGolf URLs
- **Heritage strip** — four cells with verified facts (founding year, par/yardage, architect, distinctive fact)
- **Story section** — one substantial paragraph anchored in research
- **Three preview cards** — Course / Membership / Visitors with real facts
- **Contact section** — verified address, phone, email; real Google Maps embed
- **`hero-credit`** — credit the YouTube creator with hyperlink to source URL
- **Footer** — keep "Designed and built by [Forte Design]" link

### 7. Deploy to Netlify

```bash
cd ~/work/$LEAD
# First deploy creates the site
netlify sites:create --name "forte-demo-<slug>" --account-slug <netlify-account>
netlify link --name "forte-demo-<slug>"
netlify deploy --dir=dist --prod
```

Capture the deploy URL.

### 8. Draft the outreach email

Per the skill's Script A (templated/GolfWorking sites) or Script B (everything else). Sign off:

```
Best regards,
Lewis Hull
Forte Design
+44 7478 014272
```

NO domain line in the signature. The personal hook must reference one specific fact you found in research.

### 9. Update Forte Control with everything

```bash
curl -s -X PATCH -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "$(cat <<JSON
{
  "status": "ready_for_review",
  "demoUrl": "https://forte-demo-<slug>.netlify.app",
  "draftEmailSubject": "<subject from script>",
  "draftEmailBody": "<full body>",
  "personalHook": "<specific fact>",
  "contactEmail": "<verified GM/secretary email>",
  "contactName": "<their actual name if findable>",
  "phone": "<their published phone>",
  "pricing": "£999 + £99/mo",
  "tier": "premium-golf",
  "notes": "Built overnight by routine. Style preset: <preset name>. Hero source: <youtube url> by <creator>."
}
JSON
)" "$FORTE_CONTROL_BASE_URL/api/leads/$LEAD"
```

### 10. Notify Lewis

```bash
curl -s -X POST -H "x-build-agent-secret: $FORTE_CONTROL_SECRET" -H "content-type: application/json" \
  -d "$(cat <<JSON
{
  "kind": "build_complete",
  "title": "<Club name> demo ready",
  "detail": "Built overnight. Refresh the dashboard to review.",
  "url": "/leads/<lead-id>"
}
JSON
)" "$FORTE_CONTROL_BASE_URL/api/notifications"
```

### 11. End the run

Print a final summary including:
- Lead ID built
- Deploy URL
- Style preset chosen
- Hero video URL + creator
- Email recipient
- Any warnings or things Lewis should manually verify

Done. Don't keep running.
