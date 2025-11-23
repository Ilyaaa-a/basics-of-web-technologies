document.addEventListener('DOMContentLoaded', function() {
    // Получаем секции для каждой категории
    const soupSection = document.querySelector('.category:nth-of-type(1) .dishes-grid');
    const mainCourseSection = document.querySelector('.category:nth-of-type(2) .dishes-grid');
    const beverageSection = document.querySelector('.category:nth-of-type(3) .dishes-grid');

    // Сортируем блюда по категориям и по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

    // Группируем по категориям
    const soups = sortedDishes.filter(dish => dish.category === 'soup');
    const mainCourses = sortedDishes.filter(dish => dish.category === 'main_course');
    const beverages = sortedDishes.filter(dish => dish.category === 'beverage');

    // Функция для создания карточки блюда
    function createDishCard(dish) {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.setAttribute('data-dish', dish.keyword); // Добавляем data-атрибут

        card.innerHTML = `
            <img src="/lab-4/images/${dish.image}.jpg" alt="${dish.name}">
            <p class="price">${dish.price}₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button>Добавить</button>
        `;

        // Добавляем обработчик клика
        card.addEventListener('click', function() {
            addToOrder(dish);
        });

        return card;
    }

    // Очищаем содержимое секций (на случай, если там что-то есть)
    soupSection.innerHTML = '';
    mainCourseSection.innerHTML = '';
    beverageSection.innerHTML = '';

    // Добавляем блюда в соответствующие секции
    soups.forEach(dish => soupSection.appendChild(createDishCard(dish)));
    mainCourses.forEach(dish => mainCourseSection.appendChild(createDishCard(dish)));
    beverages.forEach(dish => beverageSection.appendChild(createDishCard(dish)));
});