/* Mini-MATLAB: un interpretor restrâns, în JavaScript, pentru practica din laboratoare.
   Suportă: scalari, vectori, matrici (column-major), șiruri, operatori aritmetici/relaționali/logici,
   operatorul :, indexare (inclusiv logică și `end`), if/for/while/switch, funcții utilizator,
   inline/@ funcții, plot 2D și o bibliotecă de funcții predefinite din laboratoare. */
(function (global) {
  'use strict';

  // ---------- Valori ----------
  class Mat {
    constructor(r, c, d, isChar) { this.r = r; this.c = c; this.d = d; this.isChar = !!isChar; }
    static scalar(v) { return new Mat(1, 1, [v]); }
    static zeros(r, c) { return new Mat(r, c, new Array(r * c).fill(0)); }
    static row(arr) { return new Mat(1, arr.length, arr.slice()); }
    static col(arr) { return new Mat(arr.length, 1, arr.slice()); }
    static str(s) { return new Mat(1, s.length, Array.from(s, ch => ch.charCodeAt(0)), true); }
    get(i, j) { return this.d[i + j * this.r]; }
    set(i, j, v) { this.d[i + j * this.r] = v; }
    get n() { return this.d.length; }
    isScalar() { return this.d.length === 1; }
    isEmpty() { return this.d.length === 0; }
    isVector() { return this.r === 1 || this.c === 1; }
    toStr() { return String.fromCharCode(...this.d); }
    clone() { return new Mat(this.r, this.c, this.d.slice(), this.isChar); }
  }
  class Func {
    constructor(name, params, outs, body, env) { this.name = name; this.params = params; this.outs = outs; this.body = body; this.env = env; }
  }
  class MError extends Error { constructor(m) { super(m); this.isMatlab = true; } }
  class BreakSig { } class ContinueSig { } class ReturnSig { }

  // ---------- Lexer ----------
  const KEYWORDS = new Set(['if', 'elseif', 'else', 'end', 'for', 'while', 'switch', 'case', 'otherwise', 'break', 'continue', 'return', 'function']);
  function tokenize(src) {
    const toks = [];
    let i = 0, n = src.length;
    const stack = [];
    const last = () => toks[toks.length - 1];
    const endsOperand = t => t && (t.t === 'num' || t.t === 'id' || t.t === 'str' || (t.t === 'op' && (t.v === ')' || t.v === ']' || t.v === "'" || t.v === ".'" || t.v === '}')) || (t.t === 'kw' && t.v === 'end'));
    while (i < n) {
      let ch = src[i];
      let ws = false;
      while (i < n && (src[i] === ' ' || src[i] === '\t')) { i++; ws = true; }
      if (i >= n) break;
      ch = src[i];
      if (ch === '.' && src.substr(i, 3) === '...') { while (i < n && src[i] !== '\n') i++; i++; continue; }
      if (ch === '%') { while (i < n && src[i] !== '\n') i++; continue; }
      const inBracket = stack.length && stack[stack.length - 1] === '[';
      if (ch === '\n' || ch === '\r') {
        i++;
        if (stack.length && stack[stack.length - 1] === '(') continue;
        if (inBracket) { if (last() && !(last().t === 'op' && (last().v === ';' || last().v === '['))) toks.push({ t: 'op', v: ';' }); continue; }
        toks.push({ t: 'nl' }); continue;
      }
      // element separator implicit in [ ]
      const startsOperand = () => {
        const c = src[i], c2 = src[i + 1];
        if (/[0-9A-Za-z_(\[{@]/.test(c)) return true;
        if (c === '.' && /[0-9]/.test(c2)) return true;
        if (c === "'") return true;
        if (c === '~' && c2 !== '=') return true;
        if ((c === '-' || c === '+') && c2 !== undefined && !/[\s=]/.test(c2)) return true;
        return false;
      };
      if (inBracket && ws && endsOperand(last()) && startsOperand()) {
        toks.push({ t: 'op', v: ',' });
      }
      // numbers
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1]))) {
        let m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(src.substr(i));
        let lit = m[0];
        if (/\.$/.test(lit) && /[*\/\\^']/.test(src[i + lit.length] || '')) lit = lit.slice(0, -1);
        toks.push({ t: 'num', v: parseFloat(lit) }); i += lit.length; continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        let m = /^[A-Za-z_]\w*/.exec(src.substr(i));
        const w = m[0]; i += w.length;
        if (KEYWORDS.has(w)) toks.push({ t: 'kw', v: w }); else toks.push({ t: 'id', v: w });
        continue;
      }
      if (ch === "'") {
        if (endsOperand(last()) && !ws) { toks.push({ t: 'op', v: "'" }); i++; continue; }
        let j = i + 1, s = '';
        while (j < n) {
          if (src[j] === "'") { if (src[j + 1] === "'") { s += "'"; j += 2; continue; } break; }
          if (src[j] === '\n') throw new MError("A string is missing its closing quote.");
          s += src[j++];
        }
        if (j >= n) throw new MError("A string is missing its closing quote.");
        toks.push({ t: 'str', v: s }); i = j + 1; continue;
      }
      if (ch === '"') {
        let j = i + 1, s = '';
        while (j < n && src[j] !== '"') s += src[j++];
        toks.push({ t: 'str', v: s }); i = j + 1; continue;
      }
      const three = src.substr(i, 2);
      const ops2 = ['==', '~=', '<=', '>=', '&&', '||', '.*', './', '.\\', '.^', ".'"];
      if (ops2.includes(three)) { toks.push({ t: 'op', v: three }); i += 2; continue; }
      if ('+-*/\\^<>=&|~:,;()[]{}@'.includes(ch)) {
        if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
        if (ch === ')' || ch === ']' || ch === '}') stack.pop();
        toks.push({ t: 'op', v: ch }); i++; continue;
      }
      throw new MError("Caracter neașteptat: '" + ch + "'");
    }
    toks.push({ t: 'nl' });
    toks.push({ t: 'eof' });
    return toks;
  }

  // ---------- Parser ----------
  class Parser {
    constructor(toks) { this.toks = toks; this.p = 0; }
    peek(k = 0) { return this.toks[this.p + k]; }
    next() { return this.toks[this.p++]; }
    isOp(v, k = 0) { const t = this.peek(k); return t.t === 'op' && t.v === v; }
    isKw(v, k = 0) { const t = this.peek(k); return t.t === 'kw' && t.v === v; }
    expectOp(v) {
      if (!this.isOp(v)) {
        const t = this.peek();
        if (t.t === 'num' || t.t === 'id') throw new MError('Missing MATLAB operator.');
        if (t.t === 'nl' || t.t === 'eof') throw new MError('Unbalanced or misused parentheses or brackets.');
        throw new MError("Se aștepta '" + v + "'");
      }
      return this.next();
    }
    skipNl() { while (this.peek().t === 'nl' || this.isOp(';') || this.isOp(',')) this.next(); }

    parseProgram() {
      const stmts = [], funcs = [];
      this.skipNl();
      while (this.peek().t !== 'eof') {
        if (this.isKw('function')) funcs.push(this.parseFunction());
        else stmts.push(this.parseStatement());
        this.skipNl();
      }
      return { stmts, funcs };
    }
    parseFunction() {
      this.next();
      let outs = [], name, params = [];
      if (this.isOp('[')) {
        this.next();
        while (!this.isOp(']')) { if (this.isOp(',')) { this.next(); continue; } outs.push(this.next().v); }
        this.next(); this.expectOp('=');
        name = this.next().v;
      } else {
        const a = this.next().v;
        if (this.isOp('=')) { this.next(); outs = [a]; name = this.next().v; } else name = a;
      }
      if (this.isOp('(')) {
        this.next();
        while (!this.isOp(')')) { if (this.isOp(',')) { this.next(); continue; } params.push(this.next().v); }
        this.next();
      }
      const body = this.parseBlock(['end', 'function'], true);
      if (this.isKw('end')) this.next();
      return { name, outs, params, body };
    }
    parseBlock(terms, allowEof) {
      const stmts = [];
      this.skipNl();
      while (true) {
        const t = this.peek();
        if (t.t === 'eof') { if (allowEof) return stmts; throw new MError("Lipsește 'end'."); }
        if (t.t === 'kw' && terms.includes(t.v)) return stmts;
        stmts.push(this.parseStatement());
        this.skipNl();
      }
    }
    endStmt() {
      let show = true;
      if (this.isOp(';')) { show = false; this.next(); }
      else if (this.isOp(',')) this.next();
      else if (this.peek().t === 'nl') this.next();
      else if (this.peek().t === 'eof') { }
      else if (this.peek().t === 'kw') { }
      else if (this.isOp(')') || this.isOp(']')) throw new MError('Unbalanced or misused parentheses or brackets.');
      else if (this.peek().t === 'num' || this.peek().t === 'id' || this.isOp('(')) throw new MError('Missing MATLAB operator.');
      else throw new MError("Sintaxă invalidă lângă '" + (this.peek().v ?? '') + "'.");
      return show;
    }
    parseStatement() {
      const t = this.peek();
      if (t.t === 'kw') {
        switch (t.v) {
          case 'if': return this.parseIf();
          case 'for': return this.parseFor();
          case 'while': return this.parseWhile();
          case 'switch': return this.parseSwitch();
          case 'break': this.next(); this.endStmt(); return { k: 'break' };
          case 'continue': this.next(); this.endStmt(); return { k: 'continue' };
          case 'return': this.next(); this.endStmt(); return { k: 'return' };
          case 'function': throw new MError("Definițiile de funcții se scriu într-un fișier separat (Editor > Rulează).");
          default: throw new MError("'" + t.v + "' neașteptat.");
        }
      }
      // command syntax: word word
      if (t.t === 'id' && this.peek(1).t === 'id' && ['hold', 'format', 'clear', 'clc', 'grid', 'help', 'syms', 'close', 'figure', 'axis', 'type', 'shading', 'load', 'save', 'warning', 'more', 'echo'].includes(t.v)) {
        this.next(); const args = [];
        while (this.peek().t === 'id' || this.peek().t === 'num') args.push(String(this.next().v));
        this.endStmt();
        return { k: 'cmd', name: t.v, args };
      }
      // assignment detection
      const save = this.p;
      if (t.t === 'id') {
        if (this.isOp('=', 1)) { this.next(); this.next(); const e = this.parseExpr(); const show = this.endStmt(); return { k: 'assign', name: t.v, expr: e, show }; }
        if (this.isOp('(', 1)) {
          let depth = 0, k = 1;
          for (; ; k++) { const q = this.peek(k); if (q.t === 'eof' || q.t === 'nl') break; if (q.t === 'op' && (q.v === '(' || q.v === '[' || q.v === '{')) depth++; if (q.t === 'op' && (q.v === ')' || q.v === ']' || q.v === '}')) { depth--; if (depth === 0) break; } }
          if (this.isOp('=', k + 1)) {
            this.next(); this.next();
            const idx = this.parseArgs(')', true);
            this.expectOp('=');
            const e = this.parseExpr(); const show = this.endStmt();
            return { k: 'iassign', name: t.v, idx, expr: e, show };
          }
        }
      }
      if (t.t === 'op' && t.v === '[') {
        let depth = 0, k = 0;
        for (; ; k++) { const q = this.peek(k); if (q.t === 'eof' || q.t === 'nl') break; if (q.t === 'op' && (q.v === '(' || q.v === '[')) depth++; if (q.t === 'op' && (q.v === ')' || q.v === ']')) { depth--; if (depth === 0) break; } }
        if (this.isOp('=', k + 1) && !this.isOp('=', k + 2)) {
          this.next(); const names = [];
          while (!this.isOp(']')) { if (this.isOp(',')) { this.next(); continue; } const q = this.next(); if (q.t === 'op' && q.v === '~') names.push('~'); else names.push(q.v); }
          this.next(); this.expectOp('=');
          const e = this.parseExpr(); const show = this.endStmt();
          return { k: 'massign', names, expr: e, show };
        }
      }
      this.p = save;
      const e = this.parseExpr();
      const show = this.endStmt();
      return { k: 'expr', expr: e, show };
    }
    parseIf() {
      this.next();
      const cond = this.parseExpr();
      const clauses = [{ cond, body: this.parseBlock(['elseif', 'else', 'end']) }];
      let els = null;
      while (true) {
        if (this.isKw('elseif')) { this.next(); const c = this.parseExpr(); clauses.push({ cond: c, body: this.parseBlock(['elseif', 'else', 'end']) }); }
        else if (this.isKw('else')) { this.next(); els = this.parseBlock(['end']); }
        else if (this.isKw('end')) { this.next(); break; }
        else throw new MError("Lipsește 'end' la 'if'.");
      }
      return { k: 'if', clauses, els };
    }
    parseFor() {
      this.next();
      let paren = false;
      if (this.isOp('(')) { paren = true; this.next(); }
      const name = this.next().v; this.expectOp('=');
      const expr = this.parseExpr();
      if (paren) this.expectOp(')');
      const body = this.parseBlock(['end']); this.next();
      return { k: 'for', name, expr, body };
    }
    parseWhile() {
      this.next(); const cond = this.parseExpr();
      const body = this.parseBlock(['end']); this.next();
      return { k: 'while', cond, body };
    }
    parseSwitch() {
      this.next(); const expr = this.parseExpr(); this.skipNl();
      const cases = []; let other = null;
      while (true) {
        if (this.isKw('case')) { this.next(); const v = this.parseExpr(); cases.push({ v, body: this.parseBlock(['case', 'otherwise', 'end']) }); }
        else if (this.isKw('otherwise')) { this.next(); other = this.parseBlock(['case', 'end']); }
        else if (this.isKw('end')) { this.next(); break; }
        else throw new MError("Sintaxă invalidă în 'switch'.");
      }
      return { k: 'switch', expr, cases, other };
    }
    parseArgs(close, inIndex) {
      const args = [];
      while (!this.isOp(close)) {
        if (this.isOp(',')) { this.next(); continue; }
        if (inIndex && this.isOp(':') && (this.isOp(',', 1) || this.isOp(close, 1))) { this.next(); args.push({ k: 'colon' }); continue; }
        args.push(this.parseExpr());
      }
      this.next();
      return args;
    }
    parseExpr() { return this.parseOrOr(); }
    parseOrOr() { let l = this.parseAndAnd(); while (this.isOp('||')) { this.next(); const r = this.parseAndAnd(); l = { k: 'sc', op: '||', l, r }; } return l; }
    parseAndAnd() { let l = this.parseOr(); while (this.isOp('&&')) { this.next(); const r = this.parseOr(); l = { k: 'sc', op: '&&', l, r }; } return l; }
    parseOr() { let l = this.parseAnd(); while (this.isOp('|')) { this.next(); const r = this.parseAnd(); l = { k: 'bin', op: '|', l, r }; } return l; }
    parseAnd() { let l = this.parseCmp(); while (this.isOp('&')) { this.next(); const r = this.parseCmp(); l = { k: 'bin', op: '&', l, r }; } return l; }
    parseCmp() {
      let l = this.parseRange();
      while (['<', '<=', '>', '>=', '==', '~='].some(o => this.isOp(o))) { const op = this.next().v; const r = this.parseRange(); l = { k: 'bin', op, l, r }; }
      return l;
    }
    parseRange() {
      const a = this.parseAdd();
      if (this.isOp(':') && !(this.isOp(',', 1) || this.isOp(')', 1))) {
        this.next(); const b = this.parseAdd();
        if (this.isOp(':') && !(this.isOp(',', 1) || this.isOp(')', 1))) { this.next(); const c = this.parseAdd(); return { k: 'range', a, s: b, b: c }; }
        return { k: 'range', a, b };
      }
      return a;
    }
    parseAdd() { let l = this.parseMul(); while (this.isOp('+') || this.isOp('-')) { const op = this.next().v; const r = this.parseMul(); l = { k: 'bin', op, l, r }; } return l; }
    parseMul() { let l = this.parseUnary(); while (['*', '/', '\\', '.*', './', '.\\'].some(o => this.isOp(o))) { const op = this.next().v; const r = this.parseUnary(); l = { k: 'bin', op, l, r }; } return l; }
    parseUnary() {
      if (this.isOp('-') || this.isOp('+') || this.isOp('~')) { const op = this.next().v; const e = this.parseUnary(); return { k: 'un', op, e }; }
      return this.parsePower();
    }
    parsePower() {
      let l = this.parsePostfix();
      while (this.isOp('^') || this.isOp('.^')) { const op = this.next().v; const r = this.parsePowOperand(); l = { k: 'bin', op, l, r }; }
      return l;
    }
    parsePowOperand() {
      if (this.isOp('-') || this.isOp('+') || this.isOp('~')) { const op = this.next().v; const e = this.parsePowOperand(); return { k: 'un', op, e }; }
      return this.parsePostfix();
    }
    parsePostfix() {
      let e = this.parsePrimary();
      while (true) {
        if (this.isOp('(')) { this.next(); const args = this.parseArgs(')', true); e = { k: 'call', target: e, args }; }
        else if (this.isOp("'") || this.isOp(".'")) { this.next(); e = { k: 'transpose', e }; }
        else break;
      }
      return e;
    }
    parsePrimary() {
      const t = this.next();
      if (t.t === 'num') return { k: 'num', v: t.v };
      if (t.t === 'str') return { k: 'str', v: t.v };
      if (t.t === 'id') return { k: 'id', v: t.v };
      if (t.t === 'kw' && t.v === 'end') return { k: 'end' };
      if (t.t === 'op') {
        if (t.v === '(') { const e = this.parseExpr(); this.expectOp(')'); return { k: 'paren', e }; }
        if (t.v === '[') return this.parseMatrix();
        if (t.v === '@') {
          if (this.isOp('(')) { this.next(); const params = []; while (!this.isOp(')')) { if (this.isOp(',')) { this.next(); continue; } params.push(this.next().v); } this.next(); const body = this.parseExpr(); return { k: 'anon', params, body }; }
          const name = this.next().v; return { k: 'fhandle', name };
        }
        if (t.v === ':') return { k: 'colon' };
      }
      if (t.t === 'eof' || t.t === 'nl') throw new MError("Expresie incompletă.");
      throw new MError("Sintaxă invalidă lângă '" + (t.v ?? '') + "'.");
    }
    parseMatrix() {
      const rows = [[]];
      while (!this.isOp(']')) {
        if (this.isOp(';')) { this.next(); if (rows[rows.length - 1].length) rows.push([]); continue; }
        if (this.isOp(',')) { this.next(); continue; }
        if (this.peek().t === 'nl') { this.next(); continue; }
        if (this.peek().t === 'eof') throw new MError("Unbalanced or misused parentheses or brackets.");
        rows[rows.length - 1].push(this.parseExpr());
      }
      this.next();
      if (rows.length > 1 && rows[rows.length - 1].length === 0) rows.pop();
      return { k: 'matrix', rows };
    }
  }

  // ---------- Formatting ----------
  function fmtNum(v, intMode) {
    if (Number.isNaN(v)) return 'NaN';
    if (v === Infinity) return 'Inf';
    if (v === -Infinity) return '-Inf';
    if (intMode) return String(v);
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 1e5 || a < 1e-3) return v.toExponential(4).replace(/e([+-])(\d)$/, 'e$10$2');
    return v.toFixed(4);
  }
  function allInt(d) { return d.every(v => (Number.isInteger(v) && Math.abs(v) < 1e9) || !Number.isFinite(v)); }
  function formatValue(v) {
    if (v instanceof Func) return v.name === '@' ? '    @(' + v.params.join(',') + ') ' + v.src : '    Inline function:\n    ' + v.name + '(' + v.params.join(',') + ') = ' + v.src;
    if (!(v instanceof Mat)) return String(v);
    if (v.isChar) { if (v.r <= 1) return v.toStr(); const lines = []; for (let i = 0; i < v.r; i++) { let s = ''; for (let j = 0; j < v.c; j++) s += String.fromCharCode(v.get(i, j)); lines.push(s); } return lines.join('\n'); }
    if (v.isEmpty()) return '     []';
    const ints = allInt(v.d);
    let scale = 1, prefix = '';
    if (!ints) {
      const finite = v.d.filter(Number.isFinite).map(Math.abs).filter(x => x > 0);
      const mx = finite.length ? Math.max(...finite) : 0;
      const mn = finite.length ? Math.min(...finite) : 0;
      if (v.n > 1 && (mx >= 1e5 || (mx < 1e-3 && mx > 0))) {
        const e = Math.floor(Math.log10(mx));
        scale = Math.pow(10, e);
        prefix = '  1.0e' + (e < 0 ? '-' : '+') + String(Math.abs(e)).padStart(3, '0') + ' *\n\n';
      } else if (v.n > 1 && mn > 0 && mn < 1e-3 && mx < 1e5) {
        // mixed magnitudes: keep 4 decimals
      }
    }
    const fixed4 = x => Number.isFinite(x) ? x.toFixed(4) : fmtNum(x);
    const cells = v.d.map(x => scale !== 1 && Number.isFinite(x) ? fixed4(x / scale) : (ints || v.n === 1 ? fmtNum(x, ints) : fixed4(x)));
    const w = Math.max(...cells.map(s => s.length));
    const pad = ints ? 3 : 3;
    const lines = [];
    for (let i = 0; i < v.r; i++) {
      let s = '';
      for (let j = 0; j < v.c; j++) s += ' '.repeat(pad) + cells[i + j * v.r].padStart(w);
      lines.push(s);
    }
    return prefix + lines.join('\n');
  }

  // ---------- Helpers ----------
  const num = v => { if (v instanceof Mat) { if (v.n !== 1) throw new MError("Se aștepta un scalar."); return v.d[0]; } throw new MError("Se aștepta o valoare numerică."); };
  const truthy = v => { if (!(v instanceof Mat)) throw new MError("Condiție invalidă."); if (v.isEmpty()) return false; return v.d.every(x => x !== 0 && !Number.isNaN(x)); };
  function elementwise(a, b, f, opname) {
    if (a.isScalar() && !b.isScalar()) { const x = a.d[0]; return new Mat(b.r, b.c, b.d.map(y => f(x, y))); }
    if (b.isScalar()) { const y = b.d[0]; return new Mat(a.r, a.c, a.d.map(x => f(x, y))); }
    if (a.r !== b.r || a.c !== b.c) throw new MError(opname === '+' || opname === '-' ? 'Matrix dimensions must agree.' : 'Matrix dimensions must agree.');
    return new Mat(a.r, a.c, a.d.map((x, i) => f(x, b.d[i])));
  }
  function matmul(a, b) {
    if (a.isScalar() || b.isScalar()) return elementwise(a, b, (x, y) => x * y, '*');
    if (a.c !== b.r) throw new MError('Inner matrix dimensions must agree.');
    const r = Mat.zeros(a.r, b.c);
    for (let i = 0; i < a.r; i++) for (let j = 0; j < b.c; j++) { let s = 0; for (let k = 0; k < a.c; k++) s += a.get(i, k) * b.get(k, j); r.set(i, j, s); }
    return r;
  }
  function transpose(a) { const r = Mat.zeros(a.c, a.r); for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) r.set(j, i, a.get(i, j)); r.isChar = a.isChar; return r; }
  function identity(n) { const m = Mat.zeros(n, n); for (let i = 0; i < n; i++) m.set(i, i, 1); return m; }
  // Gaussian elimination with partial pivoting: solves A X = B
  function solve(A, B, warn) {
    if (A.r !== A.c) throw new MError('Operatorul \\ este suportat doar pentru matrici pătrate.');
    if (A.r !== B.r) throw new MError('Matrix dimensions must agree.');
    const n = A.r, m = B.c;
    const M = A.d.slice(), X = B.d.slice();
    const col = (d, i, j) => d[i + j * n];
    let singular = false;
    for (let k = 0; k < n; k++) {
      let p = k, mx = Math.abs(col(M, k, k));
      for (let i = k + 1; i < n; i++) if (Math.abs(col(M, i, k)) > mx) { mx = Math.abs(col(M, i, k)); p = i; }
      if (mx < 1e-14) { singular = true; continue; }
      if (p !== k) { for (let j = 0; j < n; j++) { const t = M[k + j * n]; M[k + j * n] = M[p + j * n]; M[p + j * n] = t; } for (let j = 0; j < m; j++) { const t = X[k + j * n]; X[k + j * n] = X[p + j * n]; X[p + j * n] = t; } }
      for (let i = k + 1; i < n; i++) {
        const f = M[i + k * n] / M[k + k * n];
        if (f === 0) continue;
        for (let j = k; j < n; j++) M[i + j * n] -= f * M[k + j * n];
        for (let j = 0; j < m; j++) X[i + j * n] -= f * X[k + j * n];
      }
    }
    if (singular) { if (warn) warn('Warning: Matrix is singular to working precision.'); }
    const R = Mat.zeros(n, m);
    for (let j = 0; j < m; j++) for (let i = n - 1; i >= 0; i--) {
      let s = X[i + j * n];
      for (let k = i + 1; k < n; k++) s -= M[i + k * n] * R.get(k, j);
      R.set(i, j, s / M[i + i * n]);
    }
    return R;
  }
  function det(A) {
    if (A.r !== A.c) throw new MError('Matrix must be square.');
    const n = A.r, M = A.d.slice(); let d = 1;
    for (let k = 0; k < n; k++) {
      let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i + k * n]) > Math.abs(M[p + k * n])) p = i;
      if (Math.abs(M[p + k * n]) < 1e-300) return 0;
      if (p !== k) { d = -d; for (let j = 0; j < n; j++) { const t = M[k + j * n]; M[k + j * n] = M[p + j * n]; M[p + j * n] = t; } }
      d *= M[k + k * n];
      for (let i = k + 1; i < n; i++) { const f = M[i + k * n] / M[k + k * n]; for (let j = k; j < n; j++) M[i + j * n] -= f * M[k + j * n]; }
    }
    return d;
  }
  function rank(A) {
    const M = A.d.slice(), r = A.r, c = A.c; let rk = 0;
    const tol = 1e-10 * Math.max(1, ...M.map(Math.abs));
    const rowUsed = new Array(r).fill(false);
    for (let j = 0; j < c; j++) {
      let p = -1, mx = tol;
      for (let i = 0; i < r; i++) if (!rowUsed[i] && Math.abs(M[i + j * r]) > mx) { mx = Math.abs(M[i + j * r]); p = i; }
      if (p < 0) continue;
      rowUsed[p] = true; rk++;
      for (let i = 0; i < r; i++) if (i !== p) { const f = M[i + j * r] / M[p + j * r]; for (let k = j; k < c; k++) M[i + k * r] -= f * M[p + k * r]; }
    }
    return rk;
  }
  function inv(A, warn) {
    if (A.r !== A.c) throw new MError('Matrix must be square.');
    if (Math.abs(det(A)) < 1e-14) { if (warn) warn('Warning: Matrix is singular to working precision.'); return new Mat(A.r, A.c, new Array(A.n).fill(Infinity)); }
    return solve(A, identity(A.r), warn);
  }
  function powMat(A, p) {
    if (A.isScalar()) return Mat.scalar(Math.pow(A.d[0], p));
    if (A.r !== A.c) throw new MError('Matrix must be square.');
    if (!Number.isInteger(p)) throw new MError('Exponentul unei matrici trebuie să fie întreg în această consolă.');
    if (p < 0) { A = inv(A); p = -p; }
    let R = identity(A.r), B = A;
    while (p > 0) { if (p & 1) R = matmul(R, B); B = matmul(B, B); p >>= 1; }
    return R;
  }
  function toIndexList(idxVal, dimLen, what) {
    if (idxVal === ':') return Array.from({ length: dimLen }, (_, i) => i);
    if (idxVal.isLogical) {
      const out = []; idxVal.d.forEach((v, i) => { if (v) out.push(i); });
      if (out.length && out[out.length - 1] >= dimLen) throw new MError('Index exceeds matrix dimensions.');
      return out;
    }
    return idxVal.d.map(v => {
      if (!Number.isInteger(v) || v < 1) throw new MError('Subscript indices must either be real positive integers or logicals.');
      return v - 1;
    });
  }

  // ---------- Interpreter ----------
  class Interpreter {
    constructor(io) {
      this.io = io || {};
      this.vars = new Map();
      this.userFuncs = new Map();
      this.callDepth = 0;
      this.holdOn = false;
      this.figure = null;
      this.ticTime = null;
      this.steps = 0;
      this.maxSteps = 2.5e7;
      this.endStack = [];
    }
    out(s) { if (this.io.print) this.io.print(s); }
    warn(s) { if (this.io.warn) this.io.warn(s); else this.out(s + '\n'); }
    plot(fig) { if (this.io.plot) this.io.plot(fig); }

    // API
    run(src, opts = {}) {
      const ast = new Parser(tokenize(src)).parseProgram();
      this.steps = 0;
      for (const f of ast.funcs) this.userFuncs.set(f.name, new Func(f.name, f.params, f.outs, f.body, null));
      if (ast.funcs.length && this.io.defined) this.io.defined(ast.funcs.map(f => f.name));
      try { this.execBlock(ast.stmts, this.vars); }
      catch (e) { if (e instanceof ReturnSig) return; throw e; }
    }
    evalString(src) {
      const ast = new Parser(tokenize(src)).parseProgram();
      const st = ast.stmts;
      if (st.length !== 1 || st[0].k !== 'expr') throw new MError('Se aștepta o singură expresie.');
      return this.evalExpr(st[0].expr, this.vars);
    }
    getVar(name) { return this.vars.get(name); }
    reset() { this.vars.clear(); }

    execBlock(stmts, env) { for (const s of stmts) this.exec(s, env); }
    tick() { if (++this.steps > this.maxSteps) throw new MError('Programul rulează prea mult (posibil buclă infinită). Execuție oprită.'); }
    display(name, v) {
      if (v instanceof Mat && v.isEmpty() && !v.isChar) { this.out(name + ' =\n\n' + (v.r === 0 && v.c === 0 ? '     []' : '   Empty matrix: ' + v.r + '-by-' + v.c) + '\n\n'); return; }
      if (v instanceof Mat && v.isChar) { this.out(name + ' =\n\n' + formatValue(v) + '\n\n'); return; }
      this.out(name + ' =\n\n' + formatValue(v) + '\n\n');
    }
    exec(s, env) {
      this.tick();
      switch (s.k) {
        case 'expr': {
          if (s.expr.k === 'id' && !env.has(s.expr.v) && this.isCommandLike(s.expr.v)) { this.callFunction(s.expr.v, [], env, 0); return; }
          const v = this.evalExprN(s.expr, env, 1);
          if (v === undefined) return;
          if (!(s.expr.k === 'id' && env.has(s.expr.v))) env.set('ans', v);
          if (s.show) this.display(s.expr.k === 'id' && env.has(s.expr.v) ? s.expr.v : 'ans', v);
          return;
        }
        case 'assign': { const v = this.evalExpr(s.expr, env); env.set(s.name, v); if (s.show) this.display(s.name, v); return; }
        case 'iassign': { this.indexedAssign(s, env); if (s.show) this.display(s.name, env.get(s.name)); return; }
        case 'massign': {
          const vals = this.evalExprN(s.expr, env, s.names.length);
          const arr = Array.isArray(vals) ? vals : [vals];
          s.names.forEach((n, i) => { if (n === '~') return; if (i >= arr.length) throw new MError('Prea multe argumente de ieșire.'); env.set(n, arr[i]); if (s.show) this.display(n, arr[i]); });
          return;
        }
        case 'if': {
          for (const c of s.clauses) if (truthy(this.evalExpr(c.cond, env))) { this.execBlock(c.body, env); return; }
          if (s.els) this.execBlock(s.els, env);
          return;
        }
        case 'for': {
          const v = this.evalExpr(s.expr, env);
          if (!(v instanceof Mat)) throw new MError('Expresie invalidă la for.');
          const cols = v.c;
          for (let j = 0; j < cols; j++) {
            const colv = v.r === 1 ? Mat.scalar(v.d[j]) : new Mat(v.r, 1, v.d.slice(j * v.r, (j + 1) * v.r));
            env.set(s.name, colv);
            try { this.execBlock(s.body, env); }
            catch (e) { if (e instanceof BreakSig) break; if (e instanceof ContinueSig) continue; throw e; }
          }
          return;
        }
        case 'while': {
          while (truthy(this.evalExpr(s.cond, env))) {
            this.tick();
            try { this.execBlock(s.body, env); }
            catch (e) { if (e instanceof BreakSig) break; if (e instanceof ContinueSig) continue; throw e; }
          }
          return;
        }
        case 'switch': {
          const v = this.evalExpr(s.expr, env);
          const matches = cv => {
            if (v.isChar || cv.isChar) return v.isChar && cv.isChar && v.toStr() === cv.toStr();
            return num(v) === num(cv);
          };
          for (const c of s.cases) {
            const cv = this.evalExpr(c.v, env);
            if (matches(cv)) { this.execBlock(c.body, env); return; }
          }
          if (s.other) this.execBlock(s.other, env);
          return;
        }
        case 'break': throw new BreakSig();
        case 'continue': throw new ContinueSig();
        case 'return': throw new ReturnSig();
        case 'cmd': return this.command(s.name, s.args, env);
      }
    }
    isCommandLike(n) { return ['clc', 'clear', 'hold', 'tic', 'toc', 'figure', 'close', 'grid', 'clf', 'sphere', 'cylinder', 'format', 'whos', 'who'].includes(n); }
    command(name, args, env) {
      switch (name) {
        case 'hold': this.holdOn = args[0] !== 'off'; return;
        case 'grid': if (this.figure) { this.figure.grid = args[0] !== 'off'; this.plot(this.figure); } return;
        case 'clear': if (args.length) args.forEach(a => env.delete(a)); else env.clear(); return;
        case 'clc': if (this.io.clear) this.io.clear(); return;
        case 'format': return;
        case 'close': case 'figure': this.figure = null; if (this.io.closeFigure) this.io.closeFigure(); return;
        case 'syms': throw new MError("Calculul simbolic (syms, sym, solve, int, diff simbolic) nu este disponibil în această consolă. Exersează-l în MATLAB.");
        case 'help': this.out(this.helpText(args[0]) + '\n'); return;
        case 'type': { const f = this.userFuncs.get(args[0]); this.out(f ? '(funcție definită de utilizator: ' + f.name + ')\n' : 'Nu există ' + args[0] + '.\n'); return; }
        case 'axis': return;
        default: return;
      }
    }
    helpText(n) {
      const h = HELP[n]; if (h) return ' ' + n.toUpperCase() + '  ' + h;
      const f = this.userFuncs.get(n); if (f) return f.help || ' (fără comentarii de ajutor)';
      return n + ' not found.';
    }
    evalExpr(e, env) { const v = this.evalExprN(e, env, 1); if (Array.isArray(v)) return v[0]; if (v === undefined) throw new MError('Funcția nu returnează nicio valoare.'); return v; }
    evalExprN(e, env, nargout) {
      this.tick();
      switch (e.k) {
        case 'num': return Mat.scalar(e.v);
        case 'str': return Mat.str(e.v);
        case 'paren': return this.evalExpr(e.e, env);
        case 'id': {
          if (env.has(e.v)) { const v = env.get(e.v); if (v instanceof Mat) v.shared = true; return v; }
          return this.callFunction(e.v, [], env, nargout);
        }
        case 'end': {
          const top = this.endStack[this.endStack.length - 1];
          if (!top) throw new MError("'end' se poate folosi doar la indexare.");
          const { val, dim, ndims } = top;
          if (ndims === 1) return Mat.scalar(val.n);
          return Mat.scalar(dim === 0 ? val.r : val.c);
        }
        case 'colon': return ':';
        case 'matrix': return this.buildMatrix(e, env);
        case 'range': {
          const a = num(this.evalExpr(e.a, env));
          const s = e.s ? num(this.evalExpr(e.s, env)) : 1;
          const b = num(this.evalExpr(e.b, env));
          const out = [];
          if (s === 0 || (s > 0 && a > b) || (s < 0 && a < b)) return new Mat(1, 0, []);
          const n = Math.floor((b - a) / s + 1e-10);
          if (n > 5e6) throw new MError('Vector prea mare.');
          for (let i = 0; i <= n; i++) out.push(a + i * s);
          return Mat.row(out);
        }
        case 'un': {
          const v = this.evalExpr(e.e, env);
          if (!(v instanceof Mat)) throw new MError('Operator unar aplicat unei valori nenumerice.');
          if (e.op === '-') return new Mat(v.r, v.c, v.d.map(x => -x));
          if (e.op === '+') return v;
          const r = new Mat(v.r, v.c, v.d.map(x => x === 0 ? 1 : 0)); r.isLogical = true; return r;
        }
        case 'sc': {
          const l = this.evalExpr(e.l, env);
          if (e.op === '&&') { if (!truthy(l)) return Mat.scalar(0); return Mat.scalar(truthy(this.evalExpr(e.r, env)) ? 1 : 0); }
          if (truthy(l)) return Mat.scalar(1); return Mat.scalar(truthy(this.evalExpr(e.r, env)) ? 1 : 0);
        }
        case 'bin': return this.binop(e.op, this.evalExpr(e.l, env), this.evalExpr(e.r, env));
        case 'transpose': return transpose(this.evalExpr(e.e, env));
        case 'anon': { const f = new Func('@', e.params, ['ans'], e.body, new Map(env)); f.src = exprToString(e.body); return f; }
        case 'fhandle': return this.makeHandle(e.name);
        case 'call': {
          if (e.target.k === 'id') {
            const name = e.target.v;
            if (env.has(name)) {
              const target = env.get(name);
              if (target instanceof Func) return this.callFunc(target, e.args.map(a => this.evalExpr(a, env)), nargout);
              return this.index(target, e.args, env);
            }
            return this.callFunction(name, e.args, env, nargout);
          }
          const target = this.evalExpr(e.target, env);
          if (target instanceof Func) return this.callFunc(target, e.args.map(a => this.evalExpr(a, env)), nargout);
          return this.index(target, e.args, env);
        }
      }
      throw new MError('Expresie nesuportată.');
    }
    makeHandle(name) {
      if (this.userFuncs.has(name)) return this.userFuncs.get(name);
      if (BUILTINS[name]) { const f = new Func(name, ['x'], ['y'], null, null); f.builtin = name; return f; }
      throw new MError("Undefined function or variable '" + name + "'.");
    }
    binop(op, a, b) {
      if (a instanceof Func || b instanceof Func) throw new MError('Operație invalidă cu o funcție.');
      const L = (f, name) => { const r = elementwise(a, b, f, name); r.isLogical = true; return r; };
      switch (op) {
        case '+': return elementwise(a, b, (x, y) => x + y, '+');
        case '-': return elementwise(a, b, (x, y) => x - y, '-');
        case '.*': return elementwise(a, b, (x, y) => x * y, '.*');
        case './': return this.divWarn(elementwise(a, b, (x, y) => x / y, './'), b);
        case '.\\': return this.divWarn(elementwise(a, b, (x, y) => y / x, '.\\'), a);
        case '.^': return elementwise(a, b, (x, y) => Math.pow(x, y), '.^');
        case '*': return matmul(a, b);
        case '/': if (b.isScalar()) return this.divWarn(elementwise(a, b, (x, y) => x / y, '/'), b); if (a.isScalar()) throw new MError('Pentru împărțire element cu element folosește ./'); return transpose(solve(transpose(b), transpose(a), s => this.warn(s)));
        case '\\': if (a.isScalar()) return this.divWarn(elementwise(a, b, (x, y) => y / x, '\\'), a); return solve(a, b, s => this.warn(s));
        case '^': if (b.isScalar()) return powMat(a, b.d[0]); if (a.isScalar()) throw new MError('Pentru ridicare la putere element cu element folosește .^'); throw new MError('Exponentul trebuie să fie scalar.');
        case '<': return L((x, y) => x < y ? 1 : 0, '<');
        case '<=': return L((x, y) => x <= y ? 1 : 0, '<=');
        case '>': return L((x, y) => x > y ? 1 : 0, '>');
        case '>=': return L((x, y) => x >= y ? 1 : 0, '>=');
        case '==': return L((x, y) => x === y ? 1 : 0, '==');
        case '~=': return L((x, y) => x !== y ? 1 : 0, '~=');
        case '&': return L((x, y) => (x !== 0 && y !== 0) ? 1 : 0, '&');
        case '|': return L((x, y) => (x !== 0 || y !== 0) ? 1 : 0, '|');
      }
      throw new MError('Operator necunoscut ' + op);
    }
    divWarn(res, divisor) { if (divisor.d.some(x => x === 0)) this.warn('Warning: Divide by zero.'); return res; }
    buildMatrix(e, env) {
      const rowMats = [];
      for (const row of e.rows) {
        const parts = row.map(x => this.evalExpr(x, env)).filter(v => !(v instanceof Mat && v.isEmpty()));
        if (!parts.length) continue;
        if (parts.some(p => !(p instanceof Mat))) throw new MError('Nu se pot concatena funcții.');
        const r = parts[0].r;
        if (parts.some(p => p.r !== r)) throw new MError('All matrices on a row in the bracketed expression must have the same number of rows.');
        const c = parts.reduce((s, p) => s + p.c, 0);
        const m = Mat.zeros(r, c); m.isChar = parts.every(p => p.isChar);
        let off = 0;
        for (const p of parts) { for (let j = 0; j < p.c; j++) for (let i = 0; i < r; i++) m.set(i, off + j, p.get(i, j)); off += p.c; }
        rowMats.push(m);
      }
      if (!rowMats.length) return new Mat(0, 0, []);
      const c = rowMats[0].c;
      if (rowMats.some(m => m.c !== c)) throw new MError('All rows in the bracketed expression must have the same number of columns.');
      const r = rowMats.reduce((s, m) => s + m.r, 0);
      const out = Mat.zeros(r, c); out.isChar = rowMats.every(m => m.isChar);
      let off = 0;
      for (const m of rowMats) { for (let i = 0; i < m.r; i++) for (let j = 0; j < c; j++) out.set(off + i, j, m.get(i, j)); off += m.r; }
      return out;
    }
    evalIndexArgs(target, args, env) {
      return args.map((a, k) => {
        if (a.k === 'colon') return ':';
        this.endStack.push({ val: target, dim: k, ndims: args.length });
        try { return this.evalExpr(a, env); } finally { this.endStack.pop(); }
      });
    }
    index(target, args, env) {
      if (!(target instanceof Mat)) throw new MError('Valoarea nu poate fi indexată.');
      const idx = this.evalIndexArgs(target, args, env);
      if (idx.length === 0) return target;
      if (idx.length === 1) {
        const I = idx[0];
        if (I === ':') { const m = new Mat(target.n, 1, target.d.slice()); m.isChar = target.isChar; return m; }
        const list = toIndexList(I, target.n);
        if (list.some(i => i >= target.n)) throw new MError('Index exceeds matrix dimensions.');
        const d = list.map(i => target.d[i]);
        let r, c;
        if (I.isLogical) { if (target.r === 1) { r = 1; c = d.length; } else { r = d.length; c = 1; } }
        else if (target.r === 1 && I.isVector()) { r = 1; c = d.length; }
        else if (target.c === 1 && I.isVector()) { r = d.length; c = 1; }
        else { r = I.r; c = I.c; }
        const m = new Mat(r, c, d); m.isChar = target.isChar; return m;
      }
      if (idx.length === 2) {
        const rows = toIndexList(idx[0], target.r), cols = toIndexList(idx[1], target.c);
        if (rows.some(i => i >= target.r) || cols.some(j => j >= target.c)) throw new MError('Index exceeds matrix dimensions.');
        const m = Mat.zeros(rows.length, cols.length); m.isChar = target.isChar;
        rows.forEach((i, a) => cols.forEach((j, b) => m.set(a, b, target.get(i, j))));
        return m;
      }
      throw new MError('Sunt suportate cel mult 2 dimensiuni.');
    }
    indexedAssign(s, env) {
      let target = env.get(s.name);
      if (target instanceof Func) throw new MError('Nu se poate indexa o funcție.');
      if (!target) target = new Mat(0, 0, []);
      const idx = this.evalIndexArgs(target, s.idx, env);
      const val = this.evalExpr(s.expr, env);
      if (!(val instanceof Mat)) throw new MError('Valoare invalidă la atribuire.');
      // copy-on-write: valorile citite prin nume sunt marcate partajate și se copiază înainte de modificare
      let out = target.shared ? target.clone() : target;
      if (idx.length === 1) {
        const I = idx[0];
        const list = I === ':' ? Array.from({ length: out.n }, (_, i) => i) : toIndexList(I, out.n);
        if (!val.isScalar() && val.n !== list.length) throw new MError('In an assignment  A(I) = B, the number of elements in B and I must be the same.');
        const maxI = list.length ? Math.max(...list) : -1;
        if (maxI >= out.n) {
          if (out.r <= 1) { const d = out.d.slice(); while (d.length <= maxI) d.push(0); out = new Mat(1, d.length, d); }
          else if (out.c === 1) { const d = out.d.slice(); while (d.length <= maxI) d.push(0); out = new Mat(d.length, 1, d); }
          else throw new MError('In an assignment  A(I) = B, a matrix A cannot be resized.');
        }
        if (val.isScalar()) { const x = val.d[0]; for (let k = 0; k < list.length; k++) out.d[list[k]] = x; }
        else for (let k = 0; k < list.length; k++) out.d[list[k]] = val.d[k];
        out.isChar = val.isChar && (target.isChar || target.isEmpty());
      } else if (idx.length === 2) {
        const rows = idx[0] === ':' ? Array.from({ length: out.r || val.r }, (_, i) => i) : toIndexList(idx[0], out.r);
        const cols = idx[1] === ':' ? Array.from({ length: out.c || val.c }, (_, i) => i) : toIndexList(idx[1], out.c);
        if (!val.isScalar() && val.n !== rows.length * cols.length) throw new MError('Subscripted assignment dimension mismatch.');
        let nr = out.r, nc = out.c;
        for (const i of rows) if (i + 1 > nr) nr = i + 1;
        for (const j of cols) if (j + 1 > nc) nc = j + 1;
        if (nr !== out.r || nc !== out.c) {
          const grown = Mat.zeros(nr, nc); grown.isChar = out.isChar;
          for (let j = 0; j < out.c; j++) for (let i = 0; i < out.r; i++) grown.d[i + j * nr] = out.d[i + j * out.r];
          out = grown;
        }
        if (val.isScalar()) { const x = val.d[0]; for (let b = 0; b < cols.length; b++) for (let a = 0; a < rows.length; a++) out.d[rows[a] + cols[b] * out.r] = x; }
        else for (let b = 0; b < cols.length; b++) for (let a = 0; a < rows.length; a++) out.d[rows[a] + cols[b] * out.r] = val.d[a + b * rows.length];
        out.isChar = target.isChar && val.isChar;
      } else throw new MError('Sunt suportate cel mult 2 dimensiuni.');
      out.shared = false;
      env.set(s.name, out);
    }
    callFunction(name, argNodes, env, nargout) {
      const args = argNodes.map(a => { if (a.k === 'colon') return Mat.str(':'); return this.evalExpr(a, env); });
      if (this.userFuncs.has(name)) return this.callFunc(this.userFuncs.get(name), args, nargout);
      const b = BUILTINS[name];
      if (!b) throw new MError("Undefined function or variable '" + name + "'.");
      return b.call(this, args, nargout);
    }
    callFunc(f, args, nargout) {
      if (f.builtin) return BUILTINS[f.builtin].call(this, args, nargout);
      if (f.name === '@' || f.inline) {
        const local = new Map(f.env || []);
        f.params.forEach((p, i) => { if (i < args.length) local.set(p, args[i]); });
        if (args.length > f.params.length) throw new MError('Too many input arguments.');
        return this.evalExprN(f.body, local, nargout);
      }
      if (args.length > f.params.length) throw new MError('Too many input arguments.');
      if (++this.callDepth > 200) { this.callDepth = 0; throw new MError('Recursie prea adâncă.'); }
      const local = new Map();
      f.params.forEach((p, i) => { if (i < args.length) local.set(p, args[i]); });
      local.set('nargin', Mat.scalar(args.length));
      local.set('nargout', Mat.scalar(nargout));
      try { this.execBlock(f.body, local); }
      catch (e) { if (!(e instanceof ReturnSig)) { this.callDepth--; throw e; } }
      this.callDepth--;
      if (f.outs.length === 0) return undefined;
      const outs = f.outs.map(o => local.get(o));
      for (let i = 0; i < Math.max(1, nargout); i++) if (outs[i] === undefined) throw new MError("Output argument '" + f.outs[i] + "' (and maybe others) not assigned during call to '" + f.name + "'.");
      return nargout <= 1 ? outs[0] : outs.slice(0, nargout);
    }
  }

  function exprToString(e) {
    switch (e.k) {
      case 'num': return String(e.v); case 'str': return "'" + e.v + "'"; case 'id': return e.v; case 'end': return 'end'; case 'colon': return ':';
      case 'paren': return '(' + exprToString(e.e) + ')';
      case 'bin': case 'sc': return exprToString(e.l) + e.op + exprToString(e.r);
      case 'un': return e.op + exprToString(e.e);
      case 'range': return exprToString(e.a) + ':' + (e.s ? exprToString(e.s) + ':' : '') + exprToString(e.b);
      case 'transpose': return exprToString(e.e) + "'";
      case 'call': return exprToString(e.target) + '(' + e.args.map(exprToString).join(',') + ')';
      case 'matrix': return '[' + e.rows.map(r => r.map(exprToString).join(',')).join(';') + ']';
      case 'anon': return '@(' + e.params.join(',') + ')' + exprToString(e.body);
      default: return '?';
    }
  }
  function collectIds(e, set) {
    if (!e || typeof e !== 'object') return;
    if (e.k === 'id') { set.add(e.v); return; }
    for (const key of Object.keys(e)) { const v = e[key]; if (Array.isArray(v)) v.forEach(x => Array.isArray(x) ? x.forEach(y => collectIds(y, set)) : collectIds(x, set)); else if (v && typeof v === 'object') collectIds(v, set); }
  }

  // ---------- Bibliotecă de funcții ----------
  const map1 = f => function (args) { if (args.length < 1) throw new MError('Not enough input arguments.'); const a = args[0]; return new Mat(a.r, a.c, a.d.map(f)); };
  const constant = v => function () { return Mat.scalar(v); };
  const sizeArgs = (args, fname) => {
    if (args.length === 0) return [1, 1];
    if (args.length === 1) { const a = args[0]; if (a.n === 2) return [a.d[0], a.d[1]]; return [num(a), num(a)]; }
    return [num(args[0]), num(args[1])];
  };
  function reduce(args, f, init, nargout, name) {
    const a = args[0]; if (!a) throw new MError('Not enough input arguments.');
    let dim = args[1] ? num(args[1]) : (a.r === 1 ? 2 : 1);
    if (a.isEmpty()) return Mat.scalar(init);
    if (dim === 1) { const out = Mat.zeros(1, a.c); for (let j = 0; j < a.c; j++) { let s = init; for (let i = 0; i < a.r; i++) s = f(s, a.get(i, j)); out.set(0, j, s); } return out; }
    const out = Mat.zeros(a.r, 1); for (let i = 0; i < a.r; i++) { let s = init; for (let j = 0; j < a.c; j++) s = f(s, a.get(i, j)); out.set(i, 0, s); } return out;
  }
  function minmax(args, nargout, cmp) {
    if (args.length >= 2 && !args[1].isEmpty()) return elementwise(args[0], args[1], (x, y) => cmp(x, y) ? x : y, 'min');
    const a = args[0]; if (!a) throw new MError('Not enough input arguments.');
    if (a.isEmpty()) return new Mat(0, 0, []);
    const along = (vals) => { let bi = 0; for (let i = 1; i < vals.length; i++) if (cmp(vals[i], vals[bi]) || Number.isNaN(vals[bi])) bi = i; return bi; };
    if (a.isVector()) { const bi = along(a.d); const v = Mat.scalar(a.d[bi]); return nargout >= 2 ? [v, Mat.scalar(bi + 1)] : v; }
    const v = Mat.zeros(1, a.c), ix = Mat.zeros(1, a.c);
    for (let j = 0; j < a.c; j++) { const col = a.d.slice(j * a.r, (j + 1) * a.r); const bi = along(col); v.set(0, j, col[bi]); ix.set(0, j, bi + 1); }
    return nargout >= 2 ? [v, ix] : v;
  }
  function sprintfImpl(fmt, vals) {
    const flat = []; vals.forEach(v => { if (v instanceof Mat) { if (v.isChar) flat.push(v.toStr()); else flat.push(...v.d); } });
    fmt = fmt.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
    let out = '', k = 0;
    const re = /%([-+ 0#]*)(\d+)?(?:\.(\d+))?([dfegsic%])/g;
    const once = () => {
      let consumed = false;
      out += fmt.replace(re, (m, flags, w, p, t) => {
        if (t === '%') return '%';
        if (k >= flat.length) { if (flat.length === 0) return ''; return ''; }
        consumed = true;
        let v = flat[k++], s;
        if (t === 's') { s = typeof v === 'string' ? v : (Number.isInteger(v) ? String(v) : String(v)); }
        else if (typeof v === 'string') s = v;
        else if (t === 'd' || t === 'i') s = Number.isInteger(v) ? String(v) : (Number.isFinite(v) ? v.toPrecision(p ? +p : 6).replace(/\.?0+$/, '') : String(v));
        else if (t === 'f') s = Number.isFinite(v) ? v.toFixed(p !== undefined ? +p : 6) : fmtNum(v);
        else if (t === 'e') s = Number.isFinite(v) ? v.toExponential(p !== undefined ? +p : 6).replace(/e([+-])(\d)$/, 'e$10$2') : fmtNum(v);
        else if (t === 'g') { const pr = p !== undefined ? +p : 6; s = Number.isFinite(v) ? Number(v.toPrecision(pr)).toString() : fmtNum(v); if (Math.abs(v) >= Math.pow(10, pr) || (Math.abs(v) < 1e-5 && v !== 0)) s = v.toExponential(pr - 1).replace(/\.?0+e/, 'e').replace(/e([+-])(\d)$/, 'e$10$2'); }
        else if (t === 'c') s = String.fromCharCode(v);
        if (w) { const width = +w; s = flags.includes('-') ? s.padEnd(width) : s.padStart(width, flags.includes('0') ? '0' : ' '); }
        return s;
      });
      return consumed;
    };
    if (!re.test(fmt) || flat.length === 0) { once(); return out; }
    re.lastIndex = 0;
    while (k < flat.length) { const before = k; if (!once()) break; if (k === before) break; }
    return out;
  }
  function polyvalArr(p, x) { let s = 0; for (const c of p) s = s * x + c; return s; }
  function conv(u, v) { const w = new Array(u.length + v.length - 1).fill(0); u.forEach((a, i) => v.forEach((b, j) => { w[i + j] += a * b; })); return w; }
  function polyRoots(p) {
    // strip leading zeros
    let c = p.slice(); while (c.length && c[0] === 0) c.shift();
    let trailing = 0; while (c.length > 1 && c[c.length - 1] === 0) { c.pop(); trailing++; }
    const n = c.length - 1;
    const roots = [];
    if (n >= 1) {
      // Durand–Kerner on complex numbers
      const a = c.map(x => x / c[0]);
      let z = []; for (let k = 0; k < n; k++) { const ang = 2 * Math.PI * k / n + 0.4; z.push([0.9 * Math.cos(ang), 0.9 * Math.sin(ang)]); }
      const cmul = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
      const cdiv = (x, y) => { const d = y[0] * y[0] + y[1] * y[1]; return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d]; };
      const peval = zz => { let s = [0, 0]; for (const co of a) { s = cmul(s, zz); s = [s[0] + co, s[1]]; } return s; };
      for (let it = 0; it < 500; it++) {
        let maxd = 0;
        for (let k = 0; k < n; k++) {
          let den = [1, 0];
          for (let j = 0; j < n; j++) if (j !== k) den = cmul(den, [z[k][0] - z[j][0], z[k][1] - z[j][1]]);
          const q = cdiv(peval(z[k]), den);
          z[k] = [z[k][0] - q[0], z[k][1] - q[1]];
          maxd = Math.max(maxd, Math.abs(q[0]) + Math.abs(q[1]));
        }
        if (maxd < 1e-14) break;
      }
      for (const r of z) roots.push(r);
    }
    for (let k = 0; k < trailing; k++) roots.push([0, 0]);
    return roots;
  }
  function fmtComplex(re, im) {
    const clean = x => Math.abs(x) < 5e-5 ? 0 : x;
    re = clean(re); im = clean(im);
    if (im === 0) return re.toFixed(4);
    const sign = im < 0 ? '-' : '+';
    return (Number.isInteger(re) ? re.toFixed(4) : fmtNum(re)) + ' ' + sign + ' ' + Math.abs(im).toFixed(4) + 'i';
  }
  function gammaFn(z) {
    if (Number.isInteger(z) && z > 0 && z < 171) { let r = 1; for (let i = 2; i < z; i++) r *= i; return r; }
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
    z -= 1; const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    let x = p[0]; for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
    const t = z + g + 0.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function callF(interp, f, x) { const r = interp.callFunc(f, [Mat.scalar(x)], 1); return num(r); }
  function callFV(interp, f, xs) { // vectorized call, falls back to scalar loop
    try { const r = interp.callFunc(f, [Mat.row(xs)], 1); if (r instanceof Mat && r.n === xs.length) return r.d.slice(); if (r instanceof Mat && r.n === 1) return xs.map(() => r.d[0]); } catch (e) { }
    return xs.map(x => callF(interp, f, x));
  }
  function adaptiveSimpson(g, a, b, eps, depth) {
    const simpson = (fa, fm, fb, a, b) => (b - a) / 6 * (fa + 4 * fm + fb);
    const rec = (a, b, fa, fm, fb, whole, eps, depth) => {
      const m = (a + b) / 2, lm = (a + m) / 2, rm = (m + b) / 2;
      const flm = g(lm), frm = g(rm);
      const left = simpson(fa, flm, fm, a, m), right = simpson(fm, frm, fb, m, b);
      if (depth <= 0 || Math.abs(left + right - whole) <= 15 * eps) return left + right + (left + right - whole) / 15;
      return rec(a, m, fa, flm, fm, left, eps / 2, depth - 1) + rec(m, b, fm, frm, fb, right, eps / 2, depth - 1);
    };
    const fa = g(a), fb = g(b), fm = g((a + b) / 2);
    return rec(a, b, fa, fm, fb, simpson(fa, fm, fb, a, b), eps, depth);
  }
  const toFunc = function (v) { if (v instanceof Func) return v; if (v instanceof Mat && v.isChar) return BUILTINS.inline.call(this, [v], 1); throw new MError('Se aștepta o funcție (inline, @ sau nume).'); };

  const BUILTINS = {
    pi: constant(Math.PI), Inf: constant(Infinity), inf: constant(Infinity), NaN: constant(NaN), nan: constant(NaN),
    eps: constant(Math.pow(2, -52)), realmax: constant(Number.MAX_VALUE), realmin: constant(2.2250738585072014e-308),
    true: constant(1), false: constant(0), intmax: constant(2147483647), intmin: constant(-2147483648),
    sin: map1(Math.sin), cos: map1(Math.cos), tan: map1(Math.tan), cot: map1(x => 1 / Math.tan(x)), sec: map1(x => 1 / Math.cos(x)), csc: map1(x => 1 / Math.sin(x)),
    asin: map1(Math.asin), acos: map1(Math.acos), atan: map1(Math.atan), acot: map1(x => Math.atan(1 / x)), asec: map1(x => Math.acos(1 / x)), acsc: map1(x => Math.asin(1 / x)),
    sinh: map1(Math.sinh), cosh: map1(Math.cosh), tanh: map1(Math.tanh),
    exp: map1(Math.exp), log: map1(Math.log), log2: map1(Math.log2), log10: map1(Math.log10), sqrt: map1(Math.sqrt), abs: map1(Math.abs),
    floor: map1(Math.floor), ceil: map1(Math.ceil), round: map1(x => Math.sign(x) * Math.round(Math.abs(x))), fix: map1(Math.trunc), sign: map1(Math.sign),
    gamma: map1(gammaFn), factorial: map1(x => gammaFn(x + 1)),
    isnan: function (args) { const r = map1(x => Number.isNaN(x) ? 1 : 0)(args); r.isLogical = true; return r; },
    isinf: function (args) { const r = map1(x => (x === Infinity || x === -Infinity) ? 1 : 0)(args); r.isLogical = true; return r; },
    isfinite: function (args) { const r = map1(x => Number.isFinite(x) ? 1 : 0)(args); r.isLogical = true; return r; },
    isempty: function (args) { return Mat.scalar(args[0] instanceof Mat && args[0].isEmpty() ? 1 : 0); },
    ischar: function (args) { return Mat.scalar(args[0] instanceof Mat && args[0].isChar ? 1 : 0); },
    isnumeric: function (args) { return Mat.scalar(args[0] instanceof Mat && !args[0].isChar ? 1 : 0); },
    not: function (args) { const r = map1(x => x === 0 ? 1 : 0)(args); r.isLogical = true; return r; },
    xor: function (args) { const r = elementwise(args[0], args[1], (x, y) => ((x !== 0) !== (y !== 0)) ? 1 : 0, 'xor'); r.isLogical = true; return r; },
    and: function (args) { const r = elementwise(args[0], args[1], (x, y) => (x !== 0 && y !== 0) ? 1 : 0, 'and'); r.isLogical = true; return r; },
    or: function (args) { const r = elementwise(args[0], args[1], (x, y) => (x !== 0 || y !== 0) ? 1 : 0, 'or'); r.isLogical = true; return r; },
    rem: function (args) { return elementwise(args[0], args[1], (x, y) => y === 0 ? NaN : x - Math.trunc(x / y) * y, 'rem'); },
    mod: function (args) { return elementwise(args[0], args[1], (x, y) => y === 0 ? x : x - Math.floor(x / y) * y, 'mod'); },
    power: function (args) { return elementwise(args[0], args[1], Math.pow, 'power'); },
    times: function (args) { return elementwise(args[0], args[1], (x, y) => x * y, 'times'); },
    zeros: function (args) { const [r, c] = sizeArgs(args); return Mat.zeros(r, c); },
    ones: function (args) { const [r, c] = sizeArgs(args); return new Mat(r, c, new Array(r * c).fill(1)); },
    eye: function (args) { const [r, c] = sizeArgs(args); const m = Mat.zeros(r, c); for (let i = 0; i < Math.min(r, c); i++) m.set(i, i, 1); return m; },
    rand: function (args) { const [r, c] = sizeArgs(args); return new Mat(r, c, Array.from({ length: r * c }, Math.random)); },
    randn: function (args) { const [r, c] = sizeArgs(args); const g = () => { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }; return new Mat(r, c, Array.from({ length: r * c }, g)); },
    randperm: function (args) { const n = num(args[0]); const a = Array.from({ length: n }, (_, i) => i + 1); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return Mat.row(a); },
    linspace: function (args) { const a = num(args[0]), b = num(args[1]), n = args[2] ? num(args[2]) : 100; if (n === 1) return Mat.scalar(b); return Mat.row(Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1))); },
    repmat: function (args) { const A = args[0]; const [m, n] = args.length === 2 ? sizeArgs([args[1]]) : [num(args[1]), num(args[2])]; const out = Mat.zeros(A.r * m, A.c * n); out.isChar = A.isChar; for (let i = 0; i < out.r; i++) for (let j = 0; j < out.c; j++) out.set(i, j, A.get(i % A.r, j % A.c)); return out; },
    size: function (args, nargout) { const a = args[0]; if (args[1]) return Mat.scalar(num(args[1]) === 1 ? a.r : a.c); if (nargout >= 2) return [Mat.scalar(a.r), Mat.scalar(a.c)]; return Mat.row([a.r, a.c]); },
    numel: function (args) { return Mat.scalar(args[0].n); },
    length: function (args) { return Mat.scalar(args[0].isEmpty() ? 0 : Math.max(args[0].r, args[0].c)); },
    ndims: function () { return Mat.scalar(2); },
    sum: function (args) { return reduce(args, (s, x) => s + x, 0); },
    prod: function (args) { return reduce(args, (s, x) => s * x, 1); },
    mean: function (args) { const a = args[0]; const s = reduce(args, (s, x) => s + x, 0); const n = (args[1] ? (num(args[1]) === 1 ? a.r : a.c) : (a.r === 1 ? a.c : a.r)); return new Mat(s.r, s.c, s.d.map(x => x / n)); },
    cumsum: function (args) { const a = args[0]; const out = a.clone(); if (a.r === 1 || a.c === 1) { let s = 0; out.d = a.d.map(x => (s += x)); } else { for (let j = 0; j < a.c; j++) { let s = 0; for (let i = 0; i < a.r; i++) { s += a.get(i, j); out.set(i, j, s); } } } return out; },
    cumprod: function (args) { const a = args[0]; const out = a.clone(); let s = 1; out.d = a.d.map(x => (s *= x)); return out; },
    diff: function (args) { const a = args[0]; if (!a.isVector()) throw new MError('diff: doar pentru vectori în această consolă.'); const d = []; for (let i = 1; i < a.n; i++) d.push(a.d[i] - a.d[i - 1]); return a.r === 1 ? Mat.row(d) : Mat.col(d); },
    max: function (args, nargout) { return minmax(args, nargout, (x, y) => x > y); },
    min: function (args, nargout) { return minmax(args, nargout, (x, y) => x < y); },
    any: function (args) { const a = args[0]; if (a.isVector() || a.isEmpty()) return Mat.scalar(a.d.some(x => x !== 0 && !Number.isNaN(x)) ? 1 : 0); return reduce(args, (s, x) => (s || (x !== 0)) ? 1 : 0, 0); },
    all: function (args) { const a = args[0]; if (a.isVector() || a.isEmpty()) return Mat.scalar(a.d.every(x => x !== 0) ? 1 : 0); return reduce(args, (s, x) => (s && (x !== 0)) ? 1 : 0, 1); },
    find: function (args, nargout) { const a = args[0]; const idx = []; a.d.forEach((v, i) => { if (v !== 0 && !Number.isNaN(v) || Number.isNaN(v)) { if (v !== 0) idx.push(i); } }); if (nargout >= 2) return [a.r === 1 ? Mat.row(idx.map(i => i % a.r + 1)) : Mat.col(idx.map(i => i % a.r + 1)), a.r === 1 ? Mat.row(idx.map(i => Math.floor(i / a.r) + 1)) : Mat.col(idx.map(i => Math.floor(i / a.r) + 1))]; return a.r === 1 ? Mat.row(idx.map(i => i + 1)) : Mat.col(idx.map(i => i + 1)); },
    sort: function (args, nargout) { const a = args[0]; const desc = args[1] && args[1].isChar && args[1].toStr() === 'descend'; const ix = a.d.map((v, i) => i).sort((i, j) => desc ? a.d[j] - a.d[i] : a.d[i] - a.d[j]); const s = new Mat(a.r, a.c, ix.map(i => a.d[i])); if (nargout >= 2) return [s, new Mat(a.r, a.c, ix.map(i => i + 1))]; return s; },
    fliplr: function (args) { const a = args[0]; const out = Mat.zeros(a.r, a.c); out.isChar = a.isChar; for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) out.set(i, a.c - 1 - j, a.get(i, j)); return out; },
    flipud: function (args) { const a = args[0]; const out = Mat.zeros(a.r, a.c); for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) out.set(a.r - 1 - i, j, a.get(i, j)); return out; },
    diag: function (args) {
      const v = args[0], k = args[1] ? num(args[1]) : 0;
      if (v.isVector() && !(v.r > 1 && v.c > 1)) { const n = v.n + Math.abs(k); const m = Mat.zeros(n, n); for (let i = 0; i < v.n; i++) { if (k >= 0) m.set(i, i + k, v.d[i]); else m.set(i - k, i, v.d[i]); } return m; }
      const out = []; for (let i = 0; i < v.r; i++) { const j = i + k; if (j >= 0 && j < v.c) out.push(v.get(i, j)); } return Mat.col(out);
    },
    trace: function (args) { const a = args[0]; let s = 0; for (let i = 0; i < Math.min(a.r, a.c); i++) s += a.get(i, i); return Mat.scalar(s); },
    det: function (args) { return Mat.scalar(det(args[0])); },
    inv: function (args) { return inv(args[0], s => this.warn(s)); },
    rank: function (args) { return Mat.scalar(rank(args[0])); },
    transpose: function (args) { return transpose(args[0]); },
    norm: function (args) { const a = args[0]; if (a.isVector()) return Mat.scalar(Math.sqrt(a.d.reduce((s, x) => s + x * x, 0))); return Mat.scalar(Math.sqrt(a.d.reduce((s, x) => s + x * x, 0))); },
    cond: function (args) { const a = args[0]; if (a.r !== a.c) throw new MError('cond: doar matrici pătrate.'); const ai = inv(a); const n2 = m => { // 2-norm via power iteration on M'M
        let v = new Array(m.c).fill(1); let lam = 0; const mt = transpose(m); for (let it = 0; it < 200; it++) { const w = matmul(mt, matmul(m, new Mat(m.c, 1, v))).d; const nrm = Math.sqrt(w.reduce((s, x) => s + x * x, 0)); if (nrm === 0) return 0; v = w.map(x => x / nrm); lam = nrm; } return Math.sqrt(lam); }; return Mat.scalar(n2(a) * n2(ai)); },
    meshgrid: function (args, nargout) { const x = args[0], y = args[1] || args[0]; const X = Mat.zeros(y.n, x.n), Y = Mat.zeros(y.n, x.n); for (let i = 0; i < y.n; i++) for (let j = 0; j < x.n; j++) { X.set(i, j, x.d[j]); Y.set(i, j, y.d[i]); } return nargout >= 2 ? [X, Y] : X; },
    // polinoame
    polyval: function (args) { const p = args[0].d, x = args[1]; return new Mat(x.r, x.c, x.d.map(v => polyvalArr(p, v))); },
    conv: function (args) { return Mat.row(conv(args[0].d, args[1].d)); },
    deconv: function (args, nargout) {
      const u = args[0].d.slice(), v = args[1].d.slice();
      if (v.length === 0 || v[0] === 0) throw new MError('First coefficient of divisor must be non-zero.');
      if (u.length < v.length) return nargout >= 2 ? [Mat.scalar(0), Mat.row(u)] : Mat.scalar(0);
      const q = new Array(u.length - v.length + 1).fill(0); const r = u.slice();
      for (let i = 0; i < q.length; i++) { q[i] = r[i] / v[0]; for (let j = 0; j < v.length; j++) r[i + j] -= q[i] * v[j]; }
      for (let i = 0; i < q.length; i++) r[i] = 0;
      return nargout >= 2 ? [Mat.row(q), Mat.row(r)] : Mat.row(q);
    },
    polyder: function (args) { const p = args[0].d; const n = p.length - 1; if (n <= 0) return Mat.scalar(0); return Mat.row(p.slice(0, n).map((c, i) => c * (n - i))); },
    polyint: function (args) { const p = args[0].d; const n = p.length; return Mat.row(p.map((c, i) => c / (n - i)).concat([0])); },
    poly: function (args) { const v = args[0]; if (v.r === v.c && v.r > 1) throw new MError('poly(A) pentru matrici nu este suportat; folosește un vector de rădăcini.'); let p = [1]; for (const r of v.d) p = conv(p, [1, -r]); return Mat.row(p); },
    roots: function (args) {
      const rs = polyRoots(args[0].d);
      const allReal = rs.every(r => Math.abs(r[1]) < 1e-9);
      if (allReal) return Mat.col(rs.map(r => Math.abs(r[0]) < 1e-12 ? 0 : r[0]));
      const m = Mat.col(rs.map(r => r[0])); m.complex = rs; m.formatted = rs.map(r => fmtComplex(r[0], r[1]));
      this.out('ans =\n\n' + rs.map(r => '  ' + fmtComplex(r[0], r[1]).padStart(18)).join('\n') + '\n\n');
      return undefined;
    },
    polyfit: function (args) {
      const x = args[0].d, y = args[1].d, n = num(args[2]);
      const A = Mat.zeros(x.length, n + 1); for (let i = 0; i < x.length; i++) for (let j = 0; j <= n; j++) A.set(i, j, Math.pow(x[i], n - j));
      const At = transpose(A); const c = solve(matmul(At, A), matmul(At, Mat.col(y)));
      return Mat.row(c.d);
    },
    interp1: function (args) {
      const x = args[0].d, y = args[1].d, xq = args[2], method = args[3] && args[3].isChar ? args[3].toStr().trim() : 'linear';
      const f = q => {
        if (q < Math.min(...x) || q > Math.max(...x)) return NaN;
        let i = 0; while (i < x.length - 2 && q > x[i + 1]) i++;
        if (method === 'nearest') { return Math.abs(q - x[i]) <= Math.abs(q - x[i + 1]) ? y[i] : y[i + 1]; }
        if (method === 'linear') return y[i] + (y[i + 1] - y[i]) * (q - x[i]) / (x[i + 1] - x[i]);
        // spline / cubic: Catmull-Rom style cubic through neighbors (approximation)
        const p0 = y[Math.max(i - 1, 0)], p1 = y[i], p2 = y[i + 1], p3 = y[Math.min(i + 2, y.length - 1)];
        const t = (q - x[i]) / (x[i + 1] - x[i]);
        return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      };
      return new Mat(xq.r, xq.c, xq.d.map(f));
    },
    // funcții utilizator
    inline: function (args) {
      const src = args[0].toStr();
      const body = new Parser(tokenize(src)).parseExpr();
      let params;
      if (args.length > 1) params = args.slice(1).map(a => a.toStr());
      else { const ids = new Set(); collectIds(body, ids); params = [...ids].filter(n => !BUILTINS[n] && !this.userFuncs.has(n) && n !== 'end').sort(); if (!params.length) params = ['x']; }
      const f = new Func(params.length ? 'inline' : 'inline', params, ['ans'], body, null); f.inline = true; f.src = src; f.name = 'f';
      return f;
    },
    feval: function (args, nargout) { const f = toFunc.call(this, args[0]); return this.callFunc(f, args.slice(1), nargout); },
    fzero: function (args) {
      const f = toFunc.call(this, args[0]); const x0 = args[1];
      const g = x => callF(this, f, x);
      let a, b;
      if (x0.n === 2) { a = x0.d[0]; b = x0.d[1]; }
      else {
        const x = num(x0); let dx = x === 0 ? 0.02 : Math.abs(x) * 0.02; a = x - dx; b = x + dx;
        let fa = g(a), fb = g(b), it = 0;
        while (fa * fb > 0 && it < 100) { dx *= 1.6; a = x - dx; b = x + dx; fa = g(a); fb = g(b); it++; }
        if (fa * fb > 0) throw new MError('fzero: nu s-a găsit o schimbare de semn în jurul lui x0.');
      }
      let fa = g(a), fb = g(b);
      if (fa * fb > 0) throw new MError('The function values at the interval endpoints must differ in sign.');
      for (let it = 0; it < 200; it++) {
        const m = (a + b) / 2, fm = g(m);
        if (fm === 0 || (b - a) / 2 < 1e-15) return Mat.scalar(m);
        if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
      }
      return Mat.scalar((a + b) / 2);
    },
    fminbnd: function (args, nargout) {
      const f = toFunc.call(this, args[0]); let a = num(args[1]), b = num(args[2]);
      const g = x => callF(this, f, x); const gr = (Math.sqrt(5) - 1) / 2;
      let c = b - gr * (b - a), d = a + gr * (b - a);
      for (let it = 0; it < 200 && Math.abs(b - a) > 1e-10; it++) { if (g(c) < g(d)) { b = d; } else { a = c; } c = b - gr * (b - a); d = a + gr * (b - a); }
      const x = (a + b) / 2; return nargout >= 2 ? [Mat.scalar(x), Mat.scalar(g(x))] : Mat.scalar(x);
    },
    quad: function (args) { const f = toFunc.call(this, args[0]); const a = num(args[1]), b = num(args[2]); return Mat.scalar(adaptiveSimpson(x => callF(this, f, x), a, b, 1e-8, 30)); },
    quadl: function (args) { return BUILTINS.quad.call(this, args); },
    dblquad: function (args) {
      const f = toFunc.call(this, args[0]); const [ax, bx, ay, by] = args.slice(1, 5).map(num);
      const inner = y => adaptiveSimpson(x => num(this.callFunc(f, [Mat.scalar(x), Mat.scalar(y)], 1)), ax, bx, 1e-6, 14);
      return Mat.scalar(adaptiveSimpson(inner, ay, by, 1e-6, 12));
    },
    triplequad: function (args) {
      const f = toFunc.call(this, args[0]); const [ax, bx, ay, by, az, bz] = args.slice(1, 7).map(num);
      const inner2 = (y, z) => adaptiveSimpson(x => num(this.callFunc(f, [Mat.scalar(x), Mat.scalar(y), Mat.scalar(z)], 1)), ax, bx, 1e-4, 8);
      const inner = z => adaptiveSimpson(y => inner2(y, z), ay, by, 1e-4, 8);
      return Mat.scalar(adaptiveSimpson(inner, az, bz, 1e-4, 8));
    },
    // I/O
    disp: function (args) { const v = args[0]; if (v instanceof Mat && v.isChar) this.out(v.toStr() + '\n'); else this.out(formatValue(v) + '\n'); return undefined; },
    fprintf: function (args) { if (!args.length) return undefined; let fmt = args[0]; if (!(fmt.isChar)) { this.out(args.map(a => formatValue(a)).join(' ') + '\n'); return undefined; } this.out(sprintfImpl(fmt.toStr(), args.slice(1))); return undefined; },
    sprintf: function (args) { return Mat.str(sprintfImpl(args[0].toStr(), args.slice(1))); },
    num2str: function (args) { const v = args[0]; if (v.isChar) return v; if (v.isScalar()) { const x = v.d[0]; return Mat.str(Number.isInteger(x) ? String(x) : String(Number(x.toPrecision(5)))); } return Mat.str(v.d.map(x => Number.isInteger(x) ? String(x) : Number(x.toPrecision(5))).join('  ')); },
    str2num: function (args) { return Mat.scalar(parseFloat(args[0].toStr())); },
    strcmp: function (args) { const a = args[0], b = args[1]; return Mat.scalar(a.isChar && b.isChar && a.toStr() === b.toStr() ? 1 : 0); },
    upper: function (args) { return Mat.str(args[0].toStr().toUpperCase()); },
    lower: function (args) { return Mat.str(args[0].toStr().toLowerCase()); },
    input: function () { throw new MError('input: consola nu poate citi de la tastatură în timpul execuției. Atribuie valoarea direct (ex: x=5).'); },
    keyboard: function () { throw new MError('keyboard: nu este disponibil aici.'); },
    error: function (args) { throw new MError(args[0] ? sprintfImpl(args[0].toStr(), args.slice(1)) : 'error'); },
    warning: function (args) { if (args[0]) this.warn('Warning: ' + args[0].toStr()); return undefined; },
    tic: function () { this.ticTime = performance.now(); return undefined; },
    toc: function (args, nargout) { const t = (performance.now() - (this.ticTime || performance.now())) / 1000; if (nargout >= 1) return Mat.scalar(t); this.out('Elapsed time is ' + t.toFixed(6) + ' seconds.\n'); return undefined; },
    clc: function () { if (this.io.clear) this.io.clear(); return undefined; },
    clear: function (args) { this.vars.clear(); return undefined; },
    whos: function () { const rows = [...this.vars.entries()].map(([k, v]) => '  ' + k.padEnd(12) + (v instanceof Mat ? v.r + 'x' + v.c : 'function')); this.out((rows.length ? rows.join('\n') : '  (nicio variabilă)') + '\n'); return undefined; },
    who: function () { this.out('Your variables are:\n\n' + [...this.vars.keys()].join('  ') + '\n\n'); return undefined; },
    exist: function (args) { const n = args[0].toStr(); return Mat.scalar(this.vars.has(n) ? 1 : (this.userFuncs.has(n) || BUILTINS[n]) ? 2 : 0); },
    // grafice
    figure: function () { this.figure = null; if (this.io.closeFigure) this.io.closeFigure(); return undefined; },
    clf: function () { this.figure = null; return undefined; },
    close: function () { this.figure = null; if (this.io.closeFigure) this.io.closeFigure(); return undefined; },
    hold: function (args) { this.holdOn = !(args[0] && args[0].isChar && args[0].toStr() === 'off'); return undefined; },
    subplot: function (args) { const m = num(args[0]), n = num(args[1]), k = num(args[2]); this.ensureFigure(); this.figure.subplot = { m, n, k }; return undefined; },
    plot: function (args) {
      const series = []; let i = 0;
      while (i < args.length) {
        let x, y, spec = '';
        if (args[i + 1] && !args[i + 1].isChar) { x = args[i].d; y = args[i + 1].d; i += 2; }
        else { y = args[i].d; x = y.map((_, k) => k + 1); i += 1; }
        if (args[i] && args[i].isChar) { spec = args[i].toStr(); i++; }
        if (x.length !== y.length) throw new MError('Vectors must be the same lengths.');
        series.push({ x: x.slice(), y: y.slice(), spec });
      }
      this.addSeries(series); return undefined;
    },
    fplot: function (args) {
      const f = toFunc.call(this, args[0]); const lim = args[1].d; const spec = args[2] && args[2].isChar ? args[2].toStr() : '';
      const n = 300; const xs = Array.from({ length: n }, (_, k) => lim[0] + (lim[1] - lim[0]) * k / (n - 1));
      const ys = callFV(this, f, xs);
      this.addSeries([{ x: xs, y: ys, spec }]); if (lim.length === 4) { this.figure.ylim = [lim[2], lim[3]]; this.plot(this.figure); } return undefined;
    },
    title: function (args) { this.ensureFigure(); this.figure.title = args[0].toStr(); this.plot(this.figure); return undefined; },
    xlabel: function (args) { this.ensureFigure(); this.figure.xlabel = args[0].toStr(); this.plot(this.figure); return undefined; },
    ylabel: function (args) { this.ensureFigure(); this.figure.ylabel = args[0].toStr(); this.plot(this.figure); return undefined; },
    legend: function (args) { this.ensureFigure(); this.figure.legend = args.map(a => a.toStr()); this.plot(this.figure); return undefined; },
    text: function (args) { this.ensureFigure(); (this.figure.texts = this.figure.texts || []).push({ x: num(args[0]), y: num(args[1]), s: args[2].toStr() }); this.plot(this.figure); return undefined; },
    axis: function (args) { this.ensureFigure(); if (args[0] && args[0].n === 4) { this.figure.xlim = [args[0].d[0], args[0].d[1]]; this.figure.ylim = [args[0].d[2], args[0].d[3]]; } this.plot(this.figure); return undefined; },
    grid: function (args) { this.ensureFigure(); this.figure.grid = !(args[0] && args[0].isChar && args[0].toStr() === 'off'); this.plot(this.figure); return undefined; },
    surf: function () { throw new MError('Graficele 3D (surf, mesh, contour, cylinder, sphere, ellipsoid) nu se pot desena în această consolă. Folosește MATLAB pentru ele.'); },
    mesh: function () { return BUILTINS.surf(); }, meshc: function () { return BUILTINS.surf(); }, surfc: function () { return BUILTINS.surf(); },
    contour: function () { return BUILTINS.surf(); }, contourf: function () { return BUILTINS.surf(); },
    cylinder: function () { return BUILTINS.surf(); }, sphere: function () { return BUILTINS.surf(); }, ellipsoid: function () { return BUILTINS.surf(); },
    sym: function () { throw new MError("Calculul simbolic nu este disponibil în această consolă."); },
    syms: function () { throw new MError("Calculul simbolic nu este disponibil în această consolă."); },
    solve: function () { return BUILTINS.sym(); }, int: function () { return BUILTINS.sym(); }, limit: function () { return BUILTINS.sym(); },
    expand: function () { return BUILTINS.sym(); }, factor: function () { return BUILTINS.sym(); }, simplify: function () { return BUILTINS.sym(); }, collect: function () { return BUILTINS.sym(); },
    eig: function (args, nargout) {
      const A = args[0]; if (A.r !== A.c) throw new MError('Matrix must be square.');
      // Unshifted QR iterations (real eigenvalues only)
      let M = A.clone(); const n = A.r;
      for (let it = 0; it < 500; it++) {
        // Gram-Schmidt QR
        const Q = Mat.zeros(n, n), R = Mat.zeros(n, n);
        for (let j = 0; j < n; j++) {
          let v = []; for (let i = 0; i < n; i++) v.push(M.get(i, j));
          for (let k = 0; k < j; k++) { let dot = 0; for (let i = 0; i < n; i++) dot += Q.get(i, k) * M.get(i, j); R.set(k, j, dot); for (let i = 0; i < n; i++) v[i] -= dot * Q.get(i, k); }
          const nrm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)); R.set(j, j, nrm);
          for (let i = 0; i < n; i++) Q.set(i, j, nrm === 0 ? 0 : v[i] / nrm);
        }
        M = matmul(R, Q);
      }
      const ev = []; for (let i = 0; i < n; i++) ev.push(M.get(i, i));
      if (nargout >= 2) {
        // eigenvectors via inverse iteration
        const V = Mat.zeros(n, n), L = Mat.zeros(n, n);
        ev.forEach((lam, k) => {
          L.set(k, k, lam);
          const B = A.clone(); for (let i = 0; i < n; i++) B.set(i, i, B.get(i, i) - lam - 1e-10);
          let v = new Mat(n, 1, Array.from({ length: n }, (_, i) => 1 + 0.1 * i));
          for (let it = 0; it < 20; it++) { v = solve(B, v); const nrm = Math.sqrt(v.d.reduce((s, x) => s + x * x, 0)); v = new Mat(n, 1, v.d.map(x => x / nrm)); }
          for (let i = 0; i < n; i++) V.set(i, k, v.d[i]);
        });
        return [V, L];
      }
      return Mat.col(ev);
    },
  };
  Interpreter.prototype.ensureFigure = function () { if (!this.figure) this.figure = { series: [], texts: [], grid: false }; };
  Interpreter.prototype.addSeries = function (series) {
    if (!this.holdOn || !this.figure) this.figure = { series: [], texts: [], grid: false };
    const fig = this.figure;
    if (!this.holdOn) { fig.title = undefined; fig.xlabel = undefined; fig.ylabel = undefined; fig.texts = []; fig.xlim = fig.ylim = undefined; }
    series.forEach(s => fig.series.push(s));
    this.plot(fig);
  };

  const HELP = {
    plot: 'Linear plot. plot(X,Y) plots vector Y versus vector X. plot(X,Y,S) with S a line/marker/color spec, e.g. \'-xr\'.',
    sum: 'Sum of elements. sum(X) for vectors; for matrices sums columns; sum(X,2) sums rows.',
    diag: 'diag(V,K) puts vector V on the K-th diagonal of a square matrix.',
    zeros: 'zeros(N,M) is an N-by-M matrix of zeros. zeros(N) is N-by-N.',
    ones: 'ones(N,M) is an N-by-M matrix of ones.',
    eye: 'eye(N) is the N-by-N identity matrix.',
    rem: 'rem(x,y) is the remainder after division x/y.',
    find: 'find(X) returns the indices of the nonzero elements of X.',
    polyfit: 'polyfit(X,Y,N) finds the coefficients of a polynomial of degree N that fits the data Y best in a least-squares sense.',
    inline: 'inline(EXPR) constructs an inline function object from the string EXPR.',
    fzero: 'fzero(F,X0) finds a zero of F near X0.',
    quad: 'quad(F,A,B) numerically integrates F from A to B.',
    fminbnd: 'fminbnd(F,X1,X2) finds a local minimizer of F in the interval X1 < X < X2.',
    conv: 'conv(A,B) convolves vectors A and B (polynomial multiplication).',
    deconv: '[Q,R] = deconv(B,A) deconvolves vector A out of vector B (polynomial division).',
    roots: 'roots(C) computes the roots of the polynomial whose coefficients are the elements of C.',
    poly: 'poly(V) is a vector whose elements are the coefficients of the polynomial whose roots are the elements of V.',
    polyval: 'polyval(P,X) evaluates polynomial P at X.',
    polyder: 'polyder(P) returns the derivative of the polynomial P.',
    interp1: 'interp1(X,Y,XI,METHOD) interpolates. METHOD: nearest, linear, spline, cubic.',
    fprintf: "fprintf(FORMAT, A, ...) writes formatted data. Formats: %d %f %e %g %s, \\n for newline.",
    gamma: 'gamma(N+1) = N! for integer N.',
    linspace: 'linspace(A,B,N) generates N points between A and B.',
    meshgrid: '[X,Y] = meshgrid(x,y) transforms the domain vectors into matrices for surf/mesh.',
    size: '[R,C] = size(X) returns the number of rows and columns.',
    any: 'any(V) is 1 if any element of V is nonzero.',
    all: 'all(V) is 1 if all elements of V are nonzero.',
    cumsum: 'cumsum(X) is the cumulative sum of the elements.',
    repmat: 'repmat(A,M,N) replicates matrix A M times vertically and N times horizontally.',
    rank: 'rank(A) is the number of linearly independent rows or columns of A.',
    cond: 'cond(A) is the condition number of A.',
    inv: 'inv(A) is the inverse of the square matrix A.',
    det: 'det(A) is the determinant of the square matrix A.',
  };

  global.MiniMatlab = { Interpreter, Mat, Func, MError, formatValue, tokenize, Parser };
})(typeof window !== 'undefined' ? window : globalThis);
