import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  CalendarCheck, 
  Settings, 
  Plane,
  Menu,
  X
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

const Layout: React.FC = () => {
  const { isMockMode } = useAgency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { to: '/reservations', label: 'Reservations', icon: <CalendarCheck size={20} /> },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/notifications': return 'Notifications Center';
      case '/reservations': return 'Reservations Manager';
      default: return 'Agency App';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-slate-700 bg-slate-950">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Plane className="text-blue-400" />
            <span>Agency<span className="text-blue-400">Connect</span></span>
          </div>
        </div>

        <div className="p-4">
          <div className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider mb-6 flex items-center justify-center gap-2
            ${isMockMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}
          `}>
            {isMockMode ? (
               <><span>⚠️ Simulation Mode</span></>
            ) : (
               <><span>● Live Connected</span></>
            )}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                <Settings size={20} />
                <span className="font-medium">Settings</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
                <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-semibold text-slate-700">Admin Agent</span>
                    <span className="text-xs text-slate-500">Paris Office</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                     <img src="https://picsum.photos/100/100" alt="Avatar" className="h-full w-full object-cover" />
                </div>
            </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;