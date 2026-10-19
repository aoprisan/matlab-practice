/* Ajutoare folosite de fișierele de date ale lucrărilor. Se încarcă înaintea lor. */
window.LABS = [];
window.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* cod inline: c('A(A<20)') -> <code>A(A&lt;20)</code> */
window.c = s => '<code>' + esc(s) + '</code>';
/* bloc de cod rulabil. Liniile care încep cu ">> " sunt comenzi; liniile care încep cu ".. " sunt continuarea unei comenzi
   pe mai multe linii; liniile care încep cu "%% " sunt cod ascuns (rulat, dar neafișat, ex. definiții de funcții);
   restul liniilor sunt afișate ca ieșire (dim). */
window.ml = (s, opts = {}) => '<pre class="ml' + (opts.static ? ' static' : '') + '">' + esc(s.replace(/^\n/, '').replace(/\n\s*$/, '')) + '</pre>';
/* bloc de cod static (neexecutabil), de ex. pseudo-sintaxă */
window.mls = s => ml(s, { static: true });
window.frac = (a, b) => '<span class="frac"><span>' + a + '</span><span>' + b + '</span></span>';
/* matrice afișată cu paranteze drepte: mat('5 3;3 -2') – liniile separate prin „;”, elementele prin spații */
window.mat = s => {
  const rows = s.split(';').map(r => r.trim().split(/\s+/).map(x => x.replace(/^-/, '−')));
  const n = Math.max(...rows.map(r => r.length));
  return '<span class="mat"><span class="mat-in" style="grid-template-columns:repeat(' + n + ',auto)">' +
    rows.map(r => r.map(x => '<span>' + x + '</span>').join('')).join('') + '</span></span>';
};
/* „A = matrice”, ca unitate care nu se rupe pe rânduri: eqm('A', '5 3;3 2') */
window.eqm = (name, s) => '<span class="eqm">' + name + ' = ' + mat(s) + '</span>';
/* grup de matrici pe un rând (se rupe pe ecrane înguste) */
window.mats = (...items) => '<div class="mats">' + items.join('') + '</div>';
/* sistem de ecuații cu acoladă: sys(['x+y=1', 'x−y=0']) */
window.sys = eqs => '<span class="sys">' + eqs.map(e => '<span>' + e + '</span>').join('') + '</span>';
