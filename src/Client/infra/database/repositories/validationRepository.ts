import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Validation,
  OperationToValidateTypeEnum,
} from 'src/Client/application/entities/Validation/Validation';
import AbstractValidationRepository from 'src/Client/application/repositories/validation/validationRepository';
import { ValidationModel } from '../mongodb/schemas/validation';
import { Model } from 'mongoose';
import { validationModelToRaw, validationToModel } from '../mappers/validation';
import BaseRepository from './baseRepository';

@Injectable()
export default class ValidationRepository
  extends BaseRepository<ValidationModel, Validation>
  implements AbstractValidationRepository
{
  constructor(
    @InjectModel(ValidationModel.name)
    private validationModel: Model<ValidationModel>,
  ) {
    super(validationModel, validationModelToRaw, validationToModel);
  }

  async findByEmail(email: string): Promise<Validation | null> {
    const validationModel = await this.validationModel.findOne({ email });

    if (!validationModel) return null;

    return validationModelToRaw(validationModel);
  }

  async findByEmailAndOperation({
    email,
    operationToValidateType,
  }: {
    email: string;
    operationToValidateType: OperationToValidateTypeEnum;
  }): Promise<Validation | null> {
    const validationModel = await this.validationModel.findOne({
      email,
      operationToValidateType,
    });

    if (!validationModel) return null;

    return validationModelToRaw(validationModel);
  }
}
