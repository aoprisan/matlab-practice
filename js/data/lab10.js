LABS.push({
  id: 10,
  title: 'Comenzi de control a execuției',
  blurb: 'Ramificări cu <code>if / elseif / else</code> și <code>switch / case / otherwise</code>, bucle cu <code>for</code> și <code>while</code>, ieșirea forțată cu <code>break</code>, calculul lui <code>eps</code> și problema răcirii berii.',
  sections: [
    { h: 'Comanda if', html: `
      <p>De obicei cerem execuția secvențială a comenzilor, dar uneori, în funcție de o condiție, executăm fie o secvență, fie alta; alteori dorim execuția repetată a unei secvențe. Comenzile speciale de dirijare a fluxului sunt scopul lucrării. Prima formă a lui ${c('if')}:</p>
      ${mls(`if condiție
   secvența de instrucțiuni
end`)}
      <p>Dacă <i>condiție</i> (o expresie logică) este adevărată se execută secvența și apoi se trece la comenzile de după ${c('end')}; altfel se sare direct după ${c('end')}.</p>
      ${ml(`>> x=5; ind=2;
>> if ind<25
..     ind=ind+1;
.. end
>> ind`)}
      <div class="note">Toate comenzile din secvențele din cadrul comenzilor de control trebuie să se termine cu ${c(';')}.</div>
      <p>Cu clauza ${c('else')} se execută o secvență pe condiție adevărată și alta pe condiție falsă. Pentru condiții complexe există ${c('elseif')}, care evită îmbricarea:</p>
      ${ml(`>> interval=0.9;
>> if interval<1
..     xinc=interval/10;
.. else
..     xinc=0.1;
.. end
>> xinc
>> n=7; ind=1;
>> if n>10
..     ind=10;
.. elseif n>5
..     ind=5;
.. else
..     ind=0;
.. end
>> ind`)}` },
    { h: 'Comanda switch-case', html: `
      <p>Pentru ramificări multiple, ca să nu scriem secvențe if îmbricate complexe, se folosește ${c('switch')}: se evaluează o expresie și se execută secvența cazului cu valoarea potrivită; ${c('otherwise')} acoperă restul.</p>
      ${mls(`switch expresie
case valoare1
     secvența 1 de comenzi
case valoare2
     secvența 2 de comenzi
otherwise
     secvența n de comenzi
end`)}
      ${ml(`>> interval=0.9;
>> switch interval<1
..   case 1
..       xinc=interval/10;
..   case 0
..       xinc=0.1;
.. end
>> xinc`)}
      <p>Valorile din ${c('case')} pot fi și șiruri: ${c("case 'ft'")}.</p>` },
    { h: 'Bucla for', html: `
      <p>Pentru bucle cu număr de cicluri cunoscut:</p>
      ${mls(`for variabila=expresie
    secvența de comenzi
end`)}
      <ul>
        <li>Dacă expresia este o matrice vidă, se sare direct după ${c('end')} fără a executa secvența.</li>
        <li>Dacă expresia este o matrice cu n coloane, secvența se execută de n ori; la execuția k variabila ia ca valoare coloana k.</li>
        <li>Dacă expresia este un vector cu n elemente, secvența se execută de n ori, variabila luând elementul k.</li>
        <li>Dacă expresia este un scalar, secvența se execută o singură dată.</li>
        <li>Nu se poate termina o buclă for prin modificarea variabilei.</li>
        <li>În expresie se poate folosi operatorul ${c(':')}.</li>
        <li>La sfârșit variabila are ca valoare ultima coloană, respectiv ultimul element.</li>
      </ul>
      ${ml(`>> n=6; fact=1;
>> for ind=1:n
..     fact=fact*ind;
.. end
>> fact`)}
      <p>Exemplul este pur didactic: când există funcții predefinite, folosește-le. Nu există o funcție factorial, dar ${c('gamma(n+1)')} = n! și ${c('prod(1:n)')} calculează n!:</p>
      ${ml(`>> gamma(7)
>> prod(1:6)`)}
      <p>Buclele for se pot îmbrica. Înlocuirea elementelor unei matrici cu restul împărțirii la 3:</p>
      ${ml(`>> A=[1 5 9;-3 7 0;6 9 4];
>> [l,c]=size(A);
>> for i=1:l
..     for j=1:c
..        A(i,j)=rem(A(i,j),3);
..     end
.. end
>> A`)}
      <div class="note">Același rezultat se obține, <b>mult mai rapid</b>, cu ${c('A=rem(A(:,:),3)')} (vezi optimizările din Lucrarea 12).</div>` },
    { h: 'Bucla while și break', html: `
      <p>Când ciclurile se execută atât timp cât e îndeplinită o condiție:</p>
      ${mls(`while condiție
      secvența de comenzi
end`)}
      <p>La ${c('while')} există riscul ciclării la infinit. Ca să-l eviți, introdu un număr maxim de iterații:</p>
      ${mls(`it=1;
itmax=1000;
while condiție & (it<itmax)
      secvența de comenzi
      it=it+1;
end`)}
      <p>Exemplul clasic: calculul lui ${c('eps')}, acuratețea relativă a reprezentării în virgulă flotantă în dublă precizie – distanța dintre 1 și următorul număr real reprezentabil mai mare ca 1:</p>
      ${ml(`>> it=0; itmax=100; xeps=1;
>> while (((1+xeps)>1)&(it<itmax))
..     xeps=xeps/2;
..     it=it+1;
.. end
>> it-1
>> xeps=xeps*2`)}
      <p>Numărul de împărțiri la 2 este cu 1 mai mic decât it, deci eps = 2<sup>−52</sup> ≈ 2.2204·10<sup>−16</sup>.</p>
      <p>Ieșirea forțată dintr-o buclă: ${c('break')} dă controlul primei comenzi de după ${c('end')}-ul buclei:</p>
      ${ml(`>> x=[1 0 7 NaN 8];
>> for ind=1:length(x)
..     if isnan(x(ind))
..        break
..     end
..     x(ind)=rem(x(ind),5);
.. end
>> x`)}
      <p>Prelucrarea s-a oprit la NaN; altfel în loc de 8 ar fi fost 3. (Manualul scrie ${c('x(ind)==NaN')}, dar NaN nu este egal cu nimic, nici cu el însuși – testul corect este ${c('isnan')}.)</p>` },
  ],
  cheat: [
    ['if cond ... end', 'execută secvența dacă cond e adevărată'],
    ['if ... else ... end', 'două ramuri'],
    ['if ... elseif ... else ... end', 'ramuri multiple fără îmbricare'],
    ['switch expr / case v / otherwise / end', 'ramificare după valoare (numere sau șiruri)'],
    ['for v=expr ... end', 'v ia pe rând elementele/coloanele lui expr'],
    ['for ind=1:n', 'bucla clasică cu :'],
    ['while cond ... end', 'cât timp cond e adevărată'],
    ['it<itmax', 'protecție contra buclelor infinite'],
    ['break', 'iese forțat din buclă'],
    ['gamma(n+1), prod(1:n)', 'n! fără buclă'],
    ['eps = 2^-52', 'distanța dintre 1 și următorul real reprezentabil'],
    ['[l,c]=size(x)', 'scalar dacă l=c=1, vector dacă l=1 sau c=1, altfel matrice'],
    ['linspace(a,b,n)', 'n puncte egal distanțate în [a,b]'],
    ['randn(size(t))', 'zgomot aleator normal'],
  ],
  cards: [
    { q: 'Cele trei forme ale comenzii if', a: c('if cond … end') + '; ' + c('if cond … else … end') + '; ' + c('if c1 … elseif c2 … else … end') + ' (elseif evită îmbricarea).' },
    { q: 'Cu ce trebuie să se termine comenzile din secvențele comenzilor de control?', a: 'Cu ' + c(';') + '.' },
    { q: 'Când se folosește switch-case și care este structura?', a: 'La ramificări multiple, ca să nu scriem if-uri îmbricate. ' + c('switch expr') + ' / ' + c('case v1') + ' … / ' + c('otherwise') + ' … / ' + c('end') + '. Valorile pot fi și șiruri.' },
    { q: 'Ce se întâmplă în ' + c('for v=expr') + ' dacă expr este o matrice cu n coloane? Dar un scalar? Dar matricea vidă?', a: 'Matrice: secvența se execută de n ori, v ia coloana k la pasul k. Scalar: o singură execuție. Vidă: se sare direct după end.' },
    { q: 'Se poate termina o buclă for modificând variabila de ciclu?', a: 'Nu. Pentru ieșire forțată se folosește ' + c('break') + '.' },
    { q: 'Cum calculezi n! fără buclă?', a: c('gamma(n+1)') + ' (gamma(7) = 720) sau ' + c('prod(1:n)') + '. Regula: când există funcții predefinite, folosește-le.' },
    { q: 'Cum eviți ciclarea la infinit la while?', a: 'Introdu un contor și un număr maxim de iterații: ' + c('while cond & (it<itmax) … it=it+1; end') + '.' },
    { q: 'Ce este eps și cum se calculează cu while?', a: 'Distanța dintre 1 și următorul real reprezentabil mai mare ca 1 (acuratețea relativă în dublă precizie). Se înjumătățește xeps cât timp 1+xeps &gt; 1: 52 înjumătățiri, eps = 2<sup>−52</sup> ≈ 2.2204e-16.' },
    { q: 'Ce face break?', a: 'Iese forțat din buclă: dă controlul primei comenzi de după end-ul buclei.' },
    { q: 'Cum determini dacă x este scalar, vector sau matrice?', a: c('[l,c]=size(x)') + ': l=c=1 scalar; l=1 sau c=1 vector; altfel matrice. Orice variabilă MATLAB este o matrice.' },
    { q: 'Cum eviți bucla dublă for care aplică rem(·,3) fiecărui element al lui A?', a: c('A=rem(A(:,:),3)') + ' – vectorizat, mult mai rapid.' },
    { q: 'Formula de răcire a berii și rezultatul', a: 'T<sub>i+1</sub> = T<sub>i</sub> + K·(t<sub>i+1</sub> − t<sub>i</sub>)·(T<sub>f</sub> − T<sub>i</sub>), cu K = 0.05, pas 1 minut, T<sub>f</sub> = 10 °C. De la 30 °C la 14 °C: 33 de minute.' },
    { q: 'Ce face ' + c('linspace(a,b,n)') + '?', a: 'Împarte intervalul [a, b] în n puncte egal distanțate. În prelucrarea semnalelor e util ca n să fie putere a lui 2 (ex. 512).' },
  ],
  quiz: [
    { type: 'mc', q: 'Secvența: ' + c('if x<10, y=2*x; elseif x<100, y=100-x; elseif x<1000, y=1000-x/2; else y=sqrt(x); end') + '. Cât este y pentru x = 50?', options: ['50', '100', '975', '7.07'], answer: 0, explain: '50 nu este < 10, dar este < 100 ⇒ y = 100 − 50 = 50.' },
    { type: 'mc', q: 'Aceeași secvență, x = 500. Cât este y?', options: ['750', '500', '22.36', '1000'], answer: 0, explain: '500 < 1000 ⇒ y = 1000 − 500/2 = 750.' },
    { type: 'mc', q: 'Aceeași secvență, x = 5000. Cât este y?', options: ['70.7107', '4500', '−1500', '5000'], answer: 0, explain: 'Nicio condiție nu e adevărată ⇒ ramura else: √5000 = 70.7107.' },
    { type: 'mc', q: 'La ce servește ' + c('elseif') + '?', options: ['la testarea mai multor condiții pe rând fără if-uri îmbricate', 'la repetarea unei secvențe', 'la ieșirea dintr-o buclă', 'la definirea unui caz în switch'], answer: 0, explain: 'Se evaluează condițiile în ordine; se execută prima ramură adevărată.' },
    { type: 'mc', q: 'În ' + c('switch unitate') + ' care clauză tratează valorile neprevăzute?', options: [c('otherwise'), c('else'), c('default'), c('case end')], answer: 0, explain: 'Pentru unități inexistente, soluția pune NaN în rezultat.' },
    { type: 'mc', q: 'În ' + c('for v=M') + ' cu M o matrice 3×4, de câte ori se execută secvența și ce ia v?', options: ['de 4 ori; v ia pe rând coloanele lui M', 'de 3 ori; v ia liniile', 'de 12 ori; v ia elementele', 'o dată; v = M'], answer: 0, explain: 'Variabila parcurge coloanele; la sfârșit v este ultima coloană.' },
    { type: 'tf', q: 'O buclă for se poate opri mai devreme modificând variabila de ciclu în interiorul ei.', answer: false, explain: 'Nu; se folosește <code>break</code>.' },
    { type: 'mc', q: 'Ce dă ' + c('gamma(7)') + '?', options: ['720 (= 6!)', '5040 (= 7!)', '7', '49'], answer: 0, explain: 'gamma(n+1) = n!.' },
    { type: 'fill', q: 'Scrie o comandă care calculează 6! fără buclă și fără gamma.', answers: ['prod(1:6)', 'factorial(6)'], explain: '<code>prod(1:n)</code> înmulțește elementele vectorului 1..n.' },
    { type: 'mc', q: 'Câte înjumătățiri sunt necesare până când 1+xeps nu mai este > 1, pornind de la xeps = 1?', options: ['52, deci eps = 2<sup>−52</sup>', '16', '64', '100'], answer: 0, explain: 'Dublă precizie: 52 de biți de mantisă; eps ≈ 2.2204·10<sup>−16</sup>.' },
    { type: 'mc', q: 'De ce se adaugă ' + c('& (it<itmax)') + ' în condiția unui while?', options: ['ca protecție contra ciclării la infinit', 'ca să facă bucla mai rapidă', 'este obligatoriu sintactic', 'ca să numere iterațiile pentru afișare'], answer: 0, explain: 'Dacă condiția nu devine niciodată falsă, itmax oprește bucla.' },
    { type: 'mc', q: 'În exemplul cu ' + c('x=[1 0 7 NaN 8]') + ' și break la NaN, ce conține x la final?', options: [c('1 0 2 NaN 8'), c('1 0 2 NaN 3'), c('1 0 7 NaN 8'), c('1 0 2 0 3')], answer: 0, explain: 'Prelucrarea (rem(·,5)) se oprește la NaN; 8 rămâne neschimbat.' },
    { type: 'mc', q: 'Cum testezi corect dacă x(ind) este NaN?', options: [c('isnan(x(ind))'), c('x(ind)==NaN'), c('x(ind)=NaN'), c('x(ind)~=x')], answer: 0, explain: 'NaN nu este egal cu nimic, nici cu el însuși; <code>NaN==NaN</code> dă 0.' },
    { type: 'mc', q: 'Cu ' + c('[l,c]=size(x)') + ', când este x vector?', options: ['l = 1 sau c = 1 (dar nu ambele)', 'l = c = 1', 'l = c', 'l > 1 și c > 1'], answer: 0, explain: 'l = c = 1 ⇒ scalar; altfel, dacă niciunul nu e 1 ⇒ matrice.' },
    { type: 'mc', q: 'Care comandă înlocuiește bucla dublă care aplică rem(A(i,j),3) fiecărui element?', options: [c('A=rem(A(:,:),3)'), c('A=rem(A,3,:)'), c('for A, rem(A,3)'), c('rem(A(i,j),3)')], answer: 0, explain: 'Funcțiile lucrează element cu element pe întreaga matrice – mult mai rapid.' },
    { type: 'mc', q: 'În problema răcirii berii (30 °C → 14 °C, frigider 10 °C, K = 0.05, pas 1 minut), după câte minute se atinge temperatura?', options: ['33', '16', '4', '100'], answer: 0, explain: 'T<sub>i+1</sub> = T<sub>i</sub> + 0.05·(10 − T<sub>i</sub>), în buclă while până când T ≤ 14.' },
    { type: 'mc', q: 'Filtrul de medie cu 3 puncte y(k) = (x(k) + x(k−1) + x(k−2))/3 nu se poate aplica pentru:', options: ['primele două elemente (nu există x(0), x(−1)); se iau y(1) = x(1), y(2) = (x(1)+x(2))/2', 'ultimele două elemente', 'elementele negative', 'niciun element; formula e generală'], answer: 0, explain: 'Manualul dă formula cu 1/2, dar codul soluției împarte la 3 (medie de 3 puncte).' },
    { type: 'mc', q: 'Ce face ' + c('linspace(0,10,512)') + '?', options: ['512 puncte egal distanțate între 0 și 10', 'vectorul 0:512:10', '10 puncte între 0 și 512', 'o matrice 512×512'], answer: 0, explain: '512 = 2⁹; în prelucrarea semnalelor se preferă puteri ale lui 2.' },
  ],
  exercises: [
    { title: 'Evaluarea unei secvențe if', statement: `<p>Pentru secvența: dacă x&lt;10, y = 2x; altfel dacă x&lt;100, y = 100−x; altfel dacă x&lt;1000, y = 1000−x/2; altfel y = √x. Cât este y pentru x = 5, 50, 500, 5000?</p>`, solution: `${ml(`>> x=5;
>> if x<10
..     y=2*x;
.. elseif x<100
..     y=100-x;
.. elseif x<1000
..     y=1000-x/2;
.. else
..     y=sqrt(x);
.. end
>> y`)}<p>a) 10; b) 50; c) 750; d) 70.7107.</p>` },
    { title: 'scalar / vector / matrice', statement: `<p>Scrie o secvență if care, pornind de la x, pune în y unul din șirurile 'scalar', 'vector' sau 'matrice'.</p>`, hint: '<p>' + c('[l,c]=size(x)') + '; l=c=1 scalar; l=1 sau c=1 vector; altfel matrice.</p>', solution: `${ml(`>> x=[1 2 3];
>> [l,c]=size(x);
>> if l==1&c==1
..     y='scalar';
.. elseif l==1|c==1
..     y='vector';
.. else
..     y='matrice';
.. end
>> y`)}` },
    { title: 'Conversia unităților cu switch', statement: `<p>În ${c('lungime')} este valoarea unei măsurători, în ${c('unitate')} unitatea: 'ft' (picior, 0.3048 m), 'in' (inch, 0.0254 m), 'm', 'mm'. Scrie un switch-case care pune în ${c('lungime_metrii')} valoarea în metri. Pentru unități necunoscute pune NaN.</p>`, solution: `${ml(`>> lungime=4.25; unitate='ft';
>> switch unitate
..     case 'in'
..        lungime_metrii=lungime*0.0254;
..     case 'ft'
..        lungime_metrii=lungime*0.3048;
..     case 'm'
..        lungime_metrii=lungime;
..     case 'mm'
..        lungime_metrii=lungime/1000;
..     otherwise
..        lungime_metrii=NaN;
.. end
>> lungime_metrii`)}<p>4.25 ft = 1.2954 m.</p>`, check: [{ var: 'lungime_metrii', expected: '1.2954' }] },
    { title: 'Vectorul mediilor vecinilor', statement: `<p>Dat v, construiește w cu w(i) = (v(i−1) + v(i+1))/2, considerând v(0) = 0 și v(end+1) = 0.</p>`, hint: '<p>Construiește vx = [0 v 0] și parcurge cu o buclă de la 2 la length(vx)−1, punând în w(ind−1).</p>', solution: `${ml(`>> v=[1 0 5 7 3 4 5 5 8];
>> vx=[0 v 0];
>> for ind=2:length(vx)-1
..     w(ind-1)=(vx(ind-1)+vx(ind+1))/2;
.. end
>> w`)}<p>w = 0 3 3.5 4 5.5 4 4.5 6.5 2.5.</p>`, check: [{ var: 'w', expected: '[0 3 3.5 4 5.5 4 4.5 6.5 2.5]' }] },
    { title: 'Filtru de medie cu 3 puncte', statement: `<p>y(k) = (x(k) + x(k−1) + x(k−2))/3 definește un filtru de medie. Cu un semnal sinusoidal cu zgomot aleator pe 10 s, compară graficele semnalului și ale semnalului filtrat.</p>`, hint: '<p>s = sin(2πt/5), zgomot z = 0.1·randn(size(t)), t = linspace(0,10,512). Primele două elemente filtrate: y(1) = x(1), y(2) = (x(1)+x(2))/2.</p>', solution: `${ml(`>> t=linspace(0,10,512);
>> s=sin(2*pi/5*t);
>> z=0.1*randn(size(t));
>> x=s+z;
>> y=zeros(size(t));
>> y(1)=x(1);
>> y(2)=(x(2)+x(1))/2;
>> for k=3:length(t)
..     y(k)=(x(k)+x(k-1)+x(k-2))/3;
.. end
>> plot(t,x,'b',t,y,'r'); xlabel('timp [s]'); ylabel('amplitudine semnal'); title('Semnal cu zgomot si semnal filtrat')`)}<p>În MATLAB, cu ${c('subplot(2,1,1)')} și ${c('subplot(2,1,2)')} cele două grafice se pun unul sub altul. Semnalul filtrat a eliminat în mare măsură zgomotul.</p>` },
    { title: 'Indicii elementului maxim și minim', statement: `<p>Determină indicii (linie, coloană) ai elementului maxim și ai celui minim dintr-o matrice, cu bucle for îmbricate și if.</p>`, solution: `${ml(`>> a=[1 2 3;0 -2 3;-2 -1 0];
>> [r,c]=size(a);
>> lmin=1; lmax=1; cmin=1; cmax=1;
>> elemin=a(1,1); elemax=a(1,1);
>> for i=1:r
..     for j=1:c
..        if a(i,j) > elemax
..           elemax=a(i,j); lmax=i; cmax=j;
..        end
..        if a(i,j) < elemin
..           elemin=a(i,j); lmin=i; cmin=j;
..        end
..     end
.. end
>> [elemax lmax cmax]
>> [elemin lmin cmin]`)}<p>Maximul 3 este pe linia 1, coloana 3; minimul −2 pe linia 2, coloana 2. Când există mai multe maxime sau minime, este reținut primul întâlnit.</p>`, check: [{ var: 'lmax', expected: '1' }, { var: 'cmax', expected: '3' }, { var: 'lmin', expected: '2' }, { var: 'cmin', expected: '2' }] },
    { title: 'Răcirea sticlei cu bere', statement: `<p>Afară (și berea) sunt la 30 °C; frigiderul are 10 °C. După câte minute ajunge berea la 14 °C? Model: T<sub>i+1</sub> = T<sub>i</sub> + K·(t<sub>i+1</sub> − t<sub>i</sub>)·(T<sub>f</sub> − T<sub>i</sub>), cu K = 0.05 și măsurători din minut în minut.</p>`, solution: `${ml(`>> k=0.05; tbf=14; tb=30; t=1; tf=10;
>> while tb > tbf
..     tbn=tb+k*(tf-tb);
..     tb=tbn;
..     t=t+1;
.. end
>> t`)}<p>După 33 de minute. Cam durează, și dacă afară e 30 °C o să ni se pară o veșnicie!</p>`, check: [{ var: 't', expected: '33' }] },
  ],
});
