import publicUserRoutes from "./endpoints/user/PublicUserRoute";
import userRoutes from "./endpoints/user/UserRoute";
import authRoutes from "./endpoints/user/AuthRoute";
import degreeCourseRoutes from "./endpoints/degreeCourse/DegreeCourseRoute";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Erstellt und konfiguriert den Express Server
export function createServer(): express.Application {
  const app = express();
  app.use(bodyParser.json());
  app.use("*", cors());
  // CORS Header setzen damit Frontend auf den Server zugreifen kann
  app.use(function (_req: Request, res: Response, next: NextFunction): void {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  // Route für /api/authenticate
  app.use("/api/authenticate", authRoutes);
  // Route für /api/publicUsers (öffentlich, keine Authentifizierung)
  app.use("/api/publicUsers", publicUserRoutes);
  // Route für /api/users (geschützt, Token-Authentifizierung erforderlich)
  app.use("/api/users", userRoutes);
  // Route für /api/degreeCourses (geschützt, Token-Authentifizierung erforderlich)
  app.use("/api/degreeCourses", degreeCourseRoutes);
  // Fallback für nicht existierende Pfade
  app.use(function (_req: Request, res: Response): void {
    res.status(404).json({ Error: "Path doesn't exist" });
  });

  return app;
}
