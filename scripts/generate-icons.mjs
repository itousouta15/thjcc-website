import { Buffer } from "node:buffer";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sourcePath = path.join(publicDirectory, "images", "THJCC.webp");
const iconDirectory = path.join(publicDirectory, "icons");
const background = { r: 26, g: 27, b: 27, alpha: 1 };
const icoSizes = [16, 24, 32, 48, 64, 96, 128, 256];

await access(publicDirectory);
await access(sourcePath);
await mkdir(iconDirectory, { recursive: true });
const source = await sharp(sourcePath).trim().png().toBuffer();

async function renderIcon(size, { rounded = false, scale = 0.86 } = {}) {
  const artworkSize = Math.max(1, Math.round(size * scale));
  const { data, info } = await sharp(source).resize({ width: artworkSize, height: artworkSize, fit: "inside" })
    .png().toBuffer({ resolveWithObject: true });
  const layers = [{ input: data, left: Math.floor((size - info.width) / 2), top: Math.floor((size - info.height) / 2) }];
  if (rounded) {
    layers.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.2}" fill="white"/></svg>`),
      blend: "dest-in",
    });
  }
  let image = sharp({ create: { width: size, height: size, channels: 4, background } }).composite(layers);
  if (!rounded) image = image.removeAlpha();
  return image.png().toBuffer();
}

async function dibFrame(png, size) {
  const rgba = await sharp(png).ensureAlpha().raw().toBuffer();
  const pixelBytes = size * size * 4;
  const maskStride = Math.ceil(size / 32) * 4;
  const dib = Buffer.alloc(40 + pixelBytes + maskStride * size);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(size, 4);
  dib.writeInt32LE(size * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(pixelBytes + maskStride * size, 20);
  for (let y = 0; y < size; y++) {
    const row = size - y - 1;
    for (let x = 0; x < size; x++) {
      const from = (y * size + x) * 4;
      const to = 40 + (row * size + x) * 4;
      dib[to] = rgba[from + 2];
      dib[to + 1] = rgba[from + 1];
      dib[to + 2] = rgba[from];
      dib[to + 3] = rgba[from + 3];
      if (rgba[from + 3] < 128) dib[40 + pixelBytes + row * maskStride + Math.floor(x / 8)] |= 0x80 >> (x % 8);
    }
  }
  return dib;
}

const faviconPngs = new Map(await Promise.all(icoSizes.map(async size =>
  [size, await renderIcon(size, { rounded: true, scale: 0.9 })])));
// Use 32-bit DIBs for every frame so Windows ICO readers can decode all sizes.
const frames = await Promise.all(icoSizes.map(async size => ({
  size,
  data: await dibFrame(faviconPngs.get(size), size),
})));
const directory = Buffer.alloc(6 + frames.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
frames.forEach(({ size, data }, index) => {
  const entry = 6 + index * 16;
  directory[entry] = size === 256 ? 0 : size;
  directory[entry + 1] = size === 256 ? 0 : size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(data.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile(path.join(publicDirectory, "favicon.ico"), Buffer.concat([directory, ...frames.map(frame => frame.data)]));
console.log(`favicon.ico: ${icoSizes.join(", ")}px`);

for (const size of [16, 32, 48, 96]) {
  await writeFile(path.join(iconDirectory, `favicon-${size}x${size}.png`), faviconPngs.get(size));
}
for (const [name, size, scale] of [
  ["apple-touch-icon.png", 180, 0.82],
  ["android-chrome-192x192.png", 192, 0.86],
  ["android-chrome-512x512.png", 512, 0.86],
  ["android-chrome-maskable-512x512.png", 512, 0.6],
]) {
  await writeFile(path.join(iconDirectory, name), await renderIcon(size, { scale }));
  console.log(`${name}: ${size}x${size}`);
}
