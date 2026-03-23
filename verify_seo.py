import re, os
files_to_check = [
    ('bradenton-fl/index.html', 'https://sweetmaidcleaning.com/bradenton-fl/'),
    ('sarasota-fl/index.html', 'https://sweetmaidcleaning.com/sarasota-fl/'),
    ('house-cleaning/index.html', 'https://sweetmaidcleaning.com/house-cleaning/'),
    ('siesta-key-fl/index.html', 'https://sweetmaidcleaning.com/siesta-key-fl/'),
]
for fname, expected_url in files_to_check:
    with open(fname, encoding='utf-8', errors='replace') as f:
        content = f.read()
    canon = re.search(r'canonical href="([^"]+)"', content)
    faq_q1 = re.search(r'"name": "What is the best House Cleaning service in ([^"]+)"', content)
    schema_url = re.search(r'"url":\s*"(https://sweetmaidcleaning\.com[^"]+)"', content)
    title = re.search(r'<title>([^<]+)</title>', content)
    print(f"=== {fname} ===")
    print(f"  canonical = {canon.group(1) if canon else 'NOT FOUND'}")
    print(f"  schema url = {schema_url.group(1) if schema_url else 'NOT FOUND'}")
    print(f"  title = {title.group(1) if title else 'NOT FOUND'}")
    print(f"  FAQ Q1 = {faq_q1.group(1)[:50] if faq_q1 else 'NOT FOUND'}")
    print()
