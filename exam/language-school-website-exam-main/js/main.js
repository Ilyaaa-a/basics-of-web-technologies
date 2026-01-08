let allCourses = []
let allTutors = []
let filteredCourses = []
let filteredTutors = []
let currentCoursePage = 1
let selectedCourse = null
let selectedTutor = null
const ITEMS_PER_PAGE = 5

document.addEventListener('DOMContentLoaded', function () {
  loadCourses()
  loadTutors()
  setupEventListeners()
})

function setupEventListeners() {
  document
    .getElementById('course-search-form')
    .addEventListener('submit', function (e) {
      e.preventDefault()
      filterCourses()
    })

  document
    .getElementById('course-search-name')
    .addEventListener('input', filterCourses)
  document
    .getElementById('course-search-level')
    .addEventListener('change', filterCourses)

  document
    .getElementById('tutor-search-form')
    .addEventListener('submit', function (e) {
      e.preventDefault()
      filterTutors()
    })

  document
    .getElementById('tutor-search-level')
    .addEventListener('change', filterTutors)
  document
    .getElementById('tutor-search-experience')
    .addEventListener('input', filterTutors)

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
}

async function loadCourses() {
  const coursesList = document.getElementById('courses-list')
  coursesList.innerHTML =
    '<div class="spinner-container"><div class="spinner-border text-primary"></div></div>'

  try {
    allCourses = await getCourses()
    filteredCourses = [...allCourses]
    renderCourses()
  } catch (error) {
    coursesList.innerHTML =
      '<div class="empty-state"><p>Ошибка загрузки курсов</p></div>'
    showNotification('Ошибка загрузки курсов: ' + error.message, 'danger')
  }
}

async function loadTutors() {
  const tutorsBody = document.getElementById('tutors-table-body')
  tutorsBody.innerHTML =
    '<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary"></div></td></tr>'

  try {
    allTutors = await getTutors()
    filteredTutors = [...allTutors]
    renderTutors()
  } catch (error) {
    tutorsBody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">Ошибка загрузки репетиторов</td></tr>'
    showNotification('Ошибка загрузки репетиторов: ' + error.message, 'danger')
  }
}

function filterCourses() {
  const searchName = document
    .getElementById('course-search-name')
    .value.toLowerCase()
  const searchLevel = document.getElementById('course-search-level').value

  filteredCourses = allCourses.filter(function (course) {
    const matchesName = course.name.toLowerCase().includes(searchName)
    const matchesLevel = !searchLevel || course.level === searchLevel
    return matchesName && matchesLevel
  })

  currentCoursePage = 1
  renderCourses()
}

function filterTutors() {
  const searchLevel = document.getElementById('tutor-search-level').value
  const searchExperience =
    parseInt(document.getElementById('tutor-search-experience').value) || 0

  filteredTutors = allTutors.filter(function (tutor) {
    const matchesLevel = !searchLevel || tutor.language_level === searchLevel
    const matchesExperience = tutor.work_experience >= searchExperience
    return matchesLevel && matchesExperience
  })

  renderTutors()
}

function renderCourses() {
  const coursesList = document.getElementById('courses-list')
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  const startIndex = (currentCoursePage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const coursesToShow = filteredCourses.slice(startIndex, endIndex)

  if (coursesToShow.length === 0) {
    coursesList.innerHTML =
      '<div class="empty-state"><p>Курсы не найдены</p></div>'
    document.getElementById('courses-pagination').innerHTML = ''
    return
  }

  coursesList.innerHTML = coursesToShow
    .map(function (course) {
      const isSelected = selectedCourse && selectedCourse.id === course.id
      return `
            <div class="list-group-item ${
              isSelected ? 'selected' : ''
            }" data-course-id="${course.id}">
                <div class="course-item">
                    <div class="course-info">
                        <h5 class="mb-1">${course.name}</h5>
                        <p class="mb-1 text-truncate-2">${
                          course.description
                        }</p>
                        <div class="course-meta">
                            <span><strong>Уровень:</strong> ${translateLevel(
                              course.level
                            )}</span>
                            <span><strong>Преподаватель:</strong> ${
                              course.teacher
                            }</span>
                            <span><strong>Длительность:</strong> ${
                              course.total_length
                            } нед.</span>
                            <span><strong>Цена:</strong> ${
                              course.course_fee_per_hour
                            } руб/час</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-outline-primary btn-sm select-course-btn">
                            ${isSelected ? 'Выбран' : 'Выбрать'}
                        </button>
                    </div>
                </div>
            </div>
        `
    })
    .join('')

  coursesList.querySelectorAll('.list-group-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (!e.target.classList.contains('select-course-btn')) return
      const courseId = parseInt(item.dataset.courseId)
      selectCourse(courseId)
    })
  })

  renderCoursesPagination(totalPages)
}

function renderCoursesPagination(totalPages) {
  const pagination = document.getElementById('courses-pagination')

  if (totalPages <= 1) {
    pagination.innerHTML = ''
    return
  }

  let html = ''

  html += `<li class="page-item ${currentCoursePage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${
          currentCoursePage - 1
        }">Назад</a>
    </li>`

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${currentCoursePage === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`
  }

  html += `<li class="page-item ${
    currentCoursePage === totalPages ? 'disabled' : ''
  }">
        <a class="page-link" href="#" data-page="${
          currentCoursePage + 1
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
  const tutorsBody = document.getElementById('tutors-table-body')

  if (filteredTutors.length === 0) {
    tutorsBody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">Репетиторы не найдены</td></tr>'
    return
  }

  tutorsBody.innerHTML = filteredTutors
    .map(function (tutor) {
      const isSelected = selectedTutor && selectedTutor.id === tutor.id
      return `
            <tr class="${
              isSelected ? 'selected' : ''
            }" data-tutor-id="${tutor.id}">
                <td>${tutor.name}</td>
                <td>${translateLevel(tutor.language_level)}</td>
                <td>${tutor.languages_offered.join(', ')}</td>
                <td>${tutor.work_experience}</td>
                <td>${tutor.price_per_hour}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm select-tutor-btn">
                        ${isSelected ? 'Выбран' : 'Выбрать'}
                    </button>
                </td>
            </tr>
        `
    })
    .join('')

  tutorsBody.querySelectorAll('tr').forEach(function (row) {
    row.addEventListener('click', function (e) {
      if (!e.target.classList.contains('select-tutor-btn')) return
      const tutorId = parseInt(row.dataset.tutorId)
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
      '19:00',
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
