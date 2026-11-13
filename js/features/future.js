/* =====================================================================
   future.js — the speculative end, in two steps (0.8).

   STEP 1 · AFTER AI  (era 2030)      agents do the browsing, the interface is generated per person, and
                                       "made by AI" matters less than who vouches for a thing (provenance).
   STEP 2 · AFTER THE LOCKS (2030+pq)  old encryption opens ("harvest now, decrypt later"), things are re-sealed,
                                       and a note can be sent that cannot be copied.

   Everything here is assembled from what the visitor did in the archive: what they carried, what they answered,
   what they made, whether they took the 2024 suggestion, which gates they agreed to, what they hid.
   It is not anti-AI: each panel shows the real gain first, then the one thing it asks for, and a dial lets the
   visitor decide how much the agent does.

   Honest limits: nothing here is a real agent, a real signature or real cryptography. They are simulations, and the
   window says so. The quantum parts are metaphors for two real properties (old secrets can be opened later; a
   quantum state cannot be copied), not predictions. State lives inside the journey record (J.future), so the
   same export and erase apply. Copy is in COPY. Reading list for the written portion: NOTES-0.8.md.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.Journey || !window.TS_CONTENT) return;
  const C = window.TS_CONTENT;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const J = () => Journey.state();
  const F = () => { const j = J(); j.future = j.future || { dial: null, errands: {}, signed: {}, sealed: {}, note: '', noteRead: false, moteRead: false, egg: false, cat: null }; return j.future; };
  const save = () => Journey.save();
  const is2030 = () => /era-2030/.test(document.body.className);
  const isPQ = () => is2030() && document.body.classList.contains('pq');
  const name = () => J().name || 'you';

  const COPY = {
    aiTitle: 'after AI', pqTitle: 'after the locks',
    aiLead: 'An agent does the browsing now. The screen is put together for one person at a time. Both are real gains. Each asks for one thing back.',
    pqLead: 'The old locks have opened. Anything sent under them, years ago, can be read now. New locks exist, and one new kind of message can’t be copied at all.',
    spec: 'speculative. nothing here is a real agent, signature or lock; it is a model of how they could behave. the quantum parts stand for two real properties, not predictions.',
    dial: ['i do it myself', 'it asks me first', 'it drafts, i edit', 'it just does it'],
    dialGain: ['slowest. every word is yours.', 'a question before you start. still your words.', 'faster. you can see which words are its own.', 'fastest. you find out afterwards.'],
    errandsLead: 'Your agent can go back to the places you visited. It saves the trip. Decide how it introduces itself.',
    places: [
      { id: 'guest', icon: '📖', where: 'the guestbook (1996)', asMe: 'signed the guestbook in your name. the owner thinks you stopped by.', asAgent: 'signed: “an agent, on behalf of %N”. the owner wrote back: tell them to come themselves :)', saved: 4 },
      { id: 'forum', icon: '💬', where: 'the forum thread (2010)', asMe: 'replied to the thread as you. the regulars answered you warmly. you were not there.', asAgent: 'posted as an agent. two regulars replied. one asked if anyone is still a person in here.', saved: 11 },
      { id: 'shop', icon: '🧾', where: 'the shop with the form (1999)', asMe: 'filled in the six fields and bought the book. it gave them all six.', asAgent: 'bought the book and gave only the two fields the shop needs. the form complained.', saved: 7 },
    ],
    provLead: 'Almost everything involves AI somewhere now, so “made by AI” says little. What helps is a history that travels with a thing: who made it, when, and who vouches for it.',
    eggSay: 'found. nobody else’s computer has this one.',
    harvestLead: 'These were sent under the old locks, back when you sent them. Someone kept the recordings. They open today.',
    harvestNone: 'your 1999 sign-in: a name, a birth date and a password',
    sealNote: 're-sealing protects it from now on. what was already read stays read.',
    noteLead: 'A message can now be sent as a state that can’t be copied. Whoever opens it, uses it up.',
    moteNote: (kept) => kept ? 'you carried “' + kept + '” all the way here. i noticed. i’m glad it was that one.' : 'you came all this way without carrying anything. that’s allowed. i liked the company.',
    catLead: 'The cat from 1991 is back, and it has a twin. They are entangled: look at one, and the other is settled too.',
  };

  /* ---------------- what the archive gives the future ---------------- */
  function inputs() {
    const j = J(), carried = Journey.carrying().map((id) => Journey.byId(id)).filter(Boolean), mine = Journey.mine();
    const tally = {}; Object.keys(j.kept || {}).forEach((s) => j.kept[s].forEach((id) => { const t = Journey.byId(id); if (t) tally[t.theme] = (tally[t.theme] || 0) + 1; }));
    const left = {}; Object.keys(j.lost || {}).forEach((id) => { const t = Journey.byId(id); if (t) left[t.theme] = (left[t.theme] || 0) + 1; });
    const top = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0] || null, least = Object.keys(left).sort((a, b) => left[b] - left[a])[0] || null;
    const p = j.polish || { accepted: 0, refused: 0 };
    const dialFrom = p.accepted > p.refused ? 2 : 1;
    const why = p.accepted + p.refused === 0 ? 'you never met the 2024 suggestion, so it starts by asking.' : p.accepted > p.refused ? 'in 2024 you took its rewrite ' + p.accepted + ' time' + (p.accepted === 1 ? '' : 's') + ', so it starts by drafting.' : 'in 2024 you kept your own words ' + p.refused + ' time' + (p.refused === 1 ? '' : 's') + ', so it starts by asking.';
    return { carried, mine, top, least, dialFrom, why };
  }
  const dial = () => { const f = F(); return f.dial == null ? inputs().dialFrom : f.dial; };

  /* ---------------- markup ---------------- */
  function build() {
    if ($('#win-after')) return;
    const w = document.createElement('div'); w.className = 'window'; w.id = 'win-after'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-labelledby', 'fuTitle');
    w.style.cssText = 'width:680px; top:178px; left:300px; z-index:13;';
    w.innerHTML = '<div class="titlebar" onpointerdown="startDrag(event,\'win-after\')"><span class="ttl" id="fuTitle">after AI</span><div class="winbtns"><button onclick="minimizeWindow(\'win-after\')" aria-label="minimize">_</button><button onclick="closeWindow(\'win-after\')" aria-label="close">×</button></div></div><div class="winbody fu-body" id="fuMain"></div>';
    document.body.appendChild(w);
    if (typeof windowTitles !== 'undefined') windowTitles['win-after'] = 'after AI';
    w.addEventListener('click', onClick); w.addEventListener('input', onInput);
    const b = document.createElement('button'); b.id = 'fuBtn'; b.type = 'button'; b.className = 'btn-95'; b.hidden = true; b.onclick = () => open(); document.body.appendChild(b);
    // the second step gets its own place on the era bar
    const next = $('.era-btn[data-era="2030"]');
    if (next && !$('#fuStage')) { const s = document.createElement('button'); s.id = 'fuStage'; s.className = 'era-btn'; s.dataset.stage = 'pq'; s.textContent = 'after that ▸▸'; s.title = 'after the locks (speculative)'; s.onclick = () => stage('pq'); next.after(s); }
  }
  function open() { build(); draw(); if (typeof openWindow === 'function') openWindow('win-after'); const w = $('#win-after'); w.classList.add('open'); w.style.display = 'flex'; }
  function stage(s) {
    if (!is2030()) { stage.keep = s === 'pq'; setEra('2030'); stage.keep = false; }
    document.body.classList.toggle('pq', s === 'pq'); sync();
    if (s === 'pq') { const lbl = $('#eraLabel'); if (lbl) lbl.textContent = 'after the locks (speculative)'; open(); }
  }
  function sync() {
    build(); const b = $('#fuBtn'), st = $('#fuStage'), nx = $('.era-btn[data-era="2030"]');
    b.hidden = !is2030(); b.textContent = isPQ() ? '⚛ after the locks' : '✦ your agent';
    if (st) st.classList.toggle('active', isPQ()); if (nx && is2030()) nx.classList.toggle('active', !isPQ());
    const t = $('#fuTitle'); if (t) t.textContent = isPQ() ? COPY.pqTitle : COPY.aiTitle;
    if (!is2030()) { const w = $('#win-after'); if (w && w.classList.contains('open') && typeof closeWindow === 'function') closeWindow('win-after'); }
    else if ($('#win-after').classList.contains('open')) draw();
  }
  const sec = (id, h, body) => '<section class="fu-sec" id="fu-' + id + '"><h3>' + h + '</h3>' + body + '</section>';
  function draw() { const m = $('#fuMain'); if (!m) return; m.className = 'winbody fu-body ' + (isPQ() ? 'fu-pq' : 'fu-ai'); m.innerHTML = (isPQ() ? drawPQ() : drawAI()) + '<p class="fu-spec">' + COPY.spec + '</p><div class="fu-say" role="status" id="fuSay"></div>'; }
  const say = (t) => { const s = $('#fuSay'); if (s) s.textContent = t; };

  /* ================= STEP 1 · after AI ================= */
  function drawAI() {
    const I = inputs(), d = dial(), f = F();
    const tiles = f.other ? [['📰', 'the ranked feed'], ['✍️', 'an AI summary'], ['🔘', 'the like button']] : I.carried.map((t) => [Journey.obj(t), t.title]);
    while (tiles.length < 3) tiles.push(['·', '']);
    let h = '<div class="fu-hero ai' + (f.other ? ' other' : '') + '" data-th="' + (f.other ? 'none' : I.top || 'none') + '" aria-hidden="true"><span class="fu-orb"></span><div class="fu-mini"><b>' + (f.other ? 'assembled for a stranger' : 'assembled for ' + esc(name())) + '</b><div class="fu-tiles">' + tiles.slice(0, 3).map((t, i) => '<span style="--i:' + i + '"><i>' + t[0] + '</i>' + esc(t[1]) + '</span>').join('') + '</div><em>generated in 0.4s \u00b7 one of one</em></div><span class="fu-spark s1">✦</span><span class="fu-spark s2">✦</span><span class="fu-spark s3">✧</span></div><p class="fu-lead">' + COPY.aiLead + '</p>';
    // 1. generated for you
    const must = I.carried.length ? I.carried.map((t) => '<span class="fu-chip">' + Journey.obj(t) + ' ' + esc(t.title) + '</span>').join('') : '<span class="fu-chip dim">nothing carried</span>';
    h += sec('gen', 'this computer was assembled for ' + esc(name()),
      '<p>No two people get the same screen now. Yours was put together from what you carried and what you said.</p>' +
      '<div class="fu-rules"><div><b>must show</b>' + must + '</div><div><b>should show</b>' + (I.top ? '<span class="fu-chip">more about ' + esc(C.THEMES[I.top]) + '</span>' : '<span class="fu-chip dim">still learning</span>') + (I.mine.length ? '<span class="fu-chip">your ' + I.mine.length + ' own thing' + (I.mine.length === 1 ? '' : 's') + '</span>' : '') + '</div><div><b>never show</b>' + (I.least ? '<span class="fu-chip">' + esc(C.THEMES[I.least]) + ' (you left it behind most)</span>' : '<span class="fu-chip dim">nothing yet</span>') + '</div></div>' +
      '<p class="fu-two"><b>gain:</b> it fits you. bigger type, your order, your things first. <b>asks:</b> nobody else sees what you see, so there is less to point at together.</p>' +
      '<button type="button" class="fu-btn" data-a="other">' + (f.other ? 'back to yours' : 'see someone else’s') + '</button>' + (f.other ? '<div class="fu-other"><b>assembled for a stranger</b><span class="fu-chip">📰 the ranked feed</span><span class="fu-chip">✍️ an AI summary</span><span class="fu-chip">🔘 the like button</span><p>same computer. you would not recognise it.</p></div>' : ''));
    // 2. the dial
    h += sec('dial', 'how much should it do?',
      '<p>' + esc(I.why) + ' You can move it.</p><input type="range" min="0" max="3" step="1" value="' + d + '" id="fuDial" aria-label="how much the agent does" list="fuDialL"><div class="fu-dial-l">' + COPY.dial.map((x, i) => '<span class="' + (i === d ? 'on' : '') + '">' + x + '</span>').join('') + '</div><p class="fu-two"><b>' + COPY.dial[d] + ':</b> ' + COPY.dialGain[d] + '</p>' +
      '<label class="fu-write">try it: write a line to someone<textarea id="fuLine" rows="2" maxlength="160" placeholder="start a sentence…"></textarea></label><div id="fuDraft" class="fu-draft" aria-live="polite"></div>');
    // 3. errands
    h += sec('errands', 'send it back for you', '<p>' + COPY.errandsLead + '</p>' + COPY.places.map((p) => {
      const r = f.errands[p.id];
      return '<div class="fu-errand' + (r ? ' went as-' + r : '') + '"><div class="fu-track" aria-hidden="true"><span class="fu-you">you</span><i></i><span class="fu-dot">✦</span><span class="fu-place">' + p.icon + '</span>' + (r ? '<span class="fu-stamp">' + (r === 'me' ? 'as you' : 'as agent') + '</span>' : '') + '</div><div><b>' + p.where + '</b>' + (r ? '<p class="fu-res">' + esc((r === 'me' ? p.asMe : p.asAgent).replace('%N', name())) + '</p><small>saved you about ' + p.saved + ' minutes. ' + (r === 'me' ? 'they can’t tell it wasn’t you.' : 'they know what they were talking to.') + ' <a href="#" data-a="undo" data-id="' + p.id + '">undo</a></small>' : '<div class="fu-choose"><button type="button" class="fu-btn" data-a="go" data-id="' + p.id + '" data-as="me">go as me</button><button type="button" class="fu-btn" data-a="go" data-id="' + p.id + '" data-as="agent">say it’s my agent</button></div>') + '</div></div>';
    }).join(''));
    // 4. provenance
    const rows = I.mine.map((t) => {
      const fate = Journey.fateOf(t.id), signed = f.signed[t.id], l = J().lost[t.id];
      const chain = '<span class="fu-link ok">made by hand · ' + esc(Journey.eraOf(t.era).label) + '</span>' + (fate !== 'here' ? '<span class="fu-link broken">history stripped going into ' + esc(Journey.eraOf(l.scene).label) + '</span>' : '<span class="fu-link ok">unedited</span>') + (signed ? '<span class="fu-link ok signed">signed by ' + esc(name()) + ' · 2030</span>' : '<span class="fu-link open">nobody vouches for it yet</span>');
      return '<li><b>' + esc(t.title) + '</b><div class="fu-chain">' + chain + '</div>' + (signed ? '' : '<button type="button" class="fu-btn" data-a="sign" data-id="' + t.id + '">sign it</button>') + '</li>';
    }).join('');
    h += sec('prov', 'who vouches for this?', '<p>' + COPY.provLead + '</p>' + (rows ? '<ul class="fu-prov">' + rows + '</ul><p class="fu-two"><b>gain:</b> a signed thing can be trusted without knowing how it was made. <b>asks:</b> only people who sign get believed, and a stripped history can’t be put back.</p>' : '<p class="fu-empty">you have nothing of your own yet. answer a question in any era, or make something in an aesthetic window, and it will show up here with its history.</p>') +
      '<div class="fu-chain"><b style="font-weight:400">a sample from the archive:</b> <span class="fu-link open">unsigned · nobody vouches for this</span></div>');
    // 5. the whimsy comes back, generated for one person
    const word = eggWord();
    h += sec('egg', 'something only you would get', word ? '<p>The little hidden things are back. This time one was made for you alone: i hid the word <i>from one of your answers</i> somewhere in this window.' + (f.egg ? ' <b>you found it: “' + esc(word) + '”.</b>' : '') + '</p>' : '<p>The little hidden things are back, and here they are made for one person. Answer a question in any era and i will hide something from it.</p>');
    h += '<p class="fu-next"><button type="button" class="fu-btn go" data-a="pq">after that ▸▸ the locks open</button></p>';
    // hide the egg word inside the lead of a random-but-stable section
    if (word && !f.egg) h = h.replace('Both are real gains.', 'Both are real gains. <button type="button" class="fu-eggw" data-a="egg" aria-label="a hidden word">' + esc(word) + '</button>');
    return h;
  }
  function eggWord() { const m = Journey.mine().filter((t) => t.kind === 'memory')[0]; if (!m) return ''; const ws = m.line.split(/\s+/).map((w) => w.replace(/[^\p{L}\p{N}'’-]/gu, '')).filter((w) => w.length > 3); return (ws.sort((a, b) => b.length - a.length)[0] || '').toLowerCase(); }
  // the agent's "draft": plain rules, no model. its words are marked so the visitor can see whose is whose.
  const TAILS = [' and i hope you are doing well.', ' — let me know what works for you.', ' and thank you again for everything.'];
  function draft() {
    const ta = $('#fuLine'), box = $('#fuDraft'); if (!ta || !box) return; const v = ta.value.trim(), d = dial();
    if (v.length < 6) { box.innerHTML = ''; return; }
    const words = v.split(/\s+/).length;
    if (d === 0) box.innerHTML = '<p class="fu-mine-w">' + esc(v) + '</p><small>100% yours. it did nothing, as asked.</small>';
    else if (d === 1) box.innerHTML = '<p class="fu-ask">mote asks: ' + esc(C.NOUS[v.length % C.NOUS.length]) + '</p><small>100% yours. it asked, and wrote nothing.</small>';
    else if (d === 2) { const t = TAILS[v.length % TAILS.length], tw = t.trim().split(/\s+/).length; box.innerHTML = '<p><span class="fu-mine-w">' + esc(v) + '</span><span class="fu-its-w">' + esc(t) + '</span></p><small>' + Math.round(100 * words / (words + tw)) + '% yours. <span class="fu-its-w">its words are marked</span>, and stay marked when you send it. <a href="#" data-a="strip">take its words out</a></small>'; }
    else box.innerHTML = '<p class="fu-its-w">Hi! Just following up on this. Let me know what works for you, and thanks again for everything.</p><small>0% yours. it kept your meaning, roughly. sent before you finished typing.</small>';
  }

  /* ================= STEP 2 · after the locks ================= */
  function harvested() {
    const j = J(), out = [];
    Object.keys(j.unlocked || {}).forEach((id) => { const t = Journey.byId(id); if (t) out.push({ id: 'gate-' + id, what: 'you agreed to be known as a name and a number, to open “' + t.title + '”' }); });
    Journey.mine().filter((t) => parseInt(t.era, 10) < 2024).forEach((t) => out.push({ id: 'mine-' + t.id, what: (t.kind === 'memory' ? 'what you answered in ' : 'what you made in ') + Journey.eraOf(t.era).label + ': “' + t.line + '”' }));
    if ((j.polish || {}).accepted) out.push({ id: 'polish', what: 'the sentence you let it rewrite in 2024, both versions' });
    if (!out.length) out.push({ id: 'default', what: COPY.harvestNone });
    return out.slice(0, 6);
  }
  function drawPQ() {
    const f = F(), H = harvested(), kept = Journey.carrying().map((id) => Journey.byId(id)).filter(Boolean)[0];
    const nSealed = H.filter((x) => f.sealed[x.id]).length;
    let h = '<div class="fu-hero pq' + (nSealed === H.length ? ' safe' : '') + '" aria-hidden="true"><div class="fu-lattice"></div><div class="fu-locks">' + [0, 1, 2, 3, 4].map((i) => '<span style="--i:' + i + '"><i class="shut">🔒</i><i class="open">🔓</i></span>').join('') + '</div><em>' + (nSealed === H.length ? 'everything of yours is under a new lock' : 'the day the old locks opened') + '</em></div><p class="fu-lead">' + COPY.pqLead + '</p>';
    h += sec('harvest', 'opened today', '<p>' + COPY.harvestLead + '</p><ul class="fu-env">' + H.map((x, i) => '<li class="' + (f.sealed[x.id] ? 'sealed' : 'open') + '" style="--i:' + i + '"><span class="fu-lock">' + (f.sealed[x.id] ? '🔒' : '🔓') + '</span><span>' + esc(x.what) + '</span>' + (f.sealed[x.id] ? '<small>re-sealed with a new lock</small>' : '<button type="button" class="fu-btn" data-a="seal" data-id="' + x.id + '">re-seal</button>') + '</li>').join('') + '</ul><p class="fu-two"><b>gain:</b> the new locks hold against the new machines. <b>asks:</b> ' + COPY.sealNote + '</p>');
    h += sec('note', 'a note that can’t be copied', '<p>' + COPY.noteLead + '</p>' +
      '<div class="fu-q"><b>from mote, for you</b>' + (f.moteRead ? '<p class="fu-gone">read once. it is gone now. that was the point.</p>' : '<button type="button" class="fu-qenv" data-a="read">✉️ <span>open it (once)</span></button> <button type="button" class="fu-btn" data-a="copy">copy it first</button>') + '<div id="fuQ" aria-live="polite"></div></div>' +
      '<label class="fu-write">leave one for the next person at this computer<input id="fuNote" maxlength="80" value="' + esc(f.note || '') + '" placeholder="they can read it exactly once"></label><button type="button" class="fu-btn" data-a="leave">send it</button>' + (f.note && !f.noteRead ? ' <button type="button" class="fu-btn" data-a="readmine">be the next person</button>' : '') + (f.noteRead ? '<p class="fu-gone">your note was read. nobody can read it again, including you.</p>' : ''));
    h += sec('cat', 'the cat came back', '<p>' + COPY.catLead + '</p><div class="fu-cats' + (f.cat ? ' set' : '') + '"><button type="button" class="fu-cat" data-a="cat" aria-label="look at the first cat">' + catFace(f.cat) + '</button><svg aria-hidden="true" viewBox="0 0 200 30" preserveAspectRatio="none"><path d="M0 15 Q 12.5 0 25 15 T 50 15 T 75 15 T 100 15 T 125 15 T 150 15 T 175 15 T 200 15"/><path class="p2" d="M0 15 Q 12.5 30 25 15 T 50 15 T 75 15 T 100 15 T 125 15 T 150 15 T 175 15 T 200 15"/></svg><button type="button" class="fu-cat" data-a="cat" aria-label="look at the second cat">' + catFace(f.cat) + '</button></div><button type="button" class="fu-btn" data-a="uncat">look away</button>');
    h += sec('home', 'what comes home', '<p>Everything that was yours comes back whole, signed and dated.' + (kept ? ' You carried <b>' + esc(kept.title) + '</b> to the end.' : '') + '</p><button type="button" class="fu-btn go" data-a="home">take it home</button>');
    return h;
  }
  const catFace = (s) => s === 'awake' ? '=^o.o^=' : s === 'asleep' ? '=^-.-^= z' : '=^?.?^=';

  /* ---------------- events ---------------- */
  function onInput(e) {
    if (e.target.id === 'fuDial') { F().dial = +e.target.value; save(); const v = ($('#fuLine') || {}).value; draw(); const ta = $('#fuLine'); if (ta && v) { ta.value = v; draft(); } const d = $('#fuDial'); if (d) d.focus(); }
    else if (e.target.id === 'fuLine') draft();
  }
  function onClick(e) {
    const b = e.target.closest('[data-a]'); if (!b) return; e.preventDefault();
    const a = b.dataset.a, f = F(), id = b.dataset.id; let redraw = true, msg = '';
    if (a === 'other') f.other = !f.other;
    else if (a === 'go') { f.errands[id] = b.dataset.as; msg = b.dataset.as === 'me' ? 'it went as you.' : 'it went as itself.'; if (typeof logReceipt === 'function') logReceipt('agent errand: ' + id + ' (' + b.dataset.as + ')', 'done on your behalf'); }
    else if (a === 'undo') delete f.errands[id];
    else if (a === 'sign') { f.signed[id] = 1; msg = 'signed. from here on, it carries your name.'; }
    else if (a === 'egg') { f.egg = true; msg = COPY.eggSay; }
    else if (a === 'strip') { redraw = false; const box = $('#fuDraft'); box.innerHTML = '<p class="fu-mine-w">' + esc($('#fuLine').value.trim()) + '</p><small>100% yours again.</small>'; }
    else if (a === 'pq') { stage('pq'); return; }
    else if (a === 'seal') { f.sealed[id] = 1; msg = COPY.sealNote; }
    else if (a === 'read') { redraw = false; f.moteRead = true; save(); const kept = Journey.carrying().map((i) => Journey.byId(i)).filter(Boolean)[0]; const q = $('#fuQ'); q.innerHTML = '<p class="fu-qmsg">' + esc(COPY.moteNote(kept && kept.title)) + '</p>'; b.parentNode.querySelectorAll('button').forEach((x) => x.remove()); setTimeout(() => { if ($('#fuQ')) draw(); }, 9000); }
    else if (a === 'copy') { redraw = false; $('#fuQ').innerHTML = '<p class="fu-qmsg scr">y̶o̶u̶ ?¿ c̷a̷r̷ ░▒▓ ¿? a̶l̶l̶</p><small>it can’t be copied. looking at it is using it. the copy is noise, and the note is still unread.</small>'; }
    else if (a === 'leave') { const v = ($('#fuNote').value || '').trim(); if (v) { f.note = v.slice(0, 80); f.noteRead = false; msg = 'sent. it can be read once.'; } }
    else if (a === 'readmine') { redraw = false; const t = f.note; f.noteRead = true; f.note = ''; save(); say('“' + t + '”  (that was the only reading.)'); setTimeout(draw, 6000); }
    else if (a === 'cat') { if (!f.cat) f.cat = Math.random() < .5 ? 'awake' : 'asleep'; msg = 'both ' + f.cat + '. you only looked at one.'; }
    else if (a === 'uncat') { f.cat = null; msg = 'unlooked. they are undecided again.'; }
    else if (a === 'home') { Journey.open('yours'); return; }
    save(); if (redraw) { draw(); if (msg) say(msg); }
  }

  /* ---------------- wiring ---------------- */
  function init() {
    build();
    const prev = window.setEra;
    window.setEra = function () { const r = prev.apply(this, arguments); if (!stage.keep) document.body.classList.remove('pq'); sync(); return r; };
    sync();
  }
  window.Future = { open, stage, inputs, dial, state: F, harvested, isPQ };
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
