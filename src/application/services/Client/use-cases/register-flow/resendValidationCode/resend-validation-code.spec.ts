import { MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT } from "@constants/emailValidationAttempt";
import { EmailValidation } from "../../../entities/EmailValidation";
import { ValidationCode } from "../../../entities/ValidationCode";
import EmailProviderStub from "../../../services/emailProviderStub";
import InMemoryEmailValidationRepository from "../../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryEmailValidationAttemptRepository from "../../../repositories/emailValidationAttempt/emailValidation/inMemoryEmailValidationAttempRepository";
import InMemoryPreUserRepositroy from "../../../repositories/preUserRepository/inMemoryPreUserRepository";
import { makePreUser } from "../../../tests/factories/makePreUser";
import ResendValidationUseCase from "./resend-validation-code";

const makeUseCaseSut = () => {
    const emailValidationAttemptRepository = new InMemoryEmailValidationAttemptRepository();
    const emailValidationRepository = new InMemoryEmailValidationRepository();
    const preUserRepository = new InMemoryPreUserRepositroy();
    const emailService = new EmailProviderStub();

    const resendValidationUseCase =  new ResendValidationUseCase(emailValidationAttemptRepository, emailValidationRepository, preUserRepository, emailService);
    
    return { resendValidationUseCase, emailValidationAttemptRepository, emailValidationRepository, preUserRepository, emailService};
}

describe("User resend validation code use case", () => {
    it ("Should resend validation code to preUser email", async () => {
        const { emailService, resendValidationUseCase, emailValidationAttemptRepository, preUserRepository, emailValidationRepository } = makeUseCaseSut();

        emailService.sendEmail = jest.fn();


        const preUser = makePreUser();
        await preUserRepository.save(preUser);

        const emailValidation = new EmailValidation({
            userEmail: preUser.email,
            validationCode: new ValidationCode(123456)
        })
        await emailValidationRepository.save(emailValidation);

        await resendValidationUseCase.execute(preUser.id);
        
        expect(emailValidationAttemptRepository.emailValidationAttempDatabase[0].attempts)
            .toBe(1);
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            destinyEmail: preUser.email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${emailValidation.validationCode.value}`
        })
    })

    it ("Should create a validation email and send the new validatio code if preUser does not have it", async () => {
        const { emailService, resendValidationUseCase, emailValidationAttemptRepository, preUserRepository, emailValidationRepository } = makeUseCaseSut();

        emailService.sendEmail = jest.fn();

        const preUser = makePreUser();
        await preUserRepository.save(preUser);

        await resendValidationUseCase.execute(preUser.id);
        
        const createdValidationCode = emailValidationRepository.emailValidationDatabase[0];

        expect(createdValidationCode).toBeTruthy();
        expect(createdValidationCode.userEmail).toBe(preUser.email);
        expect(emailValidationAttemptRepository.emailValidationAttempDatabase[0].attempts)
            .toBe(1);
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            destinyEmail: preUser.email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${createdValidationCode.validationCode.value}`
        })
    })

    it ("Should throw an error if emailValidationAttemp is on max attempt ", async () => {
        const { emailService, resendValidationUseCase, emailValidationAttemptRepository, preUserRepository, emailValidationRepository } = makeUseCaseSut();

        emailService.sendEmail = jest.fn();

        const preUser = makePreUser();
        await preUserRepository.save(preUser);

        const emailValidation = new EmailValidation({
            userEmail: preUser.email,
            validationCode: new ValidationCode(123456)
        })
        await emailValidationRepository.save(emailValidation);

        for (let i = 0; i < MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT; i++)
            await resendValidationUseCase.execute(preUser.id);

        const resendValidationUseErrorPromisse = resendValidationUseCase.execute(preUser.id);

       expect(resendValidationUseErrorPromisse).rejects
       .toStrictEqual(new Error(`User already tried to make validation more than 5 time. Wait ${emailValidation.validationAttempt.expiresIn} minutes to retry`))
    })
})