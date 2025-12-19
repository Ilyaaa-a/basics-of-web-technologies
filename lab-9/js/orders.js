const API_KEY = '605c13e7-9e68-4177-82c9-769249fbe7b8';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
let dishes = [];
let orders = [];

// Загрузка всех блюд (нужно для отображения названий)
async function loadDishes() {
    try {
        const res = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Не удалось загрузить блюда');
        dishes = await res.json();
    } catch (err) {
        console.error(err);
        alert('Ошибка загрузки меню');
    }
}

// Получить заказы пользователя
async function fetchOrders() {
    try {
        const res = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Не удалось загрузить заказы');
        orders = await res.json();
        // Сортировка: новые — сверху
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        renderOrders();
    } catch (err) {
        document.getElementById('orders-container').innerHTML = `<p>Ошибка: ${err.message}</p>`;
    }
}

// Получить название блюда по ID
function getDishNameById(id) {
    const dish = dishes.find(d => d.id === id);
    return dish ? dish.name : '—';
}

// Получить строку состава заказа
function getOrderItems(order) {
    const items = [];
    if (order.soup_id) items.push(getDishNameById(order.soup_id));
    if (order.main_course_id) items.push(getDishNameById(order.main_course_id));
    if (order.salad_id) items.push(getDishNameById(order.salad_id));
    if (order.drink_id) items.push(getDishNameById(order.drink_id));
    if (order.dessert_id) items.push(getDishNameById(order.dessert_id));
    return items.length ? items.join(', ') : 'Пусто';
}

// Форматирование даты
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Форматирование времени доставки
function getDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time;
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

// Отображение списка заказов
function renderOrders() {
    const container = document.getElementById('orders-container');
    if (orders.length === 0) {
        container.innerHTML = '<p>У вас пока нет заказов.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата оформления</th>
                    <th>Состав заказа</th>
                    <th>Стоимость</th>
                    <th>Время доставки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `;
    orders.forEach((order, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${formatDate(order.created_at)}</td>
                <td>${getOrderItems(order)}</td>
                <td>${order.drink_id ? 'рассчитывается на сервере' : '—'} ₽</td>
                <td>${getDeliveryTime(order)}</td>
                <td>
                    <button class="view" data-id="${order.id}">👁️</button>
                    <button class="edit" data-id="${order.id}">✏️</button>
                    <button class="delete" data-id="${order.id}">🗑️</button>
                </td>
            </tr>
        `;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    // Назначаем обработчики
    document.querySelectorAll('.view').forEach(btn => {
        btn.addEventListener('click', () => showModal('view', btn.dataset.id));
    });
    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => showModal('edit', btn.dataset.id));
    });
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => showModal('delete', btn.dataset.id));
    });
}

// Показ модального окна
async function showModal(mode, orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;

    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions');

    // Очистка
    body.innerHTML = '';
    actions.innerHTML = '';

    if (mode === 'view') {
        body.innerHTML = `
            <h2>Просмотр заказа #${order.id}</h2>
            <div class="modal-body">
                <p><strong>Дата оформления:</strong> ${formatDate(order.created_at)}</p>
                <h3>Доставка</h3>
                <p><strong>Имя получателя:</strong> ${order.full_name}</p>
                <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
                <p><strong>Время доставки:</strong> ${getDeliveryTime(order)}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <h3>Комментарий</h3>
                <p>${order.comment || '—'}</p>
                <h3>Состав заказа</h3>
                ${getOrderItemsWithPrice(order)}
                <p><strong>Стоимость:</strong> ${order.drink_id ? 'рассчитывается на сервере' : '—'} ₽</p>
            </div>
        `;
        actions.innerHTML = `<button class="modal-close-btn">Ок</button>`;
    }

    if (mode === 'edit') {
        body.innerHTML = `
            <h2>Редактирование заказа #${order.id}</h2>
            <div class="modal-body">
                <p><strong>Дата оформления:</strong> ${formatDate(order.created_at)}</p>
                <h3>Доставка</h3>
                <form id="edit-form">
                    <div class="form-group">
                        <label>Имя получателя</label>
                        <input type="text" name="full_name" value="${order.full_name}" required>
                    </div>
                    <div class="form-group">
                        <label>Адрес доставки</label>
                        <input type="text" name="delivery_address" value="${order.delivery_address}" required>
                    </div>
                    <div class="form-group">
                        <label>Время доставки</label>
                        <select name="delivery_type" id="delivery_type_edit">
                            <option value="now" ${order.delivery_type === 'now' ? 'selected' : ''}>Как можно скорее</option>
                            <option value="by_time" ${order.delivery_type === 'by_time' ? 'selected' : ''}>Ко времени</option>
                        </select>
                    </div>
                    <div class="form-group" id="time-field-edit">
                        <label>Укажите время доставки</label>
                        <input type="time" name="delivery_time" value="${order.delivery_time || ''}" min="07:00" max="23:00" step="300">
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="tel" name="phone" value="${order.phone}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value="${order.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Комментарий</label>
                        <textarea name="comment">${order.comment || ''}</textarea>
                    </div>
                    <h3>Состав заказа</h3>
                    ${getOrderItemsWithPrice(order)}
                    <p><strong>Стоимость:</strong> ${order.drink_id ? 'рассчитывается на сервере' : '—'} ₽</p>
                </form>
            </div>
        `;
        // Показ/скрытие времени
        const typeSelect = document.getElementById('delivery_type_edit');
        const timeField = document.getElementById('time-field-edit');
        typeSelect.addEventListener('change', () => {
            timeField.style.display = typeSelect.value === 'by_time' ? 'block' : 'none';
        });
        if (order.delivery_type !== 'by_time') timeField.style.display = 'none';

        actions.innerHTML = `
            <button class="cancel modal-close-btn">Отмена</button>
            <button class="save" type="button" onclick="saveOrderEdit(${order.id})">Сохранить</button>
        `;
    }

    if (mode === 'delete') {
        body.innerHTML = `<p>Вы уверены, что хотите удалить заказ #${order.id}?</p>`;
        actions.innerHTML = `
            <button class="cancel modal-close-btn">Отмена</button>
            <button class="confirm" type="button" onclick="deleteOrder(${order.id})">Да</button>
        `;
    }

    // Закрытие по крестику или "Отмена"
    overlay.querySelectorAll('.modal-close-btn, .modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    });

    overlay.classList.remove('hidden');
}

// Сохранение изменений
async function saveOrderEdit(orderId) {
    const form = document.getElementById('edit-form');
    if (!form) return;

    const formData = new FormData(form);
    const payload = {};
    for (let [key, value] of formData.entries()) {
        payload[key] = value;
    }

    // Удаляем пустые значения
    if (!payload.comment) delete payload.comment;
    if (payload.delivery_type !== 'by_time') delete payload.delivery_time;

    try {
        const res = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Ошибка при сохранении');
        alert('✅ Заказ успешно изменён!');
        overlay.classList.add('hidden');
        fetchOrders(); // Обновляем список
    } catch (err) {
        alert('❌ Ошибка: ' + err.message);
    }
}

// Удаление заказа
async function deleteOrder(orderId) {
    try {
        const res = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Ошибка при удалении');
        alert('✅ Заказ удалён!');
        overlay.classList.add('hidden');
        fetchOrders();
    } catch (err) {
        alert('❌ Ошибка: ' + err.message);
    }
}

// Вспомогательная функция для вывода состава с ценой
function getOrderItemsWithPrice(order) {
    let html = '';
    if (order.soup_id) html += `<p><strong>Суп:</strong> ${getDishNameById(order.soup_id)} (${getDishPriceById(order.soup_id)}₽)</p>`;
    if (order.main_course_id) html += `<p><strong>Основное блюдо:</strong> ${getDishNameById(order.main_course_id)} (${getDishPriceById(order.main_course_id)}₽)</p>`;
    if (order.salad_id) html += `<p><strong>Салат/стартер:</strong> ${getDishNameById(order.salad_id)} (${getDishPriceById(order.salad_id)}₽)</p>`;
    if (order.drink_id) html += `<p><strong>Напиток:</strong> ${getDishNameById(order.drink_id)} (${getDishPriceById(order.drink_id)}₽)</p>`;
    if (order.dessert_id) html += `<p><strong>Десерт:</strong> ${getDishNameById(order.dessert_id)} (${getDishPriceById(order.dessert_id)}₽)</p>`;
    return html;
}

// Получить цену блюда по ID
function getDishPriceById(id) {
    const dish = dishes.find(d => d.id === id);
    return dish ? dish.price : 0;
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadDishes();
    await fetchOrders();
});