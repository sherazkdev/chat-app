import mongoose from "mongoose";

import { type IOtp, otpPurposeEnum } from "../types/otp.types";

/** Note: Otp Schema */
const otpSchema = new mongoose.Schema<IOtp>({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    purpose: {
        type: String,
        enum: otpPurposeEnum,
        required: true
    },
    hashedOtp: {
        type: String,
        select: false,
        required: true
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lastSentAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required:true
    }

}, { timestamps: true});

otpSchema.index(
    { userId:1, purpose:1 },
    { unique: true }
);

otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const OtpModel = ( mongoose.models.Otp as mongoose.Model<IOtp> | undefined ) ?? mongoose.model<IOtp>("Otp", otpSchema);
export default OtpModel;