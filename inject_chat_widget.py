import os
import re

def inject_widget(base_dir):
    script_to_inject = """
  <!-- LeadConnector Chat Widget -->
  <script 
    src="https://widgets.leadconnectorhq.com/loader.js"  
    data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" 
    data-widget-id="688944c881758bda483c0af4"   > 
  </script>
"""
    body_close_pattern = re.compile(r'</body>', re.IGNORECASE)
    
    count = 0
    errors = 0
    already_injected = 0
    
    for root, dirs, files in os.walk(base_dir):
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if not file.endswith('.html'): continue
            filepath = os.path.join(root, file)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if "688944c881758bda483c0af4" in content:
                    already_injected += 1
                    continue
                
                if body_close_pattern.search(content):
                    new_content = body_close_pattern.sub(f'{script_to_inject}</body>', content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
                else:
                    with open(filepath, 'a', encoding='utf-8') as f:
                        f.write(script_to_inject)
                    count += 1
                    
            except Exception as e:
                print(f"Error on {filepath}: {e}")
                errors += 1
                
    print(f"Injected chat widget into {count} HTML files. Already injected: {already_injected}. Errors: {errors}")

if __name__ == '__main__':
    base_dir = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
    inject_widget(base_dir)
