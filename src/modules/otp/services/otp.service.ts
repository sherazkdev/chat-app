import ApiError from "@/lib/api/api-error";
import OtpRepository from "../repositories/otp.repository";

import { randomInt, createHmac } from "node:crypto";
import type { CreateOtpInput, OtpDocument, HashOtpInput } from "../types/otp.types";

class OtpService {

    private readonly otpRepository: OtpRepository;

    constructor(otpRepository: OtpRepository){
        this.otpRepository = otpRepository;
    };

    private generateOtp():number {

        const randomOtp = randomInt(100000, 1000000);
        return randomOtp;
    };

    private hashOtp(hashOtpData:HashOtpInput):string {
        const { userId,purpose,otp } = hashOtpData;

        const OTP_ALGORITHM = process.env.OTP_ALGORITHM;
        const OTP_ALGORITHM_SECRET = process.env.OTP_ALGORITHM_SECRET;

        if(!OTP_ALGORITHM || !OTP_ALGORITHM_SECRET){
            throw new ApiError(403, "Error: Missing Environment variables is OTP_ALGORITHM and OTP_ALGORITHM_SECRET.")
        }
        const hashedOtp = createHmac(OTP_ALGORITHM,OTP_ALGORITHM_SECRET).update(JSON.stringify([userId,purpose,otp])).digest("hex");
        return hashedOtp;
    };

    public async createOtp(otpObject:CreateOtpInput):Promise<void> {
        const { purpose, userId } = otpObject;
        
        /**
         * Note: Create Otp for verfication flow.
         * 1: Check email attempts if > 3 throw error.
         * 2: Generate 6 digit Otp.
         * 3: Generate Hashed Otp for Db store and assign three variables purpose, userId, otp.
         * 4: Calculate expiry for a five minute important note: use only .env variable.
         * 5: Register Otp and save document.
         * 6: End of the day? return a document to user.
        */

        // 1: Check email attempts if > 3 throw error.

        const RESET_EMAIL_ATTEMPTS_TIME = Number(process.env.RESET_EMAIL_ATTEMPTS_TIME);
        const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS);
        const MAX_OTP_EXPIRY = Number(process.env.MAX_OTP_EXPIRY);
        if(
            !Number.isInteger(RESET_EMAIL_ATTEMPTS_TIME) ||
            RESET_EMAIL_ATTEMPTS_TIME <= 0 ||
            !Number.isInteger(MAX_OTP_ATTEMPTS) ||
            MAX_OTP_ATTEMPTS <= 0 ||
            !Number.isInteger(MAX_OTP_EXPIRY) ||
            MAX_OTP_EXPIRY <= 0
        )
        {
            throw new ApiError(500,"Error: Missing environment variables is RESET_EMAIL_ATTEMPTS_TIME and MAX_EMAIL_ATTEMPTS.");
        };
        
        const checkEmailAttempts = await this.otpRepository.findByUserIdAndPurpose(userId,purpose);
        if(checkEmailAttempts && checkEmailAttempts.expiresAt.getTime() >= Date.now() && checkEmailAttempts?.attempts >= MAX_OTP_ATTEMPTS){
            throw new ApiError(429,"Error: Too many email attempts. Please try again later.")
        };

        /** Note: Resend Colldown for example is otp attempts complete after reset to send. */
        if(checkEmailAttempts){
            const allowedNewOtp = checkEmailAttempts?.lastSentAt.getTime() + ( RESET_EMAIL_ATTEMPTS_TIME * 60 * 1000 );
            if(Date.now() < allowedNewOtp){
                throw new ApiError(429,"Error: Please wait before requesting another OTP.")
            };
        }

        // 2: Generate 6 digit Otp.
        const generatedOtp = this.generateOtp();
        // 3: Generate Hashed Otp for Db store and assign three variables purpose, userId, otp.
        const hashedOtp = this.hashOtp({otp:generatedOtp, purpose:purpose, userId:userId});
        // 4: Calculate expiry for a five minute important note: use only .env variable.
        const expiryCalculating = new Date( Date.now() + Number(MAX_OTP_EXPIRY) * 60 * 1000 );
        const isActive =
            checkEmailAttempts !== null &&
            checkEmailAttempts.expiresAt.getTime() > Date.now();
        // 5: Register Otp and save document.
        const otpDocument = await this.otpRepository.upsert({
            expiresAt:expiryCalculating,
            hashedOtp:hashedOtp,
            lastSentAt:new Date(),
            purpose:purpose,
            userId:userId
        }, isActive);
        // 6: End of the day? return a document to user.
        return;

    };

};
export default OtpService;