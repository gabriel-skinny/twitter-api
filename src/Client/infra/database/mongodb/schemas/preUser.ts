import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PreUserDocument = HydratedDocument<PreUserModel>;

@Schema({ collection: 'preusers' })
export class PreUserModel {
  constructor(preUserModel: PreUserModel) {
    Object.keys(preUserModel).map((key) => (this[key] = preUserModel[key]));

    this._id = preUserModel.id;
  }

  @Prop()
  _id?: string;

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password_hash: string;

  @Prop()
  expiresIn: number;

  @Prop()
  createdAt: Date;
}

export const PreUserSchema = SchemaFactory.createForClass(PreUserModel);
