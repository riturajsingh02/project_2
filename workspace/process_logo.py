from PIL import Image
import numpy as np

# Open logo_makhana.png
img = Image.open("logo_makhana.png").convert("RGBA")
arr = np.array(img)

# The checkered background consists of alternating white (255, 255, 255) and light gray (204, 204, 204 or similar) squares.
# Let's inspect unique colors or sample corners.
# Corners are typically checkered background.
corner1 = arr[0, 0]
corner2 = arr[0, 10]
print("Corner 1:", corner1)
print("Corner 2:", corner2)

# Let's replace checkered background (white and light gray blocks) with transparent (alpha = 0).
# In a checkered pattern, pixels are either white (approx 255, 255, 255) or light gray (approx 204-215).
# Let's check tolerance for checkered grid.
r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

# Checkered blocks are very close in RGB (r == g == b or nearly equal, with high brightness > 200).
is_gray_or_white = (abs(r.astype(int) - g.astype(int)) < 3) & (abs(g.astype(int) - b.astype(int)) < 3) & (r > 200)

# But wait! The makhana ball itself has white/cream areas (r, g, b > 200). If we make all high brightness near-neutral pixels transparent, we might punch holes inside the makhana ball!
# Let's check if the makhana ball has interior pixels that are white/cream. Yes, the makhana ball is light colored.
# Instead of blanket thresholding, let's floodfill from the 4 corners to remove only the connected checkered background!

from PIL import ImageOps

def floodfill_transparent(image):
    # Convert to RGBA
    img = image.convert("RGBA")
    width, height = img.size
    data = img.load()
    
    # We can use PIL's ImageDraw.floodfill or a custom BFS/DFS for flood fill from corners.
    # Corners: (0,0), (width-1, 0), (0, height-1), (width-1, height-1)
    
    # Let's identify background color from corners
    bg_colors = [data[0, 0], data[width-1, 0], data[0, height-1], data[width-1, height-1]]
    print("Background corner colors:", bg_colors)
    
    # Actually, the checkered pattern has two colors (e.g. white and light gray).
    # Let's check if we can remove checkered background by analyzing the grid or using color distance.
    # Alternatively, since the logo has dark brown text ("Makhanam") and a character with dark outlines, 
    # let's see if we can make the background solid white or transparent cleanly.
    
    # Let's test making a clean solid white background or transparent background.
    # If placed on the header (which is dark green #12241B), a transparent background is ideal, 
    # OR if the user wants "remove the image shown from the background of logo_makhana.png and make the logo visible ,make it big so that we can read whats written in that",
    # the checkered background in the preview made it look like a messy background or low contrast. 
    # If we replace the checkered background with a clean solid dark green (#12241B) or solid white or pure transparent, let's see what looks best.
    # Let's save a version with solid white background and a version with solid dark green background (#12241B) and pure transparent.
    
    return img

processed = floodfill_transparent(img)
processed.save("logo_makhana_transparent.png")
print("Processed saved.")
