// ============================================================
// PetCare Pro - Rangos de Referencia para Exámenes Médicos
// ============================================================

// Catálogo de todos los parámetros soportados
const PARAM_CATALOG = {
  // Hemograma
  hemoglobina:      { nombre: 'Hemoglobina',        unit: 'g/dL',   step: 0.1,  categoria: 'hemograma' },
  hematocrito:      { nombre: 'Hematocrito',         unit: '%',      step: 0.1,  categoria: 'hemograma' },
  eritrocitos:      { nombre: 'Eritrocitos',         unit: 'x10⁶/µL', step: 0.01, categoria: 'hemograma' },
  leucocitos:       { nombre: 'Leucocitos',          unit: 'x10³/µL', step: 0.1,  categoria: 'hemograma' },
  plaquetas:        { nombre: 'Plaquetas',           unit: 'x10³/µL', step: 1,    categoria: 'hemograma' },
  vcm:              { nombre: 'VCM',                 unit: 'fL',     step: 0.1,  categoria: 'hemograma' },
  hcm:              { nombre: 'HCM',                 unit: 'pg',     step: 0.1,  categoria: 'hemograma' },
  chcm:             { nombre: 'CHCM',                unit: 'g/dL',   step: 0.1,  categoria: 'hemograma' },
  neutrofilos:      { nombre: 'Neutrófilos',         unit: 'x10³/µL', step: 0.1,  categoria: 'hemograma' },
  linfocitos:       { nombre: 'Linfocitos',          unit: 'x10³/µL', step: 0.1,  categoria: 'hemograma' },
  monocitos:        { nombre: 'Monocitos',           unit: 'x10³/µL', step: 0.01, categoria: 'hemograma' },
  eosinofilos:      { nombre: 'Eosinófilos',         unit: 'x10³/µL', step: 0.01, categoria: 'hemograma' },
  // Química sanguínea
  glucosa:          { nombre: 'Glucosa',             unit: 'mg/dL',  step: 1,    categoria: 'quimica' },
  bun:              { nombre: 'BUN (Nitrógeno Ureico)', unit: 'mg/dL', step: 0.1, categoria: 'quimica' },
  creatinina:       { nombre: 'Creatinina',          unit: 'mg/dL',  step: 0.01, categoria: 'quimica' },
  alt:              { nombre: 'ALT (Alanina Aminotransferasa)', unit: 'U/L', step: 1, categoria: 'quimica' },
  ast:              { nombre: 'AST (Aspartato Aminotransferasa)', unit: 'U/L', step: 1, categoria: 'quimica' },
  alp:              { nombre: 'ALP (Fosfatasa Alcalina)', unit: 'U/L', step: 1, categoria: 'quimica' },
  ggt:              { nombre: 'GGT (Gamma-Glutamil Transferasa)', unit: 'U/L', step: 1, categoria: 'quimica' },
  bilirrubina:      { nombre: 'Bilirrubina Total',   unit: 'mg/dL',  step: 0.01, categoria: 'quimica' },
  proteinastotales: { nombre: 'Proteínas Totales',   unit: 'g/dL',   step: 0.1,  categoria: 'quimica' },
  albumina:         { nombre: 'Albúmina',            unit: 'g/dL',   step: 0.1,  categoria: 'quimica' },
  globulinas:       { nombre: 'Globulinas',          unit: 'g/dL',   step: 0.1,  categoria: 'quimica' },
  colesterol:       { nombre: 'Colesterol',          unit: 'mg/dL',  step: 1,    categoria: 'quimica' },
  trigliceridos:    { nombre: 'Triglicéridos',       unit: 'mg/dL',  step: 1,    categoria: 'quimica' },
  amilasa:          { nombre: 'Amilasa',             unit: 'U/L',    step: 1,    categoria: 'quimica' },
  lipasa:           { nombre: 'Lipasa',              unit: 'U/L',    step: 1,    categoria: 'quimica' },
  calcio:           { nombre: 'Calcio',              unit: 'mg/dL',  step: 0.1,  categoria: 'quimica' },
  fosforo:          { nombre: 'Fósforo',             unit: 'mg/dL',  step: 0.1,  categoria: 'quimica' },
  // Electrolitos
  sodio:            { nombre: 'Sodio',               unit: 'mEq/L',  step: 1,    categoria: 'electrolitos' },
  potasio:          { nombre: 'Potasio',             unit: 'mEq/L',  step: 0.1,  categoria: 'electrolitos' },
  cloro:            { nombre: 'Cloro',               unit: 'mEq/L',  step: 1,    categoria: 'electrolitos' }
};

const CATEGORIAS_LABEL = {
  hemograma: 'Hemograma',
  quimica: 'Química Sanguínea',
  electrolitos: 'Electrolitos'
};

const RANGOS_REFERENCIA = {
  perro: {
    hemoglobina: {
      min: 12, max: 18, unit: 'g/dL',
      nombre: 'Hemoglobina',
      descripcion: 'Proteína en los glóbulos rojos que transporta oxígeno',
      interpretaciones: {
        bajo: {
          causas: [
            'Anemia (pérdida de sangre, destrucción de glóbulos rojos)',
            'Deficiencia de hierro o vitamina B12',
            'Enfermedad crónica (infección, cáncer)',
            'Insuficiencia renal (disminuye la producción de eritropoyetina)'
          ],
          recomendaciones: [
            'Consulta veterinaria para determinar la causa',
            'Incluir alimentos ricos en hierro (hígado, carne roja magra)',
            'Considerar suplementos de hierro bajo supervisión veterinaria',
            'Monitorear energía y color de encías (deben ser rosadas)'
          ],
          nutricional: {
            nota: 'Aumentar alimentos ricos en hierro y vitamina B12',
            ajuste: { proteina: { min: 28, max: 32 } }
          }
        },
        alto: {
          causas: [
            'Deshidratación (concentración de la sangre)',
            'Policitemia (sobreproducción de glóbulos rojos)',
            'Enfermedad pulmonar crónica',
            'Altitud elevada (adaptación al oxígeno reducido)'
          ],
          recomendaciones: [
            'Asegurar hidratación adecuada (agua fresca siempre disponible)',
            'Consulta veterinaria si persiste',
            'Verificar función renal y pulmonar'
          ]
        }
      }
    },
    glucosa: {
      min: 70, max: 110, unit: 'mg/dL',
      nombre: 'Glucosa',
      descripcion: 'Nivel de azúcar en sangre, principal fuente de energía',
      interpretaciones: {
        bajo: {
          causas: [
            'Hipoglucemia (ayuno prolongado)',
            'Exceso de insulina',
            'Enfermedad hepática',
            'Razas pequeñas son más susceptibles (Chihuahua, Yorkshire)'
          ],
          recomendaciones: [
            'Alimentar con comidas pequeñas y frecuentes',
            'No dejar en ayunas más de 8 horas',
            'Tener a mano miel o solución de glucosa para emergencias',
            'Consulta veterinaria urgente si hay debilidad o temblores'
          ],
          nutricional: {
            nota: 'Aumentar frecuencia de comidas, incluir carbohidratos complejos',
            ajuste: { carbohidratos: { min: 45, max: 55 } }
          }
        },
        alto: {
          causas: [
            'Posible diabetes mellitus',
            'Estrés durante la toma de muestra',
            'Alimentación reciente antes del examen (no en ayunas)',
            'Pancreatitis',
            'Síndrome de Cushing'
          ],
          recomendaciones: [
            'Consulta veterinaria para confirmación diagnóstica',
            'Si se confirma prediabetes, reducir carbohidratos simples',
            'Aumentar actividad física: 30 min de caminata 2 veces al día',
            'Monitorear peso semanalmente',
            'Repetir examen en ayunas de 12 horas'
          ],
          nutricional: {
            nota: 'Reducir carbohidratos, aumentar proteína y fibra',
            ajuste: { carbohidratos: { min: 35, max: 40 }, proteina: { min: 28, max: 32 } }
          }
        }
      }
    },
    creatinina: {
      min: 0.5, max: 1.5, unit: 'mg/dL',
      nombre: 'Creatinina',
      descripcion: 'Indicador de función renal, producto del metabolismo muscular',
      interpretaciones: {
        bajo: {
          causas: [
            'Pérdida de masa muscular',
            'Dieta muy baja en proteína',
            'Insuficiencia hepática'
          ],
          recomendaciones: [
            'Verificar que la dieta tenga proteína adecuada',
            'Evaluar masa muscular con el veterinario'
          ]
        },
        alto: {
          causas: [
            'Enfermedad renal (los riñones no filtran correctamente)',
            'Deshidratación severa',
            'Obstrucción urinaria',
            'Daño muscular extenso'
          ],
          recomendaciones: [
            'CONSULTA VETERINARIA URGENTE (24-48 horas)',
            'Asegurar que tu mascota esté bebiendo suficiente agua',
            'Considerar alimento renal especializado (bajo en proteína y fósforo)',
            'Marcas recomendadas: Royal Canin Renal, Hills k/d',
            'Monitorear producción de orina (cantidad y frecuencia)'
          ],
          nutricional: {
            nota: 'Dieta renal: baja en proteína y fósforo',
            ajuste: { proteina: { min: 18, max: 22 }, grasa: { min: 15, max: 20 } }
          },
          urgente: true
        }
      }
    },
    alt: {
      min: 10, max: 100, unit: 'U/L',
      nombre: 'ALT (Alanina Aminotransferasa)',
      descripcion: 'Enzima hepática, indica daño en el hígado',
      interpretaciones: {
        bajo: {
          causas: [
            'Generalmente no es clínicamente significativo',
            'Puede indicar deficiencia de vitamina B6'
          ],
          recomendaciones: [
            'No suele requerir acción inmediata',
            'Mencionar al veterinario en próxima consulta'
          ]
        },
        alto: {
          causas: [
            'Daño hepático (hepatitis, cirrosis)',
            'Toxicidad por medicamentos o sustancias',
            'Infección hepática',
            'Enfermedad biliar',
            'Tumor hepático'
          ],
          recomendaciones: [
            'Consulta veterinaria para evaluación hepática completa',
            'Evitar medicamentos hepatotóxicos sin supervisión',
            'Dieta baja en grasa y fácil de digerir',
            'Considerar suplementos hepatoprotectores (silimarina)',
            'Evitar alimentos con conservantes artificiales'
          ],
          nutricional: {
            nota: 'Dieta hepatoprotectora: baja en grasa, alta en antioxidantes',
            ajuste: { grasa: { min: 10, max: 14 }, proteina: { min: 22, max: 26 } }
          },
          urgente: true
        }
      }
    },
    proteinastotales: {
      min: 5.4, max: 7.5, unit: 'g/dL',
      nombre: 'Proteínas Totales',
      descripcion: 'Nivel total de proteínas en sangre (albúmina + globulinas)',
      interpretaciones: {
        bajo: {
          causas: [
            'Desnutrición o malabsorción',
            'Enfermedad hepática (no produce suficiente albúmina)',
            'Pérdida renal de proteínas (nefropatía)',
            'Hemorragia crónica'
          ],
          recomendaciones: [
            'Aumentar proteína de alta calidad en la dieta',
            'Consulta veterinaria para identificar la causa',
            'Considerar alimentos con proteína de fácil digestión (pollo, pescado)',
            'Evaluar función hepática y renal'
          ],
          nutricional: {
            nota: 'Aumentar proteína de alta calidad biológica',
            ajuste: { proteina: { min: 30, max: 35 } }
          }
        },
        alto: {
          causas: [
            'Deshidratación (concentración sanguínea)',
            'Infección o inflamación crónica',
            'Enfermedades inmunomediadas',
            'Mieloma múltiple u otro cáncer'
          ],
          recomendaciones: [
            'Asegurar buena hidratación',
            'Consulta veterinaria para descartar infección o inflamación',
            'Repetir examen después de hidratación adecuada'
          ]
        }
      }
    },
    // === Hemograma expandido (perro) ===
    hematocrito: {
      min: 37, max: 55, unit: '%', nombre: 'Hematocrito',
      descripcion: 'Porcentaje del volumen sanguíneo ocupado por glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['Anemia', 'Hemorragia', 'Enfermedad crónica'], recomendaciones: ['Consulta veterinaria', 'Evaluar posible pérdida de sangre'] },
        alto: { causas: ['Deshidratación', 'Policitemia'], recomendaciones: ['Asegurar hidratación adecuada', 'Consulta veterinaria si persiste'] }
      }
    },
    eritrocitos: {
      min: 5.5, max: 8.5, unit: 'x10⁶/µL', nombre: 'Eritrocitos',
      descripcion: 'Conteo de glóbulos rojos en sangre',
      interpretaciones: {
        bajo: { causas: ['Anemia', 'Deficiencia de hierro', 'Enfermedad crónica'], recomendaciones: ['Consulta veterinaria para diagnóstico de anemia'] },
        alto: { causas: ['Deshidratación', 'Policitemia vera'], recomendaciones: ['Mejorar hidratación', 'Consulta veterinaria'] }
      }
    },
    leucocitos: {
      min: 6, max: 17, unit: 'x10³/µL', nombre: 'Leucocitos',
      descripcion: 'Glóbulos blancos, parte del sistema inmunológico',
      interpretaciones: {
        bajo: { causas: ['Infección viral severa', 'Inmunosupresión', 'Enfermedad de médula ósea'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Evitar exposición a infecciones'], urgente: true },
        alto: { causas: ['Infección bacteriana activa', 'Inflamación', 'Estrés', 'Leucemia'], recomendaciones: ['Consulta veterinaria para identificar foco infeccioso', 'Monitorear temperatura corporal'] }
      }
    },
    plaquetas: {
      min: 175, max: 500, unit: 'x10³/µL', nombre: 'Plaquetas',
      descripcion: 'Células que participan en la coagulación sanguínea',
      interpretaciones: {
        bajo: { causas: ['Trombocitopenia inmunomediada', 'Infección por garrapatas (Ehrlichia)', 'CID'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Evitar traumatismos', 'Verificar presencia de garrapatas'], urgente: true },
        alto: { causas: ['Inflamación crónica', 'Deficiencia de hierro', 'Esplenectomía'], recomendaciones: ['Consulta veterinaria para evaluación'] }
      }
    },
    vcm: {
      min: 60, max: 77, unit: 'fL', nombre: 'VCM',
      descripcion: 'Volumen corpuscular medio de los glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['Deficiencia de hierro', 'Enfermedad crónica'], recomendaciones: ['Evaluar dieta y posible suplementación de hierro'] },
        alto: { causas: ['Deficiencia de B12/ácido fólico', 'Reticulocitosis'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    hcm: {
      min: 19, max: 28, unit: 'pg', nombre: 'HCM',
      descripcion: 'Hemoglobina corpuscular media',
      interpretaciones: {
        bajo: { causas: ['Deficiencia de hierro'], recomendaciones: ['Verificar aporte de hierro en la dieta'] },
        alto: { causas: ['Macrocitosis', 'Hemólisis'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    chcm: {
      min: 32, max: 36, unit: 'g/dL', nombre: 'CHCM',
      descripcion: 'Concentración de hemoglobina corpuscular media',
      interpretaciones: {
        bajo: { causas: ['Deficiencia de hierro', 'Reticulocitosis'], recomendaciones: ['Evaluar suplementación de hierro'] },
        alto: { causas: ['Esferocitosis', 'Hemólisis intravascular'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    neutrofilos: {
      min: 3, max: 12, unit: 'x10³/µL', nombre: 'Neutrófilos',
      descripcion: 'Tipo de glóbulo blanco, primera línea de defensa',
      interpretaciones: {
        bajo: { causas: ['Infección viral severa', 'Parvovirus', 'Toxicidad por medicamentos'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Aislamiento si hay sospecha de parvovirus'], urgente: true },
        alto: { causas: ['Infección bacteriana', 'Estrés', 'Inflamación', 'Uso de corticoides'], recomendaciones: ['Consulta veterinaria para identificar causa'] }
      }
    },
    linfocitos: {
      min: 1, max: 4.8, unit: 'x10³/µL', nombre: 'Linfocitos',
      descripcion: 'Glóbulos blancos importantes para inmunidad adaptativa',
      interpretaciones: {
        bajo: { causas: ['Estrés (cortisol elevado)', 'Uso de corticoides', 'Enfermedad viral'], recomendaciones: ['Consulta veterinaria'] },
        alto: { causas: ['Infección crónica', 'Estimulación antigénica', 'Leucemia linfocítica'], recomendaciones: ['Consulta veterinaria para evaluación'] }
      }
    },
    monocitos: {
      min: 0.15, max: 1.35, unit: 'x10³/µL', nombre: 'Monocitos',
      descripcion: 'Glóbulos blancos que participan en la respuesta inflamatoria',
      interpretaciones: {
        bajo: { causas: ['No suele ser clínicamente significativo'], recomendaciones: ['Mencionar al veterinario en próxima consulta'] },
        alto: { causas: ['Inflamación crónica', 'Estrés', 'Infección por hongos'], recomendaciones: ['Consulta veterinaria si se mantiene elevado'] }
      }
    },
    eosinofilos: {
      min: 0.1, max: 1.25, unit: 'x10³/µL', nombre: 'Eosinófilos',
      descripcion: 'Glóbulos blancos asociados a alergias y parásitos',
      interpretaciones: {
        bajo: { causas: ['Estrés agudo', 'Uso de corticoides'], recomendaciones: ['No requiere acción inmediata'] },
        alto: { causas: ['Parásitos intestinales', 'Alergias', 'Enfermedad inflamatoria intestinal'], recomendaciones: ['Desparasitación si no está al día', 'Evaluar alergias alimentarias'] }
      }
    },
    // === Química expandida (perro) ===
    bun: {
      min: 7, max: 27, unit: 'mg/dL', nombre: 'BUN (Nitrógeno Ureico)',
      descripcion: 'Producto de desecho del metabolismo de proteínas, filtrado por riñones',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática severa', 'Dieta muy baja en proteína'], recomendaciones: ['Evaluar función hepática', 'Verificar aporte proteico en dieta'] },
        alto: {
          causas: ['Enfermedad renal', 'Deshidratación', 'Obstrucción urinaria', 'Dieta muy alta en proteína'],
          recomendaciones: ['CONSULTA VETERINARIA URGENTE si está muy elevado', 'Asegurar hidratación', 'Evaluar función renal completa'],
          nutricional: { nota: 'Considerar dieta renal si se confirma enfermedad renal', ajuste: { proteina: { min: 18, max: 22 } } },
          urgente: true
        }
      }
    },
    ast: {
      min: 10, max: 50, unit: 'U/L', nombre: 'AST (Aspartato Aminotransferasa)',
      descripcion: 'Enzima presente en hígado y músculo, indica daño celular',
      interpretaciones: {
        bajo: { causas: ['No es clínicamente significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Daño hepático', 'Daño muscular', 'Ejercicio intenso reciente'], recomendaciones: ['Consulta veterinaria', 'Evaluar junto con ALT y CK para diferenciar origen'] }
      }
    },
    alp: {
      min: 20, max: 150, unit: 'U/L', nombre: 'ALP (Fosfatasa Alcalina)',
      descripcion: 'Enzima presente en hígado, huesos e intestino',
      interpretaciones: {
        bajo: { causas: ['No suele ser significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Enfermedad hepática', 'Cushing', 'Uso de corticoides', 'Crecimiento en cachorros (normal)'], recomendaciones: ['Consulta veterinaria', 'En cachorros puede ser normal por crecimiento óseo'] }
      }
    },
    ggt: {
      min: 0, max: 11, unit: 'U/L', nombre: 'GGT (Gamma-Glutamil Transferasa)',
      descripcion: 'Enzima hepática y biliar',
      interpretaciones: {
        bajo: { causas: ['No es significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Colestasis (obstrucción biliar)', 'Enfermedad hepática', 'Pancreatitis'], recomendaciones: ['Consulta veterinaria para evaluación hepática y biliar'] }
      }
    },
    bilirrubina: {
      min: 0.1, max: 0.5, unit: 'mg/dL', nombre: 'Bilirrubina Total',
      descripcion: 'Pigmento producido por la descomposición de glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['No es significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Hemólisis', 'Enfermedad hepática', 'Obstrucción biliar'], recomendaciones: ['CONSULTA VETERINARIA', 'Observar si hay ictericia (encías/ojos amarillos)'], urgente: true }
      }
    },
    albumina: {
      min: 2.3, max: 4.0, unit: 'g/dL', nombre: 'Albúmina',
      descripcion: 'Proteína principal producida por el hígado',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática', 'Pérdida renal (nefropatía)', 'Malnutrición', 'Enteropatía'], recomendaciones: ['Consulta veterinaria', 'Evaluar función hepática y renal', 'Dieta alta en proteína de calidad'] },
        alto: { causas: ['Deshidratación'], recomendaciones: ['Mejorar hidratación'] }
      }
    },
    globulinas: {
      min: 2.5, max: 4.5, unit: 'g/dL', nombre: 'Globulinas',
      descripcion: 'Proteínas relacionadas con inmunidad e inflamación',
      interpretaciones: {
        bajo: { causas: ['Inmunodeficiencia', 'Cachorro joven'], recomendaciones: ['Consulta veterinaria si es adulto'] },
        alto: { causas: ['Infección crónica', 'Enfermedad inmunomediada', 'Mieloma'], recomendaciones: ['Consulta veterinaria para descartar infección crónica'] }
      }
    },
    colesterol: {
      min: 135, max: 270, unit: 'mg/dL', nombre: 'Colesterol',
      descripcion: 'Lípido importante para membranas celulares y hormonas',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática', 'Malabsorción'], recomendaciones: ['Evaluar función hepática'] },
        alto: { causas: ['Hipotiroidismo', 'Cushing', 'Diabetes', 'Pancreatitis'], recomendaciones: ['Consulta veterinaria', 'Considerar perfil tiroideo'] }
      }
    },
    trigliceridos: {
      min: 50, max: 150, unit: 'mg/dL', nombre: 'Triglicéridos',
      descripcion: 'Tipo de grasa en sangre',
      interpretaciones: {
        bajo: { causas: ['Malnutrición', 'Malabsorción'], recomendaciones: ['Evaluar dieta'] },
        alto: { causas: ['Muestra no en ayunas', 'Hipotiroidismo', 'Cushing', 'Pancreatitis'], recomendaciones: ['Repetir en ayunas de 12h', 'Consulta veterinaria'] }
      }
    },
    amilasa: {
      min: 500, max: 1500, unit: 'U/L', nombre: 'Amilasa',
      descripcion: 'Enzima pancreática e intestinal',
      interpretaciones: {
        bajo: { causas: ['No suele ser significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Pancreatitis', 'Enfermedad renal', 'Obstrucción intestinal'], recomendaciones: ['Consulta veterinaria', 'Evaluar junto con lipasa'] }
      }
    },
    lipasa: {
      min: 100, max: 750, unit: 'U/L', nombre: 'Lipasa',
      descripcion: 'Enzima pancreática que digiere grasas',
      interpretaciones: {
        bajo: { causas: ['No es significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Pancreatitis', 'Enfermedad renal'], recomendaciones: ['CONSULTA VETERINARIA', 'Dieta baja en grasa', 'Evaluar función pancreática'], urgente: true }
      }
    },
    calcio: {
      min: 9.0, max: 11.3, unit: 'mg/dL', nombre: 'Calcio',
      descripcion: 'Mineral esencial para huesos, músculos y nervios',
      interpretaciones: {
        bajo: { causas: ['Hipoparatiroidismo', 'Enfermedad renal', 'Eclampsia (hembras lactantes)'], recomendaciones: ['CONSULTA VETERINARIA URGENTE si hay temblores', 'Suplementación de calcio bajo supervisión'], urgente: true },
        alto: { causas: ['Linfoma', 'Enfermedad de paratiroides', 'Insuficiencia renal', 'Intoxicación por vitamina D'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Asegurar hidratación'], urgente: true }
      }
    },
    fosforo: {
      min: 2.6, max: 6.8, unit: 'mg/dL', nombre: 'Fósforo',
      descripcion: 'Mineral importante para huesos y metabolismo energético',
      interpretaciones: {
        bajo: { causas: ['Hiperparatiroidismo', 'Uso de antiácidos'], recomendaciones: ['Consulta veterinaria'] },
        alto: { causas: ['Enfermedad renal', 'Hipoparatiroidismo', 'Normal en cachorros'], recomendaciones: ['Consulta veterinaria', 'Si hay enfermedad renal: dieta baja en fósforo'] }
      }
    },
    // === Electrolitos (perro) ===
    sodio: {
      min: 140, max: 155, unit: 'mEq/L', nombre: 'Sodio',
      descripcion: 'Electrolito principal del líquido extracelular',
      interpretaciones: {
        bajo: { causas: ['Vómito/diarrea severa', 'Enfermedad de Addison', 'Insuficiencia cardíaca'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Evaluar hidratación'], urgente: true },
        alto: { causas: ['Deshidratación severa', 'Diabetes insípida', 'Ingesta excesiva de sal'], recomendaciones: ['Asegurar acceso a agua', 'Consulta veterinaria'] }
      }
    },
    potasio: {
      min: 3.5, max: 5.8, unit: 'mEq/L', nombre: 'Potasio',
      descripcion: 'Electrolito esencial para función cardíaca y muscular',
      interpretaciones: {
        bajo: { causas: ['Vómito/diarrea prolongados', 'Uso de diuréticos', 'Anorexia'], recomendaciones: ['CONSULTA VETERINARIA', 'Evaluar hidratación y nutrición'], urgente: true },
        alto: { causas: ['Enfermedad renal', 'Enfermedad de Addison', 'Obstrucción urinaria'], recomendaciones: ['CONSULTA VETERINARIA URGENTE - riesgo cardíaco', 'Si es macho y no orina: EMERGENCIA'], urgente: true }
      }
    },
    cloro: {
      min: 105, max: 115, unit: 'mEq/L', nombre: 'Cloro',
      descripcion: 'Electrolito que ayuda a mantener el equilibrio ácido-base',
      interpretaciones: {
        bajo: { causas: ['Vómito prolongado', 'Uso de diuréticos'], recomendaciones: ['Consulta veterinaria', 'Evaluar hidratación'] },
        alto: { causas: ['Deshidratación', 'Acidosis metabólica'], recomendaciones: ['Asegurar hidratación', 'Consulta veterinaria'] }
      }
    }
  },
  gato: {
    hemoglobina: {
      min: 9, max: 15, unit: 'g/dL',
      nombre: 'Hemoglobina',
      descripcion: 'Proteína en los glóbulos rojos que transporta oxígeno',
      interpretaciones: {
        bajo: {
          causas: [
            'Anemia (enfermedad renal crónica es causa común en gatos)',
            'Infección por FeLV (Leucemia Felina)',
            'Parásitos intestinales',
            'Deficiencia nutricional'
          ],
          recomendaciones: [
            'Consulta veterinaria para diagnóstico',
            'Test de FeLV/FIV si no se ha realizado',
            'Dieta rica en hierro y proteína animal',
            'Desparasitación si no está al día'
          ],
          nutricional: {
            nota: 'Aumentar proteína animal rica en hierro',
            ajuste: { proteina: { min: 40, max: 48 } }
          }
        },
        alto: {
          causas: [
            'Deshidratación (muy común en gatos)',
            'Policitemia',
            'Enfermedad pulmonar'
          ],
          recomendaciones: [
            'Asegurar múltiples fuentes de agua fresca',
            'Considerar alimento húmedo para aumentar hidratación',
            'Fuentes de agua corriente (bebederos tipo fuente)'
          ]
        }
      }
    },
    glucosa: {
      min: 70, max: 120, unit: 'mg/dL',
      nombre: 'Glucosa',
      descripcion: 'Nivel de azúcar en sangre',
      interpretaciones: {
        bajo: {
          causas: [
            'Ayuno prolongado',
            'Exceso de insulina',
            'Tumor pancreático (insulinoma)',
            'Enfermedad hepática'
          ],
          recomendaciones: [
            'Comidas pequeñas y frecuentes (3-4 veces al día)',
            'Consulta veterinaria si persiste',
            'Evitar ayunos prolongados'
          ],
          nutricional: {
            nota: 'Alimentación frecuente con proteína animal de calidad',
            ajuste: { proteina: { min: 40, max: 45 } }
          }
        },
        alto: {
          causas: [
            'Diabetes mellitus (más común en gatos obesos)',
            'Estrés durante la toma de muestra (hiperglucemia por estrés)',
            'Pancreatitis',
            'Hipertiroidismo'
          ],
          recomendaciones: [
            'Consulta veterinaria para confirmación',
            'Dieta alta en proteína, muy baja en carbohidratos',
            'Control de peso estricto',
            'Los gatos diabéticos pueden entrar en remisión con dieta adecuada',
            'Monitorear consumo de agua y frecuencia urinaria'
          ],
          nutricional: {
            nota: 'Dieta diabética: muy alta en proteína, mínimos carbohidratos',
            ajuste: { carbohidratos: { min: 5, max: 10 }, proteina: { min: 45, max: 50 } }
          }
        }
      }
    },
    creatinina: {
      min: 0.8, max: 1.8, unit: 'mg/dL',
      nombre: 'Creatinina',
      descripcion: 'Indicador de función renal',
      interpretaciones: {
        bajo: {
          causas: [
            'Pérdida de masa muscular',
            'Dieta muy baja en proteína (inadecuada para gatos)'
          ],
          recomendaciones: [
            'Los gatos necesitan alta proteína animal - verificar dieta',
            'Evaluar masa muscular'
          ]
        },
        alto: {
          causas: [
            'Enfermedad renal crónica (MUY común en gatos mayores)',
            'Deshidratación',
            'Obstrucción urinaria (emergencia en machos)',
            'Hipertiroidismo puede enmascarar enfermedad renal'
          ],
          recomendaciones: [
            'CONSULTA VETERINARIA URGENTE',
            'Hidratación es CRÍTICA - múltiples fuentes de agua',
            'Alimento renal: Royal Canin Renal, Hills k/d Feline',
            'Monitorear producción de orina',
            'Si es macho y no orina: EMERGENCIA INMEDIATA'
          ],
          nutricional: {
            nota: 'Dieta renal felina: proteína moderada de alta calidad, bajo fósforo',
            ajuste: { proteina: { min: 30, max: 35 } }
          },
          urgente: true
        }
      }
    },
    alt: {
      min: 25, max: 100, unit: 'U/L',
      nombre: 'ALT (Alanina Aminotransferasa)',
      descripcion: 'Enzima hepática',
      interpretaciones: {
        bajo: {
          causas: [
            'No es clínicamente significativo en la mayoría de casos'
          ],
          recomendaciones: [
            'No requiere acción inmediata'
          ]
        },
        alto: {
          causas: [
            'Lipidosis hepática (hígado graso - si dejó de comer)',
            'Hepatitis',
            'Toxicidad por medicamentos',
            'Colangitis (inflamación de conductos biliares)'
          ],
          recomendaciones: [
            'NUNCA dejar a un gato sin comer más de 48 horas',
            'Consulta veterinaria para evaluación hepática',
            'Dieta de fácil digestión con proteína moderada',
            'Si dejó de comer: alimentar con jeringa si es necesario'
          ],
          nutricional: {
            nota: 'Dieta hepatoprotectora: proteína moderada de alta calidad',
            ajuste: { grasa: { min: 18, max: 22 }, proteina: { min: 35, max: 40 } }
          },
          urgente: true
        }
      }
    },
    proteinastotales: {
      min: 5.4, max: 7.8, unit: 'g/dL',
      nombre: 'Proteínas Totales',
      descripcion: 'Nivel total de proteínas en sangre',
      interpretaciones: {
        bajo: {
          causas: [
            'Desnutrición (dieta inadecuada)',
            'Enfermedad hepática',
            'Pérdida renal de proteínas',
            'Enteropatía perdedora de proteínas'
          ],
          recomendaciones: [
            'Dieta alta en proteína animal de calidad',
            'Los gatos necesitan taurina de fuentes animales',
            'Consulta veterinaria para identificar causa'
          ],
          nutricional: {
            nota: 'Maximizar proteína animal con taurina',
            ajuste: { proteina: { min: 45, max: 50 } }
          }
        },
        alto: {
          causas: [
            'Deshidratación',
            'Infección crónica (FIP - Peritonitis Infecciosa Felina)',
            'Enfermedades inmunomediadas'
          ],
          recomendaciones: [
            'Mejorar hidratación (alimento húmedo, fuentes de agua)',
            'Consulta veterinaria para descartar FIP',
            'Repetir examen tras hidratación'
          ]
        }
      }
    },
    // === Hemograma expandido (gato) ===
    hematocrito: {
      min: 30, max: 45, unit: '%', nombre: 'Hematocrito',
      descripcion: 'Porcentaje del volumen sanguíneo ocupado por glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['Anemia', 'Enfermedad renal crónica', 'FeLV'], recomendaciones: ['Consulta veterinaria', 'Test FeLV/FIV'] },
        alto: { causas: ['Deshidratación (muy común en gatos)'], recomendaciones: ['Aumentar hidratación', 'Alimento húmedo'] }
      }
    },
    eritrocitos: {
      min: 5.0, max: 10.0, unit: 'x10⁶/µL', nombre: 'Eritrocitos',
      descripcion: 'Conteo de glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['Anemia', 'FeLV', 'Enfermedad renal'], recomendaciones: ['Consulta veterinaria'] },
        alto: { causas: ['Deshidratación', 'Policitemia'], recomendaciones: ['Mejorar hidratación'] }
      }
    },
    leucocitos: {
      min: 5.5, max: 19.5, unit: 'x10³/µL', nombre: 'Leucocitos',
      descripcion: 'Glóbulos blancos del sistema inmunológico',
      interpretaciones: {
        bajo: { causas: ['FeLV', 'Panleucopenia', 'Inmunosupresión'], recomendaciones: ['CONSULTA VETERINARIA URGENTE', 'Test FeLV/FIV'], urgente: true },
        alto: { causas: ['Infección', 'Estrés', 'Inflamación'], recomendaciones: ['Consulta veterinaria para identificar causa'] }
      }
    },
    plaquetas: {
      min: 175, max: 500, unit: 'x10³/µL', nombre: 'Plaquetas',
      descripcion: 'Células de coagulación',
      interpretaciones: {
        bajo: { causas: ['Agregación plaquetaria (artefacto en gatos)', 'Infección', 'CID'], recomendaciones: ['Repetir examen con anticoagulante diferente', 'Consulta veterinaria'] },
        alto: { causas: ['Inflamación', 'Deficiencia de hierro'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    vcm: {
      min: 39, max: 55, unit: 'fL', nombre: 'VCM',
      descripcion: 'Volumen corpuscular medio',
      interpretaciones: {
        bajo: { causas: ['Deficiencia de hierro'], recomendaciones: ['Evaluar dieta'] },
        alto: { causas: ['FeLV', 'Reticulocitosis'], recomendaciones: ['Test FeLV si no se ha realizado'] }
      }
    },
    hcm: {
      min: 12.5, max: 17.5, unit: 'pg', nombre: 'HCM',
      descripcion: 'Hemoglobina corpuscular media',
      interpretaciones: {
        bajo: { causas: ['Deficiencia de hierro'], recomendaciones: ['Verificar dieta'] },
        alto: { causas: ['Macrocitosis'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    chcm: {
      min: 30, max: 36, unit: 'g/dL', nombre: 'CHCM',
      descripcion: 'Concentración de hemoglobina corpuscular media',
      interpretaciones: {
        bajo: { causas: ['Reticulocitosis', 'Deficiencia de hierro'], recomendaciones: ['Evaluar causa de anemia'] },
        alto: { causas: ['Hemólisis', 'Esferocitosis'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    neutrofilos: {
      min: 2.5, max: 12.5, unit: 'x10³/µL', nombre: 'Neutrófilos',
      descripcion: 'Primera línea de defensa del sistema inmune',
      interpretaciones: {
        bajo: { causas: ['Panleucopenia', 'FeLV', 'Sepsis'], recomendaciones: ['CONSULTA VETERINARIA URGENTE'], urgente: true },
        alto: { causas: ['Infección bacteriana', 'Estrés', 'Inflamación'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    linfocitos: {
      min: 1.5, max: 7.0, unit: 'x10³/µL', nombre: 'Linfocitos',
      descripcion: 'Glóbulos blancos para inmunidad adaptativa',
      interpretaciones: {
        bajo: { causas: ['Estrés', 'FIV', 'Corticoides'], recomendaciones: ['Test FIV si no se ha realizado'] },
        alto: { causas: ['Infección crónica', 'Linfoma'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    monocitos: {
      min: 0, max: 0.85, unit: 'x10³/µL', nombre: 'Monocitos',
      descripcion: 'Glóbulos blancos de respuesta inflamatoria',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Inflamación crónica', 'Estrés'], recomendaciones: ['Consulta veterinaria si persiste'] }
      }
    },
    eosinofilos: {
      min: 0, max: 1.5, unit: 'x10³/µL', nombre: 'Eosinófilos',
      descripcion: 'Asociados a alergias y parásitos',
      interpretaciones: {
        bajo: { causas: ['Estrés', 'Corticoides'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Parásitos', 'Alergias', 'Asma felina', 'Complejo granuloma eosinofílico'], recomendaciones: ['Desparasitación', 'Evaluar alergias'] }
      }
    },
    // === Química expandida (gato) ===
    bun: {
      min: 16, max: 36, unit: 'mg/dL', nombre: 'BUN (Nitrógeno Ureico)',
      descripcion: 'Producto de desecho filtrado por riñones',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática severa', 'Dieta baja en proteína'], recomendaciones: ['Los gatos necesitan alta proteína - evaluar dieta'] },
        alto: { causas: ['Enfermedad renal crónica (muy común en gatos)', 'Deshidratación', 'Obstrucción urinaria'], recomendaciones: ['CONSULTA VETERINARIA', 'Hidratación CRÍTICA', 'Evaluar función renal completa'], urgente: true }
      }
    },
    ast: {
      min: 10, max: 50, unit: 'U/L', nombre: 'AST (Aspartato Aminotransferasa)',
      descripcion: 'Enzima de hígado y músculo',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Lipidosis hepática', 'Daño muscular', 'Hepatitis'], recomendaciones: ['Consulta veterinaria', 'Si dejó de comer: URGENTE'] }
      }
    },
    alp: {
      min: 10, max: 80, unit: 'U/L', nombre: 'ALP (Fosfatasa Alcalina)',
      descripcion: 'Enzima hepática y ósea',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Lipidosis hepática', 'Hipertiroidismo', 'Enfermedad hepática'], recomendaciones: ['CONSULTA VETERINARIA - en gatos, ALP elevada es más significativa que en perros'], urgente: true }
      }
    },
    ggt: {
      min: 0, max: 5, unit: 'U/L', nombre: 'GGT (Gamma-Glutamil Transferasa)',
      descripcion: 'Enzima hepática y biliar',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Colangitis', 'Obstrucción biliar', 'Lipidosis hepática'], recomendaciones: ['Consulta veterinaria para evaluación hepática'] }
      }
    },
    bilirrubina: {
      min: 0.1, max: 0.4, unit: 'mg/dL', nombre: 'Bilirrubina Total',
      descripcion: 'Pigmento de descomposición de glóbulos rojos',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Lipidosis hepática', 'Hemólisis', 'Colangitis'], recomendaciones: ['CONSULTA VETERINARIA', 'Observar ictericia'], urgente: true }
      }
    },
    albumina: {
      min: 2.1, max: 3.3, unit: 'g/dL', nombre: 'Albúmina',
      descripcion: 'Proteína hepática principal',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática', 'Pérdida renal', 'Enteropatía', 'Malnutrición'], recomendaciones: ['Consulta veterinaria', 'Dieta alta en proteína animal'] },
        alto: { causas: ['Deshidratación'], recomendaciones: ['Mejorar hidratación con alimento húmedo'] }
      }
    },
    globulinas: {
      min: 2.6, max: 5.1, unit: 'g/dL', nombre: 'Globulinas',
      descripcion: 'Proteínas de inmunidad',
      interpretaciones: {
        bajo: { causas: ['Inmunodeficiencia', 'FIV'], recomendaciones: ['Test FIV si no se ha realizado'] },
        alto: { causas: ['FIP', 'Infección crónica', 'Enfermedad inmunomediada'], recomendaciones: ['Consulta veterinaria - descartar FIP'] }
      }
    },
    colesterol: {
      min: 95, max: 220, unit: 'mg/dL', nombre: 'Colesterol',
      descripcion: 'Lípido sanguíneo',
      interpretaciones: {
        bajo: { causas: ['Enfermedad hepática', 'Hipertiroidismo'], recomendaciones: ['Evaluar función hepática y tiroides'] },
        alto: { causas: ['Diabetes', 'Hipotiroidismo (raro en gatos)', 'Dieta alta en grasa'], recomendaciones: ['Consulta veterinaria'] }
      }
    },
    trigliceridos: {
      min: 25, max: 160, unit: 'mg/dL', nombre: 'Triglicéridos',
      descripcion: 'Grasa en sangre',
      interpretaciones: {
        bajo: { causas: ['Malnutrición'], recomendaciones: ['Evaluar dieta'] },
        alto: { causas: ['Muestra no en ayunas', 'Diabetes', 'Pancreatitis'], recomendaciones: ['Repetir en ayunas', 'Consulta veterinaria'] }
      }
    },
    amilasa: {
      min: 500, max: 1500, unit: 'U/L', nombre: 'Amilasa',
      descripcion: 'Enzima pancreática',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Pancreatitis', 'Enfermedad renal'], recomendaciones: ['Consulta veterinaria', 'Evaluar junto con lipasa'] }
      }
    },
    lipasa: {
      min: 100, max: 750, unit: 'U/L', nombre: 'Lipasa',
      descripcion: 'Enzima pancreática',
      interpretaciones: {
        bajo: { causas: ['No significativo'], recomendaciones: ['No requiere acción'] },
        alto: { causas: ['Pancreatitis (común en gatos)', 'Enfermedad renal'], recomendaciones: ['CONSULTA VETERINARIA', 'Dieta baja en grasa'], urgente: true }
      }
    },
    calcio: {
      min: 8.0, max: 10.8, unit: 'mg/dL', nombre: 'Calcio',
      descripcion: 'Mineral para huesos y funciones celulares',
      interpretaciones: {
        bajo: { causas: ['Enfermedad renal', 'Hipoparatiroidismo', 'Eclampsia'], recomendaciones: ['CONSULTA VETERINARIA URGENTE si hay temblores'], urgente: true },
        alto: { causas: ['Linfoma', 'Enfermedad renal', 'Hiperparatiroidismo'], recomendaciones: ['CONSULTA VETERINARIA URGENTE'], urgente: true }
      }
    },
    fosforo: {
      min: 3.1, max: 6.8, unit: 'mg/dL', nombre: 'Fósforo',
      descripcion: 'Mineral para huesos y energía',
      interpretaciones: {
        bajo: { causas: ['Hiperparatiroidismo'], recomendaciones: ['Consulta veterinaria'] },
        alto: { causas: ['Enfermedad renal (muy común en gatos mayores)', 'Normal en gatitos'], recomendaciones: ['Dieta baja en fósforo si hay enfermedad renal', 'Consulta veterinaria'] }
      }
    },
    // === Electrolitos (gato) ===
    sodio: {
      min: 147, max: 156, unit: 'mEq/L', nombre: 'Sodio',
      descripcion: 'Electrolito principal extracelular',
      interpretaciones: {
        bajo: { causas: ['Vómito/diarrea', 'Enfermedad renal', 'Fluidoterapia excesiva'], recomendaciones: ['CONSULTA VETERINARIA', 'Evaluar hidratación'], urgente: true },
        alto: { causas: ['Deshidratación severa', 'Diabetes insípida'], recomendaciones: ['Asegurar acceso a agua', 'Consulta veterinaria'] }
      }
    },
    potasio: {
      min: 3.5, max: 5.8, unit: 'mEq/L', nombre: 'Potasio',
      descripcion: 'Electrolito esencial para corazón y músculos',
      interpretaciones: {
        bajo: { causas: ['Vómito/diarrea', 'Enfermedad renal', 'Anorexia prolongada'], recomendaciones: ['CONSULTA VETERINARIA', 'Suplementación de potasio'], urgente: true },
        alto: { causas: ['Enfermedad renal', 'Obstrucción urinaria', 'Addison'], recomendaciones: ['CONSULTA VETERINARIA URGENTE - riesgo cardíaco', 'Si es macho y no orina: EMERGENCIA'], urgente: true }
      }
    },
    cloro: {
      min: 107, max: 120, unit: 'mEq/L', nombre: 'Cloro',
      descripcion: 'Electrolito para equilibrio ácido-base',
      interpretaciones: {
        bajo: { causas: ['Vómito prolongado'], recomendaciones: ['Consulta veterinaria'] },
        alto: { causas: ['Deshidratación', 'Enfermedad renal'], recomendaciones: ['Mejorar hidratación'] }
      }
    }
  }
};

// Rangos de peso por raza y edad para comparación
const RANGOS_PESO_RAZA = {
  'Labrador': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 10, max: 14 },
      '6meses': { min: 18, max: 24 },
      '12meses': { min: 25, max: 32 },
      'adulto': { min: 25, max: 36 }
    },
    percentiles: { p25: 28, p50: 31, p75: 34 }
  },
  'Golden Retriever': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 9, max: 13 },
      '6meses': { min: 17, max: 23 },
      '12meses': { min: 24, max: 31 },
      'adulto': { min: 25, max: 34 }
    },
    percentiles: { p25: 27, p50: 30, p75: 33 }
  },
  'Pastor Alemán': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 10, max: 15 },
      '6meses': { min: 20, max: 28 },
      '12meses': { min: 25, max: 35 },
      'adulto': { min: 22, max: 40 }
    },
    percentiles: { p25: 28, p50: 32, p75: 37 }
  },
  'Bulldog Francés': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 3, max: 5 },
      '6meses': { min: 6, max: 9 },
      '12meses': { min: 8, max: 13 },
      'adulto': { min: 8, max: 14 }
    },
    percentiles: { p25: 9, p50: 11, p75: 13 }
  },
  'Chihuahua': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 0.5, max: 1.2 },
      '6meses': { min: 1, max: 2 },
      '12meses': { min: 1.5, max: 2.8 },
      'adulto': { min: 1.5, max: 3 }
    },
    percentiles: { p25: 1.8, p50: 2.2, p75: 2.7 }
  },
  'Beagle': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 3, max: 5 },
      '6meses': { min: 6, max: 8 },
      '12meses': { min: 8, max: 10 },
      'adulto': { min: 9, max: 11 }
    },
    percentiles: { p25: 9.5, p50: 10, p75: 10.8 }
  },
  'Husky Siberiano': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 6, max: 10 },
      '6meses': { min: 12, max: 18 },
      '12meses': { min: 16, max: 25 },
      'adulto': { min: 16, max: 27 }
    },
    percentiles: { p25: 19, p50: 22, p75: 25 }
  },
  'Boxer': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 8, max: 12 },
      '6meses': { min: 15, max: 22 },
      '12meses': { min: 22, max: 30 },
      'adulto': { min: 25, max: 32 }
    },
    percentiles: { p25: 26, p50: 29, p75: 31 }
  },
  'Persa': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 1, max: 1.8 },
      '6meses': { min: 2, max: 3.2 },
      '12meses': { min: 3, max: 4.5 },
      'adulto': { min: 3, max: 5.5 }
    },
    percentiles: { p25: 3.5, p50: 4.2, p75: 5 }
  },
  'Siamés': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 0.8, max: 1.5 },
      '6meses': { min: 1.8, max: 2.8 },
      '12meses': { min: 2.5, max: 4 },
      'adulto': { min: 3, max: 5 }
    },
    percentiles: { p25: 3.2, p50: 3.8, p75: 4.5 }
  },
  'Maine Coon': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 1.5, max: 2.5 },
      '6meses': { min: 3, max: 5 },
      '12meses': { min: 4.5, max: 7 },
      'adulto': { min: 5, max: 11 }
    },
    percentiles: { p25: 6, p50: 7.5, p75: 9 }
  },
  'Bengalí': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 1, max: 2 },
      '6meses': { min: 2.5, max: 4 },
      '12meses': { min: 3, max: 5.5 },
      'adulto': { min: 3.5, max: 7 }
    },
    percentiles: { p25: 4, p50: 5, p75: 6 }
  },
  'Poodle': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 1.5, max: 8 },
      '6meses': { min: 3, max: 16 },
      '12meses': { min: 3, max: 25 },
      'adulto': { min: 3, max: 32 }
    },
    percentiles: { p25: 6, p50: 15, p75: 25 }
  },
  'Yorkshire Terrier': {
    especie: 'perro',
    pesoIdeal: {
      '3meses': { min: 0.5, max: 1 },
      '6meses': { min: 1, max: 2 },
      '12meses': { min: 1.8, max: 3 },
      'adulto': { min: 2, max: 3.2 }
    },
    percentiles: { p25: 2.2, p50: 2.7, p75: 3 }
  },
  'Ragdoll': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 1.2, max: 2 },
      '6meses': { min: 2.5, max: 4.5 },
      '12meses': { min: 4, max: 7 },
      'adulto': { min: 4, max: 9 }
    },
    percentiles: { p25: 5, p50: 6.5, p75: 8 }
  },
  'Británico de Pelo Corto': {
    especie: 'gato',
    pesoIdeal: {
      '3meses': { min: 1, max: 2 },
      '6meses': { min: 2.5, max: 4 },
      '12meses': { min: 3.5, max: 6 },
      'adulto': { min: 4, max: 8 }
    },
    percentiles: { p25: 4.5, p50: 5.5, p75: 7 }
  }
};

console.log('exam-reference-ranges.js cargado correctamente');
