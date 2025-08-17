// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🐟  Handler Runtime - Gawr Gura Bot 🐟🌊
// "glub glub~ el bot lleva nadando todo este tiempo" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let handler = async (m, { conn, usedPrefix, command }) => {
    let _uptime = process.uptime() * 1000
    let tio = clockString(_uptime)
    let time = require('moment-timezone').tz('Asia/Jakarta').format('HH:mm:ss')

    // 🐋 Mensaje de tiempo en el océano
    var ct = `
*───「 🌊 RUNTIME GURA BOT 🦈 」───*

⏱️ Tiempo activo: ${tio}
🕒 Hora del océano (Jakarta): ${time}

> Glub glub~ sigo nadando sin parar 💙
    `
    m.reply(ct)
}

handler.help = ['runtime'] // 🦈 muestra cuánto tiempo lleva nadando el bot
handler.tags = ['info']
handler.command = /^(uptime|runtime)$/i

module.exports = handler

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// ⏱️ Función para calcular días, horas, min, seg
// ─────────────── ⋆⋅☆⋅⋆
function clockString(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Día(s) " + hours + " Hora(s) " + minutes + " Minuto(s) " + sec + " Segundo(s) ";
}

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "He estado nadando por ${tio} sin cansarme 🐟✨"
// ─────────────── ⋆⋅☆⋅⋆
