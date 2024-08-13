import InMemoryUserRepositroy from "@applications/services/Client/repositories/user/inMemoryUserRepository";
import UpdateAccountUseCase from "./update-account-use-case";
import { makeUser } from "@applications/services/Client/tests/factories/makeUser";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";

describe("Update account use-case", () => {
    it ("should update user data", async () => {
        const userRepository = new InMemoryUserRepositroy();
        const updateAccountUseCase = new UpdateAccountUseCase(userRepository);

        const user = makeUser();
        await userRepository.save(user);

        const newUserData = {
            profileName: "newProfileName",
            bio: "NewBio"
        }
        await updateAccountUseCase.execute({ id: user.id, userData: newUserData });
    
        expect(userRepository.userDatabase[0].profileName).toBe(newUserData.profileName);
        expect(userRepository.userDatabase[0].bio).toBe(newUserData.bio);
    })

    it ("should throw an error with user does not exists", async () => {
        const userRepository = new InMemoryUserRepositroy();
        const updateAccountUseCase = new UpdateAccountUseCase(userRepository);

        const updateAccountPromise = updateAccountUseCase.execute({ id: "notExistisId", userData: {}});
    
        expect(updateAccountPromise).rejects.toThrow(ErrorUserNotFound);
    })
})