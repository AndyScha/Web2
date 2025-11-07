import * as database from "./database/db";
import { createServer } from "./app";

const app = createServer();

// Verbinde zur MongoDB Datenbank
database.initDB(function (err: Error | null, db?: any): void {
  if (err) {
    console.log(err);
  }
  if (db) {
    console.log("Anbindung erfolgreich");
  } else {
    console.log("Anbindung von DB gescheitert");
  }
});

// Server auf Port 80 starten
const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
