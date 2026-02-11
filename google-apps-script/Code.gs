/**
 * ISO 9001 KOMPASS - GOOGLE APPS SCRIPT
 * 
 * Setup-Anleitung:
 * 1. Neues Google Sheet erstellen: "ISO 9001 Kompass - Leads"
 * 2. Tools → Script-Editor öffnen
 * 3. Diesen Code einfügen
 * 4. CONFIG anpassen (Sheet-Name, E-Mail)
 * 5. Speichern (Strg+S)
 * 6. Bereitstellen → Neue Bereitstellung
 *    - Typ: Web-App
 *    - Ausführen als: Ich
 *    - Zugriff: Jeder
 * 7. URL kopieren und in React App eintragen (App.jsx → GOOGLE_SCRIPT_URL)
 */

// ============================================
// KONFIGURATION
// ============================================

const CONFIG = {
  // Name des Google Sheets (muss existieren!)
  sheetName: 'Leads',
  
  // Deine E-Mail-Adresse für Admin-Benachrichtigungen
  adminEmail: 'kontakt@onlinecert.info',
  
  // Absender-Name für E-Mails
  senderName: 'Holger Grosser | OnlineCert',
  
  // Calendly Link
  calendlyUrl: 'https://calendly.com/holger-grosser/erstgespraech',
  
  // OnlineCert Website
  websiteUrl: 'https://onlinecert.info',
  
  // Sektion-Namen
  sectionNames: [
    'Kontext der Organisation',
    'Führung',
    'Planung',
    'Unterstützung',
    'Betrieb',
    'Bewertung & Verbesserung'
  ]
};

// ============================================
// HAUPT-FUNKTION (empfängt POST-Requests)
// ============================================

function doPost(e) {
  try {
    Logger.log('POST empfangen');
    
    // Daten extrahieren (FormData)
    const data = e.parameter;
    
    Logger.log('Empfangene Daten: ' + JSON.stringify(data));
    
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
// DATEN IN SHEET SPEICHERN
// ============================================

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  
  // Sheet erstellen falls nicht vorhanden
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.sheetName);
    
    // Header setzen
    const headers = [
      'Timestamp',
      'E-Mail',
      'Firma',
      'Mitarbeiter',
      'Score (%)',
      'Kategorie',
      'Timeline',
      'Paket',
      'Preis',
      'Sektion 1 (%)',
      'Sektion 2 (%)',
      'Sektion 3 (%)',
      'Sektion 4 (%)',
      'Sektion 5 (%)',
      'Sektion 6 (%)',
      'Status',
      'Notizen'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#2E5C8A');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    sheet.setFrozenRows(1);
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
  
  // Score-Zelle einfärben
  const scoreCell = sheet.getRange(lastRow, 5);
  if (data.score >= 71) {
    scoreCell.setBackground('#d9ead3'); // Grün
  } else if (data.score >= 31) {
    scoreCell.setBackground('#fff2cc'); // Gelb
  } else {
    scoreCell.setBackground('#f4cccc'); // Rot
  }
  
  // Auto-resize Spalten
  sheet.autoResizeColumns(1, 17);
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
            <div class="section-title">📦 Ihre Empfehlung</div>
            <p><strong>Paket:</strong> ${data.package}</p>
            <p><strong>Geschätzte Kosten:</strong> ${data.price}</p>
            <p><strong>Timeline:</strong> ${data.timeline}</p>
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
            <a href="${CONFIG.websiteUrl}" class="btn" style="background: #2E5C8A;">Mehr über OnlineCert erfahren</a>
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
          
          <div class="footer">
            <p><strong>OnlineCert.info</strong></p>
            <p>ISO 9001 digital – speziell für KMU</p>
            <p>📧 kontakt@onlinecert.info | 🌐 ${CONFIG.websiteUrl}</p>
            <p style="margin-top: 20px; font-size: 11px;">
              Sie erhalten diese E-Mail, weil Sie den ISO 9001 Kompass auf OnlineCert.info ausgefüllt haben.
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
OnlineCert.info
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
  `;
  
  GmailApp.sendEmail(
    CONFIG.adminEmail,
    subject,
    body
  );
  
  Logger.log('✅ Admin benachrichtigt: ' + CONFIG.adminEmail);
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
// TEST-FUNKTION (manuell ausführen zum Testen)
// ============================================

function testDoPost() {
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
  Logger.log(result.getContent());
}
