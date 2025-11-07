import { Request, Response, NextFunction } from "express";
import * as TokenService from "./TokenService";
import * as UserService from "./UserService";
import { IUser } from "./UserModel";

/**
 * Erweitert das Express Request-Interface um eine optionale User-Eigenschaft.
 * Nach der Token-Validierung wird der authentifizierte User hier gespeichert,
 * sodass alle nachfolgenden Handler darauf zugreifen können.
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Middleware zum Validieren von JWT-Tokens.
 *
 * Extrahiert den Token aus dem Authorization-Header, validiert ihn,
 * holt den User aus der Datenbank und speichert ihn in req.user.
 *
 * Verwendung: router.get('/route', authenticateToken, handler)
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Extrahiere Token aus Authorization-Header
  const authHeader = req.headers.authorization;
  const token = TokenService.extractTokenFromHeader(authHeader);

  // Prüfe ob Token vorhanden ist
  if (!token) {
    // Wenn ein Authorization-Header vorhanden ist, aber kein Token extrahiert werden konnte,
    // könnte es ein Basic Auth Token sein, der nicht als JWT verwendet werden kann
    if (authHeader && authHeader.startsWith("Basic ")) {
      res.status(401).json({ Error: "Invalid token format. Please authenticate again to get a Bearer token." });
    } else {
      res.status(401).json({ Error: "Authentication required" });
    }
    return;
  }

  // Validiere Token und dekodiere Payload
  const payload = TokenService.verifyToken(token);

  // Prüfe ob Token gültig ist und userID enthält
  if (!payload || !payload.userID) {
    res.status(401).json({ Error: "Invalid token" });
    return;
  }

  // Hole User aus Datenbank anhand der userID aus dem Token-Payload
  UserService.findUserBy(
    payload.userID,
    function (
      err: Error | { Error: string } | null,
      user?: IUser | IUser[] | null
    ) {
      // Prüfe ob User gefunden wurde
      if (err || !user || Array.isArray(user)) {
        res.status(401).json({ Error: "User not found" });
        return;
      }

      // Entferne Passwort aus User-Objekt (sollte nie an Client gesendet werden)
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      // Speichere User im Request-Objekt für nachfolgende Handler
      req.user = userWithoutPassword as IUser;
      next();
    }
  );
}

/**
 * Middleware zum Prüfen, ob der authentifizierte User Administrator-Rechte hat.
 *
 * Muss NACH authenticateToken verwendet werden, da sie auf req.user zugreift.
 *
 * Verwendung: router.delete('/route', authenticateToken, requireAdmin, handler)
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prüfe ob User existiert und Administrator-Rechte hat
  if (!req.user || !req.user.isAdministrator) {
    // 403 Forbidden: Authentifiziert, aber keine Berechtigung
    res.status(403).json({ Error: "Administrator privileges required" });
    return;
  }
  next();
}
