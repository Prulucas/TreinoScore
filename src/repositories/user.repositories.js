import User from "../models/User.js";


const findByEmailUserRepository = async (email) => {
    return await User.findOne({
        where: { email }
    });
};



const createUserRepository = (body) => User.create(body);

const findAllRepository = () => User.findAll();

const findByIdRepository = (id) => User.findByPk(id);

const updateRepository = (id, body) =>
    User.update(body, { where: { id } });

const deleteRepository = (id) => User.destroy({ where: { id } });

const findByCpfUserRepository = async (cpf) => {
    const user = await User.findOne({ where: { cpf } });
    return user || null; // Retorna null se não encontrar o usuário
};


export default {
    findByEmailUserRepository,
    createUserRepository,
    findAllRepository,
    findByIdRepository,
    updateRepository,
    deleteRepository,
    findByCpfUserRepository
};