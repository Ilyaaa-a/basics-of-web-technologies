// Конфигурация API
const API_BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '605c13e7-9e68-4177-82c9-769249fbe7b8';

// Глобальные переменные
let courses = [];
let tutors = [];
let orders = [];
let currentPage = 1;
let itemsPerPage = 5;
let yandexMap = null;
let currentPlacemarks = [];

// DOM элементы
const notificationArea = document.getElementById('notificationArea');
const coursesContainer = document.getElementById('coursesContainer');
const tutorsContainer = document.getElementById('tutorsContainer');
const coursesPagination = document.getElementById('coursesPagination');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных с API
    loadCourses();
    loadTutors();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Отображение состояния загрузки
    showNotification('Загрузка данных...', 'info');
    
    // Инициализация карты Яндекс при готовности API
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }
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

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?api_key=${API_KEY}`, {
            method: 'POST',
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
        console.error('Error posting data:', error);
        showNotification('Ошибка сохранения данных', 'danger');
        return null;
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
async function loadCourses() {
    courses = await fetchData('/api/courses');
    renderCourses();
    setupEventListeners();
}

async function loadTutors() {
    tutors = await fetchData('/api/tutors');
    renderTutors();
}

// Функции отображения
function renderCourses() {
    if (courses.length === 0) {
        coursesContainer.innerHTML = '<div class="col-12 text-center">Нет доступных курсов</div>';
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCourses = courses.slice(startIndex, endIndex);
    
    coursesContainer.innerHTML = paginatedCourses.map(course => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card course-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <div class="course-info">
                        <div class="course-level">
                            <i class="fas fa-graduation-cap me-2"></i>
                            <span class="badge ${getLevelBadgeClass(course.level)}">${course.level}</span>
                        </div>
                        <div class="course-duration">
                            <i class="fas fa-clock me-2"></i>
                            ${course.total_length} недель, ${course.week_length} часа в неделю
                        </div>
                        <div class="course-price">
                            <i class="fas fa-tag me-2"></i>
                            ${course.course_fee_per_hour} руб./час
                        </div>
                        <div class="course-teacher">
                            <i class="fas fa-chalkboard-teacher me-2"></i>
                            ${course.teacher}
                        </div>
                    </div>
                    <p class="card-text text-truncate-custom" title="${course.description}">
                        ${course.description}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary btn-sm" onclick="openBookingModal(${course.id})">
                            <i class="fas fa-plus me-2"></i>Записаться
                        </button>
                        <span class="text-muted small">
                            <i class="fas fa-calendar-alt me-1"></i>
                            ${course.start_dates.length} дат начала
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

function renderTutors() {
    if (tutors.length === 0) {
        tutorsContainer.innerHTML = '<div class="col-12 text-center">Нет доступных репетиторов</div>';
        return;
    }
    
    tutorsContainer.innerHTML = tutors.map(tutor => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card tutor-card h-100">
                <div class="card-body text-center">
                    <div class="mb-3">
                        <img src="images/tutors.png" alt="Tutor" class="rounded-circle" width="80" height="80" style="object-fit: cover;">
                    </div>
                    <h5 class="tutor-name">${tutor.name}</h5>
                    <div class="tutor-experience">
                        <i class="fas fa-briefcase me-2"></i>
                        Опыт: ${tutor.work_experience} лет
                    </div>
                    <div class="tutor-languages">
                        <i class="fas fa-globe me-2"></i>
                        <strong>Говорит:</strong> ${tutor.languages_spoken.join(', ')}
                    </div>
                    <div class="tutor-languages">
                        <i class="fas fa-chalkboard-teacher me-2"></i>
                        <strong>Преподает:</strong> ${tutor.languages_offered.join(', ')}
                    </div>
                    <div class="tutor-level">
                        <i class="fas fa-star me-2"></i>
                        <span class="badge ${getLevelBadgeClass(tutor.language_level)}">${tutor.language_level}</span>
                    </div>
                    <div class="tutor-price mt-2">
                        <i class="fas fa-money-bill-wave me-2"></i>
                        <strong>${tutor.price_per_hour} руб./час</strong>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm" onclick="openTutorBookingModal(${tutor.id})">
                            <i class="fas fa-plus me-2"></i>Записаться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    coursesPagination.innerHTML = '';
    
    // Кнопка "Назад"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Назад</a>`;
    coursesPagination.appendChild(prevLi);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
        coursesPagination.appendChild(li);
    }
    
    // Кнопка "Вперед"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Вперед</a>`;
    coursesPagination.appendChild(nextLi);
}

// Вспомогательные функции
function getLevelBadgeClass(level) {
    switch (level.toLowerCase()) {
        case 'beginner':
        case 'начальный':
            return 'badge-beginner';
        case 'intermediate':
        case 'средний':
            return 'badge-intermediate';
        case 'advanced':
        case 'продвинутый':
            return 'badge-advanced';
        default:
            return 'badge-secondary';
    }
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

// Обработчики событий
function setupEventListeners() {
    // Форма поиска курсов
    document.getElementById('courseSearchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterCourses();
    });
    
    // Форма поиска репетиторов
    document.getElementById('tutorSearchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterTutors();
    });
    
    // Реальная фильтрация для поиска курсов
    document.getElementById('searchLevel').addEventListener('change', filterCourses);
    document.getElementById('searchWeekLength').addEventListener('change', filterCourses);
    document.getElementById('searchDuration').addEventListener('change', filterCourses);
    
    // Реальная фильтрация для поиска репетиторов
    document.getElementById('tutorLanguage').addEventListener('change', filterTutors);
    document.getElementById('tutorLevel').addEventListener('change', filterTutors);
    document.getElementById('tutorExperience').addEventListener('change', filterTutors);
    
    // Поиск на карте ресурсов
    document.getElementById('searchResourcesBtn').addEventListener('click', searchResourcesOnMap);
    document.getElementById('resetMapBtn').addEventListener('click', resetMap);
}

// Функции поиска и фильтрации
function filterCourses() {
    const level = document.getElementById('searchLevel').value;
    const weekLength = document.getElementById('searchWeekLength').value;
    const duration = document.getElementById('searchDuration').value;
    
    let filteredCourses = courses;
    
    if (level) {
        filteredCourses = filteredCourses.filter(course => course.level.toLowerCase() === level.toLowerCase());
    }
    
    if (weekLength) {
        filteredCourses = filteredCourses.filter(course => course.week_length === parseInt(weekLength));
    }
    
    if (duration) {
        filteredCourses = filteredCourses.filter(course => course.total_length === parseInt(duration));
    }
    
    // Временно обновляем глобальный массив courses для пагинации
    const originalCourses = courses;
    courses = filteredCourses;
    currentPage = 1;
    renderCourses();
    
    // Восстанавливаем оригинальные курсы после отображения
    if (filteredCourses.length === 0) {
        courses = originalCourses;
    }
}

function filterTutors() {
    const language = document.getElementById('tutorLanguage').value;
    const level = document.getElementById('tutorLevel').value;
    const experience = document.getElementById('tutorExperience').value;
    
    let filteredTutors = tutors;
    
    if (language) {
        filteredTutors = filteredTutors.filter(tutor => 
            tutor.languages_offered.some(lang => lang.toLowerCase().includes(language.toLowerCase()))
        );
    }
    
    if (level) {
        filteredTutors = filteredTutors.filter(tutor => tutor.language_level.toLowerCase() === level.toLowerCase());
    }
    
    if (experience) {
        const [minExp, maxExp] = experience.split('-').map(e => e.replace('+', ''));
        filteredTutors = filteredTutors.filter(tutor => {
            if (maxExp) {
                return tutor.work_experience >= parseInt(minExp) && tutor.work_experience <= parseInt(maxExp);
            } else {
                return tutor.work_experience >= parseInt(minExp);
            }
        });
    }
    
    tutorsContainer.innerHTML = filteredTutors.map(tutor => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card tutor-card h-100">
                <div class="card-body text-center">
                    <div class="mb-3">
                        <img src="images/tutors.png" alt="Tutor" class="rounded-circle" width="80" height="80" style="object-fit: cover;">
                    </div>
                    <h5 class="tutor-name">${tutor.name}</h5>
                    <div class="tutor-experience">
                        <i class="fas fa-briefcase me-2"></i>
                        Опыт: ${tutor.work_experience} лет
                    </div>
                    <div class="tutor-languages">
                        <i class="fas fa-globe me-2"></i>
                        <strong>Говорит:</strong> ${tutor.languages_spoken.join(', ')}
                    </div>
                    <div class="tutor-languages">
                        <i class="fas fa-chalkboard-teacher me-2"></i>
                        <strong>Преподает:</strong> ${tutor.languages_offered.join(', ')}
                    </div>
                    <div class="tutor-level">
                        <i class="fas fa-star me-2"></i>
                        <span class="badge ${getLevelBadgeClass(tutor.language_level)}">${tutor.language_level}</span>
                    </div>
                    <div class="tutor-price mt-2">
                        <i class="fas fa-money-bill-wave me-2"></i>
                        <strong>${tutor.price_per_hour} руб./час</strong>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm" onclick="openTutorBookingModal(${tutor.id})">
                            <i class="fas fa-plus me-2"></i>Записаться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if (filteredTutors.length === 0) {
        tutorsContainer.innerHTML = '<div class="col-12 text-center">Репетиторы не найдены</div>';
    }
}

// Функции пагинации
function changePage(page) {
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    currentPage = page;
    renderCourses();
}

// Функции карты Яндекс
function initMap() {
    yandexMap = new ymaps.Map('yandexMap', {
        center: [55.751574, 37.573856], // Центр Москвы
        zoom: 11,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });
    
    // Добавление элемента управления поиском
    const searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search',
            placeholderText: 'Поиск мест на карте'
        }
    });
    yandexMap.controls.add(searchControl);
}

// Данные ресурсов для демонстрации
const resourceData = [
    {
        name: "Библиотека иностранных языков",
        address: "ул. Большая Дмитровка, д. 16",
        hours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
        phone: "+7 (495) 123-45-67",
        description: "Крупнейшая библиотека с коллекцией книг на иностранных языках, аудиокнигами и онлайн-ресурсами.",
        type: "library",
        coords: [55.769856, 37.614856]
    },
    {
        name: "Языковой клуб 'Speak Easy'",
        address: "ул. Новый Арбат, д. 15",
        hours: "Ежедневно: 18:00-23:00",
        phone: "+7 (495) 234-56-78",
        description: "Разговорные клубы для практики английского, испанского, французского языков. Еженедельные встречи.",
        type: "cafe",
        coords: [55.751574, 37.573856]
    },
    {
        name: "Центр языкового образования",
        address: "ул. Тверская, д. 18",
        hours: "Пн-Пт: 8:00-21:00, Сб: 10:00-18:00",
        phone: "+7 (495) 345-67-89",
        description: "Курсы английского, немецкого, французского, итальянского языков. Групповые и индивидуальные занятия.",
        type: "educational",
        coords: [55.764856, 37.604856]
    },
    {
        name: "Кафе 'Lingua Cafe'",
        address: "ул. Пушкинская, д. 12",
        hours: "Ежедневно: 10:00-22:00",
        phone: "+7 (495) 456-78-90",
        description: "Кафе для языкового обмена. Столики с табличками на разных языках, еженедельные встречи носителей языков.",
        type: "cafe",
        coords: [55.760856, 37.594856]
    },
    {
        name: "Частная языковая школа 'LinguaPro'",
        address: "ул. Арбат, д. 25",
        hours: "Пн-Пт: 9:00-20:00, Сб: 10:00-16:00",
        phone: "+7 (495) 567-89-01",
        description: "Индивидуальные и групповые занятия. Подготовка к экзаменам TOEFL, IELTS, DELE. Онлайн-курсы.",
        type: "courses",
        coords: [55.748856, 37.584856]
    },
    {
        name: "Городская библиотека №5",
        address: "ул. Новодмитровская, д. 10",
        hours: "Пн-Пт: 10:00-19:00, Сб: 11:00-17:00",
        phone: "+7 (495) 678-90-12",
        description: "Отделение с фондом иностранной литературы, методическими пособиями и доступом к онлайн-ресурсам.",
        type: "library",
        coords: [55.774856, 37.589856]
    },
    {
        name: "Культурный центр 'Мир Языков'",
        address: "ул. Садовая-Самотечная, д. 8",
        hours: "Пн-Пт: 10:00-20:00, Сб-Вс: 12:00-18:00",
        phone: "+7 (495) 789-01-23",
        description: "Курсы языков, культурные мероприятия, встречи с носителями языков, киноклубы.",
        type: "community",
        coords: [55.769856, 37.619856]
    },
    {
        name: "Разговорный клуб 'English Evening'",
        address: "ул. Кузнецкий Мост, д. 14",
        hours: "Ср, Пт: 19:00-21:00",
        phone: "+7 (495) 890-12-34",
        description: "Бесплатные встречи для практики английского языка. Тематические вечера, гости-носители языка.",
        type: "cafe",
        coords: [55.759856, 37.619856]
    }
];

function searchResourcesOnMap() {
    if (!yandexMap) {
        showNotification('Карта еще не загрузилась', 'warning');
        return;
    }
    
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const resourceType = document.getElementById('resourceType').value;
    
    // Фильтрация ресурсов
    let filteredResources = resourceData.filter(resource => {
        const matchesSearch = !searchTerm || 
            resource.name.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.address.toLowerCase().includes(searchTerm);
        
        const matchesType = !resourceType || resource.type === resourceType;
        
        return matchesSearch && matchesType;
    });
    
    // Очистка существующих меток
    currentPlacemarks.forEach(placemark => {
        yandexMap.geoObjects.remove(placemark);
    });
    currentPlacemarks = [];
    
    if (filteredResources.length === 0) {
        showNotification('Ресурсы не найдены', 'info');
        return;
    }
    
    // Добавление новых меток
    filteredResources.forEach(resource => {
        const placemark = new ymaps.Placemark(
            resource.coords,
            {
                balloonContentHeader: resource.name,
                balloonContentBody: `
                    <strong>Адрес:</strong> ${resource.address}<br>
                    <strong>Часы работы:</strong> ${resource.hours}<br>
                    <strong>Телефон:</strong> ${resource.phone}<br>
                    <strong>Описание:</strong> ${resource.description}
                `,
                hintContent: resource.name
            },
            {
                preset: getPlacemarkIcon(resource.type),
                balloonMaxWidth: 300
            }
        );
        
        // Добавление события клика для отображения деталей
        placemark.events.add('click', function() {
            showResourceDetails(resource);
        });
        
        yandexMap.geoObjects.add(placemark);
        currentPlacemarks.push(placemark);
    });
    
    // Центрирование карты на первом результате
    if (filteredResources.length > 0) {
        yandexMap.setCenter(filteredResources[0].coords, 12);
    }
    
    showNotification(`Найдено ${filteredResources.length} ресурсов`, 'success');
}

function resetMap() {
    if (!yandexMap) return;
    
    // Очистка полей ввода
    document.getElementById('searchTerm').value = '';
    document.getElementById('resourceType').value = '';
    
    // Удаление всех меток
    currentPlacemarks.forEach(placemark => {
        yandexMap.geoObjects.remove(placemark);
    });
    currentPlacemarks = [];
    
    // Скрытие информации о ресурсах
    document.getElementById('resourceInfoContainer').style.display = 'none';
    
    // Сброс вида карты
    yandexMap.setCenter([55.751574, 37.573856], 11);
    
    showNotification('Карта сброшена', 'info');
}

function getPlacemarkIcon(type) {
    const icons = {
        library: 'islands#bookIcon',
        cafe: 'islands#cafeIcon',
        educational: 'islands#educationIcon',
        courses: 'islands#collegeIcon',
        community: 'islands#communityIcon'
    };
    return icons[type] || 'islands#dotIcon';
}

function showResourceDetails(resource) {
    const container = document.getElementById('resourceInfoContainer');
    const details = document.getElementById('resourceDetails');
    
    const typeNames = {
        library: 'Публичная библиотека',
        cafe: 'Языковое кафе или клуб',
        educational: 'Образовательное учреждение',
        courses: 'Частные языковые курсы',
        community: 'Общественный центр'
    };
    
    details.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Название:</strong> ${resource.name}</p>
                <p><strong>Тип:</strong> ${typeNames[resource.type]}</p>
                <p><strong>Адрес:</strong> ${resource.address}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Часы работы:</strong> ${resource.hours}</p>
                <p><strong>Телефон:</strong> ${resource.phone}</p>
            </div>
        </div>
        <div class="mt-3">
            <p><strong>Описание:</strong> ${resource.description}</p>
        </div>
    `;
    
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
}

// Функции модальных окон
function openBookingModal(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Создание HTML модального окна
    const modalHtml = `
        <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="bookingModalLabel">Запись на курс: ${course.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="bookingForm">
                            <input type="hidden" id="courseId" value="${course.id}">
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Преподаватель</label>
                                    <input type="text" class="form-control" value="${course.teacher}" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Уровень</label>
                                    <input type="text" class="form-control" value="${course.level}" readonly>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="startDate" class="form-label">Дата начала</label>
                                    <select class="form-select" id="startDate" required>
                                        <option value="">Выберите дату</option>
                                        ${course.start_dates.map(date => {
                                            const dateObj = new Date(date);
                                            const formattedDate = dateObj.toLocaleDateString('ru-RU');
                                            return `<option value="${date}">${formattedDate}</option>`;
                                        }).join('')}
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="startTime" class="form-label">Время начала</label>
                                    <select class="form-select" id="startTime" required disabled>
                                        <option value="">Сначала выберите дату</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Продолжительность</label>
                                    <input type="text" class="form-control" value="${course.total_length} недель" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label for="endDate" class="form-label">Дата окончания</label>
                                    <input type="text" class="form-control" id="endDate" readonly>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="persons" class="form-label">Количество студентов</label>
                                    <input type="number" class="form-control" id="persons" min="1" max="20" value="1" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Стоимость за час</label>
                                    <input type="text" class="form-control" value="${course.course_fee_per_hour} руб." readonly>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Дополнительные опции</label>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="earlyRegistration">
                                            <label class="form-check-label" for="earlyRegistration">
                                                Ранняя регистрация (-10%)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="groupEnrollment">
                                            <label class="form-check-label" for="groupEnrollment">
                                                Групповая запись (-15%)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="intensiveCourse">
                                            <label class="form-check-label" for="intensiveCourse">
                                                Интенсивный курс (+20%)
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="supplementary">
                                            <label class="form-check-label" for="supplementary">
                                                Дополнительные материалы (+2000 руб.)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="personalized">
                                            <label class="form-check-label" for="personalized">
                                                Индивидуальные занятия (+1500 руб./нед)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="excursions">
                                            <label class="form-check-label" for="excursions">
                                                Культурные экскурсии (+25%)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="assessment">
                                            <label class="form-check-label" for="assessment">
                                                Оценка уровня (+300 руб.)
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="interactive">
                                            <label class="form-check-label" for="interactive">
                                                Интерактивная платформа (+50%)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Скидки</label>
                                    <div id="discountsInfo" class="text-muted small"></div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Итоговая стоимость</label>
                                    <div id="totalCost" class="h4 text-primary"></div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Отмена</button>
                        <button type="button" class="btn btn-primary" onclick="submitBooking()">Записаться</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Удаление существующего модального окна, если есть
    const existingModal = document.getElementById('bookingModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Добавление модального окна в body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Настройка обработчиков событий для модального окна
    setupBookingModalEvents(course);
    
    // Отображение модального окна
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

function setupBookingModalEvents(course) {
    const startDateSelect = document.getElementById('startDate');
    const startTimeSelect = document.getElementById('startTime');
    const endDateInput = document.getElementById('endDate');
    const personsInput = document.getElementById('persons');
    
    // Обновление времени начала при изменении даты
    startDateSelect.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Генерация временных слотов в зависимости от длины недели курса
        const timeSlots = generateTimeSlots(course.week_length, isWeekend);
        startTimeSelect.innerHTML = '<option value="">Выберите время</option>' + 
            timeSlots.map(slot => `<option value="${slot.value}">${slot.label}</option>`).join('');
        startTimeSelect.disabled = false;
        
        // Обновление даты окончания
        updateEndDate(selectedDate, course.total_length);
    });
    
    // Обновление даты окончания при изменении количества студентов (для расчета стоимости)
    personsInput.addEventListener('input', function() {
        calculateTotalCost(course);
    });
    
    // Обновление стоимости при изменении опций
    const checkboxes = document.querySelectorAll('#bookingForm input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => calculateTotalCost(course));
    });
}

function generateTimeSlots(weekLength, isWeekend) {
    const slots = [];
    
    // Утренние слоты (9:00-12:00)
    for (let hour = 9; hour <= 12 - weekLength; hour++) {
        slots.push({
            value: `${hour}:00`,
            label: `${hour}:00 - ${hour + weekLength}:00`
        });
    }
    
    // Вечерние слоты (18:00-20:00)
    for (let hour = 18; hour <= 20 - weekLength; hour++) {
        slots.push({
            value: `${hour}:00`,
            label: `${hour}:00 - ${hour + weekLength}:00`
        });
    }
    
    return slots;
}

function updateEndDate(startDate, weeks) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (weeks * 7));
    document.getElementById('endDate').value = endDate.toLocaleDateString('ru-RU');
}

function calculateTotalCost(course) {
    const persons = parseInt(document.getElementById('persons').value) || 1;
    const durationInHours = course.total_length * course.week_length;
    const baseCost = course.course_fee_per_hour * durationInHours * persons;
    
    let totalCost = baseCost;
    let discounts = [];
    let surcharges = [];
    
    // Проверка скидки за раннюю регистрацию
    const startDate = new Date(document.getElementById('startDate').value);
    const today = new Date();
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 30) {
        const earlyDiscount = baseCost * 0.1;
        totalCost -= earlyDiscount;
        discounts.push(`Ранняя регистрация: -${earlyDiscount.toFixed(0)} руб.`);
    }
    
    // Проверка скидки за групповую запись
    if (persons >= 5) {
        const groupDiscount = totalCost * 0.15;
        totalCost -= groupDiscount;
        discounts.push(`Групповая запись: -${groupDiscount.toFixed(0)} руб.`);
    }
    
    // Проверка надбавки за интенсивный курс
    if (course.week_length >= 5) {
        const intensiveSurcharge = totalCost * 0.2;
        totalCost += intensiveSurcharge;
        surcharges.push(`Интенсивный курс: +${intensiveSurcharge.toFixed(0)} руб.`);
    }
    
    // Проверка дополнительных опций
    const supplementary = document.getElementById('supplementary').checked;
    const personalized = document.getElementById('personalized').checked;
    const excursions = document.getElementById('excursions').checked;
    const assessment = document.getElementById('assessment').checked;
    const interactive = document.getElementById('interactive').checked;
    
    if (supplementary) {
        const supplementaryCost = 2000 * persons;
        totalCost += supplementaryCost;
        surcharges.push(`Дополнительные материалы: +${supplementaryCost} руб.`);
    }
    
    if (personalized) {
        const personalizedCost = 1500 * course.total_length;
        totalCost += personalizedCost;
        surcharges.push(`Индивидуальные занятия: +${personalizedCost} руб.`);
    }
    
    if (excursions) {
        const excursionsCost = totalCost * 0.25;
        totalCost += excursionsCost;
        surcharges.push(`Культурные экскурсии: +${excursionsCost.toFixed(0)} руб.`);
    }
    
    if (assessment) {
        const assessmentCost = 300 * persons;
        totalCost += assessmentCost;
        surcharges.push(`Оценка уровня: +${assessmentCost} руб.`);
    }
    
    if (interactive) {
        const interactiveCost = totalCost * 0.5;
        totalCost += interactiveCost;
        surcharges.push(`Интерактивная платформа: +${interactiveCost.toFixed(0)} руб.`);
    }
    
    // Обновление UI
    document.getElementById('totalCost').textContent = `${totalCost.toFixed(0)} руб.`;
    
    const discountsInfo = document.getElementById('discountsInfo');
    discountsInfo.innerHTML = '';
    
    if (discounts.length > 0) {
        discountsInfo.innerHTML += '<strong>Скидки:</strong><br>' + discounts.join('<br>') + '<br><br>';
    }
    
    if (surcharges.length > 0) {
        discountsInfo.innerHTML += '<strong>Доплаты:</strong><br>' + surcharges.join('<br>');
    }
    
    if (discounts.length === 0 && surcharges.length === 0) {
        discountsInfo.innerHTML = 'Нет скидок и доплат';
    }
}

async function submitBooking() {
    const courseId = document.getElementById('courseId').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const persons = document.getElementById('persons').value;
    
    if (!startDate || !startTime) {
        showNotification('Пожалуйста, выберите дату и время начала', 'warning');
        return;
    }
    
    // Находим курс для получения данных
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) {
        showNotification('Курс не найден', 'danger');
        return;
    }
    
    // Расчет общей стоимости на основе отображаемого значения
    const totalCostText = document.getElementById('totalCost').textContent;
    const totalCost = parseInt(totalCostText.replace(/[^\d]/g, ''));
    
    // Парсинг даты и времени
    const dateStart = startDate;
    
    // Создание данных заказа со всеми необходимыми полями, включая цену
    const orderData = {
        course_id: parseInt(courseId),
        date_start: dateStart,
        time_start: startTime,
        duration: course.week_length,
        persons: parseInt(persons),
        price: totalCost,
        early_registration: document.getElementById('earlyRegistration').checked,
        group_enrollment: document.getElementById('groupEnrollment').checked,
        intensive_course: document.getElementById('intensiveCourse').checked,
        supplementary: document.getElementById('supplementary').checked,
        personalized: document.getElementById('personalized').checked,
        excursions: document.getElementById('excursions').checked,
        assessment: document.getElementById('assessment').checked,
        interactive: document.getElementById('interactive').checked
    };
    
    console.log('Sending order data:', orderData);
    
    const result = await postData('/api/orders', orderData);
    
    if (result) {
        showNotification('Запись на курс успешно оформлена!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        if (modal) {
            modal.hide();
        }
    } else {
        showNotification('Ошибка при оформлении записи. Проверьте данные и попробуйте снова.', 'danger');
    }
}

// Модальное окно для записи к репетитору
function openTutorBookingModal(tutorId) {
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;
    
    // Создание HTML модального окна
    const modalHtml = `
        <div class="modal fade" id="tutorBookingModal" tabindex="-1" aria-labelledby="tutorBookingModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tutorBookingModalLabel">Запись к репетитору: ${tutor.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="tutorBookingForm">
                            <input type="hidden" id="tutorId" value="${tutor.id}">
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Репетитор</label>
                                    <input type="text" class="form-control" value="${tutor.name}" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Ставка</label>
                                    <input type="text" class="form-control" value="${tutor.price_per_hour} руб./час" readonly>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="tutorStartDate" class="form-label">Дата начала</label>
                                    <input type="date" class="form-control" id="tutorStartDate" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="tutorStartTime" class="form-label">Время начала</label>
                                    <input type="time" class="form-control" id="tutorStartTime" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="tutorDuration" class="form-label">Продолжительность (часы)</label>
                                    <input type="number" class="form-control" id="tutorDuration" min="1" max="40" value="1" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="tutorPersons" class="form-label">Количество студентов</label>
                                    <input type="number" class="form-control" id="tutorPersons" min="1" max="20" value="1" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Рассчитанная стоимость</label>
                                <div id="tutorTotalCost" class="h4 text-primary"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Отмена</button>
                        <button type="button" class="btn btn-primary" onclick="submitTutorBooking()">Записаться</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Удаление существующего модального окна, если есть
    const existingModal = document.getElementById('tutorBookingModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Добавление модального окна в body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Настройка обработчиков событий
    setupTutorBookingModalEvents(tutor);
    
    // Отображение модального окна
    const modal = new bootstrap.Modal(document.getElementById('tutorBookingModal'));
    modal.show();
    
    // Расчет начальной стоимости
    calculateTutorCost(tutor);
}

function setupTutorBookingModalEvents(tutor) {
    const durationInput = document.getElementById('tutorDuration');
    const personsInput = document.getElementById('tutorPersons');
    
    durationInput.addEventListener('input', () => calculateTutorCost(tutor));
    personsInput.addEventListener('input', () => calculateTutorCost(tutor));
}

function calculateTutorCost(tutor) {
    const duration = parseInt(document.getElementById('tutorDuration').value) || 1;
    const persons = parseInt(document.getElementById('tutorPersons').value) || 1;
    const baseCost = tutor.price_per_hour * duration * persons;
    
    document.getElementById('tutorTotalCost').textContent = `${baseCost} руб.`;
}

async function submitTutorBooking() {
    const tutorId = document.getElementById('tutorId').value;
    const startDate = document.getElementById('tutorStartDate').value;
    const startTime = document.getElementById('tutorStartTime').value;
    const duration = document.getElementById('tutorDuration').value;
    const persons = document.getElementById('tutorPersons').value;
    
    if (!startDate || !startTime) {
        showNotification('Пожалуйста, выберите дату и время начала', 'warning');
        return;
    }
    
    // Расчет цены на основе почасовой ставки репетитора
    const tutor = tutors.find(t => t.id === parseInt(tutorId));
    const price = tutor ? tutor.price_per_hour * parseInt(duration) * parseInt(persons) : 0;
    
    const orderData = {
        tutor_id: parseInt(tutorId),
        date_start: startDate,
        time_start: startTime,
        duration: parseInt(duration),
        persons: parseInt(persons),
        price: price
    };
    
    const result = await postData('/api/orders', orderData);
    
    if (result) {
        showNotification('Запись к репетитору успешно оформлена!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('tutorBookingModal'));
        modal.hide();
    }
}

// Экспорт функций в глобальную область видимости для обработчиков onclick
window.changePage = changePage;
window.openBookingModal = openBookingModal;
window.openTutorBookingModal = openTutorBookingModal;
window.submitBooking = submitBooking;
window.submitTutorBooking = submitTutorBooking;