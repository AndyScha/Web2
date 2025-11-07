import jwt from "jsonwebtoken";
import { IUser } from "./UserModel";

// Secret Key für JWT (in Produktion aus Umgebungsvariable)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Erstellt einen JWT-Token mit User-Daten
export function createToken(user: IUser): string {
  const payload = {
    userID: user.userID,
    isAdministrator: user.isAdministrator,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

// Validiert einen JWT-Token und gibt den Payload zurück
export function verifyToken(
  token: string
): {
  userID: string;
  isAdministrator?: boolean;
  firstName?: string;
  lastName?: string;
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userID: decoded.userID,
      isAdministrator: decoded.isAdministrator,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    return null;
  }
}

// Extrahiert Token aus Authorization Header
export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) {
    return null;
  }

  // Unterstützt sowohl "Bearer <token>" als auch "Basic <token>" für Rückwärtskompatibilität
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Falls Basic Auth als Token verwendet wird (für Übergangszeit)
  if (authHeader.startsWith("Basic ")) {
    // Versuche als JWT zu dekodieren
    const token = authHeader.substring(6);
    // Wenn es Base64 ist, versuche es als JWT zu verwenden
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      // Wenn es wie userID:password aussieht, ist es kein JWT
      if (decoded.includes(":")) {
        return null;
      }
      return token;
    } catch {
      return token;
    }
  }

  return null;
}
