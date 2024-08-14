import { AbstractUpdateEmailCodeValidationUseCase, IUpdateEmailCodeValidationUseCaseParams } from "./update-email-use-case";

export class UpdateEmailCodeValidationUseCaseMock extends AbstractUpdateEmailCodeValidationUseCase {
    async execute(data: IUpdateEmailCodeValidationUseCaseParams): Promise<void> {}
}