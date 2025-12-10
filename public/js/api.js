// API Base URL - Production'da otomatik, development'ta local
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api' 
    : '/api';

// API Helper Functions
const api = {
    // Request helper
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            // Response'un JSON olup olmadığını kontrol et
            const contentType = response.headers.get('content-type');
            let data;
            
            try {
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    const text = await response.text();
                    // Boş response kontrolü
                    if (!text) {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return null;
                    }
                    throw new Error(text || 'Sunucu hatası');
                }
            } catch (parseError) {
                // JSON parse hatası
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                throw parseError;
            }

            if (!response.ok) {
                const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            // Network hatası veya diğer hatalar
            if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
                throw new Error('Sunucuya bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.');
            }
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        async register(name, email, password) {
            return api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
        },

        async login(email, password) {
            return api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async getMe() {
            return api.request('/auth/me');
        }
    },

    // Users endpoints (Admin)
    users: {
        async getAll() {
            return api.request('/users');
        },

        async create(name, email, password, role) {
            return api.request('/users', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role })
            });
        },

        async update(id, data) {
            return api.request(`/users/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        },

        async delete(id) {
            return api.request(`/users/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Categories endpoints
    categories: {
        async getAll() {
            return api.request('/categories');
        },

        async create(name) {
            return api.request('/categories', {
                method: 'POST',
                body: JSON.stringify({ name })
            });
        },

        async update(id, name) {
            return api.request(`/categories/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ name })
            });
        },

        async delete(id) {
            return api.request(`/categories/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Companies endpoints
    companies: {
        async getAll(categoryId = null) {
            const query = categoryId ? `?categoryId=${categoryId}` : '';
            return api.request(`/companies${query}`);
        },

        async create(categoryId, name, address, workingHours) {
            return api.request('/companies', {
                method: 'POST',
                body: JSON.stringify({ categoryId, name, address, workingHours })
            });
        },

        async update(id, data) {
            return api.request(`/companies/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        },

        async delete(id) {
            return api.request(`/companies/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Appointments endpoints
    appointments: {
        async getAvailable(companyId, date) {
            return api.request(`/appointments/available?companyId=${companyId}&date=${date}`);
        },

        async create(companyId, date, time) {
            return api.request('/appointments', {
                method: 'POST',
                body: JSON.stringify({ companyId, date, time })
            });
        },

        async getMy() {
            return api.request('/appointments/my');
        },

        async cancel(id) {
            return api.request(`/appointments/cancel/${id}`, {
                method: 'PATCH'
            });
        },

        async getAll() {
            return api.request('/appointments/all');
        },

        async update(id, status) {
            return api.request(`/appointments/update/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        }
    }
};

