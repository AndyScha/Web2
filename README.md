# Web2 - Studierendenbewerberportal

REST-Server für das Studierendenbewerberportal (Übung 1, Meilenstein 1, Web-Engineering II, BHT Berlin). Implementiert mit TypeScript, Express und MongoDB.

## Meilenstein 1 - Public Users Endpoint

Dieser Meilenstein implementiert den `/publicUsers` Endpoint für die Verwaltung von User-Daten ohne Authentifizierung.

## 🚀 Schnellstart mit Docker

### Voraussetzungen

- Docker und Docker Compose installiert
- Git installiert

### Installation und Start

1. **Repository klonen:**

```bash
git clone https://github.com/AndyScha/Web2.git
cd Web2
```

2. **Umgebungsvariablen konfigurieren:**

```bash
cp env.example .env
# Bearbeite .env nach Bedarf
```

3. **Mit Docker Compose starten:**

```bash
docker-compose up -d
```

4. **Services überprüfen:**

- Backend API: http://localhost:80
- MongoDB Express (Web UI): http://localhost:8081
- MongoDB: localhost:27017

### API Endpoints

- `GET /` - API Info
- `GET /health` - Health Check
- `GET /publicUsers` - Alle User abrufen
- `GET /publicUsers/:userID` - User per userID abrufen
- `POST /publicUsers` - Neuen User erstellen
- `PUT /publicUsers/:userID` - User aktualisieren
- `DELETE /publicUsers/:userID` - User löschen

### Beispiel API-Aufruf

```bash
# Neuen User erstellen
curl -X POST http://localhost:80/publicUsers \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "max.mustermann",
    "password": "geheim123",
    "firstName": "Max",
    "lastName": "Mustermann",
    "isAdministrator": false
  }'

# User per userID abrufen
curl http://localhost:80/publicUsers/max.mustermann

# Alle User abrufen
curl http://localhost:80/publicUsers
```

## 🛠️ Lokale Entwicklung

### Ohne Docker

1. **Dependencies installieren:**

```bash
npm install
```

2. **MongoDB starten** (lokal oder mit Docker):

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

3. **Development Server starten:**

```bash
npm run dev
```

### Nützliche Befehle

```bash
# Build
npm run build

# Production starten
npm start

# Tests ausführen
npm test
```

## 📁 Projektstruktur

```
src/
├── config/          # Konfigurationsdateien
├── controllers/     # Controller für API-Endpoints
├── middleware/      # Express Middleware
├── models/          # Mongoose Models
│   └── User.ts      # User Model mit bcryptjs Hashing
├── routes/          # API Routes
│   └── publicUsers.ts # /publicUsers Endpoint
├── types/           # TypeScript Type Definitions
└── index.ts         # Hauptanwendung
```

## 📋 User Model

Das User-Model enthält folgende Attribute (exakt wie in der Aufgabenstellung):

- `userID` (string, required, unique) - Eindeutige User-ID
- `password` (string, required) - Passwort (wird mit bcryptjs gehashed)
- `firstName` (string, required) - Vorname
- `lastName` (string, required) - Nachname
- `isAdministrator` (boolean, default: false) - Administrator-Status

**Wichtige Hinweise:**

- Passwörter werden automatisch mit bcryptjs gehashed
- Alle Attribute werden in API-Responses zurückgegeben (inkl. gehashtes Passwort)
- Suche erfolgt über `userID`, nicht über MongoDB ObjectId

## 🔧 Konfiguration

Die Anwendung verwendet folgende Umgebungsvariablen:

- `PORT` - Server Port (Standard: 80)
- `MONGODB_URI` - MongoDB Verbindungsstring
- `JWT_SECRET` - Secret für JWT Tokens
- `NODE_ENV` - Umgebung (development/production)

## 📊 MongoDB Express

Zugriff auf die MongoDB Web UI:

- URL: http://localhost:8081
- Username: admin
- Password: admin123

## 🐳 Docker Services

- **backend**: Node.js/Express API Server
- **mongodb**: MongoDB Datenbank
- **mongo-express**: Web UI für MongoDB
