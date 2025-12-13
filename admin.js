const API = {
  notifications: '/api/notifications',
  notificationsAll: '/api/notifications/all',
  notification: (id) => `/api/notifications/${id}`,
  statistics: '/api/statistics/admin'
};

function getToken() {
  return localStorage.getItem('adminToken') || '';
}

function setToken(token) {
  localStorage.setItem('adminToken', token);
  document.getElementById('auth-status').textContent = token ? 'Token uložený' : 'Token chýba';
}

async function apiFetch(url, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

// Notifications
async function loadNotifications() {
  const list = document.getElementById('notif-list');
  const err = document.getElementById('notif-error');
  list.innerHTML = '';
  err.textContent = '';
  try {
    const data = await apiFetch(API.notificationsAll);
    data.notifications.forEach((n) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <div class="inline">
          <strong>#${n.id}</strong>
          <span class="badge">${n.active ? 'Aktívna' : 'Neaktívna'}</span>
        </div>
        <div class="muted" style="margin:6px 0;">${n.text}</div>
        <div class="inline">
          <button class="btn-secondary" data-edit="${n.id}">Upraviť</button>
          <button class="btn-secondary" data-toggle="${n.id}">${n.active ? 'Deaktivovať' : 'Aktivovať'}</button>
          <button class="btn-danger" data-del="${n.id}">Zmazať</button>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (e) {
    err.textContent = e.message;
  }
}

function fillNotifForm(n) {
  document.getElementById('notif-id').value = n.id || '';
  document.getElementById('notif-text').value = n.text || '';
  document.getElementById('notif-bg').value = n.backgroundColor || 'rgba(200, 30, 30, 0.95)';
  document.getElementById('notif-grad').value = n.backgroundGradient || 'rgba(180, 20, 20, 0.95)';
  document.getElementById('notif-border').value = n.borderColor || 'rgba(150, 10, 10, 0.8)';
  document.getElementById('notif-textcolor').value = n.textColor || 'rgba(255, 255, 255, 1)';
  document.getElementById('notif-active').value = n.active ? 'true' : 'false';
}

async function submitNotif(e) {
  e.preventDefault();
  const msg = document.getElementById('notif-form-msg');
  msg.textContent = '';
  const payload = {
    text: document.getElementById('notif-text').value,
    backgroundColor: document.getElementById('notif-bg').value,
    backgroundGradient: document.getElementById('notif-grad').value,
    borderColor: document.getElementById('notif-border').value,
    textColor: document.getElementById('notif-textcolor').value,
    active: document.getElementById('notif-active').value === 'true'
  };
  const id = document.getElementById('notif-id').value;
  try {
    if (id) {
      await apiFetch(API.notification(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      msg.textContent = 'Notifikácia upravená';
    } else {
      await apiFetch(API.notifications, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      msg.textContent = 'Notifikácia pridaná';
    }
    fillNotifForm({});
    loadNotifications();
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function handleNotifActions(e) {
  const target = e.target;
  if (target.dataset.edit) {
    const id = target.dataset.edit;
    const data = await apiFetch(API.notificationsAll);
    const n = data.notifications.find((x) => x.id.toString() === id.toString());
    if (n) fillNotifForm(n);
  }
  if (target.dataset.toggle) {
    const id = target.dataset.toggle;
    const data = await apiFetch(API.notificationsAll);
    const n = data.notifications.find((x) => x.id.toString() === id.toString());
    if (n) {
      await apiFetch(API.notification(id), {
        method: 'PUT',
        body: JSON.stringify({ active: !n.active })
      });
      loadNotifications();
    }
  }
  if (target.dataset.del) {
    const id = target.dataset.del;
    if (confirm(`Zmazať notifikáciu #${id}?`)) {
      await apiFetch(API.notification(id), { method: 'DELETE' });
      loadNotifications();
    }
  }
}

// Statistics
async function loadStats() {
  const msg = document.getElementById('stats-msg');
  msg.textContent = '';
  try {
    const data = await apiFetch(API.statistics);
    document.getElementById('stats-inspections').value = data.performedInspections ?? 15000;
    document.getElementById('stats-years-start').value = data.yearsExperienceStart ?? 2014;
    document.getElementById('stats-satisfaction').value = data.satisfactionPercentage ?? 98;
    document.getElementById('stats-place').value = data.googlePlaceId ?? '';
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function submitStats(e) {
  e.preventDefault();
  const msg = document.getElementById('stats-msg');
  msg.textContent = '';
  const payload = {
    performedInspections: Number(document.getElementById('stats-inspections').value || 0),
    yearsExperienceStart: Number(document.getElementById('stats-years-start').value || 2014),
    satisfactionPercentage: Number(document.getElementById('stats-satisfaction').value || 98),
    googlePlaceId: document.getElementById('stats-place').value || null
  };
  try {
    await apiFetch(API.statistics, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    msg.textContent = 'Štatistiky uložené';
  } catch (err) {
    msg.textContent = err.message;
  }
}

// Init
document.getElementById('save-token').addEventListener('click', () => {
  const val = document.getElementById('admin-password').value.trim();
  setToken(val);
});

document.getElementById('notif-form').addEventListener('submit', submitNotif);
document.getElementById('notif-reset').addEventListener('click', () => fillNotifForm({}));
document.getElementById('notif-list').addEventListener('click', (e) => handleNotifActions(e));
document.getElementById('stats-form').addEventListener('submit', submitStats);

// Load initial state
setToken(getToken());
loadNotifications();
loadStats();
