// ISO 9001 Kompass - Fragenkatalog (25 Fragen)

export const sections = [
  {
    id: 1,
    name: "Kontext der Organisation",
    weight: 0.12,
    questions: [1, 2, 3, 4]
  },
  {
    id: 2,
    name: "Führung",
    weight: 0.18,
    questions: [5, 6, 7, 8]
  },
  {
    id: 3,
    name: "Planung",
    weight: 0.12,
    questions: [9, 10, 11, 12]
  },
  {
    id: 4,
    name: "Unterstützung",
    weight: 0.18,
    questions: [13, 14, 15, 16, 17]
  },
  {
    id: 5,
    name: "Betrieb",
    weight: 0.18,
    questions: [18, 19, 20, 21]
  },
  {
    id: 6,
    name: "Bewertung & Verbesserung",
    weight: 0.22,
    questions: [22, 23, 24, 25]
  }
];

export const questions = [
  // SEKTION 1: Kontext (4 Fragen)
  {
    id: 1,
    section: 1,
    text: "Haben Sie die relevanten interessierten Parteien (Stakeholder) Ihres Unternehmens identifiziert und dokumentiert?",
    options: [
      { value: 100, label: "Ja, wir haben eine vollständige Stakeholder-Analyse (Kunden, Lieferanten, Behörden, Mitarbeiter etc.)" },
      { value: 50, label: "Teilweise – wir kennen die wichtigsten Stakeholder, aber nicht dokumentiert" },
      { value: 0, label: "Nein, das haben wir noch nicht gemacht" },
      { value: 0, label: "Ich bin mir nicht sicher, was das bedeutet" }
    ]
  },
  {
    id: 2,
    section: 1,
    text: "Kennen Sie die externen und internen Themen, die für Ihr QMS relevant sind (z.B. Markttrends, gesetzliche Anforderungen, Unternehmenskultur)?",
    options: [
      { value: 100, label: "Ja, wir haben externe und interne Einflussfaktoren analysiert und dokumentiert" },
      { value: 50, label: "Teilweise – wir haben darüber nachgedacht, aber nicht systematisch erfasst" },
      { value: 0, label: "Nein, das ist uns noch nicht bewusst" },
      { value: 0, label: "Ich weiß nicht genau, was gemeint ist" }
    ]
  },
  {
    id: 3,
    section: 1,
    text: "Haben Sie den Anwendungsbereich Ihres Qualitätsmanagementsystems definiert (welche Prozesse, Standorte, Produkte/Dienstleistungen)?",
    options: [
      { value: 100, label: "Ja, der Anwendungsbereich ist klar definiert und dokumentiert" },
      { value: 50, label: "Teilweise – wir wissen ungefähr, was dazugehört, aber es ist nicht offiziell festgelegt" },
      { value: 0, label: "Nein, wir haben das noch nicht gemacht" },
      { value: 0, label: "Was bedeutet Anwendungsbereich?" }
    ]
  },
  {
    id: 4,
    section: 1,
    text: "Haben Sie die Hauptprozesse Ihres Unternehmens identifiziert und deren Zusammenspiel dokumentiert?",
    options: [
      { value: 100, label: "Ja, wir haben eine Prozesslandkarte mit allen wichtigen Abläufen" },
      { value: 50, label: "Teilweise – einige Prozesse sind beschrieben, aber nicht alle" },
      { value: 0, label: "Nein, wir haben keine Prozessübersicht" },
      { value: 0, label: "Ich bin mir nicht sicher" }
    ]
  },

  // SEKTION 2: Führung (4 Fragen)
  {
    id: 5,
    section: 2,
    text: "Gibt es in Ihrem Unternehmen eine dokumentierte Qualitätspolitik, die von der Geschäftsführung verabschiedet wurde?",
    options: [
      { value: 100, label: "Ja, wir haben eine Qualitätspolitik, die allen Mitarbeitern bekannt ist" },
      { value: 50, label: "Ja, aber sie ist nicht allen bekannt oder nicht schriftlich festgehalten" },
      { value: 0, label: "Nein, wir haben keine Qualitätspolitik" },
      { value: 0, label: "Was ist eine Qualitätspolitik?" }
    ]
  },
  {
    id: 6,
    section: 2,
    text: "Sind die Rollen, Verantwortlichkeiten und Befugnisse im QMS klar definiert und kommuniziert?",
    options: [
      { value: 100, label: "Ja, jeder weiß, wer für was zuständig ist (z.B. QMB, Prozessverantwortliche)" },
      { value: 50, label: "Teilweise – manche Rollen sind klar, andere nicht" },
      { value: 0, label: "Nein, das ist nicht definiert" },
      { value: 0, label: "Ich bin mir nicht sicher" }
    ]
  },
  {
    id: 7,
    section: 2,
    text: "Stellt die Geschäftsführung sicher, dass Kundenbedürfnisse und -erwartungen verstanden und erfüllt werden?",
    options: [
      { value: 100, label: "Ja, wir erfassen systematisch Kundenfeedback und richten uns danach" },
      { value: 50, label: "Teilweise – wir hören auf Kunden, aber nicht systematisch" },
      { value: 0, label: "Nein, das passiert eher zufällig" },
      { value: 0, label: "Ich weiß nicht" }
    ]
  },
  {
    id: 8,
    section: 2,
    text: "Zeigt die Geschäftsführung aktiv Engagement für das QMS (z.B. durch Bereitstellung von Ressourcen, Teilnahme an Reviews)?",
    options: [
      { value: 100, label: "Ja, die Leitung ist voll engagiert und stellt Ressourcen bereit" },
      { value: 50, label: "Teilweise – Interesse ist da, aber nicht konsequent" },
      { value: 0, label: "Nein, QM wird eher als Pflichtprogramm gesehen" },
      { value: 0, label: "Ich kann das nicht beurteilen" }
    ]
  },

  // SEKTION 3: Planung (4 Fragen)
  {
    id: 9,
    section: 3,
    text: "Haben Sie messbare Qualitätsziele definiert (z.B. Reklamationsquote, Liefertreue, Kundenzufriedenheit)?",
    options: [
      { value: 100, label: "Ja, wir haben klare, messbare Qualitätsziele" },
      { value: 50, label: "Teilweise – wir haben Ziele, aber nicht messbar" },
      { value: 0, label: "Nein, wir haben keine definierten Qualitätsziele" },
      { value: 0, label: "Was sind Qualitätsziele?" }
    ]
  },
  {
    id: 10,
    section: 3,
    text: "Bewerten Sie systematisch Risiken und Chancen für Ihr QMS?",
    options: [
      { value: 100, label: "Ja, wir führen regelmäßig Risikobewertungen durch" },
      { value: 50, label: "Teilweise – wir denken darüber nach, aber nicht systematisch" },
      { value: 0, label: "Nein, das machen wir nicht" },
      { value: 0, label: "Ich bin mir nicht sicher, was gemeint ist" }
    ]
  },
  {
    id: 11,
    section: 3,
    text: "Haben Sie ein Verfahren, wie Änderungen im QMS geplant und umgesetzt werden?",
    options: [
      { value: 100, label: "Ja, Änderungen werden geplant, dokumentiert und kontrolliert" },
      { value: 50, label: "Teilweise – Änderungen passieren, aber nicht systematisch" },
      { value: 0, label: "Nein, das ist nicht geregelt" },
      { value: 0, label: "Was bedeutet Änderungsmanagement?" }
    ]
  },
  {
    id: 12,
    section: 3,
    text: "Planen Sie konkrete Maßnahmen zur Erreichung Ihrer Qualitätsziele?",
    options: [
      { value: 100, label: "Ja, wir haben Aktionspläne mit Verantwortlichen und Terminen" },
      { value: 50, label: "Teilweise – wir besprechen Maßnahmen, aber nicht formell geplant" },
      { value: 0, label: "Nein, das fehlt noch" },
      { value: 0, label: "Ich weiß nicht" }
    ]
  },

  // SEKTION 4: Unterstützung (5 Fragen)
  {
    id: 13,
    section: 4,
    text: "Sind Ihre wichtigsten Prozesse und Verfahren dokumentiert?",
    options: [
      { value: 100, label: "Ja, wir haben ein QM-Handbuch und/oder Verfahrensanweisungen" },
      { value: 50, label: "Teilweise – einige Abläufe sind beschrieben, viele noch nicht" },
      { value: 0, label: "Nein, wir haben kaum Dokumentation" },
      { value: 0, label: "Ich bin mir nicht sicher" }
    ]
  },
  {
    id: 14,
    section: 4,
    text: "Werden Mitarbeiter regelmäßig geschult und sind Schulungsnachweise vorhanden?",
    options: [
      { value: 100, label: "Ja, wir haben Schulungspläne und dokumentieren alle Schulungen" },
      { value: 50, label: "Teilweise – Schulungen finden statt, aber nicht systematisch dokumentiert" },
      { value: 0, label: "Nein, Schulungen sind nicht geregelt" },
      { value: 0, label: "Ich weiß nicht" }
    ]
  },
  {
    id: 15,
    section: 4,
    text: "Sind die notwendigen Ressourcen (Personal, Räume, Ausrüstung) für das QMS vorhanden?",
    options: [
      { value: 100, label: "Ja, wir haben alles, was wir brauchen" },
      { value: 50, label: "Teilweise – es fehlt hier und da etwas" },
      { value: 0, label: "Nein, wir haben erhebliche Ressourcenengpässe" },
      { value: 0, label: "Ich kann das nicht beurteilen" }
    ]
  },
  {
    id: 16,
    section: 4,
    text: "Gibt es geregelte interne und externe Kommunikationswege (z.B. Meetings, E-Mail-Verteiler, Kundenkommunikation)?",
    options: [
      { value: 100, label: "Ja, Kommunikation ist klar geregelt" },
      { value: 50, label: "Teilweise – manche Wege sind etabliert, andere nicht" },
      { value: 0, label: "Nein, Kommunikation läuft eher zufällig" },
      { value: 0, label: "Ich weiß nicht" }
    ]
  },
  {
    id: 17,
    section: 4,
    text: "Haben Sie ein System zur Lenkung von Dokumenten (Versionskontrolle, Freigabe, Archivierung)?",
    options: [
      { value: 100, label: "Ja, wir haben ein Dokumentenmanagementsystem (DMS) oder klare Regeln" },
      { value: 50, label: "Teilweise – manche Dokumente sind gelenkt, andere nicht" },
      { value: 0, label: "Nein, Dokumente liegen wild verstreut" },
      { value: 0, label: "Was bedeutet Dokumentenlenkung?" }
    ]
  },

  // SEKTION 5: Betrieb (4 Fragen)
  {
    id: 18,
    section: 5,
    text: "Bewerten Sie Ihre Lieferanten systematisch (z.B. nach Qualität, Liefertreue, Preis)?",
    options: [
      { value: 100, label: "Ja, wir haben ein Lieferantenbewertungssystem mit Kriterien und regelmäßiger Bewertung" },
      { value: 50, label: "Teilweise – wir bewerten gelegentlich, aber nicht systematisch" },
      { value: 0, label: "Nein, wir bewerten Lieferanten nicht" },
      { value: 0, label: "Ich bin mir nicht sicher" }
    ]
  },
  {
    id: 19,
    section: 5,
    text: "Haben Sie einen klaren Prozess für die Auftragsabwicklung (von der Anfrage bis zur Rechnung)?",
    options: [
      { value: 100, label: "Ja, der Prozess ist dokumentiert und wird konsequent umgesetzt" },
      { value: 50, label: "Teilweise – der Ablauf ist bekannt, aber nicht dokumentiert" },
      { value: 0, label: "Nein, jeder macht es anders" },
      { value: 0, label: "Was gehört zur Auftragsabwicklung?" }
    ]
  },
  {
    id: 20,
    section: 5,
    text: "Überwachen Sie Prüfmittel und Messmittel (falls zutreffend für Ihre Branche)?",
    options: [
      { value: 100, label: "Ja, wir haben ein System zur Prüfmittelüberwachung (Kalibrierung, Wartung)" },
      { value: 50, label: "Teilweise – manche Prüfmittel werden überwacht" },
      { value: 0, label: "Nein, wir überwachen Prüfmittel nicht" },
      { value: 0, label: "Nicht zutreffend / Wir haben keine Prüfmittel" }
    ]
  },
  {
    id: 21,
    section: 5,
    text: "Haben Sie Verfahren zur Produktfreigabe und Kennzeichnung?",
    options: [
      { value: 100, label: "Ja, Produkte/Dienstleistungen werden systematisch freigegeben und gekennzeichnet" },
      { value: 50, label: "Teilweise – es gibt Regeln, aber nicht konsequent umgesetzt" },
      { value: 0, label: "Nein, das ist nicht geregelt" },
      { value: 0, label: "Nicht zutreffend für unsere Branche" }
    ]
  },

  // SEKTION 6: Bewertung & Verbesserung (4 Fragen)
  {
    id: 22,
    section: 6,
    text: "Erfassen Sie systematisch die Zufriedenheit Ihrer Kunden (z.B. durch Umfragen, Bewertungen, Feedback)?",
    options: [
      { value: 100, label: "Ja, wir führen regelmäßig Kundenzufriedenheitsanalysen durch" },
      { value: 50, label: "Teilweise – wir sammeln Feedback, aber nicht systematisch" },
      { value: 0, label: "Nein, wir erfassen Kundenzufriedenheit nicht" },
      { value: 0, label: "Wie macht man das?" }
    ]
  },
  {
    id: 23,
    section: 6,
    text: "Führen Sie regelmäßig interne Audits durch, um Ihr QMS zu überprüfen?",
    options: [
      { value: 100, label: "Ja, wir haben einen Auditplan und führen Audits durch" },
      { value: 50, label: "Teilweise – wir machen gelegentlich interne Checks" },
      { value: 0, label: "Nein, wir führen keine internen Audits durch" },
      { value: 0, label: "Was sind interne Audits?" }
    ]
  },
  {
    id: 24,
    section: 6,
    text: "Führt die Geschäftsführung regelmäßig Reviews des QMS durch (z.B. jährliche Managementbewertung)?",
    options: [
      { value: 100, label: "Ja, mindestens einmal jährlich" },
      { value: 50, label: "Teilweise – sporadische Besprechungen, aber kein formelles Review" },
      { value: 0, label: "Nein, das machen wir nicht" },
      { value: 0, label: "Was ist eine Managementbewertung?" }
    ]
  },
  {
    id: 25,
    section: 6,
    text: "Verfolgen Sie systematisch, ob vereinbarte Maßnahmen umgesetzt werden (z.B. Maßnahmenplan mit Status)?",
    options: [
      { value: 100, label: "Ja, wir haben einen Maßnahmenplan mit Verantwortlichen, Terminen und Status-Updates" },
      { value: 50, label: "Teilweise – Maßnahmen werden definiert, aber nicht konsequent verfolgt" },
      { value: 0, label: "Nein, Maßnahmen versanden oft" },
      { value: 0, label: "Was ist ein Maßnahmenplan?" }
    ]
  }
];

// Bewertungs-Logik
export function calculateMaturity(answers) {
  const sectionScores = sections.map(section => {
    const sectionQuestions = questions.filter(q => q.id in answers && q.section === section.id);
    if (sectionQuestions.length === 0) return 0;
    
    const total = sectionQuestions.reduce((sum, q) => {
      const selectedIndex = answers[q.id];
      const optionValue = q.options?.[selectedIndex]?.value ?? 0;
      return sum + optionValue;
    }, 0);
    return total / sectionQuestions.length;
  });

  const totalScore = sectionScores.reduce((sum, score, index) => {
    return sum + (score * sections[index].weight);
  }, 0);

  return {
    total: Math.round(totalScore),
    sections: sectionScores.map(score => Math.round(score)),
    category: getCategory(totalScore),
    timeline: getTimeline(totalScore),
    package: getPackage(totalScore),
    price: getPrice(totalScore)
  };
}

function getCategory(score) {
  if (score >= 86) return "Exzellent";
  if (score >= 71) return "Sehr gut";
  if (score >= 51) return "Fortgeschritten";
  if (score >= 31) return "Ausbaufähig";
  return "Kritisch";
}

function getTimeline(score) {
  if (score >= 86) return "2-3 Wochen";
  if (score >= 71) return "3-4 Wochen";
  if (score >= 51) return "4-6 Wochen";
  if (score >= 31) return "6-8 Wochen";
  return "8-12 Wochen";
}

function getPackage(score) {
  if (score >= 86) return "EXPRESS";
  if (score >= 71) return "STARTER";
  if (score >= 51) return "STANDARD";
  if (score >= 31) return "PROFESSIONAL";
  return "COMPLETE";
}

function getPrice(score) {
  if (score >= 86) return "800 EUR";
  if (score >= 71) return "1.200 EUR";
  if (score >= 51) return "1.800 EUR";
  if (score >= 31) return "2.500 EUR";
  return "3.500 EUR";
}
