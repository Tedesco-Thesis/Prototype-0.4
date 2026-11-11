/* =====================================================================
   eras.js — ALL the wording for the 0.7 journey layer. Edit here; nothing else holds copy.

   EVERYTHING IN THIS FILE IS A STAND-IN. Wording, "context" lines and profiles are drafts for Isabella to
   rewrite. No line is a quote from a real person. Facts about the web (dates, products) are general and
   should be checked against sources before they go in the written portion (see the Doc, "what to verify").

   SHAPE
   CFG                 two switches for the open decisions (going back, how many to keep)
   ARRIVAL             the disclosure + storyline shown once, before the first scene
   THINGS[eraKey]      2-4 explorable things per era: { id, title, kind, theme, line, ctx, poke:[button, result] }
   SCENES[eraKey]      the five transitions: { title, intro, why, fates:[...], reason, mote:[before, after] }
   FATES               what each kind of loss means, in plain words
   PROFILES            stand-in interviewee profiles, each with three links to things
   THEMES              the five plain categories a "system" can read from your choices
   NOUS                questions the 2030 guide asks instead of suggesting
   ===================================================================== */
(function () {
  'use strict';

  const CFG = {
    keep: 3,               // how many things you may keep at each transition
    perTransition: true,   // true: choose again at every transition. false: one budget of three for the whole journey
    allowBack: true,       // true: the era bar is free; going back to a lost thing finds a record, never the thing
    anchors: ['1993', '1999', '2006', '2010', '2024'],
    opaqueFrom: 2024,      // from this year the reason a thing is gone is no longer shown
  };

  const ARRIVAL = {
    title: 'before you start',
    story: [
      'This is one shared family computer. Every year on the bar is a profile someone left logged in.',
      'As you move forward the computer is tuned for efficiency, prediction and money. You can pick things up in every era and read what they were.',
      'Five times, the computer moves on and you can only bring three things with you. Everything else is kept the way that era would keep it, or isn’t.',
    ],
    notes: [
      'What it keeps, shown to you at the end: the three things you choose each time, how long you took to choose, and a line you may write about why.',
      'It stays in this browser. Nothing is sent anywhere, and there is no account.',
      'The systems in this prototype are simulations of how platforms behave, and they say so. The people and wording are placeholders.',
      'You can look around without the journey, read what it kept at any time, export it, or erase it.',
    ],
    mote: [
      'hi. i\u2019m mote. i live in this computer.',
      'it\u2019s going to change a lot. every time it does, i can carry three things for you. you choose which.',
    ],
    sticky: 'this computer keeps:',
    begin: 'start the journey',
    free: 'just look around (no choosing)',
  };

  const THEMES = {
    making: 'making things',
    belonging: 'belonging to a group',
    play: 'play',
    keeping: 'keeping and collecting',
    voice: 'saying something in your own words',
  };

  /* ---------------- things: every era, each explorable ---------------- */
  const THINGS = {
    '1991': [
      { id: 'T-1991-first', title: 'the first page', kind: 'page', theme: 'making',
        line: 'a page explaining the web, written on the web.',
        ctx: 'The first web page described the project itself and how to use it. It had no images, no ads, and its author was the reader’s neighbour in the same building.',
        poke: ['follow a link', 'the link goes where its writer pointed it. nobody is told you followed it.'] },
      { id: 'T-1991-phone', title: 'a phone list', kind: 'directory', theme: 'keeping',
        line: 'a lab’s phone list, as linked text.',
        ctx: 'One of the first uses was ordinary: a phone directory anyone at the lab could search and link to. Useful first, grand later.',
        poke: ['look someone up', 'you find a name and a number. the list does not rank anyone.'] },
      { id: 'T-1991-editor', title: 'a browser that was also an editor', kind: 'tool', theme: 'making',
        line: 'reading and writing were one window.',
        ctx: 'The first browser could also edit pages. Later browsers mostly dropped that, and reading and writing became separate acts.',
        poke: ['change a word', 'you change a word on the page. it is yours to change. nothing asks if you are sure.'] },
      { id: 'T-1991-link', title: 'a link', kind: 'idea', theme: 'belonging',
        line: 'a promise from one document to another.',
        ctx: 'A link is made by whoever wrote the first document, to a second one they chose. There was no ranking of links yet.',
        poke: ['follow it', 'it takes you exactly where it says. the page you left does not know you left.'] },
    ],
    '1993': [
      { id: 'T-1993-pd', title: 'the public-domain notice', kind: 'document', theme: 'belonging',
        line: 'the code is given to everyone, for good.',
        ctx: 'In April 1993 the web’s code was released into the public domain. Anyone could build a browser or a server without asking or paying.',
        poke: ['read the notice', 'it is a few lines. it says anyone may use it. that is the whole thing.'] },
      { id: 'T-1993-hotlist', title: 'a hotlist', kind: 'list', theme: 'keeping',
        line: 'your list of places, on your machine.',
        ctx: 'Early browsers let you keep a list of favourite pages in a file on your own computer. It was yours, with no one ordering it.',
        poke: ['add a page', 'it joins the bottom of the list. the order is yours.'] },
      { id: 'T-1993-new', title: 'a “what’s new” list', kind: 'list', theme: 'belonging',
        line: 'a hand-kept list of new sites.',
        ctx: 'People kept lists of new sites by hand and sent in their own. A person decided what was on it, and you could write to them.',
        poke: ['submit a site', 'someone will read it. there is no queue score and no algorithm. only a person.'] },
    ],
    '1996': [
      { id: 'T-1996-guest', title: 'a guestbook', kind: 'page', theme: 'voice',
        line: 'visitors sign their names at the bottom.',
        ctx: 'Home pages often ended with a guestbook. Strangers wrote a line, the owner read them, and they stayed on the page.',
        poke: ['sign it', 'your line is added at the bottom with the date. you can write anything.'] },
      { id: 'T-1996-ring', title: 'a webring', kind: 'links', theme: 'belonging',
        line: 'pages that point to each other in a circle.',
        ctx: 'A webring linked small sites on the same theme. You could travel the ring and meet each owner’s page in turn.',
        poke: ['next site in the ring', 'you land on the next page in the ring. a person chose that neighbour.'] },
      { id: 'T-1996-uc', title: 'an “under construction” sign', kind: 'page', theme: 'making',
        line: 'a page that says it is not finished.',
        ctx: 'Pages announced they were unfinished and left them that way for years. Being unfinished was allowed.',
        poke: ['see what’s behind it', 'nothing is behind it. that is fine here.'] },
    ],
    '1999': [
      { id: 'T-1999-portal', title: 'a portal homepage', kind: 'page', theme: 'belonging',
        line: 'one page that wants to be your front door.',
        ctx: 'Portals bundled news, search, mail and weather into one page, hoping you would never leave. Your homepage became a business goal.',
        poke: ['make it my homepage', 'the page asks. you can say no, and for now it still works.'] },
      { id: 'T-1999-banner', title: 'a banner ad', kind: 'ad', theme: 'play',
        line: 'a rectangle that blinks at you.',
        ctx: 'Banner ads made attention something that could be counted and sold. Click-through rates became the first online metric most people met.',
        poke: ['click it', 'it counts the click. you did not agree to be counted, but it is counting.'] },
      { id: 'T-1999-mail', title: 'a free email signup', kind: 'form', theme: 'voice',
        line: 'free, if you make an account.',
        ctx: 'Free web mail asked for a name, a birth date and a password. It was one of the first times an account was the price of entry.',
        poke: ['read the form', 'it asks for six things. only two are needed for it to work.'] },
    ],
    '2004': [
      { id: 'T-2004-blog', title: 'a blog with comments', kind: 'page', theme: 'voice',
        line: 'posts, newest first, with replies underneath.',
        ctx: 'Blogs made publishing easy and put the newest post first. Comments let a reader answer the author, in public.',
        poke: ['leave a comment', 'your comment appears under the post, with your name if you choose one.'] },
      { id: 'T-2004-tags', title: 'a tag cloud', kind: 'list', theme: 'keeping',
        line: 'words people chose for the things they saved.',
        ctx: 'Tagging let people label things with their own words. The labels were messy and personal, and that was the point.',
        poke: ['click a tag', 'you see what other people filed under that word. nobody ranked them.'] },
      { id: 'T-2004-rss', title: 'an RSS feed', kind: 'feed', theme: 'making',
        line: 'you choose whose posts to read, in the order they were written.',
        ctx: 'A feed reader collected the sites you chose, in order, with no ranking added. You decided who was in it.',
        poke: ['subscribe', 'it adds the site to your reader. you can leave whenever. it does not notice.'] },
    ],
    '2006': [
      { id: 'T-2006-profile', title: 'a decorated profile', kind: 'page', theme: 'making',
        line: 'a profile page you could paste code into.',
        ctx: 'Social profiles in the mid-2000s could be restyled by hand: backgrounds, music, glitter. They were messy, personal and sometimes unreadable.',
        poke: ['change the background', 'it changes. nobody asks if it matches a template.'] },
      { id: 'T-2006-top8', title: 'a top eight', kind: 'list', theme: 'belonging',
        line: 'friends, ranked, in public.',
        ctx: 'Some profiles asked you to rank your friends in public. It made a quiet social fact visible, and sometimes painful.',
        poke: ['move someone down', 'they move down. they will be able to tell.'] },
      { id: 'T-2006-video', title: 'a first video upload', kind: 'video', theme: 'play',
        line: 'a short clip, shared with anyone.',
        ctx: 'Easy video sharing arrived around 2005. Ordinary people could publish moving pictures to strangers for the first time.',
        poke: ['press play', 'it plays. there is no “up next” yet.'] },
    ],
    '2008': [
      { id: 'T-2008-like', title: 'the like button', kind: 'control', theme: 'voice',
        line: 'a thumb, instead of a sentence.',
        ctx: 'The like button (2009 on the biggest network) made a reaction cost one click. Easier to give than a comment, and easier to count.',
        poke: ['press like', 'it adds one to a number. the person who wrote it sees a count, not your words.'] },
      { id: 'T-2008-status', title: 'a status box', kind: 'form', theme: 'voice',
        line: '“what’s on your mind?”',
        ctx: 'A single box asked everyone the same question all the time. Writing became something frequent, short and prompted.',
        poke: ['type something', 'the box accepts it and shows it to everyone you know, in a stream.'] },
      { id: 'T-2008-apps', title: 'an app grid', kind: 'tool', theme: 'play',
        line: 'a screen of small programs from a store.',
        ctx: 'Phone app stores arrived in 2008. Software became something chosen from a shelf run by the shelf’s owner.',
        poke: ['open one', 'it opens full screen. the rest of the web is somewhere else now.'] },
    ],
    '2010': [
      { id: 'T-2010-forum', title: 'a forum thread', kind: 'forum', theme: 'belonging',
        line: 'a long conversation among regulars.',
        ctx: 'Forums grouped people around a topic, with a thread you could follow for years. Regulars knew each other, and rules were set by moderators you could name.',
        poke: ['read the thread', 'it goes on for pages. the same people reply. it is slow, and it holds together.'] },
      { id: 'T-2010-photo', title: 'a filtered photo', kind: 'photo', theme: 'play',
        line: 'one tap, and it looks like a memory.',
        ctx: 'Photo apps added filters and a square crop. Sharing a picture got easier, and the look of everything started to match.',
        poke: ['apply a filter', 'the photo changes in one tap. the original is somewhere you rarely look.'] },
      { id: 'T-2010-trend', title: 'a trending list', kind: 'list', theme: 'keeping',
        line: 'what everyone is looking at, right now.',
        ctx: 'Trending lists showed popularity as news. The question shifted from “what do you care about?” to “what is everyone looking at?”',
        poke: ['open the top one', 'it opens. it does not say why it is on top beyond “popular”.'] },
    ],
    '2014': [
      { id: 'T-2014-badge', title: 'a notification badge', kind: 'control', theme: 'belonging',
        line: 'a red number that asks to be cleared.',
        ctx: 'Badges turned “something might be waiting” into a small itch. Clearing the number became its own task.',
        poke: ['clear it', 'it goes to zero. it comes back.'] },
      { id: 'T-2014-cookie', title: 'a cookie banner', kind: 'form', theme: 'keeping',
        line: 'a bar asking you to agree to be counted.',
        ctx: 'Rules in Europe led sites to ask permission to track. Most banners made the easy choice “accept” and the careful one a small maze.',
        poke: ['find “no”', 'it is behind a second screen and three toggles.'] },
      { id: 'T-2014-phone', title: 'a signup that wants your phone number', kind: 'form', theme: 'voice',
        line: 'to prove you’re real.',
        ctx: 'Signup flows began asking for a phone number, often with a reason like security. The number also worked as a permanent identifier.',
        poke: ['skip it', 'there is a “skip”, smaller and greyer than the button.'] },
    ],
    '2016': [
      { id: 'T-2016-feed', title: 'the ranked feed', kind: 'feed', theme: 'belonging',
        line: 'your friends, in an order you did not choose.',
        ctx: 'Major feeds switched from newest-first to ranked in 2016. What you saw depended on what the system predicted you would react to.',
        poke: ['scroll', 'there is more below. there is always more below.'] },
      { id: 'T-2016-auto', title: '“up next”', kind: 'video', theme: 'play',
        line: 'the next video starts in five seconds.',
        ctx: 'Autoplay removed the moment of deciding whether to keep watching. Stopping became the action that took effort.',
        poke: ['let it play', 'it plays. the next one is queued. nobody asked.'] },
      { id: 'T-2016-story', title: 'a story that vanishes', kind: 'photo', theme: 'making',
        line: 'a post that deletes itself in a day.',
        ctx: 'Stories made posts that disappear. It made posting feel lighter, and also made everything easier to lose.',
        poke: ['watch it', 'it plays once. in a day it will not be here. nobody keeps it for you.'] },
    ],
    '2024': [
      { id: 'T-2024-summary', title: 'an AI summary', kind: 'text', theme: 'voice',
        line: 'the article, shortened, above the article.',
        ctx: 'Summaries now sit in front of the thing they summarise. They are fast, and they flatten the author’s order, tone and hesitation.',
        poke: ['read the summary', 'it is clean and three sentences long. the author’s voice is not in it.'] },
      { id: 'T-2024-paywall', title: 'a paywall', kind: 'form', theme: 'keeping',
        line: 'you may read this if you subscribe.',
        ctx: 'A growing share of writing sits behind a plan. What you can find depends on what you pay, and often is not shown unless you pay.',
        poke: ['see the plans', 'three plans. none of them is the one that lets you read this one thing.'] },
      { id: 'T-2024-reply', title: 'a suggested reply', kind: 'control', theme: 'voice',
        line: 'three ready-made answers, one tap each.',
        ctx: 'Smart replies write the short answer for you. It is faster, and the sentence is no longer yours.',
        poke: ['tap one', 'it sends in your name. it sounds like everyone.'] },
    ],
    '2030': [
      { id: 'T-2030-catalog', title: 'your catalog', kind: 'record', theme: 'keeping',
        line: 'a list of what is yours, that you can read.',
        ctx: 'A speculative idea: a platform where your things sit in a catalog you can open, edit and take with you. Everything it holds is in plain words.',
        poke: ['open an entry', 'it shows who made it, where it lives, and how to take it back.'] },
      { id: 'T-2030-ask', title: 'a guide that asks', kind: 'tool', theme: 'voice',
        line: 'it asks a question and writes nothing for you.',
        ctx: 'A speculative idea: a helper that asks what you mean and leaves the writing to you. It is slower on purpose.',
        poke: ['answer it', 'your answer stays where you put it. the helper does not rewrite it.'] },
      { id: 'T-2030-return', title: 'a thing that comes back', kind: 'record', theme: 'making',
        line: 'something you let go of, found again.',
        ctx: 'A speculative idea: lost things leave a record you can read, with a reason that is true. Sometimes you can get the thing itself back.',
        poke: ['read the reason', 'the reason is written down: who decided, and when.'] },
    ],
  };

  /* ---------------- the five transitions ---------------- */
  const SCENES = {
    '1993': {
      slug: 'weather',
      mote: ['the server room flooded. nobody\u2019s fault. i can carry three things up the stairs. which ones?', 'that\u2019s it. no notice. no record of the record. just weather.'], title: 'the weather',
      intro: 'A server is wiped. A page nobody backed up is gone. Nobody did this on purpose. The weather changed.',
      why: 'Early loss was accidental and unrecorded. Nothing is left to say it was ever there.',
      fates: ['gone'],
      reason: 'the server was overwritten; no copy was kept',
    },
    '1999': {
      slug: 'trust',
      mote: ['the door wants a name and a password now. it will still let us in. some of us, some of the time.', 'it didn\u2019t delete anything. it just put a rope in front.'], title: 'trust',
      intro: 'To get to some things you now have to make an account. They are still here, but not for free.',
      why: 'Access became conditional on who you are willing to be known as. The thing is not deleted, only gated.',
      fates: ['gated', 'gone'],
      reason: 'it moved behind a sign-in; some were not moved',
    },
    '2006': {
      slug: 'pages',
      mote: ['everyone gets the same page now. it\u2019s cleaner. it\u2019s also smaller than what you made.', 'it kept your words. it threw away how you said them.'], title: 'pages',
      intro: 'Personal pages become profiles in a template. What is yours is the part that fits.',
      why: 'When a platform replaces a hand-made page with a template, the content survives and the form is flattened.',
      fates: ['degraded', 'gone'],
      reason: 'it did not fit the profile template',
    },
    '2010': {
      slug: 'feeds',
      mote: ['the forum is moving into the stream. the stream decides what goes on top.', 'your things are still in there somewhere. keep scrolling.'], title: 'forums into feeds',
      intro: 'The place where regulars gathered becomes a stream. Your things are still there, but they are shown the system’s way.',
      why: 'When conversations are moved into a ranked stream, the content is displaced by whatever the system would rather show.',
      fates: ['displaced', 'degraded'],
      reason: 'its place was taken by the stream',
    },
    '2024': {
      slug: 'writing',
      mote: ['it offers to write for you now. it is very fast. i\u2019m a little worried about that.', 'i asked it why some of it is missing. it didn\u2019t say.'], title: 'writing',
      intro: 'The system offers to write for you. What you wrote is kept as the system’s version, or not at all.',
      why: 'When a system drafts, summarises or rewrites, the original author is displaced. The reason for what is missing is no longer shown.',
      fates: ['displaced', 'gone', 'gated'],
      reason: '',   // from opaqueFrom on, no reason is shown
    },
  };

  const FATES = {
    here:      { label: 'kept', note: 'you brought this one with you.' },
    gone:      { label: 'gone', note: 'not kept. what is left is a record that it existed.' },
    degraded:  { label: 'flattened', note: 'kept, but only the part that fit. the formatting, images and order are gone.' },
    gated:     { label: 'gated', note: 'still exists, behind something you have to do or pay first.' },
    displaced: { label: 'displaced', note: 'something else is now shown where your thing was: the system’s version.' },
  };

  /* ---------------- stand-in interviewee profiles ---------------- */
  // Stand-ins only: composite, invented, no real details. Replace with consenting interviewees' own (named or not) words.
  const PROFILES = [
    { id: 'P-A', handle: 'stand-in A', note: 'for someone who built a home page and kept it up for years.',
      line: 'placeholder: wrote the page, signed the guestbook, kept it unfinished on purpose.', links: ['T-1996-guest', 'T-1996-uc', 'T-2006-profile'] },
    { id: 'P-B', handle: 'stand-in B', note: 'for someone who belonged to one forum for a long time.',
      line: 'placeholder: knew the regulars, followed the threads, watched the feed replace the forum.', links: ['T-2010-forum', 'T-1996-ring', 'T-2016-feed'] },
    { id: 'P-C', handle: 'stand-in C', note: 'for someone who writes slowly, and is offered shortcuts.',
      line: 'placeholder: writes drafts by hand, receives suggestions they didn’t ask for.', links: ['T-2004-blog', 'T-2024-reply', 'T-2030-ask'] },
    { id: 'P-D', handle: 'stand-in D', note: 'for someone who kept leaving platforms when they changed.',
      line: 'placeholder: keeps a list of places they’ve left, and why.', links: ['T-1993-hotlist', 'T-2014-cookie', 'T-2016-story'] },
  ];

  /* ---------------- 2030: a guide that asks ---------------- */
  const NOUS = [
    'who is this for, and what would you want them to feel?',
    'what in this is the part you least want to say, and should it stay unsaid?',
    'is there a word here you would only use with them?',
  ];

  // a tiny, honest "suggestion" rule set used in 2024 (displaced writing). Plain rules, no model. Shown in the UI.
  const POLISH = [
    [/\b(i think|maybe|perhaps|sort of|kind of|i guess|just)\b\s*/gi, ''],
    [/\b(sorry|apologies)\b[,.]?\s*/gi, ''],
    [/\s{2,}/g, ' '],
  ];

  window.TS_CONTENT = { CFG, ARRIVAL, THEMES, THINGS, SCENES, FATES, PROFILES, NOUS, POLISH };
})();
