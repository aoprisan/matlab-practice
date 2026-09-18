LABS.push({
  id: 5,
  title: 'Polinoame, funcții, ecuații',
  blurb: 'Polinoamele ca vectori de coeficienți (<code>conv</code>, <code>deconv</code>, <code>roots</code>, <code>poly</code>, <code>polyval</code>, <code>polyder</code>, <code>polyfit</code>, <code>interp1</code>), funcții utilizator cu <code>inline</code> și <code>fplot</code>, <code>fminbnd</code>, <code>quad</code>, <code>fzero</code>.',
  sections: [
    { h: 'Polinoame în MATLAB', html: `
      <p>Notația obișnuită a polinoamelor este simbolică; MATLAB folosește în calcule doar un <b>vector cu coeficienții monoamelor</b>, de la gradul maxim spre termenul liber. Numărul elementelor este cu 1 mai mare decât gradul. Pentru x<sup>5</sup> − 5x + 4 vectorul este ${c('[1 0 0 0 -5 4]')}: coeficient 0 pentru monoamele care lipsesc (gradele 4, 3, 2), 6 elemente = 5 + 1. Invers, vectorul ${c('-2 0 -1 5 0 4 -2')} reprezintă −2x<sup>6</sup> − x<sup>4</sup> + 5x<sup>3</sup> + 4x − 2.</p>
      <p>Exemplele de mai jos folosesc p = x<sup>7</sup> + x<sup>6</sup> − 4x<sup>5</sup> + 6x<sup>4</sup> − x<sup>3</sup> − x<sup>2</sup> + 4x − 6 și q = x<sup>3</sup> − x<sup>2</sup> − 7x + 15.</p>
      <table><tr><th>Operație</th><th>Funcție</th></tr>
      <tr><td>înmulțire</td><td>${c('w=conv(u,v)')} – w este vectorul coeficienților produsului</td></tr>
      <tr><td>împărțire</td><td>${c('[c,r]=deconv(p,q)')} – c câtul, r restul</td></tr>
      <tr><td>rădăcini</td><td>${c('roots(p)')}</td></tr>
      <tr><td>polinomul cu rădăcini date</td><td>${c('w=poly(v)')} – v vectorul rădăcinilor</td></tr>
      <tr><td>valoarea în x0</td><td>${c('polyval(v,x0)')}</td></tr>
      <tr><td>derivata</td><td>${c('polyder(p)')}</td></tr>
      <tr><td>aproximare în sensul celor mai mici pătrate</td><td>${c('w=polyfit(x,y,n)')} – polinom de grad n pentru datele x, y</td></tr>
      <tr><td>interpolare</td><td>${c("interp1(x,y,x0,'metoda')")} – metoda: nearest, linear, spline, cubic</td></tr></table>
      ${ml(`>> p=[1 1 -4 6 -1 -1 4 -6]; q=[1 -1 -7 15];
>> conv(p,q)
>> [c,r]=deconv(p,q)
>> roots(q)
>> poly([1 1 -2])
>> polyval(p,-2)
>> polyder(p)`)}
      <p>Câtul c = x<sup>4</sup> + 2x<sup>3</sup> + 5x<sup>2</sup> + 10x + 14; restul r = 8x<sup>2</sup> − 48x − 216 (vectorul r are zerouri în față ca să aibă lungimea lui p). ${c('poly([1 1 -2])')} dă ${c('1 0 -3 2')}, adică x<sup>3</sup> − 3x + 2. ${c('polyval(p,-2)')} = 162. ${c('polyder(p)')} = 7x<sup>6</sup> + 6x<sup>5</sup> − 20x<sup>4</sup> + 24x<sup>3</sup> − 3x<sup>2</sup> − 2x + 4.</p>
      <h3>polyfit și interp1</h3>
      <p>Pentru x = 0:π/10:π și y = √x, polinomul de gradul 4 care aproximează datele este dat de ${c('polyfit(x,y,4)')}. Valoarea prin interpolare în punctul 1.1, cu cele patru metode:</p>
      ${ml(`>> x=0:pi/10:pi; y=sqrt(x);
>> polyfit(x,y,4)
>> interp1(x,y,1.1,'nearest')
>> interp1(x,y,1.1,'linear')
>> interp1(x,y,1.1,'spline')
>> sqrt(1.1)`)}
      <p>Valoarea exactă este √1.1 = 1.0488; metodele spline și cubic iau mai mult timp de calcul, dar sunt mai precise.</p>` },
    { h: 'Funcții utilizator: inline', html: `
      <p>Pentru funcții cu expresii complexe sau folosite des se recomandă definirea cu ${c('function')} (lucrare ulterioară). Pentru funcții simple sau temporare se folosește ${c('inline')}, specifică MATLAB. Funcția g(x) = ${frac('sin x', 'sin x + cos x + 4')}:</p>
      ${ml(`>> g=inline('sin(x)./(sin(x)+cos(x)+4)')
>> g(pi/2)`)}
      <table><tr><th>Ce vrei</th><th>Funcție</th></tr>
      <tr><td>graficul funcției</td><td>${c('fplot(numef,limite,specl)')} – limite este un vector cu 2 valori (pentru x) sau 4 (și pentru y); specl ca la plot</td></tr>
      <tr><td>minimul pe un interval</td><td>${c('fminbnd(numef,xmin,xmax)')}</td></tr>
      <tr><td>integrala definită</td><td>${c('quad(numef,a,b)')}</td></tr>
      <tr><td>integrale duble / triple</td><td>${c('dblquad(numef,ax,bx,ay,by)')}, ${c('triplequad(numef,ax,bx,ay,by,az,bz)')}</td></tr>
      <tr><td>zerourile (rădăcinile) funcției</td><td>${c('fzero(numef,x0)')} – rădăcina cea mai apropiată de x0</td></tr></table>
      ${ml(`>> g=inline('sin(x)./(sin(x)+cos(x)+4)');
>> fplot(g,[-pi,pi],'r')
>> fminbnd(g,-2,2)
>> quad(g,-pi/4,pi)`)}
      <p>Minimul lui g pe [−2, 2] este în −1.8235; ∫<sub>−π/4</sub><sup>π</sup> g(x) dx ≈ 0.3589.</p>
      ${ml(`>> gdbl=inline('(x+5*y)./(x.^2+y.^2+0.1)');
>> dblquad(gdbl,0,1,-2,2)
>> gtriple=inline('x.*y.*z./(x.^2+2*y.^2+3*z.^2+0.1)');
>> triplequad(gtriple,0,3,0,2,0,1)`)}
      <p>Integrala dublă ≈ 1.8241 (x ∈ [0, 1], y ∈ [−2, 2]); integrala triplă ≈ 0.5371.</p>
      ${ml(`>> gx=inline('(x.^2-1).*sin(3*x)');
>> fzero(gx,1.5)
>> fzero(gx,0.9)`)}
      <p>${c('fzero')} dă rădăcina cea mai apropiată de punctul inițial: pornind din 1.5 găsește 1.0472 (= π/3, unde sin(3x) = 0); pornind din 0.9 găsește 1 (unde x² − 1 = 0). Pentru a găsi toate rădăcinile pe un interval, desenează mai întâi graficul cu ${c('fplot')} ca să vezi unde taie axa, apoi apelează ${c('fzero')} cu puncte inițiale apropiate.</p>
      <div class="note">Pentru maximul unei funcții folosește ${c('fminbnd')} pe funcția cu semn schimbat: ${c("fminbnd(inline('-(x.^4-5*x.^2+4)./(x.^6+4)'),-1,1)")}.</div>` },
  ],
  cheat: [
    ['[1 0 0 0 -5 4]', 'x^5 − 5x + 4: coeficienți de la gradul maxim, cu 0 pentru monoamele lipsă'],
    ['conv(u,v)', 'produsul polinoamelor'],
    ['[c,r]=deconv(p,q)', 'cât și rest la împărțire'],
    ['roots(p)', 'rădăcinile'],
    ['poly(v)', 'polinomul cu rădăcinile din v'],
    ['polyval(p,x0)', 'valoarea polinomului în x0'],
    ['polyder(p)', 'derivata'],
    ['polyfit(x,y,n)', 'polinom de grad n prin cele mai mici pătrate'],
    ["interp1(x,y,x0,'metoda')", 'nearest, linear, spline, cubic (ultimele două mai precise)'],
    ["g=inline('expr')", 'funcție utilizator simplă'],
    ['fplot(g,[a b],spec)', 'graficul funcției'],
    ['fminbnd(g,a,b)', 'minimul pe [a,b]; pentru maxim, schimbă semnul funcției'],
    ['quad(g,a,b)', 'integrala definită'],
    ['dblquad, triplequad', 'integrale duble și triple'],
    ['fzero(g,x0)', 'rădăcina cea mai apropiată de x0'],
  ],
  cards: [
    { q: 'Cum reprezintă MATLAB polinomul x<sup>5</sup> − 5x + 4?', a: 'Prin vectorul coeficienților ' + c('[1 0 0 0 -5 4]') + ': de la gradul maxim la termenul liber, cu 0 pentru monoamele lipsă. Lungimea = gradul + 1.' },
    { q: 'Ce polinom reprezintă vectorul ' + c('[-2 0 -1 5 0 4 -2]') + '?', a: '−2x<sup>6</sup> − x<sup>4</sup> + 5x<sup>3</sup> + 4x − 2 (7 coeficienți ⇒ grad 6).' },
    { q: 'Cum înmulțești două polinoame?', a: c('w=conv(u,v)') + ' – convoluția vectorilor de coeficienți.' },
    { q: 'Cum împarți polinomul p la q?', a: c('[c,r]=deconv(p,q)') + ' – c este vectorul coeficienților câtului, r al restului.' },
    { q: 'Funcțiile pentru rădăcini și pentru polinomul cu rădăcini date', a: c('roots(p)') + ' dă rădăcinile; ' + c('poly(v)') + ' dă coeficienții polinomului ale cărui rădăcini sunt elementele lui v. ' + c('poly([1 1 -2])') + ' = ' + c('[1 0 -3 2]') + '.' },
    { q: 'Cum calculezi valoarea lui p în −2 și derivata lui p?', a: c('polyval(p,-2)') + ' (= 162 pentru p din lucrare); ' + c('polyder(p)') + ' dă coeficienții derivatei.' },
    { q: 'Ce face ' + c('polyfit(x,y,n)') + '?', a: 'Determină polinomul de grad n care aproximează datele experimentale x, y în sensul metodei celor mai mici pătrate.' },
    { q: 'Metodele lui ' + c('interp1') + ' și care sunt mai precise', a: c("'nearest'") + ', ' + c("'linear'") + ', ' + c("'spline'") + ', ' + c("'cubic'") + '. Ultimele două iau mai mult timp de calcul, dar sunt mai precise.' },
    { q: 'Cum definești o funcție utilizator simplă?', a: c("g=inline('sin(x)./(sin(x)+cos(x)+4)')") + ' – funcție specifică MATLAB, recomandată pentru funcții simple sau temporare; pentru cele complexe, ' + c('function') + '.' },
    { q: 'Ce fac ' + c('fplot(g,[-pi,pi],\'r\')') + ' și ce poate conține vectorul limitelor?', a: 'Desenează graficul funcției g. Limitele: 2 valori (pentru x) sau 4 valori (și pentru y). Specificatorul de linie e ca la plot.' },
    { q: 'Cum afli minimul și maximul unei funcții pe un interval?', a: 'Minimul: ' + c('fminbnd(g,xmin,xmax)') + '. Maximul: ' + c('fminbnd') + ' pe funcția cu semn schimbat.' },
    { q: 'Cum calculezi ∫<sub>a</sub><sup>b</sup> g(x) dx și integrale duble/triple?', a: c('quad(g,a,b)') + '; ' + c('dblquad(g,ax,bx,ay,by)') + '; ' + c('triplequad(g,ax,bx,ay,by,az,bz)') + '.' },
    { q: 'Ce face ' + c('fzero(g,x0)') + ' și cum găsești toate rădăcinile de pe un interval?', a: 'Calculează rădăcina lui g cea mai apropiată de x0. Desenezi graficul cu fplot, citești aproximativ punctele unde taie axa și apelezi fzero cu fiecare ca punct inițial.' },
  ],
  quiz: [
    { type: 'fill', q: 'Scrie vectorul MATLAB al polinomului x<sup>5</sup> − 5x + 4.', answers: ['[1 0 0 0 -5 4]', '[1,0,0,0,-5,4]'], explain: 'Gradul 5 ⇒ 6 coeficienți; monoamele de grad 4, 3, 2 lipsesc ⇒ 0.', placeholder: '[...]' },
    { type: 'mc', q: 'Ce polinom reprezintă vectorul ' + c('[-2 0 -1 5 0 4 -2]') + '?', options: ['−2x<sup>6</sup> − x<sup>4</sup> + 5x<sup>3</sup> + 4x − 2', '−2x<sup>7</sup> − x<sup>5</sup> + 5x<sup>4</sup> + 4x<sup>2</sup> − 2x', '−2 + 4x + 5x<sup>3</sup> − x<sup>4</sup> − 2x<sup>6</sup> … același, dar de grad 7', '−2x<sup>6</sup> − x<sup>4</sup> + 5x<sup>3</sup> + 4x<sup>2</sup> − 2'], answer: 0, explain: '7 coeficienți ⇒ grad 6; ultimul element este termenul liber.' },
    { type: 'mc', q: 'Câte elemente are vectorul unui polinom de gradul n?', options: ['n + 1', 'n', 'n − 1', '2n'], answer: 0, explain: 'Coeficienții de la x<sup>n</sup> până la x<sup>0</sup>.' },
    { type: 'mc', q: 'Care funcție înmulțește două polinoame?', options: [c('conv'), c('polymul'), c('times'), c('deconv')], answer: 0, explain: '<code>w=conv(u,v)</code>; <code>deconv</code> împarte.' },
    { type: 'mc', q: 'Ce dă ' + c('[c,r]=deconv(p,q)') + '?', options: ['c = câtul, r = restul împărțirii lui p la q', 'c = rădăcinile, r = restul', 'c = p·q, r = p/q', 'c = coeficienții derivatei, r = ai primitivei'], answer: 0, explain: 'Vectorul r are lungimea lui p, cu zerouri în față.' },
    { type: 'fill', q: 'Ce dă ' + c('poly([1 1 -2])') + '? Scrie vectorul rezultat.', answers: ['[1 0 -3 2]', '1 0 -3 2', '[1,0,-3,2]'], explain: '(x−1)²(x+2) = x³ − 3x + 2.' },
    { type: 'mc', q: 'Cum calculezi valoarea polinomului p în punctul −2?', options: [c('polyval(p,-2)'), c('p(-2)'), c('eval(p,-2)'), c('polyfit(p,-2)')], answer: 0, explain: '<code>p(-2)</code> ar fi o indexare (invalidă) a vectorului p.' },
    { type: 'mc', q: 'Ce dă ' + c('polyder([1 0 0 0 -5 4])') + '?', options: [c('5 0 0 0 -5'), c('1 0 0 0 -5'), c('5 0 0 0 -5 4'), c('0 0 0 0 -5 4')], answer: 0, explain: 'Derivata lui x⁵ − 5x + 4 este 5x⁴ − 5.' },
    { type: 'mc', q: 'Ce face ' + c('polyfit(x,y,4)') + '?', options: ['determină polinomul de grad 4 care aproximează datele x, y în sensul celor mai mici pătrate', 'evaluează un polinom de grad 4 în punctele x', 'interpolează y în 4 puncte', 'derivează de 4 ori polinomul y'], answer: 0, explain: 'Rezultatul este vectorul coeficienților polinomului de aproximare.' },
    { type: 'mc', q: 'Care metode ale lui ' + c('interp1') + ' sunt mai precise (dar mai lente)?', options: ['spline și cubic', 'nearest și linear', 'linear și spline', 'toate sunt la fel'], answer: 0, explain: 'Pentru √1.1 = 1.0488: nearest 1.0954, linear 1.0477, spline 1.0489, cubic 1.0488.' },
    { type: 'fill', q: 'Definește cu inline funcția g(x) = sin(x)/(sin(x)+cos(x)+4) (folosește ./).', answers: ["g=inline('sin(x)./(sin(x)+cos(x)+4)')", "inline('sin(x)./(sin(x)+cos(x)+4)')"], explain: 'Expresia se dă ca șir între apostrofuri; operatorii cu punct permit evaluarea pe vectori.' },
    { type: 'mc', q: 'Ce reprezintă al doilea argument din ' + c("fplot(g,[-pi,pi],'r')") + '?', options: ['limitele pentru x (2 valori) sau pentru x și y (4 valori)', 'numărul de puncte', 'intervalul de integrare', 'punctul inițial pentru fzero'], answer: 0, explain: 'Al treilea argument este specificatorul de linie, ca la plot.' },
    { type: 'mc', q: 'Cum afli <b>maximul</b> funcției f pe [−1, 1] cu funcțiile din lucrare?', options: [c('fminbnd') + ' aplicat lui −f pe [−1, 1]', c('fmaxbnd(f,-1,1)'), c('max(f)'), c('fzero(f,0)')], answer: 0, explain: 'Maximul lui f este minimul lui −f: <code>fminbnd(inline(\'-(...)\'),-1,1)</code>.' },
    { type: 'mc', q: 'Care funcție calculează ∫<sub>a</sub><sup>b</sup> g(x) dx?', options: [c('quad(g,a,b)'), c('int(g,a,b)'), c('integral(g)'), c('sum(g,a,b)')], answer: 0, explain: '<code>int</code> este integrala simbolică (Lucrarea 8); numeric se folosește <code>quad</code>.' },
    { type: 'mc', q: 'Ce dă ' + c('fzero(gx,1.5)') + ' pentru gx = (x²−1)·sin(3x)?', options: ['1.0472 (π/3), rădăcina cea mai apropiată de 1.5', '1, rădăcina lui x²−1', 'toate rădăcinile funcției', '0'], answer: 0, explain: 'fzero găsește rădăcina cea mai apropiată de x0; din 0.9 ar găsi 1.' },
    { type: 'tf', q: c('fzero(g,x0)') + ' returnează toate rădăcinile funcției g.', answer: false, explain: 'Returnează o singură rădăcină, cea mai apropiată de x0. Pentru toate rădăcinile pe un interval, folosește graficul ca să alegi mai multe puncte inițiale.' },
    { type: 'mc', q: 'Cum se numesc argumentele lui ' + c('dblquad(f,0,1,-2,2)') + '?', options: ['funcția, xmin, xmax, ymin, ymax', 'funcția, ymin, ymax, xmin, xmax', 'funcția, x0, y0, nx, ny', 'funcția, a, b, tol, n'], answer: 0, explain: 'Integrala dublă pe [0,1]×[−2,2].' },
  ],
  exercises: [
    { title: 'Operații cu polinoame', statement: `<p>P = x<sup>5</sup> − 7x<sup>3</sup> − 8x<sup>2</sup> + 2x + 12, Q = x<sup>4</sup> − 5x<sup>2</sup> + 4, T = x<sup>6</sup> + 4x<sup>4</sup> − x<sup>2</sup> − 4. a) produsul P·T·Q; b) câtul și restul la P:Q și T:Q; c) rădăcinile lui P, Q, T.</p>`, solution: `${ml(`>> p=[1 0 -7 -8 2 12]; q=[1 0 -5 0 4]; t=[1 0 4 0 -1 0 -4];
>> conv(conv(p,t),q)
>> [c,r]=deconv(p,q)
>> [c1,r1]=deconv(t,q)
>> roots(p)
>> roots(q)
>> roots(t)`)}<p>b) c = x, r = −2x<sup>3</sup> − 8x<sup>2</sup> − 2x + 12; c1 = x<sup>2</sup> + 9, r1 = 40x<sup>2</sup> − 40. c) P: 3, −2, −1±i, 1; Q: 1, −1, 2, −2; T: ±2i, 1, −1, ±i.</p>`, check: [{ var: 'p', expected: '[1 0 -7 -8 2 12]' }, { var: 'q', expected: '[1 0 -5 0 4]' }, { var: 't', expected: '[1 0 4 0 -1 0 -4]' }] },
    { title: 'Polinom cu rădăcini date', statement: `<p>a) S[x] cu rădăcinile 1, −2, 3, −4, 5; b) S(2), S(0), S(−7); c) S′(1), S′(0), S′(−1).</p>`, solution: `${ml(`>> v=[1 -2 3 -4 5]; s=poly(v)
>> polyval(s,2), polyval(s,0), polyval(s,-7)
>> polyval(polyder(s),1), polyval(polyder(s),0), polyval(polyder(s),-1)`)}<p>S = x<sup>5</sup> − 3x<sup>4</sup> − 23x<sup>3</sup> + 27x<sup>2</sup> + 166x − 120 (manualul folosește rădăcinile 1, 2, 3, −4, −5, care dau x<sup>5</sup> + 3x<sup>4</sup> − 23x<sup>3</sup> − 27x<sup>2</sup> + 166x − 120 cu S(2) = 0, S(0) = −120, S(−7) = −4320, S′(1) = 60, S′(0) = 166, S′(−1) = 144).</p>`, check: [{ var: 's', expected: 'poly([1 -2 3 -4 5])' }] },
    { title: 'Aproximare și interpolare pentru sin', statement: `<p>x = 0:π/10:π, y = sin(x). a) polinomul P<sub>4</sub> de gradul 4 care aproximează datele; b) compară P<sub>4</sub>(π/2) cu sin(π/2); c) calculează valoarea în π/2 cu toate tipurile de interpolare.</p>`, solution: `${ml(`>> x=0:pi/10:pi; y=sin(x);
>> p4=polyfit(x,y,4)
>> polyval(p4,pi/2)-sin(pi/2)
>> interp1(x,y,pi/2,'nearest')
>> interp1(x,y,pi/2,'linear')
>> interp1(x,y,pi/2,'spline')`)}<p>P<sub>4</sub> ≈ 0.0368x<sup>4</sup> − 0.2309x<sup>3</sup> + 0.0485x<sup>2</sup> + 0.9874x + 0.0002; eroarea în π/2 este 5.4·10<sup>−4</sup> &lt; 10<sup>−3</sup>. Toate interpolările dau 1 (π/2 este chiar un nod).</p>` },
    { title: 'Grafice, extreme și integrale', statement: `<p>a) graficele lui f(x) = x·sin(x) și g(x) = ln(1 + sin x) pe [−π, π] cu fplot; b) minimul lui f(x) = ${frac('x<sup>4</sup> − 5x<sup>2</sup> + 4', 'x<sup>6</sup> + 4')} pe [−3, 0]; c) maximul aceleiași funcții pe [−1, 1]; d) ∫<sub>−1</sub><sup>1</sup> x·sin(x) dx și ∫<sub>−π/3</sub><sup>π/3</sup> sin(x)·ln(1 + sin x) dx; e) ∬ x<sup>2</sup>/(y<sup>2</sup>+1) dx dy pe [0,1]²; f) ∭ 1/√(x+y+z+1) pe [0,1]³.</p>`, solution: `${ml(`>> fplot(inline('x.*sin(x)'),[-pi pi],'r')
>> fminbnd(inline('(x.^4-5*x.^2+4)./(x.^6+4)'),-3,0)
>> fminbnd(inline('-(x.^4-5*x.^2+4)./(x.^6+4)'),-1,1)
>> quad(inline('x.*sin(x)'),-1,1)
>> quad(inline('sin(x).*log(1+sin(x))'),-1,1)
>> dblquad(inline('x.^2./(y.^2+1)'),0,1,0,1)
>> triplequad(inline('1./sqrt(x+y+z+1)'),0,1,0,1,0,1)`)}<p>b) −1.3072; c) 0; d) 0.6023 și 0.6750 (manualul integrează pe [−1, 1]); e) 0.2618; f) 0.6428.</p>` },
    { title: 'Ecuații cu fzero', statement: `<p>a) x·sin(x) + cos(x) = 0, x<sub>0</sub> = 1; b) x<sup>2</sup>√(x<sup>2</sup>+3) + x·ln(x<sup>2</sup>+1) − 2 − ln 2 = 0, x<sub>0</sub> = 0.5; c) desenează f(x) = (x−1)e<sup>x</sup> sin(x) + x<sup>3</sup> − x și determină toate rădăcinile pe [−2, 2].</p>`, hint: '<p>La c) citește pe grafic aproximativ unde f taie axa Ox (în jur de −1, 0.1 și 0.9) și folosește aceste valori ca x<sub>0</sub>.</p>', solution: `${ml(`>> fzero(inline('x.*sin(x)+cos(x)'),1)
>> fzero(inline('x.^2.*sqrt(x.^2+3)+x.*log(x.^2+1)-2-log(2)'),0.5)
>> f=inline('(x-1).*exp(x).*sin(x)+x.^3-x');
>> fplot(f,[-2 2])
>> fzero(f,-1), fzero(f,0.1), fzero(f,0.9)`)}<p>a) 2.7984; b) 1; c) −1.2255, 0, 1.</p>` },
  ],
});
