import { createCanvas, loadImage } from "@napi-rs/canvas";

async function extractColorFromImage(imageURL: string) {
  const image = await loadImage(imageURL);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  // Lee los píxeles de la imagen. El resultado contiene cuatro valores por píxel: rojo, verde, azul y transparencia.
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const colorGroups = new Map<string, { count: number; rgb: [number, number, number] }>();

  for (let i = 0; i < data.length; i += 4) {
    // Ignora píxeles casi transparentes para que no alteren el color visible de la imagen.
    if (data[i + 3] < 128) continue;

    const rgb: [number, number, number] = [data[i], data[i + 1], data[i + 2]];

    // Redondea cada componente a grupos de 16 niveles. Así, tonos casi iguales cuentan como el mismo color.
    const groupKey = rgb.map(component => Math.round(component / 16)).join(",");
    const group = colorGroups.get(groupKey);

    if (group) group.count++;
    else colorGroups.set(groupKey, { count: 1, rgb });
  }

  // El grupo con más píxeles representa el color más frecuente; usa negro si la imagen no tiene píxeles visibles.
  const dominantColor: [number, number, number] =
    [...colorGroups.values()].sort((a, b) => b.count - a.count)[0]?.rgb ?? [0, 0, 0];
  const [r, g, b] = dominantColor;

  return {
    dominantColor,
    stringRgb: `R: ${r}, G: ${g}, B: ${b}`,
    hex: `#${[r, g, b].map(component => component.toString(16).padStart(2, "0")).join("")}`
  };
}

export default extractColorFromImage;
