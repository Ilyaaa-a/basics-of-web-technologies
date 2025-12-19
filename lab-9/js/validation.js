// /lab-4/js/validation.js

document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.querySelector('.order-form form');

    // Предотвращаем отправку формы по умолчанию
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();
        validateOrder();
    });

    // Функция проверки заказа
    function validateOrder() {
        // Получаем текущий заказ
        const hasSoup = currentOrder.soup !== null;
        const hasMainCourse = currentOrder['main-course'] !== null;
        const hasStarter = currentOrder.salad !== null;
        const hasBeverage = currentOrder.drink !== null;
        const hasDessert = currentOrder.dessert !== null;


        // Проверяем, есть ли хоть одно блюдо
        if (!hasSoup && !hasMainCourse && !hasStarter && !hasBeverage) {
            showNotification("Ничего не выбрано. Выберите блюда для заказа", "Ничего не выбрано");
            return;
        }

        // Проверка на наличие напитка (обязательно во всех комбо)
        if (!hasBeverage) {
            showNotification("Выберите напиток", "Выберите напиток");
            return;
        }

        // Проверка комбо:
        // 1. Суп + Главное блюдо + Салат + Напиток
        // 2. Суп + Главное блюдо + Напиток
        // 3. Суп + Салат + Напиток
        // 4. Главное блюдо + Салат + Напиток
        // 5. Главное блюдо + Напиток

        // Если есть суп, но нет ни главного блюда, ни салата
        if (hasSoup && !hasMainCourse && !hasStarter) {
            showNotification("Выберите главное блюдо/салат/стартер", "Выберите главное блюдо/салат/стартер");
            return;
        }

        // Если есть салат, но нет ни супа, ни главного блюда
        if (hasStarter && !hasSoup && !hasMainCourse) {
            showNotification("Выберите суп или главное блюдо", "Выберите суп или главное блюдо");
            return;
        }

        // Если есть только напиток (и, возможно, десерт), но нет главного блюда
        if (!hasSoup && !hasMainCourse && !hasStarter && hasBeverage) {
            showNotification("Выберите главное блюдо", "Выберите главное блюдо");
            return;
        }

        // Если все ок — отправляем форму
        alert("Ваш заказ прошел проверку! Форма будет отправлена.");
        // orderForm.submit(); // Раскомментируйте, если хотите реальную отправку
    }

    // Функция показа уведомления
    function showNotification(message, title) {
        // Создаем overlay
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';

        // Создаем контейнер уведомления
        const notificationBox = document.createElement('div');
        notificationBox.className = 'notification-box';

        // Заголовок
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        notificationBox.appendChild(titleElement);

        // Текст сообщения
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        notificationBox.appendChild(messageElement);

        // Кнопка "Окей"
        const button = document.createElement('button');
        button.className = 'notification-button';
        button.textContent = 'Окей 👍';
        button.addEventListener('click', function () {
            document.body.removeChild(overlay);
        });
        notificationBox.appendChild(button);

        // Добавляем в DOM
        overlay.appendChild(notificationBox);
        document.body.appendChild(overlay);
    }
});