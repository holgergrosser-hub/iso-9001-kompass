import { useState } from 'react'
import { questions, sections, calculateMaturity } from './questions'

// KONFIGURATION
// Lokal: .env Datei mit VITE_GOOGLE_SCRIPT_URL=...
// Netlify: Site settings → Environment variables → VITE_GOOGLE_SCRIPT_URL
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentSection = sections.find(s => s.id === currentQ.section);

  const handleAnswer = (optionIndex) => {
    console.log('handleAnswer called with optionIndex:', optionIndex, 'for question:', currentQ.id);
    console.log('Current answers before update:', answers);
    const newAnswers = { ...answers, [currentQ.id]: optionIndex };
    console.log('New answers after update:', newAnswers);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubmitError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (!GOOGLE_SCRIPT_URL) {
        setSubmitError('Konfiguration fehlt: Bitte VITE_GOOGLE_SCRIPT_URL setzen.');
        return;
      }

      const result = calculateMaturity(answers);
      
      // FormData verwenden (KEIN Content-Type Header!)
      const formData = new FormData();
      formData.append('email', email);
      formData.append('company', company || 'Nicht angegeben');
      formData.append('employees', employees || 'Nicht angegeben');
      formData.append('score', result.total);
      formData.append('category', result.category);
      formData.append('timeline', result.timeline);
      formData.append('sections', JSON.stringify(result.sections));
      formData.append('answers', JSON.stringify(answers));

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      // Bei no-cors können wir Response nicht lesen, also Erfolg annehmen
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('Fehler beim Senden:', error);
      setSubmitError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const result = calculateMaturity(answers);
    
    return (
      <div className="container">
        <div className="result-hero">
          <h2>&#x1F9ED; Ihr ISO 9001 Kompass-Ergebnis</h2>
          <div className="result-score">{result.total}%</div>
          <div className="score-meter">
            <div className="score-meter-fill" style={{ width: `${result.total}%` }}></div>
          </div>
          <div className="result-category">{result.category}</div>
          <div className="result-timeline">&#x23F1; Timeline zur Zertifizierung: {result.timeline}</div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#2E5C8A' }}>Detaillierte Bewertung</h3>
          <div className="sections-grid">
            {sections.map((section, index) => {
              const score = result.sections[index];
              const status = score >= 70 ? 'good' : score >= 40 ? 'warning' : 'critical';
              
              return (
                <div key={section.id} className={`section-result ${status}`}>
                  <div className="section-name">{section.name}</div>
                  <div className={`section-score ${status}`}>{score}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="recommendations">
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#2E5C8A' }}>Ihre nächsten Schritte</h3>
            
            <div className="recommendation-card">
              <div className="recommendation-title">
                <span>🎯</span>
                <span>Empfehlung für Sie</span>
              </div>
              <p className="recommendation-text">
                {result.total < 30 && "Ihr Unternehmen steht am Anfang der ISO 9001 Reise. Mit den richtigen Templates und Unterstützung können Sie in 8-12 Wochen zertifizierbar sein."}
                {result.total >= 30 && result.total < 50 && "Sie haben bereits eine Grundlage. Mit gezieltem Coaching schließen Sie die Lücken in 6-8 Wochen."}
                {result.total >= 50 && result.total < 70 && "Sehr gut! Die Basis steht. Jetzt geht es um Feinschliff. Zertifizierung in 4-6 Wochen realistisch."}
                {result.total >= 70 && result.total < 86 && "Exzellent! Sie sind auf einem sehr guten Weg. Mit einem Pre-Audit finden Sie die letzten Schwachstellen."}
                {result.total >= 86 && "Hervorragend! Sie sind fast fertig. Die Zertifizierung ist in 2-3 Wochen möglich."}
              </p>
            </div>
          </div>
        </div>

        <div className="email-form">
          <h3 style={{ marginBottom: '1rem', color: '#2E5C8A' }}>Detaillierten Report per E-Mail erhalten</h3>
          
          {submitSuccess ? (
            <div className="success-message">
              ✅ Vielen Dank! Ihr detaillierter Report wurde an {email} gesendet.
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Prüfen Sie auch Ihren Spam-Ordner, falls die E-Mail nicht ankommt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitEmail}>
              <div className="form-group">
                <label className="form-label">E-Mail-Adresse *</label>
                <input
                  type="email"
                  className={`form-input ${submitError && !email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@firma.de"
                  required
                />
                {submitError && <div className="error-message">{submitError}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Firmenname (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ihre Firma GmbH"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mitarbeiteranzahl (optional)</label>
                <select 
                  className="form-input"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="100+">100+</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  'PDF-Report jetzt anfordern'
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#4B5563' }}>Oder direkt Termin buchen:</p>
            <a 
              href="https://calendly.com/holger-grosser/erstgespraech"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-large"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              Kostenloses Erstgespräch (30 Min)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero">
        <h1>&#x1F9ED; ISO 9001 Kompass</h1>
        <p className="hero-subtitle">
          Finden Sie in 12 Minuten heraus, wie weit Sie von der ISO 9001 Zertifizierung entfernt sind
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span>&#x2713;</span>
            <span>30 Jahre Erfahrung</span>
          </div>
          <div className="stat">
            <span>&#x2713;</span>
            <span>1.000+ erfolgreiche Audits</span>
          </div>
          <div className="stat">
            <span>&#x2713;</span>
            <span>100% kostenlos</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-text">
              Frage {currentQuestion + 1} von {questions.length}
            </span>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="question-section">
          <div className="section-badge">
            {currentSection.name}
          </div>
          
          <h2 className="question-title">{currentQ.text}</h2>

          <div className="options">
            {currentQ.options.map((option, index) => {
              const uniqueKey = `q${currentQ.id}-opt${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`option ${answers[currentQ.id] === index ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Clicked option index:', index, 'for question:', currentQ.id);
                    handleAnswer(index);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    tabIndex={-1}
                  />
                  <span className="option-label">{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="button-group">
          {currentQuestion > 0 && (
            <button 
              onClick={handlePrevious}
              className="btn btn-secondary"
            >
              ← Zurück
            </button>
          )}
          
          <button 
            onClick={handleNext}
            className="btn btn-primary"
            disabled={!(currentQ.id in answers)}
            style={{ marginLeft: 'auto' }}
          >
            {currentQuestion === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
