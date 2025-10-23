import express from "express";
import { Student } from "../models/Student";

const router = express.Router();

// GET /api/students - Alle Studenten abrufen
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id - Einzelnen Student abrufen
router.get("/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student nicht gefunden",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/students - Neuen Student erstellen
router.post("/", async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/students/:id - Student aktualisieren
router.put("/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student nicht gefunden",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/students/:id - Student löschen
router.delete("/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student nicht gefunden",
      });
    }

    res.json({
      success: true,
      message: "Student erfolgreich gelöscht",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
