/**
 * Reduce una foto en el navegador antes de subirla (máx. 2000 px, JPG).
 * Las fotos de celular pesan varios MB; así quedan por debajo de 1 MB y el envío
 * cabe en el límite del servidor. El servidor vuelve a procesarla de todas formas.
 */
const MAX_SIDE = 2000;

export async function resizeImageForUpload(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo procesar la foto.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) throw new Error("No se pudo procesar la foto.");
  return new File([blob], "imagen.jpg", { type: "image/jpeg" });
}
