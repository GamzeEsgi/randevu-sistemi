// Global state
let currentCategory = null;
let currentCompany = null;
let selectedDate = null;
let selectedTime = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }

    // Navigation event listeners
    document.getElementById('navHome')?.addEventListener('click', (e) => {
        e.preventDefault();
        showHomePage();
    });

    document.getElementById('navMyAppointments')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAuthenticated()) {
            showMyAppointmentsPage();
        } else {
            openAuthModal(true);
        }
    });

    document.getElementById('navAdmin')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAdmin()) {
            showAdminPage();
        } else {
            showMessage('Admin yetkisi gereklidir.', 'error');
        }
    });

    // Back buttons
    document.getElementById('backFromCompanies')?.addEventListener('click', () => {
        showHomePage();
    });

    document.getElementById('backFromTimeSlots')?.addEventListener('click', () => {
        showCompaniesPage();
    });

    // Load time slots button
    document.getElementById('loadTimeSlotsBtn')?.addEventListener('click', () => {
        loadTimeSlots();
    });

    // Admin tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.getAttribute('data-tab');
            if (tab) {
                showAdminTab(tab);
            }
        });
    });

    // Category cancel button
    document.getElementById('categoryCancelBtn')?.addEventListener('click', () => {
        cancelCategoryEdit();
    });

    // Company cancel button
    document.getElementById('companyCancelBtn')?.addEventListener('click', () => {
        cancelCompanyEdit();
    });

    // User cancel button
    document.getElementById('userCancelBtn')?.addEventListener('click', () => {
        cancelUserEdit();
    });

    // İlk yüklemede giriş kontrolü
    if (!isAuthenticated()) {
        // Giriş yapılmamışsa modal'ı göster
        setTimeout(() => {
            openAuthModal(true);
            showMessage('Randevu almak için lütfen giriş yapın veya kayıt olun.', 'info');
        }, 500);
    } else {
        // Giriş yapılmışsa kategorileri yükle
        loadCategories();
    }
});

// ===== Page Navigation =====
function showHomePage() {
    hideAllPages();
    document.getElementById('homePage').style.display = 'block';
    
    // Giriş kontrolü
    if (!isAuthenticated()) {
        // Giriş yapılmamışsa hoş geldin mesajı göster
        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('categoriesSection').style.display = 'none';
    } else {
        // Giriş yapılmışsa kategorileri göster
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('categoriesSection').style.display = 'block';
        loadCategories();
    }
}

function showCompaniesPage() {
    // Giriş kontrolü
    if (!isAuthenticated()) {
        openAuthModal(true);
        showMessage('Randevu almak için lütfen giriş yapın.', 'info');
        return;
    }
    
    if (!currentCategory) {
        showHomePage();
        return;
    }
    hideAllPages();
    document.getElementById('companiesPage').style.display = 'block';
    document.getElementById('categoryTitle').textContent = `${currentCategory.name} - Şirketler`;
    loadCompanies(currentCategory._id);
}

function showTimeSlotsPage() {
    // Giriş kontrolü
    if (!isAuthenticated()) {
        openAuthModal(true);
        showMessage('Randevu almak için lütfen giriş yapın.', 'info');
        return;
    }
    
    if (!currentCompany) {
        showCompaniesPage();
        return;
    }
    hideAllPages();
    document.getElementById('timeSlotsPage').style.display = 'block';
    document.getElementById('companyTitle').textContent = `${currentCompany.name} - Randevu Saatleri`;
    
    // Set default date
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    loadTimeSlots();
}

function showMyAppointmentsPage() {
    if (!isAuthenticated()) {
        openAuthModal(true);
        return;
    }
    hideAllPages();
    document.getElementById('myAppointmentsPage').style.display = 'block';
    loadMyAppointments();
}

function showAdminPage() {
    if (!isAdmin()) {
        showMessage('Admin yetkisi gereklidir.', 'error');
        return;
    }
    hideAllPages();
    document.getElementById('adminPage').style.display = 'block';
    showAdminTab('categories');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
}

// ===== Categories =====
async function loadCategories() {
    // Giriş kontrolü
    if (!isAuthenticated()) {
        showMessage('Randevu almak için lütfen giriş yapın.', 'info');
        return;
    }
    
    try {
        const categories = await api.categories.getAll();
        const container = document.getElementById('categoriesContainer');
        
        if (categories.length === 0) {
            container.innerHTML = '<p>Henüz kategori eklenmemiş.</p>';
            return;
        }

        container.innerHTML = categories.map(category => `
            <div class="category-card" onclick="selectCategory('${category._id}', '${category.name}')">
                <h3>${category.name}</h3>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Kategoriler yüklenemedi: ' + error.message, 'error');
    }
}

function selectCategory(categoryId, categoryName) {
    // Giriş kontrolü
    if (!isAuthenticated()) {
        openAuthModal(true);
        showMessage('Randevu almak için lütfen giriş yapın.', 'info');
        return;
    }
    
    currentCategory = { _id: categoryId, name: categoryName };
    currentCompany = null;
    showCompaniesPage();
}

// ===== Companies =====
async function loadCompanies(categoryId) {
    try {
        const companies = await api.companies.getAll(categoryId);
        const container = document.getElementById('companiesContainer');
        
        if (companies.length === 0) {
            container.innerHTML = '<p>Bu kategoride henüz şirket eklenmemiş.</p>';
            return;
        }

        container.innerHTML = companies.map(company => `
            <div class="company-card" onclick="selectCompany('${company._id}', '${company.name}', '${company.workingHours.start}', '${company.workingHours.end}')">
                <h3>${company.name}</h3>
                <p>📍 ${company.address}</p>
                <p class="working-hours">🕐 ${company.workingHours.start} - ${company.workingHours.end}</p>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Şirketler yüklenemedi: ' + error.message, 'error');
    }
}

function selectCompany(companyId, companyName, startTime, endTime) {
    currentCompany = {
        _id: companyId,
        name: companyName,
        workingHours: { start: startTime, end: endTime }
    };
    showTimeSlotsPage();
}

// ===== Time Slots =====
async function loadTimeSlots() {
    if (!currentCompany) {
        showMessage('Lütfen önce bir şirket seçin.', 'error');
        return;
    }

    const dateInput = document.getElementById('appointmentDate');
    const date = dateInput.value;

    if (!date) {
        showMessage('Lütfen bir tarih seçin.', 'error');
        return;
    }

    selectedDate = date;

    try {
        const data = await api.appointments.getAvailable(currentCompany._id, date);
        const container = document.getElementById('timeSlotsContainer');
        
        if (data.slots.length === 0) {
            container.innerHTML = '<p>Bu tarih için müsait saat bulunmuyor.</p>';
            return;
        }

        container.innerHTML = data.slots.map(slot => `
            <div class="time-slot ${slot.available ? 'available' : 'booked'}" 
                 ${slot.available ? `onclick="selectTimeSlot('${slot.time}')"` : ''}>
                ${slot.time}
                ${slot.available ? '✓' : '✗'}
            </div>
        `).join('');
    } catch (error) {
        showMessage('Saatler yüklenemedi: ' + error.message, 'error');
    }
}

function selectTimeSlot(time) {
    if (!isAuthenticated()) {
        openAuthModal(true);
        return;
    }

    selectedTime = time;
    
    // Highlight selected slot
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
        if (slot.textContent.includes(time)) {
            slot.classList.add('selected');
        }
    });
    
    // Create appointment
    createAppointment();
}

async function createAppointment() {
    if (!currentCompany || !selectedDate || !selectedTime) {
        showMessage('Lütfen tüm bilgileri seçin.', 'error');
        return;
    }

    try {
        await api.appointments.create(currentCompany._id, selectedDate, selectedTime);
        showMessage('Randevu başarıyla oluşturuldu!', 'success');
        
        // Reset and reload
        selectedTime = null;
        setTimeout(() => {
            loadTimeSlots();
        }, 1000);
    } catch (error) {
        showMessage('Randevu oluşturulamadı: ' + error.message, 'error');
    }
}

// ===== My Appointments =====
async function loadMyAppointments() {
    try {
        const appointments = await api.appointments.getMy();
        const container = document.getElementById('appointmentsContainer');
        
        if (appointments.length === 0) {
            container.innerHTML = '<p>Henüz randevunuz bulunmuyor.</p>';
            return;
        }

        container.innerHTML = appointments.map(appointment => {
            const statusText = {
                'pending': 'Beklemede',
                'approved': 'Onaylandı',
                'cancelled': 'İptal Edildi'
            };

            const canCancel = appointment.status === 'pending' || appointment.status === 'approved';
            
            return `
                <div class="appointment-card">
                    <div class="appointment-info">
                        <h3>${appointment.companyId.name}</h3>
                        <p>📍 ${appointment.companyId.address}</p>
                        <p>📅 ${new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                        <p>🕐 ${appointment.time}</p>
                        <span class="appointment-status ${appointment.status}">
                            ${statusText[appointment.status]}
                        </span>
                    </div>
                    <div class="appointment-actions">
                        ${canCancel ? `
                            <button class="btn-danger" onclick="cancelAppointment('${appointment._id}')">
                                İptal Et
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        showMessage('Randevular yüklenemedi: ' + error.message, 'error');
    }
}

async function cancelAppointment(appointmentId) {
    if (!confirm('Randevuyu iptal etmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await api.appointments.cancel(appointmentId);
        showMessage('Randevu iptal edildi.', 'success');
        loadMyAppointments();
    } catch (error) {
        showMessage('Randevu iptal edilemedi: ' + error.message, 'error');
    }
}

// ===== Admin Panel =====
function showAdminTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`).style.display = 'block';
    
    // Add active class to button with matching data-tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
    
    // Load data for the tab
    if (tab === 'categories') {
        loadAdminCategories();
    } else if (tab === 'companies') {
        loadAdminCompanies();
    } else if (tab === 'appointments') {
        loadAdminAppointments();
    } else if (tab === 'users') {
        loadAdminUsers();
    }
}

// Admin Categories
async function loadAdminCategories() {
    try {
        const categories = await api.categories.getAll();
        const container = document.getElementById('categoriesList');
        
        container.innerHTML = categories.map(category => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${category.name}</h4>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-secondary" onclick="editCategory('${category._id}', '${category.name}')">
                        Düzenle
                    </button>
                    <button class="btn-danger" onclick="deleteCategory('${category._id}')">
                        Sil
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Kategoriler yüklenemedi: ' + error.message, 'error');
    }
}

document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    const id = document.getElementById('categoryId').value;

    try {
        if (id) {
            await api.categories.update(id, name);
            showMessage('Kategori güncellendi.', 'success');
        } else {
            await api.categories.create(name);
            showMessage('Kategori eklendi.', 'success');
        }
        
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('categorySubmitBtn').textContent = 'Kategori Ekle';
        document.getElementById('categoryCancelBtn').style.display = 'none';
        loadAdminCategories();
    } catch (error) {
        showMessage('İşlem başarısız: ' + error.message, 'error');
    }
});

function editCategory(id, name) {
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryId').value = id;
    document.getElementById('categorySubmitBtn').textContent = 'Güncelle';
    document.getElementById('categoryCancelBtn').style.display = 'block';
}

function cancelCategoryEdit() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categorySubmitBtn').textContent = 'Kategori Ekle';
    document.getElementById('categoryCancelBtn').style.display = 'none';
}

async function deleteCategory(id) {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await api.categories.delete(id);
        showMessage('Kategori silindi.', 'success');
        loadAdminCategories();
    } catch (error) {
        showMessage('Kategori silinemedi: ' + error.message, 'error');
    }
}

// Admin Companies
async function loadAdminCompanies() {
    try {
        // Load categories for dropdown
        const categories = await api.categories.getAll();
        const categorySelect = document.getElementById('companyCategoryId');
        categorySelect.innerHTML = '<option value="">Kategori Seçin</option>' +
            categories.map(cat => `<option value="${cat._id}">${cat.name}</option>`).join('');

        // Load companies
        const companies = await api.companies.getAll();
        const container = document.getElementById('companiesList');
        
        container.innerHTML = companies.map(company => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${company.name}</h4>
                    <p>📍 ${company.address}</p>
                    <p>📂 ${company.categoryId.name}</p>
                    <p>🕐 ${company.workingHours.start} - ${company.workingHours.end}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-secondary" onclick="editCompany('${company._id}', '${company.name}', '${company.address}', '${company.categoryId._id}', '${company.workingHours.start}', '${company.workingHours.end}')">
                        Düzenle
                    </button>
                    <button class="btn-danger" onclick="deleteCompany('${company._id}')">
                        Sil
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Şirketler yüklenemedi: ' + error.message, 'error');
    }
}

document.getElementById('companyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const categoryId = document.getElementById('companyCategoryId').value;
    const name = document.getElementById('companyName').value;
    const address = document.getElementById('companyAddress').value;
    const startTime = document.getElementById('companyStartTime').value;
    const endTime = document.getElementById('companyEndTime').value;
    const id = document.getElementById('companyId').value;

    const workingHours = {
        start: startTime,
        end: endTime
    };

    try {
        if (id) {
            await api.companies.update(id, { name, address, workingHours });
            showMessage('Şirket güncellendi.', 'success');
        } else {
            await api.companies.create(categoryId, name, address, workingHours);
            showMessage('Şirket eklendi.', 'success');
        }
        
        document.getElementById('companyForm').reset();
        document.getElementById('companyId').value = '';
        document.getElementById('companySubmitBtn').textContent = 'Şirket Ekle';
        document.getElementById('companyCancelBtn').style.display = 'none';
        loadAdminCompanies();
    } catch (error) {
        showMessage('İşlem başarısız: ' + error.message, 'error');
    }
});

function editCompany(id, name, address, categoryId, startTime, endTime) {
    document.getElementById('companyCategoryId').value = categoryId;
    document.getElementById('companyName').value = name;
    document.getElementById('companyAddress').value = address;
    document.getElementById('companyStartTime').value = startTime;
    document.getElementById('companyEndTime').value = endTime;
    document.getElementById('companyId').value = id;
    document.getElementById('companySubmitBtn').textContent = 'Güncelle';
    document.getElementById('companyCancelBtn').style.display = 'block';
}

function cancelCompanyEdit() {
    document.getElementById('companyForm').reset();
    document.getElementById('companyId').value = '';
    document.getElementById('companySubmitBtn').textContent = 'Şirket Ekle';
    document.getElementById('companyCancelBtn').style.display = 'none';
}

async function deleteCompany(id) {
    if (!confirm('Bu şirketi silmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await api.companies.delete(id);
        showMessage('Şirket silindi.', 'success');
        loadAdminCompanies();
    } catch (error) {
        showMessage('Şirket silinemedi: ' + error.message, 'error');
    }
}

// Admin Appointments
async function loadAdminAppointments() {
    try {
        const appointments = await api.appointments.getAll();
        const container = document.getElementById('adminAppointmentsList');
        
        if (appointments.length === 0) {
            container.innerHTML = '<p>Henüz randevu bulunmuyor.</p>';
            return;
        }

        container.innerHTML = appointments.map(appointment => {
            const statusText = {
                'pending': 'Beklemede',
                'approved': 'Onaylandı',
                'cancelled': 'İptal Edildi'
            };

            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h4>${appointment.companyId.name}</h4>
                        <p>👤 ${appointment.userId.name} (${appointment.userId.email})</p>
                        <p>📅 ${new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                        <p>🕐 ${appointment.time}</p>
                        <span class="appointment-status ${appointment.status}">
                            ${statusText[appointment.status]}
                        </span>
                    </div>
                    <div class="admin-item-actions">
                        ${appointment.status === 'pending' ? `
                            <button class="btn-success" onclick="updateAppointmentStatus('${appointment._id}', 'approved')">
                                Onayla
                            </button>
                        ` : ''}
                        ${appointment.status !== 'cancelled' ? `
                            <button class="btn-danger" onclick="updateAppointmentStatus('${appointment._id}', 'cancelled')">
                                İptal Et
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        showMessage('Randevular yüklenemedi: ' + error.message, 'error');
    }
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        await api.appointments.update(appointmentId, status);
        showMessage('Randevu durumu güncellendi.', 'success');
        loadAdminAppointments();
    } catch (error) {
        showMessage('Randevu güncellenemedi: ' + error.message, 'error');
    }
}

// Admin Users
async function loadAdminUsers() {
    try {
        const users = await api.users.getAll();
        const container = document.getElementById('usersList');
        
        container.innerHTML = users.map(user => {
            const roleText = user.role === 'admin' ? 'Yönetici' : 'Kullanıcı';
            const roleBadge = user.role === 'admin' ? '🔑' : '👤';
            const userId = user._id || user.id;
            const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;
            const isCurrentUser = currentUserId && userId === currentUserId;
            
            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h4>${roleBadge} ${user.name}</h4>
                        <p>📧 ${user.email}</p>
                        <p>${roleText}</p>
                        ${isCurrentUser ? '<p style="color: var(--primary-color); font-weight: bold;">(Siz)</p>' : ''}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-secondary" onclick="editUser('${user._id}', '${user.name}', '${user.email}', '${user.role}')" ${isCurrentUser ? 'disabled' : ''}>
                            Düzenle
                        </button>
                        <button class="btn-danger" onclick="deleteUser('${user._id}')" ${isCurrentUser ? 'disabled' : ''}>
                            Sil
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        showMessage('Kullanıcılar yüklenemedi: ' + error.message, 'error');
    }
}

document.getElementById('userForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const id = document.getElementById('userId').value;

    try {
        if (id) {
            const updateData = { name, email, role };
            if (password && password.length >= 6) {
                updateData.password = password;
            }
            await api.users.update(id, updateData);
            showMessage('Kullanıcı güncellendi.', 'success');
        } else {
            await api.users.create(name, email, password, role);
            showMessage('Kullanıcı eklendi.', 'success');
        }
        
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('userSubmitBtn').textContent = 'Kullanıcı Ekle';
        document.getElementById('userCancelBtn').style.display = 'none';
        loadAdminUsers();
    } catch (error) {
        showMessage('İşlem başarısız: ' + error.message, 'error');
    }
});

function editUser(id, name, email, role) {
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userRole').value = role;
    document.getElementById('userPassword').required = false;
    document.getElementById('userPassword').placeholder = 'Şifre (değiştirmek için doldurun, boş bırakabilirsiniz)';
    document.getElementById('userId').value = id;
    document.getElementById('userSubmitBtn').textContent = 'Güncelle';
    document.getElementById('userCancelBtn').style.display = 'block';
}

function cancelUserEdit() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userPassword').placeholder = 'Şifre (min 6 karakter)';
    document.getElementById('userSubmitBtn').textContent = 'Kullanıcı Ekle';
    document.getElementById('userCancelBtn').style.display = 'none';
}

async function deleteUser(id) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await api.users.delete(id);
        showMessage('Kullanıcı silindi.', 'success');
        loadAdminUsers();
    } catch (error) {
        showMessage('Kullanıcı silinemedi: ' + error.message, 'error');
    }
}

