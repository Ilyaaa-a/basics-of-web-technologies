// /lab-6/js/displayDishes.js

let dishes = [];

async function loadDishes() {
    const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }

        dishes = await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить меню');
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    await loadDishes();
    
    // Получаем секции для каждой категории
    const soupSection = document.querySelector('.category:nth-of-type(1) .dishes-grid');
    const mainCourseSection = document.querySelector('.category:nth-of-type(2) .dishes-grid');
    const starterSection = document.querySelector('.category:nth-of-type(3) .dishes-grid');
    const beverageSection = document.querySelector('.category:nth-of-type(4) .dishes-grid');
    const dessertSection = document.querySelector('.category:nth-of-type(5) .dishes-grid');

    // Создаем блоки с фильтрами
    createFilters(soupSection, 'soup', ['рыбный', 'мясной', 'вегетарианский'], ['fish', 'meat', 'veg']);
    createFilters(mainCourseSection, 'main-course', ['рыбное', 'мясное', 'вегетарианское'], ['fish', 'meat', 'veg']);
    createFilters(starterSection, 'salad', ['рыбный', 'мясной', 'вегетарианский'], ['fish', 'meat', 'veg']);
    createFilters(beverageSection, 'drink', ['холодный', 'горячий'], ['cold', 'hot']);
    createFilters(dessertSection, 'dessert', ['маленькая порция', 'средняя порция', 'большая порция'], ['small', 'medium', 'large']);

    // Функция для создания фильтров
    function createFilters(container, category, filterNames, filterKinds) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters';

        filterNames.forEach((name, index) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.setAttribute('data-kind', filterKinds[index]);
            button.addEventListener('click', () => toggleFilter(button, category));
            filtersContainer.appendChild(button);
        });

        container.parentNode.insertBefore(filtersContainer, container);
    }

    // Функция для переключения фильтра
    function toggleFilter(button, category) {
        const buttons = button.parentNode.querySelectorAll('button');
        buttons.forEach(btn => btn.classList.remove('active'));

        if (!button.classList.contains('active')) {
            button.classList.add('active');
            applyFilter(category, button.getAttribute('data-kind'));
        } else {
            applyFilter(category, null); // Показать все
        }
    }

    // Функция для применения фильтра
    function applyFilter(category, kind) {
        let section;
        switch(category) {
            case 'soup': section = soupSection; break;
            case 'main-course': section = mainCourseSection; break;
            case 'salad': section = starterSection; break;
            case 'drink': section = beverageSection; break;
            case 'dessert': section = dessertSection; break;
        }

        // Очищаем контейнер
        section.innerHTML = '';

        // Фильтруем блюда
        let filteredDishes = dishes.filter(dish => dish.category === category);
        if (kind) {
            filteredDishes = filteredDishes.filter(dish => dish.kind === kind);
        }

        // Сортируем по алфавиту
        filteredDishes.sort((a, b) => a.name.localeCompare(b.name));

        // Добавляем карточки
        filteredDishes.forEach(dish => section.appendChild(createDishCard(dish)));
    }

    // Функция для создания карточки блюда
    function createDishCard(dish) {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.setAttribute('data-dish', dish.keyword);

        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
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

    // Инициализация: показываем все блюда без фильтра
    applyFilter('soup', null);
    applyFilter('main-course', null);
    applyFilter('salad', null);
    applyFilter('drink', null);
    applyFilter('dessert', null);
});