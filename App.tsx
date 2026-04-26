import React, { useState, useEffect, createContext } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RegisterClient from "./pages/RegisterClient";
import RegisterAgency from "./pages/RegisterAgency";
import AgencyList from "./pages/AgencyList";
import BookTrip from "./pages/BookTrip";
import { AppState, Client, Agency } from "./types";

// Create Global Context
export const AppContext = createContext<AppState>({
  currentClient: null,
  selectedAgency: null,
  setClient: () => {},
  setAgency: () => {},
  resetBooking: () => {},
});

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || "#/");

  // Charger depuis sessionStorage au démarrage si disponible
  const [currentClient, setCurrentClient] = useState<Client | null>(() => {
    const stored = sessionStorage.getItem("currentClient");
    return stored ? JSON.parse(stored) : null;
  });

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(() => {
    const stored = sessionStorage.getItem("selectedAgency");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    console.log("🎯 App monté, hash initial:", window.location.hash);

    const handleHashChange = () => {
      const newHash = window.location.hash || "#/";
      console.log("🔔 HashChange Event détecté! Nouveau hash:", newHash);
      setRoute(newHash);
    };

    // Appeler une fois au montage pour s'assurer que la route est synchronisée
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      console.log("🧹 Nettoyage du listener hashchange");
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Log à chaque changement de route
  useEffect(() => {
    console.log("📍 State route mis à jour:", route);
  }, [route]);

  // Log à chaque changement de client
  useEffect(() => {
    console.log("👤 Client mis à jour:", currentClient);
  }, [currentClient]);

  const resetBooking = () => {
    setCurrentClient(null);
    setSelectedAgency(null);
    window.location.hash = "#/";
  };

  // Basic Router Switch
  const renderPage = () => {
    const path = route.replace("#", "");

    console.log("🎨 Rendu de la page pour le path:", path);

    // Simple exact match routing
    if (path === "/" || path === "") {
      console.log("✅ Affichage de Home");
      return <Home />;
    }
    if (path === "/register") {
      console.log("✅ Affichage de RegisterClient");
      return <RegisterClient />;
    }
    if (path === "/register-agency") {
      console.log("✅ Affichage de RegisterAgency");
      return <RegisterAgency />;
    }
    if (path === "/agencies") {
      console.log("✅ Affichage de AgencyList");
      return <AgencyList />;
    }
    if (path === "/book") {
      console.log("✅ Affichage de BookTrip");
      return <BookTrip />;
    }

    console.log("⚠️ Aucune route trouvée, retour à Home");
    return <Home />; // Fallback
  };

  const contextValue: AppState = {
    currentClient,
    selectedAgency,
    setClient: setCurrentClient,
    setAgency: setSelectedAgency,
    resetBooking,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Layout>{renderPage()}</Layout>
    </AppContext.Provider>
  );
};

export default App;
