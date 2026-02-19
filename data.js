// ============================================================
// PetCare Pro - Base de datos de razas y requerimientos
// ============================================================

const RAZAS = {
  perro: [
    { nombre: 'Labrador', pesoIdeal: { min: 25, max: 36 }, esperanzaVida: 12, tamaño: 'grande' },
    { nombre: 'Golden Retriever', pesoIdeal: { min: 25, max: 34 }, esperanzaVida: 12, tamaño: 'grande' },
    { nombre: 'Pastor Alemán', pesoIdeal: { min: 22, max: 40 }, esperanzaVida: 11, tamaño: 'grande' },
    { nombre: 'Bulldog Francés', pesoIdeal: { min: 8, max: 14 }, esperanzaVida: 11, tamaño: 'pequeño' },
    { nombre: 'Chihuahua', pesoIdeal: { min: 1.5, max: 3 }, esperanzaVida: 15, tamaño: 'mini' },
    { nombre: 'Beagle', pesoIdeal: { min: 9, max: 11 }, esperanzaVida: 13, tamaño: 'mediano' },
    { nombre: 'Poodle', pesoIdeal: { min: 3, max: 32 }, esperanzaVida: 14, tamaño: 'variable' },
    { nombre: 'Yorkshire Terrier', pesoIdeal: { min: 2, max: 3.2 }, esperanzaVida: 14, tamaño: 'mini' },
    { nombre: 'Boxer', pesoIdeal: { min: 25, max: 32 }, esperanzaVida: 10, tamaño: 'grande' },
    { nombre: 'Husky Siberiano', pesoIdeal: { min: 16, max: 27 }, esperanzaVida: 13, tamaño: 'mediano' },
    { nombre: 'Rottweiler', pesoIdeal: { min: 36, max: 60 }, esperanzaVida: 10, tamaño: 'grande' },
    { nombre: 'Dachshund (Salchicha)', pesoIdeal: { min: 5, max: 14 }, esperanzaVida: 14, tamaño: 'pequeño' },
    { nombre: 'Schnauzer Miniatura', pesoIdeal: { min: 5, max: 8 }, esperanzaVida: 14, tamaño: 'pequeño' },
    { nombre: 'Shih Tzu', pesoIdeal: { min: 4, max: 7 }, esperanzaVida: 13, tamaño: 'pequeño' },
    { nombre: 'Doberman', pesoIdeal: { min: 32, max: 45 }, esperanzaVida: 11, tamaño: 'grande' },
    { nombre: 'Gran Danés', pesoIdeal: { min: 50, max: 80 }, esperanzaVida: 8, tamaño: 'gigante' },
    { nombre: 'Cocker Spaniel', pesoIdeal: { min: 12, max: 15 }, esperanzaVida: 13, tamaño: 'mediano' },
    { nombre: 'Border Collie', pesoIdeal: { min: 14, max: 20 }, esperanzaVida: 13, tamaño: 'mediano' },
    { nombre: 'Pit Bull Terrier', pesoIdeal: { min: 16, max: 30 }, esperanzaVida: 13, tamaño: 'mediano' },
    { nombre: 'Maltés', pesoIdeal: { min: 2, max: 4 }, esperanzaVida: 14, tamaño: 'mini' },
    { nombre: 'Dálmata', pesoIdeal: { min: 24, max: 32 }, esperanzaVida: 12, tamaño: 'grande' },
    { nombre: 'San Bernardo', pesoIdeal: { min: 54, max: 82 }, esperanzaVida: 9, tamaño: 'gigante' },
    { nombre: 'Weimaraner', pesoIdeal: { min: 25, max: 40 }, esperanzaVida: 12, tamaño: 'grande' },
    { nombre: 'Bichón Frisé', pesoIdeal: { min: 3, max: 5 }, esperanzaVida: 14, tamaño: 'pequeño' },
    { nombre: 'Shar Pei', pesoIdeal: { min: 18, max: 25 }, esperanzaVida: 10, tamaño: 'mediano' },
    { nombre: 'Criollo', pesoIdeal: { min: 5, max: 35 }, esperanzaVida: 13, tamaño: 'variable' },
    { nombre: 'Otra', pesoIdeal: { min: 1, max: 80 }, esperanzaVida: 12, tamaño: 'variable' }
  ],
  gato: [
    { nombre: 'Persa', pesoIdeal: { min: 3, max: 5.5 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Siamés', pesoIdeal: { min: 3, max: 5 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Maine Coon', pesoIdeal: { min: 5, max: 11 }, esperanzaVida: 13, tamaño: 'grande' },
    { nombre: 'Bengalí', pesoIdeal: { min: 3.5, max: 7 }, esperanzaVida: 14, tamaño: 'mediano' },
    { nombre: 'Ragdoll', pesoIdeal: { min: 4, max: 9 }, esperanzaVida: 15, tamaño: 'grande' },
    { nombre: 'Británico de Pelo Corto', pesoIdeal: { min: 4, max: 8 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Criollo', pesoIdeal: { min: 3, max: 6 }, esperanzaVida: 15, tamaño: 'variable' },
    { nombre: 'Otra', pesoIdeal: { min: 2, max: 12 }, esperanzaVida: 14, tamaño: 'variable' }
  ]
};

// Advertencias específicas por raza
const ADVERTENCIAS_RAZA = {
  'Labrador': ['Propenso a obesidad. Controlar estrictamente las porciones.', 'Riesgo de displasia de cadera; mantener peso ideal es crucial.'],
  'Golden Retriever': ['Propenso a alergias alimentarias.', 'Vigilar peso para proteger articulaciones.'],
  'Pastor Alemán': ['Estómago sensible. Cambios de dieta deben ser graduales.', 'Propenso a torsión gástrica; dividir comidas en 2-3 tomas.'],
  'Bulldog Francés': ['Propenso a flatulencias y problemas digestivos.', 'Evitar exceso de peso por problemas respiratorios.'],
  'Chihuahua': ['Metabolismo rápido, requiere comidas frecuentes.', 'Propenso a hipoglucemia si no come regularmente.'],
  'Beagle': ['Extremadamente propenso a obesidad.', 'Apetito insaciable; nunca dejar comida libre.'],
  'Poodle': ['Puede ser selectivo con la comida.', 'Propenso a problemas dentales; considerar croquetas de tamaño adecuado.'],
  'Yorkshire Terrier': ['Estómago delicado.', 'Requiere comidas pequeñas y frecuentes.'],
  'Boxer': ['Propenso a alergias alimentarias.', 'Riesgo de torsión gástrica; evitar ejercicio después de comer.'],
  'Husky Siberiano': ['Necesidades calóricas más bajas de lo esperado para su tamaño.', 'Puede ser selectivo con la comida en clima cálido.'],
  'Persa': ['Cara plana dificulta comer; usar platos anchos y poco profundos.', 'Propenso a formación de bolas de pelo; fibra adicional recomendada.'],
  'Siamés': ['Metabolismo rápido.', 'Tendencia a ser vocal cuando tiene hambre.'],
  'Maine Coon': ['Crecimiento lento; dieta especial hasta los 4 años.', 'Necesita más proteína que el promedio.'],
  'Bengalí': ['Alta energía, requiere más calorías.', 'Prefiere variedad en la alimentación.'],
  'Ragdoll': ['Propenso a cálculos urinarios; hidratación es crucial.', 'Tendencia al sobrepeso en la adultez.'],
  'Británico de Pelo Corto': ['Propenso a obesidad.', 'Metabolismo lento; controlar porciones cuidadosamente.'],
  'Rottweiler': ['Propenso a torsión gástrica; dividir comidas en 2-3 tomas.', 'Tendencia al sobrepeso en la adultez; controlar porciones.'],
  'Dachshund (Salchicha)': ['Columna vulnerable; el sobrepeso agrava problemas de espalda.', 'Propenso a enfermedad del disco intervertebral (IVDD).'],
  'Schnauzer Miniatura': ['Propenso a pancreatitis; evitar alimentos altos en grasa.', 'Tendencia a formar cálculos urinarios; buena hidratación es esencial.'],
  'Shih Tzu': ['Braquicefálico; puede tener dificultad para comer croquetas grandes.', 'Propenso a problemas dentales; cuidado oral regular necesario.'],
  'Doberman': ['Riesgo de cardiomiopatía dilatada; taurina y L-carnitina importantes.', 'Propenso a torsión gástrica; evitar ejercicio después de comer.'],
  'Gran Danés': ['Crecimiento extremadamente rápido; dieta controlada en calcio durante desarrollo.', 'Alto riesgo de torsión gástrica; dividir comidas en 2-3 tomas pequeñas.'],
  'Cocker Spaniel': ['Propenso a otitis y alergias alimentarias.', 'Tendencia a la obesidad; controlar premios y porciones.'],
  'Border Collie': ['Alta energía; necesita más calorías que razas de su tamaño.', 'Sensibilidad al gen MDR1; consultar veterinario antes de dar suplementos.'],
  'Pit Bull Terrier': ['Propenso a alergias cutáneas y alimentarias.', 'Alta masa muscular requiere proteína de calidad.'],
  'Maltés': ['Propenso a hipoglucemia; comidas frecuentes necesarias.', 'Sensibilidad digestiva; cambios de dieta deben ser graduales.'],
  'Dálmata': ['Metabolismo de purinas alterado; dieta baja en purinas obligatoria.', 'Propenso a cálculos urinarios de urato; hidratación crucial.'],
  'San Bernardo': ['Crecimiento lento; no sobrealimentar durante desarrollo.', 'Muy propenso a torsión gástrica; nunca dar una sola comida grande al día.'],
  'Weimaraner': ['Propenso a torsión gástrica; dividir comidas en 2-3 tomas.', 'Alta energía; puede necesitar más calorías en días activos.'],
  'Bichón Frisé': ['Propenso a alergias alimentarias.', 'Sensible a colorantes y preservantes artificiales.'],
  'Shar Pei': ['Piel arrugada propensa a infecciones; omega-3 beneficioso.', 'Propenso a amiloidosis y fiebre del Shar Pei; proteína de calidad es esencial.']
};

// Factores de actividad para cálculo calórico
const FACTORES_ACTIVIDAD = {
  sedentario: 1.2,
  moderado: 1.4,
  activo: 1.6,
  muy_activo: 1.8
};

// Distribución de macronutrientes (% de calorías)
const MACRONUTRIENTES = {
  perro: { proteina: { min: 25, max: 30 }, grasa: { min: 15, max: 20 }, carbohidratos: { min: 40, max: 50 } },
  gato: { proteina: { min: 35, max: 45 }, grasa: { min: 20, max: 25 }, carbohidratos: { min: 10, max: 15 } }
};

// Calorías por gramo de macronutriente
const CALORIAS_POR_GRAMO = {
  proteina: 4,
  grasa: 9,
  carbohidratos: 4
};

// Frecuencia de alimentación según edad (meses)
const FRECUENCIA_ALIMENTACION = {
  perro: [
    { edadMin: 0, edadMax: 3, frecuencia: '4 veces al día', nota: 'Cachorro en destete' },
    { edadMin: 3, edadMax: 6, frecuencia: '3 veces al día', nota: 'Cachorro en crecimiento' },
    { edadMin: 6, edadMax: 12, frecuencia: '2-3 veces al día', nota: 'Cachorro adolescente' },
    { edadMin: 12, edadMax: 84, frecuencia: '2 veces al día', nota: 'Adulto' },
    { edadMin: 84, edadMax: 999, frecuencia: '2-3 veces al día (porciones más pequeñas)', nota: 'Senior' }
  ],
  gato: [
    { edadMin: 0, edadMax: 4, frecuencia: '4-5 veces al día', nota: 'Gatito' },
    { edadMin: 4, edadMax: 12, frecuencia: '3 veces al día', nota: 'Gatito en crecimiento' },
    { edadMin: 12, edadMax: 84, frecuencia: '2 veces al día', nota: 'Adulto' },
    { edadMin: 84, edadMax: 999, frecuencia: '2-3 veces al día (porciones más pequeñas)', nota: 'Senior' }
  ]
};

// Marcas recomendadas según especie y condición
const MARCAS_RECOMENDADAS = {
  perro: {
    cachorro: ['Royal Canin Puppy', 'Hill\'s Science Diet Puppy', 'Purina Pro Plan Puppy', 'Eukanuba Puppy'],
    adulto: ['Royal Canin Adult', 'Hill\'s Science Diet Adult', 'Purina Pro Plan Adult', 'Acana Adult Dog'],
    senior: ['Royal Canin Senior', 'Hill\'s Science Diet Senior', 'Purina Pro Plan Senior', 'Orijen Senior Dog'],
    sobrepeso: ['Hill\'s Metabolic', 'Royal Canin Satiety', 'Purina Pro Plan Weight Management']
  },
  gato: {
    cachorro: ['Royal Canin Kitten', 'Hill\'s Science Diet Kitten', 'Purina Pro Plan Kitten'],
    adulto: ['Royal Canin Adult', 'Hill\'s Science Diet Adult', 'Purina Pro Plan Adult', 'Orijen Cat'],
    senior: ['Royal Canin Senior', 'Hill\'s Science Diet Senior 11+', 'Purina Pro Plan Senior'],
    sobrepeso: ['Hill\'s Metabolic Cat', 'Royal Canin Satiety Cat', 'Purina Pro Plan Weight Management']
  }
};

// Plan de vacunación perros
const VACUNACION_PERRO = [
  { edadSemanas: 6, vacuna: 'Parvovirus + Moquillo (1ra dosis)', tipo: 'cachorro' },
  { edadSemanas: 8, vacuna: 'Polivalente (DHPPI) - 1ra dosis', tipo: 'cachorro' },
  { edadSemanas: 12, vacuna: 'Polivalente (DHPPI) - 2da dosis', tipo: 'cachorro' },
  { edadSemanas: 16, vacuna: 'Polivalente (DHPPI) - 3ra dosis + Rabia', tipo: 'cachorro' },
  { edadSemanas: 52, vacuna: 'Refuerzo Polivalente + Rabia (anual)', tipo: 'adulto' }
];

// Plan de vacunación gatos
const VACUNACION_GATO = [
  { edadSemanas: 8, vacuna: 'Triple Felina (PRC) - 1ra dosis', tipo: 'cachorro' },
  { edadSemanas: 12, vacuna: 'Triple Felina (PRC) - 2da dosis', tipo: 'cachorro' },
  { edadSemanas: 16, vacuna: 'Triple Felina (PRC) - 3ra dosis + Rabia', tipo: 'cachorro' },
  { edadSemanas: 52, vacuna: 'Refuerzo Triple Felina + Rabia (anual)', tipo: 'adulto' }
];

// Tipos de exámenes médicos
const TIPOS_EXAMEN = [
  'Hemograma completo',
  'Perfil bioquímico',
  'Examen de orina',
  'Coprológico',
  'Ecografía',
  'Rayos X',
  'Perfil tiroideo',
  'Otro'
];

// VALORES_REFERENCIA eliminado — ahora se usa RANGOS_REFERENCIA de exam-reference-ranges.js

// Consejos del día aleatorios
const CONSEJOS_DIA = [
  { icono: 'fa-tint', texto: 'El agua fresca siempre debe estar disponible. Cambia el agua al menos 2 veces al día.' },
  { icono: 'fa-weight', texto: 'Pesa a tu mascota semanalmente a la misma hora para obtener lecturas consistentes.' },
  { icono: 'fa-apple-alt', texto: 'Los cambios de dieta deben hacerse gradualmente durante 7-10 días para evitar problemas digestivos.' },
  { icono: 'fa-running', texto: 'El ejercicio regular ayuda a mantener un peso saludable y mejora el comportamiento.' },
  { icono: 'fa-tooth', texto: 'La salud dental afecta la nutrición. Revisa los dientes de tu mascota regularmente.' },
  { icono: 'fa-thermometer-half', texto: 'En verano, aumenta el acceso al agua. Las mascotas necesitan más hidratación con el calor.' },
  { icono: 'fa-bone', texto: 'Las golosinas no deben superar el 10% de las calorías diarias totales.' },
  { icono: 'fa-clock', texto: 'Mantén horarios regulares de alimentación. La consistencia ayuda a la digestión.' },
  { icono: 'fa-heart', texto: 'Un peso saludable puede agregar hasta 2 años de vida a tu mascota.' },
  { icono: 'fa-utensils', texto: 'El plato de comida debe lavarse después de cada comida para evitar bacterias.' },
  { icono: 'fa-fish', texto: 'El omega-3 (aceite de pescado) mejora la piel y el pelaje de tu mascota.' },
  { icono: 'fa-carrot', texto: 'Algunas verduras como zanahoria y calabaza son snacks saludables para perros.' },
  { icono: 'fa-exclamation-triangle', texto: 'El chocolate, uvas, cebolla y ajo son tóxicos para perros y gatos.' },
  { icono: 'fa-paw', texto: 'Observa las heces de tu mascota: son un indicador importante de salud digestiva.' },
  { icono: 'fa-stethoscope', texto: 'Un chequeo veterinario anual es esencial para detectar problemas a tiempo.' },
  { icono: 'fa-leaf', texto: 'La fibra en la dieta ayuda a la digestión y puede prevenir problemas de estreñimiento.' },
  { icono: 'fa-pills', texto: 'Nunca mediques a tu mascota sin consultar al veterinario primero.' },
  { icono: 'fa-sun', texto: 'La vitamina D es importante, pero los gatos y perros la obtienen de la dieta, no del sol.' }
];

// Glosario de términos médicos veterinarios
const GLOSARIO = [
  { termino: 'Hemograma', definicion: 'Análisis de sangre que evalúa glóbulos rojos, blancos y plaquetas. Detecta anemia, infecciones y problemas de coagulación.' },
  { termino: 'Perfil bioquímico', definicion: 'Conjunto de pruebas que evalúan la función de órganos como hígado, riñones y páncreas.' },
  { termino: 'ALT (Alanina aminotransferasa)', definicion: 'Enzima hepática. Niveles elevados pueden indicar daño en el hígado.' },
  { termino: 'Creatinina', definicion: 'Producto de desecho filtrado por los riñones. Niveles altos pueden indicar enfermedad renal.' },
  { termino: 'Glucosa', definicion: 'Nivel de azúcar en sangre. Valores anormales pueden indicar diabetes u otros trastornos metabólicos.' },
  { termino: 'Hemoglobina', definicion: 'Proteína en glóbulos rojos que transporta oxígeno. Niveles bajos indican anemia.' },
  { termino: 'Proteínas totales', definicion: 'Incluye albúmina y globulinas. Refleja estado nutricional e inmunológico.' },
  { termino: 'Coprológico', definicion: 'Examen de heces para detectar parásitos intestinales, bacterias patógenas y problemas digestivos.' },
  { termino: 'Ecografía', definicion: 'Imagen por ultrasonido que permite visualizar órganos internos sin radiación.' },
  { termino: 'Displasia', definicion: 'Desarrollo anormal de una articulación, común en cadera de razas grandes.' },
  { termino: 'Torsión gástrica', definicion: 'Emergencia donde el estómago se dilata y rota. Común en razas grandes de pecho profundo.' },
  { termino: 'Hipoglucemia', definicion: 'Nivel de azúcar en sangre peligrosamente bajo. Común en razas toy y cachorros.' },
  { termino: 'BCS (Body Condition Score)', definicion: 'Escala de condición corporal del 1-5 o 1-9 que evalúa si la mascota tiene peso adecuado.' },
  { termino: 'RER (Resting Energy Requirement)', definicion: 'Requerimiento energético en reposo. Fórmula base: 70 × (peso kg)^0.75' },
  { termino: 'MER (Maintenance Energy Requirement)', definicion: 'Requerimiento energético de mantenimiento. Es el RER multiplicado por el factor de actividad.' },
  { termino: 'Desparasitación', definicion: 'Tratamiento para eliminar parásitos internos (lombrices) o externos (pulgas, garrapatas).' },
  { termino: 'Polivalente (DHPPI)', definicion: 'Vacuna que protege contra Distemper, Hepatitis, Parvovirus, Parainfluenza.' },
  { termino: 'Triple Felina (PRC)', definicion: 'Vacuna que protege contra Panleucopenia, Rinotraqueitis y Calicivirus felino.' }
];

// Alimentos comunes con calorías aproximadas por 100g
const ALIMENTOS_CATEGORIAS = {
  'Concentrados (secos)': {
    icono: 'fa-cookie',
    items: {
      'Croquetas estándar': 350,
      'Croquetas premium': 380,
      'Croquetas light': 300,
      'Croquetas cachorro': 400,
      'Croquetas senior': 320
    }
  },
  'Alimento húmedo': {
    icono: 'fa-drumstick-bite',
    items: {
      'Alimento húmedo estándar': 85,
      'Alimento húmedo premium': 100,
      'Atún enlatado': 116,
      'Sardina enlatada': 208
    }
  },
  'Comida natural / casera': {
    icono: 'fa-leaf',
    items: {
      'Pollo cocido': 165,
      'Res cocida': 250,
      'Cerdo cocido': 242,
      'Pavo cocido': 135,
      'Pescado cocido': 120,
      'Hígado de res cocido': 191,
      'Carne molida cocida': 232,
      'Huevo cocido': 155,
      'Arroz cocido': 130,
      'Pasta cocida': 131,
      'Avena cocida': 71,
      'Batata/camote cocido': 86,
      'Calabaza cocida': 26,
      'Brócoli cocido': 35,
      'Zanahoria': 41,
      'Manzana': 52,
      'Plátano/banano': 89,
      'BARF (dieta cruda mixta)': 150
    }
  },
  'Snacks y complementos': {
    icono: 'fa-cheese',
    items: {
      'Yogur natural': 59,
      'Queso cottage': 98
    }
  },
  'Otro': {
    icono: 'fa-plus-circle',
    items: {
      'Otro': 0
    }
  }
};

// Mapa plano para compatibilidad con código existente
const ALIMENTOS_CALORIAS = {};
Object.values(ALIMENTOS_CATEGORIAS).forEach(cat => {
  Object.assign(ALIMENTOS_CALORIAS, cat.items);
});

// Perfil de macronutrientes por alimento (% por PESO, como en empaques)
// Fuentes: USDA FoodData Central, análisis garantizado de marcas comerciales
// El cálculo interno convierte a calorías: proteína×4kcal/g, grasa×9kcal/g, carbos×4kcal/g
const MACROS_POR_ALIMENTO = {
  // Concentrados (secos)
  'Croquetas estándar':       { proteina: 22, grasa: 10, carbohidratos: 54 },
  'Croquetas premium':        { proteina: 27, grasa: 15, carbohidratos: 45 },
  'Croquetas light':          { proteina: 28, grasa: 8, carbohidratos: 48 },
  'Croquetas cachorro':       { proteina: 32, grasa: 20, carbohidratos: 36 },
  'Croquetas senior':         { proteina: 24, grasa: 10, carbohidratos: 50 },
  // Alimento húmedo (sobre peso total incluyendo agua)
  'Alimento húmedo estándar': { proteina: 8, grasa: 5, carbohidratos: 4 },
  'Alimento húmedo premium':  { proteina: 10, grasa: 6, carbohidratos: 3 },
  // Atún enlatado en agua (USDA 15121)
  'Atún enlatado':            { proteina: 26, grasa: 1, carbohidratos: 0 },
  // Sardina enlatada (USDA 15088)
  'Sardina enlatada':         { proteina: 25, grasa: 11, carbohidratos: 0 },
  // Carnes — USDA FoodData Central
  'Pollo cocido':             { proteina: 25, grasa: 7.5, carbohidratos: 0 },   // USDA 05009
  'Res cocida':               { proteina: 26, grasa: 17, carbohidratos: 0 },    // USDA 23557
  'Cerdo cocido':             { proteina: 27, grasa: 14, carbohidratos: 0 },    // USDA 10225
  'Pavo cocido':              { proteina: 29, grasa: 1.8, carbohidratos: 0 },   // USDA 05186
  'Pescado cocido':           { proteina: 26, grasa: 1.5, carbohidratos: 0 },   // USDA 15261
  'Hígado de res cocido':     { proteina: 26, grasa: 5.5, carbohidratos: 4 },   // USDA 13327
  'Carne molida cocida':      { proteina: 26, grasa: 15, carbohidratos: 0 },    // USDA 23557
  'Huevo cocido':             { proteina: 13, grasa: 11, carbohidratos: 1 },    // USDA 01129
  // Cereales y vegetales — USDA FoodData Central
  'Arroz cocido':             { proteina: 2.7, grasa: 0.3, carbohidratos: 28 }, // USDA 20051
  'Pasta cocida':             { proteina: 5, grasa: 1, carbohidratos: 25 },     // USDA 20120
  'Avena cocida':             { proteina: 2.5, grasa: 1.5, carbohidratos: 12 }, // USDA 08120
  'Batata/camote cocido':     { proteina: 1.6, grasa: 0.1, carbohidratos: 20 }, // USDA 11508
  'Calabaza cocida':          { proteina: 1, grasa: 0.1, carbohidratos: 5 },    // USDA 11424
  'Brócoli cocido':           { proteina: 2.4, grasa: 0.4, carbohidratos: 7 },  // USDA 11091
  'Zanahoria':                { proteina: 0.9, grasa: 0.2, carbohidratos: 10 }, // USDA 11124
  'Manzana':                  { proteina: 0.3, grasa: 0.2, carbohidratos: 14 }, // USDA 09003
  'Plátano/banano':           { proteina: 1.1, grasa: 0.3, carbohidratos: 23 }, // USDA 09040
  // Dietas especiales y complementos
  'BARF (dieta cruda mixta)': { proteina: 14, grasa: 10, carbohidratos: 1 },
  'Yogur natural':            { proteina: 3.5, grasa: 3.3, carbohidratos: 4.7 },  // USDA 01116
  'Queso cottage':            { proteina: 11, grasa: 4.3, carbohidratos: 3.4 },   // USDA 01015
  'Otro':                     { proteina: 10, grasa: 5, carbohidratos: 10 }
};

// ============================================================
// BASE DE DATOS AMPLIADA POR RAZA
// ============================================================

const INFO_RAZA_DETALLADA = {
  // ==================== PERROS ====================
  'Labrador': {
    especie: 'perro',
    predisposiciones: ['Obesidad (gen POMC mutado)', 'Displasia de cadera y codo', 'Atrofia progresiva de retina', 'Dermatitis atópica'],
    nutricionEspecifica: {
      proteina: { min: 25, max: 28 },
      grasa: { min: 12, max: 15 },
      carbohidratos: { min: 45, max: 50 },
      fibra: '5-7% para mayor saciedad',
      nota: 'Genética: Gen POMC mutado hace que siempre tengan hambre. Recomendación: 10-15% menos calorías que el estándar, alto contenido de fibra para saciedad.'
    },
    alimentosEvitar: ['Golosinas altas en grasa', 'Comida libre (siempre medir porciones)', 'Exceso de premios durante entrenamiento'],
    suplementos: ['Glucosamina/Condroitina para articulaciones', 'Omega-3 (aceite de pescado) para piel', 'L-carnitina para metabolismo de grasa'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 4, min: 7, max: 12 },
      { edadMeses: 6, min: 13, max: 20 }, { edadMeses: 9, min: 18, max: 28 },
      { edadMeses: 12, min: 22, max: 32 }, { edadMeses: 24, min: 25, max: 36 }
    ],
    datosCuriosos: 'El estudio de la Universidad de Cambridge (2016) descubrió que 1 de cada 4 Labradores tiene una mutación en el gen POMC que elimina la sensación de saciedad.',
    kcalPorKg: 30
  },
  'Golden Retriever': {
    especie: 'perro',
    predisposiciones: ['Cáncer (hemangiosarcoma, linfoma)', 'Displasia de cadera', 'Alergias alimentarias', 'Hipotiroidismo'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 42, max: 48 },
      fibra: '3-5%',
      nota: 'Propensos a alergias alimentarias. Considerar proteínas novedosas (venado, pato) si hay intolerancia. Antioxidantes extra por predisposición al cáncer.'
    },
    alimentosEvitar: ['Proteínas comunes si hay alergia (pollo, res)', 'Colorantes y preservantes artificiales', 'Granos si hay intolerancia demostrada'],
    suplementos: ['Omega-3 EPA/DHA para piel y pelaje', 'Antioxidantes (vitamina E, selenio)', 'Glucosamina desde adulto joven'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 4, min: 7, max: 11 },
      { edadMeses: 6, min: 12, max: 19 }, { edadMeses: 9, min: 17, max: 26 },
      { edadMeses: 12, min: 22, max: 30 }, { edadMeses: 24, min: 25, max: 34 }
    ],
    datosCuriosos: 'Los Golden Retrievers tienen una de las tasas más altas de cáncer entre todas las razas, hasta un 60% desarrollará algún tipo durante su vida.',
    kcalPorKg: 32
  },
  'Pastor Alemán': {
    especie: 'perro',
    predisposiciones: ['Displasia de cadera', 'Mielopatía degenerativa', 'Torsión gástrica (GDV)', 'Insuficiencia pancreática exocrina (IPE)'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 15, max: 18 },
      carbohidratos: { min: 40, max: 45 },
      fibra: '3-4%',
      nota: 'Estómago sensible y pecho profundo. NUNCA alimentar una sola vez al día. Dividir en 2-3 comidas. Esperar 1 hora después de comer antes de ejercicio para prevenir torsión gástrica.'
    },
    alimentosEvitar: ['Comidas muy grandes de una sola vez', 'Alimentos con soya (causa flatulencia)', 'Lácteos (muchos son intolerantes)'],
    suplementos: ['Glucosamina/Condroitina (articulaciones)', 'Probióticos para digestión', 'Enzimas pancreáticas si hay IPE diagnosticada'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 4, max: 7 }, { edadMeses: 4, min: 11, max: 17 },
      { edadMeses: 6, min: 16, max: 25 }, { edadMeses: 9, min: 20, max: 32 },
      { edadMeses: 12, min: 22, max: 36 }, { edadMeses: 24, min: 22, max: 40 }
    ],
    datosCuriosos: 'La torsión gástrica es la segunda causa de muerte en Pastores Alemanes. Alimentar desde platos elevados y dividir la comida en 2-3 tomas reduce significativamente el riesgo.',
    kcalPorKg: 33
  },
  'Bulldog Francés': {
    especie: 'perro',
    predisposiciones: ['Síndrome braquicefálico', 'Alergias cutáneas', 'Problemas de columna (IVDD)', 'Dificultad para regular temperatura'],
    nutricionEspecifica: {
      proteina: { min: 25, max: 28 },
      grasa: { min: 12, max: 15 },
      carbohidratos: { min: 45, max: 50 },
      fibra: '4-6%',
      nota: 'Raza braquicefálica con dificultad respiratoria. El sobrepeso EMPEORA dramáticamente los problemas respiratorios. Factor de actividad máximo: x1.3. Croquetas de forma especial para mandíbula corta.'
    },
    alimentosEvitar: ['Alimentos que causan flatulencia (soya, frijoles)', 'Comidas muy calientes', 'Huesos que puedan astillarse'],
    suplementos: ['Omega-3 para piel (propensos a dermatitis)', 'Probióticos para digestión', 'Condroitina para columna'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 2, max: 3 }, { edadMeses: 4, min: 4, max: 6 },
      { edadMeses: 6, min: 6, max: 9 }, { edadMeses: 9, min: 7, max: 11 },
      { edadMeses: 12, min: 8, max: 13 }, { edadMeses: 24, min: 8, max: 14 }
    ],
    datosCuriosos: 'Los Bulldogs Franceses no pueden regular su temperatura corporal eficientemente. En días calurosos, su necesidad de agua aumenta un 30-40%.',
    kcalPorKg: 28
  },
  'Chihuahua': {
    especie: 'perro',
    predisposiciones: ['Hipoglucemia', 'Luxación patelar', 'Colapso traqueal', 'Problemas dentales'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 15, max: 20 },
      carbohidratos: { min: 38, max: 45 },
      fibra: '3-4%',
      nota: 'Metabolismo 25% más rápido que razas grandes. Necesitan 40-50 kcal por kg de peso (vs 30 en razas grandes). DEBEN comer 3-4 veces al día para evitar hipoglucemia.'
    },
    alimentosEvitar: ['Golosinas grandes (riesgo de atragantamiento)', 'Huesos de cualquier tipo', 'Alimentos muy duros'],
    suplementos: ['Dental treats específicos para razas toy', 'Omega-3 para pelaje', 'Calcio durante crecimiento'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.3, max: 0.6 }, { edadMeses: 4, min: 0.5, max: 1.2 },
      { edadMeses: 6, min: 0.8, max: 1.8 }, { edadMeses: 9, min: 1.2, max: 2.5 },
      { edadMeses: 12, min: 1.5, max: 3 }, { edadMeses: 24, min: 1.5, max: 3 }
    ],
    datosCuriosos: 'Un Chihuahua que no come en 8 horas puede desarrollar hipoglucemia peligrosa. Siempre tener acceso a pequeñas cantidades de alimento.',
    kcalPorKg: 45
  },
  'Beagle': {
    especie: 'perro',
    predisposiciones: ['Obesidad severa', 'Epilepsia', 'Hipotiroidismo', 'Enfermedad de disco intervertebral'],
    nutricionEspecifica: {
      proteina: { min: 25, max: 28 },
      grasa: { min: 10, max: 14 },
      carbohidratos: { min: 48, max: 55 },
      fibra: '6-8% para máxima saciedad',
      nota: 'Raza con apetito voraz e insaciable. NUNCA dejar comida libre. Medir SIEMPRE las porciones. Alto contenido de fibra obligatorio para saciedad. Son expertos en robar comida.'
    },
    alimentosEvitar: ['Comida libre/ad libitum', 'Golosinas frecuentes', 'Sobras de la mesa'],
    suplementos: ['L-carnitina para metabolismo de grasa', 'Fibra adicional (calabaza)', 'Omega-3 para piel'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 1.5, max: 2.5 }, { edadMeses: 4, min: 3, max: 5 },
      { edadMeses: 6, min: 5, max: 7 }, { edadMeses: 9, min: 7, max: 9 },
      { edadMeses: 12, min: 8, max: 10 }, { edadMeses: 24, min: 9, max: 11 }
    ],
    datosCuriosos: 'Los Beagles fueron seleccionados como raza modelo para estudios de obesidad precisamente porque nunca dejan de comer. Su capacidad olfativa los hace detectar comida a distancias enormes.',
    kcalPorKg: 28
  },
  'Poodle': {
    especie: 'perro',
    predisposiciones: ['Enfermedad de Addison', 'Epilepsia', 'Problemas dentales', 'Atrofia progresiva de retina'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 42, max: 48 },
      fibra: '3-5%',
      nota: 'Pueden ser selectivos con la comida. Propensos a problemas dentales, croquetas de tamaño adecuado para masticación. Pelo hipoalergénico requiere buena nutrición para mantenerse sano.'
    },
    alimentosEvitar: ['Alimentos muy blandos (empeoran salud dental)', 'Colorantes artificiales'],
    suplementos: ['Omega-3 y biotina para pelaje', 'Dental treats', 'Probióticos'],
    pesoSaludablePorEdad: [
      { edadMeses: 12, min: 3, max: 32 }, { edadMeses: 24, min: 3, max: 32 }
    ],
    datosCuriosos: 'Los Poodles vienen en 4 tamaños (toy, miniatura, mediano, estándar) con necesidades calóricas muy diferentes. Un Poodle toy necesita 45 kcal/kg mientras que un estándar solo 30 kcal/kg.',
    kcalPorKg: 35
  },
  'Yorkshire Terrier': {
    especie: 'perro',
    predisposiciones: ['Hipoglucemia', 'Colapso traqueal', 'Enfermedad de Legg-Calvé-Perthes', 'Problemas dentales severos'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 15, max: 20 },
      carbohidratos: { min: 38, max: 45 },
      fibra: '3-4%',
      nota: 'Estómago muy delicado. Comidas pequeñas y frecuentes (3-4/día). Croquetas pequeñas para mandíbula diminuta. El pelo sedoso requiere excelente nutrición con ácidos grasos.'
    },
    alimentosEvitar: ['Croquetas grandes', 'Huesos', 'Alimentos muy grasos'],
    suplementos: ['Omega-3 y Omega-6 para pelaje sedoso', 'Dental treats miniatura', 'Probióticos para digestión'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.3, max: 0.5 }, { edadMeses: 6, min: 0.8, max: 1.8 },
      { edadMeses: 12, min: 1.5, max: 3 }, { edadMeses: 24, min: 2, max: 3.2 }
    ],
    datosCuriosos: 'Los Yorkshire Terriers pierden hasta el 50% de sus dientes a los 5 años si no reciben cuidado dental adecuado. La dieta influye directamente en su salud oral.',
    kcalPorKg: 45
  },
  'Boxer': {
    especie: 'perro',
    predisposiciones: ['Cardiomiopatía', 'Cáncer (mastocitomas)', 'Alergias alimentarias', 'Torsión gástrica'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 40, max: 46 },
      fibra: '3-5%',
      nota: 'Musculoso y atlético. Alta necesidad de proteína de calidad. Propenso a alergias, considerar dietas de ingredientes limitados. Como raza de pecho profundo, riesgo de torsión gástrica.'
    },
    alimentosEvitar: ['Soya y maíz (alergenos comunes)', 'Comidas grandes de una vez', 'Colorantes artificiales'],
    suplementos: ['Taurina y L-carnitina (salud cardíaca)', 'Antioxidantes', 'Glucosamina'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 6, min: 14, max: 20 },
      { edadMeses: 12, min: 22, max: 28 }, { edadMeses: 24, min: 25, max: 32 }
    ],
    datosCuriosos: 'Los Boxers tienen una de las tasas más altas de mastocitomas (tumor de piel). Los antioxidantes en la dieta pueden ayudar a prevenir su aparición.',
    kcalPorKg: 33
  },
  'Husky Siberiano': {
    especie: 'perro',
    predisposiciones: ['Cataratas juveniles', 'Displasia de cadera', 'Hipotiroidismo', 'Deficiencia de zinc'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 18, max: 22 },
      carbohidratos: { min: 36, max: 42 },
      fibra: '3-4%',
      nota: 'Necesidades calóricas MENORES de lo esperado para su tamaño. Evolucionaron para ser eficientes con poca comida. En clima cálido, pueden rechazar comida. Mayor grasa que otras razas para energía sostenida.'
    },
    alimentosEvitar: ['Exceso de carbohidratos', 'Alimentos con bajo contenido de zinc'],
    suplementos: ['Zinc (propensos a deficiencia)', 'Omega-3 para pelaje doble', 'Vitamina E'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 6, min: 10, max: 16 },
      { edadMeses: 12, min: 15, max: 23 }, { edadMeses: 24, min: 16, max: 27 }
    ],
    datosCuriosos: 'Los Huskies pueden correr 160 km al día quemando grasa corporal como fuente primaria de energía, algo que ningún otro animal doméstico puede hacer. Por eso su dieta es más alta en grasa.',
    kcalPorKg: 28
  },

  'Rottweiler': {
    especie: 'perro',
    predisposiciones: ['Torsión gástrica (GDV)', 'Displasia de cadera y codo', 'Osteosarcoma', 'Estenosis aórtica subvalvular'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 42, max: 48 },
      fibra: '3-5%',
      nota: 'Raza grande y musculosa con pecho profundo. Riesgo de torsión gástrica: dividir en 2-3 comidas diarias. No ejercitar después de comer. Tendencia al sobrepeso en la adultez.'
    },
    alimentosEvitar: ['Comidas grandes de una sola vez', 'Exceso de calcio en crecimiento', 'Golosinas altas en grasa'],
    suplementos: ['Glucosamina/Condroitina desde adulto joven', 'Omega-3 para articulaciones', 'Taurina y L-carnitina para corazón'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 5, max: 8 }, { edadMeses: 4, min: 14, max: 20 },
      { edadMeses: 6, min: 22, max: 33 }, { edadMeses: 9, min: 30, max: 45 },
      { edadMeses: 12, min: 34, max: 52 }, { edadMeses: 24, min: 36, max: 60 }
    ],
    datosCuriosos: 'Los Rottweilers descienden de los perros pastores romanos. Su nombre viene de la ciudad alemana Rottweil, donde se usaban para arrear ganado y tirar carros de carniceros.',
    kcalPorKg: 30
  },
  'Dachshund (Salchicha)': {
    especie: 'perro',
    predisposiciones: ['Enfermedad del disco intervertebral (IVDD)', 'Obesidad', 'Diabetes', 'Epilepsia'],
    nutricionEspecifica: {
      proteina: { min: 25, max: 28 },
      grasa: { min: 12, max: 15 },
      carbohidratos: { min: 47, max: 53 },
      fibra: '5-7%',
      nota: 'Columna larga y vulnerable. El sobrepeso es EXTREMADAMENTE peligroso: cada gramo extra de presión sobre los discos vertebrales aumenta el riesgo de parálisis. Alta fibra para saciedad y control de peso.'
    },
    alimentosEvitar: ['Comida libre', 'Golosinas frecuentes', 'Alimentos altos en grasa'],
    suplementos: ['Glucosamina/Condroitina para columna', 'Omega-3 antiinflamatorio', 'L-carnitina para metabolismo'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 1, max: 2 }, { edadMeses: 4, min: 2, max: 4 },
      { edadMeses: 6, min: 3, max: 7 }, { edadMeses: 9, min: 4, max: 10 },
      { edadMeses: 12, min: 5, max: 12 }, { edadMeses: 24, min: 5, max: 14 }
    ],
    datosCuriosos: 'Los Dachshunds fueron criados para cazar tejones en sus madrigueras. Su forma alargada es una ventaja evolutiva, pero la convierte en la raza con mayor riesgo de problemas de espalda (25% desarrollará IVDD).',
    kcalPorKg: 35
  },
  'Schnauzer Miniatura': {
    especie: 'perro',
    predisposiciones: ['Pancreatitis', 'Hiperlipidemia', 'Cálculos urinarios (estruvita)', 'Diabetes mellitus'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 10, max: 14 },
      carbohidratos: { min: 46, max: 52 },
      fibra: '4-6%',
      nota: 'Propenso a pancreatitis e hiperlipidemia. Dieta BAJA EN GRASA es obligatoria. Nunca dar restos de comida alta en grasa. Monitorear triglicéridos en análisis de sangre.'
    },
    alimentosEvitar: ['Alimentos altos en grasa', 'Sobras de la mesa', 'Premios grasos (orejas de cerdo, huesos con tuétano)'],
    suplementos: ['Probióticos para digestión', 'Omega-3 (en dosis moderadas)', 'Vitamina E antioxidante'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.8, max: 1.5 }, { edadMeses: 4, min: 2, max: 3.5 },
      { edadMeses: 6, min: 3, max: 5 }, { edadMeses: 9, min: 4, max: 6.5 },
      { edadMeses: 12, min: 4.5, max: 7 }, { edadMeses: 24, min: 5, max: 8 }
    ],
    datosCuriosos: 'Los Schnauzers Miniatura tienen la tasa más alta de pancreatitis de todas las razas de perro. Una sola comida alta en grasa puede desencadenar un episodio que requiera hospitalización.',
    kcalPorKg: 38
  },
  'Shih Tzu': {
    especie: 'perro',
    predisposiciones: ['Síndrome braquicefálico', 'Problemas dentales', 'Luxación patelar', 'Enfermedad renal'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 42, max: 48 },
      fibra: '3-5%',
      nota: 'Braquicefálico con mandíbula corta. Croquetas pequeñas o planas. Pelo largo requiere excelente nutrición con ácidos grasos. Propenso a problemas dentales por mandíbula comprimida.'
    },
    alimentosEvitar: ['Croquetas grandes', 'Alimentos muy duros', 'Alimentos calientes (dificultad respiratoria)'],
    suplementos: ['Omega-3 y Omega-6 para pelaje', 'Dental treats miniatura', 'Probióticos'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.5, max: 1 }, { edadMeses: 4, min: 1.5, max: 2.5 },
      { edadMeses: 6, min: 2.5, max: 4 }, { edadMeses: 9, min: 3, max: 5.5 },
      { edadMeses: 12, min: 3.5, max: 6 }, { edadMeses: 24, min: 4, max: 7 }
    ],
    datosCuriosos: 'El Shih Tzu significa "perro león" en chino. Era la raza favorita de la realeza china y no se permitía su exportación. Su pelaje crece continuamente como el cabello humano.',
    kcalPorKg: 40
  },
  'Doberman': {
    especie: 'perro',
    predisposiciones: ['Cardiomiopatía dilatada (DCM)', 'Enfermedad de von Willebrand', 'Torsión gástrica', 'Hipotiroidismo'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 15, max: 18 },
      carbohidratos: { min: 40, max: 45 },
      fibra: '3-5%',
      nota: 'Alto riesgo de cardiomiopatía dilatada (DCM). Taurina y L-carnitina son ESENCIALES en la dieta. Raza atlética con alta necesidad de proteína de calidad. Pecho profundo: riesgo de torsión gástrica.'
    },
    alimentosEvitar: ['Comidas grandes de una sola vez', 'Dietas sin granos (asociadas con DCM)', 'Alimentos con bajo contenido de taurina'],
    suplementos: ['Taurina (obligatorio para salud cardíaca)', 'L-carnitina', 'Omega-3 EPA/DHA', 'Glucosamina para articulaciones'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 4, max: 7 }, { edadMeses: 4, min: 11, max: 18 },
      { edadMeses: 6, min: 18, max: 28 }, { edadMeses: 9, min: 25, max: 36 },
      { edadMeses: 12, min: 30, max: 40 }, { edadMeses: 24, min: 32, max: 45 }
    ],
    datosCuriosos: 'El Doberman tiene la tasa más alta de cardiomiopatía dilatada de todas las razas: hasta el 58% la desarrollará. Suplementar con taurina puede reducir significativamente el riesgo.',
    kcalPorKg: 32
  },
  'Gran Danés': {
    especie: 'perro',
    predisposiciones: ['Torsión gástrica (GDV) - máximo riesgo', 'Cardiomiopatía dilatada', 'Osteosarcoma', 'Wobbler syndrome'],
    nutricionEspecifica: {
      proteina: { min: 24, max: 28 },
      grasa: { min: 12, max: 16 },
      carbohidratos: { min: 46, max: 52 },
      fibra: '3-5%',
      nota: 'Raza GIGANTE con el mayor riesgo de torsión gástrica. NUNCA dar una sola comida al día. Dividir en 3 comidas mínimo. Durante crecimiento: proteína moderada y calcio controlado para evitar problemas óseos. Kcal/kg bajas por metabolismo lento.'
    },
    alimentosEvitar: ['Una sola comida al día', 'Exceso de calcio en crecimiento', 'Ejercicio inmediatamente después de comer'],
    suplementos: ['Glucosamina/Condroitina desde cachorro', 'Taurina y L-carnitina para corazón', 'Omega-3 para articulaciones'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 5, max: 10 }, { edadMeses: 4, min: 15, max: 25 },
      { edadMeses: 6, min: 25, max: 40 }, { edadMeses: 9, min: 35, max: 55 },
      { edadMeses: 12, min: 40, max: 65 }, { edadMeses: 24, min: 50, max: 80 }
    ],
    datosCuriosos: 'El Gran Danés es la raza con mayor riesgo de torsión gástrica del mundo (42% de probabilidad en su vida). Alimentar desde platos elevados y dividir la comida en 3+ tomas es vital.',
    kcalPorKg: 25
  },
  'Cocker Spaniel': {
    especie: 'perro',
    predisposiciones: ['Otitis crónica', 'Alergias alimentarias', 'Obesidad', 'Cataratas'],
    nutricionEspecifica: {
      proteina: { min: 25, max: 28 },
      grasa: { min: 12, max: 16 },
      carbohidratos: { min: 46, max: 52 },
      fibra: '4-6%',
      nota: 'Propenso a otitis y alergias alimentarias. Considerar dietas de ingredientes limitados si hay intolerancias. Tendencia a la obesidad: controlar porciones estrictamente. Orejas largas pueden dificultar comer de platos hondos.'
    },
    alimentosEvitar: ['Pollo y res si hay alergia demostrada', 'Alimentos con colorantes artificiales', 'Comida libre'],
    suplementos: ['Omega-3 para piel y pelaje', 'Probióticos para digestión', 'Biotina para pelaje'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 1.5, max: 2.5 }, { edadMeses: 4, min: 4, max: 6 },
      { edadMeses: 6, min: 7, max: 10 }, { edadMeses: 9, min: 9, max: 12 },
      { edadMeses: 12, min: 10, max: 13 }, { edadMeses: 24, min: 12, max: 15 }
    ],
    datosCuriosos: 'Los Cocker Spaniels tienen las orejas más largas proporcionalmente de todas las razas. Esto los hace propensos a otitis, y una dieta antiinflamatoria puede reducir significativamente los episodios.',
    kcalPorKg: 33
  },
  'Border Collie': {
    especie: 'perro',
    predisposiciones: ['Epilepsia', 'Displasia de cadera', 'Anomalía del ojo del Collie (CEA)', 'Sensibilidad al gen MDR1'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 16, max: 20 },
      carbohidratos: { min: 38, max: 44 },
      fibra: '3-4%',
      nota: 'Raza de MÁXIMA energía. Necesita más calorías que la mayoría de razas medianas. Dieta alta en proteína y grasa para energía sostenida. Sensibilidad al gen MDR1: consultar veterinario antes de suplementos.'
    },
    alimentosEvitar: ['Dietas bajas en calorías (a menos que tenga sobrepeso)', 'Ivermectina y algunos medicamentos (gen MDR1)'],
    suplementos: ['Omega-3 EPA/DHA para función cerebral', 'Glucosamina para articulaciones', 'Vitamina E antioxidante'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 2, max: 3.5 }, { edadMeses: 4, min: 5, max: 8 },
      { edadMeses: 6, min: 8, max: 13 }, { edadMeses: 9, min: 11, max: 16 },
      { edadMeses: 12, min: 13, max: 18 }, { edadMeses: 24, min: 14, max: 20 }
    ],
    datosCuriosos: 'El Border Collie es considerado la raza de perro más inteligente del mundo. Su altísimo nivel de actividad mental y física requiere hasta un 20% más de calorías que otras razas medianas.',
    kcalPorKg: 38
  },
  'Pit Bull Terrier': {
    especie: 'perro',
    predisposiciones: ['Alergias cutáneas', 'Displasia de cadera', 'Demodex', 'Luxación patelar'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 40, max: 46 },
      fibra: '3-5%',
      nota: 'Raza muscular y atlética. Alta necesidad de proteína de calidad para mantener masa muscular. Muy propenso a alergias cutáneas: proteínas novedosas (venado, pato, salmón) si hay intolerancia.'
    },
    alimentosEvitar: ['Pollo si hay alergia (alergeno más común)', 'Granos si hay intolerancia demostrada', 'Colorantes y preservantes artificiales'],
    suplementos: ['Omega-3 para piel (antiinflamatorio)', 'Probióticos', 'Biotina para piel y pelaje'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 2.5, max: 4 }, { edadMeses: 4, min: 6, max: 10 },
      { edadMeses: 6, min: 10, max: 17 }, { edadMeses: 9, min: 13, max: 23 },
      { edadMeses: 12, min: 15, max: 26 }, { edadMeses: 24, min: 16, max: 30 }
    ],
    datosCuriosos: 'Los Pit Bulls tienen una de las tasas más altas de alergias cutáneas de todas las razas. Hasta un 30% desarrollará dermatitis atópica, y la dieta juega un papel crucial en el manejo.',
    kcalPorKg: 33
  },
  'Maltés': {
    especie: 'perro',
    predisposiciones: ['Hipoglucemia', 'Luxación patelar', 'Shunt portosistémico', 'Problemas dentales'],
    nutricionEspecifica: {
      proteina: { min: 28, max: 32 },
      grasa: { min: 15, max: 20 },
      carbohidratos: { min: 38, max: 45 },
      fibra: '3-4%',
      nota: 'Raza toy con metabolismo rápido. DEBE comer 3-4 veces al día para evitar hipoglucemia. Croquetas miniatura. Pelaje blanco y largo requiere excelente nutrición con ácidos grasos esenciales.'
    },
    alimentosEvitar: ['Croquetas grandes', 'Alimentos que tiñan el pelaje (remolacha)', 'Huesos de cualquier tipo'],
    suplementos: ['Omega-3 y Omega-6 para pelaje blanco', 'Dental treats miniatura', 'Calcio durante crecimiento'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.3, max: 0.6 }, { edadMeses: 4, min: 0.6, max: 1.2 },
      { edadMeses: 6, min: 1, max: 2 }, { edadMeses: 9, min: 1.5, max: 3 },
      { edadMeses: 12, min: 1.8, max: 3.5 }, { edadMeses: 24, min: 2, max: 4 }
    ],
    datosCuriosos: 'El Maltés es una de las razas más antiguas del mundo, con registros que datan de hace 2800 años. Un Maltés que no come en 6-8 horas puede desarrollar hipoglucemia peligrosa.',
    kcalPorKg: 45
  },
  'Dálmata': {
    especie: 'perro',
    predisposiciones: ['Cálculos urinarios de urato', 'Sordera congénita', 'Alergias cutáneas', 'Hiperuricosuria'],
    nutricionEspecifica: {
      proteina: { min: 22, max: 25 },
      grasa: { min: 12, max: 16 },
      carbohidratos: { min: 49, max: 56 },
      fibra: '4-6%',
      nota: 'ÚNICA raza con metabolismo de purinas alterado genéticamente. Convierte purinas en ácido úrico (como humanos) en vez de alantoína. Dieta BAJA EN PURINAS obligatoria. Evitar vísceras, mariscos y carnes ricas en purinas. Hidratación MÁXIMA.'
    },
    alimentosEvitar: ['Vísceras (hígado, riñón, corazón)', 'Mariscos', 'Sardinas y anchoas', 'Extractos de carne/caldo concentrado'],
    suplementos: ['Suplemento alcalinizante urinario (consultando vet)', 'Omega-3 para piel', 'Vitamina C en dosis moderadas'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 4, min: 8, max: 13 },
      { edadMeses: 6, min: 13, max: 20 }, { edadMeses: 9, min: 18, max: 26 },
      { edadMeses: 12, min: 22, max: 29 }, { edadMeses: 24, min: 24, max: 32 }
    ],
    datosCuriosos: 'Los Dálmatas son la ÚNICA raza de perro que excreta ácido úrico en la orina en vez de alantoína, igual que los humanos. Esto los hace extremadamente propensos a cálculos urinarios si no se controla la dieta.',
    kcalPorKg: 32
  },
  'San Bernardo': {
    especie: 'perro',
    predisposiciones: ['Torsión gástrica (GDV)', 'Displasia de cadera y codo', 'Osteosarcoma', 'Entropión'],
    nutricionEspecifica: {
      proteina: { min: 24, max: 28 },
      grasa: { min: 12, max: 15 },
      carbohidratos: { min: 47, max: 52 },
      fibra: '4-6%',
      nota: 'Raza GIGANTE de crecimiento muy lento (3-4 años para madurar). Durante crecimiento: proteína moderada, calcio controlado. Kcal/kg muy bajas. Dividir comida en 3 tomas mínimo para prevenir torsión gástrica.'
    },
    alimentosEvitar: ['Una sola comida grande al día', 'Exceso de calcio en crecimiento', 'Ejercicio después de comer'],
    suplementos: ['Glucosamina/Condroitina desde cachorro', 'Omega-3 para articulaciones', 'Vitamina E'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 6, max: 11 }, { edadMeses: 4, min: 18, max: 28 },
      { edadMeses: 6, min: 30, max: 45 }, { edadMeses: 9, min: 40, max: 58 },
      { edadMeses: 12, min: 45, max: 65 }, { edadMeses: 24, min: 54, max: 82 }
    ],
    datosCuriosos: 'El San Bernardo es una de las razas más grandes del mundo. El récord es un San Bernardo de 166 kg. Su metabolismo es tan lento que necesita solo 25 kcal por kg de peso, casi la mitad que un Chihuahua.',
    kcalPorKg: 25
  },
  'Weimaraner': {
    especie: 'perro',
    predisposiciones: ['Torsión gástrica (GDV)', 'Displasia de cadera', 'Hiperuricosuria', 'Enfermedad de von Willebrand'],
    nutricionEspecifica: {
      proteina: { min: 27, max: 31 },
      grasa: { min: 15, max: 19 },
      carbohidratos: { min: 40, max: 46 },
      fibra: '3-5%',
      nota: 'Raza atlética de alta energía. Pecho profundo con riesgo de torsión gástrica. Necesita dieta rica en proteína y grasa para actividad sostenida. Dividir en 2-3 comidas.'
    },
    alimentosEvitar: ['Comidas grandes de una sola vez', 'Ejercicio inmediatamente después de comer'],
    suplementos: ['Glucosamina para articulaciones', 'Omega-3 EPA/DHA', 'Vitamina E antioxidante'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 3, max: 5 }, { edadMeses: 4, min: 9, max: 14 },
      { edadMeses: 6, min: 15, max: 23 }, { edadMeses: 9, min: 20, max: 32 },
      { edadMeses: 12, min: 23, max: 36 }, { edadMeses: 24, min: 25, max: 40 }
    ],
    datosCuriosos: 'El Weimaraner fue criado originalmente para cazar osos y jabalíes para la nobleza alemana. Su alto nivel de actividad requiere una dieta más calórica que la mayoría de razas de su tamaño.',
    kcalPorKg: 33
  },
  'Bichón Frisé': {
    especie: 'perro',
    predisposiciones: ['Alergias cutáneas', 'Luxación patelar', 'Cálculos urinarios (oxalato)', 'Cataratas'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 14, max: 18 },
      carbohidratos: { min: 42, max: 48 },
      fibra: '4-6%',
      nota: 'Pelaje hipoalergénico que crece continuamente, requiere excelente nutrición con ácidos grasos. Propenso a alergias alimentarias: dietas de ingredientes limitados si hay sensibilidad. Hidratación importante para prevenir cálculos.'
    },
    alimentosEvitar: ['Colorantes y preservantes artificiales', 'Alimentos con múltiples fuentes de proteína si hay alergia'],
    suplementos: ['Omega-3 y Omega-6 para pelaje', 'Probióticos', 'Biotina para pelaje'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 0.4, max: 0.8 }, { edadMeses: 4, min: 1, max: 2 },
      { edadMeses: 6, min: 1.8, max: 3 }, { edadMeses: 9, min: 2.5, max: 4 },
      { edadMeses: 12, min: 2.8, max: 4.5 }, { edadMeses: 24, min: 3, max: 5 }
    ],
    datosCuriosos: 'El Bichón Frisé tiene un pelaje hipoalergénico que no muda, similar al pelo humano. Para mantenerlo saludable y blanco, la dieta debe ser rica en ácidos grasos omega-3 y omega-6.',
    kcalPorKg: 40
  },
  'Shar Pei': {
    especie: 'perro',
    predisposiciones: ['Fiebre familiar del Shar Pei', 'Amiloidosis renal', 'Entropión', 'Infecciones de piel en pliegues'],
    nutricionEspecifica: {
      proteina: { min: 26, max: 30 },
      grasa: { min: 12, max: 16 },
      carbohidratos: { min: 44, max: 50 },
      fibra: '4-6%',
      nota: 'Piel arrugada requiere excelente nutrición antiinflamatoria. Omega-3 es CRUCIAL para mantener la piel sana entre los pliegues. Propenso a amiloidosis renal: proteína de ALTA CALIDAD pero no en exceso.'
    },
    alimentosEvitar: ['Proteínas de baja calidad', 'Exceso de proteína (riñones)', 'Alimentos proinflamatorios'],
    suplementos: ['Omega-3 EPA/DHA (dosis altas para piel)', 'Probióticos', 'Vitamina E antioxidante'],
    pesoSaludablePorEdad: [
      { edadMeses: 2, min: 2.5, max: 4 }, { edadMeses: 4, min: 6, max: 10 },
      { edadMeses: 6, min: 10, max: 16 }, { edadMeses: 9, min: 14, max: 20 },
      { edadMeses: 12, min: 16, max: 22 }, { edadMeses: 24, min: 18, max: 25 }
    ],
    datosCuriosos: 'El Shar Pei tiene una mutación genética única que causa sus arrugas icónicas y también lo predispone a la "fiebre del Shar Pei", una condición inflamatoria que puede dañar los riñones si no se maneja.',
    kcalPorKg: 32
  },

  // ==================== GATOS ====================
  'Persa': {
    especie: 'gato',
    predisposiciones: ['Enfermedad renal poliquística (PKD)', 'Problemas respiratorios (braquicefálico)', 'Bolas de pelo', 'Problemas oculares (lagrimeo)'],
    nutricionEspecifica: {
      proteina: { min: 30, max: 35 },
      grasa: { min: 18, max: 22 },
      carbohidratos: { min: 10, max: 15 },
      fibra: '5-8% (prevención bolas de pelo)',
      nota: 'Mandíbula braquicefálica requiere croquetas de forma plana o almendrada. Pelo largo necesita Omega-3 extra. Alta fibra obligatoria para prevenir bolas de pelo. Propensos a enfermedad renal: proteína de alta calidad, no excesiva.'
    },
    alimentosEvitar: ['Croquetas redondas (difíciles de agarrar)', 'Exceso de proteína (riñones)', 'Lácteos'],
    suplementos: ['Pasta de malta para bolas de pelo', 'Omega-3 y Omega-6 para pelaje', 'Antioxidantes para salud renal'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 0.8, max: 1.5 }, { edadMeses: 6, min: 1.5, max: 3 },
      { edadMeses: 12, min: 2.5, max: 4.5 }, { edadMeses: 24, min: 3, max: 5.5 }
    ],
    datosCuriosos: 'Los gatos Persas tienen una mandíbula tan corta que literalmente no pueden agarrar croquetas redondas. Royal Canin desarrolló croquetas en forma de almendra específicamente para esta raza.',
    kcalPorKg: 35
  },
  'Siamés': {
    especie: 'gato',
    predisposiciones: ['Amiloidosis hepática', 'Asma felina', 'Estrabismo', 'Tendencia a pica (comer objetos)'],
    nutricionEspecifica: {
      proteina: { min: 40, max: 45 },
      grasa: { min: 20, max: 25 },
      carbohidratos: { min: 10, max: 12 },
      fibra: '3-4%',
      nota: 'Metabolismo muy activo. Necesitan 20-25% más calorías que gato promedio. Muy vocal cuando tiene hambre: establecer horarios estrictos. Atlético y delgado naturalmente: 40-45% proteína.'
    },
    alimentosEvitar: ['Lana y objetos no alimentarios (pica)', 'Dietas bajas en proteína', 'Alimentos con muchos carbohidratos'],
    suplementos: ['Taurina extra', 'Omega-3 para pelaje corto brillante', 'Probióticos'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 0.8, max: 1.3 }, { edadMeses: 6, min: 1.5, max: 2.5 },
      { edadMeses: 12, min: 2.5, max: 4 }, { edadMeses: 24, min: 3, max: 5 }
    ],
    datosCuriosos: 'Los Siameses tienen un metabolismo tan activo que pueden necesitar hasta un 25% más de calorías que un gato doméstico promedio del mismo tamaño.',
    kcalPorKg: 45
  },
  'Maine Coon': {
    especie: 'gato',
    predisposiciones: ['Cardiomiopatía hipertrófica (HCM)', 'Displasia de cadera', 'Atrofia muscular espinal', 'Enfermedad renal poliquística'],
    nutricionEspecifica: {
      proteina: { min: 42, max: 48 },
      grasa: { min: 20, max: 25 },
      carbohidratos: { min: 8, max: 12 },
      fibra: '3-5%',
      nota: 'Raza grande de crecimiento MUY lento (4-5 años para madurar completamente). Hasta los 3-4 años debe comer dieta de gatito con 45% proteína. Propenso a cardiomiopatía: taurina extra es OBLIGATORIA (mínimo 500mg/kg de alimento).'
    },
    alimentosEvitar: ['Dietas bajas en taurina', 'Alimentos procesados de baja calidad', 'Exceso de carbohidratos'],
    suplementos: ['Taurina extra (500mg/kg de alimento mínimo)', 'Glucosamina desde cachorro', 'Omega-3 DHA/EPA', 'Condroitina para articulaciones'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 1.2, max: 2 }, { edadMeses: 6, min: 2.5, max: 4.5 },
      { edadMeses: 12, min: 4, max: 7 }, { edadMeses: 24, min: 5, max: 9 },
      { edadMeses: 48, min: 5, max: 11 }
    ],
    datosCuriosos: 'El Maine Coon es la raza de gato doméstico más grande del mundo. Un Maine Coon macho adulto puede pesar hasta 11 kg sin estar obeso. Su crecimiento no se completa hasta los 4-5 años.',
    kcalPorKg: 38
  },
  'Bengalí': {
    especie: 'gato',
    predisposiciones: ['Atrofia progresiva de retina', 'Cardiomiopatía hipertrófica', 'Luxación patelar', 'Sensibilidad digestiva'],
    nutricionEspecifica: {
      proteina: { min: 42, max: 48 },
      grasa: { min: 22, max: 28 },
      carbohidratos: { min: 8, max: 12 },
      fibra: '2-3%',
      nota: 'Ancestro salvaje (gato leopardo asiático). Altamente activo: necesita 25-30% más calorías que gato promedio. Prefiere dieta alta en proteína animal (45%). Sistema digestivo sensible: proteína de una sola fuente animal.'
    },
    alimentosEvitar: ['Dietas con múltiples fuentes de proteína', 'Granos y cereales', 'Alimentos con muchos aditivos'],
    suplementos: ['Taurina', 'Omega-3 para pelaje brillante', 'Probióticos para digestión sensible'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 1, max: 1.8 }, { edadMeses: 6, min: 2, max: 3.5 },
      { edadMeses: 12, min: 3, max: 5.5 }, { edadMeses: 24, min: 3.5, max: 7 }
    ],
    datosCuriosos: 'Los Bengalís descienden del cruce con el gato leopardo asiático. Su sistema digestivo retiene características de su ancestro salvaje, por lo que responden mejor a dietas altas en proteína animal pura.',
    kcalPorKg: 48
  },
  'Ragdoll': {
    especie: 'gato',
    predisposiciones: ['Cardiomiopatía hipertrófica', 'Cálculos urinarios (oxalato de calcio)', 'Obesidad en adultez', 'Enfermedad de tracto urinario inferior'],
    nutricionEspecifica: {
      proteina: { min: 38, max: 42 },
      grasa: { min: 18, max: 22 },
      carbohidratos: { min: 10, max: 14 },
      fibra: '4-6%',
      nota: 'Propenso a cálculos urinarios: la hidratación es CRUCIAL. Incluir alimento húmedo siempre que sea posible. Tendencia al sobrepeso en adultez. Crecimiento lento similar al Maine Coon (3-4 años).'
    },
    alimentosEvitar: ['Dietas exclusivamente secas (riesgo urinario)', 'Alimentos con exceso de minerales (magnesio, fósforo)', 'Golosinas saladas'],
    suplementos: ['Omega-3 para pelaje semilargo', 'Taurina', 'Glucosamina (raza grande)', 'Cranberry para salud urinaria'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 1, max: 1.8 }, { edadMeses: 6, min: 2.5, max: 4 },
      { edadMeses: 12, min: 3.5, max: 6 }, { edadMeses: 24, min: 4, max: 8 },
      { edadMeses: 48, min: 4, max: 9 }
    ],
    datosCuriosos: 'Los Ragdolls se llaman así porque se relajan completamente cuando los levantas, como una muñeca de trapo. Esta docilidad también significa que son poco activos, por lo que controlar porciones es esencial.',
    kcalPorKg: 35
  },
  'Británico de Pelo Corto': {
    especie: 'gato',
    predisposiciones: ['Cardiomiopatía hipertrófica', 'Enfermedad renal poliquística', 'Obesidad', 'Diabetes tipo 2'],
    nutricionEspecifica: {
      proteina: { min: 38, max: 42 },
      grasa: { min: 16, max: 20 },
      carbohidratos: { min: 10, max: 14 },
      fibra: '4-6%',
      nota: 'Metabolismo LENTO. Extremadamente propenso a obesidad. Controlar porciones con precisión. Predispuesto a diabetes: minimizar carbohidratos simples. El cuerpo robusto no debe confundirse con sobrepeso saludable.'
    },
    alimentosEvitar: ['Carbohidratos simples (azúcar, harina blanca)', 'Comida libre', 'Golosinas frecuentes'],
    suplementos: ['L-carnitina para metabolismo', 'Taurina', 'Omega-3 para pelaje denso'],
    pesoSaludablePorEdad: [
      { edadMeses: 3, min: 1, max: 1.5 }, { edadMeses: 6, min: 2, max: 3.5 },
      { edadMeses: 12, min: 3, max: 5.5 }, { edadMeses: 24, min: 4, max: 8 }
    ],
    datosCuriosos: 'Los Británicos de Pelo Corto tienen el metabolismo más lento de todas las razas de gatos domésticos. Necesitan hasta un 20% menos de calorías que el gato promedio.',
    kcalPorKg: 30
  }
};

// Mitos vs Realidad sobre nutrición
const MITOS_REALIDAD = [
  {
    mito: 'Los perros necesitan granos en su dieta',
    realidad: 'No son nutricionalmente esenciales, pero pueden ser beneficiosos como fuente de energía y fibra si se toleran bien. Las dietas "grain-free" no son automáticamente mejores y han sido asociadas con cardiomiopatía dilatada en algunos estudios del FDA (2019).',
    icono: 'fa-seedling'
  },
  {
    mito: 'Los gatos pueden ser vegetarianos o veganos',
    realidad: 'Los gatos son carnívoros obligados. No pueden sintetizar taurina, arginina, ácido araquidónico ni vitamina A a partir de fuentes vegetales. Una dieta sin carne animal puede causar ceguera, insuficiencia cardíaca y muerte.',
    icono: 'fa-leaf'
  },
  {
    mito: 'La comida casera siempre es mejor que la comercial',
    realidad: 'Puede serlo, pero SOLO si está formulada por un veterinario nutricionista. Estudios muestran que el 95% de las recetas caseras encontradas en internet son nutricionalmente incompletas. La comida comercial premium está científicamente balanceada.',
    icono: 'fa-home'
  },
  {
    mito: 'Las razas pequeñas comen menos que las grandes',
    realidad: 'Por kilogramo de peso, las razas pequeñas comen MUCHO MÁS que las grandes. Un Chihuahua necesita 40-50 kcal/kg mientras que un Gran Danés solo necesita 25-30 kcal/kg. Esto se debe a que los animales pequeños tienen un metabolismo proporcionalmente más rápido.',
    icono: 'fa-balance-scale'
  },
  {
    mito: 'Un perro gordo es un perro sano y feliz',
    realidad: 'La obesidad reduce la esperanza de vida hasta 2.5 años, causa dolor articular crónico, diabetes, problemas cardíacos y respiratorios. Un perro en peso ideal es más activo, tiene mejor calidad de vida y vive más tiempo.',
    icono: 'fa-weight'
  },
  {
    mito: 'Los huesos son buenos para los perros',
    realidad: 'Los huesos cocidos son PELIGROSOS: se astillan y pueden perforar el tracto digestivo. Los huesos crudos son más seguros pero pueden fracturar dientes. Las mejores alternativas son juguetes masticables diseñados para perros.',
    icono: 'fa-bone'
  },
  {
    mito: 'El ajo previene las pulgas en perros y gatos',
    realidad: 'El ajo es TÓXICO para perros y gatos. Contiene tiosulfatos que destruyen los glóbulos rojos causando anemia hemolítica. Incluso en pequeñas cantidades puede ser peligroso, especialmente en gatos.',
    icono: 'fa-bug'
  },
  {
    mito: 'Los gatos necesitan leche',
    realidad: 'La mayoría de gatos adultos son intolerantes a la lactosa. La leche les causa diarrea y malestar digestivo. Los gatitos solo necesitan leche materna o fórmula específica para gatitos, nunca leche de vaca.',
    icono: 'fa-glass-whiskey'
  }
];

// Referencias científicas
const REFERENCIAS_CIENTIFICAS = [
  {
    titulo: 'AAFCO 2023 - Perfiles Nutricionales para Alimentos de Perros y Gatos',
    url: 'https://www.aafco.org/nutrients/',
    descripcion: 'Estándares oficiales de nutrición para alimentos comerciales de mascotas en Estados Unidos.'
  },
  {
    titulo: 'NRC 2006 - Nutrient Requirements of Dogs and Cats',
    url: 'https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats',
    descripcion: 'Publicación del National Research Council con los requerimientos nutricionales basados en evidencia científica.'
  },
  {
    titulo: 'Estudio Gen POMC en Labradores - Universidad de Cambridge (2016)',
    url: 'https://doi.org/10.1016/j.cmet.2016.04.012',
    descripcion: 'Descubrimiento de la mutación genética que causa hambre insaciable en Labradores.'
  },
  {
    titulo: 'Journal of Feline Medicine - Requerimientos de Taurina (2020)',
    url: 'https://journals.sagepub.com/home/jfm',
    descripcion: 'Investigación sobre la importancia crítica de la taurina en la dieta felina.'
  },
  {
    titulo: 'FDA Investigation - Grain-Free Diets and DCM in Dogs (2019)',
    url: 'https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy',
    descripcion: 'Investigación del FDA sobre la relación entre dietas sin granos y cardiomiopatía dilatada.'
  },
  {
    titulo: 'WSAVA Global Nutrition Guidelines (2011)',
    url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
    descripcion: 'Guías mundiales de nutrición de la Asociación Mundial de Veterinarios de Pequeños Animales.'
  },
  {
    titulo: 'Obesity in Dogs and Cats - JAVMA (2018)',
    url: 'https://avmajournals.avma.org/',
    descripcion: 'Estudio sobre prevalencia de obesidad y su impacto en la esperanza de vida de mascotas.'
  }
];

// Datos para gráfico de timeline de vida (necesidades por etapa)
const TIMELINE_VIDA = {
  perro: [
    { edadMeses: 0, etapa: 'Neonatal', kcalFactor: 2.5, proteinaPct: 32, nota: 'Leche materna exclusiva' },
    { edadMeses: 2, etapa: 'Destete', kcalFactor: 2.0, proteinaPct: 30, nota: 'Transición a alimento sólido' },
    { edadMeses: 4, etapa: 'Cachorro', kcalFactor: 1.8, proteinaPct: 28, nota: 'Crecimiento acelerado' },
    { edadMeses: 8, etapa: 'Adolescente', kcalFactor: 1.6, proteinaPct: 27, nota: 'Madurez sexual' },
    { edadMeses: 12, etapa: 'Adulto joven', kcalFactor: 1.4, proteinaPct: 26, nota: 'Fin de crecimiento (razas pequeñas)' },
    { edadMeses: 24, etapa: 'Adulto', kcalFactor: 1.4, proteinaPct: 25, nota: 'Mantenimiento' },
    { edadMeses: 60, etapa: 'Adulto maduro', kcalFactor: 1.3, proteinaPct: 26, nota: 'Metabolismo empieza a bajar' },
    { edadMeses: 84, etapa: 'Senior', kcalFactor: 1.2, proteinaPct: 28, nota: 'Mayor proteína para preservar músculo' },
    { edadMeses: 120, etapa: 'Geriátrico', kcalFactor: 1.1, proteinaPct: 30, nota: 'Prevenir sarcopenia, cuidar riñones' }
  ],
  gato: [
    { edadMeses: 0, etapa: 'Neonatal', kcalFactor: 2.5, proteinaPct: 42, nota: 'Leche materna exclusiva' },
    { edadMeses: 2, etapa: 'Destete', kcalFactor: 2.2, proteinaPct: 42, nota: 'Transición a alimento sólido' },
    { edadMeses: 4, etapa: 'Gatito', kcalFactor: 2.0, proteinaPct: 40, nota: 'Crecimiento intenso' },
    { edadMeses: 8, etapa: 'Adolescente', kcalFactor: 1.6, proteinaPct: 38, nota: 'Madurez sexual' },
    { edadMeses: 12, etapa: 'Adulto joven', kcalFactor: 1.4, proteinaPct: 36, nota: 'Fin de crecimiento' },
    { edadMeses: 24, etapa: 'Adulto', kcalFactor: 1.4, proteinaPct: 35, nota: 'Mantenimiento' },
    { edadMeses: 84, etapa: 'Senior', kcalFactor: 1.2, proteinaPct: 38, nota: 'Más proteína para preservar músculo' },
    { edadMeses: 132, etapa: 'Geriátrico', kcalFactor: 1.1, proteinaPct: 40, nota: 'Prevenir sarcopenia, monitorear riñones' }
  ]
};

// ============================================================
// CHECKLISTS PREDEFINIDAS
// ============================================================
const CHECKLIST_TEMPLATES = {
  paseo: {
    nombre: 'Paseo',
    icono: 'fa-walking',
    items: {
      perro: ['Collar con identificación', 'Correa resistente', 'Bolsas para recoger heces', 'Botella de agua', 'Treats/premios', 'Placa de identificación', 'Luz reflectante (paseo nocturno)', 'Toalla para limpiar patas'],
      gato: ['Arnés para gato', 'Correa elástica', 'Carrier de respaldo', 'Bolsas', 'Agua', 'Treats', 'Placa de identificación', 'Toalla']
    }
  },
  viaje: {
    nombre: 'Viaje',
    icono: 'fa-car',
    items: {
      perro: ['Carrier o jaula de transporte', 'Agua y recipiente', 'Comida suficiente para el viaje', 'Certificado de salud vigente', 'Carné de vacunas', 'Medicamentos (si aplica)', 'Juguete favorito', 'Manta o cobija', 'Bolsas para desechos', 'Correa y collar extra'],
      gato: ['Carrier seguro', 'Agua y recipiente', 'Comida y plato', 'Certificado de salud vigente', 'Carné de vacunas', 'Medicamentos (si aplica)', 'Juguete familiar', 'Manta con su olor', 'Arena portátil y pala', 'Bolsas']
    }
  },
  dejarsola: {
    nombre: 'Dejar en casa',
    icono: 'fa-home',
    items: {
      perro: ['Agua suficiente para el tiempo de ausencia', 'Comida servida o programada', 'Lugar seguro y cómodo', 'Temperatura adecuada (ventilación/calefacción)', 'Juguetes interactivos', 'Verificar que no haya peligros accesibles', 'Paseo previo a la salida', 'Música relajante (opcional)'],
      gato: ['Agua fresca suficiente', 'Comida servida', 'Arenero limpio', 'Ventanas y balcones seguros', 'Temperatura adecuada', 'Juguetes disponibles', 'Verificar que no haya plantas tóxicas accesibles', 'Rascador disponible']
    }
  },
  emergencia: {
    nombre: 'Emergencia',
    icono: 'fa-first-aid',
    items: {
      perro: ['Números de emergencia veterinaria', 'Botiquín básico (gasas, antiséptico, vendas)', 'Historial médico impreso o digital', 'Carné de vacunas actualizado', 'Lista de medicamentos actuales', 'Foto reciente de la mascota', 'Datos del microchip', 'Carrier de emergencia'],
      gato: ['Números de emergencia veterinaria', 'Botiquín básico (gasas, antiséptico, vendas)', 'Historial médico impreso o digital', 'Carné de vacunas actualizado', 'Lista de medicamentos actuales', 'Foto reciente de la mascota', 'Datos del microchip', 'Carrier de emergencia']
    }
  },
  grooming: {
    nombre: 'Grooming',
    icono: 'fa-shower',
    items: {
      perro: ['Shampoo apropiado para su pelaje', 'Toallas absorbentes', 'Cepillo adecuado para su raza', 'Cortauñas para perro', 'Limpiador de oídos', 'Secador (temperatura baja)', 'Algodón para oídos', 'Premios post-baño'],
      gato: ['Shampoo para gatos (sin perfume fuerte)', 'Toallas absorbentes', 'Cepillo suave / guante de grooming', 'Cortauñas para gato', 'Limpiador de oídos felino', 'Algodón para oídos', 'Treats post-grooming', 'Ambiente tranquilo']
    }
  },
  veterinario: {
    nombre: 'Visita al veterinario',
    icono: 'fa-stethoscope',
    items: {
      perro: ['Historial médico completo', 'Carné de vacunas', 'Lista de síntomas o cambios observados', 'Muestras (si el vet las solicitó)', 'Carrier o correa firme', 'Treats para reducir estrés', 'Lista de preguntas para el veterinario', 'Resultados de exámenes previos'],
      gato: ['Historial médico completo', 'Carné de vacunas', 'Lista de síntomas o cambios observados', 'Muestras (si el vet las solicitó)', 'Carrier con manta familiar', 'Treats para reducir estrés', 'Lista de preguntas para el veterinario', 'Spray de feromonas (opcional)']
    }
  }
};

// ============================================================
// UBICACIONES (País → Ciudades)
// ============================================================
const UBICACIONES = {
  'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Cúcuta', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué', 'Villavicencio', 'Armenia', 'Neiva', 'Pasto', 'Montería', 'Valledupar', 'Popayán', 'Sincelejo', 'Tunja'],
  'México': ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Cancún', 'Mérida', 'Querétaro', 'Toluca', 'Aguascalientes', 'Morelia', 'Chihuahua', 'Saltillo', 'Veracruz'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta'],
  'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'Temuco', 'Antofagasta', 'Viña del Mar'],
  'Perú': ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Piura', 'Chiclayo'],
  'Ecuador': ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Ambato'],
  'España': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza'],
  'Estados Unidos': ['Miami', 'Houston', 'Los Angeles', 'New York', 'Chicago', 'Dallas', 'San Antonio']
};
