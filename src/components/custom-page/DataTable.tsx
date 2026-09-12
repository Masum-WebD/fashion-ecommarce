"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({ tableData }: { tableData: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Extract headers and rows based on data structure
  const { headers, rows } = useMemo(() => {
    let extractedHeaders: string[] = [];
    let extractedRows: string[][] = [];

    if (Array.isArray(tableData) && tableData.length > 0) {
      extractedHeaders = tableData[0];
      extractedRows = tableData.slice(1);
    } else if (tableData && tableData.headers && tableData.rows) {
      extractedHeaders = tableData.headers;
      extractedRows = tableData.rows;
    }

    return { headers: extractedHeaders, rows: extractedRows };
  }, [tableData]);

  // Filter rows based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return rows;
    const search = searchTerm.toLowerCase();
    return rows.filter((row) => 
      row.some((cell) => (cell || "").toString().toLowerCase().includes(search))
    );
  }, [rows, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, safeCurrentPage, rowsPerPage]);

  // Handle page changes
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (headers.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto my-8">
      {/* Top Bar with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            placeholder="Search in table..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredData.length > 0 ? (safeCurrentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(safeCurrentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-medium text-gray-900">{filteredData.length}</span> entries
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-[800px] w-full divide-y divide-gray-200 border-b border-gray-200">
          <thead className="bg-[#4a8a5f] text-white">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  scope="col" 
                  className={`px-4 py-4 text-base font-semibold tracking-wide border-b border-[#3b724f] ${index === 0 ? 'text-center w-16 whitespace-nowrap' : 'text-left'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="even:bg-green-50/50 odd:bg-white hover:bg-green-100/50 transition-colors"
                >
                  {row.map((cell, cellIndex) => {
                    const isPhoneNumber = /^(\+?880|0)1[3-9]\d{8}$/.test((cell || "").trim());
                    return (
                      <td 
                        key={cellIndex} 
                        className={`px-4 py-4 text-base text-gray-700 ${cellIndex === 0 ? 'text-center font-medium whitespace-nowrap' : 'text-left'}`}
                      >
                        {isPhoneNumber ? (
                          <a href={`tel:${cell.trim()}`} className="text-primary hover:text-primary-700 font-medium transition-colors">
                            {cell}
                          </a>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-300 mb-3" />
                    <p className="text-base font-medium text-gray-900">No matching data found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search term.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white px-4 py-2 border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={handlePrevPage}
              disabled={safeCurrentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={safeCurrentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{safeCurrentPage}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={safeCurrentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Simple page indicators (first, current, last) if many pages, otherwise show all */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  // Logic to show pages around current page
                  let pageNum = idx + 1;
                  if (totalPages > 5) {
                    if (safeCurrentPage > 3 && safeCurrentPage < totalPages - 1) {
                      pageNum = safeCurrentPage - 2 + idx;
                    } else if (safeCurrentPage >= totalPages - 1) {
                      pageNum = totalPages - 4 + idx;
                    }
                  }
                  
                  const isCurrent = pageNum === safeCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 transition-colors ${
                        isCurrent 
                          ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextPage}
                  disabled={safeCurrentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
