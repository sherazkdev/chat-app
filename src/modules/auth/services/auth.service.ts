    import argon2 from "argon2";

    import UserRepository from "@/modules/users/repositories/user.repository";
    import UserMapper from "@/modules/users/mappers/user.mapper";

    import type { RegisterUserInput } from "@/modules/users/validaters/user.validation";
    import ApiError from "@/lib/api/api-error";
    import type { PublicUser } from "@/modules/users/types/user.types";

    class AuthServices {

        private readonly userRepository: UserRepository;
        
        constructor(userRepository: UserRepository){
            this.userRepository = userRepository;
        };

        public async register(userData:RegisterUserInput):Promise<PublicUser> {
            const { email, password, username } = userData;
            /** 
                * Note: Register User Details Flow.
                * 
                * 1: Check email if email is throw ( error ) else continue.
                * 2: Check username if username already taken throw ( error ) else continue.
                * 3: Convert normal password to hashed password
                * 4: Save and return safeUser.
            */

            // 1: Check email if email is throw ( error ) else continue.
            const userEmailExist = await this.userRepository.findByEmail(email);
            if(userEmailExist){
                throw new ApiError(409,"Error: Email already exist please try another email.");
            };

            // 2: Check username if username already taken throw ( error ) else continue.
            const userUsernameExist = await this.userRepository.findByUsername(username);
            if(userUsernameExist){
                throw new ApiError(409, "Error: Username already is used try another username.");
            };

            // 3: Convert normal password to hashed password.
            const ARGON2_PASSWORD_SECRET = process.env.ARGON2_PASSWORD_SECRET;
            if (!ARGON2_PASSWORD_SECRET) {
                throw new Error("Error: ARGON2_PASSWORD_SECRET is missing.");
            }
            const hashedPassword = await argon2.hash(password, 
                {
                    type: argon2.argon2id,
                    secret: Buffer.from(ARGON2_PASSWORD_SECRET, "utf8")
                }
            );

            // 4: Save and return safeUser.
            const userDocument = await this.userRepository.create({...userData,password:hashedPassword});
            return UserMapper.toPublic(userDocument);

        };
    };
    export default AuthServices;