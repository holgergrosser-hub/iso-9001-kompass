# 🚀 ISO 9001 Kompass - Deployment Checklist

## ✅ PRE-DEPLOYMENT (Vorbereitung)

### Google Apps Script
- [ ] Google Sheet "ISO 9001 Kompass - Leads" erstellt
- [ ] Apps Script Code.gs eingefügt
- [ ] CONFIG angepasst (adminEmail, calendlyUrl, etc.)
- [ ] Script deployed als Web-App
- [ ] Berechtigungen erteilt
- [ ] Web-App-URL kopiert
- [ ] Test-Funktion testDoPost() ausgeführt → funktioniert ✅

### GitHub
- [ ] GitHub Account vorhanden
- [ ] Repository "iso-9001-kompass" erstellt (Public)
- [ ] Alle Dateien hochgeladen
- [ ] Netlify Env Var `VITE_GOOGLE_SCRIPT_URL` gesetzt


### Netlify
- [ ] Netlify Account erstellt (mit GitHub verbunden)
- [ ] Site erstellt und deployed
- [ ] Build erfolgreich (Status: Published)
- [ ] Live-URL funktioniert

---

## ✅ POST-DEPLOYMENT (Testing)

### Funktionstest
- [ ] Kompass öffnen → Seite lädt ✅
- [ ] Alle 25 Fragen durchklicken → Keine Fehler ✅
- [ ] E-Mail eingeben & absenden
- [ ] E-Mail erhalten (Inbox + Spam prüfen) ✅
- [ ] Google Sheet: Neue Zeile vorhanden ✅
- [ ] Admin-E-Mail erhalten ✅

### Browser-Test
- [ ] Chrome/Edge: Funktioniert ✅
- [ ] Safari: Funktioniert ✅
- [ ] Firefox: Funktioniert ✅
- [ ] Mobile (iOS): Funktioniert ✅
- [ ] Mobile (Android): Funktioniert ✅

### Conversion-Test
- [ ] Calendly-Link funktioniert
- [ ] OnlineCert-Website-Link funktioniert
- [ ] Alle CTAs klickbar

---

## ✅ MARKETING SETUP

### Website-Integration
- [ ] Link in Navigation: onlinecert.info → /iso-9001-kompass
- [ ] CTA auf Startseite: "Jetzt Kompass starten"
- [ ] Footer-Link eingefügt

### Social Media
- [ ] LinkedIn-Post vorbereitet
- [ ] LinkedIn-Profil aktualisiert (Headline)
- [ ] Facebook/Instagram (optional)

### Google Ads (optional)
- [ ] Kampagne erstellt
- [ ] Keywords: "ISO 9001 Test", "Readiness Check"
- [ ] Landing Page: Direktlink zum Kompass
- [ ] Budget: 500 EUR/Monat

### Analytics
- [ ] Google Analytics 4 eingebunden
- [ ] Conversion-Tracking aktiv
- [ ] Goals definiert (Kompass Complete, Email Submit)

---

## ✅ MONITORING (Woche 1)

### Daily Checks
- [ ] Google Sheet: Neue Leads? → Nachfassen!
- [ ] E-Mails funktionieren?
- [ ] Netlify: Keine Errors?

### Weekly Reviews
- [ ] Leads Woche 1: X Stück
- [ ] Conversion Rate: Y%
- [ ] Meetings gebucht: Z

### Optimierung
- [ ] A/B-Test: Headlines
- [ ] A/B-Test: CTA-Buttons
- [ ] Feedback sammeln

---

## ⚠️ TROUBLESHOOTING

### Wenn E-Mails nicht ankommen:
1. Google Apps Script → Ausführungen → Logs prüfen
2. Gmail-Berechtigung erteilt?
3. Spam-Filter prüfen
4. Test-E-Mail an dich selbst senden

### Wenn Google Sheet leer bleibt:
1. Browser Console (F12) → Errors?
2. Netlify Deploy Logs prüfen
3. Google Apps Script URL korrekt?
4. FormData wird gesendet? (Network Tab)

### Wenn Build fehlschlägt:
1. netlify.toml: `command = "npm install && npm run build"`
2. vite.config.js: `minify: 'esbuild'`
3. package.json: Alle Dependencies vorhanden?

---

## 🎯 SUCCESS METRICS (Ziel: 90 Tage)

### Woche 1-4:
- [ ] 100 Kompass-Starts
- [ ] 70 Completions (70% Completion Rate)
- [ ] 5 Meetings gebucht
- [ ] 1-2 Kunden gewonnen

### Woche 5-8:
- [ ] 300 Kompass-Starts
- [ ] 210 Completions
- [ ] 15 Meetings
- [ ] 3-5 Kunden

### Woche 9-12:
- [ ] 500 Kompass-Starts
- [ ] 350 Completions
- [ ] 25 Meetings
- [ ] 5-8 Kunden

---

## 📝 NOTIZEN

### Launch-Datum: __________

### Learnings:
-
-
-

### Optimierungen:
-
-
-

---

**Status:** 🟢 Live | 🟡 In Progress | 🔴 Problem

**Last Updated:** __________
