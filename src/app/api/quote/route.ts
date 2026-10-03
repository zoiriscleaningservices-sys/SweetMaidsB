import { NextRequest, NextResponse } from 'next/server';

const LEADCONNECTOR_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/1a10b6de-bddd-4c0b-9532-1fca30defaad';

const RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY || '6Lc0B90tAAAAAA74MsaeA9XpiFXWH4KxBKffKjwN';

// Known spam email addresses and signatures
const BLOCKED_EMAILS = [
  'christmaslightsupplier@gmail.com',
];

const DISPOSABLE_OR_SPAM_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'trashmail.com',
  'temp-mail.org',
  'burnermail.io',
  'throwawaymail.com',
];

function evaluateSpamFilters(data: {
  fullName: string;
  phone: string;
  email: string;
  websiteUrl?: string;
  notesVerification?: string;
  formTimestamp?: string;
}): { isSpam: boolean; reason: string } {
  const { fullName, phone, email, websiteUrl, notesVerification, formTimestamp } = data;

  // 1. Honeypot check: If either hidden honeypot field has any value, reject completely
  if (websiteUrl && websiteUrl.trim().length > 0) {
    return { isSpam: true, reason: `Honeypot website_url triggered: "${websiteUrl}"` };
  }
  if (notesVerification && notesVerification.trim().length > 0) {
    return { isSpam: true, reason: `Honeypot notes_verification triggered: "${notesVerification}"` };
  }

  // 2. Time check: Automated bots submit instantly; real humans take 4+ seconds
  if (formTimestamp) {
    const elapsed = Date.now() - parseInt(formTimestamp, 10);
    if (!isNaN(elapsed) && elapsed < 4000) {
      return { isSpam: true, reason: `Submission too fast (${elapsed}ms < 4000ms threshold)` };
    }
    if (!isNaN(elapsed) && elapsed > 86400000) {
      return { isSpam: true, reason: 'Stale form session timestamp (> 24h old)' };
    }
  }

  // 3. Email spam checks (blocked emails, domain keywords, and disposable providers)
  const lowerEmail = email.toLowerCase().trim();
  if (BLOCKED_EMAILS.includes(lowerEmail) || lowerEmail.includes('christmaslightsupplier')) {
    return { isSpam: true, reason: `Blocked spam email signature: "${lowerEmail}"` };
  }
  const emailDomain = lowerEmail.split('@')[1] || '';
  if (DISPOSABLE_OR_SPAM_DOMAINS.includes(emailDomain)) {
    return { isSpam: true, reason: `Disposable spam domain: "${emailDomain}"` };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(lowerEmail)) {
    return { isSpam: true, reason: `Malformed email format: "${lowerEmail}"` };
  }

  // 4. Phone number spam pattern check (555 numbers & repeated dummy digits)
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return { isSpam: true, reason: `Invalid phone digit count (${digits.length})` };
  }

  const usDigits = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (usDigits.length === 10) {
    const areaCode = usDigits.slice(0, 3);
    const exchange = usDigits.slice(3, 6);

    // Area code 555 is not a valid North American area code
    if (areaCode === '555') {
      return { isSpam: true, reason: `Invalid 555 area code: "${phone}"` };
    }
    // Fictional / non-working 555 exchange numbers (e.g. 555-0100 through 555-0199 or XXX-555-XXXX)
    if (exchange === '555') {
      return { isSpam: true, reason: `Fictional 555 exchange: "${phone}"` };
    }
  }

  // Common repeated digits (1111111111, 0000000000, 1234567890, etc.)
  const dummyPatterns = [
    '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
    '5555555555', '6666666666', '7777777777', '8888888888', '9999999999',
    '1234567890', '0123456789', '9876543210'
  ];
  if (dummyPatterns.some(pattern => digits.includes(pattern))) {
    return { isSpam: true, reason: `Dummy repeated digits in phone: "${phone}"` };
  }

  // 5. Name spam checks (URLs, HTML tags, BBCode, marketing bot spam)
  const lowerName = fullName.toLowerCase().trim();
  const urlPatterns = ['http://', 'https://', 'www.', '.com', '.net', '.org', '.ru', 't.me/', 'bit.ly/'];
  if (urlPatterns.some(p => lowerName.includes(p))) {
    return { isSpam: true, reason: `URL link in name field: "${fullName}"` };
  }
  const codePatterns = ['<a', '<script', '<iframe', 'href=', 'src=', '[url=', '[link='];
  if (codePatterns.some(p => lowerName.includes(p))) {
    return { isSpam: true, reason: `HTML/BBCode code injection in name field: "${fullName}"` };
  }
  const spamKeywords = [
    'seo ranking', 'seo service', 'crypto', 'bitcoin', 'backlink',
    'guest post', 'viagra', 'cialis', 'casino', 'whatsapp', 'telegram'
  ];
  if (spamKeywords.some(kw => lowerName.includes(kw))) {
    return { isSpam: true, reason: `Commercial spam keyword in name field: "${fullName}"` };
  }

  return { isSpam: false, reason: '' };
}

async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; score?: number }> {
  if (!token) {
    return { success: false };
  }
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      score: typeof data.score === 'number' ? data.score : undefined,
    };
  } catch (err) {
    console.error('Error verifying reCAPTCHA token:', err);
    // If Google verify endpoint fails, allow through to avoid false rejection
    return { success: true, score: 0.9 };
  }
}

export async function POST(request: NextRequest) {
  try {
    let service = '';
    let fullName = '';
    let phone = '';
    let email = '';
    let address = '';
    let smsConsent = false;
    let pageUrl = '';
    let websiteUrl = '';
    let notesVerification = '';
    let formTimestamp = '';
    let recaptchaToken = '';
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
      websiteUrl = (body.website_url || '').trim();
      notesVerification = (body.notes_verification || '').trim();
      formTimestamp = (body.form_timestamp || '').trim();
      recaptchaToken = (body.recaptcha_token || '').trim();
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
      websiteUrl = (formData.get('website_url')?.toString() || '').trim();
      notesVerification = (formData.get('notes_verification')?.toString() || '').trim();
      formTimestamp = (formData.get('form_timestamp')?.toString() || '').trim();
      recaptchaToken = (formData.get('recaptcha_token')?.toString() || '').trim();
    }

    if (!pageUrl) {
      pageUrl = request.headers.get('referer') || 'https://www.sweetmaidcleaning.com/';
    }

    // Required field validation
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

    // 1. Evaluate Server-Side Spam Protections (Honeypot, Timing, 555 numbers, blacklisted emails/names)
    const spamResult = evaluateSpamFilters({
      fullName,
      phone,
      email,
      websiteUrl,
      notesVerification,
      formTimestamp,
    });

    if (spamResult.isSpam) {
      console.warn(`[SPAM BLOCKED] ${spamResult.reason} | Name: "${fullName}" | Email: "${email}" | Phone: "${phone}"`);
      // Return a silent mock success so automated bots record success and do not retry
      if (isJson) {
        return NextResponse.json({
          success: true,
          message: 'Your quote request has been received.',
        });
      }
      const successUrl = new URL(pageUrl);
      successUrl.searchParams.set('quote_success', '1');
      successUrl.hash = 'quote';
      return NextResponse.redirect(successUrl.toString(), 303);
    }

    // 2. Google reCAPTCHA v3 verification
    if (recaptchaToken) {
      const captcha = await verifyRecaptchaToken(recaptchaToken);
      if (!captcha.success || (captcha.score !== undefined && captcha.score < 0.4)) {
        console.warn(`[SPAM BLOCKED: RECAPTCHA FAILED] Score: ${captcha.score} | Name: "${fullName}" | Email: "${email}"`);
        // Drop submission silently
        if (isJson) {
          return NextResponse.json({
            success: true,
            message: 'Your quote request has been received.',
          });
        }
        const successUrl = new URL(pageUrl);
        successUrl.searchParams.set('quote_success', '1');
        successUrl.hash = 'quote';
        return NextResponse.redirect(successUrl.toString(), 303);
      }
    }

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Human verified: construct payload for LeadConnector
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

    // Forward human submission to LeadConnector webhook
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
