document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    let allPosts = [];
    let displayedCount = 0;
    const increment = 6;

    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            allPosts = await response.json();
            // Sort by date descending
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderNextBatch();
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p class="col-span-full text-center text-on-surface-variant">시스템 데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    function renderNextBatch() {
        const nextBatch = allPosts.slice(displayedCount, displayedCount + increment);
        nextBatch.forEach((post, index) => {
            const card = createPostCard(post, index);
            postsGrid.appendChild(card);
        });
        
        displayedCount += nextBatch.length;
        
        if (displayedCount >= allPosts.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    function createPostCard(post, index) {
        const article = document.createElement('article');
        article.className = 'group relative p-8 rounded-2xl bg-surface-container-highest/40 border border-outline-variant/10 backdrop-blur-md hover:bg-surface-container-highest transition-all duration-300 cursor-pointer overflow-hidden';
        article.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        article.style.opacity = '0';
        
        article.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-mono text-xs text-primary px-2 py-1 bg-primary/10 rounded-full">${post.category}</span>
                    <span class="font-mono text-[10px] text-on-surface-variant/50">${post.date}</span>
                </div>
                <h3 class="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">${post.title}</h3>
                <p class="text-on-surface-variant text-sm mb-6 line-clamp-3 leading-relaxed">${post.excerpt}</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/5">
                    <span class="text-xs font-mono text-on-surface-variant/60">${post.readTime} read</span>
                    <span class="text-primary group-hover:translate-x-1 transition-transform">
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                </div>
            </div>
        `;
        
        article.onclick = () => {
            window.location.href = `post.html?id=${post.id}`;
        };
        
        return article;
    }

    loadMoreBtn.addEventListener('click', renderNextBatch);
    fetchPosts();
});

// Animation for cards
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
