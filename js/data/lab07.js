LABS.push({
  id: 7,
  title: 'Calcule simbolice în algebra liniară',
  blurb: '<code>det</code> și <code>inv</code> pe matrici simbolice, și metoda de rezolvare simbolică a sistemelor compatibile nedeterminate: submatricea de rang maxim, necunoscute principale și secundare.',
  sections: [
    { h: 'det și inv pe matrici simbolice', html: `
      <p>Unele funcții simbolice au primit același nume ca în calculul numeric, pentru simplitate. Determinantul unei matrici simbolice se calculează tot cu ${c('det')}, iar inversa cu ${c('inv')}, indiferent de tipul calculului:</p>
      ${mls(`>> syms a b c d;
>> det([a, b; c, d])
ans =
a*d-b*c
>> B = sym([2/3 1/3;1 1]);
>> r = det(B)
r =
1/3
>> inv([a, b; c, d])
ans =
[ d/(a*d-b*c), -b/(a*d-b*c)]
[ -c/(a*d-b*c), a/(a*d-b*c)]
>> inv(B)
ans =
[ 3, -1]
[ -3, 2]`)}
      <div class="warn">Calculul simbolic nu este disponibil în consola de aici; partea numerică a metodei (${c('rank')}, ${c('\\')} cu valori concrete) se poate exersa.</div>` },
    { h: 'Rezolvarea unui sistem nedeterminat', html: `
      <p>Rezolvarea unui sistem nedeterminat este un calcul simbolic. Considerăm sistemul: x + y + z = 1; x − y + 2z = 2; 2y − z = −1. Definim matricea coeficienților și vectorul termenilor liberi, construim matricea extinsă și comparăm rangurile:</p>
      ${ml(`>> A=[1 1 1;1 -1 2;0 2 -1]
>> B=[1;2;-1]
>> Aext=[A B];
>> rank(A)
>> rank(Aext)`)}
      <p>Rangurile sunt egale, deci sistemul este <b>compatibil</b>. Valoarea comună (2) este mai mică decât numărul necunoscutelor (3), deci sistemul este <b>nedeterminat</b>: o infinitate de soluții.</p>
      <ol>
        <li>Considerăm o <b>submatrice A1</b> a lui A, de ordin egal cu rangul lui A (aici 2) și cu același rang (2). De exemplu coeficienții lui x și y din primele două ecuații: ${c('A1=[1 1;1 -1]')}. Necunoscutele ei sunt <b>necunoscutele principale</b> (x, y); celelalte (z) sunt <b>secundare</b>.</li>
        <li>Vectorul termenilor liberi B1, corespunzător ecuațiilor intrate în submatrice, se obține <b>scăzând coloanele necunoscutelor secundare</b> (privite acum ca simboluri) din termenii liberi: ${c('syms z')}, ${c('B1=[1-z;2-2*z]')}.</li>
        <li>Soluția simbolică: ${c('x=A1\\B1')}.</li>
      </ol>
      ${mls(`>> A1=[1 1;1 -1];
>> syms z
>> B1=[1-z;2-2*z]
>> x=A1\\B1
x =
 3/2-3/2*z
-1/2+1/2*z`)}
      <p>Altfel scris: x = 3/2·(1 − α), y = −1/2·(1 − α), z = α, cu α ∈ ℝ.</p>
      <div class="note">Regulă: numărul necunoscutelor principale = rangul; necunoscutele secundare devin parametri (simboluri) și trec în partea dreaptă cu semn schimbat.</div>` },
  ],
  cheat: [
    ['det(A), inv(A)', 'aceleași nume pentru matrici numerice și simbolice'],
    ['sym([2/3 1/3;1 1])', 'matrice simbolică (rezultate exacte: det = 1/3)'],
    ['rank(A)=rank([A B])<n', 'sistem compatibil nedeterminat'],
    ['A1', 'submatrice de ordin = rang, cu același rang: necunoscutele principale'],
    ['syms z', 'necunoscutele secundare devin simboluri (parametri)'],
    ['B1=[1-z;2-2*z]', 'termeni liberi minus coloanele necunoscutelor secundare'],
    ['x=A1\\B1', 'soluția simbolică în funcție de parametri'],
  ],
  cards: [
    { q: 'Ce dă ' + c('det([a, b; c, d])') + ' pentru simboluri a, b, c, d?', a: c('a*d-b*c') + ' – aceeași funcție det lucrează și simbolic.' },
    { q: 'Ce dă ' + c('inv([a, b; c, d])') + '?', a: '[ d/(a*d-b*c), -b/(a*d-b*c); -c/(a*d-b*c), a/(a*d-b*c) ]' },
    { q: 'Cum verifici că un sistem este compatibil nedeterminat?', a: c('rank(A)') + ' = ' + c('rank([A B])') + ' (compatibil) și valoarea comună &lt; numărul necunoscutelor (nedeterminat).' },
    { q: 'Ce este submatricea A1 în metoda de rezolvare a sistemelor nedeterminate?', a: 'O submatrice a lui A de ordin egal cu rangul lui A și care are același rang. Necunoscutele ale căror coeficienți intră în A1 sunt necunoscutele principale.' },
    { q: 'Ce sunt necunoscutele principale și secundare?', a: 'Principale: cele din submatricea A1 (câte rangul). Secundare: restul; devin simboluri (parametri) și soluția se exprimă în funcție de ele.' },
    { q: 'Cum se obține vectorul B1?', a: 'Din termenii liberi ai ecuațiilor intrate în A1 se scad coloanele necunoscutelor secundare privite ca simboluri: pentru x+y+z=1 și x−y+2z=2 cu z secundar, ' + c('B1=[1-z;2-2*z]') + '.' },
    { q: 'Comanda finală care dă soluția simbolică', a: c('x=A1\\B1') + ' – de exemplu x = 3/2−3/2·z, y = −1/2+1/2·z.' },
    { q: 'Câte necunoscute principale are un sistem de 5 necunoscute cu rangul 3?', a: 'Trei principale și două secundare (parametri α, β).' },
  ],
  quiz: [
    { type: 'mc', q: 'Ce dă ' + c('det([a, b; c, d])') + ' cu a, b, c, d simboluri?', options: [c('a*d-b*c'), c('a*b-c*d'), c('a+d-b-c'), 'o eroare: det lucrează doar numeric'], answer: 0, explain: 'Funcția <code>det</code> are același nume pentru calcul numeric și simbolic.' },
    { type: 'mc', q: 'Ce dă ' + c('det(sym([2/3 1/3;1 1]))') + '?', options: [c('1/3'), c('0.3333'), c('1'), c('2/3')], answer: 0, explain: 'Matrice simbolică ⇒ rezultat exact: 2/3·1 − 1/3·1 = 1/3.' },
    { type: 'mc', q: 'Pentru sistemul din lucrare, rank(A) = rank(Aext) = 2 și sunt 3 necunoscute. Sistemul este:', options: ['compatibil nedeterminat', 'compatibil unic determinat', 'incompatibil', 'nu se poate decide'], answer: 0, explain: 'Ranguri egale ⇒ compatibil; rang < numărul necunoscutelor ⇒ nedeterminat.' },
    { type: 'mc', q: 'Ce ordin trebuie să aibă submatricea A1?', options: ['egal cu rangul lui A (și cu același rang)', 'egal cu numărul ecuațiilor', 'egal cu numărul necunoscutelor', 'oricare, dacă are determinant nul'], answer: 0, explain: 'A1 trebuie să fie nesingulară de ordinul rangului.' },
    { type: 'mc', q: 'Cum se obține B1 pentru ecuațiile x+y+z=1 și x−y+2z=2, cu z secundar?', options: [c('B1=[1-z;2-2*z]'), c('B1=[1+z;2+2*z]'), c('B1=[1;2]'), c('B1=[z;2*z]')], answer: 0, explain: 'Coloanele necunoscutelor secundare (coeficienții lui z: 1 și 2) se scad din termenii liberi.' },
    { type: 'fill', q: 'Scrie comanda care dă soluția simbolică, având A1 și B1 definite.', answers: ['x=A1\\B1', 'A1\\B1'], explain: 'Operatorul \\ lucrează și cu matrici/vectori simbolici.' },
    { type: 'mc', q: 'Soluția x = 3/2−3/2·z, y = −1/2+1/2·z înseamnă:', options: ['o infinitate de soluții, câte una pentru fiecare z = α ∈ ℝ', 'exact două soluții', 'soluția unică pentru z = 0', 'sistemul este incompatibil'], answer: 0, explain: 'z este parametru liber; x și y se exprimă în funcție de el.' },
    { type: 'mc', q: 'Un sistem de 5 ecuații cu 5 necunoscute are rangul 4. Câte necunoscute secundare sunt?', options: ['1', '4', '5', '0'], answer: 0, explain: 'Secundare = necunoscute − rang = 5 − 4 = 1 (un parametru α).' },
    { type: 'mc', q: 'În sistemul c) din aplicații (5 necunoscute, rang 3) necunoscutele principale sunt x, y, z. Câți parametri are soluția?', options: ['2 (t = α, u = β)', '3', '1', '5'], answer: 0, explain: 't și u sunt secundare ⇒ doi parametri.' },
    { type: 'tf', q: 'Pentru a rezolva simbolic un sistem nedeterminat, necunoscutele secundare se trec în partea dreaptă cu semn schimbat, ca simboluri.', answer: true, explain: 'Exact asta face construcția lui B1.' },
    { type: 'mc', q: 'Cum se definește simbolic matricea B 6×6 cu a pe diagonală și b în rest?', options: [c('B=b*ones(6)+(a-b)*diag(ones(1,6))'), c('B=a*eye(6)+b'), c('B=diag(a,b)'), c('B=[a b;b a]')], answer: 0, explain: 'b peste tot, apoi pe diagonală se adaugă a−b ca să rezulte a.' },
    { type: 'mc', q: 'Ce dă ' + c('factor(det(B))') + ' pentru B de mai sus (din soluțiile lucrării)?', options: ['(a+5b)·(a−b)⁵, deci det ≠ 0 pentru a ≠ b și a ≠ −5b', 'a⁶ − b⁶', '(a−b)⁶', '6ab'], answer: 0, explain: 'Condițiile ca determinantul să fie nenul rezultă direct din factorizare.' },
  ],
  exercises: [
    { title: 'Polinoame de matrici și inverse simbolice', statement: `
      <p>a) Fie polinomul P[X] = X<sup>2</sup> − (a + d)·X + (a·d − b·c)·I<sub>2</sub> unde X este o matrice pătrată de ordinul 2, iar ${eqm('I<sub>2</sub>', '1 0;0 1')}. Să se calculeze P[A], unde ${eqm('A', 'a b;c d')}. Analog să se calculeze R[B] pentru polinomul R[X], și matricea B date de:</p>
      <p>R[X] = X<sup>2</sup> − 2·(a + 2·b)·X + (a − b)·(a + 5·b)·I<sub>6</sub></p>
      ${mats(eqm('B', 'a b b b b b;b a b b b b;b b a b b b;b b b a b b;b b b b a b;b b b b b a'))}
      <p>b) Să se calculeze inversele matricilor:</p>
      ${mats(eqm('C', '1 -a 0 0;0 1 -a 0;0 0 1 -a;0 0 0 1') + ' ;', eqm('D', '1 0 0 0 0 b;0 1 0 0 0 0;-a 0 1 0 0 0;0 -a 0 1 0 0;0 0 -a 0 1 0;0 0 0 -a 0 1'))}`,
      solution: `<p><b>Indicații</b></p>
      <p>a)</p>
      ${mls(`>> syms a b c d
>> A=[a b;c d]
>> collect(A^2-(a+d)*A+(a*d-b*c)*eye(2))
>> syms a b
>> B=b*ones(6)+(a-b)*diag(ones(1,6))
>> expand(B^2-2*(a+2*b)*B+(a-b)*(a+5*b)*eye(6))`)}
      <p>b)</p>
      ${mls(`>> C=diag(ones(1,4))-a*diag(ones(1,3),1)
>> inv(C)
>> D=-a*diag(ones(1,4),-2)+diag(ones(1,6))
>> D(1,6)=b
>> inv(D)`)}
      <p><b>Soluții</b></p>
      <p>a)</p>
      ${mats(mat('0 0;0 0') + ' ;', mat('0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0;0 0 0 0 0 0'))}
      <p>b)</p>
      ${mats(mat('1 a a<sup>2</sup> a<sup>3</sup>;0 1 a a<sup>2</sup>;0 0 1 a;0 0 0 1') + ' ;', mat('1 −a<sup>2</sup>·b 0 −a·b 0 −b;0 1 0 0 0 0;a −a<sup>3</sup>·b 1 −a<sup>2</sup>·b 0 −a·b;0 a 0 1 0 0;a<sup>2</sup> −a<sup>4</sup>·b a −a<sup>3</sup>·b 1 −a<sup>2</sup>·b;0 a<sup>2</sup> 0 a 0 1'))}` },
    { title: 'Determinanți', statement: `
      <p>a) Să se arate că determinanții matricilor C și D definite la punctul 1 b) sunt egali.</p>
      ${mats(eqm('C', '1 -a 0 0;0 1 -a 0;0 0 1 -a;0 0 0 1') + ' ;', eqm('D', '1 0 0 0 0 b;0 1 0 0 0 0;-a 0 1 0 0 0;0 -a 0 1 0 0;0 0 -a 0 1 0;0 0 0 -a 0 1'))}
      <p>b) Să se scrie sub formă de produs determinantul matricii B definită la 1a) și să se deducă de aici care sunt condițiile ca determinantul să fie nenul.</p>
      ${mats(eqm('B', 'a b b b b b;b a b b b b;b b a b b b;b b b a b b;b b b b a b;b b b b b a'))}`,
      solution: `<p><b>Indicații</b></p>
      <p>a)</p>
      ${mls(`>> det(C)
>> det(D)`)}
      <p>b)</p>
      ${mls(`>> factor(det(B))`)}
      <p><b>Soluții</b></p>
      <p>a) 1</p>
      <p>b) (a + 5·b)·(a − b)<sup>5</sup> deci a ≠ b, a ≠ −5·b</p>` },
    { title: 'Sisteme nedeterminate', statement: `
      <p>Să se rezolve sistemele nedeterminate:</p>
      <p>a) ${sys(['x + y + t − u = 1', 'x + z + 2·t + u = 2', 'x − t + u = 0'])} ;</p>
      <p>b) ${sys(['x<sub>1</sub> − x<sub>2</sub> + 2·x<sub>3</sub> + 3·x<sub>4</sub> + 5·x<sub>5</sub> = 2', '2·x<sub>1</sub> − 2·x<sub>2</sub> + x<sub>3</sub> − 4·x<sub>5</sub> = 0', '−3·x<sub>1</sub> + x<sub>2</sub> − 2·x<sub>3</sub> − 2·x<sub>4</sub> = 1', '−x<sub>1</sub> + 2·x<sub>2</sub> − 2·x<sub>3</sub> + 3·x<sub>4</sub> + 3·x<sub>5</sub> = 3', '−2·x<sub>2</sub> + x<sub>3</sub> + x<sub>4</sub> + x<sub>5</sub> = 3'])} ;</p>
      <p>c) ${sys(['3·x + y − 2·z + 4·t − u = 10', '2·x + 3·y − z + t + 4·u = 20', 'x − 4·y + 6·z − 2·t − u = −2', '−3·x − 3·y + 9·z − 9·t + 5·u = 7', '4·x − 18·y + 31·z − 13·t = 9'])}</p>`,
      hint: `<p>a) Necunoscute principale x, y, z și secundare (simboluri) t și u. b) Necunoscute principale x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>, x<sub>4</sub> și x<sub>5</sub> secundară. c) Rangul este 3 deci necunoscute principale 3 adică x, y și z, iar secundare t și u. Rangurile se pot verifica numeric în consolă cu ${c('rank')}.</p>`,
      solution: `<p>Verificarea numerică a rangurilor (se poate rula):</p>
      ${ml(`>> A=[1 1 0 1 -1;1 0 1 2 1;1 0 0 -1 1]; rank(A)
>> A=[1 -1 2 3 5;2 -2 1 0 -4;-3 1 -2 -2 0;-1 2 -2 3 3;0 -2 1 1 1]; rank(A)
>> A=[3 1 -2 4 -1;2 3 -1 1 4;1 -4 6 -2 -1;-3 -3 9 -9 5;4 -18 31 -13 0]; rank(A)`)}
      <p><b>Indicații</b></p>
      <p>a) Necunoscute principale x y z și secundare (simboluri) t și u</p>
      ${mls(`>> syms t u
>> A=[1 1 0;1 0 1;1 0 0]
>> B=[1-t+u;2-2*t-u;t-u]
>> x=A\\B`)}
      <p>b) Necunoscute principale x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>, x<sub>4</sub> și x<sub>5</sub> secundară</p>
      ${mls(`>> A=[1 -1 2 3;2 -2 1 0;-3 1 -2 -2;-1 2 -2 3]
>> B=[2-5*t;4*t;1;3-3*t]
>> x=A\\B`)}
      <p>c) Rangul este 3 deci necunoscute principale 3 adică x, y și z, iar secundare t și u.</p>
      ${mls(`>> A=[3 1 -2;2 3 -1;1 -4 6]
>> B=[10-4*t+u;20-t-4*u;-2+2*t+u]
>> x=A\\B`)}
      <p><b>Soluții</b></p>
      <p>a) ${sys(['x = α − β', 'y = −2·α + 2·β + 1', 'z = −3·α + 2', 't = α', 'u = β'])} ; α, β ∈ R</p>
      <p>b) ${sys(['x<sub>1</sub> = −' + frac('32', '33') + ' + ' + frac('64', '33') + '·α', 'x<sub>2</sub> = −' + frac('15', '11') + ' − ' + frac('14', '11') + '·α', 'x<sub>3</sub> = −' + frac('26', '33') + ' − ' + frac('80', '33') + '·α', 'x<sub>4</sub> = ' + frac('35', '33') + ' − ' + frac('37', '33') + '·α', 'x<sub>5</sub> = α'])} ; α ∈ R</p>
      <p>c) ${sys(['x = −16/17·α + 10/3 + 11/51·β', 'y = 10/17·α + 16/3 − 94/51·β', 'z = 15/17·α + 8/3 − 56/51·β', 't = α', 'u = β'])} ; α, β ∈ R</p>` },
  ],
});
