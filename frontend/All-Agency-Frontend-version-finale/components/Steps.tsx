import React from 'react';
import { User, Building2, CalendarCheck } from 'lucide-react';

interface StepsProps {
  currentStep: 1 | 2 | 3;
}

const Steps: React.FC<StepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Client', icon: User },
    { id: 2, name: 'Agence', icon: Building2 },
    { id: 3, name: 'Réservation', icon: CalendarCheck },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className={`flex flex-col items-center relative z-10`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : ''}
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-white border-slate-300 text-slate-400' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {step.name}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-32 h-1 mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;
