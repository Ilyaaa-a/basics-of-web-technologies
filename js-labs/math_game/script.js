let currentLevel = 'начальный';
let correctAnswers = 0;
let wrongAnswers = 0;
let questionCount = 0;
let usedQuestions = new Set();
let currentQuestionData = null;

const questions = {
    начальный: [],
    средний: [],
    продвинутый: []
};

// === Генерация вопросов ===
function initQuestions() {
    // Начальный уровень
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let question, answer;
        if (op === '+') { question = `${a} + ${b}`; answer = a + b; }
        else if (op === '-') { question = `${a} - ${b}`; answer = a - b; }
        else if (op === '*') { question = `${a} * ${b}`; answer = a * b; }
        questions.начальный.push({ question, answer });
    }

    // Средний уровень — сравнения
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        const ops = ['>', '<', '>=', '<=', '==', '!='];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let question = `${a} ${op} ${b}`;
        let answer;
        switch (op) {
            case '>': answer = (a > b) ? 'true' : 'false'; break;
            case '<': answer = (a < b) ? 'true' : 'false'; break;
            case '>=': answer = (a >= b) ? 'true' : 'false'; break;
            case '<=': answer = (a <= b) ? 'true' : 'false'; break;
            case '==': answer = (a === b) ? 'true' : 'false'; break;
            case '!=': answer = (a !== b) ? 'true' : 'false'; break;
        }
        questions.средний.push({ question, answer });
    }

    // Продвинутый уровень — побитовые и логические
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        const ops = ['&', '|', '^', '<<', '>>', 'binary'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let question, answer;
        if (op === '&') { question = `${a} & ${b}`; answer = a & b; }
        else if (op === '|') { question = `${a} | ${b}`; answer = a | b; }
        else if (op === '^') { question = `${a} ^ ${b}`; answer = a ^ b; }
        else if (op === '<<') { question = `${a} << 1`; answer = a << 1; }
        else if (op === '>>') { question = `${a} >> 1`; answer = a >> 1; }
        else if (op === 'binary') {
            const n = Math.floor(Math.random() * 31);
            question = `Двоичное ${n}`;
            answer = n.toString(2);
        }
        if (question && answer !== undefined) {
            questions.продвинутый.push({ question, answer });
        }
    }
}

function getRandomQuestion(level) {
    const levelQuestions = questions[level];
    const available = levelQuestions.filter(q => !usedQuestions.has(q.question));
    if (available.length === 0) {
        usedQuestions.clear();
        return getRandomQuestion(level);
    }
    const q = available[Math.floor(Math.random() * available.length)];
    usedQuestions.add(q.question);
    return q;
}

function updateUI() {
    document.getElementById('levelInfo').textContent = `Уровень: ${currentLevel}`;
    document.getElementById('stats').textContent = `Правильных: ${correctAnswers} | Неправильных: ${wrongAnswers}`;
}

function showNextQuestion() {
    if (questionCount >= 10) {
        const rate = correctAnswers / 10;
        if (rate >= 0.8) {
            if (currentLevel === 'начальный') {
                currentLevel = 'средний';
                resetLevel();
            } else if (currentLevel === 'средний') {
                currentLevel = 'продвинутый';
                resetLevel();
            } else {
                finishGame(true);
                return;
            }
        } else {
            finishGame(false);
            return;
        }
    }

    currentQuestionData = getRandomQuestion(currentLevel);
    document.getElementById('question').textContent = currentQuestionData.question;
    document.getElementById('answerInput').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answerInput').focus();
}

function resetLevel() {
    questionCount = 0;
    usedQuestions.clear();
    updateUI();
    showNextQuestion();
}

function finishGame(success) {
    document.getElementById('question').textContent = 'Игра завершена!';
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('endButtons').classList.remove('hidden');

    if (success) {
        document.getElementById('congratsMsg').textContent = '🏆 Поздравляем! Вы прошли все уровни!';
    } else {
        document.getElementById('congratsMsg').textContent = '❌ Вы не набрали достаточно правильных ответов.';
    }
    document.getElementById('congratsMsg').classList.remove('hidden');
}

function checkAnswer() {
    if (!currentQuestionData) return;

    const userAnswer = document.getElementById('answerInput').value.trim();
    const correct = currentQuestionData.answer.toString();

    let isCorrect = false;

    if (correct === 'true' || correct === 'false') {
        isCorrect = userAnswer.toLowerCase() === correct;
    } else {
        const numUser = parseFloat(userAnswer);
        const numCorrect = parseFloat(correct);
        isCorrect = !isNaN(numUser) && Math.abs(numUser - numCorrect) < 0.001;
    }

    if (isCorrect) {
        correctAnswers++;
        document.getElementById('result').textContent = '✅ Верно!';
        document.getElementById('result').style.color = '#27ae60';
    } else {
        wrongAnswers++;
        document.getElementById('result').textContent = `❌ Неверно! Правильный ответ: ${correct}`;
        document.getElementById('result').style.color = '#e74c3c';
    }

    questionCount++;
    updateUI();

    // Следующий вопрос через 1.2 секунды
    setTimeout(() => {
        if (questionCount < 10 ||
            (questionCount === 10 && correctAnswers / 10 >= 0.8 && currentLevel !== 'продвинутый')) {
            showNextQuestion();
        } else {
            finishGame(questionCount === 10 && correctAnswers / 10 >= 0.8);
        }
    }, 1200);
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
    initQuestions();
    updateUI();
    showNextQuestion();

    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    document.getElementById('restartBtn').addEventListener('click', () => {
        location.reload();
    });
    document.getElementById('exitBtn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите выйти?')) window.close();
    });
});