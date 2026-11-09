import zlib
import struct
import math

width, height = 320, 80
pixels = [[(0, 0, 0, 0) for _ in range(width)] for _ in range(height)]

def set_pixel(x, y, r, g, b, a):
    if 0 <= x < width and 0 <= y < height:
        existing = pixels[y][x]
        if existing[3] == 0:
            pixels[y][x] = (r, g, b, a)
        else:
            fa = a / 255.0
            ea = existing[3] / 255.0
            out_a = fa + ea * (1 - fa)
            if out_a > 0:
                out_r = int((r * fa + existing[0] * ea * (1 - fa)) / out_a)
                out_g = int((g * fa + existing[1] * ea * (1 - fa)) / out_a)
                out_b = int((b * fa + existing[2] * ea * (1 - fa)) / out_a)
                pixels[y][x] = (out_r, out_g, out_b, int(out_a * 255))

# Draw Lotus Emblem on left (cx=40, cy=40, r=26)
cx, cy = 40, 40
for y in range(height):
    for x in range(width):
        dx = x - cx
        dy = y - cy
        dist = math.sqrt(dx*dx + dy*dy)
        # Outer gold ring
        if 23 <= dist <= 26:
            set_pixel(x, y, 201, 169, 97, 255)
        elif dist < 23:
            # inner dark green translucent fill
            set_pixel(x, y, 18, 36, 27, 220)

# Draw lotus petals inside emblem
for y in range(height):
    for x in range(width):
        dx = x - cx
        dy = y - cy
        # Central petal
        if -4 <= dx <= 4 and -18 <= dy <= 12:
            set_pixel(x, y, 232, 205, 132, 255)
        # Left petal
        if -14 <= dx <= -5 and -10 <= dy <= 8 and abs(dx + dy + 4) < 7:
            set_pixel(x, y, 232, 205, 132, 255)
        # Right petal
        if 5 <= dx <= 14 and -10 <= dy <= 8 and abs(dx - dy - 4) < 7:
            set_pixel(x, y, 232, 205, 132, 255)
        # Base lotus seed pods / pad
        if -10 <= dx <= 10 and 10 <= dy <= 16:
            set_pixel(x, y, 201, 169, 97, 255)

# Draw elegant text "MAKHANAM" starting around x = 85, y = 25 to 65
# We can draw stylized block / geometric font for "MAKHANAM" in bright gold (232, 205, 132)
def draw_bar(x1, y1, x2, y2, r, g, b, a):
    for y in range(max(0, y1), min(height, y2+1)):
        for x in range(max(0, x1), min(width, x2+1)):
            set_pixel(x, y, r, g, b, a)

# M
start_x = 85
# Left stem
draw_bar(start_x, 22, start_x + 3, 58, 232, 205, 132, 255)
# Diagonal 1
for i in range(10):
    draw_bar(start_x + 3 + i, 22 + int(i*1.8), start_x + 5 + i, 24 + int(i*1.8), 232, 205, 132, 255)
# Diagonal 2
for i in range(10):
    draw_bar(start_x + 13 + i, 40 - int(i*1.8), start_x + 15 + i, 42 - int(i*1.8), 232, 205, 132, 255)
# Right stem
draw_bar(start_x + 23, 22, start_x + 26, 58, 232, 205, 132, 255)

# A
ax = start_x + 34
draw_bar(ax, 25, ax + 3, 58, 232, 205, 132, 255)
draw_bar(ax + 12, 25, ax + 15, 58, 232, 205, 132, 255)
draw_bar(ax, 22, ax + 15, 25, 232, 205, 132, 255)
draw_bar(ax + 3, 38, ax + 12, 41, 232, 205, 132, 255)

# K
kx = start_x + 56
draw_bar(kx, 22, kx + 3, 58, 232, 205, 132, 255)
for i in range(8):
    draw_bar(kx + 3 + i, 40 - int(i*2), kx + 5 + i, 42 - int(i*2), 232, 205, 132, 255)
for i in range(9):
    draw_bar(kx + 3 + i, 40 + int(i*2), kx + 5 + i, 42 + int(i*2), 232, 205, 132, 255)

# H
hx = start_x + 75
draw_bar(hx, 22, hx + 3, 58, 232, 205, 132, 255)
draw_bar(hx + 14, 22, hx + 17, 58, 232, 205, 132, 255)
draw_bar(hx + 3, 38, hx + 14, 41, 232, 205, 132, 255)

# A
ax2 = start_x + 98
draw_bar(ax2, 25, ax2 + 3, 58, 232, 205, 132, 255)
draw_bar(ax2 + 12, 25, ax2 + 15, 58, 232, 205, 132, 255)
draw_bar(ax2, 22, ax2 + 15, 25, 232, 205, 132, 255)
draw_bar(ax2 + 3, 38, ax2 + 12, 41, 232, 205, 132, 255)

# N
nx = start_x + 120
draw_bar(nx, 22, nx + 3, 58, 232, 205, 132, 255)
for i in range(14):
    draw_bar(nx + 3 + int(i*0.8), 22 + int(i*2.3), nx + 5 + int(i*0.8), 24 + int(i*2.3), 232, 205, 132, 255)
draw_bar(nx + 15, 22, nx + 18, 58, 232, 205, 132, 255)

# A
ax3 = start_x + 144
draw_bar(ax3, 25, ax3 + 3, 58, 232, 205, 132, 255)
draw_bar(ax3 + 12, 25, ax3 + 15, 58, 232, 205, 132, 255)
draw_bar(ax3, 22, ax3 + 15, 25, 232, 205, 132, 255)
draw_bar(ax3 + 3, 38, ax3 + 12, 41, 232, 205, 132, 255)

# M
mx = start_x + 166
draw_bar(mx, 22, mx + 3, 58, 232, 205, 132, 255)
for i in range(9):
    draw_bar(mx + 3 + i, 22 + int(i*1.8), mx + 5 + i, 24 + int(i*1.8), 232, 205, 132, 255)
for i in range(9):
    draw_bar(mx + 12 + i, 38 - int(i*1.8), mx + 14 + i, 40 - int(i*1.8), 232, 205, 132, 255)
draw_bar(mx + 21, 22, mx + 24, 58, 232, 205, 132, 255)

# Encode to PNG
def png_pack(tag, data):
    return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", 0xffffffff & zlib.crc32(tag + data))

raw = bytearray()
for row in pixels:
    raw.append(0)
    for color in row:
        raw.extend(color)

compressed = zlib.compress(bytes(raw))
ihdr = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
png_bytes = b'\x89PNG\r\n\x1a\n' + png_pack(b'IHDR', ihdr) + png_pack(b'IDAT', compressed) + png_pack(b'IEND', b'')

with open('makhana_logo.png', 'wb') as f:
    f.write(png_bytes)

print('Successfully generated makhana_logo.png with transparent background and golden emblem!')
