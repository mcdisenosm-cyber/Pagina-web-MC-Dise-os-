/**
 * Pasos del proceso de trabajo.
 * Redactados de forma general: no prometen plazos, visitas, garantías ni
 * condiciones que MC Diseños no haya confirmado. Ajustar cuando se definan.
 */
export type ProcessStep = {
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Cuéntanos tu idea",
    description:
      "Escríbenos con lo que tienes en mente: el espacio, cómo lo usas y, si las tienes, medidas, fotos o referencias.",
  },
  {
    title: "Definimos el diseño y los materiales",
    description:
      "Revisamos contigo la propuesta, la distribución y los acabados en lámina de RH hasta que el diseño responda a lo que buscas.",
  },
  {
    title: "Fabricamos tu mobiliario",
    description:
      "Con el diseño aprobado, elaboramos cada pieza a la medida acordada y con los acabados elegidos.",
  },
  {
    title: "Coordinamos la instalación y entrega",
    description:
      "Acordamos contigo cómo y cuándo entregar tu mobiliario para que puedas empezar a disfrutar el espacio.",
  },
];
