import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  constructor(userModel: UserModel) {
    Object.keys(this).map((key) => (this[key] = userModel[key]));
  }

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
