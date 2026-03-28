import { useState, useRef } from 'react';
import { uploadCSV } from '../services/api';

/**
 * FileUpload Component
 * Allows users to upload CSV files for bulk email classification
 */
const FileUpload = ({ onResults, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  /**
   * Handle file selection
   */
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      onError?.('Please upload a CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('File size must be less than 5MB');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const results = await uploadCSV(file);
      onResults?.(results.data);
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
      setFileName('');
    }
  };

  /**
   * Handle drag events
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card-gradient animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-30"></div>
          <div className="relative p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bulk Email Upload</h2>
          <p className="text-gray-500 mt-1">Upload a CSV file to classify multiple emails at once</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragging 
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50'
          }
          ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        {isLoading ? (
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 mx-auto spinner"></div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Processing {fileName}...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we classify your emails</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-indigo-100 scale-110' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isDragging ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs text-gray-500">Supports CSV files up to 5MB</span>
            </div>
          </div>
        )}
      </div>

      {/* CSV format info */}
      <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV Format
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Your CSV should have a column named <code className="px-2 py-0.5 bg-blue-100 rounded font-mono text-xs">text</code>, <code className="px-2 py-0.5 bg-blue-100 rounded font-mono text-xs">email</code>, <code className="px-2 py-0.5 bg-blue-100 rounded font-mono text-xs">content</code>, or <code className="px-2 py-0.5 bg-blue-100 rounded font-mono text-xs">body</code>
        </p>
        <div className="text-xs text-blue-600 font-mono bg-white/80 p-3 rounded-xl border border-blue-200">
          id,text,subject<br />
          1,"Urgent: Please review the invoice","Invoice Review"
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
