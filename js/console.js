/* Widget de consolă MATLAB: linie de comandă, editor pentru m-files, fereastră grafică. */
(function (global) {
  'use strict';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Un singur interpretor partajat: variabilele definite în lecție rămân disponibile în consolă.
  let shared = null;
  function getInterpreter() {
    if (!shared) shared = new MiniMatlab.Interpreter({});
    return shared;
  }

  class Console {
    constructor(root, opts = {}) {
      this.root = root;
      this.opts = opts;
      this.history = []; this.hIdx = -1;
      this.interp = getInterpreter();
      this.build();
    }
    build() {
      const r = this.root;
      r.classList.add('console');
      if (this.opts.tall) r.classList.add('tall');
      r.innerHTML = `
        <div class="cbar">
          <span class="t">Command Window</span>
          <button type="button" data-act="editor">Editor m-file</button>
          <button type="button" data-act="clear">clc</button>
          <button type="button" data-act="reset">clear all</button>
        </div>
        <div class="cout" aria-live="polite"></div>
        <div class="editor">
          <div class="ebar"><span class="t">Editor — scrie un script sau o funcție (function y=nume(x) … end) și rulează</span><button type="button" data-act="run" class="run">Rulează (Ctrl+Enter)</button><button type="button" data-act="editor-close">Închide</button></div>
          <textarea spellcheck="false" placeholder="function y=cosdoix(x)&#10;y=cos(x).*cos(x)-sin(x).*sin(x);"></textarea>
        </div>
        <div class="cin">
          <span class="prompt">&gt;&gt;</span>
          <textarea rows="1" spellcheck="false" autocomplete="off" placeholder="scrie o comandă și apasă Enter"></textarea>
        </div>`;
      this.out = r.querySelector('.cout');
      this.input = r.querySelector('.cin textarea');
      this.editor = r.querySelector('.editor textarea');
      this.fig = document.createElement('div'); this.fig.className = 'figure';
      this.fig.innerHTML = '<div class="fbar"><span>Figure 1</span><button type="button" class="btn small quiet" data-act="closefig">Închide</button></div><canvas></canvas>';
      r.insertAdjacentElement('afterend', this.fig);
      this.canvas = this.fig.querySelector('canvas');
      this.fig.querySelector('[data-act=closefig]').addEventListener('click', () => this.closeFigure());

      r.querySelector('.cbar').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const act = b.dataset.act;
        if (act === 'editor') { r.classList.toggle('editing'); b.classList.toggle('on', r.classList.contains('editing')); if (r.classList.contains('editing')) this.editor.focus(); }
        if (act === 'clear') this.clear();
        if (act === 'reset') { this.interp.reset(); this.interp.figure = null; this.closeFigure(); this.sys('Variabilele au fost șterse.'); }
      });
      r.querySelector('.ebar').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.act === 'run') this.runEditor();
        if (b.dataset.act === 'editor-close') { r.classList.remove('editing'); r.querySelector('[data-act=editor]').classList.remove('on'); }
      });
      this.editor.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); this.runEditor(); } if (e.key === 'Tab') { e.preventDefault(); const s = this.editor.selectionStart; this.editor.setRangeText('    ', s, this.editor.selectionEnd, 'end'); } });
      this.input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.submit(); }
        else if (e.key === 'ArrowUp' && !this.input.value.includes('\n')) { e.preventDefault(); this.recall(-1); }
        else if (e.key === 'ArrowDown' && !this.input.value.includes('\n')) { e.preventDefault(); this.recall(1); }
      });
      this.input.addEventListener('input', () => this.autosize());
      this.out.addEventListener('click', e => { if (window.getSelection().toString()) return; if (e.target === this.out || e.target.tagName === 'SPAN') this.input.focus(); });
      if (this.opts.welcome !== false) this.sys('Consolă MATLAB (subset). Scrie comenzi ca în laborator: 5+3, A=[1 2;3 4], x=0:0.1:1; plot(x,sin(x)). Scrie help nume pentru ajutor.');
    }
    autosize() { this.input.style.height = 'auto'; this.input.style.height = Math.min(200, this.input.scrollHeight) + 'px'; }
    recall(dir) {
      if (!this.history.length) return;
      if (this.hIdx === -1 && dir === -1) this.hIdx = this.history.length;
      this.hIdx = Math.max(0, Math.min(this.history.length, this.hIdx + dir));
      this.input.value = this.hIdx === this.history.length ? '' : this.history[this.hIdx];
      if (this.hIdx === this.history.length) this.hIdx = -1;
      this.autosize();
    }
    bindIO() {
      this.interp.io = {
        print: s => this.append(s),
        warn: s => this.append(s + '\n', 'wrn'),
        clear: () => this.clear(),
        plot: fig => this.drawFigure(fig),
        closeFigure: () => this.closeFigure(),
        defined: names => this.sys('Definit: ' + names.join(', ')),
      };
    }
    append(s, cls) {
      const span = document.createElement('span'); if (cls) span.className = cls; span.textContent = s;
      this.out.appendChild(span); this.out.scrollTop = this.out.scrollHeight;
    }
    sys(s) { this.append(s + '\n', 'sys'); }
    clear() { this.out.innerHTML = ''; }
    echo(cmd) { this.append('>> ' + cmd + '\n', 'in'); }
    exec(src, echo = true) {
      this.bindIO();
      if (echo) this.echo(src);
      try { this.interp.run(src); }
      catch (e) {
        if (e && e.isMatlab) this.append('??? ' + e.message + '\n', 'err');
        else { this.append('??? Eroare internă: ' + (e && e.message) + '\n', 'err'); console.error(e); }
      }
      if (this.opts.onRun) this.opts.onRun();
    }
    submit() {
      const src = this.input.value; if (!src.trim()) return;
      this.history.push(src); this.hIdx = -1;
      this.input.value = ''; this.autosize();
      this.exec(src);
    }
    runEditor() {
      const src = this.editor.value; if (!src.trim()) return;
      const first = src.trim().split('\n')[0];
      this.append('>> ' + (first.startsWith('function') ? '% ' + first : '% rulează scriptul din editor') + '\n', 'in');
      this.exec(src, false);
    }
    load(src, { run = false, toEditor = false } = {}) {
      if (toEditor) { this.root.classList.add('editing'); this.root.querySelector('[data-act=editor]').classList.add('on'); this.editor.value = src; this.editor.focus(); if (run) this.runEditor(); return; }
      if (run) { this.exec(src); this.input.focus(); }
      else { this.input.value = src; this.autosize(); this.input.focus(); }
    }
    drawFigure(fig) { this.fig.classList.add('show'); MiniPlot.render(this.canvas, fig); }
    closeFigure() { this.fig.classList.remove('show'); }
    focus() { this.input.focus(); }
  }

  /* Rulează un bloc de cod din lecție într-o mini-ieșire, folosind același interpretor. */
  function runInline(block, src) {
    const interp = getInterpreter();
    const out = block.querySelector('.out'); out.innerHTML = ''; out.classList.add('show');
    let canvas = block.querySelector('canvas');
    const add = (s, cls) => { const sp = document.createElement('span'); if (cls) sp.className = cls; sp.textContent = s; out.appendChild(sp); };
    interp.io = {
      print: s => add(s), warn: s => add(s + '\n', 'wrn'), clear: () => { out.innerHTML = ''; },
      plot: fig => { if (!canvas) { canvas = document.createElement('canvas'); block.appendChild(canvas); } MiniPlot.render(canvas, fig); },
      closeFigure: () => { if (canvas) { canvas.remove(); canvas = null; } }, defined: names => add('Definit: ' + names.join(', ') + '\n', 'sys'),
    };
    try { interp.run(src); } catch (e) { add('??? ' + (e && e.isMatlab ? e.message : 'Eroare internă: ' + (e && e.message)) + '\n', 'err'); if (!(e && e.isMatlab)) console.error(e); }
    if (!out.textContent.trim()) add('(fără afișare — comanda s-a terminat cu ; sau nu produce ieșire)', 'sys');
  }

  global.MiniConsole = { Console, runInline, getInterpreter, esc };
})(window);
