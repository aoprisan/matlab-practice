LABS.push({
  id: 4,
  title: 'Elemente de grafică',
  blurb: 'Grafice 2D cu <code>plot</code> și specificatorii de linie, marker și culoare; titluri, etichete și text; suprafețe cu <code>meshgrid</code> și <code>surf</code>, linii de contur, <code>subplot</code> și corpuri geometrice cu <code>cylinder</code>, <code>sphere</code>, <code>ellipsoid</code>.',
  sections: [
    { h: 'Grafice 2D cu plot', html: `
      <p>Presupunem un experiment în care, variind o mărime x de la −5 la 5 cu pasul 0.5, am obținut șirul de valori −4, −7, −5, −3, 0, 2, 5, 8, 6, 2, 0, −4, 2, 4, 7, 9, 6, 0, −3, −1, −1. Construim vectorul x al parametrului cu operatorul ${c(':')}, vectorul y al valorilor, apoi desenăm cu ${c('plot')}. Graficul apare într-o fereastră specială, <b>fereastra grafică</b>.</p>
      ${ml(`>> x=-5:0.5:5;
>> y=[-4,-7,-5,-3,0,2,5,8,6,2,0,-4,2,4,7,9,6,0,-3,-1,-1];
>> plot(x,y)`)}
      <p>Completăm graficul cu titlu, etichete pentru axele Ox și Oy și text pe grafic la punctele de minim și maxim. La comanda ${c('text')}, valorile numerice indică punctul (x, y) de unde începe scrierea textului.</p>
      ${ml(`>> x=-5:0.5:5; y=[-4,-7,-5,-3,0,2,5,8,6,2,0,-4,2,4,7,9,6,0,-3,-1,-1];
>> plot(x,y)
>> title('EXEMPLUL 1')
>> xlabel('VARIATIA PARAMETRULUI X')
>> ylabel('REZULTATE')
>> text(-4.5,-7,'minim')
>> text(2.5,9,'maxim')`)}` },
    { h: 'Specificatorul de linie', html: `
      <p>Forma sintactică este ${c("plot(x,y,speclinie)")}, unde x și y sunt vectorii care definesc punctele, iar <b>speclinie</b> este un șir între apostrofuri care indică, în această ordine, <b>tipul liniei</b>, <b>markerul</b> punctelor și <b>culoarea</b>.</p>
      <table><tr><th>Tip linie</th><th></th><th>Marker</th><th></th><th>Culoare</th><th></th></tr>
      <tr><td>${c('-')}</td><td>linie continuă (implicit)</td><td>${c('+')}</td><td>semnul +</td><td>${c('r')}</td><td>roșu</td></tr>
      <tr><td>${c('--')}</td><td>liniuțe</td><td>${c('o')}</td><td>cerc</td><td>${c('g')}</td><td>verde</td></tr>
      <tr><td>${c(':')}</td><td>puncte</td><td>${c('*')}</td><td>asterisc</td><td>${c('b')}</td><td>albastru</td></tr>
      <tr><td>${c('-.')}</td><td>linie-punct</td><td>${c('.')}</td><td>punct</td><td>${c('c')}</td><td>bleu (cyan)</td></tr>
      <tr><td></td><td></td><td>${c('x')}</td><td>cruce</td><td>${c('m')}</td><td>mov (magenta)</td></tr>
      <tr><td></td><td></td><td>${c('s')}</td><td>pătrat</td><td>${c('y')}</td><td>galben</td></tr>
      <tr><td></td><td></td><td>${c('d')}</td><td>romb</td><td>${c('k')}</td><td>negru</td></tr>
      <tr><td></td><td></td><td>${c('^ v > <')}</td><td>triunghi cu vârful sus / jos / dreapta / stânga</td><td>${c('w')}</td><td>alb</td></tr>
      <tr><td></td><td></td><td>${c('p')}, ${c('h')}</td><td>pentagramă, hexagramă</td><td></td><td></td></tr></table>
      <p>Graficul funcției f(x) = x·sin(x) pe [−π, π], cu rația 0.01. Cum x este vector și sin(x) e tot vector, înmulțirea se face cu operația cu punct ${c('.*')}:</p>
      ${ml(`>> x=-pi:0.01:pi;
>> y=x.*sin(x);
>> plot(x,y,'-xr')
>> title('Graficul functiei x*sin(x)')
>> xlabel('x')
>> ylabel('x*sin(x)')`)}
      <div class="note">Punct-virgula de la sfârșitul definirii lui x anulează afișarea pe ecran a vectorului (nu mai puțin de 629 de elemente). Folosește ${c(';')} ca să nu umpli ecranul cu numere – dar nu-l folosi când depanezi un program și vrei să vezi valorile.</div>
      <p>Mai multe curbe pe aceeași figură: ${c("plot(x,y1,'r',x,y2,'b',x,y3,'g')")}.</p>` },
    { h: 'Suprafețe: meshgrid, surf, contur', html: `
      <p>Putem reprezenta și suprafața z = f(x, y). Pentru f(x, y) = ${frac('x·y', '√(x<sup>2</sup> + y<sup>2</sup> + 1)')} pe x ∈ [−2, 2], y ∈ [−4, 4] definim mai întâi <b>matricile</b> domeniului cu ${c('meshgrid')}, apoi folosim ${c('surf')}:</p>
      ${mls(`>> [x,y]=meshgrid([-2:0.2:2],[-4:0.4:4]);
>> z=x.*y./sqrt(x.^2+y.^2+1);
>> surf(x,y,z)`)}
      <p>${c('meshgrid')} transformă domeniile de tip vector ale lui x și y în matrici, pentru că ${c('surf')} cere ca variabilele de intrare să fie matrici. În locul lui ${c('surf')} se pot folosi ${c('mesh')}, ${c('surfc')}, ${c('meshc')} – ultimele două desenează și liniile de contur pe planul xOy. Doar liniile de contur: ${c('contour(x,y,z)')} și ${c('contourf(x,y,z)')}; ultima umple cu culoare diferențele de nivel.</p>
      <p>Pentru mai multe desene pe același ecran: ${c('subplot(n,m,k)')}, unde n este numărul de linii de subferestre, m numărul de coloane, iar k numărul ferestrei care devine activă.</p>
      ${mls(`>> subplot(1,2,1)
>> contour(x,y,z)
>> subplot(1,2,2)
>> contourf(x,y,z)`)}
      <div class="warn">Consola de aici desenează doar grafice 2D (${c('plot')}, ${c('fplot')}). Comenzile 3D le exersezi în MATLAB.</div>` },
    { h: 'Figuri geometrice în spațiu', html: `
      <ul>
        <li>${c('cylinder(y,n)')} desenează un corp de rotație în jurul axei z generat de curba dată de vectorul y, cu n puncte pe circumferință. Dacă raza este constantă desenează o prismă regulată cu baza cu n laturi; cu ea se pot desena și piramide sau conuri.</li>
        <li>${c('sphere(n)')} – o sferă cu n puncte pe circumferință.</li>
        <li>${c('ellipsoid(xc,yc,zc,rx,ry,rz)')} – un elipsoid cu centrul (xc, yc, zc) și semiaxele rx, ry, rz.</li>
      </ul>
      <table><tr><th>Figura</th><th>Comenzi</th></tr>
      <tr><td>cilindru</td><td>${c('cylinder')}</td></tr>
      <tr><td>paralelipiped dreptunghic</td><td>${c('cylinder(4,4)')} (prismă cu baza pătrat)</td></tr>
      <tr><td>piramidă cu baza pătrat</td><td>${c('x=0:0.2:2; y=x-2; cylinder(y,4)')}</td></tr>
      <tr><td>trunchi de piramidă hexagonală</td><td>${c('x=0:0.2:2; y=x-3; cylinder(y,6)')}</td></tr>
      <tr><td>con</td><td>${c('x=0:0.2:2; y=x-2; cylinder(y,40)')}</td></tr>
      <tr><td>trunchi de con</td><td>${c('x=0:0.2:2; y=x-3; cylinder(y,40)')}</td></tr>
      <tr><td>suprafață de rotație y = x·sin(x)</td><td>${c('x=-pi/2:pi/10:pi/2; y=x.*sin(x); cylinder(y,40)')}</td></tr>
      <tr><td>sferă</td><td>${c('sphere')}</td></tr>
      <tr><td>elipsoid centrat în origine, raze 1, 8, 3</td><td>${c('ellipsoid(0,0,0,1,8,3)')}</td></tr></table>
      <p>Pentru intersecții de figuri se desenează prima, apoi ${c('hold on')} păstrează figura și a doua se desenează peste ea: ${c('x=0:0.1:2; y=x-2; cylinder(y,50); hold on; cylinder;')}.</p>` },
  ],
  cheat: [
    ['plot(x,y)', 'grafic 2D al punctelor (x,y) unite cu linie'],
    ["plot(x,y,'-xr')", 'specificator: tip linie, marker, culoare (în această ordine)'],
    ["- -- : -.", 'linie continuă, liniuțe, puncte, linie-punct'],
    ['+ o * . x s d ^ v > < p h', 'markere'],
    ['r g b c m y k w', 'roșu, verde, albastru, bleu, mov, galben, negru, alb'],
    ["title('..') xlabel('..') ylabel('..')", 'titlu, etichete axe'],
    ["text(x,y,'..')", 'text pe grafic începând din punctul (x,y)'],
    ['plot(x,y1,x,y2,x,y3)', 'mai multe curbe pe aceeași figură'],
    ['hold on', 'păstrează figura pentru desenele următoare'],
    ['subplot(n,m,k)', 'n×m subferestre, k devine activă'],
    ['[X,Y]=meshgrid(x,y)', 'transformă vectorii domeniului în matrici pentru surf'],
    ['surf mesh surfc meshc', 'suprafețe; cu c: și liniile de contur pe xOy'],
    ['contour contourf', 'linii de contur; contourf colorează nivelele'],
    ['cylinder(y,n)', 'corp de rotație generat de vectorul y, n puncte pe circumferință'],
    ['sphere(n)', 'sferă'],
    ['ellipsoid(xc,yc,zc,rx,ry,rz)', 'elipsoid cu centrul și semiaxele date'],
  ],
  cards: [
    { q: 'Sintaxa generală a lui plot și semnificația celor trei argumente', a: c("plot(x,y,speclinie)") + ': x și y sunt vectorii punctelor, iar speclinie un șir între apostrofuri cu tipul liniei, markerul și culoarea, în această ordine.' },
    { q: "Ce desenează " + c("plot(x,y,'-xr')") + '?', a: 'Linie continuă (' + c('-') + '), marker cruce (' + c('x') + ') în fiecare punct, culoare roșie (' + c('r') + ').' },
    { q: 'Simbolurile pentru tipurile de linie', a: c('-') + ' continuă (implicit), ' + c('--') + ' liniuțe, ' + c(':') + ' puncte, ' + c('-.') + ' linie-punct.' },
    { q: 'Simbolurile culorilor', a: c('r') + ' roșu, ' + c('g') + ' verde, ' + c('b') + ' albastru, ' + c('c') + ' bleu, ' + c('m') + ' mov, ' + c('y') + ' galben, ' + c('k') + ' negru, ' + c('w') + ' alb.' },
    { q: 'De ce se scrie ' + c('y=x.*sin(x)') + ' și nu ' + c('y=x*sin(x)') + '?', a: 'x și sin(x) sunt vectori; înmulțirea element cu element cere operatorul cu punct ' + c('.*') + '. Cu ' + c('*') + ' ar fi produs matriceal, imposibil între doi vectori linie.' },
    { q: 'Ce fac ' + c("title") + ', ' + c('xlabel') + ', ' + c('ylabel') + ', ' + c('text') + '?', a: 'Pun titlul graficului, eticheta axei Ox, eticheta axei Oy, respectiv un text care începe din punctul (x, y) indicat: ' + c("text(-4.5,-7,'minim')") + '.' },
    { q: 'La ce servește ' + c(';') + ' la sfârșitul unei comenzi și când NU e bine să-l folosești?', a: 'Anulează afișarea rezultatului (util pentru vectori cu sute de elemente). Nu-l folosi când depanezi un program și vrei să vezi valorile.' },
    { q: 'Rolul lui ' + c('meshgrid') + ' înainte de ' + c('surf'), a: 'Transformă domeniile de tip vector x și y în matrici, pentru că ' + c('surf') + ' cere ca variabilele de intrare să fie matrici: ' + c('[x,y]=meshgrid([-2:0.2:2],[-4:0.4:4])') + '.' },
    { q: 'Diferența dintre ' + c('surf') + ', ' + c('surfc') + ', ' + c('contour') + ' și ' + c('contourf'), a: c('surf') + ' desenează suprafața; ' + c('surfc') + '/' + c('meshc') + ' și liniile de contur pe planul xOy; ' + c('contour') + ' doar liniile de contur; ' + c('contourf') + ' umple cu culoare diferențele de nivel.' },
    { q: 'Ce înseamnă ' + c('subplot(1,2,2)') + '?', a: 'Ecranul se împarte în 1 linie × 2 coloane de subferestre, iar a 2-a devine activă pentru următoarea comandă de desenare.' },
    { q: 'Cum desenezi un con cu ' + c('cylinder') + '?', a: c('x=0:0.2:2; y=x-2; cylinder(y,40)') + ' – raza variază liniar de la −2 la 0 (curba y), cu 40 de puncte pe circumferință.' },
    { q: 'Cum desenezi un paralelipiped dreptunghic cu ' + c('cylinder') + '?', a: c('cylinder(4,4)') + ' – rază constantă și 4 puncte pe circumferință dau o prismă cu baza pătrat.' },
    { q: 'Cum desenezi două figuri pe aceeași imagine (intersecție)?', a: 'Desenezi prima, dai ' + c('hold on') + ', apoi desenezi a doua: ' + c('cylinder(y,50); hold on; cylinder') + '.' },
    { q: 'Comanda pentru un elipsoid cu centrul (0,0,0) și raze 1, 8, 3', a: c('ellipsoid(0,0,0,1,8,3)') + '.' },
  ],
  quiz: [
    { type: 'mc', q: 'În ' + c("plot(x,y,'-xr')") + ', ce reprezintă cele trei caractere ale specificatorului, în ordine?', options: ['tip linie, marker, culoare', 'culoare, marker, tip linie', 'marker, culoare, tip linie', 'grosime, stil, culoare'], answer: 0, explain: '<code>-</code> linie continuă, <code>x</code> marker cruce, <code>r</code> roșu.' },
    { type: 'mc', q: 'Ce simbol de culoare înseamnă <b>negru</b>?', options: [c('k'), c('b'), c('n'), c('w')], answer: 0, explain: '<code>b</code> este albastru (blue), <code>k</code> este negru (black), <code>w</code> alb.' },
    { type: 'mc', q: 'Ce simbol dă o linie de tip <b>linie-punct</b>?', options: [c('-.'), c('--'), c(':'), c('.')], answer: 0, explain: '<code>--</code> liniuțe, <code>:</code> puncte, <code>.</code> singur este markerul punct.' },
    { type: 'mc', q: 'Care marker desenează un romb?', options: [c('d'), c('s'), c('o'), c('p')], answer: 0, explain: '<code>d</code> (diamond) romb, <code>s</code> pătrat, <code>o</code> cerc, <code>p</code> pentagramă.' },
    { type: 'fill', q: 'x este vectorul ' + c('-pi:0.01:pi') + '. Scrie comanda care definește y = x·sin(x) fără a afișa rezultatul.', answers: ['y=x.*sin(x);', 'y=sin(x).*x;'], explain: 'Operator cu punct pentru înmulțire element cu element, plus <code>;</code> pentru a nu afișa cele 629 de valori.', placeholder: 'y=...;' },
    { type: 'mc', q: 'Ce se întâmplă dacă scrii ' + c('y=x*sin(x)') + ' pentru un vector linie x cu 629 de elemente?', options: ['eroare: dimensiunile interioare nu se potrivesc (1×629 · 1×629)', 'se obține același rezultat ca la .*', 'se obține un scalar', 'se obține matricea 629×629'], answer: 0, explain: '<code>*</code> este produs matriceal; între doi vectori linie nu este definit. Folosește <code>.*</code>.' },
    { type: 'mc', q: 'Care comandă scrie textul „maxim” pe grafic începând din punctul (2.5, 9)?', options: [c("text(2.5,9,'maxim')"), c("label(2.5,9,'maxim')"), c("title('maxim',2.5,9)"), c("plot(2.5,9,'maxim')")], answer: 0, explain: 'Valorile numerice din <code>text</code> sunt coordonatele (x, y) de unde începe scrierea.' },
    { type: 'tf', q: 'Punct-virgula de la sfârșitul comenzii ' + c('x=-pi:0.01:pi;') + ' oprește calculul până la următoarea comandă.', answer: false, explain: 'Punct-virgula doar anulează afișarea rezultatului pe ecran; vectorul este calculat normal.' },
    { type: 'mc', q: 'De ce este necesar ' + c('meshgrid') + ' înainte de ' + c('surf') + '?', options: [c('surf') + ' cere matrici de intrare, iar meshgrid transformă vectorii domeniului în matrici', 'meshgrid calculează valorile funcției z', 'meshgrid deschide fereastra grafică', 'fără meshgrid surf desenează doar în 2D'], answer: 0, explain: '<code>[x,y]=meshgrid(vx,vy)</code> produce două matrici cu toate combinațiile (x, y) din domeniu.' },
    { type: 'mc', q: 'Care comenzi desenează suprafața <b>și</b> liniile de contur pe planul xOy?', options: [c('surfc') + ' și ' + c('meshc'), c('surf') + ' și ' + c('mesh'), c('contour') + ' și ' + c('contourf'), c('plot3')], answer: 0, explain: 'Sufixul c = contur. <code>contour</code>/<code>contourf</code> desenează doar contururile.' },
    { type: 'mc', q: 'Ce diferență este între ' + c('contour') + ' și ' + c('contourf') + '?', options: [c('contourf') + ' umple cu culoare diferențele de nivel', c('contourf') + ' desenează în 3D', c('contour') + ' cere meshgrid, ' + c('contourf') + ' nu', 'nicio diferență'], answer: 0, explain: 'f = filled.' },
    { type: 'mc', q: 'Ce înseamnă ' + c('subplot(2,2,3)') + '?', options: ['ecran împărțit în 2 linii × 2 coloane; subfereastra a 3-a (stânga-jos) devine activă', '3 grafice pe 2 linii', 'subfereastra de la linia 2, coloana 2, cu 3 curbe', 'un grafic 2×2 cu 3 axe'], answer: 0, explain: 'Argumentele: n linii, m coloane, k = fereastra activă, numerotată pe linii.' },
    { type: 'mc', q: 'Cum desenezi un <b>con</b> cu ' + c('cylinder') + '?', options: [c('x=0:0.2:2; y=x-2; cylinder(y,40)'), c('cylinder(4,4)'), c('cylinder'), c('cone(40)')], answer: 0, explain: 'Raza y variază liniar până la 0 (vârful conului); 40 de puncte pe circumferință dau o suprafață rotundă. Cu <code>y=x-3</code> raza nu ajunge la 0: trunchi de con.' },
    { type: 'mc', q: 'Ce desenează ' + c('cylinder(4,4)') + '?', options: ['o prismă cu baza pătrat (paralelipiped dreptunghic)', 'un cilindru de rază 4', 'o piramidă cu 4 fețe', 'un con cu 4 puncte pe circumferință'], answer: 0, explain: 'Rază constantă = prismă regulată; n = 4 laturi ale bazei.' },
    { type: 'mc', q: 'Ce diferență este între ' + c('cylinder(y,4)') + ' cu ' + c('y=x-2') + ' și ' + c('cylinder(y,6)') + ' cu ' + c('y=x-3') + ' (x=0:0.2:2)?', options: ['prima este o piramidă cu baza pătrat, a doua un trunchi de piramidă hexagonală', 'prima este un con, a doua un cilindru', 'ambele sunt piramide', 'prima este o sferă'], answer: 0, explain: 'Raza y=x−2 ajunge la 0 (vârf) → piramidă; y=x−3 se oprește la −1 → trunchi. n = 4, respectiv 6 laturi.' },
    { type: 'fill', q: 'Scrie comanda pentru un elipsoid cu centrul în (0,0,0) și raze rx=1, ry=8, rz=3.', answers: ['ellipsoid(0,0,0,1,8,3)'], explain: 'Argumentele: centrul (xc, yc, zc), apoi semiaxele rx, ry, rz.' },
    { type: 'mc', q: 'Ce comandă păstrează figura curentă ca să desenezi o a doua figură peste ea?', options: [c('hold on'), c('figure'), c('subplot'), c('keep')], answer: 0, explain: 'Exemplu de intersecție: <code>cylinder(y,50); hold on; cylinder</code>.' },
    { type: 'mc', q: 'Cum reprezinți patru funcții y1..y4 pe <b>aceeași</b> figură?', options: [c("plot(x,y1,'r',x,y2,'b',x,y3,'g',x,y4,'m')"), c('plot(x,[y1 y2 y3 y4])'), c('subplot(2,2,1); plot(x,y1) ...'), c('plot(x,y1); plot(x,y2)') + ' fără hold on'], answer: 0, explain: '<code>plot</code> acceptă mai multe triplete x, y, spec. Varianta cu <code>subplot(2,2,k)</code> le pune în ferestre separate pe același ecran.' },
  ],
  exercises: [
    { title: 'Patru funcții pe [−2, 2]', statement: `<p>Reprezintă y<sub>1</sub> = e<sup>x/2</sup> sin(2x), y<sub>2</sub> = ${frac('x − 2', 'x<sup>2</sup> + 1')}, y<sub>3</sub> = x·sin(x<sup>2</sup> + 1), y<sub>4</sub> = √(x<sup>2</sup> + 1)·arctg(x) pe x ∈ [−2, 2]: a) toate pe aceeași figură; b) fiecare în figura ei, dar toate pe același ecran.</p>`, hint: '<p>Toate operațiile cu x sunt element cu element: ' + c('.* ./ .^') + '. Pentru b) folosește ' + c('subplot(2,2,k)') + '.</p>', solution: `${ml(`>> x=-2:0.1:2; y1=exp(x/2).*sin(2*x); y2=(x-2)./(x.^2+1);
>> y3=x.*sin(x.^2+1); y4=sqrt(x.^2+1).*atan(x);
>> plot(x,y1,'r',x,y2,'b',x,y3,'g',x,y4,'m')`)}<p>b) ${c("subplot(2,2,1); plot(x,y1,'r'); subplot(2,2,2); plot(x,y2,'b'); subplot(2,2,3); plot(x,y3,'g'); subplot(2,2,4); plot(x,y4,'m')")}</p>`, check: [{ var: 'y1', expected: 'exp((-2:0.1:2)/2).*sin(2*(-2:0.1:2))' }, { var: 'y2', expected: '((-2:0.1:2)-2)./((-2:0.1:2).^2+1)' }, { var: 'y3', expected: '(-2:0.1:2).*sin((-2:0.1:2).^2+1)' }, { var: 'y4', expected: 'sqrt((-2:0.1:2).^2+1).*atan(-2:0.1:2)' }] },
    { title: 'Suprafețe (în MATLAB)', statement: `<p>a) z = ${frac('sin √(x<sup>2</sup> + y<sup>2</sup>)', '√(x<sup>2</sup> + y<sup>2</sup>)')} pe [−8, 8]², cu mesh, meshc, surf, surfc în figuri diferite pe același ecran; b) z = x·sin(x)·cos(y) pe [−π, π]²; c) liniile de contur ale celor două grafice, cu contour și contourf, patru desene pe aceeași imagine.</p>`, hint: '<p>Adaugă ' + c('eps') + ' sub radical ca să eviți împărțirea cu 0 în origine.</p>', solution: `${mls(`>> x=-8:0.5:8; y=x; [X,Y]=meshgrid(x,y);
>> Z=sin(sqrt(X.^2+Y.^2+eps))./sqrt(X.^2+Y.^2+eps); surf(X,Y,Z)
>> x=-pi:pi/10:pi; y=x; [X,Y]=meshgrid(x,y);
>> Z=X.*sin(X).*cos(Y); surf(X,Y,Z);
>> subplot(2,2,1); contour(X,Y,Z); subplot(2,2,3); contourf(X,Y,Z)`)}` },
    { title: 'Figuri geometrice (în MATLAB)', statement: `<p>Desenează: a) un cilindru; b) un paralelipiped dreptunghic; c) o piramidă cu baza pătrat; d) un trunchi de piramidă cu baza hexagonală; e) un con; f) un trunchi de con; g) suprafața de rotație generată de y = x·sin(x); h) o sferă; i) un elipsoid centrat în origine cu raze 1, 8, 3.</p>`, solution: `${mls(`>> cylinder
>> cylinder(4,4)
>> x=0:0.2:2; y=x-2; cylinder(y,4)
>> x=0:0.2:2; y=x-3; cylinder(y,6)
>> x=0:0.2:2; y=x-2; cylinder(y,40)
>> x=0:0.2:2; y=x-3; cylinder(y,40)
>> x=-pi/2:pi/10:pi/2; y=x.*sin(x); cylinder(y,40)
>> sphere
>> ellipsoid(0,0,0,1,8,3)`)}` },
    { title: 'Intersecții de figuri (în MATLAB)', statement: `<p>a) un cilindru și un con; b) un elipsoid cu centrul (0, 0, 0.5) și raze 1.5, 1, 0.75 cu conul generat de y = x/2 − 4 pentru x = 0:0.5:8.</p>`, solution: `${mls(`>> x=0:0.1:2; y=x-2; cylinder(y,50); hold on; cylinder;
>> ellipsoid(0,0,0.5,1.5,1,0.75); hold on; x=0:0.5:8; y=0.5*x-4; cylinder(y,40)`)}` },
  ],
});
