LABS.push({
  id: 12,
  title: 'Depanarea și optimizarea programelor',
  blurb: 'Cele trei clase de erori (sintactice, de execuție, logice), regulile de depanare, măsurarea timpului cu <code>tic</code>/<code>toc</code> și tehnicile de optimizare: vectorizare, funcții built-in, prealocare, accesare indexată.',
  sections: [
    { h: 'Erori sintactice', html: `
      <p>Primul tip de erori: nu respectăm regulile MATLAB pentru expresii, funcții și celelalte componente ale limbajului. MATLAB le semnalează cu roșu. Cele mai des întâlnite trei:</p>
      ${ml(`>> 3/(2+3))`)}
      <p>O paranteză în plus la sfârșit: <i>Unbalanced or misused parentheses or brackets.</i></p>
      ${ml(`>> x=2;
>> 5*(4+2x)`)}
      <p>Omiterea operatorului de înmulțire ${c('*')} – eroarea cea mai des întâlnită: <i>Missing MATLAB operator.</i></p>
      ${ml(`>> 1+2*sinx`)}
      <p>Scrierea incorectă a numelor: <i>Undefined function or variable 'sinx'.</i> Toate funcțiile au argumentul între paranteze rotunde: corect este ${c('sin(x)')}.</p>
      <p>Erorile sintactice sunt ușor de depistat, pentru că MATLAB le semnalează; un program nu este executat până când nu mai are nicio eroare sintactică.</p>` },
    { h: 'Erori de execuție', html: `
      <p>Odată lansat, programul poate depista <b>erori de execuție</b>. Exemplul tipic este împărțirea cu 0; alte operații duc la rezultate nedorite: NaN, Inf sau empty matrix.</p>
      ${mls(`>> x=-2:0.1:2;
>> y=x;
>> [x,y]=meshgrid(x,y);
>> z=x.*sin(y)./(x.^2-y.^2);
Warning: Divide by zero.`)}
      <p>Când x = y apare o împărțire cu 0. Ca în Lucrarea 9, definim ${c('xxyy=x.^2-y.^2')} și înlocuim zerourile cu eps:</p>
      ${ml(`>> x=-2:0.1:2; y=x;
>> [x,y]=meshgrid(x,y);
>> xxyy=x.^2-y.^2;
>> xxyy=xxyy+(xxyy==0)*eps;
>> z=x.*sin(y)./xxyy;
>> size(z)`)}` },
    { h: 'Erori logice și reguli de depanare', html: `
      <p>Programul rulează fără erori, dar nu obținem rezultatul dorit: <b>erori logice</b>, cele mai greu de depistat, pentru că MATLAB nu se ocupă de logica programului – ea ține numai de programator. Se previn și se depistează mai ușor dacă programul este conceput <b>modularizat</b>: descompus în module (funcții sau scripturi), fiecare testat separat – la date de intrare cunoscute, livrează ieșiri corecte. Alte reguli:</p>
      <ol>
        <li>Fă un test cu un set de date inițiale pentru care rezultatele finale și unele intermediare sunt cunoscute și compară.</li>
        <li>Ca să vezi rezultate intermediare, anulează ${c(';')} de la sfârșitul liniei (lucru nerecomandabil în mod obișnuit).</li>
        <li>Adaugă comenzi care listează variabile cheie și locul din program unde au fost listate.</li>
        <li>Folosește comanda ${c('keyboard')}, care oprește execuția și dă controlul tastaturii: poți vizualiza orice variabilă.</li>
        <li>Pentru programe mari, folosește debugger-ul din fereastra Edit (cere experiență).</li>
      </ol>
      <div class="warn">Toate recomandările de mai sus încetinesc substanțial execuția și trebuie înlăturate după depanare.</div>` },
    { h: 'Măsurarea timpului: tic și toc', html: `
      <p>Programul face ce trebuie, dar timpul de rulare este mare: trebuie <b>optimizat</b>. Timpul de execuție se măsoară cu ${c('tic')} și ${c('toc')}. Scriptul rxtictoc:</p>
      ${ml(`>> tic
>> t=1;
>> for i=1:200000
..     t=(t+i)/t;
.. end
>> t
>> toc`)}
      <p>(Manualul folosește 10<sup>7</sup> iterații; pe un P4 cu 1 GB DDR400 a durat 0.297 s.)</p>` },
    { h: 'Tehnici de optimizare', html: `
      <h3>A. Vectorizarea</h3>
      <p>Operațiile se execută asupra întregii matrici, nu element cu element. Înmulțirea element cu element a două matrici 1000×1000 durează 0.031 s vectorizat față de 0.063 s cu bucle; la ${c('sin')} pe 10<sup>7</sup> valori, 4.45 s față de 4.72 s. Pe lângă viteză, vectorizarea înseamnă mai puține comenzi (șanse mai mici de eroare) și claritate. Performanțele codului nevectorizat au crescut mult la MATLAB 6.5 (R13) și 7 (R14), de aceea diferențele sunt mai mici decât la versiunile anterioare.</p>
      ${ml(`>> A=rand(200); B=A;
>> tic; C=zeros(200); for i=1:200, for j=1:200, C(i,j)=A(i,j)*B(i,j); end, end, toc
>> tic; C=A.*B; toc`)}
      <h3>B. Funcții built-in</h3>
      <p>Folosește funcțiile existente în loc să definești altele. Pentru 70!: ${c('gamma(71)')} durează practic 0 s, ${c('prod(1:70)')} cât funcția noastră fact cu buclă – dar măcar nu am scris decât apelul.</p>
      ${ml(`>> n=70;
>> tic; gamma(n+1), toc
>> tic; prod(1:n), toc`)}
      <h3>C. Prealocarea</h3>
      <p>Este esențial să prealoci matricile, mai ales cele mari. Dacă sunt create element cu element, MATLAB mărește dimensiunile la fiecare calcul și matricea riscă să nu ocupe spațiu continuu în memorie, deci accesul e mai lent. Scriptul preal1 (B(i,j) = A(i,j) element cu element) a durat 14.234 s fără prealocare și 0.297 s după ${c('B=zeros(r,c)')}.</p>
      ${ml(`>> k=10000; n=300;
>> A=floor(k*rand(n,n)); [r,c]=size(A);
>> clear B; tic; for i=1:r, for j=1:c, B(i,j)=A(i,j); end, end, toc
>> B=zeros(r,c); tic; for i=1:r, for j=1:c, B(i,j)=A(i,j); end, end, toc`)}
      <p>Primele comenzi arată cum se creează o matrice de ordin n cu numere întregi aleatoare din [0, k]: ${c('floor(k*rand(n,n))')}.</p>
      <h3>D. Accesarea indexată</h3>
      <p>Înlocuiește căutarea elementelor care verifică o condiție cu ${c('A(condiție)')}. Suma elementelor mai mari decât 5: cu bucle și if, 0.922 s; cu ${c('sum(A(A>5))')}, 0.578 s.</p>
      ${ml(`>> A=floor(10*rand(300,300)); [r,c]=size(A);
>> tic; s=0; for i=1:r, for j=1:c, if A(i,j)>5, s=s+A(i,j); end, end, end, s, toc
>> tic; sum(A(A>5)), toc`)}` },
    { h: 'Tips and tricks', html: `
      <table><tr><th>Problemă</th><th>Cu buclă</th><th>Vectorizat</th></tr>
      <tr><td>matrice n×m cu toate elementele k</td><td>—</td><td>${c('A=k*ones(n,m)')} sau ${c('A=repmat(k,n,m)')}</td></tr>
      <tr><td>vector în ordine inversă</td><td>${c('for i=1:length(v), w(i)=v(length(v)-i+1); end')}</td><td>${c('w=v(end:-1:1)')}</td></tr>
      <tr><td>matrice m×n cu coloane identice cu vectorul coloană v</td><td>două bucle for</td><td>${c('N=v(:,ones(n,1))')} sau ${c('O=repmat(v,1,n)')}</td></tr>
      <tr><td>a<sub>i</sub><sup>b<sub>j</sub></sup> pentru vectorii a, b</td><td>două bucle for</td><td>${c('[A,B]=meshgrid(a,b); alab=A.^B')}</td></tr>
      <tr><td>for-for-if: dacă a(i,j)&gt;5 atunci a(i,j)=5, altfel a(i,j)=−a(i,j)</td><td>două bucle și if</td><td>${c('a(a<=5)=-a(a<=5); a(a>5)=5')}</td></tr></table>
      <p>${c('repmat(A,n,m)')} repetă matricea A de n ori pe linie și de m ori pe coloană. ${c('cumsum(x)')} creează vectorul care are pe poziția k suma elementelor lui x de la 1 la k – util pentru completarea zerourilor cu ultimul element nenul anterior (funcția vectz), împreună cu ${c('find')} și ${c('diff')}. Uneori vectorizarea este complexă și nu aduce avantaje deosebite.</p>
      ${ml(`>> a=[1,2]; b=[2,3];
>> [A,B]=meshgrid(a,b); alab=A.^B
>> v=[1;2]; v(:,ones(3,1))
>> repmat(v,1,3)
>> cumsum([1 2 0 0 1])`)}` },
  ],
  cheat: [
    ['Unbalanced or misused parentheses', 'paranteză în plus / lipsă'],
    ['Missing MATLAB operator', 'operator omis, de obicei * (ex. 2x)'],
    ["Undefined function or variable 'sinx'", 'nume scris greșit; funcțiile au argumentul între ( )'],
    ['erori de execuție', 'împărțire cu 0, NaN, Inf, empty matrix'],
    ['erori logice', 'programul rulează dar nu face ce trebuie; se previn prin modularizare'],
    ['keyboard', 'oprește execuția și dă controlul tastaturii'],
    ['tic ... toc', 'măsoară timpul de execuție'],
    ['vectorizare', 'operații pe întreaga matrice, nu element cu element'],
    ['funcții built-in', 'gamma(n+1), prod(1:n) în loc de funcție proprie'],
    ['prealocare', 'B=zeros(r,c) înainte de a umple element cu element'],
    ['accesare indexată', 'sum(A(A>5)) în loc de for-for-if'],
    ['floor(k*rand(n,n))', 'matrice n×n de întregi aleatori din [0,k]'],
    ['repmat(A,n,m)', 'repetă A de n ori pe linie, m ori pe coloană'],
    ['v(end:-1:1)', 'vector inversat'],
    ['cumsum(x)', 'sume cumulate'],
  ],
  cards: [
    { q: 'Cele trei clase de erori și cât de greu se depistează', a: '<b>Sintactice</b> – ușor, MATLAB le semnalează cu roșu și nu execută programul; <b>de execuție</b> – apar în timpul rulării (împărțire cu 0 → NaN/Inf); <b>logice</b> – cele mai grele, MATLAB nu se ocupă de logica programului.' },
    { q: 'Ce eroare dă ' + c('3/(2+3))') + '?', a: 'Unbalanced or misused parentheses or brackets – o paranteză în plus la sfârșit.' },
    { q: 'Ce eroare dă ' + c('5*(4+2x)') + ' și care este eroarea cea mai des întâlnită?', a: 'Missing MATLAB operator – omiterea operatorului de înmulțire *, cea mai frecventă eroare.' },
    { q: 'Ce eroare dă ' + c('1+2*sinx') + '?', a: "Undefined function or variable 'sinx'. Toate funcțiile au argumentul între paranteze rotunde: sin(x)." },
    { q: 'Cum rezolvi eroarea de execuție din ' + c('z=x.*sin(y)./(x.^2-y.^2)') + '?', a: 'Definești ' + c('xxyy=x.^2-y.^2') + ', înlocuiești zerourile cu ' + c('xxyy=xxyy+(xxyy==0)*eps') + ' și apoi ' + c('z=x.*sin(y)./xxyy') + '.' },
    { q: 'Prima regulă pentru prevenirea erorilor logice', a: 'Programul trebuie conceput modularizat: descompus în module (funcții/scripturi), fiecare testat separat cu date de intrare pentru care ieșirile sunt cunoscute.' },
    { q: 'Ce face comanda ' + c('keyboard') + '?', a: 'Oprește execuția programului și dă controlul tastaturii, permițând vizualizarea oricărei variabile. Ca toate ajutoarele de depanare, trebuie înlăturată după depanare.' },
    { q: 'Cum măsori timpul de execuție?', a: c('tic') + ' la început și ' + c('toc') + ' la sfârșit: „Elapsed time is 0.297000 seconds.”' },
    { q: 'Cele patru tehnici de optimizare', a: 'A. Vectorizarea; B. funcții built-in; C. prealocarea; D. accesarea indexată.' },
    { q: 'Ce este vectorizarea și ce avantaje are pe lângă viteză?', a: 'Operațiile se execută asupra întregii matrici, nu element cu element (' + c('C=A.*B') + ' în loc de bucle). Mai puține comenzi (șanse mai mici de eroare) și program mai clar.' },
    { q: 'De ce este importantă prealocarea?', a: 'Fără ea MATLAB mărește matricea la fiecare element nou și memoria poate fi necontinuă: 14.234 s față de 0.297 s cu ' + c('B=zeros(r,c)') + '.' },
    { q: 'Cum creezi o matrice n×n cu întregi aleatori din [0, k]?', a: c('A=floor(k*rand(n,n))') + '.' },
    { q: 'Cum calculezi suma elementelor mai mari ca 5 fără bucle?', a: c('sum(A(A>5))') + ' – accesare indexată; 0.578 s față de 0.922 s cu for-for-if.' },
    { q: 'Două soluții pentru o matrice cu toate elementele egale cu k', a: c('A=k*ones(n,m)') + ' sau ' + c('A=repmat(k,n,m)') + '.' },
    { q: 'Două soluții vectorizate pentru o matrice cu n coloane identice cu vectorul coloană v', a: c('v(:,ones(n,1))') + ' sau ' + c('repmat(v,1,n)') + '.' },
    { q: 'Cum calculezi vectorizat matricea a<sub>i</sub><sup>b<sub>j</sub></sup>?', a: c('[A,B]=meshgrid(a,b); alab=A.^B') + ' – 0.25 s față de 2.5 s cu bucle.' },
    { q: 'Ce face ' + c('cumsum') + ' și unde e folosit?', a: 'Vector cu suma elementelor de la 1 la k pe poziția k. Folosit în varianta vectorizată a lui vectz (completarea zerourilor cu ultimul nenul), împreună cu find și diff.' },
  ],
  quiz: [
    { type: 'mc', q: 'Ce mesaj dă ' + c('3/(2+3))') + '?', options: ['Unbalanced or misused parentheses or brackets.', 'Missing MATLAB operator.', "Undefined function or variable.", 'Divide by zero.'], answer: 0, explain: 'O paranteză în plus – eroare sintactică.' },
    { type: 'mc', q: 'Ce mesaj dă ' + c('5*(4+2x)') + '?', options: ['Missing MATLAB operator.', 'Unbalanced or misused parentheses or brackets.', "Undefined function or variable 'x'.", 'Warning: Divide by zero.'], answer: 0, explain: 'Lipsește * între 2 și x – cea mai frecventă eroare.' },
    { type: 'mc', q: 'Ce mesaj dă ' + c('1+2*sinx') + '?', options: ["Undefined function or variable 'sinx'.", 'Missing MATLAB operator.', 'Unbalanced parentheses.', 'nimic, se calculează sin(x)'], answer: 0, explain: 'Funcțiile au argumentul între paranteze rotunde: sin(x).' },
    { type: 'mc', q: 'Care clasă de erori este cea mai greu de depistat?', options: ['erorile logice', 'erorile sintactice', 'erorile de execuție', 'toate la fel'], answer: 0, explain: 'MATLAB nu se ocupă de logica programului; ea ține numai de programator.' },
    { type: 'tf', q: 'Un program cu erori sintactice este executat până la prima eroare.', answer: false, explain: 'Nu este executat deloc până nu mai are nicio eroare sintactică.' },
    { type: 'mc', q: 'Care este exemplul tipic de eroare de execuție?', options: ['împărțirea cu 0', 'omiterea operatorului *', 'un nume de variabilă greșit', 'lipsa lui end'], answer: 0, explain: 'Duce la NaN, Inf; se evită cu trucul cu eps.' },
    { type: 'mc', q: 'Cum se previn și se depistează mai ușor erorile logice?', options: ['prin modularizare: module testate separat, cu date pentru care rezultatele sunt cunoscute', 'prin eliminarea tuturor buclelor', 'prin folosirea exclusivă a scripturilor', 'prin adăugarea de ; la toate liniile'], answer: 0, explain: 'Plus: teste cu rezultate cunoscute, listarea variabilelor cheie, keyboard, debugger.' },
    { type: 'mc', q: 'Ce face ' + c('keyboard') + '?', options: ['oprește execuția și dă controlul tastaturii pentru a vizualiza variabile', 'citește un caracter de la tastatură', 'afișează harta tastaturii', 'salvează istoricul comenzilor'], answer: 0, explain: 'Instrument de depanare; se înlătură după.' },
    { type: 'tf', q: 'Comenzile adăugate pentru depanare (listări, keyboard, lipsa lui ;) pot rămâne în programul final fără efect asupra vitezei.', answer: false, explain: 'Toate încetinesc substanțial execuția și trebuie înlăturate după depanare.' },
    { type: 'mc', q: 'Cu ce comenzi măsori timpul de execuție?', options: [c('tic') + ' și ' + c('toc'), c('time') + ' și ' + c('stop'), c('clock') + ' și ' + c('elapsed'), c('start') + ' și ' + c('end')], answer: 0, explain: 'toc afișează „Elapsed time is … seconds.”' },
    { type: 'mc', q: 'Ce este vectorizarea?', options: ['executarea operațiilor asupra întregii matrici, nu element cu element', 'transformarea matricilor în vectori coloană', 'folosirea doar a vectorilor linie', 'prealocarea vectorilor'], answer: 0, explain: '<code>C=A.*B</code> în loc de două bucle for.' },
    { type: 'mc', q: 'Care sunt avantajele vectorizării, pe lângă viteză?', options: ['mai puține comenzi (șanse mai mici de eroare) și claritate', 'mai puțină memorie', 'compatibilitate cu C++', 'niciunul'], answer: 0, explain: 'La MATLAB 6.5 și 7 diferența de timp s-a redus, dar celelalte avantaje rămân.' },
    { type: 'mc', q: 'Cum se calculează cel mai rapid 70!?', options: [c('gamma(71)'), c('prod(1:70)'), 'o funcție proprie cu buclă', 'toate la fel'], answer: 0, explain: 'gamma(71): timp practic 0; prod(1:70) durează cât funcția fact cu buclă, dar e doar un apel.' },
    { type: 'mc', q: 'Ce înseamnă prealocarea și ce efect a avut în test?', options: [c('B=zeros(r,c)') + ' înainte de umplere: 0.297 s față de 14.234 s', 'ștergerea lui B înainte: mai rapid', 'folosirea lui rand pentru B', 'nu are efect'], answer: 0, explain: 'Fără prealocare MATLAB redimensionează la fiecare element și memoria poate fi necontinuă.' },
    { type: 'fill', q: 'Scrie comanda care creează o matrice n×n cu întregi aleatori din [0, k].', answers: ['A=floor(k*rand(n,n))', 'floor(k*rand(n,n))', 'floor(k*rand(n))', 'A=floor(k*rand(n))'], explain: '<code>rand</code> dă reali în [0,1); înmulțit cu k și rotunjit în jos.' },
    { type: 'mc', q: 'Care comandă înlocuiește for-for-if pentru suma elementelor mai mari ca 5?', options: [c('sum(A(A>5))'), c('sum(A>5)'), c('A(sum(A)>5)'), c('sum(A)>5')], answer: 0, explain: 'Accesare indexată: <code>A(A>5)</code> dă elementele, <code>sum</code> le adună. <code>sum(A>5)</code> ar număra elementele.' },
    { type: 'mc', q: 'Care sunt două soluții pentru o matrice n×m cu toate elementele k?', options: [c('k*ones(n,m)') + ' și ' + c('repmat(k,n,m)'), c('k*eye(n,m)') + ' și ' + c('zeros(n,m)+k'), c('k(n,m)') + ' și ' + c('fill(k)'), c('diag(k)') + ' și ' + c('ones(k)')], answer: 0, explain: '<code>repmat(A,n,m)</code> repetă A de n ori pe linie, m ori pe coloană. (zeros(n,m)+k merge și el, dar nu e în manual.)' },
    { type: 'mc', q: 'Varianta vectorizată pentru inversarea ordinii elementelor lui v:', options: [c('w=v(end:-1:1)'), c('w=v(1:end)'), c('w=-v'), c('w=v(end)')], answer: 0, explain: 'O utilizare interesantă a lui <code>end</code>.' },
    { type: 'mc', q: 'Cum obții vectorizat matricea cu elementele a<sub>i</sub><sup>b<sub>j</sub></sup>?', options: [c('[A,B]=meshgrid(a,b); alab=A.^B'), c('alab=a.^b'), c('alab=a^b'), c("alab=a'*b")], answer: 0, explain: 'meshgrid transformă vectorii în matrici cu toate combinațiile; pentru a=[1,2], b=[2,3]: [1 4; 1 8].' },
    { type: 'mc', q: 'Cum scrii fără for și fără if: dacă a(i,j)&gt;5 atunci a(i,j)=5, altfel a(i,j)=−a(i,j)?', options: [c('a(a<=5)=-a(a<=5); a(a>5)=5'), c('a=min(a,5)'), c('a(a>5)=5; a=-a'), c('a=-a; a(a>5)=5')], answer: 0, explain: 'Ordinea contează: întâi negăm elementele ≤ 5 (care nu vor fi afectate de a doua atribuire), apoi punem 5.' },
    { type: 'mc', q: 'În scriptul supr1 din aplicații, care linie conține o eroare de <b>execuție</b> (nu sintactică)?', options: [c('z=(x.^2+y.^2)./(x.*y)') + ' – împărțire cu 0 unde x sau y este 0', c('x=-2:0,2:2') + ' – virgulă în loc de punct', c('Surf(x,y,z)') + ' – S mare', c('(x,y)=meshgraid(x,y)') + ' – paranteze rotunde'], answer: 0, explain: 'Celelalte trei sunt erori sintactice. Vectorul −2:0.2:2 conține 0.' },
  ],
  exercises: [
    { title: 'Depanează scriptul supr1', statement: `<p>Scrie exact așa cum este scris scriptul, apoi depanează-l:</p>${mls(`x=-2:0,2:2;
y=(6-x)./(3-x;
(x,y)=meshgraid(x,y);
z=(x.^2+y.^2)/(x*y);
Surf(x,y,z)`)}`, hint: '<p>Caută: virgula zecimală, paranteza neînchisă, parantezele pătrate ale listei de ieșire, numele funcției, operatorii cu punct, litera mare, și apoi împărțirea cu 0.</p>', solution: `<p>Erori sintactice: linia 1 col. 7 – punct în loc de virgulă zecimală (notația americană); linia 2 col. 14 – paranteză neînchisă; linia 3 col. 3 – paranteze pătrate pentru parametrii de ieșire; linia 3 col. 7 – meshgraid nu există (meshgrid); linia 4 col. 14 și 18 – împărțirea și înmulțirea cu punct; linia 5 col. 1 – surf cu s mic. Eroare de execuție: linia 4 – împărțire cu 0.</p>${ml(`>> x=-2:0.2:2;
>> y=(6-x)./(3-x);
>> [x,y]=meshgrid(x,y);
>> xy=x.*y; xy=xy+(xy==0)*eps;
>> z=(x.^2+y.^2)./xy;
>> size(z)`)}<p>În MATLAB urmează ${c('surf(x,y,z)')}.</p>` },
    { title: 'Matricea alab: a<sub>i</sub> la puterea b<sub>j</sub>', statement: `<p>Determină matricea alab cu elementele obținute ridicând fiecare element al lui a la puterea fiecărui element al lui b. Pentru a = [1, 2], b = [2, 3]: alab = [1 4; 1 8]. Compară varianta cu bucle (alab1) cu cea vectorizată (alab2) pentru a = 1:10000, b = 1:20.</p>`, solution: `${ml(`>> a=1:2000; b=1:20;
>> tic; alab=zeros(length(b),length(a)); for i=1:length(b), for j=1:length(a), alab(i,j)=a(j)^b(i); end, end, toc
>> tic; [A,B]=meshgrid(a,b); alab=A.^B; toc
>> a=[1,2]; b=[2,3]; [A,B]=meshgrid(a,b); alab=A.^B`)}<p>Manualul: alab1 (bucle) 2.516 s, alab2 (vectorizat) 0.250 s.</p>`, check: [{ var: 'alab', expected: '[1 4;1 8]' }] },
    { title: 'Tips and tricks', statement: `<p>a) matrice cu toate elementele egale cu un număr dat – două soluții; b) vector cu elementele în ordine inversă – cu buclă și vectorizat; c) matrice m×n cu coloane identice cu un vector dat – două soluții.</p>`, solution: `${ml(`>> k=7; n=2; m=3;
>> A=k*ones(n,m)
>> A=repmat(k,n,m)
>> v=[1 2 3 4];
>> for i=1:length(v), w(i)=v(length(v)-i+1); end, w
>> w=v(end:-1:1)
>> v=[1;2;3]; n=4;
>> for i=1:3, for j=1:n, M(i,j)=v(i); end, end, M
>> N=v(:,ones(n,1))
>> O=repmat(v,1,n)`)}`, check: [{ var: 'w', expected: '[4 3 2 1]' }, { var: 'N', expected: '[1 1 1 1;2 2 2 2;3 3 3 3]' }, { var: 'O', expected: '[1 1 1 1;2 2 2 2;3 3 3 3]' }] },
    { title: 'Vectorizarea buclei for cu if', statement: `<p>Prelucrarea clasică: două bucle for și un if. Pentru condiția a(i,j)&gt;5, prelucrarea 1: a(i,j)=5, prelucrarea 2: a(i,j)=−a(i,j). Cum se scrie fără niciun for și fără if?</p>`, solution: `${ml(`>> a=[1 7 3;9 5 6];
>> b=a; [r,c]=size(b);
>> for i=1:r, for j=1:c, if b(i,j)>5, b(i,j)=5; else b(i,j)=-b(i,j); end, end, end, b
>> a(a<=5)=-a(a<=5); a(a>5)=5`)}`, check: [{ var: 'a', expected: '[-1 5 -3;5 -5 5]' }] },
    { title: 'Funcția indlinie', statement: `<p>Funcția indlinie are ca intrare o matrice și ca ieșire o matrice cu două coloane: indicii (linie, coloană) ai primului element nenul de pe fiecare linie. Liniile numai cu 0 nu apar. Încearcă și o formă vectorizată.</p>`, hint: '<p>Cu for-if e nevoie de un semnal că pentru linia curentă s-a găsit deja primul element, și de un indice de lucru pentru matricea de ieșire, incrementat la fiecare memorare.</p>', solution: `${mls(`function y=indlinie(A)
% indlinie indicii primului element nenul de pe fiecare linie
[r,c]=size(A);
y=[]; k=0;
for i=1:r
   gasit=0;
   for j=1:c
      if A(i,j)~=0 & ~gasit
         k=k+1;
         y(k,1)=i; y(k,2)=j;
         gasit=1;
      end
   end
end`)}${ml(`>> A=[0 0 1;0 1 0;0 0 1;1 1 2;0 2 1;0 0 0;0 0 2];
>> y=indlinie(A)`)}<p>Rezultat: [1 3; 2 2; 3 3; 4 1; 5 2; 7 3]. Varianta vectorizată (indliniv) trebuie gândită altfel, pentru că MATLAB memorează matricile pe coloane.</p>`, starter: "function y=indlinie(A)\n[r,c]=size(A);\ny=[]; k=0;\nfor i=1:r\n   gasit=0;\n   for j=1:c\n      if A(i,j)~=0 & ~gasit\n         k=k+1;\n         y(k,1)=i; y(k,2)=j;\n         gasit=1;\n      end\n   end\nend" },
    { title: 'Funcția vectz', statement: `<p>vectz are ca intrare un vector x și ca ieșire un vector y de aceeași lungime, cu elementele nenule identice cu ale lui x, iar în locul zerourilor ultimul element nenul anterior. Pentru x = [1 3 0 0 0 4 5 0 0 6 0 7], y = [1 3 3 3 3 4 5 5 5 6 6 7]. Primul element este nenul.</p>`, hint: '<p>Cu for: o variabilă care memorează ultimul element nenul, inițializată cu x(1). Vectorizat: construiește vectorul diferențelor elementelor nenule consecutive (cu find și diff) și aplică cumsum.</p>', solution: `${mls(`function y=vectz(x)
% vectz completeaza zerourile cu ultimul element nenul anterior
y=x; ultim=x(1);
for i=1:length(x)
   if x(i)==0
      y(i)=ultim;
   else
      ultim=x(i);
   end
end

function y=vectzo(x)
% vectzo varianta vectorizata cu find, diff si cumsum
p=find(x);
d=zeros(size(x));
d(p)=[x(p(1)) diff(x(p))];
y=cumsum(d);`)}${ml(`>> x=[1 3 0 0 0 4 5 0 0 6 0 7];
>> vectz(x)
>> vectzo(x)`)}<p>Ambele dau 1 3 3 3 3 4 5 5 5 6 6 7. Problema arată că uneori vectorizarea este complexă și nu aduce avantaje deosebite.</p>`, starter: "function y=vectz(x)\ny=x; ultim=x(1);\nfor i=1:length(x)\n   if x(i)==0\n      y(i)=ultim;\n   else\n      ultim=x(i);\n   end\nend\n\nfunction y=vectzo(x)\np=find(x);\nd=zeros(size(x));\nd(p)=[x(p(1)) diff(x(p))];\ny=cumsum(d);" },
  ],
});
