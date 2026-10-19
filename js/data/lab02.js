LABS.push({
  id: 2,
  title: 'Matrici și vectori',
  blurb: 'Definirea matricilor cu <code>[ ]</code>, generatoarele <code>zeros</code>, <code>ones</code>, <code>eye</code>, <code>diag</code>, concatenarea, operatorul <code>:</code>, accesarea elementelor, operațiile „cu punct” și funcțiile de matrici.',
  sections: [
    { h: 'Definiții', html: `
      <p>În teoria informației o matrice este un tablou în care informațiile sunt organizate pe <b>linii</b> și <b>coloane</b>; fiind cel mai des întâlnit mod de organizare, este supranumită „mama structurilor de date”. Se notează cu paranteze pătrate. Pentru o matrice mare se scrie simbolic a<sub>ij</sub>, i = 1..n, j = 1..m – o matrice cu n linii și m coloane.</p>
      <ul>
        <li>Numărul de linii și coloane este <b>tipul</b> matricii: 2×2, n×m. Dacă n = m matricea este <b>pătrată</b>, de tip n.</li>
        <li>La o matrice pătrată, elementele de pe diagonala din stânga-sus spre dreapta-jos formează <b>diagonala principală</b>; cele din dreapta-sus spre stânga-jos, <b>diagonala secundară</b>.</li>
        <li>Matricile 1×m sunt <b>vectori linie</b> cu m elemente; matricile n×1 sunt <b>vectori coloană</b> cu n elemente.</li>
      </ul>` },
    { h: 'Definirea matricilor în MATLAB', html: `
      <p>Se folosește operatorul ${c('[]')}. Elementele unei linii se separă cu spațiu sau virgulă; sfârșitul unei linii este indicat de punct-virgulă. Matricea A cu liniile 1 2 3 și 3 2 1:</p>
      ${ml(`>> A=[1,2,3;3,2,1]
>> v=[1 2 3]
>> w=[1;2;3]`)}
      <p>${c('[1 2 3]')} este un vector linie, ${c('[1;2;3]')} același vector, dar coloană.</p>
      <p>Matricile des folosite au funcții predefinite:</p>
      <table><tr><th>Funcție</th><th>Rezultat</th></tr>
      <tr><td>${c('zeros(n,m)')}</td><td>matricea n×m cu toate elementele 0; ${c('zeros(n)')} pentru pătrată de tip n</td></tr>
      <tr><td>${c('ones(n,m)')}</td><td>matricea n×m cu toate elementele 1; ${c('ones(n)')} pentru pătrată</td></tr>
      <tr><td>${c('eye(n)')}</td><td>matricea unitate de ordin n: 1 pe diagonala principală, 0 în rest</td></tr>
      <tr><td>${c('diag(v,k)')}</td><td>matrice în care vectorul v devine diagonala aflată la distanța k deasupra (k &gt; 0) sau dedesubtul (k &lt; 0) diagonalei principale; dacă k lipsește sau e 0, v devine diagonala principală</td></tr></table>
      ${ml(`>> zeros(2,3)
>> ones(2)
>> eye(3)
>> diag([1 2 3])
>> diag([1 2],1)
>> diag([7 7 7],-1)`)}
      <p>${c('diag')} este utilă pentru <b>matricile bandă</b> – cele ale căror elemente nenule sunt pe diagonale paralele cu diagonala principală, aflate în apropierea ei.</p>
      <h3>Concatenare</h3>
      <p>Operatorul ${c('[]')} construiește matrici noi din matrici deja definite. ${c('[A,B]')} concatenează <b>pe orizontală</b> (A și B trebuie să aibă același număr de linii); ${c('[A;B]')} concatenează <b>pe verticală</b> (același număr de coloane).</p>
      ${ml(`>> A=[1 2;3 4]; B=[5 6;7 8];
>> [A,B]
>> [A;B]
>> [A zeros(2);eye(2) B]`)}` },
    { h: 'Operatorul : și accesarea elementelor', html: `
      <p>Operatorul ${c('a:p:b')} generează vectorul a, a+p, a+2p, … până la b. Dacă pasul p lipsește, este 1.</p>
      ${ml(`>> 1:5
>> 2:2:10
>> 10:-3:0
>> 0:0.25:1`)}
      <p>Un element se accesează indicând linia și coloana: pentru A de mai sus, ${c('A(1,3)')} este 3. Pentru accesare multiplă se folosește ${c(':')} la indice:</p>
      <ul>
        <li>${c('A(1,1:3)')} – elementele liniei 1, coloanele 1..3; ${c('A(1,:)')} – toată linia 1.</li>
        <li>${c('A(:)')} – <b>toate</b> elementele, ca un vector coloană (elementele sunt memorate liniar, coloană după coloană).</li>
        <li>${c('A(i,1:2:end)')} – linia i, doar coloanele impare. ${c('end')} înseamnă „până la sfârșit”: ultimul indice.</li>
        <li>${c('A(A>0)')} – <b>indexare logică</b>: doar elementele care verifică condiția din paranteză.</li>
      </ul>
      ${ml(`>> A=[1,2,3;3,2,1];
>> A(1,3)
>> A(1,1:3)
>> A(:)
>> A(2,1:2:end)
>> A(A>1)
>> A(end,end)`)}` },
    { h: 'Operații cu matrici și vectori', html: `
      <p>Matricile de <b>același tip</b> se adună element cu element: c<sub>ij</sub> = a<sub>ij</sub> + b<sub>ij</sub>. Înmulțirea ${c('A*B')} este posibilă dacă A este n×m și B este m×p; rezultă C de tip n×p, calculată „linii pe coloane”: c<sub>ij</sub> = Σ<sub>k</sub> a<sub>ik</sub> b<sub>kj</sub>. Ridicarea la putere ${c('A^2')} înseamnă ${c('A*A')} (înmulțire matriceală). Împărțirea are un mod special de abordare și e tratată în lucrarea următoare.</p>
      <p>Pentru operații <b>element cu element</b> există „operațiile cu punct”: ${c('.*')} înmulțire, ${c('./')} împărțire, ${c('.^')} ridicare la putere a fiecărui element. Sunt utile în formule care au ca variabile vectori sau matrici.</p>
      ${ml(`>> A=[1 2;3 4]; B=[1 0;0 2];
>> A*B
>> A.*B
>> A^2
>> A.^2
>> v=[1 2 3]; v./[2 4 6]`)}
      <div class="note">Funcțiile matematice uzuale (sin, exp, sqrt…) aplicate unei matrici se aplică <b>fiecărui element</b>: ${c('sin(A)')} este matricea sinusurilor elementelor.</div>` },
    { h: 'Funcții de matrici', html: `
      <div class="cheat">
        <div><code>size(A)</code><span>tipul matricii (linii, coloane)</span></div>
        <div><code>numel(A)</code><span>numărul elementelor</span></div>
        <div><code>min(A)</code><span>cel mai mic element (pe coloane, pentru matrici)</span></div>
        <div><code>max(A)</code><span>cel mai mare element</span></div>
        <div><code>prod(A)</code><span>produsul elementelor</span></div>
        <div><code>sum(A)</code><span>suma elementelor; <code>sum(A,2)</code> pe linii</span></div>
        <div><code>det(A)</code><span>determinantul</span></div>
        <div><code>inv(A)</code><span>inversa</span></div>
      </div>
      <p>La matrici, ${c('sum')}, ${c('prod')}, ${c('min')}, ${c('max')} lucrează <b>pe coloane</b> și dau un vector linie. Al doilea argument din ${c('sum(A,2)')} indică dimensiunea după care se face suma (implicit 1, adică pe coloane). Suma tuturor elementelor: ${c('sum(A(:))')} sau ${c('sum(sum(A))')}.</p>
      ${ml(`>> B=[2 0 1;1 1 1;-1 2 -2];
>> size(B)
>> numel(B)
>> sum(B)
>> sum(B,2)
>> sum(B(:))
>> max(B)
>> det(B)
>> inv(B)`)}` },
  ],
  cheat: [
    ['[1,2,3;3,2,1]', 'matrice 2×3: virgulă/spațiu separă elementele, ; separă liniile'],
    ['[1 2 3]  /  [1;2;3]', 'vector linie / vector coloană'],
    ['zeros(n,m) ones(n,m) eye(n)', 'matrice de zerouri, de unu, matricea unitate'],
    ['diag(v,k)', 'v pe diagonala la distanța k de cea principală (k>0 deasupra, k<0 dedesubt)'],
    ['[A,B]  [A;B]', 'concatenare orizontală (același nr. de linii) / verticală (același nr. de coloane)'],
    ['a:p:b', 'vectorul a, a+p, …, b'],
    ['A(i,j)  A(i,:)  A(:,j)', 'element, linia i, coloana j'],
    ['A(:)', 'toate elementele ca vector coloană'],
    ['end', 'ultimul indice: A(end,:), r(end:-1:1)'],
    ['A(A>0)', 'indexare logică: elementele care verifică condiția'],
    ['A*B  A^2', 'înmulțire / putere matriceală („linii pe coloane”)'],
    ['A.*B  A./B  A.^2', 'operații element cu element'],
    ['size numel', 'tipul matricii, numărul de elemente'],
    ['sum prod min max', 'pe coloane la matrici; sum(A,2) pe linii; sum(A(:)) total'],
    ['det inv', 'determinant, inversă'],
  ],
  cards: [
    { q: 'Cum definești în MATLAB matricea cu liniile 1 2 3 și 3 2 1?', a: c('A=[1,2,3;3,2,1]') + ' sau ' + c('A=[1 2 3;3 2 1]') + ' – spațiul/virgula separă elementele, punct-virgula separă liniile.' },
    { q: 'Diferența dintre ' + c('[1 2 3]') + ' și ' + c('[1;2;3]'), a: 'Primul este vector <b>linie</b> (1×3), al doilea vector <b>coloană</b> (3×1).' },
    { q: 'Ce generează ' + c('zeros(n,m)') + ', ' + c('ones(n)') + ', ' + c('eye(n)') + '?', a: 'Matricea n×m de zerouri; matricea pătrată n×n de unu; matricea unitate de ordin n (1 pe diagonala principală, 0 în rest).' },
    { q: 'Ce face ' + c('diag(v,k)') + '?', a: 'Pune vectorul v pe diagonala aflată la distanța k de diagonala principală: deasupra dacă k &gt; 0, dedesubt dacă k &lt; 0, chiar diagonala principală dacă k lipsește sau e 0. Restul elementelor sunt 0.' },
    { q: 'Ce condiție trebuie să îndeplinească A și B pentru ' + c('[A,B]') + ' și pentru ' + c('[A;B]') + '?', a: c('[A,B]') + ' (orizontal): același număr de <b>linii</b>. ' + c('[A;B]') + ' (vertical): același număr de <b>coloane</b>.' },
    { q: 'Ce vector generează ' + c('50:-2:-50') + '?', a: '50, 48, 46, …, −50 (pas −2). Are 51 de elemente.' },
    { q: 'Ce înseamnă ' + c('A(i,1:2:end)') + '?', a: 'Elementele liniei i din coloanele impare (1, 3, 5, …, până la sfârșit). ' + c('end') + ' este expresia precisă a propoziției „până la sfârșit”.' },
    { q: 'Ce dă ' + c('A(:)') + '?', a: 'Toate elementele lui A ca un vector coloană, în ordinea în care sunt memorate: coloană după coloană.' },
    { q: 'Cum obții doar elementele pozitive ale lui A?', a: c('A(A>0)') + ' – expresia din paranteză trebuie să fie o expresie logică pe care elementele o verifică (indexare logică).' },
    { q: 'Diferența dintre ' + c('A*B') + ' și ' + c('A.*B'), a: c('A*B') + ' este produsul matriceal „linii pe coloane” (A n×m, B m×p → n×p). ' + c('A.*B') + ' înmulțește element cu element (aceleași dimensiuni).' },
    { q: 'Când sunt utile operațiile cu punct ' + c('.* ./ .^') + '?', a: 'În formulele care admit ca variabile vectori sau matrici, de exemplu ' + c('y=x.*sin(x)') + ' pentru un vector x.' },
    { q: 'Cum calculezi suma pe coloane, suma pe linii și suma tuturor elementelor lui B?', a: c('sum(B)') + ' pe coloane; ' + c('sum(B,2)') + ' pe linii (2 = dimensiunea după care se face suma); ' + c('sum(B(:))') + ' total.' },
    { q: 'Ce dau ' + c('size(A)') + ' și ' + c('numel(A)') + '?', a: c('size') + ' – tipul matricii (numărul de linii și coloane); ' + c('numel') + ' – numărul elementelor.' },
    { q: 'Cum inversezi ordinea elementelor vectorului r?', a: c('r(end:-1:1)') + ' – indici de la ultimul la primul, cu pas −1.' },
    { q: 'Cum obții matricea formată din colțurile lui B?', a: c('B([1,end],[1,end])') + ' – liniile 1 și ultima, coloanele 1 și ultima.' },
  ],
  quiz: [
    { type: 'fill', q: 'Scrie comanda care definește matricea A cu liniile „1 2 3” și „3 2 1”.', answers: ['A=[1,2,3;3,2,1]', 'A=[1 2 3;3 2 1]', '[1,2,3;3,2,1]', '[1 2 3;3 2 1]'], explain: 'Elementele se separă cu spațiu sau virgulă, liniile cu punct-virgulă.', placeholder: 'A=[...]' },
    { type: 'mc', q: 'Ce fel de obiect este ' + c('[1;2;3]') + '?', options: ['vector coloană cu 3 elemente (3×1)', 'vector linie cu 3 elemente (1×3)', 'matrice 3×3', 'o eroare de sintaxă'], answer: 0, explain: 'Punct-virgula termină linia, deci fiecare număr e pe linia lui: 3 linii × 1 coloană.' },
    { type: 'mc', q: 'Ce generează ' + c('eye(3)') + '?', options: ['matricea unitate 3×3', 'o matrice 3×3 cu toate elementele 1', 'un vector cu 3 elemente egale cu 1', 'o matrice 3×3 de zerouri'], answer: 0, explain: '<code>eye</code> („I”) = 1 pe diagonala principală, 0 în rest.' },
    { type: 'mc', q: 'Ce face ' + c('diag([1 1 1],-1)') + '?', options: ['o matrice 4×4 cu 1 pe diagonala imediat <b>sub</b> cea principală', 'o matrice 3×3 cu 1 pe diagonala principală', 'o matrice 4×4 cu 1 pe diagonala imediat <b>deasupra</b> celei principale', 'o matrice 3×3 cu −1 pe diagonala principală'], answer: 0, explain: 'k = −1: diagonala la distanța 1 dedesubtul celei principale; matricea are 3+1 = 4 linii.' },
    { type: 'fill', q: 'Scrie comanda care creează vectorul 2, 4, 6, …, 100.', answers: ['2:2:100', 'va=2:2:100', '[2:2:100]'], explain: 'Operatorul <code>a:p:b</code>: de la 2, cu pasul 2, până la 100.', placeholder: 'a:p:b' },
    { type: 'fill', q: 'Scrie comanda care creează vectorul 50, 48, 46, …, −50.', answers: ['50:-2:-50', 'vb=50:-2:-50', '[50:-2:-50]'], explain: 'Pasul este negativ: <code>50:-2:-50</code>.' },
    { type: 'mc', q: 'Cum obții vectorul 1, 1/2, 1/3, …, 1/100?', options: [c('1./(1:100)'), c('1/(1:100)'), c('1:1/100'), c('(1:100)^-1')], answer: 0, explain: 'Împărțirea element cu element cere operatorul cu punct: <code>vt=1:100; vc=1./vt</code>.' },
    { type: 'mc', q: 'Pentru ' + c('A=[1 2 3;3 2 1]') + ', ce dă ' + c('A(2,1:2:end)') + '?', options: [c('3 1'), c('3 2 1'), c('1 3'), c('2')], answer: 0, explain: 'Linia 2, coloanele 1 și 3 (pas 2 până la sfârșit): 3 și 1.' },
    { type: 'mc', q: 'Ce dă ' + c('A(:)') + ' pentru ' + c('A=[1 2;3 4]') + '?', options: ['vectorul coloană 1, 3, 2, 4', 'vectorul linie 1, 2, 3, 4', 'vectorul coloană 1, 2, 3, 4', 'matricea A neschimbată'], answer: 0, explain: 'Elementele sunt memorate liniar, coloană după coloană: 1, 3 (coloana 1), apoi 2, 4.' },
    { type: 'mc', q: 'Ce condiție trebuie să îndeplinească A și B pentru ' + c('[A,B]') + '?', options: ['același număr de linii', 'același număr de coloane', 'să fie amândouă pătrate', 'același număr de elemente'], answer: 0, explain: 'Concatenarea pe orizontală pune matricile una lângă alta, deci liniile trebuie să coincidă. Pentru <code>[A;B]</code> coincide numărul de coloane.' },
    { type: 'mc', q: 'A este 2×3 și B este 3×4. Care produs este posibil?', options: [c('A*B') + ', rezultat 2×4', c('B*A') + ', rezultat 3×3', c('A.*B'), 'niciunul'], answer: 0, explain: 'Înmulțirea A(n×m)·B(m×p) cere ca numărul de coloane ale lui A să fie egal cu numărul de linii ale lui B; rezultatul este n×p.' },
    { type: 'tf', q: c('A^2') + ' și ' + c('A.^2') + ' dau același rezultat pentru orice matrice pătrată A.', answer: false, explain: '<code>A^2</code> = A·A (produs matriceal); <code>A.^2</code> ridică fiecare element la pătrat. Coincid doar în cazuri speciale (ex. matrici diagonale).' },
    { type: 'mc', q: 'Pentru matricea ' + c('B=[2 0 1;1 1 1;-1 2 -2]') + ', ce dă ' + c('sum(B)') + '?', options: [c('2 3 0') + ' (sumele coloanelor)', c('3 3 -1') + ' (sumele liniilor)', c('5') + ' (suma tuturor)', c('2') + ' (primul element)'], answer: 0, explain: 'La matrici, <code>sum</code> lucrează implicit pe coloane; <code>sum(B,2)</code> dă sumele liniilor.' },
    { type: 'fill', q: 'Scrie comanda care dă vectorul sumelor pe <b>linii</b> ale matricii B.', answers: ['sum(B,2)', 'xd=sum(B,2)', "sum(B')'", 'sum(B.\',2)'], explain: 'Al doilea argument indică dimensiunea: 2 = pe linii.' },
    { type: 'mc', q: 'Care comandă dă suma tuturor elementelor matricii H?', options: [c('sum(H(:))'), c('sum(H)'), c('H(:)'), c('numel(H)')], answer: 0, explain: '<code>H(:)</code> transformă matricea în vector coloană, apoi <code>sum</code> adună toate elementele. Merge și <code>sum(sum(H))</code>.' },
    { type: 'mc', q: 'Care comandă dă vectorul elementelor pozitive ale matricii H?', options: [c('H(H>0)'), c('H>0'), c('H(:)>0'), c('positive(H)')], answer: 0, explain: '<code>H>0</code> singur dă o matrice de 0 și 1; folosită ca indice, selectează elementele care verifică condiția.' },
    { type: 'fill', q: 'Scrie comanda care dă vectorul ri cu elementele lui r în ordine inversă.', answers: ['ri=r(end:-1:1)', 'r(end:-1:1)', 'ri=fliplr(r)', 'fliplr(r)'], explain: '<code>end:-1:1</code> = de la ultimul indice la primul, cu pasul −1.' },
    { type: 'mc', q: 'Ce dă ' + c('B([1,end],[1,end])') + '?', options: ['matricea 2×2 a elementelor din colțurile lui B', 'prima și ultima linie a lui B', 'prima și ultima coloană a lui B', 'elementele B(1,1) și B(end,end) ca vector'], answer: 0, explain: 'Liniile {1, ultima} intersectate cu coloanele {1, ultima}: cele patru colțuri.' },
    { type: 'mc', q: 'Cum construiești matricea 6×6 ' + c('C=[zeros(3) 5*eye(3);B 3*ones(3)]') + '? Ce reprezintă blocurile?', options: ['stânga-sus zerouri 3×3, dreapta-sus 5 pe diagonală, stânga-jos B, dreapta-jos toate 3', 'stânga-sus zerouri, dreapta-sus toate 5, stânga-jos B, dreapta-jos matricea unitate ×3', 'o eroare: blocurile au dimensiuni diferite', 'o matrice 3×12'], answer: 0, explain: 'Concatenare pe orizontală a două perechi de blocuri 3×3, apoi pe verticală.' },
    { type: 'mc', q: 'Ce dă ' + c('size([1 2 3;4 5 6])') + '?', options: [c('2 3'), c('3 2'), c('6'), c('2')], answer: 0, explain: '<code>size</code> returnează numărul de linii și numărul de coloane: 2 linii, 3 coloane.' },
  ],
  exercises: [
    { title: 'Definirea vectorilor și matricilor', statement: `<p>Definiți în MATLAB vectorii și matricile de mai jos:</p>${mats(eqm('v', '1 2 3') + ';', eqm('w', '4 5 6') + ';')}<p>a)</p>${mats(eqm('u', '-1;0;1') + ';', eqm('z', '2;0;-1') + ';')}<p>b)</p>${mats(eqm('A', '1 0 0;0 1 0;0 0 1') + ';', eqm('B', '2 0 1;1 1 1;-1 2 -2') + ';')}`, solution: `${ml(`>> v=[1 2 3]; w=[4 5 6];
>> u=[-1;0;1]; z=[2;0;-1];
>> A=eye(3)
>> B=[2 0 1;1 1 1;-1 2 -2]`)}`, check: [{ var: 'v', expected: '[1 2 3]' }, { var: 'w', expected: '[4 5 6]' }, { var: 'u', expected: '[-1;0;1]' }, { var: 'z', expected: '[2;0;-1]' }, { var: 'A', expected: 'eye(3)' }, { var: 'B', expected: '[2 0 1;1 1 1;-1 2 -2]' }], starter: 'v=[1 2 3]; w=[4 5 6];' },
    { title: 'Vectori cu operatorul :', statement: `<p>Creați vectorii va, vb, vc și vd care să aibă următoarele elemente:</p>
<p>a) 2,4,6,8,…,100;</p>
<p>b) 50,48,46,…,-50;</p>
<p>c) 1,1/2,1/3,…,1/100;</p>
<p>d) 0,1/2,2/3,3/4,…,99/100.</p>`, hint: '<p>Pentru c) și d) generează mai întâi vectorii numărătorilor și numitorilor, apoi împarte element cu element cu ' + c('./') + '.</p>', solution: `${ml(`>> va=2:2:100
>> vb=50:-2:-50
>> vt=1:100; vc=1./vt
>> vt1=0:99; vt2=1:100; vd=vt1./vt2`)}`, check: [{ var: 'va', expected: '2:2:100' }, { var: 'vb', expected: '50:-2:-50' }, { var: 'vc', expected: '1./(1:100)' }, { var: 'vd', expected: '(0:99)./(1:100)' }] },
    { title: 'Concatenare', statement: `<p>Prin concatenarea matricilor și vectorilor de mai sus, definiți în MATLAB:</p><p>a)</p>${mats(eqm('r', '1 2 3 4 5 6') + ';', eqm('t', '2;0;-1;-1;0;1') + ';')}<p>b)</p>${mats(eqm('C', '0 0 0 5 0 0;0 0 0 0 5 0;0 0 0 0 0 5;2 0 1 3 3 3;1 1 1 3 3 3;-1 2 -2 3 3 3') + ';')}`, solution: `${ml(`>> r=[v w]; t=[z;u]
>> C=[zeros(3) 5*eye(3);B 3*ones(3)]`)}`, check: [{ var: 'r', expected: '[1 2 3 4 5 6]' }, { var: 't', expected: '[2;0;-1;-1;0;1]' }, { var: 'C', expected: '[zeros(3) 5*eye(3);[2 0 1;1 1 1;-1 2 -2] 3*ones(3)]' }] },
    { title: 'Matrici bandă cu diag', statement: `<p>Cu ajutorul funcției diag(v,n), (unde n este distanța de la diagonala principală), definiți:</p><p>a)</p>${mats(eqm('D', '0 0 1 0 0 0;0 0 0 1 0 0;0 0 0 0 1 0;-2 0 0 0 0 1;0 -2 0 0 0 0;0 0 -2 0 0 0') + ';')}<p>b)</p>${mats(eqm('E', '2 1 0 0 0 0;1 2 1 0 0 0;0 1 2 1 0 0;0 0 1 2 1 0;0 0 0 1 2 1;0 0 0 0 1 2') + ';')}`, hint: '<p>Un vector de lungime 6−|n| pe diagonala n dă o matrice 6×6. Adună mai multe apeluri ' + c('diag') + '.</p>', solution: `${ml(`>> D=-2*diag(ones(1,3),-3)+diag(ones(1,4),2)
>> E=diag(ones(1,5),-1)+2*diag(ones(1,6))+diag(ones(1,5),1)`)}`, check: [{ var: 'D', expected: '-2*diag(ones(1,3),-3)+diag(ones(1,4),2)' }, { var: 'E', expected: 'diag(ones(1,5),-1)+2*diag(ones(1,6))+diag(ones(1,5),1)' }] },
    { title: 'Calcule cu matricile definite', statement: `<p>Utilizând matricile și vectorii definiți în exercițiile 1., 2. și 3, calculați:</p>
<p>a) v·z = ; r·t = ;</p>
<p>b) A·u − B·z = ;</p>
<p>c) C<sup>3</sup> + D<sup>3</sup> − 15·E<sup>3</sup> = ;</p>
<p>d) |B|·B<sup>2</sup> − 5·B<sup>−1</sup> = ;</p>
<p>e) D<sup>5</sup> = ;</p>
<p>f) D·E − E·D = ;</p>
<p>g) D.∗E − E.∗D = ;</p>
<p>h) sin(D) − cos(E) = ;</p>`, hint: '<p>v·z este produs de vector linie cu vector coloană: ' + c('v*z') + '. |B| este determinantul, ' + c('det(B)') + ', iar B<sup>−1</sup> este ' + c('inv(B)') + '. Matricile D și E sunt cele din exercițiul 4.</p>', solution: `${ml(`>> v*z
>> r*t
>> A*u-B*z
>> C^3+D^3-15*E^3
>> det(B)*B^2-5*inv(B)
>> D^5
>> D*E-E*D
>> D.*E-E.*D
>> sin(D)-cos(E)`)}<p>a) v*z = −1, r*t = 1</p><p>b) ${mat('-4;-1;1')}</p><p>c) ${mat('-180 -167 -90 170 135 160;-180 -255 -229 70 145 160;-60 -180 -300 -117 95 70;54 1 -225 18 104 198;68 81 -90 93 33 76;64 75 10 168 63 18')}</p><p>d) ${mat('-19.0000 -8.0000 -1.0000;-9.0000 -18.0000 -1.0000;-7.0000 6.0000 -23.0000')}</p><p>e) ${mat('4 0 0 0 0 -2;0 8 0 0 0 0;0 0 8 0 0 0;0 0 0 8 0 0;0 0 0 0 8 0;-8 0 0 0 0 4')}</p><p>f) ${mat('0 1 0 0 0 0;0 0 0 0 0 0;2 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 -1;0 0 0 -2 0 0')}</p><p>g) ${mat('0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0')}</p><p>h) ${mat('0.4161 -0.5403 -0.1585 -1.0000 -1.0000 -1.0000;-0.5403 0.4161 -0.5403 -0.1585 -1.0000 -1.0000;-1.0000 -0.5403 0.4161 -0.5403 -0.1585 -1.0000;-1.9093 -1.0000 -0.5403 0.4161 -0.5403 -0.1585;-1.0000 -1.9093 -1.0000 -0.5403 0.4161 -0.5403;-1.0000 -1.0000 -1.9093 -1.0000 -0.5403 0.4161')}</p>` },
    { title: 'Matrici bloc din A și B', statement: `<p>Utilizând matricile A și B să se definească matricile:</p><p>a)</p>${mats(eqm('G', '1 0 0 0 0 0;0 1 0 0 0 0;0 0 1 0 0 0;0 0 0 2 0 1;0 0 0 1 1 1;0 0 0 -1 2 -2') + ';')}<p>b)</p>${mats(eqm('H', '1 0 0 -1 0 0;0 1 0 0 -1 0;0 0 1 0 0 -1;2 0 1 2 0 1;1 1 1 1 1 1;-1 2 -2 -1 2 -2'))}`, solution: `${ml(`>> G=[A zeros(3);zeros(3) B]
>> H=[A -A;B B]`)}`, check: [{ var: 'G', expected: '[eye(3) zeros(3);zeros(3) [2 0 1;1 1 1;-1 2 -2]]' }, { var: 'H', expected: '[eye(3) -eye(3);[2 0 1;1 1 1;-1 2 -2] [2 0 1;1 1 1;-1 2 -2]]' }] },
    { title: 'Accesare și selecție', statement: `<p>Să se creeze sau calculeze, după caz:</p>
<p>a) Vectorul elementelor impare ale lui r;</p>
<p>b) Vectorul elementelor pozitive ale lui H;</p>
<p>c) Suma elementelor lui H;</p>
<p>d) Matricea elementelor lui H aflate la intersecția liniilor 1,2 și 3 cu coloanele 2,4 și 6;</p>
<p>e) vectorul ri in care elementele lui r sunt în ordine inversă.</p>`, solution: `${ml(`>> r(1:2:end)
>> H(H>0)
>> sum(H(:))
>> H(1:3,2:2:end)
>> ri=r(end:-1:1)`)}`, check: [{ var: 'ri', expected: '[6 5 4 3 2 1]' }] },
    { title: 'Selecții din matricea B', statement: `<p>Utilizând matricea B definită la 1.c) scrieți comenzile necesare pentru a obține:</p>
<p>a) un vector format din elementele primei linii a lui B;</p>
<p>b) o matrice formată cu ultimele două linii ale lui B;</p>
<p>c) un vector a cărui elemente sunt sumele elementelor din coloanele lui B;</p>
<p>d) un vector a cărui elemente sunt sumele elementelor din liniile lui B;</p>
<p>e) o matrice formată din elementele din colțurile lui B.</p>`, solution: `${ml(`>> va=B(1,1:end)
>> Bb=B(end-1:end,1:end)
>> xc=sum(B)
>> xd=sum(B,2)
>> Bd=B([1,end],[1,end])`)}<p>La d), a doua valoare din ${c('sum')} indică după ce dimensiune se face suma (implicit are valoarea 1, deci sumă pe coloane).</p>`, check: [{ var: 'xc', expected: '[2 3 0]' }, { var: 'xd', expected: '[3;3;-1]' }, { var: 'Bd', expected: '[2 1;-1 -2]' }] },
  ],
});
