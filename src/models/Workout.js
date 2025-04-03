// src/models/Workout.js
export default (sequelize, DataTypes) => {
    const Workout = sequelize.define('Workout', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
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
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'A descrição não pode exceder 1000 caracteres'
                }
            }
        },
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
        exercises: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            validate: {
                isValidExercises(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Exercícios devem ser um array');
                    }
                    if (value.length > 20) {
                        throw new Error('Máximo de 20 exercícios por treino');
                    }

                    value.forEach((ex, index) => {
                        if (!ex.name || typeof ex.name !== 'string') {
                            throw new Error(`Exercício ${index + 1}: Nome é obrigatório e deve ser texto`);
                        }
                        if (!ex.sets || !Number.isInteger(ex.sets) || ex.sets < 1 || ex.sets > 10) {
                            throw new Error(`Exercício ${index + 1}: Séries devem ser número inteiro (1-10)`);
                        }
                        if (!ex.reps || typeof ex.reps !== 'string') {
                            throw new Error(`Exercício ${index + 1}: Repetições são obrigatórias (ex: "8-12")`);
                        }
                    });
                }
            }
        },
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
        timestamps: true,
        paranoid: true, // Para soft delete
        underscored: true,
        hooks: {
            beforeValidate: (workout) => {
                if (workout.exercises && Array.isArray(workout.exercises)) {
                    workout.exercises = workout.exercises.map(ex => ({
                        ...ex,
                        name: ex.name.trim()
                    }));
                }
            }
        }
    });

    Workout.associate = (models) => {
        Workout.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    // Método de instância para verificar permissões
    Workout.prototype.checkPermission = function (user) {
        return user.role === 'admin' || this.userId === user.id;
    };

    // Método estático para criar treino padrão
    Workout.createDefault = async (userId) => {
        return Workout.create({
            userId,
            title: "Treino Inicial",
            day: 1,
            exercises: [
                { name: "Agachamento Livre", sets: 3, reps: "10-12" },
                { name: "Flexão de Braço", sets: 3, reps: "8-10" },
                { name: "Abdominal", sets: 3, reps: "15-20" }
            ],
            isDefault: true
        });
    };

    return Workout;
};