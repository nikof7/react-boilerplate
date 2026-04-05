import pb from '../client';

const COLLECTION = 'users';

export const usersService = {
    // Obtener todos los usuarios (para selects)
    async getAll() {
        try {
            const records = await pb.collection(COLLECTION).getFullList({
                sort: 'name,email',
            });
            return records;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener usuarios');
        }
    },

    async getOne(id) {
        try {
            const record = await pb.collection(COLLECTION).getOne(id);
            return record;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener usuario');
        }
    },
};
