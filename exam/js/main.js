let allCourses = []
let allTutors = []
let filteredCourses = []
let filteredTutors = []
let currentCoursePage = 1
let selectedCourse = null
let selectedTutor = null
const ITEMS_PER_PAGE = 5

// Map variables
let yandexMap = null
let mapPlacemarks = []
let mapObjects = []

// Map resources data
const mapResources = [
    {
        id: 1,
        name: "Языковой клуб 'Speak Easy'",
        type: "cafe",
        address: "г. Москва, ул. Тверская, д. 12",
        hours: "Пн-Пт: 10:00-22:00, Сб-Вс: 12:00-23:00",
        phone: "+7 (495) 123-45-67",
        description: "Разговорные клубы для практики английского языка, тематические вечера, носители языка",
        coords: [55.764, 37.615],
        category: "cafe"
    },
    {
        id: 2,
        name: "Библиотека иностранных языков",
        type: "library",
        address: "г. Москва, ул. Новый Арбат, д. 8",
        hours: "Вт-Вс: 10:00-20:00 (Пн - выходной)",
        phone: "+7 (495) 234-56-78",
        description: "Книги, журналы, аудиокниги на иностранных языках, бесплатный доступ к онлайн ресурсам",
        coords: [55.752, 37.596],
        category: "library"
    },
    {
        id: 3,
        name: "Языковая школа 'LinguaPro'",
        type: "educational",
        address: "г. Москва, ул. Новый Арбат, д. 15",
        hours: "Пн-Пт: 9:00-21:00, Сб: 10:00-18:00",
        phone: "+7 (495) 345-67-89",
        description: "Курсы английского, немецкого, французского языков. Подготовка к экзаменам IELTS, TOEFL",
        coords: [55.754, 37.598],
        category: "educational"
    },
    {
        id: 4,
        name: "Культурный центр 'Европа'",
        type: "community",
        address: "г. Москва, ул. Арбат, д. 20",
        hours: "Пн-Пт: 10:00-19:00, Сб-Вс: 11:00-18:00",
        phone: "+7 (495) 456-78-90",
        description: "Культурные мероприятия, встречи с носителями языка, киноклубы, лекции",
        coords: [55.748, 37.592],
        category: "community"
    },
    {
        id: 5,
        name: "Частная языковая академия 'Global English'",
        type: "courses",
        address: "г. Москва, ул. Кутузовский проспект, д. 25",
        hours: "Пн-Сб: 8:00-22:00, Вс: 10:00-18:00",
        phone: "+7 (495) 567-89-01",
        description: "Индивидуальные и групповые занятия, бизнес-английский, подготовка к собеседованиям",
        coords: [55.739, 37.564],
        category: "courses"
    },
    {
        id: 6,
        name: "Кафе языкового обмена 'Language Cafe'",
        type: "cafe",
        address: "г. Москва, ул. Пушкинская, д. 5",
        hours: "Ежедневно: 11:00-23:00",
        phone: "+7 (495) 678-90-12",
        description: "Кофе, десерты и общение на разных языках. Тематические вечера по языкам",
        coords: [55.765, 37.604],
        category: "cafe"
    },
    {
        id: 7,
        name: "Городская библиотека №5",
        type: "library",
        address: "г. Москва, ул. Зубовский бульвар, д. 15",
        hours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
        phone: "+7 (495) 789-01-23",
        description: "Отделение иностранных языков, методическая литература, онлайн доступ",
        coords: [55.738, 37.592],
        category: "library"
    },
    {
        id: 8,
        name: "Образовательный центр 'Мир языков'",
        type: "educational",
        address: "г. Москва, ул. Ленинский проспект, д. 40",
        hours: "Пн-Пт: 10:00-21:00, Сб: 10:00-16:00",
        phone: "+7 (495) 890-12-34",
        description: "Курсы испанского, итальянского, китайского языков. Группы всех уровней",
        coords: [55.731, 37.588],
        category: "educational"
    },
    {
        id: 9,
        name: "Комьюнити-центр 'Языковой коворкинг'",
        type: "community",
        address: "г. Москва, ул. Большая Дмитровка, д. 10",
        hours: "Пн-Вс: 9:00-22:00",
        phone: "+7 (495) 901-23-45",
        description: "Пространство для изучения языков, волонтеры-носители языка, бесплатные практики",
        coords: [55.769, 37.614],
        category: "community"
    },
    {
        id: 10,
        name: "Индивидуальные курсы 'Personal Tutor'",
        type: "courses",
        address: "г. Москва, ул. Никитская, д. 12",
        hours: "По записи: Пн-Сб: 8:00-21:00",
        phone: "+7 (495) 234-56-78",
        description: "Индивидуальные занятия с репетиторами, подготовка к экзаменам, разговорная практика",
        coords: [55.759, 37.601],
        category: "courses"
    }
]

document.addEventListener('DOMContentLoaded', function () {
    loadCourses()
    loadTutors()
    setupEventListeners()
    initializeMap()
})

function setupEventListeners() {
    document
        .getElementById('courseSearchForm')
        .addEventListener('submit', function (e) {
            e.preventDefault()
            filterCourses()
        })

    document
        .getElementById('searchLevel')
        .addEventListener('change', filterCourses)
    document
        .getElementById('searchWeekLength')
        .addEventListener('change', filterCourses)
    document
        .getElementById('searchDuration')
        .addEventListener('change', filterCourses)

    document
        .getElementById('tutorSearchForm')
        .addEventListener('submit', function (e) {
            e.preventDefault()
            filterTutors()
        })

    document
        .getElementById('tutorLanguage')
        .addEventListener('change', filterTutors)
    document
        .getElementById('tutorLevel')
        .addEventListener('change', filterTutors)
    document
        .getElementById('tutorExperience')
        .addEventListener('change', filterTutors)

    document
        .getElementById('order-start-date')
        .addEventListener('change', handleDateChange)
    document
        .getElementById('order-start-time')
        .addEventListener('change', calculateTotalCost)
    document
        .getElementById('order-students')
        .addEventListener('input', calculateTotalCost)

    document
        .querySelectorAll('#order-form input[type="checkbox"]')
        .forEach(function (checkbox) {
            checkbox.addEventListener('change', calculateTotalCost)
        })

    document
        .getElementById('submit-order-btn')
        .addEventListener('click', submitOrder)

    document
        .getElementById('orderModal')
        .addEventListener('hidden.bs.modal', resetOrderForm)

    // Map event listeners
    document
        .getElementById('search-resources-btn')
        .addEventListener('click', searchResourcesOnMap)

    document
        .getElementById('reset-map-btn')
        .addEventListener('click', resetMap)

    document
        .getElementById('searchTerm')
        .addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault()
                searchResourcesOnMap()
            }
        })

    document
        .getElementById('resourceType')
        .addEventListener('change', searchResourcesOnMap)
}

// Map functions
function initializeMap() {
    // Wait for Yandex Maps API to load
    if (typeof ymaps === 'undefined') {
        setTimeout(initializeMap, 100)
        return
    }

    ymaps.ready(initMap)

    function initMap() {
        // Create map centered on Moscow
        yandexMap = new ymaps.Map('yandexMap', {
            center: [55.7558, 37.6173], // Moscow center
            zoom: 12,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
        })

        // Add search control
        const searchControl = new ymaps.control.SearchControl({
            options: {
                provider: 'yandex#search',
                placeholderText: 'Поиск мест на карте'
            }
        })
        yandexMap.controls.add(searchControl)

        // Add all placemarks initially
        addPlacemarks(mapResources)
    }
}

function addPlacemarks(resources) {
    // Clear existing placemarks
    mapPlacemarks.forEach(function (placemark) {
        yandexMap.geoObjects.remove(placemark)
    })
    mapPlacemarks = []
    mapObjects = []

    resources.forEach(function (resource) {
        const placemark = new ymaps.Placemark(
            resource.coords,
            {
                hintContent: resource.name,
                balloonContentHeader: resource.name,
                balloonContentBody: `
                    <div style="max-width: 250px;">
                        <strong>${resource.name}</strong><br>
                        <em>${getTypeName(resource.category)}</em><br>
                        <strong>Адрес:</strong> ${resource.address}<br>
                        <strong>Часы работы:</strong> ${resource.hours}<br>
                        <strong>Телефон:</strong> ${resource.phone}<br>
                        <strong>Описание:</strong> ${resource.description}
                    </div>
                `,
                balloonContentFooter: '<button class="btn btn-sm btn-primary mt-2" onclick="showResourceInfo(' + resource.id + ')">Подробнее</button>'
            },
            {
                preset: getPlacemarkIcon(resource.category),
                balloonMaxWidth: 300
            }
        )

        yandexMap.geoObjects.add(placemark)
        mapPlacemarks.push(placemark)
        mapObjects.push(resource)
    })

    // Fit map to show all placemarks
    if (resources.length > 0) {
        yandexMap.setBounds(yandexMap.geoObjects.getBounds(), {
            checkZoomRange: true,
            padding: [50, 50]
        })
    }
}

function getPlacemarkIcon(category) {
    const icons = {
        educational: 'islands#educationIcon',
        community: 'islands#cultureIcon',
        library: 'islands#bookIcon',
        courses: 'islands#collegeIcon',
        cafe: 'islands#cafeIcon'
    }
    return icons[category] || 'islands#dotIcon'
}

function getTypeName(category) {
    const names = {
        educational: 'Образовательное учреждение',
        community: 'Общественный центр',
        library: 'Публичная библиотека',
        courses: 'Частные языковые курсы',
        cafe: 'Языковое кафе или клуб'
    }
    return names[category] || category
}

function searchResourcesOnMap() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase().trim()
    const resourceType = document.getElementById('resourceType').value

    let filtered = mapResources.filter(function (resource) {
        const matchesSearch = !searchTerm || 
            resource.name.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.address.toLowerCase().includes(searchTerm)
        
        const matchesType = !resourceType || resource.category === resourceType

        return matchesSearch && matchesType
    })

    if (filtered.length === 0) {
        showNotification('Ресурсы не найдены. Попробуйте изменить параметры поиска.', 'warning')
        return
    }

    addPlacemarks(filtered)
    showNotification(`Найдено ${filtered.length} ресурсов`, 'success')
}

function resetMap() {
    document.getElementById('searchTerm').value = ''
    document.getElementById('resourceType').value = ''
    addPlacemarks(mapResources)
    document.getElementById('resource-info-container').style.display = 'none'
    showNotification('Карта сброшена', 'info')
}

function showResourceInfo(resourceId) {
    const resource = mapResources.find(function (r) {
        return r.id === resourceId
    })

    if (!resource) return

    const container = document.getElementById('resource-info-container')
    const details = document.getElementById('resource-details')

    details.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Название:</strong> ${resource.name}</p>
                <p><strong>Тип:</strong> ${getTypeName(resource.category)}</p>
                <p><strong>Адрес:</strong> ${resource.address}</p>
                <p><strong>Телефон:</strong> ${resource.phone}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Часы работы:</strong> ${resource.hours}</p>
                <p><strong>Описание:</strong> ${resource.description}</p>
            </div>
        </div>
        <div class="mt-3">
            <button class="btn btn-outline-primary btn-sm" onclick="showRoute(${resource.coords[0]}, ${resource.coords[1]})">
                Построить маршрут
            </button>
            <button class="btn btn-outline-secondary btn-sm" onclick="hideResourceInfo()">
                Скрыть
            </button>
        </div>
    `

    container.style.display = 'block'
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function hideResourceInfo() {
    document.getElementById('resource-info-container').style.display = 'none'
}

function showRoute(lat, lon) {
    if (!yandexMap) {
        showNotification('Карта не инициализирована', 'warning')
        return
    }

    // Create route from user's location (or default location) to the resource
    const userLocation = [55.7558, 37.6173] // Default to Moscow center
    
    ymaps.route([userLocation, [lat, lon]], {
        mapStateAutoApply: true
    }).then(function (route) {
        yandexMap.geoObjects.remove(route)
        yandexMap.geoObjects.add(route)
        
        // Show route info
        const distance = route.getLength()
        const duration = route.getTime()
        
        showNotification(`Маршрут: ${Math.round(distance/1000)} км, ~${Math.round(duration/60)} мин`, 'info')
    }).catch(function (error) {
        showNotification('Не удалось построить маршрут', 'danger')
        console.error('Route error:', error)
    })
}

async function loadCourses() {
    const coursesContainer = document.getElementById('coursesContainer')
    coursesContainer.innerHTML =
        '<div class="col-12"><div class="spinner-container"><div class="spinner-border text-primary"></div></div></div>'

    try {
        allCourses = await getCourses()
        filteredCourses = [...allCourses]
        renderCourses()
    } catch (error) {
        coursesContainer.innerHTML =
            '<div class="col-12"><div class="empty-state"><p>Ошибка загрузки курсов</p></div></div>'
        showNotification('Ошибка загрузки курсов: ' + error.message, 'danger')
    }
}

async function loadTutors() {
    const tutorsContainer = document.getElementById('tutorsContainer')
    tutorsContainer.innerHTML =
        '<div class="col-12"><div class="spinner-container"><div class="spinner-border text-primary"></div></div></div>'

    try {
        allTutors = await getTutors()
        filteredTutors = [...allTutors]
        renderTutors()
    } catch (error) {
        tutorsContainer.innerHTML =
            '<div class="col-12"><div class="empty-state"><p>Ошибка загрузки репетиторов</p></div></div>'
        showNotification('Ошибка загрузки репетиторов: ' + error.message, 'danger')
    }
}

function filterCourses() {
    const searchLevel = document.getElementById('searchLevel').value
    const searchWeekLength = document.getElementById('searchWeekLength').value
    const searchDuration = document.getElementById('searchDuration').value

    filteredCourses = allCourses.filter(function (course) {
        const matchesLevel = !searchLevel || course.level === searchLevel
        const matchesWeekLength = !searchWeekLength || course.week_length.toString() === searchWeekLength
        const matchesDuration = !searchDuration || course.total_length.toString() === searchDuration
        return matchesLevel && matchesWeekLength && matchesDuration
    })

    currentCoursePage = 1
    renderCourses()
}

function filterTutors() {
    const searchLanguage = document.getElementById('tutorLanguage').value
    const searchLevel = document.getElementById('tutorLevel').value
    const searchExperience = document.getElementById('tutorExperience').value

    filteredTutors = allTutors.filter(function (tutor) {
        const matchesLanguage = !searchLanguage || tutor.languages_offered.includes(searchLanguage)
        const matchesLevel = !searchLevel || tutor.language_level === searchLevel

        let matchesExperience = true
        if (searchExperience) {
            const exp = tutor.work_experience
            if (searchExperience === '1-3') matchesExperience = exp >= 1 && exp <= 3
            else if (searchExperience === '4-6') matchesExperience = exp >= 4 && exp <= 6
            else if (searchExperience === '7+') matchesExperience = exp >= 7
        }

        return matchesLanguage && matchesLevel && matchesExperience
    })

    renderTutors()
}

function renderCourses() {
    const coursesContainer = document.getElementById('coursesContainer')
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
    const startIndex = (currentCoursePage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const coursesToShow = filteredCourses.slice(startIndex, endIndex)

    if (coursesToShow.length === 0) {
        coursesContainer.innerHTML =
            '<div class="col-12"><div class="empty-state"><p>Курсы не найдены</p></div></div>'
        document.getElementById('coursesPagination').innerHTML = ''
        return
    }

    coursesContainer.innerHTML = coursesToShow
        .map(function (course) {
            const isSelected = selectedCourse && selectedCourse.id === course.id
            return `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 course-card ${isSelected ? 'border-primary' : ''}" data-course-id="${course.id}">
            <div class="card-body">
              <h5 class="card-title">${course.name}</h5>
              <p class="card-text text-truncate-2">${course.description}</p>
              <div class="course-meta mb-3">
                <div><strong>Уровень:</strong> ${translateLevel(course.level)}</div>
                <div><strong>Преподаватель:</strong> ${course.teacher}</div>
                <div><strong>Длительность:</strong> ${course.total_length} нед.</div>
                <div><strong>Цена:</strong> ${course.course_fee_per_hour} руб/час</div>
              </div>
              <button class="btn ${isSelected ? 'btn-success' : 'btn-outline-primary'} btn-sm select-course-btn w-100">
                ${isSelected ? 'Выбран' : 'Выбрать курс'}
              </button>
            </div>
          </div>
        </div>
      `
        })
        .join('')

    coursesContainer.querySelectorAll('.course-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('select-course-btn')) return
            const courseId = parseInt(card.dataset.courseId)
            selectCourse(courseId)
        })
    })

    renderCoursesPagination(totalPages)
}

function renderCoursesPagination(totalPages) {
    const pagination = document.getElementById('coursesPagination')

    if (totalPages <= 1) {
        pagination.innerHTML = ''
        return
    }

    let html = ''

    html += `<li class="page-item ${currentCoursePage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentCoursePage - 1
        }">Назад</a>
    </li>`

    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${currentCoursePage === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`
    }

    html += `<li class="page-item ${currentCoursePage === totalPages ? 'disabled' : ''
        }">
        <a class="page-link" href="#" data-page="${currentCoursePage + 1
        }">Вперёд</a>
    </li>`

    pagination.innerHTML = html

    pagination.querySelectorAll('.page-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault()
            const page = parseInt(this.dataset.page)
            if (page >= 1 && page <= totalPages) {
                currentCoursePage = page
                renderCourses()
            }
        })
    })
}

function renderTutors() {
    const tutorsContainer = document.getElementById('tutorsContainer')

    if (filteredTutors.length === 0) {
        tutorsContainer.innerHTML =
            '<div class="col-12"><div class="empty-state"><p>Репетиторы не найдены</p></div></div>'
        return
    }

    tutorsContainer.innerHTML = filteredTutors
        .map(function (tutor) {
            const isSelected = selectedTutor && selectedTutor.id === tutor.id
            return `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 tutor-card ${isSelected ? 'border-primary' : ''}" data-tutor-id="${tutor.id}">
            <div class="card-body">
              <h5 class="card-title">${tutor.name}</h5>
              <div class="tutor-info mb-2">
                <div><strong>Уровень:</strong> ${translateLevel(tutor.language_level)}</div>
                <div><strong>Опыт:</strong> ${tutor.work_experience} лет</div>
                <div><strong>Языки:</strong> ${tutor.languages_offered.join(', ')}</div>
                <div><strong>Цена:</strong> ${tutor.price_per_hour} руб/час</div>
              </div>
              <button class="btn ${isSelected ? 'btn-success' : 'btn-outline-primary'} btn-sm select-tutor-btn w-100">
                ${isSelected ? 'Выбран' : 'Выбрать репетитора'}
              </button>
            </div>
          </div>
        </div>
      `
        })
        .join('')

    tutorsContainer.querySelectorAll('.tutor-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('select-tutor-btn')) return
            const tutorId = parseInt(card.dataset.tutorId)
            selectTutor(tutorId)
        })
    })
}

function selectCourse(courseId) {
    selectedCourse = allCourses.find(function (c) {
        return c.id === courseId
    })
    selectedTutor = null
    renderCourses()
    renderTutors()
    updateOrderForm()
}

function selectTutor(tutorId) {
    selectedTutor = allTutors.find(function (t) {
        return t.id === tutorId
    })
    renderTutors()
    updateOrderForm()
}

function updateOrderForm() {
    const courseNameField = document.getElementById('order-course-name')
    const teacherNameField = document.getElementById('order-teacher-name')
    const dateSelect = document.getElementById('order-start-date')
    const durationField = document.getElementById('order-duration')

    if (selectedCourse) {
        document.getElementById('order-course-id').value = selectedCourse.id
        courseNameField.value = selectedCourse.name
        teacherNameField.value = selectedCourse.teacher
        durationField.value =
            selectedCourse.total_length +
            ' недель, ' +
            selectedCourse.week_length +
            ' часов/нед'

        dateSelect.innerHTML = '<option value="">Выберите дату</option>'
        if (selectedCourse.start_dates && selectedCourse.start_dates.length > 0) {
            const uniqueDates = [
                ...new Set(
                    selectedCourse.start_dates.map(function (dt) {
                        return dt.split('T')[0]
                    })
                ),
            ]
            uniqueDates.forEach(function (date) {
                const option = document.createElement('option')
                option.value = date
                option.textContent = formatDate(date)
                dateSelect.appendChild(option)
            })
        }
    } else if (selectedTutor) {
        document.getElementById('order-tutor-id').value = selectedTutor.id
        courseNameField.value = 'Занятие с репетитором'
        teacherNameField.value = selectedTutor.name
        durationField.value = 'По выбору'

        dateSelect.innerHTML = '<option value="">Выберите дату</option>'
        const today = new Date()
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            const option = document.createElement('option')
            option.value = dateStr
            option.textContent = formatDate(dateStr)
            dateSelect.appendChild(option)
        }
    }

    calculateTotalCost()
}

function handleDateChange() {
    const dateSelect = document.getElementById('order-start-date')
    const timeSelect = document.getElementById('order-start-time')
    const selectedDate = dateSelect.value

    if (!selectedDate) {
        timeSelect.disabled = true
        timeSelect.innerHTML = '<option value="">Сначала выберите дату</option>'
        return
    }

    timeSelect.disabled = false
    timeSelect.innerHTML = '<option value="">Выберите время</option>'

    if (selectedCourse && selectedCourse.start_dates) {
        const timesForDate = selectedCourse.start_dates
            .filter(function (dt) {
                return dt.startsWith(selectedDate)
            })
            .map(function (dt) {
                return dt.split('T')[1].substring(0, 5)
            })

        timesForDate.forEach(function (time) {
            const endTime = calculateEndTime(time, selectedCourse.week_length)
            const option = document.createElement('option')
            option.value = time
            option.textContent = time + ' - ' + endTime
            timeSelect.appendChild(option)
        })
    } else {
        const times = [
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
        ]
        times.forEach(function (time) {
            const option = document.createElement('option')
            option.value = time
            option.textContent = time
            timeSelect.appendChild(option)
        })
    }

    calculateTotalCost()
}

function calculateEndTime(startTime, hoursPerWeek) {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHours = hours + hoursPerWeek
    return (
        String(endHours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0')
    )
}

function calculateTotalCost() {
    const dateValue = document.getElementById('order-start-date').value
    const timeValue = document.getElementById('order-start-time').value
    const studentsCount =
        parseInt(document.getElementById('order-students').value) || 1

    const supplementary = document.getElementById('option-supplementary').checked
    const personalized = document.getElementById('option-personalized').checked
    const excursions = document.getElementById('option-excursions').checked
    const assessment = document.getElementById('option-assessment').checked
    const interactive = document.getElementById('option-interactive').checked

    let totalCost = 0
    let courseFeePerHour = 0
    let durationInHours = 0
    let totalWeeks = 0
    let weeklyHours = 0

    if (selectedCourse) {
        courseFeePerHour = selectedCourse.course_fee_per_hour
        totalWeeks = selectedCourse.total_length
        weeklyHours = selectedCourse.week_length
        durationInHours = totalWeeks * weeklyHours
    } else if (selectedTutor) {
        courseFeePerHour = selectedTutor.price_per_hour
        durationInHours = 1
        totalWeeks = 1
        weeklyHours = 1
    }

    let baseCost = courseFeePerHour * durationInHours

    let isWeekend = false
    if (dateValue) {
        const date = new Date(dateValue)
        const dayOfWeek = date.getDay()
        isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    }

    if (isWeekend) {
        baseCost *= 1.5
    }

    let morningSurcharge = 0
    let eveningSurcharge = 0
    if (timeValue) {
        const hour = parseInt(timeValue.split(':')[0])
        if (hour >= 9 && hour < 12) {
            morningSurcharge = 400
        }
        if (hour >= 18 && hour < 20) {
            eveningSurcharge = 1000
        }
    }

    totalCost = baseCost + morningSurcharge + eveningSurcharge

    if (supplementary) {
        totalCost += 2000 * studentsCount
    }
    if (personalized) {
        totalCost += 1500 * totalWeeks
    }
    if (excursions) {
        totalCost *= 1.25
    }
    if (assessment) {
        totalCost += 300
    }
    if (interactive) {
        totalCost *= 1.5
    }

    const isIntensive = weeklyHours >= 5
    if (isIntensive) {
        totalCost *= 1.2
    }

    let isEarlyRegistration = false
    if (dateValue) {
        const startDate = new Date(dateValue)
        const today = new Date()
        const diffTime = startDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        isEarlyRegistration = diffDays >= 30
    }

    if (isEarlyRegistration) {
        totalCost *= 0.9
    }

    const isGroupEnrollment = studentsCount >= 5
    if (isGroupEnrollment) {
        totalCost *= 0.85
    }

    totalCost *= studentsCount

    document.getElementById('order-total-cost').textContent =
        Math.round(totalCost)

    updateBadges(
        isWeekend,
        morningSurcharge > 0,
        eveningSurcharge > 0,
        isIntensive,
        isEarlyRegistration,
        isGroupEnrollment
    )
}

function updateBadges(
    isWeekend,
    isMorning,
    isEvening,
    isIntensive,
    isEarly,
    isGroup
) {
    document.getElementById('badge-weekend').style.display = isWeekend
        ? 'inline-block'
        : 'none'
    document.getElementById('badge-morning').style.display = isMorning
        ? 'inline-block'
        : 'none'
    document.getElementById('badge-evening').style.display = isEvening
        ? 'inline-block'
        : 'none'
    document.getElementById('badge-intensive').style.display = isIntensive
        ? 'inline-block'
        : 'none'
    document.getElementById('badge-early').style.display = isEarly
        ? 'inline-block'
        : 'none'
    document.getElementById('badge-group').style.display = isGroup
        ? 'inline-block'
        : 'none'
}

async function submitOrder() {
    if (!selectedCourse && !selectedTutor) {
        showNotification('Пожалуйста, выберите курс или репетитора', 'warning')
        return
    }

    const dateValue = document.getElementById('order-start-date').value
    const timeValue = document.getElementById('order-start-time').value
    const studentsCount =
        parseInt(document.getElementById('order-students').value) || 1

    if (!dateValue || !timeValue) {
        showNotification('Пожалуйста, выберите дату и время', 'warning')
        return
    }

    if (studentsCount < 1 || studentsCount > 20) {
        showNotification('Количество студентов должно быть от 1 до 20', 'warning')
        return
    }

    const totalCost = parseInt(
        document.getElementById('order-total-cost').textContent
    )

    let duration = 1
    if (selectedCourse) {
        duration = selectedCourse.total_length * selectedCourse.week_length
    }

    const orderData = {
        course_id: selectedCourse ? selectedCourse.id : 0,
        tutor_id: selectedTutor ? selectedTutor.id : 0,
        date_start: dateValue,
        time_start: timeValue,
        duration: duration,
        persons: studentsCount,
        price: totalCost,
        early_registration:
            document.getElementById('badge-early').style.display !== 'none',
        group_enrollment:
            document.getElementById('badge-group').style.display !== 'none',
        intensive_course:
            document.getElementById('badge-intensive').style.display !== 'none',
        supplementary: document.getElementById('option-supplementary').checked,
        personalized: document.getElementById('option-personalized').checked,
        excursions: document.getElementById('option-excursions').checked,
        assessment: document.getElementById('option-assessment').checked,
        interactive: document.getElementById('option-interactive').checked,
    }

    try {
        document.getElementById('submit-order-btn').disabled = true
        await createOrder(orderData)
        showNotification('Заявка успешно отправлена!', 'success')
        bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide()
        resetOrderForm()
    } catch (error) {
        showNotification('Ошибка при отправке заявки: ' + error.message, 'danger')
    } finally {
        document.getElementById('submit-order-btn').disabled = false
    }
}

function resetOrderForm() {
    document.getElementById('order-form').reset()
    document.getElementById('order-course-id').value = ''
    document.getElementById('order-tutor-id').value = ''
    document.getElementById('order-course-name').value = ''
    document.getElementById('order-teacher-name').value = ''
    document.getElementById('order-duration').value = ''
    document.getElementById('order-start-date').innerHTML =
        '<option value="">Выберите дату</option>'
    document.getElementById('order-start-time').innerHTML =
        '<option value="">Сначала выберите дату</option>'
    document.getElementById('order-start-time').disabled = true
    document.getElementById('order-total-cost').textContent = '0'

    document
        .querySelectorAll('#auto-options-badges .badge')
        .forEach(function (badge) {
            badge.style.display = 'none'
        })
}

function showNotification(message, type) {
    const container = document.getElementById('notification-area')
    const alertId = 'alert-' + Date.now()

    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `

    container.insertAdjacentHTML('beforeend', alertHtml)

    setTimeout(function () {
        const alert = document.getElementById(alertId)
        if (alert) {
            alert.remove()
        }
    }, 5000)
}

function translateLevel(level) {
    const levels = {
        Beginner: 'Начальный',
        Intermediate: 'Средний',
        Advanced: 'Продвинутый',
    }
    return levels[level] || level
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}