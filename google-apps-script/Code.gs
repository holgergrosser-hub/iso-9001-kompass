/**
 * ISO 9001 KOMPASS - GOOGLE APPS SCRIPT
 * SIMPLE VERSION - NUR ERGEBNIS, KEINE PREISE
 * 
 * Setup-Anleitung:
 * 1. Neues Google Sheet erstellen: "ISO 9001 Kompass - Leads"
 * 2. Tools → Script-Editor öffnen
 * 3. Diesen Code einfügen
 * 4. CONFIG anpassen (E-Mail, Calendly-Link)
 * 5. Speichern (Strg+S)
 * 6. WICHTIG: Erst testCreateHeaders() ausführen
 * 7. Dann Bereitstellen → Neue Bereitstellung
 *    - Typ: Web-App
 *    - Ausführen als: Ich
 *    - Zugriff: Jeder
 * 8. URL kopieren und in React App eintragen
 */

// ============================================
// KONFIGURATION
// ============================================

const CONFIG = {
  sheetName: 'Leads',
  adminEmail: 'kontakt@qm-guru.de',
  senderName: 'Holger Grosser | QM-Guru.de',
  calendlyUrl: 'https://calendly.com/grosser-qmguru/fragen-zur-zertifizierung',
  websiteUrl: 'https://qm-guru.de',
  sectionNames: [
    'Kontext der Organisation',
    'Führung',
    'Planung',
    'Unterstützung',
    'Betrieb',
    'Bewertung & Verbesserung'
  ],
  headers: [
    'Timestamp',
    'E-Mail',
    'Firma',
    'Mitarbeiter',
    'Score (%)',
    'Kategorie',
    'Timeline',
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
// HAUPT-FUNKTION
// ============================================

function doPost(e) {
  try {
    Logger.log('📨 POST empfangen');
    ensureSheetSetup();
    
    const data = e.parameter;
    Logger.log('📊 Empfangene Daten: ' + JSON.stringify(data));
    
    if (!data.email || !data.score) {
      return createResponse({ 
        status: 'error', 
        message: 'E-Mail und Score sind erforderlich' 
      });
    }
    
    const leadData = {
      timestamp: new Date(),
      email: data.email,
      company: data.company || 'Nicht angegeben',
      employees: data.employees || 'Nicht angegeben',
      score: parseInt(data.score),
      category: data.category,
      timeline: data.timeline,
      sections: data.sections ? JSON.parse(data.sections) : [],
      answers: data.answers ? JSON.parse(data.answers) : {}
    };
    
    saveToSheet(leadData);
    sendEmailToLead(leadData);
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
// SHEET SETUP
// ============================================

function ensureSheetSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  
  if (!sheet) {
    Logger.log('📝 Sheet erstellen...');
    sheet = ss.insertSheet(CONFIG.sheetName);
    createHeaders(sheet);
    return;
  }
  
  if (sheet.getLastRow() === 0) {
    Logger.log('📝 Header erstellen...');
    createHeaders(sheet);
    return;
  }
  
  const firstCell = sheet.getRange(1, 1).getValue();
  if (firstCell !== 'Timestamp' && firstCell !== CONFIG.headers[0]) {
    sheet.insertRowBefore(1);
    createHeaders(sheet);
  }
}

function createHeaders(sheet) {
  sheet.getRange(1, 1, 1, CONFIG.headers.length).setValues([CONFIG.headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2E5C8A');
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, CONFIG.headers.length);
  
  Logger.log('✅ Header erstellt');
}

// ============================================
// DATEN SPEICHERN
// ============================================

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  
  if (!sheet) {
    throw new Error('Sheet nicht gefunden!');
  }
  
  const row = [
    data.timestamp,
    data.email,
    data.company,
    data.employees,
    data.score,
    data.category,
    data.timeline,
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
  
  const lastRow = sheet.getLastRow();
  
  // Score formatieren
  const scoreCell = sheet.getRange(lastRow, 5);
  if (data.score >= 71) {
    scoreCell.setBackground('#d9ead3');
    scoreCell.setFontWeight('bold');
  } else if (data.score >= 31) {
    scoreCell.setBackground('#fff2cc');
  } else {
    scoreCell.setBackground('#f4cccc');
    scoreCell.setFontWeight('bold');
  }
  
  // Prozent-Format
  [5, 8, 9, 10, 11, 12, 13].forEach(col => {
    sheet.getRange(lastRow, col).setNumberFormat('0"%"');
  });
  
  Logger.log('✅ Zeile gespeichert');
}

// ============================================
// E-MAIL AN LEAD - SIMPLE VERSION
// ============================================

function sendEmailToLead(data) {
  const subject = `Ihr ISO 9001 Kompass-Ergebnis: ${data.score}%`;
  
  // Personalisierte Bewertung
  let bewertung = '';
  if (data.score < 30) {
    bewertung = 'Ihr Unternehmen steht noch am Anfang der ISO 9001 Reise. Mit den richtigen Templates und Unterstützung können Sie in 8-12 Wochen zertifizierbar sein.';
  } else if (data.score < 50) {
    bewertung = 'Sie haben bereits eine Grundlage geschaffen. Mit gezieltem Coaching schließen Sie die Lücken in 6-8 Wochen.';
  } else if (data.score < 70) {
    bewertung = 'Sehr gut! Die Basis steht. Jetzt geht es um Feinschliff und Lückenschluss. Zertifizierung in 4-6 Wochen realistisch.';
  } else if (data.score < 86) {
    bewertung = 'Exzellent! Sie sind auf einem sehr guten Weg. Mit einem Pre-Audit finden Sie die letzten Schwachstellen. Zertifizierung in 3-4 Wochen möglich.';
  } else {
    bewertung = 'Hervorragend! Sie sind fast fertig. Die Zertifizierung ist in 2-3 Wochen möglich.';
  }
  
  // HTML-E-Mail - NUR ERGEBNIS
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
            <div class="section-title">📊 Detaillierte Bewertung nach Bereichen</div>
            ${CONFIG.sectionNames.map((name, i) => {
              const score = data.sections[i] || 0;
              const color = score >= 70 ? '#059669' : score >= 40 ? '#F59E0B' : '#DC2626';
              return `<p><strong>${name}:</strong> <span style="color: ${color}; font-weight: bold;">${score}%</span></p>`;
            }).join('')}
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <p style="font-size: 18px; margin-bottom: 20px;"><strong>Interesse an einem Beratungsgespräch?</strong></p>
            <a href="${CONFIG.calendlyUrl}" class="btn">Kostenloses Erstgespräch buchen (30 Min)</a>
          </div>
          
          <div class="section">
            <div class="section-title">🎯 Ihre nächsten Schritte</div>
            <ol style="line-height: 2;">
              <li>Kostenloses Beratungsgespräch buchen (optional)</li>
              <li>Lücken mit Templates schließen</li>
              <li>Internes Audit durchführen</li>
              <li>Pre-Audit (optional)</li>
              <li>Zertifizierungsaudit</li>
            </ol>
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

Interesse an einem Beratungsgespräch?
${CONFIG.calendlyUrl}

Beste Grüße,
Holger Grosser
QM-Guru.de
  `;
  
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

👤 KONTAKT
E-Mail: ${data.email}
Firma: ${data.company}
Mitarbeiter: ${data.employees}

📈 SEKTIONEN
${CONFIG.sectionNames.map((name, i) => `${name}: ${data.sections[i]}%`).join('\n')}

⏰ Zeitstempel: ${data.timestamp}

---
Action: Lead im Sheet prüfen!
Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  GmailApp.sendEmail(
    CONFIG.adminEmail,
    subject,
    body
  );
  
  Logger.log('✅ Admin benachrichtigt');
}

// ============================================
// HELPER
// ============================================

function createResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TEST-FUNKTIONEN
// ============================================

function testCreateHeaders() {
  Logger.log('🧪 Test: Header erstellen...');
  ensureSheetSetup();
  Logger.log('✅ Prüfe das Sheet!');
}

function testDoPost() {
  Logger.log('🧪 Test: Workflow...');
  
  const testData = {
    parameter: {
      email: 'test@example.com',
      company: 'Test GmbH',
      employees: '11-50',
      score: '67',
      category: 'Fortgeschritten',
      timeline: '4-6 Wochen',
      sections: '[75, 60, 50, 65, 70, 55]',
      answers: '{}'
    }
  };
  
  const result = doPost(testData);
  Logger.log('📋 Result: ' + result.getContent());
  Logger.log('✅ Prüfe Sheet & E-Mails!');
}

function testEmailOnly() {
  Logger.log('🧪 Test: E-Mail...');
  
  const testData = {
    email: CONFIG.adminEmail,
    company: 'Test GmbH',
    employees: '11-50',
    score: 67,
    category: 'Fortgeschritten',
    timeline: '4-6 Wochen',
    sections: [75, 60, 50, 65, 70, 55]
  };
  
  sendEmailToLead(testData);
  Logger.log('✅ Test-E-Mail gesendet');
}
