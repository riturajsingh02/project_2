import glob

html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace h-14 sm:h-20 or similar with h-20 sm:h-28 (or even larger)
    updated = content.replace('class="h-14 sm:h-20 w-auto object-contain', 'class="h-20 sm:h-28 w-auto object-contain')
    updated = updated.replace('class="h-12 w-auto object-contain', 'class="h-16 w-auto object-contain')
    updated = updated.replace('class="h-14 w-auto object-contain', 'class="h-20 sm:h-28 w-auto object-contain')
    
    # Also catch any h-10 sm:h-12 if left over
    updated = updated.replace('class="h-10 sm:h-12 w-auto object-contain', 'class="h-20 sm:h-28 w-auto object-contain')
    
    if updated != content:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"Made logo bigger in {filename}")
