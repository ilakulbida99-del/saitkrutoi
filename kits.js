// Kits page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadKits();
    initializeFilters();
});

// Kits data
const kitsData = [
    {
        id: 201,
        title: 'Комплект №1 (+5 до -15)',
        price: 34990,
        image: 'https://finnhunt.com/upload/iblock/f92/x6emr3gt9jt9k03vny79wp9ltroeg5ao/Finnhunt-12.png',
        type: 'beginner',
        rating: 4.3,
        includes: ['Костюм FINNHUNT Reliable Padded Autumn Camo', 'Толстовка FINNHUNT 1/2 Zip Universal Autumn Camo', 'Футболка FINNHUNT Mesh T-shirt Autumn Camo', 'Бейсболка зимняя FINNHUNT Autumn Camo']
    },
    {
        id: 202,
        title: 'Комплект №2 (+5 до -15)',
        price: 78990,
        image: 'https://finnhunt.com/upload/iblock/a72/wxgiwc8rsr6w4uxq240gms6qtve7qccr/Finnhunt-13.png',
        type: 'pro',
        rating: 4.8,
        includes: ['Костюм FINNHUNT Reliable Padded Olive Black', 'Толстовка FINNHUNT 1/2 Zip Universal Olive Green', 'Футболка FINNHUNT Olive', 'Бейсболка зимняя FINNHUNT Olive Green']
    },
    {
        id: 203,
        title: 'Комплект №3 (+5 до -15)',
        price: 65990,
        image: 'https://finnhunt.com/upload/iblock/4ce/4suws5wh3ahpljpyzv9k2o41pea1i9en/3.png',
        type: 'winter',
        rating: 4.6,
        includes: ['Костюм FINNHUNT Reliable Padded Signal Camo', 'Толстовка FINNHUNT 1/2 Zip Universal Autumn Camo', 'Футболка FINNHUNT Mesh T-shirt Autumn Camo', 'Бейсболка зимняя FINNHUNT Autumn Camo']
    },
    {
        id: 204,
        title: 'Комплект №4 (+15 до -10)',
        price: 28990,
        image: 'https://finnhunt.com/upload/iblock/625/mh8t1qszf7tcuvgq6xordaidr6wxusjj/Finnhunt-3.png',
        type: 'summer',
        rating: 4.4,
        includes: ['Костюм FINNHUNT Silent Fleece Green', 'Толстовка FINNHUNT 1/2 Zip Universal Olive Green', 'Футболка FINNHUNT Olive', 'Шапка FINNHUNT Olive Green']
    },
    {
        id: 205,
        title: 'Комплект №5 (0 до -15)',
        price: 92990,
        image: 'https://finnhunt.com/upload/iblock/5a7/9sjkdebhldb684ls28fzz0i6z2nvfunv/komplekt.png',
        type: 'pro',
        rating: 4.9,
        includes: ['Костюм FINNHUNT Сity Olive Black', 'Толстовка FINNHUNT 1/2 Zip Universal Olive Green', 'Термобельё FINNHUNT Thermal Base Layer Green', 'Шапка FINNHUNT Olive Green']
    },
    {
        id: 206,
        title: 'Комплект №6 (0 до -30)',
        price: 42990,
        image: 'https://finnhunt.com/upload/iblock/8f8/0478ug0gup8cro084zi7uxjotdf8t194/komplekt-_1_.png',
        type: 'beginner',
        rating: 4.5,
        includes: ['Охотничий костюм FINNHUNT Nordic Olive Green', 'Толстовка FINNHUNT 1/2 Zip Universal Olive Green', 'Термобельё FINNHUNT Thermal Base Layer Green', 'Бейсболка зимняя FINNHUNT Olive Green']
    }
];

function loadKits(filteredData = kitsData) {
    const productsContainer = document.getElementById('kits-products');
    
    if (!productsContainer) return;

    if (filteredData.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Комплекты не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = filteredData.map(kit => `
        <div class="product-card">
            <div class="product-badge">Комплект</div>
            <img src="${kit.image}" alt="${kit.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${kit.title}</h3>
                <div class="product-meta">
                    <span class="product-type">${getTypeText(kit.type)}</span>
                </div>
                <div class="kit-includes">
                    <strong>В комплекте:</strong>
                    <div class="includes-list">${kit.includes.join(', ')}</div>
                </div>
                <div class="product-price">${formatPrice(kit.price)} ₽</div>
                <div class="product-rating">
                    ${generateRatingStars(kit.rating)}
                    <span class="rating-value">${kit.rating}</span>
                </div>
                <button class="add-to-cart" data-id="${kit.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize add to cart buttons
    initializeKitsCartButtons();
}

function initializeKitsCartButtons() {
    const addToCartButtons = document.querySelectorAll('#kits-products .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = kitsData.find(p => p.id === productId);
            
            if (product && window.cart) {
                window.cart.addItem(product);
            }
        });
    });
}

function initializeFilters() {
    const typeFilter = document.getElementById('type-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');

    [typeFilter, priceFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const type = document.getElementById('type-filter').value;
    const price = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filteredData = [...kitsData];

    // Apply type filter
    if (type !== 'all') {
        filteredData = filteredData.filter(kit => kit.type === type);
    }

    // Apply price filter
    if (price !== 'all') {
        switch (price) {
            case 'budget':
                filteredData = filteredData.filter(kit => kit.price <= 20000);
                break;
            case 'medium':
                filteredData = filteredData.filter(kit => kit.price > 20000 && kit.price <= 50000);
                break;
            case 'premium':
                filteredData = filteredData.filter(kit => kit.price > 50000);
                break;
        }
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

    loadKits(filteredData);
}

function getTypeText(type) {
    const types = {
        'beginner': 'Для начинающих',
        'pro': 'Профессиональный',
        'winter': 'Зимний',
        'summer': 'Летний'
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