// Shoes page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadShoes();
    initializeFilters();
});

// Shoes data
const shoesData = [
    {
        id: 101,
        title: 'Сапоги FINNHUNT North Trail',
        price: 15490,
        image: 'https://finnhunt.com/upload/iblock/8f0/1x97gdbj3r83ae109i7e15ma84imcn3i/01-_2_.jpg',
        type: 'boots',
        sizes: [40, 41, 42, 43, 44],
        rating: 4.7,
        features: ['Водонепроницаемые', 'Мембрана Gore-Tex', 'Утепленные']
    },
    {
        id: 102,
        title: 'Ботинки FINNHUNT Nitrogen Fitgo',
        price: 12990,
        image: 'https://finnhunt.com/upload/iblock/523/atds79dqozo2abxg1vkc8rtqhcz4k6ha/1.png',
        type: 'boots',
        sizes: [41, 42, 43, 44, 45],
        rating: 4.8,
        features: ['Высокие', 'Амортизирующая подошва', 'Кожаные']
    },
    {
        id: 103,
        title: 'Ботинки FINNHUNT Pursuer Laces',
        price: 8990,
        image: 'https://finnhunt.com/upload/iblock/cfc/1kyx6e33nscix1y0te5xbzb9wngbyn45/1.png',
        type: 'shoes',
        sizes: [40, 41, 42, 43],
        rating: 4.5,
        features: ['Дышащие', 'Легкие', 'Универсальные']
    },
    {
        id: 104,
        title: 'Ботинки FINNHUNT Pursuer High Laces',
        price: 18490,
        image: 'https://finnhunt.com/upload/iblock/87e/s6xnajcvqxuu9zy965it04a062rp0s2x/1.png',
        type: 'winter',
        sizes: [41, 42, 43, 44, 45],
        rating: 4.9,
        features: ['Температура до -40°C', 'Меховая подкладка', 'Противогололедная подошва']
    },
    {
        id: 106,
        title: 'Ботинки FINNHUNT Pursuer High Fitgo',
        price: 21990,
        image: 'https://finnhunt.com/upload/iblock/6f0/d5xgqiezd8srgze6t8isy4aw17cop4jx/1.png',
        type: 'boots',
        sizes: [42, 43, 44, 45],
        rating: 4.6,
        features: ['Профессиональные', 'Стальной подносок', 'Антибактериальная стелька']
    },
    {
        id: 107,
        title: 'Ботинки FINNHUNT Pursuer Fitgo',
        price: 7490,
        image: 'https://finnhunt.com/upload/iblock/249/8i9owj9mdlq3p5e4t0rp84dxjwze3rim/1.png',
        type: 'shoes',
        sizes: [40, 41, 42, 43, 44],
        rating: 4.3,
        features: ['Дышащие', 'Быстросохнущие', 'Универсальные']
    },
    
];

function loadShoes(filteredData = shoesData) {
    const productsContainer = document.getElementById('shoes-products');
    
    if (!productsContainer) return;

    if (filteredData.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Обувь не найдена</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = filteredData.map(shoe => `
        <div class="product-card">
            <img src="${shoe.image}" alt="${shoe.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${shoe.title}</h3>
                <div class="product-meta">
                    <span class="product-type">${getTypeText(shoe.type)}</span>
                    <span class="product-sizes">Размеры: ${shoe.sizes.join(', ')}</span>
                </div>
                <div class="shoe-features">
                    ${shoe.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-price">${formatPrice(shoe.price)} ₽</div>
                <div class="product-rating">
                    ${generateRatingStars(shoe.rating)}
                    <span class="rating-value">${shoe.rating}</span>
                </div>
                <button class="add-to-cart" data-id="${shoe.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize add to cart buttons
    initializeShoesCartButtons();
}

function initializeShoesCartButtons() {
    const addToCartButtons = document.querySelectorAll('#shoes-products .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = shoesData.find(p => p.id === productId);
            
            if (product && window.cart) {
                window.cart.addItem(product);
                updateCartUI();
            }
        });
    });
}

function initializeFilters() {
    const typeFilter = document.getElementById('type-filter');
    const sizeFilter = document.getElementById('size-filter');
    const sortFilter = document.getElementById('sort-filter');

    [typeFilter, sizeFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const type = document.getElementById('type-filter').value;
    const size = document.getElementById('size-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filteredData = [...shoesData];

    // Apply type filter
    if (type !== 'all') {
        filteredData = filteredData.filter(shoe => shoe.type === type);
    }

    // Apply size filter
    if (size !== 'all') {
        const sizeNum = parseInt(size);
        filteredData = filteredData.filter(shoe => shoe.sizes.includes(sizeNum));
    }

    // Apply sorting
    switch (sort) {
        case 'price-low':
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredData.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
        default:
            filteredData.sort((a, b) => b.rating - a.rating);
            break;
    }

    loadShoes(filteredData);
}

function getTypeText(type) {
    const types = {
        'boots': 'Ботинки',
        'shoes': 'Полуботинки',
        'winter': 'Зимние',
        'rubber': 'Резиновые'
    };
    return types[type] || type;
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount && window.cart) {
        cartCount.textContent = window.cart.getItemCount();
    }
}

// Initialize cart if not exists
if (typeof window.cart === 'undefined') {
    window.cart = {
        items: [],
        addItem: function(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            }
            this.saveToStorage();
        },
        removeItem: function(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveToStorage();
        },
        getItemCount: function() {
            return this.items.reduce((total, item) => total + item.quantity, 0);
        },
        getTotalPrice: function() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        saveToStorage: function() {
            localStorage.setItem('finnhuntCart', JSON.stringify(this.items));
        },
        loadFromStorage: function() {
            const savedCart = localStorage.getItem('finnhuntCart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        }
    };
    
    window.cart.loadFromStorage();
    updateCartUI();
}