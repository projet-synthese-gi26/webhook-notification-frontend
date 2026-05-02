import React, { useState } from 'react';
import { AgencyService } from '../services/api';
import { Building2, Globe, Link2, ImageIcon, Loader2, CheckCircle } from 'lucide-react';

const RegisterAgency: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    localisation: '',
    description: '',
    image: '',
    callbackUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Utilisation d'une image par défaut si le champ est vide
      const finalData = {
        ...formData,
        image:
          formData.image.trim() === ""
            ? `https://picsum.photos/seed/${formData.nom}/800/600`
            : formData.image,
      };

      await AgencyService.registerAgencyFromBackend(finalData); // ici la methode register sera aussi modifiee dans le fichier api.ts
      setSuccess(true);
    } catch (error: any) {
      console.error("❌ Erreur inscription agence :", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Agence Enregistrée !</h2>
          <p className="text-slate-500 mb-6">
            Votre agence <strong>{formData.nom}</strong> est désormais référencée sur All Agency. Les clients peuvent vous envoyer des réservations.
          </p>
          <div className="text-sm bg-slate-100 p-3 rounded text-slate-600 mb-6 break-all">
            <span className="font-semibold block mb-1">Webhook configuré :</span>
            {formData.callbackUrl}
          </div>
          <button 
            onClick={() => window.location.hash = '/'}
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Espace Partenaire</h1>
          <p className="mt-2 text-slate-600">Rejoignez le réseau All Agency et recevez des réservations en temps réel via Webhooks.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 flex items-center">
            <Building2 className="text-white h-8 w-8 mr-4" />
            <div>
              <h2 className="text-xl font-bold text-white">Enregistrer votre Agence</h2>
              <p className="text-slate-400 text-sm">Configuration de votre profil public et technique.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            
            {/* Identité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'agence</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    required
                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Horizon Voyages"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Localisation (Siège)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="localisation"
                    required
                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.localisation}
                    onChange={handleChange}
                    placeholder="Ex: Lyon, France"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description commerciale</label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre expertise en quelques phrases..."
              ></textarea>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL de l'image (Photo de présentation)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="image"
                  className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://exemple.com/photo.jpg (Optionnel)"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Laissez vide pour générer une image aléatoire.</p>
            </div>

            <div className="border-t border-slate-200 my-6"></div>

            {/* Technique / Webhook */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Link2 className="h-4 w-4 mr-2" />
                Configuration Technique (Webhooks)
              </h3>
              <p className="text-xs text-blue-700 mb-4">
                L'URL ci-dessous sera appelée par notre backend via une requête POST contenant le payload JSON de la réservation à chaque fois qu'un client choisira votre agence.
              </p>
              
              <label className="block text-sm font-medium text-blue-900 mb-1">Callback URL (Webhook)</label>
              <input
                type="url"
                name="callbackUrl"
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={formData.callbackUrl}
                onChange={handleChange}
                placeholder="https://api.votre-agence.com/webhooks/reservation"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-medium rounded-lg shadow-md hover:bg-slate-800 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
                Enregistrer l'agence
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAgency;