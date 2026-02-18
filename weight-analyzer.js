// ============================================================
// PetCare Pro - Analizador Inteligente de Peso
// ============================================================

/**
 * Detecta la tendencia de peso basada en los últimos registros
 * @param {Array} weightHistory - Array de { fecha, peso, ... }
 * @returns {Object} Tendencia con tasa de cambio
 */
function detectTrend(weightHistory) {
  if (!weightHistory || weightHistory.length < 2) {
    return { tendencia: 'insuficiente', mensaje: 'Se necesitan al menos 2 registros para detectar tendencia' };
  }

  // Ordenar por fecha
  const sorted = [...weightHistory].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ultimos = sorted.slice(-6); // Últimos 6 registros

  if (ultimos.length < 2) {
    return { tendencia: 'insuficiente', mensaje: 'Datos insuficientes' };
  }

  // Calcular cambio total y tasa
  const primero = ultimos[0];
  const ultimo = ultimos[ultimos.length - 1];
  const cambioTotal = ultimo.peso - primero.peso;
  const diasDiff = (new Date(ultimo.fecha) - new Date(primero.fecha)) / (1000 * 60 * 60 * 24);

  if (diasDiff === 0) {
    return { tendencia: 'estable', cambioSemanal: 0, cambioMensual: 0, mensaje: 'Registros del mismo día' };
  }

  const cambioSemanal = (cambioTotal / diasDiff) * 7;
  const cambioMensual = (cambioTotal / diasDiff) * 30;
  const porcentajeCambio = primero.peso > 0 ? (cambioTotal / primero.peso) * 100 : 0;

  let tendencia, esPreocupante;

  if (Math.abs(cambioMensual) < 0.1) {
    tendencia = 'estable';
    esPreocupante = false;
  } else if (cambioMensual > 0) {
    tendencia = 'ascendente';
    // Preocupante si gana más de 0.8kg en 2 semanas (para perros medianos)
    esPreocupante = cambioSemanal > 0.4;
  } else {
    tendencia = 'descendente';
    // Preocupante si pierde más de 0.5kg por semana
    esPreocupante = Math.abs(cambioSemanal) > 0.5;
  }

  return {
    tendencia,
    cambioTotal: parseFloat(cambioTotal.toFixed(2)),
    cambioSemanal: parseFloat(cambioSemanal.toFixed(2)),
    cambioMensual: parseFloat(cambioMensual.toFixed(2)),
    porcentajeCambio: parseFloat(porcentajeCambio.toFixed(1)),
    esPreocupante,
    diasAnalisis: Math.round(diasDiff),
    registrosAnalizados: ultimos.length
  };
}

/**
 * Predice el peso ideal basado en raza y edad
 */
function predictIdealWeight(raza, edadMeses) {
  // Prioridad 1: INFO_RAZA_DETALLADA con interpolación lineal
  if (typeof INFO_RAZA_DETALLADA !== 'undefined' && INFO_RAZA_DETALLADA[raza]) {
    const info = INFO_RAZA_DETALLADA[raza];
    const puntos = info.pesoSaludablePorEdad;
    if (puntos && puntos.length > 0) {
      const especie = info.especie;
      const edadSenior = especie === 'perro' ? 84 : 120;

      // Determinar etapa
      let etapa;
      if (especie === 'perro') {
        if (edadMeses <= 2) etapa = 'cachorro';
        else if (edadMeses <= 6) etapa = 'cachorro';
        else if (edadMeses <= 12) etapa = 'juvenil';
        else if (edadMeses <= 18) etapa = 'adulto joven';
        else if (edadMeses >= edadSenior) etapa = 'senior';
        else etapa = 'adulto';
      } else {
        if (edadMeses <= 3) etapa = 'cachorro';
        else if (edadMeses <= 6) etapa = 'cachorro';
        else if (edadMeses <= 12) etapa = 'juvenil';
        else if (edadMeses >= edadSenior) etapa = 'senior';
        else etapa = 'adulto';
      }

      let min, max;
      const ultimo = puntos[puntos.length - 1];

      if (edadMeses <= puntos[0].edadMeses) {
        // Antes del primer punto: extrapolar desde 0
        const p = puntos[0];
        const factor = edadMeses / p.edadMeses;
        min = parseFloat((p.min * factor).toFixed(1));
        max = parseFloat((p.max * factor).toFixed(1));
      } else if (edadMeses >= ultimo.edadMeses) {
        // Después del último punto: usar último valor (peso adulto)
        min = ultimo.min;
        max = ultimo.max;
      } else {
        // Interpolación lineal entre los dos puntos más cercanos
        let inferior = puntos[0], superior = puntos[1];
        for (let i = 0; i < puntos.length - 1; i++) {
          if (edadMeses >= puntos[i].edadMeses && edadMeses <= puntos[i + 1].edadMeses) {
            inferior = puntos[i];
            superior = puntos[i + 1];
            break;
          }
        }
        const t = (edadMeses - inferior.edadMeses) / (superior.edadMeses - inferior.edadMeses);
        min = parseFloat((inferior.min + t * (superior.min - inferior.min)).toFixed(1));
        max = parseFloat((inferior.max + t * (superior.max - inferior.max)).toFixed(1));
      }

      return {
        min,
        max,
        ideal: parseFloat(((min + max) / 2).toFixed(1)),
        etapa,
        fuente: 'literatura'
      };
    }
  }

  // Prioridad 2: RANGOS_PESO_RAZA
  const rangoRaza = typeof RANGOS_PESO_RAZA !== 'undefined' ? RANGOS_PESO_RAZA[raza] : null;

  if (rangoRaza) {
    let rangoEdad, etapa;
    if (edadMeses <= 3) { rangoEdad = rangoRaza.pesoIdeal['3meses']; etapa = 'cachorro (0-3m)'; }
    else if (edadMeses <= 6) { rangoEdad = rangoRaza.pesoIdeal['6meses']; etapa = 'cachorro (3-6m)'; }
    else if (edadMeses <= 12) { rangoEdad = rangoRaza.pesoIdeal['12meses']; etapa = 'juvenil (6-12m)'; }
    else { rangoEdad = rangoRaza.pesoIdeal['adulto']; etapa = 'adulto'; }

    if (rangoEdad) {
      return {
        min: rangoEdad.min,
        max: rangoEdad.max,
        ideal: (rangoEdad.min + rangoEdad.max) / 2,
        percentiles: rangoRaza.percentiles || null,
        etapa,
        fuente: 'detallada'
      };
    }
  }

  // Prioridad 3: RAZAS genérico con factor de escala
  if (typeof RAZAS !== 'undefined') {
    for (const especie of ['perro', 'gato']) {
      const razaData = RAZAS[especie].find(r => r.nombre === raza);
      if (razaData) {
        const pesoAdultoMin = razaData.pesoIdeal.min;
        const pesoAdultoMax = razaData.pesoIdeal.max;
        let factor, etapa;

        if (especie === 'perro') {
          if (edadMeses <= 1) { factor = 0.10; etapa = 'neonato (0-1m)'; }
          else if (edadMeses <= 2) { factor = 0.20; etapa = 'cachorro (1-2m)'; }
          else if (edadMeses <= 3) { factor = 0.30; etapa = 'cachorro (2-3m)'; }
          else if (edadMeses <= 4) { factor = 0.40; etapa = 'cachorro (3-4m)'; }
          else if (edadMeses <= 6) { factor = 0.55; etapa = 'cachorro (4-6m)'; }
          else if (edadMeses <= 8) { factor = 0.70; etapa = 'juvenil (6-8m)'; }
          else if (edadMeses <= 10) { factor = 0.80; etapa = 'juvenil (8-10m)'; }
          else if (edadMeses <= 12) { factor = 0.90; etapa = 'juvenil (10-12m)'; }
          else if (edadMeses <= 18) { factor = 0.95; etapa = 'adulto joven'; }
          else if (edadMeses > 84) { factor = 1.0; etapa = 'senior'; }
          else { factor = 1.0; etapa = 'adulto'; }
        } else {
          if (edadMeses <= 1) { factor = 0.12; etapa = 'neonato (0-1m)'; }
          else if (edadMeses <= 2) { factor = 0.25; etapa = 'cachorro (1-2m)'; }
          else if (edadMeses <= 3) { factor = 0.35; etapa = 'cachorro (2-3m)'; }
          else if (edadMeses <= 4) { factor = 0.50; etapa = 'cachorro (3-4m)'; }
          else if (edadMeses <= 6) { factor = 0.65; etapa = 'cachorro (4-6m)'; }
          else if (edadMeses <= 9) { factor = 0.80; etapa = 'juvenil (6-9m)'; }
          else if (edadMeses <= 12) { factor = 0.90; etapa = 'juvenil (9-12m)'; }
          else if (edadMeses > 120) { factor = 1.0; etapa = 'senior'; }
          else { factor = 1.0; etapa = 'adulto'; }
        }

        const margen = edadMeses < 6 ? 0.25 : edadMeses < 12 ? 0.15 : 0;
        const minEscalado = parseFloat((pesoAdultoMin * factor * (1 - margen)).toFixed(1));
        const maxEscalado = parseFloat((pesoAdultoMax * factor * (1 + margen)).toFixed(1));

        return {
          min: minEscalado,
          max: maxEscalado,
          ideal: parseFloat(((minEscalado + maxEscalado) / 2).toFixed(1)),
          etapa,
          fuente: 'estimada'
        };
      }
    }
  }
  return null;
}

/**
 * Compara el peso actual con percentiles de la raza
 */
function compareWithPercentiles(peso, raza, edadMeses) {
  const prediccion = predictIdealWeight(raza, edadMeses);
  if (!prediccion) return null;

  const resultado = {
    pesoActual: peso,
    rangoIdeal: { min: prediccion.min, max: prediccion.max },
    etapa: prediccion.etapa,
    estado: 'normal'
  };

  // Determinar estado
  const rangoMargen = (prediccion.max - prediccion.min) * 0.05; // 5% de margen
  if (peso < prediccion.min - rangoMargen) {
    resultado.estado = 'bajo_peso';
    resultado.diferencia = parseFloat((prediccion.min - peso).toFixed(1));
    resultado.mensaje = `${resultado.diferencia}kg por debajo del peso mínimo ideal`;
  } else if (peso > prediccion.max + rangoMargen) {
    resultado.estado = 'sobrepeso';
    resultado.diferencia = parseFloat((peso - prediccion.max).toFixed(1));
    resultado.mensaje = `${resultado.diferencia}kg por encima del peso máximo ideal`;
  } else {
    resultado.mensaje = 'Dentro del rango ideal';
  }

  // Calcular percentil aproximado si hay datos
  if (prediccion.percentiles) {
    const { p25, p50, p75 } = prediccion.percentiles;
    if (peso <= p25) resultado.percentil = Math.round((peso / p25) * 25);
    else if (peso <= p50) resultado.percentil = 25 + Math.round(((peso - p25) / (p50 - p25)) * 25);
    else if (peso <= p75) resultado.percentil = 50 + Math.round(((peso - p50) / (p75 - p50)) * 25);
    else resultado.percentil = 75 + Math.round(((peso - p75) / (p75 * 0.3)) * 25);
    resultado.percentil = Math.min(Math.max(resultado.percentil, 1), 99);
  }

  return resultado;
}

/**
 * Genera alertas de peso inteligentes
 */
function generarAlertasPeso(pet, pesos) {
  const alertas = [];
  const pesosArr = pesos[pet.id] || [];
  if (pesosArr.length === 0) return alertas;

  const sorted = [...pesosArr].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ultimo = sorted[sorted.length - 1];

  // Tendencia
  const tendencia = detectTrend(sorted);

  if (tendencia.esPreocupante && tendencia.tendencia === 'ascendente') {
    alertas.push({
      tipo: 'warning',
      icono: 'weight',
      titulo: 'Ganancia de peso rápida',
      mensaje: `${pet.nombre} está ganando peso rápido (${tendencia.cambioMensual > 0 ? '+' : ''}${tendencia.cambioMensual}kg/mes). Revisa las porciones de comida.`,
      accion: 'Revisar plan nutricional'
    });
  }

  if (tendencia.esPreocupante && tendencia.tendencia === 'descendente') {
    alertas.push({
      tipo: 'danger',
      icono: 'weight',
      titulo: 'Pérdida de peso no planificada',
      mensaje: `${pet.nombre} está perdiendo peso (${tendencia.cambioMensual}kg/mes). Si no está en plan de pérdida, consulta al veterinario.`,
      accion: 'Consultar veterinario'
    });
  }

  // Verificar si falta registro
  const diasSinRegistro = (new Date() - new Date(ultimo.fecha)) / (1000 * 60 * 60 * 24);
  const edadMeses = typeof obtenerEdadActual === 'function' ? obtenerEdadActual(pet).totalMeses : (pet.edadAnios * 12) + (pet.edadMeses || 0);
  let frecuenciaRecomendada = 30; // Mensual por defecto
  if (edadMeses < 6) frecuenciaRecomendada = 7;
  else if (edadMeses < 12) frecuenciaRecomendada = 14;
  else if (edadMeses > 84) frecuenciaRecomendada = 14;

  if (diasSinRegistro > frecuenciaRecomendada * 1.5) {
    alertas.push({
      tipo: 'info',
      icono: 'calendar-check',
      titulo: 'Registro de peso pendiente',
      mensaje: `Han pasado ${Math.round(diasSinRegistro)} días sin registrar peso de ${pet.nombre}.`,
      accion: 'Registrar peso'
    });
  }

  // Comparación con raza
  const razaPeso = typeof obtenerRazaParaPeso === 'function' ? obtenerRazaParaPeso(pet) : pet.raza;
  const comp = compareWithPercentiles(ultimo.peso, razaPeso, edadMeses);
  if (comp && comp.estado === 'sobrepeso') {
    alertas.push({
      tipo: 'warning',
      icono: 'balance-scale',
      titulo: 'Por encima del peso ideal',
      mensaje: `${pet.nombre} pesa ${comp.diferencia}kg más del rango ideal para su raza.`,
      accion: 'Ver plan de peso'
    });
  } else if (comp && comp.estado === 'bajo_peso') {
    alertas.push({
      tipo: 'warning',
      icono: 'balance-scale',
      titulo: 'Por debajo del peso ideal',
      mensaje: `${pet.nombre} pesa ${comp.diferencia}kg menos del mínimo ideal para su raza.`,
      accion: 'Consultar veterinario'
    });
  }

  // Verificar cambios en energía/apetito
  if (sorted.length >= 2) {
    const penultimo = sorted[sorted.length - 2];
    if (ultimo.energia && penultimo.energia && ultimo.energia < penultimo.energia - 1) {
      alertas.push({
        tipo: 'warning',
        icono: 'bolt',
        titulo: 'Disminución de energía detectada',
        mensaje: `El nivel de energía de ${pet.nombre} ha bajado. Monitorea de cerca.`,
        accion: 'Registrar observaciones'
      });
    }
    if (ultimo.apetito && penultimo.apetito && ultimo.apetito < penultimo.apetito - 1) {
      alertas.push({
        tipo: 'warning',
        icono: 'utensils',
        titulo: 'Disminución de apetito',
        mensaje: `${pet.nombre} parece estar comiendo menos. Si persiste, consulta al veterinario.`,
        accion: 'Monitorear'
      });
    }
  }

  return alertas;
}

/**
 * Sugiere frecuencia de pesaje según edad
 */
function sugerirFrecuenciaPesaje(edadMeses, enPlanPerdida) {
  if (enPlanPerdida) {
    return { frecuencia: 'semanal', dias: 7, mensaje: 'Recomendado: Pesar SEMANALMENTE (plan de pérdida de peso activo)', icono: 'calendar-week' };
  }
  if (edadMeses < 6) {
    return { frecuencia: 'semanal', dias: 7, mensaje: 'Recomendado: Pesar SEMANALMENTE (cachorro en crecimiento rápido)', icono: 'calendar-week' };
  }
  if (edadMeses < 12) {
    return { frecuencia: 'quincenal', dias: 14, mensaje: 'Recomendado: Pesar QUINCENALMENTE (cachorro en desarrollo)', icono: 'calendar-alt' };
  }
  if (edadMeses <= 84) {
    return { frecuencia: 'mensual', dias: 30, mensaje: 'Recomendado: Pesar MENSUALMENTE (adulto)', icono: 'calendar' };
  }
  return { frecuencia: 'quincenal', dias: 14, mensaje: 'Recomendado: Pesar QUINCENALMENTE (senior, monitoreo cercano)', icono: 'calendar-alt' };
}

/**
 * Renderiza el análisis de peso en HTML
 */
function renderizarAnalisisPeso(pet, pesos) {
  const pesosArr = pesos[pet.id] || [];
  if (pesosArr.length === 0) return '';

  const sorted = [...pesosArr].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ultimo = sorted[sorted.length - 1];
  const edadMeses = typeof obtenerEdadActual === 'function' ? obtenerEdadActual(pet).totalMeses : (pet.edadAnios * 12) + (pet.edadMeses || 0);

  let html = '';

  // Frecuencia recomendada
  const frec = sugerirFrecuenciaPesaje(edadMeses, parseInt(pet.condicion) >= 4);
  html += `
    <div class="weight-frequency-banner">
      <i class="fas fa-${frec.icono}"></i>
      <span>${frec.mensaje}</span>
      <button class="btn btn-sm btn-outline" onclick="crearRecordatorioPesaje(${frec.dias})">
        <i class="fas fa-bell"></i> Recordarme
      </button>
    </div>`;

  // Tendencia
  const tendencia = detectTrend(sorted);
  if (tendencia.tendencia !== 'insuficiente') {
    const trendIcon = tendencia.tendencia === 'ascendente' ? 'arrow-up' :
      tendencia.tendencia === 'descendente' ? 'arrow-down' : 'arrows-alt-h';
    const trendColor = tendencia.esPreocupante ? 'var(--danger)' :
      tendencia.tendencia === 'estable' ? 'var(--success)' : 'var(--warning)';

    let trendMsg = '';
    if (tendencia.tendencia === 'estable') trendMsg = 'Peso estable';
    else if (tendencia.tendencia === 'ascendente') trendMsg = `Ganando ${tendencia.cambioMensual}kg/mes`;
    else trendMsg = `Perdiendo ${Math.abs(tendencia.cambioMensual)}kg/mes`;

    html += `
      <div class="weight-trend-indicator" style="border-left: 4px solid ${trendColor}">
        <i class="fas fa-${trendIcon}" style="color:${trendColor};font-size:1.5rem"></i>
        <div>
          <strong style="color:${trendColor}">${trendMsg}</strong>
          <small>Basado en ${tendencia.registrosAnalizados} registros (${tendencia.diasAnalisis} días)</small>
        </div>
      </div>`;
  }

  // Comparación con raza
  const razaPeso = typeof obtenerRazaParaPeso === 'function' ? obtenerRazaParaPeso(pet) : pet.raza;
  const comp = compareWithPercentiles(ultimo.peso, razaPeso, edadMeses);
  if (comp) {
    const estadoColor = comp.estado === 'normal' ? 'var(--success)' :
      comp.estado === 'sobrepeso' ? 'var(--danger)' : 'var(--warning)';
    const estadoIcon = comp.estado === 'normal' ? 'check-circle' :
      comp.estado === 'sobrepeso' ? 'arrow-circle-up' : 'arrow-circle-down';

    html += `
      <div class="weight-breed-comparison">
        <i class="fas fa-${estadoIcon}" style="color:${estadoColor}"></i>
        <div>
          <strong>${pet.nombre} pesa ${ultimo.peso}kg</strong>
          <p>Rango ideal para ${pet.raza} (${comp.etapa}): ${comp.rangoIdeal.min} - ${comp.rangoIdeal.max} kg</p>
          <p style="color:${estadoColor}">${comp.mensaje}</p>
          ${comp.percentil ? `<small>Percentil ${comp.percentil} para su raza</small>` : ''}
        </div>
      </div>`;
  }

  return html;
}

console.log('weight-analyzer.js cargado correctamente');
