import fs from 'fs';
import { PNG } from 'pngjs';

fs.createReadStream('logo_makhana.png')
  .pipe(new PNG())
  .on('parsed', function() {
    console.log(`Image size: ${this.width}x${this.height}`);
    
    // Sample corners to see background
    const idx0 = (0 + 0 * this.width) * 4;
    console.log(`Top-left pixel: R=${this.data[idx0]}, G=${this.data[idx0+1]}, B=${this.data[idx0+2]}, A=${this.data[idx0+3]}`);

    // Checkered pattern squares: white (255,255,255) and light gray (around 204-245)
    // Let's identify checkered pixels: pixels where r, g, b are very close to each other (grayscale/white) and brightness > 190.
    // Wait, let's be careful not to make the makhana ball interior transparent if it has white/cream.
    // The makhana ball has texture, but the background is a strict checkerboard pattern across the entire bounding box outside the logo.
    // Alternatively, we can floodfill from (0,0) with color tolerance!
    
    const targetColors = [];
    // Collect unique corner colors
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const idx = (x + y * this.width) * 4;
        targetColors.push({ r: this.data[idx], g: this.data[idx+1], b: this.data[idx+2] });
      }
    }
    
    // Flood fill from (0,0)
    const visited = new Uint8Array(this.width * this.height);
    const queue = [[0, 0]];
    visited[0] = 1;
    
    // Get background color at 0,0
    const bgR = this.data[idx0];
    const bgG = this.data[idx0+1];
    const bgB = this.data[idx0+2];
    
    function colorMatch(r, g, b, tr, tg, tb) {
      // Check if pixel is white or light gray checkerboard
      const isWhiteOrGray = (r > 200 && g > 200 && b > 200) || (Math.abs(r - g) < 5 && Math.abs(g - b) < 5 && r > 180);
      return isWhiteOrGray;
    }

    let head = 0;
    while(head < queue.length) {
      const [x, y] = queue[head++];
      const idx = (x + y * this.width) * 4;
      
      this.data[idx+3] = 0; // Make transparent
      
      const neighbors = [[1,0], [-1,0], [0,1], [0,-1]];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          const npos = nx + ny * this.width;
          if (!visited[npos]) {
            visited[npos] = 1;
            const nidx = npos * 4;
            const nr = this.data[nidx];
            const ng = this.data[nidx+1];
            const nb = this.data[nidx+2];
            if (colorMatch(nr, ng, nb, bgR, bgG, bgB)) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
    
    console.log(`Flood fill completed. Transparent pixels set: ${queue.length}`);

    this.pack().pipe(fs.createWriteStream('logo_makhana.png'));
    console.log('Saved processed logo_makhana.png');
  });
