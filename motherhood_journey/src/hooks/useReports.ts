import { useMutation } from '@tanstack/react-query';
import { generateReport, GenerateReportRequest, GenerateReportResponse } from '../lib/api/government';

// Toggle this to test without backend
const USE_MOCK_DATA = true;

const mockGenerateReport = async (request: GenerateReportRequest): Promise<GenerateReportResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    reportId: `RPT-${Date.now()}`,
    reportUrl: '/mock-reports/report.pdf',
    generatedAt: new Date().toISOString(),
  };
};

export const useGenerateReport = () => {
  return useMutation<GenerateReportResponse, Error, GenerateReportRequest>({
    mutationFn: USE_MOCK_DATA ? mockGenerateReport : generateReport,
    onSuccess: (data) => {
      console.log('Report generated successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to generate report:', error);
    },
  });
};
