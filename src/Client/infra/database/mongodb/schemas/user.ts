import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: 'users' })
export class UserModel {
  constructor(userModel: UserModel) {
    Object.keys(userModel).map((key) => (this[key] = userModel[key]));

    this._id = userModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password_hash: string;

  @Prop()
  profileName?: string;

  @Prop()
  profilePictureS3Url?: string;

  @Prop()
  bannerS3Url?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop()
  bio?: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
