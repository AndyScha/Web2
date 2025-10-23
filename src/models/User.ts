import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  userID: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdministrator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userID: {
      type: String,
      required: [true, "User-ID ist erforderlich"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Passwort ist erforderlich"],
      minlength: [6, "Passwort muss mindestens 6 Zeichen haben"],
    },
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
    isAdministrator: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Index für bessere Performance
UserSchema.index({ userID: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
