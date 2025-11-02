
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { MarginControl } from './components/MarginControl';
import { DataTable } from './components/DataTable';
import { DownloadIcon, TrashIcon } from './components/icons';

// Make PapaParse & SheetJS available globally for TypeScript
declare const Papa: any;
declare const XLSX: any;

interface CsvRow {
  [key: string]: any;
}

const App: React.FC = () => {
  const [originalData, setOriginalData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [profitMargin, setProfitMargin] = useState<number>(30);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const costColumnKey = useMemo(() => {
    if (headers.length === 0) return null;
    return headers.find(h => h.toLowerCase() === 'custo') || null;
  }, [headers]);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    resetState();
    setFile(selectedFile);
    setIsLoading(true);
    setError(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const fields = results.meta.fields as string[];

        if (!fields || fields.length === 0) {
          setError("CSV inválido ou vazio. Verifique se o arquivo tem um cabeçalho.");
          setIsLoading(false);
          return;
        }

        setHeaders(fields);
        setOriginalData(results.data);
        setIsLoading(false);
      },
      error: (err: any) => {
        setError(`Erro ao processar o arquivo: ${err.message}`);
        setIsLoading(false);
      }
    });
  };
  
  const resetState = () => {
    setOriginalData([]);
    setHeaders([]);
    setFile(null);
    setError(null);
  };
  
  const processedData = useMemo(() => {
    if (!costColumnKey || originalData.length === 0) return [];
    
    return originalData.map(row => {
      const costValue = row[costColumnKey];
      const cost = parseFloat(String(costValue).replace(',', '.'));
      
      let salesPrice: number | null = null;
      if (!isNaN(cost) && profitMargin < 100) {
        salesPrice = cost / (1 - (profitMargin / 100));
      }
      
      return {
        ...row,
        'Preço Venda': salesPrice
      };
    });
  }, [originalData, profitMargin, costColumnKey]);

  const handleDownloadXlsx = useCallback(() => {
    if (processedData.length === 0) return;

    const dataToExport = processedData.map(row => {
      const newRow = {...row};
      if (costColumnKey && newRow[costColumnKey]) {
        const cost = parseFloat(String(newRow[costColumnKey]).replace(',', '.'));
        if (!isNaN(cost)) newRow[costColumnKey] = cost;
      }
      if (newRow['Preço Venda']) {
         const price = newRow['Preço Venda'];
         if (typeof price === 'number') newRow['Preço Venda'] = price;
      }
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Format currency columns
    const currencyFormat = 'R$ #,##0.00';
    const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
    
    const costColIndex = headers.findIndex(h => h.toLowerCase() === 'custo');
    const priceColIndex = headers.length;

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      if (costColIndex !== -1) {
        const cell_address = XLSX.utils.encode_cell({c: costColIndex, r: R});
        if (worksheet[cell_address]) worksheet[cell_address].z = currencyFormat;
      }
      const price_cell_address = XLSX.utils.encode_cell({c: priceColIndex, r: R});
      if (worksheet[price_cell_address]) worksheet[price_cell_address].z = currencyFormat;
    }


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Preços Calculados');
    XLSX.writeFile(workbook, `precos_com_margem_${profitMargin}%.xlsx`);

  }, [processedData, profitMargin, costColumnKey, headers]);

  const displayHeaders = useMemo(() => {
    if (headers.length === 0) return [];
    return [...headers, 'Preço Venda'];
  }, [headers]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <aside className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-fit">
            <div className="space-y-6">
              <FileUpload onFileChange={handleFileChange} file={file} isLoading={isLoading} />
              {file && (
                <button
                  onClick={resetState}
                  className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                >
                  <TrashIcon />
                  Limpar Arquivo
                </button>
              )}
              {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
              {processedData.length > 0 && (
                <>
                  <MarginControl margin={profitMargin} setMargin={setProfitMargin} />
                  <button
                    onClick={handleDownloadXlsx}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    <DownloadIcon />
                    Exportar XLSX
                  </button>
                </>
              )}
            </div>
          </aside>
          
          {/* Data Table Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px]">
              {originalData.length > 0 ? (
                <DataTable headers={displayHeaders} data={processedData} costColumnKey={costColumnKey} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Aguardando seu arquivo CSV</h3>
                  <p className="mt-2 max-w-md">Importe um arquivo para começar a calcular os preços de venda. O app tentará encontrar uma coluna "custo" para os cálculos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;