// FloatVid Landing Page - Main TypeScript Entry Point
import './styles.css';

// DOM Elements
const ctaButton = document.querySelector('.cta-button') as HTMLAnchorElement;
const video = document.querySelector('video') as HTMLVideoElement;

// Initialize landing page interactions
function init(): void {
    setupCTAButton();
    setupVideoDemo();
    addSmoothScrolling();
}

// Setup CTA button interactions
function setupCTAButton(): void {
    if (ctaButton) {
        ctaButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            // Show coming soon alert
            alert('Coming Soon! Sign up for updates below.');
        });
    }
}

// Setup video demo functionality
function setupVideoDemo(): void {
    if (video) {
        // Add video event listeners for demo purposes
        video.addEventListener('play', () => {
            console.log('Demo video started playing');
        });

        video.addEventListener('pause', () => {
            console.log('Demo video paused');
        });

        video.addEventListener('ended', () => {
            console.log('Demo video ended');
            // Reset to beginning
            video.currentTime = 0;
        });
    }
}

// Add smooth scrolling for better UX
function addSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const target = anchor.getAttribute('href') as string;
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add intersection observer for animations
function setupScrollAnimations(): void {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature cards and sections
    document.querySelectorAll('.feature-card, .demo-video, .supported-sites, .how-to-use').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS classes for animations
const animationStyles = `
.feature-card, .demo-video, .supported-sites, .how-to-use {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.feature-card.animate-in, .demo-video.animate-in, 
.supported-sites.animate-in, .how-to-use.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.feature-card:nth-child(2).animate-in {
    transition-delay: 0.1s;
}

.feature-card:nth-child(3).animate-in {
    transition-delay: 0.2s;
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Setup scroll animations after a short delay
setTimeout(setupScrollAnimations, 100);

export { }; // Make this a module
