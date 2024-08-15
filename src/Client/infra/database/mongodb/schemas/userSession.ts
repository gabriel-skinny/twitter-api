import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SessionDeviceTypesEnum } from 'src/Client/application/entities/User/Session';

export type UserSessionDocument = HydratedDocument<UserSessionModel>;

@Schema()
export class UserSessionModel {
  constructor(userSessionModel: UserSessionModel) {
    Object.keys(this).map((key) => (this[key] = userSessionModel[key]));
  }

  @Prop({ _id: true })
  id: string;

  @Prop()
  userId: string;

  @Prop()
  ip: string;

  @Prop()
  deviceType: SessionDeviceTypesEnum;

  @Prop()
  active: boolean;

  @Prop()
  createdAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSessionModel);
