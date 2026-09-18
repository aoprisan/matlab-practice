LABS.push({
  id: 11,
  title: 'Programe m-file. Intrare–ieșire',
  blurb: 'Scripturi și funcții (<code>function</code>), diferențele dintre ele, <code>input</code>, <code>disp</code>, <code>fprintf</code> cu formatele <code>%d %f %e %g %s</code>, <code>save</code>/<code>load</code>, comentariile de ajutor și funcțiile <code>radpat</code>, <code>e1</code>, <code>e2</code>, <code>brrc</code>.',
  sections: [
    { h: 'Script și funcție', html: `
      <p>Programele sursă MATLAB, numite generic <b>m-files</b>, sunt de două tipuri: <b>script</b> și <b>funcție</b>. Sintactic, funcția are o primă linie de forma:</p>
      ${mls(`function [lista-param-iesire]=nume-functie(lista-param-intrare)`)}
      <p>Se creează cu orice editor de texte, dar recomandăm editorul MATLAB: File &gt; New &gt; M-file, apoi File &gt; Save As cu numele fișierului (obligatoriu) și tipul .m. Scriptul se execută tastând numele lui; funcția se apelează cu o comandă asemănătoare cu prima linie, dar fără ${c('function')}. Numele fișierului trebuie să coincidă cu nume-functie.</p>
      <p>Exemplul 1 – scriptul <b>sindoix</b> care calculează sin 2x. În editor scrii ${c('y=2*sin(x).*cos(x);')}, salvezi ca sindoix, apoi:</p>
      ${mls(`>> x=pi/3;
>> sindoix
>> y
y =
    0.8660`)}
      <p>Exemplul 2 – funcția <b>cosdoix</b> care calculează cos 2x:</p>
      ${ml(`%% function y=cosdoix(x)
%% y=cos(x).*cos(x)-sin(x).*sin(x);
%% end
>> x=pi/3;
>> y=cosdoix(x)
>> (1+cosdoix(x))./cosdoix(x)`)}
      <p>(Blocul de mai sus definește funcția cosdoix în fundal când apeși Rulează; în consola lucrării o poți defini tu, în Editor.)</p>
      ${mls(`>> 1+sindoix
??? Attempt to execute SCRIPT sindoix as a function.`)}
      <p>Funcția a putut fi folosită într-o formulă (atenție când există mai mulți parametri de ieșire!), pe când scriptul nu. MATLAB consideră scriptul un șir de instrucțiuni, pe când la funcție importanți sunt parametrii de ieșire. Dacă există un singur parametru de ieșire, parantezele pătrate pot lipsi; parantezele rotunde de la intrare pot lipsi doar dacă nu există niciun parametru de intrare.</p>
      <table><tr><th></th><th>Script</th><th>Funcție</th></tr>
      <tr><td>ce este</td><td>o secvență de instrucțiuni, reutilizabilă</td><td>un subprogram, unitate distinctă de restul programului</td></tr>
      <tr><td>avantaje</td><td>utile în programe mari cu secvențe repetate aleatoriu (programatori avansați)</td><td>comunică prin listele de parametri; nu modifică datele din zona de lucru a apelantului; permite organizarea structurală</td></tr>
      <tr><td>dezavantaje</td><td>creează și modifică variabile din zona de lucru fără avertisment; sursă de erori greu detectabile (bugs); nu pot fi folosite în expresii</td><td>folosirea în exces fărâmițează programul și se pierde claritatea</td></tr></table>` },
    { h: 'Funcții de intrare/ieșire', html: `
      <p><b>input</b> introduce date de la tastatură: ${c("nr=input('text')")} așteaptă un număr; ${c("sir=input('text','s')")} interpretează ce se tastează ca șir. Dacă se apasă doar Return, variabila primește matricea vidă, detectabilă cu ${c('isempty')}:</p>
      ${mls(`y=input('Continuati y/n [y] :','s')
if isempty(y)
   y='y';
end`)}
      <div class="note">Pe cât posibil evită ${c('input')}: întrerupe execuția și duce la pierderi de timp.</div>
      <p><b>disp</b> afișează rapid, în detrimentul aspectului: ${c("disp('text')")} listează un text; ${c('disp(x)')} listează matricea x, cu același efect ca tastarea ${c('x')}.</p>
      <p><b>fprintf</b> permite formatarea ecranului, aproape ca în C++: ${c("fprintf('format',lista-parametri)")}. Formatul conține text și parametri de poziționare care încep cu ${c('%')}, câte unul pentru fiecare parametru din listă, în ordine de la stânga la dreapta. ${c('\\n')} înseamnă salt la linie nouă.</p>
      <table><tr><th>Format</th><th>Semnificație</th></tr>
      <tr><td>${c('%ls')}</td><td>șir cu lungimea cel mult l</td></tr>
      <tr><td>${c('%ld')}</td><td>număr întreg, l lungimea maximă</td></tr>
      <tr><td>${c('%l.vf')}</td><td>număr în virgulă flotantă, l lungimea maximă, v numărul de zecimale</td></tr>
      <tr><td>${c('%l.ve')}</td><td>ca f, dar cu notație științifică</td></tr>
      <tr><td>${c('%l.vg')}</td><td>cea mai compactă formă dintre e, f sau d</td></tr></table>
      <table><tr><th>Număr</th><th>%8.4f</th><th>%12.3e</th><th>%10g</th><th>%8d</th></tr>
      <tr><td>2</td><td>2.0000</td><td>2.000e+000</td><td>2</td><td>2</td></tr>
      <tr><td>sqrt(2)</td><td>1.4142</td><td>1.414e+000</td><td>1.41421</td><td>1.414214e+000</td></tr>
      <tr><td>sqrt(2e-11)</td><td>0.0000</td><td>4.472e-006</td><td>4.47214e-006</td><td>4.472136e-006</td></tr>
      <tr><td>sqrt(2e11)</td><td>447213.5955</td><td>4.472e+005</td><td>447214</td><td>4.472136e+005</td></tr></table>
      ${ml(`>> x=1:4;
>> y=sqrt(x);
>> fprintf('y= %9.4f\\n',y)
>> fprintf('%8.4f|%12.3e|%10g|%8d\\n', sqrt(2), sqrt(2), sqrt(2), 2)`)}
      <p>Când lista are mai multe valori decât formatul, formatul se reia: cele 4 valori ale lui y au fost scrise pe 4 linii.</p>
      <p><b>save / load</b>: ${c('save data1.dat A -ascii')} memorează matricea A în fișierul text data1.dat; ${c('load data1.dat')} încarcă matricea în memorie sub numele data1.</p>` },
    { h: 'Funcția radpat și comentariile de ajutor', html: `
      <p>Dacă x &gt; 0, șirul a<sub>n</sub> = ½(a<sub>n−1</sub> + x/a<sub>n−1</sub>) converge la √x. Funcția care calculează √x cu o precizie dorită:</p>
      ${mls(`function y=radpat(x,prec)
% Functia radpat calculeaza radacina patrata a lui x
% Se utilizeaza faptul ca sirul a(n)=0.5*(a(n-1)+x/a(n-1)) tinde catre
% radicalul lui x
% Apelul se face cu y=radpat(x,prec) sau radpat(x,prec)
% parametrii intrare
%       x numarul din care se extrage radicalul
%       prec precizia dorita
% parametrii iesire
%       y radacina patrata a lui x cu precizia prec
% variabile locale
%       maxit numarul maxim de iteratii
%       it iteratia curenta
%       yold valoarea lui y din iteratia anterioara
maxit=1000;
it=0;
y=0.1;
yold=1;
while abs(yold-y)>prec & it<maxit
   yold=y;
   y=0.5*(yold+x/yold);
   it=it+1;
end
if it==maxit
    disp('Atentie!! S-au depasit numarul maxim de iteratii');
end`)}
      ${ml(`%% function y=radpat(x,prec)
%% maxit=1000; it=0; y=0.1; yold=1;
%% while abs(yold-y)>prec & it<maxit
%%    yold=y; y=0.5*(yold+x/yold); it=it+1;
%% end
%% if it==maxit
%%     disp('Atentie!! S-au depasit numarul maxim de iteratii');
%% end
>> radpat(7,0.001)`)}
      <p>(Rezultatul este 2.6458. În consola lucrării, definește funcția în Editor și apoi apeleaz-o.)</p>
      <p>Liniile care încep cu ${c('%')} <b>autodocumentează</b> funcția: ce face, ce se folosește pentru obținerea ieșirilor, cum se fac apelurile, descrierea parametrilor de intrare, de ieșire, a variabilelor locale, alte informații. În comunitatea MATLAB aceste comentarii sunt o lege nescrisă. ${c('help radpat')} afișează exact aceste comentarii – așa obții informații despre orice funcție MATLAB. ${c('type radpat')} listează programul.</p>` },
    { h: 'Scriptul cu banda lui Möbius', html: `
      ${mls(`for a=0:112;
    for b=0:60;
        u=a/2;
        w=b/2;
        v=w/50-0.3;
        X(a+1,b+1)=cos(u)+v*cos(u/2)*cos(u);
        Y(a+1,b+1)=sin(u)+v*cos(u/2)*sin(u);
        Z(a+1,b+1)=v*sin(u/2);
    end
end
surf(X,Y,Z)
view(55, 50)
shading interp`)}
      <p>Salvat ca <b>bandam</b> și tastat în Command Window, desenează banda lui Möbius în fereastra grafică (în MATLAB; consola de aici nu desenează suprafețe).</p>` },
  ],
  cheat: [
    ['function [out]=nume(in)', 'prima linie a unei funcții; fișierul se numește nume.m'],
    ['script', 'șir de instrucțiuni; modifică zona de lucru; nu se folosește în expresii'],
    ['funcție', 'subprogram; comunică prin parametri; nu modifică zona de lucru a apelantului'],
    ["nr=input('text')", 'citește un număr'],
    ["sir=input('text','s')", 'citește un șir; Return singur dă matricea vidă (isempty)'],
    ['disp(x)', 'afișare rapidă'],
    ["fprintf('format',lista)", 'afișare formatată; formatul se reia dacă lista e mai lungă'],
    ['%d %f %e %g %s', 'întreg, virgulă flotantă, științific, cea mai compactă, șir'],
    ['%9.4f', 'lungime 9, 4 zecimale'],
    ['\\n', 'linie nouă'],
    ['save f.dat A -ascii / load f.dat', 'salvează / încarcă o matrice din fișier text'],
    ['% comentariu', 'liniile de la începutul funcției sunt afișate de help nume'],
    ['type nume', 'listează programul'],
    ['return', 'iese din funcție'],
    ['k=(j-1)*r+i', 'indicele liniar al elementului (i,j) într-o matrice cu r linii'],
  ],
  cards: [
    { q: 'Cele două tipuri de m-files și diferența sintactică', a: 'Script și funcție. Funcția are prima linie ' + c('function [iesiri]=nume(intrari)') + '.' },
    { q: 'Cum se execută un script și cum se apelează o funcție?', a: 'Scriptul: tastezi numele cu care a fost salvat. Funcția: o comandă ca prima linie, dar fără function, de ex. ' + c('y=cosdoix(x)') + '. Numele fișierului trebuie să coincidă cu nume-functie.' },
    { q: 'Ce se întâmplă la ' + c('1+sindoix') + ' dacă sindoix este script?', a: '??? Attempt to execute SCRIPT sindoix as a function. Scripturile nu pot fi folosite în expresii; funcțiile da.' },
    { q: 'Dezavantajele scripturilor', a: 'Creează și modifică variabile din zona de lucru fără avertisment; sunt sursă de erori greu detectabile (bugs); nu pot fi folosite în expresii.' },
    { q: 'Avantajele funcțiilor', a: 'Comunică cu programul apelant prin listele de parametri; nu modifică datele din zona de lucru a apelantului; permit organizarea structurală a programării. Dezavantaj: în exces, fărâmițează programul.' },
    { q: 'Când pot lipsi parantezele pătrate și cele rotunde din prima linie a funcției?', a: 'Pătratele: când există un singur parametru de ieșire. Rotundele: doar când nu există niciun parametru de intrare.' },
    { q: 'Cele două forme ale lui input și ce se întâmplă la Return singur', a: c("nr=input('text')") + ' citește un număr; ' + c("sir=input('text','s')") + ' citește un șir. La Return singur variabila primește matricea vidă, detectată cu ' + c('isempty') + '. Evită input: întrerupe execuția.' },
    { q: 'Diferența dintre disp și fprintf', a: c('disp') + ': afișare rapidă, fără formatare. ' + c('fprintf') + ': ecran formatat, cu parametri de poziționare %…, aproape ca în C++.' },
    { q: 'Ce înseamnă ' + c('%9.4f') + ', ' + c('%12.3e') + ', ' + c('%10g') + ', ' + c('%8d') + ', ' + c('%s') + '?', a: 'Real cu lungime 9 și 4 zecimale; notație științifică cu lungime 12 și 3 zecimale; cea mai compactă formă pe 10 poziții; întreg pe 8 poziții; șir.' },
    { q: 'Ce afișează ' + c("fprintf('y= %9.4f\\n',sqrt(1:4))") + '?', a: 'Patru linii: y=    1.0000, y=    1.4142, y=    1.7321, y=    2.0000 – formatul se reia pentru fiecare valoare.' },
    { q: 'Comenzile pentru salvarea și încărcarea unei matrici într-un fișier text', a: c('save data1.dat A -ascii') + ' și ' + c('load data1.dat') + ' (matricea primește numele data1).' },
    { q: 'Ce afișează ' + c('help radpat') + '?', a: 'Blocul de comentarii (liniile cu %) de la începutul funcției: ce face, cum se apelează, parametrii de intrare/ieșire, variabilele locale.' },
    { q: 'Ce șir folosește radpat și cu ce precizie oprește?', a: 'a<sub>n</sub> = ½(a<sub>n−1</sub> + x/a<sub>n−1</sub>) → √x; se oprește când |yold − y| ≤ prec sau după maxit = 1000 iterații. radpat(7,0.001) = 2.6458.' },
    { q: 'Care dintre șirurile a<sub>n</sub> = Σ1/k! și b<sub>n</sub> = (1+1/n)<sup>n</sup> converge mai repede la e?', a: 'Primul: pentru precizia 0.001, e1 are nevoie de 7 termeni, e2 de 1359. Oricum, nici exp(1) nu este valoarea exactă a lui e.' },
    { q: 'Formula indicelui liniar k al elementului (i,j) și inversa', a: 'k = (j−1)·r + i (r = numărul de linii; MATLAB memorează pe coloane). Invers: i = rem(k, r) (cu grijă la i = 0), j = (k − i)/r + 1.' },
  ],
  quiz: [
    { type: 'mc', q: 'Care este prima linie a unei funcții cu intrarea x și ieșirea y, numită cosdoix?', options: [c('function y=cosdoix(x)'), c('function cosdoix(x)=y'), c('def y=cosdoix(x)'), c('cosdoix: function(x) -> y')], answer: 0, explain: 'Forma generală: <code>function [iesiri]=nume(intrari)</code>; cu o singură ieșire, parantezele pătrate pot lipsi.' },
    { type: 'mc', q: 'Ce se întâmplă la ' + c('1+sindoix') + ' dacă sindoix este un script?', options: ['eroare: Attempt to execute SCRIPT sindoix as a function', 'se execută scriptul și se adună 1 la y', 'se afișează 1', 'scriptul devine funcție'], answer: 0, explain: 'Scripturile nu pot fi folosite în expresii.' },
    { type: 'mc', q: 'Care este un <b>dezavantaj</b> al scripturilor?', options: ['creează și modifică variabile din zona de lucru fără avertisment', 'nu pot conține bucle', 'trebuie salvate cu extensia .f', 'nu pot fi executate de mai multe ori'], answer: 0, explain: 'De aici erori greu detectabile (bugs). Funcțiile au propria zonă de lucru.' },
    { type: 'mc', q: 'Care este un <b>avantaj</b> al funcțiilor față de scripturi?', options: ['nu modifică datele din zona de lucru a programului apelant', 'se execută mai repede', 'nu au nevoie de nume de fișier', 'pot folosi input fără întrerupere'], answer: 0, explain: 'Comunică doar prin listele de parametri de intrare și ieșire.' },
    { type: 'tf', q: 'Numele fișierului .m al unei funcții trebuie să coincidă cu numele funcției din prima linie.', answer: true, explain: 'Lucrarea recomandă explicit acest lucru; MATLAB apelează funcția după numele fișierului.' },
    { type: 'mc', q: 'Când pot lipsi parantezele rotunde din prima linie a funcției?', options: ['doar dacă nu există niciun parametru de intrare', 'întotdeauna', 'dacă există un singur parametru de intrare', 'niciodată'], answer: 0, explain: 'Parantezele pătrate pot lipsi când există un singur parametru de ieșire.' },
    { type: 'mc', q: 'Ce dă ' + c("y=input('Continuati y/n [y] :','s')") + ' dacă se apasă doar Return?', options: ['matricea vidă, detectabilă cu isempty', "șirul 'y'", '0', 'o eroare'], answer: 0, explain: 'De aceea urmează <code>if isempty(y), y=\'y\'; end</code>.' },
    { type: 'mc', q: 'De ce se recomandă evitarea lui ' + c('input') + '?', options: ['întrerupe execuția și duce la pierderi de timp', 'nu funcționează în funcții', 'citește doar numere întregi', 'nu există în MATLAB 6.5'], answer: 0, explain: 'Datele se pot da mai bine ca parametri.' },
    { type: 'mc', q: 'Ce format afișează un real cu lungimea maximă 9 și 4 zecimale?', options: [c('%9.4f'), c('%4.9f'), c('%9d'), c('%.9e')], answer: 0, explain: 'l.vf: l lungimea maximă, v numărul de zecimale.' },
    { type: 'mc', q: 'Cum afișează ' + c('%12.3e') + ' numărul sqrt(2)?', options: [c('1.414e+000'), c('1.4142'), c('1.41421'), c('1')], answer: 0, explain: 'Notație științifică cu 3 zecimale.' },
    { type: 'mc', q: 'Ce format alege automat cea mai compactă formă dintre e, f și d?', options: [c('%g'), c('%f'), c('%e'), c('%s')], answer: 0, explain: '<code>%10g</code> pentru sqrt(2e11) dă 447214, pentru sqrt(2e-11) dă 4.47214e-006.' },
    { type: 'mc', q: 'Câte linii afișează ' + c("fprintf('y= %9.4f\\n',sqrt(1:4))") + '?', options: ['4 – formatul se reia pentru fiecare valoare din listă', '1 – toate valorile pe aceeași linie', '0 – eroare, lipsesc parametri', '2'], answer: 0, explain: 'Un singur parametru de poziționare, 4 valori ⇒ formatul se aplică de 4 ori.' },
    { type: 'fill', q: 'Ce secvență din format înseamnă salt la linie nouă?', answers: ['\\n', 'n'], explain: 'Ca în C: <code>\\n</code>.' },
    { type: 'mc', q: 'Ce face ' + c('save data1.dat A -ascii') + '?', options: ['salvează matricea A în fișierul text data1.dat', 'încarcă A din data1.dat', 'afișează A în format ASCII', 'șterge A'], answer: 0, explain: '<code>load data1.dat</code> o încarcă înapoi sub numele data1.' },
    { type: 'mc', q: 'Ce afișează ' + c('help radpat') + '?', options: ['comentariile (liniile cu %) de la începutul funcției', 'codul complet al funcției', 'rezultatul funcției pentru x = 1', 'lista tuturor funcțiilor'], answer: 0, explain: 'Așa se autodocumentează funcțiile; <code>type radpat</code> listează codul.' },
    { type: 'mc', q: 'Ce ar trebui să conțină comentariile de ajutor ale unei funcții?', options: ['ce face, cum se apelează, parametrii de intrare, de ieșire, variabilele locale', 'doar numele autorului', 'doar data creării', 'exemple de erori'], answer: 0, explain: 'În comunitatea MATLAB aceste comentarii sunt o lege nescrisă.' },
    { type: 'mc', q: 'Care șir converge mai repede la e (precizia 0.001)?', options: ['a<sub>n</sub> = Σ<sub>k=1..n</sub> 1/k! (7 termeni) față de (1+1/n)<sup>n</sup> (1359 termeni)', '(1+1/n)<sup>n</sup>, cu 7 termeni', 'ambele la fel', 'niciunul nu converge'], answer: 0, explain: 'Chiar și așa, nici exp(1) nu este valoarea exactă a lui e – un număr cu o infinitate de zecimale.' },
    { type: 'mc', q: 'Într-o matrice cu r linii, indicele liniar k al elementului (i, j) este:', options: ['k = (j−1)·r + i', 'k = (i−1)·r + j', 'k = i·j', 'k = i + j'], answer: 0, explain: 'MATLAB memorează coloană după coloană. Pentru a=[1 2 3;4 5 6;7 8 9], indvect(a,2,3) = 8.' },
    { type: 'mc', q: 'Ce face comanda ' + c('return') + ' într-o funcție?', options: ['iese imediat din funcție', 'afișează valoarea de ieșire', 'reia funcția de la început', 'salvează variabilele'], answer: 0, explain: 'Folosită în brrc când parametrii nu au sens: nu se calculează nimic și se iese.' },
    { type: 'mc', q: 'În tabelul de răcire, cât durează răcirea de la 30 °C la 14 °C?', options: ['33 de minute', '25 de minute', '19 minute', '49 de minute'], answer: 0, explain: 'La intersecția liniei 30 cu coloana 14 gC.' },
  ],
  exercises: [
    { title: 'Funcția tipvar', statement: `<p>Definește funcția tipvar care, pornind de la o variabilă x, răspunde cu tipul ei: 'scalar', 'vector' sau 'matrice'.</p>`, hint: '<p>Vezi ex. 2 din Lucrarea 10; scrie codul în Editorul consolei, cu prima linie ' + c('function y=tipvar(x)') + ', apoi Rulează și apelează ' + c('tipvar([1 2 3])') + '.</p>', solution: `${mls(`function y=tipvar(x)
% tipvar raspunde cu 'scalar', 'vector' sau 'matrice'
[l,c]=size(x);
if l==1&c==1
   y='scalar';
elseif l==1|c==1
   y='vector';
else
   y='matrice';
end`)}${ml(`>> tipvar(1)
>> tipvar([1 2 3])
>> tipvar([1 2;3 4])`)}`, starter: "function y=tipvar(x)\n[l,c]=size(x);\nif l==1&c==1\n   y='scalar';\nelseif l==1|c==1\n   y='vector';\nelse\n   y='matrice';\nend" },
    { title: 'Funcția lmet', statement: `<p>Definește funcția cu intrările x (lungime) și um (unitatea de măsură) și ieșirea lungimea în metri. Unități valide: 'ft' (0.3048 m), 'in' (0.0254 m), 'km', 'mm', 'yd' (0.91 m), 'mlt' (mila terestră, 1609.3 m), 'mlm' (mila marină, 1852 m). Pentru unități inexistente afișează un avertisment și returnează NaN.</p>`, solution: `${mls(`function y=lmet(x,um)
% lmet transforma lungimea x din unitatea um in metri
switch um
   case 'ft'
      y=x*0.3048;
   case 'in'
      y=x*0.0254;
   case 'km'
      y=x*1000;
   case 'mm'
      y=x/1000;
   case 'yd'
      y=x*0.91;
   case 'mlt'
      y=x*1609.3;
   case 'mlm'
      y=x*1852;
   otherwise
      disp('Atentie unitate inexistenta!!');
      y=NaN;
end`)}${ml(`>> lmet(1.82,'yd')
>> lmet(0.023,'mlm')
>> lmet(0.023,'kkk')`)}<p>1.6562; 42.5960; NaN (cu avertisment).</p>`, starter: "function y=lmet(x,um)\nswitch um\n   case 'ft'\n      y=x*0.3048;\n   case 'in'\n      y=x*0.0254;\n   case 'km'\n      y=x*1000;\n   case 'mm'\n      y=x/1000;\n   case 'yd'\n      y=x*0.91;\n   case 'mlt'\n      y=x*1609.3;\n   case 'mlm'\n      y=x*1852;\n   otherwise\n      disp('Atentie unitate inexistenta!!');\n      y=NaN;\nend" },
    { title: 'Numărul e cu două șiruri', statement: `<p>Șirurile a<sub>n</sub> = 1 + Σ<sub>k=1..n</sub> 1/k! și b<sub>n</sub> = (1 + 1/n)<sup>n</sup> au aceeași limită e = 2.71828… Definește funcțiile e1 și e2 care calculează e cu precizia prec (intrare), returnând și numărul de termeni evaluați it. Care șir converge mai repede?</p>`, hint: '<p>Structura este ca la radpat: bucla while cât timp |y − exp(1)| &gt; prec, numărând termenii în it.</p>', solution: `${mls(`function [y,it]=e1(prec)
% e1 calculeaza e cu sirul 1+sum(1/k!), pana cand |y-exp(1)|<=prec
maxit=10000; it=0; y=1; term=1;
while abs(y-exp(1))>prec & it<maxit
   it=it+1;
   term=term/it;
   y=y+term;
end

function [y,it]=e2(prec)
% e2 calculeaza e cu sirul (1+1/n)^n, pana cand |y-exp(1)|<=prec
maxit=100000; it=0; y=1;
while abs(y-exp(1))>prec & it<maxit
   it=it+1;
   y=(1+1/it)^it;
end`)}${ml(`>> [y1,i1]=e1(0.001)
>> [y2,i2]=e2(0.001)`)}<p>i1 = 6 (7 termeni evaluați, cu termenul inițial 1), i2 = 1359: primul șir este mult mai rapid convergent. Dar oricât am rula, nu obținem valoarea exactă a lui e (nici exp(1) nu este exactă) – e este un număr cu o infinitate de zecimale, caracterizat exact ca limită a acestor șiruri.</p>`, starter: "function [y,it]=e1(prec)\nmaxit=10000; it=0; y=1; term=1;\nwhile abs(y-exp(1))>prec & it<maxit\n   it=it+1;\n   term=term/it;\n   y=y+term;\nend\n\nfunction [y,it]=e2(prec)\nmaxit=100000; it=0; y=1;\nwhile abs(y-exp(1))>prec & it<maxit\n   it=it+1;\n   y=(1+1/it)^it;\nend" },
    { title: 'Funcția brrc și tabelul de răcire', statement: `<p>Funcția brrc are ca intrare temperatura ambiantă (a berii) și ca ieșire durata de răcire în minute. Condiții de sens: temperatura mediului în [20, 45]; temperatura finală mai mică decât cea inițială și mai mare decât a frigiderului; K pozitiv subunitar – altfel se iese cu ${c('return')}. Construiește apoi un script care afișează cu fprintf tabelul duratelor pentru temperaturi ale mediului de la 20 la 45 °C și temperaturi finale 13…18 °C.</p>`, solution: `${mls(`function t=brrc(tamb,tbf,k,tf)
% brrc durata (minute) de racire a berii de la tamb la tbf
% tf temperatura frigiderului, k coeficientul de conductie
t=NaN;
if tamb<20 | tamb>45, return, end
if tbf>=tamb | tbf<=tf, return, end
if k<=0 | k>=1, return, end
tb=tamb; t=1;
while tb>tbf
   tb=tb+k*(tf-tb);
   t=t+1;
end`)}${mls(`% scriptul tabel
fprintf('               Tabel racire bere [min]\\n\\n');
fprintf(' Temp. mediu    durata durata durata durata durata durata\\n');
fprintf('grd.Celsius[gC] la 13gC la 14gC la 15gC la 16gC la 17gC la 18gC\\n');
fprintf('===================================================\\n');
for tamb=20:45
   fprintf('%6d      ',tamb);
   for tbf=13:18
      fprintf('%7d',brrc(tamb,tbf,0.05,10));
   end
   fprintf('\\n');
end`)}${ml(`>> brrc(30,14,0.05,10)`)}<p>Pentru 30 °C și răcire la 14 °C durata este 33 de minute.</p>`, starter: "function t=brrc(tamb,tbf,k,tf)\nt=NaN;\nif tamb<20 | tamb>45, return, end\nif tbf>=tamb | tbf<=tf, return, end\nif k<=0 | k>=1, return, end\ntb=tamb; t=1;\nwhile tb>tbf\n   tb=tb+k*(tf-tb);\n   t=t+1;\nend" },
    { title: 'indvect și vectind', statement: `<p>MATLAB memorează matricile coloană după coloană, deci o matrice poate fi privită ca un vector de lungime r·c. Definește indvect(x,i,j) care dă indicele k al elementului (i,j) în x privit ca vector, și vectind(x,k) care dă (i,j) din k.</p>`, hint: '<p>k = (j−1)·r + i. Invers: i = rem(k, r) (dacă e 0, atunci i = r), j = (k−i)/r + 1.</p>', solution: `${mls(`function k=indvect(x,i,j)
% indvect indicele liniar al elementului (i,j)
[r,c]=size(x);
k=(j-1)*r+i;

function [i,j]=vectind(x,k)
% vectind indicii (i,j) ai elementului cu indice liniar k
[r,c]=size(x);
i=rem(k,r);
if i==0
   i=r;
end
j=(k-i)/r+1;`)}${ml(`>> a=[1 2 3;4 5 6;7 8 9];
>> indvect(a,2,3)
>> [i,j]=vectind(a,8)`)}<p>indvect(a,2,3) = 8; vectind(a,8) = (2, 3).</p>`, starter: "function k=indvect(x,i,j)\n[r,c]=size(x);\nk=(j-1)*r+i;\n\nfunction [i,j]=vectind(x,k)\n[r,c]=size(x);\ni=rem(k,r);\nif i==0\n   i=r;\nend\nj=(k-i)/r+1;" },
  ],
});
