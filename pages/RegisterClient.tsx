import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { ClientService } from "../services/api";
import { Client } from "../types";
import Steps from "../components/Steps";
import { Loader2 } from "lucide-react";

const RegisterClient: React.FC = () => {
  const { setClient } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Client>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    paysOrigine: "",
    destinationSouhaitee: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📡 Appel API en cours...");
      const createdClient =
        await ClientService.registerClientFromBackend(formData);
      console.log("✅ Client créé:", createdClient);

      // IMPORTANT: Stocker dans le contexte ET sessionStorage
      setClient(createdClient);
      sessionStorage.setItem("currentClient", JSON.stringify(createdClient));
      console.log("💾 Client stocké dans contexte ET sessionStorage");

      // Navigation vers agencies
      window.location.hash = "#/agencies";
    } catch (error: any) {
      console.error("❌ Erreur inscription client :", error);
      setLoading(false);

      if (error instanceof Error) {
        alert(`Erreur inscription client : ${error.message}`);
      } else {
        alert("Erreur inconnue lors de l'inscription.");
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Steps currentStep={1} />

        <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Identification Voyageur
            </h2>
            <p className="text-blue-100 mt-2">
              Nous avons besoin de vous connaître pour préparer votre dossier.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex: Jean"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex: Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@mail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pays d'origine
                </label>
                <input
                  type="text"
                  name="paysOrigine"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.paysOrigine}
                  onChange={handleChange}
                  placeholder="Ex: France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destination souhaitée
                </label>
                <input
                  type="text"
                  name="destinationSouhaitee"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.destinationSouhaitee}
                  onChange={handleChange}
                  placeholder="Ex: Japon"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading && (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                )}
                Suivant : Choisir une Agence
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
