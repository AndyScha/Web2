import express, { Request, Response } from "express";
import * as UserService from "./UserService";
import { IUser } from "./UserModel";
import { authenticateToken, requireAdmin } from "./AuthMiddleware";

const router = express.Router();

// GET /api/users - Gibt alle User zurück (nur für Administratoren)
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  function (req: Request, res: Response): void {
    UserService.getUsers(function (
      err: Error | { Error: string } | null,
      result?: IUser | IUser[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && Array.isArray(result)) {
        // Entferne Passwort und Systemdaten aus allen Usern
        const sanitizedUsers = UserService.sanitizeUsers(result);
        res.status(200).json(sanitizedUsers);
      } else {
        res.status(200).json([]);
      }
    });
  }
);

// GET /api/users/:userID - Gibt einen spezifischen User zurück
router.get(
  "/:userID",
  authenticateToken,
  function (req: Request, res: Response): void {
    const requestedUserID = req.params.userID;
    const authenticatedUser = req.user;

    // Prüfe Autorisierung: Nur Admin oder der User selbst kann die Daten abrufen
    if (
      !authenticatedUser ||
      (!authenticatedUser.isAdministrator &&
        authenticatedUser.userID !== requestedUserID)
    ) {
      res.status(401).json({ Error: "Unauthorized" });
      return;
    }

    // Einfache Suchfunktion: Suche direkt über userID
    UserService.findUserBy(
      requestedUserID,
      function (
        err: Error | { Error: string } | null,
        result?: IUser | IUser[] | null
      ) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        if (result && !Array.isArray(result)) {
          // Entferne Passwort und Systemdaten
          const sanitizedUser = UserService.sanitizeUser(result);
          res.status(200).json(sanitizedUser);
        } else {
          res.status(400).json({ Error: "User not found" });
        }
      }
    );
  }
);

// POST /api/users - Erstellt einen neuen User (nur für Administratoren)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  function (req: Request, res: Response): void {
    UserService.createUser(
      req.body,
      function (
        err: Error | { Error: string } | null,
        result?: IUser | IUser[] | null
      ) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        if (result && !Array.isArray(result)) {
          // Entferne Passwort und Systemdaten
          const sanitizedUser = UserService.sanitizeUser(result);
          res.status(201).json(sanitizedUser);
        } else {
          res.status(400).json({ Error: "Error creating user" });
        }
      }
    );
  }
);

// PUT /api/users/:userID - Aktualisiert einen bestehenden User
router.put(
  "/:userID",
  authenticateToken,
  function (req: Request, res: Response): void {
    const requestedUserID = req.params.userID;
    const authenticatedUser = req.user;

    // Prüfe Autorisierung: Nur Admin oder der User selbst kann die Daten ändern
    if (
      !authenticatedUser ||
      (!authenticatedUser.isAdministrator &&
        authenticatedUser.userID !== requestedUserID)
    ) {
      res.status(401).json({ Error: "Unauthorized" });
      return;
    }

    // User-ID darf nicht geändert werden
    if (req.body.userID && req.body.userID !== requestedUserID) {
      res.status(400).json({ Error: "UserID cannot be changed" });
      return;
    }

    // Nicht-Administratoren dürfen nur firstName und lastName ändern
    if (!authenticatedUser.isAdministrator) {
      // Entferne alle Felder außer firstName und lastName
      const allowedFields: Partial<IUser> = {};
      if (req.body.firstName !== undefined) {
        allowedFields.firstName = req.body.firstName;
      }
      if (req.body.lastName !== undefined) {
        allowedFields.lastName = req.body.lastName;
      }
      // isAdministrator darf nicht geändert werden
      if (req.body.isAdministrator !== undefined) {
        res.status(403).json({
          Error: "You are not allowed to change isAdministrator",
        });
        return;
      }
      // Verwende nur die erlaubten Felder
      req.body = allowedFields;
    } else {
      // Administratoren können alles ändern, außer userID
      if (req.body.isAdministrator === undefined) {
        // Behalte den aktuellen Wert, wenn nicht angegeben
        delete req.body.isAdministrator;
      }
    }

    UserService.updateUser(
      { userID: requestedUserID },
      req.body,
      function (
        err: Error | { Error: string } | null,
        result?: IUser | IUser[] | null
      ) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        if (result && !Array.isArray(result)) {
          // Entferne Passwort und Systemdaten
          const sanitizedUser = UserService.sanitizeUser(result);
          res.status(200).json(sanitizedUser);
        } else {
          res.status(400).json({ Error: "User not found" });
        }
      }
    );
  }
);

// DELETE /api/users/:userID - Löscht einen User (nur für Administratoren)
router.delete(
  "/:userID",
  authenticateToken,
  requireAdmin,
  function (req: Request, res: Response): void {
    UserService.deleteUser(
      { userID: req.params.userID },
      function (
        err: Error | { Error: string } | null,
        result?: IUser | IUser[] | null
      ) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        if (result && !Array.isArray(result)) {
          res.status(204).send();
        } else {
          res.status(400).json({ Error: "User doesn't exist" });
        }
      }
    );
  }
);

export default router;
