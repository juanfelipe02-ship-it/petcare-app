// ============================================================
// PetCare Pro - Base de Datos de Alimentos por Región
// ============================================================

const FOOD_DATABASE = {
  colombia: {
    premium: [
      {
        marca: 'Royal Canin',
        logo: 'fas fa-crown',
        lineas: {
          adulto: { nombre: 'Medium Adult', proteina: 27, grasa: 14, carbohidratos: 45, fibra: 3.2, kcalPorKg: 3700, precio: 85000, tamaño: 15 },
          cachorro: { nombre: 'Medium Puppy', proteina: 32, grasa: 18, carbohidratos: 40, fibra: 2.8, kcalPorKg: 3900, precio: 95000, tamaño: 15 },
          senior: { nombre: 'Medium Aging 10+', proteina: 24, grasa: 12, carbohidratos: 48, fibra: 4.5, kcalPorKg: 3500, precio: 90000, tamaño: 15 },
          renal: { nombre: 'Renal Support', proteina: 18, grasa: 16, carbohidratos: 52, fibra: 2.0, kcalPorKg: 3800, precio: 120000, tamaño: 10 },
          weight: { nombre: 'Weight Care', proteina: 28, grasa: 10, carbohidratos: 42, fibra: 6.5, kcalPorKg: 3200, precio: 95000, tamaño: 12 }
        },
        especificas: [
          { raza: 'Labrador', nombre: 'Labrador Adult', proteina: 28, grasa: 13, carbohidratos: 42, kcalPorKg: 3500, precio: 90000, tamaño: 12, nota: 'Croqueta diseñada para mandíbula de Labrador. Incluye glucosamina.' },
          { raza: 'Bulldog Francés', nombre: 'French Bulldog Adult', proteina: 26, grasa: 14, carbohidratos: 44, kcalPorKg: 3600, precio: 95000, tamaño: 10, nota: 'Croqueta especial para braquicéfalos. Fácil de tomar.' },
          { raza: 'Pastor Alemán', nombre: 'German Shepherd Adult', proteina: 28, grasa: 15, carbohidratos: 40, kcalPorKg: 3700, precio: 92000, tamaño: 12, nota: 'Alta digestibilidad para estómagos sensibles.' },
          { raza: 'Golden Retriever', nombre: 'Golden Retriever Adult', proteina: 27, grasa: 13, carbohidratos: 43, kcalPorKg: 3500, precio: 90000, tamaño: 12, nota: 'Incluye ácidos grasos para piel y pelaje.' },
          { raza: 'Chihuahua', nombre: 'Chihuahua Adult', proteina: 30, grasa: 18, carbohidratos: 38, kcalPorKg: 4000, precio: 55000, tamaño: 3, nota: 'Croqueta miniatura. Alto contenido calórico para metabolismo rápido.' }
        ],
        gatoLineas: {
          adulto: { nombre: 'Indoor Adult', proteina: 35, grasa: 22, carbohidratos: 28, fibra: 5.0, kcalPorKg: 3700, precio: 85000, tamaño: 10 },
          cachorro: { nombre: 'Kitten', proteina: 40, grasa: 24, carbohidratos: 22, fibra: 3.0, kcalPorKg: 4000, precio: 88000, tamaño: 10 },
          senior: { nombre: 'Aging 12+', proteina: 33, grasa: 20, carbohidratos: 30, fibra: 4.5, kcalPorKg: 3600, precio: 90000, tamaño: 10 },
          renal: { nombre: 'Renal Feline', proteina: 28, grasa: 22, carbohidratos: 35, fibra: 3.0, kcalPorKg: 3800, precio: 110000, tamaño: 4 }
        },
        disponibilidad: ['Peluditos Store', 'Exito', 'Carulla', 'MercadoLibre', 'Veterinarias'],
        website: 'royalcanin.com.co',
        pais: 'Francia'
      },
      {
        marca: 'Hills Science Diet',
        logo: 'fas fa-flask',
        lineas: {
          adulto: { nombre: 'Adult Original', proteina: 25, grasa: 15, carbohidratos: 46, fibra: 3.0, kcalPorKg: 3600, precio: 80000, tamaño: 15 },
          cachorro: { nombre: 'Puppy Large Breed', proteina: 29, grasa: 17, carbohidratos: 42, fibra: 2.5, kcalPorKg: 3700, precio: 88000, tamaño: 15 },
          senior: { nombre: 'Adult 7+', proteina: 23, grasa: 13, carbohidratos: 48, fibra: 4.0, kcalPorKg: 3400, precio: 85000, tamaño: 15 },
          weight: { nombre: 'Perfect Weight', proteina: 27, grasa: 10, carbohidratos: 44, fibra: 8.0, kcalPorKg: 3100, precio: 90000, tamaño: 12 },
          renal: { nombre: 'k/d Kidney Care', proteina: 17, grasa: 18, carbohidratos: 50, fibra: 2.0, kcalPorKg: 3900, precio: 130000, tamaño: 8 }
        },
        gatoLineas: {
          adulto: { nombre: 'Indoor Cat', proteina: 33, grasa: 20, carbohidratos: 32, fibra: 6.0, kcalPorKg: 3500, precio: 80000, tamaño: 7 },
          cachorro: { nombre: 'Kitten', proteina: 38, grasa: 23, carbohidratos: 25, fibra: 2.5, kcalPorKg: 3900, precio: 82000, tamaño: 7 },
          renal: { nombre: 'k/d Feline', proteina: 30, grasa: 24, carbohidratos: 32, fibra: 2.0, kcalPorKg: 3800, precio: 120000, tamaño: 4 }
        },
        disponibilidad: ['Locatel', 'Veterinarias', 'Amazon', 'MercadoLibre'],
        website: 'hillspet.com.co',
        pais: 'Estados Unidos'
      },
      {
        marca: 'Pro Plan (Purina)',
        logo: 'fas fa-shield-alt',
        lineas: {
          adulto: { nombre: 'OptiHealth Adult', proteina: 26, grasa: 16, carbohidratos: 44, fibra: 3.0, kcalPorKg: 3700, precio: 75000, tamaño: 15 },
          cachorro: { nombre: 'OptiStart Puppy', proteina: 30, grasa: 18, carbohidratos: 40, fibra: 2.5, kcalPorKg: 3800, precio: 82000, tamaño: 15 },
          senior: { nombre: 'OptiAge 7+', proteina: 24, grasa: 14, carbohidratos: 46, fibra: 4.0, kcalPorKg: 3500, precio: 78000, tamaño: 15 },
          weight: { nombre: 'Reduce Calories', proteina: 28, grasa: 9, carbohidratos: 42, fibra: 7.0, kcalPorKg: 3000, precio: 82000, tamaño: 13 }
        },
        gatoLineas: {
          adulto: { nombre: 'Indoor Cat', proteina: 36, grasa: 21, carbohidratos: 28, fibra: 5.0, kcalPorKg: 3600, precio: 72000, tamaño: 7.5 },
          cachorro: { nombre: 'Kitten', proteina: 41, grasa: 24, carbohidratos: 22, fibra: 2.5, kcalPorKg: 4100, precio: 75000, tamaño: 7.5 }
        },
        disponibilidad: ['Exito', 'Carulla', 'Jumbo', 'MercadoLibre', 'Veterinarias'],
        website: 'proplan.com.co',
        pais: 'Estados Unidos'
      },
      {
        marca: 'Acana',
        logo: 'fas fa-leaf',
        lineas: {
          adulto: { nombre: 'Heritage Adult', proteina: 33, grasa: 17, carbohidratos: 35, fibra: 5.0, kcalPorKg: 3510, precio: 180000, tamaño: 11.4 },
          cachorro: { nombre: 'Heritage Puppy', proteina: 35, grasa: 19, carbohidratos: 32, fibra: 4.5, kcalPorKg: 3660, precio: 195000, tamaño: 11.4 }
        },
        disponibilidad: ['Tiendas especializadas', 'MercadoLibre', 'Amazon'],
        website: 'acana.com',
        pais: 'Canadá'
      }
    ],
    gamaMedia: [
      {
        marca: 'Dog Chow',
        logo: 'fas fa-bone',
        lineas: {
          adulto: { nombre: 'Adultos', proteina: 22, grasa: 10, carbohidratos: 54, fibra: 4.0, kcalPorKg: 3300, precio: 45000, tamaño: 15 },
          cachorro: { nombre: 'Cachorros', proteina: 28, grasa: 12, carbohidratos: 48, fibra: 3.0, kcalPorKg: 3500, precio: 50000, tamaño: 15 }
        },
        disponibilidad: ['Exito', 'Olimpica', 'D1', 'Ara', 'Justo & Bueno'],
        website: 'dogchow.com.co',
        pais: 'Estados Unidos'
      },
      {
        marca: 'Chunky',
        logo: 'fas fa-drumstick-bite',
        lineas: {
          adulto: { nombre: 'Adultos Pollo', proteina: 24, grasa: 12, carbohidratos: 50, fibra: 3.5, kcalPorKg: 3400, precio: 50000, tamaño: 15 },
          cachorro: { nombre: 'Cachorros', proteina: 28, grasa: 14, carbohidratos: 44, fibra: 3.0, kcalPorKg: 3600, precio: 55000, tamaño: 15 }
        },
        disponibilidad: ['Exito', 'Carulla', 'Jumbo', 'Olimpica'],
        website: 'chunky.com.co',
        pais: 'Colombia'
      },
      {
        marca: 'Pedigree',
        logo: 'fas fa-dog',
        lineas: {
          adulto: { nombre: 'Adulto Res y Vegetales', proteina: 21, grasa: 10, carbohidratos: 55, fibra: 4.0, kcalPorKg: 3200, precio: 42000, tamaño: 15 },
          cachorro: { nombre: 'Cachorro', proteina: 26, grasa: 12, carbohidratos: 48, fibra: 3.0, kcalPorKg: 3400, precio: 48000, tamaño: 15 }
        },
        disponibilidad: ['Exito', 'Olimpica', 'D1', 'Ara'],
        website: 'pedigree.com.co',
        pais: 'Estados Unidos'
      },
      {
        marca: 'Ringo',
        logo: 'fas fa-circle',
        lineas: {
          adulto: { nombre: 'Premium Adultos', proteina: 23, grasa: 11, carbohidratos: 52, fibra: 3.5, kcalPorKg: 3250, precio: 38000, tamaño: 15 }
        },
        disponibilidad: ['Exito', 'Olimpica', 'Tiendas de barrio'],
        website: 'ringo.com.co',
        pais: 'Colombia'
      }
    ],
    gatoGamaMedia: [
      {
        marca: 'Cat Chow',
        logo: 'fas fa-cat',
        lineas: {
          adulto: { nombre: 'Defense Plus', proteina: 30, grasa: 14, carbohidratos: 40, fibra: 4.0, kcalPorKg: 3400, precio: 42000, tamaño: 8 }
        },
        disponibilidad: ['Exito', 'Olimpica', 'D1', 'Ara'],
        website: 'catchow.com.co',
        pais: 'Estados Unidos'
      },
      {
        marca: 'Whiskas',
        logo: 'fas fa-fish',
        lineas: {
          adulto: { nombre: 'Adulto Pescado', proteina: 28, grasa: 12, carbohidratos: 44, fibra: 4.0, kcalPorKg: 3300, precio: 38000, tamaño: 8 }
        },
        disponibilidad: ['Exito', 'Olimpica', 'D1', 'Tiendas de barrio'],
        website: 'whiskas.com.co',
        pais: 'Estados Unidos'
      }
    ]
  },
  mexico: {
    premium: [
      {
        marca: 'Royal Canin',
        logo: 'fas fa-crown',
        lineas: {
          adulto: { nombre: 'Medium Adult', proteina: 27, grasa: 14, carbohidratos: 45, fibra: 3.2, kcalPorKg: 3700, precio: 1200, tamaño: 13.6 }
        },
        disponibilidad: ['PetCo', 'Walmart', 'Veterinarias'],
        website: 'royalcanin.com.mx',
        pais: 'Francia'
      }
    ],
    gamaMedia: [
      {
        marca: 'Dog Chow',
        logo: 'fas fa-bone',
        lineas: {
          adulto: { nombre: 'Adultos', proteina: 22, grasa: 10, carbohidratos: 54, fibra: 4.0, kcalPorKg: 3300, precio: 550, tamaño: 15 }
        },
        disponibilidad: ['Walmart', 'Bodega Aurrera', 'Superama'],
        website: 'dogchow.com.mx',
        pais: 'Estados Unidos'
      }
    ]
  }
};

// Monedas por país
const MONEDAS = {
  colombia: { simbolo: '$', nombre: 'COP', separadorMiles: '.', separadorDecimal: ',' },
  mexico: { simbolo: '$', nombre: 'MXN', separadorMiles: ',', separadorDecimal: '.' },
  usa: { simbolo: '$', nombre: 'USD', separadorMiles: ',', separadorDecimal: '.' }
};

/**
 * Formatea precio según el país
 */
function formatearPrecio(precio, pais) {
  const moneda = MONEDAS[pais] || MONEDAS.colombia;
  const formatted = precio.toLocaleString('es-CO');
  return `${moneda.simbolo}${formatted} ${moneda.nombre}`;
}

console.log('food-database.js cargado correctamente');
