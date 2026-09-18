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
