// Toggle this to switch between Real API and Simulation Mode
export const USE_MOCK_API = false;

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

export const API_ENDPOINTS = {
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  RESERVATIONS: `${API_BASE_URL}/api/reservations`,
  PROCESS_NOTIFICATION: (id: string) =>
    `${API_BASE_URL}/api/notifications/${id}/process`,
};

// Simulation Constants
export const MOCK_DELAY_MS = 600;
