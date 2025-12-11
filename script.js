// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenuLeft = document.querySelector('.nav-menu-left');
const navMenuRight = document.querySelector('.nav-menu-right');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

// Create combined mobile menu
let mobileNavMenu = null;
document.addEventListener('DOMContentLoaded', () => {
    // Create a single mobile menu that combines both left and right menus
    if (navMenuLeft && navMenuRight && !document.querySelector('.nav-menu.mobile-only')) {
        mobileNavMenu = document.createElement('ul');
        mobileNavMenu.className = 'nav-menu mobile-only';
        
        // Clone left menu items
        navMenuLeft.querySelectorAll('li').forEach(li => {
            const clonedLi = li.cloneNode(true);
            mobileNavMenu.appendChild(clonedLi);
        });
        
        // Clone right menu items
        navMenuRight.querySelectorAll('li').forEach(li => {
            const clonedLi = li.cloneNode(true);
            mobileNavMenu.appendChild(clonedLi);
        });
        
        // Insert after nav-wrapper
        const navWrapper = document.querySelector('.nav-wrapper');
        if (navWrapper) {
            navWrapper.appendChild(mobileNavMenu);
        }
    } else {
        mobileNavMenu = document.querySelector('.nav-menu.mobile-only') || document.querySelector('.nav-menu');
    }
});

function toggleMobileMenu() {
    if (!mobileNavMenu) return;
    
    const isActive = mobileNavMenu.classList.contains('active');
    mobileNavMenu.classList.toggle('active');
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.toggle('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.toggle('active');
    }
    // Prevent body scroll when menu is open
    if (!isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    if (!mobileNavMenu) return;
    
    mobileNavMenu.classList.remove('active');
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on overlay
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on a link
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link') && mobileNavMenu && mobileNavMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Booking form handling
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Booking data:', data);
        
        // Show success message
        alert('Ďakujeme za vašu rezerváciu! Čoskoro vás budeme kontaktovať.');
        
        // Reset form
        bookingForm.reset();
    });
}

// Set minimum date to today for date input
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Announcements Banner - No close functionality needed (text-only scrolling)

// Cookie consent
const cookieConsent = document.getElementById('cookie-consent');
const acceptCookies = document.getElementById('accept-cookies');
const rejectCookies = document.getElementById('reject-cookies');

// Check if user has already made a choice
const cookieChoice = localStorage.getItem('cookieConsent');

if (!cookieChoice && cookieConsent) {
    // Show cookie consent after a delay
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 1000);
}

if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('show');
    });
}

if (rejectCookies) {
    rejectCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        cookieConsent.classList.remove('show');
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Enhanced animation observer with stagger delay
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, index * 100); // Stagger delay
            staggerObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    // Animate section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        observer.observe(header);
    });

    // Animate cards with stagger effect
    const cardGroups = [
        { selector: '.advantage-card', stagger: true },
        { selector: '.service-card', stagger: true },
        { selector: '.review-card', stagger: true },
        { selector: '.main-service-card', stagger: true },
        { selector: '.info-card', stagger: true },
        { selector: '.partner-card', stagger: true },
        { selector: '.service-link-card', stagger: true }
    ];

    cardGroups.forEach(group => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach((el, index) => {
            el.classList.add('animate-on-scroll', 'animate-fade-up');
            if (group.stagger) {
                staggerObserver.observe(el);
            } else {
                observer.observe(el);
            }
        });
    });

    // Animate sections themselves (except statistics-section which has its own observer)
    const sections = document.querySelectorAll('section:not(.hero):not(.statistics-section)');
    sections.forEach((section, index) => {
        section.classList.add('animate-on-scroll', 'animate-fade-up');
        observer.observe(section);
    });

    // Animate contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll', 'animate-fade-left');
        setTimeout(() => {
            staggerObserver.observe(item);
        }, index * 50);
    });

    // Animate map container
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.classList.add('animate-on-scroll', 'animate-fade-scale');
        observer.observe(mapContainer);
    }

    // Animate charging card
    const chargingCard = document.querySelector('.charging-card');
    if (chargingCard) {
        chargingCard.classList.add('animate-on-scroll', 'animate-fade-up');
        observer.observe(chargingCard);
    }

    // Animate pricing tabs
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    pricingTabs.forEach((tab, index) => {
        tab.classList.add('animate-on-scroll', 'animate-fade-up');
        setTimeout(() => {
            staggerObserver.observe(tab);
        }, index * 50);
    });

    // Announcement cards should be visible immediately (no animation delay)
    const announcementCards = document.querySelectorAll('.announcement-card');
    announcementCards.forEach((card) => {
        // Remove any animation classes and make visible immediately
        card.classList.remove('animate-on-scroll', 'animate-fade-right', 'animate-fade-up', 'animate-fade-left', 'animate-fade-scale');
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
});

// Hero video setup
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Set video properties
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        
        // Force play function
        const playVideo = async () => {
            try {
                await heroVideo.play();
            } catch (err) {
                console.log('Video autoplay failed, will retry:', err);
                // Retry on user interaction
                const retryPlay = () => {
                    heroVideo.play().catch(e => console.log('Retry play failed:', e));
                };
                document.addEventListener('click', retryPlay, { once: true });
                document.addEventListener('touchstart', retryPlay, { once: true });
            }
        };
        
        // Try to play immediately if video is already loaded
        if (heroVideo.readyState >= 3) {
            playVideo();
        }
        
        // Play when video can start playing
        heroVideo.addEventListener('canplay', playVideo, { once: true });
        heroVideo.addEventListener('loadeddata', playVideo, { once: true });
        
        // Also try on loadedmetadata
        heroVideo.addEventListener('loadedmetadata', () => {
            if (heroVideo.readyState >= 2) {
                playVideo();
            }
        }, { once: true });
        
        // Error handling with fallback
        heroVideo.addEventListener('error', (e) => {
            console.error('Video loading error:', e, heroVideo.error);
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundImage = "url('200358324_2030190010482436_7737746352101166953_n.jpg')";
                hero.style.backgroundSize = 'cover';
                hero.style.backgroundPosition = 'center';
                hero.style.backgroundRepeat = 'no-repeat';
            }
        });
        
        // Ensure video plays when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && heroVideo.paused) {
                    playVideo();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(heroVideo);
        
        // Fallback: try to play after a short delay
        setTimeout(() => {
            if (heroVideo.paused) {
                playVideo();
            }
        }, 500);
    }
});

// Hero scroll button
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// Form validation enhancement
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.checkValidity()) {
            input.classList.add('valid');
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }
    });
});

// Add loading state to form submission
const bookingFormForLoading = document.querySelector('.booking-form') || document.querySelector('#bookingForm');
if (bookingFormForLoading) {
    bookingFormForLoading.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Odosielam...';
            
            // Re-enable after 2 seconds (in real app, this would be after server response)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Rezervovať termín';
            }, 2000);
        }
    });
}

// Pricing tabs functionality
const pricingTabs = document.querySelectorAll('.pricing-tab');
const pricingContents = document.querySelectorAll('.pricing-content');

if (pricingTabs.length > 0) {
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Animated Counter for Statistics
function animateCounter(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const endTime = startTime + duration;
    
    const updateCounter = () => {
        const now = performance.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        // Format number with thousand separators (space instead of comma for Slovak)
        let formattedValue = current.toLocaleString('sk-SK').replace(/,/g, ' ');
        element.textContent = formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is displayed (with space as thousand separator)
            element.textContent = target.toLocaleString('sk-SK').replace(/,/g, ' ') + suffix;
        }
    };
    
    updateCounter();
}

// Hero Statistics counter observer
let heroStatisticsAnimated = false;
const heroStatisticsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !heroStatisticsAnimated) {
            heroStatisticsAnimated = true;
            
            const statistics = entry.target.querySelectorAll('.hero-statistic-item');
            statistics.forEach((stat, index) => {
                const numberElement = stat.querySelector('.hero-statistic-number');
                const originalText = numberElement.textContent.trim();
                
                // Extract number and suffix from text
                const match = originalText.match(/([\d\s,]+)([+%]?)/);
                if (match) {
                    const numberStr = match[1].replace(/[\s,]/g, '');
                    const suffix = match[2] || '';
                    const targetNumber = parseInt(numberStr, 10);
                    
                    if (!isNaN(targetNumber) && !numberElement.hasAttribute('data-animated')) {
                        // Mark as animated to prevent multiple triggers
                        numberElement.setAttribute('data-animated', 'true');
                        
                        // Add animated class to item
                        stat.classList.add('animated');
                        
                        // Reset to 0 initially - this will be visible immediately
                        numberElement.textContent = '0' + suffix;
                        
                        // Start animation immediately with a small delay for staggered effect
                        setTimeout(() => {
                            animateCounter(numberElement, targetNumber, suffix, 2000);
                        }, index * 200);
                    }
                }
            });
            
            // Stop observing after animation starts
            heroStatisticsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px 0px 0px'
});

// Statistics counter observer (for old statistics section if it exists)
let statisticsAnimated = false;
const statisticsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statisticsAnimated) {
            statisticsAnimated = true;
            entry.target.classList.add('animated');
            
            const statistics = entry.target.querySelectorAll('.statistic-item');
            statistics.forEach((stat, index) => {
                const numberElement = stat.querySelector('.statistic-number');
                const originalText = numberElement.textContent.trim();
                
                // Extract number and suffix from text
                const match = originalText.match(/([\d\s,]+)([+%]?)/);
                if (match) {
                    const numberStr = match[1].replace(/[\s,]/g, '');
                    const suffix = match[2] || '';
                    const targetNumber = parseInt(numberStr, 10);
                    
                    if (!isNaN(targetNumber) && !numberElement.hasAttribute('data-animated')) {
                        // Mark as animated to prevent multiple triggers
                        numberElement.setAttribute('data-animated', 'true');
                        
                        // Reset to 0 initially - this will be visible immediately
                        numberElement.textContent = '0' + suffix;
                        
                        // Start animation immediately with a small delay for staggered effect
                        setTimeout(() => {
                            animateCounter(numberElement, targetNumber, suffix, 2000);
                        }, index * 200);
                    }
                }
            });
            
            // Stop observing after animation starts
            statisticsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

// Language Switcher - Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'sk';

    // Set initial language
    document.documentElement.lang = currentLang;
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Add event listeners to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    // Initialize language on page load
    updateLanguage(currentLang);

    // Observe hero statistics for animation
    const heroStatistics = document.querySelector('.hero-statistics');
    if (heroStatistics) {
        heroStatisticsObserver.observe(heroStatistics);
    }

    // Observe statistics section for animation (if it still exists)
    const statisticsSection = document.querySelector('.statistics-section');
    if (statisticsSection) {
        statisticsObserver.observe(statisticsSection);
    }
});

// Language translations
const translations = {
    sk: {
        'status-closed': 'ZATVORENÉ',
        'nonstop': 'NONSTOP',
        'nav-home': 'Úvod',
        'nav-inspections': 'Kontroly',
        'nav-services': 'Služby',
        'nav-pricing': 'Cenník',
        'nav-reviews': 'Recenzie',
        'nav-contact': 'Kontakt',
        'nav-about': 'O nás',
        'nav-booking': 'Rezervovať',
        'hero-title': 'JP Control s.r.o.',
        'hero-subtitle': 'Vaša spoľahlivá stanica technickej kontroly v Bratislavskom kraji',
        'hero-cta': 'Rezervovať termín online',
        'section-advantages': 'Výhody u nás',
        'section-advantages-sub': 'Prečo si vybrať práve nás',
        'advantage-1-title': 'Odvoz/dovoz zadarmo',
        'advantage-1-text': 'Ak sa potrebujete počas kontroly nečakane dostaviť na neplánované stretnutie, vieme Vám zabezpečiť odvoz aj dovoz k nám. (do 10 km)',
        'advantage-2-title': 'Prídeme si pre Vaše vozidlo',
        'advantage-2-text': 'Nemôžete sa k nám osobne dostaviť na kontrolu? Prídeme si po Vaše vozidlo a po kontrole Vám ho privezieme späť. (do 10 km)',
        'advantage-3-title': 'NONSTOP pre nákladné vozidlá',
        'advantage-3-text': 'Po telefonickej objednávke aj mimo otváracích hodín. BEZ PRÍPLATKU',
        'advantage-4-title': 'Zapožičanie prevozných ŠPZ',
        'advantage-4-text': 'Pre potreby KO a STK v rámci SR',
        'tech-control-title': 'TECHNICKÁ KONTROLA',
        'tech-control-desc': 'Technická kontrola vozidla (STK) je povinná kontrola, ktorá sa vykonáva v pravidelných intervaloch podľa veku a typu vozidla. Naša STK zabezpečuje komplexnú kontrolu všetkých kritických súčastí vozidla.',
        'tech-control-what': 'Čo kontrolujeme:',
        'emission-control-title': 'EMISNÁ KONTROLA',
        'emission-control-desc': 'Emisná kontrola (EK) je povinná kontrola emisií škodlivých látok vo výfukových plynoch vozidla. Kontrola sa vykonáva súčasne s technickou kontrolou alebo samostatne.',
        'emission-control-what': 'Čo kontrolujeme:',
        'originality-control-title': 'KONTROLA ORIGINALITY',
        'originality-control-desc': 'Kontrola originality (KO) je kontrola, ktorá sa vykonáva pri dovoze vozidla zo zahraničia, vývoze, zmenách vlastníctva alebo pri zmenách na vozidle (napr. zmena farby).',
        'originality-control-when': 'Kedy je potrebná:',
        'originality-control-what': 'Čo kontrolujeme:',
        'section-services': 'Doplnkové služby a poradenstvo',
        'section-services-sub': 'Kompletná ponuka služieb pre vaše vozidlo',
        'section-pricing': 'Cenník služieb',
        'section-pricing-sub': 'Transparentné ceny pre všetky naše služby',
        'section-reviews': 'Napísali o nás',
        'section-reviews-sub': 'Recenzie našich zákazníkov',
        'section-charging': 'Dobíjanie elektromobilov',
        'section-charging-sub': 'Rýchle a pohodlné dobíjanie vášho elektromobilu',
        'charging-title': 'Dobíjacia stanica',
        'charging-desc': 'Naša STK je vybavená modernou dobíjacou stanicou pre elektromobily. Počas čakania na kontrolu môžete pohodlne dobiť svoje vozidlo.',
        'charging-feature-1': 'Rýchle dobíjanie',
        'charging-feature-2': 'Dostupné počas otváracích hodín',
        'charging-feature-3': 'Kontaktujte nás pre ceny',
        'charging-btn': 'Kontaktovať',
        'section-additional': 'Ďalšie služby',
        'section-additional-sub': 'Pozrite si naše ďalšie služby a partnerov',
        'service-boutique-title': 'Botique',
        'service-boutique-desc': 'Oblečenie a módne doplnky',
        'service-container-title': 'Kontajnerová služba',
        'service-container-desc': 'Prenájom kontajnerov',
        'service-vinomat-title': 'Vinomat',
        'service-vinomat-desc': 'Predaj vína a alkoholických nápojov',
        'section-partners': 'Naši partneri',
        'section-partners-sub': 'Spolupracujeme s overenými partnermi',
        'section-contact': 'Kontakt',
        'section-contact-sub': 'Kontaktujte nás ešte dnes',
        'contact-phone': 'Telefón',
        'contact-email': 'Email',
        'contact-address': 'Adresa',
        'opening-hours': 'Otváracie hodiny',
        'show-map': 'Zobraziť na mape',
        'map-title': 'Kde nás nájdete',
        'about-title': 'O nás',
        'footer-links': 'Rýchle odkazy',
        'footer-contact': 'Kontakt'
    },
    en: {
        'status-closed': 'CLOSED',
        'nonstop': 'NONSTOP',
        'nav-home': 'Home',
        'nav-inspections': 'Inspections',
        'nav-services': 'Services',
        'nav-pricing': 'Pricing',
        'nav-reviews': 'Reviews',
        'nav-contact': 'Contact',
        'nav-about': 'About Us',
        'nav-booking': 'Book',
        'hero-title': 'JP Control s.r.o.',
        'hero-subtitle': 'Your reliable vehicle inspection station in Bratislava region',
        'hero-cta': 'Book appointment online',
        'section-advantages': 'Our Advantages',
        'section-advantages-sub': 'Why choose us',
        'advantage-1-title': 'Free pickup/delivery',
        'advantage-1-text': 'If you need to attend an unexpected meeting during the inspection, we can arrange pickup and delivery to us. (up to 10 km)',
        'advantage-2-title': 'We come to pick up your vehicle',
        'advantage-2-text': 'Can\'t come to us in person for inspection? We\'ll come pick up your vehicle and bring it back after inspection. (up to 10 km)',
        'advantage-3-title': 'NONSTOP for trucks',
        'advantage-3-text': 'By phone appointment even outside opening hours. NO SURCHARGE',
        'advantage-4-title': 'Loan of transport license plates',
        'advantage-4-text': 'For KO and STK needs within Slovakia',
        'tech-control-title': 'TECHNICAL INSPECTION',
        'tech-control-desc': 'Vehicle technical inspection (STK) is a mandatory inspection performed at regular intervals according to the age and type of vehicle. Our STK ensures comprehensive inspection of all critical vehicle components.',
        'tech-control-what': 'What we check:',
        'emission-control-title': 'EMISSION CONTROL',
        'emission-control-desc': 'Emission control (EK) is a mandatory inspection of harmful substance emissions in vehicle exhaust gases. The inspection is performed simultaneously with technical inspection or separately.',
        'emission-control-what': 'What we check:',
        'originality-control-title': 'ORIGINALITY CONTROL',
        'originality-control-desc': 'Originality control (KO) is an inspection performed when importing a vehicle from abroad, exporting, changing ownership, or changes to the vehicle (e.g., color change).',
        'originality-control-when': 'When is it needed:',
        'originality-control-what': 'What we check:',
        'section-services': 'Additional Services and Consulting',
        'section-services-sub': 'Complete range of services for your vehicle',
        'section-pricing': 'Service Pricing',
        'section-pricing-sub': 'Transparent prices for all our services',
        'section-reviews': 'What They Say About Us',
        'section-reviews-sub': 'Customer reviews',
        'section-charging': 'Electric Vehicle Charging',
        'section-charging-sub': 'Fast and convenient charging for your electric vehicle',
        'charging-title': 'Charging Station',
        'charging-desc': 'Our STK is equipped with a modern charging station for electric vehicles. While waiting for inspection, you can conveniently charge your vehicle.',
        'charging-feature-1': 'Fast charging',
        'charging-feature-2': 'Available during opening hours',
        'charging-feature-3': 'Contact us for prices',
        'charging-btn': 'Contact',
        'section-additional': 'Additional Services',
        'section-additional-sub': 'Check out our other services and partners',
        'service-boutique-title': 'Boutique',
        'service-boutique-desc': 'Clothing and fashion accessories',
        'service-container-title': 'Container Service',
        'service-container-desc': 'Container rental and removal',
        'service-vinomat-title': 'Wine Shop',
        'service-vinomat-desc': 'Wine and alcoholic beverages',
        'section-partners': 'Our Partners',
        'section-partners-sub': 'We work with verified partners',
        'section-contact': 'Contact',
        'section-contact-sub': 'Contact us today',
        'contact-phone': 'Phone',
        'contact-email': 'Email',
        'contact-address': 'Address',
        'opening-hours': 'Opening Hours',
        'show-map': 'Show on map',
        'map-title': 'Find us',
        'about-title': 'About Us',
        'footer-links': 'Quick Links',
        'footer-contact': 'Contact'
    }
};

// Function to update language
function updateLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update text content with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        // Skip elements with nav-plates-container (license plates)
        if (element.querySelector('.nav-plates-container')) {
            return;
        }
        
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            // Check if element is input/textarea/button - use value or textContent
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translations[lang][key];
                } else {
                    element.placeholder = translations[lang][key];
                }
            } else {
                // For all other elements, use textContent
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Advantages Carousel - Auto-scroll with Manual Control via Arrows
document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.querySelector('.advantages-carousel-wrapper');
    const carousel = document.querySelector('.advantages-carousel');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (!carouselWrapper || !carousel || !prevBtn || !nextBtn) return;
    
    const cardWidth = 320; // max-width + gap (280px + 2rem gap)
    const totalCards = carousel.querySelectorAll('.advantage-card').length;
    const totalWidth = (totalCards / 2) * cardWidth; // Half because cards are duplicated
    
    let currentPosition = 0;
    let autoScrollInterval = null;
    let isManualMode = false;
    let resumeTimeout = null;
    
    // Start auto-scroll
    const startAutoScroll = () => {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        carousel.classList.add('auto-scroll');
        isManualMode = false;
        
        autoScrollInterval = setInterval(() => {
            if (!isManualMode) {
                currentPosition = (currentPosition - 2) % totalWidth;
                if (currentPosition < 0) currentPosition += totalWidth;
                carousel.style.transform = `translateX(-${currentPosition}px)`;
            }
        }, 50); // Update every 50ms for smooth scrolling
    };
    
    // Stop auto-scroll temporarily
    const pauseAutoScroll = () => {
        carousel.classList.remove('auto-scroll');
        isManualMode = true;
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };
    
    const scrollNext = () => {
        pauseAutoScroll();
        
        // Clear any existing timeout
        if (resumeTimeout) clearTimeout(resumeTimeout);
        
        // Move one card forward
        currentPosition = (currentPosition + cardWidth) % totalWidth;
        carousel.style.transform = `translateX(-${currentPosition}px)`;
        
        // Resume auto-scroll after 3 seconds
        resumeTimeout = setTimeout(() => {
            startAutoScroll();
        }, 3000);
    };
    
    const scrollPrev = () => {
        pauseAutoScroll();
        
        // Clear any existing timeout
        if (resumeTimeout) clearTimeout(resumeTimeout);
        
        // Move one card backward
        currentPosition = (currentPosition - cardWidth + totalWidth) % totalWidth;
        carousel.style.transform = `translateX(-${currentPosition}px)`;
        
        // Resume auto-scroll after 3 seconds
        resumeTimeout = setTimeout(() => {
            startAutoScroll();
        }, 3000);
    };
    
    nextBtn.addEventListener('click', scrollNext);
    prevBtn.addEventListener('click', scrollPrev);
    
    // Start auto-scroll on load
    startAutoScroll();
});

// Load notifications from API
async function loadNotifications() {
    const carousel = document.getElementById('hero-announcements-carousel');
    const wrapper = document.getElementById('hero-announcements-wrapper');
    
    if (!carousel || !wrapper) return;

    try {
        const response = await fetch('/api/notifications');
        const data = await response.json();

        if (response.ok && data.notifications && data.notifications.length > 0) {
            // Clear existing content
            carousel.innerHTML = '';

            // Create notification elements
            data.notifications.forEach(notification => {
                const span = document.createElement('span');
                span.className = 'hero-announcement-text';
                span.innerHTML = notification.text;
                carousel.appendChild(span);
            });

            // Duplicate for seamless carousel effect
            data.notifications.forEach(notification => {
                const span = document.createElement('span');
                span.className = 'hero-announcement-text';
                span.innerHTML = notification.text;
                carousel.appendChild(span);
            });

            // Apply custom colors from first notification (or use default)
            if (data.notifications.length > 0) {
                const firstNotification = data.notifications[0];
                wrapper.style.background = `linear-gradient(180deg, ${firstNotification.backgroundColor} 0%, ${firstNotification.backgroundGradient} 100%)`;
                wrapper.style.borderBottom = `2px solid ${firstNotification.borderColor}`;
                
                // Apply text color to all announcement texts
                const announcementTexts = carousel.querySelectorAll('.hero-announcement-text');
                announcementTexts.forEach(text => {
                    text.style.color = firstNotification.textColor;
                });
            }
        } else {
            // Fallback to default notifications if API fails or returns empty
            loadDefaultNotifications();
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
        // Fallback to default notifications on error
        loadDefaultNotifications();
    }
}

// Fallback function with default notifications
function loadDefaultNotifications() {
    const carousel = document.getElementById('hero-announcements-carousel');
    const wrapper = document.getElementById('hero-announcements-wrapper');
    
    if (!carousel || !wrapper) return;

    const defaultNotifications = [
        '📅 Celozávodná dovolenka: V dňoch <strong>31.12.2025 - 6.1.2026</strong> (vrátane) čerpáme celozávodnú dovolenku. Prajeme Vám príjemné prežitie vianočných sviatkov a šťastlivý Nový rok 2026. Tešíme sa na Vás <strong>07.01.2026</strong>.',
        '💰 Úprava cien služieb STK: Od <strong>1.11.2025</strong> dochádza k úprave ceny STK a KO pre osobné motorové vozidlá z pôvodných <strong>89 € na 99 €</strong>.'
    ];

    carousel.innerHTML = '';
    
    defaultNotifications.forEach(text => {
        const span = document.createElement('span');
        span.className = 'hero-announcement-text';
        span.innerHTML = text;
        carousel.appendChild(span);
    });

    // Duplicate for seamless carousel
    defaultNotifications.forEach(text => {
        const span = document.createElement('span');
        span.className = 'hero-announcement-text';
        span.innerHTML = text;
        carousel.appendChild(span);
    });
}

// Load notifications when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
});


