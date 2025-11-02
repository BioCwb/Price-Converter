
import React from 'react';

interface MarginControlProps {
  margin: number;
  setMargin: (margin: number) => void;
}

export const MarginControl: React.FC<MarginControlProps> = ({ margin, setMargin }) => {
  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    if (value >= 0 && value < 100) {
      setMargin(value);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="margin-range" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Margem de Lucro
      </label>
      <div className="flex items-center gap-4">
        <input
          id="margin-range"
          type="range"
          min="0"
          max="99.9"
          step="0.1"
          value={margin}
          onChange={handleMarginChange}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="relative">
          <input
            type="number"
            min="0"
            max="99.9"
            step="0.1"
            value={margin}
            onChange={handleMarginChange}
            className="w-20 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400 text-sm">%</span>
        </div>
      </div>
    </div>
  );
};
