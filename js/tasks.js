function initTasks() {
  const cur = requireAuth();
  document.getElementById('profileMini').textContent = cur ? cur.name + ' (' + cur.role + ')' : 'Guest';
  renderTasks();
  renderCalendar();
}

function addTask(e) {
  e && e.preventDefault();
  const t = document.getElementById('task_title').value.trim();
  const d = document.getElementById('task_date').value;
  if (!t || !d) { alert('Provide task and date'); return; }
  const tasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  const cur = JSON.parse(localStorage.getItem('auric_current') || '{}');
  tasks.push({ title: t, date: d, done: false, owner: cur.username });
  localStorage.setItem('auric_tasks', JSON.stringify(tasks));
  document.getElementById('task_title').value = '';
  renderTasks();
  renderCalendar();
}

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  const list = document.getElementById('taskList');
  if (!list) return;
  list.innerHTML = '';

  tasks.forEach((tk, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tk.title}</td>
      <td>${tk.date}</td>
      <td><button class="link" onclick="toggleDone(${i})">${tk.done ? 'Undo' : 'Done'}</button></td>
      <td><button class="link danger" onclick="deleteTask(${i})">🗑 Delete</button></td>
    `;
    list.appendChild(tr);
  });
}

function toggleDone(i) {
  const tasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  tasks[i].done = !tasks[i].done;
  localStorage.setItem('auric_tasks', JSON.stringify(tasks));
  renderTasks();
  renderCalendar();
}

function deleteTask(i) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  const tasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  tasks.splice(i, 1);
  localStorage.setItem('auric_tasks', JSON.stringify(tasks));
  renderTasks();
  renderCalendar();
}

// 🗓️ Calendar section with month navigation
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;

  const tasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Update title
  const monthName = firstDay.toLocaleString('default', { month: 'long' });
  const title = document.getElementById('calendarTitle');
  if (title) title.textContent = `${monthName} ${currentYear}`;

  let html = `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;">
      <div><b>Sun</b></div><div><b>Mon</b></div><div><b>Tue</b></div>
      <div><b>Wed</b></div><div><b>Thu</b></div><div><b>Fri</b></div><div><b>Sat</b></div>
  `;

  // empty cells before first day
  for (let i = 0; i < firstDay.getDay(); i++) html += `<div></div>`;

  // days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasTask = tasks.some(t => t.date === dateStr);
    html += `
      <div onclick="showTasksForDate('${dateStr}')"
           style="border:1px solid #ccc;padding:8px;cursor:pointer;
                  ${hasTask ? 'background:#ffd966;' : ''}">
        ${day}
      </div>`;
  }

  html += `</div>`;
  calendar.innerHTML = html;
}

function showTasksForDate(dateStr) {
  const allTasks = JSON.parse(localStorage.getItem('auric_tasks') || '[]');
  const tasks = allTasks.filter(t => t.date === dateStr);
  const out = document.getElementById('calendarTasks');
  if (!out) return;

  if (!tasks.length) {
    out.innerHTML = `<p>No tasks on ${dateStr}</p>`;
    return;
  }

  let html = `<h4>Tasks on ${dateStr}</h4><ul>`;
  tasks.forEach(t => html += `<li>${t.title} ${t.done ? '(done)' : ''}</li>`);
  html += `</ul>`;
  out.innerHTML = html;
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

window.addEventListener('DOMContentLoaded', initTasks);
