import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UserForm } from '@/components/UserForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ShareOptions } from '@/components/ShareOptions';
import { useToast } from '@/hooks/use-toast';
import { analyzeReport } from '@/utils/api';
import { generatePDF } from '@/utils/pdf';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    toast({
      title: "تم رفع الملف بنجاح",
      description: "يمكنك الآن المتابعة مع التحليل.",
    });
  };

  const handleFormSubmit = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "يرجى رفع تقرير طبي أولاً.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending analysis request...");
      const response = await analyzeReport({
        image: file,
        age: parseInt(formData.age),
        sex: formData.sex,
        language: formData.language,
      });
      console.log("Analysis response:", response);
      setResults(response);
      toast({
        title: "اكتمل التحليل",
        description: "نتائجك جاهزة للعرض.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "فشل التحليل",
        description: error.message || "يرجى المحاولة مرة أخرى لاحقاً.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('results-container');
      toast({
        title: "تم تحميل PDF",
        description: "تم حفظ تقريرك بصيغة PDF.",
      });
    } catch (error) {
      toast({
        title: "فشل التحميل",
        description: "يرجى المحاولة مرة أخرى لاحقاً.",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = () => {
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المشاركة إلى الحافظة.",
    });
  };

  const handleShareEmail = () => {
    toast({
      title: "المشاركة عبر البريد الإلكتروني",
      description: "جاري فتح تطبيق البريد الإلكتروني...",
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            تحليل التقرير الطبي
          </h1>
          <p className="text-lg text-gray-600">
            قم برفع تقريرك الطبي واحصل على رؤى فورية
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onFileSelect={handleFileSelect} />
          
          <div className="glass-card rounded-xl p-6">
            <UserForm onSubmit={handleFormSubmit} />
          </div>

          {isLoading && (
            <div className="text-center">
              <p className="text-lg">جاري تحليل تقريرك...</p>
            </div>
          )}

          {results && (
            <div id="results-container">
              <ResultsDisplay results={results} />
              <ShareOptions
                onDownloadPDF={handleDownloadPDF}
                onShareLink={handleShareLink}
                onShareEmail={handleShareEmail}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;