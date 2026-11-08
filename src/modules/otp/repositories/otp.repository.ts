import OtpModel from "../models/otp.model";

/** Note: Types */
import { type OtpPurpose, OtpDocument, OtpUpsertInput} from "../types/otp.types";

class OtpRepository {

    public async findByUserIdAndPurpose(userId:string, purpose:OtpPurpose):Promise<OtpDocument | null> {
        const otpDocument = await OtpModel.findOne({
            userId: userId,
            purpose: purpose
        }).select("+hashedOtp");
        return otpDocument;
    };

    public async incrementAttempts(userId:string, purpose:OtpPurpose):Promise<OtpDocument | null> {
        const otpDocument = await OtpModel.findOneAndUpdate(
            {
                userId: userId,
                purpose: purpose
            },
            {
                $inc: {
                    attempts: 1
                }
            },
            {
                returnDocument: "after"
            }
        );
        return otpDocument;
    };

    public async deleteByUserIdAndPurpose(userId:string, purpose:OtpPurpose):Promise<OtpDocument | null> {
        const deleteOtpDocuement = await OtpModel.findOneAndDelete({
            userId: userId,
            purpose: purpose
        });
        return deleteOtpDocuement;
    };

    public async upsert(otpObject: OtpUpsertInput, attemptReset:boolean):Promise<OtpDocument | null> {
        const { expiresAt, hashedOtp, lastSentAt, purpose, userId} = otpObject;
        
        const otpDocument = await OtpModel.findOneAndUpdate(
            {
                userId: userId,
                purpose: purpose
            },
            {
                $set: {
                    hashedOtp: hashedOtp,
                    lastSentAt: lastSentAt,
                    expiresAt: expiresAt,
                    ...(attemptReset ? { attempts: 0} : {})
                }
            },
            {
                upsert: true,
                new: true
            }
        );
        if (!otpDocument) {
            throw new Error("Error:Failed to create or update OTP.");
        }
        return otpDocument;
    };

};
export default OtpRepository;