{
/* radical cu bară: rad('1+x') -> √ cu linie deasupra argumentului */
/* paranteză înaltă în jurul fracțiilor: big('(', 2.4) */
const big = (ch, em) => '<span style="font-size:' + em + 'em;font-weight:200;line-height:1;vertical-align:middle">' + ch + '</span>';
const rad = s => '√<span style="border-top:1px solid currentColor;padding-top:3px;display:inline-block;line-height:1.2">' + s + '</span>';
LABS.push({
  id: 1,
  title: 'Expresii și calcule',
  blurb: 'Ferestrele MATLAB, operatorii aritmetici, variabila <code>ans</code>, funcțiile elementare, constantele speciale și de ce aproximarea numerică a derivatei se strică pentru pași foarte mici.',
  sections: [
    { h: 'Ce este MATLAB', html: `
      <p>MATLAB (MathWorks) este un program interactiv pentru calcule numerice și vizualizări: analiză numerică, calcul matriceal, prelucrarea semnalelor și grafică, într-un mediu ușor de folosit. Pentru un informatician este un <b>limbaj de programare interpretat</b> pentru calcule numerice, din aceeași clasă cu BASIC, care acceptă majoritatea instrucțiunilor C++. Manualul versiunii 5 se numea chiar „MATLAB – The Language of Technical Computing”. Lucrările folosesc versiunea 6.5 (R13).</p>` },
    { h: 'Ferestrele MATLAB', html: `
      <p>Programul se lansează din iconița de pe desktop sau din Start &gt; All Programs &gt; MATLAB. Fereastra principală are trei zone:</p>
      <ul>
        <li><b>Zona de comenzi</b> (Command Window) – aici scrii comenzi pe care MATLAB le interpretează și le execută imediat. Exemplele din lucrări sunt scrise cu caractere italice.</li>
        <li><b>Istoricul comenzilor</b> (Command History) – toate comenzile date într-o sesiune (între deschiderea și închiderea programului) și din sesiunile anterioare, fiecare sesiune separată de un rând cu data și ora. De aici poți readuce prin copy–paste secvențe scrise mai demult.</li>
        <li><b>Zona de memorie</b> (Workspace) – informații despre toate datele, constantele și variabilele existente în memorie.</li>
      </ul>
      <p>A patra fereastră, <b>fereastra grafică</b>, se deschide numai când dai o comandă din clasa comenzilor grafice.</p>
      <p>Poți închide MATLAB în patru feluri: butonul din stânga sus al ferestrei, <kbd>CTRL+Q</kbd>, meniul File &gt; Exit sau comanda ${c('exit')} tastată în zona de comenzi.</p>` },
    { h: 'Calcule simple și variabila ans', html: `
      <p>Ca orice program de modelare matematică, MATLAB face calcule aritmetice simple. La sfârșitul comenzii apeși Enter ca să o transmiți programului.</p>
      ${ml(`>> 5 + 3
ans =

     8
>> 5 - 3
>> 5 * 3
>> 5 / 3
ans =

    1.6667
>> 5 ^ 3
ans =

   125`)}
      <p>Două observații: înmulțirea și împărțirea folosesc <code>*</code> și <code>/</code>, ca în celelalte limbaje; iar rezultatul unei comenzi care nu definește o variabilă proprie este pus automat în variabila <b><code>ans</code></b>.</p>
      <p>Expresiile complicate se scriu cu paranteze, după regulile obișnuite. Pentru ${frac('5 + ' + frac('3', '7'), '3')} scriem:</p>
      ${ml(`>> (5+3/7)/3
ans =

    1.8095`)}` },
    { h: 'Funcții elementare predefinite', html: `
      <table><tr><th>Trigonometrice</th><th>Inverse</th></tr>
      <tr><td>${c('sin')} sinus, ${c('cos')} cosinus, ${c('tan')} tangentă, ${c('cot')} cotangentă, ${c('sec')} secantă, ${c('csc')} cosecantă</td>
      <td>${c('asin')}, ${c('acos')}, ${c('atan')}, ${c('acot')}, ${c('asec')}, ${c('acsc')}</td></tr></table>
      <table><tr><th>Funcții putere</th><th>Alte funcții</th></tr>
      <tr><td>${c('exp')} exponențiala, ${c('log')} logaritm natural, ${c('log2')} logaritm în baza 2, ${c('log10')} logaritm în baza 10, ${c('sqrt')} radical</td>
      <td>${c('abs')} valoarea absolută (modul), ${c('min')} minimum, ${c('max')} maximum</td></tr></table>
      <div class="warn">Atenție: în MATLAB ${c('log')} este logaritmul <b>natural</b> (ln), nu cel zecimal. Pentru lg folosești ${c('log10')}.</div>
      <p>Funcțiile se folosesc direct în expresii. Pentru ${frac('sin(π/4) + cos(π/3)', '√(5 + ln 7) − 1.5<sup>0.17</sup>')}:</p>
      ${ml(`>> (sin(pi/4)+cos(pi/3))/(sqrt(5+log(7))-1.5^0.17)
ans =

    0.7717`)}` },
    { h: 'Constante speciale', html: `
      <p>${c('pi')} este π. ${c('realmax')} și ${c('realmin')} sunt cel mai mare, respectiv cel mai mic număr real pozitiv reprezentabil. ${c('inf')} este infinit, ${c('nan')} („not a number”) este rezultatul unei nedeterminări. Operațiile cu ele urmează regulile aritmeticii în virgulă flotantă:</p>
      ${ml(`>> realmax + 2
>> inf - inf
>> nan + 2
>> realmax - realmin
>> inf / inf
>> 0 * inf`)}
      <p>${c('realmax + 2')} rămâne ${c('realmax')} (2 este prea mic ca să conteze), ${c('realmax - realmin')} rămâne ${c('realmax')}, iar toate nedeterminările (${c('inf-inf')}, ${c('inf/inf')}, ${c('0*inf')}) și orice operație cu ${c('nan')} dau ${c('NaN')}.</p>` },
    { h: 'Precizia calculelor: aproximarea derivatei', html: `
      <p>Din analiză știm că ${frac('f(x+h) − f(x)', 'h')} și ${frac('f(x+h) − f(x−h)', '2h')} tind, pentru h → 0, la derivata f′(x). Deci pentru h mic fracțiile aproximează derivata. Luând f(x) = sin x și x = π/4 (unde f′ = cos(π/4)), eroarea este:</p>
      ${ml(`>> h=1e-6;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)`)}
      <table><tr><th>h</th><th>eroare, prima formulă</th><th>eroare, a doua formulă</th></tr>
      <tr><td>10<sup>−6</sup></td><td>3.5e−7</td><td>5.3e−11</td></tr>
      <tr><td>10<sup>−8</sup></td><td>3.1e−9</td><td>3.1e−9</td></tr>
      <tr><td>10<sup>−10</sup></td><td>9.2e−7</td><td>3.7e−7</td></tr>
      <tr><td>10<sup>−12</sup></td><td>5.7e−6</td><td>6.1e−5</td></tr>
      <tr><td>10<sup>−14</sup></td><td>0.0034</td><td>0.0021</td></tr></table>
      <p>Surprinzător, fracțiile <b>nu tind</b> la derivată când h scade! Motivul: erorile de calcul se acumulează (precizia e mică pe mașinile pe 32 de biți), funcțiile ${c('sin')} și ${c('cos')} sunt și ele calculate cu erori, iar aici avem o nedeterminare 0/0 – împărțim două numere foarte mici.</p>
      <div class="note">Sfat: în astfel de calcule folosește pentru h valori la jumătatea preciziei maxime, adică 10<sup>−7</sup> sau 10<sup>−8</sup>. Precizia atinsă este atunci în jur de 10<sup>−8</sup>…10<sup>−9</sup>, satisfăcătoare pe 32 de biți; pe procesoare de 64 de biți se dublează.</div>` },
  ],
  cheat: [
    ['+ - * / ^', 'adunare, scădere, înmulțire, împărțire, ridicare la putere'],
    ['ans', 'variabila în care ajunge rezultatul unei expresii fără atribuire'],
    ['pi', 'π = 3.1416…'],
    ['sqrt(x)', 'radical'],
    ['exp(x)', 'e^x'],
    ['log(x)', 'logaritm natural (ln)'],
    ['log10(x), log2(x)', 'logaritm zecimal, în baza 2'],
    ['sin cos tan cot', 'funcții trigonometrice (argument în radiani)'],
    ['asin acos atan acot', 'funcțiile trigonometrice inverse'],
    ['abs(x)', 'modul'],
    ['realmax, realmin', 'cel mai mare / cel mai mic real pozitiv reprezentabil'],
    ['inf, nan', 'infinit, „not a number” (nedeterminare)'],
    ['exit', 'închide MATLAB (sau CTRL+Q, File > Exit)'],
  ],
  cards: [
    { q: 'În ce variabilă pune MATLAB rezultatul unei comenzi care nu definește o variabilă?', a: 'În ' + c('ans') + '. De exemplu ' + c('5+3') + ' afișează <code>ans = 8</code>.' },
    { q: 'Care sunt cele trei zone ale ferestrei principale MATLAB și la ce servesc?', a: '<b>Zona de comenzi</b> – scrii comenzi care sunt executate imediat; <b>istoricul comenzilor</b> – toate comenzile date, inclusiv din sesiuni anterioare; <b>zona de memorie</b> (workspace) – variabilele și constantele din memorie.' },
    { q: 'Când se deschide fereastra grafică?', a: 'Numai când în zona de comenzi a fost scrisă o comandă din clasa comenzilor grafice (de exemplu ' + c('plot') + ').' },
    { q: 'Patru moduri de a închide MATLAB', a: 'Butonul din stânga sus, <kbd>CTRL+Q</kbd>, File &gt; Exit, sau comanda ' + c('exit') + '.' },
    { q: 'Ce calculează ' + c('log(7)') + ' în MATLAB?', a: 'Logaritmul <b>natural</b> ln 7 = 1.9459. Logaritmul zecimal este ' + c('log10') + ', cel în baza 2 este ' + c('log2') + '.' },
    { q: 'Operatorul pentru ridicare la putere', a: c('^') + ' – de exemplu ' + c('5^3') + ' dă 125, iar ' + c('1.5^0.17') + ' este 1.5 la puterea 0.17.' },
    { q: 'Ce dau ' + c('inf-inf') + ', ' + c('inf/inf') + ', ' + c('0*inf') + ' și ' + c('nan+2') + '?', a: 'Toate dau ' + c('NaN') + ' – „not a number”, valoarea rezervată nedeterminărilor. Orice operație cu NaN dă NaN.' },
    { q: 'Ce dau ' + c('realmax+2') + ' și ' + c('realmax-realmin') + '?', a: 'Amândouă dau ' + c('realmax') + ': 2 și realmin sunt prea mici ca să schimbe cel mai mare număr reprezentabil.' },
    { q: 'Care este mai mare: 2<sup>π</sup> sau π<sup>2</sup>?', a: c('2^pi-pi^2') + ' dă −1.0446, deci 2<sup>π</sup> &lt; π<sup>2</sup>.' },
    { q: 'Ce valoare a lui h se recomandă la aproximarea numerică a derivatei și de ce?', a: 'h ≈ 10<sup>−7</sup> sau 10<sup>−8</sup> (jumătatea preciziei maxime). Pentru h mai mic erorile de rotunjire cresc: împărțim două numere foarte mici (nedeterminare 0/0) iar sin și cos sunt și ele calculate aproximativ.' },
    { q: 'Scrie comanda MATLAB pentru ' + frac('sin(π/4) + cos(π/3)', '√(5 + ln 7) − 1.5<sup>0.17</sup>'), a: c('(sin(pi/4)+cos(pi/3))/(sqrt(5+log(7))-1.5^0.17)') + ' → 0.7717' },
    { q: 'Funcțiile trigonometrice inverse în MATLAB', a: c('asin acos atan acot asec acsc') + ' (arcsinus, arccosinus, arctangentă, arccotangentă, arcsecantă, arccosecantă).' },
  ],
  quiz: [
    { type: 'mc', q: 'Ce afișează MATLAB după ' + c('>> 5 / 3') + '?', options: [c('ans = 1.6667'), c('ans = 1'), c('ans = 5/3'), c('ans = 1.67')], answer: 0, explain: 'Împărțirea dă un real, afișat implicit cu 4 zecimale (format short). Rezultatul ajunge în variabila <code>ans</code>.' },
    { type: 'mc', q: 'În ce variabilă pune MATLAB rezultatul unei comenzi care nu definește o variabilă proprie?', options: [c('ans'), c('result'), c('x'), c('out')], answer: 0, explain: '<code>ans</code> este variabila implicită a rezultatului („answer”).' },
    { type: 'fill', q: 'Scrie comanda MATLAB care calculează ' + frac('5 + ' + frac('3', '7'), '3') + ' (folosește paranteze).', answers: ['(5+3/7)/3', '(5+(3/7))/3'], explain: 'Parantezele impun ordinea: mai întâi 5 + 3/7, apoi împărțirea la 3. Rezultatul este 1.8095.', placeholder: '(...)/3' },
    { type: 'mc', q: 'Ce calculează funcția ' + c('log') + ' în MATLAB?', options: ['logaritmul natural (ln)', 'logaritmul zecimal (lg)', 'logaritmul în baza 2', 'logaritmul în orice bază, dată ca al doilea argument'], answer: 0, explain: '<code>log</code> = ln; pentru lg folosești <code>log10</code>, pentru baza 2 <code>log2</code>.' },
    { type: 'tf', q: 'Operatorul de ridicare la putere în MATLAB este ' + c('**') + '.', answer: false, explain: 'Ridicarea la putere se face cu <code>^</code>: <code>5^3</code> dă 125.' },
    { type: 'mc', q: 'Ce afișează ' + c('2^pi - pi^2') + '?', options: ['−1.0446, deci 2<sup>π</sup> &lt; π<sup>2</sup>', '1.0446, deci 2<sup>π</sup> &gt; π<sup>2</sup>', '0, cele două sunt egale', 'o eroare, pi nu poate fi exponent'], answer: 0, explain: '2^π ≈ 8.82, π² ≈ 9.87, diferența este −1.0446.' },
    { type: 'mc', q: 'Ce dă ' + c('inf - inf') + '?', options: [c('NaN'), c('0'), c('Inf'), 'o eroare'], answer: 0, explain: 'Diferența a două infinituri este o nedeterminare, reprezentată prin NaN (not a number).' },
    { type: 'mc', q: 'Ce dă ' + c('realmax + 2') + '?', options: [c('realmax') + ' (neschimbat)', c('Inf'), c('NaN'), c('realmax + 2') + ', calculat exact'], answer: 0, explain: 'realmax ≈ 1.8·10<sup>308</sup>; adunarea lui 2 nu se vede la această scară, rezultatul este tot realmax.' },
    { type: 'fill', q: 'Ce valoare afișează ' + c('(1+sqrt(5))/2') + '? (4 zecimale)', answers: ['1.6180', '1.618'], numeric: 1.618, tol: 0.001, explain: 'Este numărul de aur φ = 1.6180.' },
    { type: 'mc', q: 'Care dintre următoarele NU închide MATLAB?', options: ['comanda ' + c('quit all') + ' în zona de comenzi', 'tastarea ' + c('exit') + ' în zona de comenzi', '<kbd>CTRL+Q</kbd>', 'File &gt; Exit'], answer: 0, explain: 'Cele patru moduri din lucrare: butonul din stânga sus, CTRL+Q, File > Exit și comanda <code>exit</code>.' },
    { type: 'mc', q: 'Zona din fereastra MATLAB care păstrează comenzile date și în sesiunile anterioare, separate de un rând cu data și ora, este:', options: ['istoricul comenzilor (Command History)', 'zona de comenzi (Command Window)', 'zona de memorie (Workspace)', 'fereastra grafică'], answer: 0, explain: 'Din istoric poți readuce prin copy–paste secvențe scrise în sesiuni anterioare.' },
    { type: 'mc', q: 'Ce valoare are ' + c('5 ^ 3') + '?', options: ['125', '15', '243', '8'], answer: 0, explain: '5³ = 125.' },
    { type: 'mc', q: 'La aproximarea numerică a derivatei cu (f(x+h)−f(x))/h, de ce eroarea <b>crește</b> pentru h = 10<sup>−14</sup> față de h = 10<sup>−8</sup>?', options: ['erorile de rotunjire se acumulează: se împart două numere foarte mici (nedeterminare 0/0), iar sin și cos sunt calculate aproximativ', 'MATLAB nu poate reprezenta numere mai mici decât 10<sup>−10</sup>', 'funcția sin nu este derivabilă în π/4', 'formula este greșită; corectă este (f(x)−f(x+h))/h'], answer: 0, explain: 'De aceea se recomandă h la jumătatea preciziei maxime: 10<sup>−7</sup> sau 10<sup>−8</sup>.' },
    { type: 'mc', q: 'Care valoare a pasului h se recomandă în lucrare pentru aproximarea derivatei?', options: ['10<sup>−7</sup> sau 10<sup>−8</sup>', '10<sup>−14</sup>, cât mai mic posibil', '10<sup>−1</sup>', 'exact 0'], answer: 0, explain: 'Jumătatea preciziei maxime a mașinii; precizia obținută este ~10<sup>−8</sup>…10<sup>−9</sup>.' },
    { type: 'fill', q: 'Ce funcție MATLAB calculează arctangenta?', answers: ['atan'], explain: 'Inversele trigonometrice au prefixul <code>a</code>: asin, acos, atan, acot.' },
    { type: 'tf', q: c('0 * inf') + ' dă 0, pentru că orice înmulțit cu 0 este 0.', answer: false, explain: '0·∞ este o nedeterminare: rezultatul este <code>NaN</code>.' },
    { type: 'mc', q: 'Funcția MATLAB pentru valoarea absolută (modul) este:', options: [c('abs'), c('mod'), c('module'), c('fabs')], answer: 0, explain: '<code>abs(-3)</code> dă 3. <code>mod</code> este restul împărțirii.' },
    { type: 'mc', q: 'Ce afișează ' + c('sqrt(5+log(7))') + '? (indiciu: ln 7 ≈ 1.946)', options: ['2.6355', '2.4370', '3.3166', '1.9459'], answer: 0, explain: '√(5 + 1.9459) = √6.9459 = 2.6355.' },
  ],
  exercises: [
    { title: 'Care expresie este mai mare?', statement: `<p>Care dintre expresii este mai mare?</p>
<p>a) 2<sup>π</sup> <i>sau</i> π<sup>2</sup>;</p>
<p>b) π + ${rad('1+π<sup>2</sup>')} <i>sau</i> π<sup>1+${rad('1+π<sup>2</sup>')}</sup>;</p>
<p>c) ${big('(', 1.8)}sin ${frac('π', '3')} + cos ${frac('π', '4')}${big(')', 1.8)}<sup>π</sup> <i>sau</i> π<sup>sin(π/3)+cos(π/4)</sup>.</p>`, hint: '<p>Calculează diferența celor două expresii: semnul rezultatului spune care este mai mare.</p>', solution: `${ml(`>> 2^pi-pi^2`)}<p>a) rezultatul este −1.0446, deci 2<sup>π</sup> &lt; π<sup>2</sup>. Analog și punctele b) și c):</p>${ml(`>> pi+sqrt(1+pi^2) - pi^(1+sqrt(1+pi^2))
>> (sin(pi/3)+cos(pi/4))^pi - pi^(sin(pi/3)+cos(pi/4))`)}<p>Ambele diferențe sunt negative (−130.3997, respectiv −1.9035), deci în ambele cazuri expresia din dreapta este mai mare.</p>` },
    { title: 'Să se calculeze', statement: `<p>Să se calculeze:</p>
<p>a) ${frac('1+' + rad('5'), '2')} =</p>
<p>b) [(${rad('2')})<sup>π</sup>]<sup>√3</sup> =</p>
<p>c) |π<sup>2</sup> − 10·cos<sup>2</sup> ${frac('π', '3')}| =</p>`, solution: `${ml(`>> (1+sqrt(5))/2
>> (sqrt(2)^pi)^sqrt(3)
>> abs(pi^2-10*cos(pi/3)^2)`)}<p>a) 1.6180; b) 6.5919; c) 7.3696.</p>` },
    { title: 'Valoarea fracțiilor', statement: `<p>Să se afle valoarea fracțiilor:</p>
<p>a) ${big('(', 3)}${frac('3<sup>π</sup> − π<sup>3</sup>', frac('1+' + rad('3'), '3'))}${big(')', 3)}<sup style="vertical-align:1.6em">π/√3</sup> =</p>
<p>b) ${frac('ln(56) + sin(cos ' + rad('44.67') + ')', '<sup>3</sup>' + rad('ln(678) + lg(223.38) − tg(sin ' + frac('π', '√3') + ')'))} =</p>
<p>c) ${frac('1', '1+' + frac(rad('2'), '1+' + frac(rad('3'), '1+' + frac('2', '1+' + frac(rad('5'), '1+' + rad('6'))))))} =</p>`, hint: '<p>lg este ' + c('log10') + ', ln este ' + c('log') + ', tg este ' + c('tan') + ', radicalul de ordin 3 se scrie ' + c('x^(1/3)') + '. Pune fiecare numitor între paranteze.</p>', solution: `${ml(`>> ((3^pi-pi^3)/((1+sqrt(3))/3))^(pi/sqrt(3))
>> (log(56)+sin(cos(sqrt(44.67))))/(log(678)+log10(223.38)-tan(sin(pi/sqrt(3))))^(1/3)
>> 1/(1+sqrt(2)/(1+sqrt(3)/(1+2/(1+sqrt(5)/(1+sqrt(6))))))`)}<p>a) 0.3849; b) 2.4231; c) 0.5576.</p><div class="note">La b), valoarea 2.4231 din manual se obține pentru cos 44.67 (fără radical): ${c('(log(56)+sin(cos(44.67)))/(log(678)+log10(223.38)-tan(sin(pi/sqrt(3))))^(1/3)')}. Cu radicalul din enunț rezultatul este 2.4734.</div>` },
    { title: 'Calcule cu constante speciale', statement: `<p>Să se efectueze calculele cu constante speciale:</p>
<p>a) realmax + 2 =</p>
<p>b) inf – inf =</p>
<p>c) nan + 2 =</p>
<p>d) realmax – realmin =</p>
<p>e) inf / inf =</p>
<p>f) 0 * inf =</p>`, solution: `${ml(`>> realmax+2
>> inf-inf
>> nan+2
>> realmax-realmin
>> inf/inf
>> 0*inf`)}<p>a) realmax; b) NaN; c) NaN; d) realmax; e) NaN; f) NaN.</p>` },
    { title: 'Eroarea aproximării derivatei', statement: `<p>De la analiza matematică se știe că limitele:</p>
<p>lim<sub>h→0</sub> ${frac('f(x+h) − f(x)', 'h')} și lim<sub>h→0</sub> ${frac('f(x+h) − f(x−h)', '2·h')}</p>
<p>sunt egale cu derivata funcției în x, f′(x). Acest lucru înseamnă că dând o valoare mică pentru h fracțiile din limitele de mai sus aproximează derivata. Luând f(x)=sin x să se calculeze eroarea dintre valoarea exactă a derivatei în ${frac('π', '4')} și aceste aproximări pentru:</p>
<p>a) h=10<sup>-6</sup>;</p>
<p>b) h=10<sup>-8</sup>;</p>
<p>c) h=10<sup>-10</sup>;</p>
<p>d) h=10<sup>-12</sup>;</p>
<p>e) h=10<sup>-14</sup>.</p>
<p>Cum explicați rezultatele?</p>`, hint: '<p>Derivata exactă este cos(π/4). Eroarea este ' + c('abs(cos(pi/4) - aproximare)') + '. Definește h, apoi reia comanda pentru fiecare valoare.</p>', solution: `<p>Erorile sunt date de ${c('abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)')}, respectiv ${c('abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)')}.</p>${ml(`>> h=0.000001;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)
>> h=0.00000001;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)
>> h=0.0000000001;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)
>> h=0.000000000001;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)
>> h=1e-14;
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4))/h)
>> abs(cos(pi/4)-(sin(pi/4+h)-sin(pi/4-h))/h/2)`)}<p>Rezultatele din manual: a) 3.5344e-007 și 5.2650e-011; b) 3.0503e-009 și 3.0503e-009; c) 9.2454e-007 și 3.6942e-007; d) 5.7368e-006 și 6.1248e-005; e) 0.0034 și 0.0021.</p><p>Este surprinzător dar fracțiile nu tind la derivata în ${frac('π', '4')}!!? Motivul este în principal erorile de calcul care se acumulează (precizia este mică la mașinile pe 32 biți). De remarcat este faptul că și funcțiile elementare sin(x) și cos(x) sunt și ele calculate și au erori de aproximare. În plus aici este vorba de o nedeterminare de forma ${frac('0', '0')} și deci se împart două numere foarte mici. Ca și sfat în astfel de calcule utilizați valori pentru h la jumătatea preciziei maxime, deci 10<sup>-7</sup> sau 10<sup>-8</sup>. Se observă că precizia atinsă atunci este în jur de 10<sup>-8</sup>, 10<sup>-9</sup> o precizie satisfăcătoare pentru mașinile de 32 biți. Precizia se va dubla odată cu trecerea la procesoare pe 64 biți.</p>` },
    { title: 'Expresii pentru x = 0.5 și t = √2', statement: `<p>Pentru x=0.5 și t=${rad('2')} calculați expresiile:</p>
<p>a) (x<sup>3</sup> + 1)·ln(1 + t + t<sup>2</sup>) =</p>
<p>b) e<sup>x+t</sup>·(1 + x + cos t) =</p>
<p>c) ${frac('cos<sup>2</sup> x + arctg t', 'x + t + e<sup>x<sup>t</sup></sup>')} =</p>`, solution: `${ml(`>> x=0.5; t=sqrt(2);
>> (x^3+1)*log(1+t+t^2)
>> exp(x+t)*(1+x+cos(t))
>> ((cos(x))^2+atan(t))/(x+t+exp(x^t))`)}<p>a) 1.6704; b) 11.2300; c) 0.5121.</p>`, check: [{ var: 'x', expected: '0.5' }, { var: 't', expected: 'sqrt(2)' }] },
  ],
});
}
