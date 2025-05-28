const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate logo192.png
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'logo192.png'));
    
    // Generate logo512.png
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'logo512.png'));
    
    // Generate favicon.ico (using the 32x32 PNG as base)
    const favicon32 = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    await sharp(favicon32)
      .toFile(path.join(publicDir, 'favicon.ico'));
    
    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
