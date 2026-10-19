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
    { title: 'Depanează scriptul supr1', statement: `<p>Scrieți exact așa cum este scris scriptul supr1, apoi depanați-l :</p>${mls(`x=-2:0,2:2;
y=(6-x)./(3-x;
(x,y)=meshgraid(x,y);
z=(x.^2+y.^2)/(x*y);
Surf(x,y,z)`)}`, hint: `<p>Erori sintactice:<br>
Linia   1 col.   7 – se pune punct în loc de virgula zecimală (notația americană);<br>
Linia   2 col .14 – paranteză închisă;<br>
Linia   3 col.   3 – paranteze pătrate pentru parametrii de ieșire;<br>
Linia   3 col.   7 – funcția meshgraid inexistentă (este meshgrid);<br>
Linia   4 col. 14 – operația de împărțire cu punct;<br>
Linia   4 col. 18 – operația de împărțire cu punct;<br>
Linia    5 col. 1  - funcția surf cu litera s mic;<br>
 Erori de execuție:<br>
Linia 4  - împărțire cu 0;</p>`, solution: `${mls(`x=-2:0.2:2;
y=(6-x)./(3-x);
[x,y]=meshgrid(x,y);
xxyy=x.*y;
xxyy=xxyy+(xxyy==0)*eps;
x2y2=x.^2+y.^2;
x2y2=x2y2+(x2y2==0)*eps;
z=x2y2./xxyy;
surf(x,y,z)`)}<p>Se obține suprafața z = (x<sup>2</sup>+y<sup>2</sup>)/(x·y) desenată de ${c('surf')} (grafic 3D, disponibil doar în MATLAB). Fără ultima linie, scriptul se poate rula și aici:</p>${ml(`>> x=-2:0.2:2;
>> y=(6-x)./(3-x);
>> [x,y]=meshgrid(x,y);
>> xxyy=x.*y;
>> xxyy=xxyy+(xxyy==0)*eps;
>> x2y2=x.^2+y.^2;
>> x2y2=x2y2+(x2y2==0)*eps;
>> z=x2y2./xxyy;
>> size(z)`)}` },
    { title: 'Matricea alab', statement: `<p>Să se determine matricea alab ale cărui elemente sunt obținute din elementele a doi vectori a și b astfel: fiecare element al lui a este ridicat la puterea fiecare element al lui b. De exemplu dacă a=[1,2] și b= [2,3], atunci alab va fi ${eqm('alab', '1<sup>1</sup> 2<sup>1</sup>;1<sup>3</sup> 2<sup>3</sup>')}, adică: ${eqm('alab', '1 4;1 8')}</p>`, hint: `<p>Este clar că alab va fi o matrice cu numărul de linii egal cu lungimea lui b iar numărul de coloane egal cu lungimea lui a. se pot face două bucle for imbricate pentru determinarea  elementelor lui alab. Aceasta este forma clasică a programării. MATLAB are funcția meshgrid ce transformă vectorii în matrici și care poate fi utilizată.</p>`, solution: `<p>Scriptul alab1:</p>${mls(`tic
r=length(b);
c=length(a);
for i=1:r
    for j=1:c
        alab(i,j)=a(j)^b(i);
    end
end
toc`)}<p>Scriptul alab2:</p>${mls(`tic
[aa,bb]=meshgrid(a,b);
alab=aa.^bb;
toc`)}<p>Execuția:</p>${mls(`>> a=1:10000;
>> b=1:20;
>> alab1
Elapsed time is 2.516000 seconds.
>> alab2
Elapsed time is 0.250000 seconds.`)}<p>Se remarcă timpul mult mai mic al scriptului vectorizat.</p><p>(În enunț, prima linie a primei matrici ar trebui să fie 1<sup>2</sup> 2<sup>2</sup>, de unde 1 4.) Cele două scripturi se pot rula și aici:</p>${ml(`>> a=1:10000;
>> b=1:20;
>> tic
>> r=length(b);
>> c=length(a);
>> for i=1:r
..     for j=1:c
..         alab(i,j)=a(j)^b(i);
..     end
.. end
>> toc
>> tic
>> [aa,bb]=meshgrid(a,b);
>> alab=aa.^bb;
>> toc
>> a=[1,2]; b=[2,3];
>> [aa,bb]=meshgrid(a,b);
>> alab=aa.^bb`)}`, check: [{ var: 'alab', expected: '[1 4;1 8]' }] },
    { title: 'Tips and tricks', statement: `<p>Tips and tricks. Sub acest nume în informatică se înțelege șmecheria, trucul cu care obținem mai rapid o soluție. In acest punct de vedere vectorizarea pare că face parte din această categorie.<br>
a) Cum definim o matrice a cărui elemente sunt egale cu un număr dat. Da-ti cel puțin două soluții.<br>
b) Cum obținem un vector a cărui elemente sunt în ordine inversă cu cele ale unui vector dat? Da-ți o soluție cu buclă și una vectorizată.<br>
c) Cum definim o matrice de tip mXn cu coloane identice cu un vector dat? Dați cel puțin două soluții.</p>`, hint: `<p>a) O soluție ar fi utilizarea lui ones(n,m). O altă soluție ar fi utilizarea funcției repmat(A,n,m) care repetă o matrice A de n ori pe linie și de m ori pe coloană.<br>
b) Definim o buclă în care primul element al noului vector să fie egal cu ultimul element al celui dat, al doilea element al noului vector să fie egal cu penultimul element al celui dat, ș. a. m. d. pentru vectorizare putem utiliza adresarea cu operatorul :.<br>
c) Fiind vorba de o matrice o vom crea cu două bucle for îmbricate. Există și forme vectorizate ale scriptului bazate pe concatenare și operatorul : sau repmat.</p>`, solution: `<p>a) Presupunem că t este constanta egală cu toate elementele și n și m dimensiunile matricii. Putem da oricare din comenzile:</p>${mls(`>> A=k*ones(n,m);`)}<p>Sau</p>${mls(`>> A=k; A=repmat(A,n,m);`)}<p>b) O buclă for rezolvă problema:</p>${mls(`for i=1:length(v)
    w(i)=v(length(x)-i+1);
end`)}<p>Vectorul w va conține elementele lui v în ordine inversă. Vectorial:</p>${mls(`W=v(end:-1:1)`)}<p>Iată o utilizare interesantă a lui end.</p><p>c) Presupunem că avem vectorul coloană v de dimensiune m. Atunci putem creaa matricea M astfel:</p>${mls(`for i=1:m
    for j=1:n
        M(i,j)=v(i);
    end
end`)}<p>Variantele vectorizate sunt:</p>${mls(`N=v(:,ones(n,1))`)}<p>Sau</p>${mls(`O=repmat(v,1,n)`)}<p>(La a) constanta este notată k în comenzi; la b) în buclă trebuie ${c('length(v)')} în loc de ${c('length(x)')}.) Toate variantele, rulate pe exemple:</p>${ml(`>> k=7; n=2; m=3;
>> A=k*ones(n,m)
>> A=k; A=repmat(A,n,m)
>> v=[1 2 3 4];
>> for i=1:length(v)
..     w(i)=v(length(v)-i+1);
.. end
>> w
>> W=v(end:-1:1)
>> v=[1;2;3]; m=3; n=4;
>> for i=1:m
..     for j=1:n
..         M(i,j)=v(i);
..     end
.. end
>> M
>> N=v(:,ones(n,1))
>> O=repmat(v,1,n)`)}`, check: [{ var: 'w', expected: '[4 3 2 1]' }, { var: 'N', expected: '[1 1 1 1;2 2 2 2;3 3 3 3]' }, { var: 'O', expected: '[1 1 1 1;2 2 2 2;3 3 3 3]' }] },
    { title: 'Vectorizarea buclei for cu if', statement: `<p>Vectorizarea buclei for cu if. Deseori prelucrarea elementelor unei matrici conduce l două bucle for îmbricate (pentru a accesa elementul) și un if pentru prelucrare:</p>${mls(`for i=1:r
     for j=1:c
          if cond
            prelucrare1 a(i,j);
          else
            prelucrare2 a(i,j);
          end
     end
end`)}<p>De exemplu pentru condiție avem a(i,j)&gt;5, iar prelecrare 1 poate fi a(i,j)=a(i,j)=5, iar prelucrare 2 : a(i,j)=-a(i,j).<br>Cum se scrie această secvență fără nici un for și fără if?</p>`, hint: '<p>Se va utiliza accesarea indexată.</p>', solution: `<p>Scriptul inițial este forcuif :</p>${mls(`[r,c]=size(A);
for i=1:r
    for j=1:c
        if A(i,j)>5
            A(i,j)=A(i,j)+5;
        else
            A(i,j)=-A(i,j);
        end
    end
end`)}<p>Scriptul cu indexare fararor:</p>${mls(`q=A>5;
A(q)=A(q)+5;
A(~q)=-A(~q);`)}<p>Comparația pe un exemplu (prelucrarea 1 este deci a(i,j)=a(i,j)+5):</p>${ml(`>> A=[1 7 3;9 5 6];
>> [r,c]=size(A);
>> for i=1:r
..     for j=1:c
..         if A(i,j)>5
..             A(i,j)=A(i,j)+5;
..         else
..             A(i,j)=-A(i,j);
..         end
..     end
.. end
>> A
>> A=[1 7 3;9 5 6];
>> q=A>5;
>> A(q)=A(q)+5;
>> A(~q)=-A(~q)`)}` },
    { title: 'Funcția indlinie', statement: `<p>Să se scrie o funcție indlinie care are ca parametru de intrare o matrice Iar ca parametru de ieșire o matrice cu același număr de linii și cu două coloane ce va conține indicii primului element nenul al fiecărei linii din matricea inițială. Matricea de ieșire va avea mai puține linii dacă în matricea de intrare există linii numai cu 0. Încercați să determinați și o formă vectorizată a funcției.</p>`, hint: '<p>Prelucrarea obișnuită a elementelor unei matrici cu două bucle for și un if ca la Ex. 4 anterior se complică prin faptul că apare o condiție în plus (aceasta este prelucrarea doar a primului element din linie). Cum MATLAB memorează matricile pe coloană vectorizarea acestei probleme trebuie altfel gândită (dacă este posibil)..Pentru prelucrarea cu for-if este necesar un semnal care să ne spună că pentru linia în execuție am găsit deja primul element. Pentru matricea y de ieșire este necesar un indice de lucru special ce trebuie incrementat cu 1 la fiecare memorare de indici.</p>', solution: `<p>Funcția indlinie nevectorizată este:</p>${mls(`function y=indlinie(x)
% determinam dimensiunile lui x
[r,c]=size(x);
% indicele de memorare al solutiei y este initializat
k=0;
% definim vectorul de atentionare. 1=nu s-a determinat vre-un element
% pozitiv 0= s-a gasit deja primul element pozitiv
steag=ones(r,1);
for i=1:r
    for j=1:c
% conditia este element pozitiv si nu exista altul anterior pe linie
        if (x(i,j)~=0)&(steag(i)==1)
            steag(i)=0; % se anunta primul element s-a gasit
            k=k+1; % se pozitioneaza indicele pentru memorare
            y(k,1)=i; % se memoreaza linia
            y(k,2)=j; % se memoreaza coloana
        end
    end
end`)}<p>Iar funcția vectorizată indliniv este:</p>${mls(`function y=indliniv(x)
% determinam indici la toate elementele nenule din matrice in r linia
%  iar in c coloana
[r,c]=find(x);
% sortam cu functia sortrows dupa linii ca sa apara indicii in ordinea
% liniilor
linsort=sortrows([r,c]);
% daca diferenta dintre indicii consecutivi de linii este 0 elementele se
% afla pe aceiasi linie si-l semnalam corect doar pe primul
indx=[true;diff(linsort(:,1))~=0];
% alegem din linsort acele elemente pentru care conditia anteruioara a pus
% 1(true) deoarece acestea sunt primele pe liniile lor
y=linsort(indx,:);`)}<p>Punerea în execuție:</p>${ml(`%% function y=indlinie(x)
%% [r,c]=size(x);
%% k=0;
%% steag=ones(r,1);
%% for i=1:r
%%     for j=1:c
%%         if (x(i,j)~=0)&(steag(i)==1)
%%             steag(i)=0;
%%             k=k+1;
%%             y(k,1)=i;
%%             y(k,2)=j;
%%         end
%%     end
%% end
%% end
>> A=[ 0 0 1 ;0 1 0 ;0 0 1 ;1 1 2 ;0 2 1 ; 0 0 0 ;0 0 2 ];
A =
     0     0     1
     0     1     0
     0     0     1
     1     1     2
     0     2     1
     0     0     0
     0     0     2
>> y=indlinie(A)
y =
     1     3
     2     2
     3     3
     4     1
     5     2
     7     3`)}${mls(`>> y=indliniv(A)
y =
     1     3
     2     2
     3     3
     4     1
     5     2
     7     3`)}<p>Pe fiecare linie a lui y prima valoare este linia , iar a doua valoare este coloana elementelor căutate</p><p>(În îndrumar, linia a 4-a din indlinie apare fără ${c('%')} în față; este un comentariu. Funcția ${c('sortrows')} folosită de indliniv nu este disponibilă în consola acestui site, de aceea ultimul apel este afișat static.)</p>`, starter: "function y=indlinie(x)\n[r,c]=size(x);\nk=0;\nsteag=ones(r,1);\nfor i=1:r\n    for j=1:c\n        if (x(i,j)~=0)&(steag(i)==1)\n            steag(i)=0;\n            k=k+1;\n            y(k,1)=i;\n            y(k,2)=j;\n        end\n    end\nend" },
    { title: 'Funcția vectz', statement: `<p>Să se creeze o funcție vectz care are ca parametru de intrare un vector, x, iar ca parametru de ieșire un vector y de aceiași lungime ca și x, a;e cărui elemente nenule sunt aceleași ca elementele corespunzătoare din x, iar în locul elementelor nule se pune valoarea elementului nenul anterior. Astfel dacă x=[1 3 0 0 0 4 5 0 0 6 0 7] atunci  y=[ 1 3 3 3 3 4 5 5 5 6 6 7]. Se va presupune că x are întotdeauna primul element nenul.</p>`, hint: `<p>Este necesară o variabilă în care să memorăm pe parcursul unei prelucrări cu o buclă for ultimul element nenul. Această variabilă trebuie inițializată cu valoarea primului element din x (presupus nenul).</p>
<p style="text-indent:2em">Varianta vectorizată se bazează pe următoarele observații. Să presupunem că avem vectorul x=[x1,x2,0,0,x3,0,x4] și putem obține vectorul diferențelor elementelor nenule consecutive</p>
<p style="padding-left:2em">xdcons=[x1,x2-x1,0,0,x3-x2,0,x4-x3],</p>
<p>atunci vectorul soluție</p>
<p style="padding-left:2em">vsol=[x1,x2,x2,x2,x3,x3,x4]</p>
<p>se obține prin aplicarea funcției cumsum asupra lui xdcons. Funcția cumsum(x) creează un vector ce are pe poziția k suma elementelor lui x de la 1 la k, adică pentru vdcons de mai sus</p>
<table style="border-collapse:collapse"><tbody>
<tr><td style="padding:0 2em 0 0">x1</td><td>deci x1</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)</td><td>deci x2</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)+0</td><td>deci x2</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)+0+0</td><td>deci x2</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)+0+0(x3-x2)</td><td>deci x3</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)+0+0(x3-x2)+0</td><td>deci x3</td></tr>
<tr><td style="padding:0 2em 0 0">x1+(x2-x1)+0+0(x3-x2)+0+(x4-x3)</td><td>deci x4.</td></tr>
</tbody></table>`, solution: `<p>Funcția vectz (cu bucla for cu if) este:</p>${mls(`function y=vectz(x)
% functiaa pune n locul elementelor nule ultimul elemeny nenul
%
% apel y =vectz(x) sau vectz(x)
%
% parametrii intrare
%         x - vectorul de prelucrat
% parametrii ieire
%         y - vectorul rezultat
% variabile locale
%        elem_anterior - ultimul element nenul
elem_anterior=x(1);
y=x;
for i =2:length(y)
    if y(i)==0
        y(i)=elem_anterior;
    end
    elem_anterior=y(i);
end`)}<p>Funcția vectorizată (cu funcțiile fiind, diff și cumsum) este:</p>${mls(`function y=vectzo(x)
% functia pune in locul elementelor nule ultimul element nenul
%
% apel y =vectzo(x) sau vectzo(x)
%
% parametrii intrare
%         x - vectorul de prelucrat
% parametrii ieire
%         y - vectorul rezultat
% variabile locale
y=x;
% Se determina indicii elementelor nenule
valind=find(y);
% Se calculeaza diferenta dintre doua elemente nenule consecutive. Doua
% elemente nenule vor fi considerate consecutive chiar daca au elemente
% nule intre ele
y(valind(2:end))=diff(y(valind));
% Cu functia cumsum un element k este suma elementelor de dinaintea lui.
% Cum in y se afla acum diferentele elementelor nenule si elementele nule
% prin aplicarea lui cumsum obtinem exact ce ne trebuie pt. ca un element
% nul nu contribuie cu nimic la suma elementelor anterioare
y=cumsum(y);`)}<p>Punerea în execuție:</p>${ml(`%% function y=vectz(x)
%% elem_anterior=x(1);
%% y=x;
%% for i =2:length(y)
%%     if y(i)==0
%%         y(i)=elem_anterior;
%%     end
%%     elem_anterior=y(i);
%% end
%% end
%% function y=vectzo(x)
%% y=x;
%% valind=find(y);
%% y(valind(2:end))=diff(y(valind));
%% y=cumsum(y);
%% end
>> x=[1 3 0 0 0 4 5 0 0 6 0 7] ;
>> vectz(x)
ans =
    1  3  3  3  3  4  5  5  5  6  6  7
>> vectzo(x)
ans =
    1  3  3  3  3  4  5  5  5  6  6  7`)}<p>Această problemă 6 este un exemplu că uneori vectorizarea este complexă și nu aduce avantaje deosebite.</p>`, starter: "function y=vectz(x)\nelem_anterior=x(1);\ny=x;\nfor i =2:length(y)\n    if y(i)==0\n        y(i)=elem_anterior;\n    end\n    elem_anterior=y(i);\nend\n\nfunction y=vectzo(x)\ny=x;\nvalind=find(y);\ny(valind(2:end))=diff(y(valind));\ny=cumsum(y);" },
  ],
});
