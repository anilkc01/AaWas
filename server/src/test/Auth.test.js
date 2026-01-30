import { registerUser, loginUser } from "../../controllers/AuthController.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Mock the User model and bcrypt
jest.mock("../models/User.js");
jest.mock("bcrypt");
jest.mock("../Security/jwt-utils.js", () => ({
  generateToken: jest.fn(() => "mock-token"),
}));

describe("Auth Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // --- PASSING CASES ---

  it("PASS: Should register a user successfully", async () => {
    req.body = {
      fullName: "Anil KC",
      email: "anil@test.com",
      phone: "9866052045",
      password: "Password123",
      rePassword: "Password123",
    };

    User.findOne.mockResolvedValue(null); // No existing user
    User.create.mockResolvedValue(req.body);
    bcrypt.hash.mockResolvedValue("hashed_pwd");

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
  });

  it("PASS: Should login successfully with correct credentials", async () => {
    req.body = { email: "anil@test.com", password: "Password123" };
    
    const mockUser = { 
      id: 1, 
      email: "anil@test.com", 
      password: "hashed_pwd", 
      status: "active" 
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Login successful" }));
  });

  it("PASS: Should catch password mismatch during registration", async () => {
    req.body = {
      fullName: "Anil", email: "a@b.com", phone: "123",
      password: "Pass1", rePassword: "Pass2" // Mismatch
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toBeCalledWith({
      errors: { rePassword: "Passwords do not match." }
    });
  });

  it("PASS: Should send 404 if email not found during login", async () => {
    req.body = { email: "wrong@test.com", password: "any" };
    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "EMAIL_NOT_FOUND" }));
  });


  // --- FAILING CASES ---

  it("FAIL: Should fail registration if email is already registered", async () => {
    req.body = {
      fullName: "Anil", email: "exists@test.com", phone: "123",
      password: "Password123", rePassword: "Password123"
    };

    // Mock that a user WAS found
    User.findOne.mockResolvedValue({ email: "exists@test.com" });

    await registerUser(req, res);

    // This fails if the controller returns 201 instead of 409
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      errors: { email: "Email already registered." }
    });
  });

  it("FAIL: Should deny access if account status is suspended", async () => {
    req.body = { email: "bad@test.com", password: "Password123" };
    
    const suspendedUser = { id: 2, status: "suspended" };
    User.findOne.mockResolvedValue(suspendedUser);

    await loginUser(req, res);

    // This fails if the controller lets a suspended user log in
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "ACCOUNT_SUSPENDED" }));
  });
});