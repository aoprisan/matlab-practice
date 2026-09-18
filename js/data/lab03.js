LABS.push({
  id: 3,
  title: 'Ecuații matriciale și sisteme liniare',
  blurb: 'Operatorii <code>\\</code> și <code>/</code> pentru ecuațiile AX = B și YA = B, clasificarea sistemelor liniare după rang, precizia soluției prin numărul de condiție și valorile proprii cu <code>eig</code>.',
  sections: [
    { h: 'Ecuații matriciale', html: `
      <p>Fie ecuațiile matriciale A·X = B și Y·A = B. Din algebra liniară, soluțiile sunt X = A<sup>−1</sup>B, respectiv Y = B·A<sup>−1</sup>; în MATLAB ${c('X=inv(A)*B')} și ${c('Y=B*inv(A)')}.</p>
      <p>Pornind de la ecuația de gradul 1, a·x = b cu soluția x = b/a, MATLAB a introdus operatorul ${c('\\')} („împărțire la stânga”) care calculează soluția ecuației matriciale <b>altfel</b> decât cu inversa. Testele arată că este obținută <b>mult mai rapid</b>, observabil la matrici mari: pentru matrici de ordinul 1000, soluția cu ${c('\\')} a fost de 400 de ori mai rapidă. Pentru Y·A = B există operatorul ${c('/')}.</p>
      <div class="note">Soluțiile celor două ecuații: ${c('X=A\\B')} pentru A·X = B și ${c('Y=B/A')} pentru Y·A = B.</div>
      ${ml(`>> A=[5 3;3 2]; B=[6 2;2 4]; C=[4 -2;-6 3];
>> X=A\\(C-B)
>> Y=(C-B)/A`)}
      <p>Ecuațiile în care X apare de ambele părți se aduc mai întâi la forma standard. De exemplu A·X + B = X devine (A − I)·X = −B, deci ${c('X=(A-eye(2))\\(-B)')}; iar X·A + B = X devine X·(A − I) = −B, deci ${c('X=(-B)/(A-eye(2))')}.</p>` },
    { h: 'Sisteme liniare', html: `
      <p>Sistemele liniare sunt de trei tipuri:</p>
      <ul>
        <li><b>compatibile unic determinate</b> – au soluție unică;</li>
        <li><b>compatibile nedeterminate</b> – au o infinitate de soluții;</li>
        <li><b>incompatibile</b> – nu au nicio soluție.</li>
      </ul>
      <p>Pentru un sistem de n ecuații cu n necunoscute notăm cu A matricea coeficienților, x vectorul coloană al necunoscutelor și b vectorul coloană al termenilor liberi: forma matriceală este A·x = b. <b>Rangul</b> unei matrici este ordinul celui mai mare determinant nenul care se poate forma cu elementele ei; în MATLAB, ${c('rank(A)')}. <b>Matricea extinsă</b> se obține concatenând orizontal la A vectorul b: ${c('Aext=[A b]')}. Atunci:</p>
      <table><tr><th>Condiție</th><th>Tipul sistemului</th><th>Ce facem</th></tr>
      <tr><td>rank(A) = rank(Aext) = n</td><td>compatibil unic determinat</td><td>${c('x=A\\b')}</td></tr>
      <tr><td>rank(A) = rank(Aext) &lt; n</td><td>compatibil nedeterminat</td><td>infinitatea de soluții se determină simbolic (Lucrarea 7)</td></tr>
      <tr><td>rank(A) ≠ rank(Aext)</td><td>incompatibil</td><td>nu are soluție</td></tr></table>
      ${ml(`>> A=[1 1 1 1;2 -1 -1 -2;-1 3 2 3;1 -2 1 -2]; b=[0;1;-1;-6];
>> rank(A)
>> rank([A b])
>> x=A\\b`)}` },
    { h: 'Precizia soluției', html: `
      <p>Soluțiile, chiar date de formule exacte, sunt totdeauna aproximative; de aceea, înainte de a determina soluția, e bine să calculăm precizia ei. Formula preciziei este</p>
      <p style="text-align:center">p &lt; C · cond(A) · p<sub>comp</sub></p>
      <p>unde p este precizia căutată, C o constantă cu 1 &lt; C &lt; 10 (pentru siguranță luăm C = 10), p<sub>comp</sub> este precizia calculatorului (pentru PC-uri ≈ 2.2·10<sup>−16</sup>), iar cond(A) este <b>numărul de condiție</b> al matricii, dat de ${c('cond(A)')}. În cel mai defavorabil caz, precizia este</p>
      <p style="text-align:center">2.2·10<sup>−15</sup> · cond(A)</p>
      ${ml(`>> A=[1 1 1 1;2 -1 -1 -2;-1 3 2 3;1 -2 1 -2];
>> 2.2e-15*cond(A)`)}
      <p>Pentru sistemul de mai sus rezultatul este ≈ 3.7·10<sup>−14</sup>, deci soluția are cel puțin 14 cifre exacte.</p>` },
    { h: 'Valori și vectori proprii', html: `
      <p>${c('[V,L]=eig(A)')} dă matricea L, pătrată, cu valorile proprii pe diagonala principală, și matricea V ale cărei coloane sunt vectorii proprii corespunzători. Pentru fiecare matrice, ${c('V*L*inv(V)')} reconstruiește A – descompunerea spectrală a matricii.</p>
      ${ml(`>> A=[7 8 2;-5 -6 -2;-1 -1 1];
>> [V,L]=eig(A)
>> V*L*inv(V)`)}
      <p>Pentru matricea A de mai sus valorile proprii sunt −1, 2, 1, cu vectorii proprii (1, −1, 0)<sup>T</sup>, (−2, 1, 1)<sup>T</sup>, (1, −1, 1)<sup>T</sup> (MATLAB îi afișează normați, de exemplu 0.7071 = 1/√2).</p>` },
  ],
  cheat: [
    ['X=A\\B', 'soluția ecuației A·X = B (mai rapid decât inv(A)*B)'],
    ['Y=B/A', 'soluția ecuației Y·A = B'],
    ['x=A\\b', 'soluția sistemului A·x = b'],
    ['rank(A)', 'rangul: ordinul celui mai mare determinant nenul'],
    ['Aext=[A b]', 'matricea extinsă'],
    ['rank(A)=rank(Aext)=n', 'compatibil unic determinat'],
    ['rank(A)=rank(Aext)<n', 'compatibil nedeterminat (infinitate de soluții)'],
    ['rank(A)~=rank(Aext)', 'incompatibil (nicio soluție)'],
    ['cond(A)', 'numărul de condiție'],
    ['2.2e-15*cond(A)', 'precizia soluției în cel mai defavorabil caz'],
    ['[V,L]=eig(A)', 'vectori proprii (coloanele lui V), valori proprii (diagonala lui L)'],
    ['V*L*inv(V)', 'reconstruiește A'],
  ],
  cards: [
    { q: 'Comanda MATLAB pentru soluția ecuației A·X = B', a: c('X=A\\B') + '. Formula clasică ' + c('inv(A)*B') + ' dă același rezultat, dar operatorul \\ este mult mai rapid (de ~400 de ori pentru matrici de ordin 1000).' },
    { q: 'Comanda MATLAB pentru soluția ecuației Y·A = B', a: c('Y=B/A') + ' (echivalent cu ' + c('B*inv(A)') + ').' },
    { q: 'Cum rezolvi A·X + B = X?', a: 'Aduci la forma (A − I)·X = −B: ' + c('X=(A-eye(2))\\(-B)') + '.' },
    { q: 'Cum rezolvi X·A + B = X?', a: 'X·(A − I) = −B, deci ' + c('X=(-B)/(A-eye(2))') + '.' },
    { q: 'Cele trei tipuri de sisteme liniare', a: 'Compatibil unic determinat (soluție unică), compatibil nedeterminat (infinitate de soluții), incompatibil (nicio soluție).' },
    { q: 'Ce este rangul unei matrici și cum îl calculezi?', a: 'Ordinul celui mai mare determinant nenul care se poate forma cu elementele matricii; ' + c('rank(A)') + '.' },
    { q: 'Cum se construiește matricea extinsă a sistemului A·x = b?', a: c('Aext=[A b]') + ' – concatenarea orizontală a lui A cu vectorul coloană b.' },
    { q: 'Când este un sistem compatibil unic determinat?', a: 'Când rank(A) = rank(Aext) = n (numărul necunoscutelor). Se rezolvă cu ' + c('x=A\\b') + '.' },
    { q: 'Când este un sistem incompatibil?', a: 'Când rank(A) ≠ rank(Aext).' },
    { q: 'Când este un sistem compatibil nedeterminat?', a: 'Când rank(A) = rank(Aext) &lt; n. Infinitatea de soluții se determină simbolic (Lucrarea 7).' },
    { q: 'Formula preciziei soluției unui sistem liniar', a: 'p &lt; C·cond(A)·p<sub>comp</sub>, cu C = 10 (1 &lt; C &lt; 10) și p<sub>comp</sub> ≈ 2.2·10<sup>−16</sup>; în cel mai defavorabil caz p = 2.2·10<sup>−15</sup>·cond(A).' },
    { q: 'Ce dă ' + c('[V,L]=eig(A)') + '?', a: 'L: matrice cu valorile proprii pe diagonala principală; V: matrice ale cărei coloane sunt vectorii proprii corespunzători. ' + c('V*L*inv(V)') + ' reconstruiește A.' },
  ],
  quiz: [
    { type: 'fill', q: 'Scrie comanda care rezolvă ecuația matriceală A·X = B cu operatorul recomandat în lucrare.', answers: ['X=A\\B', 'A\\B'], explain: 'Operatorul \\ („împărțire la stânga”) rezolvă A·X = B fără a calcula inversa.', placeholder: 'X=...' },
    { type: 'fill', q: 'Scrie comanda care rezolvă ecuația matriceală Y·A = B.', answers: ['Y=B/A', 'B/A'], explain: 'Pentru necunoscuta din stânga se folosește operatorul /.' },
    { type: 'mc', q: 'De ce se preferă ' + c('A\\B') + ' în locul lui ' + c('inv(A)*B') + '?', options: ['este obținut mult mai rapid, mai ales la matrici mari (de ~400 ori la ordinul 1000)', 'inv(A) nu există în MATLAB', 'rezultatul lui inv(A)*B este întotdeauna greșit', 'A\\B funcționează și pentru matrici nepătrate, inv nu'], answer: 0, explain: 'Operatorul \\ calculează soluția altfel decât cu inversa; diferența de viteză devine observabilă la dimensiuni mari.' },
    { type: 'mc', q: 'Cum se rezolvă A·X + B = X?', options: [c('X=(A-eye(2))\\(-B)'), c('X=A\\(X-B)'), c('X=(-B)/(A-eye(2))'), c('X=inv(A)*B')], answer: 0, explain: 'A·X − X = −B ⇒ (A − I)·X = −B ⇒ X = (A − I)\\(−B).' },
    { type: 'mc', q: 'Cum se rezolvă X·A + B = X?', options: [c('X=(-B)/(A-eye(2))'), c('X=(A-eye(2))\\(-B)'), c('X=B/A'), c('X=A\\(-B)')], answer: 0, explain: 'X·A − X = −B ⇒ X·(A − I) = −B ⇒ X = (−B)/(A − I).' },
    { type: 'mc', q: 'Un sistem cu n necunoscute are rank(A) = rank(Aext) = n. Este:', options: ['compatibil unic determinat', 'compatibil nedeterminat', 'incompatibil', 'nu se poate spune fără cond(A)'], answer: 0, explain: 'Rangurile egale cu numărul necunoscutelor ⇒ soluție unică, x = A\\b.' },
    { type: 'mc', q: 'Un sistem are rank(A) = 3 și rank(Aext) = 4. Este:', options: ['incompatibil (nu are soluție)', 'compatibil nedeterminat', 'compatibil unic determinat', 'compatibil cu exact 3 soluții'], answer: 0, explain: 'Când rangurile diferă, sistemul este incompatibil.' },
    { type: 'mc', q: 'Un sistem cu 4 necunoscute are rank(A) = rank(Aext) = 3. Este:', options: ['compatibil nedeterminat (infinitate de soluții)', 'incompatibil', 'compatibil unic determinat', 'nu are soluție reală'], answer: 0, explain: 'Ranguri egale, dar mai mici decât n ⇒ infinitate de soluții, determinate simbolic în Lucrarea 7.' },
    { type: 'mc', q: 'Ce este rangul unei matrici?', options: ['ordinul celui mai mare determinant nenul care se poate forma cu elementele matricii', 'numărul de linii al matricii', 'numărul elementelor nenule', 'valoarea determinantului'], answer: 0, explain: 'În MATLAB se obține cu <code>rank(A)</code>.' },
    { type: 'fill', q: 'Cum se construiește matricea extinsă a sistemului A·x = b?', answers: ['Aext=[A b]', '[A b]', 'Aext=[A,b]', '[A,b]'], explain: 'Concatenare orizontală a lui A cu vectorul coloană b.' },
    { type: 'mc', q: 'Precizia soluției în cel mai defavorabil caz este:', options: ['2.2·10<sup>−15</sup> · cond(A)', '2.2·10<sup>−16</sup> / cond(A)', 'cond(A) / n', 'det(A) · 10<sup>−16</sup>'], answer: 0, explain: 'p < C·cond(A)·p<sub>comp</sub> cu C = 10 și p<sub>comp</sub> = 2.2·10<sup>−16</sup>.' },
    { type: 'mc', q: 'Pentru un sistem, ' + c('2.2e-15*cond(A)') + ' dă 8.9·10<sup>−12</sup>. Câte cifre exacte are, cel puțin, soluția?', options: ['12', '15', '8', '2'], answer: 0, explain: 'Precizia ≈ 10<sup>−12</sup> înseamnă cel puțin 12 cifre exacte.' },
    { type: 'mc', q: 'Ce reprezintă p<sub>comp</sub> ≈ 2.2·10<sup>−16</sup>?', options: ['precizia calculatorului (a reprezentării în virgulă flotantă)', 'cel mai mic număr real reprezentabil', 'numărul de condiție al matricii', 'eroarea funcției rank'], answer: 0, explain: 'Este distanța dintre 1 și următorul real reprezentabil (eps, vezi Lucrarea 10).' },
    { type: 'mc', q: 'În ' + c('[V,L]=eig(A)') + ', ce conține L?', options: ['valorile proprii, pe diagonala principală', 'vectorii proprii, pe coloane', 'inversa lui A', 'matricea extinsă'], answer: 0, explain: 'V are vectorii proprii pe coloane; L este diagonală cu valorile proprii.' },
    { type: 'tf', q: 'Pentru ' + c('[V,L]=eig(A)') + ', produsul ' + c('V*L*inv(V)') + ' dă înapoi matricea A.', answer: true, explain: 'Este descompunerea spectrală a matricii: A = V·L·V<sup>−1</sup>.' },
    { type: 'mc', q: 'Sistemul tridiagonal de ordin 99 cu 2 pe diagonală, 1 pe vecine și termeni liberi 2 are soluția:', options: ['x<sub>i</sub> = 0 pentru i par, 1 pentru i impar', 'x<sub>i</sub> = 1 pentru toți i', 'x<sub>i</sub> = 2/i', 'nu are soluție'], answer: 0, explain: 'Verifică: pe o linie interioară x<sub>i−1</sub> + 2x<sub>i</sub> + x<sub>i+1</sub> = 0 + 2 + 0 sau 1 + 0 + 1 = 2.' },
    { type: 'fill', q: 'Ce funcție dă numărul de condiție al unei matrici?', answers: ['cond', 'cond(A)'], explain: '<code>cond(A)</code> intră în formula preciziei soluției.' },
  ],
  exercises: [
    { title: 'Ecuații cu matrici bandă 7×7', statement: `<p>A are 1 pe diagonala principală și pe primele două diagonale de deasupra. B are 1 sub diagonală, 3 pe diagonală, 4, 3, 1 pe primele trei diagonale de deasupra, cu B(7,7) = 2. C are 1 sub diagonală, 2 pe diagonală, 3, 2, 1 deasupra, cu C(1,1) = 1 și C(1,2) = 2. Rezolvă A·X = B și Y·A = C.</p>`, hint: '<p>Construiește matricile cu ' + c('diag') + ', corectează elementele izolate prin atribuire directă, apoi ' + c('X=A\\B') + ', ' + c('Y=C/A') + '.</p>', solution: `${ml(`>> A=diag(ones(1,7))+diag(ones(1,6),1)+diag(ones(1,5),2);
>> B=diag(ones(1,6),-1)+3*diag(ones(1,7))+4*diag(ones(1,6),1)+3*diag(ones(1,5),2)+diag(ones(1,4),3); B(7,7)=2;
>> C=diag(ones(1,6),-1)+2*diag(ones(1,7))+3*diag(ones(1,6),1)+2*diag(ones(1,5),2)+diag(ones(1,4),3); C(1,1)=1; C(1,2)=2;
>> X=A\\B
>> Y=C/A`)}<p>X este tridiagonală (1 2 1) cu o ultimă coloană specială; Y este bidiagonală cu 1 pe diagonală și pe cea de sub ea.</p>` },
    { title: 'Ecuații matriciale 2×2', statement: `<p>A = [5 3; 3 2], B = [6 2; 2 4], C = [4 −2; −6 3]. Rezolvă: a) A·X + B = C; b) A·X + B = X; c) X·A + B = C; d) X·A + B = X.</p>`, solution: `${ml(`>> A=[5 3;3 2]; B=[6 2;2 4]; C=[4 -2;-6 3];
>> X=A\\(C-B)
>> X=(A-eye(2))\\(-B)
>> X=(C-B)/A
>> X=(-B)/(A-eye(2))`)}<p>a) [20 −5; −34 7]; b) [0 −2; −2 2]; c) [8 −14; −13 19]; d) [0 −2; −2 2].</p>`, starter: 'A=[5 3;3 2]; B=[6 2;2 4]; C=[4 -2;-6 3];' },
    { title: 'Sisteme liniare și precizia', statement: `<p>Rezolvă, indicând tipul sistemului și numărul de cifre exacte:</p><p>a) x<sub>1</sub>+x<sub>2</sub>+x<sub>3</sub>+x<sub>4</sub>=0; 2x<sub>1</sub>−x<sub>2</sub>−x<sub>3</sub>−2x<sub>4</sub>=1; −x<sub>1</sub>+3x<sub>2</sub>+2x<sub>3</sub>+3x<sub>4</sub>=−1; x<sub>1</sub>−2x<sub>2</sub>+x<sub>3</sub>−2x<sub>4</sub>=−6.</p><p>b) și c) sistemul cu 5 necunoscute din manual, cu ultimul termen liber −2, respectiv 3.</p><p>d) sistemul tridiagonal de ordin 99: 2x<sub>1</sub>+x<sub>2</sub>=2, x<sub>i−1</sub>+2x<sub>i</sub>+x<sub>i+1</sub>=2, x<sub>98</sub>+2x<sub>99</sub>=2.</p>`, hint: '<p>Compară ' + c('rank(A)') + ' cu ' + c('rank([A b])') + ' și cu numărul necunoscutelor. Precizia: ' + c('2.2e-15*cond(A)') + '.</p>', solution: `${ml(`>> A=[1 1 1 1;2 -1 -1 -2;-1 3 2 3;1 -2 1 -2]; b=[0;1;-1;-6];
>> rank(A), rank([A b])
>> 2.2e-15*cond(A)
>> x=A\\b
>> A=2*diag(ones(1,99))+diag(ones(1,98),-1)+diag(ones(1,98),1); b=2*ones(99,1);
>> rank(A), rank([A b])
>> 2.2e-15*cond(A)
>> x=A\\b;
>> x(1:6)'`)}<p>a) rank(A) = rank(Aext) = 4: compatibil determinat, precizie ≈ 3.7·10<sup>−14</sup> (cel puțin 14 cifre), x = (1, 0, −3, 2). b) rank(A) ≠ rank(Aext): incompatibil. c) rank(A) = rank(Aext) = 3 &lt; 4: compatibil nedeterminat. d) rank = 99: compatibil determinat, precizie ≈ 8.9·10<sup>−12</sup>; soluția este x<sub>i</sub> = 0 pentru i par și 1 pentru i impar.</p>` },
    { title: 'Valori și vectori proprii', statement: `<p>Pentru A = [7 8 2; −5 −6 −2; −1 −1 1] și B = [3 7 0 −6; −2 0 0 0; 6 12 −1 −9; −2 2 0 −2] determină valorile proprii și vectorii proprii. Dacă L are valorile proprii pe diagonală și V vectorii proprii pe coloane, calculează V·L·inv(V). Ce observi?</p>`, solution: `${ml(`>> A=[7 8 2;-5 -6 -2;-1 -1 1];
>> [V,L]=eig(A)
>> V*L*inv(V)
>> B=[3 7 0 -6;-2 0 0 0;6 12 -1 -9;-2 2 0 -2];
>> [V,L]=eig(B)`)}<p>Pentru A: λ = −1, 2, 1 cu vectorii proprii (1, −1, 0), (−2, 1, 1), (1, −1, 1). V·L·inv(V) = A. Pentru B: λ = −1, 2, 1, −2.</p>` },
  ],
});
