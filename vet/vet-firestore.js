// ============================================================
// PetCare VET - Firestore Operations
// Requires firebase-config.js loaded first
// ============================================================

// ==================== HELPERS ====================

let _vetClinicId = null;
let _vetUserId = null;
let _vetUserData = null;

async function vetInit() {
  const user = auth.currentUser;
  if (!user) return false;
  _vetUserId = user.uid;
  const doc = await db.collection('users').doc(user.uid).get();
  if (!doc.exists) return false;
  _vetUserData = doc.data();
  _vetClinicId = _vetUserData.clinicId;
  return !!_vetClinicId;
}

function getClinicId() { return _vetClinicId; }
function getVetUserId() { return _vetUserId; }
function getVetUserData() { return _vetUserData; }

// ==================== CLINIC ====================

async function getClinic() {
  if (!_vetClinicId) return null;
  const doc = await db.collection('clinics').doc(_vetClinicId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function updateClinic(data) {
  if (!_vetClinicId) return;
  await db.collection('clinics').doc(_vetClinicId).update(data);
}

// ==================== CLIENTS ====================

async function getClients() {
  const snap = await db.collection('clients')
    .where('clinicId', '==', _vetClinicId)
    .where('active', '==', true)
    .orderBy('lastName')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getAllClients(includeInactive) {
  let query = db.collection('clients').where('clinicId', '==', _vetClinicId);
  if (!includeInactive) query = query.where('active', '==', true);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getClient(clientId) {
  const doc = await db.collection('clients').doc(clientId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createClient(data) {
  const ref = await db.collection('clients').add({
    clinicId: _vetClinicId,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    idNumber: data.idNumber || '',
    notes: data.notes || '',
    linkedOwnerId: null,
    active: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedBy: _vetUserId
  });
  return ref.id;
}

async function updateClient(clientId, data) {
  data.updatedBy = _vetUserId;
  await db.collection('clients').doc(clientId).update(data);
}

async function deactivateClient(clientId) {
  await db.collection('clients').doc(clientId).update({ active: false, updatedBy: _vetUserId });
}

// ==================== PATIENTS (Pets in clinic context) ====================

async function getPatients() {
  const snap = await db.collection('pets')
    .where('clinicId', '==', _vetClinicId)
    .where('active', '==', true)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getPatient(petId) {
  const doc = await db.collection('pets').doc(petId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function getPatientsByClient(clientId) {
  const snap = await db.collection('pets')
    .where('clinicId', '==', _vetClinicId)
    .where('clientId', '==', clientId)
    .where('active', '==', true)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createPatient(data) {
  const ref = await db.collection('pets').add({
    clinicId: _vetClinicId,
    clientId: data.clientId || '',
    ownerId: null,
    name: data.name || '',
    species: data.species || 'dog',
    breed: data.breed || '',
    birthDate: data.birthDate || '',
    gender: data.gender || '',
    weight: data.weight || 0,
    photo: data.photo || '',
    microchipId: data.microchipId || '',
    insuranceProvider: data.insuranceProvider || '',
    insurancePolicyNumber: data.insurancePolicyNumber || '',
    bloodType: data.bloodType || '',
    allergies: data.allergies || [],
    active: true,
    deceased: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}

async function updatePatient(petId, data) {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  await db.collection('pets').doc(petId).update(data);
}

async function deactivatePatient(petId) {
  await db.collection('pets').doc(petId).update({ active: false, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
}

// ==================== VISITS ====================

async function getVisitsByPatient(petId) {
  const snap = await db.collection('visits')
    .where('clinicId', '==', _vetClinicId)
    .where('petId', '==', petId)
    .orderBy('date', 'desc')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getVisitsByDate(dateStr) {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);

  const snap = await db.collection('visits')
    .where('clinicId', '==', _vetClinicId)
    .where('date', '>=', firebase.firestore.Timestamp.fromDate(start))
    .where('date', '<=', firebase.firestore.Timestamp.fromDate(end))
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createVisit(data) {
  const ref = await db.collection('visits').add({
    clinicId: _vetClinicId,
    petId: data.petId,
    clientId: data.clientId,
    veterinarianId: _vetUserId,
    date: firebase.firestore.Timestamp.fromDate(data.date || new Date()),
    duration: data.duration || 30,
    type: data.type || 'consultation',
    status: data.status || 'in_progress',
    soap: data.soap || { subjective: '', objective: '', assessment: '', plan: '' },
    vitals: data.vitals || {},
    diagnoses: data.diagnoses || [],
    treatments: data.treatments || [],
    attachments: data.attachments || [],
    labOrders: data.labOrders || [],
    followUp: data.followUp || null,
    invoice: data.invoice || null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: _vetUserId
  });
  return ref.id;
}

async function updateVisit(visitId, data) {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  await db.collection('visits').doc(visitId).update(data);
}

// ==================== APPOINTMENTS ====================

async function getAppointmentsByDate(dateStr) {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);

  const snap = await db.collection('appointments')
    .where('clinicId', '==', _vetClinicId)
    .where('startTime', '>=', firebase.firestore.Timestamp.fromDate(start))
    .where('startTime', '<=', firebase.firestore.Timestamp.fromDate(end))
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createAppointment(data) {
  const ref = await db.collection('appointments').add({
    clinicId: _vetClinicId,
    petId: data.petId,
    clientId: data.clientId,
    veterinarianId: data.veterinarianId || _vetUserId,
    startTime: firebase.firestore.Timestamp.fromDate(data.startTime),
    endTime: firebase.firestore.Timestamp.fromDate(data.endTime),
    duration: data.duration || 30,
    type: data.type || 'consultation',
    reason: data.reason || '',
    notes: data.notes || '',
    status: 'scheduled',
    reminders: { email: { sent: false }, sms: { sent: false }, whatsapp: { sent: false } },
    visitId: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: _vetUserId
  });
  return ref.id;
}

async function updateAppointment(appointmentId, data) {
  await db.collection('appointments').doc(appointmentId).update(data);
}

// ==================== DASHBOARD STATS ====================

// ==================== OWNER LINKS ====================

async function inviteOwnerToApp(clientId, clientEmail, petIds, permissions) {
  const token = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  const ref = await db.collection('ownerLinks').add({
    ownerId: '',
    ownerEmail: clientEmail,
    clinicId: _vetClinicId,
    clientId,
    petIds: petIds || [],
    permissions: permissions || {
      viewMedicalHistory: true,
      viewInvoices: false,
      bookAppointments: true,
      receiveReminders: true
    },
    status: 'pending_owner',
    invitationToken: token,
    invitedAt: firebase.firestore.FieldValue.serverTimestamp(),
    invitedBy: _vetUserId,
    acceptedAt: null,
    revokedAt: null,
    revokedBy: null,
    consentGivenAt: null,
    consentIpAddress: ''
  });
  return { id: ref.id, token };
}

async function getOwnerLinksByClinic() {
  const snap = await db.collection('ownerLinks')
    .where('clinicId', '==', _vetClinicId)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getOwnerLinkByClient(clientId) {
  const snap = await db.collection('ownerLinks')
    .where('clinicId', '==', _vetClinicId)
    .where('clientId', '==', clientId)
    .limit(1)
    .get();
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

async function approveOwnerLink(linkId) {
  await db.collection('ownerLinks').doc(linkId).update({
    status: 'active',
    acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function revokeOwnerLink(linkId) {
  await db.collection('ownerLinks').doc(linkId).update({
    status: 'revoked',
    revokedAt: firebase.firestore.FieldValue.serverTimestamp(),
    revokedBy: _vetUserId
  });
}

async function getPendingLinkRequests() {
  const snap = await db.collection('ownerLinks')
    .where('clinicId', '==', _vetClinicId)
    .where('status', '==', 'pending_clinic')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ==================== DASHBOARD STATS ====================

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStart = firebase.firestore.Timestamp.fromDate(today);
  const todayEnd = firebase.firestore.Timestamp.fromDate(tomorrow);

  // Parallel queries
  const [appointmentsSnap, visitsSnap, clientsSnap, patientsSnap] = await Promise.all([
    db.collection('appointments')
      .where('clinicId', '==', _vetClinicId)
      .where('startTime', '>=', todayStart)
      .where('startTime', '<', todayEnd)
      .get(),
    db.collection('visits')
      .where('clinicId', '==', _vetClinicId)
      .where('date', '>=', todayStart)
      .where('date', '<', todayEnd)
      .get(),
    db.collection('clients')
      .where('clinicId', '==', _vetClinicId)
      .where('active', '==', true)
      .get(),
    db.collection('pets')
      .where('clinicId', '==', _vetClinicId)
      .where('active', '==', true)
      .get()
  ]);

  const appointments = appointmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const visits = visitsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  return {
    appointmentsToday: appointments.length,
    completedToday: visits.filter(v => v.status === 'completed').length,
    totalClients: clientsSnap.size,
    totalPatients: patientsSnap.size,
    appointments
  };
}
