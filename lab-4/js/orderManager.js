// Объект для хранения текущего заказа
let currentOrder = {
    soup: null,
    main_course: null,
    beverage: null
};

// Функция для добавления блюда в заказ
function addToOrder(dish) {
    currentOrder[dish.category] = dish;
    updateOrderDisplay();
}

// Функция для обновления отображения заказа
function updateOrderDisplay() {
    const orderSection = document.querySelector('.order-section');
    const costElement = document.getElementById('total-cost');

    // Убираем старые элементы заказа (кроме заголовка)
    const oldItems = orderSection.querySelectorAll('.order-item');
    oldItems.forEach(item => item.remove());

    // Проверяем, есть ли хоть одно блюдо
    const hasAnyDish = Object.values(currentOrder).some(item => item !== null);

    if (!hasAnyDish) {
        // Если ничего не выбрано
        orderSection.innerHTML = `
            <h3>Ваш заказ</h3>
            <p>Ничего не выбрано</p>
        `;
        if (costElement) costElement.style.display = 'none';
        return;
    }

    // Восстанавливаем заголовок
    let html = `<h3>Ваш заказ</h3>`;

    // Отображаем каждую категорию
    for (const [category, dish] of Object.entries(currentOrder)) {
        const categoryName = getCategoryName(category);
        const placeholderText = getPlaceholderText(category);

        if (dish) {
            html += `
                <div class="order-item">
                    <strong>${categoryName}</strong><br>
                    ${dish.name} ${dish.price}₽
                </div>
            `;
        } else {
            html += `
                <div class="order-item">
                    <strong>${categoryName}</strong><br>
                    ${placeholderText}
                </div>
            `;
        }
    }

    // Добавляем стоимость
    const totalCost = calculateTotalCost();
    html += `
        <div class="order-item" id="total-cost">
            <strong>Стоимость заказа</strong><br>
            ${totalCost}₽
        </div>
    `;

    orderSection.innerHTML = html;

    // Показываем блок стоимости
    if (costElement) {
        costElement.style.display = 'block';
    }
}

// Вспомогательные функции
function getCategoryName(category) {
    switch(category) {
        case 'soup': return 'Суп';
        case 'main_course': return 'Главное блюдо';
        case 'beverage': return 'Напиток';
        default: return '';
    }
}

function getPlaceholderText(category) {
    switch(category) {
        case 'soup': return 'Блюдо не выбрано';
        case 'main_course': return 'Блюдо не выбрано';
        case 'beverage': return 'Напиток не выбран';
        default: return '';
    }
}

function calculateTotalCost() {
    return Object.values(currentOrder)
        .filter(dish => dish !== null)
        .reduce((sum, dish) => sum + dish.price, 0);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateOrderDisplay(); // Изначально показываем "Ничего не выбрано"
});