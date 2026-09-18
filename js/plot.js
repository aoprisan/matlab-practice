/* Desenează o figură MATLAB 2D (plot/fplot) pe un <canvas>. */
(function (global) {
  'use strict';
  const COLORS = { r: '#d62728', g: '#2ca02c', b: '#1f4fd6', c: '#17becf', m: '#c71585', y: '#d4b800', k: '#111', w: '#fff' };
  const DEFAULT_ORDER = ['#1f4fd6', '#2ca02c', '#d62728', '#17becf', '#c71585', '#d4b800', '#111'];

  function parseSpec(spec, i) {
    const s = { color: DEFAULT_ORDER[i % DEFAULT_ORDER.length], line: null, marker: null };
    if (!spec) { s.line = '-'; return s; }
    let rest = spec;
    if (rest.includes('--')) { s.line = '--'; rest = rest.replace('--', ''); }
    else if (rest.includes('-.')) { s.line = '-.'; rest = rest.replace('-.', ''); }
    else if (rest.includes('-')) { s.line = '-'; rest = rest.replace('-', ''); }
    else if (rest.includes(':')) { s.line = ':'; rest = rest.replace(':', ''); }
    for (const ch of rest) {
      if (COLORS[ch]) s.color = COLORS[ch];
      else if ('+o*.xsd^v><ph'.includes(ch)) s.marker = ch;
    }
    if (!s.line && !s.marker) s.line = '-';
    return s;
  }

  function niceTicks(lo, hi, n) {
    if (!(hi > lo)) { hi = lo + 1; lo = lo - 1; }
    const span = hi - lo;
    const step0 = span / n;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const norm = step0 / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const ticks = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9 * span; v += step) ticks.push(Math.abs(v) < 1e-12 ? 0 : v);
    return ticks;
  }
  const fmtTick = v => { if (Number.isInteger(v)) return String(v); const s = v.toPrecision(4); return String(Number(s)); };

  function drawMarker(ctx, m, x, y) {
    const r = 4;
    ctx.beginPath();
    switch (m) {
      case 'o': ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke(); break;
      case '.': ctx.arc(x, y, 2, 0, 2 * Math.PI); ctx.fill(); break;
      case 'x': ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); break;
      case '+': ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke(); break;
      case '*': for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.moveTo(x - r * Math.cos(a), y - r * Math.sin(a)); ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.stroke(); break;
      case 's': ctx.rect(x - r, y - r, 2 * r, 2 * r); ctx.stroke(); break;
      case 'd': ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.stroke(); break;
      case '^': ctx.moveTo(x, y - r); ctx.lineTo(x + r, y + r); ctx.lineTo(x - r, y + r); ctx.closePath(); ctx.stroke(); break;
      case 'v': ctx.moveTo(x, y + r); ctx.lineTo(x + r, y - r); ctx.lineTo(x - r, y - r); ctx.closePath(); ctx.stroke(); break;
      case '>': ctx.moveTo(x + r, y); ctx.lineTo(x - r, y - r); ctx.lineTo(x - r, y + r); ctx.closePath(); ctx.stroke(); break;
      case '<': ctx.moveTo(x - r, y); ctx.lineTo(x + r, y - r); ctx.lineTo(x + r, y + r); ctx.closePath(); ctx.stroke(); break;
      case 'p': case 'h': { const n = m === 'p' ? 5 : 6; for (let k = 0; k <= n; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / n; const px = x + r * 1.2 * Math.cos(a), py = y + r * 1.2 * Math.sin(a); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); break; }
    }
  }

  function render(canvas, fig) {
    const W = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1) || 800;
    const H = canvas.height = Math.round(W * 0.58);
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = W / dpr, h = H / dpr;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    const pad = { l: 58, r: 18, t: fig.title ? 36 : 18, b: fig.xlabel ? 48 : 34 };
    const px0 = pad.l, px1 = w - pad.r, py0 = pad.t, py1 = h - pad.b;
    // limits
    let xs = [], ys = [];
    fig.series.forEach(s => { s.x.forEach((v, i) => { if (Number.isFinite(v) && Number.isFinite(s.y[i])) { xs.push(v); ys.push(s.y[i]); } }); });
    (fig.texts || []).forEach(t => { xs.push(t.x); ys.push(t.y); });
    let xlo = fig.xlim ? fig.xlim[0] : Math.min(...xs), xhi = fig.xlim ? fig.xlim[1] : Math.max(...xs);
    let ylo = fig.ylim ? fig.ylim[0] : Math.min(...ys), yhi = fig.ylim ? fig.ylim[1] : Math.max(...ys);
    if (!Number.isFinite(xlo)) { xlo = 0; xhi = 1; } if (!Number.isFinite(ylo)) { ylo = 0; yhi = 1; }
    if (xhi === xlo) { xlo -= 1; xhi += 1; }
    if (yhi === ylo) { ylo -= 1; yhi += 1; }
    if (!fig.ylim) { const yt = niceTicks(ylo, yhi, 6); if (yt.length) { const st = yt.length > 1 ? yt[1] - yt[0] : 1; ylo = Math.min(ylo, Math.floor(ylo / st) * st); yhi = Math.max(yhi, Math.ceil(yhi / st) * st); } }
    const X = v => px0 + (v - xlo) / (xhi - xlo) * (px1 - px0);
    const Y = v => py1 - (v - ylo) / (yhi - ylo) * (py1 - py0);
    // axes box
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(px0 + 0.5, py0 + 0.5, px1 - px0, py1 - py0);
    ctx.font = '11px Menlo, Consolas, monospace'; ctx.fillStyle = '#333';
    const xt = niceTicks(xlo, xhi, 8), yt = niceTicks(ylo, yhi, 6);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    xt.forEach(v => { const x = X(v); ctx.beginPath(); ctx.moveTo(x, py1); ctx.lineTo(x, py1 - 5); ctx.stroke(); if (fig.grid) { ctx.save(); ctx.strokeStyle = '#ddd'; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x, py0); ctx.lineTo(x, py1); ctx.stroke(); ctx.restore(); } ctx.fillText(fmtTick(v), x, py1 + 6); });
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    yt.forEach(v => { const y = Y(v); ctx.beginPath(); ctx.moveTo(px0, y); ctx.lineTo(px0 + 5, y); ctx.stroke(); if (fig.grid) { ctx.save(); ctx.strokeStyle = '#ddd'; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(px0, y); ctx.lineTo(px1, y); ctx.stroke(); ctx.restore(); } ctx.fillText(fmtTick(v), px0 - 6, y); });
    // series
    ctx.save(); ctx.beginPath(); ctx.rect(px0, py0, px1 - px0, py1 - py0); ctx.clip();
    fig.series.forEach((s, i) => {
      const sp = parseSpec(s.spec, i);
      ctx.strokeStyle = sp.color; ctx.fillStyle = sp.color; ctx.lineWidth = 1.4;
      if (sp.line) {
        ctx.setLineDash(sp.line === '--' ? [8, 5] : sp.line === ':' ? [2, 4] : sp.line === '-.' ? [8, 4, 2, 4] : []);
        ctx.beginPath(); let pen = false;
        s.x.forEach((v, k) => { const yv = s.y[k]; if (!Number.isFinite(v) || !Number.isFinite(yv)) { pen = false; return; } const x = X(v), y = Y(yv); pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; });
        ctx.stroke(); ctx.setLineDash([]);
      }
      if (sp.marker) {
        const step = Math.max(1, Math.floor(s.x.length / 400));
        for (let k = 0; k < s.x.length; k += step) { if (Number.isFinite(s.x[k]) && Number.isFinite(s.y[k])) drawMarker(ctx, sp.marker, X(s.x[k]), Y(s.y[k])); }
      }
    });
    ctx.restore();
    // texts
    ctx.fillStyle = '#111'; ctx.font = '12px -apple-system, Segoe UI, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    (fig.texts || []).forEach(t => ctx.fillText(t.s, X(t.x) + 2, Y(t.y)));
    // labels
    ctx.textAlign = 'center';
    if (fig.title) { ctx.font = 'bold 13px -apple-system, Segoe UI, Arial, sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(fig.title, (px0 + px1) / 2, 10); }
    ctx.font = '12px -apple-system, Segoe UI, Arial, sans-serif';
    if (fig.xlabel) { ctx.textBaseline = 'bottom'; ctx.fillText(fig.xlabel, (px0 + px1) / 2, h - 6); }
    if (fig.ylabel) { ctx.save(); ctx.translate(14, (py0 + py1) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = 'middle'; ctx.fillText(fig.ylabel, 0, 0); ctx.restore(); }
    if (fig.legend && fig.legend.length) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      fig.legend.forEach((name, i) => { const sp = parseSpec((fig.series[i] || {}).spec, i); const y = py0 + 14 + i * 16; ctx.strokeStyle = sp.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px1 - 110, y); ctx.lineTo(px1 - 86, y); ctx.stroke(); ctx.fillStyle = '#111'; ctx.fillText(name, px1 - 80, y); });
    }
  }
  global.MiniPlot = { render };
})(window);
