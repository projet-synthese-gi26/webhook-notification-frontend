// --- Enums ---

export enum NotificationStatus {
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
}

export enum EventName {
  RESERVATION_CREATED = 'RESERVATION_CREATED',
}

export enum DataSource {
  API = 'API',
  SIMULATION = 'SIMULATION',
}

export enum ReservationType {
  LEISURE = 'LEISURE',
  BUSINESS = 'BUSINESS',
  HONEYMOON = 'HONEYMOON',
}

// --- Entities ---

export interface ReservationPayload {
  clientNom: string;
  clientPrenom: string;
  destination: string;
  dateDepart: string;
  nombrePersonnes: number;
  typeVoyage: ReservationType;
  commentaires?: string;
}

export interface Notification {
  id: string;
  eventName: EventName;
  payload: ReservationPayload;
  status: NotificationStatus;
  receivedAt: string; // ISO String
}

export interface Reservation {
  id: string;
  clientNom: string;
  clientPrenom: string;
  destination: string;
  dateDepart: string;
  nombrePersonnes: number;
  typeVoyage: ReservationType;
  commentaires?: string;
  createdAt: string; // ISO String
  source: DataSource;
}

// --- Service Interface ---

export interface IAgencyService {
  /** Fetch all notifications */
  getNotifications(): Promise<Notification[]>;
  
  /** Fetch all reservations */
  getReservations(): Promise<Reservation[]>;
  
  /** Process a notification to create a reservation */
  processNotification(notificationId: string): Promise<Reservation>;
  
  /** Simulation Only: Create a fake notification */
  simulateNotification?(): Promise<Notification>;
  
  /** Reset data (Simulation only) */
  resetSimulation?(): Promise<void>;
}