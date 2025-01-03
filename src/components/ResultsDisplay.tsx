import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TestResultCard } from './test-results/TestResultCard';

// WHO reference ranges for common blood tests
const WHO_RANGES: { [key: string]: string } = {
  'Hemoglobin': '13.0-17.0 g/dL (males), 12.0-15.0 g/dL (females)',
  'White Blood Cells': '4.0-11.0 × 10⁹/L',
  'Platelets': '150-450 × 10⁹/L',
  'Glucose': '70-100 mg/dL',
  'Cholesterol': '<200 mg/dL',
  'HDL': '>40 mg/dL (males), >50 mg/dL (females)',
  'LDL': '<100 mg/dL',
  'Triglycerides': '<150 mg/dL',
  'Creatinine': '0.7-1.3 mg/dL (males), 0.6-1.1 mg/dL (females)',
  'ALT': '7-56 U/L',
  'AST': '10-40 U/L',
  'Total Protein': '6.0-8.3 g/dL',
  'Albumin': '3.5-5.5 g/dL',
  'Total Bilirubin': '0.3-1.2 mg/dL',
  'Alkaline Phosphatase': '44-147 U/L',
  'Urea': '7-20 mg/dL',
  'Uric Acid': '3.5-7.2 mg/dL (males), 2.6-6.0 mg/dL (females)',
  'Calcium': '8.6-10.3 mg/dL',
  'Phosphorus': '2.5-4.5 mg/dL',
  'Magnesium': '1.7-2.2 mg/dL',
  'Iron': '65-175 μg/dL (males), 50-170 μg/dL (females)',
  'Ferritin': '20-250 ng/mL (males), 10-120 ng/mL (females)',
  'Vitamin B12': '200-900 pg/mL',
  'Vitamin D': '20-50 ng/mL',
  'TSH': '0.4-4.0 mIU/L',
  'T3': '80-200 ng/dL',
  'T4': '5.0-12.0 μg/dL'
};

interface TestResult {
  name: string;
  value: string;
  range: string;
  status: string;
  advice?: string;
}

interface ResultsDisplayProps {
  results: TestResult[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
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
    <div dir="rtl" className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn p-6">
      {results.map((result, index) => (
        <TestResultCard
          key={index}
          name={result.name}
          value={result.value}
          range={result.range}
          status={result.status}
          advice={result.advice}
          whoRange={WHO_RANGES[result.name]}
        />
      ))}
    </div>
  );
};