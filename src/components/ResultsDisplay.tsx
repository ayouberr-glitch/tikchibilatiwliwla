import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TestResultCard } from './test-results/TestResultCard';


// Define types for WHO ranges and test results
interface WHORange {
    min: number;
    max: number;
    units: string;
}
interface TestResult {
    name: string;
    value: string;
    range?: string;
    status: string;
    advice?: string;
}
interface ResultsDisplayProps {
  results: TestResult[];
  loading?: boolean;
  error?: string;
}
// WHO reference ranges for common blood tests
// Can be moved to a separate config or fetched from server.
const WHO_RANGES: { [key: string]: WHORange } = {
    'Hemoglobin': { min: 13.0, max: 17.0, units: 'g/dL' },
  'White Blood Cells': { min: 4.0, max: 11.0, units: 'x 10^9/L' },
  'Platelets': { min: 150, max: 450, units: 'x 10^9/L' },
  'Glucose': { min: 70, max: 100, units: 'mg/dL' },
  'Cholesterol': { min: 0, max: 200, units: 'mg/dL' },
    'HDL': { min: 40, max: Infinity, units: 'mg/dL' },
     'LDL': { min: 0, max: 100, units: 'mg/dL' },
    'Triglycerides': { min: 0, max: 150, units: 'mg/dL' },
    'Creatinine': { min: 0.7, max: 1.3, units: 'mg/dL' },
    'ALT': { min: 7, max: 56, units: 'U/L' },
    'AST': { min: 10, max: 40, units: 'U/L' },
    'Total Protein': { min: 6.0, max: 8.3, units: 'g/dL' },
    'Albumin': { min: 3.5, max: 5.5, units: 'g/dL' },
    'Total Bilirubin': { min: 0.3, max: 1.2, units: 'mg/dL' },
    'Alkaline Phosphatase': { min: 44, max: 147, units: 'U/L' },
    'Urea': { min: 7, max: 20, units: 'mg/dL' },
    'Uric Acid': { min: 2.6, max: 7.2, units: 'mg/dL' },
    'Calcium': { min: 8.6, max: 10.3, units: 'mg/dL' },
    'Phosphorus': { min: 2.5, max: 4.5, units: 'mg/dL' },
    'Magnesium': { min: 1.7, max: 2.2, units: 'mg/dL' },
    'Iron': { min: 50, max: 175, units: 'μg/dL' },
    'Ferritin': { min: 10, max: 250, units: 'ng/mL' },
    'Vitamin B12': { min: 200, max: 900, units: 'pg/mL' },
    'Vitamin D': { min: 20, max: 50, units: 'ng/mL' },
    'TSH': { min: 0.4, max: 4.0, units: 'mIU/L' },
    'T3': { min: 80, max: 200, units: 'ng/dL' },
    'T4': { min: 5.0, max: 12.0, units: 'μg/dL' }
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading, error }) => {

  if (loading) {
    return (
      <div className="text-center mt-6">Loading results...</div>
    );
  }

  if (error) {
      return (
          <Alert variant="destructive" className="max-w-3xl mx-auto mt-6">
              <AlertTitle>خطأ في تحميل النتائج</AlertTitle>
              <AlertDescription>
                  {error} يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة.
              </AlertDescription>
          </Alert>
      );
    }


    if (!results || results.length === 0) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto mt-6">
        <AlertTitle>خطأ في تحميل النتائج</AlertTitle>
        <AlertDescription>
          لم يتم العثور على نتائج الفحص. يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة.
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn p-6 sm:p-8">
      {results.map((result, index) => (
        <TestResultCard
          key={index}
          name={result.name}
          value={result.value}
          range={result.range}
          status={result.status}
          advice={result.advice}
          whoRange={WHO_RANGES[result.name] ? `${WHO_RANGES[result.name].min}-${WHO_RANGES[result.name].max} ${WHO_RANGES[result.name].units}` : undefined}
        />
      ))}
    </div>
  );
};
