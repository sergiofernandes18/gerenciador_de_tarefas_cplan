import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { generateExcelReport, generatePDFReport, generateWordReport } from '../utils/reportGenerators';
import { FileSpreadsheet, FileText, File } from 'lucide-react';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';
type ReportFormat = 'excel' | 'word' | 'pdf';

export function ReportGenerator() {
  const { tasks } = useTaskStore();
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [format, setFormat] = useState<ReportFormat>('excel');

  const handleGenerateReport = () => {
    switch (format) {
      case 'excel':
        generateExcelReport(tasks, period);
        break;
      case 'word':
        generateWordReport(tasks, period);
        break;
      case 'pdf':
        generatePDFReport(tasks, period);
        break;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Generate Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('excel')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                format === 'excel'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
            <button
              onClick={() => setFormat('word')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                format === 'word'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileText size={16} />
              Word
            </button>
            <button
              onClick={() => setFormat('pdf')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                format === 'pdf'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <File size={16} />
              PDF
            </button>
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleGenerateReport}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}