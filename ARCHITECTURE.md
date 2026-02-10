# PetCare Pro - Arquitectura

## Visión General

PetCare Pro es una aplicación web SPA (Single Page Application) construida con HTML, CSS y JavaScript vanilla. Utiliza Firebase para autenticación, base de datos y almacenamiento de archivos.

## Diagrama de Módulos

```
┌─────────────────────────────────────────────────┐
│                   index.html                     │
│  (UI principal - secciones con display toggle)   │
├─────────────────────────────────────────────────┤
│                    app.js                        │
│  (Lógica principal, estado global, CRUD, UI)     │
├─────────────┬──────────────┬────────────────────┤
│  data.js    │ firebase-    │ Módulos Fase 3     │
│  (datos     │ config.js    ├────────────────────┤
│  estáticos) │ (auth, db,   │ exam-analyzer.js   │
│             │  storage)    │ food-recommender.js│
│             │              │ weight-analyzer.js │
│             │              │ vet-database.js    │
│             │              │ exam-ref-ranges.js │
│             │              │ food-database.js   │
└─────────────┴──────────────┴────────────────────┘
```

## Estado Global

```javascript
estado = {
  mascotas: [],           // Array de perfiles de mascota
  mascotaActiva: null,    // ID de la mascota seleccionada
  examenes: {},           // { petId: [examen, ...] }
  comidas: {},            // { petId: { 'YYYY-MM-DD': [comida, ...] } }
  agua: {},               // { petId: { 'YYYY-MM-DD': ml } }
  pesos: {},              // { petId: [{ fecha, peso, condicion, energia, apetito }] }
  recordatorios: {},      // { petId: [recordatorio, ...] }
  visitas: {},            // { petId: [visita, ...] }
  tema: 'light',          // 'light' | 'dark'
  veterinariasFavoritas: [] // Array de favoritos
}
```

## Flujo de Datos

```
Usuario → Formulario → app.js (validación) → estado global
                                            → guardarDatos() → localStorage
                                            → guardarDatosFirestore() → Firestore
                                            → renderizar*() → DOM
```

## Módulos de Fase 3

### exam-analyzer.js
- `analyzeExam(examData, petProfile)`: Compara valores con rangos de referencia
- `compararConAnterior(examenActual, examenes, petId)`: Detecta cambios entre exámenes
- `generarSugerenciasNutricionales(analisis, pet)`: Ajustes macro basados en resultados
- `renderizarAnalisisExamen(analisis, comparacion)`: HTML del panel de análisis
- `generarAlertasExamenes(pet, examenes)`: Alertas para el dashboard
- `generarRecordatoriosCondicionales(analisis, pet)`: Recordatorios automáticos

### food-recommender.js
- `recommendFood(petProfile, examResults, pais)`: Top 5 alimentos con scoring
- `calcularScore(alimento, requerimientos, pet)`: Scoring ponderado (proteína 30%, grasa 25%, salud 25%, disponibilidad 10%, precio 10%)
- `calcularPorcionesAlimento(alimento, pet)`: Gramos, tazas, comidas, costo/mes
- `renderizarRecomendaciones(recomendaciones, pet, pais)`: HTML de tarjetas

### weight-analyzer.js
- `detectTrend(weightHistory)`: Tendencia de los últimos 6 registros
- `predictIdealWeight(raza, edadMeses)`: Peso ideal dinámico por edad
- `compareWithPercentiles(peso, raza, edadMeses)`: Estado vs percentiles
- `generarAlertasPeso(pet, pesos)`: Alertas inteligentes
- `renderizarAnalisisPeso(pet, pesos)`: HTML con indicadores visuales

### vet-database.js
- `VET_DATABASE`: 50 veterinarias en 6 ciudades colombianas
- `TIEMPOS_DIGESTION`: Datos de digestión por especie, alimento, edad, tamaño, raza
- `calcularTiempoDigestion(pet, tipoAlimento)`: Tiempo personalizado
- `filtrarVeterinarias(filtros)`: Búsqueda con múltiples criterios
- `estaAbiertoAhora(vet)`: Verificación de horario actual

### exam-reference-ranges.js
- `RANGOS_REFERENCIA`: Rangos detallados con interpretaciones para perro y gato
- `RANGOS_PESO_RAZA`: Pesos por edad (3m, 6m, 12m, adulto) para 12 razas con percentiles

### food-database.js
- `FOOD_DATABASE`: Alimentos por país (Colombia, México) con datos nutricionales
- `formatearPrecio(precio, pais)`: Formato de moneda local

## Cálculos Nutricionales

### Calorías diarias
```
RER = 70 × (peso_kg)^0.75
Calorías = RER × factor_actividad × ajustes
```

Ajustes: cachorro (+25%), senior (-10%), castrado (-10%), sobrepeso (-20%)

### Scoring de alimentos
```
Score = (scoreProteina × 0.30) + (scoreGrasa × 0.25) +
        (scoreSalud × 0.25) + (scoreDisponibilidad × 0.10) +
        (scorePrecio × 0.10)
```

### Tiempo de digestión
```
Tiempo = base_por_tipo × factor_edad × factor_tamaño × factor_raza
```

## Páginas Independientes

- `directorio-veterinarias.html`: SPA con filtros, búsqueda, grid de tarjetas
- `veterinaria-detalle.html`: Detalle individual cargado por URL param `?id=`
- `educacion-nutricional.html`: Contenido educativo estático

## Seguridad

- Autenticación Firebase con persistencia LOCAL
- Reglas Firestore: cada usuario solo accede a sus datos
- Validación de tamaños: fotos 5MB, PDFs 10MB
- Compresión de imágenes antes de upload
- Escape de HTML en todas las entradas del usuario (`escapeHtml()`)
- Sin inyección de scripts en contenido dinámico

## Responsive Design

- **Mobile** (< 600px): 1 columna, sidebar como drawer
- **Tablet** (600-1023px): 2 columnas, sidebar como drawer
- **Desktop** (1024px+): 3 columnas, sidebar fijo
