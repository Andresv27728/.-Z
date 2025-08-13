let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `📂 *Falta la ruta del archivo*\n\n💡 Uso:\n${usedPrefix + command} <ruta>\n\nEjemplo:\n${usedPrefix + command} plugins/menu.js`;
    if (!m.quoted.text) throw `💬 *Responde a un mensaje de texto para guardarlo como archivo*`;

    let path = `${text}`;
    await require('fs').writeFileSync(path, m.quoted.text);

    m.reply(`✅ Archivo guardado correctamente en:\n📄 *${path}*`);
};

handler.help = ['sf <ruta>'];
handler.tags = ['owner'];
handler.command = /^sf$/i;

handler.rowner = true;

module.exports = handler;
