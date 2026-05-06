import axios from 'axios';

// Konfigurasi URL backend
// Karena Anda pakai Laragon, ini bisa disesuaikan dengan virtual host Anda
// Misalnya: http://mentorin-connect.test/backend/public/api atau http://localhost:8000/api
const API_URL = 'http://localhost:8000/api'; 
// Jika Anda menyalakan 'php artisan serve', ganti ke 'http://localhost:8000/api'

// Setup Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor untuk menambahkan token otomatis
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// FUNGSI-FUNGSI API YANG SANGAT MUDAH DIGUNAKAN DI REACT:

export const authAPI = {
    // Fungsi Login
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: 'Gagal login' };
        }
    },

    // Fungsi Register
    register: async (name, email, password) => {
        try {
            const response = await api.post('/register', { name, email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: 'Gagal register' };
        }
    },

    // Fungsi Logout
    logout: async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Upload Avatar
    uploadAvatar: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            
            const response = await api.post('/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response?.data || { success: false, message: 'Gagal upload' };
        }
    },

    // Cek User Aktif
    getUser: () => {
        const user = localStorage.getItem('mentorin_user_v1'); // Gunakan key yang benar
        return user ? JSON.parse(user) : null;
    }
};

export const usersAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/users');
            return response.data.data; // Array of users
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    create: async (data) => {
        try {
            const response = await api.post('/users', data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    }
};

export const classesAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/classes');
            return response.data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    create: async (data) => {
        try {
            const response = await api.post('/classes', data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.put(`/classes/${id}`, data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/classes/${id}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    }
};

export const bookingsAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/bookings');
            return response.data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    create: async (data) => {
        try {
            const response = await api.post('/bookings', data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.put(`/bookings/${id}`, data);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false };
        }
    }
};

export const reviewsAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/reviews');
            return response.data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};

export default api;
