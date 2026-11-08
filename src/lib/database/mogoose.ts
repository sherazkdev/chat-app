import mongoose, { MongooseError } from "mongoose";

class MongooseConnection {

    /**
     * 
     * @returns void
    */
    public static async connect(): Promise<void> {

        if(mongoose.connection.readyState === 1){
            return;
        };
        
        const mongooseURI = process.env.MONGODB_URI;
        if(!mongooseURI){
            throw new Error("Error: MONGODB_URI environment variable is missing.")
        };

        try {
            
            const connectionInstance = await mongoose.connect(mongooseURI,{
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
            });
            console.log(`MongoDB Running at Host ${connectionInstance.connection.host}`);
            return;

        } catch (e: unknown) {
            if(e instanceof MongooseError){
                console.log(e.message);
                throw new Error(e.message);
            };
        }
    };
};

export default MongooseConnection;