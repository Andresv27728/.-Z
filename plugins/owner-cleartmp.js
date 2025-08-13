const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

let handler = async (m, { conn }) => {

  const tmp = ['./tmp'];
  const filenames = [];

  // Recolectar todos los archivos dentro de /tmp
  tmp.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      filenames.push(join(dirname, file));
    });
  });

  const deletedFiles = [];

  filenames.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
      console.log(`📂 Omitiendo carpeta: ${file}`);
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  // Mensaje de confirmación
  conn.reply(m.chat, '🧹 ¡Carpeta temporal limpiada con éxito!', m);

  // Mostrar archivos eliminados
  if (deletedFiles.length > 0) {
    console.log('🗑 Archivos eliminados:', deletedFiles);
    conn.reply(m.chat, `🗑 *Archivos eliminados:*\n${deletedFiles.join('\n')}`, m);
  }

  // Si no había archivos
  if (deletedFiles.length == 0) {
    conn.reply(m.chat, '📂 No hay archivos para eliminar en la carpeta *tmp*.', m);
  }
};

handler.help = ['cleartmp'];
handler.tags = ['owner'];
handler.command = /^(cleartmp)$/i;
handler.rowner = true;

module.exports = handler;
