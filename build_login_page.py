import os
import re

def build_login_page():
    # 1. Read index.html for global parts
    base_dir = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        content = f.read()

    # Create safe regex patterns to pull exact layout chunks
    
    # Global <header>
    header_match = re.search(r'(<header class="fixed top-0 left-0 right-0.*?</header>)', content, re.DOTALL)
    header_html = header_match.group(1) if header_match else ""

    # Global Mobile Menu
    mobile_menu_match = re.search(r'(<div id="mobile-menu".*?</div>\s*</div>\s*</div>)', content, re.DOTALL)
    mobile_menu_html = mobile_menu_match.group(1) if mobile_menu_match else ""

    # Global Footer
    footer_match = re.search(r'(<footer.*?</footer>)', content, re.DOTALL)
    footer_html = footer_match.group(1) if footer_match else ""

    # Global Script Tags (AOS, Nav Logic)
    # Actually we just need to initialize AOS and Mobile Nav listeners.
    aos_nav_script = """
  <script>
    AOS.init({ duration: 800, once: true, offset: 50 });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile');

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

    if(mobileBtn) mobileBtn.addEventListener('click', openMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);

    if(mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }
  </script>
"""

    # We will embed the whole unified HTML into login/index.html
    login_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <base href="/">
  
  <title>Customer Login | Sweet Maid Cleaning Service</title>
  <meta name="description" content="Access your Sweet Maid Cleaning Service account quickly and securely. Manage your bookings, payments, and preferences all in one place."/>
  <meta name="keywords" content="customer login, client login, account login, Sweet Maid Cleaning Service login"/>
  <meta name="robots" content="all">
  <link rel="canonical" href="https://sweetmaidcleaning.com/login/"/>
  
  <meta property="og:url" content="https://sweetmaidcleaning.com/login/"/>
  <meta property="og:title" content="Customer Login | Sweet Maid Cleaning Service"/>
  <meta property="og:description" content="Access your Sweet Maid Cleaning Service account quickly and securely. Manage your bookings, payments, and preferences all in one place."/>
  <meta property="og:image" content="https://i.ibb.co/QSD3Ydt/image.jpg"/>
  
  <link rel="shortcut icon" href="/images/favicon.png?v=3">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3">
  <link rel="apple-touch-icon" href="/images/favicon.png?v=3">

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- AOS & Font Awesome -->
  <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <!-- Global Nav Logic -->
  <script src="/js/navigation-dynamic.js" defer></script>

  <!-- BookingKoala Customer Portal Assets -->
  <link rel="stylesheet" id="font-awesome" href="https://cdn.bookingkoala.com/assets/font/font-awesome/font-awesome.css" media="print" onload="this.media='all'">
  <link rel="stylesheet" id="theme-css" href="https://cdn.bookingkoala.com/assets/css/29/simple-theme.css" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://cdn.bookingkoala.com/customer-build/139/styles.be840003d5879412.css" media="print" onload="this.media='all'">
  <script src="https://cdn.bookingkoala.com/assets/tinymce-5-10-5/tinymce.min.js"></script>
  <script> window.allowOldVersion = false; </script>

  <!-- Google Tag Manager -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BR6TVQXR2Y"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {{ dataLayer.push(arguments); }}
    gtag('js', new Date());
    gtag('config', 'G-BR6TVQXR2Y');
  </script>

  <style>
    /* Global Theme Overrides */
    :root {{
      --color-primary: #ffc9e0;
      --color-secondary: #ffe0ed;
      --color-accent: #ffd4e8;
      --text-dark: #2d1b2e;
      --text-gray: #8b5a7d;
    }}

    body {{
      font-family: 'Poppins', system-ui, sans-serif;
      color: var(--text-dark);
      background: linear-gradient(135deg, #fffafc 0%, #fff5f9 50%, #ffe8f4 100%);
      background-attachment: fixed;
      scroll-behavior: smooth;
    }}
    
    h1, h2, h3, h4 {{ font-family: 'Playfair Display', serif; letter-spacing: -0.01em; }}

    /* Sweet Maid Core Components */
    .header-glass {{
      background: linear-gradient(135deg, rgba(255, 245, 247, 0.95) 0%, rgba(255, 232, 240, 0.95) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 2px solid rgba(255, 107, 157, 0.2);
      box-shadow: 0 4px 20px rgba(255, 107, 157, 0.1);
    }}

    .text-gradient {{
      background: linear-gradient(135deg, #ffc9e0 0%, #ffd4e8 50%, #ffe0ed 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-shift 3s ease infinite;
    }}

    @keyframes gradient-shift {{
      0%, 100% {{ background-position: 0% 50%; }}
      50% {{ background-position: 100% 50%; }}
    }}

    .animate-float {{
      animation: float 6s ease-in-out infinite;
    }}
    @keyframes float {{
      0% {{ transform: translateY(0px); }}
      50% {{ transform: translateY(-20px); }}
      100% {{ transform: translateY(0px); }}
    }}

    /* Global Nav Elements */
    .nav-dropdown {{ position: relative; }}
    .dropdown-menu {{
      position: absolute; visibility: hidden; opacity: 0;
      transform: translateY(-10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }}
    .nav-dropdown:hover .dropdown-menu {{
      visibility: visible; opacity: 1; transform: translateY(0); pointer-events: auto;
    }}

    /* Mobile */
    #mobile-menu {{ transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(100%); }}
    #mobile-menu.active {{ transform: translateX(0); }}
    .mobile-menu-glass {{ background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }}
    .accordion-content {{ max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }}
    .accordion-active .accordion-content {{ max-height: 2000px; }}
    .accordion-icon {{ transition: transform 0.3s ease; }}
    .accordion-active .accordion-icon {{ transform: rotate(180deg); }}

    /* BK Overrides & Glass Container */
    .hiring_perm_rows{{display:none;}}
    .tox.tox-silver-sink.tox-tinymce-aux .tox-notification--warning {{ display: none !important; }}
    .tjs-component-loader #page-container > div {{ min-height: auto !important; }}
    
    .login-glass {{
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 25px 50px -12px rgba(255, 107, 157, 0.15), 0 0 0 1px rgba(255,107,157,0.05);
    }}
    
    /* Force BookingKoala form backgrounds to inherit our glass style or be transparent */
    bk-root {{
      display: block; width: 100%; min-height: 600px;
    }}
    .booking-form-main, .tjs-app--root {{
      background: transparent !important;
    }}
  </style>

</head>
<body id="bkIframe" class="antialiased tjs-app--root tjs-component-loader">
  
  {header_html}
  {mobile_menu_html}

  <main class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center overflow-hidden">
    <!-- Beautiful Background Atmosphere -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-pink-50 to-transparent"></div>
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-float" style="animation-duration: 8s;"></div>
      <div class="absolute top-20 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-[60px] opacity-40 animate-float" style="animation-duration: 6s; animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-50"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <!-- Left Side: Aesthetic Marketing -->
        <div data-aos="fade-right" data-aos-duration="1000" class="pt-10 lg:pt-0">
          <span class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-pink-50 text-pink-400 font-bold tracking-widest uppercase text-xs mb-6 border border-pink-100 shadow-sm">
            <i class="fa-solid fa-sparkles"></i> Client Portal
          </span>
          <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-gray-900 leading-[1.1]">
            Manage your <br>
            <span class="text-gradient">shining home.</span>
          </h1>
          <p class="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed font-light">
            Welcome back to Sweet Maid! Access your secure dashboard to instantly book new cleanings, reschedule appointments, manage your preferences, and update payment methods in one seamless place.
          </p>
          
          <div class="flex items-center gap-5 text-sm font-semibold text-gray-800 bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm backdrop-blur-md w-fit">
            <div class="flex -space-x-3">
              <img class="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-md" src="https://i.ibb.co/QSD3Ydt/image.jpg" alt="Cleaning">
              <div class="w-12 h-12 rounded-full border-[3px] border-white bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-500 shadow-md">
                <i class="fa-solid fa-star"></i>
              </div>
            </div>
            <div>
              <p class="text-gray-900 font-bold mb-0.5">Trusted by Florida</p>
              <p class="text-pink-400 font-medium text-xs">Join 5,000+ happy clients</p>
            </div>
          </div>
        </div>

        <!-- Right Side: BookingKoala Portal -->
        <div data-aos="fade-up" data-aos-duration="1200" data-aos-delay="200" class="relative mt-8 lg:mt-0">
          <!-- Decorative Glow Behind Portal -->
          <div class="absolute -inset-1 bg-gradient-to-r from-pink-100 via-white to-pink-50 rounded-[2.5rem] blur-xl opacity-60"></div>
          
          <div class="relative login-glass rounded-[2rem] p-6 sm:p-10">
            <div class="text-center mb-6">
               <img src="https://i.ibb.co/PzPDfC1N/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover.png" alt="Sweet Maid Theme" class="h-16 w-auto mx-auto hover:scale-105 transition-transform duration-500">
               <h3 class="font-serif text-xl font-bold text-gray-800 mt-4 mb-1">Welcome Back</h3>
               <p class="text-xs text-gray-500 uppercase tracking-widest font-semibold">Secure Login</p>
            </div>
            
            <!-- BookingKoala Root Element -->
            <div class="w-full relative z-20">
              <bk-root></bk-root>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200/50 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <i class="fa-solid fa-lock text-pink-300"></i>
              <span>256-bit Secure Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  {footer_html}
  {aos_nav_script}

  <!-- BookingKoala Runtimes -->
  <script src="https://cdn.bookingkoala.com/assets/js/16/app.min.js?&offsetTop=0&offsetTopM=0&theme=simple&summaryOffset=0" id="tjsAppJS" defer></script>
  <script src="https://cdn.bookingkoala.com/assets/js/15/tejas-bootstrap.min.js" defer></script>
  <script src="https://cdn.bookingkoala.com/resources/bk-tracking.js"></script>
  <script src="https://cdn.bookingkoala.com/customer-build/139/runtime.8e298df1c2d46a94.js" type="module"></script>
  <script src="https://cdn.bookingkoala.com/customer-build/139/polyfills.3538d5e41a26a3ea.js" type="module"></script>
  <script src="https://cdn.bookingkoala.com/customer-build/139/vendor.a67c9f2fcb86619c.js" type="module"></script>
  <script src="https://cdn.bookingkoala.com/customer-build/139/main.d30b3fdf0bccb42c.js" type="module"></script>
  <script>setTimeout(()=>{{document.body.classList.remove('tjs-component-loader')}},3000)</script>

</body>
</html>
"""

    with open(os.path.join(base_dir, "login", "index.html"), "w", encoding="utf-8") as f:
        f.write(login_html)
    
    print("Successfully built the new stunning login page at /login/index.html")

if __name__ == "__main__":
    build_login_page()
