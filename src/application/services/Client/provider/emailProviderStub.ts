import AbstractEmailProvider from "./emailProvider";

export default class EmailProviderStub implements AbstractEmailProvider {
    async sendEmail(data: { destinyEmail: string, emailType: "emailConfirmation" }): Promise<void>{
        return;
    }
}