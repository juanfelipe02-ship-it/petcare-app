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
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, user: cred.user };
  } catch (error) {
    return { success: false, error: traducirErrorFirebase(error.code) };
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

// Extraer valores del PDF usando PDF.js
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
          const pageText = textContent.items.map(item => item.str).join(' ');
          textoCompleto += pageText + '\n';
        }

        // Buscar valores con regex
        const valores = {
          hemoglobina: extraerValor(textoCompleto, /hemoglobina[\s:]*(\d+[.,]?\d*)\s*(g\/dL|g\/dl)/i),
          glucosa: extraerValor(textoCompleto, /glucosa[\s:]*(\d+[.,]?\d*)\s*(mg\/dL|mg\/dl)/i),
          creatinina: extraerValor(textoCompleto, /creatinina[\s:]*(\d+[.,]?\d*)\s*(mg\/dL|mg\/dl)/i),
          alt: extraerValor(textoCompleto, /alt[\s:]*(\d+[.,]?\d*)\s*(U\/L|u\/l)/i) ||
               extraerValor(textoCompleto, /alanina[\s\w]*[\s:]*(\d+[.,]?\d*)\s*(U\/L|u\/l)/i),
          proteinas: extraerValor(textoCompleto, /prote[ií]nas?\s*totales?[\s:]*(\d+[.,]?\d*)\s*(g\/dL|g\/dl)/i)
        };

        resolve({ valores, textoCompleto });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer PDF'));
    reader.readAsArrayBuffer(file);
  });
}

function extraerValor(texto, regex) {
  const match = texto.match(regex);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return null;
}
