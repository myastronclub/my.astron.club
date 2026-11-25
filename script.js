// Navigation Drawer Toggle
function openDrawer() {
  document.getElementById('drawerMenu').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('active');
}

function closeDrawer() {
  document.getElementById('drawerMenu').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('active');
}

// Page Switching
function switchPage(pageId) {
  closeDrawer();
  const pages = document.querySelectorAll('.page-view');
  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }
}

// Footer Controls
function scrollToTop() {
  document.getElementById('mainScrollable').scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function refreshPage() {
  window.location.reload();
}

// Calendar & Visit State (June 2026 - November 2026)
const monthsData = [
  { name: 'Июнь 2026 года', year: 2026, monthIndex: 5, startOffset: 0, daysCount: 30, activeDays: [1, 3] },
  { name: 'Июль 2026 года', year: 2026, monthIndex: 6, startOffset: 2, daysCount: 31, activeDays: [5, 12, 19] },
  { name: 'Август 2026 года', year: 2026, monthIndex: 7, startOffset: 5, daysCount: 31, activeDays: [3, 10, 17, 24] },
  { name: 'Сентябрь 2026 года', year: 2026, monthIndex: 8, startOffset: 1, daysCount: 30, activeDays: [2, 9, 16, 23] },
  { name: 'Октябрь 2026 года', year: 2026, monthIndex: 9, startOffset: 3, daysCount: 31, activeDays: [6, 14, 21, 28] },
  { name: 'Ноябрь 2026 года', year: 2026, monthIndex: 10, startOffset: 6, daysCount: 30, activeDays: [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25], mark: 'н' }
];

let currentMonthIdx = 5; // Ноябрь 2026 года

function renderCalendar() {
  const current = monthsData[currentMonthIdx];
  document.getElementById('monthDisplayTitle').innerText = current.name;

  const grid = document.getElementById('calendarDaysGrid');
  grid.innerHTML = '';

  for (let i = 0; i < current.startOffset; i++) {
    const blank = document.createElement('div');
    blank.className = 'day-cell';
    grid.appendChild(blank);
  }

  for (let d = 1; d <= current.daysCount; d++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.innerText = d;

   if (current.activeDays.includes(d)) {
  dayCell.classList.add('active-day');
  if (current.mark) {
    const markEl = document.createElement('img');
    markEl.className = 'day-mark';
    markEl.src = "./image/weight.png"
    markEl.alt = '';
    dayCell.appendChild(markEl);
  }
}

    dayCell.addEventListener('click', () => {
      const idx = current.activeDays.indexOf(d);
      if (idx > -1) {
        current.activeDays.splice(idx, 1);
      } else {
        current.activeDays.push(d);
        current.activeDays.sort((a, b) => a - b);
      }
      renderCalendar();
      renderVisitLogs();
    });

    grid.appendChild(dayCell);
  }

  document.getElementById('prevMonthBtn').disabled = (currentMonthIdx === 0);
  document.getElementById('nextMonthBtn').disabled = (currentMonthIdx === monthsData.length - 1);
}

function changeMonth(direction) {
  currentMonthIdx += direction;
  if (currentMonthIdx < 0) currentMonthIdx = 0;
  if (currentMonthIdx >= monthsData.length) currentMonthIdx = monthsData.length - 1;
  renderCalendar();
  renderVisitLogs();
}

// Generate visit logs in time range 15:00 - 18:00
function renderVisitLogs() {
  const container = document.getElementById('visitListContainer');
  const current = monthsData[currentMonthIdx];
  container.innerHTML = '';

  if (current.activeDays.length === 0) {
    container.innerHTML = '<div style="padding: 12px; text-align: center; color: #888; font-size: 11px;">Нет посещений в этом месяце</div>';
    return;
  }

  current.activeDays.forEach(day => {
    const minutesSeed = (day * 17 + currentMonthIdx * 13) % 180;
    const hour = 15 + Math.floor(minutesSeed / 60);
    const minute = minutesSeed % 60;
    const timeFormatted = `${hour}:${minute < 10 ? '0' + minute : minute}`;

    const item = document.createElement('div');
    item.className = 'visit-item';
    item.innerHTML = `
      <img src="./image/weight.png" alt="";>
      <div class="visit-content">
        <div class="visit-time">${timeFormatted}</div>
        <div class="visit-title">Тренажерный зал</div>
        <div class="visit-sub">Суворова 13в</div>
      </div>
      <svg class="sub-arrow" viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" fill="#a5a5a5" />
  <path fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" d="M10.2 7.8l4.2 4.2-4.2 4.2" />
</svg>
    `;
    container.appendChild(item);
  });
}

// Accordion Toggle
function toggleDetails() {
  const panel = document.getElementById('detailsPanel');
  const accIcon = document.getElementById('accIcon');
  panel.classList.toggle('open');

  if (panel.classList.contains('open')) {
    accIcon.innerHTML = `<path fill="#999" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>`;
  } else {
    accIcon.innerHTML = `<path fill="#999" d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderVisitLogs();
});