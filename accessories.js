// Accessories page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAccessories();
    initializeFilters();
});

// Accessories data
const accessoriesData = [
    {
        id: 401,
        title: 'Носки FINNHUNT Trekking Brown 2',
        price: 15490,
        image: 'https://finnhunt.com/upload/iblock/cd3/fvxabg0q8y1484w2wzbnnarxqzhk61iq/novinki-_6_.png',
        category: 'optics',
        rating: 4.7,
        features: ['Увеличение 10x', 'Диаметр 42мм', 'Водонепроницаемый']
    },
    {
        id: 402,
        title: 'Носки FINNHUNT Trekking Orange',
        price: 6990,
        image: 'https://finnhunt.com/upload/iblock/690/2l1kt3ehb2gr9belq7b82aohg63ck451/novinki-_7_.png',
        category: 'knives',
        rating: 4.8,
        features: ['Сталь 420HC', 'Длина клинка 15см', 'Кожаные ножны']
    },
    {
        id: 403,
        title: 'Носки FINNHUNT Trekking Olive',
        price: 8990,
        image: 'https://finnhunt.com/upload/iblock/86c/v22ye4v508b2wf3aa5y4bdbyletza1i8/novinki-_8_.png',
        category: 'bags',
        rating: 4.5,
        features: ['Объем 40 литров', 'Водонепроницаемый', 'MOLLE система']
    },
    {
        id: 404,
        title: 'Подтяжки FINNHUNTдля пуговиц, зеленые',
        price: 5490,
        image: 'https://finnhunt.com/upload/iblock/37c/lqdw2pk5yh6ldu6wjrw6faxm0xzan6ec/1A6A5194.png',
        category: 'camping',
        rating: 4.6,
        features: ['Объем 1.5 литра', 'Сохраняет тепло 24ч', 'Нержавеющая сталь']
    },
    {
        id: 405,
        title: 'Перчатки демисезонные FINNHUNT March Camo',
        price: 12990,
        image: 'https://finnhunt.com/upload/iblock/692/gcb9rypl89jlaiyeky3q2o22zvf6wexd/novinki-_9_.png',
        category: 'optics',
        rating: 4.4,
        features: ['Переменное увеличение', 'Просветленная оптика', 'Влагозащита']
    },
    {
        id: 406,
        title: 'Перчатки демисезонные FINNHUNT Alpine Camo',
        price: 3490,
        image: 'https://finnhunt.com/upload/iblock/8e5/2ld18q8zrweadb7886yxm1mfmdsha504/novinki-_10_.png',
        category: 'other',
        rating: 4.3,
        features: ['Яркость 1000 люмен', 'Дальность 200м', 'Алюминиевый корпус']
    },
    {
        id: 407,
        title: 'Перчатки демисезонные FINNHUNT Forest Camo',
        price: 4290,
        image: 'https://finnhunt.com/upload/iblock/a64/nldo9n2czmtvl52nr9gjezcgfgzo8904/novinki-_11_.png',
        category: 'knives',
        rating: 4.7,
        features: ['Многофункциональный', 'Нержавеющая сталь', 'Карманный']
    },
    {
        id: 408,
        title: 'Перчатки демисезонные FINNHUNT Open Camo',
        price: 2490,
        image: 'https://finnhunt.com/upload/iblock/550/h9ppk04htul62pv4ed15k2b7c7k60ees/novinki-_8_.png',
        category: 'camping',
        rating: 4.2,
        features: ['Компактная', 'Мощность 3000Вт', 'Ветрозащита']
    }
];

function loadAccessories(filteredData = accessoriesData) {
    const productsContainer = document.getElementById('accessories-products');
    
    if (!productsContainer) return;

    if (filteredData.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Аксессуары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = filteredData.map(accessory => `
        <div class="product-card">
            <img src="${accessory.image}" alt="${accessory.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${accessory.title}</h3>
                <div class="product-meta">
                    <span class="product-category">${getCategoryText(accessory.category)}</span>
                </div>
                <div class="accessory-features">
                    ${accessory.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-price">${formatPrice(accessory.price)} ₽</div>
                <div class="product-rating">
                    ${generateRatingStars(accessory.rating)}
                    <span class="rating-value">${accessory.rating}</span>
                </div>
                <button class="add-to-cart" data-id="${accessory.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize add to cart buttons
    initializeAccessoriesCartButtons();
}

function initializeAccessoriesCartButtons() {
    const addToCartButtons = document.querySelectorAll('#accessories-products .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = accessoriesData.find(p => p.id === productId);
            
            if (product && window.cart) {
                window.cart.addItem(product);
            }
        });
    });
}

function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');

    [categoryFilter, priceFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filteredData = [...accessoriesData];

    // Apply category filter
    if (category !== 'all') {
        filteredData = filteredData.filter(accessory => accessory.category === category);
    }

    // Apply price filter
    if (price !== 'all') {
        switch (price) {
            case 'budget':
                filteredData = filteredData.filter(accessory => accessory.price <= 5000);
                break;
            case 'medium':
                filteredData = filteredData.filter(accessory => accessory.price > 5000 && accessory.price <= 20000);
                break;
            case 'premium':
                filteredData = filteredData.filter(accessory => accessory.price > 20000);
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

    loadAccessories(filteredData);
}

function getCategoryText(category) {
    const categories = {
        'optics': 'Оптика',
        'knives': 'Ножи',
        'bags': 'Сумки и рюкзаки',
        'camping': 'Кемпинг',
        'other': 'Прочее'
    };
    return categories[category] || category;
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