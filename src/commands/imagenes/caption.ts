import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("caption")
    .setDescription("Añade texto a una imagen")
    .addAttachmentOption((option) => option.setName("imagen").setDescription("Sube una imagen (.png, .jpg, .webp)").setRequired(true))
    .addStringOption((option) => option.setName("text").setDescription("Texto del caption").setRequired(true)) as SlashCommandBuilder,
  categoria: "Imagenes",
  run: async (client, interaction): Promise<void> => {
    await interaction.deferReply();

    const attachment = interaction.options.getAttachment("imagen");
    const rawText = interaction.options.getString("text") || "";

    if (!attachment || !attachment.contentType?.startsWith("image/")) {
      await interaction.editReply({ content: "❌ **Error:** El archivo adjunto debe ser una imagen válida (.png, .jpg, .jpeg, .webp)." });
      return;
    }

    try {
      const image = await loadImage(attachment.url);

      const width = image.width;
      const height = image.height;
      const captionHeight = 100;

      const canvas = createCanvas(width, height + captionHeight);
      const context = canvas.getContext("2d");
      
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, captionHeight);

      context.drawImage(image, 0, captionHeight, width, height);

      const maxLineWidth = width - 40;
      const minFontSize = 8;
      let fontSize = 60;
      let lines: string[] = [];
      let lineHeight = 0;

      GlobalFonts.registerFromPath(path.join(__dirname, '../../../assets/fonts/impact.ttf'), 'impact');

      // Bucle para reducir la fuente si el texto es muy largo
      while (fontSize >= minFontSize) {
        context.font = `bold ${fontSize}px impact`;
        lineHeight = fontSize * 1.2;
        
        lines = [];
        const words = rawText.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = context.measureText(testLine);

          if (metrics.width > maxLineWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          lines.push(currentLine);
        }

        // Comprobamos si el bloque total de texto entra en la altura de los 250px (con márgenes de 20px arriba/abajo)
        const totalTextHeight = lines.length * lineHeight;
        if (totalTextHeight <= captionHeight - 40) {
          break;
        }

        // Si no cabe, reducimos la fuente y probamos de nuevo
        fontSize -= 4;
      }

      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const totalBlockHeight = lines.length * lineHeight;
      let startY = (captionHeight - totalBlockHeight) / 2 + (lineHeight / 2);

      for (const line of lines) {
        context.fillText(line, width / 2, startY);
        startY += lineHeight;
      }

      const buffer = canvas.toBuffer("image/png");
      const file = new AttachmentBuilder(buffer, { name: "caption.png" });

      await interaction.editReply({ files: [file] });

    } catch (error) {
      console.error("Error al procesar la imagen con Canvas:", error);
      await interaction.editReply({ content: "⚠️ Ocurrió un error inesperado al procesar tu imagen." });
    }
  }
};

export default command;