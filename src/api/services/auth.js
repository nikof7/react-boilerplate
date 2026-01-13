import pb from '../client';

export const authService = {
    async login(email, password) {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            return authData;
        } catch (error) {
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    },

    async register(email, password, passwordConfirm) {
        try {
            const user = await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
            });
            return user;
        } catch (error) {
            throw new Error(error.message || 'Error al registrar usuario');
        }
    },

    logout() {
        pb.authStore.clear();
    },

    getCurrentUser() {
        return pb.authStore.record;
    },

    isAuthenticated() {
        return pb.authStore.isValid;
    },
};
