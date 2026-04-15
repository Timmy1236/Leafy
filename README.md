<div align="center">
  <img src="https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/Documento.png" alt="Leafy Banner">
  <br />
  <div align="center">
    <h3 align="center">Un simple bot para discord, nada más.</h3>
  </div>

  [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
  [![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?logo=discord&logoColor=white)](#)
  [![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)
</div>

> ⚠️ El port de JS a TS se acaba de realizar recientemente, el bot se encuentra en un estado muy experimental.

> ⚠️ El soporte de los message commands fue deprecatado. Si quieres usar message commands, puedes ver la rama: [legacy-2025](https://github.com/Timmy1236/Leafy/tree/legacy-2025)

# Leafy
El objetivo de Leafy es ser un bot lo mas *'ligero'* posible en discord.js.<br>
**No** usar servicios externos como base de datos o API que podrían sufrir cambios que dejen de ser compatibles con el bot.
<br>
**No** usar funciones experimentales que podrían fallar de un dia para el otro. <br>
**Simplemente** un bot que pueda arrancar y conectarse a Discord con solo la necesidad de unos clicks.

## Tabla de contenidos
- [Características](#características)
- [Screenshots](#screenshots)
- [Instalación](#instalación)
- [Licencia](#licencia)

## Características
1. Soporte total de [slash commands](https://discord.com/developers/docs/interactions/application-commands) para tener acceso a características exclusivas de los interactions.
2. Fácil de modificar, puedes añadir un nuevo comando en menos de un minuto.
3. Compacto, usando la minima cantidad de dependencias posibles.
4. Siempre actualizado a las ultimas versiones de Discord.js para tener acceso a todas las funciones nuevas de Discord.
5. Base de datos hecho con: [SQLite](https://sqlite.org/), funcionando de forma local sin la necesidad de instalar cosas extras.

## Screenshots
Ejemplo: "/User"           |  Ejemplos: "/Server"
:-------------------------:|:-------------------------:
![user](https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/example-user.png)  |  ![server](https://file.garden/aSqYsBZqpx5ZY3su/github/leafy/example-server.png)

## Instalación
1. Es recomendable que tengas instalado la ultima version [LTS de Node.js](https://nodejs.org).
2. [Clona](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository) el repositorio.
3. Crea un archivo llamado: "config.json" con las variables del: "[config_example.json](https://github.com/Timmy1236/Leafy/blob/main/config_example.json)" y déjalo dentro de la carpeta 'src/'.

4. Instala todas las dependencias del bot.
```bash
npm install
```

5. Sincroniza los comandos slash y el database, tendrás que ejecutarlo de vuelta si agregas o eliminas slash commands, o cuando realizas cambios en la base de datos.
```bash
npm run slash

npm run db
```

6. Encender el bot, ya estaría, simple como eso.
```bash
npm run start:build
```

## Licencia
Todo el código de este proyecto esta debajo de la licencia "[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)"