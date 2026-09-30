// Costumes page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCostumes();
    initializeFilters();
});

// Random costumes data
const costumesData = [
    {
        id: 101,
        title: 'Костюм FINNHUNT Reliable Forest Camo APS PRO',
        price: 12990,
        image: 'https://finnhunt.com/upload/iblock/8b2/b0rqyqvtlvpl8duuhfhvf1u1pvg3qvo5/01-_2_.jpg',
        season: 'demi',
        camouflage: 'forest',
        rating: 4.5,
        isNew: false
    },
    {
        id: 102,
        title: 'Костюм FINNHUNT Reliable BTA Camo',
        price: 18990,
        image: 'https://finnhunt.com/upload/iblock/184/q3h24l4k9i5ne454g6ii9hjhm3mjiib7/1.png',
        season: 'demi',
        camouflage: 'forest',
        rating: 4.8,
        isNew: true
    },
    {
        id: 103,
        title: 'Костюм FINNHUNT Silent Fleece Brown',
        price: 15990,
        image: 'https://finnhunt.com/upload/iblock/c37/0illy2xqym678vy8y01x1552nj2gtgm0/1.png',
        season: 'demi',
        camouflage: 'mountain',
        rating: 4.3,
        isNew: false
    },
    {
        id: 104,
        title: 'Костюм FINNHUNT Thin Open Camo',
        price: 11990,
        image: 'https://finnhunt.com/upload/iblock/636/m8rwio1sg7tzmrrzslhcbw6ye5ihy8ex/1.png',
        season: 'summer',
        camouflage: 'swamp',
        rating: 4.6,
        isNew: true
    },
    {
        id: 105,
        title: 'Костюм FINNHUNT Thin Forest Camo',
        price: 21990,
        image: 'https://finnhunt.com/upload/iblock/e50/mtmf8zabuuja8k2d14m5gwjpmy5bqtbp/1.png',
        season: 'summer',
        camouflage: 'digital',
        rating: 4.9,
        isNew: true
    },
    {
        id: 106,
        title: 'Костюм FINNHUNT Traveler Summer Green/Grey',
        price: 13990,
        image: 'https://finnhunt.com/upload/iblock/d27/73c1k0jk5wwinhfuj6hno914bjhidyj9/1.png',
        season: 'summer',
        camouflage: 'forest',
        rating: 4.4,
        isNew: false
    },
    {
        id: 107,
        title: 'Костюм FINNHUNT Сity Olive Black',
        price: 24990,
        image: 'https://finnhunt.com/upload/iblock/658/fwi2qzriuy6cqa4k3rjf8ih3fh53aae5/1.png',
        season: 'winter',
        camouflage: 'digital',
        rating: 4.7,
        isNew: true
    },
    {
        id: 108,
        title: 'Костюм FINNHUNT Reliable Padded Open Camo',
        price: 8990,
        image: 'https://finnhunt.com/upload/iblock/253/rxhjmxgrfex83krdhgxculhxslj0qssr/01.png',
        season: 'winter',
        camouflage: 'forest',
        rating: 4.2,
        isNew: false
    }
];

function loadCostumes(filteredData = costumesData) {
    const productsContainer = document.getElementById('costumes-products');
    
    if (!productsContainer) return;

    if (filteredData.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = filteredData.map(costume => `
        <div class="product-card">
            ${costume.isNew ? '<div class="product-badge">Новинка</div>' : ''}
            <img src="${costume.image}" alt="${costume.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${costume.title}</h3>
                <div class="product-meta">
                    <span class="product-season">${getSeasonText(costume.season)}</span>
                    <span class="product-camouflage">${getCamouflageText(costume.camouflage)}</span>
                </div>
                <div class="product-price">${formatPrice(costume.price)} ₽</div>
                <div class="product-rating">
                    ${generateRatingStars(costume.rating)}
                    <span class="rating-value">${costume.rating}</span>
                </div>
                <button class="add-to-cart" data-id="${costume.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize add to cart buttons
    initializeCostumeCartButtons();
}

function initializeCostumeCartButtons() {
    const addToCartButtons = document.querySelectorAll('#costumes-products .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = costumesData.find(p => p.id === productId);
            
            if (product && window.cart) {
                window.cart.addItem(product);
            }
        });
    });
}

function initializeFilters() {
    const seasonFilter = document.getElementById('season-filter');
    const camouflageFilter = document.getElementById('camouflage-filter');
    const sortFilter = document.getElementById('sort-filter');

    [seasonFilter, camouflageFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const season = document.getElementById('season-filter').value;
    const camouflage = document.getElementById('camouflage-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filteredData = [...costumesData];

    // Apply season filter
    if (season !== 'all') {
        filteredData = filteredData.filter(costume => costume.season === season);
    }

    // Apply camouflage filter
    if (camouflage !== 'all') {
        filteredData = filteredData.filter(costume => costume.camouflage === camouflage);
    }

    // Apply sorting
    switch (sort) {
        case 'price-low':
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredData.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            filteredData.sort((a, b) => b.isNew - a.isNew);
            break;
        case 'popular':
        default:
            filteredData.sort((a, b) => b.rating - a.rating);
            break;
    }

    loadCostumes(filteredData);
}

function getSeasonText(season) {
    const seasons = {
        'summer': 'Летний',
        'winter': 'Зимний',
        'demi': 'Демисезонный'
    };
    return seasons[season] || season;
}

function getCamouflageText(camouflage) {
    const camouflages = {
        'forest': 'Лесной',
        'mountain': 'Горный',
        'swamp': 'Болотный',
        'digital': 'Цифровой'
    };
    return camouflages[camouflage] || camouflage;
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}