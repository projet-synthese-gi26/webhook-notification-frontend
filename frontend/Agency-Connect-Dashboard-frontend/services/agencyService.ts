import { 
  IAgencyService, 
  Notification, 
  Reservation, 
  NotificationStatus, 
  EventName, 
  DataSource, 
  ReservationType, 
  ReservationPayload 
} from '../types';
import { API_ENDPOINTS, MOCK_DELAY_MS } from '../constants';

// --- Helper: Generate ID ---
const generateId = () => Math.random().toString(36).substring(2, 9);

// --- Helper: Mock Data Generator ---
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockPayload = (): ReservationPayload => {
  const destinations = ['Paris', 'Tokyo', 'New York', 'Bali', 'Rome', 'Sydney'];
  const lastNames = ['Smith', 'Doe', 'Martin', 'Dubois', 'Tanaka'];
  const firstNames = ['John', 'Jane', 'Pierre', 'Marie', 'Kenji'];
  const types = [ReservationType.LEISURE, ReservationType.BUSINESS, ReservationType.HONEYMOON];
  
  return {
    clientNom: getRandomElement(lastNames),
    clientPrenom: getRandomElement(firstNames),
    destination: getRandomElement(destinations),
    dateDepart: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
    nombrePersonnes: Math.floor(Math.random() * 4) + 1,
    typeVoyage: getRandomElement(types),
    commentaires: Math.random() > 0.5 ? 'Vegetarian meal requested.' : undefined,
  };
};

// =========================================================
// 1. MOCK SERVICE (Simulation)
// =========================================================
export class MockAgencyService implements IAgencyService {
  private readonly STORAGE_KEY_NOTIFS = 'agency_mock_notifications';
  private readonly STORAGE_KEY_RES = 'agency_mock_reservations';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY_NOTIFS)) {
      localStorage.setItem(this.STORAGE_KEY_NOTIFS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEY_RES)) {
      localStorage.setItem(this.STORAGE_KEY_RES, JSON.stringify([]));
    }
  }

  private getStoredNotifications(): Notification[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_NOTIFS) || '[]');
  }

  private getStoredReservations(): Reservation[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_RES) || '[]');
  }

  private saveNotifications(data: Notification[]) {
    localStorage.setItem(this.STORAGE_KEY_NOTIFS, JSON.stringify(data));
  }

  private saveReservations(data: Reservation[]) {
    localStorage.setItem(this.STORAGE_KEY_RES, JSON.stringify(data));
  }

  async getNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    return this.getStoredNotifications().sort((a, b) => 
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }

  async getReservations(): Promise<Reservation[]> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    return this.getStoredReservations().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async processNotification(notificationId: string): Promise<Reservation> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    
    const notifications = this.getStoredNotifications();
    const notifIndex = notifications.findIndex(n => n.id === notificationId);

    if (notifIndex === -1) throw new Error('Notification not found');
    if (notifications[notifIndex].status === NotificationStatus.PROCESSED) {
      throw new Error('Notification already processed');
    }

    // Update Notification Status
    const notif = notifications[notifIndex];
    notif.status = NotificationStatus.PROCESSED;
    notifications[notifIndex] = notif;
    this.saveNotifications(notifications);

    // Create Reservation
    const newReservation: Reservation = {
      id: `RES-${generateId()}`,
      ...notif.payload,
      createdAt: new Date().toISOString(),
      source: DataSource.SIMULATION,
    };

    const reservations = this.getStoredReservations();
    reservations.push(newReservation);
    this.saveReservations(reservations);

    return newReservation;
  }

  async simulateNotification(): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Fast
    
    const newNotif: Notification = {
      id: `NOTIF-${generateId()}`,
      eventName: EventName.RESERVATION_CREATED,
      payload: generateMockPayload(), // cette fonction genere un objet de type ReservationPayload
      status: NotificationStatus.RECEIVED,
      receivedAt: new Date().toISOString(),
    };

    const list = this.getStoredNotifications();
    list.push(newNotif);
    this.saveNotifications(list);
    return newNotif;
  }

  async resetSimulation(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY_NOTIFS);
    localStorage.removeItem(this.STORAGE_KEY_RES);
    this.initializeStorage();
  }
}

// =========================================================
// 2. REAL API SERVICE
// =========================================================
export class RealAgencyService implements IAgencyService {
  async getNotifications(): Promise<Notification[]> {
    const res = await fetch(API_ENDPOINTS.NOTIFICATIONS);
    console.log("notifications prises avec succes ");
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  }

  async getReservations(): Promise<Reservation[]> {
    const res = await fetch(API_ENDPOINTS.RESERVATIONS);
    if (!res.ok) throw new Error("Failed to fetch reservations");
    return res.json();
  }

   // ✅ CORRECT
  async processNotification(id: string): Promise<NotificationResponseDTO> {
    const response = await fetch(`${API_ENDPOINTS.PROCESS_NOTIFICATION(id)}`, {
      method: "PUT", // ⭐ IMPORTANT - C'est probablement ce qui manque
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Error response:", errorData);
      throw new Error(errorData.error || "Failed to process notification");
    }

    // ✅ Après — vérifie si le body est vide avant de parser
  const text = await response.text();
  return text ? JSON.parse(text) : {};
  }
}