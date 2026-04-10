import React from 'react';
import { Plane, Globe, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.hash = '/'}>
              <Plane className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl tracking-tight text-slate-800">ALL AGENCY</span>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#/" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Accueil</a>
              <a href="#/register" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Voyageurs</a>
              <span className="h-4 w-[1px] bg-slate-300 mx-2"></span>
              <a href="#/register-agency" className="text-slate-900 hover:text-blue-800 font-semibold transition-colors">Espace Agence</a>
            </nav>
            <div className="md:hidden">
              <button className="text-slate-500 hover:text-slate-700">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-white font-bold text-lg">ALL AGENCY</span>
              </div>
              <p className="text-sm">
                La plateforme centrale reliant les voyageurs du monde entier aux meilleures agences locales via une architecture distribuée moderne.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Accès</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#/" className="hover:text-white">Accueil</a></li>
                <li><a href="#/register" className="hover:text-white">Espace Voyageur</a></li>
                <li><a href="#/register-agency" className="hover:text-white font-semibold text-blue-400">Devenir Partenaire (Agence)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Architecture</h3>
              <p className="text-sm mb-2">Système Event-Driven</p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">Webhooks</span>
                <span className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded">REST API</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs">
            &copy; {new Date().getFullYear()} All Agency Systems. Projet Académique.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;