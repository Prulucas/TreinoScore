/**
 * /**
 * ================================================================
 * Arquivo: Workout.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 *  * Descrição:
 * Modelo de Workout (Treino) para o sistema de gerenciamento de treinos.
 * Cada treino pertence a um usuário e possui título, descrição, dia da semana,
 * exercícios e status.
 */

export default (sequelize, DataTypes) => {
    const Workout = sequelize.define('Workout', {
        // ID único do treino
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // ID do usuário dono do treino
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        // Título do treino
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'O título do treino é obrigatório'
                },
                len: {
                    args: [3, 100],
                    msg: 'O título deve ter entre 3 e 100 caracteres'
                }
            }
        },
        // Descrição do treino (opcional)
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'A descrição não pode exceder 1000 caracteres'
                }
            }
        },
        // Dia da semana (1 = segunda, 7 = domingo)
        day: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[1, 2, 3, 4, 5, 6, 7]],
                    msg: 'O dia deve ser entre 1 (segunda) e 7 (domingo)'
                }
            }
        },
        // Lista de exercícios (JSON)
        exercises: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            validate: {
                isValidExercises(value) {
                    // Valida se é array
                    if (!Array.isArray(value)) {
                        throw new Error('Exercícios devem ser um array');
                    }
                    // Limita a 20 exercícios
                    if (value.length > 20) {
                        throw new Error('Máximo de 20 exercícios por treino');
                    }

                    // Valida cada exercício
                    value.forEach((ex, index) => {
                        if (!ex.name || typeof ex.name !== 'string') {
                            throw new Error(`Exercício ${index + 1}: Nome é obrigatório e deve ser texto`);
                        }
                        if (!ex.sets || !Number.isInteger(ex.sets) || ex.sets < 0 || ex.sets > 10) {
                            throw new Error(`Exercício ${index + 1}: Séries devem ser número inteiro (1-10)`);
                        }
                        if (!ex.reps || typeof ex.reps !== 'string') {
                            throw new Error(`Exercício ${index + 1}: Repetições são obrigatórias (ex: "8-12")`);
                        }
                        if (ex.rest && (!Number.isInteger(ex.rest) || ex.rest < 0 || ex.rest > 180)) {
                            throw new Error(`Exercício ${index + 1}: O descanso (rest) deve ser entre 30 e 180 segundos`);
                        }
                    });
                }
            }
        },
        // Status do treino
        status: {
            type: DataTypes.ENUM('active', 'completed', 'pending'),
            defaultValue: 'active',
            validate: {
                isIn: {
                    args: [['active', 'completed', 'pending']],
                    msg: 'Status inválido'
                }
            }
        }
    }, {
        tableName: 'workouts',
        timestamps: true, // createdAt e updatedAt automáticos
        paranoid: true,   // Soft delete (deletedAt)
        underscored: true, // Campos com snake_case no banco
        hooks: {
            // Antes de validar, ajusta nomes dos exercícios (remove espaços)
            beforeValidate: (workout) => {
                if (workout.exercises && Array.isArray(workout.exercises)) {
                    workout.exercises = workout.exercises.map(ex => ({
                        ...ex,
                        name: typeof ex.name === 'string' ? ex.name.trim() : ''
                    }));
                }
            }
        }
    });

    /**
     * Associação: Workout pertence a um User.
     */
    Workout.associate = (models) => {
        Workout.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE' // Deleta treinos ao deletar usuário
        });
    };

    /**
     * Método de instância para verificar se um usuário tem permissão
     * para acessar ou modificar o treino.
     * @param {Object} user - Usuário tentando acessar
     * @returns {boolean} true se permitido
     */
    Workout.prototype.checkPermission = function (user) {
        return user.role === 'admin' || this.userId === user.id;
    };

    /**
     * Método estático para criar treinos padrão para um novo usuário.
     * @param {number} userId - ID do usuário
     * @returns {Promise<Array>} Lista de treinos criados
     */
    Workout.createDefault = async (userId) => {
        // Treinos padrão (só exemplo para dia 1)
        const defaultWorkouts = [
            {
                day: 1,
                title: "Peito e Tríceps",
                exercises: [
                    { name: "Supino Reto", sets: 4, reps: "8-12", rest: 90 },
                    { name: "Supino Inclinado", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Crucifixo", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Tríceps Testa", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Tríceps Corda", sets: 3, reps: "12-15", rest: 60 }
                ]
            },
            // Outros dias poderiam ser adicionados aqui...
        ];

        // Transação para segurança
        const transaction = await sequelize.transaction();
        try {
            const createdWorkouts = [];
            for (const workout of defaultWorkouts) {
                const created = await Workout.create({
                    userId,
                    title: workout.title,
                    description: `Treino padrão - ${workout.title}`,
                    day: workout.day,
                    exercises: workout.exercises,
                    status: 'active'
                }, { transaction });

                createdWorkouts.push(created);
            }

            await transaction.commit();
            return createdWorkouts;
        } catch (error) {
            await transaction.rollback();
            throw new Error('Erro ao criar os treinos padrão');
        }
    };

    return Workout;
};
