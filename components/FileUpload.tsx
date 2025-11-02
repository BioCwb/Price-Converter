
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, file, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    onFileChange(selectedFile);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        onClick={handleAreaClick}
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isLoading ? (
            <>
              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Processando...</p>
            </>
          ) : file ? (
            <>
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Arquivo selecionado:</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{file.name}</p>
            </>
          ) : (
            <>
              <UploadIcon />
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Clique para enviar</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ou arraste e solte um arquivo .CSV</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileSelect}
        />
      </label>
    </div>
  );
};
