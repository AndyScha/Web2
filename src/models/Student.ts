import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  course: string;
  semester: number;
  applicationDate: Date;
  status: "pending" | "accepted" | "rejected";
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Vorname ist erforderlich"],
      trim: true,
      maxlength: [50, "Vorname darf maximal 50 Zeichen haben"],
    },
    lastName: {
      type: String,
      required: [true, "Nachname ist erforderlich"],
      trim: true,
      maxlength: [50, "Nachname darf maximal 50 Zeichen haben"],
    },
    email: {
      type: String,
      required: [true, "E-Mail ist erforderlich"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      ],
    },
    studentId: {
      type: String,
      required: [true, "Matrikelnummer ist erforderlich"],
      unique: true,
      match: [/^\d{6,8}$/, "Matrikelnummer muss 6-8 Ziffern haben"],
    },
    course: {
      type: String,
      required: [true, "Studiengang ist erforderlich"],
      enum: [
        "Informatik",
        "Wirtschaftsinformatik",
        "Medieninformatik",
        "Cybersecurity",
      ],
    },
    semester: {
      type: Number,
      required: [true, "Semester ist erforderlich"],
      min: [1, "Semester muss mindestens 1 sein"],
      max: [10, "Semester darf maximal 10 sein"],
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    documents: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index für bessere Performance
StudentSchema.index({ email: 1 });
StudentSchema.index({ studentId: 1 });
StudentSchema.index({ status: 1 });

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
