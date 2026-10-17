import apiClient from './axios';

/**
 * Patient API
 *
 * Gateway routes (StripPrefix=1 removes /api prefix before forwarding to patient-service):
 *   GET    /api/patients         → patient-service GET    /patients
 *   POST   /api/patients         → patient-service POST   /patients
 *   PUT    /api/patients/:id     → patient-service PUT    /patients/:id
 *   DELETE /api/patients/:id     → patient-service DELETE /patients/:id
 *
 * All endpoints require JWT (JwtValidation filter on the gateway).
 *
 * PatientResponseDTO: { id, name, email, address, dateOfBirth }
 *
 * PatientRequestDTO (create): { name, email, address, dateOfBirth, registeredDate }
 *   - registeredDate is required on CREATE only
 * PatientRequestDTO (update): { name, email, address, dateOfBirth }
 *   - registeredDate is NOT required on UPDATE
 */

/**
 * Fetch all patients.
 * @returns {Promise<Array<{ id, name, email, address, dateOfBirth }>>}
 */
export async function getPatients() {
  const response = await apiClient.get('/api/patients');
  return response.data;
}

/**
 * Create a new patient.
 * @param {{ name: string, email: string, address: string, dateOfBirth: string, registeredDate: string }} data
 * @returns {Promise<{ id, name, email, address, dateOfBirth }>}
 */
export async function createPatient(data) {
  const response = await apiClient.post('/api/patients', data);
  return response.data;
}

/**
 * Update an existing patient.
 * @param {string} id - UUID
 * @param {{ name: string, email: string, address: string, dateOfBirth: string }} data
 * @returns {Promise<{ id, name, email, address, dateOfBirth }>}
 */
export async function updatePatient(id, data) {
  const response = await apiClient.put(`/api/patients/${id}`, data);
  return response.data;
}

/**
 * Delete a patient by ID.
 * @param {string} id - UUID
 * @returns {Promise<void>}
 */
export async function deletePatient(id) {
  await apiClient.delete(`/api/patients/${id}`);
}
