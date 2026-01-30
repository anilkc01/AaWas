const SequilizeMock = require('sequelize-mock');
const dbMock = new SequilizeMock();


const UserMock = dbMock.define('User', {
    id: 3,
    fullName: "Anil KC",
    email:"anil5@gmail.com",
    phone:"9866052045",
    password:"Hello@1007",
    role: "user",
    status: "active",
    rating: 5.0
});

describe('User Model', () => {
    it('should create a user with valid attributes', async () => {
        const user = await UserMock.create({
            fullName: "Anil KC",
            email:"anil@gmail.com",
            phone:"9866052045",
            password:"Hello@1007",
            role: "user",
            status: "active",
            rating: 5.0
        });

        expect(user.fullName).toBe("Anil KC");
        expect(user.email).toBe("anil@gmail.com");
        expect(user.phone).toBe("9866052045");
        expect(user.password).toBe("Hello@1007");
        expect(user.role).toBe("user");
        expect(user.status).toBe("active");
        expect(user.rating).toBe(5.0);
    });

    it('should enforce unique email constraint', async () => {
        
        try {
            await UserMock.create({
                fullName: "Test User",
                email:"test@gmail.com",
                phone:"9866052045",
                password:"Hello@1007",
                role: "user",
                status: "active",
                rating: 5.0
            });
            await expect( UserMock.create({
                fullName: "Test User2",
                email:"test1@gmail.com",
                phone:"9866052045",
                password:"Hello@1007",
                role: "user",
                status: "active",
                rating: 5.0
            })
        ).rejects.toThrow("email must be unique");
        
    });
    });