import { HydratedDocument } from "mongoose";

export interface IUser {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type PublicUser = Pick<IUser, "email" | "name" | "username" | "emailVerifiedAt"> & { id: string };
export type UserDocuemnt = HydratedDocument<IUser>;