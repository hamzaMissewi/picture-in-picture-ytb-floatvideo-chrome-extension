// FloatVid Landing Page - Main TSX Entry Point
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import './styles.css';

// Types for better type safety
interface FeatureCard {
    icon: string;
    title: string;
    description: string;
}

interface Step {
    number: number;
    title: string;
    description: string;
}

interface SiteBadge {
    name: string;
}

// Data for the landing page
const features: FeatureCard[] = [
    {
        icon: '🎬',
        title: 'Universal Support',
        description: 'Works on YouTube, Netflix, Twitch, and virtually any video website with HTML5 video players.'
    },
    {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Instant Picture-in-Picture activation with a single click or keyboard shortcut (Ctrl+Shift+P).'
    },
    {
        icon: '🎯',
        title: 'Smart Detection',
        description: 'Automatically detects videos on page and provides intuitive controls for floating them.'
    }
];

const steps: Step[] = [
    {
        number: 1,
        title: 'Install Extension',
        description: 'Add FloatVid to your Chrome browser from the Chrome Web Store'
    },
    {
        number: 2,
        title: 'Visit Video Site',
        description: 'Navigate to any website with video content like YouTube or Netflix'
    },
    {
        number: 3,
        title: 'Click or Use Shortcut',
        description: 'Click extension icon or press Ctrl+Shift+P to float video'
    },
    {
        number: 4,
        title: 'Enjoy Multitasking',
        description: 'Watch videos while browsing, working, or using other apps'
    }
];

const supportedSites: SiteBadge[] = [
    { name: 'YouTube' },
    { name: 'Netflix' },
    { name: 'Twitch' },
    { name: 'Vimeo' },
    { name: 'Dailymotion' },
    { name: 'Facebook' },
    { name: 'Twitter' },
    { name: 'Instagram' },
    { name: 'TikTok' },
    { name: 'And more!' }
];

// Event handlers with proper types
const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    alert('Coming Soon! Sign up for updates below.');
};

const handleVideoPlay = (): void => {
    console.log('Demo video started playing');
};

const handleVideoPause = (): void => {
    console.log('Demo video paused');
};

const handleVideoEnded = (): void => {
    console.log('Demo video ended');
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
        video.currentTime = 0;
    }
};

// TSX Components for better structure
// const Header = (): JSX.Element => (
//     <header>
//         <div className="logo">📺</div>
//         <h1>FloatVid</h1>
//         <p className="tagline">Smart Picture-in-Picture for any video</p>
//         <a href="#" className="cta-button" onClick={handleCTAClick}>Coming Soon to Chrome!</a>
//     </header>
// );

const FeatureSection = (): JSX.Element => (
    <section className="features">
        {features.map((feature, index) => (
            <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
            </div>
        ))}
    </section>
);

const DemoVideoSection = (): JSX.Element => (
    <section className="demo-video">
        <h2>See It In Action</h2>
        <div className="video-container">
            <video
                controls
                poster="https://via.placeholder.com/800x450/667eea/ffffff?text=FloatVid+Demo+Video"
                style={{ width: '100%', maxWidth: '800px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
            >
                <source src="demo.mp4" type="video/mp4" />
                <p>Your browser doesn't support video playback. <a href="demo.mp4">Download the demo video</a> instead.</p>
            </video>
        </div>
        <p className="video-description">Watch how FloatVid transforms your video experience with one-click Picture-in-Picture mode.</p>
    </section>
);

const SupportedSitesSection = (): JSX.Element => (
    <section className="supported-sites">
        <h2>Supported Sites</h2>
        <div className="sites-grid">
            {supportedSites.map((site, index) => (
                <div key={index} className="site-badge">{site.name}</div>
            ))}
        </div>
    </section>
);

const HowToUseSection = (): JSX.Element => (
    <section className="how-to-use">
        <h2>How to Use</h2>
        <div className="steps">
            {steps.map((step) => (
                <div key={step.number} className="step">
                    <div className="step-number">{step.number}</div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                </div>
            ))}
        </div>
    </section>
);

const Footer = (): JSX.Element => (
    <footer>
        <p>&copy; 2026 FloatVid. Made with ❤️ for better video multitasking.</p>
        <p style={{ marginTop: '1rem' }}>
            <a
                // href="https://github.com/hamza47/floatvid-chrome-extension"
                href="https://github.com/hamzaMissewi/floatvid-chrome-extension"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'white', textDecoration: 'underline', fontWeight: 500 }}
            >
                View on GitHub
            </a>
        </p>
    </footer>
);

// const MainComponent2 = (): JSX.Element => {
//     return (
//         <div className="container">
//             <section className="features">
//                 <div className="feature-card">
//                     <div className="feature-icon">🎬</div>
//                     <h3 className="feature-title">Universal Support</h3>
//                     <p className="feature-description">Works on YouTube, Netflix, Twitch, and virtually any video website with HTML5 video players.</p>
//                 </div>
//                 <div className="feature-card">
//                     <div className="feature-icon">⚡</div>
//                     <h3 className="feature-title">Lightning Fast</h3>
//                     <p className="feature-description">Instant Picture-in-Picture activation with a single click or keyboard shortcut (Ctrl+Shift+P).</p>
//                 </div>
//                 <div className="feature-card">
//                     <div className="feature-icon">🎯</div>
//                     <h3 className="feature-title">Smart Detection</h3>
//                     <p className="feature-description">Automatically detects videos on page and provides intuitive controls for floating them.</p>
//                 </div>
//             </section>

//             <section className="demo-video">
//                 <h2>See It In Action</h2>
//                 <div className="video-container">
//                     <video
//                         controls
//                         poster="https://via.placeholder.com/800x450/667eea/ffffff?text=FloatVid+Demo+Video"
//                         style={{ width: '100%', maxWidth: '800px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
//                     >
//                         <source src="demo.mp4" type="video/mp4" />
//                         <p>Your browser doesn't support video playback. <a href="demo.mp4">Download the demo video</a> instead.</p>
//                     </video>
//                 </div>
//                 <p className="video-description">Watch how FloatVid transforms your video experience with one-click Picture-in-Picture mode.</p>
//             </section>

//             <section className="supported-sites">
//                 <h2>Supported Sites</h2>
//                 <div className="sites-grid">
//                     <div className="site-badge">YouTube</div>
//                     <div className="site-badge">Netflix</div>
//                     <div className="site-badge">Twitch</div>
//                     <div className="site-badge">Vimeo</div>
//                     <div className="site-badge">Dailymotion</div>
//                     <div className="site-badge">Facebook</div>
//                     <div className="site-badge">Twitter</div>
//                     <div className="site-badge">Instagram</div>
//                     <div className="site-badge">TikTok</div>
//                     <div className="site-badge">And more!</div>
//                 </div>
//             </section>

//             <section className="how-to-use">
//                 <h2>How to Use</h2>
//                 <div className="steps">
//                     <div className="step">
//                         <div className="step-number">1</div>
//                         <h4>Install Extension</h4>
//                         <p>Add FloatVid to your Chrome browser from Chrome Web Store</p>
//                     </div>
//                     <div className="step">
//                         <div className="step-number">2</div>
//                         <h4>Visit Video Site</h4>
//                         <p>Navigate to any website with video content like YouTube or Netflix</p>
//                     </div>
//                     <div className="step">
//                         <div className="step-number">3</div>
//                         <h4>Click or Use Shortcut</h4>
//                         <p>Click the extension icon or press Ctrl+Shift+P to float the video</p>
//                     </div>
//                     <div className="step">
//                         <div className="step-number">4</div>
//                         <h4>Enjoy Multitasking</h4>
//                         <p>Watch videos while browsing, working, or using other apps</p>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

const MainComponent = (): JSX.Element => {
    return (
        // <div className="landing-page">
        <div className="container">
            <header>
                <div className="logo">📺</div>
                {/* <h1>FloatVid</h1> */}
                <p className="tagline">Smart Picture-in-Picture for any video</p>
                <a href="#" className="cta-button">Coming Soon to Chrome!</a>
            </header>

            <section className="features"
            //                     style={{
            //                         display: "grid",
            //                         grid- template  columns: repeat(auto-fit, minmax(300px, 1fr));
            //                 gap: 2rem;
            //                 margin-bottom: 3rem;
            // }}
            >
                <div className="feature-card">
                    <div className="feature-icon">🎬</div>
                    <h3 className="feature-title">Universal Support</h3>
                    <p className="feature-description">Works on YouTube, Netflix, Twitch, and virtually any video website with
                        HTML5 video players.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3 className="feature-title">Lightning Fast</h3>
                    <p className="feature-description">Instant Picture-in-Picture activation with a single click or keyboard
                        shortcut (Ctrl+Shift+P).</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3 className="feature-title">Smart Detection</h3>
                    <p className="feature-description">Automatically detects videos on the page and provides intuitive controls
                        for floating them.</p>
                </div>
            </section>

            <section className="demo-video">
                <h2>See It In Action</h2>
                <div className="video-container">
                    <video
                        controls
                        poster="https://via.placeholder.com/800x450/667eea/ffffff?text=FloatVid+Demo+Video"
                        style={{ width: '100%', maxWidth: '800px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                    >
                        <source src="demo.mp4" type="video/mp4" />
                        <p>Your browser doesn't support video playback. <a href="demo.mp4">Download the demo video</a>
                            instead.</p>
                    </video>
                </div>
                <p className="video-description">Watch how FloatVid transforms your video experience with one-click
                    Picture-in-Picture mode.</p>
            </section>

            <section className="supported-sites">
                <h2>Supported Sites</h2>
                <div className="sites-grid">
                    <div className="site-badge">YouTube</div>
                    <div className="site-badge">Netflix</div>
                    <div className="site-badge">Twitch</div>
                    <div className="site-badge">Vimeo</div>
                    <div className="site-badge">Dailymotion</div>
                    <div className="site-badge">Facebook</div>
                    <div className="site-badge">Twitter</div>
                    <div className="site-badge">Instagram</div>
                    <div className="site-badge">TikTok</div>
                    <div className="site-badge">And more!</div>
                </div>
            </section>

            <section className="how-to-use">
                <h2>How to Use</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4>Install Extension</h4>
                        <p>Add FloatVid to your Chrome browser from the Chrome Web Store</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4>Visit Video Site</h4>
                        <p>Navigate to any website with video content like YouTube or Netflix</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4>Click or Use Shortcut</h4>
                        <p>Click the extension icon or press Ctrl+Shift+P to float the video</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h4>Enjoy Multitasking</h4>
                        <p>Watch videos while browsing, working, or using other apps</p>
                    </div>
                </div>
            </section>

            <footer>
                <p>&copy; 2026 FloatVid. Made with ❤️ for better video multitasking.</p>
                <p >
                    <a href="https://github.com/hamza47/floatvid-chrome-extension" target="_blank" rel="noopener noreferrer" style={{ marginTop: '1rem', color: '#fff' }}>
                        View on GitHub
                    </a>
                </p>
            </footer >
        </div >
    );
};

// Main App component
const App = (): JSX.Element => {
    // Setup video event listeners
    useEffect(() => {
        const video = document.querySelector('video') as HTMLVideoElement;
        if (video) {
            video.addEventListener('play', handleVideoPlay);
            video.addEventListener('pause', handleVideoPause);
            video.addEventListener('ended', handleVideoEnded);
        }
    }, []);

    return (
        <div className="container">
            <MainComponent />
            {/* <Header />
            <FeatureSection />
            <DemoVideoSection />
            <SupportedSitesSection />
            <HowToUseSection />
            <Footer /> */}
        </div>
    );
};

// Initialize the app
const init = (): void => {
    // Add smooth scrolling
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

    // Setup scroll animations
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

    // Observe elements for animations
    document.querySelectorAll('.feature-card, .demo-video, .supported-sites, .how-to-use').forEach(el => {
        observer.observe(el);
    });
};

// Render the app with React
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

// Initialize additional features
init();

export { };
