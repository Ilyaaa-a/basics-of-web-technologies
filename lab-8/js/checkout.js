const API_KEY = '605c13e7-9e68-4177-82c9-769249fbe7b8';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';

let dishes = [];

// Загружаем меню
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

// Отображаем состав заказа
function renderOrderSection() {
    const container = document.getElementById('order-section');
    const hasAny = Object.values(currentOrder).some(v => v !== null);

    if (!hasAny) {
        container.innerHTML = `
        <div>
            <h3>Состав заказа</h3>
            <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу 
                <a href="/lab-8/pages/lunch.html">Собрать ланч</a>.
            </p>
        </div>
        `;
        return;
    }

    // let html = '<h3>Состав заказа</h3>';
    let html = '';
    for (const [category, dish] of Object.entries(currentOrder)) {
        if (dish) {
            const dishData = dishes.find(d => d.keyword === dish.keyword);
            if (dishData) {
                html += `
                    <div class="dish-card">
                        <img src="${dishData.image}" alt="${dishData.name}">
                        <p class="price">${dishData.price}₽</p>
                        <p class="name">${dishData.name}</p>
                        <p class="weight">${dishData.count}</p>
                        <button class="remove-btn" data-category="${category}">Удалить</button>
                    </div>
                `;
            }
        }
    }
    container.innerHTML = html;

    // Обработчики удаления
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            removeFromOrder(cat); // ← используем функцию из orderManager.js
            renderOrderSection(); // ← перерисовываем состав заказа
        });
    });
}

// Обновляем поля в форме (для совместимости с ЛР6-валидацией)
function updateFormFields() {
    const mapping = {
        'soup': 'soup_id',
        'main-course': 'main_course_id',
        'salad': 'salad_id',
        'drink': 'drink_id',
        'dessert': 'dessert_id'
    };
    for (const [cat, field] of Object.entries(mapping)) {
        const dish = currentOrder[cat];
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            input.value = dish ? dish.keyword : '';
        }
    }
}

// Валидация комбо (копия из validation.js, но без UI показа — только логика)
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

// Отправка заказа
async function submitOrder(formData) {
    const payload = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type'),
        comment: formData.get('comment') || '',
        subscribe: formData.get('subscribe') === '1' ? 1 : 0
    };

    // Добавляем время, если нужно
    if (payload.delivery_type === 'by_time') {
        const time = formData.get('delivery_time');
        if (!time) {
            alert('Укажите время доставки');
            return;
        }
        payload.delivery_time = time;
    }

    // Добавляем ID блюд
    const keywordToId = (keyword) => dishes.find(d => d.keyword === keyword)?.id;
    if (currentOrder.soup) payload.soup_id = keywordToId(currentOrder.soup.keyword);
    if (currentOrder['main-course']) payload.main_course_id = keywordToId(currentOrder['main-course'].keyword);
    if (currentOrder.salad) payload.salad_id = keywordToId(currentOrder.salad.keyword);
    if (currentOrder.drink) payload.drink_id = keywordToId(currentOrder.drink.keyword);
    if (currentOrder.dessert) payload.dessert_id = keywordToId(currentOrder.dessert.keyword);

    try {
        const res = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || 'Ошибка сервера');
        }

        // Успешно → очищаем localStorage
        localStorage.removeItem('food_construct_order');
        alert('✅ Заказ успешно оформлен!');
        window.location.href = '/lab-8/pages/lunch.html';
    } catch (err) {
        console.error(err);
        alert('❌ Ошибка при оформлении заказа:\n' + err.message);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadDishes();
    renderOrderSection();

    const form = document.getElementById('checkout-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isValidCombo()) {
            alert('❌ Состав заказа не соответствует ни одному из допустимых комбо.');
            return;
        }
        const formData = new FormData(form);
        submitOrder(formData);
    });
});