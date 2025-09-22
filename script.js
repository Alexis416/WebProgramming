const products = {
    phones: [
        {
            id: 'p1',
            name: 'iPhone 14 Pro',
            description: '128GB, Space Black. Современный флагман.',
            price: 99990,
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-family-select?wid=940&hei=1112&fmt=jpeg&qlt=90&.v=1660759995965'
        },
        {
            id: 'p2',
            name: 'Samsung Galaxy S23',
            description: '256GB, Phantom Black. Мощный Android-смартфон.',
            price: 79990,
            image: 'https://shop.gestore.ru/upload/iblock/763/371jobbxcs6eav34ft2rnpl1rsvojm62.png'
        }
    ],
    laptops: [
        {
            id: 'l1',
            name: 'Apple MacBook Air M2',
            description: '13" Retina, 16GB RAM, 512GB SSD',
            price: 134990,
            image: 'https://cdn.eraspace.com/pub/media/wysiwyg/PB/Asset_76_4x.png'
        },
        {
            id: 'l2',
            name: 'ASUS Vivobook 15 OLED',
            description: 'Intel i7, 16GB RAM, 1TB SSD',
            price: 89990,
            image: 'https://avatars.mds.yandex.net/get-mpic/4466428/2a00000195eb631f7e461211cc973e718f2e/orig'
        }
    ],
    computers: [
        {
            id: 'c1',
            name: 'Lenovo Legion T5',
            description: 'AMD Ryzen 7, RTX 3060, 32GB RAM',
            price: 109990,
            image: 'https://avatars.mds.yandex.net/get-mpic/4377400/img_id2108291851330950560.jpeg/orig'
        },
        {
            id: 'c2',
            name: 'HP Pavilion Gaming',
            description: 'Intel i5, GTX 1660, 16GB RAM',
            price: 67990,
            image: 'https://kotofoto.ru/product_img/3737/620499/620499_sistemniy_blok_hp_pavilion_tg01_2031ur_cherniy_497k2ea.jpg?v=1700590984'
}]
};

// DOM Elements
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Render Products
function renderProducts(category, gridId) {
    const grid = $(gridId);
    grid.innerHTML = '';
    products[category].forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">${product.price.toLocaleString()} ₽</div>
            <button class="add-to-cart" data-id="${product.id}" data-category="${category}">В корзину</button>
        `;
        grid.appendChild(card);
    });
}

renderProducts('phones', '#phonesGrid');
renderProducts('laptops', '#laptopsGrid');
renderProducts('computers', '#computersGrid');

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || {};

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    $('#cartCount').textContent = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
}

function calcTotal() {
    return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
    const cartItems = $('#cartItems');
    cartItems.innerHTML = '';
    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        $('#checkoutBtn').disabled = true;
        $('#cartTotal').textContent = '0';
        return;
    }
    Object.values(cart).forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
            <div class="cart-item-controls">
               <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
               <span>${item.quantity}</span>
               <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
               <button class="remove-item" data-id="${item.id}">Удалить</button>
            </div>
          </div>
        `;
        cartItems.appendChild(div);
    });
    $('#checkoutBtn').disabled = false;
    $('#cartTotal').textContent = calcTotal().toLocaleString();
}

// Cart show/hide logic
$('#cartBtn').addEventListener('click', () => {
    $('#cartDropdown').classList.toggle('active');
});
$('#closeCart').addEventListener('click', () => {
    $('#cartDropdown').classList.remove('active');
});
document.addEventListener('click', (e) => {
    const cartDropdown = $('#cartDropdown');
    const cartBtn = $('#cartBtn');
    const isClickInsideCartControls = e.target.closest('.quantity-btn') || e.target.closest('.remove-item');
    if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target) && !isClickInsideCartControls) {
        cartDropdown.classList.remove('active');
    }
    
});

// Add to cart
$$('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
    e.stopPropagation();
    const id = btn.dataset.id;
    const category = btn.dataset.category;
    const prod = products[category].find(p => p.id === id);
    if (!cart[id]) {
        cart[id] = { ...prod, quantity: 1 };
    } else {
        cart[id].quantity++;
    }
    saveCart();
    updateCartCount();
    renderCart();
    // Проверяем, открыта ли корзина:
    if (!$('#cartDropdown').classList.contains('active')) {
        $('#cartDropdown').classList.add('active');
    }
});
});

// Cart item actions
$('#cartItems').addEventListener('click', e => {
    e.stopPropagation();
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('remove-item')) {
        delete cart[id];
    } else if (e.target.dataset.action === 'increase') {
        cart[id].quantity++;
    } else if (e.target.dataset.action === 'decrease') {
        cart[id].quantity = Math.max(1, cart[id].quantity - 1);
    }
    saveCart();
    updateCartCount();
    renderCart();
});

// Initialize cart UI
updateCartCount();
renderCart();

// Checkout (order modal)
$('#checkoutBtn').addEventListener('click', () => {
    renderOrderModal();
    $('#orderModal').classList.add('active');
    $('#cartDropdown').classList.remove('active');
});
$('#closeModal').addEventListener('click', () => {
    $('#orderModal').classList.remove('active');
});

function renderOrderModal() {
    const orderItems = $('#orderItems');
    orderItems.innerHTML = '';
    Object.values(cart).forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<span>${item.name} x${item.quantity}</span><span>${(item.price * item.quantity).toLocaleString()} ₽</span>`;
        orderItems.appendChild(div);
    });
    $('#orderTotal').textContent = calcTotal().toLocaleString();
}

$('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    // data validation and demo submit
    const name = $('#customerName').value.trim();
    const phone = $('#customerPhone').value.trim();
    const email = $('#customerEmail').value.trim();
    const address = $('#customerAddress').value.trim();
    if (!name || !phone || !email || !address) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }
    // Clean up (simulate order)
    cart = {};
    saveCart();
    updateCartCount();
    renderCart();
    $('#orderModal').classList.remove('active');
    alert('Спасибо за заказ! С вами скоро свяжется наш менеджер!');
});

// Scroll to order sections
$$('.cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.scrollTo({ top: $('#phones').offsetTop - 60, behavior: 'smooth' });
    });
});