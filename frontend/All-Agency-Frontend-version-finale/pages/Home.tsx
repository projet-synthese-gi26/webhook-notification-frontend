import React from 'react';
import { ArrowRight, Globe2, Bell, ShieldCheck, Building2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigateToRegister = () => {
    window.location.hash = '/register';
  };

  const navigateToAgencyRegister = () => {
    window.location.hash = '/register-agency';
  };
  const url = "https://picsum.photos/id/16/1920/1080";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://fastly.picsum.photos/id/16/1920/1080.jpg?hmac=_6fs6OkGQOdiQXbPVzUwSybjfj9oZksiHdNBv6g1Zjs"
            alt="Ocean View"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Votre Voyage, <br />
            <span className="text-blue-400">Notre Connexion</span>
          </h1>
          <p className="mt-4 max-w-xl text-xl text-blue-100 mb-10">
            All Agency centralise vos désirs d'évasion et les transmet
            instantanément aux meilleures agences mondiales grâce à notre
            technologie de notification en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={navigateToRegister}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              Débuter une réservation
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={navigateToAgencyRegister}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-lg font-medium rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
            >
              Accès Agence
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Fonctionnement
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Architecture Événementielle
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Nous agissons comme producteur de données. Vos demandes
              déclenchent des processus métier automatisés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Globe2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                1. Centralisation
              </h3>
              <p className="mt-2 text-base text-slate-500">
                Une interface unique pour accéder à un réseau mondial d'agences
                partenaires.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                2. Fiabilité des Données
              </h3>
              <p className="mt-2 text-base text-slate-500">
                Vos informations sont validées et structurées avant d'être
                transmises au backend.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                3. Notification Instantanée
              </h3>
              <p className="mt-2 text-base text-slate-500">
                Le backend notifie l'agence via Webhook dès la confirmation de
                votre demande.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agency CTA Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-4">
              Vous êtes une Agence de Voyage ?
            </h2>
            <p className="text-slate-400 max-w-lg">
              Connectez votre système d'information à notre plateforme via
              Webhooks et recevez des leads qualifiés en temps réel.
            </p>
          </div>
          <button
            onClick={navigateToAgencyRegister}
            className="flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-500 transition-all"
          >
            <Building2 className="mr-2 h-5 w-5" />
            Inscrire mon agence
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;