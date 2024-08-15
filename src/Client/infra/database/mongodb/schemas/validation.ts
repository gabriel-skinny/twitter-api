import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';

export type ValidationDocument = HydratedDocument<ValidationModel>;

@Schema()
export class ValidationModel {
  constructor(validationModel: ValidationModel) {
    Object.keys(this).map((key) => (this[key] = validationModel[key]));
  }

  @Prop({ _id: true })
  id: string;

  @Prop()
  validated: boolean;

  @Prop()
  operationToValidateType: OperationToValidateTypeEnum;

  @Prop()
  email: string;

  @Prop()
  validationCode: number;

  @Prop()
  expirationIn: number;

  @Prop()
  createdAt: Date;
}

export const ValidationSchema = SchemaFactory.createForClass(ValidationModel);
