import glob

html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace makhana_logo.png with logo_makhana.png
    updated = content.replace("makhana_logo.png", "logo_makhana.png")
    
    # Also increase logo size classes for better visibility and readability
    # e.g., h-10 sm:h-12 -> h-14 sm:h-20
    # h-9 -> h-12
    updated = updated.replace('class="h-10 sm:h-12 w-auto object-contain', 'class="h-14 sm:h-20 w-auto object-contain')
    updated = updated.replace('class="h-9 w-auto object-contain', 'class="h-12 w-auto object-contain')
    updated = updated.replace('class="h-10 w-auto object-contain', 'class="h-14 w-auto object-contain')
    
    if updated != content:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"Updated {filename}")
