const { getColorFromURL } = require('color-thief-node');

async function extractColorFromImage(imageURL) {
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
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

module.exports = {
  extractColorFromImage
}