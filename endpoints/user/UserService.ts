import User, { IUser } from "./UserModel";

export type UserCallback = (
  err: Error | { Error: string } | null,
  user?: IUser | IUser[] | null
) => void;

// Holt alle User aus der Datenbank
export function getUsers(callback: UserCallback): void {
  User.find(function (err: Error | null, users: IUser[] | null) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, users || []);
    }
  });
}

// Erstellt einen neuen User, prüft aber vorher ob die userID schon existiert
export function createUser(
  requestbody: Partial<IUser>,
  callback: UserCallback
): void {
  // UserID muss vorhanden sein
  if (!requestbody.userID || requestbody.userID === "") {
    return callback({ Error: "UserID is required" });
  }

  // Prüfe ob User mit dieser userID schon existiert
  const query = User.findOne({ userID: requestbody.userID });
  query.exec(function (err: Error | null, user: IUser | null) {
    if (user) {
      return callback({
        Error: "user with userID: " + requestbody.userID + " already exists",
      });
    } else {
      // User existiert noch nicht, also kann er angelegt werden
      User.create(
        requestbody,
        function (err: Error | null, user: IUser | null) {
          if (err) {
            if ((err as any).name === "ValidationError") {
              return callback({ Error: "Missing properties" });
            }
            return callback({ Error: err.message });
          }
          if (user) {
            return callback(null, user);
          } else {
            return callback({ Error: "Error while creating new user" });
          }
        }
      );
    }
  });
}

// Aktualisiert einen bestehenden User
export function updateUser(
  searchUserID: { userID: string },
  requestbody: Partial<IUser>,
  callback: UserCallback
): void {
  const query = User.findOne(searchUserID);

  query.exec(async function (err: Error | null, user: IUser | null) {
    if (user) {
      // Aktualisiere nur die Felder die übergeben wurden
      if (requestbody.password) {
        user.password = requestbody.password;
      }
      if (requestbody.firstName !== undefined) {
        user.firstName = requestbody.firstName;
      }
      if (requestbody.lastName !== undefined) {
        user.lastName = requestbody.lastName;
      }
      if (requestbody.isAdministrator !== undefined) {
        user.isAdministrator = requestbody.isAdministrator;
      }
      await user.save();
      return callback(null, user);
    } else {
      return callback({
        Error: "User for userID: " + searchUserID.userID + " not found",
      });
    }
  });
}

// Löscht einen User aus der Datenbank
export function deleteUser(
  userID: { userID: string },
  callback: UserCallback
): void {
  const query = User.findOneAndDelete(userID);
  query.exec(function (err: Error | null, user: IUser | null) {
    if (user) {
      return callback(null, user);
    } else {
      return callback({ Error: "User doesn't exist" }, null);
    }
  });
}

// Sucht einen User anhand der userID
export function findUserBy(searchUserID: string, callback: UserCallback): void {
  if (!searchUserID) {
    callback({ Error: "UserID is missing" });
    return;
  } else {
    // Suche User über die userID (nicht über den MongoDB _id)
    const query = User.findOne({ userID: searchUserID });
    query.exec(function (err: Error | null, user: IUser | null) {
      if (err) {
        return callback(
          { Error: "Did not find user for userID: " + searchUserID },
          null
        );
      } else {
        if (user) {
          callback(null, user);
        } else {
          callback(
            {
              Error:
                "UserService: Could not find user for user ID: " + searchUserID,
            },
            null
          );
        }
      }
    });
  }
}

// Erstellt den Standard-Administrator, falls dieser noch nicht existiert
export function createDefaultAdmin(
  callback: (err: Error | null) => void
): void {
  const query = User.findOne({ userID: "admin" });
  query.exec(function (err: Error | null, user: IUser | null) {
    if (err) {
      return callback(err);
    }

    if (user) {
      // Admin existiert bereits
      return callback(null);
    } else {
      // Admin existiert noch nicht, lege ihn an
      User.create(
        {
          userID: "admin",
          password: "123",
          firstName: "Admin",
          lastName: "User",
          isAdministrator: true,
        },
        function (err: Error | null, user: IUser | null) {
          if (err) {
            return callback(err);
          }
          if (user) {
            console.log("Standard-Administrator (admin/123) wurde angelegt");
            return callback(null);
          } else {
            return callback(
              new Error("Fehler beim Anlegen des Standard-Administrators")
            );
          }
        }
      );
    }
  });
}

// Entfernt sensible Daten aus User-Objekt (Passwort, Systemdaten)
export function sanitizeUser(user: IUser): any {
  const userObj = user.toObject ? user.toObject() : user;
  const sanitized: any = {
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    id: userObj._id ? userObj._id.toString() : undefined,
    isAdministrator: userObj.isAdministrator,
    userID: userObj.userID,
  };
  return sanitized;
}

// Entfernt sensible Daten aus User-Array
export function sanitizeUsers(users: IUser[]): Partial<IUser>[] {
  return users.map((user) => sanitizeUser(user));
}
