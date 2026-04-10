import { Client, Agency, ReservationPayload, TripType } from '../types';

/**
 * SIMULATION DU BACKEND (ALL AGENCY API)
 * 
 * Note Architecture:
 * Ce frontend est un "Dumb Producer". Il ne connaît pas les Webhooks.
 * Il envoie des données brutes (POST) au backend.
 * C'est le backend qui déclenchera l'événement RESERVATION_CREATED.
 */
// Récupère l'URL de Vercel, sinon utilise localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


// Enlève le délai artificiel si le site est en ligne
const LATENCY = import.meta.env.MODE === "production" ? 0 : 800;
// Stockage en mémoire (mutable) pour simuler la base de données
// Note: Ces données seront réinitialisées au rafraîchissement de la page
const agenciesList: Agency[] = [
  {
    idAgence: 1,
    nom: "SkyHigh Travels",
    localisation: "Paris, France",
    description: "Spécialiste des vols long-courriers et du luxe à la française.",
    image: "https://picsum.photos/id/10/800/600",
    callbackUrl: "https://api.skyhigh.com/hooks/booking"
  },
  {
    idAgence: 2,
    nom: "Safari Adventures",
    localisation: "Nairobi, Kenya",
    description: "Vivez l'aventure sauvage avec nos guides experts.",
    image: "https://picsum.photos/id/1003/800/600",
    callbackUrl: "https://webhook.safari-adv.ke/new-resa"
  },
  {
    idAgence: 3,
    nom: "Zenith Business",
    localisation: "New York, USA",
    description: "Efficacité et confort pour vos voyages d'affaires internationaux.",
    image: "https://picsum.photos/id/48/800/600",
    callbackUrl: "https://b2b.zenith.com/notifications"
  }
];

export const ClientService = {
  /**
   * Enregistre un nouveau client.
   * POST /api/clients
   * il faudra modifier la methode register pour utiliser la methode fetch pour poster un client dans la base de donnee
   */
  register: async (clientData: Client): Promise<Client> => {
    console.log("🚀 [POST] /api/clients", JSON.stringify(clientData, null, 2));

    return new Promise((resolve) => {
      setTimeout(() => {
        // Le backend renvoie l'objet enrichi avec un ID généré
        resolve({
          ...clientData,
          id: Math.floor(Math.random() * 1000) + 1,
        });
      }, LATENCY);
    });
  },
  registerClientFromBackend: async (
  clientData: Omit<Client, "id">
): Promise<Client> => {
  
  console.log("🚀 [POST] /clients/save-client");
  console.log("📦 Données envoyées :", clientData);

  try {
    const response = await fetch(`${API_BASE_URL}/clients/save-client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    console.log("📡 Status HTTP :", response.status);

    const responseText = await response.text();
    console.log("📨 Réponse brute du backend :", responseText);

    if (!response.ok) {
      throw new Error(`Erreur backend (${response.status}) : ${responseText}`);
    }

    const createdClient: Client = JSON.parse(responseText);
    console.log("✅ Client créé :", createdClient);
    return createdClient;

  } catch (error: any) {
    console.error("❌ Erreur fetch client :", error);
    throw error; // pour que le catch du frontend attrape l'erreur
  }
},
 
};

export const AgencyService = {
  /**
   * Récupère la liste des agences partenaires.
   * GET /api/agencies
   * ici il faut faire une requete vers une api qui va donner toutes les agences donc il faut un fetch vers l'url de l'api
   */
  getAll: async (): Promise<Agency[]> => {
    console.log("🔍 [GET] /api/agencies");

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...agenciesList]); // Retourne une copie de la liste
      }, LATENCY);
    });
  },
  getAllAgencies: async (): Promise<Agency[]> => {
    console.log("🔍 [GET] /agency/agencies");

    const response = await fetch(`${API_BASE_URL}/agency/agencies`);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des agences");
    }

    // Le backend renvoie un tableau JSON
    const agencies: Agency[] = await response.json();
    return agencies;
  },

  /**
   * Enregistre une nouvelle agence partenaire.
   * POST /api/agencies
   */
  register: async (agencyData: Omit<Agency, "idAgence">): Promise<Agency> => {
    console.log("🏢 [POST] /api/agencies", JSON.stringify(agencyData, null, 2));

    return new Promise((resolve) => {
      setTimeout(() => {
        const newAgency: Agency = {
          ...agencyData,
          idAgence: Math.floor(Math.random() * 10000) + 100,
        };
        // Ajout à la liste en mémoire
        agenciesList.push(newAgency);
        resolve(newAgency);
      }, LATENCY);
    });
  },
  registerAgencyFromBackend: async (
    agencyData: Omit<Agency, "idAgence">,
  ): Promise<Agency> => {
    console.log("🏢 [POST] /agency/create-agency");
    console.log("📦 Données envoyées :", agencyData);

    const response = await fetch(`${API_BASE_URL}/agency/create-agency`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agencyData),
    });

    console.log("📡 Status HTTP :", response.status);

    const responseText = await response.text();
    console.log("📨 Réponse brute du backend :", responseText);

    if (!response.ok) {
      throw new Error(`Erreur backend (${response.status}) : ${responseText}`);
    }

    const createdAgency: Agency = JSON.parse(responseText);
    return createdAgency;
  },
};

export const ReservationService = {
  /**
   * Crée la réservation.
   * C'est cet appel qui déclenchera (côté backend) le webhook vers l'agence.
   * POST /api/reservations
   * ici je ne vais pas creer une reservation cote api mais plutot creer une notification et un evenement cote api et faire plutot un fetch post
   */
  createEventReservation: async (
    payload: ReservationPayload
  ): Promise<{ success: boolean; reference?: string }> => {
    console.log("🚀 [POST] /api/reservations/events", payload);

    // Construction de l'objet à envoyer au backend
    const event = {
      nomClient: payload.nomClient,
      prenomClient: payload.prenomClient,
      emailClient: payload.emailClient,
      telephoneClient: payload.telephoneClient,
      paysOrigineClient: payload.paysOrigineClient,
      destinationSouhaiteeClient: payload.destinationSouhaiteeClient,
      dateDepartClient: payload.dateDepartClient,
      nombrePersonnes: payload.nombrePersonnes,
      typeVoyage: payload.typeVoyage,
      commentaires: payload.commentaires,
      nomEvent: "RESERVATION_CREATED",
    };

    const response = await fetch(`${API_BASE_URL}/reservations/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur backend:", errorText);
      throw new Error(
        `Erreur lors de la création de la réservation: ${response.status}`
      );
    }

    // Le backend retourne Mono<Void> (pas de contenu),
    // donc on se base uniquement sur le status 200 pour déterminer le succès
    console.log("✅ Événement de réservation créé avec succès");

    return {
      success: true,
      // Générer une référence côté client si nécessaire
      reference: `RES-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
    };
  },
  create: async (
    payload: ReservationPayload
  ): Promise<{ success: boolean; reference: string }> => {
    console.log(
      "🚀 [POST] /api/reservations",
      JSON.stringify(payload, null, 2)
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          reference: `RES-${Date.now()}-${payload.nomClient}`,
        });
      }, LATENCY * 1.5);
    });
  },
};