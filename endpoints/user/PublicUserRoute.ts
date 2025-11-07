import express, { Request, Response } from 'express';
import * as UserService from "./UserService";
import { IUser } from "./UserModel";

const router = express.Router();

// GET /api/publicUsers - Gibt alle User zurück (oder leeres Array wenn keine vorhanden)
router.get('/', function (_req: Request, res: Response): void {
    UserService.getUsers(function (_err: Error | { Error: string } | null, result?: IUser | IUser[] | null) {
        if (result && Array.isArray(result)) {
            res.status(200).send(result);
        } else {
            res.status(200).send([]);
        }
    });
});

// GET /api/publicUsers/:userID - Gibt einen spezifischen User zurück
router.get('/:userID', function (req: Request, res: Response): void {
    UserService.findUserBy(req.params.userID, function (err: Error | { Error: string } | null, result?: IUser | IUser[] | null) {
        if (result && !Array.isArray(result)) {
            res.status(200).send(result);
        } else {
            res.status(400).json(err || { Error: "User not found" });
        }
    });
});

// POST /api/publicUsers - Erstellt einen neuen User
router.post('/', function (req: Request, res: Response): void {
    UserService.createUser(req.body, function (err: Error | { Error: string } | null, result?: IUser | IUser[] | null) {
        if (result && !Array.isArray(result)) {
            res.status(201).send(result);
        } else {
            res.status(400).json(err);
        }
    });
});

// DELETE /api/publicUsers/:userID - Löscht einen User
router.delete("/:userID", function (req: Request, res: Response): void {
    UserService.deleteUser({ userID: req.params.userID }, function (err: Error | { Error: string } | null, result?: IUser | IUser[] | null) {
        if (result && !Array.isArray(result)) {
            res.status(204).send();
        } else {
            res.status(400).json(err || { Error: "User doesn't exist" });
        }
    });
});

// PUT /api/publicUsers/:userID - Aktualisiert einen bestehenden User
router.put("/:userID", function (req: Request, res: Response): void {
    UserService.updateUser({ userID: req.params.userID }, req.body, function (err: Error | { Error: string } | null, result?: IUser | IUser[] | null) {
        if (result && !Array.isArray(result)) {
            res.status(200).send(result);
        } else {
            res.status(400).json(err);
        }
    });
});

export default router;

