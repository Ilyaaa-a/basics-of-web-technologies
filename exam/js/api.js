const API_BASE = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api'
const API_KEY = '605c13e7-9e68-4177-82c9-769249fbe7b8'

async function apiRequest(endpoint, options = {}) {
    const url = new URL(API_BASE + endpoint)
    url.searchParams.append('api_key', API_KEY)

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const response = await fetch(url.toString(), {
        ...defaultOptions,
        ...options,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error: ${response.status}`)
    }

    return response.json()
}

async function getCourses() {
    return apiRequest('/courses')
}

async function getCourse(id) {
    return apiRequest(`/courses/${id}`)
}

async function getTutors() {
    return apiRequest('/tutors')
}

async function getTutor(id) {
    return apiRequest(`/tutors/${id}`)
}

async function getOrders() {
    return apiRequest('/orders')
}

async function getOrder(id) {
    return apiRequest(`/orders/${id}`)
}

async function createOrder(data) {
    return apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

async function updateOrder(id, data) {
    return apiRequest(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

async function deleteOrder(id) {
    return apiRequest(`/orders/${id}`, {
        method: 'DELETE',
    })
}