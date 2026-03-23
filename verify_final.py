import re

checks = [
    ("bradenton-fl/index.html", "https://sweetmaidcleaning.com/bradenton-fl/", "#1 House Cleaning in Bradenton"),
    ("sarasota-fl/index.html", "https://sweetmaidcleaning.com/sarasota-fl/", "#1 House Cleaning in Sarasota"),
    ("siesta-key-fl/index.html", "https://sweetmaidcleaning.com/siesta-key-fl/", "#1 House Cleaning in Siesta Key"),
    ("naples-fl/index.html", "https://sweetmaidcleaning.com/naples-fl/", "#1 Luxury House Cleaning in Naples"),
    ("house-cleaning/index.html", "https://sweetmaidcleaning.com/house-cleaning/", "House Cleaning Services in Florida"),
    ("deep-cleaning/index.html", "https://sweetmaidcleaning.com/deep-cleaning/", "Deep Cleaning Services Florida"),
    ("luxury-estate-cleaning/index.html", "https://sweetmaidcleaning.com/luxury-estate-cleaning/", "Luxury Estate Cleaning"),
]

all_pass = True
for fname, expected_canon, expected_title_fragment in checks:
    with open(fname, encoding='utf-8', errors='replace') as f:
        content = f.read()

    canon = re.search(r'rel="canonical" href="([^"]+)"', content)
    title = re.search(r'<title>([^<]+)</title>', content)
    breadcrumb = "BreadcrumbList" in content
    schema_url = re.search(r'"url":\s*"(https://sweetmaidcleaning\.com[^"]+)"', content)
    faq_q1 = re.search(r'"name":\s*"What is the best House Cleaning service in ([^"]+)"', content)
    lat = re.search(r'"latitude":\s*"([^"]+)"', content)

    canon_ok = canon and canon.group(1) == expected_canon
    title_ok = title and expected_title_fragment in title.group(1)

    status = "PASS" if (canon_ok and title_ok and breadcrumb) else "FAIL"
    if status == "FAIL":
        all_pass = False

    print(f"[{status}] {fname}")
    print(f"  canonical = {canon.group(1) if canon else 'MISSING'} {'OK' if canon_ok else 'WRONG!'}")
    print(f"  title     = {title.group(1)[:60] if title else 'MISSING'} {'OK' if title_ok else 'WRONG!'}")
    print(f"  breadcrumb= {'YES' if breadcrumb else 'NO!'}")
    print(f"  schema url= {schema_url.group(1) if schema_url else 'MISSING'}")
    print(f"  FAQ Q1    = {faq_q1.group(1)[:40] if faq_q1 else 'not found'}")
    print(f"  lat/lon   = {lat.group(1) if lat else 'N/A'}")
    print()

print("=============================")
print("OVERALL:", "ALL PASS" if all_pass else "SOME FAILED - review above")
