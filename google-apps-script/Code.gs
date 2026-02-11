/**
 * ISO 9001 KOMPASS - GOOGLE APPS SCRIPT
 * 
 * NEUE VERSION: Erstellt automatisch Header-Zeile beim ersten Aufruf!
 * 
 * Setup-Anleitung:
 * 1. Neues Google Sheet erstellen: "ISO 9001 Kompass - Leads"
 * 2. Tools → Script-Editor öffnen
 * 3. Diesen Code einfügen
 * 4. CONFIG anpassen (E-Mail, Calendly-Link)
 * 5. Speichern (Strg+S)
 * 6. WICHTIG: Erst testCreateHeaders() ausführen (Test-Funktion unten)
 * 7. Dann Bereitstellen → Neue Bereitstellung
 *    - Typ: Web-App
 *    - Ausführen als: Ich
 *    - Zugriff: Jeder
 * 8. URL kopieren und in React App eintragen (App.jsx → GOOGLE_SCRIPT_URL)
 */

// ============================================
// KONFIGURATION - HIER ANPASSEN!
// ============================================

const CONFIG = {
  // Name des Tabs im Google Sheet (wird automatisch erstellt falls nicht vorhanden)
  sheetName: 'Leads',
  
  // Deine E-Mail-Adresse für Admin-Benachrichtigungen
  adminEmail: 'kontakt@qm-guru.de',
  
  // Absender-Name für E-Mails
  senderName: 'Holger Grosser | QM-Guru.de',
  
  // Calendly Link
  calendlyUrl: 'https://calendly.com/holger-grosser/erstgespraech',
  
  // Website URL
  websiteUrl: 'https://qm-guru.de',
  
  // Sektion-Namen (für E-Mail-Report)
  sectionNames: [
    'Kontext der Organisation',
    'Führung',
    'Planung',
    'Unterstützung',
    'Betrieb',
    'Bewertung & Verbesserung'
  ],
  
  // Header-Zeile (Spalten-Überschriften)
  headers: [
    'Timestamp',
    'E-Mail',
    'Firma',
    'Mitarbeiter',
    'Score (%)',
    'Kategorie',
    'Timeline',
    'Paket',
    'Preis',
    'Sektion 1: Kontext (%)',
    'Sektion 2: Führung (%)',
    'Sektion 3: Planung (%)',
    'Sektion 4: Unterstützung (%)',
    'Sektion 5: Betrieb (%)',
    'Sektion 6: Bewertung (%)',
    'Status',
    'Notizen'
  ]
};

// ============================================
// HAUPT-FUNKTION (empfängt POST-Requests)
// ============================================

function doPost(e) {
  try {
    Logger.log('📨 POST empfangen');
    
    // Sheet-Setup sicherstellen (erstellt Header falls nötig)
    ensureSheetSetup();
    
    // Daten extrahieren (FormData)
    const data = e.parameter;
    
    Logger.log('📊 Empfangene Daten: ' + JSON.stringify(data));
    
    // Validierung
    if (!data.email || !data.score) {
      return createResponse({ 
        status: 'error', 
        message: 'E-Mail und Score sind erforderlich' 
      });
    }
    
    // Daten verarbeiten
    const leadData = {
      timestamp: new Date(),
      email: data.email,
      company: data.company || 'Nicht angegeben',
      employees: data.employees || 'Nicht angegeben',
      score: parseInt(data.score),
      category: data.category,
      timeline: data.timeline,
      package: data.package,
      price: data.price,
      sections: data.sections ? JSON.parse(data.sections) : [],
      answers: data.answers ? JSON.parse(data.answers) : {}
    };
    
    // In Sheet speichern
    saveToSheet(leadData);
    
    // E-Mail senden
    sendEmailToLead(leadData);
    
    // Admin benachrichtigen
    notifyAdmin(leadData);
    
    Logger.log('✅ Erfolgreich verarbeitet: ' + leadData.email);
    
    return createResponse({ 
      status: 'success', 
      message: 'Daten erfolgreich gespeichert' 
    });
    
  } catch (error) {
    Logger.log('❌ Fehler: ' + error.toString());
    return createResponse({ 
      status: 'error', 
      message: error.toString() 
    });
  }
}

// ============================================
// SHEET SETUP SICHERSTELLEN
// ============================================

function ensureSheetSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  
  // Sheet existiert nicht → erstellen
  if (!sheet) {
    Logger.log('📝 Sheet "' + CONFIG.sheetName + '" existiert nicht, erstelle...');
    sheet = ss.insertSheet(CONFIG.sheetName);
    createHeaders(sheet);
    Logger.log('✅ Sheet erstellt mit Headern');
    return;
  }
  
  // Sheet existiert, aber leer → Header erstellen
  if (sheet.getLastRow() === 0) {
    Logger.log('📝 Sheet ist leer, erstelle Header...');
    createHeaders(sheet);
    Logger.log('✅ Header erstellt');
    return;
  }
  
  // Sheet existiert und hat Daten
  // Prüfen ob Zeile 1 Header sind (nicht überschreiben!)
  const firstCell = sheet.getRange(1, 1).getValue();
  if (firstCell !== 'Timestamp' && firstCell !== CONFIG.headers[0]) {
    Logger.log('⚠️ Zeile 1 scheint keine Header zu sein, erstelle Header...');
    sheet.insertRowBefore(1);
    createHeaders(sheet);
    Logger.log('✅ Header in Zeile 1 eingefügt');
  }
}

// ============================================
// HEADER-ZEILE ERSTELLEN
// ============================================

function createHeaders(sheet) {
  // Header setzen
  sheet.getRange(1, 1, 1, CONFIG.headers.length).setValues([CONFIG.headers]);
  
  // Header formatieren
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.headers.length);
  
  // Styling
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2E5C8A');  // QM-Guru Blau
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // Zeile fixieren
  sheet.setFrozenRows(1);
  
  // Spaltenbreiten optimieren
  sheet.autoResizeColumns(1, CONFIG.headers.length);
  
  // Alternativ: Manuelle Breiten für bessere Lesbarkeit
  sheet.setColumnWidth(1, 150);  // Timestamp
  sheet.setColumnWidth(2, 200);  // E-Mail
  sheet.setColumnWidth(3, 150);  // Firma
  sheet.setColumnWidth(4, 100);  // Mitarbeiter
  sheet.setColumnWidth(5, 80);   // Score
  sheet.setColumnWidth(6, 120);  // Kategorie
  sheet.setColumnWidth(7, 100);  // Timeline
  sheet.setColumnWidth(8, 80);   // Paket
  sheet.setColumnWidth(9, 80);   // Preis
  // Sektionen 10-15
  for (let i = 10; i <= 15; i++) {
    sheet.setColumnWidth(i, 100);
  }
  sheet.setColumnWidth(16, 100);  // Status
  sheet.setColumnWidth(17, 300);  // Notizen
  
  Logger.log('✅ Header-Zeile formatiert');
}

// ============================================
// DATEN IN SHEET SPEICHERN
// ============================================

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  
  if (!sheet) {
    throw new Error('Sheet "' + CONFIG.sheetName + '" nicht gefunden!');
  }
  
  // Neue Zeile hinzufügen
  const row = [
    data.timestamp,
    data.email,
    data.company,
    data.employees,
    data.score,
    data.category,
    data.timeline,
    data.package,
    data.price,
    data.sections[0] || 0,
    data.sections[1] || 0,
    data.sections[2] || 0,
    data.sections[3] || 0,
    data.sections[4] || 0,
    data.sections[5] || 0,
    'Neu',
    ''
  ];
  
  sheet.appendRow(row);
  
  // Formatierung der letzten Zeile
  const lastRow = sheet.getLastRow();
  
  // Score-Zelle einfärben (Spalte E = 5)
  const scoreCell = sheet.getRange(lastRow, 5);
  if (data.score >= 71) {
    scoreCell.setBackground('#d9ead3'); // Grün
    scoreCell.setFontWeight('bold');
  } else if (data.score >= 31) {
    scoreCell.setBackground('#fff2cc'); // Gelb
  } else {
    scoreCell.setBackground('#f4cccc'); // Rot
    scoreCell.setFontWeight('bold');
  }
  
  // Kategorie-Zelle einfärben (Spalte F = 6)
  const categoryCell = sheet.getRange(lastRow, 6);
  if (data.score >= 71) {
    categoryCell.setBackground('#d9ead3');
  } else if (data.score >= 31) {
    categoryCell.setBackground('#fff2cc');
  } else {
    categoryCell.setBackground('#f4cccc');
  }
  
  // Status-Zelle formatieren (Spalte P = 16)
  const statusCell = sheet.getRange(lastRow, 16);
  statusCell.setBackground('#e8f4f8'); // Hellblau
  statusCell.setFontWeight('bold');
  
  // Timestamp formatieren
  sheet.getRange(lastRow, 1).setNumberFormat('dd.mm.yyyy hh:mm:ss');
  
  // Prozent-Spalten formatieren (E, J-O = 5, 10-15)
  const percentCols = [5, 10, 11, 12, 13, 14, 15];
  percentCols.forEach(col => {
    sheet.getRange(lastRow, col).setNumberFormat('0"%"');
  });
  
  Logger.log('✅ Zeile ' + lastRow + ' gespeichert und formatiert');
}

// ============================================
// E-MAIL AN LEAD SENDEN
// ============================================

function sendEmailToLead(data) {
  const subject = `Ihr ISO 9001 Kompass-Ergebnis: ${data.score}% Bereit`;
  
  // Personalisierte Bewertung
  let bewertung = '';
  if (data.score < 30) {
    bewertung = 'Ihr Unternehmen steht noch am Anfang der ISO 9001 Reise. Aber keine Sorge: Mit den richtigen Templates und etwas Unterstützung sind Sie in 8-12 Wochen zertifizierbar.';
  } else if (data.score < 50) {
    bewertung = 'Sie haben bereits eine Grundlage geschaffen. Mit gezieltem Coaching und unseren Vorlagen schließen Sie die Lücken in 6-8 Wochen.';
  } else if (data.score < 70) {
    bewertung = 'Sehr gut! Die Basis steht. Jetzt geht es um Feinschliff und Lückenschluss. Zertifizierung in 4-6 Wochen realistisch.';
  } else {
    bewertung = 'Exzellent! Sie sind fast fertig. Mit einem Pre-Audit finden wir die letzten Schwachstellen. Zertifizierung in 2-4 Wochen möglich.';
  }
  
  // HTML-E-Mail
  const htmlBody = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E5C8A, #4A7BA7); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .score { font-size: 3rem; font-weight: bold; margin: 20px 0; }
          .meter { background: rgba(255,255,255,0.3); height: 12px; border-radius: 999px; overflow: hidden; margin: 20px 0; }
          .meter-fill { background: white; height: 100%; }
          .section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .section-title { font-weight: bold; color: #2E5C8A; margin-bottom: 10px; }
          .btn { display: inline-block; background: #C55A11; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          
          <div class="header">
            <h2>🧭 Ihr ISO 9001 Kompass-Ergebnis</h2>
            <div class="score">${data.score}%</div>
            <div class="meter">
              <div class="meter-fill" style="width: ${data.score}%"></div>
            </div>
            <h3>${data.category}</h3>
            <p>⏱ Timeline zur Zertifizierung: ${data.timeline}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Was bedeutet Ihr Ergebnis?</div>
            <p>${bewertung}</p>
          </div>
          
          <div class="section">
            <div class="section-title">📦 Ihre persönliche Empfehlung</div>
            <table style="width: 100%; background: #f9fafb; border-radius: 8px; padding: 15px; margin: 10px 0;">
              <tr>
                <td style="padding: 8px 0;"><strong>Empfohlenes Paket:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #C55A11; font-weight: bold; font-size: 1.1em;">${data.package}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Investition:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #2E5C8A; font-weight: bold; font-size: 1.2em;">${data.price}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.timeline}</td>
              </tr>
            </table>
            
            <div style="background: #E8F4F8; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #2E5C8A;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #2E5C8A;">Was ist im ${data.package}-Paket enthalten?</p>
              ${getPackageIncludes(data.package, data.score)}
            </div>
            
            <div style="margin-top: 15px; padding: 15px; background: #fff2cc; border-radius: 8px; border-left: 4px solid #F59E0B;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #F59E0B;">💡 Warum ${data.package}?</p>
              <p style="margin: 0;">${getPackageReason(data.score)}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📊 Detaillierte Bewertung nach Bereichen</div>
            ${CONFIG.sectionNames.map((name, i) => {
              const score = data.sections[i] || 0;
              const color = score >= 70 ? '#059669' : score >= 40 ? '#F59E0B' : '#DC2626';
              return `<p><strong>${name}:</strong> <span style="color: ${color}; font-weight: bold;">${score}%</span></p>`;
            }).join('')}
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <p style="font-size: 18px; margin-bottom: 20px;"><strong>Bereit für den nächsten Schritt?</strong></p>
            <a href="${CONFIG.calendlyUrl}" class="btn">Kostenloses Erstgespräch buchen (30 Min)</a>
            <a href="${CONFIG.websiteUrl}" class="btn" style="background: #2E5C8A;">Mehr über QM-Guru erfahren</a>
          </div>
          
          <div class="section">
            <div class="section-title">💰 Warum QM-Guru.de?</div>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Vergleich</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Traditionelle Zertifizierer</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; background: #E8F4F8;"><strong>QM-Guru.de</strong></th>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Kosten</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">3.000 - 6.000 EUR</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; background: #f0fdf4; font-weight: bold;">${data.price}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Timeline</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">3-6 Monate</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; background: #f0fdf4; font-weight: bold;">${data.timeline}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Durchführung</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">Vor-Ort + Reisekosten</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; background: #f0fdf4; font-weight: bold;">100% remote</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Coaching</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">Separat buchbar</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; background: #f0fdf4; font-weight: bold;">Inklusive</td>
              </tr>
              <tr>
                <td style="padding: 10px;">Templates</td>
                <td style="padding: 10px; text-align: center;">Meist nicht enthalten</td>
                <td style="padding: 10px; text-align: center; background: #f0fdf4; font-weight: bold;">Alle inklusive</td>
              </tr>
            </table>
            <p style="margin-top: 15px; font-size: 0.95em; color: #666; text-align: center;">
              <strong>Ihre Ersparnis:</strong> Bis zu 70% Kosten und 50% Zeit im Vergleich zu traditionellen Anbietern
            </p>
          </div>
          
          <div class="section">
            <div class="section-title">🎯 Ihre nächsten Schritte</div>
            <ol>
              <li>Kostenloses Beratungsgespräch buchen (Link oben)</li>
              <li>Lücken mit unseren Templates schließen</li>
              <li>Pre-Audit durchführen lassen</li>
              <li>Zertifizierungsaudit in ${data.timeline}</li>
            </ol>
          </div>
          
          <div class="section">
            <div class="section-title">🎯 Ihre nächsten Schritte</div>
            <ol style="line-height: 2; font-size: 1.05em;">
              <li><strong>Kostenloses Beratungsgespräch buchen</strong> (30 Min, unverbindlich)</li>
              <li>Gemeinsam Ihren individuellen Fahrplan erstellen</li>
              <li>Lücken mit unseren Templates schließen</li>
              <li>Pre-Audit durchführen lassen</li>
              <li>Zertifizierungsaudit in ${data.timeline}</li>
            </ol>
            <div style="background: linear-gradient(135deg, #C55A11, #F59E0B); color: white; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 1.1em; font-weight: bold;">⏰ Limitiertes Angebot</p>
              <p style="margin: 0 0 20px 0;">Buchen Sie innerhalb der nächsten 7 Tage Ihr kostenloses Erstgespräch und erhalten Sie:</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
                <li style="margin: 8px 0;">✨ Kostenlose Gap-Analyse (Wert: 300 EUR)</li>
                <li style="margin: 8px 0;">✨ Starter-Templates sofort per E-Mail (Wert: 150 EUR)</li>
                <li style="margin: 8px 0;">✨ Exklusiver Zugang zu unserer Webinar-Aufzeichung</li>
              </ul>
              <a href="${CONFIG.calendlyUrl}" style="display: inline-block; background: white; color: #C55A11; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 1.1em;">
                Jetzt Termin sichern →
              </a>
              <p style="margin: 15px 0 0 0; font-size: 0.9em; opacity: 0.9;">⚡ Nur noch wenige freie Termine in diesem Monat</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>QM-Guru.de</strong></p>
            <p>ISO 9001 Kompass</p>
            <p>📧 kontakt@qm-guru.de | 🌐 ${CONFIG.websiteUrl}</p>
            <p style="margin-top: 20px; font-size: 11px;">
              Sie erhalten diese E-Mail, weil Sie den ISO 9001 Kompass auf QM-Guru.de ausgefüllt haben.
            </p>
          </div>
          
        </div>
      </body>
    </html>
  `;
  
  // Plain-Text Fallback
  const plainText = `
Ihr ISO 9001 Kompass-Ergebnis

Score: ${data.score}%
Kategorie: ${data.category}
Timeline: ${data.timeline}

${bewertung}

Empfohlen: ${data.package} (${data.price})

Nächster Schritt: Buchen Sie ein kostenloses Erstgespräch:
${CONFIG.calendlyUrl}

Beste Grüße,
Holger Grosser
QM-Guru.de
  `;
  
  // E-Mail senden
  GmailApp.sendEmail(
    data.email,
    subject,
    plainText,
    {
      htmlBody: htmlBody,
      name: CONFIG.senderName
    }
  );
  
  Logger.log('✅ E-Mail gesendet an: ' + data.email);
}

// ============================================
// ADMIN BENACHRICHTIGEN
// ============================================

function notifyAdmin(data) {
  const subject = `🧭 Neuer Kompass-Lead: ${data.company} (${data.score}%)`;
  
  const body = `
Neuer ISO 9001 Kompass Lead!

📊 ERGEBNIS
Score: ${data.score}% (${data.category})
Timeline: ${data.timeline}
Empfohlen: ${data.package} (${data.price})

👤 KONTAKT
E-Mail: ${data.email}
Firma: ${data.company}
Mitarbeiter: ${data.employees}

📈 SEKTIONEN
${CONFIG.sectionNames.map((name, i) => `${name}: ${data.sections[i]}%`).join('\n')}

⏰ Zeitstempel: ${data.timestamp}

---
Action: Lead im Sheet prüfen und ggf. nachfassen!
Google Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  GmailApp.sendEmail(
    CONFIG.adminEmail,
    subject,
    body
  );
  
  Logger.log('✅ Admin benachrichtigt: ' + CONFIG.adminEmail);
}

// ============================================
// HELPER: Package Details für E-Mail
// ============================================

function getPackageIncludes(packageName, score) {
  const packages = {
    'EXPRESS': `
      <ul style="margin: 5px 0; padding-left: 20px; line-height: 1.8;">
        <li>✅ Pre-Audit (remote, 2 Stunden)</li>
        <li>✅ Gap-Analyse & Checkliste</li>
        <li>✅ Zertifizierungsaudit (remote, 4 Stunden)</li>
        <li>✅ ISO 9001 Zertifikat (digital)</li>
        <li>✅ E-Mail-Support während der Zertifizierung</li>
      </ul>
      <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
        <strong>Perfekt für Sie:</strong> Sie sind bereits sehr gut vorbereitet und brauchen nur noch den finalen Check!
      </p>
    `,
    'STARTER': `
      <ul style="margin: 5px 0; padding-left: 20px; line-height: 1.8;">
        <li>✅ Pre-Audit (remote, 3 Stunden)</li>
        <li>✅ Dokumenten-Templates (10+ Vorlagen)</li>
        <li>✅ 1x Coaching-Call (90 Minuten)</li>
        <li>✅ Gap-Schließung Support</li>
        <li>✅ Zertifizierungsaudit (remote, 4 Stunden)</li>
        <li>✅ ISO 9001 Zertifikat (digital)</li>
        <li>✅ E-Mail-Support</li>
      </ul>
      <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
        <strong>Perfekt für Sie:</strong> Gute Basis vorhanden, wir schließen gemeinsam die letzten Lücken!
      </p>
    `,
    'STANDARD': `
      <ul style="margin: 5px 0; padding-left: 20px; line-height: 1.8;">
        <li>✅ Kick-off Workshop (remote, 2 Stunden)</li>
        <li>✅ Pre-Audit (remote, 4 Stunden)</li>
        <li>✅ Alle Dokumenten-Templates (20+ Vorlagen)</li>
        <li>✅ 2x Coaching-Calls (je 90 Minuten)</li>
        <li>✅ Prozess-Dokumentation Support</li>
        <li>✅ Gap-Schließung Support</li>
        <li>✅ Zertifizierungsaudit (remote, 6 Stunden)</li>
        <li>✅ ISO 9001 Zertifikat (digital)</li>
        <li>✅ E-Mail & Telefon-Support</li>
      </ul>
      <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
        <strong>Perfekt für Sie:</strong> Solide Grundlage, wir arbeiten die mittleren Lücken systematisch ab!
      </p>
    `,
    'PROFESSIONAL': `
      <ul style="margin: 5px 0; padding-left: 20px; line-height: 1.8;">
        <li>✅ Kick-off Workshop (remote, 3 Stunden)</li>
        <li>✅ Umfassende Gap-Analyse</li>
        <li>✅ Alle Templates & Vorlagen (30+ Dokumente)</li>
        <li>✅ 4x Coaching-Calls (je 90 Minuten)</li>
        <li>✅ Prozess-Design Support</li>
        <li>✅ Dokumentation gemeinsam erstellen</li>
        <li>✅ Internes Audit durchführen</li>
        <li>✅ Management-Review Support</li>
        <li>✅ Pre-Audit (remote, 4 Stunden)</li>
        <li>✅ Zertifizierungsaudit (remote, 6 Stunden)</li>
        <li>✅ ISO 9001 Zertifikat (digital)</li>
        <li>✅ Premium Support (E-Mail, Telefon, WhatsApp)</li>
      </ul>
      <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
        <strong>Perfekt für Sie:</strong> Intensive Begleitung vom aktuellen Stand bis zur Zertifizierung!
      </p>
    `,
    'COMPLETE': `
      <ul style="margin: 5px 0; padding-left: 20px; line-height: 1.8;">
        <li>✅ Intensiv-Workshop (remote, 1 Tag)</li>
        <li>✅ Vollständiger QMS-Aufbau von Grund auf</li>
        <li>✅ Alle Templates & Vorlagen (50+ Dokumente)</li>
        <li>✅ 6x Coaching-Calls (je 120 Minuten)</li>
        <li>✅ Prozesslandkarte erstellen</li>
        <li>✅ Alle Dokumente gemeinsam erarbeiten</li>
        <li>✅ Mitarbeiter-Schulungen (on-demand)</li>
        <li>✅ Interne Audits durchführen</li>
        <li>✅ Management-Review moderieren</li>
        <li>✅ Pre-Audit (remote, 6 Stunden)</li>
        <li>✅ Zertifizierungsaudit (remote, 8 Stunden)</li>
        <li>✅ ISO 9001 Zertifikat (digital)</li>
        <li>✅ VIP-Support (E-Mail, Telefon, WhatsApp, Video)</li>
        <li>✅ 3 Monate Nachbetreuung</li>
      </ul>
      <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
        <strong>Perfekt für Sie:</strong> Komplette Begleitung vom ersten Schritt bis zur erfolgreichen Zertifizierung!
      </p>
    `
  };
  
  return packages[packageName] || packages['STANDARD'];
}

function getPackageReason(score) {
  if (score >= 86) {
    return 'Sie haben bereits 86% oder mehr erreicht! Das bedeutet, Ihr QMS ist sehr gut vorbereitet. Mit unserem EXPRESS-Paket führen wir nur noch den finalen Check durch und bringen Sie schnell zur Zertifizierung.';
  } else if (score >= 71) {
    return 'Mit einem Score von über 70% haben Sie eine sehr gute Basis geschaffen. Das STARTER-Paket konzentriert sich auf die verbliebenen Lücken und bringt Sie effizient zur Zertifizierung.';
  } else if (score >= 51) {
    return 'Ihr Score zeigt eine solide Grundlage. Mit dem STANDARD-Paket arbeiten wir systematisch die mittleren Lücken ab und bereiten Sie optimal auf die Zertifizierung vor.';
  } else if (score >= 31) {
    return 'Es gibt noch einige Bereiche, die intensive Betreuung benötigen. Das PROFESSIONAL-Paket bietet Ihnen umfassende Unterstützung mit regelmäßigen Coaching-Calls und gemeinsamer Dokumenten-Erstellung.';
  } else {
    return 'Sie stehen noch am Anfang Ihrer ISO 9001 Reise. Das COMPLETE-Paket begleitet Sie von Grund auf mit intensivem Coaching, allen notwendigen Vorlagen und vollständiger Unterstützung bis zur erfolgreichen Zertifizierung.';
  }
}

// ============================================
// HELPER: Response erstellen
// ============================================

function createResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TEST-FUNKTIONEN (manuell ausführen)
// ============================================

/**
 * TEST 1: Header erstellen
 * 
 * Ausführen BEVOR du das Script deployed!
 * 1. In Apps Script: Diese Funktion auswählen
 * 2. Ausführen klicken
 * 3. Im Sheet prüfen: Zeile 1 hat jetzt Header ✅
 */
function testCreateHeaders() {
  Logger.log('🧪 Test: Header erstellen...');
  ensureSheetSetup();
  Logger.log('✅ Test abgeschlossen - Prüfe das Sheet!');
}

/**
 * TEST 2: Kompletten Workflow testen
 * 
 * Simuliert einen Form-Submit
 * 1. In Apps Script: Diese Funktion auswählen
 * 2. Ausführen klicken
 * 3. Prüfen:
 *    - Sheet: Neue Zeile? ✅
 *    - E-Mail erhalten? ✅
 *    - Admin-Benachrichtigung? ✅
 */
function testDoPost() {
  Logger.log('🧪 Test: Kompletten Workflow...');
  
  const testData = {
    parameter: {
      email: 'test@example.com',
      company: 'Test GmbH',
      employees: '11-50',
      score: '67',
      category: 'Fortgeschritten',
      timeline: '4-6 Wochen',
      package: 'STARTER',
      price: '800 EUR',
      sections: '[75, 60, 50, 65, 70, 55]',
      answers: '{}'
    }
  };
  
  const result = doPost(testData);
  Logger.log('📋 Result: ' + result.getContent());
  Logger.log('✅ Test abgeschlossen - Prüfe Sheet & E-Mails!');
}

/**
 * TEST 3: Nur E-Mail testen
 * 
 * Sendet Test-E-Mail ohne Sheet zu befüllen
 */
function testEmailOnly() {
  Logger.log('🧪 Test: E-Mail senden...');
  
  const testData = {
    email: CONFIG.adminEmail, // An dich selbst
    company: 'Test GmbH',
    employees: '11-50',
    score: 67,
    category: 'Fortgeschritten',
    timeline: '4-6 Wochen',
    package: 'STARTER',
    price: '800 EUR',
    sections: [75, 60, 50, 65, 70, 55]
  };
  
  sendEmailToLead(testData);
  Logger.log('✅ Test-E-Mail gesendet an: ' + CONFIG.adminEmail);
}
