# PetCare Pro - Guía de Configuración

## Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Firebase (para autenticación y almacenamiento)
- Conexión a internet (para Firebase y CDNs)

## Estructura del Proyecto

```
petcare-app/
├── index.html                    # Aplicación principal
├── login.html                    # Página de inicio de sesión
├── signup.html                   # Página de registro
├── educacion-nutricional.html    # Página educativa
├── directorio-veterinarias.html  # Directorio de veterinarias
├── veterinaria-detalle.html      # Detalle de veterinaria
├── styles.css                    # Estilos principales
├── app.js                        # Lógica principal
├── data.js                       # Datos base (razas, valores ref.)
├── firebase-config.js            # Configuración Firebase
├── exam-reference-ranges.js      # Rangos de referencia de exámenes
├── exam-analyzer.js              # Analizador inteligente de exámenes
├── food-database.js              # Base de datos de alimentos
├── food-recommender.js           # Motor de recomendaciones
├── weight-analyzer.js            # Analizador de peso
├── vet-database.js               # Base de datos veterinarias + digestión
├── SETUP.md                      # Esta guía
└── ARCHITECTURE.md               # Documentación de arquitectura
```

## Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. El proyecto ya está configurado como `petcare-app-a3574`
3. Servicios habilitados:
   - **Authentication**: Email/Password
   - **Cloud Firestore**: Base de datos en tiempo real
   - **Cloud Storage**: Almacenamiento de fotos y PDFs

## Despliegue

### GitHub Pages (actual)

```bash
git add .
git commit -m "Deploy PetCare Pro v3.0"
git push origin main
```

La app se despliega automáticamente en GitHub Pages.

### Servidor Local

Simplemente abrir `index.html` en un navegador o usar un servidor local:

```bash
# Con Python
python3 -m http.server 8080

# Con Node.js
npx serve .
```

## Dependencias Externas (CDN)

- **Chart.js 4.4.0**: Gráficos interactivos
- **PDF.js 3.11.174**: Extracción de texto de PDFs
- **Font Awesome 6.4.0**: Iconos
- **Google Fonts (Roboto)**: Tipografía
- **Firebase SDK 10.7.1**: Auth, Firestore, Storage

## Funcionalidades Principales

### Fase 1 - Base
- Registro de mascotas (hasta 5)
- Plan nutricional con cálculo calórico
- Seguimiento diario de comidas, agua y peso
- Recordatorios configurables
- Calendario veterinario
- Valores de referencia y glosario
- Tema claro/oscuro

### Fase 2 - Firebase
- Autenticación con email/password
- Sincronización en la nube (Firestore)
- Subida de fotos con compresión (Firebase Storage)
- Subida de PDFs de exámenes (Firebase Storage)
- Extracción automática de valores de PDFs
- Contenido educativo nutricional

### Fase 3 - Inteligencia
- Análisis inteligente de exámenes con interpretaciones
- Comparación entre exámenes
- Sugerencias nutricionales basadas en resultados
- Motor de recomendación de alimentos (scoring)
- Base de datos de alimentos colombianos
- Cálculo de porciones y costos
- Directorio de 50+ veterinarias colombianas
- Filtros avanzados (24/7, especialidades, precio)
- Análisis de tendencia de peso
- Comparación con percentiles de raza
- Alertas inteligentes de peso
- Peso ideal dinámico según edad
- Tiempo de digestión por raza y tipo de alimento
- Recordatorios con fecha para eventos únicos
- Exportación a calendario (.ics)
- Recordatorios auto-generados por exámenes
