import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    userID: string;
    password: string;
    firstName?: string;
    lastName?: string;
    isAdministrator: boolean;
}

const UserSchema = new Schema<IUser>({
    userID: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    isAdministrator: { type: Boolean, default: false }
}, { timestamps: true });

// Vor dem Speichern: Passwort automatisch hashen mit bcrypt
UserSchema.pre('save', function (next) {
    const user = this as IUser;

    // Nur hashen wenn das Passwort geändert wurde
    if (!user.isModified('password')) {
        return next();
    }
    // Passwort mit bcryptjs hashen (10 Runden)
    bcrypt.hash(user.password, 10).then((hashedPassword: string) => {
        user.password = hashedPassword;
        next();
    }).catch((err: Error) => {
        next(err);
    });
});

const PublicUser = mongoose.model<IUser>("Users", UserSchema);
export default PublicUser;

