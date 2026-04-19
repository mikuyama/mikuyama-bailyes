function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    const text = code.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#128c7e';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const toc = document.querySelector('.toc');
    if (toc) {
        const sections = document.querySelectorAll('.api-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    toc.querySelectorAll('a').forEach(link => {
                        link.style.background = '';
                        if (link.getAttribute('href') === '#' + id) {
                            link.style.background = 'var(--surface-hover)';
                        }
                    });
                }
            });
        }, {
            rootMargin: '-100px 0px -80% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
});
