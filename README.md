# 🧭 ISO 9001 Kompass - Deployment Guide

Komplettes Lead-Magnet System für OnlineCert.info

## 📦 Was ist das?

Ein interaktives 25-Fragen-Tool, das automatisch:
- ISO 9001 Reifegrad berechnet (0-100%)
- Personalisierte Empfehlungen gibt
- Leads in Google Sheets speichert
- E-Mails automatisch versendet

## 🚀 Quick Start (30 Minuten)

### Schritt 1: Google Apps Script Setup (10 Min)

1. **Google Sheet erstellen**
   ```
   - Gehe zu sheets.google.com
   - Neue Tabelle erstellen
   - Name: "ISO 9001 Kompass - Leads"
   ```

2. **Apps Script öffnen**
   ```
   - Im Sheet: Erweiterungen → Apps Script
   - Datei umbenennen: "ISO 9001 Kompass Backend"
   ```

3. **Code einfügen**
   ```
   - Kopiere ALLES aus google-apps-script/Code.gs
   - Einfügen im Script Editor
   - Speichern (Strg+S)
   ```

4. **Konfiguration anpassen**
   ```javascript
   const CONFIG = {
     sheetName: 'Leads',  // Name des Tabs im Google Sheet
     adminEmail: 'DEINE_EMAIL@onlinecert.info',  // Für Benachrichtigungen
     senderName: 'Holger Grosser | OnlineCert',
     calendlyUrl: 'https://calendly.com/holger-grosser/erstgespraech',
     websiteUrl: 'https://onlinecert.info'
   };
   ```

5. **Bereitstellen**
   ```
   - Bereitstellen → Neue Bereitstellung
   - Typ: Web-App
   - Beschreibung: "ISO 9001 Kompass v1"
   - Ausführen als: Ich
   - Zugriff: Jeder
   - Bereitstellen klicken
   ```

6. **Berechtigungen erteilen**
   ```
   - "Zugriff autorisieren" klicken
   - Google-Konto wählen
   - "Erweitert" → "Zu [Projektname] (unsicher)"
   - "Zulassen" klicken
   ```

7. **URL kopieren**
   ```
   ✅ WICHTIG: Web-App-URL kopieren!
   Format: https://script.google.com/macros/s/ABC.../exec
   
   Diese URL brauchst du für Schritt 2!
   ```

---

### Schritt 2: GitHub Repository Setup (5 Min)

1. **GitHub Account**
   - Falls noch nicht: github.com/signup

2. **Neues Repository erstellen**
   ```
   - Name: iso-9001-kompass
   - Visibility: Public
   - README: Nein (überspringen)
   - .gitignore: Node
   ```

3. **Code hochladen**
   ```bash
   # Lokaler Ordner (Terminal/CMD)
   cd /pfad/zu/iso-9001-kompass
   git init
   git add .
   git commit -m "Initial commit: ISO 9001 Kompass"
   git branch -M main
   git remote add origin https://github.com/DEIN_USERNAME/iso-9001-kompass.git
   git push -u origin main
   ```

   ODER: Einfach alle Dateien via GitHub Web-Interface hochladen

---

### Schritt 3: Google Script URL eintragen (2 Min)

1. **Datei öffnen: src/App.jsx**

2. **Zeile 4 anpassen**
   ```javascript
   // VORHER:
   const GOOGLE_SCRIPT_URL = 'HIER_DEINE_GOOGLE_APPS_SCRIPT_URL_EINTRAGEN';
   
   // NACHHER:
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC.../exec';
   ```

3. **Speichern & Committen**
   ```bash
   git add src/App.jsx
   git commit -m "Add Google Script URL"
   git push
   ```

---

### Schritt 4: Netlify Deployment (10 Min)

1. **Netlify Account**
   - netlify.com → Sign up (mit GitHub verbinden)

2. **Neue Site erstellen**
   ```
   - "Add new site" → "Import an existing project"
   - GitHub verbinden
   - Repository auswählen: iso-9001-kompass
   ```

3. **Build Settings** (automatisch erkannt)
   ```
   Build command: npm install && npm run build
   Publish directory: dist
   
   ✅ NICHT ändern! (netlify.toml übernimmt das)
   ```

4. **Deploy klicken**
   ```
   - "Deploy site" klicken
   - Warten (2-3 Minuten)
   - Status: "Published" ✅
   ```

5. **Custom Domain einrichten** (optional)
   ```
   - Domain settings → Add custom domain
   - Domain: kompass.onlinecert.info (oder onlinecert.info/iso-9001-kompass)
   - DNS bei deinem Provider anpassen:
     * CNAME: kompass → DEINE-SITE.netlify.app
   - SSL/TLS automatisch aktiviert ✅
   ```

---

## ✅ Fertig! System läuft!

**Live-URL**: https://DEINE-SITE.netlify.app (oder deine Custom Domain)

**Testen:**
1. Kompass öffnen
2. Alle 25 Fragen beantworten
3. E-Mail-Adresse eingeben
4. "PDF-Report anfordern" klicken
5. Prüfen:
   - E-Mail erhalten? ✅
   - Google Sheet: Neue Zeile? ✅
   - Admin-Benachrichtigung erhalten? ✅

---

## 🔧 Troubleshooting

### Problem: "Failed to fetch"
**Lösung:** 
- Google Apps Script URL korrekt in src/App.jsx?
- Script deployed als Web-App?
- Berechtigungen erteilt?

### Problem: "Keine E-Mail erhalten"
**Lösung:**
- Spam-Ordner prüfen
- In Google Apps Script: Ausführungen → Logs prüfen
- Gmail-Konto in Apps Script autorisiert?

### Problem: "terser not found" beim Build
**Lösung:** 
- vite.config.js prüfen: `minify: 'esbuild'` (NICHT 'terser')

### Problem: "vite: not found"
**Lösung:**
- netlify.toml prüfen: `command = "npm install && npm run build"`

### Problem: CORS-Fehler
**Lösung:**
- FormData verwenden (✅ bereits im Code)
- KEIN Content-Type Header setzen

---

## 🔄 Updates deployen

### Code-Änderung im Frontend:
```bash
git add .
git commit -m "Update: XYZ"
git push
```
→ Netlify deployed automatisch! (ca. 2 Min)

### Code-Änderung im Google Apps Script:
```
1. Code ändern im Script Editor
2. Speichern (Strg+S)
3. Bereitstellen → Bereitstellungen verwalten
4. Bearbeiten (Stift-Icon)
5. Version: Neu
6. Bereitstellen
7. NEUE URL kopieren und in src/App.jsx eintragen!
```

---

## 📊 Analytics & Monitoring

### Google Sheets Dashboard:
- Alle Leads in Echtzeit
- Spalte "Status" manuell pflegen (Neu → Kontaktiert → Kunde)
- Filter & Pivot-Tabellen für Auswertungen

### Netlify Analytics (optional):
- Site settings → Analytics
- $9/Monat für detaillierte Stats

### Google Analytics (empfohlen):
```html
<!-- In index.html vor </head> einfügen -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📧 E-Mail-Automation erweitern

### Brevo/MailChimp Integration (optional):
1. Google Apps Script erweitern mit Brevo API
2. Lead in E-Mail-Liste eintragen
3. 4-stufige Sequenz automatisch starten (Tag 0, 1, 3, 7)

**Code-Snippet für Brevo:**
```javascript
function addToBrevo(email, data) {
  const url = 'https://api.brevo.com/v3/contacts';
  const payload = {
    email: email,
    attributes: {
      SCORE: data.score,
      CATEGORY: data.category,
      TIMELINE: data.timeline
    },
    listIds: [2] // Deine Brevo List-ID
  };
  
  UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'api-key': 'DEIN_BREVO_API_KEY',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  });
}
```

---

## 🎯 Marketing Integration

### LinkedIn Kampagne:
```
Verloren im ISO-Dschungel? 🧭

Der ISO 9001 Kompass zeigt Ihnen in 12 Minuten:
✓ Wie weit Sie von der Zertifizierung entfernt sind
✓ Was Sie noch brauchen
✓ Wie viel es kostet

100% kostenlos. Keine Anmeldung.

👉 https://onlinecert.info/iso-9001-kompass

#ISO9001 #Qualitätsmanagement #Zertifizierung
```

### Google Ads:
- Keywords: "ISO 9001 Test", "ISO 9001 Readiness", "Zertifizierung Check"
- Landing Page: Direct Link zum Kompass

---

## 📝 Projekt-Struktur

```
iso-9001-kompass/
├── src/
│   ├── App.jsx           # Haupt-Komponente (React)
│   ├── main.jsx          # Entry Point
│   ├── index.css         # Styling (OnlineCert Branding)
│   └── questions.js      # 25 Fragen + Logik
├── google-apps-script/
│   └── Code.gs           # Backend (Google Apps Script)
├── index.html            # HTML Template
├── package.json          # Dependencies
├── vite.config.js        # Vite Config
├── netlify.toml          # Netlify Config
└── README.md             # Diese Datei
```

---

## 🆘 Support

**Bei Problemen:**
1. Logs prüfen:
   - Google Apps Script: Ausführungen → Logs
   - Netlify: Deploy Logs
   - Browser: Console (F12)

2. Häufige Fehler siehe Troubleshooting oben

3. Wenn nichts hilft:
   - Issue auf GitHub erstellen
   - Oder: E-Mail an kontakt@onlinecert.info

---

## 📜 Lizenz

Privat für OnlineCert.info - Holger Grosser

---

## 🎉 Viel Erfolg!

Der ISO 9001 Kompass ist jetzt live und generiert automatisch qualifizierte Leads!

**Nächste Schritte:**
1. ✅ System testen
2. ✅ Auf Website einbinden
3. ✅ LinkedIn/Social Media bewerben
4. ✅ Google Ads Kampagne starten
5. ✅ Erste Leads konvertieren! 💰
