LABS.push({
  id: 9,
  title: 'Operatori relaționali și logici',
  blurb: 'Cei 6 operatori relaționali, operatorii logici <code>&amp;</code>, <code>|</code>, <code>~</code>, <code>xor</code>, indexarea logică, funcțiile <code>any</code>, <code>all</code>, <code>find</code>, <code>isnan</code>, <code>isfinite</code>, și trucul cu <code>eps</code> pentru evitarea împărțirii cu zero.',
  sections: [
    { h: 'Operatorii relaționali', html: `
      <p>Operatorii relaționali și logici creează expresiile logice necesare fluxului unui program. Ca date de intrare acceptă doar date numerice: orice număr <b>diferit de 0</b> este interpretat ca „adevărat” (A), iar <b>0</b> ca „fals” (F). Datele de ieșire sunt numai 1 sau 0, interpretate ca A, respectiv F.</p>
      <table><tr><th>Operator</th><th>Semnificație</th></tr>
      <tr><td>${c('<')}</td><td>mai mic</td></tr><tr><td>${c('<=')}</td><td>mai mic sau egal</td></tr>
      <tr><td>${c('>')}</td><td>mai mare</td></tr><tr><td>${c('>=')}</td><td>mai mare sau egal</td></tr>
      <tr><td>${c('==')}</td><td>egal</td></tr><tr><td>${c('~=')}</td><td>diferit</td></tr></table>
      <p>Pot compara: a) <b>două matrici de aceeași dimensiune</b> – rezultatul este o matrice de aceeași dimensiune, comparația se face element cu element, cu 1 unde condiția e verificată și 0 unde nu; b) <b>o matrice cu un scalar</b> – fiecare element se compară cu scalarul.</p>
      ${ml(`>> A=[1 0 -2 10 0;-5 30 -10 0 1;2 0 1 1 1;-1 3 2 0 0]
>> B=2*A;
>> A>0
>> A==B`)}
      <div class="warn">Egalitatea se testează cu ${c('==')}; un singur ${c('=')} este atribuire.</div>` },
    { h: 'Indexarea logică', html: `
      <p>Indicii de accesare pot fi nu numai scalari, ci și vectori și chiar matrici (Lucrarea 2). Cum rezultatul unei comparații este o matrice, o putem folosi ca indice: <b>indexare logică</b>. Rezultatul este un vector cu elementele care verifică condiția, în ordinea coloanelor.</p>
      ${ml(`>> A=[1 0 -2 10 0;-5 30 -10 0 1;2 0 1 1 1;-1 3 2 0 0];
>> A(A>5)`)}
      <p>Doar două elemente sunt mai mari ca 5: 30 și 10. Toate elementele lui A se pot accesa cu ${c('A(A==A)')} (o condiție adevărată pentru fiecare element) sau, mai scurt și mai rapid, cu ${c('A(:)')}.</p>` },
    { h: 'Operatorii logici', html: `
      <table><tr><th>Operator</th><th>Semnificație</th></tr>
      <tr><td>${c('&')}</td><td>și (and)</td></tr><tr><td>${c('|')}</td><td>ori (or)</td></tr><tr><td>${c('~')}</td><td>nu (not)</td></tr>
      <tr><td>${c('xor(A,B)')}</td><td>sau exclusiv (definit ca funcție)</td></tr></table>
      <table><tr><th>A</th><th>B</th><th>A&amp;B</th><th>A|B</th><th>~A</th><th>xor(A,B)</th></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
      <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
      <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
      <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td></tr></table>
      <p>Elementele lui A din intervalul (1, 20): ${c('A((A>1)&(A<20))')} dă 2, 3, 2, 10 (în ordinea coloanelor). Elementele din afara intervalului, în două feluri: negând expresia, ${c('A(~((A>1)&(A<20)))')}, sau cu ${c('|')}: ${c('A((A<=1)|(A>=20))')}.</p>
      ${ml(`>> A=[1 0 -2 10 0;-5 30 -10 0 1;2 0 1 1 1;-1 3 2 0 0];
>> A((A>1)&(A<20))'
>> A(~((A>1)&(A<20)))'
>> A((A<=1)|(A>=20))'`)}` },
    { h: 'Funcții relaționale și logice', html: `
      <table><tr><th>Funcție</th><th>Răspuns</th></tr>
      <tr><td>${c('any(v)')}</td><td>1 dacă v are cel puțin un element nenul, 0 dacă toate sunt 0</td></tr>
      <tr><td>${c('all(v)')}</td><td>1 dacă toate elementele lui v sunt nenule, 0 dacă există cel puțin unul nul</td></tr>
      <tr><td>${c('find(x)')}</td><td>vectorul indicilor elementelor nenule ale lui x</td></tr>
      <tr><td>${c('isnan(x)')}</td><td>vector de aceeași dimensiune cu x, cu 1 unde elementul este NaN</td></tr>
      <tr><td>${c('isfinite(x)')}</td><td>1 unde elementul este finit; NaN este considerat nefinit</td></tr></table>
      <table><tr><th>v</th><th>any(v)</th><th>all(v)</th></tr>
      <tr><td>[0 1 2]</td><td>1</td><td>0</td></tr><tr><td>[1 2 3]</td><td>1</td><td>1</td></tr><tr><td>[0 0 0]</td><td>0</td><td>0</td></tr></table>
      ${ml(`>> any([0 1 2]), all([0 1 2])
>> find([0 3 0 5])
>> v=[1 NaN inf -inf]
>> isfinite(v)
>> isnan(v)`)}` },
    { h: 'Evitarea împărțirii cu zero', html: `
      <p>Când un vector are elemente 0, calculele pot ajunge la operații interzise. Unde am avut 0 obținem NaN, ceea ce strică rezultatele ulterioare (de exemplu suma elementelor).</p>
      ${ml(`>> x=[7 3 0 5 -2 0 -1 0 pi];
>> y=sin(x)./x`)}
      <p>Ieșirea din situație: în locul lui 0 punem cea mai mică valoare relativă pozitivă reprezentabilă, ${c('eps')} = 2<sup>−52</sup> ≈ 2.2204·10<sup>−16</sup>. Comanda de înlocuire folosește indexarea logică aritmetic: ${c('x==0')} este 1 exact pe pozițiile nule.</p>
      ${ml(`>> x=[7 3 0 5 -2 0 -1 0 pi];
>> x=x+(x==0)*eps;
>> sin(x)./x`)}
      <p>Acum pe pozițiile foste 0 obținem 1.0000, limita lui sin(x)/x în 0.</p>
      <h3>Modificarea selectivă a elementelor</h3>
      <p>Indexarea logică merge și la atribuire. Pentru x = [3 15 9 12 −1 0 −12 9 6 1]: ${c('a=x; a(x>0)=0')} pune 0 în locul elementelor pozitive. ${c('rem(x,n)')} dă restul împărțirii fiecărui element la n; ${c('~rem(x,3)')} este 1 exact unde elementul se divide cu 3, deci ${c('b=x; b(~rem(x,3))=5')}. Media elementelor este ${c('mean(x)')}: ${c('e=x; e(x<mean(x))=0')}.</p>
      ${ml(`>> x=[3 15 9 12 -1 0 -12 9 6 1];
>> a=x; a(x>0)=0
>> b=x; b(~rem(x,3))=5
>> c=x; c(~rem(x,2))=5*c(~rem(x,2))
>> d=x(x>10)
>> e=x; e(x<mean(x))=0
>> f=x; f(x>mean(x))=f(x>mean(x))-mean(x)`)}` },
  ],
  cheat: [
    ['< <= > >= == ~=', 'operatorii relaționali; rezultat 1 (adevărat) sau 0 (fals)'],
    ['& | ~', 'și, sau, nu; xor(A,B) sau exclusiv'],
    ['A(A>5)', 'indexare logică: elementele care verifică condiția, în ordinea coloanelor'],
    ['A((A>1)&(A<20))', 'elementele din intervalul (1,20)'],
    ['A(~cond)  A((A<=1)|(A>=20))', 'complementul: negare sau |'],
    ['any(v)', '1 dacă există un element nenul'],
    ['all(v)', '1 dacă toate elementele sunt nenule'],
    ['find(x)', 'indicii elementelor nenule'],
    ['isnan(x) isfinite(x)', 'teste element cu element; NaN este nefinit'],
    ['eps', '2^-52 ≈ 2.2204e-16'],
    ['x=x+(x==0)*eps', 'înlocuiește zerourile cu eps, evită împărțirea cu 0'],
    ['rem(x,n)', 'restul împărțirii; ~rem(x,3) = divizibil cu 3'],
    ['mean(x)', 'media elementelor'],
    ['a(x>0)=0', 'atribuire cu indexare logică'],
    ['randperm(n)', 'permutare aleatoare a lui 1..n'],
  ],
  cards: [
    { q: 'Cum interpretează operatorii logici datele de intrare și ce dau la ieșire?', a: 'Intrare: orice număr diferit de 0 este „adevărat”, 0 este „fals”. Ieșire: numai 1 (A) sau 0 (F).' },
    { q: 'Cei 6 operatori relaționali', a: c('<') + ' ' + c('<=') + ' ' + c('>') + ' ' + c('>=') + ' ' + c('==') + ' (egal) ' + c('~=') + ' (diferit).' },
    { q: 'Ce dă ' + c('A>0') + ' pentru o matrice A?', a: 'O matrice de aceeași dimensiune, cu 1 pe pozițiile elementelor pozitive și 0 în rest (comparație element cu element cu scalarul).' },
    { q: 'Ce este indexarea logică?', a: 'Folosirea rezultatului unei comparații ca indice: ' + c('A(A>5)') + ' dă vectorul elementelor care verifică condiția, în ordinea coloanelor.' },
    { q: 'Cei trei operatori logici și funcția xor', a: c('&') + ' și, ' + c('|') + ' ori, ' + c('~') + ' nu; ' + c('xor(A,B)') + ' sau exclusiv (1 când exact unul e adevărat).' },
    { q: 'Cum obții elementele lui A din intervalul (1, 20)? Dar cele din afara lui?', a: c('A((A>1)&(A<20))') + '; complementul: ' + c('A(~((A>1)&(A<20)))') + ' sau ' + c('A((A<=1)|(A>=20))') + '.' },
    { q: 'Diferența dintre ' + c('any(v)') + ' și ' + c('all(v)'), a: c('any') + ': 1 dacă cel puțin un element e nenul. ' + c('all') + ': 1 dacă toate sunt nenule. Pentru [0 1 2]: any = 1, all = 0.' },
    { q: 'Ce dă ' + c('find(x)') + '?', a: 'Vectorul indicilor elementelor nenule ale lui x: ' + c('find([0 3 0 5])') + ' = 2 4.' },
    { q: 'Ce dau ' + c('isfinite([1 NaN inf -inf])') + ' și ' + c('isnan(...)') + '?', a: 'isfinite: 1 0 0 0 (NaN este considerat nefinit); isnan: 0 1 0 0.' },
    { q: 'Ce este ' + c('eps') + ' și la ce folosește?', a: 'Cea mai mică valoare relativă pozitivă reprezentabilă, 2<sup>−52</sup> ≈ 2.2204e-16. Cu ' + c('x=x+(x==0)*eps') + ' înlocuim zerourile ca să evităm împărțirea cu 0 (NaN).' },
    { q: 'Cum înlocuiești cu 5 elementele lui x divizibile cu 3?', a: c('b=x; b(~rem(x,3))=5') + ' – rem(x,3) este 0 exact la divizibile, iar ~ transformă 0 în 1.' },
    { q: 'Cum pui 0 în locul elementelor mai mici decât media?', a: c('e=x; e(x<mean(x))=0') + '.' },
    { q: 'Cum desenezi semnalul sinusoidal discontinuu (sin t unde e pozitiv, 0 altfel)?', a: c('t=0:0.1:10; x=sin(t); x=x.*(x>0); plot(t,x)') + ' – înmulțirea cu matricea logică anulează valorile negative.' },
  ],
  quiz: [
    { type: 'mc', q: 'Ce valoare logică are numărul −3 ca dată de intrare a unui operator logic?', options: ['adevărat (orice număr diferit de 0)', 'fals (numerele negative sunt false)', 'eroare', 'NaN'], answer: 0, explain: 'Doar 0 este fals; orice alt număr este adevărat.' },
    { type: 'mc', q: 'Care operator testează egalitatea?', options: [c('=='), c('='), c('~='), c('eq')], answer: 0, explain: '<code>=</code> este atribuire; <code>~=</code> înseamnă diferit.' },
    { type: 'mc', q: 'Care operator înseamnă „diferit”?', options: [c('~='), c('!='), c('<>'), c('=/=')], answer: 0, explain: 'În MATLAB negația se scrie cu <code>~</code>.' },
    { type: 'mc', q: 'x = [1 5 2 8 9 0 1], y = [5 2 2 6 0 0 2]. Ce dă ' + c('x > y') + '?', options: [c('0 1 0 1 1 0 0'), c('1 0 1 0 0 1 1'), c('0 0 1 0 0 1 0'), c('1')], answer: 0, explain: 'Comparație element cu element: 1 unde x<sub>i</sub> > y<sub>i</sub>.' },
    { type: 'mc', q: 'Pentru aceiași x, y, ce dă ' + c('x & (~y)') + '?', options: [c('0 0 0 0 1 0 0'), c('1 1 1 1 1 0 1'), c('0 0 0 0 1 1 0'), c('1 0 0 0 1 0 0')], answer: 0, explain: '~y este 1 doar pe pozițiile 5 și 6; x este nenul pe poziția 5 dar 0 pe 6.' },
    { type: 'mc', q: 'x = 1:10, y = [3 1 5 6 8 2 9 4 7 0]. Ce dă ' + c('x((x > 3) & (x < 8))') + '?', options: [c('4 5 6 7'), c('3 4 5 6 7 8'), c('0 0 0 1 1 1 1 0 0 0'), c('6 8 2 9')], answer: 0, explain: 'Indexare logică: elementele lui x strict între 3 și 8.' },
    { type: 'mc', q: 'Pentru aceiași x, y, ce dă ' + c('y(x <= 4)') + '?', options: [c('3 1 5 6'), c('1 2 3 4'), c('3 1'), c('1 1 1 1 0 0 0 0 0 0')], answer: 0, explain: 'Condiția pe x selectează pozițiile 1..4, dar valorile se iau din y.' },
    { type: 'mc', q: 'Ce dă ' + c('x(y < 0)') + ' dacă y nu are elemente negative?', options: ['matricea vidă (Empty matrix: 1-by-0)', 'x neschimbat', '0', 'o eroare'], answer: 0, explain: 'Nicio poziție nu verifică condiția.' },
    { type: 'mc', q: 'Ce dă ' + c('xor(1,1)') + '?', options: [c('0'), c('1'), c('2'), c('NaN')], answer: 0, explain: 'Sau exclusiv: 1 numai când exact unul dintre operanzi este adevărat.' },
    { type: 'mc', q: 'Care comandă dă elementele lui A din <b>afara</b> intervalului (1, 20)?', options: [c('A((A<=1)|(A>=20))'), c('A((A<1)&(A>20))'), c('A(A<1|A>20)') + ' … greșit, lipsesc parantezele', c('~A((A>1)&(A<20))')], answer: 0, explain: 'Complementul lui (A>1)&(A<20) este (A<=1)|(A>=20). Merge și <code>A(~((A>1)&(A<20)))</code>.' },
    { type: 'mc', q: 'Ce dau ' + c('any([0 1 2])') + ' și ' + c('all([0 1 2])') + '?', options: ['1 și 0', '0 și 1', '1 și 1', '0 și 0'], answer: 0, explain: 'Există un element nenul (any = 1), dar nu toate sunt nenule (all = 0).' },
    { type: 'fill', q: 'Ce dă ' + c('find([0 3 0 5])') + '?', answers: ['2 4', '[2 4]', '2,4'], explain: 'Indicii elementelor nenule.' },
    { type: 'mc', q: 'Ce dă ' + c('isfinite([1 NaN inf -inf])') + '?', options: [c('1 0 0 0'), c('1 1 0 0'), c('0 1 0 0'), c('1 0 1 1')], answer: 0, explain: 'NaN este considerat nefinit, ca și ±Inf.' },
    { type: 'mc', q: 'Ce valoare are ' + c('eps') + '?', options: ['2<sup>−52</sup> ≈ 2.2204·10<sup>−16</sup>', '10<sup>−308</sup>', '0', '10<sup>−6</sup>'], answer: 0, explain: 'Cea mai mică valoare relativă pozitivă reprezentabilă în dublă precizie.' },
    { type: 'fill', q: 'Scrie comanda care înlocuiește zerourile vectorului x cu eps.', answers: ['x=x+(x==0)*eps', 'x=x+eps*(x==0)', 'x(x==0)=eps'], explain: '<code>(x==0)</code> este 1 exact pe pozițiile nule; înmulțit cu eps și adunat, schimbă doar acele elemente.' },
    { type: 'mc', q: 'De ce se înlocuiește 0 cu eps înainte de ' + c('sin(x)./x') + '?', options: ['ca să evităm împărțirea cu 0, care dă NaN și strică sumele ulterioare', 'ca să facem calculul mai rapid', 'pentru că sin(0) nu există', 'ca să obținem 0 pe acele poziții'], answer: 0, explain: 'Cu eps obținem 1.0000, limita lui sin(x)/x în 0.' },
    { type: 'mc', q: 'x = [3 15 9 12 −1 0 −12 9 6 1]. Ce dă ' + c('b=x; b(~rem(x,3))=5') + '?', options: [c('5 5 5 5 -1 5 5 5 5 1'), c('3 15 9 12 -1 0 -12 9 6 1'), c('5 5 5 5 5 5 5 5 5 5'), c('3 5 5 5 -1 0 -12 5 5 1')], answer: 0, explain: 'rem(x,3)=0 pentru 3, 15, 9, 12, 0, −12, 9, 6; toate devin 5.' },
    { type: 'mc', q: 'Care comandă păstrează din x doar elementele mai mari ca 10?', options: [c('d=x(x>10)'), c('d=x; d(x>10)'), c('d=x>10'), c('d=find(x>10)')], answer: 0, explain: '<code>x>10</code> dă matricea logică; <code>find</code> dă indicii; <code>x(x>10)</code> dă valorile.' },
    { type: 'mc', q: 'Cum scazi media din elementele mai mari decât media?', options: [c('f=x; f(x>mean(x))=f(x>mean(x))-mean(x)'), c('f=x-mean(x)'), c('f(x>mean(x))=mean(x)'), c('f=x(x>mean(x))-mean(x)')], answer: 0, explain: 'Aceeași condiție logică și la stânga, și la dreapta atribuirii.' },
    { type: 'mc', q: 'Ce face ' + c('x=x.*(x>0)') + ' pentru x = sin(t)?', options: ['pune 0 în locul valorilor negative (semnal sinusoidal discontinuu)', 'pune 0 în locul valorilor pozitive', 'ridică la pătrat', 'nimic'], answer: 0, explain: 'Înmulțirea cu 0/1 anulează exact elementele care nu verifică condiția.' },
  ],
  exercises: [
    { title: 'Comparații și operatori logici', statement: `<p>1. Fie vectorii x = [1 5 2 8 9 0 1] și y = [5 2 2 6 0 0 2]. Executați și explicați rezultatele următoarelor comenzi:</p>
      <p>a) x &gt; y<br>b) y &lt; x<br>c) x == y<br>d) x &lt;= y<br>e) y &gt;= x<br>f) x | y<br>g) x &amp; y<br>h) x &amp; (~y)<br>i) (x &gt; y) | (y &lt; x)<br>j) (x &gt; y) &amp; (y &lt; x)</p>`, solution: `${ml(`>> x=[1 5 2 8 9 0 1]; y=[5 2 2 6 0 0 2];
>> x>y
>> y<x
>> x==y
>> x<=y
>> y>=x
>> x|y
>> x&y
>> x&(~y)
>> (x>y)|(y<x)
>> (x>y)&(y<x)`)}<p>a) ${c('ans = 0 1 0 1 1 0 0')}. Vectorul rezultat are 1 pe poziția în care elementul lui x este mai mare decât elementul lui y și 0 unde elementul lui x este mai mic sau egal cu elementul corespunzător al lui y. Analog pentru restul comenzilor.</p>`, check: [{ var: 'x', expected: '[1 5 2 8 9 0 1]' }, { var: 'y', expected: '[5 2 2 6 0 0 2]' }] },
    { title: 'Indexare logică', statement: `<p>2. Fie vectorii x = 1:10 și y = [3 1 5 6 8 2 9 4 7 0]. Execută și interpretează următoarele comenzi de indexare logică:</p>
      <p>a) x((x &gt; 3) &amp; (x &lt; 8))<br>b) x(x &gt; 5)<br>c) y(x &lt;= 4)<br>d) x( (x &lt; 2) | (x &gt;= 8) )<br>e) y( (x &lt; 2) | (x &gt;= 8) )<br>f) x(y &lt; 0)</p>`, solution: `${ml(`>> x=1:10; y=[3 1 5 6 8 2 9 4 7 0];
>> x((x>3)&(x<8))
>> x(x>5)
>> y(x<=4)
>> x((x<2)|(x>=8))
>> y((x<2)|(x>=8))
>> x(y<0)`)}<p>a) ${c('ans = 4 5 6 7')}. Analog pentru restul comenzilor.</p>` },
    { title: 'Modificări selective', statement: `<p>3. Fie x=[3 15 9 12 -1 0 -12 9 6 1]. Determinați comanda care:</p>
      <p>a) definește vectorul a obținut din x prin schimbarea elementelor pozitive cu 0;<br>
      b) definește vectorul b obținut din x prin schimbarea elementelor ce se divid cu 3, cu valoarea 1;<br>
      c) definește vectorul c obținut din x prin schimbarea elementelor pare cu valoarea lor multiplicată cu 5;<br>
      d) definește vectorul d ce va conține doar acele elemente ale lui x ce sunt mai mari ca 10;<br>
      e) definește vectorul e obținut din x prin schimbarea elementelor ce sunt mai mici ca media elementelor lui x, cu 0;<br>
      f) definește vectorul f obținut din x prin schimbarea elementelor ce sunt mai mari decât media elementelor lui x cu diferența dintre valoarea lor și medie.</p>`, hint: '<p>b) Se va utiliza funcția ' + c('rem(x,n)') + ', care dă restul împărțirii fiecărui element al lui x la n; ' + c('~rem(x,3)') + ' are 1 pe pozițiile elementelor care se împart exact la 3. e) Media elementelor unui vector este dată de funcția ' + c('mean(x)') + '.</p>', solution: `${ml(`>> x=[3 15 9 12 -1 0 -12 9 6 1];
>> a=x; a(x>0)=0
>> b=x; b(~rem(x,3))=5
>> c=x; c(~rem(x,2))=5*c(~rem(x,2))
>> d=x(x>10)
>> e=x; e(x<mean(x))=0
>> f=x; f(x>mean(x))=f(x>mean(x))-mean(x)`)}<p>a) 0 0 0 0 −1 0 −12 0 0 0; b) 5 5 5 5 −1 5 5 5 5 1; c) 3 15 9 60 −1 0 −60 9 30 1; d) 15 12; e) 0 15 9 12 0 0 0 9 6 0; f) 3.0000 10.8000 4.8000 7.8000 −1.0000 0 −12.0000 4.8000 1.8000 1.0000.</p><div class="note">La b) soluția din manual pune valoarea 5; pentru valoarea 1 cerută în enunț comanda este ${c('b=x; b(~rem(x,3))=1')}.</div>`, check: [{ var: 'a', expected: '[0 0 0 0 -1 0 -12 0 0 0]' }, { var: 'c', expected: '[3 15 9 60 -1 0 -60 9 30 1]' }, { var: 'd', expected: '[15 12]' }, { var: 'e', expected: '[0 15 9 12 0 0 0 9 6 0]' }, { var: 'f', expected: '[3 10.8 4.8 7.8 -1 0 -12 4.8 1.8 1]' }] },
    { title: 'Funcție pe ramuri și semnal discontinuu', statement: `<p>4. a) Creați vectorul x=randperm(35) (funcția randperm(n) generează o permutare aleatoare a numerelor naturale de la 1 la 35). Evaluați funcția:</p>
      <p>y(x) = ${sys(['<span style="display:inline-block;min-width:3.6em">2</span><i>daca</i> x &lt; 6', '<span style="display:inline-block;min-width:3.6em">x − 4</span><i>daca</i> 6 &lt;= x &lt;= 20', '<span style="display:inline-block;min-width:3.6em">36 − x</span><i>daca</i> 20 &lt;= x &lt;= 35'])}</p>
      <p>utilizând indexarea logică. Verificați răspunsul desenând graficul lui y(x).</p>
      <p>b) Desenați graficul funcției de semnal sinusoidal discontinuu :</p>
      <p>x(t) = ${sys(['<span style="display:inline-block;min-width:3.6em">sin(t)</span><i>daca</i> sin(t) &gt; 0', '<span style="display:inline-block;min-width:3.6em">0</span><i>daca</i> sin(t) ≤ 0'])} &nbsp;pentru t=1,…,10s,</p>
      <p>utilizând indexarea logică.</p>`, hint: '<p>a) Creați vectorul y de aceeași dimensiune cu x, numai cu cifra 1: ' + c('y=ones(size(x))') + ', apoi calculați valorile lui y pe fiecare ramură cu indexarea logică. b) Puneți valoarea 0 în locul valorilor negative ale lui x: ' + c('x=x.*(x>0)') + '.</p>', solution: `${ml(`>> x=randperm(35);
>> y=ones(size(x));
>> y(x<6)=2;
>> y((x>=6)&(x<20))=x((x>=6)&(x<20))-4;
>> y((x>=20)&(x<=35))=36-x((x>=20)&(x<=35));
>> plot(x,y,'or')`)}${ml(`>> t=0:0.1:10;
>> x=sin(t);
>> x=x.*(x>0);
>> plot(t,x)
>> axis([0 10 -0.1 1.1])
>> xlabel('Timpul [s]')
>> ylabel('Amplitudinea')
>> title('Semnal sinusoidal discontinuu')`)}` },
    { title: 'Evitarea împărțirii cu zero', statement: `<p>5. Problema evitării operațiilor neconvenabile. În unele situații avem un vector cu unele elemente 0. Dacă cu acest vector facem diverse calcule putem ajunge ca să efectuăm operații interzise ca de exemplu împărțiri cu 0. De exemplu:</p>
      ${mls(`>> x=[7 3 0 5 -2 0 -1 0 pi]
x =
  7.0000  3.0000  0  5.0000  -2.0000  0  -1.0000  0  3.1416
>> y= sin(x)./x
Warning: Divide by zero.
y =
  0.0939  0.0470  NaN  -0.1918  0.4546  NaN  0.8415  NaN  0.0000`)}
      <p>Se observă faptul că unde am avut elemente 0 la rezultat avem NaN fapt ce va conduce la rezultate eronate dacă, de exemplu, vom dori să calculăm suma elementelor vectorului y. Cum ieșim din această situație?</p>`, hint: '<p>În locul valorii 0 se utilizează cea mai mică valoare relativ pozitivă pe care calculatorul o poate reprezenta: eps = 2<sup>−52</sup> ≈ 2.2204e-016.</p>', solution: `${ml(`>> x=[7 3 0 5 -2 0 -1 0 pi];
>> x=x+(x==0)*eps
>> sin(x)./x`)}<p>Pe pozițiile foste 0 rezultatul este 1.0000.</p>`, check: [{ var: 'x', expected: '[7 3 eps 5 -2 eps -1 eps pi]' }] },
    { title: 'O problemă de balistică', statement: `<p>6. O problemă de balistică. Înălțimea și viteza unui proiectil lansat cu viteza inițială v<sub>0</sub> și cu un unghi θ sunt date de:</p>
      <p>h(t) = v<sub>0</sub>t sin θ − ${frac('1', '2')} gt<sup>2</sup></p>
      <p>v(t) = √<span style="display:inline-block;border-top:1px solid currentColor;padding:1px 2px 0">v<sub>0</sub><sup>2</sup> − 2v<sub>0</sub>gt sin θ + g<sup>2</sup>t<sup>2</sup></span></p>
      <p>Unde g este accelerația gravitațională. Proiectilul va atinge solul când h(t)=0, ceea ce conduce la timpul de revenire t<sub>g</sub> = 2(v<sub>0</sub>/g) sin θ (se egalează cu 0 prima ecuație). Pentru θ = 40°, v<sub>0</sub>=20 m/s, și g=9.81 m/s<sup>2</sup>, determinați timpul când înălțimea h nu este mai mică de 6m iar viteza este simultan cel mult 16 m/s.</p>`, hint: '<p>Calculați t<sub>g</sub>, care dă intervalul de definiție al timpului, discretizați t pe [0, t<sub>g</sub>], calculați v și h, apoi ' + c('u=find(h>6&v<16)') + '. Capetele intervalului sunt date de primul și ultimul rang din u: ' + c('t(u(1))') + ' și ' + c('t(u(end))') + '.</p>', solution: `${ml(`>> v0=20; g=9.81; theta=40*pi/180;
>> tg=2*v0*sin(theta)/g
>> t=0:0.01:tg;
>> v=sqrt(v0^2-2*v0*g*sin(theta)*t+g^2*t.^2);
>> h=v0*t*sin(theta)-0.5*g*t.^2;
>> u=find(h>6&v<16);
>> t1=t(u(1))
>> t2=t(u(end))`)}<p>Soluția problemei este intervalul [t1, t2] = [0.85, 1.78].</p>` },
  ],
});
