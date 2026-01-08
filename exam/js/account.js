// JavaScript приложение для личного кабинета

// Конфигурация API
const API_BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '605c13e7-9e68-4177-82c9-769249fbe7b8';

// Глобальные переменные
let orders = [];
let currentPage = 1;
let itemsPerPage = 5;
let currentOrderId = null;

// DOM элементы
const notificationArea = document.getElementById('notificationArea');
const ordersContent = document.getElementById('ordersContent');
const ordersPagination = document.getElementById('ordersPagination');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

// API функции
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Ошибка загрузки данных', 'danger');
        return [];
    }
}

async function putData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating data:', error);
        showNotification('Ошибка обновления данных', 'danger');
        return null;
    }
}

async function deleteData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting data:', error);
        showNotification('Ошибка удаления данных', 'danger');
        return null;
    }
}

// Функции загрузки данных
async function loadOrders() {
    orders = await fetchData('/api/orders');
    renderOrders();
}

// Функции отображения
function renderOrders() {
    if (orders.length === 0) {
        ordersContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5>У вас пока нет заказов</h5>
                <p class="text-muted">Начните обучение с выбора курса или репетитора</p>
                <a href="index.html" class="btn btn-primary">Выбрать курс</a>
            </div>
        `;
        ordersPagination.innerHTML = '';
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    ordersContent.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Дата начала</th>
                        <th>Время начала</th>
                        <th>Продолжительность</th>
                        <th>Студентов</th>
                        <th>Стоимость</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedOrders.map((order, index) => `
                        <tr>
                            <td>${startIndex + index + 1}</td>
                            <td>
                                ${order.course_id ? getCourseName(order.course_id) : getTutorName(order.tutor_id)}
                            </td>
                            <td>${formatDate(order.date_start)}</td>
                            <td>${order.time_start}</td>
                            <td>${order.duration} час${getHourSuffix(order.duration)}</td>
                            <td>${order.persons} студент${getStudentSuffix(order.persons)}</td>
                            <td>${order.price.toLocaleString()} руб.</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-outline-primary btn-sm" onclick="showOrderDetails(${order.id})" title="Подробнее">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-outline-warning btn-sm" onclick="editOrder(${order.id})" title="Изменить">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="confirmDelete(${order.id})" title="Удалить">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    ordersPagination.innerHTML = '';
    
    // Кнопка "Назад"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Назад</a>`;
    ordersPagination.appendChild(prevLi);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
        ordersPagination.appendChild(li);
    }
    
    // Кнопка "Вперед"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Вперед</a>`;
    ordersPagination.appendChild(nextLi);
}

// Вспомогательные функции
function getCourseName(courseId) {
    // Пока сделаем простой вызов API для получения деталей курса
    // В реальном приложении мы можем кэшировать эти данные
    return `Курс ID: ${courseId}`;
}

function getTutorName(tutorId) {
    // Пока сделаем простой вызов API для получения деталей репетитора
    // В реальном приложении мы можем кэшировать эти данные
    return `Репетитор ID: ${tutorId}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getHourSuffix(hours) {
    if (hours % 10 === 1 && hours % 100 !== 11) {
        return '';
    } else if (hours % 10 >= 2 && hours % 10 <= 4 && (hours % 100 < 10 || hours % 100 >= 20)) {
        return 'а';
    } else {
        return 'ов';
    }
}

function getStudentSuffix(students) {
    if (students === 1) return '';
    if (students >= 2 && students <= 4) return 'а';
    return 'ов';
}

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    notificationArea.appendChild(notification);
    
    // Автоматическое закрытие через duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
}

// Функции модальных окон
async function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let detailsHtml = `
        <div class="row">
            <div class="col-md-6">
                <h6>Основная информация</h6>
                <table class="table table-sm">
                    <tr><td><strong>ID заказа:</strong></td><td>${order.id}</td></tr>
                    <tr><td><strong>Тип:</strong></td><td>${order.course_id ? 'Курс' : 'Репетитор'}</td></tr>
                    <tr><td><strong>Название:</strong></td><td>${order.course_id ? getCourseName(order.course_id) : getTutorName(order.tutor_id)}</td></tr>
                    <tr><td><strong>Дата начала:</strong></td><td>${formatDate(order.date_start)}</td></tr>
                    <tr><td><strong>Время начала:</strong></td><td>${order.time_start}</td></tr>
                    <tr><td><strong>Продолжительность:</strong></td><td>${order.duration} час${getHourSuffix(order.duration)}</td></tr>
                    <tr><td><strong>Количество студентов:</strong></td><td>${order.persons}</td></tr>
                    <tr><td><strong>Общая стоимость:</strong></td><td>${order.price.toLocaleString()} руб.</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Дополнительные опции</h6>
                <div class="list-group">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Ранняя регистрация
                        <span class="badge ${order.early_registration ? 'bg-success' : 'bg-secondary'}">${order.early_registration ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Групповая запись
                        <span class="badge ${order.group_enrollment ? 'bg-success' : 'bg-secondary'}">${order.group_enrollment ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Интенсивный курс
                        <span class="badge ${order.intensive_course ? 'bg-success' : 'bg-secondary'}">${order.intensive_course ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Дополнительные материалы
                        <span class="badge ${order.supplementary ? 'bg-success' : 'bg-secondary'}">${order.supplementary ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Индивидуальные занятия
                        <span class="badge ${order.personalized ? 'bg-success' : 'bg-secondary'}">${order.personalized ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Культурные экскурсии
                        <span class="badge ${order.excursions ? 'bg-success' : 'bg-secondary'}">${order.excursions ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Оценка уровня
                        <span class="badge ${order.assessment ? 'bg-success' : 'bg-secondary'}">${order.assessment ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        Интерактивная платформа
                        <span class="badge ${order.interactive ? 'bg-success' : 'bg-secondary'}">${order.interactive ? 'Да' : 'Нет'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsContent').innerHTML = detailsHtml;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

async function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    let editHtml = `
        <form id="editOrderForm">
            <input type="hidden" id="editOrderId" value="${order.id}">
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Тип заказа</label>
                    <input type="text" class="form-control" value="${order.course_id ? 'Курс' : 'Репетитор'}" readonly>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Название</label>
                    <input type="text" class="form-control" value="${order.course_id ? getCourseName(order.course_id) : getTutorName(order.tutor_id)}" readonly>
                </div>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="editStartDate" class="form-label">Дата начала</label>
                    <input type="date" class="form-control" id="editStartDate" value="${order.date_start}" required>
                </div>
                <div class="col-md-6">
                    <label for="editStartTime" class="form-label">Время начала</label>
                    <input type="time" class="form-control" id="editStartTime" value="${order.time_start}" required>
                </div>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="editDuration" class="form-label">Продолжительность (часы)</label>
                    <input type="number" class="form-control" id="editDuration" min="1" max="40" value="${order.duration}" required>
                </div>
                <div class="col-md-6">
                    <label for="editPersons" class="form-label">Количество студентов</label>
                    <input type="number" class="form-control" id="editPersons" min="1" max="20" value="${order.persons}" required>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Дополнительные опции</label>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editEarlyRegistration" ${order.early_registration ? 'checked' : ''}>
                            <label class="form-check-label" for="editEarlyRegistration">
                                Ранняя регистрация
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editGroupEnrollment" ${order.group_enrollment ? 'checked' : ''}>
                            <label class="form-check-label" for="editGroupEnrollment">
                                Групповая запись
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editIntensiveCourse" ${order.intensive_course ? 'checked' : ''}>
                            <label class="form-check-label" for="editIntensiveCourse">
                                Интенсивный курс
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editSupplementary" ${order.supplementary ? 'checked' : ''}>
                            <label class="form-check-label" for="editSupplementary">
                                Дополнительные материалы
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editPersonalized" ${order.personalized ? 'checked' : ''}>
                            <label class="form-check-label" for="editPersonalized">
                                Индивидуальные занятия
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editExcursions" ${order.excursions ? 'checked' : ''}>
                            <label class="form-check-label" for="editExcursions">
                                Культурные экскурсии
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editAssessment" ${order.assessment ? 'checked' : ''}>
                            <label class="form-check-label" for="editAssessment">
                                Оценка уровня
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="editInteractive" ${order.interactive ? 'checked' : ''}>
                            <label class="form-check-label" for="editInteractive">
                                Интерактивная платформа
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;
    
    document.getElementById('editOrderContent').innerHTML = editHtml;
    
    const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    modal.show();
}

async function saveOrderChanges() {
    if (!currentOrderId) return;
    
    const order = orders.find(o => o.id === currentOrderId);
    if (!order) return;
    
    const updatedOrder = {
        ...order,
        date_start: document.getElementById('editStartDate').value,
        time_start: document.getElementById('editStartTime').value,
        duration: parseInt(document.getElementById('editDuration').value),
        persons: parseInt(document.getElementById('editPersons').value),
        early_registration: document.getElementById('editEarlyRegistration').checked,
        group_enrollment: document.getElementById('editGroupEnrollment').checked,
        intensive_course: document.getElementById('editIntensiveCourse').checked,
        supplementary: document.getElementById('editSupplementary').checked,
        personalized: document.getElementById('editPersonalized').checked,
        excursions: document.getElementById('editExcursions').checked,
        assessment: document.getElementById('editAssessment').checked,
        interactive: document.getElementById('editInteractive').checked
    };
    
    const result = await putData(`/api/orders/${currentOrderId}`, updatedOrder);
    
    if (result) {
        showNotification('Заказ успешно обновлен!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
        modal.hide();
        loadOrders(); // Перезагрузка заказов для отражения изменений
    }
}

function confirmDelete(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('deleteOrderInfo').innerHTML = `
        <strong>Заказ:</strong> ${order.course_id ? getCourseName(order.course_id) : getTutorName(order.tutor_id)}<br>
        <strong>Дата:</strong> ${formatDate(order.date_start)}<br>
        <strong>Стоимость:</strong> ${order.price.toLocaleString()} руб.
    `;
    
    currentOrderId = orderId;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteOrderModal'));
    modal.show();
}

async function confirmDeleteOrder() {
    if (!currentOrderId) return;
    
    const result = await deleteData(`/api/orders/${currentOrderId}`);
    
    if (result) {
        showNotification('Заказ успешно удален!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteOrderModal'));
        modal.hide();
        loadOrders(); // Перезагрузка заказов для отражения изменений
    }
}

// Функции пагинации
function changePage(page) {
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    currentPage = page;
    renderOrders();
}

// Экспорт функций в глобальную область видимости для обработчиков onclick
window.changePage = changePage;
window.showOrderDetails = showOrderDetails;
window.editOrder = editOrder;
window.saveOrderChanges = saveOrderChanges;
window.confirmDelete = confirmDelete;
window.confirmDeleteOrder = confirmDeleteOrder;