export const CLINIC_NESTED_RELATIONS = ['doctors.services'] as const;
export const DOCTOR_NESTED_RELATIONS = [] as const;
export const SERVICE_NESTED_RELATIONS = ['doctors.clinics'] as const;
