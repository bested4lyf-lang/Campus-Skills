/**
 * Crops the centre square of a photo and shrinks it to size x size pixels.
 * A 256px JPEG is a few kilobytes, small enough to store with the profile.
 */
export async function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Your browser can't process this image.");
  }

  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}