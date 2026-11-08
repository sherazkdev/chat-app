import UserModel from "../models/user.model";
import { UserDocuemnt } from "../types/user.types";
import { RegisterUserInput } from "../validaters/user.validation";

class UserRepository {

    public async findByEmail(email:string):Promise<UserDocuemnt | null> {
        /** Note: Find by email userdocuement */
        const userDocuement = await UserModel.findOne({ email: email });
        return userDocuement;
    };

    public async findById(id:string):Promise<UserDocuemnt | null> {
        /** Note: Find by id userdocuement */
        const userDocuement = await UserModel.findById(id);
        return userDocuement;
    };

    public async findByUsername(username:string):Promise<UserDocuemnt | null> {
        /** Note: Find by username userdocuement */
        const userDocuement = await UserModel.findOne({ username: username});
        return userDocuement;
    };

    public async create(userData:RegisterUserInput):Promise<UserDocuemnt> {
        /**
             * Note: Register User Details Flow.
             * 
             * 1: Check email if email is throw ( error ) else continue.
             * 2: Check username if username already taken throw ( error ) else continue.
             * 3: Currenlty Not available Do not save hard coded form password -- we will update feature.
             * 4: Save and return userDocuement. 
           
            const { email, passwordHash, name, username } = userData as UserDocuemnt;

            // 1: Check email if email is throw ( error ) else continue.
            const userEmailIsExist = await this.findByEmail(email);
            if(userEmailIsExist){
                throw ApiResponse.failure(
                    new ApiError(401, "Error: Email already used please try another email.")
                );
            };

            // 2: Check username if username already taken throw ( error ) else continue.
            const userUsernameIsExist = await this.findByUsername(username);
            if(userUsernameIsExist){
                throw ApiResponse.failure(
                    new ApiError(401, "Error: Username is already used try another username.")
                );
            };
        */
        
        const { email, password, name, username } = userData;
        // 4: Save and return userDocuement.
        const userDocuement = await UserModel.create({
            name: name,
            email: email,
            username: username,
            passwordHash: password
        });

        return userDocuement;
    };
};
export default UserRepository;