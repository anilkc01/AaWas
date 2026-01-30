const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();


const UserMock = dbMock.define('User', {
    id: 1,
    fullName: "Anil KC",
    email: "anil@gmail.com",
    phone: "9866052045",
    password: "Hello@1007",
    role: "user",
    status: "active",
    rating: 5.0
});

describe('User Model Tests', () => {

    //case1
    it('should create a user with all valid attributes', async () => {
        const userData = {
            fullName: "Anil KC",
            email: "anil@gmail.com",
            phone: "9866052045",
            password: "Hello@1007",
            role: "user",
            status: "active",
            rating: 5.0
        };

        const user = await UserMock.create(userData);

        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
        expect(user.rating).toBe(5.0);
    });


    //case2 
    it('should apply the default role of "user" when no role is provided', async () => {
        const user = await UserMock.create({
            fullName: "Rajan",
            email: "rajan@gmail.com",
            phone: "1234567890",
            password: "Password123"
        });

        expect(user.role).toBe("user");
    });

    //case3
    it('should fail if rating is outside the range of 1 to 5', async () => {
        const invalidRating = 6.0;

        const createUser = async (data) => {
            if (data.rating < 1 || data.rating > 5) {
                throw new Error("Validation Error: Rating must be between 1 and 5");
            }
            return await UserMock.create(data);
        };

        await expect(createUser({
            fullName: "bikesh",
            rating: invalidRating
        })).rejects.toThrow("Rating must be between 1 and 5");
    });

});