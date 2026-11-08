import { NextResponse } from "next/server";
import ApiError from "./api-error";

class ApiResponse {

    public static success<T>( data: T, message:string, statusCode:number = 200, success:boolean = true ){
        return NextResponse.json(
            {
                data:data,
                message:message,
                statusCode:statusCode,
                success:success
            },
            { status: statusCode }
        );
    };

    public static failure( error: unknown){
        if(error instanceof ApiError){
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                    error: {
                        code: error.code,
                    },
                },
                { status: error.statusCode }
            );
        };

        console.error("Unhandled API error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                },
            },
            { status: 500 }
        );
    };
};

export default ApiResponse;