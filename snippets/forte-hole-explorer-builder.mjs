/* Forte Hole Explorer — build-time HTML generator
 *
 * Usage in a club's _build.mjs:
 *   import { buildHoleExplorer } from '../../../forte-design-tooling/snippets/forte-hole-explorer-builder.mjs';
 *   const explorerHTML = buildHoleExplorer({
 *     clubName: 'Beeston Fields',
 *     coursePar: 71,
 *     totalYards: 6430,
 *     teeColour: 'white',
 *     holes: [
 *       { n: 1, par: 4, yd: 374, si: 9, shape: 'straight', vid: 'JSgbRJvLJYU', desc: '...' },
 *       ...
 *     ]
 *   });
 *
 * The returned HTML drops into any page (typically course-tour.html or
 * a dedicated hole-explorer.html). Pair with the explorer CSS + JS
 * that live in the demo's dist/styles.css and dist/scripts.js (those
 * were already appended in the previous skill update).
 */

export function buildHoleExplorer(opts){
  const clubName = opts.clubName || 'Course';
  const coursePar = opts.coursePar || 71;
  const totalYards = (opts.totalYards || 6400).toLocaleString('en-GB');
  const teeColour = opts.teeColour || 'white';
  const holes = opts.holes || [];

  // Marker positions on the routing map (viewBox 1000x600). Three rows.
  const positions = [
    [110, 140], [220, 120], [330, 150], [440, 130], [550, 160], [670, 140], [790, 170], [880, 220], [880, 320],
    [780, 380], [650, 410], [520, 430], [400, 400], [290, 430], [180, 410], [120, 340], [180, 270], [310, 250]
  ];

  // Build curved path through markers
  let routingPath = 'M ' + positions[0][0] + ' ' + positions[0][1];
  for (let i = 1; i < positions.length; i++){
    const [px, py] = positions[i-1];
    const [x, y] = positions[i];
    const cx = (px + x) / 2;
    const cy = (py + y) / 2 + (i % 2 === 0 ? -15 : 15);
    routingPath += ' Q ' + cx + ' ' + cy + ' ' + x + ' ' + y;
  }

  const markersSVG = holes.map((h, i) => {
    const [x, y] = positions[i] || [500, 300];
    const isSig = h.sig === true;
    return '<g class="hole-marker' + (isSig ? ' is-signature' : '') + '" data-hole="' + h.n + '" transform="translate(' + x + ',' + y + ')">' +
      '<circle class="hole-marker-ring" r="22"/>' +
      '<circle class="hole-marker-bg" r="18"/>' +
      '<text class="hole-marker-num" y="6" text-anchor="middle">' + h.n + '</text>' +
      '</g>';
  }).join('');

  // Hole data for JS consumer
  const holeData = holes.map(h => ({
    n: h.n, vid: h.vid || '', desc: h.desc || '',
    par: h.par, yd: h.yd, si: h.si, shape: h.shape || 'straight',
    name: h.name || ''
  }));
  const holeDataJSON = JSON.stringify(holeData).replace(/'/g, '&#39;');

  return [
    '<section class="hole-explorer-section" data-chapter="course"><div class="container">',
    '<p class="eyebrow eyebrow-brass" style="text-align:center;margin-bottom:18px">The Course in Detail</p>',
    '<h2 class="chapter-heading" style="text-align:center;font-family:\'Fraunces\',serif;font-size:clamp(1.8rem,3.2vw,2.6rem);font-weight:400;margin-bottom:48px">Eighteen holes, <em style="color:var(--brass)">in detail</em></h2>',
    '<div class="hole-explorer" data-holes=\'' + holeDataJSON + '\'>',
    '<div class="hole-explorer-map">',
    '<svg class="course-routing" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" aria-label="Course routing map">',
    '<defs><linearGradient id="fairway-grad-' + clubName.replace(/\s+/g,'') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3D5F45" stop-opacity="0.18"/><stop offset="100%" stop-color="#3D5F45" stop-opacity="0.05"/></linearGradient></defs>',
    '<rect width="1000" height="600" fill="url(#fairway-grad-' + clubName.replace(/\s+/g,'') + ')" rx="14"/>',
    '<text x="500" y="34" text-anchor="middle" class="map-title">' + clubName + ' &middot; Routing</text>',
    '<text x="500" y="52" text-anchor="middle" class="map-sub">Par ' + coursePar + ' &middot; ' + totalYards + ' yards (' + teeColour + ')</text>',
    '<path class="routing-path" d="' + routingPath + '" />',
    markersSVG,
    '<g transform="translate(500,560)">',
    '<rect x="-44" y="-14" width="88" height="28" rx="3" fill="#8B6F3A" opacity="0.18"/>',
    '<text class="clubhouse-label" y="5" text-anchor="middle">Clubhouse</text>',
    '</g>',
    '</svg>',
    '</div>',
    '<div class="hole-explorer-detail" id="hole-detail">',
    '<div class="hole-detail-empty">',
    '<p class="eyebrow eyebrow-brass">Begin</p>',
    '<h3>Select a hole</h3>',
    '<p class="hole-detail-empty-text">Hover or tap any of the eighteen markers to read its character.</p>',
    '<div class="hole-detail-empty-stats">',
    '<div><span class="stat-num">18</span><span class="stat-lbl">Holes</span></div>',
    '<div><span class="stat-num">' + coursePar + '</span><span class="stat-lbl">Par</span></div>',
    '<div><span class="stat-num">' + totalYards + '</span><span class="stat-lbl">Yards</span></div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div></section>'
  ].join('');
}

/* Helper: derive SI ranking from descriptions (when scorecards don't publish SI).
 * Lower SI = harder. Keywords like "stroke index one", "toughest", "long",
 * "narrow" push SI down. "Birdie chance", "drivable", "short", "breather"
 * push SI up. Result is a permutation of 1-18.
 */
export function deriveStrokeIndices(holes){
  const scored = holes.map(h => {
    let difficulty = 0;
    const text = (h.desc || '').toLowerCase();
    // Hard signals
    if (/stroke index one|si one|si 1|toughest|hardest/i.test(text)) difficulty += 50;
    if (/long|stretches|stretching|demanding|unrelenting/.test(text)) difficulty += 10;
    if (/narrow|tight|no margin|no easy/.test(text)) difficulty += 8;
    if (/dogleg|dog-leg/.test(text)) difficulty += 4;
    if (/blind|over the bushes|over rough/.test(text)) difficulty += 6;
    // Length bonus (raw yards as soft signal)
    if (h.par === 4 && h.yd >= 420) difficulty += 12;
    if (h.par === 4 && h.yd >= 400 && h.yd < 420) difficulty += 6;
    if (h.par === 5 && h.yd >= 520) difficulty += 8;
    if (h.par === 3 && h.yd >= 200) difficulty += 8;
    // Easy signals
    if (/birdie chance|drivable|short|breather|reachable|forgiving/.test(text)) difficulty -= 10;
    if (/wide|accessible|gentle/.test(text)) difficulty -= 6;
    if (h.par === 3 && h.yd < 160) difficulty -= 6;
    return { n: h.n, difficulty };
  });
  // Rank: hardest gets SI 1, easiest gets SI 18
  const ranked = [...scored].sort((a,b) => b.difficulty - a.difficulty);
  const siMap = {};
  ranked.forEach((entry, idx) => { siMap[entry.n] = idx + 1; });
  return holes.map(h => ({ ...h, si: siMap[h.n] }));
}

/* Helper: derive hole shape from description keywords. */
export function deriveShape(desc, par){
  const t = (desc || '').toLowerCase();
  if (par === 3) return 'short';
  if (/dogleg left|dog-leg left/.test(t)) return 'dogleg-l';
  if (/dogleg right|dog-leg right/.test(t)) return 'dogleg-r';
  if (/dogleg|dog-leg/.test(t)) return Math.random() > 0.5 ? 'dogleg-l' : 'dogleg-r';
  return 'straight';
}
