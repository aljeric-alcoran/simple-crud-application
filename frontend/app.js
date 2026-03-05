// ─── CONFIG ────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:3000/api/v1/records'; // change to your endpoint

// ─── STATE ─────────────────────────────────────────────────────────────────
let allRecords = [];
let deleteTargetId = null;

// ─── API ───────────────────────────────────────────────────────────────────
const api = {
  async getAll() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch records');
    return res.json();
  },

  async create(data) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create record');
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update record');
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete record');
    return res.json();
  },
};

// ─── TOAST ─────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => (toast.className = ''), 3000);
}

// ─── VALIDATION ────────────────────────────────────────────────────────────
function validateForm() {
  let valid = true;

  const fields = [
    { id: 'firstName', errorId: 'firstNameError', check: (v) => v.trim() !== '' },
    { id: 'lastName',  errorId: 'lastNameError',  check: (v) => v.trim() !== '' },
    { id: 'email',     errorId: 'emailError',     check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'role',      errorId: 'roleError',      check: (v) => v !== '' },
  ];

  fields.forEach(({ id, errorId, check }) => {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    const ok = check(el.value);
    el.classList.toggle('error', !ok);
    err.classList.toggle('show', !ok);
    if (!ok) valid = false;
  });

  return valid;
}

function clearValidation() {
  ['firstName', 'lastName', 'email', 'role'].forEach((id) => {
    document.getElementById(id).classList.remove('error');
  });
  document.querySelectorAll('.field-error').forEach((el) => el.classList.remove('show'));
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function openCreateModal() {
  document.getElementById('modalTitle').innerHTML =
    'New Record <span class="tag" id="modalTag">CREATE</span>';
  document.getElementById('recordId').value = '';
  document.getElementById('recordForm').reset();
  clearValidation();
  document.getElementById('submitBtn').textContent = 'Save Record';
  document.getElementById('formModal').classList.add('open');
}

function openEditModal(record) {
  document.getElementById('modalTitle').innerHTML =
    'Edit Record <span class="tag" style="background:var(--accent2);color:#0b0c0f">UPDATE</span>';
  document.getElementById('recordId').value = record.id;
  document.getElementById('firstName').value = record.firstName || '';
  document.getElementById('lastName').value  = record.lastName  || '';
  document.getElementById('email').value     = record.email     || '';
  document.getElementById('role').value      = record.role      || '';
  document.getElementById('phone').value     = record.phone     || '';
  document.getElementById('notes').value     = record.notes     || '';
  clearValidation();
  document.getElementById('submitBtn').textContent = 'Update Record';
  document.getElementById('formModal').classList.add('open');
}

function closeModal() {
  document.getElementById('formModal').classList.remove('open');
}

// ─── CONFIRM DELETE ────────────────────────────────────────────────────────
function openConfirm(id) {
  deleteTargetId = id;
  document.getElementById('confirmModal').classList.add('open');
}

function closeConfirm() {
  deleteTargetId = null;
  document.getElementById('confirmModal').classList.remove('open');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!deleteTargetId) return;
  try {
    await api.delete(deleteTargetId);
    allRecords = allRecords.filter((r) => r.id !== deleteTargetId);
    renderTable(allRecords);
    updateStats(allRecords);
    showToast('Record deleted successfully.');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    closeConfirm();
  }
});

// ─── FORM SUBMIT ───────────────────────────────────────────────────────────
document.getElementById('recordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const id        = document.getElementById('recordId').value;
  const submitBtn = document.getElementById('submitBtn');

  const payload = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName:  document.getElementById('lastName').value.trim(),
    email:     document.getElementById('email').value.trim(),
    role:      document.getElementById('role').value,
    phone:     document.getElementById('phone').value.trim(),
    notes:     document.getElementById('notes').value.trim(),
  };

  submitBtn.disabled    = true;
  submitBtn.textContent = id ? 'Updating...' : 'Saving...';

  try {
    if (id) {
      const updated = await api.update(id, payload);
      allRecords = allRecords.map((r) => (r.id === id ? { ...r, ...updated } : r));
      showToast('Record updated successfully.');
    } else {
      const created = await api.create(payload);
      allRecords.unshift(created);
      showToast('Record created successfully.');
    }
    renderTable(allRecords);
    updateStats(allRecords);
    closeModal();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = id ? 'Update Record' : 'Save Record';
  }
});

// ─── RENDER TABLE ──────────────────────────────────────────────────────────
function renderTable(records) {
  const tbody = document.getElementById('tableBody');

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5">
        <div class="state-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          <p>No records found.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = records
    .map(
      (r) => `
      <tr>
        <td class="td-name">${esc(r.firstName)} ${esc(r.lastName)}</td>
        <td class="td-email">${esc(r.email)}</td>
        <td><span class="badge">${esc(r.role)}</span></td>
        <td>${esc(r.phone || '—')}</td>
        <td>
          <div class="actions">
            <button class="btn-icon edit" title="Edit" onclick='openEditModal(${JSON.stringify(r)})'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon delete" title="Delete" onclick="openConfirm('${r.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join('');
}

// ─── STATS ─────────────────────────────────────────────────────────────────
function updateStats(records) {
  document.getElementById('statTotal').textContent  = records.length;
  document.getElementById('statAdmins').textContent = records.filter((r) => r.role === 'Admin').length;
  const latest = records[0];
  document.getElementById('statLatest').textContent = latest
    ? `${latest.firstName} ${latest.lastName[0]}.`
    : '—';
}

// ─── SEARCH ────────────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = allRecords.filter((r) =>
    `${r.firstName} ${r.lastName} ${r.email} ${r.role}`.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

// ─── HELPERS ───────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ─── CLOSE MODAL ON BACKDROP CLICK ─────────────────────────────────────────
document.getElementById('formModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.getElementById('confirmModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeConfirm();
});

// ─── INIT ──────────────────────────────────────────────────────────────────
async function init() {
  try {
    allRecords = await api.getAll();
    renderTable(allRecords);
    updateStats(allRecords);
  } catch (err) {
    document.getElementById('tableBody').innerHTML = `
      <tr><td colspan="5">
        <div class="state-box">
          <p style="color:var(--danger)">⚠ Could not connect to API. Is your server running?</p>
        </div>
      </td></tr>`;
    showToast('API connection failed', 'error');
  }
}

init();