// Authentication Management
let currentUser = null;

// Initialize auth
function initAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        loadUser();
    } else {
        updateNavForGuest();
    }
}

// Load current user
async function loadUser() {
    try {
        const data = await api.auth.getMe();
        // User objesini normalize et (id ve _id tutarlılığı için)
        currentUser = {
            id: data.user.id || data.user._id,
            _id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
        };
        updateNavForUser();
    } catch (error) {
        console.error('Kullanıcı bilgileri yüklenemedi:', error);
        logout();
    }
}

// Update navigation for logged in user
function updateNavForUser() {
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navRegister').style.display = 'none';
    document.getElementById('navLogout').style.display = 'block';
    document.getElementById('navMyAppointments').style.display = 'block';
    
    if (currentUser && currentUser.role === 'admin') {
        document.getElementById('navAdmin').style.display = 'block';
    } else {
        document.getElementById('navAdmin').style.display = 'none';
    }
}

// Update navigation for guest
function updateNavForGuest() {
    document.getElementById('navLogin').style.display = 'block';
    document.getElementById('navRegister').style.display = 'block';
    document.getElementById('navLogout').style.display = 'none';
    document.getElementById('navMyAppointments').style.display = 'none';
    document.getElementById('navAdmin').style.display = 'none';
    currentUser = null;
}

// Login
async function login(email, password) {
    try {
        if (!email || !password) {
            showMessage('Lütfen email ve şifre girin.', 'error');
            return false;
        }

        const data = await api.auth.login(email, password);
        
        if (!data || !data.token) {
            showMessage('Giriş başarısız. Lütfen tekrar deneyin.', 'error');
            return false;
        }

        localStorage.setItem('token', data.token);
        // User objesini normalize et (id ve _id tutarlılığı için)
        currentUser = {
            id: data.user.id || data.user._id,
            _id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
        };
        updateNavForUser();
        closeAuthModal();
        showMessage('Giriş başarılı! Hoş geldiniz!', 'success');
        // Giriş yapıldıktan sonra ana sayfayı göster
        setTimeout(() => {
            showHomePage();
        }, 500);
        return true;
    } catch (error) {
        console.error('Login hatası:', error);
        showMessage(error.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
        return false;
    }
}

// Register
async function register(name, email, password) {
    try {
        if (!name || !email || !password) {
            showMessage('Lütfen tüm alanları doldurun.', 'error');
            return false;
        }

        if (password.length < 6) {
            showMessage('Şifre en az 6 karakter olmalıdır.', 'error');
            return false;
        }

        const data = await api.auth.register(name, email, password);
        
        if (!data || !data.token) {
            showMessage('Kayıt başarısız. Lütfen tekrar deneyin.', 'error');
            return false;
        }

        localStorage.setItem('token', data.token);
        // User objesini normalize et (id ve _id tutarlılığı için)
        currentUser = {
            id: data.user.id || data.user._id,
            _id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
        };
        updateNavForUser();
        closeAuthModal();
        showMessage('Kayıt başarılı! Hoş geldiniz!', 'success');
        // Kayıt yapıldıktan sonra ana sayfayı göster
        setTimeout(() => {
            showHomePage();
        }, 500);
        return true;
    } catch (error) {
        console.error('Register hatası:', error);
        showMessage(error.message || 'Kayıt yapılamadı. Lütfen tekrar deneyin.', 'error');
        return false;
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateNavForGuest();
    showHomePage();
    showMessage('Çıkış yapıldı', 'info');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Show message
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at top of main content
    const mainContent = document.getElementById('mainContent');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Auth Modal Functions
function openAuthModal(isLogin = true) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const authSwitch = document.getElementById('authSwitch');

    if (isLogin) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = 'Giriş Yap';
        authSwitch.innerHTML = 'Hesabınız yok mu? <a href="#" id="switchToRegister">Kayıt Ol</a>';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'Kayıt Ol';
        authSwitch.innerHTML = 'Zaten hesabınız var mı? <a href="#" id="switchToLogin">Giriş Yap</a>';
    }

    modal.style.display = 'block';

    // Add event listeners
    document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(false);
    });
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(true);
    });
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

// Initialize auth modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close modal on X click
    document.querySelector('.close').addEventListener('click', closeAuthModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('authModal');
        if (e.target === modal) {
            closeAuthModal();
        }
    });

    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await login(email, password);
    });

    // Register form submit
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        await register(name, email, password);
    });

    // Navigation links
    document.getElementById('navLogin').addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(true);
    });

    document.getElementById('navRegister').addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(false);
    });

    document.getElementById('navLogout').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Initialize auth
    initAuth();
});

