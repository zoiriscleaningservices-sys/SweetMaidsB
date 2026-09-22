'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInteractions() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // 0. Defer FontAwesome loading until after page is interactive or first user intent
    const loadFA = () => {
      if (document.getElementById('font-awesome-css')) return;
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.media = 'print';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      link.crossOrigin = 'anonymous';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadFA, { timeout: 5000 });
      } else {
        setTimeout(loadFA, 3500);
      }
      ['scroll', 'touchstart', 'click'].forEach(evt => {
        window.addEventListener(evt, loadFA, { once: true, passive: true });
      });
    }

    // 2. Services Carousel Logic
    const track = document.getElementById('services-track');
    const dotsContainer = document.getElementById('services-dots');
    
    if ((window as any).autoPlayInterval) {
      clearInterval((window as any).autoPlayInterval);
    }

    if (track && dotsContainer) {
      const prevBtn = document.getElementById('prev-service');
      const nextBtn = document.getElementById('next-service');
      const cards = Array.from(track.children) as HTMLElement[];

      let currentIndex = 0;

      const getVisibleCards = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
      };

      const updateCarousel = () => {
        const visible = getVisibleCards();
        const maxIndex = cards.length - visible;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const cardWidth = track.offsetWidth / visible;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        const dots = Array.from(dotsContainer.children) as HTMLElement[];
        dots.forEach((dot, idx) => {
          dot.classList.toggle('bg-pink-200', idx === currentIndex);
          dot.classList.toggle('bg-gray-600', idx !== currentIndex);
        });
      };

      const createDots = () => {
        dotsContainer.innerHTML = '';
        const visible = getVisibleCards();
        const numDots = Math.max(1, cards.length - visible + 1);

        for (let i = 0; i < numDots; i++) {
          const dot = document.createElement('button');
          dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-pink-200' : 'bg-gray-600'}`;
          dot.setAttribute('aria-label', `View services carousel slide ${i + 1}`);
          dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoPlay();
          });
          dotsContainer.appendChild(dot);
        }
      };

      const nextSlide = () => {
        const visible = getVisibleCards();
        if (currentIndex < cards.length - visible) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateCarousel();
      };

      const prevSlide = () => {
        const visible = getVisibleCards();
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = Math.max(0, cards.length - visible);
        }
        updateCarousel();
      };

      const startAutoPlay = () => {
        (window as any).autoPlayInterval = setInterval(nextSlide, 4000);
      };

      const resetAutoPlay = () => {
        if ((window as any).autoPlayInterval) clearInterval((window as any).autoPlayInterval);
        startAutoPlay();
      };

      if (nextBtn) {
        const clickNext = () => { nextSlide(); resetAutoPlay(); };
        nextBtn.addEventListener('click', clickNext);
        cleanups.push(() => nextBtn.removeEventListener('click', clickNext));
      }
      
      if (prevBtn) {
        const clickPrev = () => { prevSlide(); resetAutoPlay(); };
        prevBtn.addEventListener('click', clickPrev);
        cleanups.push(() => prevBtn.removeEventListener('click', clickPrev));
      }

      const trackParent = track.parentElement;
      if (trackParent) {
        const onEnter = () => clearInterval((window as any).autoPlayInterval);
        const onLeave = () => startAutoPlay();
        trackParent.addEventListener('mouseenter', onEnter);
        trackParent.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          trackParent.removeEventListener('mouseenter', onEnter);
          trackParent.removeEventListener('mouseleave', onLeave);
        });
      }

      const onResize = () => {
        createDots();
        updateCarousel();
      };
      window.addEventListener('resize', onResize);
      cleanups.push(() => window.removeEventListener('resize', onResize));

      createDots();
      updateCarousel();
      startAutoPlay();
      
      cleanups.push(() => {
        if ((window as any).autoPlayInterval) clearInterval((window as any).autoPlayInterval);
      });
    }

    // 3. Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile');

    if (mobileBtn && mobileMenu && closeBtn) {
      const openMenu = () => {
        mobileMenu.classList.remove('invisible');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
          mobileMenu.classList.add('invisible');
        }, 400);
      };

      mobileBtn.addEventListener('click', openMenu);
      cleanups.push(() => mobileBtn.removeEventListener('click', openMenu));

      closeBtn.addEventListener('click', closeMenu);
      cleanups.push(() => closeBtn.removeEventListener('click', closeMenu));

      const links = mobileMenu.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', closeMenu);
        cleanups.push(() => link.removeEventListener('click', closeMenu));
      });
    }

    // 4. Native Quote Form Webhook Submission Handler
    const quoteForm = document.getElementById('quoteForm') as HTMLFormElement | null;
    const successCard = document.getElementById('successCard') as HTMLElement | null;

    if (quoteForm) {
      const onSubmit = async function (e: Event) {
        e.preventDefault();
        const submitBtn = quoteForm.querySelector('.submit-btn') as HTMLButtonElement | null;
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Get My Free Quote →';

        const serviceInput = quoteForm.querySelector<HTMLSelectElement>('[name="service"]');
        const fullNameInput = quoteForm.querySelector<HTMLInputElement>('[name="fullName"]');
        const phoneInput = quoteForm.querySelector<HTMLInputElement>('[name="phone"]');
        const emailInput = quoteForm.querySelector<HTMLInputElement>('[name="email"]');
        const addressInput = quoteForm.querySelector<HTMLInputElement>('[name="address"]');
        const smsConsentInput = quoteForm.querySelector<HTMLInputElement>('[name="smsConsent"]');

        const payload = {
          service: serviceInput?.value || '',
          fullName: fullNameInput?.value || '',
          phone: phoneInput?.value || '',
          email: emailInput?.value || '',
          address: addressInput?.value || '',
          smsConsent: smsConsentInput ? smsConsentInput.checked : false,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        };

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        try {
          await fetch('https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/1a10b6de-bddd-4c0b-9532-1fca30defaad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          quoteForm.reset();
          quoteForm.style.display = 'none';
          if (successCard) {
            successCard.style.display = 'block';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (err) {
          console.error('Form submission failed:', err);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText || 'Get My Free Quote →';
          }
          alert('Something went wrong submitting your request. Please call us instead.');
        }
      };

      quoteForm.addEventListener('submit', onSubmit);
      cleanups.push(() => quoteForm.removeEventListener('submit', onSubmit));
    }

    // Smooth scroll to #quote if hash is present in URL
    const scrollToQuoteIfPresent = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#quote') {
        setTimeout(() => {
          const quoteEl = document.getElementById('quote');
          if (quoteEl) {
            quoteEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      }
    };
    scrollToQuoteIfPresent();

    // Intercept in-page clicks to #quote for smooth scrolling
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href');
      if (href === '#quote') {
        const quoteSection = document.getElementById('quote');
        if (quoteSection) {
          e.preventDefault();
          quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', '#quote');
        }
      }
    };
    document.addEventListener('click', onAnchorClick);
    cleanups.push(() => document.removeEventListener('click', onAnchorClick));

    // 5. Mobile Accordions Handler
    const accordions = document.querySelectorAll('.accordion-group > button');
    accordions.forEach((btn) => {
      const toggleAcc = function(e: Event) {
        const target = e.currentTarget as HTMLElement;
        target.parentElement?.classList.toggle('accordion-active');
      };
      btn.addEventListener('click', toggleAcc);
      cleanups.push(() => btn.removeEventListener('click', toggleAcc));
    });

    // Run cleanup automatically when unmounting or navigating
    return () => {
      cleanups.forEach(fn => fn());
    };
  }, [pathname]);

  return null;
}
