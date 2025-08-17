let cp = require('child_process');
let { promisify } = require('util');
let exec = promisify(cp.exec).bind(cp);

let handler = async (m, { conn, isOwner, command, text }) => {
    if (global.conn.user.jid != conn.user.jid) return;

    // Mensajes decorativos de ejecución Gawr Gura
    const mensajesInicio = [
        '🦈💙 ¡Preparando los comandos submarinos, capitán! 💙🦈',
        '🌊🐟 ¡Tiburoncito activo, ejecutando shell! 🐟🌊',
        '🐠✨ ¡Sumergiéndonos en los comandos! ✨🐠',
        '💦🦈 ¡Ejecutando con estilo Gura! 💦🦈',
        '🦈🌟 ¡El océano de comandos se agita! 🌟🦈',
        '🐟💙 ¡Listo para el show de comandos, tiburoncito! 💙🐟',
        '🌊✨ ¡Ejecutando comandos submarinos! ✨🌊',
        '🦈🐠 ¡Cuidado, capitán! Comandos en acción 🐠🦈',
        '💙🐋 ¡Tiburoncito Gura activando shell! 💙🐋',
        '🐠🦈 ¡Los comandos están listos para nadar! 🦈🐠'
    ];
    let inicio = mensajesInicio[Math.floor(Math.random() * mensajesInicio.length)];
    m.reply(inicio);

    let o;
    try {
        o = await exec(command.trimStart() + ' ' + text.trimEnd());
    } catch (e) {
        o = e;
    } finally {
        let { stdout, stderr } = o;
        if (stdout && stdout.trim()) {
            m.reply(`🦈💙 Resultado:\n${stdout}`);
        }
        if (stderr && stderr.trim()) {
            m.reply(`🐟🌊 Error:\n${stderr}`);
        }
    }
};

handler.help = ['$'];
handler.tags = ['advanced'];
handler.customPrefix = /^[$] /;
handler.command = new RegExp;
handler.rowner = true;

module.exports = handler;
