import { getColorFromURL } from 'color-thief-node';

async function extractColorFromImage(imageURL: string) {
  const dominantColor = await getColorFromURL(imageURL);

  const rgb = {
    r: dominantColor[0],
    g: dominantColor[1],
    b: dominantColor[2]
  };
  const stringRgb = `R: ${rgb.r}, G: ${rgb.g}, B: ${rgb.b}`;
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return {
    dominantColor,    // Array [r, g, b]
    stringRgb,        // String "R: r, G: g, B: b"
    hex               // String "#rrggbb"
  };
}

// Función para convertir decimal a hexadecimal
function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export default extractColorFromImage