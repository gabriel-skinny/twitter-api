import User from "src/Client/application/entities/User/User"
import { UserModel } from "../schemas/user"


export const userToUserModel = (user: User) => {
    return new UserModel({
        id: user.id,
        email: user.email,
        password_hash: user.password_hash.value,
        createdAt: user.createdAt,
        name: user.name,
        bannerS3Url: user.bannerS3Url,
        bio: user.bio,
        location: user.location,
        profileName: user.profileName,
        profilePictureS3Url: user.profilePictureS3Url,
        website: user.website
    })
}