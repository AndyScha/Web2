# Web2 - Studierendenbewerberportal

REST-Server für das Studierendenbewerberportal (Übung 1, Meilenstein 1, Web-Engineering II, BHT Berlin). Implementiert mit TypeScript, Express und MongoDB.

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

- Backend API: http://localhost:3000
- MongoDB Express (Web UI): http://localhost:8081
- MongoDB: localhost:27017

### API Endpoints

- `GET /` - API Info
- `GET /health` - Health Check
- `GET /api/students` - Alle Studenten abrufen
- `GET /api/students/:id` - Einzelnen Student abrufen
- `POST /api/students` - Neuen Student erstellen
- `PUT /api/students/:id` - Student aktualisieren
- `DELETE /api/students/:id` - Student löschen

### Beispiel API-Aufruf

```bash
# Neuen Student erstellen
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "max.mustermann@example.com",
    "studentId": "123456",
    "course": "Informatik",
    "semester": 3
  }'
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
├── routes/          # API Routes
├── types/           # TypeScript Type Definitions
└── index.ts         # Hauptanwendung
```

## 🔧 Konfiguration

Die Anwendung verwendet folgende Umgebungsvariablen:

- `PORT` - Server Port (Standard: 3000)
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
