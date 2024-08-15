import InMemoryValidationRepository from 'src/Client/application/repositories/validation/InMemoryValidationRepository';
import EmailProviderStub from 'src/Client/application/services/emailServiceStub';
import { ResendValidationUseCase } from './resend-validation-code';
import { makeValidation } from 'src/Client/application/tests/factories/makeValidation';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';

const makeUseCaseSut = () => {
  const validationRepository = new InMemoryValidationRepository();
  const emailService = new EmailProviderStub();

  const resendValidationUseCase = new ResendValidationUseCase(
    validationRepository,
    emailService,
  );

  return { resendValidationUseCase, validationRepository, emailService };
};

describe('User resend validation code use case', () => {
  it('Should resend validation code to the email passed', async () => {
    const { resendValidationUseCase, validationRepository, emailService } =
      makeUseCaseSut();

    emailService.sendEmail = jest.fn();

    const validation = makeValidation();
    await validationRepository.save(validation);

    await resendValidationUseCase.execute({
      email: validation.email,
      operationToValidateType: validation.operationToValidateType,
    });

    expect(emailService.sendEmail).toHaveBeenCalledWith({
      destinyEmail: validation.email,
      emailType: 'emailConfirmation',
      content: `Send this validation code: ${validation.validationCode.value}`,
    });
  });

  it('Should throw an error with validation does not exists', async () => {
    const { resendValidationUseCase } = makeUseCaseSut();

    const resendValidationPromise = resendValidationUseCase.execute({
      email: 'notExstingEmail@gmail.com',
      operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION,
    });

    expect(resendValidationPromise).rejects.toStrictEqual(
      new Error('Validation does not exists for that user'),
    );
  });
});
