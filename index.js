// 1. СЕЛЕКТОРИ
const input = document.getElementById('habitInput');
const addBtn = document.querySelector('.add-btn');
const grid = document.querySelector('.ritual-grid');
const fill = document.querySelector('.fill');
const textFill = document.querySelector('.value');
//с променлива защото даркмоде се променя на долу в код
let darkmode = localStorage.getItem('darkmode');
const switchToggle = document.getElementById('theme-toggle');
//включване на даркмод
const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}
//изключване на даркмод
const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.removeItem('darkmode');
}
//ако е активен даркмоде да го пусне 
if (darkmode === 'active') enableDarkmode()
//клик команда какво да прави иф елсе
switchToggle.addEventListener("click", () => {
    darkmode =localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
})


// 2. ДАННИ
let tasks = [];
const emojis = ["✨", "💧", "💪", "🧘", "📚"]; // Твоят списък с емоджита

// 3. ФУНКЦИИ
function progress() {
    const title = input.value.trim();
    if (title === '') return;

    const newHabit = {
        id: Date.now(),
        name: title,
        completed: false,
        emojiIndex: 0 // Пазим кое емоджи е избрано за този навик
    };

    tasks.push(newHabit);
    input.value = '';
    render();
}

function render() {
    if (!grid) return;
    grid.innerHTML = '';

    tasks.forEach((task) => {
        // Създаваме елемента на картата
        const card = document.createElement('article');
        card.className = 'ritual-card';
        updateProgress();
        // Слагаме дизайна, който ти харесва
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-head">
                    <div class="icon-box" style="cursor:pointer">${emojis[task.emojiIndex]}</div>
                    <div class="title-group">
                        <h3>${task.name}</h3>
                        <p>0 дни серия</p>
                    </div>
                    <div class="action-group">
                        <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
                        <button class="check-box ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
                            ${task.completed ? '' : ''}
                        </button>
                    </div>
                </div>
                <div class="habit-calendar">
                    ${[ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд' ].map(day => `
                        <div class="day-col"><span class="day-name">${day}</span><div class="dot"></div></div>
                    `).join('')}
                </div>
            </div>
        `;

        // ЛОГИКА ЗА ЕМОДЖИТАТА (при клик върху иконата)
        const iconBox = card.querySelector('.icon-box');
        iconBox.addEventListener('click', () => {
            task.emojiIndex = (task.emojiIndex + 1) % emojis.length;
            iconBox.innerHTML = emojis[task.emojiIndex];
        });

        grid.appendChild(card);
    });

    
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

function updateProgress() {
    if (!fill || !textFill) return;
    if (tasks.length === 0) {
        fill.style.width = "0%";
        textFill.innerHTML = "0%";
        return;
    }
    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / tasks.length) * 100);
requestAnimationFrame(() => {
        fill.style.width = percentage + "%";
        textFill.innerHTML = percentage + "%";
    });
}

// 4. СЛУШАТЕЛИ
if (addBtn) addBtn.addEventListener("click", progress);
if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") progress(); });