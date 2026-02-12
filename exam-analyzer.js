// ============================================================
// PetCare Pro - Analizador Inteligente de Exámenes Médicos
// ============================================================

/**
 * Analiza un examen completo comparando con rangos de referencia
 * @param {Object} examData - Datos del examen { valores: { hemoglobina, glucosa, ... } }
 * @param {Object} petProfile - Perfil de la mascota { especie, raza, peso, ... }
 * @returns {Object} Resultado del análisis con interpretaciones
 */
function analyzeExam(examData, petProfile) {
  if (!examData || !examData.valores || !petProfile) {
    return { error: 'Datos insuficientes para el análisis' };
  }

  const especie = petProfile.especie;
  const rangos = RANGOS_REFERENCIA[especie];
  if (!rangos) return { error: 'Especie no soportada' };

  const resultados = [];
  let normales = 0, limites = 0, anormales = 0;
  const ajustesNutricionales = [];
  let requiereAtencion = false;
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};

  // Iterar dinámicamente sobre todos los valores del examen
  Object.keys(examData.valores).forEach(rawKey => {
    const valor = examData.valores[rawKey];
    if (valor === null || valor === undefined) return;

    // Normalizar key: proteinas -> proteinastotales
    const param = rawKey === 'proteinas' ? 'proteinastotales' : rawKey;
    const rango = rangos[param];

    if (!rango) {
      // Valor sin rango de referencia — registrar como sin_referencia
      const info = catalog[param] || {};
      resultados.push({
        parametro: param,
        nombre: info.nombre || param,
        valor,
        unit: info.unit || '',
        min: null,
        max: null,
        clasificacion: 'sin_referencia',
        porcentajeFuera: 0,
        descripcion: '',
        interpretacion: null
      });
      return;
    }

    const clasificacion = clasificarValor(valor, rango.min, rango.max);
    const porcentajeFuera = calcularPorcentajeFuera(valor, rango.min, rango.max);

    let interpretacion = null;
    if (clasificacion === 'normal') {
      normales++;
    } else if (clasificacion === 'limite_bajo' || clasificacion === 'limite_alto') {
      limites++;
    } else {
      anormales++;
    }

    // Obtener interpretación según si es alto o bajo
    const esAlto = valor > rango.max;
    const esBajo = valor < rango.min;
    if (esAlto && rango.interpretaciones && rango.interpretaciones.alto) {
      interpretacion = rango.interpretaciones.alto;
      if (interpretacion.nutricional) {
        ajustesNutricionales.push({
          parametro: rango.nombre,
          tipo: 'alto',
          ajuste: interpretacion.nutricional
        });
      }
      if (interpretacion.urgente) requiereAtencion = true;
    } else if (esBajo && rango.interpretaciones && rango.interpretaciones.bajo) {
      interpretacion = rango.interpretaciones.bajo;
      if (interpretacion.nutricional) {
        ajustesNutricionales.push({
          parametro: rango.nombre,
          tipo: 'bajo',
          ajuste: interpretacion.nutricional
        });
      }
      if (interpretacion.urgente) requiereAtencion = true;
    }

    resultados.push({
      parametro: param,
      nombre: rango.nombre,
      valor,
      unit: rango.unit,
      min: rango.min,
      max: rango.max,
      clasificacion,
      porcentajeFuera,
      descripcion: rango.descripcion,
      interpretacion
    });
  });

  return {
    resultados,
    resumen: { normales, limites, anormales, total: normales + limites + anormales },
    requiereAtencion,
    ajustesNutricionales,
    fecha: examData.fecha,
    tipo: examData.tipo
  };
}

/**
 * Clasifica un valor según el rango de referencia
 */
function clasificarValor(valor, min, max) {
  if (valor >= min && valor <= max) return 'normal';

  const rango = max - min;
  const margenLimite = rango * 0.1; // 10% del rango

  if (valor < min) {
    return (min - valor) <= margenLimite ? 'limite_bajo' : 'anormal_bajo';
  } else {
    return (valor - max) <= margenLimite ? 'limite_alto' : 'anormal_alto';
  }
}

/**
 * Calcula el porcentaje fuera del rango
 */
function calcularPorcentajeFuera(valor, min, max) {
  if (valor >= min && valor <= max) return 0;
  if (valor < min) return Math.round(((min - valor) / min) * 100);
  return Math.round(((valor - max) / max) * 100);
}

/**
 * Compara un examen con el examen anterior del mismo tipo
 */
function compararConAnterior(examenActual, examenes, petId) {
  if (!examenes || !examenes[petId]) return null;

  const examenesOrdenados = examenes[petId]
    .filter(e => e.id !== examenActual.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (examenesOrdenados.length === 0) return null;

  const anterior = examenesOrdenados[0];
  const comparacion = [];
  const diasDiferencia = Math.round((new Date(examenActual.fecha) - new Date(anterior.fecha)) / (1000 * 60 * 60 * 24));

  // Unión de keys de ambos exámenes
  const allKeys = new Set([
    ...Object.keys(examenActual.valores || {}),
    ...Object.keys(anterior.valores || {})
  ]);

  allKeys.forEach(rawKey => {
    // Normalizar proteinas -> proteinastotales para comparación
    const param = rawKey === 'proteinas' ? 'proteinastotales' : rawKey;
    // Buscar valor en ambos exámenes (soportar ambos keys)
    const valorActual = examenActual.valores[rawKey] !== undefined ? examenActual.valores[rawKey]
      : (rawKey === 'proteinastotales' ? examenActual.valores['proteinas'] : undefined);
    const valorAnterior = anterior.valores[rawKey] !== undefined ? anterior.valores[rawKey]
      : (rawKey === 'proteinastotales' ? anterior.valores['proteinas'] : undefined);

    if (valorActual !== null && valorActual !== undefined &&
        valorAnterior !== null && valorAnterior !== undefined) {
      const cambio = valorActual - valorAnterior;
      const porcentajeCambio = valorAnterior !== 0 ? Math.round((cambio / valorAnterior) * 100) : 0;
      let tendencia = 'estable';
      if (porcentajeCambio > 5) tendencia = 'ascendente';
      else if (porcentajeCambio < -5) tendencia = 'descendente';

      comparacion.push({
        parametro: param,
        valorAnterior,
        valorActual,
        cambio,
        porcentajeCambio,
        tendencia
      });
    }
  });

  return {
    examenAnteriorFecha: anterior.fecha,
    diasDiferencia,
    comparacion
  };
}

/**
 * Genera sugerencias nutricionales basadas en resultados de exámenes
 */
function generarSugerenciasNutricionales(analisis, petProfile) {
  if (!analisis || !analisis.ajustesNutricionales || analisis.ajustesNutricionales.length === 0) {
    return null;
  }

  const macrosBase = MACRONUTRIENTES[petProfile.especie];
  const sugerencias = {
    proteina: { min: macrosBase.proteina.min, max: macrosBase.proteina.max },
    grasa: { min: macrosBase.grasa.min, max: macrosBase.grasa.max },
    carbohidratos: { min: macrosBase.carbohidratos.min, max: macrosBase.carbohidratos.max },
    razones: [],
    ajustado: false
  };

  analisis.ajustesNutricionales.forEach(ajuste => {
    if (ajuste.ajuste && ajuste.ajuste.ajuste) {
      const a = ajuste.ajuste.ajuste;
      if (a.proteina) {
        sugerencias.proteina = a.proteina;
        sugerencias.ajustado = true;
        sugerencias.razones.push(`Proteína ajustada por ${ajuste.parametro} ${ajuste.tipo === 'alto' ? 'elevada' : 'baja'}: ${a.proteina.min}-${a.proteina.max}%`);
      }
      if (a.grasa) {
        sugerencias.grasa = a.grasa;
        sugerencias.ajustado = true;
        sugerencias.razones.push(`Grasa ajustada por ${ajuste.parametro} ${ajuste.tipo === 'alto' ? 'elevada' : 'baja'}: ${a.grasa.min}-${a.grasa.max}%`);
      }
      if (a.carbohidratos) {
        sugerencias.carbohidratos = a.carbohidratos;
        sugerencias.ajustado = true;
        sugerencias.razones.push(`Carbohidratos ajustados por ${ajuste.parametro} ${ajuste.tipo === 'alto' ? 'elevada' : 'baja'}: ${a.carbohidratos.min}-${a.carbohidratos.max}%`);
      }
    }
  });

  return sugerencias;
}

/**
 * Renderiza el análisis de un examen en HTML
 */
function renderizarAnalisisExamen(analisis, comparacion) {
  if (!analisis || analisis.error) return '<p>No se pudo realizar el análisis</p>';

  let html = '';

  // Si no hay resultados (todos los valores son null)
  if (!analisis.resultados || analisis.resultados.length === 0) {
    html += `
      <div class="exam-no-values-msg" style="padding:1rem;background:var(--bg-secondary);border-radius:8px;text-align:center">
        <i class="fas fa-info-circle" style="font-size:2rem;color:var(--primary);margin-bottom:0.5rem;display:block"></i>
        <p style="margin-bottom:0.5rem"><strong>No hay valores numéricos para analizar</strong></p>
        <p style="font-size:0.85rem;color:var(--text-secondary)">Para que el análisis inteligente funcione, necesitas ingresar los valores del examen en los campos numéricos al registrar el examen, o subir un PDF para extracción automática.</p>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem">Si subiste un PDF y no se extrajeron automáticamente, puedes editar los valores manualmente.</p>
      </div>`;
    return html;
  }

  // Alerta urgente
  if (analisis.requiereAtencion) {
    html += `
      <div class="alert alert-danger" style="margin-bottom:1rem">
        <i class="fas fa-exclamation-triangle"></i>
        <strong>Este examen tiene valores que requieren atención veterinaria</strong>
        <a href="directorio-veterinarias.html" class="btn btn-sm btn-danger" style="margin-left:1rem">
          <i class="fas fa-search"></i> Encontrar veterinario
        </a>
      </div>`;
  }

  // Resumen
  const { normales, limites, anormales } = analisis.resumen;
  html += `
    <div class="exam-analysis-summary">
      <span class="analysis-badge normal">${normales} normales</span>
      <span class="analysis-badge limite">${limites} en el límite</span>
      <span class="analysis-badge anormal">${anormales} anormales</span>
    </div>`;

  // Agrupar resultados por categoría
  const catalog = typeof PARAM_CATALOG !== 'undefined' ? PARAM_CATALOG : {};
  const catLabels = typeof CATEGORIAS_LABEL !== 'undefined' ? CATEGORIAS_LABEL : {};
  const porCategoria = {};
  analisis.resultados.forEach(r => {
    const cat = (catalog[r.parametro] || {}).categoria || 'otros';
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(r);
  });

  const renderParam = (r) => {
    const isSinRef = r.clasificacion === 'sin_referencia';
    const statusIcon = isSinRef ? 'question-circle'
      : r.clasificacion === 'normal' ? 'check-circle'
      : r.clasificacion.includes('limite') ? 'exclamation-circle'
      : 'times-circle';
    const statusColor = isSinRef ? 'var(--text-secondary)'
      : r.clasificacion === 'normal' ? 'var(--success)'
      : r.clasificacion.includes('limite') ? 'var(--warning)'
      : 'var(--danger)';
    const statusClass = isSinRef ? 'sin_referencia'
      : r.clasificacion === 'normal' ? 'normal'
      : r.clasificacion.includes('limite') ? 'limite'
      : 'anormal';

    let paramHtml = `
      <div class="exam-param-card ${statusClass}">
        <div class="exam-param-header" onclick="this.parentElement.classList.toggle('expanded')">
          <div class="exam-param-title">
            <i class="fas fa-${statusIcon}" style="color:${statusColor}"></i>
            <strong>${r.nombre}</strong>
          </div>
          <div class="exam-param-value">
            <span>${r.valor} ${r.unit}</span>
            ${isSinRef ? '<small>(Sin referencia)</small>' : `<small>(Normal: ${r.min}-${r.max})</small>`}
          </div>
          <i class="fas fa-chevron-down exam-param-chevron"></i>
        </div>
        <div class="exam-param-body">
          ${r.descripcion ? `<p class="exam-param-desc">${r.descripcion}</p>` : ''}`;

    if (r.porcentajeFuera > 0) {
      const direccion = r.valor > r.max ? 'por encima' : 'por debajo';
      paramHtml += `<p class="exam-param-pct"><strong>Valor ${r.porcentajeFuera}% ${direccion} del rango normal</strong></p>`;
    }

    if (r.interpretacion) {
      paramHtml += `
          <div class="exam-interp">
            <h5>Posibles causas:</h5>
            <ul>${r.interpretacion.causas.map(c => `<li>${c}</li>`).join('')}</ul>
            <h5>Recomendaciones:</h5>
            <ul>${r.interpretacion.recomendaciones.map(rec => `<li>${rec}</li>`).join('')}</ul>
          </div>`;
    }

    paramHtml += `
        </div>
      </div>`;
    return paramHtml;
  };

  // Renderizar agrupado por categoría
  Object.keys(porCategoria).forEach(cat => {
    const label = catLabels[cat] || cat;
    html += `<div class="exam-analysis-category"><h5 class="exam-category-title"><i class="fas fa-layer-group"></i> ${label}</h5>`;
    porCategoria[cat].forEach(r => {
      html += renderParam(r);
    });
    html += '</div>';
  });

  // Comparación con anterior
  if (comparacion && comparacion.comparacion.length > 0) {
    const meses = Math.round(comparacion.diasDiferencia / 30);
    const tiempoTexto = meses > 0 ? `hace ${meses} meses` : `hace ${comparacion.diasDiferencia} días`;
    html += `
      <div class="exam-comparison-section">
        <h4><i class="fas fa-chart-line"></i> Comparación con examen anterior (${tiempoTexto})</h4>
        <div class="exam-comparison-grid">`;

    comparacion.comparacion.forEach(c => {
      const flechaIcon = c.tendencia === 'ascendente' ? 'arrow-up' : c.tendencia === 'descendente' ? 'arrow-down' : 'arrows-alt-h';
      const flechaColor = c.tendencia === 'estable' ? 'var(--success)' : 'var(--warning)';
      const signo = c.porcentajeCambio > 0 ? '+' : '';

      html += `
          <div class="comparison-item">
            <span class="comp-param">${capitalizarPrimera(c.parametro)}</span>
            <span class="comp-values">${c.valorAnterior} → ${c.valorActual}</span>
            <span class="comp-trend" style="color:${flechaColor}">
              <i class="fas fa-${flechaIcon}"></i> ${signo}${c.porcentajeCambio}%
            </span>
          </div>`;
    });

    html += `
        </div>
      </div>`;
  }

  return html;
}

/**
 * Genera alertas para el dashboard basadas en exámenes
 */
function generarAlertasExamenes(pet, examenes) {
  const alertas = [];
  const petExams = examenes[pet.id] || [];

  if (petExams.length === 0) return alertas;

  // Verificar si el último examen tiene valores anormales
  const ultimoExamen = petExams.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  const analisis = analyzeExam(ultimoExamen, pet);

  if (analisis.requiereAtencion) {
    alertas.push({
      tipo: 'danger',
      titulo: 'Examen requiere atención',
      mensaje: `El examen de ${ultimoExamen.tipo} (${formatearFecha(ultimoExamen.fecha)}) tiene ${analisis.resumen.anormales} valores anormales que requieren consulta veterinaria.`,
      accion: 'Ver análisis completo',
      seccion: 'examenes'
    });
  } else if (analisis.resumen.limites > 0) {
    alertas.push({
      tipo: 'warning',
      titulo: 'Valores en el límite',
      mensaje: `El último examen tiene ${analisis.resumen.limites} valores en el límite. Monitorear de cerca.`,
      accion: 'Ver detalles',
      seccion: 'examenes'
    });
  }

  // Verificar si han pasado más de 12 meses
  const diffMeses = (new Date() - new Date(ultimoExamen.fecha)) / (1000 * 60 * 60 * 24 * 30);
  if (diffMeses > 12) {
    alertas.push({
      tipo: 'info',
      titulo: 'Chequeo pendiente',
      mensaje: `Han pasado ${Math.round(diffMeses)} meses desde el último examen. Se recomienda un chequeo anual.`,
      accion: 'Registrar examen',
      seccion: 'examenes'
    });
  }

  return alertas;
}

/**
 * Genera recordatorios condicionales basados en resultados de exámenes
 */
function generarRecordatoriosCondicionales(analisis, petProfile) {
  const recordatorios = [];
  if (!analisis || !analisis.resultados) return recordatorios;

  analisis.resultados.forEach(r => {
    if (r.clasificacion.includes('anormal') && r.max !== null) {
      const esAlto = r.valor > r.max;
      const esBajo = r.valor < r.min;

      // Glucosa alta -> repetir en 2 semanas
      if (r.parametro === 'glucosa' && esAlto) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 14);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Repetir examen de glucosa para ${petProfile.nombre}`,
          descripcion: 'Glucosa elevada en último examen. Repetir en ayunas de 12h.',
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }

      // Creatinina alta -> control renal en 1 mes
      if (r.parametro === 'creatinina' && esAlto) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 30);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Control renal para ${petProfile.nombre}`,
          descripcion: 'Creatinina elevada. Monitorear función renal.',
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }

      // ALT o AST alta -> control hepático en 3 semanas
      if ((r.parametro === 'alt' || r.parametro === 'ast') && esAlto) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 21);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Control hepático para ${petProfile.nombre}`,
          descripcion: `${r.nombre} elevada. Monitorear función hepática.`,
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }

      // Leucocitos anormales -> control en 1 semana
      if (r.parametro === 'leucocitos') {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 7);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Control de leucocitos para ${petProfile.nombre}`,
          descripcion: `Leucocitos ${esAlto ? 'elevados (posible infección)' : 'bajos (posible inmunosupresión)'}. Repetir hemograma.`,
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }

      // BUN alta -> control renal en 3 semanas
      if (r.parametro === 'bun' && esAlto) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 21);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Control de BUN para ${petProfile.nombre}`,
          descripcion: 'BUN elevado. Monitorear función renal junto con creatinina.',
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }

      // Potasio anormal -> urgente en 3 días
      if (r.parametro === 'potasio') {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 3);
        recordatorios.push({
          tipo: 'examen',
          titulo: `Control urgente de potasio para ${petProfile.nombre}`,
          descripcion: `Potasio ${esAlto ? 'elevado (riesgo cardíaco)' : 'bajo (riesgo muscular)'}. Control urgente.`,
          fecha: fecha.toISOString().split('T')[0],
          hora: '09:00',
          intensidad: 'intensivo'
        });
      }
    }
  });

  return recordatorios;
}

console.log('exam-analyzer.js cargado correctamente');
