<div align="center">
  <img src="https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/Documento.png" alt="Leafy Banner">
  <br/>
  <div align="center">
    <h3 align="center">Un simple y ligero bot para Discord</h3>
  </div>

  [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
  [![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?logo=discord&logoColor=white)](#)
  [![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)
</div>

# Leafy
El objetivo de Leafy es ser el bot mas simple posible. **Nunca** se debería de usar servicios de terceros, ya que tendrías que confiar en un código que podría perfectamente dejar de funcionar o simplemente dejar de existir. **Debe** de ser lo mas simple y configurable posible, si alguien instala el bot en su propia máquina, no tiene que costearle mas que unos cuantos clicks y tecleos. **Siempre** tiene que estar en las ultimas versiones para aprovechar el mayor arreglos, mejoras y optimizaciones.

## Tabla de contenidos
- [Características](#características)
- [Screenshots](#screenshots)
- [Instalación](#instalación)
- [Licencia](#licencia)

## Características
1. Modificable, puedes añadir un nuevo comando al bot en menos de un minuto y el mismo help lo añadirá automáticamente.
2. Compacto, usando la minima cantidad de dependencias si es posible.
3. Actualizado, siempre usando las ultimas versiones disponibles de las dependencias.
4. Soporte de "[Application Commands](https://discord.com/developers/docs/interactions/application-commands)". *Descontinuado el soporte de "Message Commands" en [legacy-2025](https://github.com/Timmy1236/Leafy/tree/legacy-2025).*
5. Base de datos hecho en [SQLite](https://sqlite.org/).
6. Edición de imágenes usando [Canvas](https://github.com/Brooooooklyn/canvas).

## Screenshots
Ejemplo: "/User"           |  Ejemplos: "/Server"
:-------------------------:|:-------------------------:
![user](https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/example-user.png)  |  ![server](https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/example-server.png)

## Instalación
* Supongo que ya sabras como instalar: [node.js](https://nodejs.org/es) y [pnpm](https://pnpm.io/) en tu maquina. También entender que es y como se [clona](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository) un [repositorio](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) con git o desde github.
1. Crea un archivo llamado: "config.json" y llénalo de datos que pide: "[config_example.json](https://github.com/Timmy1236/Leafy/blob/main/config_example.json)".

2. Instala todas las dependencias del bot.
```bash
pnpm install
```

3. Compila el código del bot y enciéndelo en un instante.
```bash
pnpm dev
```

* En caso de que hayas creado o modificado comandos localmente del bot, es necesario que sincronices tus cambios a Discord.
```bash
pnpm sync
```

## Licencia
Todo el código fuente está bajo la licencia: [GPL-3.0-only](https://www.gnu.org/licenses/gpl-3.0.html)