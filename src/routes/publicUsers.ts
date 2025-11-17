import express from "express";
import { User } from "../models/User";

const router = express.Router();

// GET /publicUsers - Alle User abrufen
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /publicUsers/:userID - User per userID abrufen
router.get("/:userID", async (req, res, next) => {
  try {
    const user = await User.findOne({ userID: req.params.userID });

    if (!user) {
      return res.status(404).json({
        error: "User nicht gefunden",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /publicUsers - Neuen User erstellen
router.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /publicUsers/:userID - User aktualisieren
router.put("/:userID", async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { userID: req.params.userID },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User nicht gefunden",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /publicUsers/:userID - User löschen
router.delete("/:userID", async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ userID: req.params.userID });

    if (!user) {
      return res.status(404).json({
        error: "User nicht gefunden",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;




