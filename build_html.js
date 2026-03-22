const fs = require('fs');
const path = require('path');

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

function buildCarousel(title, subtitle, imageList, reverse=false) {
    const items = imageList.map(img => descriptions[img]).filter(x => x);
    if (!items.length) return '';

    let slidesHtml = items.map((item, i) => `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}">
            <img src="screenshots/${item.image}" alt="${item.title}" />
            <div class="carousel-caption">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join('');

    let dotsHtml = items.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('');

    return `
    <div class="premium-splits" style="margin-bottom: 120px;">
      <div class="feature-split fade-up ${reverse ? 'force-reverse' : ''}">
          <div class="split-text">
              <span class="split-eyebrow">Features Collection</span>
              <h2 class="split-title">${title}</h2>
              <p class="split-desc">${subtitle}</p>
          </div>
          <div class="split-visual carousel-container">
              <div class="carousel-track">
                  ${slidesHtml}
              </div>
              <button class="carousel-btn carousel-prev">&larr;</button>
              <button class="carousel-btn carousel-next">&rarr;</button>
              <div class="carousel-nav">
                  ${dotsHtml}
              </div>
          </div>
      </div>
    </div>`;
}

function buildCenterFeature(imgName) {
    const item = descriptions[imgName];
    if (!item) return '';

    return `
    <div class="premium-splits" style="margin-bottom: 120px;">
      <div class="feature-center fade-up" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 40px; width: 100%;">
          <div class="split-text" style="max-width: 800px; width: 100%;">
              <span class="split-eyebrow">Highlight</span>
              <h2 class="split-title">${item.title}</h2>
              <p class="split-desc" style="max-width: 600px; margin: 0 auto;">${item.desc}</p>
          </div>
          <div class="split-visual center-visual" style="max-width: 1000px; width: 100%; background: #141620; padding: 20px; border-radius: 20px;">
              <img src="screenshots/${item.image}" alt="${item.title}" style="max-width: 100%; max-height: 600px; margin: 0 auto; display: block; object-fit: contain; border-radius: 12px;" />
          </div>
      </div>
    </div>`;
}

function buildSideFeature(imgName) {
    const item = descriptions[imgName];
    if (!item) return '';

    // No force-reverse needed, rely on CSS taking nth-child(even) within premium-splits
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

let newHtmlContent = `
<!-- ─── HERO REPLACEMENT ─── -->
<section class="hero" style="min-height: 100vh; padding: 120px 24px 80px; position: relative;">
    <div class="hero-inner" style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 40px; flex-wrap: wrap;">
        <!-- Left Text -->
        <div class="hero-text" style="flex: 1; min-width: 300px; text-align: left;">
            <div class="hero-badge">
                <span class="dot"></span>
                Real-time collaboration for After Effects
            </div>
            <h1 style="text-align:left;">
                <span class="gradient-text">Collaborate</span><br />
                Inside Your Timeline
            </h1>
            <p class="hero-sub" style="margin-left:0; text-align:left;">
                MoaChat brings chat, video review, and team communication directly into After Effects.
                No more switching apps — stay in your creative flow.
            </p>
            <div class="hero-actions" style="justify-content: flex-start;">
                <a href="https://aescripts.com/moachat/" target="_blank" class="btn-hero">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    Download Plugin
                </a>
                <a href="pricing.html" class="btn-hero-ghost">
                    View Pricing →
                </a>
            </div>
            
            <div class="hero-stats" style="justify-content: flex-start; margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.06);">
                <div class="stat-item" style="text-align:left;"><div class="stat-num" style="font-size:20px;">Real-time</div><div class="stat-label">Team Messaging</div></div>
                <div class="stat-item" style="text-align:left;"><div class="stat-num" style="font-size:20px;">E2EE</div><div class="stat-label">Encrypted by Default</div></div>
                <div class="stat-item" style="text-align:left;"><div class="stat-num" style="font-size:20px;">MoPack</div><div class="stat-label">Video Review System</div></div>
            </div>
        </div>
        <!-- Right Visual (3 Layered Images) -->
        <div class="hero-visual" style="flex: 1.2; min-width: 300px; position: relative; min-height: 480px; display: flex; align-items: center; justify-content: center;">
            <img src="screenshots/Moachat_home_page.png" alt="Home" style="position: absolute; right: 0; top: 5%; width: 70%; max-width: 450px; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); z-index: 1;" />
            <img src="screenshots/Mohub.png" alt="Hub" style="position: absolute; left: 10%; top: 35%; width: 55%; max-width: 350px; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); z-index: 2;" />
            <img src="screenshots/Share_Action.png" alt="Share" style="position: absolute; left: 0%; bottom: 5%; max-width: 250px; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); z-index: 3;" />
        </div>
    </div>
</section>

<!-- ─── FEATURES REPLACEMENT ─── -->
<section id="features" class="features-section" style="padding-top: 40px;">
    
  ${buildCarousel(
      "Chat Feature", 
      "Connect instantly with your team. Encrypted, fast, and fully integrated with your projects.",
      ['Moachat_home_page.png', 'Group_Chat.png', 'End_to_end_encryption.png', 'Share_Action.png', 'Smart_Attach.png', 'Mohub.png'],
      false
  )}

  ${buildCenterFeature('Mopack.png')}
  ${buildCenterFeature('MoPrompt.png')}
        
</section>

<!-- ─── EVERYTHING YOUR TEAM NEEDS (Dark Section) ─── -->
<section id="tools" class="features-section" style="background: linear-gradient(to bottom, #0E0F14, #060608); padding-top: 100px;">
    <div class="section-eyebrow">More Tools Included</div>
    <h2 class="section-title" style="margin-bottom: 80px;">Everything Your Team Needs</h2>
    
    ${buildCenterFeature('Mofix.png')}
    
    <div class="premium-splits" style="margin-bottom: 120px;">
        ${buildSideFeature('Google_Explore Palette.png')}   <!-- 1st: left text, right img -->
        ${buildSideFeature('MoF&R.png')}                    <!-- 2nd: right text, left img (due to nth-child) -->
        ${buildSideFeature('Google_Font.png')}              <!-- 3rd: left text, right img -->
        ${buildSideFeature('Google_Icons.png')}             <!-- 4th: right text, left img -->
    </div>

    ${buildCarousel(
        "Gradlette Color Suite",
        "Generate, explore, and apply perfectly harmonic color palettes to your AE projects.",
        ['Google_Generate.png', 'Google_My Librarry.png', 'Gradlette.png', 'Google_Image Extractor.png', 'Gradlette_Contrast Checker.png', 'Gradlette_Color_whele.png'],
        false
    )}

    ${buildCarousel(
        "TemGrid Composition Guides",
        "Professional layout grids overlaying your viewer ensure your designs have perfect rhythm and balance.",
        ['TemGrid_Rule_of_Thirds.png', 'TemGrid_Column_Grid.png', 'TemGrid_Modular_Grid.png', 'TemGrid_Baseline_Grid.png', 'TemGrid_Golden_Ratio.png', 'TemGrid_Center_Cross.png', 'TemGrid_Pixel_Grid.png', 'TemGrid_Isometric.png', 'TemGrid_Safe_Areas.png'],
        true
    )}

    <div class="premium-splits" style="margin-bottom: 120px;">
        ${buildSideFeature('Mozoom.png')}                   <!-- left text -->
        ${buildSideFeature('Moji.png')}                     <!-- right text -->
        ${buildSideFeature('Mohealth.png')}                 <!-- left text -->
        ${buildSideFeature('Motouch.png')}                  <!-- right text -->
    </div>
</section>
`;

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const topMarker = '<!-- ─── HERO REPLACEMENT ─── -->';
let topIndex = indexHtmlContent.indexOf(topMarker);
if(topIndex === -1) topIndex = indexHtmlContent.indexOf('<!-- ─── HERO ─── -->');

const bottomMarker = '<!-- ─── PRICING CTA ─── -->';
const bottomIndex = indexHtmlContent.indexOf(bottomMarker);

if (topIndex === -1 || bottomIndex === -1) {
    console.error("Markers not found in index.html");
    process.exit(1);
}

const modifiedHtml = indexHtmlContent.substring(0, topIndex) + newHtmlContent + indexHtmlContent.substring(bottomIndex);

const styles = `
    .carousel-container {
        position: relative; overflow: hidden; height: 500px;
        background: #141620; padding: 20px;
    }
    .carousel-track {
        display: flex; height: 100%; width: 100%; position: relative; overflow: hidden;
    }
    .carousel-slide {
        position: absolute; inset: 0;
        opacity: 0; transition: opacity 0.5s ease;
        pointer-events: none;
    }
    .carousel-slide.active { opacity: 1; pointer-events: auto; }
    .carousel-slide img { 
        width: 100%; height: 100%; object-fit: contain; 
        max-height: 500px; margin: 0 auto; display: block; border-radius: 12px;
    }
    .carousel-caption {
        position: absolute; bottom: 0; left: 0; right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
        padding: 40px 24px 24px; border-radius: 0 0 20px 20px;
    }
    .carousel-caption h3 { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
    .carousel-caption p { font-size: 13px; color: #94A3B8; line-height: 1.6; margin: 0; }
    
    .carousel-btn {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 36px; height: 36px; border-radius: 50%;
        background: rgba(29,161,255,0.2); border: 1px solid rgba(29,161,255,0.4);
        color: white; cursor: pointer; z-index: 10;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
    }
    .carousel-btn:hover { background: rgba(29,161,255,0.8); }
    .carousel-prev { left: 16px; }
    .carousel-next { right: 16px; }

    .carousel-nav {
        position: absolute; bottom: 16px; right: 16px;
        display: flex; gap: 8px; z-index: 10;
    }
    .carousel-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(255,255,255,0.3); cursor: pointer; transition: background 0.3s;
    }
    .carousel-dot.active { background: #1DA1FF; box-shadow: 0 0 10px #1DA1FF; }

    /* Side features image handling */
    .side-visual { background: #141620; padding: 20px; display: flex; align-items: center; justify-content: center; }
    .side-visual img { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 12px; }

    @media (min-width: 900px) {
        .feature-split.force-reverse { flex-direction: row-reverse !important; }
    }
`;

const jsCode = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const slides = container.querySelectorAll('.carousel-slide');
            const dots = container.querySelectorAll('.carousel-dot');
            const prev = container.querySelector('.carousel-prev');
            const next = container.querySelector('.carousel-next');
            let currentIndex = 0;

            function goToSlide(index) {
                if(index < 0) index = slides.length - 1;
                if(index >= slides.length) index = 0;
                currentIndex = index;
                slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
                dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
            }

            if(prev) prev.addEventListener('click', () => goToSlide(currentIndex - 1));
            if(next) next.addEventListener('click', () => goToSlide(currentIndex + 1));
            dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
        });
    });
  </script>
`;

let cleanedHtml = modifiedHtml;

if(cleanedHtml.includes('<!-- CAROUSEL SCRIPT -->')) {
    cleanedHtml = cleanedHtml.substring(0, cleanedHtml.indexOf('<!-- CAROUSEL SCRIPT -->'));
}
if(cleanedHtml.includes('</style>')) {
    const lastStyleIndex = cleanedHtml.lastIndexOf('</style>');
    cleanedHtml = cleanedHtml.substring(0, lastStyleIndex) + styles + '</style>' + cleanedHtml.substring(lastStyleIndex + 8);
}

const finalHtml = cleanedHtml.replace('</body>', '<!-- CAROUSEL SCRIPT -->\n' + jsCode + '\n</body>');
fs.writeFileSync(indexHtmlPath, finalHtml);
console.log("Successfully rebuilt index.html");
