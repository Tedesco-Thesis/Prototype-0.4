/* =====================================================================
   journey.js — the 0.7 layer: a computer you can only keep three things from.

   WHAT IT DOES
   - Every era has 2-4 explorable THINGS (js/content/eras.js). They are read-only samples, so the stacks,
     the viewer and "what you left" treat them like everything else.
   - Five times (the ANCHORS) the computer moves on. A scene asks the visitor to keep three of the things at
     risk. The rest get one of four fates: gone, flattened, gated, displaced. They never vanish silently:
     each leaves a record, and the reason is shown, until 2024, when it no longer is.
   - The era bar stays free. Going back finds a record of what was lost, never the thing itself.
   - "what it noticed" shows what a system could read from the choices (categories, seconds, number of times
     going back), next to what the visitor actually wrote.
   - 2024 shows a "suggestion" while writing a letter (a plain rule list, not a model). 2030 asks a question instead.

   WHAT IT KEEPS
   - Only in this browser, under its own key (thirdspace.journey.v1): the choices, the seconds taken, an optional
     sentence, the log of eras visited. It is shown on the "what it noticed" tab, can be exported, and is erased by
     "erase journey" and by the store's "delete everything". Nothing is sent anywhere. The arrival screen says so first.

   SWITCHES: js/content/eras.js → CFG (keep, perTransition, allowBack).
   Auto-start is off under #quick (so the older tests keep working); add #journey to switch it on.
   ===================================================================== */
(function () {
  'use strict';
  const C = window.TS_CONTENT; if (!C) return;
  const KEY = 'thirdspace.journey.v1';
  const AUTO = !/quick/.test(location.hash) || /journey/.test(location.hash);
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const now = () => new Date().toISOString();

  /* ---------------- state ---------------- */
  const blank = () => ({ v: 1, mode: 'new', passed: {}, kept: {}, lost: {}, opened: {}, unlocked: {}, why: {}, hes: {}, delegated: {}, log: [], going: [], polish: { shown: 0, accepted: 0, refused: 0 }, asks: { shown: 0, answered: 0 }, revealSeen: false });
  let mem = null;
  function load() { try { const r = localStorage.getItem(KEY); return r ? Object.assign(blank(), JSON.parse(r)) : (mem || blank()); } catch (e) { return mem || blank(); } }
  let J = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(J)); } catch (e) { mem = J; } }
  function log(what) { J.log.push({ t: now(), what }); if (J.log.length > 300) J.log.shift(); save(); }

  /* ---------------- eras and things ---------------- */
  const eraKeys = () => (typeof ERAS !== 'undefined' ? ERAS.map((e) => e.key) : []);
  const idx = (k) => eraKeys().indexOf(k);
  const eraOf = (k) => (typeof ERAS !== 'undefined' && ERAS.find((e) => e.key === k)) || { key: k, label: k, name: '' };
  const curKey = () => { const m = /era-(\w+)/.exec(document.body.className); return m ? m[1] : '1991'; };
  const ALL = [];
  Object.keys(C.THINGS).forEach((ek) => C.THINGS[ek].forEach((t) => ALL.push(Object.assign({ era: ek }, t))));
  const byId = (id) => ALL.find((t) => t.id === id);
  const fateOf = (id) => (J.lost[id] ? J.lost[id].fate : 'here');
  const yearOf = (k) => parseInt(k, 10);
  const opaque = (k) => yearOf(k || curKey()) >= C.CFG.opaqueFrom;
  const reasonOf = (id) => { const l = J.lost[id]; if (!l) return ''; return yearOf(l.scene) >= C.CFG.opaqueFrom || !l.reason ? '' : l.reason; };
  const systemVersion = (t) => { const w = (t.line + ' ' + t.ctx).replace(/\s+/g, ' ').split(' ').slice(0, 11).join(' '); return w.replace(/[,.;:]$/, '') + '…'; };

  function bodyFor(t) {
    const f = fateOf(t.id);
    if (f === 'gone') return 'not retained.';
    if (f === 'degraded') return t.line + ' [image and formatting removed]';
    if (f === 'gated') return '[behind a gate. open it in the things window to see what it asks.]';
    if (f === 'displaced') return systemVersion(t);
    return t.line + ' ' + t.ctx;
  }
  function artifact(t) {
    const f = fateOf(t.id), l = J.lost[t.id];
    return {
      id: t.id, origin: 'sample', type: 'thing', year: yearOf(t.era), title: t.title, body: bodyFor(t),
      author: { handle: 'family computer', label: 'the family computer', consent: 'anon', placeholder: true },
      fields: { ctx: f === 'here' ? t.ctx : '', kind: t.kind, theme: t.theme, fate: f, era: t.era },
      tags: [], refs: [], links: [], visibility: 'public', revisions: [], keepHistory: false, binned: false, invented: true, fate: f,
      events: [{ t: null, what: 'written for this prototype (stand-in wording)' }].concat(l ? [{ t: null, what: C.FATES[f].label + (reasonOf(t.id) ? ': ' + reasonOf(t.id) : ': no reason shown') }] : []),
    };
  }
  const baseSamples = window.TS_SAMPLES || (() => []);
  window.TS_SAMPLES = function () { return baseSamples().concat(ALL.map(artifact)); };

  /* ---------------- markup ---------------- */
  function build() {
    if ($('#win-things')) return;
    const w = document.createElement('div');
    w.className = 'window'; w.id = 'win-things'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-labelledby', 'jyTitle');
    w.style.cssText = 'width:520px; top:110px; left:280px; z-index:12;';
    w.innerHTML = '<div class="titlebar" onpointerdown="startDrag(event,\'win-things\')"><span class="ttl" id="jyTitle">things in this year</span>' +
      '<div class="winbtns"><button onclick="minimizeWindow(\'win-things\')" aria-label="minimize">_</button><button onclick="closeWindow(\'win-things\')" aria-label="close">×</button></div></div>' +
      '<div class="winbody jy-body"><div class="jy-tabs" role="tablist" aria-label="the journey"></div><div id="jyMain"></div></div>';
    document.body.appendChild(w);
    const b = document.createElement('button');
    b.id = 'jyBtn'; b.type = 'button'; b.className = 'btn-95'; b.addEventListener('click', () => openThings());
    document.body.appendChild(b);
    const a = document.createElement('div'); a.id = 'jyModal'; a.hidden = true; a.setAttribute('role', 'dialog'); a.setAttribute('aria-modal', 'true'); document.body.appendChild(a);
    if (typeof windowTitles !== 'undefined') windowTitles['win-things'] = 'things in this year';
    w.addEventListener('click', onClick); w.addEventListener('input', onInput);
    a.addEventListener('click', onModalClick); a.addEventListener('input', onModalInput);
    label();
  }
  function label() {
    const b = $('#jyBtn'); if (!b) return;
    const k = curKey(), n = (C.THINGS[k] || []).length;
    b.textContent = '◆ things in ' + eraOf(k).label + (n ? ' (' + n + ')' : '');
    b.hidden = !n;
  }

  /* ---------------- the things window ---------------- */
  const ui = { tab: 'here', open: null, say: '' };
  const TABS = [['here', 'things here'], ['left', 'what’s left'], ['people', 'people'], ['noticed', 'what it noticed'], ['log', 'log']];
  function openThings(tab, id) {
    build(); if (tab) ui.tab = tab; ui.open = id || null; draw();
    if (typeof openWindow === 'function') openWindow('win-things');
    const w = $('#win-things'); w.classList.add('open'); w.style.display = 'flex';
  }
  function draw() {
    const m = $('#jyMain'); if (!m) return;
    $('#win-things .jy-tabs').innerHTML = TABS.map(([k, t]) => '<button class="btn-95' + (ui.tab === k ? ' active' : '') + '" role="tab" aria-selected="' + (ui.tab === k) + '" data-tab="' + k + '">' + t + '</button>').join('');
    let h = '';
    if (ui.open) h = detail(byId(ui.open));
    else if (ui.tab === 'here') h = listHere();
    else if (ui.tab === 'left') h = listLeft();
    else if (ui.tab === 'people') h = listPeople();
    else if (ui.tab === 'noticed') h = reveal();
    else h = logTab();
    m.innerHTML = h + '<div class="jy-say" role="status">' + esc(ui.say) + '</div>';
    label();
  }
  const badge = (id) => { const f = fateOf(id); return f === 'here' ? (J.opened[id] ? '<span class="jy-b ok">opened</span>' : '') : '<span class="jy-b f-' + f + '">' + esc(C.FATES[f].label) + '</span>'; };
  const kept = (id) => Object.keys(J.kept).some((s) => J.kept[s].indexOf(id) >= 0);

  function listHere() {
    const k = curKey(), er = eraOf(k), list = C.THINGS[k] || [];
    let h = '<p class="jy-era"><b>' + esc(er.label) + '</b> · ' + esc(er.name || '') + '</p><p class="jy-help">things you can pick up and read in this era. open one for what it was, and poke it. nothing here is counted unless it says so.</p>';
    if (J.mode === 'free') h += '<p class="jy-help">you chose to look around without the journey, so nothing is lost. <a href="#" data-act="join">start it anyway</a></p>';
    h += list.length ? '<ul class="jy-list">' + list.map((t) => '<li><button class="jy-row" data-thing="' + t.id + '"><b>' + esc(t.title) + '</b> ' + badge(t.id) + '<span>' + esc(t.line) + '</span></button></li>').join('') + '</ul>' : '<p class="ts-empty">nothing is catalogued for this era.</p>';
    return h;
  }
  function listLeft() {
    const ids = Object.keys(J.lost);
    let h = '<p class="jy-help">what each era did not carry forward, and how. nothing is deleted from your browser: these were never yours to lose; they are samples. this is how the journey shows loss.</p>';
    if (!ids.length) return h + '<p class="ts-empty">nothing yet. the first transition is into 1993.</p>';
    return h + '<ul class="jy-list">' + ids.map((id) => { const t = byId(id), l = J.lost[id]; return '<li><button class="jy-row" data-thing="' + id + '"><b>' + esc(t.title) + '</b> ' + badge(id) + '<span>' + esc(eraOf(t.era).label) + ' · left behind going into ' + esc(eraOf(l.scene).label) + ' · ' + (reasonOf(id) ? esc(reasonOf(id)) : 'no reason shown') + '</span></button></li>'; }).join('') + '</ul>';
  }
  function listPeople() {
    let h = '<p class="jy-help"><b>stand-ins.</b> these profiles are invented placeholders for people who were interviewed. each links three things. they will be replaced with the real wording of people who agreed, in the way they chose (named, first name, or anonymous).</p>';
    return h + C.PROFILES.map((p) => '<section class="jy-prof"><h4>' + esc(p.handle) + '</h4><div>' + esc(p.note) + '</div><div class="jy-help">' + esc(p.line) + '</div><div>' + p.links.map((id) => { const t = byId(id); return t ? '<button class="btn-95" data-thing="' + id + '">' + esc(t.title) + ' <small>' + esc(eraOf(t.era).label) + '</small></button>' : ''; }).join(' ') + '</div></section>').join('');
  }

  function detail(t) {
    if (!t) return '';
    const f = fateOf(t.id), l = J.lost[t.id], er = eraOf(t.era);
    let h = '<button class="btn-95" data-act="close-detail">← back</button> <span class="jy-era"><b>' + esc(t.title) + '</b> · ' + esc(er.label) + ' ' + badge(t.id) + '</span>';
    if (f === 'gone') {
      h += '<article class="jy-card gone"><p><b>this is a record, not the thing.</b></p><p>' + esc(t.title) + ' (' + esc(t.kind) + ', ' + esc(er.label) + ') was here.</p><p class="jy-help">reason: ' + (reasonOf(t.id) ? esc(reasonOf(t.id)) : '<i>not shown</i>') + '</p><p class="jy-help">' + esc(C.FATES.gone.note) + '</p></article>';
      return h + (window.Viewer ? '<p><button class="btn-95" data-act="trace" data-id="' + t.id + '">open the record</button></p>' : '');
    }
    if (f === 'gated' && !J.unlocked[t.id]) return h + gate(t);
    let ctx = t.ctx, line = t.line, poke = true;
    if (f === 'degraded') { ctx = '[image and formatting removed]'; poke = false; }
    if (f === 'displaced') { ctx = systemVersion(t); poke = false; }
    h += '<article class="jy-card' + (f !== 'here' ? ' ' + f : '') + '"><p class="jy-line">' + esc(line) + '</p><p>' + esc(ctx) + '</p>' +
      (f === 'displaced' ? '<p class="jy-help"><b>the system’s version.</b> it replaced the original. ' + (curKey() === '2030' ? '<a href="#" data-act="orig" data-id="' + t.id + '">see what it said before</a>' : 'the original is not shown in this era.') + '</p>' : '') +
      (f === 'degraded' ? '<p class="jy-help">' + esc(C.FATES.degraded.note) + '</p>' : '') +
      (t.era === '2030' ? '<p class="jy-help">this is speculative. nothing like it exists yet.</p>' : '') + '</article>';
    if (poke) h += '<p><button class="btn-95" data-act="poke" data-id="' + t.id + '">' + esc(t.poke[0]) + '</button></p><div class="jy-poke" id="jyPoke"></div>';
    h += '<p class="jy-help">wording is a stand-in. <a href="#" data-act="trace" data-id="' + t.id + '">open as a trace</a> to see it held three ways.</p>';
    if (!J.opened[t.id]) { J.opened[t.id] = 1; log('opened “' + t.title + '” (' + er.label + ')'); }
    return h;
  }
  function gate(t) {
    const left = t.theme === 'keeping' || yearOf(curKey()) >= C.CFG.opaqueFrom;   // some gates have no way in
    if (left) return '<article class="jy-card gated"><p><b>not included in your plan.</b></p><p>' + esc(t.title) + ' is still here. you cannot read it.</p><div class="jy-plans"><span>free · headlines only</span><span>plus · ads removed</span><span>premium · archive, but not this one</span></div><p class="jy-help">this is a simulation: nothing can be bought, and none of these buttons does anything. the point is that a way in can simply not exist.</p></article>';
    return '<article class="jy-card gated"><p><b>sign in to continue.</b></p><p>' + esc(t.title) + ' is behind an account.</p><label class="jy-opt"><input type="checkbox" id="jyAgree"> i agree to be known by this site as a name and a number <small>(fictional; nothing is stored beyond a line in your journey log)</small></label><p><button class="btn-95" data-act="unlock" data-id="' + t.id + '" disabled id="jyUnlock">continue</button></p><p class="jy-help">the gate asks for agreement. it does not ask whether you want what is behind it.</p></article>';
  }

  /* ---------------- the reveal ---------------- */
  function reveal() {
    const sc = Object.keys(J.kept);
    let h = '<p class="jy-help"><b>fiction.</b> this is what a system could read from the choices you made, using plain rules, next to what you actually wrote. it lives in this browser only.</p>';
    if (!sc.length) return h + '<p class="ts-empty">nothing yet. it only notices at the five transitions. the first is into 1993.</p>';
    const tally = {}; let keptN = 0, lostN = 0; const lostT = {};
    sc.forEach((s) => J.kept[s].forEach((id) => { const t = byId(id); if (t) { tally[t.theme] = (tally[t.theme] || 0) + 1; keptN++; } }));
    Object.keys(J.lost).forEach((id) => { const t = byId(id); if (t) { lostT[t.theme] = (lostT[t.theme] || 0) + 1; lostN++; } });
    const top = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0];
    h += '<h4>what it kept about each choice</h4>' + sc.map((s) => {
      const titles = J.kept[s].map((id) => '“' + esc((byId(id) || {}).title) + '”').join(', ');
      return '<section class="jy-prof"><b>into ' + esc(eraOf(s).label) + ' · ' + esc(C.SCENES[s].title) + '</b><div>kept: ' + (titles || 'nothing') + '</div><div class="jy-help">categories read: ' + J.kept[s].map((id) => esc(C.THEMES[(byId(id) || {}).theme] || '')).join('; ') + '</div><div class="jy-help">time to choose: ' + Math.round((J.hes[s] || 0) / 1000) + 's' + (J.delegated[s] ? ' · you let it choose' : '') + '</div>' +
        '<div class="jy-help jy-yours">what you wrote: ' + (J.why[s] ? '“' + esc(J.why[s]) + '”' : '<i>nothing. it has no way to know.</i>') + '</div></section>';
    }).join('');
    h += '<h4>what a rule would conclude</h4><p>' + (top ? 'you kept mostly <b>' + esc(C.THEMES[top]) + '</b> (' + tally[top] + ' of ' + keptN + '). a rule would predict you will keep that kind of thing next, and show you more of it.' : 'no pattern yet.') + '</p>';
    h += '<p class="jy-help">it cannot tell: that you kept something for a person, a smell, a mistake. that your hesitation (' + sc.map((s) => Math.round((J.hes[s] || 0) / 1000) + 's').join(', ') + ') may have been reading, not doubt. a system would label it “uncertainty”.</p>';
    h += '<p class="jy-help">left behind: ' + lostN + ' things. what leaving them out says about you is a guess.</p>';
    if (J.going.length) h += '<p class="jy-help">you went back ' + J.going.length + ' time' + (J.going.length === 1 ? '' : 's') + '. a system would call that “churn”. you may have been looking for something.</p>';
    if (J.polish.shown) h += '<p class="jy-help">in 2024 it suggested a rewrite ' + J.polish.shown + ' time' + (J.polish.shown === 1 ? '' : 's') + '. you accepted ' + J.polish.accepted + ' and kept your own ' + J.polish.refused + '.</p>';
    if (J.asks.shown) h += '<p class="jy-help">in 2030 it asked ' + J.asks.shown + ' question' + (J.asks.shown === 1 ? '' : 's') + ' and wrote nothing.</p>';
    return h + '<p><button class="btn-95" data-act="export">export what it kept (JSON)</button></p>';
  }
  function logTab() {
    let h = '<p class="jy-help">everything the journey itself has recorded. it is local, you can read all of it, and you can erase it.</p>';
    h += '<p><b>mode:</b> ' + (J.mode === 'on' ? 'journey on' : J.mode === 'free' ? 'looking around (no loss)' : 'not started') + ' · keep ' + C.CFG.keep + (C.CFG.perTransition ? ' at every transition' : ' for the whole journey') + ' · going back: ' + (C.CFG.allowBack ? 'allowed (you find a record, never the thing)' : 'not allowed') + '</p>';
    h += '<ul class="jy-log">' + (J.log.slice(-40).reverse().map((e) => '<li><span>' + new Date(e.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span> ' + esc(e.what) + '</li>').join('') || '<li>nothing yet.</li>') + '</ul>';
    return h + '<p><button class="btn-95" data-act="export">export (JSON)</button> <button class="btn-95" data-act="reset">erase journey</button> ' + (J.mode !== 'on' ? '<button class="btn-95" data-act="join">start the journey</button>' : '') + '</p>';
  }

  function onClick(e) {
    const tb = e.target.closest('[data-tab]'); if (tb) { ui.tab = tb.dataset.tab; ui.open = null; ui.say = ''; draw(); return; }
    const op = e.target.closest('[data-thing]'); if (op) { ui.open = op.dataset.thing; ui.say = ''; draw(); return; }
    const a = e.target.closest('[data-act]'); if (!a) return; e.preventDefault();
    const k = a.dataset.act;
    if (k === 'close-detail') { ui.open = null; draw(); }
    else if (k === 'poke') { const t = byId(a.dataset.id); $('#jyPoke').innerHTML = '<div class="jy-result">' + esc(t.poke[1]) + '</div>'; log('poked “' + t.title + '”'); }
    else if (k === 'unlock') { J.unlocked[a.dataset.id] = 1; log('agreed to a gate to open “' + byId(a.dataset.id).title + '”'); save(); ui.say = 'it let you in. it noted that you agreed (see the log).'; draw(); }
    else if (k === 'orig') { const t = byId(a.dataset.id); a.closest('p').innerHTML = '<b>before:</b> ' + esc(t.line + ' ' + t.ctx); }
    else if (k === 'trace') { if (window.Viewer) Viewer.open(a.dataset.id, { tab: fateOf(a.dataset.id) === 'gone' ? 'record' : undefined }); }
    else if (k === 'export') exportJSON();
    else if (k === 'reset') { reset(); ui.say = 'erased. the journey is back to the beginning.'; draw(); }
    else if (k === 'join') { J.mode = 'on'; save(); log('started the journey'); ui.say = 'started. the next transition will ask you to choose.'; draw(); }
  }
  function onInput(e) { if (e.target.id === 'jyAgree') $('#jyUnlock').disabled = !e.target.checked; }

  function exportJSON() {
    const out = JSON.stringify({ note: 'everything the journey recorded in this browser. nothing was sent anywhere.', journey: J }, null, 2);
    try { const u = URL.createObjectURL(new Blob([out], { type: 'application/json' })); const a = document.createElement('a'); a.href = u; a.download = 'third-space-journey.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); ui.say = 'exported.'; } catch (e) { ui.say = 'could not export here.'; }
    log('exported the journey');
    return out;
  }
  function reset(quiet) {
    J = blank(); try { localStorage.removeItem(KEY); } catch (e) { /* nothing to remove */ } mem = null; save();
    if (!quiet) { label(); }
    if ($('#jyMain')) draw();
  }

  /* ---------------- arrival and scenes ---------------- */
  const modal = () => $('#jyModal');
  function showModal(html) { build(); const m = modal(); m.innerHTML = '<div class="jy-sheet" tabindex="-1">' + html + '</div>'; m.hidden = false; const s = $('.jy-sheet', m); if (s) s.focus(); }
  function hideModal() { const m = modal(); if (m) { m.hidden = true; m.innerHTML = ''; } }
  let queue = [], scene = null;

  function arrival(then) {
    const A = C.ARRIVAL;
    showModal('<h2>' + esc(A.title) + '</h2>' + A.story.map((p) => '<p>' + esc(p) + '</p>').join('') + '<h3>what it keeps, and where</h3><ul>' + A.notes.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
      '<p class="jy-btns"><button class="btn-95 jy-go" data-a="begin">' + esc(A.begin) + '</button> <button class="btn-95" data-a="free">' + esc(A.free) + '</button></p><p class="jy-help">placeholder wording.</p>');
    arrival.then = then;
  }
  function pool(anchor) {
    const ai = idx(anchor);
    return ALL.filter((t) => idx(t.era) < ai && idx(t.era) >= 0 && fateOf(t.id) === 'here').sort((a, b) => idx(a.era) - idx(b.era));
  }
  function runScene(anchor) {
    const S = C.SCENES[anchor], p = pool(anchor), need = Math.min(C.CFG.keep, p.length);
    const automatic = !C.CFG.perTransition && Object.keys(J.kept).length > 0;
    scene = { anchor, pool: p, need, picked: [], t0: Date.now(), auto: automatic };
    if (automatic) { const carried = p.filter(kept).map((t) => t.id); scene.picked = carried; return finish(true); }
    const rows = p.map((t) => '<li><label class="jy-pick"><input type="checkbox" data-id="' + t.id + '"> <b>' + esc(t.title) + '</b> <span class="jy-b">' + esc(eraOf(t.era).label) + '</span><small>' + esc(t.line) + ' <i>(' + esc(C.THEMES[t.theme]) + ')</i></small></label></li>').join('');
    showModal('<p class="jy-kick">moving into ' + esc(eraOf(anchor).label) + ' · ' + esc(eraOf(anchor).name || '') + '</p><h2>' + esc(S.title) + '</h2><p>' + esc(S.intro) + '</p>' +
      (need < p.length ? '<p><b>you can bring ' + need + '.</b> choose which.</p>' : '<p>you can bring all of them this time.</p>') +
      '<ul class="jy-picks">' + rows + '</ul><p class="jy-count" role="status" id="jyCount"></p>' +
      '<label class="jy-opt">why these? <small>(optional. it stays in this browser, and it is the only part of this that is in your words)</small><input class="field" id="jyWhy" maxlength="140"></label>' +
      '<p class="jy-btns"><button class="btn-95 jy-go" data-a="carry" id="jyCarry" disabled>carry these</button> <button class="btn-95" data-a="delegate">let it choose for me</button></p>');
    count();
  }
  function count() {
    const picked = $$('#jyModal .jy-picks input:checked'), full = picked.length >= scene.need;
    $$('#jyModal .jy-picks input').forEach((i) => { i.disabled = full && !i.checked; });
    $('#jyCount').textContent = picked.length + ' of ' + scene.need + ' chosen';
    $('#jyCarry').disabled = picked.length !== scene.need;
  }
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function onModalInput(e) { if (e.target.matches('.jy-picks input')) count(); }
  function onModalClick(e) {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'begin') { J.mode = 'on'; log('started the journey'); hideModal(); const t = arrival.then; arrival.then = null; if (t) t(); }
    else if (a === 'free') { J.mode = 'free'; log('chose to look around without the journey'); hideModal(); arrival.then = null; draw(); }
    else if (a === 'carry') { scene.picked = $$('#jyModal .jy-picks input:checked').map((i) => i.dataset.id); scene.why = ($('#jyWhy').value || '').trim(); finish(); }
    else if (a === 'delegate') {
      // the system picks by a plain rule: the things you opened most recently, then the oldest. shown in the log and the reveal.
      const opened = scene.pool.filter((t) => J.opened[t.id]).reverse(), rest = scene.pool.filter((t) => !J.opened[t.id]);
      scene.picked = opened.concat(rest).slice(0, scene.need).map((t) => t.id); scene.delegated = true; scene.why = ''; finish();
    }
    else if (a === 'next') { hideModal(); nextScene(); }
  }
  function finish(silent) {
    const S = C.SCENES[scene.anchor], fates = S.fates, lost = [];
    J.kept[scene.anchor] = scene.picked.slice(); J.hes[scene.anchor] = silent ? 0 : Date.now() - scene.t0;
    if (scene.why) J.why[scene.anchor] = scene.why; if (scene.delegated) J.delegated[scene.anchor] = true;
    scene.pool.forEach((t) => { if (scene.picked.indexOf(t.id) < 0) lost.push(t); });
    lost.forEach((t, i) => { J.lost[t.id] = { fate: fates[i % fates.length], scene: scene.anchor, reason: S.reason }; });
    J.passed[scene.anchor] = true;
    log('into ' + eraOf(scene.anchor).label + ': kept ' + scene.picked.map((id) => byId(id).title).join(', ') + (lost.length ? ' · ' + lost.length + ' left behind' : '') + (scene.delegated ? ' (let it choose)' : ''));
    save();
    if (silent) { nextScene(); draw(); return; }
    const rows = lost.map((t) => '<li><b>' + esc(t.title) + '</b> <span class="jy-b f-' + J.lost[t.id].fate + '">' + esc(C.FATES[J.lost[t.id].fate].label) + '</span><small>' + esc(C.FATES[J.lost[t.id].fate].note) + ' ' + (yearOf(scene.anchor) >= C.CFG.opaqueFrom ? '<i>no reason is shown.</i>' : 'reason: ' + esc(S.reason) + '.') + '</small></li>').join('');
    showModal('<p class="jy-kick">into ' + esc(eraOf(scene.anchor).label) + '</p><h2>what happened to the rest</h2>' + (lost.length ? '<ul class="jy-picks">' + rows + '</ul>' : '<p>nothing was left behind this time.</p>') +
      '<p class="jy-help"><b>what this is about.</b> ' + esc(S.why) + '</p><p class="jy-help">you can find what was left behind under “what’s left”. it will be a record, not the thing.</p><p class="jy-btns"><button class="btn-95 jy-go" data-a="next">continue</button></p>');
    draw();
  }
  // a scene waits for the era's own arrival (splash, login ritual) to finish, so the visitor sees where they arrived first
  function whenSettled(fn, n) {
    const r = document.getElementById('ritual'), busy = document.querySelector('[id^=era].show') || (r && r.getClientRects().length && getComputedStyle(r).visibility !== 'hidden' && getComputedStyle(r).opacity !== '0');
    if (!busy || (n || 0) > 100) return fn();
    setTimeout(() => whenSettled(fn, (n || 0) + 1), 300);
  }
  function nextScene() {
    if (scene) { scene = null; }
    const a = queue.shift();
    if (a) { scene = { waiting: true }; whenSettled(() => runScene(a)); }
    else { label(); if (curKey() === '2030' && AUTO && !J.revealSeen) { J.revealSeen = true; save(); openThings('noticed'); } }
  }

  /* ---------------- era changes ---------------- */
  function onEra(before) {
    const nowK = curKey(); label(); if (nowK === before) return;
    if (ui.open && byId(ui.open) && false) ui.open = null;
    ui.open = null; if ($('#jyMain') && $('#win-things').classList.contains('open')) { if (ui.tab === 'here') draw(); }
    polishUpdate();
    if (idx(nowK) < idx(before) && idx(before) >= 0) { J.going.push({ from: before, to: nowK, t: now() }); log('went back: ' + before + ' → ' + nowK); return; }
    if (!AUTO || J.mode === 'free') return;
    const due = C.CFG.anchors.filter((a) => !J.passed[a] && idx(a) <= idx(nowK) && idx(a) > idx(before) && queue.indexOf(a) < 0);
    if (!due.length) return;
    queue = queue.concat(due);
    if (J.mode === 'new') { whenSettled(() => arrival(() => nextScene())); return; }
    if (!scene && modal().hidden) nextScene();
  }
  function hook() {
    const prev = window.setEra; if (typeof prev !== 'function') return;
    window.setEra = function () { const before = curKey(); const r = prev.apply(this, arguments); try { onEra(before); } catch (e) { if (window.console) console.error(e); } return r; };
  }

  /* ---------------- writing: 2024 suggests, 2030 asks ---------------- */
  function applyPolish(s) { return C.POLISH.reduce((t, [re, to]) => t.replace(re, to), s).trim(); }
  let lastSug = '', lastAsk = -1;
  function polishUpdate() {
    const box = $('#jyPolish'), ta = $('#mailText'); if (!ta) return;
    const host = ta.parentNode; let el = box;
    if (!el) { el = document.createElement('div'); el.id = 'jyPolish'; el.setAttribute('role', 'status'); ta.before(el); }
    const k = curKey(), txt = ta.value.trim(); let keepInView = false;
    if (k === '2024' && txt.length > 12) {
      const sug = applyPolish(txt);
      if (sug && sug !== txt) {
        if (sug !== lastSug) { lastSug = sug; J.polish.shown++; save(); }
        el.className = 'jy-polish p2024'; el.hidden = false;
        keepInView = true;
        el.innerHTML = '<b>suggested:</b> ' + esc(sug) + '<div><button type="button" class="btn-95 jy-go" data-p="use">use suggestion</button> <a href="#" data-p="keep">keep mine</a></div><small>a short list of plain rules that removes hedges and apologies. it will not tell you what it removed.</small>';
        try { ta.scrollIntoView({ block: 'nearest' }); } catch (e) { /* older browser */ }
        return;
      }
    }
    if (k === '2030' && txt.length > 12) {
      const qi = Math.floor(txt.length / 40) % C.NOUS.length;
      if (qi !== lastAsk) { lastAsk = qi; J.asks.shown++; save(); }
      el.className = 'jy-polish p2030'; el.hidden = false;
      keepInView = true;
      el.innerHTML = '<b>mote asks:</b> ' + esc(C.NOUS[qi]) + '<div><input class="field" id="jyAnswer" placeholder="answer, or leave it" aria-label="your answer to the question"> <button type="button" class="btn-95" data-p="answered">answered</button></div><small>it asks and writes nothing. your answer is not kept.</small>';
      try { ta.scrollIntoView({ block: 'nearest' }); } catch (e) { /* older browser */ }
      return;
    }
    el.hidden = true; el.innerHTML = '';
  }
  document.addEventListener('input', (e) => { if (e.target.id === 'mailText') polishUpdate(); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]'); if (!b) return; e.preventDefault();
    const ta = $('#mailText'), p = b.dataset.p;
    if (p === 'use') { J.polish.accepted++; log('accepted a suggested rewrite'); ta.value = applyPolish(ta.value.trim()); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    else if (p === 'keep') { J.polish.refused++; log('kept their own words'); $('#jyPolish').hidden = true; lastSug = ''; }
    else if (p === 'answered') { J.asks.answered++; log('answered a question'); $('#jyPolish').innerHTML = '<small>noted nowhere. carry on.</small>'; }
    save();
  });

  /* ---------------- public ---------------- */
  window.Journey = {
    state: () => J, things: (k) => (C.THINGS[k] || []), fateOf, open: openThings, begin: () => { J.mode = 'on'; save(); }, free: () => { J.mode = 'free'; save(); },
    reset, exportJSON, pool, runScene: (a) => { queue = [a]; scene = null; nextScene(); }, ALL,
    banner(a) {
      const f = a.fate || 'here', t = byId(a.id); if (!t) return '';
      if (f === 'here') return '<p class="ts-foot">a thing from ' + esc(eraOf(t.era).label) + '. wording is a stand-in.</p>';
      return '<p class="ts-fiction"><b>' + esc(C.FATES[f].label) + '.</b> ' + esc(C.FATES[f].note) + ' ' + (reasonOf(a.id) ? 'reason: ' + esc(reasonOf(a.id)) + '.' : (opaque() ? 'no reason is shown in this era.' : '')) + '</p>';
    },
  };

  function init() {
    build(); hook();
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal() && !modal().hidden && !scene) hideModal(); });
    new MutationObserver(label).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    if (!/era-1991/.test(document.body.className) || true) label();
  }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
