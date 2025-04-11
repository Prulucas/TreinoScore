import db from '../models/Index.js';

export class WorkoutRepository {
    constructor() {
        this.Workout = db.Workout;
    }

    async create(workoutData) {
        try {
            return await this.Workout.create(workoutData);
        } catch (error) {
            console.error('Error creating workout:', error);
            throw new Error('Failed to create workout');
        }
    }

    async findById(id) {
        try {
            return await this.Workout.findByPk(id);
        } catch (error) {
            console.error('Error finding workout by id:', error);
            throw new Error('Failed to find workout');
        }
    }

    async findByUserId(userId, options = {}) {
        try {
            return await this.Workout.findAll({
                where: { userId },
                ...options
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
                day: 1, // Segunda-feira - Peito e Tríceps
                title: "Peito e Tríceps",
                exercises: [
                    { name: "Supino Reto", sets: 4, reps: "8-12", rest: 90 },
                    { name: "Supino Inclinado", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Crucifixo", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Tríceps Testa", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Tríceps Corda", sets: 3, reps: "12-15", rest: 60 }
                ]
            },
            {
                day: 2, // Terça-feira - Costas e Bíceps
                title: "Costas e Bíceps",
                exercises: [
                    { name: "Barra Fixa", sets: 4, reps: "6-10", rest: 90 },
                    { name: "Remada Curvada", sets: 3, reps: "8-12", rest: 90 },
                    { name: "Puxada Alta", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Rosca Direta", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Rosca Martelo", sets: 3, reps: "12-15", rest: 60 }
                ]
            },
            {
                day: 3, // Quarta-feira - Perna Completa
                title: "Pernas",
                exercises: [
                    { name: "Agachamento Livre", sets: 4, reps: "8-12", rest: 120 },
                    { name: "Leg Press", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Mesa Flexora", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Panturrilha Sentado", sets: 4, reps: "15-20", rest: 45 }
                ]
            },
            {
                day: 4, // Quinta-feira - Ombros e Trapézio
                title: "Ombros e Trapézio",
                exercises: [
                    { name: "Desenvolvimento Militar", sets: 4, reps: "8-12", rest: 90 },
                    { name: "Elevação Lateral", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Elevação Frontal", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Encolhimento com Barra", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Remada Alta", sets: 3, reps: "10-12", rest: 60 }
                ]
            },
            {
                day: 5, // Sexta-feira - Full Body
                title: "Full Body",
                exercises: [
                    { name: "Agachamento Sumô", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Supino Reto", sets: 3, reps: "8-10", rest: 90 },
                    { name: "Barra Fixa", sets: 3, reps: "6-8", rest: 90 },
                    { name: "Desenvolvimento Arnold", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Abdominal Infra", sets: 3, reps: "15-20", rest: 45 }
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
}