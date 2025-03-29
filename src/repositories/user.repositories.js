import User from "../models/User.js";

const findByEmailUserRepository = (email) =>
    User.findOne({ where: { email } });

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