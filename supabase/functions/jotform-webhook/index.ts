// Supabase Edge Function: jotform-webhook
// Maps incoming commercial solar lead submissions into the leads table with source: 'jotform'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

interface ParsedSolarSubmission {
  fullName: string;
  companyName: string;
  phone: string;
  email: string | null;
  industry: string | null;
  siteLocation: string;
  monthlyElectricityBillEtb: number;
  monthlyElectricityKwh: number | null;
  monthlyDieselLiters: number | null;
  solutionInterest: 'grid_tied' | 'solar_battery' | 'solar_generator_hybrid' | 'not_sure';
  message: string | null;
}

function parseJotformSolarFields(payload: Record<string, any>): ParsedSolarSubmission | null {
  let data: Record<string, any> = payload;
  if (payload.rawRequest) {
    try {
      const parsedRaw = typeof payload.rawRequest === "string"
        ? JSON.parse(payload.rawRequest)
        : payload.rawRequest;
      data = { ...payload, ...parsedRaw };
    } catch (_e) {
      // Keep payload as is
    }
  }

  const findValue = (patterns: RegExp[]): any => {
    for (const key of Object.keys(data)) {
      for (const pattern of patterns) {
        if (pattern.test(key) && data[key] !== undefined && data[key] !== null && data[key] !== "") {
          return data[key];
        }
      }
    }
    return null;
  };

  let fullName = "";
  const rawName = findValue([
    /^q\d+_full[-_]?name$/i,
    /^q\d+_name$/i,
    /^full[-_]?name$/i,
    /^contact[-_]?name$/i,
    /^name$/i,
  ]);
  if (rawName) {
    if (typeof rawName === "object") {
      const parts = [rawName.prefix, rawName.first, rawName.middle, rawName.last]
        .filter(Boolean)
        .map((s: string) => String(s).trim());
      if (parts.length > 0) fullName = parts.join(" ");
    } else if (typeof rawName === "string") {
      fullName = rawName.trim();
    }
  }

  let companyName = "";
  const rawCompany = findValue([
    /^q\d+_company[-_]?name$/i,
    /^company$/i,
    /^company[-_]?name$/i,
    /^organization$/i,
  ]);
  if (rawCompany && typeof rawCompany === "string") {
    companyName = rawCompany.trim();
  }

  let phone = "";
  const rawPhone = findValue([
    /^q\d+_phone[-_]?number$/i,
    /^q\d+_phone$/i,
    /^phone[-_]?number$/i,
    /^phone$/i,
    /^mobile$/i,
  ]);
  if (rawPhone) {
    if (typeof rawPhone === "object") {
      if (rawPhone.full) {
        phone = String(rawPhone.full).trim();
      } else {
        const area = rawPhone.area || "";
        const num = rawPhone.phone || "";
        phone = area ? `(${area}) ${num}`.trim() : String(num).trim();
      }
    } else {
      phone = String(rawPhone).trim();
    }
  }

  let email: string | null = null;
  const rawEmail = findValue([
    /^q\d+_email$/i,
    /^email$/i,
  ]);
  if (rawEmail && typeof rawEmail === "string" && rawEmail.includes("@")) {
    email = rawEmail.trim();
  }

  let siteLocation = "Addis Ababa / Regional Ethiopia";
  const rawLocation = findValue([
    /^q\d+_location$/i,
    /^location$/i,
    /^site[-_]?location$/i,
    /^city$/i,
  ]);
  if (rawLocation && typeof rawLocation === "string") {
    siteLocation = rawLocation.trim();
  }

  let monthlyElectricityBillEtb = 0;
  const rawBill = findValue([
    /^q\d+_monthly[-_]?bill$/i,
    /^monthly[-_]?bill$/i,
    /^bill$/i,
  ]);
  if (rawBill) {
    const parsed = parseFloat(String(rawBill).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) monthlyElectricityBillEtb = parsed;
  }

  let monthlyElectricityKwh: number | null = null;
  const rawKwh = findValue([
    /^q\d+_kwh$/i,
    /^kwh$/i,
  ]);
  if (rawKwh) {
    const parsed = parseFloat(String(rawKwh).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) monthlyElectricityKwh = parsed;
  }

  let monthlyDieselLiters: number | null = null;
  const rawDiesel = findValue([
    /^q\d+_diesel$/i,
    /^diesel$/i,
  ]);
  if (rawDiesel) {
    const parsed = parseFloat(String(rawDiesel).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) monthlyDieselLiters = parsed;
  }

  let solutionInterest: 'grid_tied' | 'solar_battery' | 'solar_generator_hybrid' | 'not_sure' = "not_sure";
  const rawInterest = findValue([
    /^q\d+_solution[-_]?interest$/i,
    /^solution$/i,
    /^system$/i,
  ]);
  if (rawInterest && typeof rawInterest === "string") {
    const norm = rawInterest.toLowerCase();
    if (norm.includes("battery") || norm.includes("bess")) solutionInterest = "solar_battery";
    else if (norm.includes("generator") || norm.includes("hybrid")) solutionInterest = "solar_generator_hybrid";
    else if (norm.includes("grid")) solutionInterest = "grid_tied";
  }

  let industry: string | null = null;
  const rawIndustry = findValue([
    /^q\d+_industry$/i,
    /^industry$/i,
    /^business[-_]?type$/i,
  ]);
  if (rawIndustry && typeof rawIndustry === "string") {
    industry = rawIndustry.trim();
  }

  let message: string | null = null;
  const rawMessage = findValue([
    /^q\d+_message$/i,
    /^message$/i,
    /^notes?$/i,
  ]);
  if (rawMessage) {
    message = typeof rawMessage === "object" ? JSON.stringify(rawMessage) : String(rawMessage).trim();
  }

  if (!fullName && !phone && !companyName) return null;

  return {
    fullName: fullName || "Commercial Inquirer",
    companyName: companyName || "Commercial Facility",
    phone: phone || "N/A",
    email,
    industry,
    siteLocation,
    monthlyElectricityBillEtb,
    monthlyElectricityKwh,
    monthlyDieselLiters,
    solutionInterest,
    message,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get("JOTFORM_WEBHOOK_SECRET");
    if (secret) {
      const headerSecret = req.headers.get("x-webhook-secret");
      if (headerSecret !== secret) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let payload: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
    } else {
      payload = await req.json();
    }

    const parsed = parseJotformSolarFields(payload);
    if (!parsed) {
      return new Response(JSON.stringify({ error: "Missing required contact details" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase service environment variables not configured in Edge Function",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const estimatedAnnualSavingsEtb = parsed.monthlyElectricityBillEtb > 0
      ? parsed.monthlyElectricityBillEtb * 12 * 0.55
      : null;

    const { data: newLead, error: insertError } = await supabase
      .from("leads")
      .insert([
        {
          full_name: parsed.fullName,
          company_name: parsed.companyName,
          email: parsed.email,
          phone: parsed.phone,
          industry: parsed.industry,
          business_type: parsed.industry,
          site_location: parsed.siteLocation,
          monthly_electricity_bill_etb: parsed.monthlyElectricityBillEtb,
          monthly_electricity_kwh: parsed.monthlyElectricityKwh,
          monthly_diesel_liters: parsed.monthlyDieselLiters,
          solution_interest: parsed.solutionInterest,
          message: parsed.message || "Commercial solar inquiry via Jotform",
          source: "jotform",
          status: "new",
          estimated_annual_savings_etb: estimatedAnnualSavingsEtb,
          roi_inputs: {
            monthlyBill: parsed.monthlyElectricityBillEtb,
            importedVia: "jotform_edge_function",
          },
        },
      ])
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, leadId: newLead?.id, source: "jotform", status: "new" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Unexpected webhook failure" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
