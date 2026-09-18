LABS.push({
  id: 6,
  title: 'Calcule simbolice cu expresii și polinoame',
  blurb: 'Datele de tip simbolic (<code>syms</code>, <code>sym</code>) și funcțiile <code>collect</code>, <code>expand</code>, <code>factor</code>, <code>simplify</code>, <code>numden</code>, <code>simple</code>. Rezultate exacte, nu aproximative.',
  sections: [
    { h: 'Date de tip simbolic', html: `
      <p>Un nou tip de date: <b>simbolic</b>. Se declară cu comanda ${c('syms')} sau cu funcția ${c('sym')}:</p>
      ${mls(`>> syms x y z
>> d=sym(2)`)}
      <p>x, y, z sunt declarate ca simboluri, iar d are valoarea 2, dar este simbol, nu număr. Diferența dintre 2 ca simbol și 2 ca număr:</p>
      ${mls(`>> 1/2+1/3
ans =
    0.8333
>> sym(1)/sym(2)+sym(1)/sym(3)
ans =
5/6`)}
      <p>Datele numerice duc la rezultate efective, datele simbolice la un rezultat simbolic (aici o fracție). Forma simbolică este un rezultat <b>exact</b>, pe când forma numerică este <b>aproximativă</b>: reprezentarea zecimală a lui 5/6 are o infinitate de zecimale.</p>
      <div class="warn">Consola acestui site nu face calcul simbolic (nu conține Symbolic Math Toolbox). Blocurile de cod din această lucrare sunt de citit și de încercat în MATLAB.</div>` },
    { h: 'Funcțiile simbolice', html: `
      <h3>collect(p, v)</h3>
      <p>Ordonează expresia p după puterile lui v. Dacă v lipsește, implicit este x.</p>
      ${mls(`>> syms x y
>> collect((x+y)*(x^2+y^2+1))
ans =
x^3+y*x^2+(y^2+1)*x+y*(y^2+1)
>> collect((x+y)*(x^2+y^2+1), y)
ans =
y^3+x*y^2+(x^2+1)*y+x*(x^2+1)`)}
      <h3>expand(p)</h3>
      <p>Scrie expresia p cu elementele ei constitutive: calculează produse de polinoame, dar desface și expresii trigonometrice, exponențiale sau logaritmice.</p>
      ${mls(`>> expand((x-2)*(x-4))
ans =
x^2-6*x+8
>> expand(cos(x+y))
ans =
cos(x)*cos(y)-sin(x)*sin(y)`)}
      <h3>factor(p)</h3>
      <p>Factorizează expresia p. Dacă p este un număr întreg, îl descompune în numere prime. Observă forma diferită a răspunsului cu și fără ${c('sym')}:</p>
      ${mls(`>> factor(x^3-y^3+x^2-y^2)
ans =
(x-y)*(x^2+x+y*x+y+y^2)
>> factor(13482)
ans =
     2     3     3     7   107
>> factor(sym(13482))
ans =
(2)*(3)^2*(7)*(107)`)}
      <h3>simplify(p)</h3>
      ${mls(`>> simplify((x^2+x-2)/(x-1))
ans =
x+2
>> simplify(sin(x)^2 + cos(x)^2)
ans =
1`)}
      <h3>[n1,n2] = numden(p)</h3>
      <p>Aduce p la o expresie rațională și dă numărătorul n1 și numitorul n2. <b>Nu face simplificări</b>, de aceea pentru valoarea finală trebuie folosită și ${c('simplify(n1/n2)')}.</p>
      ${mls(`>> [n1,n2]=numden(x/(x*y-y^2)-y/(x^2-x*y))
n1 =
x^2-y^2
n2 =
y*(x-y)*x
>> simplify(n1/n2)
ans =
(x+y)/y/x`)}
      <p>numden dă fracția ${frac('x<sup>2</sup> − y<sup>2</sup>', 'xy(x − y)')} și numai prin simplificare obținem ${frac('x + y', 'xy')}.</p>
      <h3>[r,cum] = simple(p)</h3>
      <p>Caută cea mai simplă (mai scurtă) formă a unei expresii. În r este forma găsită, în cum metoda (funcția) cu care a fost găsită.</p>
      ${mls(`>> [r,cum]=simple(cos(x)^2-sin(x)^2)
r =
cos(2*x)
cum =
combine(trig)`)}` },
  ],
  cheat: [
    ['syms x y z', 'declară simboluri'],
    ['sym(2)', '2 ca simbol (exact), nu ca număr (aproximativ)'],
    ['sym(1)/sym(2)+sym(1)/sym(3)', '5/6 (fracție exactă)'],
    ['collect(p,v)', 'ordonează după puterile lui v (implicit x)'],
    ['expand(p)', 'desface produse, expresii trigonometrice/exponențiale/logaritmice'],
    ['factor(p)', 'factorizează; pentru întregi, descompune în numere prime'],
    ['factor(sym(n))', 'descompunere afișată ca produs de puteri'],
    ['simplify(p)', 'simplifică expresia'],
    ['[n1,n2]=numden(p)', 'numărător și numitor, fără simplificare'],
    ['[r,cum]=simple(p)', 'cea mai scurtă formă r și metoda cum'],
  ],
  cards: [
    { q: 'Cum declari simbolurile x, y, z și constanta simbolică 2?', a: c('syms x y z') + ' și ' + c('d=sym(2)') + '.' },
    { q: 'Ce diferență este între ' + c('1/2+1/3') + ' și ' + c('sym(1)/sym(2)+sym(1)/sym(3)') + '?', a: 'Prima dă 0.8333 (numeric, aproximativ); a doua dă 5/6 (simbolic, exact). 5/6 are o infinitate de zecimale, deci forma numerică e doar o aproximare.' },
    { q: 'Ce face ' + c('collect(p,v)') + '?', a: 'Ordonează expresia p după puterile lui v; dacă v lipsește se consideră x. Ex.: ' + c('collect((x+y)*(x^2+y^2+1))') + ' = x^3+y*x^2+(y^2+1)*x+y*(y^2+1).' },
    { q: 'Ce face ' + c('expand(p)') + '?', a: 'Desface expresia în elementele constitutive: produse de polinoame, dar și expresii trigonometrice (' + c('expand(cos(x+y))') + ' = cos(x)*cos(y)-sin(x)*sin(y)), exponențiale, logaritmice.' },
    { q: 'Ce face ' + c('factor(p)') + ' pentru o expresie și pentru un număr întreg?', a: 'Factorizează expresia; pentru un întreg îl descompune în numere prime: ' + c('factor(13482)') + ' = 2 3 3 7 107, iar ' + c('factor(sym(13482))') + ' = (2)*(3)^2*(7)*(107).' },
    { q: 'Ce dă ' + c('simplify(sin(x)^2+cos(x)^2)') + '?', a: '1 – simplify aplică identitățile cunoscute.' },
    { q: 'Ce dă ' + c('[n1,n2]=numden(p)') + ' și ce trebuie făcut după?', a: 'Numărătorul n1 și numitorul n2 ale expresiei raționale p, <b>fără</b> simplificări. Pentru forma finală: ' + c('simplify(n1/n2)') + '.' },
    { q: 'Ce dă ' + c('[r,cum]=simple(p)') + '?', a: 'r = cea mai simplă (scurtă) formă găsită; cum = metoda/funcția cu care a fost găsită, de ex. combine(trig).' },
    { q: 'Cum obții polinomul cu rădăcina triplă 2 și rădăcina dublă −1?', a: c('expand((x-2)^3*(x+1)^2)') + ' = x^5-4*x^4+x^3+10*x^2-4*x-8.' },
    { q: 'Cum calculezi simbolic 2/3 + 4/5 + 1/7?', a: c('sym(2)/sym(3)+sym(4)/sym(5)+sym(1)/sym(7)') + ' = 169/105.' },
  ],
  quiz: [
    { type: 'mc', q: 'Ce afișează ' + c('sym(1)/sym(2)+sym(1)/sym(3)') + '?', options: [c('5/6'), c('0.8333'), c('0.83'), 'o eroare'], answer: 0, explain: 'Datele simbolice dau rezultate simbolice exacte (fracție), nu aproximări zecimale.' },
    { type: 'mc', q: 'De ce este rezultatul simbolic 5/6 „mai exact” decât 0.8333?', options: ['reprezentarea zecimală a lui 5/6 are o infinitate de zecimale, deci 0.8333 este o aproximare', 'MATLAB rotunjește greșit numerele', 'fracțiile sunt calculate pe 64 de biți', 'nu este mai exact, sunt echivalente'], answer: 0, explain: 'Forma simbolică păstrează valoarea exactă.' },
    { type: 'fill', q: 'Scrie comanda care declară x, y și z ca simboluri.', answers: ['syms x y z'], explain: 'Alternativ, <code>x=sym(\'x\')</code> pentru fiecare.' },
    { type: 'mc', q: 'Care funcție ordonează o expresie după puterile unei variabile?', options: [c('collect'), c('expand'), c('sort'), c('factor')], answer: 0, explain: '<code>collect(p,v)</code>; fără v, după puterile lui x.' },
    { type: 'mc', q: 'Ce dă ' + c('expand(cos(x+y))') + '?', options: [c('cos(x)*cos(y)-sin(x)*sin(y)'), c('cos(x)+cos(y)'), c('cos(x)*cos(y)+sin(x)*sin(y)'), 'o eroare: expand lucrează doar cu polinoame'], answer: 0, explain: '<code>expand</code> desface și expresii trigonometrice, exponențiale, logaritmice.' },
    { type: 'mc', q: 'Ce dă ' + c('expand((x-2)*(x-4))') + '?', options: [c('x^2-6*x+8'), c('x^2+6*x+8'), c('x^2-8'), c('(x-2)*(x-4)')], answer: 0, explain: '(x−2)(x−4) = x² − 6x + 8.' },
    { type: 'mc', q: 'Ce diferență este între ' + c('factor(13482)') + ' și ' + c('factor(sym(13482))') + '?', options: ['prima dă vectorul 2 3 3 7 107, a doua produsul (2)*(3)^2*(7)*(107)', 'prima dă o eroare', 'a doua dă un număr zecimal', 'nu există diferență'], answer: 0, explain: 'Cu <code>sym</code>, răspunsul este afișat ca produs simbolic de puteri.' },
    { type: 'mc', q: 'Ce dă ' + c('simplify((x^2+x-2)/(x-1))') + '?', options: [c('x+2'), c('x-2'), c('x^2+x-2'), c('1')], answer: 0, explain: 'x² + x − 2 = (x−1)(x+2).' },
    { type: 'tf', q: c('numden') + ' simplifică fracția înainte de a returna numărătorul și numitorul.', answer: false, explain: 'Nu face simplificări; pentru forma finală trebuie <code>simplify(n1/n2)</code>.' },
    { type: 'mc', q: 'Ce returnează ' + c('[r,cum]=simple(p)') + ' în ' + c('cum') + '?', options: ['metoda (funcția) cu care a fost găsită forma cea mai simplă', 'numărul de termeni ai lui r', 'expresia inițială', 'gradul polinomului'], answer: 0, explain: 'De exemplu <code>combine(trig)</code> pentru cos(x)^2−sin(x)^2 → cos(2*x).' },
    { type: 'mc', q: 'Cum dezvolți după puterile lui x expresia (x−y)(x²+y²)(x⁴−x²y²+y⁴)?', options: [c('expand((x-y)*(x^2+y^2)*(x^4-x^2*y^2+y^4))'), c('factor(...)'), c('numden(...)'), c('roots(...)')], answer: 0, explain: 'Rezultat: x^7+x*y^6-y*x^6-y^7. Merge și <code>collect</code>.' },
    { type: 'mc', q: 'Cum obții polinomul cu rădăcina triplă 2 și rădăcina dublă −1?', options: [c('expand((x-2)^3*(x+1)^2)'), c('poly([2 2 2 -1 -1])') + ' este singura variantă', c('factor((x-2)^3*(x+1)^2)'), c('simplify(x^3*x^2)')], answer: 0, explain: 'Simbolic: expand sau collect. (poly ar da coeficienții numeric, dar lucrarea cere forma simbolică.)' },
    { type: 'mc', q: 'Ce dă ' + c('simplify(sin(x)^2+cos(x)^2)') + '?', options: [c('1'), c('sin(x)^2+cos(x)^2'), c('cos(2*x)'), c('2')], answer: 0, explain: 'Identitatea fundamentală a trigonometriei.' },
    { type: 'mc', q: 'Cum calculezi simbolic 2/3 + 4/5 + 1/7?', options: [c('sym(2)/sym(3)+sym(4)/sym(5)+sym(1)/sym(7)'), c('2/3+4/5+1/7'), c("sym('2/3+4/5+1/7')") + ' nu este posibil', c('collect(2/3+4/5+1/7)')], answer: 0, explain: 'Rezultatul exact: 169/105. Varianta numerică dă 1.6095.' },
  ],
  exercises: [
    { title: 'Fracții exacte', statement: `<p>Calculează simbolic: a) 2/3 + 4/5 + 1/7; b) (1/2 + 1/3)/(1/5 + 1/7); c) fracția continuă 1 + 1/(1 + 1/(1 + 1/(1 + 1/2))).</p>`, solution: `${mls(`>> sym(2)/sym(3)+sym(4)/sym(5)+sym(1)/sym(7)
>> u=sym(1);d=sym(2);t=sym(3);c=sym(5);s=sym(7);
>> (u/d+u/t)/(u/c+u/s)
>> u+u/(u+u/(u+u/(u+u/d)))`)}<p>a) 169/105; b) 175/72; c) 13/8.</p>` },
    { title: 'Dezvoltări, polinoame și factorizări', statement: `<p>a) dezvoltă după puterile lui x: (x−y)(x²+y²)(x⁴−x²y²+y⁴); b) polinomul cu rădăcina triplă 2 și dublă −1; c) descompune în factori ireductibili polinomul de gradul 4 în x cu coeficienți în a, b din manual; d) scrie sin(6x) − cos(6x) în funcție de sin(x) și cos(x); e) descompune în numere prime 354600 și 12345678901234567890; f) factorizează a⁶ − a⁵b + a⁴b² − a²b⁴ + ab⁵ − b⁶.</p>`, solution: `${mls(`>> syms x y a b
>> expand((x-y)*(x^2+y^2)*(x^4-x^2*y^2+y^4))
>> expand((x-2)^3*(x+1)^2)
>> factor((a^2+b^2)*x^4+(-a*b-(a^2+b^2)*a+a^2+b^2)*x^3+(a^2*b-a*b-(a^2+b^2)*a-2*a^2-2*b^2)*x^2+(a^2*b+2*a*b+2*(a^2+b^2)*a)*x-2*a^2*b)
>> expand(sin(6*x)-cos(6*x))
>> factor(sym('354600'))
>> factor(sym('12345678901234567890'))
>> factor(a^6-a^5*b+a^4*b^2-b^4*a^2+b^5*a-b^6)`)}<p>a) x^7+x*y^6-y*x^6-y^7; b) x^5-4*x^4+x^3+10*x^2-4*x-8; c) (x+2)*(x-1)*(x-a)*(x*a^2+x*b^2-a*b); d) 32*sin(x)*cos(x)^5-32*sin(x)*cos(x)^3+6*sin(x)*cos(x)-32*cos(x)^6+48*cos(x)^4-18*cos(x)^2+1; e) (2)^3*(3)^2*(5)^2*(197) și (2)*(3)^2*(5)*(101)*(3803)*(3607)*(27961)*(3541); f) (-b+a)*(b+a)*(b^2+a^2)*(b^2-a*b+a^2).</p>` },
    { title: 'Expresii raționale cu numden', statement: `<p>Calculează expresiile raționale a), b), c) din manual (cu a; cu x, y; cu a, b), folosind numden și simplify.</p>`, solution: `${mls(`>> [sus,jos]=numden(a/(1-1/a)+(1-1/a)/(1/(1-a))+(1/(1-a))/a); simplify(sus/jos)
>> [sus,jos]=numden(((x^3-y^3)/(x^2+y^2)*(x^2-y^2)/(x^3+y^3)*(1/x^2+1/y^2))/(((x+y)^2-x*y)/((x-y)^2+x*y)*(1/y-1/x))); simplify(sus/jos)
>> [sus,jos]=numden(1/(a+b)^3*(1/a^3+1/b^3)+3/(a+b)^4*(1/a^2+1/b^2)+6/(a+b)^5*(1/a+1/b)); simplify(sus/jos)`)}<p>a) 3; b) (x − y)/(xy); c) 1/(a³b³).</p>` },
    { title: 'Simplificări cu simple', statement: `<p>Simplifică: a) 8cos⁴x + 8 sin x cos³x − 8cos²x − 4 sin x cos x + 1; b) cos(3·acos(x)); c) a·cos a·cos b − a·sin a·sin b + b·cos a·cos b − b·sin a·sin b.</p>`, solution: `${mls(`>> [r,how]=simple(8*cos(x)^4+8*sin(x)*cos(x)^3-8*cos(x)^2-4*sin(x)*cos(x)+1)
>> [r,how]=simple(cos(3*acos(x)))
>> simple(simple(a*cos(a)*cos(b)-a*sin(a)*sin(b)+b*cos(a)*cos(b)-b*sin(a)*sin(b)))`)}<p>a) r = cos(4*x)+sin(4*x), how = combine; b) r = 4*x^3-3*x, how = expand; c) cos(a+b)*(a+b).</p>` },
  ],
});
