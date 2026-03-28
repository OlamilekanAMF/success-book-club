// CS50L Final Project JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Search Overlay Toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchField = document.querySelector('.search-field');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            if (searchField) {
                setTimeout(() => searchField.focus(), 100);
            }
        });
        
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
        
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
    
    // Partnership Form Handling
    const partnershipForm = document.getElementById('partnershipForm');
    if (partnershipForm) {
        partnershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const orgName = formData.get('orgName');
            const orgType = formData.get('orgType');
            const contactName = formData.get('contactName');
            const email = formData.get('email');
            const partnershipInterest = formData.get('partnershipInterest');
            const message = formData.get('message');
            
            let isValid = true;
            let errorMessage = '';
            
            if (!orgName || orgName.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter your organization name (at least 2 characters)';
            } else if (!orgType) {
                isValid = false;
                errorMessage = 'Please select your organization type';
            } else if (!contactName || contactName.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter your name (at least 2 characters)';
            } else if (!email || !validateEmail(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (!partnershipInterest) {
                isValid = false;
                errorMessage = 'Please select your partnership interest';
            } else if (!message || message.trim().length < 10) {
                isValid = false;
                errorMessage = 'Please describe your partnership idea (at least 10 characters)';
            }
            
            if (!isValid) {
                showNotification(errorMessage, 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your partnership inquiry! Our team will get back to you within 48 hours.', 'success');
                partnershipForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Partnership Learn More Buttons - Open Modal with Details
    const partnershipLearnMoreBtns = document.querySelectorAll('.partnership-card .btn');
    const partnershipModal = createPartnershipModal();
    document.body.appendChild(partnershipModal);
    
    const partnershipDetails = {
        author: {
            title: 'Authors & Publishers Partnership',
            description: 'Share your triumph stories with our engaged community of readers. We help authors connect with an audience that values inspiring, transformative literature.',
            benefits: [
                'Monthly book selections and featured reads',
                'Author event hosting and promotion',
                'Podcast interviews and appearances',
                'Community engagement and discussions',
                'Targeted promotion to interested readers'
            ],
            contact: 'authors@triumphantbookclub.com'
        },
        corporate: {
            title: 'Corporate & Brands Partnership',
            description: 'Connect with our values-driven audience through meaningful partnerships that align with your brand values and marketing goals.',
            benefits: [
                'Sponsored content and campaigns',
                'Event sponsorship and hosting',
                'Co-branded reading initiatives',
                'Employee wellness and reading programs',
                'Product sampling and promotions'
            ],
            contact: 'sponsorship@triumphantbookclub.com'
        },
        educational: {
            title: 'Educational Institutions Partnership',
            description: 'Bring inspiring literature to students and academic communities with curated programs designed for educational impact.',
            benefits: [
                'Curriculum integration and development',
                'Student reading programs',
                'Guest lectures and author visits',
                'Educational content creation',
                'Research collaboration opportunities'
            ],
            contact: 'partnerships@triumphantbookclub.com'
        },
        nonprofit: {
            title: 'Nonprofits & Organizations Partnership',
            description: 'Together we can make a difference through the power of stories. Partner with us to amplify your mission and reach more people.',
            benefits: [
                'Mission-aligned content partnerships',
                'Fundraising and awareness campaigns',
                'Community outreach programs',
                'Resource sharing and development',
                'Impact measurement and storytelling'
            ],
            contact: 'partnerships@triumphantbookclub.com'
        },
        media: {
            title: 'Media & Content Creators Partnership',
            description: 'Expand your reach through our diverse content platforms and collaborate on content that inspires and educates.',
            benefits: [
                'Content syndication and licensing',
                'Podcast collaborations and cross-promotion',
                'Video production and streaming',
                'Social media campaigns',
                'Expert interviews and features'
            ],
            contact: 'partnerships@triumphantbookclub.com'
        },
        retail: {
            title: 'Retail & Distribution Partnership',
            description: 'Make inspiring books more accessible to readers everywhere through our distribution network and retail partnerships.',
            benefits: [
                'Bookstore partnerships and events',
                'Online distribution networks',
                'Co-branded book bundles',
                'Reading space partnerships',
                'Promotional collaborations'
            ],
            contact: 'partnerships@triumphantbookclub.com'
        }
    };
    
    function createPartnershipModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'partnershipModal';
        modal.innerHTML = `
            <div class="partnership-modal-content">
                <button class="modal-close partnership-modal-close" aria-label="Close modal">&times;</button>
                <div class="partnership-modal-header">
                    <h2 id="modalTitle">Partnership Details</h2>
                </div>
                <div class="partnership-modal-body">
                    <p id="modalDescription"></p>
                    <h3>Key Benefits:</h3>
                    <ul id="modalBenefits"></ul>
                    <div class="partnership-modal-contact">
                        <p>Interested in this partnership?</p>
                        <a href="mailto:partnerships@triumphantbookclub.com" class="btn btn-primary" id="modalContactBtn">Contact Us</a>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }
    
    partnershipLearnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.partnership-card');
            const title = card.querySelector('h3').textContent;
            
            let key = 'author';
            if (title.toLowerCase().includes('corporate')) key = 'corporate';
            else if (title.toLowerCase().includes('educational')) key = 'educational';
            else if (title.toLowerCase().includes('nonprofit')) key = 'nonprofit';
            else if (title.toLowerCase().includes('media')) key = 'media';
            else if (title.toLowerCase().includes('retail')) key = 'retail';
            
            const details = partnershipDetails[key];
            
            document.getElementById('modalTitle').textContent = details.title;
            document.getElementById('modalDescription').textContent = details.description;
            
            const benefitsList = document.getElementById('modalBenefits');
            benefitsList.innerHTML = '';
            details.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
            
            document.getElementById('modalContactBtn').href = 'mailto:' + details.contact;
            
            partnershipModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close partnership modal
    const partnershipModalClose = document.querySelector('.partnership-modal-close');
    if (partnershipModalClose) {
        partnershipModalClose.addEventListener('click', function() {
            partnershipModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    partnershipModal.addEventListener('click', function(e) {
        if (e.target === partnershipModal) {
            partnershipModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Event Countdown Timer
    const eventCountdown = document.getElementById('eventCountdown');
    if (eventCountdown) {
        // Set the event date - March 15, 2026 at 7:00 PM GMT
        const eventDate = new Date('March 15, 2026 19:00:00 GMT').getTime();
        
        function updateCountdown() {
            const now = Date.now();
            const distance = eventDate - now;
            
            if (distance < 0) {
                // Event has started
                eventCountdown.innerHTML = '<div class="countdown-ended"><span>Event Has Started!</span></div>';
                return;
            }
            
            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update the display
            const daysEl = document.getElementById('countdownDays');
            const hoursEl = document.getElementById('countdownHours');
            const minutesEl = document.getElementById('countdownMinutes');
            const secondsEl = document.getElementById('countdownSeconds');
            
            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Update immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Past Events Toggle Functionality
    const viewPastEventsBtn = document.getElementById('viewPastEvents');
    const pastEventsSection = document.getElementById('past-events');
    
    if (viewPastEventsBtn && pastEventsSection) {
        viewPastEventsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            pastEventsSection.classList.toggle('hidden');
            
            // Change button text based on visibility
            if (pastEventsSection.classList.contains('hidden')) {
                viewPastEventsBtn.textContent = 'View Past Events';
            } else {
                viewPastEventsBtn.textContent = 'Hide Past Events';
            }
            
            // Smooth scroll to section
            pastEventsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Mobile Menu Toggle - Fixed for .mobile-menu-toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    
    mobileMenuToggle?.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mainNavigation.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (mobileMenuToggle && mainNavigation) {
            mobileMenuToggle.classList.remove('active');
            mainNavigation.classList.remove('active');
        }
    }));
    
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Optional: Close all other FAQ items (accordion behavior)
            // Uncomment the next 4 lines to enable accordion behavior
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            let isValid = true;
            let errorMessage = '';
            
            if (!name || name.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter your name (at least 2 characters)';
            } else if (!email || !validateEmail(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (!subject || subject.trim().length < 3) {
                isValid = false;
                errorMessage = 'Please enter a subject (at least 3 characters)';
            } else if (!message || message.trim().length < 10) {
                isValid = false;
                errorMessage = 'Please enter a message (at least 10 characters)';
            }
            
            if (!isValid) {
                showNotification(errorMessage, 'error');
                return;
            }
            
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Project cards interactive effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Skill cards animation
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .contact-info, .contact-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS animation classes
    const style = document.createElement('style');
    style.textContent = `
        /* Press Posts Animation */
        .press-post {
            opacity: 0;
            transform: translateY(20px);
            animation: pressFadeInUp 0.6s ease-out forwards;
        }
        
        .press-post:nth-child(1) { animation-delay: 0.1s; }
        .press-post:nth-child(2) { animation-delay: 0.2s; }
        .press-post:nth-child(3) { animation-delay: 0.3s; }
        .press-post:nth-child(4) { animation-delay: 0.4s; }
        .press-post:nth-child(5) { animation-delay: 0.5s; }
        .press-post:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes pressFadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Press Release Animation */
        .press-release {
            opacity: 0;
            transform: translateX(-20px);
            animation: pressSlideIn 0.5s ease-out forwards;
        }
        
        .press-release:nth-child(1) { animation-delay: 0.1s; }
        .press-release:nth-child(2) { animation-delay: 0.15s; }
        .press-release:nth-child(3) { animation-delay: 0.2s; }
        .press-release:nth-child(4) { animation-delay: 0.25s; }
        .press-release:nth-child(5) { animation-delay: 0.3s; }
        
        @keyframes pressSlideIn {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Coverage Item Animation */
        .coverage-item {
            opacity: 0;
            transform: scale(0.95);
            animation: pressScaleIn 0.5s ease-out forwards;
        }
        
        .coverage-item:nth-child(1) { animation-delay: 0.1s; }
        .coverage-item:nth-child(2) { animation-delay: 0.2s; }
        .coverage-item:nth-child(3) { animation-delay: 0.3s; }
        .coverage-item:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes pressScaleIn {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Download Item Animation */
        .download-item {
            opacity: 0;
            transform: translateY(10px);
            animation: downloadFadeIn 0.4s ease-out forwards;
        }
        
        .download-item:nth-child(1) { animation-delay: 0.1s; }
        .download-item:nth-child(2) { animation-delay: 0.15s; }
        .download-item:nth-child(3) { animation-delay: 0.2s; }
        .download-item:nth-child(4) { animation-delay: 0.25s; }
        
        @keyframes downloadFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-link.active {
            background: linear-gradient(135deg, #4A90E2, #7B68EE);
            color: white !important;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background: linear-gradient(135deg, #10B981, #059669);
        }
        
        .notification.error {
            background: linear-gradient(135deg, #EF4444, #DC2626);
        }
        
        .mobile-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 0 0 12px 12px;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .nav-menu.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
});

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// API Configuration for Backend Integration
    const API_ENDPOINTS = {
        createGiftOrder: '/api/gifts/create',
        getGiftDetails: '/api/gifts/:id',
        validateEmail: '/api/validate/email',
        getCSRFToken: '/api/csrf-token'
    };

    // Generate unique order ID
    function generateOrderId() {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 10);
        return `GIFT-${timestamp}-${randomPart}`.toUpperCase();
    }

    // Generate gift certificate code
    function generateCertificateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'GIFT-';
        for (let i = 0; i < 12; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Set order ID and date on page load
    function initializeOrderFields() {
        const orderIdField = document.getElementById('orderId');
        const orderDateField = document.getElementById('orderDate');
        if (orderIdField) orderIdField.value = generateOrderId();
        if (orderDateField) orderDateField.value = new Date().toISOString();
    }

    // Fetch CSRF token (placeholder - implement based on your backend)
    async function fetchCSRFToken() {
        try {
            const response = await fetch(API_ENDPOINTS.getCSRFToken);
            if (response.ok) {
                const data = await response.json();
                const csrfField = document.getElementById('csrfToken');
                if (csrfField) csrfField.value = data.token;
            }
        } catch (error) {
            console.error('CSRF token fetch failed:', error);
            // Using placeholder token in development
        }
    }

    // Gift Form Handling
    const giftForm = document.getElementById('giftForm');
    const physicalCertCheckbox = document.getElementById('physical-certificate');
    const welcomeBoxCheckbox = document.getElementById('welcome-box');
    const shippingAddressField = document.getElementById('shipping-address');
    const giftPlanSelect = document.getElementById('gift-plan');
    const giftTierSelect = document.getElementById('gift-tier');
    const summaryMembership = document.getElementById('summary-membership');
    const summaryDuration = document.getElementById('summary-duration');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryAddons = document.getElementById('summary-addons');
    const summaryTotal = document.getElementById('summary-total');
    const messageTextarea = document.getElementById('gift-message');
    const messageCount = document.getElementById('message-count');

    const pricing = {
        plans: {
            '3': { digital: 29.97, standard: 59.97, premium: 89.97 },
            '6': { digital: 50.94, standard: 107.94, premium: 161.94 },
            '12': { digital: 95.88, standard: 191.88, premium: 287.88 }
        }
    };

    // Initialize order fields
    initializeOrderFields();
    fetchCSRFToken();

    // Shipping address conditional display
    if (physicalCertCheckbox && shippingAddressField) {
        physicalCertCheckbox.addEventListener('change', function() {
            if (this.checked || welcomeBoxCheckbox?.checked) {
                shippingAddressField.disabled = false;
                shippingAddressField.classList.add('visible');
            } else {
                shippingAddressField.disabled = true;
                shippingAddressField.classList.remove('visible');
            }
        });
    }

    if (welcomeBoxCheckbox && shippingAddressField) {
        welcomeBoxCheckbox.addEventListener('change', function() {
            if (this.checked || physicalCertCheckbox?.checked) {
                shippingAddressField.disabled = false;
                shippingAddressField.classList.add('visible');
            } else {
                shippingAddressField.disabled = true;
                shippingAddressField.classList.remove('visible');
            }
        });
    }

    // Message character count
    if (messageTextarea && messageCount) {
        messageTextarea.addEventListener('input', function() {
            messageCount.textContent = this.value.length;
        });
    }

    // Email validation with real-time feedback
    const recipientEmailInput = document.getElementById('recipient-email');
    const yourEmailInput = document.getElementById('your-email');
    const recipientEmailValidation = document.getElementById('recipient-email-validation');
    const yourEmailValidation = document.getElementById('your-email-validation');

    function validateEmailInput(input, validationEl) {
        const email = input.value;
        if (!email) {
            if (validationEl) {
                validationEl.textContent = '';
                validationEl.className = 'email-validation';
            }
            return;
        }
        
        const isValid = validateEmail(email);
        if (validationEl) {
            validationEl.textContent = isValid ? '✓ Valid email' : '✗ Invalid email format';
            validationEl.className = 'email-validation ' + (isValid ? 'valid' : 'invalid');
        }
    }

    recipientEmailInput?.addEventListener('blur', function() {
        validateEmailInput(this, recipientEmailValidation);
    });

    yourEmailInput?.addEventListener('blur', function() {
        validateEmailInput(this, yourEmailValidation);
    });

    // Gift Summary Update
    function updateGiftSummary() {
        const plan = giftPlanSelect?.value;
        const tier = giftTierSelect?.value;
        
        let subtotal = 0;
        let membershipText = '--';
        let durationText = '--';

        if (plan && tier && pricing.plans?.[plan]?.[tier]) {
            subtotal = pricing.plans[plan][tier];
            membershipText = tier.charAt(0).toUpperCase() + tier.slice(1) + ' Membership';
            durationText = plan + ' Months';
            
            // Update hidden price field for backend
            const priceField = document.getElementById('selectedTierPrice');
            if (priceField) priceField.value = subtotal.toFixed(2);
        }

        let addons = 0;
        if (physicalCertCheckbox?.checked) addons += 5;
        if (welcomeBoxCheckbox?.checked) addons += 15;

        const total = subtotal + addons;

        if (summaryMembership) summaryMembership.textContent = membershipText;
        if (summaryDuration) summaryDuration.textContent = durationText;
        if (summarySubtotal) summarySubtotal.textContent = '$' + subtotal.toFixed(2);
        if (summaryAddons) summaryAddons.textContent = '$' + addons.toFixed(2);
        if (summaryTotal) summaryTotal.innerHTML = '<strong>$' + total.toFixed(2) + '</strong>';

        // Save to localStorage
        saveFormToLocalStorage();
    }

    giftPlanSelect?.addEventListener('change', updateGiftSummary);
    giftTierSelect?.addEventListener('change', updateGiftSummary);
    physicalCertCheckbox?.addEventListener('change', updateGiftSummary);
    welcomeBoxCheckbox?.addEventListener('change', updateGiftSummary);

    // Plan card click handlers (legacy - keeping for compatibility)
    const choosePlanBtns = document.querySelectorAll('.choose-plan-btn');
    const tierOptions = document.querySelectorAll('.tier-option');

    choosePlanBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const duration = this.dataset.duration;
            if (giftPlanSelect) {
                giftPlanSelect.value = duration;
            }
            
            // Scroll to form
            const formSection = document.getElementById('giftFormSection');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            updateGiftSummary();
        });
    });

    // Tier option selection in plan cards (legacy)
    tierOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.gift-plan');
            const duration = parent?.dataset.duration;
            const tier = this.dataset.tier;
            
            // Update form
            if (giftPlanSelect) giftPlanSelect.value = duration;
            if (giftTierSelect) giftTierSelect.value = tier;
            
            // Update selected state in UI
            parent?.querySelectorAll('.tier-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Scroll to form
            const formSection = document.getElementById('giftFormSection');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            updateGiftSummary();
        });
    });

    // Popular gift card click handlers
    const popularGiftCards = document.querySelectorAll('.popular-gift-card');

    popularGiftCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the button directly (it has its own handler)
            if (e.target.tagName === 'BUTTON') return;
            
            const duration = this.dataset.duration;
            const tier = this.dataset.tier;
            const theme = this.dataset.theme;
            
            // Update form
            if (giftPlanSelect) giftPlanSelect.value = duration;
            if (giftTierSelect) giftTierSelect.value = tier;
            
            // Set theme if it exists
            const themeSelect = document.getElementById('gift-theme');
            if (themeSelect && theme) {
                themeSelect.value = theme;
            }
            
            // Scroll to form
            const formSection = document.getElementById('giftFormSection');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            updateGiftSummary();
        });
    });

    // Handle "Gift This" button clicks on popular cards
    const giftThisButtons = document.querySelectorAll('.popular-gift-card .btn');
    giftThisButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.popular-gift-card');
            const duration = card.dataset.duration;
            const tier = card.dataset.tier;
            const theme = card.dataset.theme;
            
            // Update form
            if (giftPlanSelect) giftPlanSelect.value = duration;
            if (giftTierSelect) giftTierSelect.value = tier;
            
            // Set theme if it exists
            const themeSelect = document.getElementById('gift-theme');
            if (themeSelect && theme) {
                themeSelect.value = theme;
            }
            
            // Scroll to form
            const formSection = document.getElementById('giftFormSection');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            updateGiftSummary();
        });
    });

    // Gift Form Submission with Backend Integration
    if (giftForm) {
        giftForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const giftPlan = formData.get('giftPlan');
            const giftTier = formData.get('giftTier');
            const recipientName = formData.get('recipientName');
            const recipientEmail = formData.get('recipientEmail');
            const yourName = formData.get('yourName');
            const yourEmail = formData.get('yourEmail');
            const orderId = formData.get('orderId');
            
            let isValid = true;
            let errorMessage = '';
            
            if (!giftPlan) {
                isValid = false;
                errorMessage = 'Please select a gift duration';
            } else if (!giftTier) {
                isValid = false;
                errorMessage = 'Please select a membership tier';
            } else if (!recipientName || recipientName.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter recipient name (at least 2 characters)';
            } else if (!recipientEmail || !validateEmail(recipientEmail)) {
                isValid = false;
                errorMessage = 'Please enter a valid recipient email address';
            } else if (!yourName || yourName.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter your name (at least 2 characters)';
            } else if (!yourEmail || !validateEmail(yourEmail)) {
                isValid = false;
                errorMessage = 'Please enter your valid email address';
            }
            
            if (!isValid) {
                showNotification(errorMessage, 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Prepare data for backend
            const giftData = {
                orderId: orderId,
                giftPlan: giftPlan,
                giftTier: giftTier,
                recipientName: recipientName,
                recipientEmail: recipientEmail,
                yourName: yourName,
                yourEmail: yourEmail,
                recipientPhone: formData.get('recipientPhone') || '',
                yourPhone: formData.get('yourPhone') || '',
                deliveryDate: formData.get('deliveryDate') || null,
                giftMessage: formData.get('giftMessage') || '',
                giftTheme: formData.get('giftTheme') || 'general',
                physicalCertificate: physicalCertCheckbox?.checked || false,
                welcomeBox: welcomeBoxCheckbox?.checked || false,
                shippingAddress: formData.get('shippingAddress') || '',
                subtotal: Number.parseFloat(formData.get('selectedTierPrice')) || 0,
                addons: ((physicalCertCheckbox?.checked ? 5 : 0) + (welcomeBoxCheckbox?.checked ? 15 : 0)),
                total: Number.parseFloat(formData.get('selectedTierPrice')) || 0 + 
                       (physicalCertCheckbox?.checked ? 5 : 0) + 
                       (welcomeBoxCheckbox?.checked ? 15 : 0),
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            try {
                // Try to send to backend API (will fallback to mock if not available)
                const response = await fetch(API_ENDPOINTS.createGiftOrder, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.getElementById('csrfToken')?.value || ''
                    },
                    body: JSON.stringify(giftData)
                });
                
                if (response.ok) {
                    await response.json();
                    const orderIdStr = String(orderId || 'N/A');
                    showNotification(`Gift purchase successful! Order ID: ${orderIdStr}`, 'success');
                } else {
                    throw new Error('API request failed');
                }
            } catch (error) {
                // Mock success for demo purposes
                console.error('Backend not available, using mock submission:', error);
                console.log('Gift data prepared for backend:', giftData);
                
                // Simulate successful submission
                setTimeout(() => {
                    const orderIdStr = String(orderId || 'N/A');
                    showNotification(`Gift purchase successful! Order ID: ${orderIdStr}`, 'success');
                }, 1500);
            }
            
            // Clear form and localStorage
            giftForm.reset();
            initializeOrderFields();
            updateGiftSummary();
            localStorage.removeItem('giftFormData');
            
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    // Preview Modal Functionality
    const previewBtn = document.getElementById('previewGiftBtn');
    const previewModal = document.getElementById('giftPreviewModal');
    const previewClose = document.querySelector('.gift-preview-close');
    const previewOverlay = document.querySelector('.gift-preview-overlay');

    if (previewBtn && previewModal) {
        previewBtn.addEventListener('click', function() {
            const recipientName = document.getElementById('recipient-name')?.value || 'Recipient Name';
            const yourName = document.getElementById('your-name')?.value || 'Your Name';
            const giftPlan = giftPlanSelect?.value || '6';
            const giftTier = giftTierSelect?.value || 'standard';
            const giftMessage = document.getElementById('gift-message')?.value || '';
            
            const tierNames = {
                digital: 'Digital Membership',
                standard: 'Standard Membership',
                premium: 'Premium Membership'
            };
            
            const total = pricing.plans[giftPlan]?.[giftTier] || 0;
            
            // Update preview content
            document.getElementById('preview-from').textContent = yourName;
            document.getElementById('preview-to').textContent = recipientName;
            document.getElementById('preview-membership').textContent = tierNames[giftTier] || 'Standard Membership';
            document.getElementById('preview-duration').textContent = giftPlan + ' Months';
            document.getElementById('preview-total').textContent = '$' + total.toFixed(2);
            document.getElementById('preview-message').textContent = giftMessage || 'No message provided';
            document.getElementById('preview-code').textContent = generateCertificateCode();
            
            previewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    previewClose?.addEventListener('click', function() {
        previewModal?.classList.remove('active');
        document.body.style.overflow = '';
    });

    previewOverlay?.addEventListener('click', function() {
        previewModal?.classList.remove('active');
        document.body.style.overflow = '';
    });

    // LocalStorage for form persistence
    function saveFormToLocalStorage() {
        const formData = {
            giftPlan: giftPlanSelect?.value,
            giftTier: giftTierSelect?.value,
            recipientName: document.getElementById('recipient-name')?.value,
            recipientEmail: document.getElementById('recipient-email')?.value,
            yourName: document.getElementById('your-name')?.value,
            yourEmail: document.getElementById('your-email')?.value,
            recipientPhone: document.getElementById('recipient-phone')?.value,
            yourPhone: document.getElementById('your-phone')?.value,
            deliveryDate: document.getElementById('delivery-date')?.value,
            giftMessage: document.getElementById('gift-message')?.value,
            giftTheme: document.getElementById('gift-theme')?.value,
            physicalCertificate: physicalCertCheckbox?.checked,
            welcomeBox: welcomeBoxCheckbox?.checked,
            shippingAddress: shippingAddressField?.value,
            timestamp: Date.now()
        };
        
        localStorage.setItem('giftFormData', JSON.stringify(formData));
    }

    function setFieldValue(fieldId, value, defaultValue = '') {
        const field = document.getElementById(fieldId);
        if (field) field.value = value || defaultValue;
    }

    function restoreFormFields(formData) {
        if (giftPlanSelect) giftPlanSelect.value = formData.giftPlan || '';
        if (giftTierSelect) giftTierSelect.value = formData.giftTier || '';
        
        setFieldValue('recipient-name', formData.recipientName);
        setFieldValue('recipient-email', formData.recipientEmail);
        setFieldValue('your-name', formData.yourName);
        setFieldValue('your-email', formData.yourEmail);
        setFieldValue('recipient-phone', formData.recipientPhone);
        setFieldValue('your-phone', formData.yourPhone);
        setFieldValue('delivery-date', formData.deliveryDate);
        setFieldValue('gift-theme', formData.giftTheme, 'celebration');
        
        const giftMessageField = document.getElementById('gift-message');
        if (giftMessageField) {
            giftMessageField.value = formData.giftMessage || '';
            if (messageCount) messageCount.textContent = (formData.giftMessage || '').length;
        }
        
        if (physicalCertCheckbox) physicalCertCheckbox.checked = formData.physicalCertificate || false;
        if (welcomeBoxCheckbox) welcomeBoxCheckbox.checked = formData.welcomeBox || false;
        if (shippingAddressField) shippingAddressField.value = formData.shippingAddress || '';
        
        // Enable shipping address if needed
        if (formData.physicalCertificate || formData.welcomeBox) {
            shippingAddressField.disabled = false;
            shippingAddressField.classList.add('visible');
        }
    }

    function loadFormFromLocalStorage() {
        const savedData = localStorage.getItem('giftFormData');
        if (!savedData) return;
        
        try {
            const formData = JSON.parse(savedData);
            
            // Only restore if less than 24 hours old
            if (Date.now() - formData.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('giftFormData');
                return;
            }
            
            restoreFormFields(formData);
            updateGiftSummary();
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }

    // Load saved form data on page load
    loadFormFromLocalStorage();

    // Auto-save on input changes
    const formInputs = giftForm?.querySelectorAll('input, select, textarea');
    formInputs?.forEach(input => {
        input.addEventListener('change', saveFormToLocalStorage);
    });

    // Add some interactive particles to hero section
    function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add floating animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0px) translateX(0px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Initialize particles when page loads
setTimeout(createParticles, 1000);

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});
/**
 * Book Spotlight Carousel
 * Auto-rotating featured books with smooth transitions
 */

(function() {
    // Book data
    const books = [
        {
            title: "The Garden of Memories",
            author: "Kenji Tanaka",
            authorImage: "assets/img/joanna Olczak-Ronikier.PNG",
            bookImage: "assets/img/In the Garden of Memory A Family Memoir.jfif",
            category: "Literary Fiction",
            award: "Winner of the International Booker Prize",
            description: "A multigenerational saga that blooms with secrets buried deep in a family's past."
        },
        {
            title: "The Silent Echo",
            author: "Amara Okafor",
            authorImage: "assets/img/Amara Okafor.webp",
            bookImage: "assets/img/The Silent Echo.webp",
            category: "Contemporary Fiction",
            award: "New York Times Bestseller",
            description: "A powerful story of resilience and the voices that refuse to be silenced."
        },
        {
            title: "The Forgotten Codex",
            author: "Henrik Larsson",
            authorImage: "assets/img/Henrik Larsson.webp",
            bookImage: "assets/img/book-8.webp",
            category: "Mystery",
            award: "Edgar Award Winner",
            description: "An ancient mystery unfolds as a librarian discovers a hidden manuscript."
        }
    ];

    let currentIndex = 0;
    let autoRotateInterval;
    let isPaused = false;
    const ROTATION_INTERVAL = 5000; // 5 seconds

    // DOM Elements
    const section = document.querySelector('.book-spotlight');
    if (!section) return;

    const titleEl = section.querySelector('.spotlight-title');
    const authorEl = section.querySelector('.spotlight-author strong');
    const authorImgEl = section.querySelector('.author-avatar');
    const bookImgEl = section.querySelector('.book-cover-image');
    const categoryEl = section.querySelector('.badge-secondary');
    const awardEl = section.querySelector('.spotlight-award');
    const descEl = section.querySelector('.spotlight-description');
    const progressItems = section.querySelectorAll('.progress-item');
    const prevBtn = section.querySelector('.carousel-prev');
    const nextBtn = section.querySelector('.carousel-next');

    // Update book display
    function updateBook(index) {
        const book = books[index];
        
        // Fade out
        titleEl.style.opacity = '0';
        titleEl.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Update content
            titleEl.textContent = book.title;
            authorEl.textContent = book.author;
            authorImgEl.src = book.authorImage;
            authorImgEl.alt = book.author;
            bookImgEl.src = book.bookImage;
            bookImgEl.alt = book.title;
            categoryEl.textContent = book.category;
            awardEl.textContent = book.award;
            descEl.textContent = book.description;
            
            // Fade in
            titleEl.style.transition = 'all 0.5s ease';
            titleEl.style.opacity = '1';
            titleEl.style.transform = 'translateY(0)';
        }, 300);

        // Update progress bars
        progressItems.forEach((item, i) => {
            item.classList.remove('active');
            const fill = item.querySelector('.progress-fill');
            fill.style.animation = 'none';
            fill.style.width = i < index ? '100%' : '0%';
        });
        
        progressItems[index].classList.add('active');
    }

    // Auto rotate
    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (!isPaused) {
                currentIndex = (currentIndex + 1) % books.length;
                updateBook(currentIndex);
            }
        }, ROTATION_INTERVAL);
    }

    // Event listeners
    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateBook(currentIndex);
            startAutoRotate();
        });
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + books.length) % books.length;
        updateBook(currentIndex);
        startAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % books.length;
        updateBook(currentIndex);
        startAutoRotate();
    });

    // Pause on hover
    section.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    section.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Start auto rotation
    startAutoRotate();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    observer.observe(section);

    console.log('📚 Book Spotlight Carousel initialized');
})();

// Virtual Spotlight - Featured Authors Section
document.addEventListener('DOMContentLoaded', function() {
    const authorButtons = document.querySelectorAll('.author-btn');
    const authorCards = document.querySelectorAll('.author-card');
    
    if (authorButtons.length === 0 || authorCards.length === 0) {
        return; // Virtual Spotlight section not present on this page
    }
    
    // Function to switch to a specific author
    function switchToAuthor(authorId) {
        // Update button states
        authorButtons.forEach(btn => {
            if (btn.dataset.author === authorId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update card visibility with fade animation
        authorCards.forEach(card => {
            if (card.dataset.author === authorId) {
                card.classList.add('active');
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.4s ease';
                }, 10);
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // Add click event listeners to author buttons
    authorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const authorId = this.dataset.author;
            switchToAuthor(authorId);
        });
    });
    
    // Optional: Auto-rotate through authors every 8 seconds
    let currentAuthorIndex = 0;
    let autoRotateInterval;
    let isPaused = false;
    
    const authorIds = Array.from(authorButtons).map(btn => btn.dataset.author);
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (!isPaused && authorIds.length > 1) {
                currentAuthorIndex = (currentAuthorIndex + 1) % authorIds.length;
                switchToAuthor(authorIds[currentAuthorIndex]);
            }
        }, 8000);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Pause auto-rotation on hover
    const spotlightSection = document.querySelector('.virtual-spotlight');
    if (spotlightSection) {
        spotlightSection.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        spotlightSection.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }
    
    // Start auto-rotation
    startAutoRotate();
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        const spotlightInView = spotlightSection && 
            spotlightSection.getBoundingClientRect().top < window.innerHeight &&
            spotlightSection.getBoundingClientRect().bottom > 0;
        
        if (spotlightInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentAuthorIndex = (currentAuthorIndex - 1 + authorIds.length) % authorIds.length;
                switchToAuthor(authorIds[currentAuthorIndex]);
                stopAutoRotate();
                startAutoRotate();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentAuthorIndex = (currentAuthorIndex + 1) % authorIds.length;
                switchToAuthor(authorIds[currentAuthorIndex]);
                stopAutoRotate();
                startAutoRotate();
            }
        }
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });
    
    if (spotlightSection) {
        observer.observe(spotlightSection);
    }
    
    console.log('🎭 Virtual Spotlight initialized with', authorIds.length, 'authors');
});
