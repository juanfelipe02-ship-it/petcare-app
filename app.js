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
  tema: 'light'
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  inicializarUI();
  setTimeout(() => {
    document.getElementById('app-loader').classList.add('hidden');
  }, 600);
});

function inicializarUI() {
  // Tema
  aplicarTema(estado.tema);
  document.getElementById('theme-toggle').addEventListener('click', toggleTema);
  document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    estado.tema = e.target.checked ? 'dark' : 'light';
    aplicarTema(estado.tema);
    guardarDatos();
  });

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

  // Llenar alimentos en seguimiento
  const mealFoodSelect = document.getElementById('meal-food-type');
  Object.keys(ALIMENTOS_CALORIAS).forEach(alimento => {
    const opt = document.createElement('option');
    opt.value = alimento;
    opt.textContent = `${alimento} (${ALIMENTOS_CALORIAS[alimento]} kcal/100g)`;
    mealFoodSelect.appendChild(opt);
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
function guardarDatos() {
  try {
    localStorage.setItem('petcare_data', JSON.stringify(estado));
  } catch(e) {
    mostrarToast('Error al guardar datos', 'error');
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
            tema: estado.tema
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

function guardarMascota(e) {
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

function guardarExamen(e) {
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

  const examen = {
    id: generarId(),
    fecha,
    tipo,
    veterinario: document.getElementById('exam-vet').value.trim(),
    resultados,
    valores: {
      hemoglobina: parseFloat(document.getElementById('exam-hemoglobina').value) || null,
      glucosa: parseFloat(document.getElementById('exam-glucosa').value) || null,
      creatinina: parseFloat(document.getElementById('exam-creatinina').value) || null,
      alt: parseFloat(document.getElementById('exam-alt').value) || null,
      proteinas: parseFloat(document.getElementById('exam-proteinas').value) || null
    },
    observaciones: document.getElementById('exam-observations').value.trim(),
    archivo: document.getElementById('exam-file').value.trim(),
    ajusteNutricional: document.getElementById('exam-nutrition-adjust').checked
  };

  if (!estado.examenes[pet.id]) estado.examenes[pet.id] = [];
  estado.examenes[pet.id].push(examen);
  guardarDatos();
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

  const refs = VALORES_REFERENCIA[pet.especie];
  listEl.innerHTML = examenes.map(ex => {
    const badges = [];
    Object.keys(ex.valores).forEach(key => {
      const val = ex.valores[key];
      if (val !== null && refs[key]) {
        const ref = refs[key];
        const isNormal = val >= ref.min && val <= ref.max;
        badges.push(`<span class="exam-value-badge ${isNormal ? 'normal' : 'abnormal'}">${ref.nombre.split(' ')[0]}: ${val} ${ref.unidad} ${isNormal ? '✓' : '⚠'}</span>`);
      }
    });

    return `
      <div class="exam-card">
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
        ${badges.length > 0 ? `<div class="exam-values">${badges.join('')}</div>` : ''}
        ${ex.observaciones ? `<p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem"><strong>Obs:</strong> ${escapeHtml(ex.observaciones)}</p>` : ''}
        ${ex.archivo ? `<a href="${escapeHtml(ex.archivo)}" target="_blank" rel="noopener" style="font-size:0.8rem;color:var(--primary)"><i class="fas fa-file"></i> Ver archivo</a>` : ''}
        <div style="margin-top:0.5rem;text-align:right">
          <button class="btn btn-sm btn-secondary" onclick="eliminarExamen('${pet.id}','${ex.id}')"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

function eliminarExamen(petId, examId) {
  mostrarConfirmacion('Eliminar examen', '¿Eliminar este examen?', () => {
    estado.examenes[petId] = (estado.examenes[petId] || []).filter(e => e.id !== examId);
    guardarDatos();
    renderizarExamenes();
    mostrarToast('Examen eliminado', 'info');
  });
}

function tieneValoresAnormales(examen, especie) {
  const refs = VALORES_REFERENCIA[especie];
  if (!refs) return false;
  return Object.keys(examen.valores).some(key => {
    const val = examen.valores[key];
    if (val === null) return false;
    const ref = refs[key];
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
  if (frecData) {
    document.getElementById('nutri-frequency').innerHTML = `
      <p class="freq-main">${frecData.frecuencia}</p>
      <p>Etapa: ${frecData.nota}</p>
      <p>Edad: ${pet.edadAnios} años ${pet.edadMeses} meses (${edadMeses} meses)</p>
    `;
  }

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
}

function calcularPorciones() {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  const calorias = calcularCaloriasDiarias(pet);
  const calPor100g = parseInt(document.getElementById('portion-food-type').value) || 350;
  const grams = (calorias / calPor100g) * 100;
  const tazas = grams / 240;

  const edadMeses = (pet.edadAnios * 12) + pet.edadMeses;
  const frecData = FRECUENCIA_ALIMENTACION[pet.especie].find(f => edadMeses >= f.edadMin && edadMeses < f.edadMax);
  const comidas = frecData ? parseInt(frecData.frecuencia) || 2 : 2;

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

  // Peso
  const pesosArr = estado.pesos[pet.id] || [];
  if (pesosArr.length > 0) {
    const ultimoPeso = pesosArr[pesosArr.length - 1];
    const razaInfo = RAZAS[pet.especie].find(r => r.nombre === pet.raza);
    let compHtml = `<p>Último peso registrado: <strong>${ultimoPeso.peso} kg</strong> (${formatearFecha(ultimoPeso.fecha)})</p>`;
    if (razaInfo) {
      compHtml += `<p>Peso ideal para ${pet.raza}: <strong>${razaInfo.pesoIdeal.min} - ${razaInfo.pesoIdeal.max} kg</strong></p>`;
      if (ultimoPeso.peso < razaInfo.pesoIdeal.min) {
        compHtml += `<p style="color:var(--warning)">⚠ Por debajo del peso ideal</p>`;
      } else if (ultimoPeso.peso > razaInfo.pesoIdeal.max) {
        compHtml += `<p style="color:var(--danger)">⚠ Por encima del peso ideal</p>`;
      } else {
        compHtml += `<p style="color:var(--success)">✓ Dentro del rango ideal</p>`;
      }
    }
    document.getElementById('weight-comparison').innerHTML = compHtml;
  } else {
    document.getElementById('weight-comparison').innerHTML = '<p style="color:var(--text-secondary)">No hay registros de peso</p>';
  }

  // Gráficos
  renderizarGraficoCalSemanal(pet);
  renderizarGraficoPeso(pet);
  renderizarHistorial7Dias(pet);
}

function registrarComida(e) {
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

  const calPor100g = ALIMENTOS_CALORIAS[tipo] || 0;
  const calorias = (calPor100g / 100) * gramos;

  const hoy = fechaHoy();
  if (!estado.comidas[pet.id]) estado.comidas[pet.id] = {};
  if (!estado.comidas[pet.id][hoy]) estado.comidas[pet.id][hoy] = [];

  estado.comidas[pet.id][hoy].push({ hora, tipo, marca, gramos, calorias });
  guardarDatos();

  document.getElementById('meal-form').reset();
  const now = new Date();
  document.getElementById('meal-time').value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  renderizarSeguimiento();
  mostrarToast('Comida registrada', 'success');
}

function eliminarComida(fecha, idx) {
  const pet = obtenerMascotaActiva();
  if (!pet) return;
  if (estado.comidas[pet.id]?.[fecha]) {
    estado.comidas[pet.id][fecha].splice(idx, 1);
    guardarDatos();
    renderizarSeguimiento();
  }
}

function registrarAgua(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const ml = parseInt(document.getElementById('water-ml').value);
  if (!ml || ml <= 0) return;

  const hoy = fechaHoy();
  if (!estado.agua[pet.id]) estado.agua[pet.id] = {};
  estado.agua[pet.id][hoy] = (estado.agua[pet.id][hoy] || 0) + ml;
  guardarDatos();

  document.getElementById('water-ml').value = '';
  renderizarSeguimiento();
  mostrarToast(`+${ml} ml de agua registrado`, 'success');
}

function registrarPeso(e) {
  e.preventDefault();
  const pet = obtenerMascotaActiva();
  if (!pet) return;

  const peso = parseFloat(document.getElementById('weight-kg').value);
  if (!peso || peso <= 0) return;

  if (!estado.pesos[pet.id]) estado.pesos[pet.id] = [];

  const hoy = fechaHoy();
  // Reemplazar si ya hay registro de hoy
  const idxHoy = estado.pesos[pet.id].findIndex(p => p.fecha === hoy);
  if (idxHoy !== -1) {
    estado.pesos[pet.id][idxHoy].peso = peso;
  } else {
    estado.pesos[pet.id].push({ fecha: hoy, peso });
  }

  // Actualizar peso de la mascota
  const petIdx = estado.mascotas.findIndex(p => p.id === pet.id);
  if (petIdx !== -1) estado.mascotas[petIdx].peso = peso;

  guardarDatos();
  document.getElementById('weight-kg').value = '';
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
  if (!tipo || !hora) {
    mostrarToast('Completa los campos obligatorios', 'warning');
    return;
  }

  const recordatorio = {
    id: generarId(),
    tipo,
    hora,
    repetir: document.getElementById('reminder-repeat').value,
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
            <strong>${capitalizarPrimera(r.tipo)}</strong>
            <span>${r.hora} · ${capitalizarPrimera(r.repetir)} ${r.nota ? '· ' + escapeHtml(r.nota) : ''}</span>
          </div>
        </div>
        <button class="btn-icon btn-sm" onclick="eliminarRecordatorio('${r.id}')" title="Eliminar"><i class="fas fa-trash" style="color:var(--danger)"></i></button>
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

  const recordatorios = estado.recordatorios[pet.id] || [];
  recordatorios.forEach(r => {
    if (r.activo && r.hora === horaActual && r.alarma) {
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
  ['perro', 'gato'].forEach(especie => {
    const tbody = document.getElementById(`ref-table-${especie}`);
    const refs = VALORES_REFERENCIA[especie];
    tbody.innerHTML = Object.keys(refs).map(key => {
      const r = refs[key];
      return `<tr><td>${r.nombre}</td><td>${r.min}</td><td>${r.max}</td><td>${r.unidad}</td></tr>`;
    }).join('');
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
    cerrarModal();
    if (modalCallback) modalCallback();
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
