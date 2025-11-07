import * as database from "./database/db";
import { createServer } from "./app";
import * as UserService from "./endpoints/user/UserService";

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

// Server auf Port 80 starten
const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
