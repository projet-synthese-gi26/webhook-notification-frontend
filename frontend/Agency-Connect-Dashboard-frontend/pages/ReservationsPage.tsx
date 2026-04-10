import React, { useEffect, useState, useCallback } from 'react';
import { useAgency } from '../context/AgencyContext';
import { Reservation, DataSource } from '../types';
import { MapPin, Users, Calendar, Briefcase, Heart, Palmtree } from 'lucide-react';

const ReservationsPage: React.FC = () => {
  const { service } = useAgency();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = useCallback(async () => {
    try {
      const data = await service.getReservations();
      setReservations(data);
    } catch (error) {
      console.error(error);
    }
  }, [service]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'BUSINESS': return <Briefcase size={16} className="text-slate-500" />;
          case 'HONEYMOON': return <Heart size={16} className="text-rose-500" />;
          default: return <Palmtree size={16} className="text-emerald-500" />;
      }
  }

  return (
    <div className="space-y-6">
      <div>
           <h2 className="text-2xl font-bold text-slate-800">Confirmed Reservations</h2>
           <p className="text-slate-500">Bookings generated from processed notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
            
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{res.clientPrenom} {res.clientNom}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 font-mono">
                        ID: {res.id}
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    res.source === DataSource.SIMULATION 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                    {res.source}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4 flex-1">
                <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Destination</p>
                        <p className="font-medium">{res.destination}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-700">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Departure</p>
                            <p className="font-medium text-sm">{res.dateDepart}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Guests</p>
                            <p className="font-medium text-sm">{res.nombrePersonnes} Pax</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-50">
                    {getTypeIcon(res.typeVoyage)}
                    <span className="text-sm font-medium text-slate-600 capitalize">{res.typeVoyage.toLowerCase()} Trip</span>
                </div>
            </div>
          </div>
        ))}

        {reservations.length === 0 && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                 <Calendar size={48} className="mb-4 opacity-50" />
                 <p className="font-medium">No reservations found.</p>
                 <p className="text-sm">Process a notification to create one.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;