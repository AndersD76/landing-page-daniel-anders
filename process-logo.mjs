import sharp from "sharp";

async function process() {
  const input = "public/logo.png";

  // 1. Remove white background
  const img = sharp(input);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();

  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i+1], b = raw[i+2];
    // If pixel is near-white, make transparent
    if (r > 230 && g > 230 && b > 230) {
      raw[i+3] = 0; // set alpha to 0
    }
    // Smooth edges (anti-alias near white)
    else if (r > 200 && g > 200 && b > 200) {
      const whiteness = Math.min(r, g, b);
      raw[i+3] = Math.max(0, 255 - Math.floor((whiteness - 200) * (255 / 55)));
    }
  }

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile("public/logo.png");
  console.log("✓ logo.png — white background removed");

  // 2. Generate favicon as 32x32 PNG
  await sharp("public/logo.png")
    .resize(32, 32)
    .png()
    .toFile("public/favicon.png");
  console.log("✓ favicon.png — 32x32");

  // 3. Generate favicon ICO-compatible (as 48x48 PNG)
  await sharp("public/logo.png")
    .resize(48, 48)
    .png()
    .toFile("public/favicon-48.png");
  console.log("✓ favicon-48.png — 48x48");

  // 4. Generate apple-touch-icon
  await sharp("public/logo.png")
    .resize(180, 180)
    .png()
    .toFile("public/apple-touch-icon.png");
  console.log("✓ apple-touch-icon.png — 180x180");

  console.log("\n✅ Done!");
}

process().catch(console.error);
