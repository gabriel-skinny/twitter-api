import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SessionDeviceTypesEnum } from 'src/Client/application/entities/User/Session';

export type UserSessionDocument = HydratedDocument<UserSessionModel>;

@Schema({ collection: 'usersessions' })
export class UserSessionModel {
  constructor(userSessionModel: UserSessionModel) {
    Object.keys(userSessionModel).map(
      (key) => (this[key] = userSessionModel[key]),
    );

    this._id = userSessionModel.id;
  }

  @Prop()
  _id?: string;

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
