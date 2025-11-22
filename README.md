# Leafy
Un simple bot para discord, nada más, simple como eso.
> La refactorización del proyecto sigue en progreso, algunas partes del código pueden no estar optimizadas o incluso no funcionales ahora mismo.

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?logo=discord&logoColor=white)](#)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)

## Tabla de contenidos
- [📦 Características](#características)
- [📷 Screenshots](#screenshots)
- [🤖 Instalación](#instalación)
- [📋 To-Do](#to-do)
- [🔐 Licencia](#licencia)

## Características
1. Soporte de los comandos clásicos y [slash commands](https://discord.com/developers/docs/interactions/application-commands).
2. Fácil de modificar, puedes añadir un nuevo comando en menos de un minuto.
3. Compacto, usando la minima cantidad de dependencias posibles.
4. Siempre actualizado a las ultimas versiones de Discord.js para tener acceso a todas las funciones nuevas de Discord.
5. Base de datos hecho con: [SQLite](https://sqlite.org/), no dependes de un servicio externo.

## Screenshots
  <img src="https://timmy.nekoweb.org//assets/images/leafy/user.png" />
  <img src="https://timmy.nekoweb.org//assets/images/leafy/server.png" />

## Instalación
1. Es recomendable que tengas instalado la ultima version [LTS de Node.js](https://nodejs.org).
2. [Clona](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository) el repositorio.
3. Crea un archivo llamado: "config.json" dentro del repositorio basado en: "[config_example.json](https://github.com/Timmy1236/Leafy/blob/main/config_example.json)" y remplaza las variables.

4. Instala todas las dependencias del bot.
```bash
npm install
```

5. Sincroniza los comandos slash y el database, tendrás que ejecutarlo de vuelta si agregas o eliminas slash commands, o cuando realizas cambios en la base de datos.
```bash
npm run sync_slash.js

npm run sync_db.js
```

6. Encender el bot, ya estaría, simple como eso.
```bash
npm run start
```

## To-Do
1. Portear todo a TypeScript. *:T*
2. Soporte multilenguaje.
3. Documentar mejor en los códigos.
4. Añadir mas cosas en el To-Do.

## Licencia
Este proyecto esta licenciado bajo la licencia [MIT](https://mit-license.org/).