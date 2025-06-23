# Demonstrator shadera z efektem kreskówkowania

Interaktywne demo przedstawia 6-poziomowy shader kreskówkowania oparty na teksturach, zbudowany za pomocą Three.js i Vite.

---

## Funkcje 
* Cieniowanie kreskowania w czasie rzeczywistym
* Włączanie/wyłączanie cieniowania za pomocą **H** 
* Nawigacja pierwszoosobowa (W A S D + myszka, spacja / Shift dla góry / dołu) 
* Skybox HDR naszej galaktyki 
* Światło kierunkowe z mapą cieni 
* Zbudowany i przeładowany na gorąco z **Vite**

---

## Wymagania
- Node.js w wersji **18.x** lub nowszej
- npm (zazwyczaj instalowany razem z Node.js)

Sprawdź wersję Node i npm:

```bash
node -v
npm -v
```

---

## Instalajca

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/FakeChapo/DemonstratorShadera
```

### 2. Przejdź do folderu projektu
```bash
cd DemonstratorShadera
```

### 3. Zainstaluj zależności:
```bash
npm install
```

### 4. Uruchom projekt w trybie deweloperskim
```bash
npm run dev
```

### 5. Otwórz przeglądarkę i wejdź pod adres:
```
http://localhost:5173
```
lub inny port, jeśli zostanie podany w terminalu.

---

## Sterowanie
| Klawisz / Myszka           | Akcja                              |
| -------------------------- | ---------------------------------- |
| **W A S D**                | Poruszanie się w płaszczyźnie XZ   |
| **Spacja** / **Shift**     | Idź do góry / do dołu              |
| **Przeciągnięcie myszą**   | Rozglądaj się                      |
| **H**                      | Włącz / wyłącz shader              |

Mały wskaźnik w prawym górnym rogu pokazuje bieżący stan shadera. Nakładka pomocy jest wyświetlana w lewym dolnym rogu.
