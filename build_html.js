const fs = require('fs');
const path = require('path');

// ─── Parse IMAGE_DESCRIPTIONS.md ───────────────────────────────────────────
const mdPath = path.join(__dirname, 'IMAGE_DESCRIPTIONS.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');
const descriptions = {};
const regex = /###\s+\d+\.\s+([^\(]+)\s+\(`([^`]+)`\)\n([\s\S]*?)(?=###|$)/g;
let match;
while ((match = regex.exec(mdContent)) !== null) {
    const title = match[1].trim();
    const image = match[2].trim();
    const desc = match[3].trim();
    descriptions[image] = { title, desc, image };
}

// ─── Helper: Carousel Block ─────────────────────────────────────────────────
function buildCarousel(title, subtitle, imageList, reverse = false) {
    const items = imageList.map(img => descriptions[img]).filter(x => x);
    if (!items.length) return '';

    const slidesHtml = items.map((item, i) => `
        <div class="carousel-slide${i === 0 ? ' active' : ''}"
             data-title="${item.title.replace(/"/g, '&quot;')}"
             data-desc="${item.desc.replace(/"/g, '&quot;')}">
            <img src="screenshots/${item.image}" alt="${item.title}" />
        </div>`).join('');

    const thumbsHtml = items.map((item, i) => `
        <button class="carousel-thumb${i === 0 ? ' active' : ''}" data-index="${i}">
            <img src="screenshots/${item.image}" alt="Thumbnail ${i + 1}" />
        </button>`).join('');

    return `
    <div class="carousel-section">
      <div class="carousel-header fade-up">
          <span class="split-eyebrow">Features Collection</span>
          <h2 class="split-title">${title}</h2>
          <p class="split-desc carousel-subtitle">${subtitle}</p>
      </div>
      <div class="carousel-layout${reverse ? ' reverse' : ''}">
          <div class="carousel-caption-panel dynamic-caption">
              <h3 class="slide-title">${items[0].title}</h3>
              <p class="slide-desc">${items[0].desc}</p>
          </div>
          <div class="carousel-media-panel">
              <div class="carousel-stage group">
                  <div class="carousel-track">
                      ${slidesHtml}
                  </div>
                  <button class="carousel-btn carousel-prev">&#8592;</button>
                  <button class="carousel-btn carousel-next">&#8594;</button>
              </div>
              <div class="carousel-thumbs">
                  ${thumbsHtml}
              </div>
          </div>
      </div>
    </div>`;
}

// ─── Helper: Center Feature Block ──────────────────────────────────────────
function buildCenterFeature(imgName) {
    const item = descriptions[imgName];
    if (!item) return '';
    return `
    <div class="center-feature fade-up">
        <div class="center-feature-text">
            <span class="split-eyebrow">Highlight</span>
            <h2 class="split-title">${item.title}</h2>
            <p class="split-desc center-desc">${item.desc}</p>
        </div>
        <div class="center-feature-visual">
            <img src="screenshots/${item.image}" alt="${item.title}" />
        </div>
    </div>`;
}

// ─── Helper: Side Feature Block ─────────────────────────────────────────────
function buildSideFeature(imgName) {
    const item = descriptions[imgName];
    if (!item) return '';
    return `
    <div class="feature-split fade-up">
        <div class="split-text">
            <h2 class="split-title">${item.title}</h2>
            <p class="split-desc">${item.desc}</p>
        </div>
        <div class="split-visual side-visual">
            <img src="screenshots/${item.image}" alt="${item.title}" />
        </div>
    </div>`;
}

// ─── Build Full Page ─────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MoaChat — Collaborate Inside After Effects</title>
  <meta name="description" content="MoaChat is the real-time collaboration plugin built for After Effects. Chat, share, review, and iterate — all without leaving your timeline." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: #F5A623; --blue: #1DA1FF; --purple: #8B5CF6;
      --bg: #060608; --surface: #0E0F14; --surface2: #141620;
      --border: rgba(255,255,255,0.06); --muted: #64748B; --text: #F1F5F9;
    }

    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

    /* Noise */
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 0; opacity: 0.4;
    }

    /* Orbs */
    .orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); }
    .orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(29,161,255,0.12) 0%, transparent 70%); top: -200px; left: -200px; animation: orbFloat1 18s ease-in-out infinite alternate; }
    .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%); bottom: -100px; right: -100px; animation: orbFloat2 22s ease-in-out infinite alternate; }
    .orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%); top: 40%; left: 50%; transform: translate(-50%,-50%); animation: orbFloat3 16s ease-in-out infinite alternate; }
    @keyframes orbFloat1 { to { transform: translate(60px, 40px); } }
    @keyframes orbFloat2 { to { transform: translate(-40px, -60px); } }
    @keyframes orbFloat3 { to { transform: translate(-50%,-50%) translate(30px,-30px); } }

    /* Nav */
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 68px; background: #1E1E1E; border-bottom: 1px solid var(--border); }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
    .nav-links a { font-size: 13.5px; font-weight: 500; color: var(--muted); text-decoration: none; transition: color 0.2s; }
    .nav-links a:hover { color: white; }
    .nav-cta { display: flex; align-items: center; gap: 12px; }
    .btn-outline { padding: 8px 20px; border: 1px solid var(--border); border-radius: 8px; color: #94A3B8; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .btn-outline:hover { border-color: rgba(255,255,255,0.2); color: white; }
    .btn-primary { padding: 9px 22px; background: linear-gradient(135deg, var(--blue), var(--purple)); border-radius: 8px; color: white; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 20px rgba(29,161,255,0.3); transition: all 0.2s; }
    .btn-primary:hover { box-shadow: 0 8px 30px rgba(29,161,255,0.5); transform: translateY(-1px); }

    section { position: relative; z-index: 1; }

    /* Hero */
    .hero { min-height: 100vh; padding: 120px 24px 80px; display: flex; align-items: center; }
    .hero-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 60px; flex-wrap: wrap; width: 100%; }
    .hero-text { flex: 1; min-width: 300px; }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(29,161,255,0.1); border: 1px solid rgba(29,161,255,0.25); color: var(--blue); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 18px; border-radius: 99px; margin-bottom: 28px; }
    .hero-badge .dot { width: 6px; height: 6px; background: var(--blue); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
    .hero-text h1 { font-size: clamp(2.4rem, 5vw, 4.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 24px; }
    .gradient-text { background: linear-gradient(135deg, #fff 0%, #1DA1FF 50%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-sub { font-size: 17px; line-height: 1.7; color: #94A3B8; margin-bottom: 40px; max-width: 500px; }
    .hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 40px; }
    .btn-hero { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: linear-gradient(135deg, var(--blue), var(--purple)); border-radius: 12px; color: white; font-size: 15px; font-weight: 800; text-decoration: none; box-shadow: 0 8px 40px rgba(29,161,255,0.4); transition: all 0.3s; }
    .btn-hero:hover { box-shadow: 0 12px 50px rgba(29,161,255,0.6); transform: translateY(-2px); }
    .btn-hero-ghost { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; border: 1px solid var(--border); border-radius: 12px; color: #94A3B8; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.3s; }
    .btn-hero-ghost:hover { border-color: rgba(255,255,255,0.2); color: white; transform: translateY(-2px); }
    .hero-stats { display: flex; align-items: center; gap: 40px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
    .stat-num { font-size: 20px; font-weight: 900; background: linear-gradient(135deg, white 40%, #94A3B8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 500; }

    /* Hero visual */
    .hero-visual { flex: 1.2; min-width: 300px; position: relative; min-height: 480px; perspective: 1000px; }
    .float-wrap { position: absolute; }
    .float-wrap.f1 { right: 0; top: 0; width: 55%; max-width: 350px; z-index: 1; animation: floaty1 6s ease-in-out infinite; }
    .float-wrap.f2 { left: 20%; top: 30%; width: 45%; max-width: 280px; z-index: 2; animation: floaty2 5.5s ease-in-out infinite 0.5s; }
    .float-wrap.f3 { left: 10%; bottom: 5%; width: 30%; max-width: 200px; z-index: 3; animation: floaty3 7s ease-in-out infinite 1s; }
    .hero-layer { width: 100%; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); pointer-events: none; transition: transform 0.15s ease-out; transform-style: preserve-3d; will-change: transform; }

    /* Features section */
    .features-section { padding: 80px 24px 60px; }
    .tools-section { background: linear-gradient(to bottom, #0E0F14, #060608); padding: 100px 24px 60px; }
    .section-eyebrow { text-align: center; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue); margin-bottom: 14px; }
    .section-title { text-align: center; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 80px; }

    /* Text styles */
    .split-eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 16px; display: inline-block; }
    .split-title { font-size: clamp(1.6rem, 3vw, 2.8rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #fff; }
    .split-desc { font-size: 16px; color: #94A3B8; line-height: 1.75; }

    /* Scroll animations */
    .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }

    /* ─── CAROUSEL ─────────────────────────────────────── */
    .carousel-section { max-width: 1200px; margin: 0 auto 120px; padding: 0 24px; }
    .carousel-header { text-align: center; max-width: 720px; margin: 0 auto 60px; }
    .carousel-subtitle { margin: 0 auto; }
    .carousel-layout { display: flex; flex-direction: column; gap: 40px; }
    @media (min-width: 900px) {
      .carousel-layout { flex-direction: row; align-items: flex-start; gap: 60px; }
      .carousel-layout.reverse { flex-direction: row-reverse; }
      .carousel-caption-panel { flex: 1; position: sticky; top: 120px; }
      .carousel-media-panel { flex: 1.4; }
    }
    .carousel-caption-panel { min-width: 220px; }
    .carousel-caption-panel .slide-title { font-size: 22px; font-weight: 800; color: white; margin-bottom: 16px; line-height: 1.3; }
    .carousel-caption-panel .slide-desc { font-size: 15px; color: #94A3B8; line-height: 1.75; }

    .carousel-stage {
      position: relative; width: 100%; height: 480px;
      overflow: hidden;
      border-radius: 16px;
      margin-bottom: 16px;
      background: transparent;
    }
    .carousel-track { position: relative; width: 100%; height: 100%; }
    .carousel-slide {
      position: absolute; inset: 0;
      opacity: 0; transition: opacity 0.4s ease-in-out;
      pointer-events: none; z-index: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .carousel-slide.active { opacity: 1; pointer-events: auto; z-index: 10; }
    .carousel-slide img {
      max-width: 100%; max-height: 100%; object-fit: contain; display: block;
      border: none; box-shadow: none; background: transparent;
    }

    .carousel-btn {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(10,10,20,0.7); border: 1px solid rgba(255,255,255,0.15);
      color: white; cursor: pointer; z-index: 20; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s; opacity: 0; backdrop-filter: blur(10px);
    }
    .group:hover .carousel-btn { opacity: 1; }
    .carousel-btn:hover { background: rgba(29,161,255,0.8); border-color: var(--blue); transform: translateY(-50%) scale(1.1); }
    .carousel-prev { left: 14px; }
    .carousel-next { right: 14px; }

    .carousel-thumbs { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; }
    .carousel-thumbs::-webkit-scrollbar { height: 4px; }
    .carousel-thumbs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    .carousel-thumb {
      flex-shrink: 0; width: 64px; height: 86px; border-radius: 8px;
      overflow: hidden; cursor: pointer; border: none; outline: none;
      background: transparent; transition: all 0.25s; opacity: 0.4; transform: scale(0.93);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
    }
    @media (min-width: 640px) { .carousel-thumb { width: 72px; height: 96px; } }
    .carousel-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .carousel-thumb:hover { opacity: 0.8; transform: scale(1); }
    .carousel-thumb.active { opacity: 1; transform: scale(1); box-shadow: 0 0 0 2px white; }
    .carousel-thumb.active::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.06); }

    /* ─── CENTER FEATURE ──────────────────────────────── */
    .center-feature { max-width: 1000px; margin: 0 auto 120px; padding: 0 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 40px; }
    .center-feature-text { max-width: 720px; }
    .center-desc { max-width: 600px; margin: 0 auto; }
    .center-feature-visual img { max-width: 100%; max-height: 600px; object-fit: contain; display: block; margin: 0 auto; }

    /* ─── SIDE FEATURE SPLIT ──────────────────────────── */
    .splits-group { max-width: 1200px; margin: 0 auto 120px; padding: 0 24px; display: flex; flex-direction: column; gap: 100px; }
    .feature-split { display: flex; flex-direction: column; align-items: center; gap: 50px; }
    @media (min-width: 900px) {
      .feature-split { flex-direction: row; gap: 80px; }
      .feature-split:nth-child(even) { flex-direction: row-reverse; }
    }
    .split-text { flex: 1; min-width: 260px; }
    .side-visual { flex: 1.2; display: flex; align-items: center; justify-content: center; }
    .side-visual img { max-width: 100%; max-height: 420px; object-fit: contain; display: block; }

    /* ─── PRICING CTA ─────────────────────────────────── */
    .pricing-cta { padding: 80px 24px 120px; }
    .pricing-cta-inner { max-width: 680px; margin: 0 auto; background: linear-gradient(145deg, rgba(29,161,255,0.1), rgba(139,92,246,0.08), rgba(10,10,20,0.8)); border: 1px solid rgba(29,161,255,0.2); border-radius: 24px; padding: 64px 48px; text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
    .pricing-cta-inner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(29,161,255,0.5), transparent); }
    .pricing-cta h2 { font-size: clamp(1.9rem, 3vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1; }
    .pricing-cta p { font-size: 15px; color: #64748B; line-height: 1.7; margin-bottom: 36px; }
    .pricing-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 40px; background: linear-gradient(135deg, var(--gold), #FBBF24); border-radius: 12px; color: #1a0d00; font-size: 16px; font-weight: 900; text-decoration: none; box-shadow: 0 8px 40px rgba(245,166,35,0.4); transition: all 0.3s; }
    .pricing-btn:hover { box-shadow: 0 12px 50px rgba(245,166,35,0.6); transform: translateY(-2px) scale(1.02); }

    /* ─── FOOTER ──────────────────────────────────────── */
    footer { position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 48px; }
    .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
    .footer-copy { font-size: 12px; color: #374151; }
    .footer-links { display: flex; gap: 24px; list-style: none; }
    .footer-links a { font-size: 12px; color: #374151; text-decoration: none; transition: color 0.2s; }
    .footer-links a:hover { color: var(--muted); }

    @media (max-width: 768px) {
      nav { padding: 0 20px; }
      .nav-links { display: none; }
      .pricing-cta-inner { padding: 40px 24px; }
      .footer-inner { flex-direction: column; }
    }
  </style>
</head>

<body>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>

  <!-- NAV -->
  <nav>
    <a href="/" class="nav-logo">
      <img src="/Moachat_logo.webp" alt="MoaChat Logo" style="height:48px;width:auto;" />
    </a>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#tools">Tools</a></li>
      <li><a href="pricing.html">Pricing</a></li>
    </ul>
    <div class="nav-cta">
      <a href="pricing.html" class="btn-outline">View Plans</a>
      <a href="https://aescripts.com/moachat/" target="_blank" class="btn-primary">Get Plugin →</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <div class="hero-badge"><span class="dot"></span>Real-time collaboration for After Effects</div>
        <h1><span class="gradient-text">Collaborate</span><br />Inside Your Timeline</h1>
        <p class="hero-sub">MoaChat brings chat, video review, and team communication directly into After Effects. No more switching apps — stay in your creative flow.</p>
        <div class="hero-actions">
          <a href="https://aescripts.com/moachat/" target="_blank" class="btn-hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            Download Plugin
          </a>
          <a href="pricing.html" class="btn-hero-ghost">View Pricing →</a>
        </div>
        <div class="hero-stats">
          <div class="stat-item"><div class="stat-num">Real-time</div><div class="stat-label">Team Messaging</div></div>
          <div class="stat-item"><div class="stat-num">E2EE</div><div class="stat-label">Encrypted by Default</div></div>
          <div class="stat-item"><div class="stat-num">MoPack</div><div class="stat-label">Video Review System</div></div>
        </div>
      </div>
      <div class="hero-visual" id="heroVisual">
        <div class="float-wrap f1"><img class="hero-layer" src="screenshots/Moachat_home_page.png" alt="Home" /></div>
        <div class="float-wrap f2"><img class="hero-layer" src="screenshots/Mohub.png" alt="Hub" /></div>
        <div class="float-wrap f3"><img class="hero-layer" src="screenshots/Share_Action.png" alt="Share" /></div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" class="features-section">
    ${buildCarousel(
      "Chat Feature",
      "Connect instantly with your team. Encrypted, fast, and fully integrated with your projects.",
      ['Moachat_home_page.png','Group_Chat.png','End_to_end_encryption.png','Share_Action.png','Smart_Attach.png','Mohub.png'],
      false
    )}
    ${buildCenterFeature('Mopack.png')}
    ${buildCenterFeature('MoPrompt.png')}
  </section>

  <!-- TOOLS -->
  <section id="tools" class="tools-section">
    <div class="section-eyebrow">More Tools Included</div>
    <h2 class="section-title">Everything Your Team Needs</h2>

    ${buildCenterFeature('Mofix.png')}

    <div class="splits-group">
      ${buildSideFeature('Google_Explore Palette.png')}
      ${buildSideFeature('MoF&R.png')}
      ${buildSideFeature('Google_Font.png')}
      ${buildSideFeature('Google_Icons.png')}
    </div>

    ${buildCarousel(
      "Gradlette Color Suite",
      "Generate, explore, and apply perfectly harmonic color palettes to your AE projects.",
      ['Google_Generate.png','Google_My Librarry.png','Gradlette.png','Google_Image Extractor.png','Gradlette_Contrast Checker.png','Gradlette_Color_whele.png'],
      false
    )}

    ${buildCarousel(
      "TemGrid Composition Guides",
      "Professional layout grids overlaying your viewer ensure your designs have perfect rhythm and balance.",
      ['TemGrid_Rule_of_Thirds.png','TemGrid_Column_Grid.png','TemGrid_Modular_Grid.png','TemGrid_Baseline_Grid.png','TemGrid_Golden_Ratio.png','TemGrid_Center_Cross.png','TemGrid_Pixel_Grid.png','TemGrid_Isometric.png','TemGrid_Safe_Areas.png'],
      true
    )}

    <div class="splits-group">
      ${buildSideFeature('Mozoom.png')}
      ${buildSideFeature('Moji.png')}
      ${buildSideFeature('Mohealth.png')}
      ${buildSideFeature('Motouch.png')}
    </div>
  </section>

  <!-- PRICING CTA -->
  <section class="pricing-cta">
    <div class="pricing-cta-inner fade-up">
      <div style="font-size:40px;margin-bottom:20px;">✨</div>
      <h2>Ready to Upgrade Your Workflow?</h2>
      <p>One-time purchase or flexible subscription — choose the plan that fits how you work.</p>
      <a href="pricing.html" class="pricing-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        View Pricing Plans
      </a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div class="footer-copy">© 2025 MoaChat. All rights reserved. moachats.shop</div>
      <ul class="footer-links">
        <li><a href="pricing.html">Pricing</a></li>
        <li><a href="mopack.html">MoPack Viewer</a></li>
        <li><a href="https://aescripts.com/moachat/" target="_blank">aescripts</a></li>
      </ul>
    </div>
  </footer>

  <script>
    // Scroll fade-up
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

    // Carousel logic
    document.querySelectorAll('.carousel-stage').forEach(stage => {
      const wrapper = stage.closest('.carousel-layout');
      const slides = stage.querySelectorAll('.carousel-slide');
      const thumbs = wrapper ? wrapper.querySelectorAll('.carousel-thumb') : [];
      const captionTitle = wrapper ? wrapper.querySelector('.slide-title') : null;
      const captionDesc = wrapper ? wrapper.querySelector('.slide-desc') : null;
      const prev = stage.querySelector('.carousel-prev');
      const next = stage.querySelector('.carousel-next');
      let cur = 0, timer, paused = false;

      function go(i) {
        if(i < 0) i = slides.length - 1;
        if(i >= slides.length) i = 0;
        cur = i;
        slides.forEach((s, idx) => s.classList.toggle('active', idx === cur));
        thumbs.forEach((t, idx) => t.classList.toggle('active', idx === cur));
        if(slides[cur] && captionTitle) captionTitle.textContent = slides[cur].dataset.title || '';
        if(slides[cur] && captionDesc) captionDesc.textContent = slides[cur].dataset.desc || '';
        clearTimeout(timer);
        if(!paused) timer = setTimeout(() => go(cur + 1), 4500);
      }

      if(prev) prev.addEventListener('click', () => go(cur - 1));
      if(next) next.addEventListener('click', () => go(cur + 1));
      thumbs.forEach((t, i) => t.addEventListener('click', () => go(i)));
      stage.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
      stage.addEventListener('mouseleave', () => { paused = false; timer = setTimeout(() => go(cur + 1), 4500); });
      go(0);
    });

    // Hero parallax
    const heroVisual = document.getElementById('heroVisual');
    if(heroVisual) {
      const layers = heroVisual.querySelectorAll('.hero-layer');
      heroVisual.addEventListener('mousemove', e => {
        const r = heroVisual.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
        const dy = (e.clientY - r.top - r.height/2) / (r.height/2);
        layers.forEach((l, i) => {
          const d = (i+1) * 9;
          l.style.transform = \`translate(\${-dx*d*1.2}px, \${-dy*d*1.2}px) rotateX(\${-dy*d*0.35}deg) rotateY(\${dx*d*0.35}deg)\`;
        });
      });
      heroVisual.addEventListener('mouseleave', () => {
        heroVisual.querySelectorAll('.hero-layer').forEach(l => l.style.transform = '');
      });
    }
  </script>
</body>
</html>`;

const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log('✅ index.html rebuilt successfully (' + html.length + ' bytes)');
