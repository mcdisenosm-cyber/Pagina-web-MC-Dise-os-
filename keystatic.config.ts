import { collection, config, fields } from "@keystatic/core";

/**
 * Panel de administración (Keystatic) en /keystatic.
 *
 * - En desarrollo (npm run dev) guarda los cambios directamente en los archivos
 *   del proyecto ("local").
 * - En producción guarda los cambios en GitHub ("github"): cada publicación es un
 *   commit en el repositorio y Vercel vuelve a desplegar la web automáticamente.
 *   Solo pueden entrar las personas con permiso de escritura en el repositorio.
 *
 * NEXT_PUBLIC_KEYSTATIC_STORAGE=github permite probar el modo GitHub en local
 * (necesario la primera vez para crear la GitHub App).
 */
export const keystaticUsesGitHub =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github" ||
  (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== "local");

const useGitHub = keystaticUsesGitHub;

const categoryOptions = [
  { label: "Cocinas integrales", value: "cocinas" },
  { label: "Muebles empotrados", value: "empotrados" },
  { label: "Clósets y armarios", value: "closets" },
  { label: "Puertas", value: "puertas" },
  { label: "Mesas y comedores", value: "mesas" },
  { label: "Diseños en CNC", value: "cnc" },
] as const;

export default config({
  storage: useGitHub
    ? { kind: "github", repo: { owner: "mcdisenosm-cyber", name: "Pagina-web-MC-Dise-os-" } }
    : { kind: "local" },
  ui: {
    brand: { name: "MC Diseños" },
  },
  collections: {
    proyectos: collection({
      label: "Proyectos de la galería",
      slugField: "titulo",
      path: "src/content/proyectos/*",
      format: { data: "json" },
      columns: ["categoria", "orden"],
      schema: {
        titulo: fields.slug({
          name: {
            label: "Título",
            description: "Nombre corto del trabajo, por ejemplo: Cocina blanca con isla.",
            validation: { length: { min: 3, max: 60 } },
          },
          slug: {
            label: "Identificador en la URL",
            description: "Se genera solo a partir del título. No es necesario cambiarlo.",
          },
        }),
        categoria: fields.select({
          label: "Categoría",
          options: [...categoryOptions],
          defaultValue: "cocinas",
        }),
        descripcion: fields.text({
          label: "Descripción",
          description: "Una o dos frases sobre el trabajo: materiales, tonos, qué incluye.",
          multiline: true,
          validation: { length: { min: 10, max: 300 } },
        }),
        imagen: fields.image({
          label: "Fotografía",
          description: "Foto del trabajo terminado. Preferiblemente JPG de buena calidad.",
          directory: "public/images/proyectos",
          publicPath: "/images/proyectos/",
          validation: { isRequired: true },
        }),
        textoAlternativo: fields.text({
          label: "Descripción de la foto (texto alternativo)",
          description:
            "Qué se ve en la imagen. Lo usan las personas con discapacidad visual y Google.",
          validation: { length: { min: 5, max: 200 } },
        }),
        formato: fields.select({
          label: "Formato en la galería",
          description: "Cómo se recorta la foto en la galería.",
          options: [
            { label: "Normal (vertical moderado)", value: "standard" },
            { label: "Vertical alargado", value: "tall" },
            { label: "Horizontal", value: "wide" },
          ],
          defaultValue: "standard",
        }),
        orden: fields.integer({
          label: "Posición en la galería",
          description: "Los números menores aparecen primero.",
          defaultValue: 100,
          validation: { min: 0, max: 9999 },
        }),
      },
    }),
  },
});
