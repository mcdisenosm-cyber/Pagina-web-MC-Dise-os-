import "server-only";
import sharp from "sharp";

/** Tamaño máximo aceptado por el servidor (el panel reduce la foto antes de enviarla). */
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

export class ImageValidationError extends Error {}

/**
 * Valida y normaliza una foto subida desde el panel:
 * - Solo JPG, PNG o WebP reales (se comprueba el contenido, no solo la extensión).
 * - Máximo 3 MB y dimensiones razonables.
 * - Se gira según la orientación de la cámara, se reduce a 1600 px y se guarda
 *   como JPG. Se eliminan los metadatos (EXIF/GPS) para no publicar la ubicación.
 */
export async function processProjectImage(file: File): Promise<Buffer> {
  if (!ALLOWED_TYPES.has(file.type)) throw new ImageValidationError("La foto debe ser JPG, PNG o WebP.");
  if (file.size === 0) throw new ImageValidationError("La foto está vacía.");
  if (file.size > MAX_UPLOAD_BYTES) throw new ImageValidationError("La foto es demasiado pesada (máximo 3 MB).");

  const input = Buffer.from(await file.arrayBuffer());
  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    metadata = await sharp(input, { limitInputPixels: 50_000_000 }).metadata();
  } catch {
    throw new ImageValidationError("El archivo no es una imagen válida.");
  }
  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new ImageValidationError("La foto debe ser JPG, PNG o WebP.");
  }
  if ((metadata.width ?? 0) < 400 || (metadata.height ?? 0) < 300) {
    throw new ImageValidationError("La foto es muy pequeña (mínimo 400 × 300 px).");
  }

  return sharp(input, { limitInputPixels: 50_000_000 })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}
