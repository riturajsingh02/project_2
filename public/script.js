/* MAKHANAM – script.js
   Makhana grades are measured using the traditional Suta system.
   Images: /images/makhana-*.png */
const $ = id => document.getElementById(id);
const IMG = k => `images/makhana-${k}.png`;

const GRADES = [
  { 
    key: '7', 
    tag: 'GRADE 7 SUTA (SUPER JUMBO)', 
    badge: '7 Suta (21mm+)', 
    label: '7 Suta (Super Jumbo)', 
    size: '> 21 mm', 
    mm: 22, 
    gold: 1,
    name: '7 Suta Makhana (Super Jumbo)', 
    range: 'Greater than 21 mm', 
    count: '75 - 85 pieces', 
    moisture: '< 7.5%', 
    yield: '98% Fully Opened', 
    density: '65 - 70 g/L',
    usage: 'Top-tier export quality and specialty packaging'
  },
  { 
    key: '6', 
    tag: 'GRADE 6+ SUTA (JUMBO)', 
    badge: '6+ Suta (19–26mm)', 
    label: '6+ Suta (Jumbo)', 
    size: '19–26 mm', 
    mm: 20, 
    gold: 1,
    name: '6+ Suta Makhana (Jumbo)', 
    range: '19 – 26 mm', 
    count: '95 - 105 pieces', 
    moisture: '< 7.5%', 
    yield: '97% Fully Opened', 
    density: '68 - 73 g/L',
    usage: 'High-end gourmet markets, luxury gifting, and international exports' 
  },
  { 
    key: '5', 
    tag: 'GRADE 5 SUTA (ROYAL)', 
    badge: '5 Suta (15.9–19mm)', 
    label: '5 Suta (Royal)', 
    size: '15.9–19.0 mm', 
    mm: 17, 
    gold: 1,
    name: '5 Suta Makhana (Royal)', 
    range: '15.9 – 19.0 mm', 
    count: '120 - 135 pieces', 
    moisture: '< 8.0%', 
    yield: '96% Fully Opened', 
    density: '72 - 77 g/L',
    usage: 'Premium retail packs, flavored makhana D2C brands, and snacking' 
  },
  { 
    key: '4', 
    tag: 'GRADE 4 SUTA (CLASSIC)', 
    badge: '4 Suta (12.7–15.8mm)', 
    label: '4 Suta (Classic)', 
    size: '12.7–15.8 mm', 
    mm: 14, 
    gold: 0,
    name: '4 Suta Makhana (Classic)', 
    range: '12.7 – 15.8 mm', 
    count: '160 - 180 pieces', 
    moisture: '< 8.0%', 
    yield: '95% Fully Opened', 
    density: '76 - 82 g/L',
    usage: 'Everyday roasting, snacking, and household cooking' 
  },
  { 
    key: 'medium', 
    tag: 'GRADE 3 SUTA (PEARL)', 
    badge: '3 Suta (9–12.7mm)', 
    label: '3 Suta (Pearl)', 
    size: '9–12.7 mm', 
    mm: 10.5, 
    gold: 0,
    name: '3 Suta Makhana (Pearl)', 
    range: '9 – 12.7 mm', 
    count: '220 - 250 pieces', 
    moisture: '< 8.5%', 
    yield: '93% Fully Opened', 
    density: '80 - 87 g/L',
    usage: 'Industrial processing, makhana flour, or sweets' 
  }
];

let current = 0;

// ---------- Grade cards ----------
function renderGrid() {
  const container = $('makhana-grid');
  if (!container) return;
  container.innerHTML = GRADES.map((g, i) => `
    <button class="grade-card ${g.gold ? 'gold' : ''} ${i === current ? 'active' : ''}" data-i="${i}" aria-pressed="${i === current}">
      <span class="grade-pill">${g.badge}</span>
      <span class="grade-img"><img src="${IMG(g.key)}" alt="${g.label} makhana, ${g.size}" loading="lazy"></span>
      <span class="grade-name">${g.label}</span>
      <span class="grade-size">${g.size}</span>
    </button>`).join('');
  container.querySelectorAll('.grade-card').forEach(b => b.onclick = () => selectGrade(+b.dataset.i));
}

function selectGrade(i) {
  current = i;
  const g = GRADES[i];
  if (!g) return;
  document.querySelectorAll('.grade-card').forEach((b, n) => {
    b.classList.toggle('active', n === i); b.setAttribute('aria-pressed', n === i);
  });
  if ($('detail-grade-tag')) $('detail-grade-tag').textContent = g.tag;
  if ($('detail-name')) $('detail-name').textContent = g.name;
  if ($('detail-subtitle')) $('detail-subtitle').textContent = `Actual Size: ${g.range} | Traditional Suta Caliper Scaled`;
  if ($('detail-count')) $('detail-count').textContent = g.count;
  if ($('detail-moisture')) $('detail-moisture').textContent = g.moisture;
  if ($('detail-yield')) $('detail-yield').textContent = g.yield;
  if ($('detail-density')) $('detail-density').textContent = g.density;
  if ($('detail-usage')) $('detail-usage').textContent = g.usage;
  if ($('rfq-grade-name')) $('rfq-grade-name').textContent = g.label;
  
  const s = $('detail-sphere');
  if (s) {
    s.style.backgroundImage = `url(${IMG(g.key)})`;
    s.setAttribute('role', 'img'); 
    s.setAttribute('aria-label', g.label + ' makhana');
  }
  const line = document.querySelector('.diameter-line');
  if (line) {
    line.style.width = Math.min(100, Math.max(25, (g.mm / 26 * 100))) + '%';
  }
  if ($('detail-diameter-label')) $('detail-diameter-label').textContent = g.range;
}

// ---------- Compare ----------
function toggleCompareMode() {
  const d = $('comparison-drawer');
  if (!d) return;
  d.classList.toggle('hidden');
  if (!d.classList.contains('hidden')) {
    const opts = GRADES.map((g, i) => `<option value="${i}">${g.label} (${g.range})</option>`).join('');
    if ($('compare-select-1')) $('compare-select-1').innerHTML = opts; 
    if ($('compare-select-2')) $('compare-select-2').innerHTML = opts;
    if ($('compare-select-1')) $('compare-select-1').value = current; 
    if ($('compare-select-2')) $('compare-select-2').value = (current + 1) % GRADES.length;
    updateComparison();
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function swapCompareGrades() {
  const s1 = $('compare-select-1');
  const s2 = $('compare-select-2');
  if (s1 && s2) {
    const tmp = s1.value;
    s1.value = s2.value;
    s2.value = tmp;
    updateComparison();
  }
}

function updateComparison() {
  const compContainer = $('comparison-grid');
  if (!compContainer || !$('compare-select-1') || !$('compare-select-2')) return;
  const g1 = GRADES[$('compare-select-1').value] || GRADES[0];
  const g2 = GRADES[$('compare-select-2').value] || GRADES[1];

  compContainer.innerHTML = `
    <!-- Dual Visual Headers -->
    <div class="compare-header-grid">
      <div class="compare-item-card">
        <span class="compare-badge">${g1.badge}</span>
        <div class="compare-photo">
          <img src="${IMG(g1.key)}" alt="${g1.label}">
        </div>
        <h4 class="compare-title">${g1.label}</h4>
        <div class="compare-size">${g1.range}</div>
        <button onclick="openRFQWithSpecificGrade('${g1.key}')" class="compare-rfq-btn">
          <i class="fa-solid fa-file-invoice"></i> Quote ${g1.badge.split(' ')[0]}
        </button>
      </div>

      <div class="compare-item-card">
        <span class="compare-badge">${g2.badge}</span>
        <div class="compare-photo">
          <img src="${IMG(g2.key)}" alt="${g2.label}">
        </div>
        <h4 class="compare-title">${g2.label}</h4>
        <div class="compare-size">${g2.range}</div>
        <button onclick="openRFQWithSpecificGrade('${g2.key}')" class="compare-rfq-btn">
          <i class="fa-solid fa-file-invoice"></i> Quote ${g2.badge.split(' ')[0]}
        </button>
      </div>
    </div>

    <!-- Unified Side-by-Side Mobile Matrix Table -->
    <div class="compare-matrix-box">
      <!-- Row 1: Size -->
      <div class="compare-row bg-alt">
        <div class="compare-metric-title"><i class="fa-solid fa-ruler-horizontal"></i> Actual Caliper Size</div>
        <div class="compare-values-grid">
          <div class="val-cell highlight">${g1.range}</div>
          <div class="val-cell highlight">${g2.range}</div>
        </div>
      </div>

      <!-- Row 2: Count -->
      <div class="compare-row">
        <div class="compare-metric-title"><i class="fa-solid fa-weight-scale"></i> Count / 100g</div>
        <div class="compare-values-grid">
          <div class="val-cell">${g1.count}</div>
          <div class="val-cell">${g2.count}</div>
        </div>
      </div>

      <!-- Row 3: Yield -->
      <div class="compare-row bg-alt">
        <div class="compare-metric-title"><i class="fa-solid fa-expand"></i> Popping Yield</div>
        <div class="compare-values-grid">
          <div class="val-cell">${g1.yield}</div>
          <div class="val-cell">${g2.yield}</div>
        </div>
      </div>

      <!-- Row 4: Bulk Density -->
      <div class="compare-row">
        <div class="compare-metric-title"><i class="fa-solid fa-cube"></i> Bulk Density</div>
        <div class="compare-values-grid">
          <div class="val-cell">${g1.density}</div>
          <div class="val-cell">${g2.density}</div>
        </div>
      </div>

      <!-- Row 5: Moisture -->
      <div class="compare-row bg-alt">
        <div class="compare-metric-title"><i class="fa-solid fa-droplet"></i> Moisture Content</div>
        <div class="compare-values-grid">
          <div class="val-cell">${g1.moisture}</div>
          <div class="val-cell">${g2.moisture}</div>
        </div>
      </div>

      <!-- Row 6: Use Case -->
      <div class="compare-row">
        <div class="compare-metric-title"><i class="fa-solid fa-bullseye"></i> Primary Industry Use Case</div>
        <div class="compare-values-grid">
          <div class="val-cell text-left usage-text">${g1.usage}</div>
          <div class="val-cell text-left usage-text">${g2.usage}</div>
        </div>
      </div>
    </div>
  `;
}

function openRFQWithSpecificGrade(gradeKey) {
  if ($('rfq-grade-select')) $('rfq-grade-select').value = gradeKey;
  openRFQModal();
}

// ---------- Freight calculator ----------
const CBM = { '20ft': 33, '40ft': 76 };
const BAG = { '10kg': [10, 0.0995], '12.5kg': [12.5, 0.1244], '8kg': [8, 0.0796] }; // [kg, m³ per pack]
const GRADE_F = { '7': 1.08, '6': 1.0, '5': 0.94, '4': 0.88, 'medium': 0.82 }; // bigger nuts pack bulkier

function calculateFreight() {
  if (!$('calc-bag-size') || !$('calc-grade') || !$('calc-container-type') || !$('res-bags')) return;
  const [kg, vol0] = BAG[$('calc-bag-size').value] || BAG['12.5kg'];
  const gradeKey = $('calc-grade').value;
  const vol = vol0 * (GRADE_F[gradeKey] || 1.0);
  const total = CBM[$('calc-container-type').value] || 76;
  const bags = Math.floor(total * 0.95 / vol);
  $('res-bags').textContent = bags.toLocaleString() + ' Bags';
  if ($('res-weight')) $('res-weight').textContent = (bags * kg).toLocaleString() + ' KG';
  if ($('res-volume')) $('res-volume').textContent = (bags * vol / total * 100).toFixed(1) + '% CBM';
}

// ---------- RFQ modal ----------
function openRFQModal() { 
  if ($('rfq-modal')) {
    $('rfq-modal').classList.remove('hidden'); 
    document.body.style.overflow = 'hidden'; 
  }
}
function closeRFQModal() { 
  if ($('rfq-modal')) {
    $('rfq-modal').classList.add('hidden'); 
    document.body.style.overflow = ''; 
  }
}
function openRFQForGrade() {
  const k = GRADES[current] ? GRADES[current].key : '7';
  if ($('rfq-grade-select')) $('rfq-grade-select').value = k;
  openRFQModal();
}
function openRFQWithFreight() {
  if ($('rfq-grade-select') && $('calc-grade')) $('rfq-grade-select').value = $('calc-grade').value;
  const form = document.querySelector('#rfq-form textarea');
  if (form && $('calc-container-type') && $('res-bags') && $('res-weight') && $('calc-bag-size')) {
    form.value = `Load: ${$('calc-container-type').value} container, ${$('res-bags').textContent} (${$('res-weight').textContent}), ${$('calc-bag-size').selectedOptions[0].text}.`;
  }
  openRFQModal();
}
async function handleRFQSubmit(e) {
  e.preventDefault();
  const company = $('rfq-company') ? $('rfq-company').value : '';
  const name = $('rfq-name') ? $('rfq-name').value : '';
  const email = $('rfq-email') ? $('rfq-email').value : '';
  const port = $('rfq-port') ? $('rfq-port').value : '';
  const grade = $('rfq-grade-select') && $('rfq-grade-select').selectedOptions ? $('rfq-grade-select').selectedOptions[0].text : '';
  const details = $('rfq-details') ? $('rfq-details').value : '';

  const submitBtn = document.querySelector('#rfq-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending RFQ to Export Desk...';
  }

  // Send to backend endpoint which emails KeshavKaushikExports@gmail.com
  try {
    await fetch('/api/rfq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fullName: name,
        companyName: company,
        email: email,
        port: port,
        grade: grade,
        message: details,
        sourcePage: 'Size Caliper Guide RFQ Modal'
      })
    });
  } catch (err) {
    console.warn('Network submit notice:', err);
  }

  const waText = encodeURIComponent(
    `*Makhanam B2B RFQ Inquiry*\n` +
    `Company: ${company}\n` +
    `Contact: ${name}\n` +
    `Email: ${email}\n` +
    `Destination: ${port}\n` +
    `Preferred Grade: ${grade}\n` +
    (details ? `Details: ${details}\n` : '')
  );

  const mailtoSubject = encodeURIComponent(`[Makhanam Export RFQ] ${company ? `${company} - ` : ''}${name || 'Enquiry'}`);
  const mailtoBody = encodeURIComponent(
    `Hello Makhanam Export Desk,\n\n` +
    `I have requested an export quotation via the Suta Caliper Guide:\n\n` +
    `Company: ${company}\n` +
    `Contact: ${name}\n` +
    `Email: ${email}\n` +
    `Destination Port: ${port}\n` +
    `Preferred Grade: ${grade}\n` +
    (details ? `Details: ${details}\n` : '') +
    `\nPlease provide FOB/CIF quotation and export specifications.`
  );

  if ($('rfq-form')) {
    $('rfq-form').innerHTML = `
      <div class="rfq-ok" style="padding: 24px 16px; text-align: center;">
        <i class="fa-solid fa-circle-check" style="font-size: 38px; color: #C9A961; display: block; margin-bottom: 12px;"></i>
        <h4 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #241C17; margin-bottom: 8px;">Quotation Request Dispatched</h4>
        <p style="font-size: 13px; color: #5C4232; margin-bottom: 6px; line-height: 1.6;">
          Thank you, <strong>${name || 'Sir/Madam'}</strong>. Your export inquiry for <strong>${company || 'your organization'}</strong> has been sent to <strong>KeshavKaushikExports@gmail.com</strong>.
        </p>
        <p style="font-size: 11px; color: #7A5B47; margin-bottom: 20px;">Our dispatch team in Bihar will review and contact you with calibrated grade specifications.</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="https://wa.me/918340493639?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-block" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 12px 20px; border-radius: 999px; font-weight: 700;">
            <i class="fa-brands fa-whatsapp" style="font-size: 16px;"></i> Send Copy to WhatsApp Export Desk
          </a>
          <a href="mailto:KeshavKaushikExports@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}" class="btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 10px 20px; border-radius: 999px; border: 1px solid #C9A961; color: #241C17; font-size: 12px; font-weight: 600;">
            <i class="fa-solid fa-envelope"></i> Open Direct Email Client
          </a>
        </div>
      </div>
    `;
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  if ($('makhana-grid')) {
    renderGrid(); 
    selectGrade(0); 
  }
  if ($('calc-container-type')) {
    calculateFreight();
  }
  if ($('mobile-toggle')) $('mobile-toggle').onclick = () => $('nav-menu') && $('nav-menu').classList.toggle('open');
  if ($('nav-menu')) $('nav-menu').onclick = () => $('nav-menu').classList.remove('open');
  if ($('rfq-modal')) $('rfq-modal').onclick = e => { if (e.target.id === 'rfq-modal') closeRFQModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRFQModal(); });
  if ($('navbar')) {
    window.addEventListener('scroll', () => $('navbar').classList.toggle('scrolled', scrollY > 30), { passive: true });
  }
});
