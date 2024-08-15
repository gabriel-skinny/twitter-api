import User from 'src/Client/application/entities/User/User';
import { UserModel } from '../mongodb/schemas/user';
import { Password } from 'src/Client/application/entities/User/Password';

export function userToUserModel(user: Partial<User>): UserModel {
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
    website: user.website,
  });
}

export function userModelToRaw(userModel: UserModel) {
  return new User({
    id: userModel.id,
    email: userModel.email,
    password_hash: new Password(userModel.password_hash),
    createdAt: userModel.createdAt,
    name: userModel.name,
    bannerS3Url: userModel.bannerS3Url,
    bio: userModel.bio,
    location: userModel.location,
    profileName: userModel.profileName,
    profilePictureS3Url: userModel.profilePictureS3Url,
    website: userModel.website,
  });
}
