// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🐟  Handler Total Fitur - Gawr Gura Bot 🦈✨
// "glub glub~ contando todas las aletas (features) disponibles" 🐠
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let handler = async (m, { conn, args, command }) => {
    // 🦑 Contando todos los plugins con help & tags válidos
    let totalf = Object.values(global.plugins).filter(
        (v) => v.help && v.tags
    ).length;

    // 🐬 Respuesta con estilo Gura
    conn.reply(
        m.chat, 
        `🦈✨ *Total de Fitur en el arrecife GuraBot*: ${totalf}\n\n🌊 Cada comando es como una burbuja bajo el mar, ¡explóralos todos, desu~!`, 
        m
    );
}

// 📌 Info del comando
handler.help = ['totalfitur'];
handler.tags = ['info'];
handler.command = ['totalfitur'];

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "¡Wow! tantas funciones como peces en el océano~ glub 🐋"
// ─────────────── ⋆⋅☆⋅⋆
