import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import { AgencyService } from "../services/api";
import { Agency } from "../types";
import Steps from "../components/Steps";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";

const AgencyList: React.FC = () => {
  const { currentClient, setAgency, setClient } = useContext(AppContext);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 currentClient dans AgencyList:", currentClient);

    // Essayer de récupérer depuis sessionStorage
    let clientToUse = currentClient;

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

    if (!clientToUse) {
      console.log("⚠️ Pas de client, redirection vers /register");
      window.location.hash = "#/register";
      return;
    }

    const fetchAgencies = async () => {
      try {
        const data = await AgencyService.getAllAgencies();
        setAgencies(data);
      } catch (e) {
        console.error("Failed to load agencies", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, [currentClient, setClient]);

  const handleSelectAgency = (agency: Agency) => {
    setAgency(agency);
    sessionStorage.setItem("selectedAgency", JSON.stringify(agency));
    window.location.hash = "#/book";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Steps currentStep={2} />

        <div className="mt-8 text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Nos Agences Partenaires
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            Bonjour{" "}
            <span className="font-semibold text-blue-600">
              {currentClient?.prenom}
            </span>
            , sélectionnez l'agence qui organisera votre voyage vers{" "}
            <span className="font-semibold">
              {currentClient?.destinationSouhaitee}
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencies.map((agency) => (
            <div
              key={agency.idAgence}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-slate-100"
            >
              <div className="relative h-48">
                <img
                  src={agency.image}
                  alt={agency.nom}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                  Partenaire Certifié
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {agency.nom}
                </h3>
                <div className="flex items-center text-slate-500 mb-4 text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-red-500" />
                  {agency.localisation}
                </div>
                <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">
                  {agency.description}
                </p>

                <div className="text-[10px] text-slate-300 mb-4 break-all ">
                  Webhook: {agency.callbackUrl}
                </div>

                <button
                  onClick={() => handleSelectAgency(agency)}
                  className="w-full mt-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Choisir cette agence
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgencyList;
