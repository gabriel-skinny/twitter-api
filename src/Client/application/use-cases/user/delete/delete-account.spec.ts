import InMemoryUserRepositroy from "src/Client/application/repositories/user/inMemoryUserRepository";
import { DeleteAccountUseCase } from "./delete-account-use-case"
import { makeUser } from "src/Client/application/tests/factories/makeUser";

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