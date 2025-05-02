import db from '../models/Index.js';

export class WorkoutRepository {
    constructor() {
        this.Workout = db.Workout;
    }

    async create(workoutData) {
        return await this.Workout.create(workoutData);
    }

    async findOneByDay(userId, day) {
        return await this.Workout.findOne({
            where: { userId, day }
        });
    }

    async findById(id) {
        try {
            return await this.Workout.findByPk(id); // Utilizando findByPk já que estamos buscando pelo ID
        } catch (error) {
            console.error('Error finding workout by id:', error);
            throw new Error('Failed to find workout');
        }
    }

    async findOne(criteria) {
        try {
            return await this.Workout.findOne({
                where: criteria // Já recebe o objeto formatado corretamente
            });
        } catch (error) {
            console.error('Error finding workout by criteria:', error);
            throw new Error('Failed to find workout');
        }
    }

    async findByUserId(userId, options = {}) {
        try {
            return await this.Workout.findAll({
                where: { userId },
                ...options,
            });
        } catch (error) {
            console.error('Error finding workouts by user:', error);
            throw new Error('Failed to find user workouts');
        }
    }

    async update(id, workoutData) {
        const transaction = await db.sequelize.transaction();
        try {
            const workout = await this.Workout.findByPk(id);
            if (!workout) {
                await transaction.rollback();
                return null;
            }

            const updatedWorkout = await workout.update(workoutData, { transaction });
            await transaction.commit();
            return updatedWorkout;
        } catch (error) {
            await transaction.rollback();
            console.error('Error updating workout:', error);
            throw new Error('Failed to update workout');
        }
    }

    async delete(id) {
        const transaction = await db.sequelize.transaction();
        try {
            const workout = await this.Workout.findByPk(id);
            if (!workout) {
                await transaction.rollback();
                return false;
            }

            await workout.destroy({ transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting workout:', error);
            throw new Error('Failed to delete workout');
        }
    }

    async createDefaultWorkouts(userId) {
        const defaultWorkouts = [
            {
                day: 1,
                title: "Treino 1",
                exercises: [
                    { name: "Exercício 1", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 2", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 3", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 4", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 5", sets: 0, reps: "0-0", rest: 0 }
                ]
            },
            {
                day: 2,
                title: "Treino 2",
                exercises: [
                    { name: "Exercício 1", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 2", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 3", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 4", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 5", sets: 0, reps: "0-0", rest: 0 }
                ]
            },
            {
                day: 3,
                title: "Treino 3",
                exercises: [
                    { name: "Exercício 1", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 2", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 3", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 4", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 5", sets: 0, reps: "0-0", rest: 0 }
                ]
            },
            {
                day: 4,
                title: "Treino 4",
                exercises: [
                    { name: "Exercício 1", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 2", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 3", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 4", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 5", sets: 0, reps: "0-0", rest: 0 }
                ]
            },
            {
                day: 5,
                title: "Treino 5",
                exercises: [
                    { name: "Exercício 1", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 2", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 3", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 4", sets: 0, reps: "0-0", rest: 0 },
                    { name: "Exercício 5", sets: 0, reps: "0-0", rest: 0 }
                ]
            }
        ];

        const transaction = await db.sequelize.transaction();
        try {
            const createdWorkouts = [];

            for (const workout of defaultWorkouts) {
                const created = await this.Workout.create({
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
            console.error('Error creating default workouts:', error);
            throw new Error('Failed to create default workouts');
        }
    }

    async countUserWorkouts(userId) {
        try {
            return await this.Workout.count({ where: { userId } });
        } catch (error) {
            console.error('Error counting user workouts:', error);
            throw new Error('Failed to count workouts');
        }
    }

    async deleteByUserId(userId) {
        try {
            // Mudança de db.workouts para db.Workout
            return await db.Workout.destroy({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            console.error('Error deleting workouts by userId:', error);
            throw new Error('Failed to delete workouts');
        }
    }


}

const workoutRepository = new WorkoutRepository();
export default workoutRepository;