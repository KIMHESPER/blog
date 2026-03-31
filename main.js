document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
            updateIcon('light-theme');
        } else {
            body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
            updateIcon('dark-theme');
        }
    });

    function updateIcon(theme) {
        if (theme === 'dark-theme') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // 2. Load Posts
    const postsGrid = document.getElementById('posts-grid');

    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.warn('Error fetching posts, using fallback data:', error);
            // Fallback for local viewing (CORS)
            const fallbackPosts = [
                {
                    "id": 1,
                    "title": "Hello World: 포인터를 정복하는 그날까지",
                    "excerpt": "드디어 컴퓨터소프트웨어공학과 24학번으로 입학했습니다! 기초부터 차근차근 배우고 있습니다.",
                    "date": "2026-03-02",
                    "category": "Daily Log",
                    "readTime": "3 min"
                },
                {
                    "id": 2,
                    "title": "왜 컴퓨터소프트웨어공학과인가?",
                    "excerpt": "소프트웨어로 세상을 이롭게 하고 싶은 제 꿈과 포부를 담았습니다.",
                    "date": "2026-03-15",
                    "category": "Thought",
                    "readTime": "5 min"
                }
            ];
            renderPosts(fallbackPosts);
        }
    }

    function renderPosts(posts) {
        postsGrid.innerHTML = '';
        posts.forEach((post, index) => {
            const card = document.createElement('article');
            card.className = 'glass-card post-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="card-meta">
                    <span class="category">${post.category}</span>
                    <span class="date">${post.date}</span>
                </div>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <div class="card-footer">
                    <span class="read-more">Learn More <i class="fas fa-arrow-right"></i></span>
                    <span class="read-time" style="font-size: 0.8rem; color: var(--text-muted); float: right;">${post.readTime} read</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                alert(`"${post.title}" 글은 현재 준비 중입니다!`);
            });
            
            postsGrid.appendChild(card);
        });
    }

    fetchPosts();

    // 3. Header Scroll Effect & Nav Highlighting
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Header padding/shadow
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = 'var(--glass-shadow)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }

        // Active link highlighting
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});
