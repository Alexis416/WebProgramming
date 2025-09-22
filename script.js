document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.getElementById('cart-icon');
  const cartBlock = document.getElementById('cart-block');
  const cartCount = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');
  const cartItemsContainer = document.getElementById('cart-items');
  const orderForm = document.getElementById('order-form');

  let cart = {};

  // Загрузка корзины из localStorage (если есть)
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
  } else {
    cart = {};
  }
  updateCartDisplay();

  // Показ/скрытие блока корзины
  cartIcon.addEventListener('click', () => {
    cartBlock.classList.toggle('hidden');
  });

  // Обработчик кнопок «В корзину»
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productEl = button.closest('.product');
      const id = productEl.dataset.id;
      const name = productEl.dataset.name;
      const price = parseFloat(productEl.dataset.price);

      if (cart[id]) {
        cart[id].quantity += 1;
      } else {
        cart[id] = { id, name, price, quantity: 1 };
      }
      saveCart();
      updateCartDisplay();
    });
  });

  // Удаление товара из корзины
  function removeItem(id) {
    delete cart[id];
    saveCart();
    updateCartDisplay();
  }

  // Изменение количества товара
  function changeQuantity(id, quantity) {
    if (cart[id]) {
      cart[id].quantity = quantity;
      if (cart[id].quantity <= 0) {
        removeItem(id);
      } else {
        saveCart();
        updateCartDisplay();
      }
    }
  }

  // Обработка клика по кнопкам «+»/«–» и «×» в корзине
  cartItemsContainer.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('qty-increase')) {
      changeQuantity(id, cart[id].quantity + 1);
    } else if (e.target.classList.contains('qty-decrease')) {
      changeQuantity(id, cart[id].quantity - 1);
    } else if (e.target.classList.contains('remove-item')) {
      removeItem(id);
    }
  });

  // Обработка ручного ввода количества через input
  cartItemsContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-qty-input')) {
      const id = e.target.dataset.id;
      const quantity = parseInt(e.target.value);
      if (!isNaN(quantity)) {
        changeQuantity(id, quantity);
      }
    }
  });

  // Обновление отображения корзины
  function updateCartDisplay() {
    let totalCount = 0;
    let totalPrice = 0;
    for (let key in cart) {
      totalCount += cart[key].quantity;
      totalPrice += cart[key].price * cart[key].quantity;
    }
    cartCount.textContent = totalCount;
    cartTotalEl.textContent = totalPrice;

    cartItemsContainer.innerHTML = '';
    for (let key in cart) {
      const item = cart[key];
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <span class="item-name">${item.name}</span>
        <div class="item-qty">
          <button class="qty-decrease" data-id="${item.id}">-</button>
          <input type="number" min="1" value="${item.quantity}" class="item-qty-input" data-id="${item.id}">
          <button class="qty-increase" data-id="${item.id}">+</button>
        </div>
        <span>${item.price * item.quantity} руб.</span>
        <button class="remove-item" data-id="${item.id}">&times;</button>
      `;
      cartItemsContainer.appendChild(itemEl);
    }
  }

  // Отправка формы заказа
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Очищаем корзину и показываем сообщение (имитация отправки)
    cart = {};
    saveCart();
    updateCartDisplay();
    cartBlock.classList.add('hidden');
    alert('Спасибо за заказ!');
    orderForm.reset();
  });

  // Сохранение корзины в localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});
