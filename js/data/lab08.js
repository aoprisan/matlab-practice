LABS.push({
  id: 8,
  title: 'Calcule simbolice cu funcții',
  blurb: 'Limite cu <code>limit</code> (inclusiv laterale și la infinit), derivate și derivate parțiale cu <code>diff</code>, primitive și integrale definite cu <code>int</code>, rezolvarea simbolică a ecuațiilor cu <code>solve</code>.',
  sections: [
    { h: 'Limite: limit', html: `
      <p>Prima formă, ${c('limit(numef)')}, unde numef este o expresie simbolică a unei funcții de x (sau numele ei), calculează limita în 0:</p>
      ${mls(`>> syms x
>> limit(sin(x)/x)
ans =
1`)}
      <p>Limita în alt punct: se indică după expresie valoarea către care tinde x. Limitele pot fi și ±∞:</p>
      ${mls(`>> limit((x^2-1)*log(x),2)
ans =
3*log(2)
>> limit(1/(x-1)^2,1)
ans =
Inf`)}
      <p><b>Limite laterale</b>: se indică variabila, punctul și ${c("'left'")} pentru stânga sau ${c("'right'")} pentru dreapta. Tot cu această formă se calculează limitele când x → ±∞:</p>
      ${mls(`>> limit(1/x,x,0,'left')
ans =
-Inf
>> limit((2-x-x^2)/(x^2+1),x,inf,'left')
ans =
-1
>> limit((1-x^3)/(x^2+1),x,-inf,'right')
ans =
Inf`)}
      <div class="warn">Consola de aici nu face calcul simbolic. Exemplele din această lucrare sunt de citit și de încercat în MATLAB.</div>` },
    { h: 'Derivate: diff', html: `
      <p>Derivata se obține cu ${c('diff')}; variabila de derivare este implicit x. Derivate de ordin superior: ordinul ca al doilea argument. Derivare în raport cu altă variabilă: numele ei între apostrofuri.</p>
      ${mls(`>> diff(x^5*log(x^2+1))
ans =
5*x^4*log(x^2+1)+2*x^6/(x^2+1)
>> diff(x^5*log(x^2+1),3)
ans =
60*x^2*log(x^2+1)+150*x^4/(x^2+1)-72*x^6/(x^2+1)^2+16*x^8/(x^2+1)^3
>> diff(t*sin(t^2+1),'t')
ans =
sin(t^2+1)+2*t^2*cos(t^2+1)`)}
      <p><b>Derivate parțiale</b>: derivăm succesiv în raport cu variabile diferite. Pentru ∂³f/∂x²∂y cu f(x, y) = x³·sin y:</p>
      ${mls(`>> diff(diff(x^3*sin(y),2),'y')
ans =
6*x*cos(y)
>> diff(diff(x^3*sin(y),'y'),2)
ans =
6*x*cos(y)`)}` },
    { h: 'Primitive și integrale: int', html: `
      <p>Primitiva se calculează cu ${c('int')}. Se observă că ${c('int')} și ${c('diff')} sunt inverse:</p>
      ${mls(`>> int(5*x^4*log(x^2+1)+2*x^6/(x^2+1))
ans =
x^5*log(x^2+1)`)}
      <p>Integrala definită: se indică limitele, care pot fi și simboluri. Se pot face astfel calcule complexe, de exemplu ∫(∫<sub>sin t</sub><sup>1</sup> 3x² dx) dt:</p>
      ${mls(`>> int(3*x^2,sin(t),cos(t))
ans =
cos(t)^3-sin(t)^3
>> int(int(3*x^2,sin(t),1),t)
ans =
t+1/3*sin(t)^2*cos(t)+2/3*cos(t)`)}` },
    { h: 'Ecuații: solve', html: `
      <p>${c('solve')} rezolvă simbolic o ecuație. Se indică <b>doar expresia eq</b> din ecuația eq = 0: toți termenii se trec în stânga. Rezolvarea în raport cu altă variabilă decât x se indică explicit.</p>
      ${mls(`>> solve('x^3-2*t*x^2+t^3')
ans =
            t
 (1/2*5^(1/2)+1/2)*t
 (1/2-1/2*5^(1/2))*t
>> solve('x^3-2*t*x^2+t^3',t)
ans =
             x
  (1/2*5^(1/2)-1/2)*x
 (-1/2-1/2*5^(1/2))*x`)}
      <p>Verificarea unei soluții a unei ecuații diferențiale se face derivând și înlocuind: pentru f(x) = (x²/2 + x + 1)e<sup>x</sup> − x − 1 și ecuația y<sup>(4)</sup> − 2y‴ + y″ = e<sup>x</sup>:</p>
      ${mls(`>> d2f=diff((x^2/2+x+1)*exp(x)-x-1,2)
>> d3f=diff((x^2/2+x+1)*exp(x)-x-1,3)
>> d4f=diff((x^2/2+x+1)*exp(x)-x-1,4)
>> collect(d4f-2*d3f+d2f)`)}` },
  ],
  cheat: [
    ['limit(f)', 'limita în 0'],
    ['limit(f,a)', 'limita în a'],
    ["limit(f,x,a,'left')", 'limita la stânga în a (idem \'right\')'],
    ["limit(f,x,inf,'left')", 'limita la +∞'],
    ['diff(f)', 'derivata în raport cu x'],
    ['diff(f,3)', 'derivata de ordin 3'],
    ["diff(f,'t')", 'derivata în raport cu t'],
    ["diff(diff(f,2),'y')", 'derivată parțială ∂³f/∂x²∂y'],
    ['int(f)', 'primitiva (inversa lui diff)'],
    ['int(f,a,b)', 'integrala definită; a, b pot fi simboluri'],
    ["solve('eq')", 'rezolvă eq = 0 în raport cu x'],
    ["solve('eq',t)", 'rezolvă în raport cu t'],
  ],
  cards: [
    { q: 'Ce dă ' + c('limit(sin(x)/x)') + ' și în ce punct calculează limita?', a: '1; forma ' + c('limit(numef)') + ' calculează limita în 0.' },
    { q: 'Cum calculezi limita lui (x²−1)·ln x când x → 2?', a: c('limit((x^2-1)*log(x),2)') + ' = 3*log(2).' },
    { q: 'Cum calculezi limita la stânga a lui 1/x în 0?', a: c("limit(1/x,x,0,'left')") + ' = -Inf. Se indică variabila, punctul și \'left\'/\'right\'.' },
    { q: 'Cum calculezi o limită când x → +∞?', a: 'Cu forma laterală: ' + c("limit((2-x-x^2)/(x^2+1),x,inf,'left')") + ' = −1. Pentru −∞: ' + c("limit(f,x,-inf,'right')") + '.' },
    { q: 'Cum calculezi derivata de ordinul 3 a unei funcții de x?', a: c('diff(f,3)') + ' – ordinul derivatei ca al doilea argument.' },
    { q: 'Cum derivezi în raport cu altă variabilă decât x?', a: 'Numele variabilei între apostrofuri: ' + c("diff(t*sin(t^2+1),'t')") + '.' },
    { q: 'Cum calculezi ∂³f/∂x²∂y pentru f = x³ sin y?', a: c("diff(diff(x^3*sin(y),2),'y')") + ' = 6*x*cos(y). Ordinea derivărilor nu contează.' },
    { q: 'Ce relație este între ' + c('int') + ' și ' + c('diff') + '?', a: 'Sunt inverse: ' + c('int(diff(f))') + ' dă înapoi f (până la o constantă).' },
    { q: 'Cum calculezi ∫<sub>sin t</sub><sup>cos t</sup> 3x² dx?', a: c('int(3*x^2,sin(t),cos(t))') + ' = cos(t)^3-sin(t)^3. Limitele pot fi simboluri.' },
    { q: 'Ce se dă ca argument lui ' + c('solve') + '?', a: 'Doar expresia eq din ecuația eq = 0, cu toți termenii trecuți în stânga: ' + c("solve('x^3-2*t*x^2+t^3')") + '. Pentru altă necunoscută: ' + c("solve('...',t)") + '.' },
  ],
  quiz: [
    { type: 'mc', q: 'În ce punct calculează limita forma ' + c('limit(sin(x)/x)') + '?', options: ['în 0', 'în 1', 'la +∞', 'trebuie indicat obligatoriu'], answer: 0, explain: 'Forma cu un singur argument calculează limita în 0; rezultatul este 1.' },
    { type: 'fill', q: 'Scrie comanda pentru limita la stânga a lui 1/x în 0.', answers: ["limit(1/x,x,0,'left')"], explain: 'Se indică variabila, punctul și partea. Rezultatul este -Inf.' },
    { type: 'mc', q: 'Cum calculezi limita unei expresii f când x → +∞?', options: [c("limit(f,x,inf,'left')"), c('limit(f,inf)') + ' nu este permis', c('limit(f,x,inf,\'right\')'), c('limit(f,0)')], answer: 0, explain: 'La +∞ ne apropiem „din stânga” (valori mai mici); la −∞ cu \'right\'.' },
    { type: 'mc', q: 'Ce dă ' + c('limit(1/(x-1)^2,1)') + '?', options: [c('Inf'), c('0'), c('1'), c('NaN')], answer: 0, explain: 'Limitele pot fi ±∞.' },
    { type: 'mc', q: 'Cum obții derivata de ordinul 3 a lui x⁵·ln(x²+1)?', options: [c('diff(x^5*log(x^2+1),3)'), c('diff(x^5*log(x^2+1))^3'), c("diff(x^5*log(x^2+1),'3')"), c('diff3(x^5*log(x^2+1))')], answer: 0, explain: 'Ordinul derivatei este al doilea argument numeric.' },
    { type: 'mc', q: 'Cum derivezi t·sin(t²+1) în raport cu t?', options: [c("diff(t*sin(t^2+1),'t')"), c('diff(t*sin(t^2+1))'), c('diff(t*sin(t^2+1),2)'), c('diff(t)')], answer: 0, explain: 'Fără indicarea variabilei, diff derivează în raport cu x (rezultatul ar fi 0).' },
    { type: 'mc', q: 'Care comandă calculează ∂³f/∂x²∂y pentru f = x³ sin y?', options: [c("diff(diff(x^3*sin(y),2),'y')"), c("diff(x^3*sin(y),3)"), c("diff(x^3*sin(y),'y',2)"), c("int(x^3*sin(y),'y')")], answer: 0, explain: 'De două ori după x, o dată după y: 6*x*cos(y).' },
    { type: 'mc', q: 'Ce dă ' + c('int(5*x^4*log(x^2+1)+2*x^6/(x^2+1))') + '?', options: [c('x^5*log(x^2+1)'), c('5*x^4*log(x^2+1)'), c('x^6/(x^2+1)'), 'o eroare'], answer: 0, explain: 'Este exact funcția a cărei derivată a fost calculată mai sus: int și diff sunt inverse.' },
    { type: 'tf', q: 'Limitele de integrare din ' + c('int(f,a,b)') + ' trebuie să fie numere.', answer: false, explain: 'Pot fi și simboluri: <code>int(3*x^2,sin(t),cos(t))</code> = cos(t)^3-sin(t)^3.' },
    { type: 'mc', q: 'Ce se transmite lui ' + c('solve') + ' pentru ecuația x³ − 2t·x² = −t³?', options: [c("solve('x^3-2*t*x^2+t^3')"), c("solve('x^3-2*t*x^2=-t^3')") + ' este singura variantă', c("solve(x^3, -2*t*x^2, -t^3)"), c("solve('-t^3')")], answer: 0, explain: 'Toți termenii se trec în stânga și se dă doar expresia eq din eq = 0.' },
    { type: 'mc', q: 'Cum rezolvi aceeași ecuație în raport cu t?', options: [c("solve('x^3-2*t*x^2+t^3',t)"), c("solve('x^3-2*t*x^2+t^3')"), c("solve(t)"), c("solve('t','x^3-2*t*x^2+t^3')")], answer: 0, explain: 'Variabila necunoscută se dă ca al doilea argument.' },
    { type: 'mc', q: 'Ce dă ' + c('limit((1-cos(x))/x^2)') + '?', options: [c('1/2'), c('0'), c('1'), c('Inf')], answer: 0, explain: 'Limită clasică: (1 − cos x)/x² → 1/2 când x → 0.' },
    { type: 'mc', q: 'Ce dă ' + c("limit(((x-1)/(x+1))^x,x,inf,'left')") + '?', options: [c('exp(-2)'), c('1'), c('0'), c('exp(2)')], answer: 0, explain: '((x−1)/(x+1))^x = (1 − 2/(x+1))^x → e⁻².' },
    { type: 'mc', q: 'Ce dă ' + c('solve(x^3+2*a*x^2-a^2*x-2*a^3)') + '?', options: [c('-a, a, -2*a'), c('a, 2a, 3a'), c('0, a, -a'), c('a^2, -a^2')], answer: 0, explain: 'x³ + 2ax² − a²x − 2a³ = (x−a)(x+a)(x+2a).' },
  ],
  exercises: (() => {
    /* lim cu indicele dedesubt și radical cu bară deasupra, doar pentru enunțurile de mai jos */
    const lim = s => '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;margin-right:3px">lim<span style="font-size:0.75em">' + s + '</span></span>';
    const sq = (s, n) => (n ? '<sup style="margin-right:-0.35em">' + n + '</sup>' : '') + '√<span style="text-decoration:overline">' + s + '</span>';
    const syms = '>> syms x y t a b h\n';
    return [
    { title: 'Limite în puncte finite', statement: `
      <p>Să se calculeze limitele:</p>
      <p>a) ${lim('x→−1')} ${frac('x<sup>3</sup> + 1', 'x<sup>2</sup> + 1')} ; b) ${lim('x→0')} ${frac(sq('x + 1') + ' − 1', sq('x + 1', 3) + ' − 1')} ; c) ${lim('x→0')} ${frac('1 − cos x', 'x<sup>2</sup>')} ; d) ${lim('x→0')} ${frac('ln(1 + x)', 'x')} .</p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> limit((x^3+1)/(x^2+1),-1)
>> limit((sqrt(x+1)-1)/((x+1)^(1/3)-1))
>> limit((1-cos(x))/x^2)
>> limit(log(1+x)/x)`)}
      <p><b>Soluții</b></p>
      <p>a) 0; b) ${frac('3', '2')}; c) ${frac('1', '2')}; d) 1</p>` },
    { title: 'Limite la infinit', statement: `
      <p>Să se calculeze limitele:</p>
      <p>a) ${lim('x→+∞')} (${sq('x + a')} − ${sq('x')}) ; b) ${lim('x→−∞')} ${frac('x<sup>3</sup> − 1', 'x<sup>3</sup> + 1')} ; c) ${lim('x→∞')} (${frac('x − 1', 'x + 1')})<sup>x</sup> ;</p>
      <p>d) ${lim('x→∞')} ${frac('ln(1 + e<sup>x</sup>)', 'x')} .</p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> limit(sqrt(x+a)-sqrt(x),x,inf,'left')
>> limit((x^3-1)/(x^3+1),x,-inf,'right')
>> limit(((x-1)/(x+1))^x,x,inf,'left')
>> limit(log(1+exp(x))/x,x,inf,'left')`)}
      <p><b>Soluții</b></p>
      <p>a) 0; b) 1; c) e<sup>−2</sup>; d) 1</p>` },
    { title: 'Derivate', statement: `
      <p>Să se calculeze:</p>
      <p>a) f′(x) dacă f(x) = 2·x·sin x − (x<sup>2</sup> − 2)·cos(x) ;</p>
      <p>b) f″(x) dacă f(x) = e<sup>x</sup>·arcsin x ;</p>
      <p>c) f‴(x) dacă f(x) = ${frac('x<sup>5</sup>', 'e<sup>x</sup>')} .</p>
      <p>d) ${frac('∂<sup>2</sup>f', '∂x∂y')} dacă f(x, y) = 3·x<sup>3</sup>·sin x + y·e<sup>x·y</sup></p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> diff(2*x*sin(x)-(x^2-2)*cos(x))
>> diff(exp(x)*asin(x),2)
>> diff(x^5/exp(x),3)
>> diff(diff(3*x^3*sin(x)+y*exp(x*y)),'y')`)}
      <p><b>Soluții</b></p>
      ${mls(`a) 2*sin(x)+(x^2-2)*sin(x)
b) exp(x)*asin(x)+2*exp(x)/(1-x^2)^(1/2)+exp(x)/(1-x^2)^(3/2)*x
c) 60*x^2/exp(x)-60*x^3/exp(x)+15*x^4/exp(x)-x^5/exp(x)
d) 2*y*exp(x*y)+y^2*x*exp(x*y)`)}` },
    { title: 'Primitive', statement: `
      <p>Să se calculeze primitivele funcțiilor:</p>
      <p>a) f(x) = x<sup>2</sup>·e<sup>x<sup>3</sup></sup> ; b) f(x) = e<sup>a·x</sup>·sin(b·x) ; c) f(x) = ${frac('x<sup>2</sup>', 'x<sup>2</sup> − 6·x + 10')} ;</p>
      <p>d) f(x) = ${frac('x<sup>2</sup>', '(x − 1)<sup>10</sup>')} .</p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> int(x^2*exp(x^3))
>> int(exp(a*x)*sin(b*x))
>> int(x^2/(x^2-6*x+10))
>> int(x^2/(x-1)^10)`)}
      <p><b>Soluții</b></p>
      ${mls(`a) 1/3*exp(x^3)
b) -b/(a^2+b^2)*exp(a*x)*cos(b*x)+a/(a^2+b^2)*exp(a*x)*sin(b*x)
c) x+3*log(x^2-6*x+10)+8*atan(x-3)
d) -1/4/(x-1)^8-1/9/(x-1)^9-1/7/(x-1)^7`)}` },
    { title: 'Ecuații simbolice', statement: `
      <p>Să se rezolve ecuațiile:</p>
      <p>a) x<sup>3</sup> + 2·a·x<sup>2</sup> − a<sup>2</sup>·x − 2·a<sup>3</sup> = 0</p>
      <p>b) x<sup>4</sup> − 6·a·x<sup>2</sup> + 8·a·${sq('a')}·x − 3·a<sup>2</sup> = 0</p>
      <p>c) (a<sup>2</sup> + b<sup>2</sup>)·x<sup>4</sup> + (−a<sup>3</sup> − a·b<sup>2</sup> + a<sup>2</sup> + b<sup>2</sup> − a·b)·x<sup>3</sup> +<br>
      &emsp;+ (−a<sup>3</sup> − a·b<sup>2</sup> + a<sup>2</sup>·b − 2·a<sup>2</sup> − 2·b<sup>2</sup> − a·b)·x<sup>2</sup> +<br>
      &emsp;+ (2·a<sup>3</sup> + 2·a·b<sup>2</sup> + a<sup>2</sup>·b + 2·a·b)·x − 2·a<sup>2</sup>·b = 0</p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> solve(x^3+2*a*x^2-a^2*x-2*a^3)
>> solve(x^4-6*a*x^2+8*a*sqrt(a)*x-3*a^2)
>> solve((a^2+b^2)*x^4+(-a^3-a*b^2+a^2+b^2-a*b)*x^3+(-a^3-a*b^2+a^2*b-2*a^2-2*b^2-a*b)*x^2+(2*a^3+2*a*b^2+a^2*b+2*a*b)*x-2*a^2*b)`)}
      <p><b>Soluții</b></p>
      ${mls(`a)
   -a
    a
 -2*a
b)
    a^(1/2)
    a^(1/2)
    a^(1/2)
 -3*a^(1/2)
c)
             1
            -2
             a
 a*b/(a^2+b^2)`)}` },
    { title: 'Verificarea unei soluții a unei ecuații diferențiale', statement: `
      <p>Să se arate că funcția f(x) = (${frac('x<sup>2</sup>', '2')} + x + 1)·e<sup>x</sup> − x − 1 este soluție a ecuației diferențiale:</p>
      <p style="text-align:center">y<sup>iv</sup> − 2·y<sup>iii</sup> + y<sup>ii</sup> = e<sup>x</sup></p>`,
      solution: `<p><b>Indicații</b></p>
      ${mls(syms + `>> d2f=diff((x^2/2+x+1)*exp(x)-x-1,2)
>> d3f=diff((x^2/2+x+1)*exp(x)-x-1,3)
>> d4f=diff((x^2/2+x+1)*exp(x)-x-1,4)
>> collect(d4f-2*d3f+d2f)`)}
      <p>Rezultatul ultimei comenzi este exp(x), deci f verifică ecuația.</p>` },
    ];
  })(),
});
