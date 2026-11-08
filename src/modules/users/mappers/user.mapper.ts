import { PublicUser, UserDocuemnt } from "../types/user.types";


class UserMapper {

    public static toPublic(userData:UserDocuemnt):PublicUser {
        return {
            id: userData._id.toString(),
            email: userData.email,
            name: userData.name,
            username: userData.username,
            emailVerifiedAt: userData.emailVerifiedAt
        };
    };
};
export default UserMapper;