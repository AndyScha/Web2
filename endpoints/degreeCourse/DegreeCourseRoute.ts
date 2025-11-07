import express, { Request, Response } from "express";
import * as DegreeCourseService from "./DegreeCourseService";
import { IDegreeCourse } from "./DegreeCourseModel";
import { authenticateToken, requireAdmin } from "../user/AuthMiddleware";

const router = express.Router();

// GET /api/degreeCourses/:id - Gibt einen spezifischen Studiengang zurück
// Diese Route muss VOR der allgemeinen GET / Route stehen, damit Express sie korrekt matched
router.get("/:id", authenticateToken, function (
  req: Request,
  res: Response
): void {
  const courseId = req.params.id;

  DegreeCourseService.findDegreeCourseById(
    courseId,
    function (
      err: Error | { Error: string } | null,
      result?: IDegreeCourse | IDegreeCourse[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && !Array.isArray(result)) {
        // Entferne Systemdaten
        const sanitizedCourse = DegreeCourseService.sanitizeDegreeCourse(result);
        res.status(200).json(sanitizedCourse);
      } else {
        res.status(400).json({ Error: "Degree course not found" });
      }
    }
  );
});

// GET /api/degreeCourses - Gibt alle Studiengänge zurück oder sucht nach universityShortName
router.get("/", authenticateToken, function (req: Request, res: Response): void {
  const universityShortName = req.query.universityShortName as string | undefined;

  // Wenn universityShortName als Query-Parameter vorhanden ist, suche danach
  if (universityShortName) {
    DegreeCourseService.findDegreeCoursesByUniversity(
      universityShortName,
      function (
        err: Error | { Error: string } | null,
        result?: IDegreeCourse | IDegreeCourse[] | null
      ) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        if (result && Array.isArray(result)) {
          // Entferne Systemdaten aus allen Studiengängen
          const sanitizedCourses = DegreeCourseService.sanitizeDegreeCourses(result);
          res.status(200).json(sanitizedCourses);
        } else {
          res.status(200).json([]);
        }
      }
    );
  } else {
    // Kein Query-Parameter: Gib alle Studiengänge zurück
    DegreeCourseService.getDegreeCourses(function (
      err: Error | { Error: string } | null,
      result?: IDegreeCourse | IDegreeCourse[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && Array.isArray(result)) {
        // Entferne Systemdaten aus allen Studiengängen
        const sanitizedCourses = DegreeCourseService.sanitizeDegreeCourses(result);
        res.status(200).json(sanitizedCourses);
      } else {
        res.status(200).json([]);
      }
    });
  }
});

// POST /api/degreeCourses - Erstellt einen neuen Studiengang (nur für Administratoren)
router.post("/", authenticateToken, requireAdmin, function (
  req: Request,
  res: Response
): void {
  DegreeCourseService.createDegreeCourse(
    req.body,
    function (
      err: Error | { Error: string } | null,
      result?: IDegreeCourse | IDegreeCourse[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && !Array.isArray(result)) {
        // Entferne Systemdaten
        const sanitizedCourse = DegreeCourseService.sanitizeDegreeCourse(result);
        res.status(201).json(sanitizedCourse);
      } else {
        res.status(400).json({ Error: "Error creating degree course" });
      }
    }
  );
});

// PUT /api/degreeCourses/:id - Aktualisiert einen bestehenden Studiengang (nur für Administratoren)
router.put("/:id", authenticateToken, requireAdmin, function (
  req: Request,
  res: Response
): void {
  const courseId = req.params.id;

  DegreeCourseService.updateDegreeCourse(
    courseId,
    req.body,
    function (
      err: Error | { Error: string } | null,
      result?: IDegreeCourse | IDegreeCourse[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && !Array.isArray(result)) {
        // Entferne Systemdaten
        const sanitizedCourse = DegreeCourseService.sanitizeDegreeCourse(result);
        res.status(200).json(sanitizedCourse);
      } else {
        res.status(400).json({ Error: "Degree course not found" });
      }
    }
  );
});

// DELETE /api/degreeCourses/:id - Löscht einen Studiengang (nur für Administratoren)
router.delete("/:id", authenticateToken, requireAdmin, function (
  req: Request,
  res: Response
): void {
  DegreeCourseService.deleteDegreeCourse(
    req.params.id,
    function (
      err: Error | { Error: string } | null,
      result?: IDegreeCourse | IDegreeCourse[] | null
    ) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (result && !Array.isArray(result)) {
        res.status(204).send();
      } else {
        res.status(400).json({ Error: "Degree course doesn't exist" });
      }
    }
  );
});

export default router;

