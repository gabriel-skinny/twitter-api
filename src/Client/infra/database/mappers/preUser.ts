import { Password } from 'src/Client/application/entities/User/Password';
import PreUser from 'src/Client/application/entities/User/preUser';
import { PreUserModel } from '../mongodb/schemas/preUser';

export const preUserToModel = (preUser: PreUser) => {
  return new PreUserModel({
    id: preUser.id,
    email: preUser.email,
    password_hash: preUser.password_hash.value,
    createdAt: preUser.createdAt,
    name: preUser.name,
  });
};

export const preUserModelToPreUser = (preUserModel: PreUserModel) => {
  return new PreUser({
    id: preUserModel.id,
    email: preUserModel.email,
    password_hash: new Password(preUserModel.password_hash),
    createdAt: preUserModel.createdAt,
    name: preUserModel.name,
  });
};
