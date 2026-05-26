---
name: forte-vertical-golf-course
description: Use when building a Forte Design website for a UK golf club. Trigger on any golf-club build (members club, proprietary, municipal) or when the Forte Master Agent picks "golf" as the vertical after research. Provides the section structure, drone-hero pattern (YouTube embed only — never re-host), booking integration patterns for BRS Golf / IntelligentGolf / ClubV1 / HowDidiDo, design direction, pricing positioning (£999 + £99/mo), and two outreach scripts (one for clubs on GolfWorking templated sites, one for clubs on weak generalist-built sites or no site).
user-invocable: true
license: Forte Design internal
---

# Forte Vertical — UK Golf Club

The Golf vertical for Forte Design's website build pipeline. **Always combine with `forte-premium` as the tier skill** — there is no Starter or Standard golf tier. Golf clubs are mid-budget B2B with longer sales cycles and higher willingness to pay; they get the Premium experience by default.

Source research: `C:/dev/Claude/Projects/Forte Design/sites/_golf-scout-2026-05-24.md`. Read it once at the start of any golf build so you understand the market — Wentworth as the benchmark, GolfWorking as the templated competitor, and the specific gaps mid-tier UK clubs leave on the table.

## Pricing & positioning (lock this in every conversation)

- **£999 setup + £99/mo recurring.** Hold the line — even if the club asks for a discount, the work that justifies this price (drone hero, custom design, full section coverage, hosted on Vercel) genuinely lives up to it.
- **Positioning line:** *"Wentworth-tier site at a fraction of the cost."* Wentworth's site was built by The Hideout (luxury hospitality agency) for what is almost certainly a five-figure sum. We're delivering a similar visual standard for £999.
- **Competitor frame:** GolfWorking is the templated specialist in this space (Rotherham, Whittington Heath, etc. — see scout). Their bundle is £1.5k–£3.5k templated. Our angle: *custom for less than their templated.*
- **No drone bolt-on.** We do NOT shoot drone footage. We use what already exists publicly (see Drone Hero Pattern below). If the club asks "can you commission a drone shoot for us?" the answer is: "We'll connect you with a UK drone pilot for that — typically £150–£400 — and we'll integrate the footage when you've got it." Don't take that work on.

## Architecture — MULTI-PAGE, matching the club's existing sitemap

UK golf clubs run multi-page sites (typically 12–20 pages: Home, Course Introduction, Hole-by-Hole, Course Card, Gallery, Promotional Video, Individual Membership, Visiting, Green Fees, Clubhouse, Catering, Testimonials, Club Introduction, Hogan/Heritage, Club History, Dress Code, Local Rules, Contact). Their members have ten years of muscle memory for that nav.

**Build multi-page, not single-page-scroll.** This is the hard rule reinforced from the Master Agent. Audit the club's existing sitemap exhaustively (every link in main nav dropdowns, footer, sub-nav, page content). Build a page for every one of theirs. Reuse a shared header + footer + stylesheet across all pages so they feel one site, not seventeen separate brochures.

File structure inside `sites/<slug>/dist/`:

```
dist/
├── index.html              (Home — hero + heritage + 3-section preview)
├── styles.css              (one shared stylesheet, all design tokens)
├── scripts.js              (shared scroll/reveal/nav JS)
├── club/
│   ├── introduction.html
│   ├── history.html
│   ├── hogan.html          (or whatever the club's heritage hook is)
│   ├── dress-code.html
│   └── local-rules.html
├── course/
│   ├── introduction.html
│   ├── hole-by-hole.html
│   ├── card.html           (the scorecard page)
│   └── gallery.html
├── visit/
│   ├── visiting.html
│   ├── green-fees.html
│   ├── clubhouse.html
│   ├── dining.html
│   └── testimonials.html
├── membership.html
└── contact.html
```

If the club's URL slugs differ (e.g. `/hogan-at-panmure` not `/club/hogan`), MATCH THEIR EXACT SLUGS so any inbound links/bookmarks still work. Add 301 redirects for our cleaner URLs in `_redirects` if there's a structural change.

**Shared layout pattern.** Each page should look like:

```html
<!-- Same nav, same footer, same scripts on every page -->
<nav>...</nav>
<main>
  <!-- Page-specific content here -->
</main>
<footer>...</footer>
<script src="/scripts.js"></script>
```

Use a Node build script (`_build.mjs`) at the project root that takes a `template.html` shell + per-page content files and outputs the full HTML files into `dist/`. This means a copy change in the footer is one edit, not seventeen.

## The non-negotiable build flow

1. **Read the research dossier** the Forte Master Agent wrote at `sites/<slug>/research.md`. Do not start designing until you've actually read it.
2. **Find the drone footage.** Search YouTube and Instagram for `<club name> drone` and `<club name> aerial`. List every candidate video with its URL, channel name, view count, length, and a one-line quality assessment. Pick the best one. If nothing usable exists, flag it to Lewis — DO NOT BUILD A GOLF SITE WITHOUT A HERO VIDEO. The whole pitch falls apart without it.
3. **Confirm the video is embeddable.** Open the video in a browser and check Share → Embed. If embedding is disabled, move to the next candidate. Never re-host the file.
4. **Identify the booking platform** the club currently uses (look for "Book a Tee Time" button on their existing site, see where it links). Use the matching integration pattern below.
5. **Build per the section structure below.** Every section is opt-out, not opt-in — if the club explicitly doesn't do weddings, drop that section, otherwise include it (most clubs do but bury it on their current site).
6. **Self-test in browser** (Master Agent enforces this in Phase 2 — follow its verification checklist).

## Required policy / footer pages (LEARNED FROM SHERWOOD FOREST 2026-05-26)

Every multi-page golf build MUST include the following pages, accessible from the footer nav. Clubs are legally obliged to publish most of these. The fact that many templated GolfWorking sites have them and many Forte demos don't is a "you forgot this on your current site" sales hook.

| Page | Content (boilerplate adapted with club name) |
|---|---|
| `/club-rules` | Club & Course Rules — dress code, etiquette, course management |
| `/local-rules` | Local Rules — course-specific R&A rule modifications (OB, drops, hazards) |
| `/health-safety-policy` | Health & Safety Policy — visitor + member liability, course hazards |
| `/safeguarding-policy` | Safeguarding Policy — junior + vulnerable adult protection (England Golf required) |
| `/equality-diversity-policy` | Equality & Diversity Policy — England Golf required |
| `/disciplinary-policy` | Disciplinary Policy — member conduct + sanctions framework |
| `/booking-terms` | Booking T&Cs — visitor green-fee terms, cancellation, deposits |
| `/visitor-terms` | Visitor T&Cs — conduct on club premises |
| `/visitor-near-miss` | Visitor Near-Miss Reporting (only for courses with public footpaths crossing fairways — Sherwood Forest model) |

Build these as simple text-heavy pages with the standard page-hero banner pattern + body copy. Pull the actual rules from the club's existing site where they exist; otherwise use the standard England Golf templates.

## Hero proof-line rule (LEARNED FROM SHERWOOD FOREST 2026-05-26)

The hero should lead with the strongest third-party authority claim, in this priority order:

1. **National ranking from an authority** — *"Ranked in the 100 Top Courses in England — Golf Monthly, Golf World & Today's Golfer"* (Sherwood Forest pattern). Quote the source.
2. **Major tournament hosting** — *"Open Championship Regional Qualifying venue since [year]"*
3. **Notable architect attribution** — *"A Harry Colt heathland, extended by James Braid in 1927"*
4. **Famous-member affiliation** — *"Where Danny Willett learned the game that won him the Masters"*
5. **Heritage / founding** — *"One of the twenty-one oldest golf clubs in the world, founded 1845"* (Panmure pattern)

Only one proof line per hero. Pick the strongest verifiable claim. Quote the source so it reads as a third-party endorsement, not self-description.

## Hero logo treatment — two variants

Default: **Left-aligned wordmark** in Manrope uppercase letter-spaced (Beeston Fields / Whittington Heath pattern). Works on every brand.

Optional: **Centered crest with founding date** (Sherwood Forest pattern) — for clubs with strong heraldry (an actual circular crest, shield, or coat of arms). The crest sits ON the hero video at top-center with the wordmark beneath. Nav becomes minimal (just a hamburger top-right + a primary "Book Online" link). Use for heritage / pre-1900 clubs where the crest IS the brand.

## Hero video — SELF-HOSTED WebM (preferred) or MP4 (as of 2026-05-26)

**Format priority:** WebM (VP9 codec) is ~30% smaller than MP4 (H.264) at equivalent quality. Sherwood Forest's existing site uses WebM. Encode hero as both, serve WebM to browsers that support it:

```html
<video class="hero-video" autoplay muted loop playsinline preload="auto" poster="hero-poster.jpg">
  <source src="hero.webm" type="video/webm">
  <source src="hero.mp4" type="video/mp4">
</video>
```

To encode WebM with ffmpeg:
```bash
ffmpeg -i source.mp4 -an -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 -movflags +faststart -y hero.webm
```
Target: ≤20MB WebM 1080p for ~50s. Always also produce hero.mp4 as fallback.

After multiple builds where YouTube's pause/play icons and adaptive-bitrate mobile downgrades degraded the hero experience, the new standard is **self-hosted video in a `<video>` tag**, not a YouTube iframe embed.

### Why we switched

| Self-hosted MP4 (new default) | YouTube embed (legacy) |
|---|---|
| No YouTube UI ever — no pause icons, no chyron, no buffering chrome | Pause icons flash during seeks; mobile downgrades quality |
| Plays the actual file quality on any device | Adaptive bitrate downgrades on mobile data |
| Seamless loop, total playback control | Bound to whatever the iframe API allows |
| Aman/Belmond visual tier | Embedded-vlog visual tier |

### Legal posture (read before applying)

Real-world risk over a year of demos using indie creator footage (sub-50k-sub channels) with proper crediting:
- DMCA takedown to Netlify: ~10% (file removed, no damages; one-click swap fixes)
- Cease and desist letter: ~2%
- Actual legal action: <0.5%

**Rules — always:**
- Credit the creator in the hero footer with a hyperlink to their channel
- Strip audio from extracted segments (no music rights issues)
- Keep the source URL recorded so we can swap in 5 minutes on any complaint

**Rules — never:**
- Use major broadcaster content (Sky / BBC / ESPN / PGA Tour) — they have legal departments
- Strip creator attribution
- Carry derivative third-party content into a *live paying client* site long-term

**Paying client transition:** when a club signs and pays, commission proper drone footage (£150-£400 via UK drone pilots) OR use the club's existing footage, swap the demo's derivative MP4 for the licensed one before launch. Budget this into the £999 setup or the first 1-3 months of recurring.

### The build process

For each new build:

1. **Download the source video** at the highest available quality:
   ```bash
   yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" "https://www.youtube.com/watch?v=<VIDEO_ID>" -o source.mp4
   ```

2. **Identify cinematic segments** if the source is mixed-content (e.g. Swamp Men Golf style gameplay + drone):
   - Run ffmpeg scene detection: `ffmpeg -i source.mp4 -vf "select='gt(scene,0.4)',showinfo" -vsync vfr -f null -`
   - Extract scene-cut frames into a composite, review visually
   - List [start, duration] pairs for each cinematic segment
   - For pure-cinematic sources (AeroPixel, EMP Foremost, Drone Discovery marketing videos), skip this step — the entire source is usable

3. **Extract + concatenate** each segment with consistent encoding:
   ```bash
   # Per segment:
   ffmpeg -ss <START> -i source.mp4 -t <DURATION> -an -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart -y clip_N.mp4
   # Concat:
   ffmpeg -f concat -safe 0 -i concat.txt -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart -an -y hero.mp4
   ```

4. **Target file size:**
   - 1080p hero: ≤30MB for ~50s of footage (CRF 19, preset slow gives ~4-5 Mbps)
   - 720p mobile fallback (optional): ≤12MB for the same duration (CRF 22)

5. **HTML pattern:**
   ```html
   <section class="hero">
     <video class="hero-video" autoplay muted loop playsinline preload="auto" poster="hero-poster.jpg">
       <source src="hero.mp4" type="video/mp4">
     </video>
     <div class="hero-overlay">
       <div class="hero-content">
         <p class="hero-eyebrow">…</p>
         <h1>…</h1>
         <p class="hero-tagline">…</p>
         <div class="hero-cta">…</div>
       </div>
     </div>
     <p class="hero-credit">Aerial · <a href="<source_youtube_url>" target="_blank" rel="noopener">{{Creator Name}}</a></p>
   </section>
   ```

6. **CSS pattern for the video:**
   ```css
   .hero-video{position:absolute;top:50%;left:50%;width:100%;height:100%;object-fit:cover;transform:translate(-50%,-50%);pointer-events:none}
   ```

7. **Always provide a poster image** (`poster="hero-poster.jpg"`) — a still extracted from the MP4. Saves the user from seeing black during the initial 3-5 second load:
   ```bash
   ffmpeg -i hero.mp4 -ss 0 -frames:v 1 -q:v 4 hero-poster.jpg
   ```

The YouTube embed pattern below is now LEGACY — only use it if you absolutely cannot download a source video.

## Legacy: Drone hero pattern (YouTube embed, never re-host)

Hero is a full-bleed muted-autoplay-loop YouTube embed with a **poster-fade cover** that hides YouTube's initial play-button + branding overlay for the first ~2 seconds (until autoplay has kicked in and `controls=0` is honoured). Without the poster cover, YouTube briefly shows the play button, share button, and channel branding on initial load — which makes the hero feel like an embed instead of a native video.

```html
<section class="hero">
  <div class="hero-video-wrap">
    <iframe
      src="https://www.youtube.com/embed/<VIDEO_ID>?autoplay=1&mute=1&loop=1&playlist=<VIDEO_ID>&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=0"
      title="<Club Name> aerial tour by <Creator Name>"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      loading="eager"
      tabindex="-1"
      aria-hidden="true"
    ></iframe>
    <!-- POSTER COVER — hides YouTube initial UI until autoplay kicks in -->
    <div class="hero-poster"></div>
  </div>
  <div class="hero-overlay">
    <div class="hero-content">
      <p class="eyebrow">EST. <FOUNDED_YEAR> · <REGION></p>
      <h1>{{ClubName}}</h1>
      <p class="tagline">{{12-word_positioning_line}}</p>
      <div class="hero-cta">
        <a href="{{VISITOR_BOOKING_URL}}" target="_blank" rel="noopener" class="btn-primary">Book as Visitor</a>
        <a href="{{MEMBER_BOOKING_URL}}" target="_blank" rel="noopener" class="btn-ghost">Member Booking</a>
      </div>
      <p class="hero-membership-link"><a href="{{MEMBERSHIP_PAGE}}">Not a member? Explore membership &rarr;</a></p>
    </div>
  </div>
</section>
```

**Poster-fade CSS** (this is mandatory, not optional):

```css
.hero-video-wrap iframe{pointer-events:none;...}
.hero-poster{
  position:absolute;inset:0;
  background:url('https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg') center/cover no-repeat;
  background-color:var(--ink);          /* fallback if thumbnail 404s */
  z-index:1;
  opacity:1;
  transition:opacity 1.4s cubic-bezier(.16,.84,.3,1);
  pointer-events:none;
}
.hero.video-ready .hero-poster{opacity:0}
```

**Poster-fade JS — use the YouTube IFrame API, not a fixed timer.** A static `setTimeout(reveal, 2200)` works but introduces a guaranteed 2+ second poster delay. The right pattern is to listen for YouTube's actual PLAYING event and fade the poster the moment the video really starts — typically <1 second after page load. Fallback timer at 3 seconds for the rare case the API doesn't load (adblock, network issue).

The iframe `src` MUST include `enablejsapi=1` AND `origin=<your-site-origin>` for cross-origin postMessage to work cleanly:

```html
<iframe id="hero-yt" src="https://www.youtube.com/embed/<VIDEO_ID>?autoplay=1&mute=1&loop=1&playlist=<VIDEO_ID>&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1&origin=https://your-deploy.netlify.app" ...></iframe>
```

The JS (add to the shared scripts.js):

```js
(function heroPosterFade(){
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var iframe = hero.querySelector('iframe');
  if (!iframe) return;
  var revealed = false;
  var reveal = function(){ if (revealed) return; revealed = true; hero.classList.add('video-ready'); };
  setTimeout(reveal, 3000); // hard fallback
  if (!window.YT && !document.querySelector('script[src*="iframe_api"]')){
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  }
  var initPlayer = function(){
    if (!window.YT || !window.YT.Player) return;
    try {
      new window.YT.Player(iframe, {
        events: {
          onStateChange: function(e){ if (e.data === 1) reveal(); }, // 1 = PLAYING
          onReady: function(){ setTimeout(reveal, 600); }              // safety net
        }
      });
    } catch (err) {}
  };
  if (window.YT && window.YT.Player) initPlayer();
  else window.onYouTubeIframeAPIReady = initPlayer;
})();
```

Total perceived delay drops from ~2200ms (timer-based) to <1s (event-based) on most connections. Don't fall back to the timer-only pattern; the IFrame API is the right way to do this.

**Thumbnail URL pattern.** For any YouTube video ID `XXXXXX`, the maxres thumbnail is at `https://i.ytimg.com/vi/XXXXXX/maxresdefault.jpg`. If the video predates 2015 it may not have a maxres version — fall back to `hqdefault.jpg` (always exists). Verify the thumbnail loads before deploy.

## Inner-page banners — VARY the thumbnail per page when a catalogue is available

Every inner page (subpage) gets a photographic banner at the top, NOT a flat coloured block. **The rule depends on what footage exists:**

- **Single hero video only** (Panmure / Whittington Heath pattern) → reuse that thumbnail across all subpages for consistency. Brand-anchoring.
- **Hero video + per-hole catalogue** (Beeston Fields pattern — Drone Discovery has all 18) → map each subpage to a *thematically appropriate* hole thumbnail. NEVER repeat the hero shot across every subpage when alternatives exist — Lewis specifically called this out as making the portfolio feel templated and lazy.

When you have a catalogue, map roughly like this (adapt to whatever holes the catalogue covers):

| Page intent | Pick a hole that conveys |
|---|---|
| History / heritage | Wide-angle, expansive, mature trees |
| Membership | Considered, the "regular member's" hole |
| Visitor info / contact | Opening hole — welcome |
| Weddings / functions | Picturesque, signature green |
| Pro Shop / lessons / Trackman | Accessible, mid-difficulty |
| Open competitions / scorecard | Tough/signature hole |
| Restaurant / clubhouse | Closing hole approach to clubhouse |
| Course overview | The hero (main marketing video) |

The build implementation: extend the `phHead(bc, eb)` helper to accept an optional third argument `vidId`, emit an inline `style="background-image:url(.../<vidId>/maxresdefault.jpg)"` on the section. Update `simplePage()` to accept an optional final `bannerVid` parameter and pass through. Add a comment next to each `simplePage()` call explaining why that particular hole was chosen — lets a future build double-check the choices.

The CSS pattern (add to styles.css alongside `.page-hero`):

```css
.page-hero.has-image{
  background-image:url('https://i.ytimg.com/vi/<HERO_VIDEO_ID>/maxresdefault.jpg');
  background-size:cover;background-position:center 35%;background-repeat:no-repeat;
  background-color:var(--sea-dk);  /* fallback */
  min-height:520px;
  display:flex;flex-direction:column;justify-content:flex-end;
}
.page-hero.has-image::before{background:linear-gradient(180deg,rgba(14,26,36,.55) 0%,rgba(14,26,36,.30) 35%,rgba(14,26,36,.55) 70%,rgba(14,26,36,.88) 100%)}
.page-hero-credit{position:absolute;bottom:18px;right:32px;font-size:.66rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,236,.55);font-weight:500;z-index:2}
.page-hero-credit a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(245,242,236,.28);transition:color .2s,border-color .2s}
.page-hero-credit a:hover{color:var(--sand);border-bottom-color:var(--sand)}
```

The HTML pattern (every inner page):

```html
<section class="page-hero has-image">
  <div class="page-hero-inner">
    <p class="page-hero-breadcrumb">...</p>
    <p class="eyebrow">...</p>
    <h1>...</h1>
    <p class="lede">...</p>
  </div>
  <p class="page-hero-credit">Aerial · <a href="https://www.youtube.com/watch?v=<HERO_VIDEO_ID>" target="_blank" rel="noopener">{{Creator Name}}</a></p>
</section>
```

The credit link is mandatory — it routes the click back to the creator, which is the right thing to do and also protects us if anyone asks where the image came from.

<style>
.hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:#0a1419}
.hero-video-wrap{position:absolute;inset:0;pointer-events:none}
.hero-video-wrap iframe{position:absolute;top:50%;left:50%;width:177.78vh;height:100vh;min-width:100%;min-height:56.25vw;transform:translate(-50%,-50%)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,20,25,.2) 0%,rgba(10,20,25,.55) 70%,rgba(10,20,25,.85) 100%);display:flex;align-items:flex-end;padding:0 56px 80px}
.hero-content{max-width:680px;color:#fff}
.eyebrow{font-size:.75rem;letter-spacing:3px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:18px}
.hero h1{font-family:'Fraunces',serif;font-size:clamp(2.8rem,6vw,5.4rem);font-weight:600;line-height:1.05;margin-bottom:20px}
.tagline{font-size:1.15rem;line-height:1.5;color:rgba(255,255,255,.85);max-width:520px;margin-bottom:36px;font-weight:300}
</style>
```

**Never embed the hero video a second time on the same page.** YouTube serves the non-autoplay embed in default state — for some channels (especially marketing channels like EMP Foremost Golf) this surfaces a "Video unavailable" overlay even when the autoplay-context embed in the hero works fine. If a story / about / heritage section needs a related visual on the side, use a **static `<img>` of the YouTube maxres thumbnail wrapped in an `<a>` linking to the YouTube watch URL** (`https://www.youtube.com/watch?v=<VIDEO_ID>`), with a small caption crediting the creator. Looks intentional, loads instantly, no "unavailable" risk, and clicking still routes traffic to the creator.

**Hero overlay rule — competing focal points.** Before writing the hero headline, look at the hero video for **baked-in text overlays** (intro cards, lower-thirds, sponsor logos, brand watermarks). If the video already says "Welcome to {ClubName}" or similar in its intro/outro frames — common with commissioned marketing videos from outfits like Townhouse Communications, Fyfe Golf, AeroPixel — DROP the headline and tagline entirely. Use the **CTA-only hero variant** instead: lighter gradient, the two booking buttons + the membership link, nothing else. The video carries the brand voice; we just give visitors something to do. Don't fight the video's own text — clients will notice and so will design-literate prospects. AeroPixel and EMP Foremost have clean videos with no baked text → keep the headline. TownhouseComms-style videos with title cards → drop the headline.

**Hero CTA rule — TWO booking buttons, not one.** A single "Book a Tee Time" button creates hesitation for the visitor who's not sure if it's for members only. The pattern is: **`Book as Visitor`** (primary, brass-filled) + **`Member Booking`** (ghost) + a small **"Not a member? Explore membership →"** link beneath. Both booking buttons open the actual BRS/IntelligentGolf/ClubV1 URLs in a new tab (`target="_blank"`) — no in-page modal, no smooth-scroll to a section that just punts them off-site anyway. Direct.

**Hero copy rules.** The tagline is twelve words max, and it's about THIS course — heritage, signature hole, landscape, designer. Examples that work: "Ben Hogan's only European triumph, played here on the Angus coast." (Panmure). "Yorkshire's hidden parkland, where Danny Willett learned the game." (Rotherham). Generic "Welcome to <X> Golf Club" is banned.

**Fallback for "no usable video found":** flag to Lewis. Do not deploy with a static hero — the entire premium pitch depends on the video.

## Section structure (default order — drop a section only with explicit reason)

1. **Hero** — drone embed + tagline + tee-time / membership CTAs (above)
2. **Heritage strip** — three stats: established year, course designer, signature stat (course rating / par / yardage / Open qualifier years / famous players). Inline on a single horizontal band. Mid-tier clubs almost always under-tell their history.
3. **Course tour / hole-by-hole** — at minimum a grid of 18 cards with hole number + par + yardage + a one-line description. If hole photos exist on the existing site or the club's social, use them. If not, a flyover screenshot per hole pulled from the drone video at the right timestamp. This is the BIGGEST gap in UK mid-tier golf sites — almost nobody has a hole-by-hole. Include it by default.
4. **Tee booking** — booking system integration (see patterns below). Always above-the-fold linkable via the hero CTA.
5. **Membership** — categories (5/6/7-day, Country, Intermediate, Junior, Lady, Corporate), joining fee, annual fee, what's included. Specific numbers, not "POA". Most clubs are weirdly cagey about prices on their site — clarity converts.
6. **Society & corporate days** — package outline, day-rate range, what's included (round, food, prize fund). Universal gap across all 4 mid-tier scout clubs; significant revenue line.
7. **Weddings & functions** — the biggest underutilised revenue stream. Photos of clubhouse interior, capacity numbers, sample menu price points, contact form for enquiries. If the club has wedding photos on Insta/Facebook, pull them.
8. **Lessons & academy** — PGA pro name + headshot, lesson types + prices, kids/juniors programme. Adds a personal face to the site.
9. **Clubhouse / dining** — bar + restaurant hours, sample menu, photos. Many clubs hide this; it builds local pride and brings non-members in.
10. **News & events** — three most recent posts, link to archive. Even thin content is better than a stale "Latest News" with a 2022 entry.
11. **Heritage / our story** — long-form. Founders, course designer, notable members, championships hosted, club records. Pull from existing site, Wikipedia, local archives, Companies House founding date.
12. **Contact + map + footer** — full address, phone, secretary's email, large embedded Google Map, social links, **member login link** (deep link to BRS/IntelligentGolf/ClubV1 member area — do NOT try to build a member portal).

## "Book A Tee Time" — newbie-friendly CTA pattern (NON-NEGOTIABLE)

Added 2026-05-24 after Lewis tested a finished build as a complete-newbie to golf and found that as soon as he scrolled past the hero, the booking CTA vanished and he had to scroll all the way back to find it. For a club's *prospective* customer (vs an existing member with muscle memory), the Book Tee CTA needs to be **everywhere they look**:

### 1. Sticky header — desktop + mobile

The top nav is initially transparent (sits over the hero video). After the user scrolls past the hero viewport, it transitions to a solid background with the **"Book Tee Time"** button always pinned top-right. Members tap "Member Login" on the left; visitors tap "Book Tee Time" on the right. Never two clicks away.

```html
<header class="site-nav" data-state="transparent">
  <div class="site-nav-inner">
    <a class="site-nav-logo" href="/">{{ClubName}}</a>
    <nav class="site-nav-links">
      <a href="/course/">Course</a>
      <a href="/visit/">Visiting</a>
      <a href="/membership.html">Membership</a>
      <a href="/club/">The Club</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <div class="site-nav-cta">
      <a href="{{MEMBER_BOOKING_URL}}" target="_blank" rel="noopener" class="nav-member-login">Member Login</a>
      <a href="#book" class="nav-book-cta">Book Tee Time →</a>
    </div>
  </div>
</header>
```

```css
.site-nav{position:fixed;top:0;left:0;right:0;z-index:50;transition:background .3s,box-shadow .3s,padding .3s;padding:24px 0}
.site-nav[data-state="transparent"]{background:transparent}
.site-nav[data-state="solid"]{background:rgba(14,26,36,.92);backdrop-filter:blur(12px);padding:14px 0;box-shadow:0 1px 0 rgba(255,255,255,.06)}
.site-nav-inner{max-width:1280px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.site-nav-logo{font-family:'Fraunces',serif;font-size:1.15rem;color:#fff;text-decoration:none;font-weight:500}
.site-nav-links{display:flex;gap:28px}
.site-nav-links a{color:rgba(255,255,255,.85);text-decoration:none;font-size:.92rem;letter-spacing:.3px;transition:color .2s}
.site-nav-links a:hover{color:#fff}
.site-nav-cta{display:flex;align-items:center;gap:18px}
.nav-member-login{color:rgba(255,255,255,.7);font-size:.85rem;text-decoration:none;letter-spacing:.3px;transition:color .2s}
.nav-member-login:hover{color:#fff}
.nav-book-cta{background:var(--accent);color:#fff;padding:11px 22px;border-radius:6px;font-weight:500;font-size:.92rem;text-decoration:none;transition:transform .2s,background .2s;letter-spacing:.3px}
.nav-book-cta:hover{transform:translateY(-1px);background:var(--accent-hover)}
@media(max-width:820px){.site-nav-links{display:none}.site-nav-inner{padding:0 18px;gap:12px}.nav-book-cta{padding:9px 16px;font-size:.85rem}.nav-member-login{display:none}}
```

```js
// In shared scripts.js — flip transparent → solid after scrolling past hero.
const nav = document.querySelector('.site-nav');
if (nav) {
  const hero = document.querySelector('.hero');
  const threshold = hero ? hero.offsetHeight - 80 : 600;
  const onScroll = () => {
    nav.setAttribute('data-state', window.scrollY > threshold ? 'solid' : 'transparent');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
```

### 2. Mobile sticky bottom bar — visitor + member, always one tap away

On mobile, the desktop nav CTA disappears. Replace with a fixed bottom bar that's always visible. A first-time visitor never has to scroll to find Book A Tee.

```html
<!-- Lives just before </body> on every page. Hidden on desktop. -->
<aside class="mobile-book-bar" aria-label="Booking actions">
  <a href="{{VISITOR_BOOKING_URL}}" target="_blank" rel="noopener" class="mb-visitor">
    <strong>Book as Visitor</strong>
    <span>From £{{X}} green fees</span>
  </a>
  <a href="{{MEMBER_BOOKING_URL}}" target="_blank" rel="noopener" class="mb-member">
    <strong>Member</strong>
    <span>Sign in</span>
  </a>
</aside>
```

```css
.mobile-book-bar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:40;background:rgba(14,26,36,.96);backdrop-filter:blur(14px);padding:10px 12px env(safe-area-inset-bottom,10px);gap:8px;border-top:1px solid rgba(255,255,255,.08)}
.mobile-book-bar a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 12px;border-radius:6px;text-decoration:none;line-height:1.2}
.mobile-book-bar a strong{color:#fff;font-size:.95rem;font-weight:500;letter-spacing:.3px}
.mobile-book-bar a span{color:rgba(255,255,255,.65);font-size:.7rem;letter-spacing:.4px;text-transform:uppercase;margin-top:2px}
.mb-visitor{background:var(--accent);flex:2}
.mb-member{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)}
@media(max-width:820px){.mobile-book-bar{display:flex}body{padding-bottom:78px} /* offset for fixed bar */}
```

### 3. Hero CTAs — split clearly, visitor first

Replace the previous single-Book-CTA + ghost-Membership pattern with **two equally prominent CTAs in the hero**: visitor-first because more newbies arrive than would-be members.

```html
<div class="hero-cta">
  <a href="#book-visitor" class="btn-primary">
    <span class="btn-label">Book Tee Time</span>
    <span class="btn-sub">Visitors — green fees from £{{X}}</span>
  </a>
  <a href="#book-member" class="btn-secondary">
    <span class="btn-label">Member Login</span>
    <span class="btn-sub">Existing members book here</span>
  </a>
</div>
```

The two-line button (label + sub) is deliberate. A complete-newbie sees "Visitors — green fees from £X" and immediately knows (a) this is for them and (b) what it costs. A member sees "Existing members" and self-routes. Zero ambiguity.

### 4. Booking section — price-first, with "First time?" anchor

When the user reaches the `#book` section (via hero CTA or sticky-header tap), the visitor card must lead with **the actual price** and a "First time here?" link. Most golf-club websites bury green fees three clicks deep; that's the gap.

```html
<section id="book" class="booking">
  <div class="booking-inner">
    <p class="eyebrow">TEE TIMES</p>
    <h2>Book your round at {{ClubName}}</h2>
    <p class="lede">Live availability through our booking system. Visitors can book up to {{X}} days ahead; members log in for your full diary.</p>

    <div class="booking-grid">
      <!-- Visitor card — price FIRST -->
      <a id="book-visitor" href="{{VISITOR_URL}}" target="_blank" rel="noopener" class="booking-card booking-card-visitor">
        <p class="booking-price-label">Green Fees from</p>
        <p class="booking-price">£{{WEEKDAY_PRICE}}</p>
        <p class="booking-price-sub">Weekday · £{{WEEKEND_PRICE}} Weekend</p>
        <h3>Book as a Visitor</h3>
        <p class="booking-card-body">No account needed. Pay at checkout. {{X}}-day advance booking. Buggies & lessons available to add.</p>
        <span class="booking-arrow">Book Now →</span>
      </a>

      <!-- Member card — login routing -->
      <a id="book-member" href="{{MEMBER_URL}}" target="_blank" rel="noopener" class="booking-card booking-card-member">
        <p class="booking-price-label">Members</p>
        <p class="booking-card-icon">⛳</p>
        <h3>Member Booking</h3>
        <p class="booking-card-body">Sign in with your member number to access your full diary, competition entries, and guest bookings.</p>
        <span class="booking-arrow">Sign In →</span>
      </a>
    </div>

    <!-- Newbie helper -->
    <details class="booking-first-time">
      <summary>First time at a golf course? Read this →</summary>
      <div class="booking-first-time-body">
        <h4>What to know before you arrive</h4>
        <ul>
          <li><strong>Dress code:</strong> Smart-casual on the course (collared shirt, golf or tailored trousers/shorts, soft-spiked golf shoes). No denim, no football kit. Full code: <a href="/club/dress-code.html">/club/dress-code</a></li>
          <li><strong>Time:</strong> A round of 18 holes takes around {{4 hours, 4.5 if busy}}. We recommend arriving 30 minutes early to warm up on the range.</li>
          <li><strong>Equipment:</strong> Bring your own clubs, or hire a set at the pro shop (£{{X}}/round). Balls, tees, and a glove are sold at reception.</li>
          <li><strong>Lessons first?</strong> If you've never swung a club, book a session with our PGA pro before a round — <a href="/visit/lessons.html">lessons from £{{X}}</a>.</li>
          <li><strong>Buggies:</strong> Hireable at £{{X}}/round, subject to ground conditions. Book on arrival or add to your tee booking.</li>
        </ul>
      </div>
    </details>
  </div>
</section>
```

```css
.booking-card-visitor{background:linear-gradient(180deg,var(--accent) 0%,var(--accent-dk) 100%);color:#fff;border:1px solid rgba(255,255,255,.1)}
.booking-card-member{background:rgba(255,255,255,.04);color:var(--ink);border:1px solid rgba(255,255,255,.08)}
.booking-price-label{font-size:.72rem;letter-spacing:2px;text-transform:uppercase;opacity:.7;margin-bottom:4px}
.booking-price{font-family:'Fraunces',serif;font-size:3.2rem;font-weight:500;line-height:1;margin:0 0 6px}
.booking-price-sub{font-size:.85rem;opacity:.75;margin-bottom:18px}
.booking-card-icon{font-size:2.6rem;margin:0 0 10px}
.booking-first-time{margin-top:48px;border:1px solid rgba(0,0,0,.08);border-radius:8px;padding:0;background:rgba(0,0,0,.02)}
.booking-first-time summary{cursor:pointer;padding:18px 22px;font-weight:500;list-style:none;color:var(--accent);transition:background .2s}
.booking-first-time summary:hover{background:rgba(0,0,0,.04)}
.booking-first-time[open] summary{border-bottom:1px solid rgba(0,0,0,.08)}
.booking-first-time-body{padding:18px 22px 22px}
.booking-first-time-body ul{margin:12px 0 0;padding-left:20px;line-height:1.7}
.booking-first-time-body li{margin-bottom:8px}
```

### Putting it together — the four touchpoints

A newbie landing on a Forte golf-club site will see "Book Tee Time" at **four** scroll positions:

1. **Hero CTA** (page load): visitor-labeled with green fee price
2. **Sticky header** (after scrolling past hero): top-right "Book Tee Time →" button
3. **Booking section** (mid-page): price-led visitor card + first-time-here helper
4. **Mobile bottom bar** (all positions on mobile): fixed "Book as Visitor | Member" pair

Members get the same coverage via "Member Login" mirrors at every touchpoint.

## Booking integration patterns

We never replace their booking platform — members have logins, payment cards stored, handicap data on file. We **wrap the existing booker** with a styled CTA. Patterns by platform:

**BRS Golf** (most common in UK mid-tier — Haverfordwest, many others)
- Each club has a URL like `https://www.brsgolf.com/<club-slug>/visitor_tee_time_booking` for visitors and `https://members.brsgolf.com/<club-slug>` for members
- Build: A `#book` section with two large cards — "Member booking" → members URL, "Visitor booking" → visitors URL. Open in new tab.
- Optionally iframe the visitor booker into a styled container, but link-out is cleaner and avoids BRS theming clashes.

**IntelligentGolf** (used by many higher-end clubs)
- URL format: `https://www.intelligentgolf.co.uk/<club-slug>/visitorBooking.php`
- Same wrap pattern as BRS.

**ClubV1** (Panmure, many others)
- URL format varies — usually `https://<club-slug>.clubv1.com` or `https://<club-slug>.brsgolf.com` (BRS owns ClubV1's booking module now in many deployments)
- Find the exact link on the existing site's "Book Tee Time" button before assuming.

**HowDidiDo** (members-only stat tracking, often paired with booking)
- The booking link sits inside HowDidiDo's member portal — wrap as "Member login" rather than "Book here".

**No platform — paper book / email only** (rare but happens at the smallest clubs)
- Build a form that posts to a Formspark / Netlify Forms endpoint, alerts the secretary by email. Keep this simple — golf clubs are not e-commerce.

**The styled CTA template:**

```html
<section id="book" class="booking">
  <div class="booking-inner">
    <p class="eyebrow">TEE TIMES</p>
    <h2>Book your round at {{ClubName}}</h2>
    <p class="lede">Live availability through our booking system. Members log in for your full diary; visitors can book up to {{X}} days ahead.</p>
    <div class="booking-grid">
      <a href="{{MEMBER_URL}}" target="_blank" rel="noopener" class="booking-card booking-card-primary">
        <h3>Member Booking</h3>
        <p>Sign in with your member number to book.</p>
        <span class="arrow">→</span>
      </a>
      <a href="{{VISITOR_URL}}" target="_blank" rel="noopener" class="booking-card">
        <h3>Visitor Booking</h3>
        <p>Green fees from £{{X}}. No account needed.</p>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</section>
```

## Visual style presets — pick one per build to keep the portfolio visually diverse

Lewis specifically flagged that golf builds were starting to look like cousins because they share the same skeleton (typography + palette + hero pattern). This is the fix: every build picks ONE of the eight named presets below. Two builds in the same preset is permitted only when the clubs are *genuinely* the same character (e.g. two Scottish coastal links). Otherwise, choose a different preset so the portfolio doesn't read as templated.

The preset choice happens in the research phase, based on the club's character: heritage, modern, luxury, traditional, etc. Document which preset was used in `research.md` so retroactive consistency is checkable.

### Preset 1 · "Wentworth Restraint"
- **Best for:** Top-tier heritage, members-only, English/Scottish blue-chip
- **Type:** Fraunces (serif) + DM Sans (sans)
- **Palette:** Sage `#36443A` · Cream `#F4F1EA` · Near-black `#1A1F1B` · Brass `#A18A5F`
- **Hero:** Drone full-bleed, heavy bottom gradient, type-led headline
- **Motion:** Subtle fade-ins, generous white space, slow transitions
- **Photography:** Single rich gradient overlay, no duotones

### Preset 2 · "Heathland Heritage" (currently used: Rotherham, Whittington Heath, Beeston Fields)
- **Best for:** English heathland/parkland, mid-tier members clubs, Midlands/Yorkshire
- **Type:** Fraunces + DM Sans
- **Palette:** Forest `#3B4D3A` · Oat `#E8DFCB` · Deep `#0F1411` · Autumn `#B85C38`
- **Hero:** Drone with CTA-only OR headline overlay (depending on video text)
- **Motion:** Reveal-on-scroll fade-ups, standard component animations
- **Photography:** Warm gradient overlays

### Preset 3 · "Coastal Links" (currently used: Panmure)
- **Best for:** Links courses, coastal clubs, Scottish/Welsh/Irish coastline
- **Type:** Fraunces + DM Sans
- **Palette:** Sea `#1E3A52` · Sand `#D9C9A8` · Linen `#F5F2EC` · Driftwood `#7A8C7E`
- **Hero:** Drone with headline + heritage strip immediately below
- **Motion:** Subtle, generous spacing, slight horizon parallax on hero
- **Photography:** Cool blue-grey gradient overlays

### Preset 4 · "Country House"
- **Best for:** Old-money members clubs, historic estates, family-owned heritage clubs
- **Type:** Cormorant Garamond (serif display) + Manrope (sans body) — DELIBERATELY different family from presets 1-3
- **Palette:** Burgundy `#5C2228` · Ivory `#F7F2E6` · Forest `#1F3A2C` · Brass `#B89455`
- **Hero:** **Full-bleed drone, same pattern as Wentworth Restraint / Heathland Heritage.** The drone is the star — let the course be the visual centrepiece. Visual differentiation comes from the *content beneath* the hero (the Cormorant italic headline overlay, the brass-gold CTAs, the burgundy heritage strip below). EARLIER VERSIONS of this preset called for a "portrait-frame card-in-room" hero — that was wrong and Lewis rejected it on the Sherwood Forest build. Drone full-bleed always.
- **Hero overlay:** Cormorant italic for the H1 (instead of Fraunces). Gradient skewed slightly toward burgundy-dark (`rgba(26,8,10,.X)`) instead of generic black. Brass `#B89455` primary CTA; ghost-on-ivory secondary.
- **Motion:** Slow page transitions (500ms+), parallax photo backgrounds, deliberate
- **Photography (inner pages):** Vintage tints permitted on inner-page banners only — burgundy-tinted overlays rather than the standard slate-gradient. Never tint the hero video itself.

### Preset 5 · "Editorial Minimal"
- **Best for:** Modern urban clubs, design-conscious management, younger demographic, post-2000 club builds
- **Type:** Migra (display serif) + Söhne (modernist sans) — sharp, magazine-like
- **Palette:** Pure black `#0A0A0A` · Off-white `#FAFAF7` · ONE bold accent (emerald `#00563B` or vermillion `#D34924` — pick per build)
- **Hero:** Split-screen — video right 60%, large display type left 40%
- **Motion:** Static gravitas, NO scroll-reveals, type-led, content present from page-load
- **Photography:** Full-colour, no overlays, the photography IS the design

### Preset 6 · "Magazine"
- **Best for:** Clubs that host events (pro-am, county opens), content-rich clubs, clubs with active news/blogs
- **Type:** Tiempos Headline (newspaper serif) + Inter (utility sans)
- **Palette:** Newsprint white `#FCFAF6` · Ink black `#1A1A1A` · Highlight gold `#C9A14E` · Sage `#6B7A5C`
- **Hero:** Multi-column newspaper-masthead grid, hero treated as "cover story" with editorial layout
- **Motion:** Horizontal drag-to-scroll sections, card transitions, news-ticker feel
- **Photography:** Documentary-style, often black-and-white with single colour pop

### Preset 7 · "Hand-crafted Heritage"
- **Best for:** Centenary clubs, traditional Welsh/Scottish/Irish, "established 1890" energy
- **Type:** Recoleta (warm rounded serif) + Inter Tight (clean tight sans)
- **Palette:** Warm taupe `#B5A790` · Deep burgundy `#4A1F22` · Cream `#F0E8DC` · Forest `#2A3E2A`
- **Hero:** Vintage poster-style — mottled film-grain overlay on drone, decorative borders, hand-drawn-feel iconography
- **Motion:** Slow, considered, ~600-800ms transitions everywhere; feels craftsperson-made
- **Photography:** Sepia tints, vignettes, sometimes hand-illustrated map elements

### Preset 8 · "Modern Minimalist"
- **Best for:** New clubs, golf-resort/hotel hybrids, design-led country clubs, sub-2010 builds
- **Type:** Inter — everything (geometric sans display + body, single family)
- **Palette:** Cool grey `#E8E8E8` · Pure black `#000` · Single signal colour (cyan `#00B0E0`, sage `#4D6B5A`, or apricot `#E89B68`)
- **Hero:** Full-bleed video, all typography tucked small in lower-right corner, ultra-minimal CTAs
- **Motion:** Sharp 200ms cubic-bezier transitions, instant response, decisive
- **Photography:** Bold, high-contrast, no gradient overlays — the image is uncompromised

## Design direction

**Colour palette (golf-appropriate, NOT generic green).** Reject the obvious "bright fairway green" look — every templated golf site does this and it screams "I'm a templated golf site". Choose from:

| Palette | Hex | When to use |
|---|---|---|
| **Wentworth-style restraint** | `#36443A` (sage), `#F4F1EA` (cream), `#1A1F1B` (near-black), `#A18A5F` (brass accent) | Top-tier members clubs, heritage, parkland |
| **Coastal links** | `#1E3A52` (deep sea), `#D9C9A8` (sand), `#F5F2EC` (linen), `#7A8C7E` (driftwood) | Links courses, coastal locations (Panmure, Haverfordwest, Royal St Davids) |
| **Heathland / parkland** | `#3B4D3A` (forest), `#E8DFCB` (oat), `#0F1411` (deep), `#B85C38` (autumn) | Inland parkland, woodland courses |
| **Modern minimalist** | `#0A0E0D` (charcoal), `#FAFAF7` (off-white), `#2C5F2D` (one green accent), `#C9A961` (gold) | Younger demographic, urban-adjacent, "country club" feel |

**Typography pair (consistent across Forte premium):**
- Headings: **Fraunces** (serif, italic variants for emphasis) — used across all Forte builds, gives the editorial weight
- Body: **DM Sans** or **Inter** (clean sans) — readability
- Eyebrow / labels: same body font in uppercase 0.75rem with 3px letter-spacing

**Photography rules:**
- Hero is video, always
- Section images: prefer the club's own photos if findable on their site / Insta / Facebook (right-click + provenance check)
- Stock golf imagery is banned — every templated competitor uses Unsplash green-fairway shots. Real photos of the real course or nothing.
- If the club has no usable photos, screenshot stills from the drone video at meaningful moments (signature hole, clubhouse from the air, water hazard) — fewer good images > many generic ones.

**Motion:** subtle. Slow fade-in on scroll. Parallax on the heritage strip. NO sliding text effects, NO modal pop-ups, NO chatbots, NO "We use cookies" giant overlays — golf-club committee members hate all of these. Use `design-motion-principles` skill for the hero motion audit before deploy.

## Outreach scripts (two flavours — match the script to the club's current setup)

Lewis sends these by email or Facebook DM after the demo site is built and deployed to a `<slug>.fortedesign.uk` subdomain. Always personal, always references something specific the research dossier surfaced, never starts with "I noticed your business doesn't have a website" if they do.

### Script A — for clubs on a GolfWorking templated site

> Subject: A custom site for {{ClubName}}
>
> Hi {{SecretaryName}},
>
> I came across {{ClubName}} this week — {{specific_thing_from_research, e.g. "the Danny Willett connection still doesn't get enough airtime" or "your members section gets glowing reviews"}}. Beautiful course, you've earned the reputation.
>
> Quick question on your website. I noticed you're on the GolfWorking template — same layout I've seen on twenty-odd UK clubs this year. It works, but it doesn't really show off what makes {{ClubName}} different from the next one along.
>
> I run a small design studio (Forte Design) — we build genuinely custom websites for UK independent businesses. I've spent two hours putting together a draft of what a {{ClubName}} site could look like, using {{specific_drone_video_creator_name}}'s drone footage of your back nine and pulling your real members' testimonials from Google. Have a look — no obligation, no pitch:
>
> {{demo_url}}
>
> Setup is £999, then £99/month for hosting, updates, and any tweaks you want. That's a one-off cost roughly the same as your current annual fee on GolfWorking, but the build is properly bespoke.
>
> If you fancy a 20-minute call to walk through it, my diary's here: {{cal_link}}. If not, no worries — keep the demo, it's yours either way.
>
> Best,
> Lewis Hull
> Forte Design

### Script B — for clubs with a weak generalist-built site or no site at all

> Subject: A new website for {{ClubName}}, on the house to take a look at
>
> Hi {{SecretaryName}},
>
> I've spent the morning looking at {{ClubName}} — {{specific_thing, e.g. "the Ben Hogan history" or "your function room photos on Facebook"}}. Genuinely one of the more interesting clubs in {{Region}} and I don't think your current website is doing it justice.
>
> So I built a draft of what it could look like instead. Took about three hours. Used {{drone_video_source}}'s drone footage of your course in the hero, pulled three of your Google reviews for testimonials, and gave proper space to your {{wedding_function or society_days or membership_offering}}, which is buried on the current site.
>
> {{demo_url}}
>
> If you like the direction, the build is £999 setup, then £99/month for hosting, updates, and changes. I work fast — most builds go live within ten days of you saying yes. If you don't like it, no harm done — the demo is yours regardless.
>
> Worth a 20-minute call? My diary: {{cal_link}}.
>
> Best,
> Lewis Hull
> Forte Design

**Tone rules for both scripts.**
- UK English (colour, organise, recognise)
- Never use "leveraging", "synergies", "solutions", "ecosystem", "stunning", "transform your business", "elevate"
- Always reference one specific thing from research — proves you actually looked at the club
- Always credit the drone footage source by name in the email (it's flattering to the creator if they ever see it, and honest)
- Always include the live demo URL, not a Calendly without anything to look at
- Never use exclamation marks. Golf-club secretaries are over 50 and find them grating.

## Hard rules (zero tolerance)

- **Never re-host drone footage.** Embed YouTube via iframe, always. If a video isn't embeddable, find another one. Direct-hosting unlicensed footage is how Forte gets a reputation killer.
- **Never fabricate testimonials, awards, or "Established YYYY" dates.** Pull only what research verifies. Mid-tier golf clubs check this stuff against their own records and it's embarrassing if wrong.
- **Never use stock golf photography.** It's a tell. Real course photos from the club's own sources, or video stills from the embedded drone video, or nothing.
- **Never replace their booking system.** Wrap and link to BRS / IntelligentGolf / ClubV1 / HowDidiDo. Members are locked in; trying to migrate them costs the sale and creates a support nightmare for the club.
- **Never use generic "fairway green" as the dominant colour.** Pick from the four palettes above based on the course type (links / parkland / heathland / modern). Defaulting to bright green is templated thinking.
- **Never deploy without the hero video confirmed embeddable.** The premium pitch falls apart without it.
- **Never call a member-only club a "venue".** They're a club. Members are members, not "customers".

## When you finish

Report to Lewis with:
- Production URL
- The drone video you used (URL + creator name)
- The booking platform you wrapped
- Which outreach script (A or B) matches this club
- The specific personal hook for the outreach email (one fact from research that proves we read about them)
