// ============================================================
// PetCare Pro - Lógica principal de la aplicación
// ============================================================

// ==================== ESTADO GLOBAL ====================
let estado = {
  mascotas: [],
  mascotaActiva: null,
  examenes: {},       // { petId: [...] }
  comidas: {},        // { petId: { 'YYYY-MM-DD': [...] } }
  agua: {},           // { petId: { 'YYYY-MM-DD': ml } }
  pesos: {},          // { petId: [{ fecha, peso }] }
  recordatorios: {},  // { petId: [...] }
  visitas: {},        // { petId: [...] }
  frecuenciaAlimentacion: {}, // { petId: number }
  checklists: {},     // { petId: { checklistKey: [bool] } }
  tema: 'light',
  veterinariasFavoritas: []
};

let firestoreUnsubscribe = null;
let currentPhotoFile = null;
let currentPDFFile = null;
let isSaving = false;
let googleMap = null;
let mapMarkers = [];
let mapInfoWindow = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      // Mostrar nombre del usuario
      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.textContent = user.displayName || user.email;

      // Cargar datos desde Firestore
      await cargarDatosDesdeFirestore();
      inicializarUI();
      setTimeout(() => {
        document.getElementById('app-loader').classList.add('hidden');
      }, 600);

      // Escuchar cambios en tiempo real para sincronización entre dispositivos
      firestoreUnsubscribe = escucharCambiosFirestore((data) => {
        // Ignorar ecos de nuestras propias escrituras
        if (isSaving) return;
        // Solo actualizar si los datos son más recientes
        if (data && data.mascotas) {
          estado = { ...estado, ...data };
          renderizarMascotas();
          actualizarDashboard();
        }
      });
    });
  } else {
    // Sin Firebase, usar localStorage
    cargarDatos();
    inicializarUI();
    setTimeout(() => {
      document.getElementById('app-loader').classList.add('hidden');
    }, 600);
  }
});

async function cargarDatosDesdeFirestore() {
  try {
    const data = await cargarDatosFirestore();
    if (data) {
      estado = { ...estado, ...data };
    } else {
      // Migrar datos de localStorage a Firestore si existen
      cargarDatos();
      if (estado.mascotas.length > 0) {
        await guardarDatosFirestore(estado);
        localStorage.removeItem('petcare_data');
      }
    }
  } catch(e) {
    console.error('Error cargando desde Firestore:', e);
    cargarDatos(); // Fallback a localStorage
  }
}

function inicializarUI() {
  // Tema
  aplicarTema(estado.tema);
  document.getElementById('theme-toggle').addEventListener('click', toggleTema);
  document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    estado.tema = e.target.checked ? 'dark' : 'light';
    aplicarTema(estado.tema);
    guardarDatos();
  });

  // Tamaño de fuente y notificaciones
  aplicarTamanoFuente();
  aplicarNotificaciones();

  // Sidebar
  document.getElementById('menu-toggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebar-close').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebar-overlay').addEventListener('click', () => toggleSidebar(false));

  // Navegación
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navegarA(link.dataset.section);
      if (window.innerWidth < 1024) toggleSidebar(false);
    });
  });

  // Formularios
  document.getElementById('pet-form').addEventListener('submit', guardarMascota);
  document.getElementById('pet-species').addEventListener('change', actualizarRazas);
  document.getElementById('pet-breed')?.addEventListener('change', (e) => {
    if (e.target.value && typeof mostrarInfoRaza === 'function') {
      mostrarInfoRaza(e.target.value);
    }
  });
  document.getElementById('exam-form').addEventListener('submit', guardarExamen);
  document.getElementById('meal-form').addEventListener('submit', registrarComida);
  document.getElementById('water-form').addEventListener('submit', registrarAgua);
  document.getElementById('weight-form').addEventListener('submit', registrarPeso);
  document.getElementById('reminder-form').addEventListener('submit', guardarRecordatorio);
  document.getElementById('visit-form').addEventListener('submit', guardarVisita);
  document.getElementById('portion-food-type').addEventListener('change', calcularPorciones);

  // Disclaimer
  document.getElementById('dismiss-disclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-banner').classList.add('hidden');
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.closest('.card-body').querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
    });
  });

  // Glosario
  document.getElementById('glossary-search').addEventListener('input', filtrarGlosario);

  // Llenar tipos de examen
  const examTypeSelect = document.getElementById('exam-type');
  TIPOS_EXAMEN.forEach(tipo => {
    const opt = document.createElement('option');
    opt.value = tipo;
    opt.textContent = tipo;
    examTypeSelect.appendChild(opt);
  });

  // Llenar categorías de alimentos en seguimiento
  const mealCatSelect = document.getElementById('meal-food-category');
  const mealFoodSelect = document.getElementById('meal-food-type');

  if (typeof ALIMENTOS_CATEGORIAS !== 'undefined') {
    Object.keys(ALIMENTOS_CATEGORIAS).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      mealCatSelect.appendChild(opt);
    });

    // Al cambiar categoría, llenar alimentos de esa categoría
    mealCatSelect.addEventListener('change', (e) => {
      const catKey = e.target.value;
      const catData = ALIMENTOS_CATEGORIAS[catKey];
      mealFoodSelect.innerHTML = '<option value="" disabled selected>Selecciona alimento...</option>';
      if (catData) {
        Object.keys(catData.items).forEach(alimento => {
          const opt = document.createElement('option');
          opt.value = alimento;
          const kcal = catData.items[alimento];
          opt.textContent = kcal > 0 ? `${alimento} (${kcal} kcal/100g)` : alimento;
          mealFoodSelect.appendChild(opt);
        });
        mealFoodSelect.disabled = false;
      }
      // Reset food selection y custom kcal
      document.getElementById('custom-kcal-group').classList.add('hidden');
    });
  } else {
    // Fallback si ALIMENTOS_CATEGORIAS no existe
    Object.keys(ALIMENTOS_CALORIAS).forEach(alimento => {
      const opt = document.createElement('option');
      opt.value = alimento;
      opt.textContent = `${alimento} (${ALIMENTOS_CALORIAS[alimento]} kcal/100g)`;
      mealFoodSelect.appendChild(opt);
    });
    mealFoodSelect.disabled = false;
  }

  // Mostrar/ocultar campo de calorías custom para "Otro"
  mealFoodSelect.addEventListener('change', (e) => {
    const customGroup = document.getElementById('custom-kcal-group');
    if (customGroup) {
      customGroup.classList.toggle('hidden', e.target.value !== 'Otro');
    }
  });

  // Hora actual para meal-time
  const now = new Date();
  document.getElementById('meal-time').value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  // Renderizar referencias y glosario
  renderizarReferencias();
  renderizarGlosario();

  // Renderizar dashboard
  renderizarMascotas();
  actualizarDashboard();

  // Verificar recordatorios periódicamente
  setInterval(verificarRecordatorios, 60000);
  verificarRecordatorios();
}

// ==================== ALMACENAMIENTO ====================
async function guardarDatos() {
  try {
    localStorage.setItem('petcare_data', JSON.stringify(estado));
  } catch(e) {
    mostrarToast('Error al guardar datos', 'error');
  }
  // También guardar en Firestore si está disponible
  if (typeof guardarDatosFirestore === 'function' && typeof auth !== 'undefined' && auth.currentUser) {
    isSaving = true;
    try {
      await guardarDatosFirestore(estado);
    } catch(e) {
      console.error('Error Firestore:', e);
    } finally {
      isSaving = false;
    }
  }
}

function cargarDatos() {
  try {
    const saved = localStorage.getItem('petcare_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      estado = { ...estado, ...parsed };
    }
  } catch(e) {
    mostrarToast('Error al cargar datos', 'error');
  }
}

function exportarDatos() {
  const dataStr = JSON.stringify(estado, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petcare_backup_${fechaHoy()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Datos exportados correctamente', 'success');
}

function importarDatos(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.mascotas) {
        estado = { ...estado, ...imported };
        guardarDatos();
        renderizarMascotas();
        actualizarDashboard();
        mostrarToast('Datos importados correctamente', 'success');
      } else {
        mostrarToast('Archivo no válido', 'error');
      }
    } catch(err) {
      mostrarToast('Error al leer el archivo', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function limpiarTodo() {
  mostrarConfirmacion(
    'Limpiar todos los datos',
    '¿Estás seguro? Se eliminarán TODOS los datos de todas las mascotas. Esta acción no se puede deshacer.',
    () => {
      mostrarConfirmacion(
        'Confirmar eliminación',
        'Esta es la segunda confirmación. ¿Realmente deseas eliminar todo?',
        () => {
          estado = {
            mascotas: [],
            mascotaActiva: null,
            examenes: {},
            comidas: {},
            agua: {},
            pesos: {},
            recordatorios: {},
            visitas: {},
            frecuenciaAlimentacion: {},
            checklists: {},
            tema: estado.tema,
            veterinariasFavoritas: []
          };
          guardarDatos();
          renderizarMascotas();
          actualizarDashboard();
          mostrarToast('Todos los datos han sido eliminados', 'info');
        }
      );
    }
  );
}

// ==================== NAVEGACIÓN ====================
function navegarA(seccion) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${seccion}`).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navLink = document.querySelector(`.nav-link[data-section="${seccion}"]`);
  if (navLink) navLink.classList.add('active');

  // Actualizar contenido según sección
  switch(seccion) {
    case 'dashboard': actualizarDashboard(); break;
    case 'mascotas': renderizarMascotas(); break;
    case 'examenes': renderizarExamenes(); break;
    case 'nutricion': renderizarNutricion(); break;
    case 'seguimiento': renderizarSeguimiento(); break;
    case 'recordatorios': renderizarRecordatorios(); break;
    case 'calendario': renderizarCalendario(); break;
    case 'veterinarias': renderizarVeterinariasLocal(); renderizarFavoritos(); break;
    case 'checklists': renderizarChecklists(); break;
    case 'cuenta': renderizarCuenta(); break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebar-overlay').classList.toggle('active', open);
}

// ==================== TEMA ====================
function toggleTema() {
  estado.tema = estado.tema === 'light' ? 'dark' : 'light';
  aplicarTema(estado.tema);
  guardarDatos();
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  const icon = document.querySelector('#theme-toggle i');
  icon.className = tema === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  document.getElementById('dark-mode-toggle').checked = tema === 'dark';
}

// ==================== TAMAÑO DE FUENTE ====================
function cambiarTamanoFuente(size) {
  const sizes = { small: '14px', normal: '16px', large: '18px' };
  document.documentElement.style.fontSize = sizes[size] || sizes.normal;
  estado.tamanoFuente = size;
  guardarDatos();
}

function aplicarTamanoFuente() {
  const size = estado.tamanoFuente || 'normal';
  const sizes = { small: '14px', normal: '16px', large: '18px' };
  document.documentElement.style.fontSize = sizes[size] || sizes.normal;
  const select = document.getElementById('font-size-select');
  if (select) select.value = size;
}

// ==================== NOTIFICACIONES ====================
function toggleNotificaciones(tipo, activo) {
  if (!estado.notificaciones) estado.notificaciones = { recordatorios: true, examenes: true };
  estado.notificaciones[tipo] = activo;
  guardarDatos();
  mostrarToast(`Notificaciones de ${tipo} ${activo ? 'activadas' : 'desactivadas'}`, 'info');
}

function aplicarNotificaciones() {
  const notif = estado.notificaciones || { recordatorios: true, examenes: true };
  const remToggle = document.getElementById('notif-reminders-toggle');
  const examToggle = document.getElementById('notif-exams-toggle');
  if (remToggle) remToggle.checked = notif.recordatorios !== false;
  if (examToggle) examToggle.checked = notif.examenes !== false;
}

// ==================== MI CUENTA ====================
function renderizarCuenta() {
  const container = document.getElementById('cuenta-info');
  if (!container) return;

  const user = typeof obtenerUsuarioActual === 'function' ? obtenerUsuarioActual() : null;
  if (user) {
    container.innerHTML = `
      <div class="cuenta-user-info">
        <div class="cuenta-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="cuenta-details">
          <div class="cuenta-name-row">
            <p class="cuenta-name" id="cuenta-display-name">${escapeHtml(user.displayName || 'Sin nombre')}</p>
            <button class="btn-icon btn-sm" onclick="mostrarEditarNombre()" title="Editar nombre"><i class="fas fa-pen"></i></button>
          </div>
          <div id="cuenta-edit-name" class="cuenta-edit-name hidden">
            <input type="text" id="cuenta-name-input" value="${escapeHtml(user.displayName || '')}" placeholder="Tu nombre" maxlength="50">
            <button class="btn btn-sm btn-primary" onclick="guardarNombre()"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-outline" onclick="cancelarEditarNombre()"><i class="fas fa-times"></i></button>
          </div>
          <p class="cuenta-email"><i class="fas fa-envelope"></i> ${escapeHtml(user.email || '')}</p>
          <p class="cuenta-since"><i class="fas fa-calendar"></i> Miembro desde ${user.metadata && user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('es-CO') : 'N/A'}</p>
        </div>
      </div>
      <div style="margin-top:1rem">
        <p style="font-size:0.85rem;color:var(--text-secondary)">
          <i class="fas fa-paw"></i> ${estado.mascotas.length} mascota${estado.mascotas.length !== 1 ? 's' : ''} registrada${estado.mascotas.length !== 1 ? 's' : ''}
        </p>
      </div>`;
  } else {
    container.innerHTML = `
      <p class="empty-list"><i class="fas fa-info-circle"></i> Sesión no iniciada o modo offline.</p>
      <div style="margin-top:1rem">
        <p style="font-size:0.85rem;color:var(--text-secondary)">
          <i class="fas fa-paw"></i> ${estado.mascotas.length} mascota${estado.mascotas.length !== 1 ? 's' : ''} registrada${estado.mascotas.length !== 1 ? 's' : ''}
        </p>
      </div>`;
  }
}

function mostrarEditarNombre() {
  document.getElementById('cuenta-display-name').parentElement.classList.add('hidden');
  document.getElementById('cuenta-edit-name').classList.remove('hidden');
  const input = document.getElementById('cuenta-name-input');
  input.focus();
  input.select();
}

function cancelarEditarNombre() {
  document.getElementById('cuenta-display-name').parentElement.classList.remove('hidden');
  document.getElementById('cuenta-edit-name').classList.add('hidden');
}

async function guardarNombre() {
  const input = document.getElementById('cuenta-name-input');
  const nuevoNombre = input.value.trim();
  if (!nuevoNombre) {
    mostrarToast('El nombre no puede estar vacío', 'error');
    return;
  }

  const user = typeof obtenerUsuarioActual === 'function' ? obtenerUsuarioActual() : null;
  if (!user) {
    mostrarToast('No se pudo obtener el usuario', 'error');
    return;
  }

  try {
    await user.updateProfile({ displayName: nuevoNombre });
    // Actualizar en Firestore también
    if (typeof db !== 'undefined') {
      await db.collection('users').doc(user.uid).update({ nombre: nuevoNombre });
    }
    // Actualizar header
    const nameEl = document.getElementById('user-display-name');
    if (nameEl) nameEl.textContent = nuevoNombre;
    mostrarToast('Nombre actualizado correctamente', 'success');
    renderizarCuenta();
  } catch (error) {
    console.error('Error actualizando nombre:', error);
    mostrarToast('Error al actualizar el nombre', 'error');
  }
}

async function solicitarCambioContrasena() {
  const user = typeof obtenerUsuarioActual === 'function' ? obtenerUsuarioActual() : null;
  if (!user || !user.email) {
    mostrarToast('No se pudo obtener el correo del usuario', 'error');
    return;
  }
  if (typeof recuperarContrasena === 'function') {
    const result = await recuperarContrasena(user.email);
    if (result.success) {
      mostrarToast('Se envió un enlace para cambiar la contraseña a tu correo', 'success');
    } else {
      mostrarToast(result.error || 'Error al enviar el correo', 'error');
    }
  } else {
    mostrarToast('Función no disponible en modo offline', 'error');
  }
}

// ==================== MASCOTAS - CRUD ====================
function mostrarFormularioMascota(id) {
  const container = document.getElementById('pet-form-container');
  const form = document.getElementById('pet-form');
  form.reset();
  document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));

  if (id) {
    const pet = estado.mascotas.find(p => p.id === id);
    if (!pet) return;
    document.getElementById('pet-form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Mascota';
    document.getElementById('pet-edit-id').value = id;
    document.getElementById('pet-name').value = pet.nombre;
    document.getElementById('pet-photo').value = pet.foto || '';
    document.getElementById('pet-species').value = pet.especie;
    actualizarRazas();
    document.getElementById('pet-breed').value = pet.raza;
    document.getElementById('pet-age-years').value = pet.edadAnios;
    document.getElementById('pet-age-months').value = pet.edadMeses;
    document.getElementById('pet-weight').value = pet.peso;
    document.getElementById('pet-gender').value = pet.genero;
    const condRadio = document.querySelector(`input[name="pet-condition"][value="${pet.condicion}"]`);
    if (condRadio) condRadio.checked = true;
    document.getElementById('pet-activity').value = pet.actividad;
    document.getElementById('pet-city').value = pet.ciudad || '';
    document.getElementById('pet-country').value = pet.pais || '';
    document.getElementById('pet-conditions').value = pet.condicionesSalud || '';
    document.querySelectorAll('input[name="pet-allergy"]').forEach(cb => {
      cb.checked = (pet.alergias || []).includes(cb.value);
    });
  } else {
    document.getElementById('pet-form-title').innerHTML = '<i class="fas fa-paw"></i> Registrar Mascota';
    document.getElementById('pet-edit-id').value = '';
  }

  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth' });
}

function cerrarFormularioMascota() {
  document.getElementById('pet-form-container').classList.add('hidden');
}

function actualizarRazas() {
  const especie = document.getElementById('pet-species').value;
  const breedSelect = document.getElementById('pet-breed');
  breedSelect.innerHTML = '<option value="">Seleccionar raza...</option>';
  breedSelect.disabled = !especie;

  if (especie && RAZAS[especie]) {
    RAZAS[especie].forEach(raza => {
      const opt = document.createElement('option');
      opt.value = raza.nombre;
      opt.textContent = raza.nombre;
      breedSelect.appendChild(opt);
    });
  }
}

async function guardarMascota(e) {
  e.preventDefault();
  if (!validarFormularioMascota()) return;

  const editId = document.getElementById('pet-edit-id').value;
  const alergias = [];
  document.querySelectorAll('input[name="pet-allergy"]:checked').forEach(cb => alergias.push(cb.value));
  const condicion = document.querySelector('input[name="pet-condition"]:checked');

  const mascota = {
    id: editId || generarId(),
    nombre: document.getElementById('pet-name').value.trim(),
    foto: document.getElementById('pet-photo').value.trim(),
    especie: document.getElementById('pet-species').value,
    raza: document.getElementById('pet-breed').value,
    edadAnios: parseInt(document.getElementById('pet-age-years').value) || 0,
    edadMeses: parseInt(document.getElementById('pet-age-months').value) || 0,
    peso: parseFloat(document.getElementById('pet-weight').value),
    genero: document.getElementById('pet-gender').value,
    condicion: condicion ? condicion.value : '3',
    actividad: document.getElementById('pet-activity').value,
    ciudad: document.getElementById('pet-city').value.trim(),
    pais: document.getElementById('pet-country').value.trim(),
    condicionesSalud: document.getElementById('pet-conditions').value.trim(),
    alergias: alergias,
    fechaRegistro: editId ? (estado.mascotas.find(p => p.id === editId)?.fechaRegistro || fechaHoy()) : fechaHoy()
  };

  // Subir foto a Firebase Storage si hay archivo pendiente
  if (currentPhotoFile && mascota.foto === '__pending_upload__') {
    try {
      if (typeof subirFotoMascota === 'function' && typeof auth !== 'undefined' && auth.currentUser) {
        const progressEl = document.getElementById('photo-upload-progress');
        const progressBar = document.getElementById('photo-progress-bar');
        const progressText = document.getElementById('photo-progress-text');
        progressEl.classList.remove('hidden');
        document.getElementById('photo-preview').classList.add('hidden');

        const { urlFoto, urlThumb } = await subirFotoMascota(currentPhotoFile, mascota.id, (progress) => {
          progressBar.style.width = `${progress}%`;
          progressText.textContent = `Subiendo... ${Math.round(progress)}%`;
        });

        mascota.foto = urlFoto;
        mascota.fotoThumb = urlThumb;
        progressEl.classList.add('hidden');
        currentPhotoFile = null;
      } else {
        // Fallback: guardar como base64 si no hay Firebase Storage
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(currentPhotoFile);
        });
        mascota.foto = dataUrl;
        currentPhotoFile = null;
      }
    } catch (err) {
      console.error('Error subiendo foto:', err);
      mostrarToast('Error al subir la foto, se guardó localmente', 'warning');
      mascota.foto = document.getElementById('photo-preview-img').src || '';
      currentPhotoFile = null;
    }
  }

  if (editId) {
    const idx = estado.mascotas.findIndex(p => p.id === editId);
    if (idx !== -1) estado.mascotas[idx] = mascota;
    mostrarToast('Mascota actualizada correctamente', 'success');
  } else {
    if (estado.mascotas.length >= 5) {
      mostrarToast('Máximo 5 mascotas permitidas', 'warning');
      return;
    }
    estado.mascotas.push(mascota);
    if (!estado.mascotaActiva) estado.mascotaActiva = mascota.id;
    // Inicializar estructuras
    estado.examenes[mascota.id] = [];
    estado.comidas[mascota.id] = {};
    estado.agua[mascota.id] = {};
    estado.pesos[mascota.id] = [];
    estado.recordatorios[mascota.id] = [];
    estado.visitas[mascota.id] = [];
    mostrarToast('Mascota registrada correctamente', 'success');
  }

  guardarDatos();
  cerrarFormularioMascota();
  renderizarMascotas();
  actualizarDashboard();
}

function validarFormularioMascota() {
  let valido = true;
  const campos = [
    { id: 'pet-name', tipo: 'text' },
    { id: 'pet-species', tipo: 'select' },
    { id: 'pet-breed', tipo: 'select' },
    { id: 'pet-age-years', tipo: 'number' },
    { id: 'pet-weight', tipo: 'number' },
    { id: 'pet-gender', tipo: 'select' },
    { id: 'pet-activity', tipo: 'select' }
  ];

  campos.forEach(campo => {
    const el = document.getElementById(campo.id);
    const group = el.closest('.form-group');
    if (!el.value || el.value.trim() === '') {
      if (group) group.classList.add('error');
      valido = false;
    } else {
      if (group) group.classList.remove('error');
    }
  });

  // Condición corporal
  const condicion = document.querySelector('input[name="pet-condition"]:checked');
  const condGroup = document.querySelector('.body-condition-selector')?.closest('.form-group');
  if (!condicion) {
    if (condGroup) condGroup.classList.add('error');
    valido = false;
  } else {
    if (condGroup) condGroup.classList.remove('error');
  }

  return valido;
}

function activarMascota(id) {
  estado.mascotaActiva = id;
  guardarDatos();
  renderizarMascotas();
  actualizarDashboard();
  mostrarToast('Perfil activo cambiado', 'info');
}

function eliminarMascota(id) {
  const pet = estado.mascotas.find(p => p.id === id);
  if (!pet) return;
  mostrarConfirmacion(
    'Eliminar mascota',
    `¿Estás seguro de eliminar a "${pet.nombre}"? Se perderán todos sus datos.`,
    () => {
      estado.mascotas = estado.mascotas.filter(p => p.id !== id);
      delete estado.examenes[id];
      delete estado.comidas[id];
      delete estado.agua[id];
      delete estado.pesos[id];
      delete estado.recordatorios[id];
      delete estado.visitas[id];
      if (estado.mascotaActiva === id) {
        estado.mascotaActiva = estado.mascotas.length > 0 ? estado.mascotas[0].id : null;
      }
      guardarDatos();
      renderizarMascotas();
      actualizarDashboard();
      mostrarToast('Mascota eliminada', 'info');
    }
  );
}

function renderizarMascotas() {
  const grid = document.getElementById('pets-grid');
  const btnAdd = document.getElementById('btn-add-pet');
  const maxWarning = document.getElementById('max-pets-warning');

  grid.innerHTML = '';

  estado.mascotas.forEach(pet => {
    const isActive = pet.id === estado.mascotaActiva;
    const avatarSrc = pet.foto || '';
    const avatarHtml = avatarSrc
      ? `<img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(pet.nombre)}" class="pet-avatar" onerror="this.outerHTML='<div class=\\'pet-avatar pet-default-avatar\\'><i class=\\'fas fa-${pet.especie === 'gato' ? 'cat' : 'dog'}\\'></i></div>'">`
      : `<div class="pet-avatar pet-default-avatar"><i class="fas fa-${pet.especie === 'gato' ? 'cat' : 'dog'}"></i></div>`;

    const card = document.createElement('div');
    card.className = `pet-card ${isActive ? 'active' : ''}`;
    card.innerHTML = `
      ${avatarHtml}
      <div class="pet-card-info" onclick="activarMascota('${pet.id}')">
        <h4>${escapeHtml(pet.nombre)} ${isActive ? '<i class="fas fa-star" style="color:var(--warning);font-size:0.8rem"></i>' : ''}</h4>
        <p>${pet.especie === 'perro' ? '🐕' : '🐈'} ${escapeHtml(pet.raza)} · ${pet.edadAnios}a ${pet.edadMeses}m · ${pet.peso}kg</p>
      </div>
      <div class="pet-card-actions">
        <button class="btn-icon btn-sm" onclick="event.stopPropagation();mostrarFormularioMascota('${pet.id}')" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="btn-icon btn-sm" onclick="event.stopPropagation();eliminarMascota('${pet.id}')" title="Eliminar"><i class="fas fa-trash" style="color:var(--danger)"></i></button>
      </div>
    `;
    grid.appendChild(card);
  });

  btnAdd.classList.toggle('hidden', estado.mascotas.length >= 5);
  maxWarning.classList.toggle('hidden', estado.mascotas.length < 5);

  actualizarHeaderPet();
}

function actualizarHeaderPet() {
  const badge = document.getElementById('active-pet-badge');
  const pet = obtenerMascotaActiva();
  if (pet) {
    badge.classList.remove('hidden');
    const img = document.getElementById('header-pet-photo');
    if (pet.foto) {
      img.src = pet.foto;
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }
    document.getElementById('header-pet-name').textContent = pet.nombre;
  } else {
    badge.classList.add('hidden');
  }
}

function obtenerMascotaActiva() {
  return estado.mascotas.find(p => p.id === estado.mascotaActiva) || null;
}

// ==================== DASHBOARD ====================
function actualizarDashboard() {
  const pet = obtenerMascotaActiva();
  const noPets = document.getElementById('no-pets-message');
  const content = document.getElementById('dashboard-content');

  if (!pet) {
    noPets.classList.remove('hidden');
    content.classList.add('hidden');
    return;
  }

  noPets.classList.add('hidden');
  content.classList.remove('hidden');

  // Info mascota activa
  const dashPhoto = document.getElementById('dash-pet-photo');
  if (pet.foto) {
    dashPhoto.src = pet.foto;
    dashPhoto.style.display = 'block';
    dashPhoto.onerror = () => { dashPhoto.style.display = 'none'; };
  } else {
    dashPhoto.style.display = 'none';
  }
  document.getElementById('dash-pet-name').textContent = pet.nombre;
  document.getElementById('dash-pet-info').textContent = `${pet.especie === 'perro' ? 'Perro' : 'Gato'} · ${pet.raza} · ${pet.edadAnios}a ${pet.edadMeses}m · ${capitalizarPrimera(pet.genero)}`;
  document.getElementById('dash-pet-weight').textContent = `Peso: ${pet.peso} kg · Actividad: ${capitalizarPrimera(pet.actividad.replace('_',' '))}`;

  // Consejo del día
  const tipIndex = new Date().getDate() % CONSEJOS_DIA.length;
  const tip = CONSEJOS_DIA[tipIndex];
  document.getElementById('daily-tip').innerHTML = `<i class="fas ${tip.icono}" style="font-size:1.5rem;color:var(--warning)"></i> ${tip.texto}`;

  // Resumen nutricional
  const calorias = calcularCaloriasDiarias(pet);
  const hoy = fechaHoy();
  const comidasHoy = (estado.comidas[pet.id]?.[hoy]) || [];
  const calConsumidas = comidasHoy.reduce((sum, c) => sum + c.calorias, 0);
  const pctCal = calorias > 0 ? Math.min((calConsumidas / calorias) * 100, 150) : 0;

  document.getElementById('dash-cal-bar').style.width = `${Math.min(pctCal, 100)}%`;
  document.getElementById('dash-cal-bar').className = `progress-fill ${pctCal > 110 ? 'over' : ''}`;
  document.getElementById('dash-cal-text').textContent = `${Math.round(calConsumidas)} / ${Math.round(calorias)} kcal`;

  const aguaHoy = estado.agua[pet.id]?.[hoy] || 0;
  const aguaReq = pet.peso * 55;
  const pctAgua = aguaReq > 0 ? Math.min((aguaHoy / aguaReq) * 100, 150) : 0;
  document.getElementById('dash-water-bar').style.width = `${Math.min(pctAgua, 100)}%`;
  document.getElementById('dash-water-text').textContent = `${aguaHoy} / ${Math.round(aguaReq)} ml`;

  // Próximos recordatorios
  const reminders = (estado.recordatorios[pet.id] || [])
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 3);
  const reminderList = document.getElementById('dash-reminders');
  if (reminders.length === 0) {
    reminderList.innerHTML = '<li class="empty-list">No hay recordatorios</li>';
  } else {
    reminderList.innerHTML = reminders.map(r => `
      <li>
        <div class="reminder-info">
          <div class="reminder-icon ${r.tipo}"><i class="fas ${iconoRecordatorio(r.tipo)}"></i></div>
          <div class="reminder-text">
            <strong>${capitalizarPrimera(r.tipo)}</strong>
            <span>${r.hora} - ${r.nota || ''}</span>
          </div>
        </div>
      </li>
    `).join('');
  }

  // Últimos exámenes
  const examenes = (estado.examenes[pet.id] || [])
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 2);
  const examList = document.getElementById('dash-exams');
  if (examenes.length === 0) {
    examList.innerHTML = '<li class="empty-list">No hay exámenes registrados</li>';
  } else {
    examList.innerHTML = examenes.map(ex => {
      const hasAbnormal = tieneValoresAnormales(ex, pet.especie);
      return `<li>
        <span>${ex.tipo} - ${formatearFecha(ex.fecha)}</span>
        ${hasAbnormal ? '<span class="exam-value-badge abnormal">Valores fuera de rango</span>' : '<span class="exam-value-badge normal">Normal</span>'}
      </li>`;
    }).join('');
  }

  // Alertas inteligentes del dashboard
  const dashAlertsEl = document.getElementById('dash-smart-alerts');
  if (dashAlertsEl) {
    let alertas = [];
    // Alertas de exámenes
    if (typeof generarAlertasExamenes === 'function') {
      alertas = alertas.concat(generarAlertasExamenes(pet, estado.examenes));
    }
    // Alertas de peso
    if (typeof generarAlertasPeso === 'function') {
      alertas = alertas.concat(generarAlertasPeso(pet, estado.pesos));
    }
    if (alertas.length > 0) {
      dashAlertsEl.innerHTML = alertas.slice(0, 4).map(a => `
        <div class="dash-alert-item alert-${a.tipo}">
          <i class="fas fa-${a.icono}"></i>
          <div>
            <strong>${a.titulo}</strong>
            <p>${a.mensaje}</p>
          </div>
        </div>
      `).join('');
      dashAlertsEl.classList.remove('hidden');
    } else {
      dashAlertsEl.classList.add('hidden');
    }
  }

  // Gráfico de peso (mini)
  renderizarGraficoPesoMini(pet);
}

// ==================== EXÁMENES MÉDICOS ====================
function mostrarFormularioExamen() {
  document.getElementById('exam-form-container').classList.remove('hidden');
  document.getElementById('exam-form').reset();
  document.getElementById('exam-date').value = fechaHoy();
}

function cerrarFormularioExamen() {
  document.getElementById('exam-form-container').classList.add('hidden');
}

async function guardarExamen(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const fecha = document.getElementById('exam-date').value;
  const tipo = document.getElementById('exam-type').value;
  const resultados = document.getElementById('exam-results').value.trim();

  if (!fecha || !tipo || !resultados) {
    mostrarToast('Completa los campos obligatorios', 'warning');
    return;
  }

  let archivoUrl = document.getElementById('exam-file').value.trim();

  // Subir PDF a Firebase Storage si hay archivo pendiente
  if (currentPDFFile && archivoUrl === '__pending_upload__') {
    try {
      if (typeof subirPDFExamen === 'function' && typeof auth !== 'undefined' && auth.currentUser) {
        const progressEl = document.getElementById('pdf-upload-progress');
        const progressBar = document.getElementById('pdf-progress-bar');
        const progressText = document.getElementById('pdf-progress-text');
        progressEl.classList.remove('hidden');
        document.getElementById('pdf-preview').classList.add('hidden');

        const result = await subirPDFExamen(currentPDFFile, pet.id, (progress) => {
          progressBar.style.width = `${progress}%`;
          progressText.textContent = `Subiendo PDF... ${Math.round(progress)}%`;
        });

        archivoUrl = result.url;
        progressEl.classList.add('hidden');
        currentPDFFile = null;
      } else {
        archivoUrl = '';
        mostrarToast('Firebase Storage no disponible, PDF no se subió', 'warning');
        currentPDFFile = null;
      }
    } catch (err) {
      console.error('Error subiendo PDF:', err);
      archivoUrl = '';
      mostrarToast('Error al subir el PDF', 'warning');
      currentPDFFile = null;
    }
  }

  // Recoger valores dinámicamente del contenedor
  const valoresDinamicos = {};
  document.querySelectorAll('#exam-extracted-values input[data-param-key]').forEach(input => {
    const key = input.dataset.paramKey;
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      valoresDinamicos[key] = val;
    }
  });

  const examen = {
    id: generarId(),
    fecha,
    tipo,
    veterinario: document.getElementById('exam-vet').value.trim(),
    resultados,
    valores: valoresDinamicos,
    observaciones: document.getElementById('exam-observations').value.trim(),
    archivo: archivoUrl,
    ajusteNutricional: document.getElementById('exam-nutrition-adjust').checked
  };

  if (!estado.examenes[pet.id]) estado.examenes[pet.id] = [];
  estado.examenes[pet.id].push(examen);

  // Análisis inteligente del examen
  if (typeof analyzeExam === 'function') {
    const analisis = analyzeExam(examen, pet);
    if (analisis && analisis.alertas && analisis.alertas.length > 0) {
      const alertasUrgentes = analisis.alertas.filter(a => a.tipo === 'danger');
      if (alertasUrgentes.length > 0) {
        mostrarToast('Se detectaron valores que requieren atención urgente', 'warning');
      }
    }
    // Generar recordatorios condicionales
    if (typeof generarRecordatoriosCondicionales === 'function') {
      const recsCondicionales = generarRecordatoriosCondicionales(analisis, pet);
      if (recsCondicionales.length > 0) {
        if (!estado.recordatorios[pet.id]) estado.recordatorios[pet.id] = [];
        recsCondicionales.forEach(rec => {
          estado.recordatorios[pet.id].push({
            id: generarId(),
            tipo: rec.tipo || 'veterinario',
            hora: rec.hora || '09:00',
            fecha: rec.fecha || '',
            repetir: rec.repetir || 'unico',
            nota: rec.nota || rec.mensaje,
            alarma: true,
            activo: true,
            autoGenerado: true
          });
        });
      }
    }
  }

  const submitBtn = document.querySelector('#exam-form button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  await guardarDatos();
  if (submitBtn) submitBtn.disabled = false;
  cerrarFormularioExamen();
  renderizarExamenes();
  mostrarToast('Examen registrado correctamente', 'success');
}

function renderizarExamenes() {
  const pet = obtenerMascotaActiva();
  document.getElementById('exam-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('exam-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  const examenes = (estado.examenes[pet.id] || []).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const listEl = document.getElementById('exam-list');

  // Alerta si han pasado más de 12 meses sin exámenes
  const alertEl = document.getElementById('exam-alert');
  if (examenes.length === 0) {
    alertEl.classList.remove('hidden');
    document.getElementById('exam-alert-text').textContent = 'No hay exámenes registrados. Se recomienda realizar un chequeo completo.';
  } else {
    const ultimo = new Date(examenes[0].fecha);
    const diffMeses = (new Date() - ultimo) / (1000 * 60 * 60 * 24 * 30);
    if (diffMeses > 12) {
      alertEl.classList.remove('hidden');
      document.getElementById('exam-alert-text').textContent = `Han pasado más de 12 meses desde el último examen (${formatearFecha(examenes[0].fecha)}). Se recomienda un chequeo.`;
    } else {
      alertEl.classList.add('hidden');
    }
  }

  if (examenes.length === 0) {
    listEl.innerHTML = '<div class="empty-state"><p>No hay exámenes registrados</p></div>';
    return;
  }

  const refs = (typeof RANGOS_REFERENCIA !== 'undefined' ? RANGOS_REFERENCIA : {})[pet.especie] || {};
  listEl.innerHTML = examenes.map(ex => {
    const badges = [];
    const valoresKeys = Object.keys(ex.valores || {});
    // Normalizar key viejo proteinas -> proteinastotales
    const normalizeKey = k => k === 'proteinas' ? 'proteinastotales' : k;
    valoresKeys.forEach(key => {
      const val = ex.valores[key];
      const nk = normalizeKey(key);
      if (val !== null && val !== undefined && refs[nk]) {
        const ref = refs[nk];
        const isNormal = val >= ref.min && val <= ref.max;
        const label = (ref.nombre || nk).split(' ')[0];
        badges.push(`<span class="exam-value-badge ${isNormal ? 'normal' : 'abnormal'}">${label}: ${val} ${ref.unit || ''} ${isNormal ? '✓' : '⚠'}</span>`);
      } else if (val !== null && val !== undefined) {
        const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG[nk] : null;
        const label = catalog ? catalog.nombre.split(' ')[0] : nk;
        const unit = catalog ? catalog.unit : '';
        badges.push(`<span class="exam-value-badge sin_referencia">${label}: ${val} ${unit}</span>`);
      }
    });
    // Limitar badges visibles
    const maxBadges = 6;
    let badgesHtml = '';
    if (badges.length > maxBadges) {
      badgesHtml = badges.slice(0, maxBadges).join('') + `<span class="exam-value-badge more">+${badges.length - maxBadges} más</span>`;
    } else {
      badgesHtml = badges.join('');
    }

    // Análisis inteligente del examen
    let analysisHtml = '';
    if (typeof analyzeExam === 'function') {
      const analisis = analyzeExam(ex, pet);
      if (analisis) {
        const comparacion = typeof compararConAnterior === 'function' ? compararConAnterior(ex, estado.examenes, pet.id) : null;
        if (typeof renderizarAnalisisExamen === 'function') {
          analysisHtml = `
            <div class="exam-analysis-panel">
              <button class="btn btn-sm btn-outline" onclick="this.nextElementSibling.classList.toggle('hidden');this.innerHTML=this.nextElementSibling.classList.contains('hidden')?'<i class=\\'fas fa-microscope\\'></i> Ver Análisis Inteligente':'<i class=\\'fas fa-times\\'></i> Ocultar Análisis'">
                <i class="fas fa-microscope"></i> Ver Análisis Inteligente
              </button>
              <div class="hidden" style="margin-top:0.75rem">
                ${renderizarAnalisisExamen(analisis, comparacion)}
              </div>
            </div>`;
        }
      }
    }

    const tieneValores = ex.valores && Object.values(ex.valores).some(v => v !== null && v !== undefined);

    return `
      <div class="exam-card" id="exam-card-${ex.id}">
        <div class="exam-card-header">
          <div>
            <h4>${escapeHtml(ex.tipo)}</h4>
            ${ex.veterinario ? `<small>Dr(a). ${escapeHtml(ex.veterinario)}</small>` : ''}
          </div>
          <div style="text-align:right">
            <span class="exam-date">${formatearFecha(ex.fecha)}</span>
            ${ex.ajusteNutricional ? '<br><span class="exam-nutrition-flag"><i class="fas fa-exclamation-triangle"></i> Ajuste nutricional</span>' : ''}
          </div>
        </div>
        <p style="font-size:0.85rem">${escapeHtml(ex.resultados)}</p>
        ${badges.length > 0 ? `<div class="exam-values">${badgesHtml}</div>` : ''}
        ${ex.observaciones ? `<p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem"><strong>Obs:</strong> ${escapeHtml(ex.observaciones)}</p>` : ''}
        ${ex.archivo ? `<button class="btn btn-sm btn-outline" onclick="verPDF('${escapeHtml(ex.archivo)}')" style="margin-top:0.5rem"><i class="fas fa-file-pdf"></i> Ver PDF</button>` : ''}
        ${analysisHtml}
        <div style="margin-top:0.5rem;display:flex;gap:0.5rem;justify-content:flex-end;flex-wrap:wrap">
          <button class="btn btn-sm btn-outline" onclick="editarValoresExamen('${pet.id}','${ex.id}')"><i class="fas fa-edit"></i> ${tieneValores ? 'Editar valores' : 'Ingresar valores'}</button>
          <button class="btn btn-sm btn-secondary" onclick="eliminarExamen('${pet.id}','${ex.id}')"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

function eliminarExamen(petId, examId) {
  mostrarConfirmacion('Eliminar examen', '¿Eliminar este examen?', async () => {
    estado.examenes[petId] = (estado.examenes[petId] || []).filter(e => e.id !== examId);
    await guardarDatos();
    renderizarExamenes();
    mostrarToast('Examen eliminado', 'info');
  });
}

function editarValoresExamen(petId, examId) {
  const examen = (estado.examenes[petId] || []).find(e => e.id === examId);
  if (!examen) return;
  if (!examen.valores) examen.valores = {};

  const editDiv = document.getElementById(`edit-valores-${examId}`);
  if (editDiv) {
    editDiv.classList.toggle('hidden');
    return;
  }

  // Crear formulario inline de edición
  const container = document.getElementById(`exam-card-${examId}`);
  if (!container) return;

  // Generar campos dinámicos desde los valores existentes del examen
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const valores = examen.valores || {};
  // Normalizar proteinas -> proteinastotales
  const valoresNorm = {};
  Object.keys(valores).forEach(k => {
    const nk = k === 'proteinas' ? 'proteinastotales' : k;
    valoresNorm[nk] = valores[k];
  });

  let fieldsHtml = '';
  Object.keys(valoresNorm).forEach(key => {
    const val = valoresNorm[key];
    const info = catalog[key] || {};
    const nombre = info.nombre || key;
    const unit = info.unit || '';
    const step = info.step || 0.1;
    fieldsHtml += `
      <div class="form-group" style="margin-bottom:0">
        <label style="font-size:0.75rem">${nombre} (${unit})</label>
        <input type="number" step="${step}" data-param-key="${key}" value="${val !== null && val !== undefined ? val : ''}" class="form-control edit-param-input" style="padding:0.4rem">
      </div>`;
  });

  const formHtml = `
    <div id="edit-valores-${examId}" class="exam-edit-valores" style="margin-top:0.75rem;padding:0.75rem;background:var(--bg-secondary);border-radius:8px">
      <h5 style="margin-bottom:0.5rem"><i class="fas fa-edit"></i> Editar valores del examen</h5>
      <div id="edit-grid-${examId}" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.5rem">
        ${fieldsHtml}
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="agregarParametroEdicion('${examId}')" style="margin-top:8px">
        <i class="fas fa-plus"></i> Agregar parámetro
      </button>
      <div style="margin-top:0.5rem;display:flex;gap:0.5rem">
        <button class="btn btn-sm btn-primary" onclick="guardarValoresEditados('${petId}','${examId}')"><i class="fas fa-save"></i> Guardar</button>
        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('edit-valores-${examId}').remove()"><i class="fas fa-times"></i> Cancelar</button>
      </div>
    </div>`;

  container.insertAdjacentHTML('beforeend', formHtml);
}

async function guardarValoresEditados(petId, examId) {
  const examen = (estado.examenes[petId] || []).find(e => e.id === examId);
  if (!examen) return;

  const nuevosValores = {};
  document.querySelectorAll(`#edit-valores-${examId} input[data-param-key]`).forEach(input => {
    const key = input.dataset.paramKey;
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      nuevosValores[key] = val;
    }
  });
  examen.valores = nuevosValores;

  await guardarDatos();
  renderizarExamenes();
  mostrarToast('Valores actualizados. Análisis recalculado.', 'success');
}

function tieneValoresAnormales(examen, especie) {
  const refs = (typeof RANGOS_REFERENCIA !== 'undefined' ? RANGOS_REFERENCIA : {})[especie] || {};
  if (!refs || !examen.valores) return false;
  return Object.keys(examen.valores).some(key => {
    const val = examen.valores[key];
    if (val === null || val === undefined) return false;
    const nk = key === 'proteinas' ? 'proteinastotales' : key;
    const ref = refs[nk];
    if (!ref) return false;
    return val < ref.min || val > ref.max;
  });
}

// ==================== PLAN NUTRICIONAL ====================
function calcularCaloriasDiarias(pet) {
  if (!pet) return 0;
  // RER = 70 × (peso)^0.75
  const rer = 70 * Math.pow(pet.peso, 0.75);
  const factorActividad = FACTORES_ACTIVIDAD[pet.actividad] || 1.4;
  let calorias = rer * factorActividad;

  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;

  // Ajustes
  if (edadMeses < 12) calorias *= 1.25; // Cachorro
  if (edadMeses > 84) calorias *= 0.9;  // Senior
  if (pet.genero === 'castrado' || pet.genero === 'esterilizada') calorias *= 0.9;
  if (parseInt(pet.condicion) >= 4) calorias *= 0.8; // Sobrepeso/Obeso

  return calorias;
}

function renderizarNutricion() {
  const pet = obtenerMascotaActiva();
  document.getElementById('nutri-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('nutri-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  const calorias = calcularCaloriasDiarias(pet);
  document.getElementById('nutri-calories').textContent = Math.round(calorias);

  // Detalles del cálculo
  const rer = 70 * Math.pow(pet.peso, 0.75);
  const factorActividad = FACTORES_ACTIVIDAD[pet.actividad] || 1.4;
  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;
  let detalles = `<p>RER base: ${Math.round(rer)} kcal (70 × ${pet.peso}^0.75)</p>`;
  detalles += `<p>Factor actividad (${pet.actividad.replace('_',' ')}): ×${factorActividad}</p>`;
  if (edadMeses < 12) detalles += `<p>Ajuste cachorro: +25%</p>`;
  if (edadMeses > 84) detalles += `<p>Ajuste senior: -10%</p>`;
  if (pet.genero === 'castrado' || pet.genero === 'esterilizada') detalles += `<p>Ajuste castrado/esterilizada: -10%</p>`;
  if (parseInt(pet.condicion) >= 4) detalles += `<p>Ajuste sobrepeso: -20%</p>`;
  document.getElementById('nutri-calorie-details').innerHTML = detalles;

  // Macronutrientes
  const macros = MACRONUTRIENTES[pet.especie];
  const protPct = (macros.proteina.min + macros.proteina.max) / 2;
  const fatPct = (macros.grasa.min + macros.grasa.max) / 2;
  const carbPct = (macros.carbohidratos.min + macros.carbohidratos.max) / 2;

  const protGrams = (calorias * (protPct / 100)) / CALORIAS_POR_GRAMO.proteina;
  const fatGrams = (calorias * (fatPct / 100)) / CALORIAS_POR_GRAMO.grasa;
  const carbGrams = (calorias * (carbPct / 100)) / CALORIAS_POR_GRAMO.carbohidratos;

  document.getElementById('nutri-macros').innerHTML = `
    <p><strong>Proteína:</strong> ${macros.proteina.min}-${macros.proteina.max}% → ~${Math.round(protGrams)}g/día</p>
    <p><strong>Grasa:</strong> ${macros.grasa.min}-${macros.grasa.max}% → ~${Math.round(fatGrams)}g/día</p>
    <p><strong>Carbohidratos:</strong> ${macros.carbohidratos.min}-${macros.carbohidratos.max}% → ~${Math.round(carbGrams)}g/día</p>
  `;

  // Gráfico de macronutrientes
  renderizarGraficoMacros(protPct, fatPct, carbPct);

  // Cantidad diaria
  const calPor100g = 350; // Croquetas estándar
  const gramsDiarios = (calorias / calPor100g) * 100;
  const tazas = gramsDiarios / 240;
  document.getElementById('nutri-daily-amount').innerHTML = `
    <p><strong>Basado en croquetas estándar (~350 kcal/100g):</strong></p>
    <p>Cantidad diaria: <strong>${Math.round(gramsDiarios)} gramos</strong></p>
    <p>Equivale a: <strong>${tazas.toFixed(1)} tazas</strong> (aprox.)</p>
    <p style="font-size:0.8rem;color:var(--text-secondary)">* Ajustar según las calorías específicas del alimento que uses</p>
  `;

  // Frecuencia
  const frecData = FRECUENCIA_ALIMENTACION[pet.especie].find(f => edadMeses >= f.edadMin && edadMeses < f.edadMax);
  const frecGuardada = estado.frecuenciaAlimentacion[pet.id];
  const frecDefault = frecData ? parseInt(frecData.frecuencia) || 2 : 2;
  const frecActual = frecGuardada || frecDefault;

  let frecHtml = `<p>Recomendación por edad: <strong>${frecData ? frecData.frecuencia : '2 veces al día'}</strong> (${frecData ? frecData.nota : 'Adulto'})</p>`;
  frecHtml += `<p>Edad: ${pet.edadAnios} años ${pet.edadMeses} meses (${edadMeses} meses)</p>`;
  frecHtml += `<div class="form-group" style="margin-top:0.75rem">
    <label for="feeding-freq-select">Frecuencia personalizada</label>
    <select id="feeding-freq-select" onchange="cambiarFrecuenciaAlimentacion(this.value)">
      ${[1,2,3,4,5,6].map(n => `<option value="${n}" ${n === frecActual ? 'selected' : ''}>${n} ${n === 1 ? 'vez' : 'veces'} al día</option>`).join('')}
    </select>
  </div>`;

  // Advertencia de digestión
  if (typeof calcularTiempoDigestion === 'function') {
    const digSeco = calcularTiempoDigestion(pet, 'seco');
    if (digSeco && frecActual > 1) {
      const horasEntreComidas = 24 / frecActual;
      if (horasEntreComidas < digSeco.tiempoMin) {
        frecHtml += `<div class="alert alert-warning" style="margin-top:0.75rem">
          <i class="fas fa-exclamation-triangle"></i> Con ${frecActual} comidas al día, hay ~${horasEntreComidas.toFixed(1)}h entre comidas. El tiempo mínimo de digestión es ${digSeco.tiempoMin}h. Considera reducir la frecuencia.
        </div>`;
      }
    }
  }

  document.getElementById('nutri-frequency').innerHTML = frecHtml;

  // Marcas recomendadas
  let categoria = 'adulto';
  if (edadMeses < 12) categoria = 'cachorro';
  else if (edadMeses > 84) categoria = 'senior';
  if (parseInt(pet.condicion) >= 4) categoria = 'sobrepeso';

  const marcas = MARCAS_RECOMENDADAS[pet.especie]?.[categoria] || [];
  document.getElementById('nutri-brands').innerHTML = marcas.map(m =>
    `<li><i class="fas fa-check"></i> ${escapeHtml(m)}</li>`
  ).join('');

  // Advertencias de raza
  const warnings = ADVERTENCIAS_RAZA[pet.raza] || [];
  const warnCard = document.getElementById('nutri-warnings-card');
  if (warnings.length > 0) {
    warnCard.classList.remove('hidden');
    document.getElementById('nutri-warnings').innerHTML = warnings.map(w =>
      `<li><i class="fas fa-exclamation-triangle"></i> ${escapeHtml(w)}</li>`
    ).join('');
  } else {
    warnCard.classList.add('hidden');
  }

  // Alerta exámenes con ajuste nutricional
  const examenesAjuste = (estado.examenes[pet.id] || []).filter(e => e.ajusteNutricional);
  document.getElementById('nutri-exam-alert').classList.toggle('hidden', examenesAjuste.length === 0);

  // Calculadora de porciones
  calcularPorciones();

  // Recomendaciones de alimentos inteligentes
  const foodRecsContainer = document.getElementById('food-recommendations');
  if (foodRecsContainer && typeof recommendFood === 'function') {
    const ultimoExamen = (estado.examenes[pet.id] || []).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    const examResults = ultimoExamen ? ultimoExamen.valores : null;
    const pais = (pet.pais || 'Colombia').toLowerCase().includes('colomb') ? 'colombia' : 'mexico';
    const recomendaciones = recommendFood(pet, examResults, pais);
    if (recomendaciones.length > 0 && typeof renderizarRecomendaciones === 'function') {
      foodRecsContainer.innerHTML = renderizarRecomendaciones(recomendaciones, pet, pais);
    } else {
      foodRecsContainer.innerHTML = '<p class="empty-list">No hay recomendaciones disponibles para esta raza</p>';
    }
  }

  // Tiempo de digestión
  const digestionContainer = document.getElementById('digestion-time');
  if (digestionContainer && typeof calcularTiempoDigestion === 'function') {
    const tiposAlimento = ['seco', 'humedo', 'natural'];
    let digHtml = '<div class="digestion-grid">';
    tiposAlimento.forEach(tipo => {
      const resultado = calcularTiempoDigestion(pet, tipo);
      if (resultado) {
        const tipoLabel = tipo === 'seco' ? 'Alimento Seco' : tipo === 'humedo' ? 'Alimento Húmedo' : 'Alimento Natural';
        const tipoIcon = tipo === 'seco' ? 'fa-cookie' : tipo === 'humedo' ? 'fa-drumstick-bite' : 'fa-leaf';
        digHtml += `
          <div class="digestion-card">
            <div class="digestion-icon"><i class="fas ${tipoIcon}"></i></div>
            <h4>${tipoLabel}</h4>
            <p class="digestion-time">${resultado.tiempoMin} - ${resultado.tiempoMax} horas</p>
            <p class="digestion-detail">${resultado.consejo || 'Esperar entre comidas el tiempo indicado'}</p>
          </div>`;
      }
    });
    digHtml += '</div>';
    digestionContainer.innerHTML = digHtml;
  }

  // Peso ideal dinámico según edad
  const idealWeightContainer = document.getElementById('ideal-weight-info');
  if (idealWeightContainer && typeof predictIdealWeight === 'function') {
    const prediccion = predictIdealWeight(pet.raza, edadMeses);
    if (prediccion) {
      const comp = typeof compareWithPercentiles === 'function' ? compareWithPercentiles(pet.peso, pet.raza, edadMeses) : null;
      const estadoColor = comp ? (comp.estado === 'normal' ? 'var(--success)' : comp.estado === 'sobrepeso' ? 'var(--danger)' : 'var(--warning)') : 'var(--primary)';
      idealWeightContainer.innerHTML = `
        <div class="ideal-weight-display">
          <div class="ideal-weight-range">
            <span class="ideal-label">Peso ideal para ${escapeHtml(pet.raza)} (${prediccion.etapa}):</span>
            <span class="ideal-values">${prediccion.min} - ${prediccion.max} kg</span>
            <span class="ideal-current" style="color:${estadoColor}">Peso actual: ${pet.peso} kg ${comp ? '- ' + comp.mensaje : ''}</span>
          </div>
          ${comp && comp.percentil ? `<small>Percentil ${comp.percentil} para su raza y edad</small>` : ''}
        </div>`;
    }
  }

  // Educación nutricional inline
  renderizarEducacionInline(pet);
}

function renderizarEducacionInline(pet) {
  const container = document.getElementById('education-tips');
  if (!container || !pet) return;

  const edadMeses = (pet.edadAnios * 12) + (pet.edadMeses || 0);
  const info = typeof INFO_RAZA_DETALLADA !== 'undefined' ? INFO_RAZA_DETALLADA[pet.raza] : null;

  let html = '<div class="education-tips">';

  // Tips generales
  html += '<h4><i class="fas fa-apple-alt"></i> Salud Digestiva General</h4><ul>';
  html += '<li>Evita cambios bruscos de alimento; haz transiciones graduales en 7-10 días</li>';
  html += '<li>No alimentar inmediatamente antes o después de ejercicio intenso</li>';
  html += '<li>El agua fresca debe estar siempre disponible</li>';
  html += '<li>Evita dar huesos cocidos: pueden astillarse y causar lesiones internas</li>';
  html += '</ul>';

  // Tips específicos de etapa
  if (edadMeses < 12) {
    html += '<h4><i class="fas fa-baby"></i> Tips para Cachorros</h4><ul>';
    html += '<li>Alimentar con porciones pequeñas y frecuentes para evitar hipoglucemia</li>';
    html += '<li>No dar suplementos de calcio sin prescripción veterinaria</li>';
    html += '<li>Croquetas de cachorro hasta los 12 meses (razas grandes hasta 18 meses)</li>';
    html += '</ul>';
  } else if (edadMeses > 84) {
    html += '<h4><i class="fas fa-heart"></i> Tips para Seniors</h4><ul>';
    html += '<li>Considerar alimento senior con mayor proteína y menos calorías</li>';
    html += '<li>Dividir la comida en porciones más pequeñas y frecuentes</li>';
    html += '<li>Monitorear peso más frecuentemente (cambios pueden indicar problemas de salud)</li>';
    html += '</ul>';
  }

  // Guía de horarios basada en digestión
  if (typeof calcularTiempoDigestion === 'function') {
    const digSeco = calcularTiempoDigestion(pet, 'seco');
    if (digSeco) {
      const frecActual = estado.frecuenciaAlimentacion[pet.id] || 2;
      const horasDisponibles = 14; // Horas activas del día aprox
      html += '<h4><i class="fas fa-clock"></i> Guía de Horarios</h4><ul>';
      html += `<li>Digestión de alimento seco: ${digSeco.tiempoMin}-${digSeco.tiempoMax} horas</li>`;
      if (frecActual >= 2) {
        const intervalo = Math.round(horasDisponibles / frecActual);
        html += `<li>Con ${frecActual} comidas/día: alimentar cada ~${intervalo} horas</li>`;
        html += `<li>Ejemplo: ${generarHorariosEjemplo(frecActual)}</li>`;
      }
      html += '</ul>';
    }
  }

  // Notas de raza
  if (info && info.nutricionEspecifica) {
    html += `<h4><i class="fas fa-dna"></i> Notas para ${escapeHtml(pet.raza)}</h4><ul>`;
    if (info.nutricionEspecifica.nota) {
      html += `<li>${escapeHtml(info.nutricionEspecifica.nota)}</li>`;
    }
    if (info.alimentosEvitar && info.alimentosEvitar.length > 0) {
      html += `<li><strong>Evitar:</strong> ${info.alimentosEvitar.map(a => escapeHtml(a)).join(', ')}</li>`;
    }
    if (info.suplementos && info.suplementos.length > 0) {
      html += `<li><strong>Suplementos recomendados:</strong> ${info.suplementos.map(s => escapeHtml(s)).join(', ')}</li>`;
    }
    html += '</ul>';
  }

  html += '</div>';
  container.innerHTML = html;
}

function generarHorariosEjemplo(frecuencia) {
  const horaInicio = 7;
  const horasDisponibles = 14;
  const intervalo = horasDisponibles / frecuencia;
  const horarios = [];
  for (let i = 0; i < frecuencia; i++) {
    const hora = Math.round(horaInicio + (intervalo * i));
    horarios.push(`${String(hora).padStart(2, '0')}:00`);
  }
  return horarios.join(', ');
}

async function cambiarFrecuenciaAlimentacion(value) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  estado.frecuenciaAlimentacion[pet.id] = parseInt(value) || 2;
  await guardarDatos();
  calcularPorciones();
  renderizarNutricion();
}

function calcularPorciones() {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  const calorias = calcularCaloriasDiarias(pet);
  const calPor100g = parseInt(document.getElementById('portion-food-type').value) || 350;
  const grams = (calorias / calPor100g) * 100;
  const tazas = grams / 240;

  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;
  const frecGuardada = estado.frecuenciaAlimentacion[pet.id];
  let comidas;
  if (frecGuardada) {
    comidas = frecGuardada;
  } else {
    const frecData = FRECUENCIA_ALIMENTACION[pet.especie].find(f => edadMeses >= f.edadMin && edadMeses < f.edadMax);
    comidas = frecData ? parseInt(frecData.frecuencia) || 2 : 2;
  }

  document.getElementById('portion-grams').textContent = `${Math.round(grams)} g`;
  document.getElementById('portion-cups').textContent = `${tazas.toFixed(1)} tazas`;
  document.getElementById('portion-meals').textContent = comidas;
  document.getElementById('portion-per-meal').textContent = `${Math.round(grams / comidas)} g`;
}

// ==================== SEGUIMIENTO DIARIO ====================
function renderizarSeguimiento() {
  const pet = obtenerMascotaActiva();
  document.getElementById('track-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('track-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  const hoy = fechaHoy();
  const calorias = calcularCaloriasDiarias(pet);
  const comidasHoy = estado.comidas[pet.id]?.[hoy] || [];
  const calConsumidas = comidasHoy.reduce((sum, c) => sum + c.calorias, 0);

  // Calorías del día
  document.getElementById('track-cal-consumed').textContent = Math.round(calConsumidas);
  document.getElementById('track-cal-target').textContent = Math.round(calorias);
  const pct = calorias > 0 ? (calConsumidas / calorias) * 100 : 0;
  const progressBar = document.getElementById('track-cal-progress');
  progressBar.style.width = `${Math.min(pct, 100)}%`;
  progressBar.className = `progress-fill ${pct > 110 ? 'over' : pct > 130 ? 'danger' : ''}`;

  const statusEl = document.getElementById('track-cal-status');
  if (pct < 80) {
    statusEl.textContent = `Faltan ${Math.round(calorias - calConsumidas)} kcal`;
    statusEl.style.color = 'var(--primary)';
  } else if (pct <= 110) {
    statusEl.textContent = 'Consumo adecuado ✓';
    statusEl.style.color = 'var(--success)';
  } else {
    statusEl.textContent = `Exceso de ${Math.round(calConsumidas - calorias)} kcal`;
    statusEl.style.color = 'var(--danger)';
  }

  // Lista de comidas de hoy
  const mealListEl = document.getElementById('today-meals');
  if (comidasHoy.length === 0) {
    mealListEl.innerHTML = '<li class="empty-list">No hay comidas registradas hoy</li>';
  } else {
    mealListEl.innerHTML = comidasHoy.map((c, idx) => `
      <li>
        <div class="meal-info">
          <span>${escapeHtml(c.tipo)} ${c.marca ? '(' + escapeHtml(c.marca) + ')' : ''} - ${c.gramos}g</span>
          <span class="meal-time">${c.hora}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span class="meal-calories">${Math.round(c.calorias)} kcal</span>
          <button class="btn-icon btn-sm meal-delete" onclick="eliminarComida('${hoy}',${idx})" title="Eliminar"><i class="fas fa-times"></i></button>
        </div>
      </li>
    `).join('');
  }

  // Hidratación
  const aguaHoy = estado.agua[pet.id]?.[hoy] || 0;
  const aguaReq = pet.peso * 55;
  const pctAgua = aguaReq > 0 ? (aguaHoy / aguaReq) * 100 : 0;
  document.getElementById('track-water-progress').style.width = `${Math.min(pctAgua, 100)}%`;
  document.getElementById('track-water-status').textContent = `${aguaHoy} ml / ${Math.round(aguaReq)} ml (${Math.round(pctAgua)}%)`;

  // Peso - Análisis inteligente
  const pesosArr = estado.pesos[pet.id] || [];
  if (pesosArr.length > 0) {
    const ultimoPeso = pesosArr[pesosArr.length - 1];
    const edadMesesPeso = (pet.edadAnios * 12) + (pet.edadMeses || 0);
    let compHtml = `<p>Último peso registrado: <strong>${ultimoPeso.peso} kg</strong> (${formatearFecha(ultimoPeso.fecha)})</p>`;

    // Usar análisis inteligente de peso
    if (typeof compareWithPercentiles === 'function') {
      const comp = compareWithPercentiles(ultimoPeso.peso, pet.raza, edadMesesPeso);
      if (comp) {
        const estadoColor = comp.estado === 'normal' ? 'var(--success)' : comp.estado === 'sobrepeso' ? 'var(--danger)' : 'var(--warning)';
        compHtml += `<p>Peso ideal para ${pet.raza} (${comp.etapa}): <strong>${comp.rangoIdeal.min} - ${comp.rangoIdeal.max} kg</strong></p>`;
        compHtml += `<p style="color:${estadoColor}">${comp.estado === 'normal' ? '✓' : '⚠'} ${comp.mensaje}</p>`;
        if (comp.percentil) compHtml += `<p style="font-size:0.8rem;color:var(--text-secondary)">Percentil ${comp.percentil} para su raza</p>`;
      }
    } else {
      const razaInfo = RAZAS[pet.especie].find(r => r.nombre === pet.raza);
      if (razaInfo) {
        compHtml += `<p>Peso ideal para ${pet.raza}: <strong>${razaInfo.pesoIdeal.min} - ${razaInfo.pesoIdeal.max} kg</strong></p>`;
      }
    }
    document.getElementById('weight-comparison').innerHTML = compHtml;
  } else {
    document.getElementById('weight-comparison').innerHTML = '<p style="color:var(--text-secondary)">No hay registros de peso</p>';
  }

  // Análisis inteligente de peso (tendencias, alertas)
  const weightAnalysisContainer = document.getElementById('weight-analysis');
  if (weightAnalysisContainer && typeof renderizarAnalisisPeso === 'function') {
    weightAnalysisContainer.innerHTML = renderizarAnalisisPeso(pet, estado.pesos);
  }

  // Alertas de peso
  const weightAlertsContainer = document.getElementById('weight-alerts');
  if (weightAlertsContainer && typeof generarAlertasPeso === 'function') {
    const alertasPeso = generarAlertasPeso(pet, estado.pesos);
    if (alertasPeso.length > 0) {
      weightAlertsContainer.innerHTML = alertasPeso.map(a => `
        <div class="alert alert-${a.tipo === 'danger' ? 'danger' : a.tipo === 'warning' ? 'warning' : 'success'}">
          <i class="fas fa-${a.icono}"></i>
          <div>
            <strong>${a.titulo}</strong>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">${a.mensaje}</p>
          </div>
        </div>
      `).join('');
      weightAlertsContainer.classList.remove('hidden');
    } else {
      weightAlertsContainer.classList.add('hidden');
    }
  }

  // Gráficos
  renderizarGraficoCalSemanal(pet);
  renderizarGraficoPeso(pet);
  renderizarHistorial7Dias(pet);

  // Tabla peso por edad
  renderizarTablaPesoEdad(pet);
}

function renderizarTablaPesoEdad(pet) {
  const container = document.getElementById('weight-age-table');
  if (!container || !pet) return;
  if (typeof predictIdealWeight !== 'function') {
    container.innerHTML = '<p class="empty-list">Analizador de peso no disponible</p>';
    return;
  }

  // Título personalizado con nombre de la mascota
  const cardHeader = document.querySelector('#weight-age-table-card .card-header h3');
  if (cardHeader) {
    cardHeader.innerHTML = `<i class="fas fa-table"></i> Peso por Edad para ${pet.nombre}`;
  }

  const edadMeses = (pet.edadAnios * 12) + (pet.edadMeses || 0);
  const especie = pet.especie;
  const edadSenior = especie === 'perro' ? 84 : 120;

  // Usar edades reales de INFO_RAZA_DETALLADA si disponibles
  let edadesClave;
  let usaDatosLiteratura = false;
  const infoRaza = typeof INFO_RAZA_DETALLADA !== 'undefined' ? INFO_RAZA_DETALLADA[pet.raza] : null;

  if (infoRaza && infoRaza.pesoSaludablePorEdad && infoRaza.pesoSaludablePorEdad.length > 0) {
    edadesClave = infoRaza.pesoSaludablePorEdad.map(p => p.edadMeses);
    // Agregar fila Senior si el último punto no es senior
    const ultimaEdad = edadesClave[edadesClave.length - 1];
    if (ultimaEdad < edadSenior) {
      edadesClave.push(edadSenior);
    }
    usaDatosLiteratura = true;
  } else {
    edadesClave = especie === 'perro'
      ? [1, 2, 3, 4, 6, 8, 10, 12, 18, 24, 84]
      : [1, 2, 3, 4, 6, 9, 12, 18, 24, 120];
  }

  function etiquetaEdad(meses) {
    if (meses === edadSenior) return especie === 'perro' ? 'Senior (7a)' : 'Senior (10a)';
    if (meses < 12) return meses + ' meses';
    if (meses === 12) return '1 año';
    if (meses === 18) return '1.5 años';
    if (meses === 24) return '2 años';
    if (meses === 48) return '4 años';
    return (meses / 12) + ' años';
  }

  // Encontrar la fila más cercana a la edad actual
  let filaActualIdx = -1;
  let menorDiff = Infinity;
  edadesClave.forEach((edad, idx) => {
    const diff = Math.abs(edadMeses - edad);
    // Para la fila senior, solo resaltar si realmente es senior
    if (edad === edadSenior && edadMeses < edadSenior) return;
    // Para edades adultas (>último punto de crecimiento), marcar la fila adulta
    if (diff < menorDiff) {
      menorDiff = diff;
      filaActualIdx = idx;
    }
  });
  // Si la mascota es senior, forzar la fila senior
  if (edadMeses >= edadSenior) {
    filaActualIdx = edadesClave.indexOf(edadSenior);
  }

  let html = `<div style="overflow-x:auto"><table class="weight-age-table">
    <thead><tr>
      <th>Edad</th><th>Etapa</th><th>Peso mín</th><th>Peso ideal</th><th>Peso máx</th><th>Actual</th>
    </tr></thead><tbody>`;

  edadesClave.forEach((edad, idx) => {
    const pred = predictIdealWeight(pet.raza, edad);
    if (!pred) return;

    const esCurrent = idx === filaActualIdx;
    const rowClass = esCurrent ? 'weight-age-current' : '';
    const pesoActualStr = esCurrent ? `<strong>${pet.peso} kg</strong>` : '-';

    html += `<tr class="${rowClass}">
      <td>${etiquetaEdad(edad)}</td>
      <td>${pred.etapa}</td>
      <td>${pred.min} kg</td>
      <td><strong>${pred.ideal} kg</strong></td>
      <td>${pred.max} kg</td>
      <td>${pesoActualStr}</td>
    </tr>`;
  });

  html += '</tbody></table></div>';
  if (usaDatosLiteratura) {
    html += '<p class="text-muted" style="font-size:0.8rem;margin-top:0.5rem;text-align:center"><i class="fas fa-book-medical"></i> Datos basados en literatura veterinaria para la raza ' + pet.raza + '</p>';
  }
  container.innerHTML = html;
}

async function registrarComida(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const hora = document.getElementById('meal-time').value;
  const tipo = document.getElementById('meal-food-type').value;
  const marca = document.getElementById('meal-brand').value.trim();
  const gramos = parseFloat(document.getElementById('meal-grams').value);

  if (!hora || !tipo || !gramos) {
    mostrarToast('Completa los campos obligatorios', 'warning');
    return;
  }

  let calPor100g = ALIMENTOS_CALORIAS[tipo] || 0;
  if (tipo === 'Otro') {
    const customKcal = parseFloat(document.getElementById('meal-custom-kcal')?.value);
    if (!customKcal || customKcal <= 0) {
      mostrarToast('Ingresa las calorías por 100g del alimento', 'warning');
      return;
    }
    calPor100g = customKcal;
  }
  const calorias = (calPor100g / 100) * gramos;

  const hoy = fechaHoy();
  if (!estado.comidas[pet.id]) estado.comidas[pet.id] = {};
  if (!estado.comidas[pet.id][hoy]) estado.comidas[pet.id][hoy] = [];

  estado.comidas[pet.id][hoy].push({ hora, tipo, marca, gramos, calorias, calPor100g });
  await guardarDatos();

  document.getElementById('meal-form').reset();
  const now = new Date();
  document.getElementById('meal-time').value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  renderizarSeguimiento();
  mostrarToast('Comida registrada', 'success');
}

async function eliminarComida(fecha, idx) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  if (estado.comidas[pet.id]?.[fecha]) {
    estado.comidas[pet.id][fecha].splice(idx, 1);
    await guardarDatos();
    renderizarSeguimiento();
  }
}

async function registrarAgua(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const ml = parseInt(document.getElementById('water-ml').value);
  if (!ml || ml <= 0) return;

  const hoy = fechaHoy();
  if (!estado.agua[pet.id]) estado.agua[pet.id] = {};
  estado.agua[pet.id][hoy] = (estado.agua[pet.id][hoy] || 0) + ml;
  await guardarDatos();

  document.getElementById('water-ml').value = '';
  renderizarSeguimiento();
  mostrarToast(`+${ml} ml de agua registrado`, 'success');
}

async function registrarPeso(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const peso = parseFloat(document.getElementById('weight-kg').value);
  if (!peso || peso <= 0) return;

  // Campos adicionales opcionales
  const condicionEl = document.getElementById('weight-condition');
  const energiaEl = document.getElementById('weight-energy');
  const apetitoEl = document.getElementById('weight-appetite');

  const registro = {
    fecha: fechaHoy(),
    peso,
    condicion: condicionEl ? parseInt(condicionEl.value) || null : null,
    energia: energiaEl ? parseInt(energiaEl.value) || null : null,
    apetito: apetitoEl ? parseInt(apetitoEl.value) || null : null
  };

  if (!estado.pesos[pet.id]) estado.pesos[pet.id] = [];

  // Reemplazar si ya hay registro de hoy
  const idxHoy = estado.pesos[pet.id].findIndex(p => p.fecha === registro.fecha);
  if (idxHoy !== -1) {
    estado.pesos[pet.id][idxHoy] = registro;
  } else {
    estado.pesos[pet.id].push(registro);
  }

  // Actualizar peso de la mascota
  const petIdx = estado.mascotas.findIndex(p => p.id === pet.id);
  if (petIdx !== -1) estado.mascotas[petIdx].peso = peso;

  await guardarDatos();
  document.getElementById('weight-kg').value = '';
  if (condicionEl) condicionEl.value = '';
  if (energiaEl) energiaEl.value = '';
  if (apetitoEl) apetitoEl.value = '';
  renderizarSeguimiento();
  renderizarMascotas();
  mostrarToast('Peso registrado', 'success');
}

function renderizarHistorial7Dias(pet) {
  const container = document.getElementById('meal-history');
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push(formatearFechaISO(d));
  }

  let html = '';
  dias.forEach(dia => {
    const comidas = estado.comidas[pet.id]?.[dia] || [];
    const totalCal = comidas.reduce((s, c) => s + c.calorias, 0);
    const agua = estado.agua[pet.id]?.[dia] || 0;

    html += `
      <div class="history-day">
        <div class="history-day-header">${formatearFecha(dia)} - ${Math.round(totalCal)} kcal · ${agua} ml agua</div>
        <div class="history-day-meals">
          ${comidas.length > 0
            ? comidas.map(c => `${c.hora} - ${c.tipo} (${c.gramos}g, ${Math.round(c.calorias)} kcal)`).join('<br>')
            : 'Sin registros'}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==================== RECORDATORIOS ====================
function mostrarFormularioRecordatorio() {
  document.getElementById('reminder-form-container').classList.remove('hidden');
  document.getElementById('reminder-form').reset();
}

function cerrarFormularioRecordatorio() {
  document.getElementById('reminder-form-container').classList.add('hidden');
}

function guardarRecordatorio(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const tipo = document.getElementById('reminder-type').value;
  const hora = document.getElementById('reminder-time').value;
  const repetir = document.getElementById('reminder-repeat').value;
  if (!tipo || !hora) {
    mostrarToast('Completa los campos obligatorios', 'warning');
    return;
  }

  // Validar fecha para recordatorios de una sola vez
  const fechaEl = document.getElementById('reminder-date');
  const fecha = fechaEl ? fechaEl.value : '';
  if (repetir === 'unico' && !fecha) {
    mostrarToast('Selecciona una fecha para el recordatorio', 'warning');
    return;
  }

  const recordatorio = {
    id: generarId(),
    tipo,
    hora,
    fecha: fecha || '',
    repetir,
    nota: document.getElementById('reminder-note').value.trim(),
    alarma: document.getElementById('reminder-alarm').checked,
    activo: true
  };

  if (!estado.recordatorios[pet.id]) estado.recordatorios[pet.id] = [];
  estado.recordatorios[pet.id].push(recordatorio);
  guardarDatos();
  cerrarFormularioRecordatorio();
  renderizarRecordatorios();
  mostrarToast('Recordatorio creado', 'success');
}

function renderizarRecordatorios() {
  const pet = obtenerMascotaActiva();
  document.getElementById('remind-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('remind-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  const recordatorios = (estado.recordatorios[pet.id] || []).sort((a, b) => a.hora.localeCompare(b.hora));

  // Recordatorios de hoy
  const now = new Date();
  const horaActual = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const todayList = document.getElementById('today-reminders');
  const todayReminders = recordatorios.filter(r => r.activo && (r.repetir === 'diario' || r.repetir === 'unico'));

  if (todayReminders.length === 0) {
    todayList.innerHTML = '<li class="empty-list">No hay recordatorios para hoy</li>';
  } else {
    todayList.innerHTML = todayReminders.map(r => {
      const pasado = r.hora < horaActual;
      return `
        <li style="${pasado ? 'opacity:0.5' : ''}">
          <div class="reminder-info">
            <div class="reminder-icon ${r.tipo}"><i class="fas ${iconoRecordatorio(r.tipo)}"></i></div>
            <div class="reminder-text">
              <strong>${capitalizarPrimera(r.tipo)} ${pasado ? '(completado)' : ''}</strong>
              <span>${r.hora} ${r.nota ? '- ' + escapeHtml(r.nota) : ''}</span>
            </div>
          </div>
          ${r.alarma ? '<i class="fas fa-bell" style="color:var(--warning)" title="Alarma activa"></i>' : ''}
        </li>
      `;
    }).join('');
  }

  // Todos los recordatorios
  const allList = document.getElementById('all-reminders');
  if (recordatorios.length === 0) {
    allList.innerHTML = '<li class="empty-list">No hay recordatorios</li>';
  } else {
    allList.innerHTML = recordatorios.map(r => `
      <li>
        <div class="reminder-info">
          <div class="reminder-icon ${r.tipo}"><i class="fas ${iconoRecordatorio(r.tipo)}"></i></div>
          <div class="reminder-text">
            <strong>${capitalizarPrimera(r.tipo)} ${r.autoGenerado ? '<span style="font-size:0.7rem;color:var(--primary)">(Auto)</span>' : ''}</strong>
            <span>${r.hora} · ${capitalizarPrimera(r.repetir)} ${r.fecha ? '· ' + formatearFecha(r.fecha) : ''} ${r.nota ? '· ' + escapeHtml(r.nota) : ''}</span>
          </div>
        </div>
        <div style="display:flex;gap:0.25rem;align-items:center">
          <button class="btn-icon btn-sm" onclick="exportarCalendario('${r.id}')" title="Exportar a calendario"><i class="fas fa-calendar-plus" style="color:var(--primary)"></i></button>
          <button class="btn-icon btn-sm" onclick="eliminarRecordatorio('${r.id}')" title="Eliminar"><i class="fas fa-trash" style="color:var(--danger)"></i></button>
        </div>
      </li>
    `).join('');
  }
}

function eliminarRecordatorio(id) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  estado.recordatorios[pet.id] = (estado.recordatorios[pet.id] || []).filter(r => r.id !== id);
  guardarDatos();
  renderizarRecordatorios();
  mostrarToast('Recordatorio eliminado', 'info');
}

function verificarRecordatorios() {
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const now = new Date();
  const horaActual = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const hoy = fechaHoy();

  const recordatorios = estado.recordatorios[pet.id] || [];
  recordatorios.forEach(r => {
    if (!r.activo || r.hora !== horaActual || !r.alarma) return;

    // Para recordatorios únicos, verificar que sea la fecha correcta
    if (r.repetir === 'unico' && r.fecha && r.fecha !== hoy) return;

    // Para semanales, verificar día de la semana
    if (r.repetir === 'semanal') {
      // Se activa cualquier día (simplificado)
    }

    mostrarToast(`⏰ ${capitalizarPrimera(r.tipo)}: ${r.nota || 'Es hora!'}`, 'warning');

    // Intentar reproducir sonido
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 500);
    } catch(e) { /* Sonido no disponible */ }

    // Desactivar recordatorios únicos después de dispararse
    if (r.repetir === 'unico' && r.fecha === hoy) {
      r.activo = false;
      guardarDatos();
    }
  });
}

function iconoRecordatorio(tipo) {
  const iconos = {
    alimentacion: 'fa-utensils',
    pesaje: 'fa-weight',
    hidratacion: 'fa-tint',
    veterinario: 'fa-stethoscope',
    medicamento: 'fa-pills',
    otro: 'fa-bell'
  };
  return iconos[tipo] || 'fa-bell';
}

// ==================== CALENDARIO VETERINARIO ====================
function renderizarCalendario() {
  const pet = obtenerMascotaActiva();
  document.getElementById('cal-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('cal-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  renderizarVacunacion(pet);
  renderizarDesparasitacion(pet);
  renderizarChequeos(pet);
  renderizarTimeline(pet);
  actualizarVinculoExamenes(pet);
}

function renderizarVacunacion(pet) {
  const plan = pet.especie === 'perro' ? VACUNACION_PERRO : VACUNACION_GATO;
  const edadSemanas = ((pet.edadAnios * 12) + pet.edadMeses) * 4.33;
  const container = document.getElementById('vaccination-plan');

  container.innerHTML = plan.map(v => {
    const status = edadSemanas >= v.edadSemanas ? 'done' : 'pending';
    const edadTexto = v.edadSemanas < 52 ? `${v.edadSemanas} semanas` : `${Math.round(v.edadSemanas/52)} año(s) - Refuerzo anual`;
    return `
      <div class="timeline-item ${status}">
        <div class="timeline-date">${edadTexto}</div>
        <div class="timeline-title">${v.vacuna}</div>
        <div class="timeline-desc">${status === 'done' ? '✓ Edad alcanzada' : 'Pendiente'}</div>
      </div>
    `;
  }).join('');
}

function renderizarDesparasitacion(pet) {
  const container = document.getElementById('deworming-plan');
  container.innerHTML = `
    <p><i class="fas fa-bug" style="color:var(--warning)"></i> <strong>Desparasitación interna:</strong> Cada 3 meses</p>
    <p><i class="fas fa-spider" style="color:var(--warning)"></i> <strong>Desparasitación externa</strong> (pulgas y garrapatas): Mensual</p>
    <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem">* Consulta con tu veterinario el producto más adecuado según el peso y especie.</p>
  `;
}

function renderizarChequeos(pet) {
  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;
  const esSenior = edadMeses > 84;
  const container = document.getElementById('checkup-plan');
  container.innerHTML = `
    <p><i class="fas fa-stethoscope" style="color:var(--primary)"></i> <strong>Frecuencia recomendada:</strong> ${esSenior ? 'Cada 6 meses (senior >7 años)' : 'Anual'}</p>
    <p><strong>Edad actual:</strong> ${pet.edadAnios} años ${pet.edadMeses} meses ${esSenior ? '(Senior)' : '(Adulto)'}</p>
    <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem">Los chequeos de rutina deben incluir examen físico completo, hemograma y perfil bioquímico.</p>
  `;
}

function mostrarFormularioVisita() {
  document.getElementById('visit-form-container').classList.remove('hidden');
  document.getElementById('visit-form').reset();
  document.getElementById('visit-date').value = fechaHoy();
}

function cerrarFormularioVisita() {
  document.getElementById('visit-form-container').classList.add('hidden');
}

function actualizarVinculoExamenes(pet) {
  const select = document.getElementById('visit-exam-link');
  const examenes = (estado.examenes[pet.id] || []).sort((a, b) => b.fecha.localeCompare(a.fecha));
  select.innerHTML = '<option value="">Sin vincular</option>';
  examenes.forEach(ex => {
    const opt = document.createElement('option');
    opt.value = ex.id;
    opt.textContent = `${ex.tipo} - ${formatearFecha(ex.fecha)}`;
    select.appendChild(opt);
  });
}

function guardarVisita(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const fecha = document.getElementById('visit-date').value;
  const tipo = document.getElementById('visit-type').value;
  if (!fecha || !tipo) {
    mostrarToast('Completa los campos obligatorios', 'warning');
    return;
  }

  const visita = {
    id: generarId(),
    fecha,
    tipo,
    veterinario: document.getElementById('visit-vet').value.trim(),
    clinica: document.getElementById('visit-clinic').value.trim(),
    notas: document.getElementById('visit-notes').value.trim(),
    proximaCita: document.getElementById('visit-next').value,
    examenVinculado: document.getElementById('visit-exam-link').value
  };

  if (!estado.visitas[pet.id]) estado.visitas[pet.id] = [];
  estado.visitas[pet.id].push(visita);
  guardarDatos();
  cerrarFormularioVisita();
  renderizarCalendario();
  mostrarToast('Visita registrada', 'success');
}

function renderizarTimeline(pet) {
  const container = document.getElementById('visits-timeline');
  const visitas = (estado.visitas[pet.id] || []).map(v => ({ ...v, esVisita: true }));
  const examenes = (estado.examenes[pet.id] || []).map(e => ({ ...e, esExamen: true }));
  const items = [...visitas, ...examenes].sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-list">No hay registros</p>';
    return;
  }

  container.innerHTML = items.map(item => {
    if (item.esVisita) {
      return `
        <div class="timeline-item done">
          <div class="timeline-date">${formatearFecha(item.fecha)}</div>
          <div class="timeline-title"><i class="fas fa-clinic-medical"></i> ${capitalizarPrimera(item.tipo)}</div>
          <div class="timeline-desc">
            ${item.veterinario ? 'Dr(a). ' + escapeHtml(item.veterinario) : ''}
            ${item.clinica ? ' - ' + escapeHtml(item.clinica) : ''}
            ${item.notas ? '<br>' + escapeHtml(item.notas) : ''}
            ${item.proximaCita ? '<br><strong>Próxima cita:</strong> ' + formatearFecha(item.proximaCita) : ''}
          </div>
          <button class="btn btn-sm btn-secondary" style="margin-top:0.5rem" onclick="eliminarVisita('${item.id}')"><i class="fas fa-trash"></i></button>
        </div>
      `;
    } else {
      return `
        <div class="timeline-item ${item.ajusteNutricional ? 'warning' : 'done'}">
          <div class="timeline-date">${formatearFecha(item.fecha)}</div>
          <div class="timeline-title"><i class="fas fa-file-medical"></i> Examen: ${escapeHtml(item.tipo)}</div>
          <div class="timeline-desc">${escapeHtml(item.resultados.substring(0, 100))}${item.resultados.length > 100 ? '...' : ''}</div>
        </div>
      `;
    }
  }).join('');
}

function eliminarVisita(id) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  mostrarConfirmacion('Eliminar visita', '¿Eliminar esta visita?', () => {
    estado.visitas[pet.id] = (estado.visitas[pet.id] || []).filter(v => v.id !== id);
    guardarDatos();
    renderizarCalendario();
    mostrarToast('Visita eliminada', 'info');
  });
}

// ==================== REFERENCIAS Y GLOSARIO ====================
function renderizarReferencias() {
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};
  ['perro', 'gato'].forEach(especie => {
    const tbody = document.getElementById(`ref-table-${especie}`);
    const refs = (typeof RANGOS_REFERENCIA !== 'undefined' ? RANGOS_REFERENCIA : {})[especie] || {};
    // Agrupar por categoría
    const porCategoria = {};
    Object.keys(refs).forEach(key => {
      const cat = (catalog[key] || {}).categoria || 'otros';
      if (!porCategoria[cat]) porCategoria[cat] = [];
      porCategoria[cat].push({ key, ...refs[key] });
    });
    let html = '';
    Object.keys(porCategoria).forEach(cat => {
      const label = catLabels[cat] || cat;
      html += `<tr class="ref-category-row"><td colspan="4"><strong>${label}</strong></td></tr>`;
      porCategoria[cat].forEach(r => {
        html += `<tr><td>${r.nombre}</td><td>${r.min}</td><td>${r.max}</td><td>${r.unit || ''}</td></tr>`;
      });
    });
    tbody.innerHTML = html;
  });
}

function renderizarGlosario() {
  const dl = document.getElementById('glossary-list');
  dl.innerHTML = GLOSARIO.sort((a, b) => a.termino.localeCompare(b.termino)).map(item =>
    `<dt>${escapeHtml(item.termino)}</dt><dd>${escapeHtml(item.definicion)}</dd>`
  ).join('');
}

function filtrarGlosario() {
  const query = document.getElementById('glossary-search').value.toLowerCase();
  const dl = document.getElementById('glossary-list');
  const filtered = GLOSARIO
    .filter(item => item.termino.toLowerCase().includes(query) || item.definicion.toLowerCase().includes(query))
    .sort((a, b) => a.termino.localeCompare(b.termino));
  dl.innerHTML = filtered.map(item =>
    `<dt>${escapeHtml(item.termino)}</dt><dd>${escapeHtml(item.definicion)}</dd>`
  ).join('');
}

// ==================== GRÁFICOS (Chart.js) ====================
let chartInstances = {};

function destruirChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function renderizarGraficoMacros(prot, fat, carb) {
  destruirChart('macro-chart');
  const ctx = document.getElementById('macro-chart');
  if (!ctx) return;

  const isDark = estado.tema === 'dark';
  chartInstances['macro-chart'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteína', 'Grasa', 'Carbohidratos'],
      datasets: [{
        data: [prot, fat, carb],
        backgroundColor: ['#4A90E2', '#F5A623', '#7ED321'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: isDark ? '#E8E8E8' : '#2C3E50', padding: 15 }
        }
      }
    }
  });
}

function renderizarGraficoCalSemanal(pet) {
  destruirChart('weekly-cal-chart');
  const ctx = document.getElementById('weekly-cal-chart');
  if (!ctx) return;

  const labels = [];
  const datosConsumo = [];
  const datosObjetivo = [];
  const calorias = calcularCaloriasDiarias(pet);

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const fecha = formatearFechaISO(d);
    labels.push(formatearFechaCorta(d));
    const comidas = estado.comidas[pet.id]?.[fecha] || [];
    datosConsumo.push(Math.round(comidas.reduce((s, c) => s + c.calorias, 0)));
    datosObjetivo.push(Math.round(calorias));
  }

  const isDark = estado.tema === 'dark';
  chartInstances['weekly-cal-chart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Consumido',
          data: datosConsumo,
          backgroundColor: 'rgba(74,144,226,0.7)',
          borderRadius: 6
        },
        {
          label: 'Objetivo',
          data: datosObjetivo,
          type: 'line',
          borderColor: '#D0021B',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D' },
          grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D' },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { labels: { color: isDark ? '#E8E8E8' : '#2C3E50' } }
      }
    }
  });
}

function renderizarGraficoPeso(pet) {
  destruirChart('weight-history-chart');
  const ctx = document.getElementById('weight-history-chart');
  if (!ctx) return;

  const pesos = (estado.pesos[pet.id] || []).slice(-90); // Últimos 3 meses aprox
  if (pesos.length === 0) return;

  const isDark = estado.tema === 'dark';
  chartInstances['weight-history-chart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: pesos.map(p => formatearFecha(p.fecha)),
      datasets: [{
        label: 'Peso (kg)',
        data: pesos.map(p => p.peso),
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74,144,226,0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#4A90E2',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D' },
          grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D', maxRotation: 45 },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { labels: { color: isDark ? '#E8E8E8' : '#2C3E50' } }
      }
    }
  });
}

function renderizarGraficoPesoMini(pet) {
  destruirChart('dash-weight-chart');
  const ctx = document.getElementById('dash-weight-chart');
  if (!ctx) return;

  const pesos = (estado.pesos[pet.id] || []).slice(-10);
  const trendEl = document.getElementById('dash-weight-trend');

  if (pesos.length < 2) {
    trendEl.textContent = pesos.length === 0 ? 'Sin datos de peso' : 'Necesitas al menos 2 registros';
    return;
  }

  const primerPeso = pesos[0].peso;
  const ultimoPeso = pesos[pesos.length - 1].peso;
  const diff = ultimoPeso - primerPeso;

  if (diff > 0.3) {
    trendEl.innerHTML = `<span style="color:var(--warning)">↑ Tendencia al alza (+${diff.toFixed(1)} kg)</span>`;
  } else if (diff < -0.3) {
    trendEl.innerHTML = `<span style="color:var(--primary)">↓ Tendencia a la baja (${diff.toFixed(1)} kg)</span>`;
  } else {
    trendEl.innerHTML = `<span style="color:var(--success)">→ Peso estable</span>`;
  }

  const isDark = estado.tema === 'dark';
  chartInstances['dash-weight-chart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: pesos.map(p => formatearFecha(p.fecha)),
      datasets: [{
        data: pesos.map(p => p.peso),
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74,144,226,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#4A90E2'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D', font: { size: 10 } },
          grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { color: isDark ? '#A0A0B0' : '#7F8C8D', font: { size: 10 }, maxRotation: 45 },
          grid: { display: false }
        }
      }
    }
  });
}

// ==================== FAB ====================
function toggleFab() {
  const fab = document.getElementById('fab');
  const menu = document.getElementById('fab-menu');
  fab.classList.toggle('active');
  menu.classList.toggle('hidden');
}

function fabAccion(tipo) {
  toggleFab();
  switch(tipo) {
    case 'comida': navegarA('seguimiento'); break;
    case 'agua': navegarA('seguimiento'); break;
    case 'peso': navegarA('seguimiento'); break;
    case 'mascota': navegarA('mascotas'); setTimeout(() => mostrarFormularioMascota(), 300); break;
  }
}

// ==================== TOAST ====================
function mostrarToast(mensaje, tipo = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  const iconos = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${iconos[tipo] || iconos.info}"></i> ${escapeHtml(mensaje)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== MODAL DE CONFIRMACIÓN ====================
let modalCallback = null;

function mostrarConfirmacion(titulo, mensaje, callback) {
  document.getElementById('modal-title').textContent = titulo;
  document.getElementById('modal-message').textContent = mensaje;
  document.getElementById('confirm-modal').classList.remove('hidden');
  modalCallback = callback;
  document.getElementById('modal-confirm-btn').onclick = () => {
    const cb = modalCallback;
    cerrarModal();
    if (cb) cb();
  };
}

function cerrarModal() {
  document.getElementById('confirm-modal').classList.add('hidden');
  modalCallback = null;
}

// ==================== UTILIDADES ====================
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function fechaHoy() {
  return formatearFechaISO(new Date());
}

function formatearFechaISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const parts = fechaStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatearFechaCorta(date) {
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  return `${dias[date.getDay()]} ${date.getDate()}`;
}

function capitalizarPrimera(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== SUBIDA DE FOTOS ====================
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handlePhotoDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processPhotoFile(file);
  } else {
    mostrarToast('Solo se aceptan imágenes (JPG, PNG, WebP)', 'warning');
  }
}

function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (file) processPhotoFile(file);
}

function processPhotoFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    mostrarToast('La imagen no debe superar 5MB', 'warning');
    return;
  }

  currentPhotoFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('photo-preview-img').src = e.target.result;
    document.getElementById('photo-preview').classList.remove('hidden');
    document.getElementById('photo-placeholder').classList.add('hidden');
    // Guardar preview temporal - se sube a Firebase Storage al guardar
    document.getElementById('pet-photo').value = '__pending_upload__';
  };
  reader.readAsDataURL(file);
}

function removePhotoPreview() {
  currentPhotoFile = null;
  document.getElementById('pet-photo').value = '';
  document.getElementById('photo-preview').classList.add('hidden');
  document.getElementById('photo-placeholder').classList.remove('hidden');
  const fileInput = document.getElementById('pet-photo-file');
  if (fileInput) fileInput.value = '';
}

// ==================== SUBIDA DE PDF ====================
function handlePDFDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    processPDFFile(file);
  } else {
    mostrarToast('Solo se aceptan archivos PDF', 'warning');
  }
}

function handlePDFSelect(e) {
  const file = e.target.files[0];
  if (file) processPDFFile(file);
}

async function processPDFFile(file) {
  // Validar tamaño máximo 10MB
  if (file.size > 10 * 1024 * 1024) {
    mostrarToast('El PDF no debe superar 10MB', 'warning');
    return;
  }

  currentPDFFile = file;
  document.getElementById('pdf-file-name').textContent = file.name;
  document.getElementById('pdf-preview').classList.remove('hidden');
  document.getElementById('pdf-placeholder').classList.add('hidden');

  // Intentar extraer valores del PDF
  if (typeof pdfjsLib !== 'undefined') {
    try {
      mostrarToast('Analizando PDF...', 'info');
      const result = await extraerValoresPDF(file);
      const { valores } = result;

      const keys = Object.keys(valores);
      if (keys.length > 0) {
        poblarValoresExtraidos(valores);
        document.getElementById('pdf-analysis').classList.remove('hidden');
        mostrarToast(`${keys.length} valores detectados del PDF`, 'success');
      } else {
        mostrarToast('No se detectaron valores automáticamente', 'info');
      }
    } catch (err) {
      console.error('Error al analizar PDF:', err);
      mostrarToast('No se pudo analizar el PDF', 'warning');
    }
  }

  // Marcar como pendiente de upload - se sube al guardar examen
  document.getElementById('exam-file').value = '__pending_upload__';
}

function removePDFPreview() {
  currentPDFFile = null;
  document.getElementById('exam-file').value = '';
  document.getElementById('pdf-preview').classList.add('hidden');
  document.getElementById('pdf-placeholder').classList.remove('hidden');
  document.getElementById('pdf-analysis').classList.add('hidden');
  const fileInput = document.getElementById('exam-pdf-file');
  if (fileInput) fileInput.value = '';
}

// Poblar el contenedor dinámico con valores extraídos del PDF
function poblarValoresExtraidos(valores) {
  const container = document.getElementById('exam-extracted-values');
  if (!container) return;
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};

  // Agrupar por categoría
  const porCategoria = {};
  Object.keys(valores).forEach(key => {
    const cat = (catalog[key] || {}).categoria || 'otros';
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(key);
  });

  let html = '';
  Object.keys(porCategoria).forEach(cat => {
    const label = catLabels[cat] || cat;
    html += `<div class="extracted-category"><span class="extracted-category-label">${label}</span><div class="extracted-grid" data-cat="${cat}">`;
    porCategoria[cat].forEach(key => {
      const info = catalog[key] || {};
      const nombre = info.nombre || key;
      const unit = info.unit || '';
      const step = info.step || 0.1;
      html += `
        <div class="form-group" style="margin-bottom:0">
          <label style="font-size:0.75rem">${nombre} (${unit})</label>
          <input type="number" step="${step}" min="0" data-param-key="${key}" value="${valores[key]}" class="form-control" style="padding:0.4rem">
        </div>`;
    });
    html += '</div></div>';
  });

  container.innerHTML = html;
}

// Agregar parámetro manualmente al formulario de nuevo examen
function agregarParametroManual() {
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const container = document.getElementById('exam-extracted-values');
  if (!container) return;

  // Obtener keys ya presentes
  const existentes = new Set();
  container.querySelectorAll('input[data-param-key]').forEach(el => existentes.add(el.dataset.paramKey));

  // Filtrar disponibles
  const disponibles = Object.keys(catalog).filter(k => !existentes.has(k));
  if (disponibles.length === 0) {
    mostrarToast('Todos los parámetros ya están agregados', 'info');
    return;
  }

  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};
  let selectHtml = '<select id="select-nuevo-param" class="form-control" style="margin-bottom:0.5rem">';
  // Agrupar por categoría
  const porCat = {};
  disponibles.forEach(k => {
    const cat = catalog[k].categoria || 'otros';
    if (!porCat[cat]) porCat[cat] = [];
    porCat[cat].push(k);
  });
  Object.keys(porCat).forEach(cat => {
    selectHtml += `<optgroup label="${catLabels[cat] || cat}">`;
    porCat[cat].forEach(k => {
      selectHtml += `<option value="${k}">${catalog[k].nombre} (${catalog[k].unit})</option>`;
    });
    selectHtml += '</optgroup>';
  });
  selectHtml += '</select>';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-add-param';
  modal.innerHTML = `
    <div class="modal" style="max-width:360px">
      <h3>Agregar parámetro</h3>
      ${selectHtml}
      <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
        <button class="btn btn-primary btn-sm" onclick="confirmarAgregarParametro()">Agregar</button>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-add-param').remove()">Cancelar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function confirmarAgregarParametro() {
  const select = document.getElementById('select-nuevo-param');
  if (!select) return;
  const key = select.value;
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const info = catalog[key] || {};

  const container = document.getElementById('exam-extracted-values');
  if (!container) return;

  // Buscar o crear grid de la categoría correcta
  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};
  const cat = info.categoria || 'otros';
  let grid = container.querySelector(`.extracted-grid[data-cat="${cat}"]`);
  if (!grid) {
    const catDiv = document.createElement('div');
    catDiv.className = 'extracted-category';
    catDiv.innerHTML = `<span class="extracted-category-label">${catLabels[cat] || cat}</span><div class="extracted-grid" data-cat="${cat}"></div>`;
    container.appendChild(catDiv);
    grid = catDiv.querySelector('.extracted-grid');
  }

  const fieldHtml = `
    <div class="form-group" style="margin-bottom:0">
      <label style="font-size:0.75rem">${info.nombre || key} (${info.unit || ''})</label>
      <input type="number" step="${info.step || 0.1}" min="0" data-param-key="${key}" value="" class="form-control" style="padding:0.4rem" placeholder="Valor">
    </div>`;
  grid.insertAdjacentHTML('beforeend', fieldHtml);

  const modal = document.getElementById('modal-add-param');
  if (modal) modal.remove();
}

// Agregar parámetro al formulario de edición inline
function agregarParametroEdicion(examId) {
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const grid = document.getElementById(`edit-grid-${examId}`);
  if (!grid) return;

  const existentes = new Set();
  grid.querySelectorAll('input[data-param-key]').forEach(el => existentes.add(el.dataset.paramKey));

  const disponibles = Object.keys(catalog).filter(k => !existentes.has(k));
  if (disponibles.length === 0) {
    mostrarToast('Todos los parámetros ya están agregados', 'info');
    return;
  }

  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};
  let selectHtml = '<select id="select-edit-param" class="form-control" style="margin-bottom:0.5rem">';
  const porCat = {};
  disponibles.forEach(k => {
    const cat = catalog[k].categoria || 'otros';
    if (!porCat[cat]) porCat[cat] = [];
    porCat[cat].push(k);
  });
  Object.keys(porCat).forEach(cat => {
    selectHtml += `<optgroup label="${catLabels[cat] || cat}">`;
    porCat[cat].forEach(k => {
      selectHtml += `<option value="${k}">${catalog[k].nombre} (${catalog[k].unit})</option>`;
    });
    selectHtml += '</optgroup>';
  });
  selectHtml += '</select>';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-edit-param';
  modal.innerHTML = `
    <div class="modal" style="max-width:360px">
      <h3>Agregar parámetro</h3>
      ${selectHtml}
      <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
        <button class="btn btn-primary btn-sm" onclick="confirmarAgregarParametroEdicion('${examId}')">Agregar</button>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-edit-param').remove()">Cancelar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function confirmarAgregarParametroEdicion(examId) {
  const select = document.getElementById('select-edit-param');
  if (!select) return;
  const key = select.value;
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const info = catalog[key] || {};

  const grid = document.getElementById(`edit-grid-${examId}`);
  if (!grid) return;

  const fieldHtml = `
    <div class="form-group" style="margin-bottom:0">
      <label style="font-size:0.75rem">${info.nombre || key} (${info.unit || ''})</label>
      <input type="number" step="${info.step || 0.1}" data-param-key="${key}" value="" class="form-control edit-param-input" style="padding:0.4rem" placeholder="Valor">
    </div>`;
  grid.insertAdjacentHTML('beforeend', fieldHtml);

  const modal = document.getElementById('modal-edit-param');
  if (modal) modal.remove();
}

function verPDF(url) {
  if (!url) return;
  document.getElementById('pdf-viewer-frame').src = url;
  document.getElementById('pdf-download-link').href = url;
  document.getElementById('pdf-viewer-modal').classList.remove('hidden');
}

// ==================== CHECKLISTS ====================
function renderizarChecklists() {
  const pet = obtenerMascotaActiva();
  document.getElementById('checklists-no-pet').classList.toggle('hidden', !!pet);
  document.getElementById('checklists-content').classList.toggle('hidden', !pet);
  if (!pet) return;

  const grid = document.getElementById('checklists-grid');
  if (!grid || typeof CHECKLIST_TEMPLATES === 'undefined') return;

  const especie = pet.especie || 'perro';
  const checklistState = estado.checklists[pet.id] || {};

  const tiemposEstimados = {
    paseo: '~30 min', viaje: '~30 min', dejarsola: '~15 min',
    emergencia: '~1 hora', grooming: '~45 min', veterinario: '~15 min'
  };

  let html = '';
  Object.keys(CHECKLIST_TEMPLATES).forEach(key => {
    const tmpl = CHECKLIST_TEMPLATES[key];
    const items = tmpl.items[especie] || tmpl.items.perro;
    const checked = checklistState[key] || new Array(items.length).fill(false);
    const completados = checked.filter(Boolean).length;
    const total = items.length;
    const pct = total > 0 ? Math.round((completados / total) * 100) : 0;
    const tieneProgreso = completados > 0;

    html += `
      <div class="checklist-selector-card card" onclick="mostrarChecklist('${key}')">
        <div class="checklist-selector-icon">
          <i class="fas ${tmpl.icono}"></i>
        </div>
        <h3 class="checklist-selector-name">${tmpl.nombre}</h3>
        <div class="checklist-selector-meta">
          <span><i class="fas fa-tasks"></i> ${total} tareas</span>
          <span><i class="fas fa-clock"></i> ${tiemposEstimados[key] || ''}</span>
        </div>
        ${tieneProgreso ? `
          <div class="checklist-progress" style="margin-top:0.5rem">
            <div class="progress-bar-container">
              <div class="progress-fill" style="width:${pct}%;background:${pct === 100 ? 'var(--success)' : 'var(--primary)'}"></div>
            </div>
            <span class="checklist-progress-text">${completados}/${total}${pct === 100 ? ' ✓' : ''}</span>
          </div>
        ` : ''}
      </div>`;
  });

  grid.innerHTML = html;
}

function mostrarChecklist(key) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const grid = document.getElementById('checklists-grid');
  if (!grid) return;

  const especie = pet.especie || 'perro';
  const tmpl = CHECKLIST_TEMPLATES[key];
  if (!tmpl) return;

  const items = tmpl.items[especie] || tmpl.items.perro;
  const checklistState = estado.checklists[pet.id] || {};
  const checked = checklistState[key] || new Array(items.length).fill(false);
  const completados = checked.filter(Boolean).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0;

  grid.innerHTML = `
    <div class="checklist-detail-wrapper">
      <button class="btn btn-outline checklist-back-btn" onclick="renderizarChecklists()">
        <i class="fas fa-arrow-left"></i> Volver a checklists
      </button>
      <div class="checklist-detail-card card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <h3><i class="fas ${tmpl.icono}"></i> ${tmpl.nombre}</h3>
        </div>
        <div class="card-body">
          <div class="checklist-progress">
            <div class="progress-bar-container">
              <div class="progress-fill" style="width:${pct}%;background:${pct === 100 ? 'var(--success)' : 'var(--primary)'}"></div>
            </div>
            <span class="checklist-progress-text">${completados}/${total} (${pct}%)</span>
          </div>
          <ul class="checklist-items">
            ${items.map((item, i) => `
              <li class="checklist-item ${checked[i] ? 'checked' : ''}">
                <label>
                  <input type="checkbox" ${checked[i] ? 'checked' : ''} onchange="toggleChecklistItem('${key}',${i},this.checked)">
                  <span>${escapeHtml(item)}</span>
                </label>
              </li>
            `).join('')}
          </ul>
          <button class="btn btn-outline btn-sm" style="margin-top:1rem" onclick="resetChecklist('${key}')" title="Reiniciar">
            <i class="fas fa-redo"></i> Reiniciar checklist
          </button>
        </div>
      </div>
    </div>`;
}

async function toggleChecklistItem(key, index, checked) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  if (!estado.checklists[pet.id]) estado.checklists[pet.id] = {};

  const especie = pet.especie || 'perro';
  const tmpl = CHECKLIST_TEMPLATES[key];
  const items = tmpl.items[especie] || tmpl.items.perro;

  if (!estado.checklists[pet.id][key]) {
    estado.checklists[pet.id][key] = new Array(items.length).fill(false);
  }
  estado.checklists[pet.id][key][index] = checked;
  await guardarDatos();
  mostrarChecklist(key);
}

async function resetChecklist(key) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  if (!estado.checklists[pet.id]) estado.checklists[pet.id] = {};

  const especie = pet.especie || 'perro';
  const tmpl = CHECKLIST_TEMPLATES[key];
  const items = tmpl.items[especie] || tmpl.items.perro;
  estado.checklists[pet.id][key] = new Array(items.length).fill(false);
  await guardarDatos();
  mostrarChecklist(key);
}

// ==================== VETERINARIAS - DIRECTORIO LOCAL ====================
function renderizarVeterinariasLocal() {
  const pet = obtenerMascotaActiva();
  const container = document.getElementById('vet-local-content');
  if (!container) return;

  if (typeof VET_DATABASE === 'undefined' || typeof filtrarVeterinarias === 'undefined') {
    container.innerHTML = '<p class="empty-list">Base de datos de veterinarias no disponible</p>';
    return;
  }

  const ciudad = pet ? pet.ciudad : '';
  const filtros = { ciudad: ciudad || '' };
  const vets = filtrarVeterinarias(filtros).slice(0, 15);

  if (vets.length === 0) {
    container.innerHTML = `
      <p class="empty-list">No se encontraron veterinarias${ciudad ? ' en ' + ciudad : ''}</p>
      <a href="directorio-veterinarias.html" class="btn btn-primary" style="margin-top:1rem">
        <i class="fas fa-search"></i> Ver directorio completo
      </a>`;
    return;
  }

  let html = '<div class="vet-local-grid">';
  vets.forEach(vet => {
    const stars = '★'.repeat(Math.round(vet.calificacion)) + '☆'.repeat(5 - Math.round(vet.calificacion));
    html += `
      <div class="vet-card">
        <h4>${escapeHtml(vet.nombre)}</h4>
        <p class="vet-address"><i class="fas fa-map-pin"></i> ${escapeHtml(vet.direccion)}, ${escapeHtml(vet.ciudad)}</p>
        <div class="vet-rating"><span class="stars">${stars}</span> <span>${vet.calificacion}</span></div>
        ${vet.emergencia24h ? '<span class="vet-badge-24h"><i class="fas fa-hospital"></i> 24/7</span>' : ''}
        <div class="vet-actions" style="margin-top:0.5rem">
          <a href="tel:${vet.telefono}" class="btn btn-sm btn-primary"><i class="fas fa-phone"></i> Llamar</a>
          <a href="veterinaria-detalle.html?id=${vet.id}" class="btn btn-sm btn-outline"><i class="fas fa-info-circle"></i> Detalles</a>
        </div>
      </div>`;
  });
  html += '</div>';
  const ciudadBuscar = encodeURIComponent('veterinarias en ' + (ciudad || 'Colombia'));
  html += `<div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center">
    <a href="directorio-veterinarias.html" class="btn btn-outline">
      <i class="fas fa-th-list"></i> Ver directorio completo (${typeof VET_DATABASE !== 'undefined' ? VET_DATABASE.length : 0})
    </a>
    <a href="https://www.google.com/maps/search/${ciudadBuscar}" target="_blank" rel="noopener" class="btn btn-primary">
      <i class="fas fa-map-marked-alt"></i> Buscar en Google Maps
    </a>
  </div>`;
  container.innerHTML = html;
}

function renderizarFavoritos() {
  const list = document.getElementById('vet-favorites');
  if (!list) return;
  const favs = estado.veterinariasFavoritas || [];

  if (favs.length === 0) {
    list.innerHTML = '<li class="empty-list">No tienes veterinarias favoritas</li>';
    return;
  }

  list.innerHTML = favs.map(f => `
    <li>
      <div>
        <strong>${escapeHtml(f.nombre)}</strong><br>
        <small style="color:var(--text-secondary)">${escapeHtml(f.direccion || f.ciudad || '')}</small>
      </div>
      <button class="btn-icon btn-sm" onclick="quitarFavorito('${escapeHtml(f.id || f.placeId || '')}')" title="Quitar"><i class="fas fa-heart" style="color:var(--danger)"></i></button>
    </li>
  `).join('');
}

function quitarFavorito(id) {
  if (!estado.veterinariasFavoritas) return;
  estado.veterinariasFavoritas = estado.veterinariasFavoritas.filter(f => (f.id || f.placeId) !== id);
  guardarDatos();
  renderizarFavoritos();
  mostrarToast('Eliminada de favoritos', 'info');
}

// ==================== EXPLICACIONES NUTRICIONALES ====================
function mostrarExplicacion(tipo) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const modal = document.getElementById('explanation-modal');
  const body = document.getElementById('explanation-body');
  const calorias = calcularCaloriasDiarias(pet);
  const rer = 70 * Math.pow(pet.peso, 0.75);
  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;
  const info = INFO_RAZA_DETALLADA[pet.raza];

  let html = '';

  if (tipo === 'calorias') {
    html = `
      <h4>Cálculo de calorías para ${escapeHtml(pet.nombre)}</h4>
      <p style="color:var(--text-secondary);line-height:1.8">
        <strong>1. RER (Requerimiento Energético en Reposo):</strong><br>
        Fórmula: 70 x (${pet.peso} kg)^0.75 = <strong>${Math.round(rer)} kcal</strong><br>
        <em>El exponente 0.75 refleja que el metabolismo no escala linealmente con el peso.</em><br><br>
        <strong>2. Factor de actividad (${capitalizarPrimera(pet.actividad.replace('_',' '))}):</strong> x${FACTORES_ACTIVIDAD[pet.actividad]}<br>
        ${edadMeses < 12 ? '<strong>3. Ajuste cachorro:</strong> +25% (crecimiento)<br>' : ''}
        ${edadMeses > 84 ? '<strong>3. Ajuste senior:</strong> -10% (metabolismo más lento)<br>' : ''}
        ${(pet.genero === 'castrado' || pet.genero === 'esterilizada') ? '<strong>Ajuste castrado/a:</strong> -10%<br>' : ''}
        ${parseInt(pet.condicion) >= 4 ? '<strong>Ajuste sobrepeso:</strong> -20%<br>' : ''}
        <br>
        <strong>Total recomendado: ${Math.round(calorias)} kcal/día</strong>
      </p>
      ${info ? `<div style="margin-top:1rem;padding:0.75rem;background:rgba(74,144,226,0.08);border-radius:8px;font-size:0.85rem"><strong>Nota para ${pet.raza}:</strong> ${info.nutricionEspecifica.nota}</div>` : ''}
    `;
  } else if (tipo === 'macros') {
    const macros = MACRONUTRIENTES[pet.especie];
    html = `
      <h4>Macronutrientes para ${pet.especie === 'perro' ? 'perros' : 'gatos'}</h4>
      <p style="color:var(--text-secondary);line-height:1.8">
        ${pet.especie === 'gato'
          ? 'Los gatos son <strong>carnívoros obligados</strong>. Necesitan más proteína y grasa que los perros, y mucho menos carbohidratos.'
          : 'Los perros son <strong>carnívoros facultativos</strong>. Pueden digerir carbohidratos gracias a genes desarrollados durante la domesticación.'}
        <br><br>
        <strong>Proteína (${macros.proteina.min}-${macros.proteina.max}%):</strong> Esencial para músculos, órganos y sistema inmune.<br>
        <strong>Grasa (${macros.grasa.min}-${macros.grasa.max}%):</strong> Energía concentrada (9 kcal/g), vitaminas liposolubles, ácidos grasos esenciales.<br>
        <strong>Carbohidratos (${macros.carbohidratos.min}-${macros.carbohidratos.max}%):</strong> ${pet.especie === 'gato' ? 'Mínimos, los gatos tienen capacidad limitada de procesarlos.' : 'Energía sostenida y fibra dietaria.'}
      </p>
      ${info ? `<div style="margin-top:1rem;padding:0.75rem;background:rgba(245,166,35,0.08);border-radius:8px;font-size:0.85rem"><strong>Específico para ${pet.raza}:</strong><br>Proteína: ${info.nutricionEspecifica.proteina.min}-${info.nutricionEspecifica.proteina.max}% | Grasa: ${info.nutricionEspecifica.grasa.min}-${info.nutricionEspecifica.grasa.max}%</div>` : ''}
    `;
  }

  body.innerHTML = html;
  modal.classList.remove('hidden');
}

// ==================== EXPORTAR CALENDARIO (.ics) ====================
function exportarCalendario(recordatorioId) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const recordatorio = (estado.recordatorios[pet.id] || []).find(r => r.id === recordatorioId);
  if (!recordatorio) {
    mostrarToast('Recordatorio no encontrado', 'warning');
    return;
  }

  const fecha = recordatorio.fecha || fechaHoy();
  const hora = recordatorio.hora || '09:00';
  const [h, m] = hora.split(':');
  const startDate = new Date(`${fecha}T${h}:${m}:00`);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min duración

  const formatICSDate = (d) => {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  let rrule = '';
  if (recordatorio.repetir === 'diario') rrule = 'RRULE:FREQ=DAILY\n';
  else if (recordatorio.repetir === 'semanal') rrule = 'RRULE:FREQ=WEEKLY\n';
  else if (recordatorio.repetir === 'mensual') rrule = 'RRULE:FREQ=MONTHLY\n';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PetCare Pro//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:PetCare - ${capitalizarPrimera(recordatorio.tipo)} (${pet.nombre})`,
    `DESCRIPTION:${recordatorio.nota || capitalizarPrimera(recordatorio.tipo) + ' para ' + pet.nombre}`,
    rrule ? rrule.trim() : '',
    recordatorio.alarma ? 'BEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Recordatorio PetCare\nEND:VALARM' : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(l => l).join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petcare_${recordatorio.tipo}_${pet.nombre}.ics`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Archivo .ics descargado. Ábrelo para agregar a tu calendario.', 'success');
}

// ==================== CREAR RECORDATORIO DE PESAJE ====================
function crearRecordatorioPesaje(dias) {
  const pet = obtenerMascotaActiva();
  if (!pet) {
    mostrarToast('Selecciona una mascota primero', 'warning');
    return;
  }

  // Verificar si ya existe un recordatorio de pesaje
  const existente = (estado.recordatorios[pet.id] || []).find(r => r.tipo === 'pesaje' && r.activo);
  if (existente) {
    mostrarToast('Ya tienes un recordatorio de pesaje activo', 'info');
    return;
  }

  if (!estado.recordatorios[pet.id]) estado.recordatorios[pet.id] = [];

  const repetir = dias <= 7 ? 'semanal' : dias <= 14 ? 'semanal' : 'mensual';
  estado.recordatorios[pet.id].push({
    id: generarId(),
    tipo: 'pesaje',
    hora: '09:00',
    fecha: '',
    repetir,
    nota: `Pesar a ${pet.nombre} (cada ${dias} días)`,
    alarma: true,
    activo: true,
    autoGenerado: true
  });

  guardarDatos();
  mostrarToast(`Recordatorio de pesaje creado (${repetir})`, 'success');
}

// ==================== INFO DE RAZA EN NUTRICIÓN ====================
function mostrarInfoRaza(raza) {
  const info = INFO_RAZA_DETALLADA[raza];
  const card = document.getElementById('breed-info-popup');
  if (!info) {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  document.getElementById('breed-info-title').textContent = `¿Sabías que los ${raza}...?`;
  document.getElementById('breed-info-body').innerHTML = `
    <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.75rem">${info.datosCuriosos}</p>
    <p style="font-size:0.85rem;color:var(--text-secondary)"><strong>Predisposiciones:</strong> ${info.predisposiciones.join(', ')}</p>
    <p style="font-size:0.85rem;color:var(--text-secondary)"><strong>Suplementos recomendados:</strong> ${info.suplementos.join(', ')}</p>
    <a href="educacion-nutricional.html" target="_blank" class="btn btn-sm btn-outline" style="margin-top:0.75rem">
      <i class="fas fa-graduation-cap"></i> Ver guía completa
    </a>
  `;
}
