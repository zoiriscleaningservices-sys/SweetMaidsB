import { NextRequest, NextResponse } from 'next/server';

const LEADCONNECTOR_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/1a10b6de-bddd-4c0b-9532-1fca30defaad';

export async function POST(request: NextRequest) {
  try {
    let service = '';
    let fullName = '';
    let phone = '';
    let email = '';
    let address = '';
    let smsConsent = false;
    let pageUrl = '';
    let isJson = false;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      isJson = true;
      const body = await request.json();
      service = (body.service || '').trim();
      fullName = (body.fullName || body.name || '').trim();
      phone = (body.phone || '').trim();
      email = (body.email || '').trim();
      address = (body.address || '').trim();
      smsConsent = Boolean(body.smsConsent);
      pageUrl = (body.pageUrl || '').trim();
    } else {
      // Form submission (application/x-www-form-urlencoded or multipart/form-data)
      const formData = await request.formData();
      service = (formData.get('service')?.toString() || '').trim();
      fullName = (formData.get('fullName')?.toString() || formData.get('name')?.toString() || '').trim();
      phone = (formData.get('phone')?.toString() || '').trim();
      email = (formData.get('email')?.toString() || '').trim();
      address = (formData.get('address')?.toString() || '').trim();
      const consentVal = formData.get('smsConsent');
      smsConsent = consentVal === 'on' || consentVal === 'true' || consentVal === '1';
      pageUrl = (formData.get('pageUrl')?.toString() || '').trim();
    }

    if (!pageUrl) {
      pageUrl = request.headers.get('referer') || 'https://www.sweetmaidcleaning.com/';
    }

    // Basic validation
    if (!fullName || !phone || !email) {
      if (isJson) {
        return NextResponse.json(
          { success: false, error: 'Full name, phone, and email are required.' },
          { status: 400 }
        );
      }
      const redirectUrl = new URL(pageUrl);
      redirectUrl.searchParams.set('quote_error', 'missing_fields');
      redirectUrl.hash = 'quote';
      return NextResponse.redirect(redirectUrl.toString(), 303);
    }

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      service: service || 'residential',
      fullName,
      name: fullName,
      firstName,
      lastName,
      phone,
      email,
      address,
      smsConsent,
      pageUrl,
      source: 'sweetmaid_website_quote_form',
      submittedAt: new Date().toISOString(),
    };

    // Forward to LeadConnector webhook
    const response = await fetch(LEADCONNECTOR_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('LeadConnector webhook error:', response.status, errText);
    }

    if (isJson) {
      return NextResponse.json({
        success: true,
        message: 'Your quote request has been received.',
      });
    }

    // Redirect on standard form submission
    const successUrl = new URL(pageUrl);
    successUrl.searchParams.set('quote_success', '1');
    successUrl.hash = 'quote';
    return NextResponse.redirect(successUrl.toString(), 303);
  } catch (error) {
    console.error('Error handling quote form submission:', error);

    const isJson = request.headers.get('content-type')?.includes('application/json');
    if (isJson) {
      return NextResponse.json(
        { success: false, error: 'Failed to submit quote request. Please try again or call us.' },
        { status: 500 }
      );
    }

    const referer = request.headers.get('referer') || 'https://www.sweetmaidcleaning.com/';
    const errorUrl = new URL(referer);
    errorUrl.searchParams.set('quote_error', 'server_error');
    errorUrl.hash = 'quote';
    return NextResponse.redirect(errorUrl.toString(), 303);
  }
}
