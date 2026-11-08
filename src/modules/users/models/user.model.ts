import mongoose from "mongoose";
import type { IUser } from "../types/user.types";


const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 30
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        select: false,
        required:true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    emailVerifiedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true});

const UserModel = ( mongoose.models.User as mongoose.Model<IUser> | undefined ) ?? mongoose.model<IUser>("User", userSchema);
export default UserModel;