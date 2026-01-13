import pb from '../client';

const COLLECTION = 'tasks';

export const tasksService = {
    // Obtener con paginación y filtros
    async getList({ page = 1, perPage = 10, status = '', search = '' } = {}) {
        try {
            let filter = '';
            const filters = [];

            if (status) {
                filters.push(`status = "${status}"`);
            }

            if (search) {
                filters.push(`(title ~ "${search}" || description ~ "${search}")`);
            }

            filter = filters.join(' && ');

            const result = await pb.collection(COLLECTION).getList(page, perPage, {
                sort: '-created',
                filter,
            });

            return result;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener tareas');
        }
    },

    // Obtener todos (sin paginación)
    async getAll() {
        try {
            const records = await pb.collection(COLLECTION).getFullList({
                sort: '-created',
            });
            return records;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener tareas');
        }
    },

    async getOne(id) {
        try {
            const record = await pb.collection(COLLECTION).getOne(id);
            return record;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener tarea');
        }
    },

    async create(data) {
        try {
            const record = await pb.collection(COLLECTION).create(data);
            return record;
        } catch (error) {
            throw new Error(error.message || 'Error al crear tarea');
        }
    },

    async update(id, data) {
        try {
            const record = await pb.collection(COLLECTION).update(id, data);
            return record;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar tarea');
        }
    },

    async delete(id) {
        try {
            await pb.collection(COLLECTION).delete(id);
            return true;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar tarea');
        }
    },
};
