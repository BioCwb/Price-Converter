
import React from 'react';
import { CalculatorIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
          <CalculatorIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Calculadora de Margem de Lucro</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Importe um CSV, ajuste a margem e exporte os resultados.</p>
        </div>
      </div>
    </header>
  );
};
