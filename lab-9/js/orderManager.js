// Храним заказ в localStorage
const ORDER_STORAGE_KEY = 'food_construct_order';

// Инициализация заказа из localStorage
let currentOrder = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || {
    soup: null,
    'main-course': null,
    salad: null,
    drink: null,
    dessert: null
};

// Сохраняем заказ в localStorage при любом изменении
function saveOrderToStorage() {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(currentOrder));
}

// Функция для добавления блюда в заказ
function addToOrder(dish) {
    currentOrder[dish.category] = dish;
    saveOrderToStorage();
    if (typeof updateOrderDisplay === 'function') {
        updateOrderDisplay();
    }
    if (typeof updateStickyPanel === 'function') {
        updateStickyPanel();
    }
}

// Функция для удаления блюда из заказа (используется и на lunch.html, и на checkout.html)
function removeFromOrder(category) {
    currentOrder[category] = null;
    saveOrderToStorage();
    if (typeof updateOrderDisplay === 'function') {
        updateOrderDisplay();
    }
    if (typeof updateStickyPanel === 'function') {
        updateStickyPanel();
    }
}

// Вспомогательные функции
function getCategoryName(category) {
    switch(category) {
        case 'soup': return 'Суп';
        case 'main-course': return 'Главное блюдо';
        case 'salad': return 'Салат/стартер';
        case 'drink': return 'Напиток';
        case 'dessert': return 'Десерт';
        default: return '';
    }
}

function getPlaceholderText(category) {
    switch(category) {
        case 'soup':
        case 'main-course':
        case 'salad':
            return 'Блюдо не выбрано';
        case 'drink':
            return 'Напиток не выбран';
        case 'dessert':
            return 'Десерт не выбран';
        default: return '';
    }
}

function calculateTotalCost() {
    return Object.values(currentOrder)
        .filter(dish => dish !== null)
        .reduce((sum, dish) => sum + dish.price, 0);
}

// Валидация комбо (для sticky-панели и проверки при отправке)
function isValidCombo() {
    const hasSoup = currentOrder.soup !== null;
    const hasMain = currentOrder['main-course'] !== null;
    const hasSalad = currentOrder.salad !== null;
    const hasDrink = currentOrder.drink !== null;

    if (!hasDrink) return false;
    if (!hasSoup && !hasMain && !hasSalad) return false;
    if (hasSoup && !hasMain && !hasSalad) return false;
    if (hasSalad && !hasSoup && !hasMain) return false;
    if (!hasSoup && !hasMain && !hasSalad && hasDrink) return false;

    return true;
}

// Функция обновления отображения заказа на lunch.html
function updateOrderDisplay() {
    const orderSection = document.querySelector('.order-section');
    if (!orderSection) return;

    const oldItems = orderSection.querySelectorAll('.order-item');
    oldItems.forEach(item => item.remove());

    const hasAnyDish = Object.values(currentOrder).some(item => item !== null);
    if (!hasAnyDish) {
        orderSection.innerHTML = `<h3>Ваш заказ</h3><p>Ничего не выбрано</p>`;
        const costEl = document.getElementById('total-cost');
        if (costEl) costEl.style.display = 'none';
        return;
    }

    let html = `<h3>Ваш заказ</h3>`;
    for (const [category, dish] of Object.entries(currentOrder)) {
        const catName = getCategoryName(category);
        const placeholder = getPlaceholderText(category);
        if (dish) {
            html += `<div class="order-item"><strong>${catName}</strong><br>${dish.name} ${dish.price}₽</div>`;
        } else {
            html += `<div class="order-item"><strong>${catName}</strong><br>${placeholder}</div>`;
        }
    }

    html += `<div class="order-item" id="total-cost"><strong>Стоимость заказа</strong><br>${calculateTotalCost()}₽</div>`;
    orderSection.innerHTML = html;
    const costEl = document.getElementById('total-cost');
    if (costEl) costEl.style.display = 'block';
}

// Обновление sticky-панели на lunch.html
function updateStickyPanel() {
    const total = calculateTotalCost();
    const hasAny = Object.values(currentOrder).some(v => v !== null);
    const panel = document.getElementById('checkout-sticky');
    const link = document.getElementById('checkout-link');

    if (!panel || !link) return;

    if (!hasAny) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    document.getElementById('order-total').textContent = total;

    if (isValidCombo()) {
        link.classList.remove('disabled');
    } else {
        link.classList.add('disabled');
    }
}

// Инициализация на lunch.html
document.addEventListener('DOMContentLoaded', function () {
    const isLunchPage = window.location.pathname.includes('lunch.html');
    if (isLunchPage) {
        updateOrderDisplay();
        updateStickyPanel();
    }
});