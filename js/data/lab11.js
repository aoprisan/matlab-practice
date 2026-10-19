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
    { title: 'Funcția tipvar', statement: `<p>Definiți funcția tipvar care pornind de la o variabilă x ne răspunde cu tipul ei: ’scalar’,’vector’ sau ’matrice’.</p>`, hint: '<p>Vezi Ex.2 de la Lucrarea 10.</p><p>(Aici: scrie funcția în Editorul consolei, cu prima linie ' + c('function y=tipvar(x)') + ', apoi Rulează și apelează ' + c('tipvar([1 2 3])') + '.)</p>', solution: `${mls(`function y=tipvar(x)
% functia determina tipul variabilei x
%
% apel y=tipvar(x)
%
% parametrii intrare
%      x - variabila al carui tip se cere
%
% parametrii iesire
%      y - contine tipul determinat al variabilei x
%
% variabile locale
%      l - numarul de linii
%      c - numarul de coloane
[l,c]=size(x);
if l==1&c==1
   y='scalar';
elseif l==1|c==1
       y='vector';
else
       y='matrice';
end`)}${ml(`%% function y=tipvar(x)
%% [l,c]=size(x);
%% if l==1&c==1
%%    y='scalar';
%% elseif l==1|c==1
%%    y='vector';
%% else
%%    y='matrice';
%% end
%% end
>> x=1;
>> tipvar(x)
ans =
scalar
>> z=[1 2 3];
>> tipvar(z)
ans =
vector
>> w=[1 2;3 4];
>> tipvar(w)
ans =
matrice`)}`, starter: "function y=tipvar(x)\n[l,c]=size(x);\nif l==1&c==1\n   y='scalar';\nelseif l==1|c==1\n   y='vector';\nelse\n   y='matrice';\nend" },
    { title: 'Funcția lmet', statement: `<p>Definiți funcția care are ca date de intrare o lungime x și unitatea de măsură um a lui x, iar ca date de ieșire lungimea în metrii. Unitățile de măsură valide sunt<br>
 - ’ft’ pentru picior 1 ft=0.3048 m;<br>
 - ’in’ pentru inch 1 in= 0.0254 m;<br>
 - ’km’ pentru kilometru;<br>
 - ’mm’ pentru milimetru;<br>
 - ’yd’ pentru yard 1 yd= 0.91 m;<br>
 - ’mlt’ pentru mila terestră 1 mlt= 1609.3 ;<br>
 - ’mlm’ pentru mila marină 1 mlm= 1852 m.</p>`, hint: '<p>Vezi Ex.3 de la Lucrarea 10.</p>', solution: `${mls(`function lungimem=lmet(lungime,unitate)
% Functia calculeaza lungimea in metrii
%
% Apel l=lmat(x,u) sau lmat(x,u)
%
% Parametrii intrare
%   lungime - lungimea
%   unitate - unitatea de masura a lungimii
%
% Parametrii ieire
%   lungimem - lungimea in metrii
% Variabile locale
switch unitate
    case 'in'
          lungimem=lungime*0.0254;
    case 'ft'
          lungimem=lungime*0.3048;
    case 'm'
          lungimem=lungime;
    case 'km'
          lungimem=1000*lungime;
    case 'mm'
          lungimem=lungime/1000;
    case 'yd'
          lungimem=0.91*lungime;
    case 'mlt'
          lungimem=1609.3*lungime;
    case 'mlm'
          lungimem=1852*lungime;
    otherwise
% In cazul cand unitatea de masura nu este una valida
% se face o atentionare si se introduce NaN ca raspuns
          lungimem=NaN;
          disp ' Atentie unitate inexistenta!!';
end`)}${ml(`%% function lungimem=lmet(lungime,unitate)
%% switch unitate
%%     case 'in'
%%           lungimem=lungime*0.0254;
%%     case 'ft'
%%           lungimem=lungime*0.3048;
%%     case 'm'
%%           lungimem=lungime;
%%     case 'km'
%%           lungimem=1000*lungime;
%%     case 'mm'
%%           lungimem=lungime/1000;
%%     case 'yd'
%%           lungimem=0.91*lungime;
%%     case 'mlt'
%%           lungimem=1609.3*lungime;
%%     case 'mlm'
%%           lungimem=1852*lungime;
%%     otherwise
%%           lungimem=NaN;
%%           disp(' Atentie unitate inexistenta!!');
%% end
%% end
>> x=1.82;
>> u='yd';
>> lmet(x,u)
ans =
   1.6562
>> x=0.023;
>> u='mlm';
>> lmet(x,u)
ans =
  42.5960
>> u='kkk';
>> lmet(x,u)
 Atentie unitate inexistenta!!
ans =
  NaN`)}`, starter: "function lungimem=lmet(lungime,unitate)\nswitch unitate\n    case 'in'\n          lungimem=lungime*0.0254;\n    case 'ft'\n          lungimem=lungime*0.3048;\n    case 'm'\n          lungimem=lungime;\n    case 'km'\n          lungimem=1000*lungime;\n    case 'mm'\n          lungimem=lungime/1000;\n    case 'yd'\n          lungimem=0.91*lungime;\n    case 'mlt'\n          lungimem=1609.3*lungime;\n    case 'mlm'\n          lungimem=1852*lungime;\n    otherwise\n          lungimem=NaN;\n          disp(' Atentie unitate inexistenta!!');\nend" },
    { title: 'Numărul e cu două șiruri', statement: `<p>Se știe că șirurile: a<sub>n</sub> = 1 + <span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1"><small>n</small><span style="font-size:1.5em">Σ</span><small>k=1</small></span>${frac('1', 'k !')} și b<sub>n</sub> = <span style="font-size:1.6em;vertical-align:middle">(</span>1 + ${frac('1', 'n')}<span style="font-size:1.6em;vertical-align:middle">)</span><sup>n</sup> au aceeași limită e (numărul lui Euler), adică în MATLAB exp(1)=2.71828182845905. Definiți funcțiile e1, (respectiv e2), care utilizând șirul a<sub>n</sub>, (respectiv b<sub>n</sub>), să calculeze pe e (dată ieșire) cu precizia prec(dată intrare), indicând și câți termeni din șir au fost evaluați în it (dată ieșire) .  Comparând cei doi it obținuți deduceți care din cele două șiruri converge mai rapid la e.</p>`, hint: '<p>Structura funcțiilor e1 și e2 de calcul a lui e este asemănătoare cu cea a funcției radpat din exemplul de mai sus.</p>', solution: `<p>Funcția e1:</p>${mls(`function [y,itf]=e1(prec)
% Functia e1 calculeaza valoarea lui e cu precizia prec
% Se utilizeaza faptul ca sirul a(n)=a(n-1)+1/n! tinde catre
%    numarul lui Euler e
% Pentru calculul factorialului se utilizeaza n!=gamma(n+1)
% Apelul se face cu [y,itf]=e1(prec)
% parametrii intrare
%        prec  precizia dorita
% parametrii iesire
%        y     valoarea calculata a lui e cu precizia prec
%        itf   numarul de iteratii necesar calculului
% variabile locale
%        maxit numarul maxim de iteratii
%        it    iteratia curenta
%        yold  valoarea lui y din iteratia anterioara
maxit=1000;
it=0;
y=0;
yold=2;
while abs(yold-y)>prec & it<maxit
    yold=y;
    y=yold+1/gamma(it+1);
    it=it+1;
end
if it==maxit
    disp('Atentie!! S-au depasit numarul maxim de iteratii');
end
itf=it-1;`)}<p>Funcția e2:</p>${mls(`function [y,itf]=e2(prec)
% Functia e1 calculeaza valoarea lui e cu precizia prec
% Se utilizeaza faptul ca sirul a(n)=(1+1/n)^n tinde catre
%    numarul lui Euler e
% Pentru calculul factorialului se utilizeaza n!=gamma(n+1)
% Apelul se face cu [y,itf]=e1(prec)
% parametrii intrare
%        prec  precizia dorita
% parametrii iesire
%        y     valoarea calculata a lui e cu precizia prec
%        itf   numarul de iteratii necesar calculului
% variabile locale
%        maxit numarul maxim de iteratii
%        it    iteratia curenta
%        yold  valoarea lui e data de exp(1)
maxit=10000;
it=0.;
y=0;
yold=exp(1);
while abs(y-yold)>prec & it<maxit
    y=(1+1/it)^it;
    it=it+1;
end
if it==maxit
    disp('Atentie!! S-au depasit numarul maxim de iteratii');
end
itf=it-1;`)}${ml(`%% function [y,itf]=e1(prec)
%% maxit=1000; it=0; y=0; yold=2;
%% while abs(yold-y)>prec & it<maxit
%%     yold=y;
%%     y=yold+1/gamma(it+1);
%%     it=it+1;
%% end
%% if it==maxit
%%     disp('Atentie!! S-au depasit numarul maxim de iteratii');
%% end
%% itf=it-1;
%% end
%% function [y,itf]=e2(prec)
%% maxit=10000; it=0.; y=0; yold=exp(1);
%% while abs(y-yold)>prec & it<maxit
%%     y=(1+1/it)^it;
%%     it=it+1;
%% end
%% if it==maxit
%%     disp('Atentie!! S-au depasit numarul maxim de iteratii');
%% end
%% itf=it-1;
%% end
>> [y1,i1]=e1(0.001);
>> [y2,i2]=e2(0.001);
>> i1
i1 =
   7
>> i2
i2 =
     1359`)}<p>Se observă faptul că primul șir este mult mai rapid convergent. Dar chiar dacă rulăm programele la infinit nu vom obține niciodată valoarea exactă a lui e !!! (nici exp(1) nu este valoarea exactă a lui e!!). Numărul  e este o abstracție tipic umană. Este un număr cu o infinitate de zecimale care este caracterizat exact de faptul că este limita șirurilor de mai sus.</p>`, starter: "function [y,itf]=e1(prec)\nmaxit=1000;\nit=0;\ny=0;\nyold=2;\nwhile abs(yold-y)>prec & it<maxit\n    yold=y;\n    y=yold+1/gamma(it+1);\n    it=it+1;\nend\nif it==maxit\n    disp('Atentie!! S-au depasit numarul maxim de iteratii');\nend\nitf=it-1;\n\nfunction [y,itf]=e2(prec)\nmaxit=10000;\nit=0.;\ny=0;\nyold=exp(1);\nwhile abs(y-yold)>prec & it<maxit\n    y=(1+1/it)^it;\n    it=it+1;\nend\nif it==maxit\n    disp('Atentie!! S-au depasit numarul maxim de iteratii');\nend\nitf=it-1;" },
    { title: 'Funcția brrc și tabelul de răcire', statement: `<p>Revenire la problema berii reci. În ex.7 Lucrarea 10 s-a presupus că temperatura mediului ambient este de 30<sup>o</sup>C. În realitate uneori au fost și 39<sup>o</sup>C. De aceea trebuie să rezolvăm complet problema aceasta importantă. Va trebui să construim un tabel cu valorile de timp de răcire pentru temperaturi cuprinse între 20<sup>o</sup>C și 45<sup>o</sup>C. Timpi vor fi calculați cu o funcție brrc (a se citi be-re-re-ce) ce are ca parametru de intrare temperatura ambientală, iar ca parametru de ieșire durata de răcire în minute.</p>`, hint: `<p>Vezi Ex. 4 lucrarea 10. În plus trebuie impuse niște condiții ca problema să aibă sens:<br>
 - Temperatura mediului (adică cea inițială a berii) trebuie să fie cea de vară să zicem în intervalul [20, 45];<br>
 - Temperatura finală a berii trebuie să fie evident mai mică decât cea inițială Si evident mai mare decât temperatura frigiderului;<br>
 - Coeficientul de conducție trebuie să fie un număr pozitiv subunitar.</p>
<p style="text-indent:2em">Dacă nu sunt verificate condițiile de mai sus nu se calculează nimic și se iese din funcție cu comanda return (asta chiar face această comandă.</p>
<p style="text-indent:2em">Vom construi un tabel în care fiecare linie va corespunde unei temperaturi inițiale ,prima coloană va conține aceste temperaturi. Restul coloanelor vor conține durata de răcire pentru o temperatură din intervalul 12<sup>o</sup>C, … , 16<sup>o</sup>C, intervalul optim de răcire. Tabelul îl vom construi într-un script ca să-l putem testa. La tipărire vom utiliza funcția fprintf.</p>`, solution: `<p>Funcția brrc:</p>${mls(`function t=brrc(tin,tbf)
% functia calculeaza durata de racire a beriipormind de la formula
%      T(i+1)=T(i)+K(t(i+1)-t(i))(Tf-T(i))
%   Apelarea se face y=brrc(t) sau brrc(t) cu 20<t<45
%
%   parametrii intrare
%    tin - temperatura mediului ambiant (initiala a berii) in grade C
%          verifica 20<tin<45
%    tbf - temperatura dorita a berii tin>tbf>10
%
%   parametrii iesire
%     t - durata de timp in minute
%
%   variabile locale
%     k - conductia are sens in intervalul[0, 1]
%     tb - valoarea la momentul t a sirului
%     tbn - valoarea la momentul t+1 a sirului
%
 if tin<20|tin>45
    disp('Temperatura mediu este in afara intervalului [20, 45] !!')
    return
 end
 tf=10;
 if tbf>tin|tbf<tf
     disp('temperatura fibala a berii nu este in intervalul [tf, tin]')
     return
 end
 k=0.05;
 if k<0|k>1
     Disp('Conductia nu este un numar pozitiv subunitar')
     return
 end
 tb=tin;
 t=1;
 while tb > tbf
       tbn=tb+k*(tf-tb);
       tb=tbn;
       t=t+1;
 end`)}<p>Scriptul tabel este:</p>${mls(`fprintf('                             Tabel racire bere [min] \\n')
fprintf('\\n Temp. mediu      durata    durata    durata    durata    durata    durata \\n')
fprintf('grd.Celsius[gC]   la 13gC   la 14gC   la 15gC   la 16gC   la 17gC   la 18gC\\n')
fprintf('==========================================================================')
for tm=20:45
    fprintf('\\n      %4d     ',tm)
    for tr=13:18
        fprintf('    %4d  ',brrc(tm,tr))
    end
end
fprintf('\\n')`)}<p style="text-indent:2em">Dacă tastăm în MATLAB</p>${mls(`>> tabel`)}<p>obținem:</p>${ml(`%% function t=brrc(tin,tbf)
%% if tin<20|tin>45
%%    disp('Temperatura mediu este in afara intervalului [20, 45] !!')
%%    return
%% end
%% tf=10;
%% if tbf>tin|tbf<tf
%%    disp('temperatura fibala a berii nu este in intervalul [tf, tin]')
%%    return
%% end
%% k=0.05;
%% if k<0|k>1
%%    disp('Conductia nu este un numar pozitiv subunitar')
%%    return
%% end
%% tb=tin;
%% t=1;
%% while tb > tbf
%%    tbn=tb+k*(tf-tb);
%%    tb=tbn;
%%    t=t+1;
%% end
%% end
%% fprintf('                             Tabel racire bere [min] \\n')
%% fprintf('\\n Temp. mediu      durata    durata    durata    durata    durata    durata \\n')
%% fprintf('grd.Celsius[gC]   la 13gC   la 14gC   la 15gC   la 16gC   la 17gC   la 18gC\\n')
%% fprintf('==========================================================================')
%% for tm=20:45
%%     fprintf('\\n      %4d     ',tm)
%%     for tr=13:18
%%         fprintf('    %4d  ',brrc(tm,tr))
%%     end
%% end
%% fprintf('\\n')
                 Tabel racire bere [min]

 Temp. mediu    durata  durata  durata  durata  durata  durata
grd.Celsius[gC] la 13gC la 14gC la 15gC la 16gC la 17gC la 18gC
================================================================
     20            25      19      15      11       8       6
     21            27      21      17      13      10       8
     22            29      23      19      15      12       9
     23            30      24      20      17      14      11
     24            32      26      22      18      15      12
     25            33      27      23      19      16      14
     26            34      29      24      21      18      15
     27            35      30      25      22      19      16
     28            36      31      26      23      20      17
     29            37      32      28      24      21      18
     30            38      33      29      25      22      19
     31            39      34      29      26      23      20
     32            40      35      30      27      24      21
     33            41      36      31      28      25      22
     34            42      36      32      29      26      23
     35            43      37      33      29      26      24
     36            44      38      34      30      27      24
     37            44      39      34      31      28      25
     38            45      39      35      32      29      26
     39            46      40      36      32      29      27
     40            46      41      36      33      30      27
     41            47      41      37      34      31      28
     42            48      42      38      34      31      29
     43            48      43      38      35      32      29
     44            49      43      39      35      32      30
     45            49      44      39      36      33      30`)}<p>De exemplu durata de răcire a berii în cazul temperaturii mediului de 30<sup>o</sup>C și cea de răcire de 14<sup>o</sup>C este de 33 minute.(la intersecția liniei 30 cu coloana 14).</p>`, starter: "function t=brrc(tin,tbf)\nif tin<20|tin>45\n   disp('Temperatura mediu este in afara intervalului [20, 45] !!')\n   return\nend\ntf=10;\nif tbf>tin|tbf<tf\n   disp('temperatura finala a berii nu este in intervalul [tf, tin]')\n   return\nend\nk=0.05;\nif k<0|k>1\n   disp('Conductia nu este un numar pozitiv subunitar')\n   return\nend\ntb=tin;\nt=1;\nwhile tb > tbf\n   tbn=tb+k*(tf-tb);\n   tb=tbn;\n   t=t+1;\nend" },
    { title: 'indvect și vectind', statement: `<p>Se știe că MATLAB memorează matricile coloană după coloană. De aceea o matrice poate fi privită (și deseori MATLAB o face!) ca un vector de lungime r*c (r – număr linii, c- număr coloane). Să se definească o funcție indvect pentru care dându-se  o matrice x și indicii (i,j) ai unui element să se obțină indicele k al aceluiași element în x privit ca vector. De asemenea fiind dată o matrice x și indicele k al unui element din x fiind privit ca un vector să se scrie o funcție vectind ce determină indicii (i,j) ai aceluiași element din x privit ca o matrice.</p>`, hint: `<p>Formula de calcul a lui k este dată de (r numărul de linii al matricii) :</p><p style="text-align:center">k = ( j − 1) r + i</p><p>Dacă cunoaștem indicele k atunci di formula de mai sus deducem că i este restul împărțirii lui k la r iar j va fi dat de formula:</p><p style="text-align:center">j = ${frac('k − i', 'r')} + 1</p><p>Reamintim că restul împărțirii unui număr n la m este rem(n,m).</p>`, solution: `<p>Funcția indvect:</p>${mls(`function k=indvect(x,i,j)
% functia calculeaza indicele unui element daca matricea x este
%         privita ca un vector
%
% Apelarea se face k=indvect(x,i,j) sau indvect(x,i,j)
%
% Parametrii de intrare
%      x - matricea de studiat
%      i - linia elementului
%      j - coloana elementului
%
% Parametrii de iesire
%      k - indicele din vector al elementului
%
% Variabile locale
[r,c]=size(x);
k=(j-1)*r+i;
return`)}${mls(`function [i,j]=vectind(x,k)
% functia calculeaza indicii (i,j)unui element din matricea x daca matricea x este
%         privita ca un vector
%
% Apelarea se face [i,j]=indvect(x,k)
%
% Parametrii de intrare
%      x - matricea de studiat
%      k - indicele din vector al elementului
%
% Parametrii de iesire
%
%      i - linia elementului
%      j - coloana elementului
% Variabile locale
[r,c]=size(x);
i=rem(k,r);
j=(k-i)/r+1;
return`)}${ml(`%% function k=indvect(x,i,j)
%% [r,c]=size(x);
%% k=(j-1)*r+i;
%% return
%% end
%% function [i,j]=vectind(x,k)
%% [r,c]=size(x);
%% i=rem(k,r);
%% j=(k-i)/r+1;
%% return
%% end
>> a=[1 2 3;4 5 6;7 8 9]
a =
    1     2     3
    4     5     6
    7     8     9
>> indvect(a,2,3)
ans =
    8
>> [i,j]=vectind(a,8)
i =
    2
j =
    3`)}<p>(Observație: dacă k este multiplu de r, ${c('rem(k,r)')} dă 0; în acest caz trebuie pus i=r, de exemplu cu ${c('if i==0, i=r; end')} înainte de calculul lui j.)</p>`, starter: "function k=indvect(x,i,j)\n[r,c]=size(x);\nk=(j-1)*r+i;\nreturn\n\nfunction [i,j]=vectind(x,k)\n[r,c]=size(x);\ni=rem(k,r);\nj=(k-i)/r+1;\nreturn" },
  ],
});
