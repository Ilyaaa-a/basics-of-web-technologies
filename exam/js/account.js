let allOrders = []
let allCourses = []
let allTutors = []
let currentOrderPage = 1
let currentEditOrder = null
const ITEMS_PER_PAGE = 5

document.addEventListener('DOMContentLoaded', function () {
    loadData()
    setupEventListeners()
})

function setupEventListeners() {
    document.getElementById('save-edit-btn').addEventListener('click', saveEdit)
    document
        .getElementById('confirm-delete-btn')
        .addEventListener('click', confirmDelete)

    document
        .getElementById('edit-start-date')
        .addEventListener('change', handleEditDateChange)
    document
        .getElementById('edit-start-time')
        .addEventListener('change', calculateEditTotalCost)
    document
        .getElementById('edit-students')
        .addEventListener('input', calculateEditTotalCost)

    document
        .querySelectorAll('#edit-order-form input[type="checkbox"]')
        .forEach(function (checkbox) {
            checkbox.addEventListener('change', calculateEditTotalCost)
        })
}

async function loadData() {
    const ordersBody = document.getElementById('orders-table-body')
    ordersBody.innerHTML =
        '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary"></div></td></tr>'

    try {
        const [orders, courses, tutors] = await Promise.all([
            getOrders(),
            getCourses(),
            getTutors(),
        ])

        allOrders = orders
        allCourses = courses
        allTutors = tutors

        renderOrders()
    } catch (error) {
        ordersBody.innerHTML =
            '<tr><td colspan="5" class="text-center text-muted">Ошибка загрузки данных</td></tr>'
        showNotification('Ошибка загрузки: ' + error.message, 'danger')
    }
}

function renderOrders() {
    const ordersBody = document.getElementById('orders-table-body')
    const totalPages = Math.ceil(allOrders.length / ITEMS_PER_PAGE)
    const startIndex = (currentOrderPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const ordersToShow = allOrders.slice(startIndex, endIndex)

    if (ordersToShow.length === 0) {
        ordersBody.innerHTML =
            '<tr><td colspan="5" class="text-center text-muted">У вас пока нет заявок</td></tr>'
        document.getElementById('orders-pagination').innerHTML = ''
        return
    }

    ordersBody.innerHTML = ordersToShow
        .map(function (order, index) {
            const courseName = getCourseName(order)
            const orderNumber = startIndex + index + 1

            return `
            <tr>
                <td>${orderNumber}</td>
                <td>${courseName}</td>
                <td>${formatDate(order.date_start)} ${order.time_start}</td>
                <td>${order.price} руб.</td>
                <td>
                    <button class="btn btn-info btn-sm me-1" onclick="showDetails(${order.id
                })">Подробнее</button>
                    <button class="btn btn-warning btn-sm me-1" onclick="showEditModal(${order.id
                })">Изменить</button>
                    <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${order.id
                })">Удалить</button>
                </td>
            </tr>
        `
        })
        .join('')

    renderOrdersPagination(totalPages)
}

function renderOrdersPagination(totalPages) {
    const pagination = document.getElementById('orders-pagination')

    if (totalPages <= 1) {
        pagination.innerHTML = ''
        return
    }

    let html = ''

    html += `<li class="page-item ${currentOrderPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentOrderPage - 1
        }">Назад</a>
    </li>`

    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${currentOrderPage === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`
    }

    html += `<li class="page-item ${currentOrderPage === totalPages ? 'disabled' : ''
        }">
        <a class="page-link" href="#" data-page="${currentOrderPage + 1
        }">Вперёд</a>
    </li>`

    pagination.innerHTML = html

    pagination.querySelectorAll('.page-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault()
            const page = parseInt(this.dataset.page)
            if (page >= 1 && page <= totalPages) {
                currentOrderPage = page
                renderOrders()
            }
        })
    })
}

function getCourseName(order) {
    if (order.course_id && order.course_id !== 0) {
        const course = allCourses.find(function (c) {
            return c.id === order.course_id
        })
        return course ? course.name : 'Курс #' + order.course_id
    }
    if (order.tutor_id && order.tutor_id !== 0) {
        const tutor = allTutors.find(function (t) {
            return t.id === order.tutor_id
        })
        return tutor ? 'Репетитор: ' + tutor.name : 'Репетитор #' + order.tutor_id
    }
    return 'Не указано'
}

function getCourseOrTutor(order) {
    if (order.course_id && order.course_id !== 0) {
        return allCourses.find(function (c) {
            return c.id === order.course_id
        })
    }
    if (order.tutor_id && order.tutor_id !== 0) {
        return allTutors.find(function (t) {
            return t.id === order.tutor_id
        })
    }
    return null
}

function showDetails(orderId) {
    const order = allOrders.find(function (o) {
        return o.id === orderId
    })
    if (!order) return

    const courseName = getCourseName(order)
    const options = []

    if (order.early_registration) options.push('Ранняя регистрация (-10%)')
    if (order.group_enrollment) options.push('Групповая скидка (-15%)')
    if (order.intensive_course) options.push('Интенсивный курс (+20%)')
    if (order.supplementary) options.push('Дополнительные материалы')
    if (order.personalized) options.push('Индивидуальные занятия')
    if (order.excursions) options.push('Культурные экскурсии (+25%)')
    if (order.assessment) options.push('Оценка уровня языка')
    if (order.interactive) options.push('Интерактивная платформа (+50%)')

    const modalBody = document.getElementById('details-modal-body')
    modalBody.innerHTML = `
        <div class="mb-3">
            <strong>Номер заявки:</strong> ${order.id}
        </div>
        <div class="mb-3">
            <strong>Курс/Репетитор:</strong> ${courseName}
        </div>
        <div class="mb-3">
            <strong>Дата начала:</strong> ${formatDate(order.date_start)}
        </div>
        <div class="mb-3">
            <strong>Время:</strong> ${order.time_start}
        </div>
        <div class="mb-3">
            <strong>Продолжительность:</strong> ${order.duration} ч.
        </div>
        <div class="mb-3">
            <strong>Количество студентов:</strong> ${order.persons}
        </div>
        <div class="mb-3">
            <strong>Выбранные опции:</strong>
            ${options.length > 0
            ? '<ul class="mb-0"><li>' +
            options.join('</li><li>') +
            '</li></ul>'
            : 'Нет'
        }
        </div>
        <div class="mb-0 p-2 bg-light rounded">
            <strong>Итоговая стоимость:</strong> ${order.price} руб.
        </div>
    `

    new bootstrap.Modal(document.getElementById('detailsModal')).show()
}

function showEditModal(orderId) {
    const order = allOrders.find(function (o) {
        return o.id === orderId
    })
    if (!order) return

    currentEditOrder = order

    document.getElementById('edit-order-id').value = order.id
    document.getElementById('edit-course-id').value = order.course_id || 0
    document.getElementById('edit-tutor-id').value = order.tutor_id || 0

    const courseOrTutor = getCourseOrTutor(order)
    const dateSelect = document.getElementById('edit-start-date')
    const timeSelect = document.getElementById('edit-start-time')

    if (order.course_id && order.course_id !== 0 && courseOrTutor) {
        document.getElementById('edit-course-name').value = courseOrTutor.name
        document.getElementById('edit-teacher-name').value = courseOrTutor.teacher
        document.getElementById('edit-duration').value =
            courseOrTutor.total_length + ' недель'

        dateSelect.innerHTML = ''
        if (courseOrTutor.start_dates) {
            const uniqueDates = [
                ...new Set(
                    courseOrTutor.start_dates.map(function (dt) {
                        return dt.split('T')[0]
                    })
                ),
            ]
            uniqueDates.forEach(function (date) {
                const option = document.createElement('option')
                option.value = date
                option.textContent = formatDate(date)
                option.selected = date === order.date_start
                dateSelect.appendChild(option)
            })
        }

        populateEditTimes(order.date_start, order.time_start)
    } else if (order.tutor_id && order.tutor_id !== 0 && courseOrTutor) {
        document.getElementById('edit-course-name').value = 'Занятие с репетитором'
        document.getElementById('edit-teacher-name').value = courseOrTutor.name
        document.getElementById('edit-duration').value = order.duration + ' ч.'

        dateSelect.innerHTML = ''
        const today = new Date()
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            const option = document.createElement('option')
            option.value = dateStr
            option.textContent = formatDate(dateStr)
            option.selected = dateStr === order.date_start
            dateSelect.appendChild(option)
        }

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
            '19:00',
        ]
        timeSelect.innerHTML = ''
        times.forEach(function (time) {
            const option = document.createElement('option')
            option.value = time
            option.textContent = time
            option.selected = time === order.time_start
            timeSelect.appendChild(option)
        })
    }

    document.getElementById('edit-students').value = order.persons

    document.getElementById('edit-option-supplementary').checked =
        order.supplementary
    document.getElementById('edit-option-personalized').checked =
        order.personalized
    document.getElementById('edit-option-excursions').checked = order.excursions
    document.getElementById('edit-option-assessment').checked = order.assessment
    document.getElementById('edit-option-interactive').checked = order.interactive

    calculateEditTotalCost()

    new bootstrap.Modal(document.getElementById('editModal')).show()
}

function populateEditTimes(selectedDate, currentTime) {
    const timeSelect = document.getElementById('edit-start-time')
    const courseOrTutor = getCourseOrTutor(currentEditOrder)

    timeSelect.innerHTML = ''

    if (
        currentEditOrder.course_id &&
        courseOrTutor &&
        courseOrTutor.start_dates
    ) {
        const timesForDate = courseOrTutor.start_dates
            .filter(function (dt) {
                return dt.startsWith(selectedDate)
            })
            .map(function (dt) {
                return dt.split('T')[1].substring(0, 5)
            })

        timesForDate.forEach(function (time) {
            const option = document.createElement('option')
            option.value = time
            option.textContent = time
            option.selected = time === currentTime
            timeSelect.appendChild(option)
        })
    }
}

function handleEditDateChange() {
    const selectedDate = document.getElementById('edit-start-date').value
    populateEditTimes(selectedDate, null)
    calculateEditTotalCost()
}

function calculateEditTotalCost() {
    if (!currentEditOrder) return

    const dateValue = document.getElementById('edit-start-date').value
    const timeValue = document.getElementById('edit-start-time').value
    const studentsCount =
        parseInt(document.getElementById('edit-students').value) || 1

    const supplementary = document.getElementById(
        'edit-option-supplementary'
    ).checked
    const personalized = document.getElementById(
        'edit-option-personalized'
    ).checked
    const excursions = document.getElementById('edit-option-excursions').checked
    const assessment = document.getElementById('edit-option-assessment').checked
    const interactive = document.getElementById('edit-option-interactive').checked

    const courseOrTutor = getCourseOrTutor(currentEditOrder)

    let courseFeePerHour = 0
    let durationInHours = 0
    let totalWeeks = 0
    let weeklyHours = 0

    if (currentEditOrder.course_id && courseOrTutor) {
        courseFeePerHour = courseOrTutor.course_fee_per_hour
        totalWeeks = courseOrTutor.total_length
        weeklyHours = courseOrTutor.week_length
        durationInHours = totalWeeks * weeklyHours
    } else if (currentEditOrder.tutor_id && courseOrTutor) {
        courseFeePerHour = courseOrTutor.price_per_hour
        durationInHours = currentEditOrder.duration || 1
        totalWeeks = 1
        weeklyHours = durationInHours
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

    let totalCost = baseCost + morningSurcharge + eveningSurcharge

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

    document.getElementById('edit-total-cost').textContent = Math.round(totalCost)

    document.getElementById('edit-badge-weekend').style.display = isWeekend
        ? 'inline-block'
        : 'none'
    document.getElementById('edit-badge-morning').style.display =
        morningSurcharge > 0 ? 'inline-block' : 'none'
    document.getElementById('edit-badge-evening').style.display =
        eveningSurcharge > 0 ? 'inline-block' : 'none'
    document.getElementById('edit-badge-intensive').style.display = isIntensive
        ? 'inline-block'
        : 'none'
    document.getElementById('edit-badge-early').style.display =
        isEarlyRegistration ? 'inline-block' : 'none'
    document.getElementById('edit-badge-group').style.display = isGroupEnrollment
        ? 'inline-block'
        : 'none'
}

async function saveEdit() {
    const orderId = parseInt(document.getElementById('edit-order-id').value)
    const dateValue = document.getElementById('edit-start-date').value
    const timeValue = document.getElementById('edit-start-time').value
    const studentsCount =
        parseInt(document.getElementById('edit-students').value) || 1
    const totalCost = parseInt(
        document.getElementById('edit-total-cost').textContent
    )

    if (!dateValue || !timeValue) {
        showNotification('Выберите дату и время', 'warning')
        return
    }

    if (studentsCount < 1 || studentsCount > 20) {
        showNotification('Количество студентов должно быть от 1 до 20', 'warning')
        return
    }

    const orderData = {
        course_id: parseInt(document.getElementById('edit-course-id').value) || 0,
        tutor_id: parseInt(document.getElementById('edit-tutor-id').value) || 0,
        date_start: dateValue,
        time_start: timeValue,
        duration: currentEditOrder.duration,
        persons: studentsCount,
        price: totalCost,
        early_registration:
            document.getElementById('edit-badge-early').style.display !== 'none',
        group_enrollment:
            document.getElementById('edit-badge-group').style.display !== 'none',
        intensive_course:
            document.getElementById('edit-badge-intensive').style.display !== 'none',
        supplementary: document.getElementById('edit-option-supplementary').checked,
        personalized: document.getElementById('edit-option-personalized').checked,
        excursions: document.getElementById('edit-option-excursions').checked,
        assessment: document.getElementById('edit-option-assessment').checked,
        interactive: document.getElementById('edit-option-interactive').checked,
    }

    try {
        document.getElementById('save-edit-btn').disabled = true
        await updateOrder(orderId, orderData)
        showNotification('Заявка успешно обновлена', 'success')
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide()
        await loadData()
    } catch (error) {
        showNotification('Ошибка при обновлении: ' + error.message, 'danger')
    } finally {
        document.getElementById('save-edit-btn').disabled = false
    }
}

function showDeleteModal(orderId) {
    document.getElementById('delete-order-id').value = orderId
    new bootstrap.Modal(document.getElementById('deleteModal')).show()
}

async function confirmDelete() {
    const orderId = parseInt(document.getElementById('delete-order-id').value)

    try {
        document.getElementById('confirm-delete-btn').disabled = true
        await deleteOrder(orderId)
        showNotification('Заявка успешно удалена', 'success')
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide()
        await loadData()
    } catch (error) {
        showNotification('Ошибка при удалении: ' + error.message, 'danger')
    } finally {
        document.getElementById('confirm-delete-btn').disabled = false
    }
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

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}