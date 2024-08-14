import InMemoryUserRepositroy from "@applications/services/Client/repositories/user/inMemoryUserRepository";
import { DeleteAccountUseCase } from "./delete-account-use-case"
import { makeUser } from "@applications/services/Client/tests/factories/makeUser";

describe("Delete account use case", () => {
    it ("Should delete an account", async () => {
        const userRepository = new InMemoryUserRepositroy();
        const deleteAccountUseCase = new DeleteAccountUseCase(userRepository);

        const user = makeUser();
        await userRepository.save(user);

        await deleteAccountUseCase.execute(user.id)

        expect(userRepository.userDatabase).toHaveLength(0);
    })
})