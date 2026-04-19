document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('scroll-container');
    const sideDots = document.getElementById('side-dots');
    let posts = [];

    // 1. Fetch Posts and Initialize
    async function initScrollytelling() {
        try {
            const response = await fetch('posts.json');
            posts = await response.json();
            renderPages();
            initObserver();
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    // 2. Render 50+ Full-Screen Pages
    function renderPages() {
        // Create Dots for Side Nav
        posts.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
            dot.id = `dot-${index + 1}`;
            dot.onclick = () => document.getElementById(`page-${index + 1}`).scrollIntoView();
            sideDots.appendChild(dot);
        });

        // Add a Hero dot for Page 0
        const heroDot = document.createElement('div');
        heroDot.className = 'nav-dot active';
        heroDot.id = 'dot-0';
        heroDot.onclick = () => document.getElementById('page-0').scrollIntoView();
        sideDots.prepend(heroDot);

        // Render sections
        posts.forEach((post, index) => {
            const section = document.createElement('section');
            section.id = `page-${index + 1}`;
            section.className = 'snap-section';
            
            // Random-ish theme logic (Cycling through 5 premium themes)
            const themes = [
                'from-primary/10 via-background to-surface',
                'from-purple-500/10 via-background to-surface',
                'from-blue-500/10 via-background to-surface',
                'from-emerald-500/10 via-background to-surface',
                'from-indigo-500/10 via-background to-surface'
            ];
            const themeClass = themes[index % themes.length];
            
            section.innerHTML = `
                <div class="absolute inset-0 bg-gradient-to-b ${themeClass} z-0 opacity-60"></div>
                <div class="absolute inset-0 pointer-events-none z-0">
                    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
                    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-pulse" style="animation-delay: 1s"></div>
                </div>

                <div class="max-w-7xl mx-auto px-8 w-full z-10 flex flex-col md:flex-row items-center gap-12">
                    <div class="flex-1 text-left">
                        <div class="flex items-center gap-3 mb-6 reveal-text">
                            <span class="font-mono text-sm text-primary uppercase tracking-[0.4em]">CHAPTER ${index + 1}</span>
                            <span class="w-12 h-[1px] bg-primary/30"></span>
                            <span class="font-mono text-xs text-on-surface-variant/50 uppercase">${post.category}</span>
                        </div>
                        <h2 class="font-headline text-5xl md:text-7xl font-black mb-8 leading-tight reveal-text reveal-delay-1">
                            ${post.title}
                        </h2>
                        <p class="text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl mb-12 reveal-text reveal-delay-2">
                            ${post.excerpt}
                        </p>
                        <div class="flex items-center gap-8 reveal-text reveal-delay-3">
                            <a href="post.html?id=${post.id}" class="group flex items-center gap-4 text-primary font-bold text-lg">
                                READ_FULL_ENTRY
                                <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </a>
                            <span class="font-mono text-xs text-on-surface-variant/40 italic">${post.readTime} read // ${post.date}</span>
                        </div>
                    </div>
                    <div class="hidden lg:block w-1/3 reveal-text reveal-delay-2">
                         <div class="aspect-square rounded-3xl border border-white/5 bg-white/5 backdrop-blur-3xl p-12 flex flex-col justify-center items-center text-center">
                             <span class="material-symbols-outlined text-8xl text-primary/20 mb-6">database</span>
                             <div class="font-mono text-xs text-on-surface-variant/30 space-y-1">
                                 <p>> GET /entry/${post.id}</p>
                                 <p>> STATUS: LOADED</p>
                                 <p>> INDEX: ${((index+1)/posts.length * 100).toFixed(0)}%</p>
                             </div>
                         </div>
                    </div>
                </div>
            `;
            scrollContainer.appendChild(section);
        });
    }

    // 3. Intersection Observer for Animations and Nav Update
    function initObserver() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Update dots
                    const pageId = entry.target.id;
                    const index = pageId.split('-')[1];
                    updateActiveDot(index);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.snap-section').forEach(section => {
            observer.observe(section);
        });
    }

    function updateActiveDot(activeIndex) {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            if (index == activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    initScrollytelling();

    // 4. Smooth Anchor Scrolling for Nav links (Page 0, 1 etc)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
