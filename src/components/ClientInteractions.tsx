'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInteractions() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // 0. Load FontAwesome & AOS asynchronously to eliminate render-blocking CSS
    if (!document.getElementById('font-awesome-css')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    if (!document.getElementById('aos-css')) {
      const link = document.createElement('link');
      link.id = 'aos-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/aos@2.3.4/dist/aos.css';
      document.head.appendChild(link);
    }

    // 1. Initialize AOS robustly across Next.js asynchronous loads
    let checks = 0;
    const checkAOS = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).AOS) {
        (window as any).AOS.init({ duration: 800, once: true, offset: 50 });
        (window as any).AOS.refresh();
        clearInterval(checkAOS);
      }
      if (++checks > 50) clearInterval(checkAOS);
    }, 100);
    cleanups.push(() => clearInterval(checkAOS));

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

    // 4. Hero Contact Form Handler (LeadConnector GHL)
    const heroForm = document.getElementById("heroContactForm") as HTMLFormElement;
    const heroSuccess = document.getElementById("heroFormSuccess");
    const heroError = document.getElementById("heroFormError");

    if (heroForm) {
      const onSubmit = async function (e: Event) {
        e.preventDefault();
        const data = new FormData(heroForm);
        try {
          const ghl = await fetch("https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/acaff8c7-b7ea-47e8-90d5-adfe581d1517", { method: "POST", body: data });
          if (ghl.ok && heroSuccess && heroError) {
            heroForm.style.display = "none";
            heroError.classList.add("hidden");
            heroSuccess.classList.remove("hidden");
          } else {
            throw new Error();
          }
        } catch {
          if (heroSuccess && heroError) {
            heroSuccess.classList.add("hidden");
            heroError.classList.remove("hidden");
          }
        }
      };
      heroForm.addEventListener("submit", onSubmit);
      cleanups.push(() => heroForm.removeEventListener("submit", onSubmit));
    }

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
