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
    { nombre: 'Mestizo', pesoIdeal: { min: 5, max: 35 }, esperanzaVida: 13, tamaño: 'variable' },
    { nombre: 'Otra', pesoIdeal: { min: 1, max: 80 }, esperanzaVida: 12, tamaño: 'variable' }
  ],
  gato: [
    { nombre: 'Persa', pesoIdeal: { min: 3, max: 5.5 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Siamés', pesoIdeal: { min: 3, max: 5 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Maine Coon', pesoIdeal: { min: 5, max: 11 }, esperanzaVida: 13, tamaño: 'grande' },
    { nombre: 'Bengalí', pesoIdeal: { min: 3.5, max: 7 }, esperanzaVida: 14, tamaño: 'mediano' },
    { nombre: 'Ragdoll', pesoIdeal: { min: 4, max: 9 }, esperanzaVida: 15, tamaño: 'grande' },
    { nombre: 'Británico de Pelo Corto', pesoIdeal: { min: 4, max: 8 }, esperanzaVida: 15, tamaño: 'mediano' },
    { nombre: 'Mestizo', pesoIdeal: { min: 3, max: 6 }, esperanzaVida: 15, tamaño: 'variable' },
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
  'Británico de Pelo Corto': ['Propenso a obesidad.', 'Metabolismo lento; controlar porciones cuidadosamente.']
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

// Valores de referencia para exámenes (rangos normales)
const VALORES_REFERENCIA = {
  perro: {
    hemoglobina: { min: 12, max: 18, unidad: 'g/dL', nombre: 'Hemoglobina' },
    glucosa: { min: 74, max: 143, unidad: 'mg/dL', nombre: 'Glucosa' },
    creatinina: { min: 0.5, max: 1.8, unidad: 'mg/dL', nombre: 'Creatinina' },
    alt: { min: 10, max: 125, unidad: 'U/L', nombre: 'ALT (Alanina aminotransferasa)' },
    proteinas: { min: 5.2, max: 8.2, unidad: 'g/dL', nombre: 'Proteínas totales' }
  },
  gato: {
    hemoglobina: { min: 8, max: 15, unidad: 'g/dL', nombre: 'Hemoglobina' },
    glucosa: { min: 74, max: 159, unidad: 'mg/dL', nombre: 'Glucosa' },
    creatinina: { min: 0.8, max: 2.4, unidad: 'mg/dL', nombre: 'Creatinina' },
    alt: { min: 12, max: 130, unidad: 'U/L', nombre: 'ALT (Alanina aminotransferasa)' },
    proteinas: { min: 5.7, max: 8.9, unidad: 'g/dL', nombre: 'Proteínas totales' }
  }
};

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
const ALIMENTOS_CALORIAS = {
  'Croquetas estándar': 350,
  'Croquetas premium': 380,
  'Croquetas light': 300,
  'Croquetas cachorro': 400,
  'Croquetas senior': 320,
  'Alimento húmedo estándar': 85,
  'Alimento húmedo premium': 100,
  'Pollo cocido': 165,
  'Arroz cocido': 130,
  'Zanahoria': 41,
  'Calabaza cocida': 26,
  'Hígado de res cocido': 191,
  'Pescado cocido': 120,
  'Huevo cocido': 155,
  'Otro': 0
};
