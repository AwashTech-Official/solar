import { NextRequest, NextResponse } from 'next/server';
import { supabase, SolutionInterest } from '@/src/lib/supabase';

interface ParsedSolarLeadSubmission {
  fullName: string;
  companyName: string;
  phone: string;
  email: string | null;
  businessType: string | null;
  industry: string | null;
  siteLocation: string;
  monthlyElectricityBillEtb: number;
  monthlyElectricityKwh: number | null;
  monthlyDieselLiters: number | null;
  solutionInterest: SolutionInterest;
  message: string | null;
}

/**
 * Extracts commercial solar lead submission fields from Jotform webhook payload formats
 */
function parseJotformSolarFields(payload: Record<string, any>): ParsedSolarLeadSubmission | null {
  let data: Record<string, any> = payload;
  if (payload.rawRequest) {
    try {
      const parsedRaw = typeof payload.rawRequest === 'string'
        ? JSON.parse(payload.rawRequest)
        : payload.rawRequest;
      data = { ...payload, ...parsedRaw };
    } catch (_e) {
      // Keep payload
    }
  }

  const findValue = (patterns: RegExp[]): any => {
    for (const key of Object.keys(data)) {
      for (const pattern of patterns) {
        if (pattern.test(key) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
          return data[key];
        }
      }
    }
    return null;
  };

  // Full Name
  let fullName = '';
  const rawName = findValue([
    /^q\d+_full[-_]?name$/i,
    /^q\d+_name$/i,
    /^full[-_]?name$/i,
    /^contact[-_]?name$/i,
    /^name$/i,
  ]);
  if (rawName) {
    if (typeof rawName === 'object') {
      const parts = [rawName.prefix, rawName.first, rawName.middle, rawName.last]
        .filter(Boolean)
        .map((s: string) => String(s).trim());
      if (parts.length > 0) fullName = parts.join(' ');
    } else if (typeof rawName === 'string') {
      fullName = rawName.trim();
    }
  }

  // Company Name
  let companyName = '';
  const rawCompany = findValue([
    /^q\d+_company[-_]?name$/i,
    /^company$/i,
    /^company[-_]?name$/i,
    /^organization$/i,
    /^facility$/i,
  ]);
  if (rawCompany && typeof rawCompany === 'string') {
    companyName = rawCompany.trim();
  }

  // Phone
  let phone = '';
  const rawPhone = findValue([
    /^q\d+_phone[-_]?number$/i,
    /^q\d+_phone$/i,
    /^phone[-_]?number$/i,
    /^phone$/i,
    /^mobile$/i,
    /^whatsapp$/i,
  ]);
  if (rawPhone) {
    if (typeof rawPhone === 'object') {
      if (rawPhone.full) {
        phone = String(rawPhone.full).trim();
      } else {
        const area = rawPhone.area || '';
        const num = rawPhone.phone || '';
        phone = area ? `(${area}) ${num}`.trim() : String(num).trim();
      }
    } else {
      phone = String(rawPhone).trim();
    }
  }

  // Email
  let email: string | null = null;
  const rawEmail = findValue([
    /^q\d+_email$/i,
    /^email$/i,
    /email[-_]?address/i,
  ]);
  if (rawEmail && typeof rawEmail === 'string' && rawEmail.includes('@')) {
    email = rawEmail.trim();
  }

  // Site Location
  let siteLocation = 'Addis Ababa / Regional Ethiopia';
  const rawLocation = findValue([
    /^q\d+_location$/i,
    /^q\d+_site[-_]?location$/i,
    /^location$/i,
    /^site[-_]?location$/i,
    /^city$/i,
    /^region$/i,
    /^address$/i,
  ]);
  if (rawLocation && typeof rawLocation === 'string' && rawLocation.trim().length > 0) {
    siteLocation = rawLocation.trim();
  }

  // Monthly Electricity Bill ETB
  let monthlyElectricityBillEtb = 0;
  const rawBill = findValue([
    /^q\d+_monthly[-_]?bill$/i,
    /^q\d+_electricity[-_]?bill$/i,
    /^monthly[-_]?bill$/i,
    /^electricity[-_]?bill$/i,
    /^bill$/i,
  ]);
  if (rawBill) {
    const parsed = parseFloat(String(rawBill).replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) {
      monthlyElectricityBillEtb = parsed;
    }
  }

  // Monthly Electricity kWh
  let monthlyElectricityKwh: number | null = null;
  const rawKwh = findValue([
    /^q\d+_kwh$/i,
    /^q\d+_monthly[-_]?kwh$/i,
    /^kwh$/i,
    /^monthly[-_]?kwh$/i,
  ]);
  if (rawKwh) {
    const parsed = parseFloat(String(rawKwh).replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) monthlyElectricityKwh = parsed;
  }

  // Monthly Diesel Liters
  let monthlyDieselLiters: number | null = null;
  const rawDiesel = findValue([
    /^q\d+_diesel$/i,
    /^q\d+_monthly[-_]?diesel$/i,
    /^diesel$/i,
    /^diesel[-_]?liters$/i,
  ]);
  if (rawDiesel) {
    const parsed = parseFloat(String(rawDiesel).replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) monthlyDieselLiters = parsed;
  }

  // Solution Interest
  let solutionInterest: SolutionInterest = 'not_sure';
  const rawSolution = findValue([
    /^q\d+_solution[-_]?interest$/i,
    /^q\d+_system[-_]?interest$/i,
    /^solution[-_]?interest$/i,
    /^system[-_]?interest$/i,
    /^system[-_]?type$/i,
  ]);
  if (rawSolution && typeof rawSolution === 'string') {
    const norm = rawSolution.toLowerCase();
    if (norm.includes('battery') || norm.includes('bess') || norm.includes('storage')) {
      solutionInterest = 'solar_battery';
    } else if (norm.includes('hybrid') || norm.includes('generator') || norm.includes('genset')) {
      solutionInterest = 'solar_generator_hybrid';
    } else if (norm.includes('grid') || norm.includes('rooftop')) {
      solutionInterest = 'grid_tied';
    } else {
      solutionInterest = 'not_sure';
    }
  }

  // Industry / Business Type
  let industry: string | null = null;
  const rawIndustry = findValue([
    /^q\d+_industry$/i,
    /^q\d+_business[-_]?type$/i,
    /^industry$/i,
    /^business[-_]?type$/i,
    /^sector$/i,
  ]);
  if (rawIndustry && typeof rawIndustry === 'string') {
    industry = rawIndustry.trim();
  }

  // Message
  let message: string | null = null;
  const rawMessage = findValue([
    /^q\d+_message$/i,
    /^q\d+_notes?$/i,
    /^message$/i,
    /^notes?$/i,
    /^details$/i,
  ]);
  if (rawMessage) {
    message = typeof rawMessage === 'object' ? JSON.stringify(rawMessage) : String(rawMessage).trim();
  }

  // Minimal validation
  if (!fullName && !phone && !companyName) {
    return null;
  }

  return {
    fullName: fullName || 'Commercial Inquirer',
    companyName: companyName || 'Commercial Facility',
    phone: phone || 'N/A',
    email,
    businessType: industry,
    industry,
    siteLocation,
    monthlyElectricityBillEtb,
    monthlyElectricityKwh,
    monthlyDieselLiters,
    solutionInterest,
    message,
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Shared secret verification if configured
    const configuredSecret = process.env.JOTFORM_WEBHOOK_SECRET;
    if (configuredSecret) {
      const headerSecret = req.headers.get('x-webhook-secret');
      const urlSecret = req.nextUrl.searchParams.get('secret');
      if (headerSecret !== configuredSecret && urlSecret !== configuredSecret) {
        return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret' }, { status: 401 });
      }
    }

    // 2. Body payload size check (max 2MB)
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
    }

    let rawBody: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          rawBody[key] = value;
        }
      } catch (err) {
        console.warn('FormData parse error, attempting JSON fallback');
      }
    } else {
      try {
        rawBody = await req.json();
      } catch (_e) {
        try {
          const text = await req.text();
          rawBody = JSON.parse(text);
        } catch (_err) {
          rawBody = {};
        }
      }
    }

    const parsed = parseJotformSolarFields(rawBody);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid or empty submission payload. Missing contact name or phone.' },
        { status: 400 }
      );
    }

    // Benchmark preliminary annual savings (55% offset)
    const estimatedAnnualSavingsEtb = parsed.monthlyElectricityBillEtb > 0
      ? parsed.monthlyElectricityBillEtb * 12 * 0.55
      : null;

    const leadRecord = {
      full_name: parsed.fullName,
      company_name: parsed.companyName,
      email: parsed.email,
      phone: parsed.phone,
      business_type: parsed.businessType,
      industry: parsed.industry,
      site_location: parsed.siteLocation,
      monthly_electricity_bill_etb: parsed.monthlyElectricityBillEtb,
      monthly_electricity_kwh: parsed.monthlyElectricityKwh,
      monthly_diesel_liters: parsed.monthlyDieselLiters,
      solution_interest: parsed.solutionInterest,
      message: parsed.message || 'Commercial solar inquiry received via Jotform webhook.',
      source: 'jotform' as const,
      status: 'new' as const,
      estimated_annual_savings_etb: estimatedAnnualSavingsEtb,
      roi_inputs: {
        monthlyBill: parsed.monthlyElectricityBillEtb,
        monthlyKwh: parsed.monthlyElectricityKwh,
        monthlyDieselLiters: parsed.monthlyDieselLiters,
        importedVia: 'jotform_webhook',
      },
    };

    if (supabase) {
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert([leadRecord])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error for Jotform lead:', insertError.message);
        return NextResponse.json(
          { success: false, error: 'Database record creation failed' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          leadId: newLead?.id,
          source: 'jotform',
          status: 'new',
        },
        { status: 200 }
      );
    }

    // Standalone / preview mode simulation
    return NextResponse.json(
      {
        success: true,
        type: 'lead_simulated',
        data: {
          company: parsed.companyName,
          solutionInterest: parsed.solutionInterest,
          billEtb: parsed.monthlyElectricityBillEtb,
        },
        note: 'Processed successfully in preview mode. Configure NEXT_PUBLIC_SUPABASE_URL for persistent storage.',
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Jotform webhook unexpected error:', err?.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing webhook' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse('ok', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-webhook-secret',
    },
  });
}
