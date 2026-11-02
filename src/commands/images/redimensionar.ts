import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("redimensionar")
    .setDescription("Cambia el tamaño de una imagen")
    .addAttachmentOption(option => option.setName("imagen").setDescription("Sube una imagen (.png, .jpg, .webp)").setRequired(true))
    .addIntegerOption(option => option.setName("ancho").setDescription("Nuevo ancho").setRequired(false))
    .addIntegerOption(option => option.setName("altura").setDescription("Nueva altura").setRequired(false)) as SlashCommandBuilder,
  categoria: "Imagenes",
  run: async (client, interaction): Promise<void> => {
    await interaction.deferReply();

    const attachment = interaction.options.getAttachment("imagen");
    const customWidth = interaction.options.getInteger("ancho");
    const customHeight = interaction.options.getInteger("altura");

    if (!attachment || !attachment.contentType?.startsWith("image/")) {
      await interaction.editReply({ content: "❌ **Error:** El archivo adjunto debe ser una imagen válida (.png, .jpg, .jpeg, .webp)." });
      return;
    }

    try {
      const image = await loadImage(attachment.url);

      const width = customWidth || image.width;
      const height = customHeight || image.height;

      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const buffer = canvas.toBuffer("image/png");
      const file = new AttachmentBuilder(buffer, { name: "resize.png" });

      await interaction.editReply({ files: [file] });
    }
    catch (error) {
      console.error("Error al procesar la imagen con Canvas:", error);
      await interaction.editReply({ content: "⚠️ Ocurrió un error inesperado al procesar tu imagen." });
    }
  }
};

export default command;
