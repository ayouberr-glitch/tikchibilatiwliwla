import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const { image, imageType, age, sex, language } = await req.json();

    console.log("Processing request for:", { age, sex, language, imageType });

    const prompt = `قم بتحليل تقرير فحص الدم هذا لمريض ${sex === 'male' ? 'ذكر' : 'أنثى'} عمره ${age} سنة. لكل نتيجة فحص، قدم التحليل باللغة العربية:

    1. استخرج اسم الفحص باللغة الإنجليزية
    2. استخرج القيمة العددية الدقيقة مع وحداتها
    3. استخرج النطاق المرجعي مع الوحدات
    4. قارن القيمة بالنطاق المرجعي وصنفها باللغة العربية كالتالي:
       - "ضمن المعدل الطبيعي" إذا كانت ضمن النطاق
       - "خارج المعدل الطبيعي - بشكل طفيف" إذا كانت خارج النطاق قليلاً
       - "خارج المعدل الطبيعي - بشكل كبير" إذا كانت خارج النطاق بشكل ملحوظ
    5. قدم نصائح مفصلة باللغة العربية تتضمن:
       - شرح موجز عن ماهية هذا الفحص وأهميته
       
       الأطعمة الموصى بها:
       - قائمة من 4-6 أطعمة محددة مع الكميات الدقيقة
       - تضمين المحتوى الغذائي لكل طعام
       - شرح فوائد كل طعام
       
       الأطعمة التي يجب تجنبها:
       - قائمة بالأطعمة التي قد تؤثر سلباً على المستويات
       - شرح سبب تجنب كل طعام
       - توقيت تناول الطعام إذا كان ذلك مهماً
       
       توصيات نمط الحياة:
       - توصيات محددة للتمارين مع المدة والتكرار
       - توصيات النوم
       - تقنيات إدارة التوتر إذا كانت ذات صلة
       - عوامل نمط الحياة الأخرى التي قد تؤثر على المستويات
       
       المكملات الغذائية إذا لزم الأمر:
       - مكملات محددة مع الجرعة
       - أفضل وقت لتناولها
       - التفاعلات المحتملة التي يجب مراقبتها
       - مدة تناول المكملات إذا كان ذلك مناسباً
    
    نسق كل نتيجة بالضبط كما يلي:
    Test Name: [الاسم بالإنجليزية]
    Value: [القيمة العددية مع الوحدات]
    Reference Range: [النطاق المرجعي مع الوحدات]
    Status: [الحالة بالعربية]
    Advice: [النصيحة المفصلة بالعربية حسب الهيكل أعلاه]`;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: imageType,
              data: image
            }
          }
        ]
      }]
    };

    console.log("Sending request to Gemini API...");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("Gemini API response received");

    const analysisText = result.candidates[0].content.parts[0].text;
    
    // Parse the response into structured data
    const testResults = [];
    const testBlocks = analysisText.split('\n\n');
    
    let currentResult = {};
    for (const block of testBlocks) {
      const lines = block.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('Test Name: ')) {
          if (Object.keys(currentResult).length > 0) {
            testResults.push(currentResult);
            currentResult = {};
          }
          currentResult.name = line.replace('Test Name: ', '').trim();
        } else if (line.startsWith('Value: ')) {
          currentResult.value = line.replace('Value: ', '').trim();
        } else if (line.startsWith('Reference Range: ')) {
          currentResult.range = line.replace('Reference Range: ', '').trim();
        } else if (line.startsWith('Status: ')) {
          currentResult.status = line.replace('Status: ', '').trim();
        } else if (line.startsWith('Advice: ')) {
          currentResult.advice = line.replace('Advice: ', '').trim();
        } else if (currentResult.advice) {
          currentResult.advice += '\n' + line;
        }
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      testResults.push(currentResult);
    }

    console.log("Parsed test results:", testResults);

    return new Response(
      JSON.stringify({ success: true, results: testResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-report function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorDetails: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});