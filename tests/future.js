// node tests/future.js — 0.8: the two speculative steps are built from what the visitor did in the archive
const { chromium } = require('playwright'); const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '../index.html') + '#quick';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.route(/fonts\.g/, (r) => r.abort());
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload();
  // a visitor with a history: kept things, an answer, a made thing (lost), a gate agreed to, refused the 2024 rewrite twice
  await p.evaluate(() => {
    Journey.begin(); const s = Journey.state();
    ['1993', '1999', '2006', '2010', '2024'].forEach((a) => { s.passed[a] = true; });
    s.kept['2024'] = ['T-1996-guest', 'T-2004-blog', 'T-2010-forum']; s.lost['T-2016-feed'] = { fate: 'gone', scene: '2024', reason: '' };
    s.polish = { shown: 2, accepted: 0, refused: 2 }; s.unlocked['T-1999-mail'] = 1; s.name = 'isa';
    Journey.answer('1996', 'we faxed my report card to my grandmother');
    Journey.made(ThirdSpaceNext.cultures.find((c) => c.id === 'indieweb'), 'publish', 'published a page about my cat');
    s.lost['Y-made-indieweb'] = { fate: 'displaced', scene: '2010', reason: '' };
    setEra('2016');
  });
  ok(await p.evaluate(() => document.getElementById('fuBtn').hidden && !Future.isPQ()), 'nothing of the future shows before 2030');
  await p.evaluate(() => setEra('2030')); await p.evaluate(() => Future.open());
  let t = await p.textContent('#fuMain');
  ok(/assembled for isa/.test(t) && /a guestbook/.test(t) && /a forum thread/.test(t), 'step 1: the screen is assembled from what they carried');
  ok(await p.evaluate(() => Future.dial() === 1) && /kept your own words 2 times/.test(t), 'the dial starts from what they did in 2024 (refused: it asks)');
  await p.fill('#fuLine', 'i wanted to say thank you');
  ok(/mote asks/.test(await p.textContent('#fuDraft')), 'at "asks me first" it asks and writes nothing');
  await p.evaluate(() => { const d = document.getElementById('fuDial'); d.value = 2; d.dispatchEvent(new Event('input', { bubbles: true })); });
  ok(await p.inputValue('#fuLine') === 'i wanted to say thank you' && await p.$('#fuDraft .fu-its-w') !== null && /% yours/.test(await p.textContent('#fuDraft')), 'at "drafts" its words are marked and counted; theirs are untouched');
  await p.click('#fu-errands [data-as=agent]');
  ok(/tell them to come themselves/.test(await p.textContent('#fu-errands')), 'an errand run as an agent says so, and the place answers');
  t = await p.textContent('#fu-prov');
  ok(/history stripped going into 2010/.test(t) && /nobody vouches/.test(t), 'provenance shows the broken chain of a thing they lost');
  await p.click('#fu-prov [data-a=sign]'); ok(/signed by isa/.test(await p.textContent('#fu-prov')), 'signing adds their name from 2030 on');
  ok(await p.$('.fu-eggw') !== null && (await p.textContent('.fu-eggw')) === 'grandmother', 'a hidden word is made from their own answer');
  await p.click('.fu-eggw'); ok(await p.evaluate(() => Future.state().egg === true), 'finding it is remembered');
  // step 2
  await p.click('[data-a=pq]');
  ok(await p.evaluate(() => Future.isPQ() && document.getElementById('fuStage').classList.contains('active')), 'step 2 is its own place on the era bar');
  t = await p.textContent('#fu-harvest');
  ok(/name and a number/.test(t) && /report card/.test(t), 'the old locks open on what they actually sent (the 1999 gate, their 1996 answer)');
  await p.click('#fu-harvest [data-a=seal]'); ok(/re-sealed/.test(await p.textContent('#fu-harvest')) && /stays read/.test(await p.textContent('#fuMain')), 're-sealing works and is honest about what was already read');
  await p.click('[data-a=copy]'); ok(/can.t be copied/.test(await p.textContent('#fuQ')) && await p.evaluate(() => !Future.state().moteRead), 'copying the note fails and leaves it unread');
  await p.click('[data-a=read]'); ok(/a guestbook/.test(await p.textContent('#fuQ')) && await p.evaluate(() => Future.state().moteRead), 'mote’s note names what they carried, and can be read once');
  await p.click('.fu-cat'); ok(await p.evaluate(() => { const c = document.querySelectorAll('.fu-cat'); return c[0].textContent === c[1].textContent && !/\?/.test(c[0].textContent); }), 'the entangled cats settle together');
  await p.click('[data-a=home]'); ok(/2030 hands it back/.test(await p.textContent('#jyMain')), 'the ending is the "yours" tab');
  await p.evaluate(() => setEra('2010')); ok(await p.evaluate(() => !document.body.classList.contains('pq') && document.getElementById('fuBtn').hidden), 'leaving 2030 leaves the future');
  // an empty history still works
  await p.evaluate(() => { Journey.reset(); setEra('2030'); Future.stage('pq'); Future.stage('ai'); Future.open(); });
  ok(/nothing carried/.test(await p.textContent('#fuMain')), 'a visitor with no history still gets a working future');
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => Future.open());
  ok(await p.evaluate(() => { const m = document.getElementById('fuMain'); m.scrollLeft = 999; const o = m.scrollLeft; m.scrollLeft = 0; return o === 0; }), 'no sideways scrolling on a phone');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
