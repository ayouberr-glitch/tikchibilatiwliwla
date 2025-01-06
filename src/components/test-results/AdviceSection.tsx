import React from 'react';
import {
  Utensils,
  XCircle,
  Activity,
  Pill,
  Timer,
  Heart,
  Leaf,
  Info,
} from 'lucide-react';

interface AdviceSectionProps {
  advice: string;
    sectionConfig?: Record<string, {
        icon: React.ReactNode,
        bgColor: string
    }>;
}

interface AdviceContainerProps {
    children: React.ReactNode,
    icon: React.ReactNode,
    bgColor: string,
    title?: string
}

const AdviceContainer: React.FC<AdviceContainerProps> = ({ children, icon, bgColor, title }) => {
    return (
      <div className={`mt-4 p-6 rounded-xl ${bgColor} backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl`}>
        { title && <div className="flex items-center gap-3 font-semibold text-gray-800 mb-4">
          {icon}
          <span className="text-lg">{title}</span>
        </div>}
        <ul className="space-y-3">
          {children}
         </ul>
        </div>
    );
}

export const AdviceSection = ({ advice, sectionConfig }: AdviceSectionProps) => {
  
  // Default mapping for sections
  const defaultSectionConfig = {
    'الأطعمة الموصى بها': {
        icon: <Utensils className="w-6 h-6 text-green-600" />,
        bgColor: 'bg-green-50/80'
    },
    'الأطعمة التي يجب تجنبها': {
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        bgColor: 'bg-red-50/80'
    },
    'توصيات نمط الحياة': {
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50/80',
    },
    'المكملات الغذائية': {
      icon: <Pill className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50/80',
    },
    'التوقيت|متى': {
      icon: <Timer className="w-6 h-6 text-orange-600" />,
        bgColor: 'bg-orange-50/80',
    }
  }

    const config = sectionConfig || defaultSectionConfig;


  const formatAdviceSection = (section: string, configSection?: {
        icon: React.ReactNode,
        bgColor: string
    }) => {
      
    const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0 || !configSection) {
        return null
      }
    const title = lines[0].replace(':', '').trim()
      return (
        <AdviceContainer
            icon={configSection.icon}
            bgColor={configSection.bgColor}
            title={title}>
            {lines.slice(1).map((line, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                <Leaf className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-base">{line.trim()}</span>
              </li>
          ))}
        </AdviceContainer>
       );
    };
    
    const matchSection = (section: string) :  {
          icon: React.ReactNode,
          bgColor: string,
          title: string
      } | null => {
        for (const key in config) {
             const regex = new RegExp(key, 'i');
          if (regex.test(section)) {
                const title = section.split('\n')[0].replace(':', '').trim()
                return { ...config[key], title};
          }
        }
      return null;
    }
  

  const formatAdvice = (adviceText: string) => {
      if (!adviceText) {
        return <p>No advice available</p>;
    }

      const sections = adviceText.split('\n\n');

    return sections.map((section, index) => {
      const match = matchSection(section);

      if(match) {
         return formatAdviceSection(section, match);
      }

      return (
        <AdviceContainer key={index} icon={<Info className="w-6 h-6 text-medical-600" />} bgColor='bg-gray-50/80' title='نظرة عامة'>
            <p className="text-gray-700 leading-relaxed">
            {section.trim()}
          </p>
        </AdviceContainer>
    )
    })
  };


  return (
    <div className="space-y-6">
      {formatAdvice(advice)}
    </div>
  );
};
