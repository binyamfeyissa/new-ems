import { useState, useRef } from 'react';
import { FiUpload, FiCheck, FiX, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

const BulkTicketImport = ({ eventId, ticketTypes, onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file) => {
    setIsUploading(true);
    setErrors([]);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);
        
        if (results.errors.length > 0) {
          setErrors(results.errors.map(err => ({
            row: err.row,
            message: err.message,
            code: err.code
          })));
          toast.error('There were errors parsing the CSV file');
          return;
        }
        
        // Validate required columns
        const requiredColumns = ['Full Name', 'Email', 'Phone Number', 'Ticket Count', 'Ticket Type'];
        const missingColumns = requiredColumns.filter(col => !results.meta.fields.includes(col));
        
        if (missingColumns.length > 0) {
          setErrors([{
            message: `Missing required columns: ${missingColumns.join(', ')}`,
            code: 'MISSING_COLUMNS'
          }]);
          toast.error('CSV file is missing required columns');
          return;
        }
        
        // Validate data
        const validationErrors = [];
        const validData = results.data.filter((row, index) => {
          // Check for empty required fields
          for (const col of requiredColumns) {
            if (!row[col] || row[col].trim() === '') {
              validationErrors.push({
                row: index + 1,
                message: `Missing value for ${col}`,
                code: 'MISSING_VALUE'
              });
              return false;
            }
          }
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(row['Email'])) {
            validationErrors.push({
              row: index + 1,
              message: `Invalid email format: ${row['Email']}`,
              code: 'INVALID_EMAIL'
            });
            return false;
          }
          
          // Validate ticket count is a positive integer
          const ticketCount = parseInt(row['Ticket Count']);
          if (isNaN(ticketCount) || ticketCount <= 0) {
            validationErrors.push({
              row: index + 1,
              message: `Invalid ticket count: ${row['Ticket Count']}`,
              code: 'INVALID_TICKET_COUNT'
            });
            return false;
          }
          
          // Validate ticket type exists
          const ticketTypeExists = ticketTypes.some(type => 
            type.name.toLowerCase() === row['Ticket Type'].toLowerCase()
          );
          
          if (!ticketTypeExists) {
            validationErrors.push({
              row: index + 1,
              message: `Invalid ticket type: ${row['Ticket Type']}`,
              code: 'INVALID_TICKET_TYPE'
            });
            return false;
          }
          
          return true;
        });
        
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          toast.error(`Found ${validationErrors.length} errors in the CSV data`);
        }
        
        setParsedData({
          validRows: validData,
          totalRows: results.data.length
        });
      },
      error: (error) => {
        setIsUploading(false);
        setErrors([{
          message: `Error parsing CSV: ${error.message}`,
          code: 'PARSE_ERROR'
        }]);
        toast.error('Failed to parse CSV file');
      }
    });
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.validRows.length === 0) {
      toast.error('No valid data to import');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call to import the tickets
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully imported ${parsedData.validRows.length} tickets`);
      onImportComplete(parsedData.validRows);
      
      // Reset form
      setFile(null);
      setParsedData(null);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to import tickets');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone Number', 'Ticket Count', 'Ticket Type'];
    const sampleData = [
      ['John Doe', 'john.doe@example.com', '+1234567890', '2', ticketTypes[0]?.name || 'VIP'],
      ['Jane Smith', 'jane.smith@example.com', '+0987654321', '1', ticketTypes[0]?.name || 'VIP']
    ];
    
    const csv = Papa.unparse({
      fields: headers,
      data: sampleData
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ticket_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Bulk Ticket Import</h2>
      
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload CSV File
            </label>
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
            >
              <FiDownload className="h-4 w-4 mr-1" />
              Download Template
            </button>
          </div>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">CSV file only</p>
            </div>
          </div>
          
          {file && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiCheck className="h-5 w-5 text-green-500 mr-1" />
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {isUploading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Preview */}
        {parsedData && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Valid rows: <span className="font-medium text-gray-700">{parsedData.validRows.length}</span> of {parsedData.totalRows}
                  </p>
                  {errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      Errors: {errors.length}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={isProcessing || parsedData.validRows.length === 0}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${
                    (isProcessing || parsedData.validRows.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUpload className="h-4 w-4 mr-2" />
                      Import {parsedData.validRows.length} Tickets
                    </>
                  )}
                </button>
              </div>
              
              {/* Data Preview Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {parsedData.validRows.length > 0 && Object.keys(parsedData.validRows[0]).map((header, index) => (
                        <th
                          key={index}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.validRows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.validRows.length > 5 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Showing 5 of {parsedData.validRows.length} rows
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Errors */}
        {errors.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Errors</h3>
            <div className="bg-red-50 p-4 rounded-md">
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <FiAlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        {error.row !== undefined && (
                          <span className="font-medium">Row {error.row}: </span>
                        )}
                        <span>{error.message}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkTicketImport;