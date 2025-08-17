// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🐟  Handler Demote - Gawr Gura Bot 🐟🌊
// "glub glub~ degradando al admin al océano profundo" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let handler = async (m, { teks, conn, isOwner, isAdmin, args, command }) => {
    if (m.isBaileys) return;
    
    // 🐋 Solo los guardianes del arrecife (admins/owner) pueden usar esto
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
    let users = [];

    // 🐠 Si se responde a un mensaje, toma a ese usuario
    if (m.quoted) {
        if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid) return;
        users = [m.quoted.sender];
    } 
    // 🐬 O si se etiqueta a un usuario directamente
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        users = m.mentionedJid;
    } 
    // 🦑 Si no hay a quién degradar
    else {
        throw '🌊 Taggea a alguien que quieras bajar de admin, desu~';
    }

    // 🦀 Evita tocar al dueño del arrecife o al bot
    users = users.filter(u => !(u == ownerGroup || u.includes(conn.user.jid)));

    if (users.length === 0) return m.reply('⚠️ Ningún usuario válido para bajar del rango de admin, glub~');

    for (let user of users) {
        if (user.endsWith("@s.whatsapp.net")) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [user], "demote");
                await m.reply(`🦈✨ Éxito: *${command}* aplicado a @${user.split('@')[0]}.\n> Ha perdido su aleta de admin 🐋`, m.chat, {
                    mentions: [user]
                });
            } catch (e) {
                console.error(e);
                await m.reply(`💢 Falló el *${command}* en @${user.split('@')[0]}...\nQuizás Gura mordió el cable del servidor 🐙`, m.chat, {
                    mentions: [user]
                });
            }
        }
    }
};

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 📌 Info del comando
// ─────────────── ⋆⋅☆⋅⋆
handler.help = ['demote @usuario']; // Baja a un admin de su cargo
handler.tags = ['group', 'owner'];
handler.command = /^(demo?te|\↓)$/i;

handler.group = true;     // Solo en grupo
handler.botAdmin = true;  // El bot debe ser admin
handler.admin = true;     // Solo para admins
handler.fail = null;

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "¡Fuera del trono de coral, admin! glub glub 🐠"
// ─────────────── ⋆⋅☆⋅⋆
