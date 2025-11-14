import * as database from "./database/db";
import { createServer } from "./app";
import * as UserService from "./endpoints/user/UserService";
import https from "https";
import fs from "fs";
import path from "path";

const app = createServer();

// Verbinde zur MongoDB Datenbank
database.initDB(function (err: Error | null, db?: any): void {
  if (err) {
    console.log(err);
  }
  if (db) {
    console.log("Anbindung erfolgreich");

    // Erstelle Standard-Administrator, falls dieser noch nicht existiert
    UserService.createDefaultAdmin(function (err: Error | null): void {
      if (err) {
        console.log("Fehler beim Anlegen des Standard-Administrators:", err);
      }
    });
  } else {
    console.log("Anbindung von DB gescheitert");
  }
});

// SSL-Zertifikat laden
const options = {
  key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")),
};

// Server auf Port 443 starten (HTTPS)
const port = 443;
https.createServer(options, app).listen(port, () => {
  console.log(`Server listening on port https://localhost:${port}`);
});
