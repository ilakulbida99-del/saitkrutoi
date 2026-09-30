// User management
class UserManager {
    constructor() {
        this.currentUser = null;
        this.loadUser();
    }

    loadUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
        this.updateUI();
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveUser();
            return true;
        }
        return false;
    }

    register(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return false;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            orders: [],
            favorites: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.currentUser = newUser;
        this.saveUser();
        return true;
    }

    logout() {
        this.currentUser = null;
        this.saveUser();
    }

    updateUI() {
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            if (this.currentUser) {
                profileBtn.innerHTML = '<i class="fas fa-user"></i><span>Профиль</span>';
                profileBtn.href = 'profile.html';
            } else {
                profileBtn.innerHTML = '<i class="far fa-user"></i><span>Войти</span>';
                profileBtn.href = '#';
            }
        }
    }
}

// Cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.updateCartCount();
        
        this.bindEvents();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('hunterCart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            this.items = [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('hunterCart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }

    bindEvents() {
        // Обработка кликов по кнопкам корзины
        document.addEventListener('click', (e) => {
            // Открытие корзины
            if (e.target.closest('#cart-icon') || e.target.closest('.cart-icon')) {
                e.preventDefault();
                this.openCart();
            }
            
            // Управление количеством товаров
            if (e.target.classList.contains('quantity-btn')) {
                const productId = e.target.dataset.id;
                const isPlus = e.target.classList.contains('plus-btn');
                const isMinus = e.target.classList.contains('minus-btn');
                
                if (isPlus) {
                    this.incrementQuantity(productId);
                } else if (isMinus) {
                    this.decrementQuantity(productId);
                }
            }
            
            // Удаление товаров
            if (e.target.classList.contains('remove-item')) {
                const productId = e.target.dataset.id;
                this.removeItem(productId);
            }
            
            // Очистка корзины
            if (e.target.classList.contains('clear-cart')) {
                this.clearCart();
            }
        });

        // Обработка изменения количества через input
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    this.renderCart();
                }
            }
        });

        // Валидация input для количества
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                e.target.value = e.target.value.replace(/[^\d]/g, '');
            }
        });
    }

    openCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            this.renderCart();
            cartModal.style.display = 'flex';
        } else {
            console.error('Модальное окно корзины не найдено');
        }
    }

    incrementQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    decrementQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.removeItem(productId);
                return;
            }
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    addItem(product) {
        if (!product || !product.id) {
            console.error('Неверный продукт:', product);
            return;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Товар добавлен в корзину!');
        
        // Автоматически открываем корзину после добавления товара
        if (document.getElementById('cart-items')) {
            this.renderCart();
        }
    }

    removeItem(productId) {
        // Преобразуем productId в число для сравнения
        const id = typeof productId === 'string' ? parseInt(productId) : productId;
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('Товар удален из корзины');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    getTotalCount() {
        return this.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    }

    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        if (cartCounts.length > 0) {
            const count = this.getTotalCount();
            cartCounts.forEach(cartCount => {
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'flex' : 'none';
            });
        }
    }

    showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary, #007bff);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCart = document.getElementById('empty-cart');
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');

        if (!cartItems) {
            console.error('Элемент cart-items не найден');
            return;
        }

        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            cartItems.innerHTML = '';
            if (emptyCart) cartItems.appendChild(emptyCart);
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        cartItems.innerHTML = '';
        
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image || ''}" alt="${item.title || 'Товар'}" class="cart-item-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zNSA0MEw1MCA1NUw2NSA0ME02NSAyNUg3NVY3NUgyNVYyNUgzNVYzNUg0NVYyNUg1NVYzNUg2NVYyNVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title || 'Неизвестный товар'}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} ₽</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn" data-id="${item.id}" type="button">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}">
                        <button class="quantity-btn plus-btn" data-id="${item.id}" type="button">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        const totalPrice = this.getTotalPrice();
        if (subtotal) subtotal.textContent = this.formatPrice(totalPrice) + ' ₽';
        if (total) total.textContent = this.formatPrice(totalPrice) + ' ₽';
    }

    formatPrice(price) {
        const num = Number(price) || 0;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('Корзина очищена');
    }
}

// Product data
const products = {
    1: {
        id: 1,
        title: 'Костюм FINNHUNT Reliable Forest Camo APS PRO',
        price: 12990,
        image: 'https://finnhunt.com/upload/iblock/8b2/b0rqyqvtlvpl8duuhfhvf1u1pvg3qvo5/01-_2_.jpg'
    },
    2: {
        id: 2,
        title: 'Комплект №2 (+5 до -15)',
        price: 8490,
        image: 'https://finnhunt.com/upload/iblock/a72/wxgiwc8rsr6w4uxq240gms6qtve7qccr/Finnhunt-13.png'
    },
    3: {
        id: 3,
        title: 'Ботинки FINNHUNT Nitrogen Fitgo',
        price: 6990,
        image: 'https://finnhunt.com/upload/iblock/8f0/1x97gdbj3r83ae109i7e15ma84imcn3i/01-_2_.jpg'
    },
    4: {
        id: 4,
        title: 'Перчатки демисезонные FINNHUNT March Camo',
        price: 15490,
        image: 'https://finnhunt.com/upload/iblock/692/gcb9rypl89jlaiyeky3q2o22zvf6wexd/novinki-_9_.png'
    }
};

// Initialize managers
const userManager = new UserManager();

// Инициализация корзины
window.cart = new Cart();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModals();
    initializeCart();
    initializeAuth();
    initializeProducts();
    initializeSearch();
    
    // Обновляем счетчик корзины при загрузке страницы
    window.cart.updateCartCount();
});

function initializeModals() {
    // Закрытие модальных окон при клике вне контента
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // Кнопки закрытия
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

function initializeCart() {
    // Универсальная обработка кликов по иконке корзины
    document.addEventListener('click', function(e) {
        // Обработка клика по иконке корзины в любом месте
        if (e.target.closest('#cart-icon') || 
            e.target.closest('.cart-icon') || 
            e.target.closest('.cart-link')) {
            e.preventDefault();
            window.cart.openCart();
        }
    });

    // Обработка оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const address = document.getElementById('delivery-address').value;
            
            if (!address) {
                alert('Пожалуйста, введите адрес доставки');
                return;
            }
            
            if (window.cart.items.length > 0) {
                if (!userManager.currentUser) {
                    alert('Пожалуйста, войдите в систему для оформления заказа');
                    document.getElementById('login-modal').style.display = 'flex';
                    return;
                }
                
                const order = {
                    id: Date.now(),
                    items: [...window.cart.items],
                    total: window.cart.getTotalPrice(),
                    address: address,
                    date: new Date().toLocaleDateString()
                };
                
                // Save order to user
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.id === userManager.currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex].orders.push(order);
                    localStorage.setItem('users', JSON.stringify(users));
                    userManager.currentUser = users[userIndex];
                    userManager.saveUser();
                }
                
                alert(`Заказ оформлен! Сумма: ${window.cart.formatPrice(window.cart.getTotalPrice())} ₽\nАдрес доставки: ${address}`);
                window.cart.clearCart();
                document.getElementById('cart-modal').style.display = 'none';
            }
        });
    }
}

function initializeAuth() {
    const profileBtn = document.getElementById('profile-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    // Profile button click
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            if (!userManager.currentUser) {
                e.preventDefault();
                loginModal.style.display = 'flex';
            }
        });
    }

    // Switch between login and register
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }

    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (userManager.login(email, password)) {
                alert('Вход выполнен успешно!');
                loginModal.style.display = 'none';
                // Clear form
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
            } else {
                alert('Неверный email или пароль');
            }
        });
    }

    // Register functionality
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (!name || !email || !password || !confirm) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (password !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            
            if (userManager.register(name, email, password)) {
                alert('Регистрация выполнена успешно!');
                registerModal.style.display = 'none';
                // Clear form
                document.getElementById('register-name').value = '';
                document.getElementById('register-email').value = '';
                document.getElementById('register-password').value = '';
                document.getElementById('register-confirm').value = '';
            } else {
                alert('Пользователь с таким email уже существует');
            }
        });
    }
}

function initializeProducts() {
    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products[productId];
            
            if (product) {
                window.cart.addItem(product);
            }
        });
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                alert('Поиск: ' + query);
                // Here you would normally redirect to search results page
            }
        };
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Export for use in other files
window.userManager = userManager;