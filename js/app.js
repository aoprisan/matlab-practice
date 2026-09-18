/* Aplicația: rutare, pagini, teste, fișe, exerciții, progres. Totul rulează local, fără server. */
(function () {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = window.esc;
  const main = $('#main');
  const LABS = window.LABS.slice().sort((a, b) => a.id - b.id);
  const labById = id => LABS.find(l => l.id === Number(id));

  // ---------- Progres (localStorage) ----------
  const KEY = 'matlab-practice.v1';
  let store;
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { store = {}; }
  store.quiz = store.quiz || {}; store.cards = store.cards || {}; store.ex = store.ex || {}; store.exam = store.exam || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* mod privat: progresul nu se salvează */ } }
  function labProgress(lab) {
    const q = store.quiz[lab.id] ? store.quiz[lab.id].best : 0;
    const known = (store.cards[lab.id] && store.cards[lab.id].known) || [];
    const cardPct = lab.cards.length ? Math.round(100 * known.filter(i => i < lab.cards.length).length / lab.cards.length) : 0;
    const done = store.ex[lab.id] || [];
    const exPct = lab.exercises.length ? Math.round(100 * done.filter(i => i < lab.exercises.length).length / lab.exercises.length) : 0;
    return { quiz: q, cards: cardPct, ex: exPct, total: Math.round((q + cardPct + exPct) / 3) };
  }
  const dotClass = pct => pct >= 90 ? 'p3' : pct >= 50 ? 'p2' : pct > 0 ? 'p1' : '';

  // ---------- Rail ----------
  function renderRail(active) {
    $('#labnav').innerHTML = LABS.map(l => {
      const p = labProgress(l).total;
      return `<a href="#/lab/${l.id}/learn" class="${active === 'lab' + l.id ? 'active' : ''}" title="${esc(l.title)}"><span class="num">${l.id}</span><span class="lt">${esc(l.title)}</span><span class="dot ${dotClass(p)}" title="${p}%"></span></a>`;
    }).join('');
    document.querySelectorAll('.rail-link').forEach(a => a.classList.toggle('active', a.dataset.route === active));
  }

  // ---------- Utilitare de randare ----------
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function ring(pct) {
    const r = 18, C = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 44 44" aria-label="${pct}% completat"><circle class="bg" cx="22" cy="22" r="${r}"/><circle class="fg" cx="22" cy="22" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/><text x="22" y="22" text-anchor="middle" dominant-baseline="central">${pct}</text></svg>`;
  }
  /* transformă <pre class="ml"> în blocuri rulabile */
  function enhanceCode(root) {
    root.querySelectorAll('pre.ml').forEach(pre => {
      const raw = pre.textContent;
      const lines = raw.split('\n');
      const isStatic = pre.classList.contains('static');
      const cmds = [];
      const html = lines.map(line => {
        if (line.startsWith('>> ')) { cmds.push(line.slice(3)); return '<span class="pr">&gt;&gt; </span>' + esc(line.slice(3)); }
        if (line === '>>') { return '<span class="pr">&gt;&gt;</span>'; }
        if (line.startsWith('.. ')) { cmds.push(line.slice(3)); return '   ' + esc(line.slice(3)); }
        if (line.startsWith('%% ')) { cmds.push(line.slice(3)); return null; }
        if (line.startsWith('% ')) return '<span class="cm">' + esc(line) + '</span>';
        return '<span class="cm">' + esc(line) + '</span>';
      }).filter(l => l !== null).join('\n');
      const wrap = document.createElement('div');
      wrap.className = 'ml-block' + (isStatic ? ' ml-static' : '');
      const code = cmds.join('\n');
      const runnable = !isStatic && cmds.length > 0;
      wrap.innerHTML = (runnable ? `<div class="bar"><span>MATLAB</span><span><button type="button" data-act="console" title="Deschide în consola lucrării">În consolă</button> <button type="button" data-act="run">Rulează</button></span></div>` : '') +
        `<pre>${html}</pre>` + (runnable ? '<div class="out"></div>' : '');
      wrap.dataset.code = code;
      pre.replaceWith(wrap);
    });
    root.addEventListener('click', e => {
      const b = e.target.closest('button[data-act]'); if (!b) return;
      const block = b.closest('.ml-block'); if (!block) return;
      if (b.dataset.act === 'run') MiniConsole.runInline(block, block.dataset.code);
      if (b.dataset.act === 'console') { const lab = root.dataset.lab; pendingConsoleCode = block.dataset.code; location.hash = lab ? `#/lab/${lab}/console` : '#/console'; }
    });
  }
  let pendingConsoleCode = null;

  // ---------- Pagini ----------
  function pageDashboard() {
    renderRail('home');
    const next = LABS.find(l => labProgress(l).total < 90) || LABS[0];
    main.innerHTML = `
      <section class="hero">
        <div>
          <h1>Practică MATLAB, lucrare cu lucrare</h1>
          <p class="lead">Cele 12 lucrări de laborator, transformate în lecții scurte, fișe de memorat, teste cu feedback imediat și exerciții pe care le poți verifica pe loc.</p>
          <p class="hint">Consola de alături rulează în browser un subset de MATLAB. Încearcă <code>5+3</code>, <code>A=[1 2 3;3 2 1]</code>, <code>x=0:0.1:2*pi; plot(x,sin(x),'-xr')</code> sau <code>help diag</code>.</p>
          <p><a class="btn primary" href="#/lab/${next.id}/learn">Continuă cu Lucrarea ${next.id}: ${esc(next.title)}</a></p>
        </div>
        <div><div id="home-console"></div></div>
      </section>
      <h2>Lucrările</h2>
      <div class="labgrid">
        ${LABS.map(l => { const p = labProgress(l); return `<a class="labcard" href="#/lab/${l.id}/learn"><span class="num">Lucrarea ${l.id}</span><span class="lt">${esc(l.title)}</span><span class="meta">${l.quiz.length} întrebări, ${l.cards.length} fișe, ${l.exercises.length} exerciții</span>${ring(p.total)}</a>`; }).join('')}
      </div>`;
    new MiniConsole.Console($('#home-console'), {});
  }

  function labHeader(lab, tab) {
    const p = labProgress(lab);
    const tabs = [['learn', 'Învață'], ['cards', 'Fișe', `${lab.cards.length}`], ['quiz', 'Test', `${lab.quiz.length}`], ['exercises', 'Exerciții', `${lab.exercises.length}`], ['console', 'Consolă']];
    return `<header class="pagehead"><div class="kicker">Lucrarea ${lab.id} din 12 · ${p.total}% completat</div><h1>${esc(lab.title)}</h1><p class="lead">${lab.blurb}</p></header>
      <nav class="tabs">${tabs.map(([k, name, cnt]) => `<a href="#/lab/${lab.id}/${k}" class="${tab === k ? 'active' : ''}">${name}${cnt ? `<span class="count">${cnt}</span>` : ''}</a>`).join('')}</nav>`;
  }

  function pageLearn(lab) {
    main.innerHTML = labHeader(lab, 'learn') + `<div class="lesson" data-lab="${lab.id}">${lab.sections.map(s => `<h2>${s.h}</h2>${s.html}`).join('')}
      ${lab.cheat && lab.cheat.length ? `<h2>Pe scurt</h2><div class="cheat">${lab.cheat.map(([k, v]) => `<div><code>${esc(k)}</code><span>${v}</span></div>`).join('')}</div>` : ''}
      <p style="margin-top:2rem"><a class="btn primary" href="#/lab/${lab.id}/cards">Continuă cu fișele</a> <a class="btn" href="#/lab/${lab.id}/quiz">Sari la test</a></p></div>`;
    enhanceCode($('.lesson'));
  }

  function pageCards(lab) {
    const st = store.cards[lab.id] = store.cards[lab.id] || { known: [] };
    let queue = lab.cards.map((_, i) => i).filter(i => !st.known.includes(i));
    let again = [];
    let idx = 0, flipped = false;
    const wrap = document.createElement('div'); wrap.className = 'cards-wrap';
    main.innerHTML = labHeader(lab, 'cards'); main.appendChild(wrap);
    function draw() {
      const known = st.known.filter(i => i < lab.cards.length).length;
      if (!queue.length) {
        wrap.innerHTML = `<div class="card-stat"><span>Știute: <b>${known}</b> din ${lab.cards.length}</span></div>
          <div class="card-done"><h3>${known === lab.cards.length ? 'Toate fișele sunt bifate ca știute.' : 'Ai trecut prin toate fișele din această rundă.'}</h3>
          <p>${again.length ? `${again.length} fișe marcate „mai repet”.` : ''}</p>
          <div class="card-actions" style="justify-content:center">${again.length ? '<button class="btn primary" data-act="again">Repetă fișele marcate</button>' : ''}<button class="btn" data-act="reset">Reia toate fișele</button><a class="btn" href="#/lab/${lab.id}/quiz">Mergi la test</a></div></div>`;
        return;
      }
      const i = queue[idx]; const card = lab.cards[i];
      wrap.innerHTML = `<div class="card-stat"><span>Fișa <b>${idx + 1}</b> din ${queue.length}</span><span>Știute: <b>${known}</b>/${lab.cards.length}</span><span style="color:var(--ink-3)">Click pe fișă sau Space ca să o întorci</span></div>
        <div class="flashcard ${flipped ? 'flipped' : ''}" tabindex="0" role="button" aria-label="Fișă; apasă pentru a întoarce"><div class="inner">
          <div class="face front"><span class="side">întrebare</span><div class="body">${card.q}</div></div>
          <div class="face back"><span class="side">răspuns</span><div class="body">${card.a}</div></div></div></div>
        <div class="card-actions"><button class="btn bad" data-act="again" ${flipped ? '' : 'disabled'}>Mai repet</button><button class="btn ok" data-act="know" ${flipped ? '' : 'disabled'}>Știu</button><span class="spacer"></span><button class="btn quiet" data-act="skip">Sari</button></div>`;
      wrap.querySelector('.flashcard').focus({ preventScroll: true });
    }
    wrap.addEventListener('click', e => {
      const fc = e.target.closest('.flashcard');
      if (fc && !e.target.closest('button')) { flipped = !flipped; fc.classList.toggle('flipped', flipped); wrap.querySelectorAll('.card-actions button[data-act=know], .card-actions button[data-act=again]').forEach(b => b.disabled = !flipped); return; }
      const b = e.target.closest('button[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (!queue.length) {
        if (act === 'again') { queue = again; again = []; idx = 0; flipped = false; draw(); }
        if (act === 'reset') { st.known = []; save(); queue = lab.cards.map((_, i) => i); again = []; idx = 0; flipped = false; draw(); renderRail('lab' + lab.id); }
        return;
      }
      const i = queue[idx];
      if (act === 'know') { if (!st.known.includes(i)) st.known.push(i); save(); renderRail('lab' + lab.id); queue.splice(idx, 1); flipped = false; if (idx >= queue.length) idx = 0; draw(); }
      else if (act === 'again') { again.push(i); queue.splice(idx, 1); flipped = false; if (idx >= queue.length) idx = 0; draw(); }
      else if (act === 'skip') { idx = (idx + 1) % queue.length; flipped = false; draw(); }
    });
    wrap.addEventListener('keydown', e => {
      if (e.target.closest('.flashcard') && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); e.target.closest('.flashcard').click(); }
    });
    draw();
  }

  // ---------- Test ----------
  const norm = s => String(s).toLowerCase().replace(/\s+/g, '').replace(/[’‘`´]/g, "'").replace(/;$/, '');
  function runQuiz(container, questions, { title, onFinish, showLab }) {
    let i = 0, correct = 0; const results = [];
    const qs = questions.map(q => q.type === 'mc' ? Object.assign({}, q, { opts: shuffle(q.options.map((o, k) => ({ o, ok: k === q.answer }))) }) : q);
    function draw() {
      if (i >= qs.length) { finish(); return; }
      const q = qs[i];
      let body = '';
      if (q.type === 'mc') body = `<div class="options">${q.opts.map((o, k) => `<button type="button" class="opt" data-k="${k}"><span class="key">${'abcd'[k]})</span><span>${o.o}</span></button>`).join('')}</div>`;
      else if (q.type === 'tf') body = `<div class="options"><button type="button" class="opt" data-tf="1"><span class="key">A)</span><span>Adevărat</span></button><button type="button" class="opt" data-tf="0"><span class="key">F)</span><span>Fals</span></button></div>`;
      else body = `<form class="fill"><input type="text" autocomplete="off" spellcheck="false" placeholder="${esc(q.placeholder || 'scrie răspunsul')}" aria-label="Răspuns"><button class="btn primary" type="submit">Verifică</button></form>`;
      container.innerHTML = `<div class="quiz-meta"><span>${title}</span><span>${i + 1} / ${qs.length}</span></div><div class="quiz-progress"><div style="width:${100 * i / qs.length}%"></div></div>
        <div class="question"><div class="qtext">${showLab && q.labId ? `<span style="font-family:var(--mono);font-size:0.8rem;color:var(--ink-3)">Lucrarea ${q.labId} · </span>` : ''}${q.q}</div>${body}<div class="fb"></div><div class="quiz-nav"></div></div>`;
      const inp = container.querySelector('input'); if (inp) inp.focus();
    }
    function answered(ok, explainHtml, extra) {
      const q = qs[i];
      if (ok) correct++;
      results.push({ q, ok });
      container.querySelectorAll('.opt').forEach(b => b.disabled = true);
      const fb = container.querySelector('.fb');
      fb.innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Corect.' : 'Nu chiar.'}</b>${extra || ''}${q.explain || ''}</div>`;
      container.querySelector('.quiz-nav').innerHTML = `<button type="button" class="btn primary" data-act="next">${i + 1 < qs.length ? 'Următoarea' : 'Vezi rezultatul'}</button>`;
      container.querySelector('[data-act=next]').focus();
    }
    container.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const q = qs[i];
      if (b.dataset.act === 'next') { i++; draw(); return; }
      if (b.dataset.act === 'retry') { i = 0; correct = 0; results.length = 0; qs.forEach(q => { if (q.type === 'mc') q.opts = shuffle(q.opts); }); draw(); return; }
      if (b.classList.contains('opt') && !b.disabled) {
        if (q.type === 'mc') {
          const k = +b.dataset.k; const ok = q.opts[k].ok;
          container.querySelectorAll('.opt').forEach((o, j) => { if (q.opts[j].ok) o.classList.add('correct'); else if (j === k) o.classList.add('wrong'); if (j === k) o.classList.add('chosen'); });
          answered(ok);
        } else if (q.type === 'tf') {
          const v = b.dataset.tf === '1'; const ok = v === q.answer;
          container.querySelectorAll('.opt').forEach(o => { if ((o.dataset.tf === '1') === q.answer) o.classList.add('correct'); else if (o === b) o.classList.add('wrong'); });
          answered(ok);
        }
      }
    });
    container.addEventListener('submit', e => {
      e.preventDefault();
      const q = qs[i]; if (q.type !== 'fill') return;
      const inp = container.querySelector('input'); if (inp.disabled) return;
      const val = inp.value.trim(); if (!val) return;
      const ok = q.answers.some(a => norm(a) === norm(val)) || (q.numeric !== undefined && Math.abs(parseFloat(val.replace(',', '.')) - q.numeric) <= (q.tol || 1e-3));
      inp.disabled = true; inp.classList.add(ok ? 'correct' : 'wrong'); container.querySelector('.fill button').disabled = true;
      answered(ok, null, ok ? '' : `<span>Răspuns așteptat: <code>${esc(q.answers[0])}</code>.</span> `);
    });
    function finish() {
      const pct = Math.round(100 * correct / qs.length);
      onFinish(pct);
      const wrong = results.filter(r => !r.ok);
      container.innerHTML = `<div class="result"><div class="msg">${title}</div><div class="score">${correct}<small> / ${qs.length}</small></div><div class="msg">${pct >= 90 ? 'Excelent. Stăpânești materia.' : pct >= 70 ? 'Bine. Mai revezi punctele de mai jos.' : pct >= 50 ? 'La limită. Recitește lecția și reia testul.' : 'Reia lecția și fișele, apoi încearcă din nou.'}</div>
        ${wrong.length ? `<h3>De revăzut</h3><ul>${wrong.map(r => `<li>${r.q.q.replace(/<pre[\s\S]*?<\/pre>/g, '[cod]')}</li>`).join('')}</ul>` : ''}
        <div class="card-actions" style="justify-content:center"><button type="button" class="btn primary" data-act="retry">Reia testul</button>${container.dataset.after || ''}</div></div>`;
    }
    draw();
  }
  function pageQuiz(lab) {
    main.innerHTML = labHeader(lab, 'quiz') + '<div class="quiz-wrap" id="quiz"></div>';
    const box = $('#quiz');
    const best = store.quiz[lab.id] ? store.quiz[lab.id].best : null;
    box.dataset.after = `<a class="btn" href="#/lab/${lab.id}/exercises">Mergi la exerciții</a>${lab.id < 12 ? `<a class="btn" href="#/lab/${lab.id + 1}/learn">Lucrarea ${lab.id + 1}</a>` : ''}`;
    runQuiz(box, lab.quiz, {
      title: `Test · Lucrarea ${lab.id}${best !== null ? ` · cel mai bun scor ${best}%` : ''}`,
      onFinish: pct => { const s = store.quiz[lab.id] = store.quiz[lab.id] || { best: 0, attempts: 0 }; s.attempts++; s.last = pct; s.best = Math.max(s.best, pct); save(); renderRail('lab' + lab.id); },
    });
  }
  function pageExam() {
    renderRail('exam');
    const pool = LABS.flatMap(l => l.quiz.map(q => Object.assign({ labId: l.id }, q)));
    const qs = shuffle(pool).slice(0, 25);
    const best = store.exam.best;
    main.innerHTML = `<header class="pagehead"><div class="kicker">Din toate cele 12 lucrări · 25 de întrebări alese la întâmplare</div><h1>Test general</h1><p class="lead">Amestec de întrebări din toate lucrările, ca la o verificare finală. ${best !== undefined ? `Cel mai bun scor: ${best}%.` : ''}</p></header><div class="quiz-wrap" id="quiz"></div>`;
    const box = $('#quiz'); box.dataset.after = '<a class="btn" href="#/progress">Vezi progresul</a>';
    runQuiz(box, qs, { title: 'Test general', showLab: true, onFinish: pct => { store.exam.attempts = (store.exam.attempts || 0) + 1; store.exam.best = Math.max(store.exam.best || 0, pct); store.exam.last = pct; save(); } });
  }

  // ---------- Exerciții ----------
  function pageExercises(lab) {
    const done = store.ex[lab.id] = store.ex[lab.id] || [];
    main.innerHTML = labHeader(lab, 'exercises') + `<div class="lesson" data-lab="${lab.id}" style="max-width:none"><p style="max-width:70ch;color:var(--ink-2)">Enunțurile din „Aplicații”. Rezolvă în consola lucrării, apoi verifică-ți variabilele sau compară cu soluția din manual. Bifează exercițiul când l-ai terminat.</p>
      ${lab.exercises.map((ex, i) => `<article class="exercise" data-i="${i}"><header><span class="num">${i + 1}.</span><h3>${ex.title}</h3>${done.includes(i) ? '<span class="done">✓ rezolvat</span>' : ''}</header>
        <div class="statement">${ex.statement}</div>
        <div class="tools">
          <button type="button" class="btn small" data-act="console">Deschide consola</button>
          ${ex.hint ? '<button type="button" class="btn small" data-act="hint">Indicație</button>' : ''}
          <button type="button" class="btn small" data-act="solution">Soluția</button>
          ${ex.check ? '<button type="button" class="btn small" data-act="check">Verifică variabilele</button>' : ''}
          <span style="flex:1"></span>
          <button type="button" class="btn small ${done.includes(i) ? 'ok' : ''}" data-act="done">${done.includes(i) ? 'Rezolvat' : 'Marchează rezolvat'}</button>
        </div>
        <div class="check-res"></div>
        ${ex.hint ? `<div class="reveal hint" hidden><h4>Indicație</h4>${ex.hint}</div>` : ''}
        <div class="reveal solution" hidden><h4>Soluție (din manual)</h4>${ex.solution}</div>
      </article>`).join('')}</div>`;
    const root = $('.lesson');
    enhanceCode(root);
    root.addEventListener('click', e => {
      const b = e.target.closest('button[data-act]'); if (!b) return;
      const art = b.closest('.exercise'); if (!art) return;
      const i = +art.dataset.i; const ex = lab.exercises[i];
      switch (b.dataset.act) {
        case 'hint': art.querySelector('.reveal.hint').hidden = !art.querySelector('.reveal.hint').hidden; break;
        case 'solution': art.querySelector('.reveal.solution').hidden = !art.querySelector('.reveal.solution').hidden; break;
        case 'console': pendingConsoleCode = ex.starter || ''; location.hash = `#/lab/${lab.id}/console`; break;
        case 'done': { const k = done.indexOf(i); if (k >= 0) done.splice(k, 1); else done.push(i); save(); renderRail('lab' + lab.id); pageExercises(lab); window.scrollTo(0, art.offsetTop - 20); break; }
        case 'check': checkExercise(ex, art.querySelector('.check-res')); break;
      }
    });
  }
  function checkExercise(ex, box) {
    const interp = MiniConsole.getInterpreter();
    const fresh = new MiniMatlab.Interpreter({ print() { }, warn() { } });
    const lines = []; let allOk = true;
    for (const ch of ex.check) {
      const v = interp.getVar(ch.var);
      if (v === undefined) { lines.push(`<li><code>${esc(ch.var)}</code> nu este definită în consolă.</li>`); allOk = false; continue; }
      let expected;
      try { if (ch.setup) fresh.run(ch.setup); expected = fresh.evalString(ch.expected); } catch (e) { lines.push(`<li>Nu pot evalua valoarea așteptată pentru <code>${esc(ch.var)}</code>: ${esc(e.message)}</li>`); allOk = false; continue; }
      const ok = sameValue(v, expected);
      if (!ok) allOk = false;
      lines.push(`<li><code>${esc(ch.var)}</code>: ${ok ? '<span class="ok">corect</span>' : `<span class="bad">diferă de valoarea așteptată</span> (dimensiune ${v.r}×${v.c}, așteptat ${expected.r}×${expected.c})`}</li>`);
    }
    box.innerHTML = `<div class="${allOk ? 'ok' : 'bad'}">${allOk ? 'Toate variabilele verificate sunt corecte.' : 'Verifică din nou:'}</div><ul>${lines.join('')}</ul>`;
  }
  function sameValue(a, b) {
    if (!(a instanceof MiniMatlab.Mat) || !(b instanceof MiniMatlab.Mat)) return false;
    if (a.isChar !== b.isChar) return false;
    if (a.r !== b.r || a.c !== b.c) { if (!(a.isVector() && b.isVector() && a.n === b.n)) return false; }
    for (let i = 0; i < a.n; i++) { const x = a.d[i], y = b.d[i]; if (Number.isNaN(x) && Number.isNaN(y)) continue; if (x === y) continue; if (Math.abs(x - y) > 1e-6 * (1 + Math.abs(y))) return false; }
    return true;
  }

  // ---------- Consolă ----------
  let labConsole = null;
  function pageConsole(lab) {
    const head = lab ? labHeader(lab, 'console') : `<header class="pagehead"><div class="kicker">Rulează local, în browser</div><h1>Consolă liberă</h1><p class="lead">Un subset de MATLAB 6.5 pentru exerciții: expresii, matrici, operatorul :, indexare logică, if/for/while/switch, funcții inline și @, polinoame, fzero/quad/fminbnd, plot 2D, fprintf și funcții definite de tine în editor.</p></header>`;
    main.innerHTML = head + `<div id="lab-console"></div><div class="workspace" id="ws"></div>
      <div class="console-help"><details><summary>Ce merge și ce nu în această consolă</summary>
      <p><b>Merge:</b> aritmetică, funcții elementare, constante (${esc('pi, eps, Inf, NaN, realmax, realmin')}), matrici și vectori, ${esc('zeros/ones/eye/diag/rand/randn/randperm/linspace/repmat/meshgrid')}, operatorul <code>:</code> și <code>end</code>, indexare logică, operatori <code>.* ./ .^ \\ /</code>, <code>size numel length sum prod min max mean cumsum diff sort find any all</code>, <code>det inv rank cond eig</code>, polinoame (<code>conv deconv roots poly polyval polyder polyfit interp1</code>), <code>inline</code>, <code>@(x)</code>, <code>fplot fzero fminbnd quad dblquad triplequad</code>, <code>plot title xlabel ylabel text axis hold grid legend</code>, <code>disp fprintf sprintf num2str</code>, <code>rem mod gamma</code>, <code>tic toc</code>, <code>if/elseif/else, for, while, switch/case, break</code>, funcții și scripturi scrise în editor, <code>help nume</code>.</p>
      <p><b>Nu merge:</b> calcul simbolic (<code>syms, solve, int, diff, limit, expand, factor, simplify</code>), grafice 3D (<code>surf, mesh, contour, cylinder, sphere, ellipsoid</code>), <code>input</code>, fișiere (<code>save/load</code>), numere complexe în calcule (rădăcinile complexe se afișează doar). Pentru acestea folosește MATLAB; lecțiile explică ce ar trebui să obții.</p></details></div>`;
    labConsole = new MiniConsole.Console($('#lab-console'), { tall: true, onRun: renderWorkspace });
    renderWorkspace();
    if (pendingConsoleCode) { labConsole.load(pendingConsoleCode, { toEditor: pendingConsoleCode.includes('\n') }); pendingConsoleCode = null; }
    else labConsole.focus();
  }
  function renderWorkspace() {
    const ws = $('#ws'); if (!ws) return;
    const interp = MiniConsole.getInterpreter();
    const items = [...interp.vars.entries()].map(([k, v]) => `<span title="${esc(k)}">${esc(k)} <em style="color:var(--ink-3)">${v instanceof MiniMatlab.Mat ? (v.isChar ? 'char ' : '') + v.r + '×' + v.c : 'funcție'}</em></span>`);
    const fns = [...interp.userFuncs.keys()].map(k => `<span>${esc(k)} <em style="color:var(--ink-3)">function</em></span>`);
    ws.innerHTML = (items.length || fns.length) ? 'Workspace: ' + items.join('') + fns.join('') : 'Workspace: (gol)';
  }

  // ---------- Progres ----------
  function pageProgress() {
    renderRail('progress');
    main.innerHTML = `<header class="pagehead"><div class="kicker">Salvat în acest browser</div><h1>Progresul meu</h1><p class="lead">Scorul la test este cel mai bun obținut; fișele și exercițiile se numără pe cele bifate.</p></header>
      <table class="ptable"><thead><tr><th>Lucrarea</th><th>Test</th><th>Fișe</th><th>Exerciții</th><th>Total</th></tr></thead><tbody>
      ${LABS.map(l => { const p = labProgress(l); return `<tr><td><a href="#/lab/${l.id}/learn">${l.id}. ${esc(l.title)}</a></td><td class="n"><span class="pbar"><div style="width:${p.quiz}%"></div></span>${p.quiz}%</td><td class="n"><span class="pbar"><div style="width:${p.cards}%"></div></span>${p.cards}%</td><td class="n"><span class="pbar"><div style="width:${p.ex}%"></div></span>${p.ex}%</td><td class="n"><span class="pbar g"><div style="width:${p.total}%"></div></span>${p.total}%</td></tr>`; }).join('')}
      </tbody></table>
      <p style="margin-top:1.5rem">Test general: ${store.exam.best !== undefined ? `cel mai bun scor <b>${store.exam.best}%</b> din ${store.exam.attempts} încercări` : 'nu l-ai dat încă'}. <a href="#/exam">Dă testul general</a></p>
      <p><button type="button" class="btn" id="wipe">Șterge tot progresul</button></p>`;
    $('#wipe').addEventListener('click', () => { if (confirm('Ștergi tot progresul salvat în acest browser?')) { store = { quiz: {}, cards: {}, ex: {}, exam: {} }; save(); pageProgress(); } });
  }

  // ---------- Router ----------
  function route() {
    const h = location.hash || '#/';
    const parts = h.replace(/^#\/?/, '').split('/').filter(Boolean);
    window.scrollTo(0, 0);
    document.title = 'Practică MATLAB';
    if (!parts.length) return pageDashboard();
    if (parts[0] === 'exam') { document.title = 'Test general · Practică MATLAB'; return pageExam(); }
    if (parts[0] === 'progress') { document.title = 'Progresul meu · Practică MATLAB'; return pageProgress(); }
    if (parts[0] === 'console') { document.title = 'Consolă · Practică MATLAB'; renderRail('console'); return pageConsole(null); }
    if (parts[0] === 'lab') {
      const lab = labById(parts[1]); if (!lab) return pageDashboard();
      renderRail('lab' + lab.id);
      const tab = parts[2] || 'learn';
      document.title = `Lucrarea ${lab.id} · ${lab.title} · Practică MATLAB`;
      switch (tab) {
        case 'cards': return pageCards(lab);
        case 'quiz': return pageQuiz(lab);
        case 'exercises': return pageExercises(lab);
        case 'console': return pageConsole(lab);
        default: return pageLearn(lab);
      }
    }
    pageDashboard();
  }
  window.addEventListener('hashchange', route);
  route();
})();
