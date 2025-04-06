import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import userRepositories from "../repositories/user.repositories.js";

function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET_JWT, { expiresIn: 86400 });
}

const loginService = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await userRepositories.findByEmailUserRepository(email);
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.password) {
        throw new Error("No password set for this user");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = generateToken(user.id);

    console.log("Senha digitada:", password);
    console.log("Senha armazenada:", user.password);
    console.log("A senha é válida?", isPasswordValid);

    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


export default { generateToken, loginService };
