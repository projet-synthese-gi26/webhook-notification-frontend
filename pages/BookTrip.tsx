import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../App";
import { ReservationService } from "../services/api";
import { ReservationPayload, TripType } from "../types";
import Steps from "../components/Steps";
import {
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const BookTrip: React.FC = () => {
  const { currentClient, selectedAgency, setClient, setAgency } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ status: boolean; ref?: string }>({
    status: false,
  });

  // Form State
  const [tripData, setTripData] = useState({
    dateDepart: "",
    nombrePersonnes: 1,
    typeVoyage: TripType.TOURISME,
    commentaires: "",
  });

  useEffect(() => {
    console.log("🔍 currentClient dans BookTrip:", currentClient);
    console.log("🔍 selectedAgency dans BookTrip:", selectedAgency);

    // Récupérer depuis sessionStorage si vide
    let clientToUse = currentClient;
    let agencyToUse = selectedAgency;

    if (!clientToUse) {
      const storedClient = sessionStorage.getItem("currentClient");
      if (storedClient) {
        console.log("📦 Client récupéré depuis sessionStorage");
        try {
          clientToUse = JSON.parse(storedClient);
          setClient(clientToUse);
        } catch (e) {
          console.error("Erreur parsing client:", e);
        }
      }
    }

    if (!agencyToUse) {
      const storedAgency = sessionStorage.getItem("selectedAgency");
      if (storedAgency) {
        console.log("📦 Agence récupérée depuis sessionStorage");
        try {
          agencyToUse = JSON.parse(storedAgency);
          setAgency(agencyToUse);
        } catch (e) {
          console.error("Erreur parsing agence:", e);
        }
      }
    }

    // Rediriger si données manquantes
    if (!clientToUse) {
      console.log("⚠️ Pas de client, redirection vers /register");
      window.location.hash = "#/register";
      return;
    }

    if (!agencyToUse) {
      console.log("⚠️ Pas d'agence, redirection vers /agencies");
      window.location.hash = "#/agencies";
      return;
    }

    console.log(
      "✅ Client et agence présents, affichage de la page de réservation",
    );
  }, [currentClient, selectedAgency, setClient, setAgency]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Récupérer les données finales (depuis contexte ou sessionStorage)
    const finalClient =
      currentClient ||
      JSON.parse(sessionStorage.getItem("currentClient") || "{}");
    const finalAgency =
      selectedAgency ||
      JSON.parse(sessionStorage.getItem("selectedAgency") || "{}");

    console.log("🔍 finalClient:", finalClient);
    console.log("🔍 finalAgency:", finalAgency);

    // ✅ CORRECTION : Utiliser 'id' au lieu de 'idAgence'
    if (!finalClient.nom || !finalAgency.id) {
      alert("Données manquantes. Veuillez recommencer le processus.");
      console.error(
        "❌ Données manquantes - Client:",
        finalClient,
        "Agency:",
        finalAgency,
      );
      window.location.hash = "#/register";
      return;
    }

    setLoading(true);

    const payload: ReservationPayload = {
      nomClient: finalClient.nom,
      prenomClient: finalClient.prenom,
      emailClient: finalClient.email,
      telephoneClient: finalClient.telephone,
      paysOrigineClient: finalClient.paysOrigine,
      destinationSouhaiteeClient: finalClient.destinationSouhaitee,
      dateDepartClient: tripData.dateDepart,
      nombrePersonnes: tripData.nombrePersonnes,
      typeVoyage: tripData.typeVoyage,
      commentaires: tripData.commentaires,
    };

    try {
      const response = await ReservationService.createEventReservation(payload);
      if (response.success) {
        setSuccess({ status: true, ref: response.reference });
      }
    } catch (error) {
      console.error("Booking failed", error);
      alert("Erreur lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  if (success.status) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Demande Envoyée !
          </h2>
          <p className="text-slate-500 mb-6">
            Votre demande a été transmise au système central All Agency.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-left text-sm">
            <p className="mb-2">
              <span className="font-semibold">Référence :</span> {success.ref}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Agence notifiée :</span>{" "}
              {selectedAgency?.nom}
            </p>
            <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
              ℹ️ Un événement{" "}
              <span className="font-mono">RESERVATION_CREATED</span> a été
              déclenché. Le Webhook a été envoyé à l'agence.
            </div>
          </div>
          <button
            onClick={() => {
              // Nettoyer sessionStorage
              sessionStorage.removeItem("currentClient");
              sessionStorage.removeItem("selectedAgency");
              window.location.hash = "/";
            }}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Steps currentStep={3} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Récapitulatif
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider">
                    Client
                  </span>
                  <span className="font-medium">
                    {currentClient?.prenom} {currentClient?.nom}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider">
                    Agence
                  </span>
                  <span className="font-medium text-blue-600">
                    {selectedAgency?.nom}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider">
                    Destination
                  </span>
                  <span className="font-medium">
                    {currentClient?.destinationSouhaitee}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  En cliquant sur "Réserver", vous déclenchez uniquement la
                  demande. La confirmation finale sera envoyée par l'agence
                  après réception de la notification Webhook.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-slate-900 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">
                  Détails du voyage
                </h2>
                <p className="text-slate-400 mt-1">
                  Finalisez votre demande pour {selectedAgency?.nom}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Date de départ
                      </div>
                    </label>
                    <input
                      type="date"
                      name="dateDepart"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={tripData.dateDepart}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" /> Nombre de personnes
                      </div>
                    </label>
                    <input
                      type="number"
                      name="nombrePersonnes"
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={tripData.nombrePersonnes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type de voyage
                  </label>
                  <select
                    name="typeVoyage"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    value={tripData.typeVoyage}
                    onChange={handleChange}
                  >
                    <option value={TripType.TOURISME}>
                      Tourisme / Loisirs
                    </option>
                    <option value={TripType.AFFAIRES}>Voyage d'Affaires</option>
                    <option value={TripType.ETUDE}>Études / Stage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Commentaires / Demandes
                      spéciales
                    </div>
                  </label>
                  <textarea
                    name="commentaires"
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Ex: Chambre vue mer, régime alimentaire particulier..."
                    value={tripData.commentaires}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full md:w-auto flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : null}
                    {loading
                      ? "Traitement en cours..."
                      : "Envoyer la demande de réservation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTrip;
