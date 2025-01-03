import React from 'react';
import {
  Utensils,
  XCircle,
  Activity,
  Pill,
  Timer,
  Heart,
  Leaf,
} from 'lucide-react';

interface AdviceSectionProps {
  advice: string;
}

export const AdviceSection = ({ advice }: AdviceSectionProps) => {
  const formatAdviceSection = (section: string, icon: React.ReactNode, bgColor: string) => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    return (
      <div className={`mt-4 p-6 rounded-xl ${bgColor} backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl`}>
        <div className="flex items-center gap-3 font-semibold text-gray-800 mb-4">
          {icon}
          <span className="text-lg">{lines[0].replace(':', '')}</span>
        </div>
        <ul className="space-y-3">
          {lines.slice(1).map((line, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <Leaf className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-base">{line.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const formatAdvice = (adviceText: string) => {
    if (!adviceText) return null;
    
    const sections = adviceText.split('\n\n');
    return sections.map((section, index) => {
      if (section.includes('الأطعمة الموصى بها')) {
        return formatAdviceSection(
          section, 
          <Utensils className="w-6 h-6 text-green-600" />,
          'bg-green-50/80'
        );
      }
      if (section.includes('الأطعمة التي يجب تجنبها')) {
        return formatAdviceSection(
          section, 
          <XCircle className="w-6 h-6 text-red-600" />,
          'bg-red-50/80'
        );
      }
      if (section.includes('توصيات نمط الحياة')) {
        return formatAdviceSection(
          section, 
          <Activity className="w-6 h-6 text-blue-600" />,
          'bg-blue-50/80'
        );
      }
      if (section.includes('المكملات الغذائية')) {
        return formatAdviceSection(
          section, 
          <Pill className="w-6 h-6 text-purple-600" />,
          'bg-purple-50/80'
        );
      }
      if (section.includes('التوقيت') || section.includes('متى')) {
        return formatAdviceSection(
          section,
          <Timer className="w-6 h-6 text-orange-600" />,
          'bg-orange-50/80'
        );
      }
      return (
        <div key={index} className="mt-4 p-6 bg-gray-50/80 rounded-xl backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-medical-600" />
            <span className="font-medium text-gray-800">نظرة عامة</span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {section.trim()}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {formatAdvice(advice)}
    </div>
  );
};