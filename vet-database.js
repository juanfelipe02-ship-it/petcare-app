// ============================================================
// PetCare Pro - Base de Datos de Veterinarias Colombia
// ============================================================

const VET_DATABASE = [
  // ==================== BOGOTÁ (15) ====================
  {
    id: 'vet_bog_001', nombre: 'Clínica Veterinaria San Francisco', ciudad: 'Bogotá', barrio: 'Chapinero', pais: 'Colombia',
    direccion: 'Calle 63 #10-45', coordenadas: { lat: 4.6533, lng: -74.0621 },
    telefono: '+571 7456123', whatsapp: '+573001234567', email: 'info@vetsanfrancisco.com', website: 'www.vetsanfrancisco.com',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología','Dermatología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Grooming'],
    rangoPrecios: { consultaGeneral:{min:55000,max:80000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:250000,max:600000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 134, verificada: true
  },
  {
    id: 'vet_bog_002', nombre: 'Pet Center 24H Emergencias', ciudad: 'Bogotá', barrio: 'Usaquén', pais: 'Colombia',
    direccion: 'Carrera 7 #116-50', coordenadas: { lat: 4.6962, lng: -74.0323 },
    telefono: '+571 6578900', whatsapp: '+573109876543', email: 'urgencias@petcenter24h.com', website: 'www.petcenter24h.com',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina interna','Cirugía','UCI','Cardiología','Neurología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','UCI','Laboratorio','Hospitalización','Radiología','Ecografía'],
    rangoPrecios: { consultaGeneral:{min:70000,max:100000,moneda:'COP'}, vacuna:{min:35000,max:60000,moneda:'COP'}, cirugia:{min:350000,max:1200000,moneda:'COP'} },
    calificacion: 4.8, numeroReseñas: 312, verificada: true
  },
  {
    id: 'vet_bog_003', nombre: 'Veterinaria El Campestre', ciudad: 'Bogotá', barrio: 'Cedritos', pais: 'Colombia',
    direccion: 'Calle 140 #13-25', coordenadas: { lat: 4.7225, lng: -74.0418 },
    telefono: '+571 6143567', whatsapp: '+573152345678', email: 'contacto@elcampestre.vet', website: 'www.elcampestre.vet',
    horarios: { lunes:'7:30 AM - 6:30 PM', martes:'7:30 AM - 6:30 PM', miercoles:'7:30 AM - 6:30 PM', jueves:'7:30 AM - 6:30 PM', viernes:'7:30 AM - 6:30 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Ortopedia','Rehabilitación','Dermatología'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Rehabilitación','Grooming','Pensión'],
    rangoPrecios: { consultaGeneral:{min:50000,max:75000,moneda:'COP'}, vacuna:{min:28000,max:50000,moneda:'COP'}, cirugia:{min:200000,max:500000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 89, verificada: true
  },
  {
    id: 'vet_bog_004', nombre: 'Clínica Animal Care', ciudad: 'Bogotá', barrio: 'Suba', pais: 'Colombia',
    direccion: 'Avenida Suba #115-70', coordenadas: { lat: 4.7405, lng: -74.0835 },
    telefono: '+571 6824590', whatsapp: '+573203456789', email: 'citas@animalcare.co', website: 'www.animalcare.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología','Oftalmología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Grooming'],
    rangoPrecios: { consultaGeneral:{min:45000,max:70000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:180000,max:450000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 76, verificada: true
  },
  {
    id: 'vet_bog_005', nombre: 'Hospital Veterinario de Especialistas', ciudad: 'Bogotá', barrio: 'Santa Bárbara', pais: 'Colombia',
    direccion: 'Carrera 15 #106-28', coordenadas: { lat: 4.6895, lng: -74.0420 },
    telefono: '+571 2148765', whatsapp: '+573174567890', email: 'info@hvetespecialistas.com', website: 'www.hvetespecialistas.com',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Cardiología','Neurología','Oncología','Cirugía avanzada','Endocrinología','Medicina interna'], especies: ['perros','gatos'],
    servicios: ['Consulta especializada','Emergencias 24/7','Cirugía','UCI','Laboratorio','Hospitalización','Radiología','Ecografía','Tomografía','Quimioterapia'],
    rangoPrecios: { consultaGeneral:{min:90000,max:150000,moneda:'COP'}, vacuna:{min:40000,max:65000,moneda:'COP'}, cirugia:{min:500000,max:2500000,moneda:'COP'} },
    calificacion: 4.9, numeroReseñas: 245, verificada: true
  },
  {
    id: 'vet_bog_006', nombre: 'Pets & Vets Clínica', ciudad: 'Bogotá', barrio: 'Teusaquillo', pais: 'Colombia',
    direccion: 'Calle 45 #20-15', coordenadas: { lat: 4.6345, lng: -74.0735 },
    telefono: '+571 3456789', whatsapp: '+573125678901', email: 'contacto@petsvets.co', website: 'www.petsvets.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Nutrición animal'], especies: ['perros','gatos','conejos'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Laboratorio','Grooming','Nutrición','Pensión'],
    rangoPrecios: { consultaGeneral:{min:45000,max:65000,moneda:'COP'}, vacuna:{min:25000,max:45000,moneda:'COP'}, cirugia:{min:150000,max:400000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 58, verificada: true
  },
  {
    id: 'vet_bog_007', nombre: 'Gatopardo Clínica Felina', ciudad: 'Bogotá', barrio: 'Chicó', pais: 'Colombia',
    direccion: 'Carrera 11 #93-67', coordenadas: { lat: 4.6782, lng: -74.0450 },
    telefono: '+571 6019234', whatsapp: '+573186789012', email: 'miau@gatopardo.vet', website: 'www.gatopardo.vet',
    horarios: { lunes:'9:00 AM - 6:00 PM', martes:'9:00 AM - 6:00 PM', miercoles:'9:00 AM - 6:00 PM', jueves:'9:00 AM - 6:00 PM', viernes:'9:00 AM - 6:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina felina','Cirugía felina','Odontología felina','Comportamiento felino'], especies: ['gatos'],
    servicios: ['Consulta felina','Vacunación','Cirugía','Laboratorio','Hospitalización felina','Grooming felino'],
    rangoPrecios: { consultaGeneral:{min:60000,max:90000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:250000,max:700000,moneda:'COP'} },
    calificacion: 4.7, numeroReseñas: 98, verificada: true
  },
  {
    id: 'vet_bog_008', nombre: 'VetExpress Fontibón', ciudad: 'Bogotá', barrio: 'Fontibón', pais: 'Colombia',
    direccion: 'Calle 22 #99-30', coordenadas: { lat: 4.6732, lng: -74.1452 },
    telefono: '+571 4157823', whatsapp: '+573007890123', email: 'fontibon@vetexpress.co', website: '',
    horarios: { lunes:'7:00 AM - 8:00 PM', martes:'7:00 AM - 8:00 PM', miercoles:'7:00 AM - 8:00 PM', jueves:'7:00 AM - 8:00 PM', viernes:'7:00 AM - 8:00 PM', sabado:'8:00 AM - 5:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:35000,max:55000,moneda:'COP'}, vacuna:{min:20000,max:40000,moneda:'COP'}, cirugia:{min:150000,max:350000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 43, verificada: false
  },
  {
    id: 'vet_bog_009', nombre: 'Clínica Veterinaria La Sabana', ciudad: 'Bogotá', barrio: 'Kennedy', pais: 'Colombia',
    direccion: 'Carrera 78K #38A-12 Sur', coordenadas: { lat: 4.6180, lng: -74.1543 },
    telefono: '+571 4523678', whatsapp: '+573118901234', email: 'lasabana@vet.com', website: '',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming','Baño medicado'],
    rangoPrecios: { consultaGeneral:{min:30000,max:50000,moneda:'COP'}, vacuna:{min:18000,max:38000,moneda:'COP'}, cirugia:{min:120000,max:300000,moneda:'COP'} },
    calificacion: 4.1, numeroReseñas: 67, verificada: true
  },
  {
    id: 'vet_bog_010', nombre: 'Centro Veterinario Bogotá Norte', ciudad: 'Bogotá', barrio: 'Colina Campestre', pais: 'Colombia',
    direccion: 'Calle 138 #58-72', coordenadas: { lat: 4.7312, lng: -74.0672 },
    telefono: '+571 6287456', whatsapp: '+573159012345', email: 'info@vetbogotanorte.com', website: 'www.vetbogotanorte.com',
    horarios: { lunes:'7:00 AM - 7:00 PM', martes:'7:00 AM - 7:00 PM', miercoles:'7:00 AM - 7:00 PM', jueves:'7:00 AM - 7:00 PM', viernes:'7:00 AM - 7:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Ortopedia','Ecografía','Radiología'], especies: ['perros','gatos','aves','reptiles'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía','Grooming'],
    rangoPrecios: { consultaGeneral:{min:50000,max:80000,moneda:'COP'}, vacuna:{min:28000,max:50000,moneda:'COP'}, cirugia:{min:200000,max:550000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 112, verificada: true
  },
  {
    id: 'vet_bog_011', nombre: 'Happy Paws Veterinaria', ciudad: 'Bogotá', barrio: 'Niza', pais: 'Colombia',
    direccion: 'Carrera 52 #127-35', coordenadas: { lat: 4.7125, lng: -74.0745 },
    telefono: '+571 6534210', whatsapp: '+573200123456', email: 'hola@happypaws.co', website: 'www.happypaws.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 4:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Nutrición','Comportamiento'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Nutrición','Grooming','Spa canino','Adiestramiento'],
    rangoPrecios: { consultaGeneral:{min:48000,max:72000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:180000,max:420000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 93, verificada: true
  },
  {
    id: 'vet_bog_012', nombre: 'Urgencias Veterinarias del Sur', ciudad: 'Bogotá', barrio: 'Ciudad Bolívar', pais: 'Colombia',
    direccion: 'Carrera 20 #63-15 Sur', coordenadas: { lat: 4.5621, lng: -74.1321 },
    telefono: '+571 7896543', whatsapp: '+573161234567', email: 'urgencias@vetsur.co', website: '',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','Laboratorio','Hospitalización'],
    rangoPrecios: { consultaGeneral:{min:35000,max:55000,moneda:'COP'}, vacuna:{min:18000,max:35000,moneda:'COP'}, cirugia:{min:130000,max:350000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 54, verificada: true
  },
  {
    id: 'vet_bog_013', nombre: 'Biovet Clínica Integral', ciudad: 'Bogotá', barrio: 'Modelia', pais: 'Colombia',
    direccion: 'Calle 25F #81-20', coordenadas: { lat: 4.6678, lng: -74.1234 },
    telefono: '+571 2635478', whatsapp: '+573172345678', email: 'contacto@biovet.co', website: 'www.biovet.co',
    horarios: { lunes:'7:30 AM - 7:00 PM', martes:'7:30 AM - 7:00 PM', miercoles:'7:30 AM - 7:00 PM', jueves:'7:30 AM - 7:00 PM', viernes:'7:30 AM - 7:00 PM', sabado:'8:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Laboratorio clínico','Endocrinología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio propio','Hospitalización','Ecografía'],
    rangoPrecios: { consultaGeneral:{min:55000,max:85000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:220000,max:600000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 87, verificada: true
  },
  {
    id: 'vet_bog_014', nombre: 'Peluditos Spa & Vet', ciudad: 'Bogotá', barrio: 'Galerías', pais: 'Colombia',
    direccion: 'Calle 52 #27-30', coordenadas: { lat: 4.6435, lng: -74.0678 },
    telefono: '+571 3456127', whatsapp: '+573183456789', email: 'hola@peluditosspa.co', website: 'www.peluditosspa.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 5:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Estética canina'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Grooming premium','Spa','Baño medicado','Corte de uñas','Limpieza dental'],
    rangoPrecios: { consultaGeneral:{min:40000,max:60000,moneda:'COP'}, vacuna:{min:22000,max:42000,moneda:'COP'}, cirugia:{min:150000,max:350000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 145, verificada: true
  },
  {
    id: 'vet_bog_015', nombre: 'Clínica Veterinaria UNAL', ciudad: 'Bogotá', barrio: 'Ciudad Universitaria', pais: 'Colombia',
    direccion: 'Carrera 30 #45-03 Campus UNAL', coordenadas: { lat: 4.6378, lng: -74.0832 },
    telefono: '+571 3165000', whatsapp: '+573194567890', email: 'clinicavet@unal.edu.co', website: 'www.unal.edu.co/veterinaria',
    horarios: { lunes:'7:00 AM - 5:00 PM', martes:'7:00 AM - 5:00 PM', miercoles:'7:00 AM - 5:00 PM', jueves:'7:00 AM - 5:00 PM', viernes:'7:00 AM - 5:00 PM', sabado:'Cerrado', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Oncología','Cardiología','Neurología','Medicina exótica'], especies: ['perros','gatos','aves','reptiles','equinos'],
    servicios: ['Consulta','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía','Docencia'],
    rangoPrecios: { consultaGeneral:{min:25000,max:45000,moneda:'COP'}, vacuna:{min:15000,max:30000,moneda:'COP'}, cirugia:{min:100000,max:400000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 203, verificada: true
  },
  // ==================== MEDELLÍN (12) ====================
  {
    id: 'vet_med_001', nombre: 'Clínica Veterinaria El Poblado', ciudad: 'Medellín', barrio: 'El Poblado', pais: 'Colombia',
    direccion: 'Carrera 43A #11-30', coordenadas: { lat: 6.2086, lng: -75.5695 },
    telefono: '+574 3125678', whatsapp: '+573005678901', email: 'info@vetelpoblado.com', website: 'www.vetelpoblado.com',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología','Cardiología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Grooming'],
    rangoPrecios: { consultaGeneral:{min:55000,max:85000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:230000,max:600000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 156, verificada: true
  },
  {
    id: 'vet_med_002', nombre: 'Urgencias Veterinarias Medellín 24H', ciudad: 'Medellín', barrio: 'Laureles', pais: 'Colombia',
    direccion: 'Circular 73A #39B-50', coordenadas: { lat: 6.2468, lng: -75.5925 },
    telefono: '+574 4127856', whatsapp: '+573116789012', email: 'emergencias@urgvet24.co', website: 'www.urgvet24.co',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina interna','Cirugía','UCI'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','UCI','Laboratorio','Hospitalización','Radiología'],
    rangoPrecios: { consultaGeneral:{min:65000,max:95000,moneda:'COP'}, vacuna:{min:32000,max:55000,moneda:'COP'}, cirugia:{min:300000,max:900000,moneda:'COP'} },
    calificacion: 4.7, numeroReseñas: 234, verificada: true
  },
  {
    id: 'vet_med_003', nombre: 'Mascotas Felices Vet', ciudad: 'Medellín', barrio: 'Envigado', pais: 'Colombia',
    direccion: 'Calle 38 Sur #27-20', coordenadas: { lat: 6.1732, lng: -75.5843 },
    telefono: '+574 3327654', whatsapp: '+573127890123', email: 'info@mascotasfelices.co', website: 'www.mascotasfelices.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Nutrición','Odontología'], especies: ['perros','gatos','conejos'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Nutrición','Grooming','Pensión'],
    rangoPrecios: { consultaGeneral:{min:40000,max:65000,moneda:'COP'}, vacuna:{min:22000,max:45000,moneda:'COP'}, cirugia:{min:150000,max:380000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 78, verificada: true
  },
  {
    id: 'vet_med_004', nombre: 'VetMed Centro Integral', ciudad: 'Medellín', barrio: 'Belén', pais: 'Colombia',
    direccion: 'Carrera 76 #32-18', coordenadas: { lat: 6.2312, lng: -75.6012 },
    telefono: '+574 3418765', whatsapp: '+573138901234', email: 'vetmed@centrointegral.co', website: '',
    horarios: { lunes:'7:30 AM - 6:30 PM', martes:'7:30 AM - 6:30 PM', miercoles:'7:30 AM - 6:30 PM', jueves:'7:30 AM - 6:30 PM', viernes:'7:30 AM - 6:30 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Laboratorio'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming'],
    rangoPrecios: { consultaGeneral:{min:38000,max:58000,moneda:'COP'}, vacuna:{min:20000,max:40000,moneda:'COP'}, cirugia:{min:140000,max:350000,moneda:'COP'} },
    calificacion: 4.1, numeroReseñas: 52, verificada: false
  },
  {
    id: 'vet_med_005', nombre: 'Hospital Veterinario CES', ciudad: 'Medellín', barrio: 'El Poblado', pais: 'Colombia',
    direccion: 'Calle 10A #22-04', coordenadas: { lat: 6.2015, lng: -75.5758 },
    telefono: '+574 4440555', whatsapp: '+573149012345', email: 'hospitalvet@ces.edu.co', website: 'www.ces.edu.co/veterinaria',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'8:00 AM - 12:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina interna','Cirugía','Oncología','Cardiología','Neurología','Oftalmología'], especies: ['perros','gatos','aves','equinos'],
    servicios: ['Consulta especializada','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía','Resonancia'],
    rangoPrecios: { consultaGeneral:{min:60000,max:100000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:300000,max:1500000,moneda:'COP'} },
    calificacion: 4.8, numeroReseñas: 189, verificada: true
  },
  {
    id: 'vet_med_006', nombre: 'Patas y Colas Veterinaria', ciudad: 'Medellín', barrio: 'Sabaneta', pais: 'Colombia',
    direccion: 'Calle 75 Sur #43A-70', coordenadas: { lat: 6.1518, lng: -75.6155 },
    telefono: '+574 2889345', whatsapp: '+573150123456', email: 'patasy@colas.vet', website: '',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Grooming','Pensión'],
    rangoPrecios: { consultaGeneral:{min:35000,max:55000,moneda:'COP'}, vacuna:{min:20000,max:40000,moneda:'COP'}, cirugia:{min:130000,max:320000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 64, verificada: true
  },
  {
    id: 'vet_med_007', nombre: 'Clínica Felina Medellín', ciudad: 'Medellín', barrio: 'Manila', pais: 'Colombia',
    direccion: 'Carrera 32 #8A-15', coordenadas: { lat: 6.2098, lng: -75.5802 },
    telefono: '+574 3521876', whatsapp: '+573161234567', email: 'gatos@clinicafelina.co', website: 'www.clinicafelinamed.co',
    horarios: { lunes:'9:00 AM - 6:00 PM', martes:'9:00 AM - 6:00 PM', miercoles:'9:00 AM - 6:00 PM', jueves:'9:00 AM - 6:00 PM', viernes:'9:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina felina','Cirugía felina','Comportamiento felino'], especies: ['gatos'],
    servicios: ['Consulta felina','Vacunación','Cirugía','Hospitalización','Grooming felino'],
    rangoPrecios: { consultaGeneral:{min:55000,max:80000,moneda:'COP'}, vacuna:{min:28000,max:50000,moneda:'COP'}, cirugia:{min:200000,max:550000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 87, verificada: true
  },
  {
    id: 'vet_med_008', nombre: 'VetPlanet Itagüí', ciudad: 'Medellín', barrio: 'Itagüí', pais: 'Colombia',
    direccion: 'Carrera 50 #48-25', coordenadas: { lat: 6.1845, lng: -75.6123 },
    telefono: '+574 3716543', whatsapp: '+573172345678', email: 'info@vetplanet.co', website: '',
    horarios: { lunes:'7:00 AM - 7:00 PM', martes:'7:00 AM - 7:00 PM', miercoles:'7:00 AM - 7:00 PM', jueves:'7:00 AM - 7:00 PM', viernes:'7:00 AM - 7:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Ortopedia'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming'],
    rangoPrecios: { consultaGeneral:{min:35000,max:55000,moneda:'COP'}, vacuna:{min:18000,max:38000,moneda:'COP'}, cirugia:{min:120000,max:350000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 45, verificada: false
  },
  {
    id: 'vet_med_009', nombre: 'Dr. Guau Clínica Canina', ciudad: 'Medellín', barrio: 'Robledo', pais: 'Colombia',
    direccion: 'Calle 80 #65-70', coordenadas: { lat: 6.2715, lng: -75.5987 },
    telefono: '+574 4413287', whatsapp: '+573183456789', email: 'drguau@clinica.co', website: 'www.drguau.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Rehabilitación','Ortopedia'], especies: ['perros'],
    servicios: ['Consulta','Vacunación','Cirugía','Rehabilitación','Fisioterapia','Grooming'],
    rangoPrecios: { consultaGeneral:{min:42000,max:65000,moneda:'COP'}, vacuna:{min:22000,max:45000,moneda:'COP'}, cirugia:{min:180000,max:450000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 73, verificada: true
  },
  {
    id: 'vet_med_010', nombre: 'Centro Veterinario Antioquia', ciudad: 'Medellín', barrio: 'Buenos Aires', pais: 'Colombia',
    direccion: 'Carrera 45 #49-10', coordenadas: { lat: 6.2345, lng: -75.5567 },
    telefono: '+574 2627891', whatsapp: '+573194567890', email: 'antioquia@centrovet.co', website: '',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:32000,max:50000,moneda:'COP'}, vacuna:{min:18000,max:35000,moneda:'COP'}, cirugia:{min:110000,max:300000,moneda:'COP'} },
    calificacion: 3.9, numeroReseñas: 38, verificada: false
  },
  {
    id: 'vet_med_011', nombre: 'Exotic Vet Medellín', ciudad: 'Medellín', barrio: 'Estadio', pais: 'Colombia',
    direccion: 'Circular 4 #70-30', coordenadas: { lat: 6.2525, lng: -75.5912 },
    telefono: '+574 2308765', whatsapp: '+573205678901', email: 'exotic@vetmedellin.co', website: 'www.exoticvet.co',
    horarios: { lunes:'9:00 AM - 6:00 PM', martes:'9:00 AM - 6:00 PM', miercoles:'9:00 AM - 6:00 PM', jueves:'9:00 AM - 6:00 PM', viernes:'9:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina exótica','Reptiles','Aves','Medicina general'], especies: ['perros','gatos','aves','reptiles','roedores'],
    servicios: ['Consulta general','Consulta exóticos','Vacunación','Cirugía','Laboratorio'],
    rangoPrecios: { consultaGeneral:{min:55000,max:90000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:200000,max:600000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 68, verificada: true
  },
  {
    id: 'vet_med_012', nombre: 'Vet Express La Estrella', ciudad: 'Medellín', barrio: 'La Estrella', pais: 'Colombia',
    direccion: 'Carrera 60 #82 Sur-15', coordenadas: { lat: 6.1565, lng: -75.6312 },
    telefono: '+574 2786543', whatsapp: '+573216789012', email: 'laestrella@vetexpress.co', website: '',
    horarios: { lunes:'7:30 AM - 6:00 PM', martes:'7:30 AM - 6:00 PM', miercoles:'7:30 AM - 6:00 PM', jueves:'7:30 AM - 6:00 PM', viernes:'7:30 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:30000,max:48000,moneda:'COP'}, vacuna:{min:16000,max:35000,moneda:'COP'}, cirugia:{min:100000,max:280000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 34, verificada: false
  },
  // ==================== CALI (8) ====================
  {
    id: 'vet_cal_001', nombre: 'Clínica Veterinaria Valle', ciudad: 'Cali', barrio: 'Ciudad Jardín', pais: 'Colombia',
    direccion: 'Calle 16 #100-50', coordenadas: { lat: 3.3735, lng: -76.5380 },
    telefono: '+572 3245678', whatsapp: '+573007890123', email: 'info@vetvalle.com', website: 'www.vetvalle.com',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología','Cardiología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Grooming'],
    rangoPrecios: { consultaGeneral:{min:50000,max:75000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:200000,max:550000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 112, verificada: true
  },
  {
    id: 'vet_cal_002', nombre: 'Emergency Vet Cali 24H', ciudad: 'Cali', barrio: 'El Peñón', pais: 'Colombia',
    direccion: 'Avenida 2N #8-35', coordenadas: { lat: 3.4565, lng: -76.5432 },
    telefono: '+572 6678901', whatsapp: '+573118901234', email: 'emergencias@vetcali24h.co', website: 'www.vetcali24h.co',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina interna','Cirugía','UCI'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','UCI','Laboratorio','Hospitalización','Radiología'],
    rangoPrecios: { consultaGeneral:{min:60000,max:90000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:280000,max:800000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 167, verificada: true
  },
  {
    id: 'vet_cal_003', nombre: 'VetSalud Cali Norte', ciudad: 'Cali', barrio: 'Flora Industrial', pais: 'Colombia',
    direccion: 'Calle 52N #3-20', coordenadas: { lat: 3.4812, lng: -76.5198 },
    telefono: '+572 4123456', whatsapp: '+573129012345', email: 'calinorte@vetsalud.co', website: '',
    horarios: { lunes:'7:30 AM - 6:30 PM', martes:'7:30 AM - 6:30 PM', miercoles:'7:30 AM - 6:30 PM', jueves:'7:30 AM - 6:30 PM', viernes:'7:30 AM - 6:30 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming'],
    rangoPrecios: { consultaGeneral:{min:40000,max:60000,moneda:'COP'}, vacuna:{min:22000,max:42000,moneda:'COP'}, cirugia:{min:150000,max:400000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 56, verificada: true
  },
  {
    id: 'vet_cal_004', nombre: 'Amor Animal Veterinaria', ciudad: 'Cali', barrio: 'Chipichape', pais: 'Colombia',
    direccion: 'Avenida 6N #28-45', coordenadas: { lat: 3.4678, lng: -76.5312 },
    telefono: '+572 6514327', whatsapp: '+573130123456', email: 'info@amoranimalvet.co', website: 'www.amoranimalvet.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'9:00 AM - 12:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Nutrición animal','Rehabilitación'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Nutrición','Grooming','Spa','Fisioterapia'],
    rangoPrecios: { consultaGeneral:{min:45000,max:68000,moneda:'COP'}, vacuna:{min:24000,max:45000,moneda:'COP'}, cirugia:{min:160000,max:420000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 89, verificada: true
  },
  {
    id: 'vet_cal_005', nombre: 'MiVet Sur de Cali', ciudad: 'Cali', barrio: 'Valle del Lili', pais: 'Colombia',
    direccion: 'Carrera 98 #16-60', coordenadas: { lat: 3.3598, lng: -76.5512 },
    telefono: '+572 3328765', whatsapp: '+573141234567', email: 'sur@mivet.co', website: '',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:35000,max:52000,moneda:'COP'}, vacuna:{min:18000,max:38000,moneda:'COP'}, cirugia:{min:120000,max:320000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 41, verificada: false
  },
  {
    id: 'vet_cal_006', nombre: 'Clínica Universidad del Valle', ciudad: 'Cali', barrio: 'Meléndez', pais: 'Colombia',
    direccion: 'Calle 13 #100-00 Campus Universitario', coordenadas: { lat: 3.3765, lng: -76.5323 },
    telefono: '+572 3212100', whatsapp: '+573152345678', email: 'clinvet@univalle.edu.co', website: 'www.univalle.edu.co/veterinaria',
    horarios: { lunes:'7:00 AM - 5:00 PM', martes:'7:00 AM - 5:00 PM', miercoles:'7:00 AM - 5:00 PM', jueves:'7:00 AM - 5:00 PM', viernes:'7:00 AM - 5:00 PM', sabado:'Cerrado', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Oncología','Medicina exótica'], especies: ['perros','gatos','aves','reptiles'],
    servicios: ['Consulta','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía'],
    rangoPrecios: { consultaGeneral:{min:28000,max:45000,moneda:'COP'}, vacuna:{min:15000,max:32000,moneda:'COP'}, cirugia:{min:100000,max:380000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 143, verificada: true
  },
  {
    id: 'vet_cal_007', nombre: 'PetLife Cali', ciudad: 'Cali', barrio: 'Granada', pais: 'Colombia',
    direccion: 'Calle 12N #6-45', coordenadas: { lat: 3.4512, lng: -76.5278 },
    telefono: '+572 6612345', whatsapp: '+573163456789', email: 'hola@petlifecali.co', website: 'www.petlifecali.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Endocrinología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming','Nutrición'],
    rangoPrecios: { consultaGeneral:{min:48000,max:72000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:180000,max:480000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 72, verificada: true
  },
  {
    id: 'vet_cal_008', nombre: 'VetExpress Aguablanca', ciudad: 'Cali', barrio: 'Distrito de Aguablanca', pais: 'Colombia',
    direccion: 'Carrera 28 #72-10', coordenadas: { lat: 3.4098, lng: -76.4912 },
    telefono: '+572 4456789', whatsapp: '+573174567890', email: 'aguablanca@vetexpress.co', website: '',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:28000,max:45000,moneda:'COP'}, vacuna:{min:15000,max:30000,moneda:'COP'}, cirugia:{min:100000,max:280000,moneda:'COP'} },
    calificacion: 3.8, numeroReseñas: 29, verificada: false
  },
  // ==================== BARRANQUILLA (6) ====================
  {
    id: 'vet_baq_001', nombre: 'Clínica Veterinaria Caribe', ciudad: 'Barranquilla', barrio: 'Alto Prado', pais: 'Colombia',
    direccion: 'Carrera 52 #76-120', coordenadas: { lat: 10.9878, lng: -74.7889 },
    telefono: '+575 3567890', whatsapp: '+573185678901', email: 'info@vetcaribe.co', website: 'www.vetcaribe.co',
    horarios: { lunes:'7:30 AM - 6:30 PM', martes:'7:30 AM - 6:30 PM', miercoles:'7:30 AM - 6:30 PM', jueves:'7:30 AM - 6:30 PM', viernes:'7:30 AM - 6:30 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming'],
    rangoPrecios: { consultaGeneral:{min:45000,max:70000,moneda:'COP'}, vacuna:{min:22000,max:45000,moneda:'COP'}, cirugia:{min:180000,max:450000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 98, verificada: true
  },
  {
    id: 'vet_baq_002', nombre: 'Emergencias Pet Barranquilla', ciudad: 'Barranquilla', barrio: 'Riomar', pais: 'Colombia',
    direccion: 'Calle 96 #50-25', coordenadas: { lat: 11.0045, lng: -74.8123 },
    telefono: '+575 3789012', whatsapp: '+573196789012', email: 'emergencias@petbaq.co', website: 'www.petbaq24h.co',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina interna','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','Laboratorio','Hospitalización','Radiología'],
    rangoPrecios: { consultaGeneral:{min:55000,max:85000,moneda:'COP'}, vacuna:{min:28000,max:50000,moneda:'COP'}, cirugia:{min:250000,max:700000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 134, verificada: true
  },
  {
    id: 'vet_baq_003', nombre: 'VetAquí Barranquilla', ciudad: 'Barranquilla', barrio: 'El Country', pais: 'Colombia',
    direccion: 'Carrera 56 #68-32', coordenadas: { lat: 10.9812, lng: -74.7967 },
    telefono: '+575 3456123', whatsapp: '+573207890123', email: 'baq@vetaqui.co', website: '',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Grooming','Desparasitación'],
    rangoPrecios: { consultaGeneral:{min:38000,max:58000,moneda:'COP'}, vacuna:{min:20000,max:40000,moneda:'COP'}, cirugia:{min:140000,max:380000,moneda:'COP'} },
    calificacion: 4.1, numeroReseñas: 47, verificada: true
  },
  {
    id: 'vet_baq_004', nombre: 'Mundo Pet Veterinaria', ciudad: 'Barranquilla', barrio: 'Paraíso', pais: 'Colombia',
    direccion: 'Calle 82 #42-20', coordenadas: { lat: 10.9935, lng: -74.7845 },
    telefono: '+575 3218765', whatsapp: '+573218901234', email: 'mundopet@vet.co', website: 'www.mundopetvet.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Nutrición'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía','Grooming','Pensión','Tienda de mascotas'],
    rangoPrecios: { consultaGeneral:{min:42000,max:65000,moneda:'COP'}, vacuna:{min:22000,max:42000,moneda:'COP'}, cirugia:{min:160000,max:420000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 76, verificada: true
  },
  {
    id: 'vet_baq_005', nombre: 'Centro Vet Soledad', ciudad: 'Barranquilla', barrio: 'Soledad', pais: 'Colombia',
    direccion: 'Carrera 20 #35-15', coordenadas: { lat: 10.9178, lng: -74.7634 },
    telefono: '+575 3742198', whatsapp: '+573009012345', email: 'soledad@centrovet.co', website: '',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'8:00 AM - 1:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:28000,max:45000,moneda:'COP'}, vacuna:{min:15000,max:30000,moneda:'COP'}, cirugia:{min:100000,max:280000,moneda:'COP'} },
    calificacion: 3.9, numeroReseñas: 32, verificada: false
  },
  {
    id: 'vet_baq_006', nombre: 'Vet Total Barranquilla', ciudad: 'Barranquilla', barrio: 'Boston', pais: 'Colombia',
    direccion: 'Calle 68 #46-70', coordenadas: { lat: 10.9756, lng: -74.7912 },
    telefono: '+575 3567234', whatsapp: '+573110123456', email: 'info@vettotal.co', website: 'www.vettotal.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Laboratorio'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio propio','Grooming','Hospitalización'],
    rangoPrecios: { consultaGeneral:{min:40000,max:62000,moneda:'COP'}, vacuna:{min:20000,max:42000,moneda:'COP'}, cirugia:{min:150000,max:400000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 58, verificada: true
  },
  // ==================== CARTAGENA (5) ====================
  {
    id: 'vet_ctg_001', nombre: 'Clínica Veterinaria Heroica', ciudad: 'Cartagena', barrio: 'Bocagrande', pais: 'Colombia',
    direccion: 'Carrera 3 #8-45', coordenadas: { lat: 10.3997, lng: -75.5528 },
    telefono: '+575 6654321', whatsapp: '+573121234567', email: 'info@vetheroica.co', website: 'www.vetheroica.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming'],
    rangoPrecios: { consultaGeneral:{min:50000,max:75000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:200000,max:500000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 87, verificada: true
  },
  {
    id: 'vet_ctg_002', nombre: 'Pet Emergency Cartagena', ciudad: 'Cartagena', barrio: 'Manga', pais: 'Colombia',
    direccion: 'Avenida Jiménez #28-10', coordenadas: { lat: 10.4168, lng: -75.5412 },
    telefono: '+575 6789012', whatsapp: '+573132345678', email: 'emergencias@petemergency.co', website: '',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Cirugía','Medicina interna'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','Laboratorio','Hospitalización'],
    rangoPrecios: { consultaGeneral:{min:55000,max:85000,moneda:'COP'}, vacuna:{min:28000,max:52000,moneda:'COP'}, cirugia:{min:250000,max:650000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 65, verificada: true
  },
  {
    id: 'vet_ctg_003', nombre: 'Amigos de 4 Patas', ciudad: 'Cartagena', barrio: 'Pie de la Popa', pais: 'Colombia',
    direccion: 'Calle Real #14-25', coordenadas: { lat: 10.4234, lng: -75.5378 },
    telefono: '+575 6543210', whatsapp: '+573143456789', email: 'amigos@4patas.co', website: 'www.amigos4patas.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Nutrición','Odontología'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Nutrición','Grooming','Pensión'],
    rangoPrecios: { consultaGeneral:{min:42000,max:62000,moneda:'COP'}, vacuna:{min:20000,max:42000,moneda:'COP'}, cirugia:{min:150000,max:380000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 93, verificada: true
  },
  {
    id: 'vet_ctg_004', nombre: 'VetPlus Cartagena', ciudad: 'Cartagena', barrio: 'Ternera', pais: 'Colombia',
    direccion: 'Carrera 56 #31-80', coordenadas: { lat: 10.3856, lng: -75.4987 },
    telefono: '+575 6432178', whatsapp: '+573154567890', email: 'cartagena@vetplus.co', website: '',
    horarios: { lunes:'7:30 AM - 6:00 PM', martes:'7:30 AM - 6:00 PM', miercoles:'7:30 AM - 6:00 PM', jueves:'7:30 AM - 6:00 PM', viernes:'7:30 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:32000,max:50000,moneda:'COP'}, vacuna:{min:16000,max:35000,moneda:'COP'}, cirugia:{min:110000,max:300000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 38, verificada: false
  },
  {
    id: 'vet_ctg_005', nombre: 'Hospital Vet Caribe', ciudad: 'Cartagena', barrio: 'Castillogrande', pais: 'Colombia',
    direccion: 'Carrera 1 #4-56', coordenadas: { lat: 10.3912, lng: -75.5612 },
    telefono: '+575 6567890', whatsapp: '+573165678901', email: 'hospital@vetcaribe.co', website: 'www.hospitalvetcaribe.co',
    horarios: { lunes:'7:00 AM - 7:00 PM', martes:'7:00 AM - 7:00 PM', miercoles:'7:00 AM - 7:00 PM', jueves:'7:00 AM - 7:00 PM', viernes:'7:00 AM - 7:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Cardiología','Ortopedia','Oftalmología'], especies: ['perros','gatos'],
    servicios: ['Consulta especializada','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía'],
    rangoPrecios: { consultaGeneral:{min:60000,max:90000,moneda:'COP'}, vacuna:{min:30000,max:55000,moneda:'COP'}, cirugia:{min:250000,max:700000,moneda:'COP'} },
    calificacion: 4.7, numeroReseñas: 112, verificada: true
  },
  // ==================== BUCARAMANGA (14) ====================
  {
    id: 'vet_bga_001', nombre: 'Clínica Veterinaria Santander', ciudad: 'Bucaramanga', barrio: 'Cabecera', pais: 'Colombia',
    direccion: 'Carrera 33 #48-25', coordenadas: { lat: 7.1183, lng: -73.1198 },
    telefono: '+577 6345678', whatsapp: '+573176789012', email: 'info@vetsantander.co', website: 'www.vetsantander.co',
    horarios: { lunes:'7:30 AM - 6:30 PM', martes:'7:30 AM - 6:30 PM', miercoles:'7:30 AM - 6:30 PM', jueves:'7:30 AM - 6:30 PM', viernes:'7:30 AM - 6:30 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Dermatología','Laboratorio'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio propio','Hospitalización','Grooming'],
    rangoPrecios: { consultaGeneral:{min:42000,max:65000,moneda:'COP'}, vacuna:{min:20000,max:42000,moneda:'COP'}, cirugia:{min:160000,max:420000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 82, verificada: true
  },
  {
    id: 'vet_bga_002', nombre: 'Urgencias Vet Bucaramanga', ciudad: 'Bucaramanga', barrio: 'San Alonso', pais: 'Colombia',
    direccion: 'Calle 55 #28-12', coordenadas: { lat: 7.1245, lng: -73.1156 },
    telefono: '+577 6789123', whatsapp: '+573187890123', email: 'urgencias@vetbga.co', website: '',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','Laboratorio','Hospitalización'],
    rangoPrecios: { consultaGeneral:{min:48000,max:72000,moneda:'COP'}, vacuna:{min:22000,max:45000,moneda:'COP'}, cirugia:{min:200000,max:550000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 56, verificada: true
  },
  {
    id: 'vet_bga_003', nombre: 'Pet House Veterinaria', ciudad: 'Bucaramanga', barrio: 'La Flora', pais: 'Colombia',
    direccion: 'Carrera 27 #56-30', coordenadas: { lat: 7.1312, lng: -73.1234 },
    telefono: '+577 6543218', whatsapp: '+573198901234', email: 'pethouse@vet.co', website: 'www.pethouse.co',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Nutrición','Odontología'], especies: ['perros','gatos','conejos'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Nutrición','Grooming','Tienda'],
    rangoPrecios: { consultaGeneral:{min:38000,max:58000,moneda:'COP'}, vacuna:{min:18000,max:38000,moneda:'COP'}, cirugia:{min:130000,max:350000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 64, verificada: true
  },
  {
    id: 'vet_bga_004', nombre: 'Centro Vet Floridablanca', ciudad: 'Bucaramanga', barrio: 'Floridablanca', pais: 'Colombia',
    direccion: 'Carrera 19 #8-45', coordenadas: { lat: 7.0634, lng: -73.0867 },
    telefono: '+577 6487654', whatsapp: '+573200012345', email: 'florida@centrovet.co', website: '',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'8:00 AM - 1:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:30000,max:48000,moneda:'COP'}, vacuna:{min:15000,max:32000,moneda:'COP'}, cirugia:{min:100000,max:280000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 35, verificada: false
  },
  {
    id: 'vet_bga_005', nombre: 'Hospital Veterinario Cañaveral', ciudad: 'Bucaramanga', barrio: 'Cañaveral', pais: 'Colombia',
    direccion: 'Carrera 28 #30-15', coordenadas: { lat: 7.1095, lng: -73.1045 },
    telefono: '+577 6412345', whatsapp: '+573211234567', email: 'info@vetcanaveral.co', website: 'www.vetcanaveral.co',
    horarios: { lunes:'7:00 AM - 8:00 PM', martes:'7:00 AM - 8:00 PM', miercoles:'7:00 AM - 8:00 PM', jueves:'7:00 AM - 8:00 PM', viernes:'7:00 AM - 8:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 1:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Ortopedia','Cardiología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía','Grooming'],
    rangoPrecios: { consultaGeneral:{min:50000,max:78000,moneda:'COP'}, vacuna:{min:25000,max:48000,moneda:'COP'}, cirugia:{min:200000,max:550000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 98, verificada: true
  },
  {
    id: 'vet_bga_006', nombre: 'Clínica Veterinaria Provenza', ciudad: 'Bucaramanga', barrio: 'Provenza', pais: 'Colombia',
    direccion: 'Carrera 35 #42-18', coordenadas: { lat: 7.1155, lng: -73.1230 },
    telefono: '+577 6527890', whatsapp: '+573222345678', email: 'provenza@vetclinica.co', website: '',
    horarios: { lunes:'8:00 AM - 6:00 PM', martes:'8:00 AM - 6:00 PM', miercoles:'8:00 AM - 6:00 PM', jueves:'8:00 AM - 6:00 PM', viernes:'8:00 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Odontología'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía menor','Laboratorio','Grooming','Baño medicado'],
    rangoPrecios: { consultaGeneral:{min:38000,max:60000,moneda:'COP'}, vacuna:{min:18000,max:40000,moneda:'COP'}, cirugia:{min:140000,max:380000,moneda:'COP'} },
    calificacion: 4.2, numeroReseñas: 47, verificada: true
  },
  {
    id: 'vet_bga_007', nombre: 'Animal Planet Vet 24H', ciudad: 'Bucaramanga', barrio: 'Lagos del Cacique', pais: 'Colombia',
    direccion: 'Calle 47 #35-60', coordenadas: { lat: 7.1088, lng: -73.1278 },
    telefono: '+577 6678432', whatsapp: '+573233456789', email: 'emergencias@animalplanetvet.co', website: 'www.animalplanetvet.co',
    horarios: { lunes:'24 horas', martes:'24 horas', miercoles:'24 horas', jueves:'24 horas', viernes:'24 horas', sabado:'24 horas', domingo:'24 horas' },
    emergencia24h: true, especialidades: ['Emergencias','Medicina interna','Cirugía','UCI','Cardiología'], especies: ['perros','gatos'],
    servicios: ['Consulta','Emergencias 24/7','Cirugía','UCI','Laboratorio','Hospitalización','Radiología','Ecografía'],
    rangoPrecios: { consultaGeneral:{min:55000,max:85000,moneda:'COP'}, vacuna:{min:28000,max:50000,moneda:'COP'}, cirugia:{min:250000,max:700000,moneda:'COP'} },
    calificacion: 4.6, numeroReseñas: 145, verificada: true
  },
  {
    id: 'vet_bga_008', nombre: 'Veterinaria San Alonso', ciudad: 'Bucaramanga', barrio: 'San Alonso', pais: 'Colombia',
    direccion: 'Calle 52 #25-40', coordenadas: { lat: 7.1220, lng: -73.1178 },
    telefono: '+577 6345912', whatsapp: '+573244567890', email: 'sanalonso@vet.co', website: '',
    horarios: { lunes:'7:30 AM - 6:00 PM', martes:'7:30 AM - 6:00 PM', miercoles:'7:30 AM - 6:00 PM', jueves:'7:30 AM - 6:00 PM', viernes:'7:30 AM - 6:00 PM', sabado:'8:00 AM - 1:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Nutrición animal'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Nutrición','Grooming'],
    rangoPrecios: { consultaGeneral:{min:35000,max:55000,moneda:'COP'}, vacuna:{min:16000,max:35000,moneda:'COP'}, cirugia:{min:120000,max:320000,moneda:'COP'} },
    calificacion: 4.1, numeroReseñas: 39, verificada: true
  },
  {
    id: 'vet_bga_009', nombre: 'Clínica Felina Santander', ciudad: 'Bucaramanga', barrio: 'Cabecera', pais: 'Colombia',
    direccion: 'Carrera 36 #51-22', coordenadas: { lat: 7.1202, lng: -73.1215 },
    telefono: '+577 6432178', whatsapp: '+573255678901', email: 'felinasantander@vet.co', website: 'www.felinasantander.co',
    horarios: { lunes:'9:00 AM - 6:00 PM', martes:'9:00 AM - 6:00 PM', miercoles:'9:00 AM - 6:00 PM', jueves:'9:00 AM - 6:00 PM', viernes:'9:00 AM - 6:00 PM', sabado:'9:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina felina','Cirugía felina','Odontología felina','Comportamiento felino'], especies: ['gatos'],
    servicios: ['Consulta felina','Vacunación','Cirugía','Laboratorio','Hospitalización felina','Grooming felino'],
    rangoPrecios: { consultaGeneral:{min:45000,max:70000,moneda:'COP'}, vacuna:{min:22000,max:45000,moneda:'COP'}, cirugia:{min:180000,max:500000,moneda:'COP'} },
    calificacion: 4.5, numeroReseñas: 62, verificada: true
  },
  {
    id: 'vet_bga_010', nombre: 'VetPiedecuesta Centro', ciudad: 'Bucaramanga', barrio: 'Piedecuesta', pais: 'Colombia',
    direccion: 'Carrera 8 #6-32', coordenadas: { lat: 7.0102, lng: -73.0498 },
    telefono: '+577 6567843', whatsapp: '+573266789012', email: 'piedecuesta@vetcentro.co', website: '',
    horarios: { lunes:'7:00 AM - 6:00 PM', martes:'7:00 AM - 6:00 PM', miercoles:'7:00 AM - 6:00 PM', jueves:'7:00 AM - 6:00 PM', viernes:'7:00 AM - 6:00 PM', sabado:'7:00 AM - 1:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming'],
    rangoPrecios: { consultaGeneral:{min:28000,max:45000,moneda:'COP'}, vacuna:{min:14000,max:30000,moneda:'COP'}, cirugia:{min:100000,max:260000,moneda:'COP'} },
    calificacion: 4.0, numeroReseñas: 28, verificada: false
  },
  {
    id: 'vet_bga_011', nombre: 'Girón Vet Clínica', ciudad: 'Bucaramanga', barrio: 'Girón', pais: 'Colombia',
    direccion: 'Calle 30 #25-15', coordenadas: { lat: 7.0685, lng: -73.1705 },
    telefono: '+577 6461234', whatsapp: '+573277890123', email: 'giron@vetclinica.co', website: '',
    horarios: { lunes:'7:30 AM - 6:00 PM', martes:'7:30 AM - 6:00 PM', miercoles:'7:30 AM - 6:00 PM', jueves:'7:30 AM - 6:00 PM', viernes:'7:30 AM - 6:00 PM', sabado:'8:00 AM - 2:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología'], especies: ['perros','gatos','aves'],
    servicios: ['Consulta','Vacunación','Cirugía','Desparasitación','Grooming','Tienda'],
    rangoPrecios: { consultaGeneral:{min:30000,max:48000,moneda:'COP'}, vacuna:{min:15000,max:32000,moneda:'COP'}, cirugia:{min:110000,max:280000,moneda:'COP'} },
    calificacion: 4.1, numeroReseñas: 32, verificada: true
  },
  {
    id: 'vet_bga_012', nombre: 'Hospital Veterinario UIS', ciudad: 'Bucaramanga', barrio: 'Ciudad Universitaria', pais: 'Colombia',
    direccion: 'Carrera 27 Calle 9 Campus UIS', coordenadas: { lat: 7.1398, lng: -73.1207 },
    telefono: '+577 6344000', whatsapp: '+573288901234', email: 'clinicavet@uis.edu.co', website: 'www.uis.edu.co',
    horarios: { lunes:'7:00 AM - 5:00 PM', martes:'7:00 AM - 5:00 PM', miercoles:'7:00 AM - 5:00 PM', jueves:'7:00 AM - 5:00 PM', viernes:'7:00 AM - 5:00 PM', sabado:'Cerrado', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Oncología','Medicina exótica','Laboratorio clínico'], especies: ['perros','gatos','aves','reptiles','equinos'],
    servicios: ['Consulta','Cirugía','Laboratorio','Hospitalización','Radiología','Ecografía','Docencia'],
    rangoPrecios: { consultaGeneral:{min:20000,max:40000,moneda:'COP'}, vacuna:{min:12000,max:28000,moneda:'COP'}, cirugia:{min:80000,max:350000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 112, verificada: true
  },
  {
    id: 'vet_bga_013', nombre: 'Mundo Animal Veterinaria', ciudad: 'Bucaramanga', barrio: 'Cañaveral', pais: 'Colombia',
    direccion: 'Calle 32 #31-42 Local 3', coordenadas: { lat: 7.1078, lng: -73.1058 },
    telefono: '+577 6589012', whatsapp: '+573299012345', email: 'mundo.animal@vet.co', website: 'www.mundoanimalvet.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'8:00 AM - 4:00 PM', domingo:'9:00 AM - 12:00 PM' },
    emergencia24h: false, especialidades: ['Medicina general','Dermatología','Rehabilitación','Ecografía'], especies: ['perros','gatos','conejos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Rehabilitación','Grooming','Tienda','Pensión'],
    rangoPrecios: { consultaGeneral:{min:40000,max:62000,moneda:'COP'}, vacuna:{min:20000,max:42000,moneda:'COP'}, cirugia:{min:150000,max:400000,moneda:'COP'} },
    calificacion: 4.3, numeroReseñas: 75, verificada: true
  },
  {
    id: 'vet_bga_014', nombre: 'PetVet Cabecera del Llano', ciudad: 'Bucaramanga', barrio: 'Cabecera del Llano', pais: 'Colombia',
    direccion: 'Carrera 38 #46-55', coordenadas: { lat: 7.1165, lng: -73.1252 },
    telefono: '+577 6478523', whatsapp: '+573210123456', email: 'cabecera@petvet.co', website: 'www.petvet.co',
    horarios: { lunes:'8:00 AM - 7:00 PM', martes:'8:00 AM - 7:00 PM', miercoles:'8:00 AM - 7:00 PM', jueves:'8:00 AM - 7:00 PM', viernes:'8:00 AM - 7:00 PM', sabado:'9:00 AM - 3:00 PM', domingo:'Cerrado' },
    emergencia24h: false, especialidades: ['Medicina general','Cirugía','Odontología','Nutrición'], especies: ['perros','gatos'],
    servicios: ['Consulta','Vacunación','Cirugía','Laboratorio','Grooming','Nutrición','Spa canino'],
    rangoPrecios: { consultaGeneral:{min:42000,max:65000,moneda:'COP'}, vacuna:{min:20000,max:42000,moneda:'COP'}, cirugia:{min:160000,max:420000,moneda:'COP'} },
    calificacion: 4.4, numeroReseñas: 68, verificada: true
  }
];

// ==================== TIEMPOS DE DIGESTIÓN ====================
const TIEMPOS_DIGESTION = {
  perro: {
    general: {
      seco: { min: 8, max: 10, unidad: 'horas', nota: 'Croquetas/alimento seco tarda más en digerirse' },
      humedo: { min: 4, max: 6, unidad: 'horas', nota: 'Alimento húmedo/enlatado se digiere más rápido' },
      natural: { min: 4, max: 8, unidad: 'horas', nota: 'Comida natural/casera varía según ingredientes' },
      huesos: { min: 12, max: 24, unidad: 'horas', nota: 'Los huesos carnosos tardan significativamente más' }
    },
    porEdad: {
      cachorro_0_3: { factor: 0.7, nota: 'Cachorros digieren más rápido, alimentar cada 4-6 horas', intervaloMinimo: 4 },
      cachorro_3_6: { factor: 0.8, nota: 'Digestión más rápida que adultos, alimentar cada 6-8 horas', intervaloMinimo: 6 },
      cachorro_6_12: { factor: 0.85, nota: 'Transición a digestión adulta, alimentar cada 8 horas', intervaloMinimo: 7 },
      adulto: { factor: 1.0, nota: 'Digestión estándar, alimentar cada 8-12 horas', intervaloMinimo: 8 },
      senior: { factor: 1.15, nota: 'Digestión más lenta, porciones más pequeñas y frecuentes', intervaloMinimo: 6 }
    },
    porTamaño: {
      mini: { factor: 0.75, nota: 'Razas mini digieren más rápido, metabolismo acelerado' },
      pequeño: { factor: 0.85, nota: 'Razas pequeñas tienen digestión relativamente rápida' },
      mediano: { factor: 1.0, nota: 'Tiempo de digestión estándar' },
      grande: { factor: 1.15, nota: 'Razas grandes tardan un poco más' },
      gigante: { factor: 1.25, nota: 'Razas gigantes tienen digestión más lenta, riesgo de torsión gástrica' }
    },
    porRaza: {
      'Labrador': { factor: 1.0, nota: 'Digestión normal pero comen MUY rápido. Usar comedero lento.', consejo: 'Esperar mínimo 1 hora después de comer antes de ejercicio intenso.' },
      'Pastor Alemán': { factor: 1.1, nota: 'Estómago sensible, digestión puede ser lenta', consejo: 'Dividir en 2-3 comidas. Evitar ejercicio 2h después de comer por riesgo de torsión.' },
      'Bulldog Francés': { factor: 1.15, nota: 'Braquicéfalos tragan más aire al comer, digestión más lenta', consejo: 'Usar plato elevado y croqueta pequeña. Esperar 1h antes de actividad.' },
      'Chihuahua': { factor: 0.7, nota: 'Metabolismo muy rápido, digestión rápida', consejo: 'Alimentar 3-4 veces al día en porciones pequeñas para evitar hipoglucemia.' },
      'Beagle': { factor: 0.95, nota: 'Digestión eficiente pero come compulsivamente', consejo: 'Usar comedero lento. NUNCA dejar comida libre.' },
      'Boxer': { factor: 1.15, nota: 'Propenso a flatulencia y problemas digestivos', consejo: 'Alto riesgo de torsión gástrica. Esperar 2h antes de ejercicio. Dividir en 2-3 comidas.' },
      'Golden Retriever': { factor: 1.0, nota: 'Digestión generalmente buena', consejo: 'Propenso a alergias alimentarias. Cambios de dieta graduales.' },
      'Husky Siberiano': { factor: 0.9, nota: 'Digestión eficiente, metabolismo adaptado al frío', consejo: 'Puede comer menos en climas cálidos. No forzar si rechaza comida por calor.' },
      'Yorkshire Terrier': { factor: 0.75, nota: 'Digestión rápida por tamaño diminuto', consejo: 'Comidas pequeñas y frecuentes (3-4 al día). Estómago delicado.' },
      'Poodle': { factor: 0.9, nota: 'Digestión generalmente buena', consejo: 'Puede ser selectivo. Mantener horario constante.' }
    }
  },
  gato: {
    general: {
      seco: { min: 12, max: 16, unidad: 'horas', nota: 'Las croquetas tardan más en digerirse en gatos' },
      humedo: { min: 6, max: 8, unidad: 'horas', nota: 'Alimento húmedo más natural para gatos (mayor hidratación)' },
      natural: { min: 6, max: 10, unidad: 'horas', nota: 'Dieta natural varía según proteína animal usada' }
    },
    porEdad: {
      gatito_0_4: { factor: 0.7, nota: 'Gatitos digieren rápido, alimentar 4-5 veces al día', intervaloMinimo: 4 },
      gatito_4_12: { factor: 0.8, nota: 'Digestión en maduración, alimentar 3 veces al día', intervaloMinimo: 6 },
      adulto: { factor: 1.0, nota: 'Digestión estándar felina, 2 comidas al día', intervaloMinimo: 8 },
      senior: { factor: 1.1, nota: 'Digestión más lenta, porciones más pequeñas y frecuentes', intervaloMinimo: 6 }
    },
    porRaza: {
      'Persa': { factor: 1.15, nota: 'Cara plana dificulta la masticación, digestión más lenta', consejo: 'Usar platos anchos y poco profundos. Croqueta especial para braquicéfalos.' },
      'Siamés': { factor: 0.9, nota: 'Metabolismo rápido, digestión eficiente', consejo: 'Pueden pedir comida constantemente. Mantener horario fijo.' },
      'Maine Coon': { factor: 1.1, nota: 'Gato grande, digestión un poco más lenta', consejo: 'Necesita más proteína. Crecimiento lento hasta los 4 años.' },
      'Bengalí': { factor: 0.85, nota: 'Muy activo, metabolismo acelerado', consejo: 'Necesita más calorías que el promedio. Prefiere variedad.' },
      'Ragdoll': { factor: 1.05, nota: 'Digestión normal a levemente lenta', consejo: 'Propenso a bolas de pelo. Incluir fibra. Propenso a sobrepeso.' },
      'Británico de Pelo Corto': { factor: 1.1, nota: 'Metabolismo lento, propenso a sobrepeso', consejo: 'Controlar porciones estrictamente. No dejar comida libre.' }
    }
  }
};

/**
 * Calcula el tiempo de digestión estimado para una mascota
 * @param {Object} pet - Perfil de la mascota
 * @param {string} tipoAlimento - 'seco', 'humedo', 'natural'
 * @returns {Object} Tiempo estimado y recomendaciones
 */
function calcularTiempoDigestion(pet, tipoAlimento) {
  tipoAlimento = tipoAlimento || 'seco';
  const especie = pet.especie;
  const data = TIEMPOS_DIGESTION[especie];
  if (!data) return null;

  const base = data.general[tipoAlimento];
  if (!base) return null;

  let factorTotal = 1.0;
  const notas = [];

  // Factor por edad
  const edadMeses = typeof obtenerEdadActual === 'function' ? obtenerEdadActual(pet).totalMeses : (pet.edadAnios * 12) + (pet.edadMeses || 0);
  let edadKey;
  if (especie === 'perro') {
    if (edadMeses < 3) edadKey = 'cachorro_0_3';
    else if (edadMeses < 6) edadKey = 'cachorro_3_6';
    else if (edadMeses < 12) edadKey = 'cachorro_6_12';
    else if (edadMeses <= 84) edadKey = 'adulto';
    else edadKey = 'senior';
  } else {
    if (edadMeses < 4) edadKey = 'gatito_0_4';
    else if (edadMeses < 12) edadKey = 'gatito_4_12';
    else if (edadMeses <= 84) edadKey = 'adulto';
    else edadKey = 'senior';
  }

  const edadData = data.porEdad[edadKey];
  if (edadData) {
    factorTotal *= edadData.factor;
    notas.push(edadData.nota);
  }

  // Factor por tamaño (solo perros)
  if (especie === 'perro' && data.porTamaño) {
    const razaInfo = RAZAS.perro.find(r => r.nombre === pet.raza);
    if (razaInfo && data.porTamaño[razaInfo.tamaño]) {
      factorTotal *= data.porTamaño[razaInfo.tamaño].factor;
      notas.push(data.porTamaño[razaInfo.tamaño].nota);
    }
  }

  // Factor por raza
  const razaData = data.porRaza ? data.porRaza[pet.raza] : null;
  if (razaData) {
    factorTotal *= razaData.factor;
    notas.push(razaData.nota);
    if (razaData.consejo) notas.push(razaData.consejo);
  }

  const tiempoMin = Math.round(base.min * factorTotal * 10) / 10;
  const tiempoMax = Math.round(base.max * factorTotal * 10) / 10;
  const intervaloMinimo = edadData ? edadData.intervaloMinimo : 8;

  return {
    tiempoMin,
    tiempoMax,
    unidad: base.unidad,
    intervaloMinimo,
    tipoAlimento,
    notas,
    recomendacion: `Esperar mínimo ${intervaloMinimo} horas entre comidas principales`
  };
}

/**
 * Obtiene las ciudades disponibles
 */
function obtenerCiudadesDisponibles() {
  const ciudades = [...new Set(VET_DATABASE.map(v => v.ciudad))];
  return ciudades.sort();
}

/**
 * Filtra veterinarias según criterios
 */
function filtrarVeterinarias(filtros) {
  let resultados = [...VET_DATABASE];

  if (filtros.ciudad) {
    resultados = resultados.filter(v => v.ciudad === filtros.ciudad);
  }
  if (filtros.emergencia24h) {
    resultados = resultados.filter(v => v.emergencia24h);
  }
  if (filtros.especialidades && filtros.especialidades.length > 0) {
    resultados = resultados.filter(v =>
      filtros.especialidades.some(e => v.especialidades.includes(e))
    );
  }
  if (filtros.precioMax) {
    resultados = resultados.filter(v =>
      v.rangoPrecios.consultaGeneral.min <= filtros.precioMax
    );
  }
  if (filtros.calificacionMin) {
    resultados = resultados.filter(v => v.calificacion >= filtros.calificacionMin);
  }
  if (filtros.abiertoAhora) {
    resultados = resultados.filter(v => estaAbiertoAhora(v));
  }
  if (filtros.busqueda) {
    const q = filtros.busqueda.toLowerCase();
    resultados = resultados.filter(v =>
      v.nombre.toLowerCase().includes(q) ||
      v.barrio.toLowerCase().includes(q) ||
      v.especialidades.some(e => e.toLowerCase().includes(q)) ||
      v.servicios.some(s => s.toLowerCase().includes(q))
    );
  }

  // Ordenar
  if (filtros.ordenarPor === 'calificacion') {
    resultados.sort((a, b) => b.calificacion - a.calificacion);
  } else if (filtros.ordenarPor === 'precio') {
    resultados.sort((a, b) => a.rangoPrecios.consultaGeneral.min - b.rangoPrecios.consultaGeneral.min);
  } else if (filtros.ordenarPor === 'nombre') {
    resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else {
    // Por defecto: calificación
    resultados.sort((a, b) => b.calificacion - a.calificacion);
  }

  return resultados;
}

/**
 * Verifica si una veterinaria está abierta ahora
 */
function estaAbiertoAhora(vet) {
  const ahora = new Date();
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaActual = dias[ahora.getDay()];
  const horario = vet.horarios[diaActual];

  if (!horario || horario === 'Cerrado') return false;
  if (horario === '24 horas') return true;

  // Parsear horario "8:00 AM - 6:00 PM"
  const partes = horario.split(' - ');
  if (partes.length !== 2) return false;

  const aperturaMin = parsearHora(partes[0]);
  const cierreMin = parsearHora(partes[1]);
  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes();

  return ahoraMin >= aperturaMin && ahoraMin <= cierreMin;
}

function parsearHora(horaStr) {
  const match = horaStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let horas = parseInt(match[1]);
  const minutos = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && horas !== 12) horas += 12;
  if (ampm === 'AM' && horas === 12) horas = 0;
  return horas * 60 + minutos;
}

console.log('vet-database.js cargado correctamente');
