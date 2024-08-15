import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PreUserDocument = HydratedDocument<PreUserModel>;

@Schema()
export class PreUserModel {
  constructor(preUserModel: PreUserModel) {
    Object.keys(this).map((key) => (this[key] = preUserModel[key]));
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
  expiresIn?: number;

  @Prop()
  createdAt: Date;
}

export const PreUserSchema = SchemaFactory.createForClass(PreUserModel);
