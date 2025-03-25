import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

// Função de validação de CPF
const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');

    // Verifica tamanho e dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Cálculo dos dígitos verificadores
    const calcularDigito = (slice) => {
        let soma = 0;
        for (let i = 0; i < slice.length; i++) {
            soma += parseInt(slice[i]) * (slice.length + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const digito1 = calcularDigito(cpf.slice(0, 9));
    const digito2 = calcularDigito(cpf.slice(0, 10));

    return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
};

const User = sequelize.define('User', {
    // ... outros campos ...
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            isCpfValid(value) {
                if (!validarCPF(value)) {
                    throw new Error('CPF inválido');
                }
            }
        }
    },
    // ... outros campos ...
});

export default User;