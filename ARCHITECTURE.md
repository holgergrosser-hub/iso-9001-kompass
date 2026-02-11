# 🧭 ISO 9001 Kompass - System Architektur

## 📊 Gesamt-Übersicht

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. Website-Besucher
   ↓
2. onlinecert.info/iso-9001-kompass
   ↓
3. 25 Fragen beantworten (React App auf Netlify)
   ↓
4. Ergebnis-Seite mit Score
   ↓
5. E-Mail eingeben
   ↓
6. FormData → Google Apps Script
   ↓
7. Parallel:
   a) Lead in Google Sheet speichern
   b) E-Mail an Lead senden (Gmail)
   c) Admin-Benachrichtigung senden
   ↓
8. Lead erhält personalisierte E-Mail mit:
   - Score & Bewertung
   - Timeline
   - Empfohlenes Paket
   - Calendly-Link
   ↓
9. Lead bucht Meeting → Kunde! 🎉
```

---

## 🔧 Technische Komponenten

### 1. FRONTEND (React + Vite)
```
Hosting: Netlify
URL: https://YOUR-SITE.netlify.app
Framework: React 18 + Vite 5

Dateien:
- src/App.jsx           → Haupt-Komponente (UI + Logic)
- src/questions.js      → 25 Fragen + Scoring-Logik
- src/index.css         → OnlineCert Branding (Blau/Orange)
- src/main.jsx          → React Entry Point
- index.html            → HTML Template

Build:
- npm run build → dist/
- Automatisches Deployment via Netlify
```

### 2. BACKEND (Google Apps Script)
```
Hosting: Google Cloud (Apps Script)
Sprache: JavaScript (ES5-kompatibel)
Trigger: HTTP POST (doPost Funktion)

Funktionen:
- doPost(e)              → Empfängt FormData
- saveToSheet(data)      → Speichert in Google Sheet
- sendEmailToLead(data)  → Sendet HTML-E-Mail
- notifyAdmin(data)      → Benachrichtigt dich

Datei:
- google-apps-script/Code.gs
```

### 3. DATENBANK (Google Sheets)
```
Name: "ISO 9001 Kompass - Leads"
Tab: "Leads"

Spalten:
A  Timestamp
B  E-Mail
C  Firma
D  Mitarbeiter
E  Score (%)          ← Farbcodiert (Grün/Gelb/Rot)
F  Kategorie
G  Timeline
H  Paket
I  Preis
J  Sektion 1 (%)
K  Sektion 2 (%)
L  Sektion 3 (%)
M  Sektion 4 (%)
N  Sektion 5 (%)
O  Sektion 6 (%)
P  Status             ← Manuell pflegen (Neu/Kontaktiert/Kunde)
Q  Notizen
```

### 4. E-MAIL (Gmail API via Apps Script)
```
Absender: dein Google Account
Service: Gmail (via GmailApp.sendEmail)

Templates:
1. Lead-E-Mail:
   - HTML-Design mit OnlineCert Branding
   - Personalisierte Bewertung basierend auf Score
   - Sektions-Breakdown
   - 2 CTAs (Calendly + Website)

2. Admin-E-Mail:
   - Plain-Text
   - Kurze Zusammenfassung
   - Lead-Daten
```

---

## 🔄 Datenfluss (Schritt für Schritt)

### Schritt 1: User füllt Kompass aus
```javascript
// React App (src/App.jsx)
const [answers, setAnswers] = useState({});

// Nach jeder Frage:
setAnswers({ ...answers, [questionId]: value });

// Nach Frage 25:
const result = calculateMaturity(answers);
// → { total: 67, sections: [75,60,...], category: "Fortgeschritten", ... }
```

### Schritt 2: User gibt E-Mail ein
```javascript
// React App (src/App.jsx)
const handleSubmitEmail = async (e) => {
  e.preventDefault();
  
  // FormData erstellen (WICHTIG: Kein Content-Type Header!)
  const formData = new FormData();
  formData.append('email', email);
  formData.append('score', result.total);
  // ... weitere Felder
  
  // POST Request
  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: formData
  });
};
```

### Schritt 3: Google Apps Script empfängt
```javascript
// google-apps-script/Code.gs
function doPost(e) {
  const data = e.parameter;  // FormData wird zu Object
  
  // data = {
  //   email: "max@firma.de",
  //   score: "67",
  //   company: "Max GmbH",
  //   ...
  // }
  
  Logger.log('Empfangen:', JSON.stringify(data));
}
```

### Schritt 4: Daten verarbeiten
```javascript
// In Google Sheet speichern
saveToSheet(data);

// E-Mails senden
sendEmailToLead(data);    // An Lead
notifyAdmin(data);        // An dich

// Response zurück
return createResponse({ status: 'success' });
```

### Schritt 5: Lead erhält E-Mail
```
Von: Holger Grosser | OnlineCert
An: max@firma.de
Betreff: Ihr ISO 9001 Kompass-Ergebnis: 67% Bereit

[Schöne HTML-E-Mail mit Score, Timeline, CTAs]
```

---

## 🎨 Design-System (OnlineCert Branding)

### Farben
```css
--primary: #2E5C8A        → OnlineCert Blau (Header, Buttons)
--secondary: #4A7BA7      → Helleres Blau (Hover, Accents)
--accent: #C55A11         → Orange (CTAs, Highlights)
--success: #059669        → Grün (Gute Scores)
--warning: #F59E0B        → Gelb/Orange (Mittlere Scores)
--danger: #DC2626         → Rot (Schlechte Scores)
```

### Typography
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

Headings: 600-700 weight
Body: 400 weight
```

### Icons
```
🧭 Kompass (Haupt-Icon)
✓  Checkmarks
📊 Statistiken
⏱  Timeline
📦 Pakete
🎯 Ziele
```

---

## 📈 Scoring-Logik (Detail)

### Fragen-Gewichtung
```javascript
Sektion 1: Kontext              → 12% Gewicht (4 Fragen)
Sektion 2: Führung              → 18% Gewicht (4 Fragen)
Sektion 3: Planung              → 12% Gewicht (4 Fragen)
Sektion 4: Unterstützung        → 18% Gewicht (5 Fragen)
Sektion 5: Betrieb              → 18% Gewicht (4 Fragen)
Sektion 6: Bewertung/Verbesserung → 22% Gewicht (4 Fragen)

Total: 100% (25 Fragen)
```

### Antwort-Punkte
```javascript
✅ Ja, vollständig    → 100 Punkte
🟡 Teilweise          →  50 Punkte
🔴 Nein               →   0 Punkte
❓ Weiß nicht         →   0 Punkte
```

### Berechnung
```javascript
// Beispiel: Sektion 1 (4 Fragen)
Frage 1: 100 Punkte (Ja)
Frage 2:  50 Punkte (Teilweise)
Frage 3:   0 Punkte (Nein)
Frage 4: 100 Punkte (Ja)

Durchschnitt Sektion 1: (100+50+0+100)/4 = 62.5%

// Alle Sektionen:
Sektion 1: 62.5% × 0.12 = 7.5
Sektion 2: 75.0% × 0.18 = 13.5
Sektion 3: 50.0% × 0.12 = 6.0
Sektion 4: 60.0% × 0.18 = 10.8
Sektion 5: 70.0% × 0.18 = 12.6
Sektion 6: 55.0% × 0.22 = 12.1

TOTAL: 62.5% → Kategorie: "Fortgeschritten"
```

### Kategorien
```javascript
86-100%: "Exzellent"      → Timeline: 2-3 Wochen
71-85%:  "Sehr gut"       → Timeline: 3-4 Wochen
51-70%:  "Fortgeschritten" → Timeline: 4-6 Wochen
31-50%:  "Ausbaufähig"    → Timeline: 6-8 Wochen
0-30%:   "Kritisch"       → Timeline: 8-12 Wochen
```

### Paket-Empfehlung
```javascript
if (score >= 51) {
  paket = "STARTER";
  preis = "800 EUR";
} else {
  paket = "SCALE";
  preis = "1.500 EUR";
}
```

---

## 🔐 Security & Privacy

### DSGVO-Konformität
```
✅ Kein Cookie-Banner nötig (keine Cookies/Tracking)
✅ E-Mail nur mit explizitem Opt-In
✅ Datenspeicherung in Google (EU-Rechenzentrum)
✅ Keine Daten-Weitergabe an Dritte
✅ Löschung jederzeit möglich (Sheet-Zeile löschen)
```

### Datenschutz-Hinweis (empfohlen auf Website)
```html
<p>
Ihre Daten werden ausschließlich zur Berechnung des ISO 9001 
Reifegrads und zum Versand des Reports verwendet. 
Kein Verkauf, keine Weitergabe. 
<a href="/datenschutz">Mehr erfahren</a>
</p>
```

---

## 📱 Responsive Design

### Breakpoints
```css
Desktop:  > 1024px  → 3-Spalten-Layout
Tablet:   768-1024px → 2-Spalten-Layout
Mobile:   < 768px   → 1-Spalte, Stack

Alle Komponenten:
- Fluid Typography (rem-basiert)
- Flexible Grids
- Touch-optimierte Buttons (min. 44px)
```

---

## 🚀 Performance

### Ladezeit-Ziele
```
First Contentful Paint: < 1.5s
Time to Interactive:    < 3.0s
Total Load Time:        < 5.0s

Optimierungen:
- Vite Build (Tree Shaking)
- CSS Minification (esbuild)
- Netlify CDN
- Preconnect zu Google Fonts
```

### Bundle-Size
```
React + ReactDOM: ~140 KB
App Code:         ~50 KB
CSS:              ~20 KB
Total:            ~210 KB (Gzipped)
```

---

## 🔄 CI/CD Pipeline

```
Git Push
   ↓
GitHub (main branch)
   ↓
Netlify Auto-Deploy
   ↓
Build (npm install && npm run build)
   ↓
Tests (falls vorhanden)
   ↓
Deploy zu Production
   ↓
Live! ✅
```

**Duration:** ~2-3 Minuten von Push bis Live

---

## 📊 Analytics (Optional Setup)

### Google Analytics 4
```javascript
// In index.html vor </head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Events tracken
```javascript
// In src/App.jsx
gtag('event', 'kompass_complete', {
  score: result.total,
  category: result.category
});

gtag('event', 'email_submit', {
  score: result.total
});
```

---

## 🎯 Conversion-Optimierung

### A/B-Testing-Ideen
```
Test 1: Headlines
- Variante A: "Wie weit sind Sie von ISO 9001 entfernt?"
- Variante B: "Finden Sie Ihren ISO-Weg in 12 Minuten"

Test 2: CTA-Farbe
- Variante A: Orange (#C55A11)
- Variante B: Blau (#2E5C8A)

Test 3: Anzahl Fragen
- Variante A: 25 Fragen (aktuell)
- Variante B: 20 Fragen (schneller)
```

### Conversion-Funnel
```
1. Landing Page View:        1000 Besucher
2. Kompass Start:             300 (30% CVR) ← Optimieren!
3. Question 5 erreicht:       250 (83%)
4. Question 15 erreicht:      220 (73%)
5. Alle 25 beantwortet:       210 (70% Completion)
6. E-Mail eingegeben:         140 (67% von Completions)
7. Meeting gebucht:           14 (10% von E-Mails)
```

---

## 🆘 Support & Wartung

### Regelmäßige Aufgaben
```
Täglich:
- Google Sheet prüfen (neue Leads?)
- E-Mails funktionieren?

Wöchentlich:
- Analytics reviewen
- Conversion Rate tracken
- A/B-Tests auswerten

Monatlich:
- Dependencies updaten (npm update)
- Security-Updates (npm audit)
- Backup Google Sheet
```

### Update-Prozess
```
1. Code lokal ändern
2. npm run dev (testen)
3. git add . && git commit -m "..."
4. git push
5. Netlify deployed automatisch
6. Live-Test
```

---

## 🎉 Das war's!

Komplettes System ready to deploy! 🚀

**Next Steps:**
1. README.md lesen
2. DEPLOYMENT_CHECKLIST.md durchgehen
3. System deployen
4. Erste Leads generieren!

Viel Erfolg! 💪
