import ApiError from "@/lib/api/api-error";
import ApiResponse from "@/lib/api/api-response";
import MongooseConnection from "@/lib/database/mogoose";
import AuthServices from "@/modules/auth/services/auth.service";
import UserRepository from "@/modules/users/repositories/user.repository";
import { registerUserSchema } from "@/modules/users/validaters/user.validation";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest):Promise<NextResponse> {
    
    /**
     * 1: Get Register User request body and validate to registerUserSchema. if validation failed throw error.
     * 2: MongoDB Connection.
     * 3: Create a UserRepository and assign to AuthService Constructer.
     * 4: Call AuthService Create User Class Object and assign Request body.
     * 6: Success is user register @returns {ApiResponse} - Safe User
    */
    try {
        const formData = await req.json();
        // 1: Get Register User request body and validate to registerUserSchema. if validation failed throw error.
        const body = registerUserSchema.safeParse(formData);
        if(!body.success){
            console.log(body.error, body.data)
            return ApiResponse.failure(
                new ApiError(400,"Error: Invalid Json Validation.")
            );  
        };
        // 2: MongoDB Connection.
        await MongooseConnection.connect();

        // 3: Create a UserRepository and assign to AuthService Constructer.
        const userRepository = new UserRepository();
        const authService = new AuthServices(userRepository);
        
        // 4: Call AuthService Create User Class Object and assign Request body.
        const registerUserDocument = await authService.register(body.data);
        // 6: Success is user register @returns {ApiResponse} - Safe User
        return ApiResponse.success( registerUserDocument, "Success: User successfully registered.", 200, true );
    } catch (e:any) {
        return ApiResponse.failure(e);
    };
};