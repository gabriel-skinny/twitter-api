
export default abstract class AbstractEmailProvider {
    abstract sendEmail(data: { destinyEmail: string, emailType: "emailConfirmation" }): Promise<void>
}