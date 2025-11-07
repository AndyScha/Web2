import publicUserRoutes from './endpoints/user/PublicUserRoute';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Erstellt und konfiguriert den Express Server
export function createServer(): express.Application {
    const app = express();
    app.use(bodyParser.json());
    app.use("*", cors());
    // CORS Header setzen damit Frontend auf den Server zugreifen kann
    app.use(function (_req: Request, res: Response, next: NextFunction): void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Route für /api/publicUsers
    app.use('/api/publicUsers', publicUserRoutes);
    // Fallback für nicht existierende Pfade
    app.use(function (_req: Request, res: Response): void {
        res.status(404).json({ Error: "Path doesn't exist" });
    });

    return app;
}

