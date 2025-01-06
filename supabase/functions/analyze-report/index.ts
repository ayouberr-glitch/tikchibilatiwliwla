import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Helper function to read an environment variable
function getEnvVar(key: string, defaultValue?: string): string {
    const value = Deno.env.get(key);
    if (value === undefined && defaultValue === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value !== undefined ? value : defaultValue!;
}

// Load environment variables (can also be done using .env files in Deno, but kept simple here)
const GEMINI_API_KEY = getEnvVar("GEMINI_API_KEY");
const GEMINI_MODEL = getEnvVar("GEMINI_MODEL", "gemini-1.5-flash"); // Fallback if no env var provided

const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Consider changing this in production to specific origins
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse JSON from request body (with basic input validation)
    let requestBody;
    try {
      requestBody = await req.json();
      if (!requestBody || typeof requestBody !== 'object') {
          throw new Error("Invalid request body format. Must be JSON");
      }
    } catch (e) {
        console.error("Error parsing JSON:", e);
        return new Response(
            JSON.stringify({ success: false, error: "Invalid JSON body" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }


    const { image, imageType, age, sex, language } = requestBody;
    
    // Input Validation
    if (!image || typeof image !== "string") {
       return new Response(
         JSON.stringify({ success: false, error: 'Image data is required and must be a string' }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
    if (!imageType || typeof imageType !== "string") {
        return new Response(
            JSON.stringify({ success: false, error: 'ImageType is required and must be a string' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
      }
      if (!age || typeof age !== "number" || age <= 0 ) {
        return new Response(
            JSON.stringify({ success: false, error: 'Age is required and must be a positive number' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    if (!sex || (sex !== "male" && sex !== "female")) {
        return new Response(
            JSON.stringify({ success: false, error: 'Sex is required and must be "male" or "female"' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
     if (!language || typeof language !== "string") {
        return new Response(
            JSON.stringify({ success: false, error: 'Language is required and must be a string' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

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
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: imageType,
                data: image,
              },
            },
          ],
        },
      ],
    };

      console.log("Sending request to Gemini API...");
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error response:", {
          status: response.status,
          headers: response.headers,
          body: errorText,
        });
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Gemini API response received");
      

    // Safely access the text content from the response
    const analysisText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
      if(!analysisText) {
          throw new Error("Gemini API response did not contain the expected text");
      }
    // Parse the response into structured data
    const testResults = [];
    const testBlocks = analysisText.split('\n\n').filter(Boolean); // filter empty
    
    for (const block of testBlocks) {
        const nameMatch = block.match(/^Test Name:\s*(?<name>[^\n]*)/m);
        const valueMatch = block.match(/^Value:\s*(?<value>[^\n]*)/m);
        const rangeMatch = block.match(/^Reference Range:\s*(?<range>[^\n]*)/m);
        const statusMatch = block.match(/^Status:\s*(?<status>[^\n]*)/m);
        const adviceMatch = block.match(/^Advice:\s*(?<advice>(.|\n)*)$/m); // Allows multiline advice

        const currentResult = {
            name: nameMatch?.groups?.name?.trim() || "Unknown Name",
            value: valueMatch?.groups?.value?.trim() || "Unknown Value",
            range: rangeMatch?.groups?.range?.trim() || "Unknown Range",
            status: statusMatch?.groups?.status?.trim() || "Unknown Status",
            advice: adviceMatch?.groups?.advice?.trim() || "No advice provided",
        };

      testResults.push(currentResult);
    }
    

      console.log("Parsed test results:", testResults);

    return new Response(
      JSON.stringify({ success: true, results: testResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-report function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        errorDetails: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
