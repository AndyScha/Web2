import express, { Request, Response } from "express";
import * as AuthService from "./AuthService";
import * as TokenService from "./TokenService";
import { IUser } from "./UserModel";

const router = express.Router();

// GET /api/authenticate - Authentifiziert einen User mit Basic Authentication
router.get("/", function (req: Request, res: Response): void {
  // Prüfe ob Authorization Header vorhanden ist
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.status(401).setHeader("WWW-Authenticate", "Basic");
    res.json({ Error: "Authentication required" });
    return;
  }

  // Extrahiere Base64-kodierte Credentials
  const base64Credentials = authHeader.split(" ")[1];

  if (!base64Credentials) {
    res.status(401).setHeader("WWW-Authenticate", "Basic");
    res.json({ Error: "Authentication required" });
    return;
  }

  try {
    // Dekodiere Base64 zu userID:password
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );
    const [userID, password] = credentials.split(":");

    if (!userID || !password) {
      res.status(401).setHeader("WWW-Authenticate", "Basic");
      res.json({ Error: "Authentication failed" });
      return;
    }

    // Authentifiziere User
    AuthService.authenticateUser(
      userID,
      password,
      function (err: Error | { Error: string } | null, user?: IUser | null) {
        if (err || !user) {
          res.status(401).setHeader("WWW-Authenticate", "Basic");
          res.json({ Error: "Authentication failed" });
          return;
        }

        // Authentifizierung erfolgreich
        // Erstelle JWT-Token mit User-Daten
        const jwtToken = TokenService.createToken(user);
        // Setze Authorization Header in der Antwort mit Bearer Token
        res.setHeader("Authorization", `Bearer ${jwtToken}`);
        res.status(200).json(user);
      }
    );
  } catch (error) {
    res.status(401).setHeader("WWW-Authenticate", "Basic");
    res.json({ Error: "Authentication failed" });
    return;
  }
});

export default router;
