// Sales page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadSalesProducts();
    initializeSalesTimer();
});

// Sales products data
const salesProducts = [
    {
        id: 501,
        title: 'Костюм охотничий "Лесник" со скидкой',
        price: 12990,
        originalPrice: 15290,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.5,
        isNew: false
        
    },
    {
        id: 502,
        title: 'Ботинки охотничьи "Тайга" акционные',
        price: 8490,
        originalPrice: 9990,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        rating: 4.4,
        isNew: false
    },
    {
        id: 503,
        title: 'Бинокль охотничий 10x42 по спеццене',
        price: 12990,
        originalPrice: 15490,
        discount: 16,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
        rating: 4.7,
        isNew: false
    },
    {
        id: 504,
        title: 'Комплект "Начинающий" со скидкой 20%',
        price: 27990,
        originalPrice: 34990,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.6,
        isNew: false
    },
    {
        id: 505,
        title: 'Охотничий нож премиум класса',
        price: 5590,
        originalPrice: 6990,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1558618047-2c7c67ef54f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.8,
        isNew: false
    },
    {
        id: 506,
        title: 'Тактический рюкзак 40л распродажа',
        price: 7190,
        originalPrice: 8990,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.4,
        isNew: false
    }
];

function loadSalesProducts() {
    const productsContainer = document.getElementById('sales-products-container');
    
    if (!productsContainer) return;

    productsContainer.innerHTML = salesProducts.map(product => `
        <div class="product-card">
            <div class="sales-product-badge">-${product.discount}%</div>
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="price-container">
                    <div class="original-price">${formatPrice(product.originalPrice)} ₽</div>
                    <div class="product-price">${formatPrice(product.price)} ₽</div>
                </div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                    <span class="rating-value">${product.rating}</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize add to cart buttons
    initializeSalesCartButtons();
}

function initializeSalesCartButtons() {
    const addToCartButtons = document.querySelectorAll('#sales-products-container .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = salesProducts.find(p => p.id === productId);
            
            if (product && window.cart) {
                window.cart.addItem(product);
            }
        });
    });
}

function initializeSalesTimer() {
    function updateTimer() {
        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        
        const diff = endOfMonth - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 60000);
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