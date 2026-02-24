// ============================================================
// PetCare VET - Shared App Logic
// Auth guard, navigation, toast, utilities
// ============================================================

// ==================== AUTH GUARD ====================

function vetAuthGuard() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = '../login.html';
        return;
      }
      const { role, clinicId } = await obtenerRolUsuario(user.uid);
      const VET_ROLES = ['vet', 'clinic_admin', 'clinic_vet', 'clinic_receptionist'];
      if (!VET_ROLES.includes(role)) {
        window.location.href = '../index.html';
        return;
      }
      const ok = await vetInit();
      if (!ok) {
        window.location.href = '../login.html';
        return;
      }
      resolve(user);
    });
  });
}

// ==================== NAVIGATION ====================

function renderVetSidebar(activePage) {
  const pages = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard', href: 'dashboard.html' },
    { id: 'agenda', icon: 'fa-calendar-alt', label: 'Agenda', href: 'agenda.html' },
    { id: 'pacientes', icon: 'fa-paw', label: 'Pacientes', href: 'pacientes.html' },
    { id: 'clientes', icon: 'fa-users', label: 'Clientes', href: 'clientes.html' },
    { id: 'configuracion', icon: 'fa-cog', label: 'Configuración', href: 'configuracion.html' }
  ];

  const nav = document.getElementById('vet-sidebar-nav');
  if (!nav) return;
  nav.innerHTML = pages.map(p => `
    <a href="${p.href}" class="vet-nav-item ${p.id === activePage ? 'active' : ''}">
      <i class="fas ${p.icon}"></i>
      <span>${p.label}</span>
    </a>
  `).join('');
}

function renderVetHeader(title) {
  const user = auth.currentUser;
  const name = user?.displayName || user?.email || 'Usuario';
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const headerRight = document.getElementById('vet-header-right');
  if (headerRight) {
    headerRight.innerHTML = `
      <div class="vet-user-dropdown">
        <div class="vet-user-info" onclick="toggleUserDropdown()">
          <div class="user-avatar">${initials}</div>
          <span>${name}</span>
          <i class="fas fa-chevron-down" style="font-size:0.7rem"></i>
        </div>
        <div id="user-dropdown" class="vet-dropdown-menu">
          <div class="vet-dropdown-item" onclick="window.location.href='configuracion.html'">
            <i class="fas fa-cog"></i> Configuración
          </div>
          <div class="vet-dropdown-divider"></div>
          <div class="vet-dropdown-item danger" onclick="vetLogout()">
            <i class="fas fa-sign-out-alt"></i> Cerrar sesión
          </div>
        </div>
      </div>
    `;
  }

  const titleEl = document.getElementById('vet-header-title');
  if (titleEl) titleEl.textContent = title;
}

function toggleUserDropdown() {
  document.getElementById('user-dropdown')?.classList.toggle('active');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = document.getElementById('user-dropdown');
  if (dd && !e.target.closest('.vet-user-dropdown')) {
    dd.classList.remove('active');
  }
});

async function vetLogout() {
  await cerrarSesion();
}

// Mobile sidebar toggle
function toggleSidebar() {
  document.querySelector('.vet-sidebar')?.classList.toggle('open');
}

// ==================== TOAST ====================

function vetToast(message, type = 'info') {
  let container = document.querySelector('.vet-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'vet-toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `vet-toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 4000);
}

// ==================== UTILITIES ====================

function formatDate(d) {
  if (!d) return '—';
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(d) {
  if (!d) return '—';
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function calcAge(birthDate) {
  if (!birthDate) return '—';
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
  return `${months} mes${months !== 1 ? 'es' : ''}`;
}

function speciesIcon(species) {
  return species === 'cat' ? 'fa-cat' : 'fa-dog';
}

function speciesLabel(species) {
  return species === 'cat' ? 'Gato' : 'Perro';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
