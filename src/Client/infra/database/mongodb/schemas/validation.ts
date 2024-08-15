import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';

export type ValidationDocument = HydratedDocument<ValidationModel>;

@Schema({ collection: 'validations' })
export class ValidationModel {
  constructor(validationModel: ValidationModel) {
    Object.keys(validationModel).map(
      (key) => (this[key] = validationModel[key]),
    );

    this._id = validationModel.id;
  }

  @Prop()
  _id?: string;

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
