#!/bin/bash

# ISO 9001 Kompass - Quick Start Setup Script
# Führt die wichtigsten Setup-Schritte aus

echo "🧭 ISO 9001 Kompass - Setup"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git ist nicht installiert. Bitte installieren: https://git-scm.com/"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installieren: https://nodejs.org/"
    exit 1
fi

echo "✅ Git und Node.js gefunden"
echo ""

# Install dependencies
echo "📦 Installiere Dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installiert"
else
    echo "❌ Fehler beim Installieren der Dependencies"
    exit 1
fi

echo ""
echo "🚀 Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Google Apps Script einrichten (siehe README.md → Schritt 1)"
echo "2. Google Script URL in src/App.jsx eintragen"
echo "3. Lokal testen: npm run dev"
echo "4. Auf GitHub pushen: git push"
echo "5. Auf Netlify deployen"
echo ""
echo "Viel Erfolg! 🎉"
