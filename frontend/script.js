document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.getElementById('loadingScreen')?.classList.add('hidden');
        }, 1500);
    });

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('open');
            this.querySelector('i').className = navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        });
    }

    // Back to Top
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    animatedElements.forEach(el => observer.observe(el));

    // Active Nav Link
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + (header?.offsetHeight || 0) + 50;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('✅ EANSR Website loaded successfully!');
    console.log('📌 Developed by Menna Fayez');
});