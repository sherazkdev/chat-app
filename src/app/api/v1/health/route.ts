import MongooseConnection from "@/lib/database/mogoose";

/** Response Senders */
import ApiResponse from "@/lib/api/api-response";
import mongoose from "mongoose";
import ApiError from "@/lib/api/api-error";

export async function GET() {
    try {
  
        await MongooseConnection.connect();

        const database = mongoose.connection.db; 
        if (!database) {
            throw new Error("Error: Database unavailable");
        };

        return ApiResponse.success( { mongoDB: "connected"}, "Success: Server is healty", 200, true);
        
    } catch (e:any) {
        return ApiResponse.failure(
            new ApiError(                
                e?.status || 503,
                e?.message || "Database unavailable",
                false
            )
        );
    };
};