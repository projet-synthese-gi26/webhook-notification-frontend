// Enum for Trip Types
export enum TripType {
  AFFAIRES = 'AFFAIRES',
  TOURISME = 'TOURISME',
  ETUDE = 'ETUDE'
}

// 1. Entity: Client (Voyageur)
export interface Client {
  id?: number; // Provided by backend after registration
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  paysOrigine: string;
  destinationSouhaitee: string;
}

// 2. Entity: Agency
export interface Agency {
  idAgence: number;
  nom: string;
  localisation: string;
  description: string;
  image: string;
  callbackUrl?: string; // Optional display
}

// 3. Entity: Reservation (Payload structure)
export interface ReservationPayload {
  nomClient: string;
  prenomClient: string;
  emailClient: string;
  telephoneClient: string;
  paysOrigineClient: string;
  destinationSouhaiteeClient: string;
  dateDepartClient: string;
  nombrePersonnes: number;
  typeVoyage: TripType;
  commentaires: string;
}

// Application State Context Interface
export interface AppState {
  currentClient: Client | null;
  selectedAgency: Agency | null;
  setClient: (client: Client) => void;
  setAgency: (agency: Agency) => void;
  resetBooking: () => void;
}
