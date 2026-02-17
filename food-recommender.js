// ============================================================
// PetCare Pro - Motor de Recomendaciones de Alimento
// ============================================================

/**
 * Recomienda alimentos basado en perfil de mascota y resultados de exámenes
 * @param {Object} petProfile - Perfil de la mascota
 * @param {Object} examResults - Último análisis de examen (opcional)
 * @param {string} pais - País del usuario (default: 'colombia')
 * @returns {Array} Top 3 alimentos recomendados con scores
 */
function recommendFood(petProfile, examResults, pais) {
  pais = pais || 'colombia';
  const db = FOOD_DATABASE[pais];
  if (!db) return [];

  const esGato = petProfile.especie === 'gato';
  const edadMeses = typeof obtenerEdadActual === 'function' ? obtenerEdadActual(petProfile).totalMeses : (petProfile.edadAnios * 12) + (petProfile.edadMeses || 0);
  const categoria = determinarCategoria(edadMeses, petProfile.condicion);

  // Obtener requerimientos nutricionales
  const requerimientos = calcularRequerimientosNutricionales(petProfile, examResults);

  // Recolectar todos los alimentos candidatos
  const candidatos = [];

  // Procesar marcas premium y gama media
  const categorias = esGato ? ['premium'] : ['premium', 'gamaMedia'];
  if (esGato) categorias.push('gatoGamaMedia');

  categorias.forEach(cat => {
    const marcas = db[cat] || [];
    marcas.forEach(marca => {
      // Líneas generales (según especie)
      const lineas = esGato ? (marca.gatoLineas || {}) : (marca.lineas || {});
      Object.keys(lineas).forEach(lineaKey => {
        const linea = lineas[lineaKey];
        // Priorizar línea que coincida con categoría de la mascota
        const esLineaAdecuada = lineaKey === categoria ||
          (categoria === 'adulto' && lineaKey === 'adulto') ||
          (categoria === 'starter' && (lineaKey === 'starter' || lineaKey === 'cachorro')) ||
          (lineaKey === 'renal' && requerimientos.necesitaRenal) ||
          (lineaKey === 'weight' && requerimientos.necesitaWeight);

        candidatos.push({
          marca: marca.marca,
          logo: marca.logo,
          nombre: `${marca.marca} ${linea.nombre}`,
          linea: lineaKey,
          proteina: linea.proteina,
          grasa: linea.grasa,
          carbohidratos: linea.carbohidratos,
          fibra: linea.fibra || 3,
          kcalPorKg: linea.kcalPorKg,
          precio: linea.precio,
          tamaño: linea.tamaño,
          disponibilidad: marca.disponibilidad,
          website: marca.website,
          pais: marca.pais,
          esLineaAdecuada,
          esEspecifica: false,
          nota: ''
        });
      });

      // Líneas específicas por raza
      if (!esGato && marca.especificas) {
        marca.especificas.forEach(esp => {
          if (esp.raza === petProfile.raza) {
            candidatos.push({
              marca: marca.marca,
              logo: marca.logo,
              nombre: `${marca.marca} ${esp.nombre}`,
              linea: 'especifica',
              proteina: esp.proteina,
              grasa: esp.grasa,
              carbohidratos: esp.carbohidratos || (100 - esp.proteina - esp.grasa),
              fibra: 3,
              kcalPorKg: esp.kcalPorKg,
              precio: esp.precio,
              tamaño: esp.tamaño,
              disponibilidad: marca.disponibilidad,
              website: marca.website,
              pais: marca.pais,
              esLineaAdecuada: true,
              esEspecifica: true,
              nota: esp.nota || ''
            });
          }
        });
      }
    });
  });

  // Calcular score para cada candidato
  const scoredCandidatos = candidatos
    .filter(c => c.esLineaAdecuada || c.linea === 'adulto')
    .map(c => {
      const score = calcularScore(c, requerimientos, petProfile);
      return { ...c, score };
    });

  // Ordenar por score, desempate: disponibilidad > precio > marca conocida
  scoredCandidatos.sort((a, b) => {
    if (b.score.total !== a.score.total) return b.score.total - a.score.total;
    if (b.score.disponibilidad !== a.score.disponibilidad) return b.score.disponibilidad - a.score.disponibilidad;
    if (a.score.precio !== b.score.precio) return b.score.precio - a.score.precio;
    return 0;
  });

  // No duplicar marca+línea, retornar top 3
  const vistos = new Set();
  const top = [];
  for (const c of scoredCandidatos) {
    const key = `${c.marca}-${c.nombre}`;
    if (!vistos.has(key) && top.length < 3) {
      vistos.add(key);
      // Calcular porciones
      c.porciones = calcularPorcionesAlimento(c, petProfile);
      c.razones = generarRazones(c, requerimientos, petProfile);
      top.push(c);
    }
  }

  return top;
}

/**
 * Determina la categoría de alimento según la edad
 */
function determinarCategoria(edadMeses, condicion) {
  if (parseInt(condicion) >= 4) return 'weight';
  if (edadMeses <= 4) return 'starter';
  if (edadMeses < 12) return 'cachorro';
  if (edadMeses > 84) return 'senior';
  return 'adulto';
}

/**
 * Calcula los requerimientos nutricionales óptimos
 */
function calcularRequerimientosNutricionales(petProfile, examResults) {
  const macros = MACRONUTRIENTES[petProfile.especie];
  const req = {
    proteina: (macros.proteina.min + macros.proteina.max) / 2,
    grasa: (macros.grasa.min + macros.grasa.max) / 2,
    carbohidratos: (macros.carbohidratos.min + macros.carbohidratos.max) / 2,
    necesitaRenal: false,
    necesitaWeight: false,
    ajustes: []
  };

  // Ajustes por condición corporal
  if (parseInt(petProfile.condicion) >= 4) {
    req.grasa = Math.max(req.grasa - 4, 10);
    req.fibra = 6;
    req.necesitaWeight = true;
    req.ajustes.push('Grasa reducida por tendencia a sobrepeso');
  }

  // Ajustes por resultados de exámenes
  if (examResults && examResults.ajustesNutricionales) {
    examResults.ajustesNutricionales.forEach(ajuste => {
      if (ajuste.ajuste && ajuste.ajuste.ajuste) {
        const a = ajuste.ajuste.ajuste;
        if (a.proteina) {
          req.proteina = (a.proteina.min + a.proteina.max) / 2;
          req.ajustes.push(`Proteína ajustada por ${ajuste.parametro}`);
        }
        if (a.grasa) {
          req.grasa = (a.grasa.min + a.grasa.max) / 2;
        }
        if (a.carbohidratos) {
          req.carbohidratos = (a.carbohidratos.min + a.carbohidratos.max) / 2;
        }
        // Si creatinina alta, necesita renal
        if (ajuste.parametro === 'Creatinina' && ajuste.tipo === 'alto') {
          req.necesitaRenal = true;
          req.ajustes.push('Dieta renal recomendada');
        }
      }
    });
  }

  // Ajustes por raza
  const infoRaza = typeof INFO_RAZA_DETALLADA !== 'undefined' ? INFO_RAZA_DETALLADA[petProfile.raza] : null;
  if (infoRaza && infoRaza.nutricionEspecifica) {
    const ne = infoRaza.nutricionEspecifica;
    if (ne.proteina) req.proteina = (ne.proteina.min + ne.proteina.max) / 2;
    if (ne.grasa) req.grasa = (ne.grasa.min + ne.grasa.max) / 2;
  }

  return req;
}

/**
 * Calcula el score de un alimento (0-100)
 */
function calcularScore(alimento, requerimientos, petProfile) {
  // Score de proteína (peso: 30%)
  const diffProt = Math.abs(alimento.proteina - requerimientos.proteina);
  const scoreProt = Math.max(0, 100 - (diffProt / requerimientos.proteina * 100));

  // Score de grasa (peso: 25%)
  const diffGrasa = Math.abs(alimento.grasa - requerimientos.grasa);
  const scoreGrasa = Math.max(0, 100 - (diffGrasa / requerimientos.grasa * 100));

  // Score de salud/exámenes (peso: 25%)
  let scoreSalud = 80; // Base
  if (requerimientos.necesitaRenal && alimento.linea === 'renal') scoreSalud = 100;
  if (requerimientos.necesitaWeight && alimento.linea === 'weight') scoreSalud = 100;
  if (alimento.esEspecifica) scoreSalud = Math.min(scoreSalud + 15, 100);

  // Score de disponibilidad (peso: 10%)
  const scoreDisp = alimento.disponibilidad.length >= 4 ? 100 :
    alimento.disponibilidad.length >= 2 ? 70 : 40;

  // Score de precio (peso: 10%) - menor precio por kg = mejor score
  const precioPorKg = alimento.precio / alimento.tamaño;
  const maxPrecioPorKg = 20000; // Referencia
  const scorePrecio = Math.max(0, 100 - (precioPorKg / maxPrecioPorKg * 100));

  const total = Math.round(
    scoreProt * 0.30 +
    scoreGrasa * 0.25 +
    scoreSalud * 0.25 +
    scoreDisp * 0.10 +
    scorePrecio * 0.10
  );

  return {
    total: Math.min(total, 100),
    proteina: Math.round(scoreProt),
    grasa: Math.round(scoreGrasa),
    salud: Math.round(scoreSalud),
    disponibilidad: Math.round(scoreDisp),
    precio: Math.round(scorePrecio)
  };
}

/**
 * Calcula porciones recomendadas para un alimento
 */
function calcularPorcionesAlimento(alimento, petProfile) {
  const caloriasDiarias = calcularCaloriasDiarias(petProfile);
  const gramosDiarios = (caloriasDiarias / alimento.kcalPorKg) * 1000;
  const tazas = gramosDiarios / 120; // 1 taza ~120g croquetas

  const edadMeses = typeof obtenerEdadActual === 'function' ? obtenerEdadActual(petProfile).totalMeses : (petProfile.edadAnios * 12) + (petProfile.edadMeses || 0);
  let comidas = 2;
  if (edadMeses < 6) comidas = 4;
  else if (edadMeses < 12) comidas = 3;
  else if (edadMeses > 84) comidas = 3;

  const gramosPorComida = gramosDiarios / comidas;
  const diasPorBolsa = (alimento.tamaño * 1000) / gramosDiarios;
  const costoMensual = (30 / diasPorBolsa) * alimento.precio;

  return {
    gramosDiarios: Math.round(gramosDiarios),
    tazas: tazas.toFixed(1),
    comidas,
    gramosPorComida: Math.round(gramosPorComida),
    diasPorBolsa: Math.round(diasPorBolsa),
    costoMensual: Math.round(costoMensual),
    caloriasDiarias: Math.round(caloriasDiarias)
  };
}

/**
 * Genera razones de recomendación legibles
 */
function generarRazones(alimento, requerimientos, petProfile) {
  const razones = [];

  if (alimento.esEspecifica) {
    razones.push(`Formulado especialmente para ${petProfile.raza}`);
  }

  const diffProt = Math.abs(alimento.proteina - requerimientos.proteina);
  if (diffProt <= 2) {
    razones.push(`Proteína ideal para ${petProfile.raza} ${petProfile.especie === 'gato' ? 'como carnívoro obligado' : 'adultos'}`);
  }

  const diffGrasa = Math.abs(alimento.grasa - requerimientos.grasa);
  if (diffGrasa <= 2) {
    razones.push(`Nivel de grasa adecuado${parseInt(petProfile.condicion) >= 3 ? ' para control de peso' : ''}`);
  }

  if (alimento.nota) {
    razones.push(alimento.nota);
  }

  if (alimento.linea === 'renal' && requerimientos.necesitaRenal) {
    razones.push('Dieta renal para proteger la función de los riñones');
  }

  if (alimento.linea === 'weight' && requerimientos.necesitaWeight) {
    razones.push('Alta en fibra para saciedad, reducida en calorías');
  }

  if (razones.length === 0) {
    razones.push(`Buena relación nutricional para ${petProfile.especie}s`);
  }

  return razones;
}

/**
 * Renderiza las recomendaciones de alimento en HTML
 */
function renderizarRecomendaciones(recomendaciones, petProfile, pais) {
  pais = pais || 'colombia';

  if (!recomendaciones || recomendaciones.length === 0) {
    return '<p class="empty-state">No hay recomendaciones disponibles para tu región.</p>';
  }

  let html = `<h3 class="food-rec-title"><i class="fas fa-utensils"></i> Alimentos Recomendados para ${escapeHtml(petProfile.nombre)}</h3>`;
  html += '<div class="food-rec-grid">';

  recomendaciones.forEach((rec, idx) => {
    const scoreColor = rec.score.total >= 80 ? 'var(--success)' :
      rec.score.total >= 60 ? 'var(--warning)' : 'var(--text-secondary)';

    html += `
      <div class="food-rec-card ${idx === 0 ? 'food-rec-best' : ''}">
        ${idx === 0 ? '<div class="food-rec-best-badge"><i class="fas fa-trophy"></i> Mejor opción</div>' : ''}
        <div class="food-rec-header">
          <div class="food-rec-rank">#${idx + 1}</div>
          <div class="food-rec-info">
            <h4><i class="${rec.logo}"></i> ${escapeHtml(rec.nombre)}</h4>
            <small>${rec.pais}</small>
          </div>
          <div class="food-rec-score" style="background:${scoreColor}">${rec.score.total}/100</div>
        </div>

        <div class="food-rec-macros">
          <span class="macro-badge prot">${rec.proteina}% Prot</span>
          <span class="macro-badge fat">${rec.grasa}% Grasa</span>
          <span class="macro-badge carb">${rec.carbohidratos}% Carb</span>
        </div>

        <div class="food-rec-price">
          <strong>${formatearPrecio(rec.precio, pais)}</strong> / ${rec.tamaño}kg
          <small>(${formatearPrecio(Math.round(rec.precio / rec.tamaño), pais)}/kg)</small>
        </div>

        <div class="food-rec-reasons">
          <h5>Por qué te lo recomendamos:</h5>
          <ul>${rec.razones.map(r => `<li><i class="fas fa-check" style="color:var(--success)"></i> ${r}</li>`).join('')}</ul>
        </div>

        <div class="food-rec-portions">
          <h5><i class="fas fa-calculator"></i> Porciones Recomendadas</h5>
          <div class="portions-grid">
            <div><strong>${rec.porciones.gramosDiarios}g</strong><small>/día</small></div>
            <div><strong>${rec.porciones.tazas}</strong><small>tazas</small></div>
            <div><strong>${rec.porciones.comidas}</strong><small>comidas</small></div>
            <div><strong>${rec.porciones.gramosPorComida}g</strong><small>/comida</small></div>
          </div>
          <p class="portions-cost">
            <i class="fas fa-money-bill-wave"></i>
            Una bolsa dura ~${rec.porciones.diasPorBolsa} días.
            Costo mensual: <strong>${formatearPrecio(rec.porciones.costoMensual, pais)}</strong>
          </p>
        </div>

        <div class="food-rec-actions">
          <button class="btn btn-sm btn-outline" onclick="mostrarTiendas('${escapeHtml(rec.marca)}', ${JSON.stringify(rec.disponibilidad).replace(/"/g, '&quot;')})">
            <i class="fas fa-store"></i> Dónde comprar
          </button>
          ${rec.website ? `<a href="https://${rec.website}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fas fa-external-link-alt"></i> Sitio web</a>` : ''}
        </div>
      </div>`;
  });

  html += '</div>';
  return html;
}

/**
 * Muestra modal con tiendas donde comprar
 */
function mostrarTiendas(marca, tiendas) {
  const body = document.getElementById('explanation-body');
  body.innerHTML = `
    <h4><i class="fas fa-store"></i> Dónde comprar ${escapeHtml(marca)}</h4>
    <ul style="list-style:none;padding:0">
      ${tiendas.map(t => `<li style="padding:0.5rem 0;border-bottom:1px solid var(--border-color)"><i class="fas fa-map-marker-alt" style="color:var(--primary);margin-right:0.5rem"></i>${t}</li>`).join('')}
    </ul>
    <p style="margin-top:1rem;font-size:0.85rem;color:var(--text-secondary)">
      <i class="fas fa-info-circle"></i> Los precios y disponibilidad pueden variar según la tienda y la ciudad.
    </p>
  `;
  document.getElementById('explanation-modal').classList.remove('hidden');
}

console.log('food-recommender.js cargado correctamente');
