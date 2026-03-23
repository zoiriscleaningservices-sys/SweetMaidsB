#!/usr/bin/env python3
"""
Deep SEO upgrade for root service pages & priority location pages.
- Fixes broken titles (House's Premier, etc.)
- Injects unique, keyword-rich titles, descriptions, and og:title
- Adds proper schema name, areaServed 
- Fixes H1 text in the hero section
"""

import os
import re

BASE_DIR = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
BASE_URL = "https://sweetmaidcleaning.com"

# ---------------------------------------------------------
# SERVICE PAGES: Unique metadata per service
# ---------------------------------------------------------
SERVICE_SEO = {
    "house-cleaning": {
        "title": "House Cleaning Services in Florida | Sweet Maid Cleaning",
        "desc": "Sweet Maid is Florida's top-rated house cleaning company. From Bradenton and Sarasota to Naples and Fort Myers, our vetted maids deliver spotless results. Book online — satisfaction guaranteed.",
        "og_title": "House Cleaning Services in Florida | Sweet Maid Cleaning",
        "h1": "Florida's Best House Cleaning Service",
        "h1_span": "Trusted Statewide",
        "hero_p": "Leading provider of <strong>house cleaning services across Florida</strong>. Whether you need a recurring maid service or a one-time clean, our vetted professionals deliver 5-star results. Serving Manatee, Sarasota, Charlotte, and Lee counties.",
        "topbar": "#1 Rated House Cleaning Service in Florida",
        "schema_name": "Sweet Maid Cleaning Service - Best House Cleaning in Florida",
        "schema_desc": "Florida's top-rated house cleaning company. Sweet Maid provides expert house cleaning services across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "House Cleaning Services Florida",
        "offer2": "Residential Maid Service Florida",
        "offer3": "Weekly House Cleaning Florida",
        "faq_q1": "What is the best house cleaning service in Florida?",
        "faq_a1": "Sweet Maid is the top-rated provider of house cleaning across Southwest Florida. Our vetted, bonded professionals serve Bradenton, Sarasota, Naples, Fort Myers, and surrounding areas with 100% satisfaction guaranteed.",
        "faq_q2": "How much does house cleaning cost in Florida?",
        "faq_a2": "House cleaning costs in Florida depend on home size and frequency. Sweet Maid offers transparent, competitive pricing with free quotes. Most recurring cleans range from $100-$350 depending on your home.",
        "faq_q3": "Does Sweet Maid serve all areas of Florida?",
        "faq_a3": "Sweet Maid primarily serves Southwest Florida — including Bradenton, Sarasota, Venice, Palmetto, Parrish, North Port, Naples, Fort Myers, Cape Coral, Port Charlotte, and all surrounding communities.",
    },
    "deep-cleaning": {
        "title": "Deep Cleaning Services Florida | Thorough Move-In Ready Clean | Sweet Maid",
        "desc": "Need a complete deep clean? Sweet Maid's deep cleaning service covers every inch — baseboards, grout, appliances, and more. Serving Bradenton, Sarasota, Naples & all of Southwest Florida.",
        "og_title": "Deep Cleaning Services Florida | Sweet Maid Cleaning",
        "h1": "Professional Deep Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Our <strong>deep cleaning service in Florida</strong> goes beyond the surface. We tackle every corner, appliance, baseboard, and hidden grime spot to leave your home truly reset. Perfect for move-ins, seasonal cleans, or post-event restoration.",
        "topbar": "#1 Rated Deep Cleaning Service in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Deep Cleaning Services Florida",
        "schema_desc": "Professional deep cleaning services across Southwest Florida. Sweet Maid's deep clean covers every corner, appliance, and baseboard.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Deep Cleaning Services Florida",
        "offer2": "Move-In Deep Clean Florida",
        "offer3": "Seasonal Deep Clean Southwest Florida",
        "faq_q1": "What is included in a deep cleaning service in Florida?",
        "faq_a1": "Sweet Maid's deep cleaning includes scrubbing grout, cleaning inside appliances, wiping baseboards, detailed bathroom sanitization, ceiling fans, light fixtures, window sills, and all areas a standard cleaning skips.",
        "faq_q2": "How much does a deep cleaning cost in Southwest Florida?",
        "faq_a2": "Deep cleaning in Southwest Florida typically ranges from $200-$500 depending on home size. Sweet Maid provides free quotes with transparent pricing and no hidden fees.",
        "faq_q3": "How often should I get a deep cleaning in Florida?",
        "faq_a3": "We recommend a deep cleaning every 3-6 months to maintain a truly hygienic home. Many clients combine monthly standard cleans with a quarterly deep clean for optimal results.",
    },
    "airbnb-cleaning": {
        "title": "Airbnb Cleaning Services Florida | 5-Star Vacation Rental Turnover | Sweet Maid",
        "desc": "Keep your Airbnb guest-ready with Sweet Maid's fast, hotel-standard vacation rental cleaning. Serving hosts in Sarasota, Siesta Key, Anna Maria, Naples, and all of Southwest Florida.",
        "og_title": "Airbnb Cleaning Services Florida | Sweet Maid Cleaning",
        "h1": "5-Star Airbnb Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Maximize your <strong>Airbnb reviews and revenue</strong> with Sweet Maid's fast, reliable vacation rental cleaning. We handle same-day turnovers, restock fresh linens, and deliver the hotel-grade clean guests rave about.",
        "topbar": "#1 Rated Airbnb Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Airbnb & Vacation Rental Cleaning Florida",
        "schema_desc": "Professional Airbnb and vacation rental cleaning across Southwest Florida. Fast turnover service for hosts in Sarasota, Siesta Key, Anna Maria, and Naples.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Airbnb Cleaning Services Florida",
        "offer2": "Vacation Rental Turnover Cleaning",
        "offer3": "Short-Term Rental Cleaning Sarasota",
    },
    "move-in-out-cleaning": {
        "title": "Move In / Move Out Cleaning Florida | Get Your Deposit Back | Sweet Maid",
        "desc": "Moving in or out? Sweet Maid's move cleaning ensures your property is spotless for new tenants or final walkthroughs. Serving Bradenton, Sarasota, Naples, Fort Myers & all of Southwest Florida.",
        "og_title": "Move In / Move Out Cleaning Florida | Sweet Maid Cleaning",
        "h1": "Move In / Move Out Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Protect your security deposit and impress new tenants with Sweet Maid's <strong>move-in and move-out cleaning in Florida</strong>. We cover every surface from top to bottom — guaranteed to meet landlord walkthrough standards.",
        "topbar": "#1 Rated Move In/Out Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Move In/Out Cleaning Florida",
        "schema_desc": "Professional move-in and move-out cleaning services across Southwest Florida. Guarantee deposit return with our thorough move cleaning.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Move Out Cleaning Florida",
        "offer2": "Move In Cleaning Southwest Florida",
        "offer3": "End of Tenancy Cleaning Florida",
    },
    "commercial-cleaning": {
        "title": "Commercial Cleaning Services Florida | Office & Business Cleaning | Sweet Maid",
        "desc": "Professional commercial cleaning for offices, retail, and businesses across Southwest Florida. Sweet Maid delivers consistent, insured cleaning for Bradenton, Sarasota, Naples, and Fort Myers.",
        "og_title": "Commercial Cleaning Services Florida | Sweet Maid Cleaning",
        "h1": "Commercial Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Keeping your business spotless is our specialty. Sweet Maid provides <strong>commercial cleaning services across Southwest Florida</strong> — from Bradenton and Sarasota to Naples and Fort Myers. Fully insured, bonded teams available on your schedule.",
        "topbar": "#1 Rated Commercial Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Commercial Cleaning Services Florida",
        "schema_desc": "Professional commercial cleaning services for offices, retail, and businesses across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Commercial Cleaning Services Florida",
        "offer2": "Office Cleaning Southwest Florida",
        "offer3": "Business Cleaning Bradenton Sarasota",
    },
    "post-construction-cleaning": {
        "title": "Post-Construction Cleaning Florida | Builder's Clean Experts | Sweet Maid",
        "desc": "Construction debris, dust, and residue — gone. Sweet Maid's post-construction cleaning team prepares new homes and renovated spaces for move-in across Southwest Florida.",
        "og_title": "Post-Construction Cleaning Florida | Sweet Maid Cleaning",
        "h1": "Post-Construction Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "After the last nail is hammered, Sweet Maid's specialized <strong>post-construction cleaning team</strong> transforms your space from jobsite to showpiece. We remove construction dust, debris, adhesive residue, and packaging — making it move-in ready.",
        "topbar": "#1 Rated Post-Construction Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Post-Construction Cleaning Florida",
        "schema_desc": "Expert post-construction cleaning services across Southwest Florida. Turn your newly built or renovated space move-in ready.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Post-Construction Cleaning Florida",
        "offer2": "Builder's Clean Southwest Florida",
        "offer3": "New Construction Final Clean Bradenton",
    },
    "luxury-estate-cleaning": {
        "title": "Luxury Estate Cleaning Florida | White-Glove Home Cleaning | Sweet Maid",
        "desc": "Sweet Maid's white-glove luxury estate cleaning service serves the most discerning homeowners in Sarasota, Siesta Key, Longboat Key, Bird Key, Naples, and Marco Island.",
        "og_title": "Luxury Estate Cleaning Florida | Sweet Maid Cleaning",
        "h1": "White-Glove Luxury Estate Cleaning",
        "h1_span": "Southwest Florida",
        "hero_p": "For Florida's most prestigious coastal estates, only the finest cleaning service will do. Sweet Maid delivers <strong>white-glove luxury estate cleaning</strong> with unmatched attention to detail, premium eco-friendly products, and absolute discretion.",
        "topbar": "#1 Rated Luxury Estate Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Luxury Estate Cleaning Florida",
        "schema_desc": "White-glove luxury estate cleaning services for Sarasota, Siesta Key, Longboat Key, Bird Key, Naples, and surrounding high-end communities.",
        "schema_locality": "Sarasota",
        "area_served": "Southwest Florida Luxury Markets",
        "offer1": "Luxury Estate Cleaning Sarasota",
        "offer2": "White-Glove Home Cleaning Longboat Key",
        "offer3": "High-End Residential Cleaning Naples Florida",
    },
    "luxury-estate-management": {
        "title": "Luxury Estate Management Florida | Premium Property Care | Sweet Maid",
        "desc": "Comprehensive luxury estate management for absentee homeowners and seasonal residents across Sarasota, Longboat Key, Naples, and Marco Island. Sweet Maid handles everything.",
        "og_title": "Luxury Estate Management Florida | Sweet Maid",
        "h1": "Luxury Estate Management Services",
        "h1_span": "Southwest Florida",
        "hero_p": "For seasonal and absentee homeowners, Sweet Maid's <strong>luxury estate management</strong> ensures your Florida property is always pristine, secure, and guest-ready — whether you're here or away.",
        "topbar": "#1 Rated Estate Management in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Luxury Estate Management Florida",
        "schema_desc": "Premium luxury estate management services for seasonal and absentee homeowners in Sarasota, Longboat Key, Naples, and Fort Myers.",
        "schema_locality": "Sarasota",
        "area_served": "Southwest Florida",
        "offer1": "Luxury Estate Management Florida",
        "offer2": "Vacation Home Management Sarasota",
        "offer3": "Seasonal Property Management Naples",
    },
    "carpet-cleaning": {
        "title": "Carpet Cleaning Services Florida | Deep Steam Clean | Sweet Maid",
        "desc": "Restore your carpets to like-new freshness with Sweet Maid's professional carpet cleaning. Hot water extraction, stain removal, and deodorizing across Southwest Florida.",
        "og_title": "Carpet Cleaning Services Florida | Sweet Maid",
        "h1": "Professional Carpet Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Don't replace — restore! Sweet Maid's <strong>professional carpet cleaning</strong> uses hot water extraction to remove deep-seated dirt, allergens, stains, and odors. Your carpets will look and smell fresh for months.",
        "topbar": "#1 Rated Carpet Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Carpet Cleaning Services Florida",
        "schema_desc": "Professional carpet cleaning and stain removal services across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Carpet Cleaning Florida",
        "offer2": "Steam Carpet Cleaning Bradenton Sarasota",
        "offer3": "Carpet Stain Removal Southwest Florida",
    },
    "pressure-washing": {
        "title": "Pressure Washing Services Florida | Driveways, Roofs & More | Sweet Maid",
        "desc": "Blast away dirt, mold, and stains with Sweet Maid's professional pressure washing. Driveways, sidewalks, roofs, and exterior walls across Bradenton, Sarasota, and Southwest Florida.",
        "og_title": "Pressure Washing Services Florida | Sweet Maid",
        "h1": "Professional Pressure Washing Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Florida's humidity breeds mold and mildew fast. Sweet Maid's <strong>professional pressure washing service</strong> restores your driveways, walkways, roofs, and exterior surfaces to their original brilliance. Soft wash options available for delicate surfaces.",
        "topbar": "#1 Rated Pressure Washing in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Pressure Washing Services Florida",
        "schema_desc": "Professional pressure washing for driveways, roofs, and exterior surfaces across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Pressure Washing Services Florida",
        "offer2": "Driveway Pressure Washing Bradenton",
        "offer3": "Roof Soft Wash Sarasota Florida",
    },
    "window-cleaning": {
        "title": "Window Cleaning Services Florida | Crystal Clear Results | Sweet Maid",
        "desc": "Professional window cleaning for homes and businesses across Southwest Florida. Streak-free inside and out — Bradenton, Sarasota, Naples, and beyond.",
        "og_title": "Window Cleaning Services Florida | Sweet Maid",
        "h1": "Professional Window Cleaning Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Let the Florida sunshine in with <strong>crystal-clear window cleaning</strong> by Sweet Maid. Interior and exterior window washing, screen cleaning, and frame wiping — streak-free results every time.",
        "topbar": "#1 Rated Window Cleaning in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Window Cleaning Services Florida",
        "schema_desc": "Professional window cleaning services for homes and businesses across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Window Cleaning Services Florida",
        "offer2": "Residential Window Cleaning Sarasota",
        "offer3": "Commercial Window Washing Bradenton",
    },
    "airbnb-vacation-rental-management": {
        "title": "Airbnb & Vacation Rental Management Florida | Full-Service | Sweet Maid",
        "desc": "Full-service Airbnb and vacation rental management across Southwest Florida. Sweet Maid handles turnover cleaning, linen service, supply restocking, and guest communications.",
        "og_title": "Vacation Rental Management Florida | Sweet Maid",
        "h1": "Airbnb & Vacation Rental Management",
        "h1_span": "Southwest Florida",
        "hero_p": "Maximize your rental income with Sweet Maid's <strong>full-service vacation rental management</strong>. We handle complete turnovers, guest communications, linen service, and supply restocking — so you earn more while doing less.",
        "topbar": "#1 Rated Vacation Rental Management in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Vacation Rental Management Florida",
        "schema_desc": "Full-service Airbnb and vacation rental management for hosts in Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Vacation Rental Management Florida",
        "offer2": "Airbnb Management Sarasota Siesta Key",
        "offer3": "Short-Term Rental Services Southwest Florida",
    },
    "home-watch-services": {
        "title": "Home Watch Services Florida | Trusted Property Inspection | Sweet Maid",
        "desc": "Protect your Florida home while you're away with Sweet Maid's certified home watch services. Regular inspections, storm checks, and property reports for Sarasota, Naples, and Southwest Florida.",
        "og_title": "Home Watch Services Florida | Sweet Maid",
        "h1": "Certified Home Watch Services",
        "h1_span": "Southwest Florida",
        "hero_p": "Florida's seasonal homeowners trust Sweet Maid to protect their property year-round. Our <strong>certified home watch service</strong> provides scheduled inspections, written reports, storm preparation checks, and immediate response to issues.",
        "topbar": "#1 Rated Home Watch Service in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Home Watch Services Florida",
        "schema_desc": "Certified home watch and property inspection services for seasonal homeowners across Southwest Florida.",
        "schema_locality": "Sarasota",
        "area_served": "Southwest Florida",
        "offer1": "Home Watch Services Florida",
        "offer2": "Seasonal Property Inspection Sarasota",
        "offer3": "Vacant Home Monitoring Southwest Florida",
    },
    "office-janitorial-services": {
        "title": "Office Janitorial Services Florida | Daily & Nightly Cleaning | Sweet Maid",
        "desc": "Professional office janitorial services for businesses across Southwest Florida. Sweet Maid provides reliable daily, nightly, and weekly cleaning for offices in Bradenton, Sarasota, and Naples.",
        "og_title": "Office Janitorial Services Florida | Sweet Maid",
        "h1": "Professional Office Janitorial Services",
        "h1_span": "Southwest Florida",
        "hero_p": "A clean office boosts productivity and creates the right first impression. Sweet Maid's <strong>professional janitorial services</strong> keep your workspace sanitized and spotless on your schedule — daily, nightly, or weekly.",
        "topbar": "#1 Rated Office Janitorial Service in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Office Janitorial Services Florida",
        "schema_desc": "Professional office and commercial janitorial services for businesses across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Office Janitorial Services Florida",
        "offer2": "Nightly Office Cleaning Bradenton",
        "offer3": "Daily Janitorial Service Sarasota Florida",
    },
    "janitorial-cleaning-services": {
        "title": "Janitorial Cleaning Services Florida | Commercial & Industrial | Sweet Maid",
        "desc": "Sweet Maid provides comprehensive janitorial cleaning services for commercial, industrial, and institutional facilities across Southwest Florida. Licensed, insured, and highly rated.",
        "og_title": "Janitorial Cleaning Services Florida | Sweet Maid",
        "h1": "Full-Service Janitorial Cleaning",
        "h1_span": "Southwest Florida",
        "hero_p": "From small offices to large commercial facilities, Sweet Maid's <strong>janitorial cleaning services</strong> deliver consistent, professional results. We customize cleaning programs to meet your facility's specific needs and schedule.",
        "topbar": "#1 Rated Janitorial Service in Southwest Florida",
        "schema_name": "Sweet Maid Cleaning - Janitorial Cleaning Services Florida",
        "schema_desc": "Professional janitorial and facility cleaning services for commercial and industrial clients across Southwest Florida.",
        "schema_locality": "Bradenton",
        "area_served": "Southwest Florida",
        "offer1": "Janitorial Cleaning Services Florida",
        "offer2": "Commercial Facility Cleaning Bradenton",
        "offer3": "Industrial Janitorial Service Southwest Florida",
    },
}


def upgrade_service_page(folder_name, seo):
    """Apply deep SEO upgrade to a root service page."""
    filepath = os.path.join(BASE_DIR, folder_name, "index.html")
    if not os.path.exists(filepath):
        print(f"  SKIP: {filepath} not found")
        return False

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    original = content

    # 1. Fix <title>
    content = re.sub(r'<title>[^<]+</title>', f'<title>{seo["title"]}</title>', content, count=1)

    # 2. Fix meta description
    content = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{seo["desc"]}"',
        content, count=1
    )

    # 3. Fix og:title
    content = re.sub(
        r'<meta property="og:title" content="[^"]*"',
        f'<meta property="og:title" content="{seo["og_title"]}"',
        content, count=1
    )

    # 4. Fix og:description
    content = re.sub(
        r'<meta property="og:description" content="[^"]*"',
        f'<meta property="og:description" content="{seo["desc"]}"',
        content, count=1
    )

    # 5. Fix schema name
    content = re.sub(
        r'"name":\s*"Sweet Maid Cleaning Service - Best [^"]*"',
        f'"name": "{seo["schema_name"]}"',
        content, count=1
    )

    # 6. Fix schema description
    content = re.sub(
        r'"description":\s*"Looking for the best [^"]*"',
        f'"description": "{seo["schema_desc"]}"',
        content, count=1
    )

    # 7. Fix schema addressLocality
    content = re.sub(
        r'"addressLocality":\s*"[^"]*"',
        f'"addressLocality": "{seo["schema_locality"]}"',
        content, count=1
    )

    # 8. Fix areaServed name
    content = re.sub(
        r'("areaServed":\s*\{[^}]*"name":\s*")[^"]*(")',
        rf'\g<1>{seo["area_served"]}\g<2>',
        content
    )

    # 9. Fix offers
    content = re.sub(
        r'"name":\s*"House Cleaning in Florida FL"',
        f'"name": "{seo["offer1"]}"',
        content, count=1
    )
    content = re.sub(
        r'"name":\s*"Florida House Cleaning"',
        f'"name": "{seo["offer2"]}"',
        content, count=1
    )
    content = re.sub(
        r'"name":\s*"House Cleaning Florida fl"',
        f'"name": "{seo["offer3"]}"',
        content, count=1
    )

    # 10. Fix top bar
    content = re.sub(
        r'#1 Rated Cleaning Service in\s*\n?\s+(?:House|Deep|Airbnb|Move|Commercial|Post.Construction|Luxury|Carpet|Pressure|Window|Home|Office|Janitorial|Floor|Solar|Gutter|Property|Gym|School|Church|Industrial|Airbnb).*?(?=</span>)',
        seo["topbar"],
        content, flags=re.DOTALL
    )
    # Also catch single-line variant
    content = re.sub(
        r'#1 Rated Cleaning Service in\s+(?:House|Deep|Airbnb|Move|Commercial|Post-Construction|Luxury|Carpet|Pressure|Window|Home|Office|Janitorial|Screen|Floor|Solar|Gutter|Property|Gym|School|Church|Industrial)[^\n<]*',
        seo["topbar"],
        content
    )

    # 11. Fix H1 
    content = re.sub(
        r'(<h1[^>]*>)The Best House Cleaning in\s*<br>\s*<span[^>]*>[^<]*</span>(</h1>)',
        rf'\g<1>{seo["h1"]} <span class="text-gradient">{seo["h1_span"]}</span>\g<2>',
        content, flags=re.DOTALL
    )

    # 12. Fix FAQ questions (for service pages with proper FAQ data)
    if "faq_q1" in seo:
        content = re.sub(
            r'"name":\s*"What is the best House Cleaning service in Florida, FL\?"',
            f'"name": "{seo["faq_q1"]}"',
            content, count=1
        )
    if "faq_a1" in seo:
        # Fix first FAQ answer
        content = re.sub(
            r'"text":\s*"Sweet Maid is the top-rated provider of House Cleaning in Florida[^"]*"',
            f'"text": "{seo["faq_a1"]}"',
            content, count=1
        )
    if "faq_q2" in seo:
        content = re.sub(
            r'"name":\s*"How much does House Cleaning cost in Florida\?"',
            f'"name": "{seo["faq_q2"]}"',
            content, count=1
        )
    if "faq_a2" in seo:
        content = re.sub(
            r'"text":\s*"The cost of House Cleaning in Florida varies[^"]*"',
            f'"text": "{seo["faq_a2"]}"',
            content, count=1
        )
    if "faq_q3" in seo:
        content = re.sub(
            r'"name":\s*"Who provides the best House Cleaning Florida fl\?"',
            f'"name": "{seo["faq_q3"]}"',
            content, count=1
        )
    if "faq_a3" in seo:
        content = re.sub(
            r'"text":\s*"Sweet Maid Cleaning is widely recognized as providing the best Florida House Cleaning[^"]*"',
            f'"text": "{seo["faq_a3"]}"',
            content, count=1
        )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    print("=== Service Page Deep SEO Upgrade ===\n")
    fixed = 0
    for folder_name, seo in SERVICE_SEO.items():
        result = upgrade_service_page(folder_name, seo)
        status = "UPGRADED" if result else "  NO CHANGE"
        print(f"{status}: {folder_name}")
        if result:
            fixed += 1

    print(f"\nDone! {fixed}/{len(SERVICE_SEO)} pages upgraded.")


if __name__ == "__main__":
    main()
