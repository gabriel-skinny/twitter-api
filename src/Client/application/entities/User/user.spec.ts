import { makeUser } from "../../tests/factories/makeUser";

describe("User entity test", () => {
    it ("should create a user", () => {
        const user = makeUser();

        expect(user).toBeTruthy();
    })
})