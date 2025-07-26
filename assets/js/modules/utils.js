// /assets/js/modules/utils.js

export function setActiveSidebarLink() {
    const currentPath = window.location.pathname.endsWith('/') || window.location.pathname === '' ? '/index.html' : window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPath) {
            link.classList.add('active');
        } 
        else if (currentPath.startsWith('/posts/') && linkHref.includes('posts.html')) {
            link.classList.add('active');
        }
    });
}

export function replayIntro() {
    sessionStorage.removeItem('hasVisited');
    window.location.href = '/index.html';
}

// EKSİK OLAN VE YENİ EKLENEN FONKSİYON
export function setupReplayButton() {
    const replayButton = document.getElementById('replay-animation-btn');
    if (replayButton) {
        replayButton.addEventListener('click', replayIntro);
    }
}

export function setupReadingProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}