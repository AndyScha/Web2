import User, { IUser } from "./UserModel";
import bcrypt from "bcryptjs";

export type AuthCallback = (
  err: Error | { Error: string } | null,
  user?: IUser | null
) => void;

// Authentifiziert einen User mit Basic Authentication
export function authenticateUser(
  userID: string,
  password: string,
  callback: AuthCallback
): void {
  if (!userID || !password) {
    return callback({ Error: "UserID and password are required" });
  }

  // Suche User anhand der userID
  const query = User.findOne({ userID: userID });
  query.exec(function (err: Error | null, user: IUser | null) {
    if (err) {
      return callback({ Error: "Authentication failed" });
    }

    if (!user) {
      return callback({ Error: "Authentication failed" });
    }

    // Vergleiche Passwort mit bcrypt
    bcrypt.compare(
      password,
      user.password,
      function (err: Error | null, isMatch: boolean) {
        if (err) {
          return callback({ Error: "Authentication failed" });
        }

        if (isMatch) {
          // Passwort stimmt überein - User erfolgreich authentifiziert
          // Entferne Passwort aus dem User-Objekt vor der Rückgabe
          const userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          return callback(null, userWithoutPassword as IUser);
        } else {
          // Passwort stimmt nicht überein
          return callback({ Error: "Authentication failed" });
        }
      }
    );
  });
}
