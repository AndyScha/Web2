import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("strictQuery", false);

let _db: Connection | undefined;

// Connection String aus Umgebungsvariable lesen
const connectionString = `mongodb://${process.env.DB_HOST}/TestDB`;

// Initialisiert die Datenbankverbindung
export function initDB(
  callback: (err: Error | null, db?: Connection) => void
): void {
  // Wenn schon verbunden, gib die bestehende Verbindung zurück
  if (_db) {
    if (callback) {
      return callback(null, _db);
    } else {
      return;
    }
  } else {
    // Neue Verbindung aufbauen
    mongoose.connect(connectionString);
    _db = mongoose.connection;

    _db.on("error", console.error.bind(console, "connection error:"));
    _db.once("open", function () {
      console.log(
        "Connected to database " + connectionString + " in DB.ts " + _db
      );
      callback(null, _db);
    });
  }
}

export function close(): Connection | undefined {
  return _db;
}
