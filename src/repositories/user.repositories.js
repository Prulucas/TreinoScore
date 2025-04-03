import User from "../models/User.js";

const findByEmailUserRepository = async (email) => {
    const user = await User.findOne({
        where: { email },
        attributes: ["id", "name", "email", "password", "role"], // Garante que a senha vem junto
    });

    console.log("Usuário encontrado:", user); // Debug
    return user;
};



const createUserRepository = (body) => User.create(body);

const findAllRepository = () => User.findAll();

const findByIdRepository = (id) => User.findByPk(id);

const updateRepository = (id, body) =>
    User.update(body, { where: { id } });

const deleteRepository = (id) => User.destroy({ where: { id } });

export default {
    findByEmailUserRepository,
    createUserRepository,
    findAllRepository,
    findByIdRepository,
    updateRepository,
    deleteRepository
};