// ============================================================
// PetCare Pro - Configuración de Firebase
// ============================================================

const firebaseConfig = {
  apiKey: 'AIzaSyAioK4T54W5Bn_8J2HoeTcuGHLuP9Mwq_4',
  authDomain: 'petcare-app-a3574.firebaseapp.com',
  projectId: 'petcare-app-a3574',
  storageBucket: 'petcare-app-a3574.firebasestorage.app',
  messagingSenderId: '428910963832',
  appId: '1:428910963832:web:a92024acca6908d755918d',
  measurementId: 'G-LX8K9GX3WQ'
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Servicios
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Persistencia de autenticación
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// ==================== FUNCIONES DE AUTENTICACIÓN ====================

async function registrarUsuario(email, password, nombre) {
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: nombre });
    // Crear documento de usuario en Firestore
    await db.collection('users').doc(cred.user.uid).set({
      nombre,
      email,
      role: 'owner',
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, user: cred.user };
  } catch (error) {
    return { success: false, error: traducirErrorFirebase(error.code) };
  }
}

// Registrar veterinario (crea User + Clinic en transacción)
async function registrarVeterinario(email, password, nombre, datosClinica) {
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: nombre });

    const clinicRef = db.collection('clinics').doc();
    const batch = db.batch();

    batch.set(clinicRef, {
      name: datosClinica.clinicName,
      address: '',
      city: datosClinica.city || '',
      country: 'Colombia',
      phone: '',
      email: email,
      whatsapp: '',
      businessHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '13:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true }
      },
      settings: {
        defaultAppointmentDuration: 30,
        timezone: 'America/Bogota',
        currency: 'COP',
        allowOnlineBooking: false
      },
      subscription: {
        plan: 'starter',
        status: 'trial',
        startDate: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: null
      },
      features: {
        inventory: false,
        invoicing: false,
        whatsappReminders: false,
        aiAssistant: false
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    batch.set(db.collection('users').doc(cred.user.uid), {
      nombre,
      email,
      role: 'clinic_admin',
      clinicId: clinicRef.id,
      vetLicense: datosClinica.license || '',
      specialization: datosClinica.specialization || '',
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();
    return { success: true, user: cred.user, clinicId: clinicRef.id };
  } catch (error) {
    return { success: false, error: traducirErrorFirebase(error.code) };
  }
}

// Obtener rol del usuario actual desde Firestore
async function obtenerRolUsuario(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
      const data = doc.data();
      return { role: data.role || 'owner', clinicId: data.clinicId || null };
    }
    return { role: 'owner', clinicId: null };
  } catch (error) {
    console.error('Error obteniendo rol:', error);
    return { role: 'owner', clinicId: null };
  }
}

async function iniciarSesion(email, password) {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: cred.user };
  } catch (error) {
    return { success: false, error: traducirErrorFirebase(error.code) };
  }
}

async function cerrarSesion() {
  try {
    await auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

async function recuperarContrasena(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error: traducirErrorFirebase(error.code) };
  }
}

function obtenerUsuarioActual() {
  return auth.currentUser;
}

function traducirErrorFirebase(code) {
  const errores = {
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/operation-not-allowed': 'Operación no permitida.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con este correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Credenciales inválidas. Verifica tu correo y contraseña.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.'
  };
  return errores[code] || 'Error desconocido. Intenta de nuevo.';
}

// ==================== FUNCIONES DE FIRESTORE ====================

function getUserRef() {
  const user = auth.currentUser;
  if (!user) return null;
  return db.collection('users').doc(user.uid);
}

// Guardar todos los datos del usuario en Firestore
async function guardarDatosFirestore(estado) {
  const userRef = getUserRef();
  if (!userRef) return;
  try {
    await userRef.set({
      mascotas: estado.mascotas || [],
      mascotaActiva: estado.mascotaActiva,
      examenes: estado.examenes || {},
      comidas: estado.comidas || {},
      agua: estado.agua || {},
      pesos: estado.pesos || {},
      recordatorios: estado.recordatorios || {},
      visitas: estado.visitas || {},
      frecuenciaAlimentacion: estado.frecuenciaAlimentacion || {},
      comidasPreset: estado.comidasPreset || {},
      checklists: estado.checklists || {},
      tema: estado.tema || 'light',
      veterinariasFavoritas: estado.veterinariasFavoritas || [],
      ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error guardando en Firestore:', error);
  }
}

// Cargar datos del usuario desde Firestore
async function cargarDatosFirestore() {
  const userRef = getUserRef();
  if (!userRef) return null;
  try {
    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Error cargando de Firestore:', error);
    return null;
  }
}

// Escuchar cambios en tiempo real (sincronización entre dispositivos)
function escucharCambiosFirestore(callback) {
  const userRef = getUserRef();
  if (!userRef) return null;
  return userRef.onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data());
    }
  }, (error) => {
    console.error('Error en listener de Firestore:', error);
  });
}

// ==================== FUNCIONES DE STORAGE ====================

// Subir imagen de mascota con compresión
async function subirFotoMascota(file, petId, onProgress) {
  const user = auth.currentUser;
  if (!user) throw new Error('No autenticado');

  // Comprimir imagen
  const comprimida = await comprimirImagen(file, 800, 0.7);
  const thumbnail = await comprimirImagen(file, 200, 0.6);

  const timestamp = Date.now();
  const extension = file.name.split('.').pop().toLowerCase();
  const rutaFoto = `users/${user.uid}/pets/${petId}/photos/foto_${timestamp}.${extension}`;
  const rutaThumb = `users/${user.uid}/pets/${petId}/photos/thumb_${timestamp}.${extension}`;

  // Subir foto principal
  const refFoto = storage.ref(rutaFoto);
  const taskFoto = refFoto.put(comprimida);

  return new Promise((resolve, reject) => {
    taskFoto.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const urlFoto = await refFoto.getDownloadURL();
          // Subir thumbnail
          const refThumb = storage.ref(rutaThumb);
          await refThumb.put(thumbnail);
          const urlThumb = await refThumb.getDownloadURL();
          resolve({ urlFoto, urlThumb });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// Subir PDF de examen
async function subirPDFExamen(file, petId, onProgress) {
  const user = auth.currentUser;
  if (!user) throw new Error('No autenticado');

  const timestamp = Date.now();
  const ruta = `users/${user.uid}/pets/${petId}/exams/exam_${timestamp}.pdf`;
  const ref = storage.ref(ruta);
  const task = ref.put(file);

  return new Promise((resolve, reject) => {
    task.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await ref.getDownloadURL();
          resolve({ url, ruta });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// Comprimir imagen usando canvas
function comprimirImagen(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            // Si aún es > 500KB, comprimir más
            if (blob.size > 500 * 1024 && quality > 0.3) {
              comprimirImagen(file, maxSize, quality - 0.1).then(resolve).catch(reject);
            } else {
              resolve(blob);
            }
          } else {
            reject(new Error('Error al comprimir imagen'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
}

// ==================== FUNCIONES DE PDF ====================

// Patrones de extracción para cada parámetro
const PDF_EXTRACTION_PATTERNS = {
  hemoglobina: [
    /hemoglobina[\s:.,]*(\d+[.,]?\d*)\s*(?:g\/d[Ll])?/i,
    /hgb[\s:.,]*(\d+[.,]?\d*)/i,
    /hb[\s:.,]*(\d+[.,]?\d*)/i,
    /hemoglobin[\s:.,]*(\d+[.,]?\d*)/i
  ],
  hematocrito: [
    /hematocrito[\s:.,]*(\d+[.,]?\d*)\s*%?/i,
    /hematocrit[\s:.,]*(\d+[.,]?\d*)/i,
    /\bhct[\s:.,]*(\d+[.,]?\d*)/i,
    /\bht[\s:.,]*(\d+[.,]?\d*)\s*%/i,
    /pcv[\s:.,]*(\d+[.,]?\d*)/i
  ],
  eritrocitos: [
    /eritrocitos[\s:.,]*(\d+[.,]?\d*)/i,
    /red\s*blood\s*cell[\s:.,]*(\d+[.,]?\d*)/i,
    /\brbc[\s:.,]*(\d+[.,]?\d*)/i,
    /gl[oó]bulos\s*rojos[\s:.,]*(\d+[.,]?\d*)/i
  ],
  leucocitos: [
    /leucocitos[\s:.,]*(\d+[.,]?\d*)/i,
    /white\s*blood\s*cell[\s:.,]*(\d+[.,]?\d*)/i,
    /\bwbc[\s:.,]*(\d+[.,]?\d*)/i,
    /gl[oó]bulos\s*blancos[\s:.,]*(\d+[.,]?\d*)/i
  ],
  plaquetas: [
    /plaquetas[\s:.,]*(\d+[.,]?\d*)/i,
    /platelets?[\s:.,]*(\d+[.,]?\d*)/i,
    /\bplt[\s:.,]*(\d+[.,]?\d*)/i,
    /trombocitos[\s:.,]*(\d+[.,]?\d*)/i
  ],
  vcm: [
    /\bvcm[\s:.,]*(\d+[.,]?\d*)/i,
    /\bmcv[\s:.,]*(\d+[.,]?\d*)/i,
    /vol[.\s]*corp[.\s]*medio[\s:.,]*(\d+[.,]?\d*)/i
  ],
  hcm: [
    /\bhcm[\s:.,]*(\d+[.,]?\d*)/i,
    /\bmch[\s:.,]*(\d+[.,]?\d*)\s*(?:pg)?/i
  ],
  chcm: [
    /\bchcm[\s:.,]*(\d+[.,]?\d*)/i,
    /\bmchc[\s:.,]*(\d+[.,]?\d*)/i
  ],
  neutrofilos: [
    /neutr[oó]filos[\s:.,]*(\d+[.,]?\d*)/i,
    /neutrophils?[\s:.,]*(\d+[.,]?\d*)/i,
    /\bneut[\s:.,]*(\d+[.,]?\d*)/i,
    /segmentados[\s:.,]*(\d+[.,]?\d*)/i
  ],
  linfocitos: [
    /linfocitos[\s:.,]*(\d+[.,]?\d*)/i,
    /lymphocytes?[\s:.,]*(\d+[.,]?\d*)/i,
    /\blym[\s:.,]*(\d+[.,]?\d*)/i
  ],
  monocitos: [
    /monocitos[\s:.,]*(\d+[.,]?\d*)/i,
    /monocytes?[\s:.,]*(\d+[.,]?\d*)/i,
    /\bmono[\s:.,]*(\d+[.,]?\d*)/i
  ],
  eosinofilos: [
    /eosin[oó]filos[\s:.,]*(\d+[.,]?\d*)/i,
    /eosinophils?[\s:.,]*(\d+[.,]?\d*)/i,
    /\beos[\s:.,]*(\d+[.,]?\d*)/i
  ],
  glucosa: [
    /glucosa[\s:.,]*(\d+[.,]?\d*)\s*(?:mg\/d[Ll])?/i,
    /glucose[\s:.,]*(\d+[.,]?\d*)/i,
    /glicemia[\s:.,]*(\d+[.,]?\d*)/i,
    /\bglu[\s:.,]*(\d+[.,]?\d*)/i
  ],
  bun: [
    /\bbun[\s:.,]*(\d+[.,]?\d*)/i,
    /nitr[oó]geno\s*ureico[\s:.,]*(\d+[.,]?\d*)/i,
    /urea\s*nitr[oó]geno[\s:.,]*(\d+[.,]?\d*)/i,
    /blood\s*urea\s*nitrogen[\s:.,]*(\d+[.,]?\d*)/i
  ],
  creatinina: [
    /creatinina[\s:.,]*(\d+[.,]?\d*)\s*(?:mg\/d[Ll])?/i,
    /creatinine[\s:.,]*(\d+[.,]?\d*)/i,
    /\bcrea[\s:.,]*(\d+[.,]?\d*)/i
  ],
  alt: [
    /\balt[\s:=]+(\d+[.,]?\d*)\s*(?:U\/[Ll])/i,
    /\balt[\s:=]+(\d+[.,]?\d*)/i,
    /alanina[\s\w]*[\s:.,]*(\d+[.,]?\d*)/i,
    /\bgpt[\s:.,]*(\d+[.,]?\d*)/i,
    /\btgp[\s:.,]*(\d+[.,]?\d*)/i,
    /alat[\s:.,]*(\d+[.,]?\d*)/i
  ],
  ast: [
    /\bast[\s:.,]*(\d+[.,]?\d*)\s*(?:U\/[Ll])?/i,
    /aspartato[\s\w]*[\s:.,]*(\d+[.,]?\d*)/i,
    /\bgot[\s:.,]*(\d+[.,]?\d*)/i,
    /\btgo[\s:.,]*(\d+[.,]?\d*)/i,
    /asat[\s:.,]*(\d+[.,]?\d*)/i
  ],
  alp: [
    /\balp[\s:.,]*(\d+[.,]?\d*)/i,
    /fosfatasa\s*alcalina[\s:.,]*(\d+[.,]?\d*)/i,
    /alkaline\s*phosphatase[\s:.,]*(\d+[.,]?\d*)/i,
    /\bfa[\s:=]+(\d+[.,]?\d*)\s*(?:U\/[Ll])/i
  ],
  ggt: [
    /\bggt[\s:.,]*(\d+[.,]?\d*)/i,
    /gamma[\s-]*glutamil[\s\w]*[\s:.,]*(\d+[.,]?\d*)/i,
    /\bγ-?gt[\s:.,]*(\d+[.,]?\d*)/i
  ],
  bilirrubina: [
    /bilirrubina\s*total[\s:.,]*(\d+[.,]?\d*)/i,
    /bilirrubina[\s:.,]*(\d+[.,]?\d*)/i,
    /bilirubin[\s:.,]*(\d+[.,]?\d*)/i,
    /\btbil[\s:.,]*(\d+[.,]?\d*)/i
  ],
  proteinastotales: [
    /prote[ií]nas?\s*totales?[\s:.,]*(\d+[.,]?\d*)\s*(?:g\/d[Ll])?/i,
    /total\s*protein[\s:.,]*(\d+[.,]?\d*)/i,
    /\bpt[\s:=]+(\d+[.,]?\d*)\s*(?:g\/d[Ll])/i
  ],
  albumina: [
    /alb[uú]mina[\s:.,]*(\d+[.,]?\d*)/i,
    /albumin[\s:.,]*(\d+[.,]?\d*)/i,
    /\balb[\s:.,]*(\d+[.,]?\d*)/i
  ],
  globulinas: [
    /globulinas?[\s:.,]*(\d+[.,]?\d*)/i,
    /globulin[\s:.,]*(\d+[.,]?\d*)/i,
    /\bglob[\s:.,]*(\d+[.,]?\d*)/i
  ],
  colesterol: [
    /colesterol[\s:.,]*(\d+[.,]?\d*)/i,
    /cholesterol[\s:.,]*(\d+[.,]?\d*)/i,
    /\bchol[\s:.,]*(\d+[.,]?\d*)/i
  ],
  trigliceridos: [
    /triglic[eé]ridos[\s:.,]*(\d+[.,]?\d*)/i,
    /triglycerides?[\s:.,]*(\d+[.,]?\d*)/i,
    /\btrig[\s:.,]*(\d+[.,]?\d*)/i
  ],
  amilasa: [
    /amilasa[\s:.,]*(\d+[.,]?\d*)/i,
    /amylase[\s:.,]*(\d+[.,]?\d*)/i,
    /\bamy[\s:.,]*(\d+[.,]?\d*)/i
  ],
  lipasa: [
    /lipasa[\s:.,]*(\d+[.,]?\d*)/i,
    /lipase[\s:.,]*(\d+[.,]?\d*)/i,
    /\blip[\s:.,]*(\d+[.,]?\d*)/i
  ],
  calcio: [
    /calcio[\s:.,]*(\d+[.,]?\d*)/i,
    /calcium[\s:.,]*(\d+[.,]?\d*)/i,
    /\bca[\s:.,]*(\d+[.,]?\d*)\s*(?:mg\/d[Ll])/i
  ],
  fosforo: [
    /f[oó]sforo[\s:.,]*(\d+[.,]?\d*)/i,
    /phosphorus[\s:.,]*(\d+[.,]?\d*)/i,
    /\bphos[\s:.,]*(\d+[.,]?\d*)/i
  ],
  sodio: [
    /sodio[\s:.,]*(\d+[.,]?\d*)/i,
    /sodium[\s:.,]*(\d+[.,]?\d*)/i,
    /\bna[\s:=]+(\d+[.,]?\d*)\s*(?:mEq|mmol)/i
  ],
  potasio: [
    /potasio[\s:.,]*(\d+[.,]?\d*)/i,
    /potassium[\s:.,]*(\d+[.,]?\d*)/i,
    /\bk[\s:=]+(\d+[.,]?\d*)\s*(?:mEq|mmol)/i
  ],
  cloro: [
    /cloro[\s:.,]*(\d+[.,]?\d*)/i,
    /chloride[\s:.,]*(\d+[.,]?\d*)/i,
    /\bcl[\s:=]+(\d+[.,]?\d*)\s*(?:mEq|mmol)/i
  ]
};

// Extraer valores del PDF usando PDF.js - extracción dinámica
async function extraerValoresPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let textoCompleto = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          // Mejorar extracción: detectar cambios de Y para insertar newlines
          let lastY = null;
          let pageText = '';
          textContent.items.forEach(item => {
            const y = item.transform ? item.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
              pageText += '\n';
            }
            pageText += item.str + ' ';
            lastY = y;
          });
          textoCompleto += pageText + '\n';
        }

        console.log('PDF texto extraído:', textoCompleto.substring(0, 500));

        // Iterar sobre todos los patrones y extraer solo los valores encontrados
        const valores = {};
        for (const [key, patterns] of Object.entries(PDF_EXTRACTION_PATTERNS)) {
          const val = extraerValorMultiple(textoCompleto, patterns);
          if (val !== null) {
            valores[key] = val;
          }
        }

        // Compatibilidad: si se encontró "proteinas" como key viejo, mapear a proteinastotales
        if (valores.proteinas && !valores.proteinastotales) {
          valores.proteinastotales = valores.proteinas;
          delete valores.proteinas;
        }

        // Sanity check: descartar valores fuera de rango fisiológico
        const SANITY_RANGES = {
          hemoglobina: { min: 5, max: 25 },
          hematocrito: { min: 10, max: 65 },
          eritrocitos: { min: 2, max: 15 },
          leucocitos: { min: 1, max: 80 },
          plaquetas: { min: 50, max: 1500 },
          glucosa: { min: 30, max: 600 },
          bun: { min: 1, max: 150 },
          creatinina: { min: 0.1, max: 20 },
          alt: { min: 1, max: 2000 },
          ast: { min: 1, max: 2000 },
          alp: { min: 1, max: 5000 },
          proteinastotales: { min: 2, max: 15 },
          albumina: { min: 0.5, max: 8 },
          sodio: { min: 100, max: 200 },
          potasio: { min: 1, max: 10 },
          cloro: { min: 80, max: 140 },
          calcio: { min: 4, max: 18 },
          fosforo: { min: 1, max: 20 }
        };

        Object.keys(valores).forEach(key => {
          const range = SANITY_RANGES[key];
          if (range && (valores[key] < range.min || valores[key] > range.max)) {
            console.warn(`PDF sanity check: ${key}=${valores[key]} fuera de rango [${range.min}-${range.max}], descartado`);
            delete valores[key];
          }
        });

        console.log('Valores extraídos del PDF:', valores);
        resolve({ valores, textoCompleto });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer PDF'));
    reader.readAsArrayBuffer(file);
  });
}

function extraerValorMultiple(texto, regexList) {
  for (const regex of regexList) {
    const match = texto.match(regex);
    if (match) {
      const val = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(val) && val > 0) return val;
    }
  }
  return null;
}

function extraerValor(texto, regex) {
  const match = texto.match(regex);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return null;
}
