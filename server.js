import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_EMAIL = process.env.NOTIFICATION_EMAIL || 'KeshavKaushikExports@gmail.com';

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Explicitly serve images folder and root assets
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'htm']
}));

// Video streaming endpoint with Accept-Ranges for mobile and desktop Safari/Chrome
app.get(['/images/mk.mp4', '/mk.mp4'], (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'images', 'mk.mp4'),
    path.join(__dirname, 'public', 'images', 'mk.mp4'),
    path.join(__dirname, 'public', 'mk.mp4'),
    path.join(__dirname, 'mk.mp4')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.sendFile(p);
    }
  }
  res.status(404).send('Video not found');
});

// Helper to save enquiry locally so records are never lost
function saveEnquiryLocally(data) {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'enquiries.json');
    let list = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        list = JSON.parse(raw);
      } catch (e) {
        list = [];
      }
    }
    list.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data
    });
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error archiving enquiry to file:', err);
  }
}

// Helper to dispatch email notification
async function dispatchEmail(enquiry) {
  const {
    fullName,
    companyName,
    email,
    phone,
    inquiry,
    grade,
    port,
    message,
    sourcePage
  } = enquiry;

  const subject = `[Makhanam RFQ Enquiry] ${companyName ? `${companyName} - ` : ''}${fullName || 'New Lead'} (${grade || 'General'})`;
  
  const textBody = `
========================================
NEW MAKHANAM B2B RFQ / INQUIRY RECEIVED
========================================

Contact Person: ${fullName || 'N/A'}
Company / Brand: ${companyName || 'N/A'}
Email Address: ${email || 'N/A'}
Phone / WhatsApp: ${phone || 'N/A'}
Inquiry Type: ${inquiry || 'N/A'}
Preferred Suta Grade: ${grade || 'N/A'}
Destination Port: ${port || 'N/A'}
Source Page: ${sourcePage || 'Website'}
Received At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)

----------------------------------------
Message / Requirements / Volume:
----------------------------------------
${message || 'No additional message provided.'}

========================================
Target Forwarding: ${TARGET_EMAIL}
========================================
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #17110D; color: #F5ECDC; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #241C17; border: 1px solid rgba(201, 169, 97, 0.35); border-radius: 12px; overflow: hidden; }
    .header { background-color: #120D0A; padding: 24px; border-bottom: 1px solid rgba(201, 169, 97, 0.25); text-align: center; }
    .brand { font-size: 22px; font-weight: 700; color: #FCF9F2; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
    .subtitle { font-size: 10px; color: #C9A961; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(201, 169, 97, 0.15); border: 1px solid rgba(201, 169, 97, 0.4); border-radius: 999px; color: #E8CD84; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 14px; }
    .body { padding: 24px; font-size: 14px; line-height: 1.6; }
    .field-row { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(201, 169, 97, 0.12); }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #C9A961; font-weight: 600; margin-bottom: 2px; }
    .field-value { font-size: 15px; color: #FCF9F2; font-weight: 500; word-break: break-word; }
    .message-box { background: #17110D; border: 1px solid rgba(201, 169, 97, 0.2); border-radius: 8px; padding: 16px; margin-top: 16px; }
    .footer { background-color: #120D0A; padding: 16px 24px; text-align: center; font-size: 11px; color: rgba(245, 236, 220, 0.6); border-top: 1px solid rgba(201, 169, 97, 0.15); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="brand">MAKHANAM</h1>
      <div class="subtitle">Wholesale &amp; Export Desk</div>
      <div class="badge">New B2B RFQ Enquiry</div>
    </div>
    <div class="body">
      <div class="field-row">
        <div class="field-label">Contact Person</div>
        <div class="field-value">${fullName || 'N/A'}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Company / Organization</div>
        <div class="field-value">${companyName || 'N/A'}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${email}" style="color: #E8CD84; text-decoration: none;">${email || 'N/A'}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Phone / WhatsApp</div>
        <div class="field-value"><a href="tel:${phone}" style="color: #E8CD84; text-decoration: none;">${phone || 'N/A'}</a></div>
      </div>
      ${inquiry ? `
      <div class="field-row">
        <div class="field-label">Inquiry Type</div>
        <div class="field-value">${inquiry}</div>
      </div>` : ''}
      ${grade ? `
      <div class="field-row">
        <div class="field-label">Preferred Suta Grade</div>
        <div class="field-value" style="color: #E8CD84; font-weight: 700;">${grade}</div>
      </div>` : ''}
      ${port ? `
      <div class="field-row">
        <div class="field-label">Destination Port / Delivery Location</div>
        <div class="field-value">${port}</div>
      </div>` : ''}
      <div class="message-box">
        <div class="field-label">Message / Volume Requirement</div>
        <div class="field-value" style="white-space: pre-wrap; margin-top: 6px; font-size: 14px;">${message || 'No additional notes'}</div>
      </div>
    </div>
    <div class="footer">
      Makhanam B2B Export Portal • Mithila, Bihar<br>
      Direct Email: ${TARGET_EMAIL} • Phone: +91 83404 93639
    </div>
  </div>
</body>
</html>
  `.trim();

  let emailSent = false;

  // 1. Try direct SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Makhanam Web Desk" <${process.env.SMTP_USER}>`,
        to: TARGET_EMAIL,
        replyTo: email || undefined,
        subject,
        text: textBody,
        html: htmlBody
      });
      console.log(`[Email] Successfully sent via SMTP to ${TARGET_EMAIL}`);
      emailSent = true;
    } catch (smtpErr) {
      console.error('[Email] SMTP send failed:', smtpErr.message);
    }
  }

  // 2. Try FormSubmit public email relay directly to TARGET_EMAIL if SMTP is not active or failed
  if (!emailSent) {
    try {
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TARGET_EMAIL)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          'Contact Person': fullName,
          'Company': companyName,
          'Email': email,
          'Phone': phone,
          'Inquiry Type': inquiry,
          'Suta Grade': grade,
          'Destination Port': port,
          'Message': message,
          'Page': sourcePage
        })
      });

      if (formSubmitRes.ok) {
        const json = await formSubmitRes.json();
        console.log(`[Email] Dispatched to ${TARGET_EMAIL} via FormSubmit relay:`, json);
        emailSent = true;
      } else {
        console.warn(`[Email] Relay returned status ${formSubmitRes.status}`);
      }
    } catch (relayErr) {
      console.warn('[Email] Relay forwarding error:', relayErr.message);
    }
  }

  return emailSent;
}

// API endpoint for form submissions (contactus.html, SizeCaliperGuide.html, etc.)
app.post(['/api/contact', '/api/rfq', '/api/send-rfq'], async (req, res) => {
  try {
    const body = req.body || {};
    
    // Normalize field names across various form implementations
    const fullName = (body.fullName || body.name || body['Contact Person'] || body.contactName || '').trim();
    const companyName = (body.companyName || body.company || body.organization || '').trim();
    const email = (body.email || body.emailAddress || '').trim();
    const phone = (body.phone || body.telephone || body.whatsapp || '').trim();
    const inquiry = (body.inquiry || body.inquiryType || body.type || 'B2B Wholesale / Export RFQ').trim();
    const grade = (body.grade || body.sutaGrade || body.preferredGrade || '').trim();
    const port = (body.port || body.destinationPort || body.deliveryLocation || '').trim();
    const message = (body.message || body.details || body.volume || body.notes || '').trim();
    const sourcePage = (body.sourcePage || req.headers.referer || 'Website').trim();

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least an Email address or Phone/WhatsApp number so we can respond.'
      });
    }

    const enquiryRecord = {
      fullName,
      companyName,
      email,
      phone,
      inquiry,
      grade,
      port,
      message,
      sourcePage,
      ip: req.ip || req.headers['x-forwarded-for'] || 'local'
    };

    // Always archive locally
    saveEnquiryLocally(enquiryRecord);

    // Send email to KeshavKaushikExports@gmail.com
    await dispatchEmail(enquiryRecord);

    // Prepare mailto fallback link in response
    const mailtoSubject = encodeURIComponent(`[Makhanam RFQ] ${companyName ? `${companyName} - ` : ''}${fullName || 'Inquiry'}`);
    const mailtoBody = encodeURIComponent(
      `Hello Makhanam Export Desk,\n\n` +
      `I have submitted a quotation enquiry via the website:\n\n` +
      `Contact: ${fullName}\n` +
      `Company: ${companyName}\n` +
      `Email: ${email}\n` +
      `Phone/WhatsApp: ${phone}\n` +
      `Inquiry: ${inquiry}\n` +
      `Preferred Grade: ${grade}\n` +
      (port ? `Destination: ${port}\n` : '') +
      `Details: ${message}\n\n` +
      `Please provide current FOB/CIF pricing and minimum order quantity.`
    );
    const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

    return res.status(200).json({
      success: true,
      message: `Your enquiry has been successfully submitted and dispatched to ${TARGET_EMAIL}. Our export desk will review and contact you shortly.`,
      targetEmail: TARGET_EMAIL,
      mailtoUrl
    });
  } catch (error) {
    console.error('Error handling form submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your request. Please email KeshavKaushikExports@gmail.com directly or message via WhatsApp.',
      targetEmail: TARGET_EMAIL
    });
  }
});

// Google Maps API key configuration endpoint
app.get('/api/config/maps', (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  res.json({
    apiKey,
    facility: {
      name: 'Makhanam | Makhana Wholesaler & Distributor',
      address: 'Nekawat Tola, Milky Road, opposite Mafa Petrol Pump, Purnia, Maranga, Bihar 854303, India',
      lat: 25.7307073,
      lng: 87.4643731,
      placeId: 'ChIJG3xiuD3_7zkR1lIXBxd1Kis',
      mapsUrl: 'https://maps.app.goo.gl/GnTnHv3ucswADDEUA',
      phone: '+91 83404 93639',
      email: 'KeshavKaushikExports@gmail.com'
    }
  });
});

// Consolidated clean routing for HTML pages
app.get(['/grading', '/grading.html', '/SizeCaliperGuide.html', '/SizeCalliperGuide.html', '/sizecaliperguide.html', '/sizecaliperguide', '/sizecalliperguide'], (req, res) => {
  res.sendFile(path.join(__dirname, 'grading.html'));
});

app.get(['/aboutus', '/aboutus.html', '/about-us', '/about-us.html', '/makhanam', '/makhanam.html', '/sizeguide', '/sizeguide.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'aboutus.html'));
});

app.get(['/about', '/about.html', '/about-makhana', '/about-makhanam', '/about-makhanam.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get(['/why', '/why.html', '/why-makhanam', '/why-makhanam.html', '/journey', '/journey.html', '/ourstory', '/ourstory.html', '/our-story', '/story'], (req, res) => {
  res.sendFile(path.join(__dirname, 'why.html'));
});

app.get(['/contact', '/contact.html', '/contactus', '/contactus.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'contactus.html'));
});

app.get(['/privacy', '/privacy.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get(['/refund', '/refund.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'refund.html'));
});

app.get(['/contactinfo', '/contactinfo.html', '/contact-info', '/contact-info.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'contactinfo.html'));
});

app.get(['/shipping', '/shipping.html', '/shipping-policy', '/shipping-policy.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'shipping.html'));
});

app.get(['/terms', '/terms.html', '/terms-and-conditions', '/terms-of-service'], (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

// Fallback to index.html
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (!process.env.VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAKHANAM server is running on http://0.0.0.0:${PORT} (Notification Email: ${TARGET_EMAIL})`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use, assuming server is already running.`);
    } else {
      throw err;
    }
  });
}

export default app;
