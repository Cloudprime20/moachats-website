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
        <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-title="${item.title.replace(/"/g, '&quot;')}" data-desc="${item.desc.replace(/"/g, '&quot;')}">
            <img src="screenshots/${item.image}" alt="${item.title}" />
        </div>
    `).join('');

    let thumbsHtml = items.map((item, i) => `
        <button class="carousel-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="screenshots/${item.image}" alt="Thumbnail ${i + 1}" />
        </button>
    `).join('');

    return `
    <div style="margin-bottom: 120px;">
      <div class="fade-up" style="text-align: center; max-width: 800px; margin: 0 auto 60px; padding: 0 24px;">
          <span class="split-eyebrow">Features Collection</span>
          <h2 class="split-title">${title}</h2>
          <p class="split-desc" style="margin: 0 auto;">${subtitle}</p>
      </div>
      <div class="premium-splits carousel-wrapper">
        <div class="feature-split fade-up ${reverse ? 'force-reverse' : ''}">
            <div class="split-text dynamic-caption">
                <h3 class="slide-title" style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">${items[0].title}</h3>
                <p class="slide-desc" style="font-size: 15px; color: #94A3B8; line-height: 1.7;">${items[0].desc}</p>
            </div>
            <div class="split-visual" style="background: transparent; display: flex; flex-direction: column; gap: 16px; border: none; box-shadow: none;">
                <!-- Main Image Viewport -->
                <div class="carousel-container group" style="background: transparent;">
                    <div class="carousel-track">
                        ${slidesHtml}
                    </div>
                    <button class="carousel-btn carousel-prev">&larr;</button>
                    <button class="carousel-btn carousel-next">&rarr;</button>
                </div>
                <!-- Thumbnail Navigation -->
                <div class="carousel-thumbs">
                    ${thumbsHtml}
                </div>
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
          <div class="split-visual center-visual" style="max-width: 1000px; width: 100%; background: transparent; border-radius: 20px;">
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
        <div class="hero-visual" style="flex: 1.2; min-width: 300px; position: relative; min-height: 480px; display: flex; align-items: center; justify-content: center; margin-top: -80px; perspective: 1000px;">
            <div class="float-wrap float-1" style="position: absolute; right: 0; top: 0%; width: 55%; max-width: 350px; z-index: 1;">
                <img class="hero-layer layer-1" src="screenshots/Moachat_home_page.png" alt="Home" style="width: 100%; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); pointer-events: none;" />
            </div>
            <div class="float-wrap float-2" style="position: absolute; left: 20%; top: 30%; width: 45%; max-width: 280px; z-index: 2;">
                <img class="hero-layer layer-2" src="screenshots/Mohub.png" alt="Hub" style="width: 100%; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); pointer-events: none;" />
            </div>
            <div class="float-wrap float-3" style="position: absolute; left: 10%; bottom: 5%; width: 30%; max-width: 200px; z-index: 3;">
                <img class="hero-layer layer-3" src="screenshots/Share_Action.png" alt="Share" style="width: 100%; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); pointer-events: none;" />
            </div>
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
        position: relative; overflow: hidden; height: 500px; width: 100%;
        background: transparent !important; border: none !important; box-shadow: none !important;
    }
    .carousel-track {
        display: flex; height: 100%; width: 100%; position: relative; overflow: hidden;
    }
    .carousel-slide {
        position: absolute; inset: 0;
        opacity: 0; transition: opacity 0.3s ease-in-out;
        pointer-events: none; z-index: 0;
        display: flex; align-items: center; justify-content: center;
    }
    .carousel-slide.active { opacity: 1; pointer-events: auto; z-index: 10; }
    .carousel-slide img { 
        max-width: 100%; max-height: 100%; object-fit: contain; 
        margin: 0 auto; display: block; border-radius: 16px;
        border: none !important; box-shadow: none !important; background: transparent !important;
    }
    
    .carousel-btn {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
        color: white; cursor: pointer; z-index: 20;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s; opacity: 0; backdrop-filter: blur(8px);
    }
    .group:hover .carousel-btn { opacity: 1; }
    .carousel-btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-50%) scale(1.1); box-shadow: 0 0 0 2px rgba(255,255,255,0.3); }
    .carousel-prev { left: 16px; }
    .carousel-next { right: 16px; }

    .carousel-thumbs {
        display: flex; justify-content: center; gap: 12px;
        width: 100%; overflow-x: auto; padding-bottom: 8px;
    }
    .carousel-thumb {
        position: relative; flex-shrink: 0;
        width: 60px; height: 80px; border-radius: 8px;
        overflow: hidden; cursor: pointer;
        border: none; outline: none; background: transparent;
        transition: all 0.3s; opacity: 0.5;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
        transform: scale(0.95);
    }
    @media (min-width: 640px) {
        .carousel-thumb { width: 70px; height: 95px; }
    }
    .carousel-thumb:hover { opacity: 1; transform: scale(1); }
    .carousel-thumb.active {
        opacity: 1; transform: scale(1);
        box-shadow: 0 0 0 2px white;
    }
    .carousel-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .carousel-thumb.active::after {
        content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.1);
    }

    /* Side features image handling */
    .side-visual { background: transparent; display: flex; align-items: center; justify-content: center; }
    .side-visual img { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 12px; }

    @media (min-width: 900px) {
        .feature-split.force-reverse { flex-direction: row-reverse !important; }
    }

    /* Hero Floating & Parallax Effects */
    @keyframes floaty1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(1deg); } }
    @keyframes floaty2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-1deg); } }
    @keyframes floaty3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }

    .float-1 { animation: floaty1 6s ease-in-out infinite; }
    .float-2 { animation: floaty2 5.5s ease-in-out infinite 0.5s; }
    .float-3 { animation: floaty3 7s ease-in-out infinite 1s; }

    .hero-layer {
        transition: transform 0.15s ease-out;
        transform-style: preserve-3d;
        will-change: transform;
    }
`;

const jsCode = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const visualContainer = container.closest('.split-visual');
            const slides = container.querySelectorAll('.carousel-slide');
            const thumbs = visualContainer.querySelectorAll('.carousel-thumb');
            const prev = container.querySelector('.carousel-prev');
            const next = container.querySelector('.carousel-next');
            let currentIndex = 0;
            let timeoutId;
            let isHovered = false;

            function startAutoplay() {
                clearTimeout(timeoutId);
                if (!isHovered) {
                    timeoutId = setTimeout(() => goToSlide(currentIndex + 1), 4000);
                }
            }

            visualContainer.addEventListener('mouseenter', () => { isHovered = true; clearTimeout(timeoutId); });
            visualContainer.addEventListener('mouseleave', () => { isHovered = false; startAutoplay(); });

            function goToSlide(index) {
                if(index < 0) index = slides.length - 1;
                if(index >= slides.length) index = 0;
                currentIndex = index;
                
                slides.forEach((s, i) => {
                    const isActive = i === currentIndex;
                    s.classList.toggle('active', isActive);
                    if (isActive) {
                        const title = s.getAttribute('data-title');
                        const desc = s.getAttribute('data-desc');
                        const wrapper = container.closest('.carousel-wrapper');
                        if (wrapper) {
                            const titleEl = wrapper.querySelector('.slide-title');
                            const descEl = wrapper.querySelector('.slide-desc');
                            if (titleEl) titleEl.innerText = title;
                            if (descEl) descEl.innerText = desc;
                        }
                    }
                });
                
                thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
                startAutoplay();
            }

            if(prev) prev.addEventListener('click', () => goToSlide(currentIndex - 1));
            if(next) next.addEventListener('click', () => goToSlide(currentIndex + 1));
            thumbs.forEach((t, i) => t.addEventListener('click', () => goToSlide(i)));
            
            startAutoplay();
        });

        // Hero Mouse Parallax
        const heroVisual = document.querySelector('.hero-visual');
        const layers = document.querySelectorAll('.hero-layer');
        if (heroVisual) {
            heroVisual.addEventListener('mousemove', (e) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                layers.forEach((layer, index) => {
                    const depth = (index + 1) * 8; 
                    const rotateX = -deltaY * depth * 0.4;
                    const rotateY = deltaX * depth * 0.4;
                    const translateX = -deltaX * depth * 1.5;
                    const translateY = -deltaY * depth * 1.5;
                    
                    layer.style.transform = \`translate(\${translateX}px, \${translateY}px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
                });
            });

            heroVisual.addEventListener('mouseleave', () => {
                layers.forEach(layer => {
                    layer.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
                });
            });
        }
    });
  </script>
`;

let cleanedHtml = modifiedHtml;

let hasBody = cleanedHtml.includes('</body>');
if(cleanedHtml.includes('<!-- CAROUSEL SCRIPT -->')) {
    cleanedHtml = cleanedHtml.substring(0, cleanedHtml.indexOf('<!-- CAROUSEL SCRIPT -->'));
    hasBody = false;
}
if(cleanedHtml.includes('</style>')) {
    const lastStyleIndex = cleanedHtml.lastIndexOf('</style>');
    cleanedHtml = cleanedHtml.substring(0, lastStyleIndex) + styles + '</style>' + cleanedHtml.substring(lastStyleIndex + 8);
}

let finalHtml = cleanedHtml;
if (hasBody) {
    finalHtml = finalHtml.replace('</body>', '<!-- CAROUSEL SCRIPT -->\n' + jsCode + '\n</body>');
} else {
    finalHtml = finalHtml + '\n<!-- CAROUSEL SCRIPT -->\n' + jsCode + '\n</body>\n</html>';
}
fs.writeFileSync(indexHtmlPath, finalHtml);
console.log("Successfully rebuilt index.html");
