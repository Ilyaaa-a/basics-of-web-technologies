// lab 1 POW

function pow(x, n) {
    if (n <= 0 || !Number.isInteger(n)) {
        alert('n must be a natural number');
        return;
    }

    let result = 1;
    for (let i = 0; i < n; i++) {
        result *= x;
    }

    alert(result);
    return result;
};

// lab 2 Нахождение НОД

function gcd(a, b) {

    if (a === 0 && b === 0) {
        return 0;
    }

    if (a === 0) return b;
    if (b === 0) return a;
    
    // Находим минимальное из двух чисел
    let min = a < b ? a : b;

    for (let i = min; i >= 1; i--) {
        if (a % i === 0 && b % i === 0) {
            alert(i);
            return i;   
        }
    }

};

// lab 3 Наименьшая цифра

function minDigit(x) {
    if (x === 0) {
        return 0;
    }
    
    let min = 9; // максимальная возможная цифра
    let num = x;
    
    while (num > 0) {
        let digit = num % 10;
        if (digit < min) {
            min = digit;
        }
        num = Math.floor(num / 10);
    }

    alert(min);
    return min;
}

// lab 4 Pluralization

function pluralizeRecords(n) {
    let form;
    let absN = Math.abs(n) % 100; // рассматриваем последние две цифры
    let lastDigit = absN % 10;

    if (absN >= 11 && absN <= 19) {
        form = "записей";
    } else if (lastDigit === 1) {
        form = "запись";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        form = "записи";
    } else {
        form = "записей";
    }

    alert(`В результате выполнения запроса было найдено ${n} ${form}`);
    return `В результате выполнения запроса было найдено ${n} ${form}`;
}

// lab 5 Числа Фибоначчи

function fibb(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;

    let a = 0;
    let b = 1;
    let temp;

    for (let i = 3; i <= n; i++) {
        temp = a + b;
        a = b;
        b = temp;
    }

    alert(b);
    return b;
}

// lab 6 Сортировка

// Тестовый массив объектов
const testArray = [
    { name: "Иван", age: 25, city: "Москва" },
    { name: "Анна", age: 30, city: "Санкт-Петербург" },
    { name: "Борис", age: 20, city: "Новосибирск" },
    { name: "Елена", age: 35, city: "Екатеринбург" }
];

const testKey = "name";

function getSortedArray(array, key) {

    // Создаём копию массива, чтобы не изменять исходный
    let sorted = [];
    for (let i = 0; i < array.length; i++) {
        sorted[i] = array[i];
    }

    // Реализуем пузырьковую сортировку (можно и другую, но без встроенных функций)
    for (let i = 0; i < sorted.length - 1; i++) {
        for (let j = 0; j < sorted.length - 1 - i; j++) {
            let a = sorted[j][key];
            let b = sorted[j + 1][key];

            let shouldSwap = false;

            // Сравниваем значения в зависимости от их типа
            if (typeof a === 'string' && typeof b === 'string') {
                // Лексикографическое сравнение строк
                if (a > b) {
                    shouldSwap = true;
                }
            } else if (typeof a === 'number' && typeof b === 'number') {
                // Числовое сравнение
                if (a > b) {
                    shouldSwap = true;
                }
            } else {
                // Если типы разные, приводим к строкам и сравниваем
                let strA = String(a);
                let strB = String(b);
                if (strA > strB) {
                    shouldSwap = true;
                }
            }

            if (shouldSwap) {
                // Обмен элементов местами
                let temp = sorted[j];
                sorted[j] = sorted[j + 1];
                sorted[j + 1] = temp;
            }
        }
    }

    alert(JSON.stringify(sorted, null, 2))
    return sorted;
}