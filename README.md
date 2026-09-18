# Practică MATLAB

Site interactiv, complet local, pentru învățarea și exersarea celor 12 lucrări de laborator MATLAB (Lab1.pdf … Lab12.pdf).

## Cum se deschide

Dublu-click pe `index.html`. Nu are nevoie de server, internet sau instalare: totul rulează în browser (Chrome, Firefox, Safari, Edge). Progresul (scoruri la teste, fișe știute, exerciții bifate) se salvează în `localStorage`-ul browserului.

## Ce conține

Pentru fiecare lucrare:

- **Învață** – lecția rescrisă pe scurt, cu blocuri de cod care se pot rula pe loc („Rulează”) sau trimite în consolă.
- **Fișe** – flashcards întrebare/răspuns, cu „Știu” / „Mai repet”.
- **Test** – întrebări cu alegere multiplă, adevărat/fals și completare, cu feedback și explicații imediate.
- **Exerciții** – enunțurile din „Aplicații”, cu indicații, soluțiile din manual, și, unde e posibil, verificarea automată a variabilelor definite în consolă.
- **Consolă** – un interpretor MATLAB (subset) scris în JavaScript: expresii, matrici, operatorul `:`, indexare logică, `if/for/while/switch`, funcții `inline`/`@`, polinoame, `fzero`/`quad`/`fminbnd`, `plot` 2D, `fprintf`, plus un editor pentru scripturi și funcții (`function …`).

În plus: **Test general** (25 de întrebări amestecate din toate lucrările) și **Progresul meu**.

Calculul simbolic (`syms`, `solve`, `int`, …) și graficele 3D (`surf`, `cylinder`, …) nu sunt disponibile în consolă; lecțiile respective explică ce ar trebui obținut în MATLAB.

## Structura

```
index.html          pagina (shell) – încarcă toate scripturile local
css/style.css
js/matlab.js        interpretorul MATLAB (lexer, parser, evaluator, bibliotecă de funcții)
js/plot.js          desenarea figurilor 2D pe canvas
js/console.js       widgetul de consolă + rularea blocurilor din lecții
js/app.js           rutare, pagini, teste, fișe, exerciții, progres
js/data/_helpers.js ajutoare pentru fișierele de conținut (c, ml, mls, frac)
js/data/lab01.js … lab12.js   conținutul fiecărei lucrări
```

## Editarea conținutului

Fiecare `js/data/labNN.js` face `LABS.push({...})` cu: `title`, `blurb`, `sections` (lecția, HTML), `cheat` (rezumat), `cards` (fișe), `quiz` (întrebări: `mc`, `tf`, `fill`) și `exercises` (`statement`, `hint`, `solution`, opțional `starter` pentru consolă și `check` pentru verificarea variabilelor).

În blocurile `ml(...)`: liniile care încep cu `>> ` sunt comenzi, `.. ` sunt continuări ale unei comenzi pe mai multe linii, `%% ` este cod ascuns (rulat, dar neafișat), restul sunt afișate ca ieșire. `mls(...)` produce un bloc static (nerulabil).
