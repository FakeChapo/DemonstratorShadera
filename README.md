# Demonstrator shadera z efektem kreskówkowania - Hatches

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

## Pierwsze kroki

### 1. Wymagania
* Node ≥ 18
  ```bash
  node --version
  # v18.x  or  newer
  ```

### 2. Zainstaluj pakiety
```bash
npm install three vite
```

### 3. Serwer deweloperski
```bash
npm run dev
```
Aplikacja jest serwowana pod adresem `http://localhost:5173` (port domyślny Vite) z HMR.

### 4. Kompilacja produkcyjna
```bash
npm run build
# Statyczne pliki będą znajdować się w /dist
```

### 5. Podgląd kompilacji produkcyjnej
```bash
npm run preview
```
Vite będzie hostować folder '/dist', dzięki czemu będziesz mógł przetestować zoptymalizowany pakiet.

---

## Sterowanie
| Klawisz / Myszka            | Akcja                |
| ---------------------- | --------------------- |
| **W A S D**            | Poruszanie się w płaszczyźnie XZ      |
| **Spacja** / **Shift**  | Idź do góry / do dołu       |
| **Przeciągnięcie myszą**         | Rozglądaj się           |
| **H**                  | Włącz / wyłącz shader |

Mały wskaźnik (w prawym górnym rogu) pokazuje bieżący stan shadera; Nakładka pomocy jest wyświetlana w lewym dolnym rogu.
