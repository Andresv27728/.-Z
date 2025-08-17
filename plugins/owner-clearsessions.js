const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

let handler = async (m, { conn, usedPrefix, args }) => {
  const sesi = ['./sessions'];
  const array = [];

  // Recopilar todos los archivos excepto creds.json
  sesi.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      if (file !== 'creds.json') { 
        array.push(join(dirname, file));
      }
    });
  });

  const deletedFiles = [];

  // Borrar archivos y registrar
  array.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
      console.log(`📂 Omitiendo directorio: ${file}`);
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  // 10 variantes de mensajes con ASCII art estilo Gawr Gura
  const mensajesAFK = [
`🦈💙 ¡Archivos eliminados, capitán! 💙🦈
   (\_._/)
    (o o)
    >💦<  
Archivos borrados: ${deletedFiles.length}`,

`🌊🐟 ¡Sesiones borradas en el océano! 🐟🌊
   ><(((('>  
Archivos eliminados: ${deletedFiles.length}`,

`🐠✨ ¡El mar brilla limpio! ✨🐠
   (\_._/)  
   (o_o)  
   / >💙  
Archivos eliminados: ${deletedFiles.length}`,

`💦🦈 ¡Tiburoncito feliz! 💦🦈
   (\_._/)  
   (• •)  
   >💦<  
Archivos eliminados: ${deletedFiles.length}`,

`🦈🌟 ¡Todo limpio, navegando seguro! 🌟🦈
   (\_._/)  
   (o_o)  
   >💙<  
Archivos eliminados: ${deletedFiles.length}`,

`🐟💙 ¡Archivos borrados, tiburón feliz! 💙🐟
   (\_._/)  
   (• •)  
   / >💦  
Archivos eliminados: ${deletedFiles.length}`,

`🌊✨ ¡Sesiones eliminadas, mar tranquilo! ✨🌊
   (\_._/)  
   (o o)  
   >💙<  
Archivos borrados: ${deletedFiles.length}`,

`🦈🐠 ¡AFK de archivos completado! 🐠🦈
   (\_._/)  
   (o_o)  
   >💦<  
Archivos eliminados: ${deletedFiles.length}`,

`💙🐋 ¡El océano de archivos está limpio! 💙🐋
   (\_._/)  
   (• •)  
   / >💙  
Archivos eliminados: ${deletedFiles.length}`,

`🐠🦈 ¡Sesiones borradas con estilo Gura! 🦈🐠
   (\_._/)  
   (o o)  
   >💦<  
Archivos eliminados: ${deletedFiles.length}`
  ];

  // Elegir un mensaje aleatorio
  let mensaje = mensajesAFK[Math.floor(Math.random() * mensajesAFK.length)];
  conn.reply(m.chat, mensaje, m);

  // Mostrar lista de archivos eliminados (si hay)
  if (deletedFiles.length > 0) {
    conn.reply(m.chat, `📂 Archivos eliminados:\n${deletedFiles.join('\n')}`, m);
    console.log('Deleted files:', deletedFiles);
  } else {
    conn.reply(m.chat, '🦈💦 No había archivos restantes en la carpeta sessions 🐟', m);
  }
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = /^(clearsession|clearsessions)$/i;
handler.rowner = true;

module.exports = handler;
