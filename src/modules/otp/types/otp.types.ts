import { HydratedDocument, Types } from "mongoose";

export const otpPurposeEnum = ["EMAIL_VERIFICATION","PASSWORD_RESET","EMAIL_CHANGE"] as const;

export type OtpPurpose = typeof otpPurposeEnum[number];

export interface IOtp {
    userId: Types.ObjectId;
    purpose: OtpPurpose;
    hashedOtp: string;
    expiresAt: Date,
    attempts: number;
    lastSentAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type OtpUpsertInput = Pick<IOtp, "purpose" | "hashedOtp" | "expiresAt" | "lastSentAt"> & { userId:string };;
export type CreateOtpInput = Pick<IOtp, "purpose"> & { userId:string };
export type HashOtpInput = Pick<IOtp, "purpose"> & { otp:number, userId:string };

export type OtpDocument = HydratedDocument<IOtp>;