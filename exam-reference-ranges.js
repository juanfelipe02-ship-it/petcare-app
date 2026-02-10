// ============================================================
// PetCare Pro - Rangos de Referencia para Exámenes Médicos
// ============================================================

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
