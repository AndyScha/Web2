import mongoose, { Document, Schema } from 'mongoose';

export interface IDegreeCourse extends Document {
    universityName: string;
    universityShortName: string;
    departmentName: string;
    departmentShortName: string;
    name: string;
    shortName: string;
}

const DegreeCourseSchema = new Schema<IDegreeCourse>({
    universityName: { type: String, required: true },
    universityShortName: { type: String, required: true },
    departmentName: { type: String, required: true },
    departmentShortName: { type: String, required: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true }
}, { timestamps: true });

const DegreeCourse = mongoose.model<IDegreeCourse>("DegreeCourses", DegreeCourseSchema);
export default DegreeCourse;

