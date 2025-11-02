
import React from 'react';

interface DataTableProps {
  headers: string[];
  data: { [key: string]: any }[];
  costColumnKey: string | null;
}

const formatCurrency = (value: any) => {
  const number = parseFloat(String(value).replace(',', '.'));
  if (isNaN(number)) {
    return 'N/A';
  }
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const DataTable: React.FC<DataTableProps> = ({ headers, data, costColumnKey }) => {
  return (
    <div className="overflow-x-auto relative rounded-lg">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="py-3 px-6 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/30 transition-colors">
              {headers.map((header) => {
                 const isCostColumn = costColumnKey && header.toLowerCase() === costColumnKey.toLowerCase();
                 const isSalesPriceColumn = header === 'Preço Venda';
                 const value = row[header];

                return (
                  <td key={`${rowIndex}-${header}`} className="py-4 px-6 whitespace-nowrap">
                    {isCostColumn || isSalesPriceColumn ? (
                      <span className={`font-medium ${isSalesPriceColumn ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {formatCurrency(value)}
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
