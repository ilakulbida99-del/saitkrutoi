// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    const authRequired = document.getElementById('auth-required');
    const profileContent = document.getElementById('profile-content');
    const goToLoginBtn = document.getElementById('go-to-login');
    const logoutBtn = document.getElementById('logout-btn');
    const deleteAccountBtn = document.getElementById('delete-account');

    // Check if user is logged in
    if (!window.userManager.currentUser) {
        authRequired.style.display = 'block';
        profileContent.style.display = 'none';
    } else {
        authRequired.style.display = 'none';
        profileContent.style.display = 'block';
        loadUserData();
        initializeProfileTabs();
        loadOrders();
        loadFavorites();
    }

    // Go to login button
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                window.userManager.logout();
                window.location.href = 'index.html';
            }
        });
    }

    // Delete account button
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('ВНИМАНИЕ! Это действие невозможно отменить. Все ваши данные будут удалены. Продолжить?')) {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const updatedUsers = users.filter(u => u.id !== window.userManager.currentUser.id);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                window.userManager.logout();
                alert('Аккаунт удален');
                window.location.href = 'index.html';
            }
        });
    }

    // Personal form submission
    const personalForm = document.getElementById('personal-form');
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalData();
        });
    }

    // Settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
});

function loadUserData() {
    const user = window.userManager.currentUser;
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('profile-name').value = user.name.split(' ')[0] || '';
        document.getElementById('profile-lastname').value = user.name.split(' ')[1] || '';
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-phone').value = user.phone || '';
        document.getElementById('profile-address').value = user.address || '';
    }
}

function savePersonalData() {
    const name = document.getElementById('profile-name').value;
    const lastname = document.getElementById('profile-lastname').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;
    const address = document.getElementById('profile-address').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === window.userManager.currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].name = `${name} ${lastname}`.trim();
        users[userIndex].email = email;
        users[userIndex].phone = phone;
        users[userIndex].address = address;
        
        localStorage.setItem('users', JSON.stringify(users));
        window.userManager.currentUser = users[userIndex];
        window.userManager.saveUser();
        
        document.getElementById('user-name').textContent = users[userIndex].name;
        alert('Данные успешно сохранены!');
    }
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Новые пароли не совпадают');
        return;
    }

    if (currentPassword !== window.userManager.currentUser.password) {
        alert('Текущий пароль неверен');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === window.userManager.currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        window.userManager.currentUser.password = newPassword;
        
        document.getElementById('settings-form').reset();
        alert('Пароль успешно изменен!');
    }
}

function initializeProfileTabs() {
    const tabLinks = document.querySelectorAll('.profile-nav-link');
    const tabs = document.querySelectorAll('.profile-tab');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and links
            tabLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to current tab and link
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function loadOrders() {
    const user = window.userManager.currentUser;
    const ordersList = document.getElementById('orders-list');
    
    if (!user.orders || user.orders.length === 0) {
        ordersList.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>У вас пока нет заказов</p></div>';
        return;
    }

    ordersList.innerHTML = user.orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Заказ #${order.id}</h4>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-total">${window.cart.formatPrice(order.total)} ₽</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.title}" class="order-item-img">
                        <div class="order-item-details">
                            <div class="order-item-title">${item.title}</div>
                            <div class="order-item-quantity">Количество: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">${window.cart.formatPrice(item.price * item.quantity)} ₽</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-address">
                <strong>Адрес доставки:</strong> ${order.address}
            </div>
        </div>
    `).join('');
}

function loadFavorites() {
    const user = window.userManager.currentUser;
    const favoritesList = document.getElementById('favorites-list');
    
    if (!user.favorites || user.favorites.length === 0) {
        favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><p>У вас пока нет избранных товаров</p></div>';
        return;
    }

    // This would be populated with actual favorite products
    favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><p>У вас пока нет избранных товаров</p></div>';
}