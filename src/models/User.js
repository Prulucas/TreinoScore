/**
 * ================================================================
 * Arquivo: User.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo define o modelo `User` utilizando Sequelize para 
 * representar usuários do sistema. Inclui validações, criptografia 
 * de senha com bcrypt, e métodos para autenticação.
 */

import { DataTypes } from 'sequelize'; // Tipos do Sequelize
import bcrypt from 'bcrypt'; // Biblioteca para criptografar senhas
import sequelize from '../database/db.js';


// Define o modelo User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'O nome não pode estar vazio' },
            len: {
                args: [2, 255],
                msg: 'O nome deve ter entre 2 e 255 caracteres'
            }
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Este nome de usuário já está em uso' },
        validate: {
            notEmpty: { msg: 'O username não pode estar vazio' },
            len: {
                args: [3, 255],
                msg: 'O username deve ter entre 3 e 255 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Este email já está cadastrado' },
        validate: {
            isEmail: { msg: 'Por favor, insira um email válido' },
            notEmpty: { msg: 'O email não pode estar vazio' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'A senha não pode estar vazia' },
            len: {
                args: [6, 255],
                msg: 'A senha deve ter pelo menos 6 caracteres'
            }
        }
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "CPF é obrigatório" },
            len: {
                args: [11, 11],
                msg: "CPF deve ter exatamente 11 caracteres"
            },
            isNumeric: { msg: "CPF deve conter apenas números" }
        }
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'default-avatar.jpg',
        validate: {
            isUrl: {
                msg: 'O avatar deve ser uma URL válida',
                args: {
                    protocols: ['http', 'https'],
                    require_protocol: true
                }
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.ENUM('aluno', 'professor', 'admin'),
        allowNull: false,
        defaultValue: 'aluno',
        validate: {
            isIn: {
                args: [['aluno', 'professor', 'admin']],
                msg: 'O role deve ser aluno, professor ou admin'
            }
        }
    }
}, {
    tableName: 'Users', // Nome da tabela no banco
    timestamps: true,   // Adiciona createdAt e updatedAt
    hooks: {
        // Hook para criptografar senha antes de criar usuário
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hook para criptografar senha antes de atualizar usuário
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            user.updatedAt = new Date(); // Atualiza data de modificação
        }
    }
});

/**
 * Método da instância do modelo:
 * Compara uma senha informada com a senha criptografada do usuário.
 */
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Método da instância do modelo:
 * Retorna os dados públicos do usuário, ocultando a senha e datas.
 */
User.prototype.getPublicData = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    return values;
};

export default User;
