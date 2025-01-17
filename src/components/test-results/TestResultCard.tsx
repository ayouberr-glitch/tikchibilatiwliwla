import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { AdviceSection } from './AdviceSection';

interface TestResultCardProps {
  name: string;
  value: string;
  range?: string;
  status: string;
  advice?: string;
  whoRange?: string;
}

// i18n
const translation = {
  show_detailed_advice: 'عرض التوصيات المفصلة',
  not_available: 'غير متوفر',
    value_label: "Value:",
    reference_range_label: "Reference Range:"
};

const statusConfig = {
    "ضمن المعدل الطبيعي": {
        color: "bg-green-500 text-white",
        icon: <CheckCircle className="w-5 h-5" />,
      },
    "خارج المعدل الطبيعي - بشكل طفيف": {
      color: "bg-yellow-500 text-white",
        icon: <AlertTriangle className="w-5 h-5" />,
    },
    "خارج المعدل الطبيعي - بشكل كبير": {
        color: "bg-red-500 text-white",
        icon: <AlertCircle className="w-5 h-5" />,
    }
}

export const TestResultCard = ({ name, value, range, status, advice, whoRange }: TestResultCardProps) => {
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  
  const currentStatusConfig = statusConfig[status] || statusConfig["خارج المعدل الطبيعي - بشكل كبير"];

  const displayRange = range || whoRange || translation.not_available;
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
            {!range && whoRange && (
              <span className="text-xs text-gray-500">(WHO reference)</span>
            )}
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${currentStatusConfig.color}`}>
            {currentStatusConfig.icon}
            <span>{status}</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{translation.value_label}</span>
            <span className="font-medium text-xl text-medical-700">{value}</span>
          </div>
          <Separator orientation="vertical" className="hidden md:block h-6" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{translation.reference_range_label}</span>
            <span className="text-gray-600">{displayRange}</span>
          </div>
        </div>
        
        {advice && (
          <Collapsible
            open={isAdviceOpen}
            onOpenChange={setIsAdviceOpen}
          >
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 rounded-lg bg-medical-50 hover:bg-medical-100 transition-colors">
              {isAdviceOpen ? 
                <ChevronDown className="w-5 h-5 text-medical-600" /> : 
                <ChevronRight className="w-5 h-5 text-medical-600" />
              }
              <span className="text-sm font-medium text-medical-700">
                {translation.show_detailed_advice}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <AdviceSection advice={advice} />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </Card>
  );
};
