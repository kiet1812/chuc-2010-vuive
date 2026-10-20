/**
 * ==========================================================================
 * MAIN.JS – Trải nghiệm cuộn nghệ thuật 20/10 Gửi Bùi Thảo Lam
 * Thiết kế mượt mà, thuần khiết, tối ưu hoàn hảo cho Mobile
 * 
 * Thư viện hỗ trợ (CDN):
 * - Lenis 1.1.18 (Smooth Momentum Scroll)
 * - GSAP 3.12.7 & ScrollTrigger
 * - Canvas Confetti 1.9.3
 * ==========================================================================
 */

(function () {
    'use strict';

    /* ── 1. Color Palette Constant (Strict 3 Colors: Black, White, Pink) ── */
    const PALETTE = {
        black: '#040406',
        white: '#FFFFFF',
        pinkHot: '#FF69B4',
        pinkDeep: '#FF1493',
        pinkLight: '#FFB6C1',
        pinkPastel: '#FFC0CB',
        confetti: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFFFFF', '#FFC0CB']
    };

    /* ── 2. Utility Selectors ── */
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    /* ── 3. Lenis Smooth Scroll Engine ── */
    let lenis = null;

    function initSmoothScroll() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis CDN not loaded, falling back to native scroll.');
            return;
        }

        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.75,
            wheelMultiplier: 1.0,
            infinite: false,
        });

        window.lenis = lenis;

        // Sync with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    /* ── 4. Ambient Background Canvas (Antigravity Particles & Nebula Glow) ── */
    function initAmbientCanvas() {
        const canvas = $('#ambient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Generate glowing stardust particles
        const particleCount = window.innerWidth < 640 ? 35 : 75;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.6,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.4 ? PALETTE.pinkHot : PALETTE.white,
                pulseSpeed: Math.random() * 0.02 + 0.01,
            });
        }

        // Ambient Nebula Orbs
        const orbs = [
            { x: width * 0.25, y: height * 0.35, r: 260, color: 'rgba(255, 20, 147, 0.08)' },
            { x: width * 0.75, y: height * 0.7, r: 320, color: 'rgba(255, 105, 180, 0.06)' }
        ];

        function render() {
            ctx.clearRect(0, 0, width, height);

            // Draw ambient nebula orbs
            orbs.forEach((orb) => {
                const grad = ctx.createRadialGradient(orb.x, orb.y, 10, orb.x, orb.y, orb.r);
                grad.addColorStop(0, orb.color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw stardust particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Screen wrapping
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                // Twinkle
                p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
                const safeAlpha = Math.max(0.1, Math.min(0.85, p.alpha));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = safeAlpha;
                ctx.fill();
            });

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(render);
        }

        render();
    }

    /* ── 5. GSAP Cinematic Scroll Choreographies ── */
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // 5A. Act 1: Hero Fade & Elevate
        gsap.to('.hero-container', {
            y: -90,
            opacity: 0,
            scale: 0.94,
            filter: 'blur(8px)',
            scrollTrigger: {
                trigger: '#sec-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
            }
        });

        // 5B. Act 2: Handwritten Manuscript Parchment
        const manuscript = $('.manuscript-parchment');
        if (manuscript) {
            gsap.fromTo(manuscript,
                { opacity: 0, y: 50, rotate: -1.2 },
                {
                    opacity: 1,
                    y: 0,
                    rotate: -1.2,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#sec-manuscript',
                        start: 'top 85%',
                        end: 'top 55%',
                        scrub: 1.2,
                    }
                }
            );
        }

        $$('#sec-manuscript .reveal-text').forEach((block) => {
            gsap.fromTo(block, 
                { opacity: 0, y: 30, filter: 'blur(8px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 85%',
                        end: 'top 60%',
                        scrub: 1.2,
                    }
                }
            );
        });

        // 5C. Act 3: Heartfelt Wishes (Organic Flow with bespoke tilt)
        const wishes = [
            { selector: '#sec-wishes .pink-binder-note', rotate: 1.4 },
            { selector: '#sec-wishes .floating-poetic-quote', rotate: -0.9 },
            { selector: '#sec-wishes .transparent-dashed-note', rotate: 1.3 },
        ];

        wishes.forEach(({ selector, rotate }) => {
            const el = $(selector);
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0, y: 45, scale: 0.96, rotate: rotate },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: rotate,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        end: 'top 62%',
                        scrub: 1.2,
                    }
                }
            );
        });

        // 5D. Act 4: Blooming Rose Unfurl & Petal Drift
        const roseTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#sec-rose',
                start: 'top 75%',
                end: 'center center',
                scrub: 1.2,
            }
        });

        roseTl
            .fromTo('#rose-graphic',
                { scale: 0.65, rotate: -25, opacity: 0 },
                { scale: 1.05, rotate: 0, opacity: 1, duration: 1, ease: 'back.out(1.4)' }
            )
            .fromTo('.rose-title',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.4'
            )
            .fromTo('.rose-date',
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.6 },
                '-=0.3'
            );

        // 5E. Act 5: Finale (Straight Book Page Card & Confetti)
        const bookPage = $('.book-page-card');
        if (bookPage) {
            gsap.fromTo(bookPage,
                { opacity: 0, y: 45, scale: 0.96, rotate: 0 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#sec-finale',
                        start: 'top 78%',
                        end: 'top 50%',
                        scrub: 1.2,
                    }
                }
            );
        }
        let finaleFired = false;

        ScrollTrigger.create({
            trigger: '#sec-finale',
            start: 'top 65%',
            onEnter: () => {
                if (!finaleFired) {
                    finaleFired = true;
                    fireCelebrationConfetti();
                }
            },
            onEnterBack: () => {
                fireCelebrationConfetti(35);
            }
        });
    }

    /* ── 6. Rose Floating Petals Generation ── */
    function initRosePetals() {
        const container = $('#rose-petals-layer');
        if (!container) return;

        const petalIcons = ['🌸', '✿', '❀', '🏵️'];
        const count = window.innerWidth < 640 ? 12 : 24;

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('span');
            petal.className = 'rose-falling-petal';
            petal.textContent = petalIcons[Math.floor(Math.random() * petalIcons.length)];
            petal.style.left = Math.random() * 95 + '%';
            petal.style.fontSize = (Math.random() * 0.9 + 0.75) + 'rem';
            petal.style.animationDuration = (Math.random() * 7 + 6) + 's';
            petal.style.animationDelay = (Math.random() * 8) + 's';
            petal.style.color = Math.random() > 0.5 ? PALETTE.pinkDeep : PALETTE.pinkLight;
            container.appendChild(petal);
        }
    }

    /* ── 7. Celebration Confetti (Strictly Pink & White) ── */
    function fireCelebrationConfetti(intensity = 60) {
        if (typeof confetti !== 'function') return;

        confetti({
            particleCount: intensity,
            spread: 70,
            origin: { x: 0.2, y: 0.75 },
            colors: PALETTE.confetti,
            disableForReducedMotion: true,
        });

        confetti({
            particleCount: intensity,
            spread: 70,
            origin: { x: 0.8, y: 0.75 },
            colors: PALETTE.confetti,
            disableForReducedMotion: true,
        });
    }

    /* ── 8. Interactive Features & Replay Button ── */
    function initInteractions() {
        // Replay Button
        const replayBtn = $('#btn-replay');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                if (lenis) {
                    lenis.scrollTo(0, { duration: 1.8 });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        // Tap on signature for confetti burst
        const signature = $('#interactive-signature');
        if (signature) {
            signature.addEventListener('click', (e) => {
                const rect = signature.getBoundingClientRect();
                confetti({
                    particleCount: 50,
                    spread: 360,
                    origin: {
                        x: (rect.left + rect.width / 2) / window.innerWidth,
                        y: (rect.top + rect.height / 2) / window.innerHeight,
                    },
                    colors: PALETTE.confetti,
                    startVelocity: 18,
                    gravity: 0.7,
                    disableForReducedMotion: true,
                });

                // Haptic feedback for mobile
                if (navigator.vibrate) {
                    navigator.vibrate([40, 25, 40]);
                }
            });
        }
    }

    /* ── 9. Bootstrap Application ── */
    function bootstrap() {
        initSmoothScroll();
        initAmbientCanvas();
        initScrollAnimations();
        initRosePetals();
        initInteractions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
