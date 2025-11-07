import DegreeCourse, { IDegreeCourse } from "./DegreeCourseModel";

export type DegreeCourseCallback = (
  err: Error | { Error: string } | null,
  degreeCourse?: IDegreeCourse | IDegreeCourse[] | null
) => void;

// Holt alle Studiengänge aus der Datenbank
export function getDegreeCourses(callback: DegreeCourseCallback): void {
  DegreeCourse.find(function (err: Error | null, degreeCourses: IDegreeCourse[] | null) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, degreeCourses || []);
    }
  });
}

// Sucht Studiengänge nach universityShortName
export function findDegreeCoursesByUniversity(
  universityShortName: string,
  callback: DegreeCourseCallback
): void {
  if (!universityShortName) {
    return callback({ Error: "universityShortName is required" });
  }

  const query = DegreeCourse.find({ universityShortName: universityShortName });
  query.exec(function (err: Error | null, degreeCourses: IDegreeCourse[] | null) {
    if (err) {
      return callback({ Error: "Error searching degree courses" }, null);
    } else {
      return callback(null, degreeCourses || []);
    }
  });
}

// Sucht einen Studiengang anhand der ID
export function findDegreeCourseById(
  id: string,
  callback: DegreeCourseCallback
): void {
  if (!id) {
    callback({ Error: "ID is missing" });
    return;
  } else {
    const query = DegreeCourse.findById(id);
    query.exec(function (err: Error | null, degreeCourse: IDegreeCourse | null) {
      if (err) {
        return callback(
          { Error: "Did not find degree course for id: " + id },
          null
        );
      } else {
        if (degreeCourse) {
          callback(null, degreeCourse);
        } else {
          callback(
            {
              Error: "DegreeCourseService: Could not find degree course for id: " + id,
            },
            null
          );
        }
      }
    });
  }
}

// Erstellt einen neuen Studiengang
export function createDegreeCourse(
  requestbody: Partial<IDegreeCourse>,
  callback: DegreeCourseCallback
): void {
  // Prüfe ob alle erforderlichen Felder vorhanden sind
  if (
    !requestbody.universityName ||
    !requestbody.universityShortName ||
    !requestbody.departmentName ||
    !requestbody.departmentShortName ||
    !requestbody.name ||
    !requestbody.shortName
  ) {
    return callback({ Error: "Missing required properties" });
  }

  DegreeCourse.create(
    requestbody,
    function (err: Error | null, degreeCourse: IDegreeCourse | null) {
      if (err) {
        if ((err as any).name === "ValidationError") {
          return callback({ Error: "Missing properties" });
        }
        return callback({ Error: err.message });
      }
      if (degreeCourse) {
        return callback(null, degreeCourse);
      } else {
        return callback({ Error: "Error while creating new degree course" });
      }
    }
  );
}

// Aktualisiert einen bestehenden Studiengang
export function updateDegreeCourse(
  id: string,
  requestbody: Partial<IDegreeCourse>,
  callback: DegreeCourseCallback
): void {
  const query = DegreeCourse.findById(id);

  query.exec(async function (err: Error | null, degreeCourse: IDegreeCourse | null) {
    if (err) {
      return callback({ Error: "Error finding degree course" });
    }

    if (degreeCourse) {
      // Aktualisiere nur die Felder die übergeben wurden
      if (requestbody.universityName !== undefined) {
        degreeCourse.universityName = requestbody.universityName;
      }
      if (requestbody.universityShortName !== undefined) {
        degreeCourse.universityShortName = requestbody.universityShortName;
      }
      if (requestbody.departmentName !== undefined) {
        degreeCourse.departmentName = requestbody.departmentName;
      }
      if (requestbody.departmentShortName !== undefined) {
        degreeCourse.departmentShortName = requestbody.departmentShortName;
      }
      if (requestbody.name !== undefined) {
        degreeCourse.name = requestbody.name;
      }
      if (requestbody.shortName !== undefined) {
        degreeCourse.shortName = requestbody.shortName;
      }
      await degreeCourse.save();
      return callback(null, degreeCourse);
    } else {
      return callback({
        Error: "Degree course for id: " + id + " not found",
      });
    }
  });
}

// Löscht einen Studiengang aus der Datenbank
export function deleteDegreeCourse(
  id: string,
  callback: DegreeCourseCallback
): void {
  const query = DegreeCourse.findByIdAndDelete(id);
  query.exec(function (err: Error | null, degreeCourse: IDegreeCourse | null) {
    if (err) {
      return callback({ Error: "Error deleting degree course" }, null);
    }
    if (degreeCourse) {
      return callback(null, degreeCourse);
    } else {
      return callback({ Error: "Degree course doesn't exist" }, null);
    }
  });
}

// Entfernt sensible Daten aus DegreeCourse-Objekt (Systemdaten)
export function sanitizeDegreeCourse(degreeCourse: IDegreeCourse): any {
  const courseObj = degreeCourse.toObject ? degreeCourse.toObject() : degreeCourse;
  const sanitized: any = {
    universityName: courseObj.universityName,
    universityShortName: courseObj.universityShortName,
    departmentName: courseObj.departmentName,
    departmentShortName: courseObj.departmentShortName,
    name: courseObj.name,
    shortName: courseObj.shortName,
    id: courseObj._id ? courseObj._id.toString() : undefined,
  };
  return sanitized;
}

// Entfernt sensible Daten aus DegreeCourse-Array
export function sanitizeDegreeCourses(
  degreeCourses: IDegreeCourse[]
): any[] {
  return degreeCourses.map((course) => sanitizeDegreeCourse(course));
}

